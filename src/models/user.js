const db = require('../config/db'); // Import the MySQL connection

// User model for interacting with the MySQL database
class User {
  static create(username, password) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(query, [username, password], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId); // Return the ID of the newly created user
      });
    });
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]); // Return the user object
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      db.query(query, [id], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]); // Return the user object
      });
    });
  }

  // Additional methods for updating, deleting, etc. can be added here
}

module.exports = User;
