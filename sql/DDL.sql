CREATE DATABASE car_rental_db;

use car_rental_db;

CREATE TABLE admin(
    email VARCHAR(256) PRIMARY KEY,
    `password` VARCHAR(256) NOT NULL,
    );

CREATE table office(
    office_id int AUTO_INCREMENT PRIMARY KEY ,
    `name` varchar(256) NOT NULL,
    email varchar(256) UNIQUE NOT NULL,
    phone_no char(11) UNIQUE NOT NULL,
    `password` varchar(256) NOT NULL,
    building_no varchar(20) NOT NULL,
    city varchar(256) NOT NULL,
    country varchar(256) NOT NULL,
    UNIQUE KEY (building_no,city,country)
	);

CREATE table customer(
    ssn CHAR(6) PRIMARY KEY,
    fname varchar(256) NOT NULL,
    lname varchar(256) NOT NULL,
    email varchar(256) UNIQUE NOT NULL,
    phone_no char(11) UNIQUE NOT NULL,
    `password` varchar(256) NOT NULL,
    credit decimal(10,2) DEFAULT 0
    );

CREATE TABLE credit(
    card_no char(16) PRIMARY KEY,
    cvv char(3) NOT NULL,
    holder_name varchar(256) NOT NULL,
    expire_date timestamp NOT NULL
	);

CREATE TABLE car (
    plate_id varchar(8) PRIMARY KEY,
    model varchar(256) NOT NULL,
    make varchar(256) NOT NULL,
    color varchar(256) NOT NULL,
    body_style varchar(256) NOT NULL,
    `year` year NOT NULL,
    price decimal(10,2) NOT NULL,
    registration_date timestamp DEFAULT CURRENT_TIMESTAMP,
    office_id int NOT NULL,
    FOREIGN KEY(office_id) REFERENCES office(office_id)
    );

-- 0-> available, 1-> in maintainance, 2-> being cleaned, 3-> rented
CREATE TABLE car_status(
    status_code SMALLINT DEFAULT 0,
    status_date timestamp DEFAULT CURRENT_TIMESTAMP,
    plate_id varchar(8),
    PRIMARY KEY (status_code,status_date,plate_id),
    FOREIGN KEY(plate_id) REFERENCES car(plate_id)
    );
    
CREATE TABLE car_photo(
    photo varchar(512),
    plate_id varchar(8),
    PRIMARY KEY(photo,plate_id),
    FOREIGN KEY(plate_id) REFERENCES car(plate_id)
	);

CREATE TABLE reservation(
    reservation_no int AUTO_INCREMENT PRIMARY KEY,
    payment_date timestamp DEFAULT NULL,
    pickup_date timestamp  NOT NULL,
    return_date timestamp  NOT NULL,
    reserve_date timestamp DEFAULT CURRENT_TIMESTAMP,
    plate_id varchar(8) NOT NULL,
    ssn CHAR(6) NOT NULL,
    FOREIGN KEY(plate_id) REFERENCES car(plate_id),
    FOREIGN KEY(ssn) REFERENCES customer(ssn)
    );
    
CREATE table customer_card(
	ssn CHAR(6),
    card_no char(16),
    PRIMARY KEY (ssn,card_no),
    FOREIGN KEY(ssn) REFERENCES customer(ssn),
    FOREIGN KEY(card_no) REFERENCES credit(card_no)
	);