import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config(); // Load environment variables from .env file

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


// Users functions

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export async function getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}

export async function getUserVerification(email,password) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if(bcrypt.compareSync(password, rows[0].password)) {
        return rows[0]; // Return the user if password matches
    }
    return null; // Return null if password does not match
}

export async function createUser(company_name, branch_name, password, email) {
    // Check if the email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
        // Email already in use
        throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const [result] = await pool.query(
        'INSERT INTO users (company_name, branch_name, password, email) VALUES (?, ?, ?, ?)',
        [company_name, branch_name, hashedPassword, email]
    );
    const id = result.insertId; // Get the ID of the newly created user
    return getUserById(id); // Return the newly created user
}


// Transactions functions
export async function getTransactions() {
    const [rows] = await pool.query('SELECT * FROM transactions');
    return rows;
}

export async function getLastTransactions(user_id, userTimeZone) {
    console.log(userTimeZone);
  const query = `
    SELECT 
      t.id,
      t.user_id,
      t.total,
      t.deleted,
      CONVERT_TZ(t.date, '+00:00', ?) AS date
    FROM transactions t
    WHERE t.user_id = ? 
      AND t.deleted = 0 
    ORDER BY t.date DESC 
    LIMIT 5
  `;

  const [rows] = await pool.query(query, [userTimeZone, user_id]);
  return rows;
}


export async function getTransactionById(id, userTimeZone) {
  const query = `
    SELECT 
      id,
      user_id,
      total,
      deleted,
      CONVERT_TZ(date, '+00:00', ?) AS date
    FROM transactions 
    WHERE id = ?
  `;
  const [rows] = await pool.query(query, [userTimeZone, id]);
  console.log(rows[0]);
  return rows[0];
}


export async function createTransaction(user_id, total) {
    // Get the current highest increment for this user
    const [rows] = await pool.query(
        "SELECT id FROM transactions WHERE user_id = ? ORDER BY CAST(SUBSTRING_INDEX(id, '-', -1) AS UNSIGNED) DESC LIMIT 1;",
        [user_id]
    );

    let increment = 1;
    if (rows.length > 0) {
        // Extract the incrementing number from the last id
        const lastId = rows[0].id;
        const parts = lastId.split('-');
        if (parts.length === 2 && !isNaN(parts[1])) {
            increment = parseInt(parts[1], 10) + 1;
        }
    }

    const customId = `${user_id}-${increment}`;

    await pool.query(
        'INSERT INTO transactions (id, user_id, total) VALUES (?, ?, ?)',
        [customId, user_id, total]
    );

    return getTransactionById(customId); // Return the newly created transaction
}

export async function getTransactionByUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM transactions WHERE user_id = ?', [user_id]);
    return rows;
}

export async function getTransactionByDate(date, id, userTimeZone) {
  console.log(userTimeZone);
  console.log(date);
  
  const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  const query = `
    SELECT 
      t.id,
      t.user_id,
      t.total,
      t.deleted,
      CONVERT_TZ(t.date, '+00:00', ?) as date
    FROM transactions t
    WHERE CONVERT_TZ(t.date, '+00:00', ?) BETWEEN ? AND ?
      AND t.user_id = ?
    ORDER BY t.date DESC
  `;
  
  const [rows] = await pool.query(query, [
    userTimeZone,
    userTimeZone,
    startOfDay,
    endOfDay,
    id,
  ]);

  console.log(rows);
  
  return rows;
}




export async function deleteTransaction(id) {
    const [result] = await pool.query(
        'UPDATE transactions SET deleted = 1 WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0; // Return true if a row was updated
}


// Total transactions functions
export async function getTotalTransactionsbyId(id, userTimeZone) {
  console.log(userTimeZone);
  const [rows] = await pool.query(
    `SELECT 
       id, 
       user_id, 
       total, 
       CONVERT_TZ(creation_date, '+00:00', ?) AS creation_date, 
       date, 
       number_transactions 
     FROM total_transactions 
     WHERE id = ?`,
    [userTimeZone, id]
  );
  console.log(rows[0]);
  return rows[0];
}


//Total transactions by user ID
export async function getTotalTransactionsbyUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM total_transactions WHERE user_id = ?',[user_id]);
    return rows;
}


// Get transactions by date and user ID
export async function getTotalTransactionByDate(date, id, userTimeZone) {
    console.log(userTimeZone);
  const [rows] = await pool.query(
    `SELECT 
        *,
        CONVERT_TZ(creation_date, '+00:00', ?) AS creation_date
     FROM total_transactions 
     WHERE date BETWEEN ? AND ? 
       AND user_id = ? 
     ORDER BY creation_date DESC`,
    [
      userTimeZone,
      `${date} 00:00:00`,
      `${date} 23:59:59`,
      id,
    ]
  );
  console.log(rows);
  return rows;
}


//Total transactions by date and user ID
export async function createTotalTransactions(user_id, date, userTimeZone) {
  // Format the provided date to a YYYY-MM-DD string.
  // This string should represent the local date according to the user's timezone.
  const formattedDate = new Date(date).toISOString().split('T')[0];

  
  // We convert the UTC stored date using CONVERT_TZ() and then extract the date.
  const [rows] = await pool.query(
    `SELECT SUM(total) AS total, COUNT(*) AS number_transactions 
     FROM transactions 
     WHERE user_id = ? 
       AND DATE(CONVERT_TZ(date, '+00:00', ?)) = ? 
       AND deleted = 0`,
    [user_id, userTimeZone, formattedDate]
  );

  const total = rows[0].total || 0;               // Default to 0 if no transactions
  const number_transactions = rows[0].number_transactions || 0;  // Default to 0 if no transactions

  // Get the current highest increment for this user in the total_transactions table
  const [idRows] = await pool.query(
    "SELECT id FROM total_transactions WHERE user_id = ? ORDER BY CAST(SUBSTRING_INDEX(id, '-', -1) AS UNSIGNED) DESC LIMIT 1;",
    [user_id]
  );

  let increment = 1;
  if (idRows.length > 0) {
    // Extract the incrementing number from the last custom id
    const lastId = idRows[0].id;
    const parts = lastId.split('-');
    if (parts.length === 2 && !isNaN(parts[1])) {
      increment = parseInt(parts[1], 10) + 1;
    }
  }
  const customId = `${user_id}-${increment}`;

  // Insert the calculated values into the total_transactions table with the custom id  
  // Use STR_TO_DATE() as before for proper date format conversion.
  await pool.query(
    'INSERT INTO total_transactions (id, user_id, total, date, number_transactions) VALUES (?, ?, ?, STR_TO_DATE(?, "%Y-%m-%dT%H:%i:%s.%fZ"), ?)',
    [customId, user_id, total, date, number_transactions]
  );

  // Return the newly created record by its custom id
  return getTotalTransactionsbyId(customId);
}



// Get the last 3 total transactions for a user
export async function getLastTotalTransactions(user_id, userTimeZone) {
    console.log
  const [rows] = await pool.query(
    `SELECT 
        id,
        user_id,
        total,
        CONVERT_TZ(creation_date, '+00:00', ?) AS creation_date,
        date,
        number_transactions
     FROM total_transactions
     WHERE user_id = ? 
     ORDER BY creation_date DESC 
     LIMIT 5`,
    [userTimeZone, user_id]
  );
  console.log(rows);
  return rows; // Return all 5 rows
}


export async function deleteTotalTransaction(id) {
    const [result] = await pool.query('DELETE FROM total_transactions WHERE id = ?', [id]);
    return result.affectedRows > 0; // Return true if a row was deleted
}
