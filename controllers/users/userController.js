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

let User = require('../../models/users/userModel')

router.get('/users/user/:id', function(req, res){

  db.collection('users').get()
    .then(function(snapshot){
      snapshot.forEach(function(doc){
        if (doc.id == req.params.id) {
          res.status(200);
          res.setHeader('Content-Type', 'text/html')
          res.render("users/user.ejs", {
            user: doc.data()
          })
        }
      });
    })
    .catch(function(err){
      console.log('Error getting documents', err);
    });

});

router.get('/users/login', function(req, res){
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("users/login.ejs");
});

router.post('/users/login/passCheck', async function(req, res){

  let userExists = false
  let adminExists = false
  let isAdmin = false

  let users = await User.getAllUsers();
  var objectValues = Object.values(users);

  for (let i=0; i<objectValues.length; i++) {
    if (objectValues[i].username == req.body.username) {
      userExists = true
      if (objectValues[i].password == req.body.password) {
        console.log("successful")
        res.render("users/loggedIn.ejs", {
          username: objectValues[i].username,
          loggedIn: true,
          isAdmin: isAdmin
        });
      }
    }
  }

  let admin = await User.getAllUsers();
  var adminValues = Object.values(admin);

  if (userExists == false) {
    for (let i=0; i<objectValues.length; i++) {
      if (adminValues[i].username == req.body.username) {
        adminExists = true
        if (adminValues[i].password == req.body.password) {
          isAdmin = true
          console.log("successful")
          res.render("users/loggedIn.ejs", {
            username: adminValues[i].username,
            loggedIn: true,
            isAdmin: isAdmin
          });
        }
      }
    }
  }

});

router.get('/users/signUp', function(req, res){
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("users/signUp.ejs");
});

router.post('/users/user', async function(req, res){

  let users = await User.getAllUsers();
  let userID = Object.keys(users).length

  userID += 1

  let oneUser = db.collection('users').doc(userID.toString());
  oneUser.set({
    id: userID,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    Comments: [],
    points: 0,
    isAdmin: false
  });

  res.redirect("/users/login");

});

module.exports = router
