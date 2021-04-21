let express = require('express')
let router = express.Router();
let request = require('request');
let fs = require('fs')

let fireAdmin = require("firebase-admin");
let serviceAccount = require("../../config/firebase-config.json");
/*fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});*/
let db = fireAdmin.firestore();

let Admin = require('../../models/users/adminModel')

router.get('/users/admin/:id', function(req, res){

  db.collection('admin').get()
    .then(function(snapshot){
      snapshot.forEach(function(doc){
        if (doc.id == req.params.id) {
          console.log(doc.data());
          res.status(200);
          res.setHeader('Content-Type', 'text/html')
          res.render("users/admin.ejs", {
            admin: doc.data()
          })
        }
      });
    })
    .catch(function(err){
      console.log('Error getting documents', err);
    });
});

module.exports = router
