const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const { log } = require('console');

// User registration (signup) controller
exports.signup = async (req, res) => {
    // console.log('object')
  try {
    // Extract user input from request body
    const { username, email, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email }); 
    const existingUser1 = await User.findOne({ username }); 

    if (existingUser) {
        console.log('User with this email already exists.')
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    if (existingUser1) {
        return res.status(400).json({ message: 'User with this username already exists.' });
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

    // const expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 100); // 100 years in seconds

// Create the token with the distant future expiration time
const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
  expiresIn: '1h',
});

    // Respond with the token and user data
    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'An error occurred while logging in.' });
  }
};

// // const authenticateToken = (req, res, next) { // middleware for auth
// const authenticateToken = (req,res,next)=>{
//   // Get the JWT token from the request header
//   const token = req.header('Authorization');

//   // Check if a token exists
//   if (!token) {
//     console.log('object')
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in your login route

//     // Attach user data to the request for subsequent route handlers
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid token.' });
//   }
// }

exports.check = async (req,res) => {
    // Get the JWT token from the request header
  // const token = req.header('Authorization');
  // console.log(token)

  // Check if a token exists
  // if (!token) {
  //   // console.log('object')
  //   return res.status(401).json({ message: 'Authentication required.' });
  // }

  // try {
  //   // Verify the token
  //   console.log('decoded')
  //   const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in your login route
  //   // Attach user data to the request for subsequent route handlers
  //   req.user = decoded;
  //   // next();
  // } catch (error) {
  //   console.log('object')
  //   return res.status(403).json({ message: 'Invalid token.' });
  // }
    // end


    try {
      // The user data (including the "exp" claim) is available in req.user if the token is valid
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }
  
      // Check if the token has expired
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (req.user.exp < currentTimestamp) {
        return res.status(401).json({ message: 'Token has expired.' });
      }
  
      // If the token is valid and not expired, you can consider the user authenticated
      res.status(200).json({ message: 'Authenticated', user: req.user });
    } catch (error) {
      console.error('Error during token check:', error);
      res.status(500).json({ message: 'An error occurred while checking the token.' });
    }
  };


