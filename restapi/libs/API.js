const express = require("express");
const body = require("body-parser");
const MySQL = require("./MySQL");
const app = express();
const web = require("./WebInterface");
const fs = require("fs");

var config = JSON.parse(fs.readFileSync('config.json'));

var mysql = new MySQL(config.db, config.user, config.password);
var date = new Date();

app.set('trust proxy', false);
app.disable('x-powered-by');
app.use(body.urlencoded({

    extended: true

}));
app.use(body.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var API = function(){

    this.date = new Date();
    app.listen(24500);
    console.log("App listening on 24500");

}

API.prototype.init = function(){

    app.get('/', function(req, res){

        var ip = req.ip;
        console.log(ip);

        res.json({methods: ["grades", "tests"]});

    })

    app.post('/login', function(req, res){

        var password = req.body.password;
        var username = req.body.username;
        var key = req.body.key;

        if(!username && !password){

            return res.json({'error': 'Missing username/password'});

        }

        console.log("[" + date + "] /login request from " + username);

        mysql.getAPIKey(key, function(err, row){

            if(err){

                throw err;

            }else{

                if(row && row.length == 1){

                    web.login(username, password, function(error, logged){

                        if(err){

                            console.log(err);

                        }

                        res.json({'success': logged});

                    })

                }else{

                    grades = {'error': 'Invalid api_key'}
                    res.json(grades);

                }

            }

        });

    });

    app.post('/grades', function(req, res){

        var password = req.body.password;
        var username = req.body.username;
        var key = req.body.key;

        if(!username && !password){

            return res.json({'error': 'Missing username/password'});

        }

        console.log("[" + date + "] /grades request from " + username);

        mysql.getAPIKey(key, function(err, row){

            if(err){

                throw err;

            }else{

                if(row && row.length == 1){

                    web.getGrades(username, password, function(err, grades){

                        if(err){

                            console.log(err);
                            grades = {'error': err};

                        }

                        res.json(grades);

                    });

                }else{

                    grades = {'error': 'Invalid api_key'}
                    res.json(grades);

                }

            }

        });

    });

    app.post('/tests', function(req, res){

        var password = req.body.password;
        var username = req.body.username;
        var key = req.body.key;

        if(!username && !password){

            return res.json({'error': 'Missing username/password'});

        }

        console.log("[" + date + "] /tests request from " + username);

        mysql.getAPIKey(key, function(err, row){

            if(err){

                throw err;

            }else{

                if(row && row.length == 1){

                    web.getTests(username, password, function(err, tests){

                        if(err){

                            console.log(err);
                            tests = {'error': err};

                        }

                        res.json(tests);

                    });

                }else{

                    grades = {'error': 'Invalid api_key'}
                    res.json(tests);

                }

            }

        });

    });

}

module.exports = API;
