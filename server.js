'use strict';

var express = require('express');
var app = express();

var cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    assetmanager = require('assetmanager'),
    expressHbs = require('express-handlebars');

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

app.use('/app/assets/dist', express.static(__dirname + '/app/assets/dist'));
app.use('/app/assets/src', express.static(__dirname + '/app/assets/src'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.use(bodyParser.urlencoded({
    extended: true
}));

var assets = assetmanager.process({
    assets: require('./app/config/assets.json'),
    debug: process.env.NODE_ENV !== 'production',
    webroot: /public\/|packages\//g
});

app.use(function(req, res, next) {
    res.locals.assets = assets;
    next();
});

var routes = require('./routes/routes');
routes(app);

app.set('port', process.env.PORT || 8000);
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});