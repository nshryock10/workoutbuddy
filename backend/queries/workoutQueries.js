const pool = require('../db'); // Adjust path to reach db.js

// Fetch all movements with muscle groups
const getAllMovements = async () => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.name, m.description, m.category, m.video_file,
             ARRAY_AGG(mc.muscle) as muscle_groups
      FROM movements m
      LEFT JOIN movement_categories mc ON m.id = mc.movement_id
      GROUP BY m.id, m.name, m.description, m.category, m.video_file
      ORDER BY m.name ASC
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching movements:', error.message);
    throw error;
  }
};

const getAllPrograms = async () => {
  console.log('fetching programs');
  try {
    const result = await pool.query(`SELECT * FROM workout_programs`);
    return result.rows;
  } catch (error) {
    console.error('Error fetching programs:', error.message);
    throw error;
  }
};

const getWorkoutOfTheDay = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM workout_programs WHERE is_workout_of_day = $1`,
      [true]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching workout of the day:', error.message);
    throw error;
  }
};

const getPlannedWorkouts = async () => {
  try {
    console.log('Fetching planned workouts');
    const result = await pool.query(`SELECT * FROM public.planned_workouts`);
    return result.rows;
  } catch (error) {
    console.error('Error fetching planned workouts:', error.message);
    throw error;
  }
};

const createPlannedWorkout = async (
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
) => {
  try {
    console.log('Creating planned workout:', { workout_id, description, planned_set, planned_reps });
    const query = `
      INSERT INTO public.planned_workouts (
        workout_id, description, block_id, movement_id, planned_set, planned_reps,
        equipment_id, planned_rest, notes, user_id, planned_weight
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      workout_id,
      description,
      block_id || null,
      movement_id || null,
      planned_set,
      planned_reps,
      equipment_id || null,
      planned_rest || null,
      notes || null,
      user_id,
      planned_weight || null,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating planned workout:', error.message);
    throw error;
  }
};

module.exports = {
  getAllMovements,
  getAllPrograms,
  getWorkoutOfTheDay,
  getPlannedWorkouts,
  createPlannedWorkout,
};