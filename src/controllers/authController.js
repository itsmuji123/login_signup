const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [existingUser] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'An error occurred while registering the user.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);

        const [results] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = results[0]; 

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        const token = jwt.sign({ userId: user.id }, 'your-secret-key', {
            expiresIn: '1h',
        });

        res.status(200).json({ token, userId: user.id, username: user.username });
    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ message: 'An error occurred while logging in.' });
    }
};

exports.check = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        res.status(200).json({ message: 'Authenticated', user: req.user });
    } catch (error) {
        console.error('Error during token check:', error);
        res.status(500).json({ message: 'An error occurred while checking the token.' });
    }
};
