// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

// database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

// initialize Express app
const app = express();
// helps app to read JSON
app.use(express.json());

// start the server
app.listen(port, () => {
    console.log('Server running on port ', port);
});

// Example Route: Get all cards
app.get('/allcontacts', async (req, res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const[rows] = await connection.execute('SELECT * FROM contacts');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error for allcards'});
    }
});

// Example Route: Create a new card
app.post('/addcontact', async (req, res) => {
    const { name, phone, email, photo_url } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO contacts (name, phone, email, photo_url) VALUES (?, ?, ?, ?)', [name, phone, email, photo_url]);
        res.status(201).json({ message: 'Contact ' + name + ' added successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add contact ' + name });
    }
});

// Update card
app.post('/updatecontact', async (req, res) => {
    const { id, name, phone, email, photo_url } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('UPDATE contacts SET name=?, phone=?, email=?, photo_url=? WHERE id=?', [name, phone, email, photo_url, id]);
        res.status(201).json({ message: 'Contact ' + id + ' updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update contact ' + id });
    }
});

// Delete card
app.post('/deletecontact', async (req, res) => {
    const { id } = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM contacts WHERE id=?', [id]);
        res.status(201).json({ message: 'Contact ' + id + ' deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete contact ' + id });
    }
});