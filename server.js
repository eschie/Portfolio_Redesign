'use strict';

var express = require('express');
var app = express();

var cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    assetmanager = require('assetmanager'),
    expressHbs = require('express-handlebars'),
    MongoClient = require('mongodb').MongoClient,
    mongoose = require('mongoose'),
    assert = require('assert'),
    data = require('./data.json'),
    request = require('request'),
    portfolio = {};

app.set('title','Eschie.info');
app.set('showStackError', true);

app.engine('hbs', expressHbs({
    extname:'hbs', 
    defaultLayout:'main.hbs',
    layoutsDir: 'views/layouts'
}));
app.set('view engine', 'hbs');

app.locals.pretty = true;
app.locals.cache = 'memory';
app.use(cookieParser());
app.use(expressValidator());
app.use(bodyParser.json());

// TODO - set proper static folders
app.use('/app/assets/dist', express.static(__dirname + '/app/assets/dist'));
app.use('/app/assets/dist/js/min', express.static(__dirname + '/app/assets/dist/js/min'));
app.use('/app/assets/src', express.static(__dirname + '/app/assets/src'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(bodyParser.urlencoded({
    extended: true
}));

// TODO - configure dev/prod envs
var assets = assetmanager.process({
    assets: require('./config/assets.json'),
    debug: process.env.NODE_ENV !== 'production',
    webroot: /public\/|packages\//g
});
// var data = assetmanager.process({
//     data: require('./data.json'),
//     debug: process.env.NODE_ENV !== 'production'
// });

app.use(function(req, res, next) {
    var apiKey = "HAUDXxkm0QycI3YE6Ejj1hoVKyZXSywh",
        user = "eschie",
        endpoint = "https://www.behance.net/v2/users/"+user+"/projects?api_key=";
    url = endpoint+apiKey+"&callback=?";
    if (!portfolio.length){
        request.get({url:url,json:true},function(error, response, body){
            if (!error && response.statusCode == 200){
                portfolio = JSON.parse(body.toString().slice(6,-2));
                res.locals.portfolio = portfolio;
                next();
            } else{
                next();
            }
        });
    } else {
        res.locals.portfolio = portfolio;
        next();
    }
});

app.use(function(req, res, next) {
    res.locals.assets = assets;
    res.locals.data = data;
    next();
});

var routes = require('./routes/routes');
routes(app);

// Connection URL
var url = 'mongodb://localhost:27017/';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});

app.set('port', process.env.PORT || 8000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});