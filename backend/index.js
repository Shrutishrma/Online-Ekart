require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: { rejectUnauthorized: true }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to TiDB MySQL Database');
        // Create PRODUCTS table for Ekart
        const sql = `CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            description TEXT
        )`;
        db.query(sql, (err) => {
            if (err) console.error('Table creation failed:', err);
            else console.log('✅ Products table ready');
        });
    }
});

// --- EKART API ROUTES ---

// 1. GET ALL PRODUCTS
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. ADD PRODUCT (Seller)
app.post('/products', (req, res) => {
    const { name, price, description } = req.body;
    const sql = 'INSERT INTO products (name, price, description) VALUES (?, ?, ?)';
    db.query(sql, [name, price, description], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, name, price, description });
    });
});

// 3. DELETE PRODUCT (Buy/Remove)
app.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Product removed' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Ekart Server running on port ${PORT}`));