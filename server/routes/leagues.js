var express = require('express');
var admin = require("firebase-admin");
var router = express.Router();

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("leagues");


/* GET leagues listing. */
router.get('/', function(req, res, next) {
    ref.once("value", function(snapshot) {
    //   console.log(snapshot.val());
      res.send(snapshot.val());
    }, function (errorObject) {
      res.send(errorObject);
      console.log("The read failed: " + errorObject.code);
    });
});

/* GET league by id. */
router.get('/:uid', function(req, res, next) {
    if (req.params.uid) {
        ref.orderByKey().equalTo(req.params.uid).once("value", function(snapshot) {
            res.send(snapshot.val());
        }, function (errorObject) {
          res.send(errorObject);
          console.log("The read failed: " + errorObject.code);
        });
    } else {
        res.send({ message: 'Failed to pass in a uid' });
    }
});

module.exports = router;
