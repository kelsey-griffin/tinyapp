const { assert } = require('chai');

const { getUserByEmail, urlsForUser, generateRandomString } = require('../helpers.js');

const testUsers = {
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

const testUrlDb = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "user2RandomID" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "user2RandomID" },
  "4u20Vs": { longURL: "http://www.amazon.com", userID: "userRandomID" }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.deepEqual(user.id, expectedOutput);
  });
  it('should return undefined if we pass an email that is not in out database', () => {
    const user = getUserByEmail("other_user", testUsers);
    assert.equal(user, undefined);
  });
});

describe('urlsForUser', () => {
  it('should return the shorturls that are associated with a given userid', () => {
    let urlsObject = urlsForUser("user2RandomID", testUrlDb);
    assert.deepEqual(Object.keys(urlsObject), ["b2xVn2", "9sm5xK"]);
  });
});

describe('generateRandomString', () => {
  it('should generate a random 6 char string with numbers and letters.', () => {
    assert.equal(generateRandomString().length, 6);
  });
  it('should not repeat strings', () => {
    let string1 = generateRandomString();
    let string2 = generateRandomString();
    assert.notEqual(string1, string2);
  });
});
