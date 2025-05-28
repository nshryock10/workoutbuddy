const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv');
const workoutQueries = require('../queries/workoutQueries')

// Load environment variables
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware to get user_id (stub)
const getUserId = (req, res, next) => {
  req.user_id = 1; // TODO: Replace with auth (e.g., JWT)
  next();
};

// GET /api/workout_programs
router.get('/workout_programs', async (req, res) => {
try {
    const programs = await workoutQueries.getAllPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/wod', async (req, res) => {
  try{
    const wod = await workoutQueries.getWorkoutOfTheDay();
    res.json(wod);
  }catch (error){
    res.status(500).json({error: 'Internal server error'})
  }
})

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