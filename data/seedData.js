let fs = require('fs');
let fireAdmin = require("firebase-admin");
let serviceAccount = require("../config/firebase-config.json");
fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});
let db = fireAdmin.firestore();

let admin = JSON.parse(fs.readFileSync('admin.json'));
let comments = JSON.parse(fs.readFileSync('comments.json'));
let discussions = JSON.parse(fs.readFileSync('discussions.json'));
let users = JSON.parse(fs.readFileSync('users.json'));

for (id in admin) {
  let adminUser = admin[id]
  adminUser.id = id
  let oneAdmin = db.collection('admin').doc('id');
  oneAdmin.set({
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    Comments: adminUser.Comments,
    Discussions: adminUser.Discussions,
    points: adminUser.points,
    isAdmin: true
  });
}

for (id in comments) {
  let comment = comments[id]
  comment.id = id
  let oneComment = db.collection('comments').doc(id);
  oneComment.set({
    id: comment.id,
    postID: comment.postID,
    author: comment.author,
    content: comment.content,
    creationDate: comment.creationDate
  });
}

for (id in discussions) {
  let discussion = discussions[id]
  discussion.id = id
  let oneDiscussion = db.collection('discussions').doc(id);
  oneDiscussion.set({
    id: discussion.id,
    admin: discussion.admin,
    title: discussion.title,
    content: discussion.content,
    creationDate: discussion.creationDate
  });
}

for (id in users) {
  let user = users[id]
  user.id = id
  let oneUser = db.collection('users').doc(id);
  oneUser.set({
    id: user.id,
    username: user.username,
    email: user.email,
    Comments: user.Comments,
    points: user.points,
    isAdmin: false
  });
}
