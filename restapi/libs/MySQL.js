const mysql = require("mysql");
var MySQL = function(database, username, password){

    this.database = database;
    this.username = username;
    this.password = password;
    this.date = new Date();
    self = this;

    this.mysql = mysql.createConnection({

        host: 'localhost',
        user: this.username,
        password: this.password,
        database: this.database

    });

    this.getAPIKey = function(key, callback){

        this.mysql.query('SELECT username FROM users WHERE apikey = ?', [key], function(err, row){

            callback(err, row);

        });

    }

    setInterval(function(){

        self.mysql.query('SHOW DATABASES', function(err, s){});

    }, 5000);

    this.mysql.connect();
    console.log("Succesfully connected to the database");

}

module.exports = MySQL;
