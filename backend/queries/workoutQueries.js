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
    throw error; // Let the route handle the error response
  }
};

const getAllPrograms = async () => {

  console.log('fetching programs')

  try {
    const result = await pool.query(`SELECT * FROM workout_programs`);
    return result.rows;
  } catch (error) {
    console.error('Error fetching programs:', error.message);
    throw error; // Let the route handle the error response
  }
}

const getWorkoutOfTheDay = async () => {
  try {
    const result = await pool.query(
      `SELECT * FROM workout_programs WHERE is_workout_of_day = $1`,
      [true]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching workout of the day:', error.message);
    throw error; // Let the route handle the error response
  }
};

module.exports = {
  getAllMovements,
  getAllPrograms,
  getWorkoutOfTheDay
};