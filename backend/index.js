const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const movementRoutes = require('./routes/movements'); 
const workoutRoutes = require('./routes/workout') // New 

app.use('/api', authRoutes);
app.use('/api', movementRoutes); // Mount new routes
app.use('/api', workoutRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});