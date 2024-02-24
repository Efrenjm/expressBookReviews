const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { use } = require('../../../nodejs_PracticeProject_AuthUserMgmt/router/friends.js');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }
    //return res.send(req.session.authorization)
    return res.status(200).send({message: "User successfully logged in"});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  books[isbn].reviews[username] = review;
  return res.send(JSON.stringify(books[isbn],null,4));
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let newReviews = {}
  books[isbn].reviews = books[isbn].reviews
  for (const reviewer of Object.keys(books[isbn].reviews)) {
    if (reviewer != username) {
      newReviews[reviewer] = reviews[reviewer];
    }
  }
  books[isbn].reviews = newReviews;
  return res.send(JSON.stringify(books[isbn],null,4));
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
