import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: "root",
    password: process.env.DB_PASSWORD || '',
    database: "ecommerce",
    port: Number(process.env.DB_PORT) || 3306,
});

export default pool;
