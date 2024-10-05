const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Use the pool from your config

// User signup controller
exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if a user with the same username already exists
        const [existingUser] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

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
        const { username, password } = req.body;
        console.log(username, password);

        // Find the user by username
        const [results] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = results[0]; // Get the first result

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        // Create the token with a 1-hour expiration time
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', {
            expiresIn: '1h',
        });

        // Respond with the token and user data
        res.status(200).json({ token, userId: user.id, username: user.username });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'An error occurred while logging in.' });
    }
};

// Token check controller
exports.check = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        // If the token is valid, consider the user authenticated
        res.status(200).json({ message: 'Authenticated', user: req.user });
    } catch (error) {
        console.error('Error during token check:', error);
        res.status(500).json({ message: 'An error occurred while checking the token.' });
    }
};
