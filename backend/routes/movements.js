const express = require('express');
const router = express.Router();
const movementQueries = require('../queries/workoutQueries'); // Adjust path

// Get all movements with muscle groups
router.get('/movements', async (req, res) => {
  try {
    const movements = await movementQueries.getAllMovements();
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;