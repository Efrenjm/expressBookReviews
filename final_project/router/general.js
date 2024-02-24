const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  return userswithsamename.length > 0;
}
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  let retrievedBooks = new Promise((resolve,reject) => {
    setTimeout(()=>{
      resolve(JSON.stringify(books,null,4))
    })
  })
  result = await retrievedBooks
  return res.send(result)
  //return res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn

  let retrievedBooks = new Promise((resolve,reject) => {
    setTimeout(()=>{
      if (Object.keys(books).includes(isbn)) {
        resolve(JSON.stringify(books[isbn],null,4))
      } else {
        resolve({message: "The book is not available."})
      }
    })
  })
  result = await retrievedBooks
  return res.send(result)
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  let retrievedBooks = new Promise((resolve,reject) => {
    setTimeout(()=>{
      const result = {}
      for (isbn of Object.keys(books)) {
        if (books[isbn].author === author) {
          result[isbn] = books[isbn]
        }
      }
      resolve(result)
    })
  })
  const result = await retrievedBooks
  return res.send(result)
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  let retrievedBooks = new Promise((resolve,reject) => {
    setTimeout(()=>{
      let result = {}
      for (const isbn of Object.keys(books)) {
        if (books[isbn].title === title) {
          result[isbn] = books[isbn]
        }
      }
      resolve(result)
    })
  })
  const result = await retrievedBooks
  return res.send(result)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  if (Object.keys(books).includes(isbn)) {
    return res.send(JSON.stringify(books[isbn].reviews,null,4))
  } else {
    return res.send({message: "The book is not available."})
  }
});

module.exports.general = public_users;
