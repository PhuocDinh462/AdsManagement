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
  manager_id INT ,
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
  FOREIGN KEY (district_id) REFERENCES district(district_id) ON DELETE CASCADE,
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
  address VARCHAR(255),
  location_type 
  ENUM('Đất công/Công viên/Hành lang an toàn giao thông', 'Đất tư nhân/Nhà ở riêng lẻ', 'Trung tâm thương mại', 'Chợ', 'Cây xăng', 'Nhà chờ xe buýt'),
  image_url VARCHAR(255),
  `lat` double,
  `lng` double,
  is_planning BOOLEAN,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (point_id),
  FOREIGN KEY (ward_id) REFERENCES ward(ward_id) ON DELETE SET NULL,
  FOREIGN KEY (advertisement_type_id) REFERENCES advertisement_type(advertisement_type_id) ON DELETE SET NULL
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
  FOREIGN KEY (`board_type_id`) REFERENCES `board_type`(`board_type_id`) ON DELETE SET NULL,
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`) ON DELETE SET NULL
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
  FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`report_type_id`) ON DELETE SET NULL,
  FOREIGN KEY (`detail_id`) REFERENCES `detail`(`detail_id`) ON DELETE SET NULL,
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`) ON DELETE SET NULL,
  FOREIGN KEY (`board_id`) REFERENCES `advertising_board`(`board_id`) ON DELETE SET NULL
);

-- Tạo bảng LicensingRequests với các khóa ngoại tham chiếu
CREATE TABLE `licensing_request` (
  licensing_id INT auto_increment,
  advertisement_content VARCHAR(255),
  advertisement_image_url VARCHAR(255),
  `status` ENUM('pending', 'approved','canceled') NOT null ,
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
  FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ON DELETE SET NULL,
  FOREIGN KEY (report_id) REFERENCES report(report_id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE SET NULL
);

CREATE TABLE `edit_request_board` (
  id INT auto_increment,
  board_id INT,
  board_type_id INT,
  edit_status ENUM('pending', 'approved','canceled'),
  advertisement_content VARCHAR(255),
  advertisement_image_url VARCHAR(255),
  reason VARCHAR(255),
  request_time date,
  width FLOAT,
  height FLOAT,
  created_by INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (board_id) REFERENCES advertising_board(board_id) ON DELETE SET NULL,
  FOREIGN KEY (`board_type_id`) REFERENCES `board_type`(`board_type_id`) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES `user`(user_id) ON DELETE SET NULL
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
  request_time date,
  created_by INT,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES `user`(user_id) ON DELETE SET NULL,
  FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`) ON DELETE CASCADE,
  FOREIGN KEY (advertisement_type_id) REFERENCES advertisement_type(advertisement_type_id) ON DELETE SET NULL
);

-- Dữ liệu mẫu cho bảng User
INSERT INTO `user` (username, `password`, email, phone, dob, user_type, created_by, updated_by)
VALUES
  ('admin', 'admin123', 'admin@example.com', '123456789', '1990-01-01', 'admin', NULL, NULL),
  ('Nguyen Van A', 'manager123', 'manager1@example.com', '987654321', '1995-05-15', 'district', 1, 1),
  ('Tran Anh B', 'manager456', 'manager2@example.com', '987123456', '1998-10-20', 'district', 1, 1),
  ('Tran Anh Phuong', 'manager456', 'anhphuong@example.com', '987123456', '1991-10-20', 'district', 1, 1),
  ('Tran Thi Hong', 'manager456', 'thihong@example.com', '987123456', '1998-10-20', 'ward', 1, 1),
  ('Tran Hong', 'manager456', 'tranhong@example.com', '987123456', '1990-10-20', 'ward', 1, 1),
  ('Tran Anh Hoang', 'manager456', 'anhhoang@example.com', '987123456', '1992-10-20', 'ward', 1, 1),
  ('Tran Kim Hong', 'manager456', 'kimhong@example.com', '987123456', '1999-10-20', 'ward', 1, 1),
  ('Tran Kim Phuong', 'manager456', 'kimphuong@example.com', '987123456', '1998-10-20', 'ward', 1, 1),
  ('Tran Anh Thanh', 'manager456', 'anhthanh@example.com', '987123456', '1995-10-20', 'ward', 1, 1),
  ('Tran Phi Long', 'manager456', 'philong@example.com', '987123456', '1998-10-20', 'ward', 1, 1),
  ('Tran Anh Tuan', 'manager456', 'anhtuan@example.com', '987123456', '1998-11-20', 'ward', 1, 1),
  ('Tran Y Nhu', 'manager456', 'ynhu@example.com', '987123456', '1992-10-21', 'ward', 1, 1),
  ('Tran Tuan Anh', 'manager456', 'tuananh@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Ha Anh Tuan', 'manager456', 'haanhtuan@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Tanq Ngoc Chau Nhi', 'manager456', 'chaunhi@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Tran Sy Hung', 'manager456', 'syhung@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Pham Bang Bang', 'manager456', 'bangbang@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Nguyen Thanh Tung', 'manager456', 'thanhtung@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Dam Vinh Hung', 'manager456', 'damvinhhung@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Vo Vu Truong Giang', 'manager456', 'truonggiang@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Le Hong Ngoc', 'manager456', 'lehongngoc@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Lam Vy Da', 'manager456', 'vyda@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Phan Le Vi Thanh', 'manager456', 'cris7@example.com', '987123456', '1998-01-20', 'ward', 1, 1),
  ('Nguyen Thien Toan', 'manager456', 'thientoan@example.com', '987123456', '1996-05-20', 'ward', 1, 1);

-- Dữ liệu mẫu cho bảng District
INSERT INTO `district` (district_name, manager_id)
VALUES
  ('Quận 5', 2),
  ('Quận 8', 4),
  ('Quận 1', 3);

-- Dữ liệu mẫu cho bảng Ward
INSERT INTO `ward` (ward_name, district_id, manager_id)
VALUES
  ('Phường Bến Thành', 3, 1),
  ('Phường Cô Giang', 3, 10),
  ('Phường Cầu Kho', 3, 8),
  ('Phường Bến Nghé', 3, 9), 
  ('Phường 1', 1, 5),
  ('Phường 2', 1, 6),
  ('Phường 3', 1, 7),
  ('Phường 4', 1, 15),
  ('Phường 1', 2, 11),
  ('Phường 2', 2, 12),
  ('Phường 3', 2, 13),
  ('Phường 4', 2, 14);

-- Dữ liệu mẫu cho bảng BoardType và AdvertisementType
-- (Đã có dữ liệu mẫu trong đoạn tạo bảng)

-- Dữ liệu mẫu cho bảng Contract
INSERT INTO `contract` (company_name, company_email, company_phone, company_address,company_taxcode, start_date, end_date, representative)
VALUES
  ('Company A', 'companyA@example.com', '123456789', 'Address A','123456', '2023-01-01', '2023-12-31', 'Rep A'),
  ('Company B', 'companyB@example.com', '987654321', 'Address B', '122333','2023-03-01', '2023-12-31', 'Rep B');

-- Dữ liệu mẫu cho bảng AdvertisingPoint
INSERT INTO `advertising_point` (ward_id, advertisement_type_id, address, location_type, image_url, `lat`, `lng`, is_planning)
VALUES
  (1, 1, '117-115 Đ. Nguyễn Du, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam', 'Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fpexels-david-geib-3220846.jpgd31e8cb4-b0eb-4c79-8668-4dcb93005aa3?alt=media&token=38790acd-3bbb-43c4-a96f-4e888211153a', 10.773557545517933, 106.69448664500696, false),
  (1, 3, 'Bến Thành, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam', 'Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Street-Column-Advertising-Mockup-PSD.jpege1e620af-64ec-466f-aa84-5d062a7341e7?alt=media&token=95e9ee75-1837-4a3b-b9fa-e8da8c113cb7', 10.774477837706945, 106.69554860577976, false),
  (1, 1, '8 Thủ Khoa Huân, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam', 'Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fcoca.jpeg94004bd8-6df6-4c65-86ef-de2e60369249?alt=media&token=ee6ae96b-e063-4b77-bc26-b1b8333d44fc', 10.773287803727186, 106.69758468171688, false),
  (1, 2, '6 Huyền Trân Công Chúa, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.775018678900556, 106.69583583527508, true),
  (1, 2, '139 Đ. Nguyễn Du, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.772763316554093, 106.69374979259123, true),
  
  (2, 2, 'Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Chợ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.764089825704806, 106.69382697031256, true),
  (2, 2, '185-171 Đ. Cô Bắc, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam', 'Cây xăng', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.76260180395761, 106.69202970553981, false),
  (2, 2, '121-81 Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.763295833627492, 106.69508166353674, false),
  (2, 2, '100/0 Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Trung tâm thương mại', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.763202030203516, 106.694321522979, true),
  
  (3, 2, 'Hẻm 391 Trần Hưng Đạo, Cầu Kho, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.759551792108674, 106.68895113745646, true),
  (3, 2, 'Hẻm 393, Cầu Kho, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.759527954863646, 106.68819286225688, false),
  (3, 2, '32 Đ. Trần Hưng Đạo, Cầu Kho, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.759182300974503, 106.68782889076304, true),
  
  (4, 2, '33 Đ. Nguyễn Du, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Cây xăng', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.78263195002901, 106.70178179891825, true),
  (4, 2, 'Đ. Nguyễn Du, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.784403770238747, 106.70343169421437, false),
  (4, 2, 'Đ. Tôn Đức Thắng, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.782604442626198, 106.70557093039417, true),  
  (4, 2, '18 Đ. Nguyễn Siêu, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.780887508168815, 106.70743052678033, true),
  (4, 2, '28-32 Lê Văn Hưu, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.782232969987437, 106.70040196122936, true),
  
  (5, 2, 'Đ. Nguyễn Biểu, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.754528849095365, 106.68411604272457, true),  
  (5, 2, '907-903 Đ. Trần Hưng Đạo, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Cây xăng', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.754717666981415, 106.67913706759444, true),
  (5, 2, 'Chung cư Phúc Thịnh, 341 Đ. Cao Đạt, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.75323625849358, 106.6800757170383, false),
  (5, 2, '317 Đ. Cao Đạt, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.75381890951151, 106.68073192761604, false),  
  (5, 2, '86-114 Đ. Trần Bình Trọng, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.755261819648139, 106.68150443949514, true),
  
  (6, 2, 'Hẻm 233 Nguyễn Trãi, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.75663031647467, 106.67706286932429, false),  
  (6, 2, 'Huỳnh Mẫn Đạt/34 Hẻm 92, Khu phố 6, Quận 5, Thành phố Hồ Chí Minh, Việt Nam', 'Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.75608110554023, 106.67715193917813, true),
  (6, 2, '4-58 Đ. Lê Hồng Phong, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Chợ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.755820730410948, 106.67860949724485, true),
  (6, 2, '58 Đ. Lê Hồng Phong, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.755734069901376, 106.67866789301668, true),  
  (6, 2, '95-85 Phan Văn Trị, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.757329018572866, 106.68313724791697, true),
  
  (7, 2, '217-189 Huỳnh Mẫn Đạt, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.757851378971724, 106.6757593607054, true),  
  (7, 2, '152 Huỳnh Mẫn Đạt, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.757273818884698, 106.67607262997986, true),
  (7, 2, '256 Đ. Nguyễn Trãi, Phường 3, Quận 5, Thành phố Hồ Chí Minh 100000, Việt Nam', 'Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.757438278679597, 106.6771133545359, false),
  (7, 2, '217-189 Huỳnh Mẫn Đạt, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Chợ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.75797205545914, 106.6757029179611, true),  
  (7, 2, '176 Đ. Trần Bình Trọng, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.759264285847065, 106.68032975751856, true),
  
  (8, 2, '240-204 Đ. Trần Bình Trọng, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Chợ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.761620563828691, 106.67938109316296, true),  
  (8, 2, '220-238 Đ. Trần Bình Trọng, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.761225167230146, 106.67955025989906, true),
  (8, 2, '85 Đ. Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh 700000, Việt Nam', 'Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.761145804555388, 106.67781654948834, true),
  (8, 2, '212-240 Đ. Lê Hồng Phong, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Việt Nam', 'Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.760464751904083, 106.6771766047319, true),  
  (8, 2, '210 Đ. Lê Hồng Phong, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.75958339452077, 106.67748496309471, false),
  
  (9, 2, '52 Phạm Thế Hiển, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.75053580051193, 106.68855907411607, true),  
  (9, 2, '141 D. Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.747725645605072, 106.68892415914593, true),
  (9, 2, 'Hẻm 219 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Chợ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.746368809341359, 106.68928281672004, true),
  (9, 2, '456-355 D. Bá Trạc, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.741872775609895, 106.68847882589102, false),  
  (9, 2, '374 Hẻm 288 D. Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.744192003533188, 106.69034231792875, false),
  
  (10, 2, '83-41 Đ. Dạ Nam, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.749172758854053, 106.68570872725917, true),  
  (10, 2, 'D. Bá Trạc, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.749500210660884, 106.68802852720496, true),
  (10, 2, '51 Hẻm 47 Nguyễn Thị Tần, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.748175631484312, 106.68597368425162, false),
  (10, 2, '47 Nguyễn Thị Tần, Phường 2, Quận 8, Thành phố Hồ Chí Minh 70000, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.747966270502895, 106.6853563780479, true),  
  (10, 2, 'Lô F Nguyễn Thị Tần, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.747150696826662, 106.68666825986077, false),
  
  (11, 2, '2-7 Đ. Âu Dương Lân, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.748219754143781, 106.68183880884358, true),  
  (11, 2, '306 Phạm Thế Hiển, Phường 3, 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.748636843507814, 106.68254375143715, true),
  (11, 2, '28, 46 Đ. Âu Dương Lân, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Chợ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.747335253251334, 106.68215567587563, false),
  (11, 2, 'Hẻm 451 Phạm Thế Hiển, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.747493918756918, 106.6804436121384, true),  
  (11, 2, '22/10 Phạm Thế Hiển, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.748379271319354, 106.68427660876355, true),
  
  (12, 2, '30-68 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.743028323620706, 106.67636312275546, true),  
  (12, 2, '78-82 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Chợ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.742153337641415, 106.6768169843276, false),
  (12, 2, '30-68 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất công/Công viên/Hành lang an toàn giao thông', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.743266147522215, 106.67631689953923, true),
  (12, 2, 'Hẻm 23 Đ. Hồ Thành Biên, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Đất tư nhân/Nhà ở riêng lẻ', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.741718414034755, 106.67337103029278, true),  
  (12, 2, '90 Đ. 102 Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam','Nhà chờ xe buýt', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 10.740345755662574, 106.67561085849688, true);

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
  (1, 'Ad Content A', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F3CD5A2AF-685B-4291-8EDF-FE84B7C397E5.JPGbab08c1e-c9a6-4c22-a95e-e4e45f3f9f3b?alt=media&token=8bd87c2b-20c1-43a8-8bec-a83e1fc56ee1', 50.0, 60.0, 1),
  (2, 'Ad Content B', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 55.0, 65.0, 2);

-- Dữ liệu mẫu cho bảng Report
INSERT INTO `report` (report_time, processing_info, fullname_rp, email_rp, phone_rp, `status`, detail_id, report_type_id, point_id, board_id)
VALUES
  ('2023-01-15', 'Processing A', 'John Doe', 'john@example.com', '111222333', 'pending', 1, 1, 1, NULL),
  ('2023-02-20', 'Processing B', 'Jane Doe', 'jane@example.com', '444555666', 'pending', 2, 2, NULL, 1);

-- Dữ liệu mẫu cho bảng LicensingRequest
INSERT INTO `licensing_request` (advertisement_content, advertisement_image_url, `status`, rejection_reason, user_id,   , width, height, contract_id, report_id)
VALUES
  ('License Content A', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F3CD5A2AF-685B-4291-8EDF-FE84B7C397E5.JPGbab08c1e-c9a6-4c22-a95e-e4e45f3f9f3b?alt=media&token=8bd87c2b-20c1-43a8-8bec-a83e1fc56ee1', 'pending', NULL, 4, 1, 50.0, 60.0, 1, 1),
  ('License Content B', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd', 'pending', NULL, 5, 2, 55.0, 65.0, 2, 2);

-- Dữ liệu mẫu cho bảng EditRequestBoard
INSERT INTO `edit_request_board` (board_id, board_type_id, edit_status, advertisement_content, advertisement_image_url, reason, request_time, width, height, created_by)
VALUES
  (1, 2, 'pending', 'Edit Content A', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F1662892613618.jpg919448b3-25d1-4488-b565-3b426c980c6a?alt=media&token=92d64588-0c7a-451c-9363-01648d5c4c74', 'Change request A', '2023-12-24', 10.0, 8.0, 4),
  (1, 2, 'canceled', 'Edit Content A', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FCity%20lights%20(Anime%20Background).jpg0c1069f9-5a1b-40f9-8171-7513dc627248?alt=media&token=24074b26-ce6b-4aa4-93ad-579fbc8e4c0f', 'Change request A','2023-12-21', 6.0, 7.0, 4),
  (2, 2, 'approved', 'Edit Content B', 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F370296844_352828990475963_7472452677685245752_n%20(1).jpg8bbe4926-7c8f-4969-a5cd-5d9f65c2685b?alt=media&token=f8d9bd8d-29f0-4450-8a02-5cd036776bc0', 'Change request B','2023-12-20', 20.0, 10.0, 5);

-- Dữ liệu mẫu cho bảng EditRequestPoint
INSERT INTO `edit_request_point` (point_id, advertisement_type_id, location_type, is_planning, image_url, edit_status, reason, request_time, created_by)
VALUES
  (1, 1, 'Chợ', false, 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Street-Column-Advertising-Mockup-PSD.jpege1e620af-64ec-466f-aa84-5d062a7341e7?alt=media&token=95e9ee75-1837-4a3b-b9fa-e8da8c113cb7', 'pending', 'Change request A','2023-12-20', 4),
  (2, 1, 'Trung tâm thương mại', false, 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F340842304_211052514888451_6814854970581350591_n.jpegd6986e67-e6d8-4f77-a1d5-b88e31a57f19?alt=media&token=45c08982-18fc-43ad-928c-2aa4f2dda397', 'pending', 'Change request C','2023-11-25', 6),
  (3, 1, 'Chợ', false, 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fjsx8_8lo8_180725-removebg.png4dc1c29d-a1ee-4603-9f5a-16b456067ac2?alt=media&token=51ea5aa2-4862-4a67-a615-7c9bd0da2f2c', 'canceled', 'Change request D','2023-12-25', 7),
  (4, 1, 'Cây xăng', true, 'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FCity%20lights%20(Anime%20Background).jpg0c1069f9-5a1b-40f9-8171-7513dc627248?alt=media&token=24074b26-ce6b-4aa4-93ad-579fbc8e4c0f', 'pending', 'Change request B','2023-11-25', 5);




