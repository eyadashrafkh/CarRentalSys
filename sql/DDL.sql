CREATE DATABASE finalproject;

use finalproject;

CREATE TABLE car(
    plate_id varchar(8) PRIMARY KEY ,
    model varchar(255) NOT NULL,
    make varchar(255) NOT NULL,
    body_style varchar(255) NOT NULL,
    `year` year NOT NULL,
    price decimal(10,2) NOT NULL,
    registration_date date DEFAULT CURRENT_DATE,
    color varchar(255) NOT NULL,
    office_id int NOT NULL
    );

-- 0-> available, 1-> in maintainance, 2-> being cleaned, 3-> rented
CREATE TABLE car_status(
    status_code SMALLINT DEFAULT 0,
    status_date datetime DEFAULT CURRENT_DATE,
    plate_id varchar(8),
    PRIMARY KEY (status_code,status_date,plate_id)
    );
    
CREATE TABLE car_photo(
    photo varchar(512),
    plate_id varchar(8),
    PRIMARY KEY(photo,plate_id)
	);

CREATE table office(
    office_id int AUTO_INCREMENT PRIMARY KEY ,
    `name` varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    phone_no char(11) UNIQUE NOT NULL,
    `password` varchar(255) NOT NULL,
    building_no varchar(255) NOT NULL,
    city varchar(255) NOT NULL,
    country varchar(255) NOT NULL
	);

CREATE TABLE reservation(
    reservation_no int AUTO_INCREMENT PRIMARY KEY,
    payment_date date DEFAULT NULL,
    pickup_date date  NOT NULL,
    return_date date  NOT NULL,
    reserve_date date DEFAULT CURRENT_DATE,
    plate_id varchar(8) NOT NULL,
    ssn CHAR(6) NOT NULL
    );

CREATE table customer(
    ssn CHAR(6) PRIMARY KEY,
    fname varchar(255) NOT NULL,
    lname varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    phone_no char(11) UNIQUE NOT NULL,
    `password` varchar(255) NOT NULL,
    credit decimal(10,2) DEFAULT 0
    );
    
CREATE table customer_card(
	ssn CHAR(6),
    card_no char(16),
    PRIMARY KEY (ssn,card_no)
	);

CREATE TABLE credit(
    card_no char(16) PRIMARY KEY,
    cvv char(3) NOT NULL,
    holder_name varchar(255) NOT NULL,
    expire_date date NOT NULL 
	);

ALTER TABLE `car_status`
ADD FOREIGN KEY(plate_id) REFERENCES `car`(plate_id);

ALTER TABLE `car_photo`
ADD FOREIGN KEY(plate_id) REFERENCES `car`(plate_id);

ALTER TABLE `reservation`
ADD FOREIGN KEY(plate_id) REFERENCES `car`(plate_id);

ALTER TABLE `car`
ADD FOREIGN KEY(office_id) REFERENCES `office`(office_id);

ALTER TABLE `reservation`
ADD FOREIGN KEY(ssn) REFERENCES `customer`(ssn);

ALTER TABLE `customer_card`
ADD FOREIGN KEY(ssn) REFERENCES `customer`(ssn);

ALTER TABLE `customer_card`
ADD FOREIGN KEY(card_no) REFERENCES `credit`(card_no);