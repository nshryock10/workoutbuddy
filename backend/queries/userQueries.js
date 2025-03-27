const pool = require('../db');

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const addUser = async (user) => {
  const { username, email, password, phone, first_name, last_name, sex, birthday } = user;
  const result = await pool.query(
    'INSERT INTO users (username, email, password, phone, first_name, last_name, sex, birthday) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [username, email, password, phone, first_name, last_name, sex, birthday]
  );
  return result.rows[0];
};

const updateUser = async (email, updates) => {
  const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
  const values = Object.values(updates);
  const result = await pool.query(
    `UPDATE users SET ${fields} WHERE email = $1 RETURNING *`,
    [email, ...values]
  );
  return result.rows[0];
};

const getUserResponses = async (userId) => {
    const result = await pool.query(
      'SELECT ur.*, o.option FROM user_responses ur JOIN response_options o ON ur.answer_id = o.id WHERE ur.user_id = $1',
      [userId]
    );
    return result.rows;
  };
  
  module.exports = { getUserByEmail, addUser, updateUser, getUserResponses };