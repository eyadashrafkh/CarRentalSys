-- generate values to insert into the admin table pass admin
INSERT INTO admin VALUES ('admin@gmail.com','$2b$10$UJsNZNABpC4D35sIchQcCuFf3h4gMJiPmJe.mhEJHbP4bsTL7B3YG');

-- generate values to insert into the credit table
INSERT INTO credit(card_no,cvv,holder_name,expire_date) values
('0123456789012345','012','amr','2025-09-30'),
('1234567890123456','123','iyad','2024-04-12'),
('2345678901234567','234','omar','2026-06-28'),
('3456789012345678','345','ahmed','2027-07-19'),
('0112345678901234','011','mohamed','2024-11-05');

-- generate values to insert into the office table
INSERT INTO office(office_id,`name`,email,phone_no,`password`,building_no,city,country) values
(1,'smouha','smouha@gmail.com','01111111111','$2b$10$8/9WhIHwBx1thFZw80duz.kW1FZ5pHhY4yBMK99M7ESJk58RjMDF.','123-smouha','egypt','alex'),
(2,'dubai','dubai@gmail.com','01222222222','$2b$10$CKL4PrQA0PiDRDEHGXvTEup54a0uDhe.qDxh/jZQ.G3DtLqLmBiIG','111-dubai','uae','dubai'),
(3,'ibrahimia','ibrahimia@gmail.com','01333333333','$2b$10$kIzfS.IYqygq2rHlq88sMugpVMOn1MtQ7EHd5uRnirWtpzOjhi2IW','13-ibrahimia','egypt','alex');

-- generate values to insert into the customer table
INSERT INTO customer(ssn,fname,lname,email,phone_no,`password`,credit) values
('456789','amr','abdelaziz','amr@gmail.com','01234567890','$2b$10$ZIm/6YN0dwSJb0.8rCvbXOVlosaYpQrZymjEUIoTL/iu5ZTPqwD3u',0.0),
('621413','iyad','ashraf','iyad@gmail.com','01234567891','$2b$10$g74bawyGetiiuPA9hiXFx.r2rPWLbXbnayt4bBFojMQn97zTzYfc6',200.0),
('234567','omar','atef','omar@gmail.com','01234567892','$2b$10$YHbEnajqBKeF9q/yxNdVeO1KAw08rhv.U.Djp3D6He6Qj1Gg.SfGq',45.0),
('859282','ahmed','moghazy','ahmed@gmail.com','01234567893','$2b$10$lqbwkCOsKLJy9q.cGG9v.uVAQNS/knCmDcwhFPOLBYPhfZkYgOGni',32.0),
('322224','mohamed','reda','mohamed@gmail.com','01234567894','$2b$10$s4ZbjR6MLSmulpu63wXVfeC1YrLbcWkS7o3.h6gOFz6DdP.A7gTfK',64.0);

-- generate values to insert into the car table
INSERT INTO car(plate_id,model,make,body_style,`year`,price,color,office_id) values  
('AAAA1111','kia','cerato','sedan','2015',2300.00,'RED',1),
('BBBB2222','nissan','sunny','sedan','2004',1900.00,'BLACK',2),
('CCCC3333','opel','grandland','suv','2020',2900.00,'BLUE',1),
('DDDD4444','nissan','sunny','sedan','2010',2000.00,'RED',1),
('EEEE5555','toyota','corolla','sedan','2017',2500.00,'BLACK',3),
('FFFF6666','hyundai','tucson','suv','2018',4000.00,'WHITE',3),
('GGGG7777','opel','astra','sedan','2013',2500.00,'GRAY',2),
('HHHH8888','toyota','yaris','sedan','2016',1400.00,'RED',1);

-- generate values to insert into the car_status table
INSERT INTO car_status(status_code,plate_id) values
(0,'AAAA1111'),
(1,'BBBB2222'),
(2,'CCCC3333'),
(3,'DDDD4444'),
(0,'EEEE5555'),
(1,'FFFF6666'),
(2,'GGGG7777'),
(3,'HHHH8888');

-- generate values to insert into the car_photo table
INSERT INTO car_photo(photo,plate_id) values
('https://th.bing.com/th/id/OIP.tqVpz2A5sWaUP08r7TLTNQHaEK?rs=1&pid=ImgDetMain','AAAA1111'),
('https://th.bing.com/th/id/R.8c7cdd72a622f171d6814d446bcdf5fc?rik=%2b3uJjN0XtLkdEQ&pid=ImgRaw&r=0','AAAA1111'),
('https://th.bing.com/th/id/OIP.b8FD-6MYsoXakhBDeqyqfQHaFL?rs=1&pid=ImgDetMain','BBBB2222'),
('https://th.bing.com/th/id/R.b70bf2309efaa1f13155bb18b8b81b7d?rik=bXi4sn45s5xWiA&pid=ImgRaw&r=0','CCCC3333'),
('https://th.bing.com/th/id/R.31721b3e909e9b66f77d360eccd126c5?rik=32QiiKQQbbcY%2bQ&pid=ImgRaw&r=0','DDDD4444'),
('https://th.bing.com/th/id/OIP.dZHcHKgI0vnV3cik0xxgWQHaEA?rs=1&pid=ImgDetMain','EEEE5555'),
('https://th.bing.com/th/id/OIP.yjVrjGC0Y_7MNsqUv5s0kQHaFN?rs=1&pid=ImgDetMain','FFFF6666'),
('https://th.bing.com/th/id/OIP.DMezpLY1rorrib0Z1QiMnQHaD5?rs=1&pid=ImgDetMain','GGGG7777'),
('https://th.bing.com/th/id/OIP.SZgSuO_cUydkt_1huuweQgHaE6?rs=1&pid=ImgDetMain','HHHH8888');

-- generate values to insert into the reservation table
INSERT INTO reservation(payment_date,pickup_date,return_date,reserve_date,plate_id,ssn) values
('2023-11-03','2023-11-04','2023-12-03','2023-11-01 12:30:33','AAAA1111','456789'),
('2023-10-03','2023-10-14','2023-10-16','2023-09-01 11:34:44','BBBB2222','621413'),
('2023-12-09','2023-12-04','2024-01-03','2023-11-29 14:48:25','DDDD4444','234567'),
('2023-12-13','2023-12-24','2023-12-29','2023-12-12 15:36:25','CCCC3333','859282'),
('2023-12-13','2023-12-28','2024-01-08','2023-12-11 18:33:45','HHHH8888','322224');


-- generate values to insert into the customer_card table
INSERT INTO customer_card(ssn,card_no) values
('456789','0123456789012345'),
('621413','1234567890123456'),
('234567','2345678901234567'),
('859282','3456789012345678'),
('322224','0112345678901234');
