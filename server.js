const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Import the cors package

const app = express();
const port = 3000;

// Set up the database connection
const db = mysql.createConnection({
  host: 'mysql116.unoeuro.com',
  user: 'riankristoffersen_com',
  password: 'Klaus1087',
  database: 'riankristoffersen_com_db'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.use(cors({
    origin: ''  // Replace with your actual frontend domain
  }));
  

// API endpoint to get the user's name
app.get('/user', (req, res) => {
  const query = 'SELECT name_user FROM user LIMIT 1';  // Modify the query according to your table structure

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving user');
    } else {
      const name_user = result[0].name_user;
      res.json({ name_user });  // Send the name as a JSON object
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
