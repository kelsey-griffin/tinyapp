# TinyApp
## Authored by: Kelsey Griffin

### A full stack web app built with Node and Express that allows users to shorten long URLs (à la bit.ly)!

Welcome to TinyApp - here you can shorten a URL into a tiny string of letters and numbers. This string can be used to link you to the original long URL through this app.

Want to log out and come back later - no problem! Your short URLs will be saved to your account :D (as long as server is still running).


#### Usage:

Start server with `$ npm start` from the tinyapp directory in your terminal.
Navigate to localhost:8080 in your browser, where you will be greeted with a Welcome page and links to register or login. 

Users register with an email and password, which is hashed to ensure security. The user is given a unique ID which is stored in a cookie session. 

You must be registered and logged in to have fun on TinyApp.
Users can only access, edit, and delete shortened URLs that are attributed to their account.

#### File Paths
- README.md
- package.json
- package-lock.json
- express-server.js (Contains all route handlers)
- helpers.js (Helper functions exported from this file)
- views
 |- partials
   |_ _header.ejs
 |- urls_index.ejs
 |- urls_login.ejs
 |- urls_new.ejs
 |- urls_register.ejs
 |_ urls_show.ejs
- tests
 |_ helpersTest.js (Mocha Chai test for helper functions)



Enjoy!

