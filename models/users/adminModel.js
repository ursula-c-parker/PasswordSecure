var fs = require('fs');
let fireAdmin = require("firebase-admin");
let serviceAccount = require("../../config/firebase-config.json");
/*fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});*/
let db = fireAdmin.firestore();

exports.getAllAdmin = async function() {
  let allAdmin = {};

  try {
    let admins = await db.collection('admin').get();

    for (admin of admins.docs) {
      allAdmin[admin.id] = admin.data();
    };
    return allAdmin;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}

exports.newAdmin = function(id, newadmin) {
  var adminData = exports.getAllAdmin();
  adminData[id] = newadmin;
}

exports.editAdmin = function(id, adminData) {
  exports.newUser(id, adminData)
}
