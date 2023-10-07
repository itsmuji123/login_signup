const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const check = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middlewares/auth'); // Adjust the path accordingly

console.log(check)

// function myMiddleware(req, res, next) { //  tester
//     // Your middleware logic here
//     next();
//   }

//   // const authenticateToken = (req, res, next) { // middleware for auth
// const authenticateToken = (req,res,next)=>{
//     // Get the JWT token from the request header
//     const token = req.header('Authorization');
//     console.log(token)
  
//     // Check if a token exists
//     if (!token) {
//       console.log('object')
//       return res.status(401).json({ message: 'Authentication required.' });
//     }
  
//     try {
//       // Verify the token
//       const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in your login route
//       console.log('object')
  
//       // Attach user data to the request for subsequent route handlers
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(403).json({ message: 'Invalid token.' });
//     }
//   }
  
// Define routes for user registration and login
router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.post('/jwt_exp', authController.check);
router.post('/jwt_exp', authenticateToken ,authController.check);

module.exports = router; 
 