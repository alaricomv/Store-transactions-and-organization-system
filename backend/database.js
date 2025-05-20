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

export async function getLastTransactions(user_id) {
    const [rows] = await pool.query(
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 3',
        [user_id]
    );
    return rows; // Return all 3 rows, not just the first one
}

export async function getTransactionById(id) {
    const [rows] = await pool.query('SELECT * FROM transactions WHERE id = ?', [id]);
    return rows[0];
}

export async function createTransaction(user_id, total) {
    const [result] = await pool.query('INSERT INTO transactions (user_id, total) VALUES (?, ?)', [user_id, total]);
    const id = result.insertId; // Get the ID of the newly created transaction
    return getTransactionById(id); // Return the newly created transaction
}

export async function getTransactionByUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM transactions WHERE user_id = ?', [user_id]);
    return rows;
}

export async function getTransactionByDate(date,id) {
    const [rows] = await pool.query(
        'SELECT * FROM transactions WHERE date BETWEEN ? AND ? AND user_id = ?',
        [`${date} 00:00:00`, `${date} 23:59:59`, id]
    );
    return rows;
}

export async function deleteTransaction(id) {
    const [result] = await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
    return result.affectedRows > 0; // Return true if a row was deleted
}


// Total transactions functions


export async function getTotalTransactionsbyId(id) {
    const [rows] = await pool.query('SELECT * FROM total_transactions WHERE id = ?', [id]);
    return rows[0];
}

//Total transactions by user ID
export async function getTotalTransactionsbyUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM total_transactions WHERE user_id = ?',[user_id]);
    return rows;
}


// Get transactions by date and user ID
export async function getTotalTransactionByDate(date,id) {
    const [rows] = await pool.query(
        'SELECT * FROM total_transactions WHERE date BETWEEN ? AND ? AND user_id = ?',
        [`${date} 00:00:00`, `${date} 23:59:59`, id]
    );
    return rows;
}

//Total transactions by date and user ID
export async function createTotalTransactions(user_id, date) {
    // Query to calculate the total and count of transactions for the given user and date
    const formattedDate = new Date(date).toISOString().split('T')[0];

    
    const [rows] = await pool.query(
        `SELECT SUM(total) AS total, COUNT(*) AS number_transactions 
         FROM transactions 
         WHERE user_id = ? AND DATE(date) = ?`,
        [user_id, formattedDate]
    );

    const total = rows[0].total || 0; // Default to 0 if no transactions
    const number_transactions = rows[0].number_transactions || 0; // Default to 0 if no transactions

    // Insert the calculated values into the total_transactions table
    const [result] = await pool.query(
        'INSERT INTO total_transactions (user_id, total, date, number_transactions) VALUES (?, ?, ?,?)',
        [user_id, total, date, number_transactions]
    );

    const id = result.insertId; // Get the ID of the newly created record
    return getTotalTransactionsbyId(id); // Return the newly created record
}


// Get the last 3 total transactions for a user
export async function getLastTotalTransactions(user_id) {
    const [rows] = await pool.query(
        'SELECT * FROM total_transactions WHERE user_id = ? ORDER BY date DESC LIMIT 3',
        [user_id]
    );
    return rows; // Return all 3 rows, not just the first one
}

export async function deleteTotalTransaction(id) {
    const [result] = await pool.query('DELETE FROM total_transactions WHERE id = ?', [id]);
    return result.affectedRows > 0; // Return true if a row was deleted
}

const result = await getUsers(); // Call the function to get users
console.log(result); // Output the result of the query