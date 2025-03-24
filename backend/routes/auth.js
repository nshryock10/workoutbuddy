require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getUserByEmailOrUsername, getUserByEmail, createUser } = require('../queries/userQueries');

const SECRET_KEY = process.env.SECRET_KEY;

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, email, phone, firstName, lastName, sex, birthday, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const existingUser = await getUserByEmailOrUsername(email, username);
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? 'Email already exists' : 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(username, email, phone, firstName, lastName, sex, birthday, hashedPassword);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token, user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Test endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FitnessTracker API!' });
});

module.exports = router;