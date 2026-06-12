const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Unable to register user. Username or password is missing." });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN using Axios and async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get('http://localhost:3000/');
    const allBooks = response.data;

    if (allBooks[isbn]) {
      return res.status(200).json(allBooks[isbn]);
    }

    return res.status(404).json({ message: "Book not found" });

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book",
      error: error.message
    });
  }
});


// Get book details based on author using Axios and Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  axios.get('http://localhost:3000/')
    .then((response) => {
      const allBooks = response.data;

      const filteredBooks = Object.keys(allBooks)
        .filter(isbn => allBooks[isbn].author === author)
        .map(isbn => ({
          isbn,
          ...allBooks[isbn]
        }));

      if (filteredBooks.length === 0) {
        return res.status(404).json({ message: "Author not found" });
      }

      return res.status(200).json(filteredBooks);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Error retrieving books",
        error: error.message
      });
    });
});


// Get all books based on title using Axios and async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const response = await axios.get('http://localhost:3000/');
    const allBooks = response.data;

    const filteredBooks = Object.keys(allBooks)
      .filter(isbn => allBooks[isbn].title === title)
      .map(isbn => ({
        isbn,
        ...allBooks[isbn]
      }));

    if (filteredBooks.length === 0) {
      return res.status(404).json({ message: "Title not found" });
    }

    return res.status(200).json(filteredBooks);

  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books",
      error: error.message
    });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]["reviews"]);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;