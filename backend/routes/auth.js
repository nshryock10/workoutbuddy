const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, addUser, updateUser, getUserResponses } = require('../queries/userQueries');
const { getQuestions, saveUserResponse } = require('../queries/onboarding');

const router = express.Router();
const SECRET_KEY = 'your-secret-key';

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
      birthday,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

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
    const responses = await getUserResponses(user.id);
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        sex: user.sex,
        birthday: user.birthday.toISOString().split('T')[0],
        hasCompletedOnboarding: user.has_completed_onboarding,
        responses,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/complete-onboarding', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await updateUser(email, { has_completed_onboarding: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const responses = await getUserResponses(user.id);
    res.json({
      message: 'Onboarding completed',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        sex: user.sex,
        birthday: user.birthday.toISOString().split('T')[0],
        hasCompletedOnboarding: user.has_completed_onboarding,
        responses,
      },
    });
  } catch (error) {
    console.error('Onboarding completion error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/onboarding-questions', async (req, res) => {
  try {
    const questions = await getQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/save-response', async (req, res) => {
  const { userId, questionId, answerIds } = req.body;
  if (!userId || !questionId || !answerIds) {
    return res.status(400).json({ message: 'User ID, Question ID, and Answer ID(s) are required' });
  }

  try {
    await saveUserResponse(userId, questionId, answerIds);
    res.json({ message: 'Response(s) saved' });
  } catch (error) {
    console.error('Error saving response:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;