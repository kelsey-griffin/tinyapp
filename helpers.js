//generate a random 6 character string of numbers and letters
const generateRandomString = () => {
  return Math.random().toString(36).substring(7);
};

// use this function to see if the user exists
// will return the matching user object if so
const getUserByEmail = function(email, database) {
  for (let x in database) {
    if (database[x].email === email) return database[x];
  }
};

//function to return urlDatabase object with only urls made by a specified user
const urlsForUser = (id, database) => {
  let filteredObj = database;
  Object.keys(filteredObj).forEach(key => {
    if (filteredObj[key].userID !== id) delete filteredObj[key];
  });
  return filteredObj;
};

module.exports = { 
  getUserByEmail,
  urlsForUser,
  generateRandomString
}