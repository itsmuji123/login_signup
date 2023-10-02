const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model

// User registration (signup) controller
exports.signup = async (req, res) => {
  try {
    // Extract user input from request body
    const { username, email, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
};

// User login controller
exports.login = async (req, res) => {
  try {
    // Extract user input from request body
    const { email, password } = req.body;
    // email = "muji@gmailc=fdf"
    // password = "dfljnskhjf"
    console.log('email:', email)
    console.log('password: ', password)

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h', // Adjust the expiration time as needed
    });

    // Respond with the token and user data
    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
};
