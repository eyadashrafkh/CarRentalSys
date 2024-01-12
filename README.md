# VaCarTion

## Table of Contents
- [VaCarTion](#vacartion)
    - [Overview](#overview)
    - [Dependencies](#dependencies)
    - [Database Schema](#database-schema)
        - [DDL](#ddl)
        - [ER Diagram](#er-diagram)
    - [Deployment](#deployment)
    - [Screenshots](#screenshots)
        - [Landing Page](#landing-page)
        - [Office Agent Dashboard](#office-agent-dashboard)
        - [Customer Dashboard](#customer-dashboard)
        - [Reservation Page](#reservation-page)
    - [Contributers](#contributers)

## Overview
A car rental system which enables customers to rent cars they need and manage their reservations with the option of paying later. The car agencies are allowed to register on the system and add their cars to the system. The system admin can manage the whole system. The system is built using Node.js and Express.js. The database is built using MySQL.

## Dependencies
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [EJS](https://ejs.co/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Dotenv](https://www.npmjs.com/package/dotenv)

- To install all the dependencies, run the following command in the terminal:

```bash
npm install
```
## Database Schema

### DDL
- You can create your database schema by running the Data Definition script in [Database Schema](sql/DDL.sql)

### ER Diagram
<!-- embed the photo whose link is  here -->
![ER Diagram](ERD\ERD1.png)   
<!-- ### Mapping of ER Diagram
![Mapping of ER](/ER%20model/ER%20diagram.png) -->


## Deployment

1- Create a database with the explained [database schema](#database-schema) and [ER diagram](#er-diagram)

2- Configure the .env file and set the following variables:

    - DB_HOST 
    - DB_USER 
    - DB_PORT 
    - DB_PASS 
    - DB_NAME 
    - ACCESS_TOKEN_SECRET -> Secret key for generating access tokens 
    - EMAIL -> Email address from which you want to send the emails 
    - PASSWORD -> Password of the email address 

3- Make sure you have installed all the [dependencies](#dependencies) by running the following command in the terminal:

```bash
npm install
```

4- Run the following command in the terminal to start the server:

```bash
npm start
```

5- Open the browser and go to the following link:

```bash
http://localhost:3000
``` 

- **Note:** If you want to run the server on a different port, you can change the port number in app.js file

## Screenshots

### Landing Page

![image](https://user-images.githubusercontent.com/41492875/210100324-b5569c69-7bb2-432f-9106-504f0d384faa.png)

### Office Agent Dashboard

![image](https://user-images.githubusercontent.com/41492875/210100300-802136e9-4684-4775-9274-a7fb6be4dfd8.png)


### Customer Dashboard

![image](https://user-images.githubusercontent.com/41492875/210100281-281f7fd9-f4ed-445e-8c9f-98f9453d117e.png)


### Reservation Page

![image](https://user-images.githubusercontent.com/41492875/210100077-52ad34b2-dd1c-49d3-abdc-0a3b4a89504e.png)


## Contributers

1. [Yousef Kotp](https://github.com/yousefkotp)

2. [Mohamed Farid](https://github.com/MohamedFarid612)

3. [Adham Mohamed](https://github.com/adhammohamed1)

4. [Hossam Elshamy](https://github.com/hossamelshamyy)

