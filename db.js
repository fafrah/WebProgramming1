
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1Orange@',
    database: 'website_db'
});

connection.connect((err) => {
    if (err) {
        console.log('Connection failed:', err.message);
        return;
    }

    console.log('Connected to MySQL successfully!');

    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.log('Query failed:', err.message);
            connection.end();
            return;
        }

        console.log('Users in the database:');
        console.table(results);

        connection.end();
    });
});
