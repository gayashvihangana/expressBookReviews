// Get book details based on ISBN using Axios and async/await
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;

    const response = await axios.get("http://localhost:5000/");
    const allBooks = response.data;

    if (allBooks[isbn]) {
      return res.status(200).json(allBooks[isbn]);
    }

    return res.status(404).json({
      message: "Book not found",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving book",
      error: error.message,
    });
  }
});

// Get book details based on author using Axios and Promises
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  axios
    .get("http://localhost:5000/")
    .then((response) => {
      const allBooks = response.data;

      const filteredBooks = Object.keys(allBooks)
        .filter((isbn) => allBooks[isbn].author === author)
        .map((isbn) => ({
          isbn,
          ...allBooks[isbn],
        }));

      if (filteredBooks.length === 0) {
        return res.status(404).json({
          message: "Author not found",
        });
      }

      return res.status(200).json(filteredBooks);
    })
    .catch((error) => {
      return res.status(500).json({
        message: "Error retrieving books",
        error: error.message,
      });
    });
});

// Get all books based on title using Axios and async/await
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;

    const response = await axios.get("http://localhost:5000/");
    const allBooks = response.data;

    const filteredBooks = Object.keys(allBooks)
      .filter((isbn) => allBooks[isbn].title === title)
      .map((isbn) => ({
        isbn,
        ...allBooks[isbn],
      }));

    if (filteredBooks.length === 0) {
      return res.status(404).json({
        message: "Title not found",
      });
    }

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books",
      error: error.message,
    });
  }
});
