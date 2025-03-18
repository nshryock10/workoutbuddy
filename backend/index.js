const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api', (req, res) => {
    console.log('request')
  res.json({ message: 'We up!' });
  
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});