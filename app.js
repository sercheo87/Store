
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    config=require('./config')(),
    MongoClient = require('mongodb').MongoClient,
    app = express();

//Pages
var Blog=require('./controllers/Blog');
var Contact=require('./controllers/Contact');

// all environments
app.set('views', __dirname + '/templates');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

MongoClient.connect('mongodb://'+ config.mongo.host +':'+config.mongo.port+'/fastdelivery', function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function(req, res, next) {
            req.db = db;
            next();
        };
        
        app.all('/blog', attachDB, function(req, res, next) {
			Blog.run(req, res, next);
		});	
        
		app.all('/contact', attachDB, function(req, res, next) {
			Contact.run(req, res, next);
		});	
        
		app.all('/', attachDB, function(req, res, next) {
			Home.run(req, res, next);
		});	
        
        http.createServer(app).listen(config.port, function(){
          console.log('Express server listening on port ' + config.port);
        });
    }
});
