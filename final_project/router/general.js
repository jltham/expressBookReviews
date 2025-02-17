const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        userExists = false;

        for (let user in users) {
            if (user["username"] == username) {
                userExists = true;
                break;
            }
        }

        // Check if the user does not already exist
        if (!userExists) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return new Promise((resolve, reject) => {
        resolve(books);
    })
    .then(books => {
        return res.status(200).json(books);
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        return res.status(500).json({ error: 'Failed to fetch books' });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

    return new Promise((resolve, reject) => {
        if (Object.keys(books).includes(isbn)) {
            resolve(books[isbn]);
        } else {
            reject(new Error("No book with such ISBN found."));
        }
    })
    .then(book => {
        return res.status(200).json(book);
    })
    .catch(error => {
        console.error(error.message);
        return res.status(404).json({ message: error.message });
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author

    return new Promise((resolve, reject) => {
        const foundBooks = [];

        for (let key in books) {
            if (books[key].author === author) {
                foundBooks.push(books[key]);
            }
        }

        if (foundBooks.length > 0) {
            resolve(foundBooks);
        } else {
            reject(new Error("No book with such author found."));
        }
    })
    .then(foundBooks => {
        return res.status(200).json(foundBooks);
    })
    .catch(error => {
        console.error(error.message);
        return res.status(404).json({ message: error.message });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title

    return new Promise((resolve, reject) => {
        const foundBooks = [];

        for (let key in books) {
            if (books[key].title === title) {
                foundBooks.push(books[key]);
            }
        }

        if (foundBooks.length > 0) {
            resolve(foundBooks);
        } else {
            reject(new Error("No book with such title found."));
        }
    })
    .then(foundBooks => {
        return res.status(200).json(foundBooks);
    })
    .catch(error => {
        console.error(error.message);
        return res.status(404).json({ message: error.message });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (Object.keys(books).includes(isbn)) {
    return res.status(200).json(books[isbn].reviews)
  } else {
    return res.status(404).json({message: "No book with such ISNB found."})
  }
});

module.exports.general = public_users;
