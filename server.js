const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Database setup
// const db = new sqlite3.Database(':memory:'); // Use ':memory:' for an in-memory database or replace with a file name for persistence
const db = new sqlite3.Database('chatbot.db');

// Initialize the database
db.serialize(() => {
    db.run('CREATE TABLE data (query TEXT, reply TEXT)');
    db.run('INSERT INTO data (query, reply) VALUES (?, ?)', ['hello', 'Hi there! How can I assist you?']);
    db.run('INSERT INTO data (query, reply) VALUES (?, ?)', ['how are you', 'I am just a bot, but I am functioning as expected!']);

});    

// API endpoint
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message.toLowerCase();

    db.get('SELECT reply FROM data WHERE query = ?', [userMessage], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).send({ reply: 'Internal server error.' });
        } else if (row) {
            res.send({ reply: row.reply });
        } else {
            res.send({ reply: 'Sorry, I do not understand that query.' });
        }
    });
});

// app.post('/api/chat', (req, res) => {
//     let userMessage = req.body.message.toLowerCase().trim();
//     userMessage = userMessage.replace(/\s+/g, ' '); // Normalize multiple spaces

//     db.get('SELECT reply FROM data WHERE LOWER(query) = LOWER(?)', [userMessage], (err, row) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send({ reply: 'Internal server error.' });
//         } else if (row) {
//             res.send({ reply: row.reply });
//         } else {
//             res.send({ reply: 'Sorry, I do not understand that query.' });
//         }
//     });
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// const express = require('express');
// const bodyParser = require('body-parser');
// const sqlite3 = require('sqlite3').verbose();
// const cors = require('cors');
// const app = express();
// const port = 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Database setup (file-based)
// const db = new sqlite3.Database('chatbot.db');

// // Initialize the database
// db.serialize(() => {
//     db.run('CREATE TABLE IF NOT EXISTS data (query TEXT, reply TEXT)');
    
//     // Insert data only if it doesn't already exist
//     db.get('SELECT * FROM data WHERE query = ?', ['hello'], (err, row) => {
//         if (!row) {
//             db.run('INSERT INTO data (query, reply) VALUES (?, ?)', ['hello', 'Hi there! How can I assist you?']);
//         }
//     });

//     db.get('SELECT * FROM data WHERE query = ?', ['how are you'], (err, row) => {
//         if (!row) {
//             db.run('INSERT INTO data (query, reply) VALUES (?, ?)', ['how are you', 'I am just a bot, but I am functioning as expected!']);
//         }
//     });

//     db.get('SELECT * FROM data WHERE query = ?', ['what is your name'], (err, row) => {
//         if (!row) {
//             db.run('INSERT INTO data (query, reply) VALUES (?, ?)', ['what is your name', 'I am a chatbot made by Code Krishna']);
//         }
//     });
// });

// // API endpoint
// app.post('/api/chat', (req, res) => {
//     const userMessage = req.body.message.trim().toLowerCase();  // Ensure input is sanitized

//     db.get('SELECT reply FROM data WHERE query LIKE ?', [`%${userMessage}%`], (err, row) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send({ reply: 'Internal server error.' });
//         } else if (row) {
//             res.send({ reply: row.reply });
//         } else {
//             res.send({ reply: 'Sorry, I do not understand that query.' });
//         }
//     });
// });

// // Start the server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
