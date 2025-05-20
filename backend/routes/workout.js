const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const workoutQueries = require('../queries/workoutQueries');

const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'fitness_tracker',
  password: 'your_password',
  port: 5432,
});

// Middleware to get user_id (stub)
const getUserId = (req, res, next) => {
  req.user_id = 1; // Replace with auth
  next();
};

// GET /api/workout_programs
router.get('/workout_programs', getUserId, async (req, res) => {
  try {
    const { user_id, is_workout_of_day } = req.query;
    const queryParams = [];
    let query = 'SELECT program_id AS id, program_name, description, is_workout_of_day, public, user_id FROM workout_programs WHERE 1=1';

    if (user_id) {
      query += ` AND user_id = $${queryParams.length + 1}`;
      queryParams.push(parseInt(user_id));
    }
    if (is_workout_of_day === 'true') {
      query += ` AND is_workout_of_day = $${queryParams.length + 1}`;
      queryParams.push(true);
    }

    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching workout programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/movements/search
router.get('/movements/search', getUserId, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.json([]);
    }
    const result = await pool.query(
      'SELECT id, name FROM movements WHERE name ILIKE $1 LIMIT 10',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching movements:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/planned_workouts
router.post('/planned_workouts', getUserId, async (req, res) => {
  try {
    const { workout_id, program_id, movements } = req.body;
    const user_id = req.user_id;
    if (!workout_id || !movements || !Array.isArray(movements)) {
      return res.status(400).json({ message: 'Invalid request: workout_id and movements array required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const inserted = [];
      for (const movement of movements) {
        const {
          description,
          block_id,
          movement_id,
          planned_reps,
          equipment_id,
          planned_rest,
          notes,
        } = movement;
        const result = await client.query(
          'INSERT INTO planned_workouts (workout_id, description, block_id, movement_id, planned_set, planned_reps, equipment_id, planned_rest, notes, user_id) ' +
          'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
          [
            workout_id,
            description || null,
            block_id || null,
            movement_id || null,
            0, // planned_set deprecated
            planned_reps,
            equipment_id || null,
            planned_rest || null,
            notes || null,
            user_id,
          ]
        );
        inserted.push(result.rows[0]);
      }
      await client.query('COMMIT');
      res.status(201).json(inserted);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating planned workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;