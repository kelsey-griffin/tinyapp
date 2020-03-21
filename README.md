# TinyApp
##### Authored by: Kelsey Griffin ( @kelsey-griffin )
---------------------------------
#### A full stack web app built with Node and Express allowing users to shorten long URLs!

Welcome to TinyApp - here you can shorten a URL into a tiny string of letters and numbers. This string can be used to link you to the original long URL through this app.

Want to log out and come back later - no problem! Your short URLs will be saved to your account :D (as long as server is still running).

Below is an example of what a logged-in user's TinyApp might look like:  
![urls page](https://github.com/kelsey-griffin/tinyapp/blob/master/docs/tinyapp_urlspage_screenshot.png)

### Usage:

##### Getting Started
Install all dependencies using `$ npm install`.
Start server with `$ npm start` from the tinyapp directory in your terminal. You should receive a message in your terminal confirming that the server is running. 
Navigate to localhost:8080 in your browser, where you will be greeted with a Welcome page and links to register or login. 

##### User Permissions
Users register with an email and password, which is hashed to ensure security. The user is given a unique ID which is stored in a cookie session. 

You must be registered and logged in to have fun on TinyApp.
Users can only access, edit, and delete shortened URLs that are attributed to their account.

Were the user to input incorrect email or password, they will be redirected to a new page informing them of the error and offering possible routes forward. Below is a picture of what that might look like:  
![login error page](https://github.com/kelsey-griffin/tinyapp/blob/master/docs/tinyapp_urlspage_screenshot.png)

### Dependencies
- cookie-session
- express
- EJS
- bcrypt
- body-parser

Enjoy!

