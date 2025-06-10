const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv');
const workoutQueries = require('../queries/workoutQueries');

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
    console.error('Error fetching workout programs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/wod
router.get('/wod', async (req, res) => {
  try {
    const wod = await workoutQueries.getWorkoutOfTheDay();
    res.json(wod);
  } catch (error) {
    console.error('Error fetching WOD:', error);
    res.status(500).json({ error: 'Internal server error' });
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

router.get('/planned_workouts', async (req, res) => {
  console.log('getting workouts');
  try {
    const plannedworkouts = await workoutQueries.getPlannedWorkouts();
    res.json(plannedworkouts);
  } catch (error) {
    console.error('Error fetching planned workouts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/planned_workouts
router.post('/planned_workouts', getUserId, async (req, res) => {
  try {
    const { workout_id, program_id, movements } = req.body;
    const user_id = req.user_id;
    console.log('Received payload:', JSON.stringify(req.body, null, 2));
    console.log('Database config:', {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    if (!workout_id || !movements || !Array.isArray(movements)) {
      console.error('Validation error: Missing or invalid workout_id or movements');
      return res.status(400).json({ message: 'Invalid request: workout_id and movements array required' });
    }

    if (movements.length === 0) {
      console.error('Validation error: Movements array is empty');
      return res.status(400).json({ message: 'Movements array cannot be empty' });
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
          planned_set,
          planned_reps,
          equipment_id,
          planned_rest,
          notes,
          planned_weight,
        } = movement;

        if (!description || planned_set == null || planned_reps == null) {
          console.error('Validation error: Missing required movement fields', movement);
          return res.status(400).json({ message: 'Each movement must have description, planned_set, and planned_reps' });
        }

        const result = await workoutQueries.createPlannedWorkout(
          workout_id,
          description,
          block_id,
          movement_id,
          planned_set,
          planned_reps,
          equipment_id,
          planned_rest,
          notes,
          user_id,
          planned_weight
        );
        inserted.push(result);
      }
      await client.query('COMMIT');
      console.log('Workout saved successfully:', workout_id);
      res.status(200).json(inserted);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to save workout', details: error.message });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating planned workouts:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;