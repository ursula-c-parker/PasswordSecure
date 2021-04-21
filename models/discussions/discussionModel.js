var fs = require('fs');
let fireAdmin = require("firebase-admin");
let serviceAccount = require("../../config/firebase-config.json");
/*fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});*/
let db = fireAdmin.firestore();

exports.getAllDiscussions = async function() {

  let allDiscussions = {};

  try {
    let discussions = await db.collection('discussions').get();

    for (discussion of discussions.docs) {
      allDiscussions[discussion.id] = discussion.data();
    };
    return allDiscussions;

  } catch (err) {
    console.log('Error getting documents', err);
  }

}

exports.getDiscussion = function(id) {
  var discussionData = exports.getAllDiscussions();
  if (discussionData[id]) return discussionData[id];
}

exports.newDiscussion = function(id, newdiscussion) {
  var discussionData = exports.getAlldiscussions();
  discussionData[id] = newdiscussion;
}

exports.editDiscussion = function(id, discussionData) {
  exports.newDiscussion(id, discussionData)
}

exports.deleteDiscussion = function(id) {
  db.collection("discussions").doc(id).delete()
}
