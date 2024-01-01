require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mysql = require('mysql');
const bcrypt = require("bcrypt");
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
app.use(bodyParser.json());


app.get("/", (req, res) => {
    res.render("home")
});

app.get("/signin", (req, res) => {
    res.render("signin")
});

app.get("/office_signup", (req, res) => {
    res.render("office_signup");
});

app.get("/home_office", (req, res) => {
    const officeName = req.query.officeName;
    const office_id = req.query.office_id;
    db.query("SELECT * , ((DATEDIFF(return_date,pickup_date)+1)*price ) as revenue FROM reservation JOIN car ON reservation.plate_id = car.plate_id JOIN office on car.office_id = office.office_id JOIN customer ON reservation.ssn = customer.ssn where office.office_id = ?",
        [office_id], (err, result) => {
            if (err)
                return res.send({ message: err });
            const reservations = result;

            db.query(`SELECT *
                        FROM car_status
                        NATURAL INNER JOIN car
                        WHERE (plate_id,status_date) in (SELECT plate_id, MAX(status_date)
                                                        FROM car_status
                                                        where status_date <= CURRENT_TIMESTAMP()
                                                        GROUP BY plate_id) AND office_id = ?`,
                [office_id], (err, result) => {
                    if (err)
                        return res.send({ message: err });
                    const officeCars = result;

                    res.render("home_office", { officeName: officeName, office_id: office_id, officeCars: officeCars, officeReservations: reservations });
                });
        });
});

app.get("/home_customer", (req, res) => {
    const fname = req.query.fname; // Access the first name from the query parameters
    const ssn = req.query.ssn; // Access the SSN from the query parameters
    db.query("SELECT *, ((DATEDIFF(return_date,pickup_date)+1)*price )as revenue, c.color, c.body_style FROM reservation as r NATURAL INNER JOIN customer INNER JOIN car as c on c.plate_id = r.plate_id WHERE r.ssn = ?",
        [ssn], (err, result) => {
            if (err)
                return res.send({ message: err });

            const reservations = result;

            res.render("home_customer", { fname: fname, ssn: ssn, reservations: reservations });
        });
});

app.get("/reserve", (req, res) => {
    const fname = req.query.fname;
    const ssn = req.query.ssn
    res.render("reserve", { fname: fname, ssn: ssn });
});

app.get("/add_car", (req, res) => {
    const officeName = req.query.officeName; // Access the name from the query parameters
    const office_id = req.query.office_id; // Access the id from the query parameters
    res.render("add_car", { officeName: officeName, office_id: office_id }); // Pass the name and id to the view
});

app.get("/admin", (req, res) => {
    res.render("home_admin");
});

app.get("/customers_view", (req, res) => {
    res.render("customers_view");
});

app.get("/offices_view", (req, res) => {
    res.render("offices_view");
});

app.get("/res-search", (req, res) => {
    res.render("res_search");
});

app.get("/payments-search", (req, res) => {
    res.render("res_search");
});

app.get("/customer-res-search", (req, res) => {
    res.render("customer_res_search");
});

app.get("/car-res-search", (req, res) => {
    res.render("car_res_search");
});


/*post requests*/
// ---------------------------------------------------------------------------------------------------------------------

app.post("/signup-landing", (req, res) => {
    email = req.body.email;
    res.render("signup", { userEmail: email });
});

//check if ssn is already taken in customer
app.post("/check-ssn-customer", (req, res) => {
    let ssn = req.body.ssn;
    db.query("SELECT * FROM customer WHERE ssn = ?", [ssn], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

//check if email is already taken in customer
app.post("/check-email-customer", (req, res) => {
    let email = req.body.email;
    db.query("SELECT * FROM customer WHERE email = ?", [email], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

//check if phone is already taken for customer
app.post("/check-phone_no-customer", (req, res) => {
    let phone_no = req.body.phone_no;
    db.query("SELECT * FROM customer WHERE phone_no = ?", [phone_no], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

// SignUp
app.post("/signup", (req, res) => {

    //signing up as a customer
    let email = req.body.email;
    let password = req.body.password;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let ssn = req.body.ssn;
    let card_no = req.body.card_no;
    let holder_name = req.body.holder_name;
    let expire_date = req.body.expire_date;
    let cvv = req.body.cvv;
    let phone_no = req.body.phone_no;
    //add credit card info to the database
    db.query("INSERT INTO credit (card_no, holder_name, expire_date, cvv) VALUES (?,?,?,?)",
        [card_no, holder_name, expire_date, cvv], (err, result) => {
            if (err) {
                console.log(err);
                return res.send({ message: err });
            }
        });
    //convert password to hash
    bcrypt.hash(password, saltRound, function (err, hash) {
        //store the info inside the database
        db.query("INSERT INTO customer (email, password, fname, lname, ssn, phone_no) VALUES (?,?,?,?,?,?)",
            [email, hash, fname, lname, ssn, phone_no], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send({ message: err });
                }
                db.query("INSERT INTO customer_card (ssn, card_no) VALUES (?,?)",
                    [ssn, card_no], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.send({ message: err });
                        } else {
                            res.send({ success: true });
                        }
                    });
            });
    });
});


app.post("/signin", (req, res) => {

    email = req.body.email;
    password = req.body.password;
    //check in admin in database
    db.query("SELECT * FROM admin WHERE email = ?", [email], (err, result) => {
        if (err)
        return res.send({ message: err });
    if (result.length > 0) {
        //check if the password is correct
        bcrypt.compare(password, result[0].password, function (err, response) {
            if (response) {
                res.redirect("/admin");
            } else {
                res.redirect("/signin");
            }
        });
    } else {
        db.query("SELECT * FROM customer WHERE email = ?", [email], (err, result) => {
            if (err)
            return res.send({ message: err });
        if (result.length > 0) {
                    bcrypt.compare(password, result[0].password, function (err, response) {
                        if (response) {
                            const fname = result[0].fname;
                            const ssn = result[0].ssn;
                            res.redirect(`/home_customer?fname=${fname}&ssn=${ssn}`);
                        } else {
                            res.redirect("/signin");
                        }
                    });
                } else {
                    db.query("SELECT * FROM office WHERE email = ?", [email], (err, result) => {
                        if (err)
                        return res.send({ message: err });
                    if (result.length > 0) {
                        bcrypt.compare(password, result[0].password, function (err, response) {
                            if (response) {
                                    console.log(email);
                                    const officeName = result[0].name;
                                    const office_id = result[0].office_id;
                                    res.redirect(`/home_office?officeName=${officeName}&office_id=${office_id}`);
                                } else {
                                    console.log("WRONG PASS");
                                    res.redirect("/signin");
                                }
                            });
                        } else {
                            res.redirect("/signin");
                        }
                    });
                }
            });
        }
    });
});

app.post("/pay-reservation", (req, res) => {
    let reservation_no = req.body.reservation_no;
    let query = `UPDATE reservation SET payment_date = CURDATE() WHERE reservation_no = ?`;
    db.query(query, [reservation_no], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({
            message: "success",
            success: function (response) {
                const fname = req.body.fname;
                const ssn = req.body.ssn;
                alertify.notify('Reservation Paid successfully', 'success', 3, function () {
                    window.location.href = `/home_customer?fname=${fname}&ssn=${ssn}`;
                });
            }
        });
    });
});

app.post("/logout", (req, res) => {
    res.redirect("/");
});

app.post("/reserve", (req, res) => {
    res.redirect(`/reserve?fname=${req.body.fname}&ssn=${req.body.ssn}`);
});

app.post("/reserve_car", (req, res) => {
    //reserve a car
    let car_no = req.body.car_no;
    let ssn = req.body.ssn;
    let officeName = req.body.officeName;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;

    db.query("INSERT INTO reservation (plate_id, ssn, officeName, start_date, end_date) VALUES (?,?,?,?,?)",
        [car_no, ssn, officeName, start_date, end_date], (err, result) => {
            if (err) {
                console.log(err);
                return res.send({ message: err });
            } else {
                const fname = result[0].fname;
                res.redirect(`/home_customer?fname=${fname}&ssn=${ssn}`);
            }
        });
}
);

//get all the models of cars
app.post("/get-all-cars-models", (req, res) => {
    //get the cars info from the database
    db.query("SELECT DISTINCT model FROM car",
        (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ carModels: result, message: "success" });
        });
});

//get all the makes of cars for a specific model
app.post("/get-all-cars-makes", (req, res) => {
    var model = req.body.model;
    //get the cars info from the database
    if (model == 'Any')
        db.query("SELECT DISTINCT make FROM car",
            (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carMakes: result, message: "success" });
            });
    else
        db.query("SELECT DISTINCT make FROM car WHERE model = ?",
            [model], (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carMakes: result, message: "success" });
            });
});

//get all the colors of cars for a specific model
app.post("/get-all-cars-colors", (req, res) => {
    var model = req.body.model;
    //get the cars info from the database
    if (model == 'Any') {
        db.query("SELECT DISTINCT color FROM car",
            (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carColors: result, message: "success" });
            });
    } else {
        db.query("SELECT DISTINCT color FROM car WHERE model = ?",
            [model], (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carColors: result, message: "success" });
            });
    }
});


//get all the body_styles of cars for a specific model
app.post("/get-all-cars-body_styles", (req, res) => {
    var model = req.body.model;
    //get the cars info from the database
    if (model == 'Any') {
        db.query("SELECT DISTINCT body_style FROM car",
            (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carBodyStyles: result, message: "success" });
            });
    } else {
        db.query("SELECT DISTINCT body_style FROM car WHERE model = ?",
            [model], (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ carBodyStyles: result, message: "success" });
            });
    }
});

//get all offices 
app.post("/get-all-offices", (req, res) => {
    db.query("SELECT * FROM office",
        (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ offices: result, message: "success" });
        });
});

//check if email is already taken for office
app.post("/check-email-office", (req, res) => {
    let email = req.body.email;
    db.query("SELECT * FROM office WHERE office.email = ?", [email], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
    });
});

//check if phone is already taken for office
app.post("/check-phone-office", (req, res) => {
    let phone = req.body.phone;
    db.query("SELECT * FROM office WHERE phone_no = ?", [phone], (err, result) => {
        if (err)
            return res.send({ message: err });
        res.send({ taken: result.length > 0 });
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
                    return res.send({ success: false });
                }
                res.send({ success: true });
            });
    });
});

app.post("/show-avaialable-cars", (req, res) => {
    let pickup_date = req.body.pickup_date;
    let return_date = req.body.return_date;
    let date = pickup_date + " 23:59:59";
    let model = req.body.model;
    let make = req.body.make;
    let color = req.body.color;
    let body_style = req.body.body_style;
    let city = req.body.city;
    let country = req.body.country;
    let office_name = req.body.office_name;
    let office_build_no = req.body.office_build_no;
    let conditions = []

    let query = `SELECT *
                FROM car_status
                NATURAL INNER JOIN car as c
                NATURAL INNER JOIN office as o
                NATURAL INNER JOIN car_photo
                WHERE (plate_id,status_date) in (SELECT plate_id, MAX(status_date)
                                                FROM car_status
                                                where status_date <= ?
                                                GROUP BY plate_id) AND c.plate_id NOT IN (SELECT plate_id FROM reservation WHERE (pickup_date <= ? AND return_date >= ?) or (pickup_date <= ? AND return_date >= ?) or (pickup_date >= ? AND return_date <= ?) or (pickup_date <= ? AND return_date >= ?))`;
    if (model != "Any") {
        conditions.push(`c.model = '${model}'`);
    }
    if (make != "Any") {
        conditions.push(`c.make = '${make}'`);
    }
    if (color != "Any") {
        conditions.push(`c.color = '${color}'`);
    }
    if (body_style != "Any") {
        conditions.push(`c.body_style = '${body_style}'`);
    }
    if (city != "") {
        conditions.push(`o.city = '${city}'`);
    }
    if (country != "") {
        conditions.push(`o.country = '${country}'`);
    }
    if (office_name != "") {
        conditions.push(`o.name = '${office_name}'`);
    }
    if (office_build_no != "") {
        conditions.push(`o.building_no = '${office_build_no}'`);
    }
    if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
    }
    db.query(query, [date, pickup_date, pickup_date, pickup_date, return_date, pickup_date, return_date, pickup_date, return_date], (err, result) => {
        if (err) {
            console.log("err", err);
            return res.send({ message: err });
        }
        if (result != null) {
            result = result.filter(car => car.status_code == 0);
            console.log(result); // Print the result
            res.send({ cars: result, message: "success" });
        }
    });
});

//post request to add a reservation
app.post("/add-reservation", (req, res) => {
    let ssn = req.body.ssn;

    let plateId = req.body.plateId;
    let pickupDate = req.body.pickupDate;
    let returnDate = req.body.returnDate;
    let payNow = req.body.payNow;

    let pickupForCarStatus = pickupDate + " 00:00:00";
    let returnForCarStatus = returnDate + " 23:59:59";

    var query = '';
    if (payNow === "true")
        query = "INSERT INTO reservation (ssn, plate_id, pickup_date, return_date, payment_date) VALUES (?,?,?,?, CURDATE())";
    else
        query = "INSERT INTO reservation (ssn, plate_id, pickup_date, return_date) VALUES (?,?,?,?)";
    db.query(query,
        [ssn, plateId, pickupDate, returnDate], (err, result) => {
            if (err)
                return res.send({ message: err });

            db.query("INSERT INTO car_status (plate_id, status_code, status_date) VALUES (?,?,?)",
                [plateId, 3, pickupForCarStatus], (err, result) => {
                    if (err)
                        return res.send({ message: err });
                    db.query("INSERT INTO car_status (plate_id, status_code, status_date) VALUES (?,?,?)",
                        [plateId, 0, returnForCarStatus], (err, result) => {
                            if (err)
                                return res.send({ message: err });
                            res.send({ success: true });
                        });
                });
        });
});


app.post("/add_car", (req, res) => {
    const office_id = req.body.office_id;
    const officeName = req.body.officeName;
    res.redirect(`/add_car?office_id=${office_id}&officeName=${officeName}`);
});

app.post("/add_car_to_db", (req, res) => {
    //add car to the database
    let car_plate_id = req.body.plate_id;
    let car_make = req.body.make;
    let car_model = req.body.model;
    let car_Body_style = req.body.Body_style;
    let car_color = req.body.color;
    let car_year = req.body.year;
    let car_price = req.body.price;
    let car_photo1 = req.body.photo1;
    let car_photo2 = req.body.photo2;
    let car_photo3 = req.body.photo3;
    let officeName = req.body.officeName;
    let office_id = req.body.office_id;

    db.query("INSERT INTO car (plate_id, make, model, body_style, color, year, price, office_id) VALUES (?,?,?,?,?,?,?,?)",
        [car_plate_id, car_make, car_model, car_Body_style, car_color, car_year, car_price, office_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.send({ message: err });
            } else {

                const carPhotos = [car_photo1, car_photo2, car_photo3];
                // Insert car photos into the car_photo table
                carPhotos.forEach((photo) => {
                    console.log(photo);
                    if (photo != "")
                        db.query("INSERT INTO car_photo (plate_id, photo) VALUES (?, ?)", [car_plate_id, photo], (err, photoResult) => {
                            if (err) {
                                console.log(err);
                                return res.send({ message: err });
                            }
                        });
                });

                // Insert current timestamp and status code 0 into car_status table
                db.query("INSERT INTO car_status (plate_id, status_date, status_code) VALUES (?, CURRENT_TIMESTAMP, 0)", [car_plate_id], (err, statusResult) => {
                    if (err) {
                        console.log(err);
                        return res.send({ message: err });
                    } else {
                        res.redirect(`/home_office?officeName=${officeName}&office_id=${office_id}`);
                    }
                });
            }
        });
})

app.post("/update_car_status", (req, res) => {
    let status = req.body.status;
    let plate_id = req.body.plate_id;
    let office_id = req.body.office_id;
    //check that only the office having that car can changes its status
    db.query("SELECT office_id FROM `car` WHERE plate_id = ?", [plate_id], (err, result) => {
        if (err)
            return res.send({ message: err });
        if (result[0].office_id == office_id) {
            console.log("AUTHORIZED");
            db.query("UPDATE `car_status` SET `status_code` = ?, `status_date` = CURRENT_TIMESTAMP() WHERE `plate_id` = ?", [status, plate_id], (err, result) => {
                if (err)
                    return res.send({ success: false, message: err });
                res.send({ success: true });
            });
        } else {
            res.send({ success: false, message: "You are not authorized to change the status of this car" });
        }
    });
});

app.post("/remove_car", (req, res) => {
    let plate_id = req.body.plate_id;
    let office_id = req.body.office_id;
    //check that only the office having that car can delete it
    db.query("SELECT office_id FROM `car` WHERE plate_id = ?", [plate_id], (err, result) => {
        if (err)
            return res.send({ message: err });
        if (result[0].office_id == office_id) {
            db.query("DELETE FROM `car` WHERE plate_id = ?", [plate_id], (err, result) => {
                if (err)
                    return res.send({ message: err });
                res.send({ success: true });
            });
        } else {
            res.send({ success: false, message: "You are not authorized to change the status of this car" });
        }
    });
});

// reservations at certain period search
app.post("/get-reservations-within-period", (req, res) => {
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    //get the reservation info from the database within the period
    db.query("SELECT * FROM reservation as r NATURAL INNER JOIN customer INNER JOIN car as c on c.plate_id = r.plate_id WHERE reserve_date BETWEEN ? AND ?",
        [start_date, end_date], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        });
});

// customer reservation search
app.post("/get-customer-reservation", (req, res) => {
    //get decoded token from the request
    var ssn = req.body.ssn;
    if (ssn == null)
        ssn = req.body.ssn;
    ///get the reservation info from the database
    db.query("SELECT *, ((DATEDIFF(return_date,pickup_date)+1)*price )as revenue FROM reservation as r NATURAL INNER JOIN customer INNER JOIN car as c on c.plate_id = r.plate_id WHERE r.ssn = ?",
        [ssn], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        });
});

//car reservation search
app.post("/get-car-reservation", (req, res) => {
    var plate_id = req.body.plate_id;
    ///get the reservation info from the database
    db.query("SELECT * FROM reservation NATURAL INNER JOIN car WHERE plate_id = ?",
        [plate_id], (err, result) => {
            if (err)
                return res.send({ message: err });
            res.send({ reservation: result, message: "success" });
        });
});


app.listen(3000, () => {
    console.log("server running on port 3000.");
});
