const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session'); // Assuming you are using sessions
const bcrypt = require('bcrypt'); // Assuming you are using bcrypt for password hashing

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

// Middleware setup
app.use(cors({
  origin: 'http://riankristoffersen.com',
  credentials: true
}));

app.use(express.json()); // Parse JSON bodies

app.use(session({
  secret: 'your-secret-key', // Use a secure key for your session
  resave: false,
  saveUninitialized: true
}));

// API endpoint to get the user's name
app.get('/user', (req, res) => {
  const query = 'SELECT name_user FROM user LIMIT 1';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving user:', err);
      return res.status(500).send('Error retrieving user');
    }
    if (result.length === 0) {
      return res.status(404).send('No user found');
    }
    const name_user = result[0].name_user;
    res.json({ name_user });
  });
});

// Login route
app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const query = 'SELECT * FROM users WHERE login = ?';
  db.query(query, [login], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid login or password');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).send('Invalid login or password');
    }

    req.session.user = user;
    res.send('Logged in');
  });
});

const authenticate = (req, res, next) => {
  if (!req.session.user) return res.status(401).send('Unauthorized');
  next();
};

app.use(authenticate);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
