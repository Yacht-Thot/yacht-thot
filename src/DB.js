const mysql = require('mysql2');

const db_config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    multipleStatements: true,
    dateStrings: true,
    charset: 'utf8mb4'
};

var con;

var loadedDB;
function initMySQL() {

    con = mysql.createConnection(db_config);
    con.connect(function (err) {
        if (err) {
            console.log('Error connecting to MySQL Database.. Retrying..', err);
            setTimeout(initMySQL, 2000);
        } else {
            console.log("Connected to MySQL Database: " + process.env.MYSQL_DATABASE)
            if (!loadedDB) {
                loadedDB = true;
            }
        }
    });

    con.on('error', function (err) {

        if (err) {

            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log('Connection Lost... Resetting.');
                initMySQL();
            } else { 
                throw err;

            }
        }

    });
}

initMySQL();

module.exports = {
    con
}