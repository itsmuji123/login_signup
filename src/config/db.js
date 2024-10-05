const mysql = require('mysql2/promise'); // Use promise-based version

// Create a connection pool
const pool = mysql.createPool({
    host: '127.0.0.1',         // Replace with your MySQL host
    user: 'root',              // Replace with your MySQL username
    password: 'Example@2022#', // Replace with your MySQL password
    database: 'CardsDb',       // Replace with your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Log the pool creation for debugging
pool.getConnection()
    .then((connection) => {
        console.log('Connected to MySQL');
        connection.release(); // Release the connection back to the pool
    })
    .catch((error) => {
        console.error('Error connecting to MySQL:', error);
    });

// Export the pool for use in other files
module.exports = pool;
