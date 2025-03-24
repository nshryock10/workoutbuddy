const pool = require('../db');

// Check if a user exists by email or username
const getUserByEmailOrUsername = async (email, username) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    return result.rows[0]; // Return user object or undefined
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// Get user by email (for login)
const getUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error fetching user by email: ${error.message}`);
  }
};

// Create a new user
const createUser = async (username, email, phone, firstName, lastName, sex, birthday, hashedPassword) => {
  try {
    await pool.query(
      'INSERT INTO users (username, email, phone, first_name, last_name, sex, birthday, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [username, email, phone, firstName, lastName, sex, birthday, hashedPassword]
    );
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

module.exports = {
  getUserByEmailOrUsername,
  getUserByEmail,
  createUser,
};