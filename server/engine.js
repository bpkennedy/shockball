var admin = require("firebase-admin");
var _ = require("lodash");
var CronJob = require("cron").CronJob;

var db = admin.database();
var dbRoot = db.ref();
var matchesRef = db.ref("matches");
var eventsRef = db.ref("events");
var presenceRef = db.ref("presence/app");
var playerSubmissions = db.ref("playerSubmissions");
var matches = [];

var count = 1;

function initializeEngine() {
    setPresenceAtStartup();
    trackPresence();
    setMatchesListener();
}

new CronJob('*/5 * * * * *', function() {

}, null, true, 'America/Chicago');

function setMatchesListener() {
    // This listens to the matches document in firebase for any changes/adds/deletes and returns the whole document
    matchesRef.on("value", function(snapshot) {
        matches = _.values(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function setPresenceAtStartup() {
    presenceRef.set(true);
}

function trackPresence() {
    dbRoot.on('value', function(snapshot) {
      if (snapshot.val()) {
        presenceRef.onDisconnect().set(false);
        presenceRef.set(true);
    } else {
        presenceRef.set(false);
    }
    });
}

function processEvent(event) {
    if (event.type === 'player submitted') {
        playerSubmissions.push().set(event);
    }
}

initializeEngine();

module.exports = {
    processEvent: processEvent
};
