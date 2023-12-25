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
   `status` ENUM(
            'pending',
            'processing',
            'processed'
            ),
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
  reason VARCHAR(255),
  time_request date,
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
  reason VARCHAR(255),
  time_request date,
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
  ('Nguyen Van A', 'manager123', 'manager1@example.com', '987654321', '1995-05-15', 'manager', 1, 1),
  ('Tran Anh B', 'manager456', 'manager2@example.com', '987123456', '1998-10-20', 'manager', 1, 1),
  ('Tran Anh Phuong', 'manager456', 'anhphuong@example.com', '987123456', '1991-10-20', 'manager', 1, 1),
  ('Tran Thi Hong', 'manager456', 'thihong@example.com', '987123456', '1998-10-20', 'manager', 1, 1),
  ('Tran Hong', 'manager456', 'tranhong@example.com', '987123456', '1990-10-20', 'manager', 1, 1),
  ('Tran Anh Hoang', 'manager456', 'anhhoang@example.com', '987123456', '1992-10-20', 'manager', 1, 1),
  ('Tran Kim Hong', 'manager456', 'kimhong@example.com', '987123456', '1999-10-20', 'manager', 1, 1),
  ('Tran Kim Phuong', 'manager456', 'kimphuong@example.com', '987123456', '1998-10-20', 'manager', 1, 1),
  ('Tran Anh Thanh', 'manager456', 'anhthanh@example.com', '987123456', '1995-10-20', 'manager', 1, 1),
  ('Tran Phi Long', 'manager456', 'philong@example.com', '987123456', '1998-10-20', 'manager', 1, 1),
  ('Tran Anh Tuan', 'manager456', 'anhtuan@example.com', '987123456', '1998-11-20', 'manager', 1, 1),
  ('Tran Y Nhu', 'manager456', 'ynhu@example.com', '987123456', '1992-10-21', 'manager', 1, 1),
  ('Tran Tuan Anh', 'manager456', 'tuananh@example.com', '987123456', '1998-01-20', 'manager', 1, 1),
  ('Nguyen Thien Toan', 'manager456', 'thientoan@example.com', '987123456', '1996-05-20', 'manager', 1, 1);

-- Dữ liệu mẫu cho bảng District
INSERT INTO `district` (district_name, manager_id)
VALUES
  ('Quận 5', 2),
  ('Quận 8', 4),
  ('Quận 1', 3);

-- Dữ liệu mẫu cho bảng Ward
INSERT INTO `ward` (ward_name, district_id, manager_id)
VALUES
  ('Phường 1', 1, 5),
  ('Phường 2', 1, 6),
  ('Phường 3', 1, 7),
  ('Phường 4', 1, 8),
  ('Phường Bến Thành', 3, 9),
  ('Phường Cô Giang', 3, 10),
  ('Phường Cầu Kho', 3, 8),
  ('Phường Bến Nghé', 3, 9), 
  ('Phường 1', 2, 11),
  ('Phường 2', 2, 11),
  ('Phường 3', 2, 11),
  ('Phường 4', 2, 11);

-- Dữ liệu mẫu cho bảng BoardType và AdvertisementType
-- (Đã có dữ liệu mẫu trong đoạn tạo bảng)

-- Dữ liệu mẫu cho bảng Contract
INSERT INTO `contract` (company_name, company_email, company_phone, company_address, start_date, end_date, representative)
VALUES
  ('Company A', 'companyA@example.com', '123456789', 'Address A', '2023-01-01', '2023-12-31', 'Rep A'),
  ('Company B', 'companyB@example.com', '987654321', 'Address B', '2023-03-01', '2023-12-31', 'Rep B');

-- Dữ liệu mẫu cho bảng AdvertisingPoint
INSERT INTO `advertising_point` (ward_id, advertisement_type_id, location_type, image_url, `lat`, `lng`, is_planning)
VALUES
  (1, 1, 'Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fpexels-david-geib-3220846.jpgd31e8cb4-b0eb-4c79-8668-4dcb93005aa3?alt=media&token=38790acd-3bbb-43c4-a96f-4e888211153a', 10.774169935024586, 106.68138370731906, false),
  (2, 3, 'Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Street-Column-Advertising-Mockup-PSD.jpege1e620af-64ec-466f-aa84-5d062a7341e7?alt=media&token=95e9ee75-1837-4a3b-b9fa-e8da8c113cb7', 10.774000776305687, 106.7003532360378, false),
  (1, 1, 'Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fcoca.jpeg94004bd8-6df6-4c65-86ef-de2e60369249?alt=media&token=ee6ae96b-e063-4b77-bc26-b1b8333d44fc', 10.774000776305687, 106.7003532360378, false),
  (2, 2, 'Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.771555801561192, 106.69241320726378, true);

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
  ('2023-01-15', 'Processing A', 'John Doe', 'john@example.com', '111222333', 'pending', 1, 1, 1, NULL),
  ('2023-02-20', 'Processing B', 'Jane Doe', 'jane@example.com', '444555666', 'pending', 2, 2, NULL, 1);

-- Dữ liệu mẫu cho bảng LicensingRequest
INSERT INTO `licensing_request` (advertisement_content, advertisement_image_url, `status`, rejection_reason, user_id, point_id, width, height, contract_id, report_id)
VALUES
  ('License Content A', 'licenseImgA.jpg', 'Approved', NULL, 4, 1, 50.0, 60.0, 1, 1),
  ('License Content B', 'licenseImgB.jpg', 'Pending', NULL, 5, 2, 55.0, 65.0, 2, 2);

-- Dữ liệu mẫu cho bảng EditRequestBoard
INSERT INTO `edit_request_board` (board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, reason,time_request, width, height, created_by)
VALUES
  (1, 1, 'pending', 'Edit Content A', 'editImgA.jpg', 'Change request A', '2023-12-24', 10.0, 8.0, 4),
  (1, 1, 'canceled', 'Edit Content A', 'editImgA.jpg', 'Change request A','2023-12-21', 6.0, 7.0, 4),
  (2, 2, 'approved', 'Edit Content B', 'editImgB.jpg', 'Change request B','2023-12-20', 20.0, 10.0, 5);

-- Dữ liệu mẫu cho bảng EditRequestPoint
INSERT INTO `edit_request_point` (point_id, advertisement_type_id, location_type, is_planning, image_url, edit_status, reason, time_request, created_by)
VALUES
  (1, 1, 'Chợ', false, 'editPointImgA.jpg', 'pending', 'Change request A','2023-12-20', 4),
  (1, 1, 'Trung tâm thương mại', false, 'editPointImgC.jpg', 'approved', 'Change request C','2023-11-25', 6),
  (1, 1, 'Chợ', false, 'editPointImgD.jpg', 'canceled', 'Change request D','2023-12-25', 7),
  (1, 1, 'Cây xăng', true, 'editPointImgB.jpg', 'approved', 'Change request B','2023-11-25', 5);




