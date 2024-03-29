const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db'); // Import the MongoDB connection from db.js
// const a = require('./controllers/authController');

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cors());

// Use the authentication routes
// app.use('/check', authenticateToken);

app.use('/api', authRoutes);

// Other middleware and configurations...

// Start the Express app
const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 