const mongoose = require('mongoose');

// MongoDB connection URL (replace with your own)
const mongoURI = 'mongodb://localhost:27017/myNewDb';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a mongoose connection instance
const db = mongoose.connection;

// Event handling for connection success and error
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

module.exports = db;
