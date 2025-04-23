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

export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

export async function getUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
}

export async function createUser(company_name, branch_name, password, email) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const [result] = await pool.query('INSERT INTO users (company_name, branch_name, password, email) VALUES (?, ?, ?, ?)', [company_name, branch_name, hashedPassword, email]);
    const id = result.insertId; // Get the ID of the newly created user
    return getUserById(id); // Return the newly created user
}

const result = await getUsers(); // Call the function to get users
console.log(result); // Output the result of the query