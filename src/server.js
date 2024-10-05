const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db'); 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

app.use('/api', authRoutes);

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
