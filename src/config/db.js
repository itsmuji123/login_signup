const mysql = require('mysql2/promise'); 

const pool = mysql.createPool({
    host: '127.0.0.1',         
    user: 'root',              
    password: 'Example@2022#', 
    database: 'CardsDb',       
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then((connection) => {
        console.log('Connected to MySQL');
        connection.release(); 
    })
    .catch((error) => {
        console.error('Error connecting to MySQL:', error);
    });

module.exports = pool;
