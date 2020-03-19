const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const generateRandomString = () => {
  return Math.random().toString(36).substring(7);
};

//default users database
const users = { 
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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//root page
app.get("/", (req, res) => {
  res.send("Hello, Tiny App User.")
  // res.redirect("/register");
});

//send user database to urls/new for when you want to shorten a new link
app.get("/urls/new", (req, res) => {
  let userID = req.cookies['user_id']
  let templateVars = { user: users[userID] };
  res.render("urls_new", templateVars);
});

//when you click on the short URL link, redirect to corresponding long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//page shows shortened link, original long link, 
  //and option to update long URL assoc. with short URL
app.get("/urls/:shortURL", (req, res) => {
  let userID = req.cookies['user_id']
  let templateVars = {
    user: users[userID],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render("urls_show", templateVars);
});

//render index page with users database and urls database
app.get("/urls", (req, res) => {
  let userID = req.cookies['user_id']
  let templateVars = {   
    user: users[userID],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});

//render a registration page with users database and urls database
app.get("/register", (req, res) => {
  let userID = req.cookies['user_id']
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
    urlDatabase[shortened] = req.body.longURL;
    res.redirect(`/urls/${shortened}`);
  });

//delete the specified URL pair, redirect to /urls 
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//update url pair with new long URL as entered by client
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

//on login page, create cookie for username/email (?) and password (?) 
  //redirect to /urls when form submitted

//*******************//
//
//I think this for..loop needs to be in the header.
//Just need to send the cookie with template vars? 
//   
app.post("/login", (req, res) => {
  //save the email and password that were entered into variables
  let emailAttempt = req.body.email;
  let passwordAttempt = req.body.password;

  // console.log(emailAttempt, passwordAttempt)

  //use this function to see if the user exists and if the password was correct
  //will return the matching user object if so
  const findUser = (emailEnterd, passwordEntered) => {
    for (x in users) {
      if (users[x].email === emailEnterd && users[x].password === passwordEntered) {
        return users[x];
      }
    }
  };

  if (findUser(emailAttempt, passwordAttempt)) {
    const user = findUser(emailAttempt, passwordAttempt);
    res.cookie("user_id", user.id)
    res.render("urls_index", { user, urls: urlDatabase });
  } else {
    res.send("Error: Incorrect Email or Password.")
  }
});

//when logout button is pressed, clear username cookie and redirect to /urls page
app.post("/logout", (req, res) => {
  res.clearCookie("user_ID");
  res.redirect("/urls");
});

//on /register, when register button is pressed, user id, password, and email are added to users db
  //user id  added as a cookie 
app.post("/register", (req, res) => {
  let userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("user_id", users[userID]);
  res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});