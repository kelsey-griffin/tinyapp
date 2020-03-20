const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['user_id'],
}));

const generateRandomString = () => {
  return Math.random().toString(36).substring(7);
};

//default users database
const users = {
  "abc": {
    id: "abc",
    email: "a@a.com",
    password: "1234"
  },
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
//default URL database
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "abc" }
};

//use this function to see if the user exists
//will return the matching user object if so
const findUser = (emailEntered) => {
  for (let x in users) {
    if (users[x].email === emailEntered) return users[x];
  }
};

//function to return urlDatabase object with only urls made by a specified user
const urlsForUser = (userID) => {
  let filteredObj = urlDatabase;
  Object.keys(filteredObj).forEach(key => {
    if (filteredObj[key].userID !== userID) delete filteredObj[key];
  });
  return filteredObj;
};

///////////////////////
//begin routes
//////////////////////

//root page
app.get("/", (req, res) => {
  res.send("Hello, Tiny App User.");
});

//send user database to urls/new for when you want to shorten a new link
app.get("/urls/new", (req, res) => {
  let userID = req.session.user_id;
  if (findUser(users[userID].email)) {
    let templateVars = { user: users[userID], urls: urlDatabase };
    res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

//when you click on the short URL link, redirect to corresponding long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//page shows shortened link, original long link,
//and option to update long URL assoc. with short URL
app.get("/urls/:shortURL", (req, res) => {
  let userID = req.session.user_id;
  //if the user is logged in and the shortURL is attributed to the user, render the page. Otherwise, redirect.
  let shortURL = req.params.shortURL;
  if (userID && urlDatabase[shortURL].userID === userID) {
    let templateVars = {
      user: users[userID],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL
    };
    res.render("urls_show", templateVars);
    return;
  } else if (userID && urlDatabase[shortURL].userID !== userID) {
    res.status(403).send("Access Denied: Private URL");
    return;
  }
  res.redirect("/login");
});

//render index page with users database and urls database
app.get("/urls", (req, res) => {
  let userID = req.session.user_id;
  //if logged in (i.e. there is a user_id cookie) continue to urls site
  if (userID) {
    let filteredURLs = urlsForUser(userID) //use function to filter the urls by user
    let templateVars = {
      user: users[userID],
      urls: filteredURLs,
    };
    res.render("urls_index", templateVars);
    return;
  }
  //if not logged in, redirect to the login page
  res.redirect("/login");
});

//render login page
app.get("/login", (req, res) => {
  let userID = req.session.user_id;
  let templateVars = {
    user: users[userID],
    urls: urlDatabase
  };
  res.render("urls_login", templateVars);
});

//render a registration page with users database and urls database
app.get("/register", (req, res) => {
  let userID = req.session.user_id;
  let templateVars = {
    user: users[userID],
    urls: urlDatabase
  };
  res.render("urls_register", templateVars);
});

//add new shortened URL and corresponding long URL to URL database
//redirect to short URL specific page
app.post("/urls", (req, res) => {
  let shortened = generateRandomString();
  let userID = req.session.user_id;

  urlDatabase[shortened] = {
    longURL: req.body.longURL,
    userID: userID
  };
  res.redirect(`/urls/${shortened}`);
});

//if logged in and specified url is attributed to this userID, delete the specified URL pair, redirect to /urls
app.post("/urls/:shortURL/delete", (req, res) => {
  let userID = req.session.user_id;

  if (userID && Object.keys(urlsForUser(userID)).includes(req.params.shortURL)) { 
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
    return;
  };
  res.status(403).redirect("/urls");
});

//update url pair with new long URL as entered by client
app.post("/urls/:shortURL", (req, res) => {
  let userID = req.session.user_id;

  if (userID && Object.keys(urlsForUser(userID)).includes(req.params.shortURL)) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect("/urls");
    return;
  }
  res.status(403).redirect("/urls");
});

//when login button is pressed on header, validate email and password
//if valid, continue to /urls, logged in. otherwise return error.
app.post("/login", (req, res) => {
  //save the email and password that were entered into variables
  let emailAttempt = req.body.email;
  let passwordAttempt = req.body.password;

  //if either email or password form is empty, send a 400 error with message.
  if (!(emailAttempt || passwordAttempt)) res.status(400).send("Please enter an email and password.");
  
  //if the user is found, set cookie to that user and render urls page with it
  //if email not found in list or password doesn't match, error message sent.
  const user = findUser(emailAttempt);
    
  if (findUser(emailAttempt)) {
    const user = findUser(emailAttempt);
    
    if (bcrypt.compareSync(passwordAttempt, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
      return;
    }
  }
  //if the user isn't found or the password doesn't match
  res.status(403).send("Incorrect Email or Password. If you are new here, please register first!");

});

//when logout button is pressed, clear user_id cookie and redirect to /urls page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//on /register, when register button is pressed, user id, password, and email are added to users db
//user id  added as a cookie
app.post("/register", (req, res) => {
  let userID = generateRandomString();
  
  if (!(req.body.email || req.body.password)) res.status(403).send("Please enter an email and password.");
  if (findUser(req.body.email)) res.status(403).send("This email is already registered!");
  
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[userID] = {
    id: userID,
    email: req.body.email,
    password: hashedPassword,
  };
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});