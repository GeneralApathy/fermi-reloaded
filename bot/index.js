console.log("Bot starting . . . ");
console.log("\t+ Loading modules . . . ");
const nodeogram = require("nodeogram");
const fs = require("fs");
const request = require("request");
const aes = require("aes256");

console.log("\t+ Loading config . . . ");
var config = fs.readFileSync("config.json", "utf8");
var date = new Date();
bot = new nodeogram.Bot(JSON.parse(config).key);

//AES Stuff
var aes_key = JSON.parse(config).aes_password;
///////////////////

bot.init();

console.log("== BOT STARTED ==");

bot.command('start', 'Starta il bot', false, function(args, message){

    message.reply("<b>Benvenuto!</b>\nQuesto è il bot di Telegram ufficiale per gli studenti della scuola Enrico Fermi di Modena!\n\n<b>Comandi:</b>\n/registrami username password -> Dà l'accesso al bot, <b>comando obbligatorio</b>\n/voti -> Restituisce i voti sul registro\n/verifiche -> Restituisce il calendario verifiche\n\nIl bot è stato sviluppato da Emiliano Maccaferri (@GeneralApathy), il codice sorgente può essere trovato su https://github.com/GeneralApathy/fermi-bot", {parse_mode: 'HTML'});

});

bot.command('registrami', 'Registrati al bot!', false, function(args, message){

    var data = [];

    if(args[0] && args[1]){
        if(args[2]){

            username = args[0] + ' ' + args[1];
            password = args[2];

        }else{

            username = args[0];
            password = args[1];

        }

        data.push({'username': username, 'password': aes.encrypt(aes_key, password)});

        fs.stat('data/' + message.from.id + '.json', function(err, found){

            if(err){

                fs.writeFile('data/' + message.from.id + '.json', JSON.stringify(data), function(err){

                    if(!err){

                        message.reply("Ti sei registrato correttamente!");
                        console.log('[' + date + '] ' + message.from.username + ' has been registered!');

                    }else{

                        message.reply("Errore: " + err);

                    }

                });

            }else{

                return message.reply("Sei già registrato!");

            }

        });

    }

});

bot.command('voti', 'Comando per ottenere i voti', false, function(args, message){

    console.log('[' + date + '] ' + message.from.username + ' is trying to get grades');

    fs.stat('data/' + message.from.id + '.json', function(err, found){

        if(err){

            return message.reply("Devi ancora registrarti! Fai /registrami username password");

        }

        if(!err){

            fs.readFile('data/' + message.from.id + '.json', 'utf8', function(err, data){

                var json = JSON.parse(data);
                var toSend = '';

                /*
                    The system is unsafe on the server-side, I didn't make it :)
                    Password are unhashed and HTTP-transmitted.
                    Poor little passwords...
                */

                request.post('https://api.emilianomaccaferri.com/grades', {form:{username: json[0].username, password: aes.decrypt(aes_key, json[0].password), key: JSON.parse(config).api_key}}, function(err, resp, grades){

                    grades = JSON.parse(grades);

                    if(err)
                        return message.reply('<b>' + err + '</b>', {parse_mode: 'HTML'});

                    if(grades.error){

                        return message.reply('<b>' + grades.error + '</b>', {parse_mode: 'HTML'});

                    }

                    for(obj in grades){

                        toSend += '<b>' + grades[obj].subject + '</b>: ' + grades[obj].grade + '\n';

                    }

                   message.reply(toSend, {parse_mode: 'HTML'});

                });

            });

        }

    });

});


bot.command('verifiche', 'Comando per ottenere le verifiche', false, function(args, message){

    console.log('[' + date + '] ' + message.from.username + ' is trying to get tests');

    fs.stat('data/' + message.from.id + '.json', function(err, found){

        if(err){

            return message.reply("Devi ancora registrarti! Fai /registrami username password");

        }

        if(!err){

            fs.readFile('data/' + message.from.id + '.json', 'utf8', function(err, data){

                var json = JSON.parse(data);
                var toSend = '';

                /*
                    The system is unsafe on the server-side, I didn't make it :)
                    Password are unhashed and HTTP-transmitted.
                    Poor little passwords...
                */

                request.post('https://api.emilianomaccaferri.com/tests', {form:{username:json[0].username, password: aes.decrypt(aes_key, json[0].password), key: JSON.parse(config).api_key}}, function(err, resp, tests){

                    tests = JSON.parse(tests);

                    if(err)
                        return message.reply('<b>' + err + '</b>', {parse_mode: 'HTML'});

                    if(tests.error){

                        return message.reply('<b>' + tests.error + '</b>', {parse_mode: 'HTML'});

                    }

                    for(obj in tests){

                        if(tests[obj].data == " DATA "){

                            toSend = '';

                        }else
                        toSend += '<b>' + tests[obj].subject + '</b> - ' + tests[obj].data + ' - ' + tests[obj].type + "\n";

                    }

                   message.reply(toSend, {parse_mode: 'HTML'});

                });

            });

        }

    });

});
