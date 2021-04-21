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

let Discussion = require('../../models/discussions/discussionModel')
let Comment = require('../../models/discussions/commentModel')
let User = require('../../models/users/userModel')
let Admin = require('../../models/users/adminModel')

router.get('/', function(req, res){
  res.redirect('/discussions');
});

router.get('/discussions', async function(req, res){
  let users = User
  let discussionList = await Discussion.getAllDiscussions();
  let userList = await User.getAllUsers();
  let adminList = await Admin.getAllAdmin();

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.render('discussions/discussions.ejs', {
    discussions: discussionList,
    users: userList,
    admin: adminList
  });
});

router.get('/discussions/newDiscussion', function(req, res){
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("discussions/newDiscussion.ejs");
});

router.get('/discussions/discussion/:id', async function(req, res){
  let discussions = await Discussion.getAllDiscussions();
  let id = req.params.id
  let comments = await Comment.getAllPostComments(id)
  console.log(comments)

  let discussion = discussions[id];

  if (discussion) {
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render("discussions/discussion.ejs",{
      discussion: discussion,
      comments: comments
    });
  }else {
    res.status(404);
    res.render("error.ejs");
  }

});

router.post('/discussions/discussion', async function(req, res){

  let d = new Date();
  let curr_month = d.getMonth() + 1
  let curr_date = d.getDate()
  let curr_year = d.getFullYear()
  var date = curr_month + "/" + curr_date + "/" + curr_year

  let discussions = await Discussion.getAllDiscussions();
  let discussionID = Object.keys(discussions).length

  discussionID += 1

  let oneDiscussion = db.collection('discussions').doc(discussionID.toString());
  oneDiscussion.set({
    id: discussionID,
    admin: req.body.admin,
    title: req.body.title.trim(),
    content: req.body.content.trim(),
    creationDate: date
  });

  res.redirect("/discussions");

});

router.get('/discussions/editDiscussion/:id', async function(req, res){
  let discussions = await Discussion.getAllDiscussions();
  let id = req.params.id

  let discussion = discussions[id];

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render("discussions/editDiscussion.ejs", {
    discussion: discussion
  });
});

router.post('/discussions/discussion/:id', function(req, res){
  let postID = req.params.id

  let d = new Date();
  let curr_month = d.getMonth() + 1
  let curr_date = d.getDate()
  let curr_year = d.getFullYear()
  var date = curr_month + "/" + curr_date + "/" + curr_year


  let oneDiscussion = db.collection('discussions').doc(postID);
  oneDiscussion.set({
    id: postID,
    admin: req.body.admin,
    title: req.body.title.trim(),
    content: req.body.content.trim(),
    creationDate: date
  });

  res.redirect("/discussions");

});

router.delete('/discussions/discussion/:id', function(req, res){
  console.log(req.params.id);
  Discussion.deleteDiscussion(req.params.id);
  res.redirect('/discussions');
});

router.post('/discussions/discussion/comment/:blogID', async function(req, res){
  let postID = req.params.blogID

  let d = new Date();
  let curr_month = d.getMonth() + 1
  let curr_date = d.getDate()
  let curr_year = d.getFullYear()
  var date = curr_month + "/" + curr_date + "/" + curr_year

  let comments = await Comment.getAllComments();
  let commentID = Object.keys(comments).length

  commentID += 1

  let oneComment = db.collection('comments').doc(commentID.toString());
  oneComment.set({
    id: commentID,
    postID: postID,
    author: req.body.author,
    content: req.body.content.trim(),
    creationDate: date
  });

  res.redirect("/discussions");

});

router.delete('/discussions/discussion/comment/:commentID', function(req, res){
  console.log(req.params.commentID);
  Comment.deleteComment(req.params.commentID);
  res.redirect('/discussions');
});

module.exports = router
