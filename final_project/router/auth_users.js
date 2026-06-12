const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
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
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          book["reviews"][reviewer] = review;
          books[isbn] = book;
      }
      return res.status(200).json({
          message: `The review for the book with ISBN ${isbn} has been added/updated.`,
          reviews: books[isbn]["reviews"]
      });
  }
  else{
      return res.status(404).json({ message: "Unable to find this book!" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let reviewer = req.session.authorization['username'];
  let initial_review = books[isbn]["reviews"][reviewer];
  if (initial_review){
      delete books[isbn]["reviews"][reviewer];
      return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
  }
  else{
      return res.status(404).json({ message: "Can't delete, as this review has not been posted by this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
