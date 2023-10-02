const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
// const cors = require('cors')

// app.use(cors)

// Other middleware and configurations...

// Use the authentication routes
app.use('/api', authRoutes);

// Start the Express app
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
