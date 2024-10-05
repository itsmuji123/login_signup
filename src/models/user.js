const db = require('../config/db');

class User {
  static create(username, password) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(query, [username, password], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId); 
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
        resolve(results[0]); 
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
        resolve(results[0]);
      });
    });
  }

}

module.exports = User;
