require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bcrypt = require("bcrypt");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const saltRound = 10;

const app = express();

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.render("home")
});

app.get("/signin", (req, res) => {
    res.render("signin")
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/office_signup", (req, res) => {
   res.render("office_signup");
});


app.get("/home_customer", (req, res) => {
    const email = req.query.email; // Access the email from the query parameters
    const userReservations = null; // Assuming there is a function to retrieve user reservations
    console.log("Email:", email);
    console.log("User Reservations:", userReservations);
    res.render("home_customer", { userEmail: email, userReservations: userReservations }); // Pass the email and userReservations to the view
});

app.get("/reserve", (req, res) => {
    const email = req.query.name; // Access the email from the query parameters
    console.log("Email:", email);
    res.render("reserve", { userEmail: email, }); // Pass the email and userReservations to the view

});

/*post requests*/
// ---------------------------------------------------------------------------------------------------------------------

app.post("/signup-landing", (req, res) => {
    email = req.body.email;
    res.render("signup", { userEmail: email });
});

app.post("/signup", (req, res) => {
    //signing up as a customer
    let email = req.body.email;
    let password = req.body.password;
    let fName = req.body.fName;
    let lName = req.body.lName;
    let ssn = req.body.ssn;
    let creditCardNo = req.body.credit_card_no;
    let holdreName = req.body.holder_name;
    let expDate = req.body.credit_card_expiry_date;
    let cvv = req.body.credit_card_cvv;
    let phone = req.body.phone_no;
    //add credit card info to the database
    db.query("INSERT INTO credit (card_no, holder_name, expire_date, cvv) VALUES (?,?,?,?)",
        [creditCardNo, holdreName, expDate, cvv], (err, result) => {
            if (err){
                console.log(err);
                return res.send({ message: err });
            }   
        });
    //convert password to hash
    bcrypt.hash(password, saltRound, function (err, hash) {
        //store the info inside the database
        db.query("INSERT INTO customer (email, password, fname, lname, ssn, phone_no) VALUES (?,?,?,?,?,?)",
            [email, hash, fName, lName, ssn, phone], (err, result) => {
                if (err){
                    console.log(err);
                    return res.send({ message: err });
                }
                db.query("INSERT INTO customer_credit (ssn, card_no) VALUES (?,?)",
                    [ssn, creditCardNo], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.send({ message: err });
                        } else {
                            res.redirect("/signin");
                        }
                    });
            });
    });
});


app.post("/office-signup", (req, res) => {
    //signing up as an office
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone_no;
    let password = req.body.password;
    let country = req.body.country;
    let city = req.body.city;
    let building_no = req.body.building_no;

    //convert password to hash
    bcrypt.hash(password, saltRound, function (err, hash) {
        //store the info inside the database
        db.query("INSERT INTO office (email, password, name, phone_no, country, city, building_no) VALUES (?,?,?,?,?,?,?)",
            [email, hash, name, phone, country, city, building_no], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send({ message: err });
                } else {
                    res.redirect("/signin");
                }
            });
    });
});

app.post("/signin", (req, res) => {

    email = req.body.email;
    password = req.body.password;

    db.query("SELECT * FROM customer WHERE email = ?", [email], (err, result) => {
        if (err)
            return res.send({ message: err });
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, function (err, response) {
                if (response) {
                    const userName = result[0].fName;
                    res.redirect("/home_customer?userName=" + userName);
                } else {
                    res.redirect("/signin?error=InvalidCredentials");
                }
            });
        } else {
            db.query("SELECT * FROM office WHERE email = ?", [email], (err, result) => {
                if (err)
                    return res.send({ message: err });
                if (result.length > 0) {
                    bcrypt.compare(password, result[0].password, function (err, response) {
                        if (response) {
                            const officeName = result[0].name;
                            res.redirect("/office-home");
                        } else {
                            res.redirect("/signin?error=InvalidCredentials");
                        }
                    });
                } else {
                    res.redirect("/signin?error=UserNotFound");
                }
            });
        }
    });
});

app.post("/home_customer", (req, res) => {
    buttonClicked = req.body.button; // Assuming the name attribute of the button is "button"
    email = req.body.email;

    console.log("Button clicked:", buttonClicked); // Print the name of the button clicked

    if (buttonClicked === "button1") {
        // Handle button1 post request
        console.log("Button 1 clicked");
        // Your code here
    } else if (buttonClicked === "button2") {
        // Handle button2 post request
        console.log("Button 2 clicked");
        // Your code here
    } else {
        // Handle other post requests
        console.log("Unknown button clicked");
        // Your code here
    }

    res.render("home_customer", { userEmail: email });
});

app.post("/logout", (req, res) => {
    res.redirect("/");
});

app.post("/reserve", (req, res) => {
    res.redirect("/reserve?name=" + req.body.userName);
});



app.listen(3000, () => {
    console.log("server running on port 3000.");
});
