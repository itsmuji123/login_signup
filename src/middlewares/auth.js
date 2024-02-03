const jwt = require('jsonwebtoken');
const { User,Admin } = require('../models/user');

// Define the authenticateToken middleware
// const authenticateToken = (req, res, next) => {
//   // Get the JWT token from the request header
//   const token = req.header('Authorization');

//   // Check if a token exists
//   if (!token) {
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
// };

const authenticateToken = async (req, res, next) => {
  try {
    // Get the JWT token from the request header
    const token = req.header('Authorization');
    // console.log(token)

    // Check if a token exists
    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in your login route

    // Find the user by id
    const user = await User.findById(decoded.userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user data to the request for subsequent route handlers
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};



const authenticateAdminToken = async (req, res, next) => {
  try {
    // Get the JWT token from the request header
    const token = req.header('Authorization');

    // Check if a token exists
    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in your login route

    // Find the admin by id
    const admin = await Admin.findById(decoded.adminId);

    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found.' });
    }

    // Attach admin data to the request for subsequent route handlers
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = {authenticateAdminToken, authenticateToken};
