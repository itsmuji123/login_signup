const jwt = require('jsonwebtoken');

// Define the authenticateToken middleware
const authenticateToken = (req, res, next) => {
  // Get the JWT token from the request header
  const token = req.header('Authorization');

  // Check if a token exists
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in your login route

    // Attach user data to the request for subsequent route handlers
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Export the middleware so that it can be used in other parts of your application
module.exports = authenticateToken;
