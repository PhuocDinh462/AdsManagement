use wnc_project;

DROP TABLE IF EXISTS `edit_request_point`;
DROP TABLE IF EXISTS `edit_request_board`;
DROP TABLE IF EXISTS `licensing_request`;
DROP TABLE IF EXISTS `report`;
DROP TABLE IF EXISTS `advertising_board`;
DROP TABLE IF EXISTS `board_type`;
DROP TABLE IF EXISTS `detail`;
DROP TABLE IF EXISTS `report_type`;
DROP TABLE IF EXISTS `advertising_point`;
DROP TABLE IF EXISTS `advertisement_type`;
DROP TABLE IF EXISTS `contract`;
DROP TABLE IF EXISTS `ward`;
DROP TABLE IF EXISTS `district`;
DROP TABLE IF EXISTS `user`;

-- Tạo bảng User
CREATE TABLE `user` (
  user_id INT auto_increment,
  username VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(255),
  dob DATETIME NOT NULL,
  user_type VARCHAR(255),
  created_by INT default null,
  updated_by INT default null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  FOREIGN KEY (created_by) REFERENCES `user`(user_id),
  FOREIGN KEY (updated_by) REFERENCES `user`(user_id)
);

-- Tạo bảng Districts
CREATE TABLE `district` (
  district_id INT auto_increment,
  district_name VARCHAR(255) NOT NULL,
  manager_id INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (district_id),
  FOREIGN KEY (manager_id) REFERENCES `user`(user_id)
);

-- Tạo bảng Wards với khóa ngoại tham chiếu đến bảng Districts
CREATE TABLE `ward` (
  ward_id INT auto_increment,
  ward_name VARCHAR(255) NOT NULL,
  district_id INT,
  manager_id INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (ward_id),
  FOREIGN KEY (district_id) REFERENCES district(district_id),
  FOREIGN KEY (manager_id) REFERENCES `user`(user_id)
);
CREATE TABLE `board_type` (
  `board_type_id` INT PRIMARY KEY AUTO_INCREMENT,
  `type_name` VARCHAR(255),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `advertisement_type` (
  `advertisement_type_id` INT PRIMARY KEY AUTO_INCREMENT,
  `type_name` VARCHAR(255),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO board_type (type_name) VALUES
  ('Bảng hiflex ốp tường'),
  ('Màn hình điện tử ốp tường'),
  ('Trung tâm thương mại');

INSERT INTO advertisement_type (type_name) VALUES
  ('Cổ động chính trị'),
  ('Quảng cáo thương mại'),
  ('Xã hội hoá');

-- Tạo bảng contract
CREATE TABLE `contract` (
  contract_id INT auto_increment,
  company_name VARCHAR(255),
  company_email VARCHAR(255),
  company_phone VARCHAR(255),
  company_address VARCHAR(255),
  company_taxcode VARCHAR(255),
  start_date DATE,
  end_date DATE,
  representative VARCHAR(255),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (contract_id)
);

-- Tạo bảng AdvertisingPoints CHÚ Ý LẠI CÁI NÀY
CREATE TABLE `advertising_point` (
  point_id INT auto_increment,
  ward_id INT,
  advertisement_type_id INT,
  location_type 
  ENUM('Đất công/Công viên/Hành lang an toàn giao thông', 'Đất tư nhân/Nhà ở riêng lẻ', 'Trung tâm thương mại', 'Chợ', 'Cây xăng', 'Nhà chờ xe buýt'),
  image_url VARCHAR(255),
  `lat` double,
  `lng` double,
  is_planning BOOLEAN,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (point_id),
  FOREIGN KEY (ward_id) REFERENCES ward(ward_id),
  FOREIGN KEY (advertisement_type_id) REFERENCES advertisement_type(advertisement_type_id)
);

-- Tạo bảng report_types
CREATE TABLE `report_type` (
  `report_type_id` INT PRIMARY KEY AUTO_INCREMENT,
  `report_type_name` VARCHAR(255),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO report_type (report_type_name) VALUES
  ('Tố giác sai phạm'),
  ('Đăng ký nội dung'),
  ('Đóng góp ý kiến');

-- Tạo bảng Details
CREATE TABLE `detail` (
  detail_id INT auto_increment,
  report_content VARCHAR(255),
  image_url_1 VARCHAR(255),
  image_url_2 VARCHAR(255),
  width FLOAT,
  height FLOAT,
  `lat` double,
  `lng` double,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (detail_id)
);



-- Tạo bảng AdvertisingBoards
CREATE TABLE `advertising_board` (
  board_id INT auto_increment,
  board_type_id INT,
  advertisement_content VARCHAR(255),
  advertisement_image_url VARCHAR(255),
  width FLOAT,
  height FLOAT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  point_id INT,
  PRIMARY KEY (board_id),
 --  FOREIGN KEY (`licensing_id`) REFERENCES `licensing_request`(`licensing_id`),
  FOREIGN KEY (`board_type_id`) REFERENCES `board_type`(`board_type_id`),
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`)
);

CREATE TABLE `report` (
  `report_id` INT auto_increment,
  `report_time` VARCHAR(255),
  `processing_info` VARCHAR(255),
  `fullname_rp` VARCHAR(255),
  `email_rp` VARCHAR(255),
  `phone_rp` VARCHAR(255),
  `status` VARCHAR(255),
  `detail_id` INT,
  `report_type_id` INT, 
  point_id INT DEFAULT NULL,
  board_id INT DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  FOREIGN KEY (`report_type_id`) REFERENCES `report_type`(`report_type_id`),
  FOREIGN KEY (`detail_id`) REFERENCES `detail`(`detail_id`),
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`),
  FOREIGN KEY (`board_id`) REFERENCES `advertising_board`(`board_id`)
);

-- Tạo bảng LicensingRequests với các khóa ngoại tham chiếu
CREATE TABLE `licensing_request` (
  licensing_id INT auto_increment,
  advertisement_content VARCHAR(255),
  advertisement_image_url VARCHAR(255),
  `status` varchar(255) NOT null,
  rejection_reason VARCHAR(255),
  user_id INT,
  point_id INT,
  width FLOAT,
  height FLOAT,
  contract_id INT,
  report_id INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (licensing_id),
  FOREIGN KEY (contract_id) REFERENCES contract(contract_id),
  FOREIGN KEY (report_id) REFERENCES report(report_id),
  FOREIGN KEY (user_id) REFERENCES `user`(user_id)
);

CREATE TABLE `edit_request_board` (
  id INT auto_increment,
  board_id INT,
  board_type_id INT,
  edit_status ENUM('pending', 'approved','canceled'),
  advertisement_content VARCHAR(255),
  advertisement_image_url VARCHAR(255),
  request_time DATETIME,
  reason VARCHAR(255),
  width FLOAT,
  height FLOAT,
  created_by INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (board_id) REFERENCES advertising_board(board_id),
  FOREIGN KEY (`board_type_id`) REFERENCES `board_type`(`board_type_id`),
  FOREIGN KEY (created_by) REFERENCES `user`(user_id)
);

CREATE TABLE `edit_request_point` (
  id INT auto_increment,
  point_id INT,
  advertisement_type_id INT,
  location_type VARCHAR(255),
  is_planning BOOLEAN,
  image_url VARCHAR(255),
  edit_status ENUM('pending', 'approved','canceled'),
  request_time DATETIME,
  reason VARCHAR(255),
  created_by INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES `user`(user_id),
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`),
  FOREIGN KEY (advertisement_type_id) REFERENCES advertisement_type(advertisement_type_id)
);

-- Dữ liệu mẫu cho bảng User
INSERT INTO `user` (username, `password`, email, phone, dob, user_type, created_by, updated_by)
VALUES
  ('admin', 'admin123', 'admin@example.com', '123456789', '1990-01-01', 'admin', NULL, NULL),
  ('manager1', 'manager123', 'manager1@example.com', '987654321', '1995-05-15', 'manager', 1, 1),
  ('manager2', 'manager456', 'manager2@example.com', '987123456', '1998-10-20', 'manager', 1, 1),
  ('user1', 'user123', 'user1@example.com', '111222333', '2000-03-05', 'user', 2, 2),
  ('user2', 'user456', 'user2@example.com', '444555666', '2002-08-12', 'user', 2, 2);

-- Dữ liệu mẫu cho bảng District
INSERT INTO `district` (district_name, manager_id)
VALUES
  ('District A', 2),
  ('District B', 3);

-- Dữ liệu mẫu cho bảng Ward
INSERT INTO `ward` (ward_name, district_id, manager_id)
VALUES
  ('Ward 1', 1, 2),
  ('Ward 2', 1, 2),
  ('Ward 3', 2, 3);

-- Dữ liệu mẫu cho bảng BoardType và AdvertisementType
-- (Đã có dữ liệu mẫu trong đoạn tạo bảng)

-- Dữ liệu mẫu cho bảng Contract
INSERT INTO `contract` (company_name, company_email, company_phone, company_address,company_taxcode, start_date, end_date, representative)
VALUES
  ('Company A', 'companyA@example.com', '123456789', 'Address A','123456', '2023-01-01', '2023-12-31', 'Rep A'),
  ('Company B', 'companyB@example.com', '987654321', 'Address B', '122333','2023-03-01', '2023-12-31', 'Rep B');

-- Dữ liệu mẫu cho bảng AdvertisingPoint
INSERT INTO `advertising_point` (ward_id, advertisement_type_id, location_type, image_url, `lat`, `lng`, is_planning)
VALUES
  (1, 1, 'Đất công/Công viên/Hành lang an toàn giao thông', 'urlA.jpg', 10.0, 20.0, false),
  (2, 2, 'Đất tư nhân/Nhà ở riêng lẻ', 'urlB.jpg', 15.0, 25.0, true);

-- Dữ liệu mẫu cho bảng ReportType
-- (Đã có dữ liệu mẫu trong đoạn tạo bảng)

-- Dữ liệu mẫu cho bảng Detail
INSERT INTO `detail` (report_content, image_url_1, image_url_2, width, height, `lat`, `lng`)
VALUES
  ('Content A', 'img1A.jpg', 'img2A.jpg', 30.0, 40.0, 12.0, 22.0),
  ('Content B', 'img1B.jpg', 'img2B.jpg', 35.0, 45.0, 18.0, 28.0);

-- Dữ liệu mẫu cho bảng AdvertisingBoard
INSERT INTO `advertising_board` (board_type_id, advertisement_content, advertisement_image_url, width, height, point_id)
VALUES
  (1, 'Ad Content A', 'adImgA.jpg', 50.0, 60.0, 1),
  (2, 'Ad Content B', 'adImgB.jpg', 55.0, 65.0, 2);

-- Dữ liệu mẫu cho bảng Report
INSERT INTO `report` (report_time, processing_info, fullname_rp, email_rp, phone_rp, `status`, detail_id, report_type_id, point_id, board_id)
VALUES
  ('2023-01-15', 'Processing A', 'John Doe', 'john@example.com', '111222333', 'Pending', 1, 1, 1, NULL),
  ('2023-02-20', 'Processing B', 'Jane Doe', 'jane@example.com', '444555666', 'Approved', 2, 2, NULL, 1);

-- Dữ liệu mẫu cho bảng LicensingRequest
INSERT INTO `licensing_request` (advertisement_content, advertisement_image_url, `status`, rejection_reason, user_id, point_id, width, height, contract_id, report_id)
VALUES
  ('License Content A', 'licenseImgA.jpg', 'Approved', NULL, 4, 1, 50.0, 60.0, 1, 1),
  ('License Content B', 'licenseImgB.jpg',  'Pending', NULL, 5, 2, 55.0, 65.0, 2, 2);

-- Dữ liệu mẫu cho bảng EditRequestBoard
INSERT INTO `edit_request_board` (board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, request_time, reason, width, height, created_by)
VALUES
  (1, 1, 'pending', 'Edit Content A', 'editImgA.jpg', '2023-03-01', 'Change request A', 60.0, 70.0, 4),
  (2, 2, 'approved', 'Edit Content B', 'editImgB.jpg', '2023-04-05', 'Change request B', 65.0, 75.0, 5);

-- Dữ liệu mẫu cho bảng EditRequestPoint
INSERT INTO `edit_request_point` (point_id, advertisement_type_id, location_type, is_planning, image_url, edit_status, request_time, reason, created_by)
VALUES
  (1, 1, 'Chợ', false, 'editPointImgA.jpg', 'pending', '2023-03-10', 'Change request A', 4),
  (2, 2, 'Cây xăng', true, 'editPointImgB.jpg', 'approved', '2023-04-15', 'Change request B', 5);




