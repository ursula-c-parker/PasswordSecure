var fs = require('fs');
let fireAdmin = require("firebase-admin");
let serviceAccount = require("../../config/firebase-config.json");
/*fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});*/
let db = fireAdmin.firestore();

exports.getAllUsers = async function() {
  let allUsers = {};

  try {
    let users = await db.collection('users').get();

    for (user of users.docs) {
      allUsers[user.id] = user.data();
    };
    return allUsers;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}

exports.newUser = function(id, newuser) {
  var userData = exports.getAllUsers();
  userData[id] = newuser;
}

exports.editUser = function(id, userData) {
  exports.newUser(id, userData)
}
