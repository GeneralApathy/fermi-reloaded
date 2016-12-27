const request = require("request").defaults({jar: true});
const $ = require("cheerio");

module.exports.login = function(username, password, callback){

    var logged = false;
    var error = '';

    request.post('http://www.fermi.mo.it/~loar/AssenzeVotiStudenti/elabora_PasswordStudenti.php', {form: {'ob_password': password, 'ob_user': username}}, function(err, resp, body){

        if(!err && resp.statusCode == 200){

            var loginBody = $.load(body);
            if(loginBody.html().includes('Utente Non registrato!<br><br>Dati inviati errati!!! ... Rivolgersi alla segreteria della scuola!!!.')){

                error = 'Wrong username/password';
                logged = false;

            }else{

                logged = true;

            }

        }else{

            error = 'HTTP request failed';

        }

        setTimeout(function(){

            //Finally we can callback the results
            callback(error, logged);

        }, 850);

    });

}

module.exports.getGrades = function(username, password, callback){

    var grades = [];
    var error = '';

    //Requesting the login page to get cookies
    request.post('http://www.fermi.mo.it/~loar/AssenzeVotiStudenti/elabora_PasswordStudenti.php', {form: {'ob_password': password, 'ob_user': username}}, function(err, resp, body){

        if(!err && resp.statusCode == 200){

            var loginBody = $.load(body);
            if(loginBody.html().includes('Utente Non registrato!<br><br>Dati inviati errati!!! ... Rivolgersi alla segreteria della scuola!!!.')){

                error = 'Wrong username/password';

            }else{
                //If all goes well we can proceed with the grades collection
                request('http://www.fermi.mo.it/~loar/AssenzeVotiStudenti/VotiStudente1Q.php', function(err, resp, gradesBody){

                    var parsedHTML = $.load(gradesBody);

                    console.log("Request sent");

                    /*
                        CSS is really bad made, so I have to filter every single
                        table
                    */
                    parsedHTML('.TabellaVoti .td_votoInsuff').map(function(i, grade){

                        grade = $(grade);
                        var subject = grade.prev().text();
                        var date = grade.next().text();
                        var type = grade.next().next().text();
                        grades.push({'grade': grade.text(), 'subject': subject, 'date': date, 'type': type});

                    });

                    parsedHTML('.TabellaVoti .td_votoGrave').map(function(i, grade){

                        grade = $(grade);
                        var subject = grade.prev().text();
                        var date = grade.next().text();
                        var type = grade.next().next().text();
                        grades.push({'grade': grade.text(), 'subject': subject, 'date': date, 'type': type});

                    });

                    parsedHTML('.TabellaVoti .td_votoSuff').map(function(i, grade){

                        grade = $(grade);
                        var subject = grade.prev().text();
                        var date = grade.next().text();
                        var type = grade.next().next().text();
                        grades.push({'grade': grade.text(), 'subject': subject, 'date': date, 'type': type});

                    });

                });

            }

        }else{

            error = 'HTTP request failed';

        }

        setTimeout(function(){

            //Finally we can callback the results
            callback(error, grades);

        }, 850);

    });

}

module.exports.getTests = function(username, password, callback){

    var tests = [];
    var error = '';

    request.post('http://www.fermi.mo.it/~loar/AssenzeVotiStudenti/elabora_PasswordStudenti.php', {form: {'ob_password': password, 'ob_user': username}}, function(err, resp, body){

        if(!err && resp.statusCode == 200){

            var loginBody = $.load(body);
            if(loginBody.html().includes('Utente Non registrato!<br><br>Dati inviati errati!!! ... Rivolgersi alla segreteria della scuola!!!.')){

                error = 'Wrong username/password';

            }else{
                //If all goes well we can proceed with the tests collection
                request('http://www.fermi.mo.it/~loar/AssenzeVotiStudenti/elabora_CalendarioProve.php', function(err, resp, t){

                    var parsedHTML = $.load(t);

                    console.log("Request sent");

                    /*
                        CSS is really bad made, nothing to add
                    */

                    parsedHTML('.Tabella .td_Fatto').map(function(i, done){

                        done = $(done);
                        var topic = done.prev().text();
                        var subject = done.prev().prev().text();
                        var type = done.prev().prev().prev().text();
                        var hour = done.prev().prev().prev().prev().text();
                        var date = done.prev().prev().prev().prev().prev().text();

                        if(subject === " MATERIA "){

                            tests.push({});

                        }else
                        tests.push({'data': date, 'hour': hour, 'type': type, 'subject': subject, 'topic': topic, 'status': done.text()});

                    });

                    parsedHTML('.Tabella .td_NonFatto').map(function(i, done){

                        done = $(done);
                        var topic = done.prev().text();
                        var subject = done.prev().prev().text();
                        var type = done.prev().prev().prev().text();
                        var hour = done.prev().prev().prev().prev().text();
                        var date = done.prev().prev().prev().prev().prev().text();
                        tests.push({'data': date, 'hour': hour, 'type': type, 'subject': subject, 'topic': topic, 'status': done.text()});

                    });

                });

            }

        }else{

            error = 'HTTP request failed';

        }

        setTimeout(function(){

            //Finally we can callback the results
            callback(error, tests);

        }, 850);

    });

}
