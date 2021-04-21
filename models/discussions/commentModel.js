var fs = require('fs');
let fireAdmin = require("firebase-admin");
let serviceAccount = require("../../config/firebase-config.json");
/*fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});*/
let db = fireAdmin.firestore();

exports.getAllComments = async function() {
  let allComments = {};

  try {
    let comments = await db.collection('comments').get();

    for (comment of comments.docs) {
      allComments[comment.id] = comment.data();
    };
    return allComments;

  } catch (err) {
    console.log('Error getting documents', err);
  }
}

exports.getAllPostComments = async function(postID) {
  var object = await exports.getAllComments();
  var objectValues = Object.values(object);
  console.log(objectValues[0])

  var array = []

  for (let i=0; i<objectValues.length; i++) {
    if (objectValues[i].postID == postID) {
      array.push(objectValues[i])
    }
  }
  return array
}

exports.newComment = function(id, newcomment) {
  var commentData = exports.getAllComments();
  commentData[id] = newcomment;
}

exports.editComment = function(id, commentData) {
  exports.newComment(id, commentData)
}

exports.deleteComment = function(id) {
  db.collection("comments").doc(id).delete()
}
