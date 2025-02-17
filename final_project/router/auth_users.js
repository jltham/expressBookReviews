const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    let valid = true;

    for (let user in users) {
        if (user["username"] == username) {
            valid = false;
            break;
        }
    }

    return valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body;

    if (!Object.keys(books).includes(isbn)) {
        return res.status(404).json({message: "No book with such ISBN found."})
    }

    let reviews = books[isbn].reviews;

    let username = req.session.authorization.username;

    if (Object.keys(reviews).includes(username)) {
        reviews[username] = review
    } else {
        reviews[username] = review
    }

    books[isbn].reviews = reviews

    return res.status(200).json({message: "Successfully updated reviews", book: books[isbn]})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    if (!Object.keys(books).includes(isbn)) {
        return res.status(404).json({message: "No book with such ISBN found."})
    }

    let reviews = books[isbn].reviews;
    let username = req.session.authorization.username;

    if (Object.keys(reviews).includes(username)) {
        delete reviews[username]
    }

    books[isbn].reviews = reviews

    return res.status(200).json({message: "Successfully deleted the review.", book: books[isbn]})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
