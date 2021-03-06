var admin = require("firebase-admin");
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

//GNS GET y'all!!

// var http = require("http");
//
// var options = {
//   "method": "GET",
//   "hostname": "www.swcombine.com",
//   "port": null,
//   // "path": "/ws/v1.0/news/gns/",
//   "path": "/ws/v1.0/news/gnsitem/41577/",
//   "headers": {
//     "accept": "application/json"
//   }
// };
//
// var req = http.request(options, function (res) {
//   var chunks = [];
//
//   res.on("data", function (chunk) {
//     chunks.push(chunk);
//   });
//
//   res.on("end", function () {
//     var body = Buffer.concat(chunks);
//     var data = JSON.parse(body.toString());
//     // console.log(data.news.posts[0]);
//     console.log(data['news-item']);
//   });
// });
//
// req.end();

// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
* Development Settings
*/
if (app.get('env') === 'development') {
    var serviceAccount = require("./swc-shockball-firebase.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://swc-shockball.firebaseio.com"
    });
    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));

    // Error Handling
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
* Production Settings
*/
if (app.get('env') === 'production') {
    admin.initializeApp({
        credential: admin.credential.cert({
            "projectId": process.env.FIREBASE_PROJECT_ID,
            "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
            "privateKey": process.env.FIREBASE_PRIVATE_KEY,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
    // changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

var routes = require('./routes/index');
var users = require('./routes/users');
var teams = require('./routes/teams');
var players = require('./routes/players');
var leagues = require('./routes/leagues');
var contracts = require('./routes/contracts');
var matches = require('./routes/matches');
var events = require('./routes/events');
var divisions = require('./routes/divisions');
var conferences = require('./routes/conferences');


var engine = require('./engine.js');
var queue = require('./queue.js');
var mailer = require('./mailer.js');


app.use('/api/teams', teams);
app.use('/api/players', players);
app.use('/api/leagues', leagues);
app.use('/api/contracts', contracts);
app.use('/api/matches', matches);
app.use('/api/events', events);
app.use('/api/divisions', divisions);
app.use('/api/conferences', conferences);
app.use('/api/users', users);

module.exports = app;
