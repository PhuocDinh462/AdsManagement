use wnc_project;

DROP TABLE IF EXISTS `edit_request_point`;
DROP TABLE IF EXISTS `edit_request_board`;
DROP TABLE IF EXISTS `licensing_request`;
DROP TABLE IF EXISTS `report`;
DROP TABLE IF EXISTS `advertising_board`;
DROP TABLE IF EXISTS `advertisement_type`;
DROP TABLE IF EXISTS `detail`;
DROP TABLE IF EXISTS `report_type`;
DROP TABLE IF EXISTS `advertising_point`;
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
  location_type VARCHAR(255),
  image_url VARCHAR(255),
  `lat` double,
  `lng` double,
  is_planning BOOLEAN,
  ward_id INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (point_id),
  FOREIGN KEY (ward_id) REFERENCES ward(ward_id)
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
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (detail_id)
);

CREATE TABLE `advertisement_type` (
  `board_type_id` INT PRIMARY KEY AUTO_INCREMENT,
  `type_name` VARCHAR(255),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO advertisement_type (type_name) VALUES
  ('Bảng hiflex ốp tường'),
  ('Màn hình điện tử ốp tường'),
  ('Trung tâm thương mại');

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
  FOREIGN KEY (`board_type_id`) REFERENCES `advertisement_type`(`board_type_id`),
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
  request_time DATETIME,
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
  edit_status varchar(255),
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
  FOREIGN KEY (`board_type_id`) REFERENCES `advertisement_type`(`board_type_id`),
  FOREIGN KEY (created_by) REFERENCES `user`(user_id)
);

CREATE TABLE `edit_request_point` (
  id INT auto_increment,
  location_type VARCHAR(255),
  is_planning BOOLEAN,
  image_url VARCHAR(255),
  point_id INT,
  edit_status varchar(255),
  request_time DATETIME,
  reason VARCHAR(255),
  created_by INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES `user`(user_id),
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`)
);

-- Insert sample data into the `user` table
INSERT INTO `user` (username, `password`, email, phone, dob, user_type, created_by, updated_by)
VALUES
  ('admin', 'admin123', 'admin@example.com', '123456789', '1990-01-01', 'admin', NULL, NULL),
  ('manager1', 'manager123', 'manager1@example.com', '987654321', '1985-05-15', 'manager', 1, 1),
  ('manager2', 'manager456', 'manager2@example.com', '654321987', '1988-09-22', 'manager', 1, 1);
  -- Add more users as needed;

-- Insert sample data into the `district` table
INSERT INTO `district` (district_name, manager_id)
VALUES
  ('District A', 2),
  ('District B', 3);
  -- Add more districts as needed;

-- Insert sample data into the `ward` table
INSERT INTO `ward` (ward_name, district_id, manager_id)
VALUES
  ('Ward 1', 1, 2),
  ('Ward 2', 1, 2),
  ('Ward 3', 2, 3);
  -- Add more wards as needed;

-- Insert sample data into the `contract` table
INSERT INTO `contract` (company_name, company_email, company_phone, company_address, start_date, end_date, representative)
VALUES
  ('ABC Company', 'abc@example.com', '123456789', '123 Main St', '2023-01-01', '2023-12-31', 'John Doe'),
  ('XYZ Company', 'xyz@example.com', '987654321', '456 Oak St', '2023-02-01', '2023-11-30', 'Jane Smith');
  -- Add more contracts as needed;

-- Insert sample data into the `advertising_point` table
INSERT INTO `advertising_point` (location_type, image_url, `lat`, `lng`, is_planning, ward_id)
VALUES
  ('Park', 'park_image.jpg', 10.12345, 20.54321, true, 1),
  ('Shopping Mall', 'mall_image.jpg', 15.67890, 25.09876, false, 2);
  -- Add more advertising points as needed;

-- Insert sample data into the `report_type` table
INSERT INTO `report_type` (report_type_name)
VALUES
  ('Complaint'),
  ('Suggestion');
  -- Add more report types as needed;

-- Insert sample data into the `detail` table
INSERT INTO `detail` (report_content, image_url_1, image_url_2, width, height)
VALUES
  ('Details for report 1', 'image1.jpg', 'image2.jpg', 800, 600),
  ('Details for report 2', 'image3.jpg', 'image4.jpg', 1024, 768);
  -- Add more details as needed;

-- Insert sample data into the `advertisement_type` table
INSERT INTO `advertisement_type` (type_name)
VALUES
  ('Hiflex Wall Board'),
  ('LED Wall Display');
  -- Add more advertisement types as needed;

-- Insert sample data into the `advertising_board` table
INSERT INTO `advertising_board` (board_type_id, advertisement_content, advertisement_image_url, width, height, point_id)
VALUES
  (1, 'Ad content 1', 'ad_image1.jpg', 800, 600, 1),
  (2, 'Ad content 2', 'ad_image2.jpg', 1024, 768, 2);
  -- Add more advertising boards as needed;

-- Insert sample data into the `report` table
INSERT INTO `report` (report_time, processing_info, fullname_rp, email_rp, phone_rp, status, detail_id, report_type_id, point_id, board_id)
VALUES
  ('2023-03-15', 'Processing...', 'John Doe', 'john@example.com', '123456789', 'Pending', 1, 1, 1, NULL),
  ('2023-03-20', 'Processed', 'Jane Smith', 'jane@example.com', '987654321', 'Approved', 2, 2, NULL, 2);
  -- Add more reports as needed;

-- Insert sample data into the `licensing_request` table
INSERT INTO `licensing_request` (advertisement_content, advertisement_image_url, request_time, `status`, rejection_reason, user_id, point_id, width, height, contract_id, report_id)
VALUES
  ('Ad content request 1', 'request_image1.jpg', '2023-04-01', 'Pending', NULL, 1, 1, 800, 600, 1, NULL),
  ('Ad content request 2', 'request_image2.jpg', '2023-04-05', 'Approved', NULL, 2, 2, 1024, 768, 2, NULL);
  -- Add more licensing requests as needed;

-- Insert sample data into the `edit_request_board` table
INSERT INTO `edit_request_board` (board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, request_time, reason, width, height, created_by)
VALUES
  (1, 1, 'Pending', 'Edited content 1', 'edited_image1.jpg', '2023-05-01', 'Content update', 800, 600, 1),
  (2, 2, 'Approved', 'Edited content 2', 'edited_image2.jpg', '2023-05-05', 'Image enhancement', 1024, 768, 2);
  -- Add more edit requests for boards as needed;

-- Insert sample data into the `edit_request_point` table
-- Chèn dữ liệu mẫu vào bảng `edit_request_point`
INSERT INTO `edit_request_point` (location_type, is_planning, image_url, point_id, edit_status, request_time, reason, created_by)
VALUES
  ('Updated Park', false, 'updated_park_image.jpg', 1, 'Pending', '2023-06-01', 'Park renovation', 1),
  ('Revised Mall', true, 'revised_mall_image.jpg', 2, 'Approved', '2023-06-05', 'Planning update', 2);
-- Đảm bảo rằng các giá trị sử dụng trong cột created_by tồn tại trong bảng user






