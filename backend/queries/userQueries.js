const pool = require('../db');

// Check if a user exists by email
const getUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0]; // Return the user object or undefined if not found
  } catch (error) {
    throw new Error(`Error fetching user by email: ${error.message}`);
  }
};

// Create a new user
const createUser = async (email, hashedPassword) => {
  try {
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

module.exports = {
  getUserByEmail,
  createUser,
};