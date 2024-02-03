const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Service, Card, Code, Admin} = require('../models/user'); // Import the User model



// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the admin by email
      const admin = await Admin.findOne({ email });
  
      // Check if the admin exists
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found.' });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password.' });
      }
  
      // Create a token with admin information
      const token = jwt.sign(
        { adminId: admin._id, email: admin.email },
        'your-secret-key',
        { expiresIn: '1h' } 
      );
  
      // Respond with the token
      res.status(200).json({ token });  
  
    } catch (error) {
      console.error('Error during admin login:', error);
      res.status(500).json({ message: 'An error occurred while logging in.' }); 
    }
  };


  // Admin register
  exports.registerAdmin = async (req, res) => {
    try {
      // Predefined values for email and password
      const email = 'admin123';
      const password = 'password123';
  
      // Check if an admin with the provided email already exists
      const existingAdmin = await Admin.findOne({ email });
  
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new admin
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
      });
  
      // Save the admin to the database
      await newAdmin.save();
  
      res.status(201).json({ message: 'Admin registered successfully.' });
  
    } catch (error) {
      console.error('Error registering admin:', error);
      res.status(500).json({ message: 'An error occurred while registering admin.' });
    }
  };
  

  