const mysql = require("mysql");
const bcrypt = require("bcrypt-nodejs");
const random = require("randomstring");
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

        this.mysql.query('SELECT key_name FROM main_keys WHERE apikey = ?', [key], function(err, row){

            callback(err, row);

        });

    }

    this.registerUser = function(username, password, callback){

        this.mysql.query('SELECT userid FROM users WHERE username = ?', [username], function(err, row){

          console.log("Debug");

          if(err)
            callback(null, err, false);

          if(row.length == 1){

            console.log("Existing username.");
            callback('Username già esistente', null, false);

          }else{

            var key = random.generate(32);

            console.log("Proceeding with registration.");
            bcrypt.hash(password, function(err, hashed){

              console.log(hashed);

              /*this.mysql.query("INSERT INTO users (username, apikey, password) VALUES (?,?,?)", [username, key, hashed], function(err, success){

                if(err)
                  return callback(null, err, false);

                if(success){

                  console.log("User %s has been registered", username);
                  return callback(null, null, true);

                }

              });*/

            })

          }

        })

    }

    setInterval(function(){

        self.mysql.query('SHOW DATABASES', function(err, s){});

    }, 5000);

    this.mysql.connect();
    console.log("Succesfully connected to the database");

}

module.exports = MySQL;
