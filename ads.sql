use wnc_project;


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
  request_time TIMESTAMP,
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
  request_time TIMESTAMP,
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
  request_time TIMESTAMP,
  reason VARCHAR(255),
  created_by INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES `user`(user_id),
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`)
);





