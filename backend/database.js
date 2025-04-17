import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows;
}

const notes = await getUsers(); // Call the function to get users
console.log(notes); // Output the result of the query