var express = require('express');
var app = express();
var ejs = require('ejs');
var methodOverride = require('method-override');

app.use(express.json());
app.use(express.urlencoded());
app.use(methodOverride('_method'));
app.set('view_engine', 'ejs');
app.use(express.static('public'));

let fireAdmin = require("firebase-admin");
let serviceAccount = require("./config/firebase-config.json");
fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount)
});
let db = fireAdmin.firestore();

app.use(require('./controllers/discussions/discussionController.js'));
app.use(require('./controllers/users/userController.js'));
app.use(require('./controllers/users/adminController.js'));

app.get('/about', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("about.ejs");
});

app.get('/passwordChecker', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("passwordChecker.ejs", {
    results: ""
  });

});

app.get('/passwordChecker/:password', function(request, response) {

  // require the module
  var owasp = require('owasp-password-strength-test');
  var result = owasp.test(request.params.password);

  console.log(result)

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("passwordChecker.ejs", {
    results: result
  });

});

app.get('/siteChecker', function(request, response) {
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render("siteChecker.ejs", {
    results: ""
  });

});


app.get('/siteChecker/:site', function(request, response) {

  let pwned

  const Pwned = require('pwned-api');
  const pwner = new Pwned();
  pwner.breach(request.params.site, (err, results) => {
    console.log(request.params.site);
    if (results) {
      pwned = results
    }else {
      pwned = "Not Pwned"
    }

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render("siteChecker.ejs", {
      results: pwned
    });
  });

});

const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('listening on port:'+port+'!')
});
