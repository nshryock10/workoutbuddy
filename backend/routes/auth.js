require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {getUserByEmail, addUser, updateUser } = require('../queries/userQueries');

const SECRET_KEY = process.env.SECRET_KEY;

// Register endpoint
router.post('/register', async (req, res) => {
  const { username, email, phone, firstName, lastName, sex, birthday, password } = req.body;
  if (!username || !email || !phone || !firstName || !lastName || !sex || !birthday || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await addUser({
      username,
      email,
      password: hashedPassword,
      phone,
      first_name: firstName,
      last_name: lastName,
      sex,
      birthday, // Expects YYYY-MM-DD from frontend
    });

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
    res.json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        sex: user.sex,
        birthday: user.birthday.toISOString().split('T')[0], // Ensure YYYY-MM-DD
        hasCompletedOnboarding: user.has_completed_onboarding,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/complete-onboarding', async (req, res) => {
  const { email } = req.body; // Add JWT auth in production
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await updateUser(email, { has_completed_onboarding: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'Onboarding completed',
      user: {
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        sex: user.sex,
        birthday: user.birthday.toISOString().split('T')[0],
        hasCompletedOnboarding: user.has_completed_onboarding,
      },
    });
  } catch (error) {
    console.error('Onboarding completion error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test endpoint
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the FitnessTracker API!' });
});

module.exports = router;