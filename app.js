require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});


app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("home")
});

app.get("/signin", (req, res) => {
    res.render("signin")
});

app.get("/signup", (req, res) => {
    res.render("signup");
});


/*post requests*/
// ---------------------------------------------------------------------------------------------------------------------

app.post("/signup-landing", (req, res) => {
    email = req.body.email;
    res.render("signup", { userEmail: email });
});

app.post("/signup", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const fName = req.body.fName;
    const lName = req.body.lName;
    const ssn = req.body.ssn;
    const creditCardNo = req.body.credit_card_no;
    const holdreName = req.body.holder_name;
    const expDate = req.body.credit_card_expiry_date;
    const cvv = req.body.credit_card_cvv;
    const phone = req.body.phone_no;
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("First Name:", fName);
    console.log("Last Name:", lName);
    console.log("SSN:", ssn);
    console.log("Credit Card Number:", creditCardNo);
    console.log("Credit Card Holder Name:", holdreName);
    console.log("Credit Card Expiry Date:", expDate);
    console.log("Credit Card CVV:", cvv);
    console.log("Phone Number:", phone);
    
    // Handle post signup function
    // check database for user ssn, email, phone number, we ay 7aga 7d 4ayf m7taga tb2a unique
    // check validity of inputs
    // if not found, add user to database 
});

app.post("/signin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    console.log("Inserted email:", email);
    console.log("Inserted password:", password);
    
    // Handle post signin function
    // check database for user email and password
});


app.listen(3000,() => {
    console.log("server running on port 3000.");
});
