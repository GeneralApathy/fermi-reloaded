const express = require("express");
//const body = require("body-parser");
const app = express();

/*app.use(body.urlencoded({

    extended: true

}));*/
//app.use(body.json());

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.set('views', __dirname + '/../views');
app.set('view engine', 'twig');
app.use(express.static(__dirname + '/../static'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var Router = function(){

    app.listen(24501);
    console.log("website listening on 24501");

}

Router.prototype.init = function(){

    setInterval(function(){console.log("S")},1000);

    app.get('/', function(req, res){

        res.render('index', {

            title: 'Home'

        });

    });

    app.get('/static/:type/:filename', function(req, res){

        var filename = req.params.filename;
        var type = req.params.type;

        if(filename){
            if(type == 'css'){

                res.sendFile('css/' + filename, {root: './'});
                return true;

            }

        if(type == 'js'){

            res.sendFile('js/' + filename, {root: './'});
            return true;

            }

        }

    });

}

module.exports = Router;
