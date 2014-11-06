'use strict';

/**
 * Module dependencies.
 */

// var compression = require('compression'),
// var morgan = require('morgan'),
// var consolidate = require('consolidate'),
var cookieParser = require('cookie-parser'),
  expressValidator = require('express-validator'),
  bodyParser = require('body-parser'),
  // methodOverride = require('method-override'),
  session = require('express-session'),
  // mongoStore = require('connect-mongo')(session),
  // helpers = require('view-helpers'),
  // flash = require('connect-flash'),
  assetmanager = require('assetmanager');

module.exports = function(app, passport, db) {

  app.set('title','Eschie.info');

  app.set('showStackError', true);

  // Prettify HTML
  app.locals.pretty = true;

  // cache=memory or swig dies in NODE_ENV=production
  app.locals.cache = 'memory';

  // Should be placed before express.static
  // To ensure that all assets and data are compressed (utilize bandwidth)
  // app.use(compression({
  //   // Levels are specified in a range of 0 to 9, where-as 0 is
  //   // no compression and 9 is best compression, but slowest
  //   level: 9
  // }));

  // assign the template engine to .html files
  app.engine('html', consolidate[config.templateEngine]);

  // set .html as the default extension
  // app.set('view engine', 'html');

  // The cookieParser should be above session
  app.use(cookieParser());

  // Request body parsing middleware should be above methodOverride
  app.use(expressValidator());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(methodOverride());

  // Import the assets file and add to locals
  var assets = assetmanager.process({
    assets: require('./assets.json'),
    debug: process.env.NODE_ENV !== 'production',
    webroot: /public\/|packages\//g
  });

  // Add assets to local variables
  app.use(function(req, res, next) {
    res.locals({
        assets: assets
    });
    next();
  });

  // // Express/Mongo session storage
  // app.use(session({
  //   secret: config.sessionSecret,
  //   store: new mongoStore({
  //     db: db.connection.db,
  //     collection: config.sessionCollection
  //   }),
  //   cookie: config.sessionCookie,
  //   name: config.sessionName,
  //   resave: true,
  //   saveUninitialized: true
  // }));

  // Dynamic helpers
  // app.use(helpers(config.app.name));

  // Connect flash for flash messages
  // app.use(flash());
};
