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

DROP TABLE IF EXISTS `log`;

-- Tạo bảng User
CREATE TABLE
    `user` (
        user_id INT auto_increment,
        username VARCHAR(255) NOT NULL,
        `password` VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(255),
        dob DATETIME NOT NULL,
        user_type VARCHAR(255),
        refresh_token TEXT,
        created_by INT default null,
        updated_by INT default null,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id),
        FOREIGN KEY (created_by) REFERENCES `user`(user_id),
        FOREIGN KEY (updated_by) REFERENCES `user`(user_id)
    );

-- Tạo bảng Districts
CREATE TABLE
    `district` (
        district_id INT auto_increment,
        district_name VARCHAR(255) NOT NULL,
        manager_id INT,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (district_id),
        FOREIGN KEY (manager_id) REFERENCES `user`(user_id)
    );

-- Tạo bảng Wards với khóa ngoại tham chiếu đến bảng Districts
CREATE TABLE
    `ward` (
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

CREATE TABLE
    `board_type` (
        `board_type_id` INT PRIMARY KEY AUTO_INCREMENT,
        `type_name` VARCHAR(255),
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    `advertisement_type` (
        `advertisement_type_id` INT PRIMARY KEY AUTO_INCREMENT,
        `type_name` VARCHAR(255),
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
    );

INSERT INTO
    board_type (type_name)
VALUES ('Bảng hiflex ốp tường'), ('Màn hình điện tử ốp tường'), ('Trung tâm thương mại');

INSERT INTO
    advertisement_type (type_name)
VALUES ('Cổ động chính trị'), ('Quảng cáo thương mại'), ('Xã hội hoá');

-- Tạo bảng contract
CREATE TABLE
    `contract` (
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
CREATE TABLE
    `advertising_point` (
        point_id INT auto_increment,
        ward_id INT,
        advertisement_type_id INT,
        address VARCHAR(255),
        location_type ENUM(
            'Đất công/Công viên/Hành lang an toàn giao thông',
            'Đất tư nhân/Nhà ở riêng lẻ',
            'Trung tâm thương mại',
            'Chợ',
            'Cây xăng',
            'Nhà chờ xe buýt'
        ),
        image_url VARCHAR(255),
        `lat` double,
        `lng` double,
        is_planning BOOLEAN,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (point_id),
        FOREIGN KEY (ward_id) REFERENCES ward(ward_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (advertisement_type_id) REFERENCES advertisement_type(advertisement_type_id) ON DELETE
        SET NULL
    );

-- Tạo bảng report_types
CREATE TABLE
    `report_type` (
        `report_type_id` INT PRIMARY KEY AUTO_INCREMENT,
        `report_type_name` VARCHAR(255),
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
    );

INSERT INTO
    report_type (report_type_name)
VALUES ('Tố giác sai phạm'), ('Đăng ký nội dung'), ('Đóng góp ý kiến');

-- Tạo bảng Details
CREATE TABLE
    `detail` (
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
CREATE TABLE
    `advertising_board` (
        board_id INT auto_increment,
        board_type_id INT,
        contract_id INT,
        advertisement_content VARCHAR(255),
        advertisement_image_url VARCHAR(255),
        width FLOAT,
        height FLOAT,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        point_id INT,
        PRIMARY KEY (board_id),
        --  FOREIGN KEY (`licensing_id`) REFERENCES `licensing_request`(`licensing_id`),
        FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (`board_type_id`) REFERENCES `board_type`(`board_type_id`) ON DELETE
        SET
            NULL,
            FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`) ON DELETE
        SET NULL
    );

CREATE TABLE
    `report` (
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
        FOREIGN KEY (`report_type_id`) REFERENCES `report_type` (`report_type_id`) ON DELETE
        SET
            NULL,
            FOREIGN KEY (`detail_id`) REFERENCES `detail`(`detail_id`) ON DELETE
        SET
            NULL,
            FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`) ON DELETE
        SET
            NULL,
            FOREIGN KEY (`board_id`) REFERENCES `advertising_board`(`board_id`) ON DELETE
        SET NULL
    );

-- Tạo bảng LicensingRequests với các khóa ngoại tham chiếu
CREATE TABLE
    `licensing_request` (
        licensing_id INT auto_increment,
        advertisement_content VARCHAR(255),
        advertisement_image_url VARCHAR(255),
        `status` ENUM(
            'pending',
            'approved',
            'canceled'
        ) NOT null,
        rejection_reason VARCHAR(255),
        user_id INT,
        board_type_id INT,
        point_id INT,
        width FLOAT,
        height FLOAT,
        contract_id INT,
        report_id INT,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (licensing_id),
        FOREIGN KEY (contract_id) REFERENCES contract(contract_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (report_id) REFERENCES report(report_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (board_type_id) REFERENCES board_type(board_type_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (point_id) REFERENCES advertising_point(point_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE
        SET NULL
    );

CREATE TABLE
    `edit_request_board` (
        id INT auto_increment,
        board_id INT,
        board_type_id INT,
        edit_status ENUM(
            'pending',
            'approved',
            'canceled'
        ),
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
        FOREIGN KEY (board_id) REFERENCES advertising_board(board_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (`board_type_id`) REFERENCES `board_type`(`board_type_id`) ON DELETE
        SET
            NULL,
            FOREIGN KEY (created_by) REFERENCES `user`(user_id) ON DELETE
        SET NULL
    );

CREATE TABLE
    `edit_request_point` (
        id INT auto_increment,
        point_id INT,
        advertisement_type_id INT,
        location_type VARCHAR(255),
        is_planning BOOLEAN,
        image_url VARCHAR(255),
        edit_status ENUM(
            'pending',
            'approved',
            'canceled'
        ),
        reason VARCHAR(255),
        request_time date,
        created_by INT,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (created_by) REFERENCES `user`(user_id) ON DELETE
        SET
            NULL,
            FOREIGN KEY (`point_id`) REFERENCES `advertising_point`(`point_id`) ON DELETE CASCADE,
            FOREIGN KEY (advertisement_type_id) REFERENCES advertisement_type(advertisement_type_id) ON DELETE
        SET NULL
    );

CREATE TABLE
    `log` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_request VARCHAR(5000),
        response VARCHAR(5000),
        time_request timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        method VARCHAR(10),
        path VARCHAR(255),
        status VARCHAR(3),
        browser VARCHAR(255)
    );

-- Dữ liệu mẫu cho bảng User
INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        'nguyenvanabc',
        '$2b$10$oAVguOLrPlcGhuc5mC4ndu3bLQ9z1kBebExh1ezQ2bDQpxSWkBK8e',
        'longdz@gmail.com',
        '0814455456',
        '1990-01-01 00:00:00',
        'department',
        NULL,
        NULL,
        NULL,
        '2024-01-12 09:53:52',
        '2024-01-12 09:55:45'
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        2,
        'Nguyen Van A',
        '$2b$10$tXx1Gbyk6PkaCzKn5sX8AeiFP.4/UKXnJf.8gH/b05y34RPKMdMoq',
        'nguyenvana@gmail.com',
        '0862573811',
        '2002-10-02 00:00:00',
        'district',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:42:39',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        3,
        'Nguyen Van B',
        '$2b$10$PQU.ORU/WDGz5n9Lfb5HwO0eab5OIwFfhLbJA0Nemei8LET1devVy',
        'nguyenvanb@gmail.com',
        '0862573711',
        '2002-10-03 00:00:00',
        'district',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:43:33',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        4,
        'Nguyen Van C',
        '$2b$10$/5ODtX90yyJsNnuMOZNICeW2xm9Enqui7pcEa9pBdpM8431CCmb5C',
        'nguyenvanc@gmail.com',
        '0862553811',
        '2002-10-20 00:00:00',
        'district',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:44:13',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        5,
        'Nguyen Van D',
        '$2b$10$y4fweLlWuyT.Ms2kXhjxPeuXpHhSTcNr4sx9rl6SxJX/l9qh9sAQy',
        'nguyenvand@gmail.com',
        '0862573811',
        '2002-10-28 00:00:00',
        'district',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:44:45',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        6,
        'Nguyen Van E',
        '$2b$10$eZusO204S1owvIarCcw4hOLBVlpa3Aj1ZP60L9/Av/EFD8jmcvP32',
        'nguyenvane@gmail.com',
        '0862500811',
        '2002-10-22 00:00:00',
        'district',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:45:35',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        7,
        'Tran Bao Long',
        '$2b$10$EBQo.zwhu8nTxecr2w0ZaujhGop651.wRjKI5jtuh/TOH6zbjfR.O',
        'tranbaolong@gmail.com',
        '0862993811',
        '2002-10-13 00:00:00',
        'ward',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:46:19',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        8,
        'Tran Huu Chinh',
        '$2b$10$Z8/86N19grM3.ER7SQLW9OjaYaIaNjSfnnS4tYRY99vPmWEUlmoW6',
        'tranhuuchinh@gmail.com',
        '0862555811',
        '2002-10-17 00:00:00',
        'ward',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:47:21',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        9,
        'Tran Dung Tien',
        '$2b$10$W4BPX8n12yPZjjWDOjqHFuizVzbo7aMFsSrMUIQlxa1oYnOC6sbH2',
        'trandungtien@gmail.com',
        '0862588811',
        '2002-07-02 00:00:00',
        'ward',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:48:03',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        10,
        'Dinh Cao Hong Phuoc',
        '$2b$10$KskqzzRJYHHUmb2QG4bdlO1DyQo4XPJ6KytOlv3aRfvO16RLdKqXi',
        'dinhcaohongphuoc@gmail.com',
        '0862577711',
        '2002-07-02 00:00:00',
        'ward',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:48:48',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        11,
        'Huynh Tan Vinh',
        '$2b$10$ugOpyJz/UbkwdvKN3xCi5.aAPriN0pYAliaDPz/C6c/JriZY2LYMi',
        'huynhtanvinh@gmail.com',
        '0862223811',
        '2002-02-02 00:00:00',
        'ward',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:49:42',
        NULL
    );

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `phone`,
        `dob`,
        `user_type`,
        `refresh_token`,
        `created_by`,
        `updated_by`,
        `created_at`,
        `updated_at`
    )
VALUES (
        12,
        'Phuoc Dinh',
        '$2b$10$ugOpyJz/UbkwdvKN3xCi5.aAPriN0pYAliaDPz/C6c/JriZY2LYMi',
        'phuocdinh462@gmail.com',
        '0862223811',
        '2002-02-02 00:00:00',
        'ward',
        NULL,
        NULL,
        NULL,
        '2024-01-12 12:49:42',
        NULL
    );

-- Dữ liệu mẫu cho bảng District
INSERT INTO
    `district` (
        `district_id`,
        `district_name`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        4,
        'Quận 1',
        2,
        '2024-01-12 10:03:25',
        '2024-01-12 12:42:39'
    );

INSERT INTO
    `district` (
        `district_id`,
        `district_name`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        6,
        'Quận 3',
        3,
        '2024-01-12 10:04:31',
        '2024-01-12 12:43:33'
    );

INSERT INTO
    `district` (
        `district_id`,
        `district_name`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        7,
        'Quận 4',
        5,
        '2024-01-12 10:04:38',
        '2024-01-12 12:44:45'
    );

INSERT INTO
    `district` (
        `district_id`,
        `district_name`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        8,
        'Quận 5',
        6,
        '2024-01-12 10:04:51',
        '2024-01-12 12:45:35'
    );

-- Dữ liệu mẫu cho bảng Ward
INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        'Bến Thành',
        4,
        7,
        '2024-01-12 10:05:38',
        '2024-01-12 12:46:19'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        2,
        'Bến Nghé',
        4,
        NULL,
        '2024-01-12 10:09:21',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        3,
        'Đa Kao',
        4,
        NULL,
        '2024-01-12 10:09:45',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        4,
        'Nguyễn Cư Trinh',
        4,
        NULL,
        '2024-01-12 10:10:37',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        5,
        'Nguyễn Thái Bình',
        4,
        NULL,
        '2024-01-12 10:11:08',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        6,
        'Tân Định',
        4,
        NULL,
        '2024-01-12 10:11:26',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        7,
        'Cô Giang',
        4,
        NULL,
        '2024-01-12 10:11:46',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        8,
        'Cầu Ông Lãnh',
        4,
        NULL,
        '2024-01-12 10:17:18',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        9,
        'Phạm Ngũ Lão',
        4,
        11,
        '2024-01-12 10:17:41',
        '2024-01-12 12:49:42'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        10,
        'Cầu Kho',
        4,
        NULL,
        '2024-01-12 10:18:00',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        11,
        'Phường 1',
        6,
        NULL,
        '2024-01-12 10:18:26',
        '2024-01-12 10:26:27'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        12,
        'Phường 2',
        6,
        NULL,
        '2024-01-12 10:18:38',
        '2024-01-12 10:26:35'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        13,
        'Phường 3',
        6,
        8,
        '2024-01-12 10:18:47',
        '2024-01-12 12:47:21'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        14,
        'Phường 4',
        6,
        NULL,
        '2024-01-12 10:18:59',
        '2024-01-12 10:26:50'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        15,
        'Phường 5',
        6,
        NULL,
        '2024-01-12 10:19:14',
        '2024-01-12 10:26:58'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        16,
        'Phường 9',
        6,
        NULL,
        '2024-01-12 10:19:34',
        '2024-01-12 10:27:06'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        17,
        'Phường 10',
        6,
        10,
        '2024-01-12 10:19:53',
        '2024-01-12 12:48:48'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        18,
        'Phường 11',
        6,
        NULL,
        '2024-01-12 10:23:11',
        '2024-01-12 10:29:35'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        19,
        'Phường 12',
        6,
        NULL,
        '2024-01-12 10:23:20',
        '2024-01-12 10:29:43'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        20,
        'Phường 13',
        6,
        NULL,
        '2024-01-12 10:23:45',
        '2024-01-12 10:29:51'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        21,
        'Phường 14',
        6,
        NULL,
        '2024-01-12 10:23:57',
        '2024-01-12 10:29:58'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        22,
        'Võ Thị Sáu',
        6,
        NULL,
        '2024-01-12 10:24:54',
        '2024-01-12 10:30:10'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        23,
        'Phường 1',
        8,
        9,
        '2024-01-12 10:32:58',
        '2024-01-12 12:48:03'
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        24,
        'Phường 2',
        7,
        NULL,
        '2024-01-12 10:33:13',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        25,
        'Phường 3',
        7,
        NULL,
        '2024-01-12 10:33:46',
        NULL
    );

INSERT INTO
    `ward` (
        `ward_id`,
        `ward_name`,
        `district_id`,
        `manager_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        26,
        'Phường 4',
        7,
        NULL,
        '2024-01-12 10:36:41',
        NULL
    );
-- Dữ liệu mẫu cho bảng BoardType và AdvertisementType
-- (Đã có dữ liệu mẫu trong đoạn tạo bảng)

-- Dữ liệu mẫu cho bảng Contract
INSERT INTO
    `contract` (
        `contract_id`,
        `company_name`,
        `company_email`,
        `company_phone`,
        `company_address`,
        `company_taxcode`,
        `start_date`,
        `end_date`,
        `representative`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        'Company A',
        'companyA@example.com',
        '123456789',
        'Address A',
        '123456',
        '2023-01-01',
        '2023-12-31',
        'Rep A',
        '2024-01-12 13:00:47',
        NULL
    );

INSERT INTO
    `contract` (
        `contract_id`,
        `company_name`,
        `company_email`,
        `company_phone`,
        `company_address`,
        `company_taxcode`,
        `start_date`,
        `end_date`,
        `representative`,
        `created_at`,
        `updated_at`
    )
VALUES (
        2,
        'Company B',
        'companyB@example.com',
        '987654321',
        'Address B',
        '122333',
        '2023-03-01',
        '2023-12-31',
        'Rep B',
        '2024-01-12 13:00:47',
        NULL
    );

-- Dữ liệu mẫu cho bảng AdvertisingPoint
INSERT INTO
    `advertising_point` (
        ward_id,
        advertisement_type_id,
        address,
        location_type,
        image_url,
        `lat`,
        `lng`,
        is_planning
    )
VALUES (
        1,
        1,
        '117-115 Đ. Nguyễn Du, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fpexels-david-geib-3220846.jpgd31e8cb4-b0eb-4c79-8668-4dcb93005aa3?alt=media&token=38790acd-3bbb-43c4-a96f-4e888211153a',
        10.773557545517933,
        106.69448664500696,
        true
    ), (
        1,
        3,
        'Bến Thành, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fimg4547-1668727584476274584923.webp?alt=media&token=71057a20-17b4-4166-a357-d40198a66db2',
        10.774477837706945,
        106.69554860577976,
        true
    ), (
        1,
        1,
        '8 Thủ Khoa Huân, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fcoca.jpeg94004bd8-6df6-4c65-86ef-de2e60369249?alt=media&token=ee6ae96b-e063-4b77-bc26-b1b8333d44fc',
        10.773287803727186,
        106.69758468171688,
        false
    ), (
        1,
        2,
        '6 Huyền Trân Công Chúa, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fin-bat-kho-lon-1-16354708968042037408651.jpeg?alt=media&token=7666fc98-d782-4434-87c0-642872cb5e08',
        10.775018678900556,
        106.69583583527508,
        true
    ), (
        1,
        2,
        '139 Đ. Nguyễn Du, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.772763316554093,
        106.69374979259123,
        true
    ), (
        7,
        2,
        'Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Chợ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.764089825704806,
        106.69382697031256,
        true
    ), (
        7,
        3,
        '185-171 Đ. Cô Bắc, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Cây xăng',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fposter-ngoa%CC%80i-tro%CC%9B%CC%80i-ta%CC%A3i-be%CC%82%CC%81n-xe-bus.jpeg?alt=media&token=68a94673-1703-4978-8edc-46d26951e92a',
        10.76260180395761,
        106.69202970553981,
        false
    ), (
        7,
        3,
        '121-81 Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.763295833627492,
        106.69508166353674,
        false
    ), (
        7,
        2,
        '100/0 Cô Giang, Phường Cô Giang, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Trung tâm thương mại',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fin-bat-kho-lon-1-16354708968042037408651.jpeg?alt=media&token=7666fc98-d782-4434-87c0-642872cb5e08',
        10.763202030203516,
        106.694321522979,
        true
    ), (
        10,
        2,
        'Hẻm 391 Trần Hưng Đạo, Cầu Kho, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fimg4547-1668727584476274584923.webp?alt=media&token=71057a20-17b4-4166-a357-d40198a66db2',
        10.759551792108674,
        106.68895113745646,
        true
    ), (
        10,
        3,
        'Hẻm 393, Cầu Kho, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.759527954863646,
        106.68819286225688,
        false
    ), (
        10,
        2,
        '32 Đ. Trần Hưng Đạo, Cầu Kho, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fin-bat-kho-lon-1-16354708968042037408651.jpeg?alt=media&token=7666fc98-d782-4434-87c0-642872cb5e08',
        10.759182300974503,
        106.68782889076304,
        true
    ), (
        2,
        2,
        '33 Đ. Nguyễn Du, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Cây xăng',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.78263195002901,
        106.70178179891825,
        true
    ), (
        2,
        3,
        'Đ. Nguyễn Du, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.784403770238747,
        106.70343169421437,
        false
    ), (
        2,
        2,
        'Đ. Tôn Đức Thắng, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fimg4547-1668727584476274584923.webp?alt=media&token=71057a20-17b4-4166-a357-d40198a66db2',
        10.782604442626198,
        106.70557093039417,
        true
    ), (
        2,
        1,
        '18 Đ. Nguyễn Siêu, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Street-Column-Advertising-Mockup-PSD.jpeg33aad715-4c38-4800-8dd7-5c358f223fab?alt=media&token=e550d4db-5f1a-484d-844c-53152cb2e4a3',
        10.780887508168815,
        106.70743052678033,
        true
    ), (
        2,
        1,
        '28-32 Lê Văn Hưu, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.782232969987437,
        106.70040196122936,
        true
    ), (
        23,
        2,
        'Đ. Nguyễn Biểu, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.754528849095365,
        106.68411604272457,
        true
    ), (
        23,
        1,
        '907-903 Đ. Trần Hưng Đạo, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Cây xăng',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.754717666981415,
        106.67913706759444,
        true
    ), (
        23,
        2,
        'Chung cư Phúc Thịnh, 341 Đ. Cao Đạt, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.75323625849358,
        106.6800757170383,
        false
    ), (
        23,
        3,
        '317 Đ. Cao Đạt, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.75381890951151,
        106.68073192761604,
        false
    ), (
        23,
        2,
        '86-114 Đ. Trần Bình Trọng, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fin-bat-kho-lon-1-16354708968042037408651.jpeg?alt=media&token=7666fc98-d782-4434-87c0-642872cb5e08',
        10.755261819648139,
        106.68150443949514,
        true
    ), (
        6,
        1,
        'Hẻm 233 Nguyễn Trãi, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fposter-ngoa%CC%80i-tro%CC%9B%CC%80i-ta%CC%A3i-be%CC%82%CC%81n-xe-bus.jpeg?alt=media&token=68a94673-1703-4978-8edc-46d26951e92a',
        10.75663031647467,
        106.67706286932429,
        false
    ), (
        6,
        2,
        'Huỳnh Mẫn Đạt/34 Hẻm 92, Khu phố 6, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.75608110554023,
        106.67715193917813,
        true
    ), (
        6,
        1,
        '4-58 Đ. Lê Hồng Phong, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Chợ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.755820730410948,
        106.67860949724485,
        true
    ), (
        6,
        2,
        '58 Đ. Lê Hồng Phong, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.755734069901376,
        106.67866789301668,
        true
    ), (
        6,
        3,
        '95-85 Phan Văn Trị, Phường 2, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Street-Column-Advertising-Mockup-PSD.jpeg33aad715-4c38-4800-8dd7-5c358f223fab?alt=media&token=e550d4db-5f1a-484d-844c-53152cb2e4a3',
        10.757329018572866,
        106.68313724791697,
        true
    ), (
        7,
        2,
        '217-189 Huỳnh Mẫn Đạt, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.757851378971724,
        106.6757593607054,
        true
    ), (
        7,
        1,
        '152 Huỳnh Mẫn Đạt, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fimg4547-1668727584476274584923.webp?alt=media&token=71057a20-17b4-4166-a357-d40198a66db2',
        10.757273818884698,
        106.67607262997986,
        true
    ), (
        7,
        2,
        '256 Đ. Nguyễn Trãi, Phường 3, Quận 5, Thành phố Hồ Chí Minh 100000, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fin-bat-kho-lon-1-16354708968042037408651.jpeg?alt=media&token=7666fc98-d782-4434-87c0-642872cb5e08',
        10.757438278679597,
        106.6771133545359,
        false
    ), (
        7,
        2,
        '217-189 Huỳnh Mẫn Đạt, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Chợ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fposter-ngoa%CC%80i-tro%CC%9B%CC%80i-ta%CC%A3i-be%CC%82%CC%81n-xe-bus.jpeg?alt=media&token=68a94673-1703-4978-8edc-46d26951e92a',
        10.75797205545914,
        106.6757029179611,
        true
    ), (
        7,
        2,
        '176 Đ. Trần Bình Trọng, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.759264285847065,
        106.68032975751856,
        true
    ), (
        8,
        1,
        '240-204 Đ. Trần Bình Trọng, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Chợ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.761620563828691,
        106.67938109316296,
        true
    ), (
        8,
        3,
        '220-238 Đ. Trần Bình Trọng, Phường 1, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fnhung_mau_bang_quang_cao_dep_5_grande.jpeg?alt=media&token=4899811e-d341-4727-a0f0-dce164d44d27',
        10.761225167230146,
        106.67955025989906,
        true
    ), (
        8,
        2,
        '85 Đ. Trần Phú, Phường 4, Quận 5, Thành phố Hồ Chí Minh 700000, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.761145804555388,
        106.67781654948834,
        true
    ), (
        8,
        3,
        '212-240 Đ. Lê Hồng Phong, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.760464751904083,
        106.6771766047319,
        true
    ), (
        8,
        2,
        '210 Đ. Lê Hồng Phong, Phường 4, Quận 5, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.75958339452077,
        106.67748496309471,
        false
    ), (
        9,
        2,
        '52 Phạm Thế Hiển, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.75053580051193,
        106.68855907411607,
        true
    ), (
        9,
        3,
        '141 D. Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fin-bat-kho-lon-1-16354708968042037408651.jpeg?alt=media&token=7666fc98-d782-4434-87c0-642872cb5e08',
        10.747725645605072,
        106.68892415914593,
        true
    ), (
        9,
        2,
        'Hẻm 219 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Chợ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fimg4547-1668727584476274584923.webp?alt=media&token=71057a20-17b4-4166-a357-d40198a66db2',
        10.746368809341359,
        106.68928281672004,
        true
    ), (
        9,
        3,
        '456-355 D. Bá Trạc, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.741872775609895,
        106.68847882589102,
        false
    ), (
        9,
        1,
        '374 Hẻm 288 D. Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.744192003533188,
        106.69034231792875,
        false
    ), (
        10,
        2,
        '83-41 Đ. Dạ Nam, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.749172758854053,
        106.68570872725917,
        true
    ), (
        10,
        2,
        'D. Bá Trạc, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fqua%CC%89ng-ca%CC%81o-giao-do%CC%82%CC%80-a%CC%86n.jpeg?alt=media&token=a6785590-c2e6-41c7-9590-3b08ab2db6c7',
        10.749500210660884,
        106.68802852720496,
        true
    ), (
        10,
        3,
        '51 Hẻm 47 Nguyễn Thị Tần, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fnhung_mau_bang_quang_cao_dep_5_grande.jpeg?alt=media&token=4899811e-d341-4727-a0f0-dce164d44d27',
        10.748175631484312,
        106.68597368425162,
        false
    ), (
        10,
        2,
        '47 Nguyễn Thị Tần, Phường 2, Quận 8, Thành phố Hồ Chí Minh 70000, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.747966270502895,
        106.6853563780479,
        true
    ), (
        10,
        1,
        'Lô F Nguyễn Thị Tần, Phường 2, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.747150696826662,
        106.68666825986077,
        false
    ), (
        11,
        3,
        '2-7 Đ. Âu Dương Lân, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fimg4547-1668727584476274584923.webp?alt=media&token=71057a20-17b4-4166-a357-d40198a66db2',
        10.748219754143781,
        106.68183880884358,
        true
    ), (
        11,
        2,
        '306 Phạm Thế Hiển, Phường 3, 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.748636843507814,
        106.68254375143715,
        true
    ), (
        11,
        1,
        '28, 46 Đ. Âu Dương Lân, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Chợ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.747335253251334,
        106.68215567587563,
        false
    ), (
        11,
        1,
        'Hẻm 451 Phạm Thế Hiển, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fnhung_mau_bang_quang_cao_dep_5_grande.jpeg?alt=media&token=4899811e-d341-4727-a0f0-dce164d44d27',
        10.747493918756918,
        106.6804436121384,
        true
    ), (
        11,
        1,
        '22/10 Phạm Thế Hiển, Phường 3, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fqua%CC%89ng-ca%CC%81o-giao-do%CC%82%CC%80-a%CC%86n.jpeg?alt=media&token=a6785590-c2e6-41c7-9590-3b08ab2db6c7',
        10.748379271319354,
        106.68427660876355,
        true
    ), (
        12,
        2,
        '30-68 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.743028323620706,
        106.67636312275546,
        true
    ), (
        12,
        1,
        '78-82 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Chợ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fin-bat-kho-lon-1-16354708968042037408651.jpeg?alt=media&token=7666fc98-d782-4434-87c0-642872cb5e08',
        10.742153337641415,
        106.6768169843276,
        false
    ), (
        12,
        3,
        '30-68 Đ. Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất công/Công viên/Hành lang an toàn giao thông',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Street-Column-Advertising-Mockup-PSD.jpeg33aad715-4c38-4800-8dd7-5c358f223fab?alt=media&token=e550d4db-5f1a-484d-844c-53152cb2e4a3',
        10.743266147522215,
        106.67631689953923,
        true
    ), (
        12,
        3,
        'Hẻm 23 Đ. Hồ Thành Biên, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Đất tư nhân/Nhà ở riêng lẻ',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fposter-ngoa%CC%80i-tro%CC%9B%CC%80i-ta%CC%A3i-be%CC%82%CC%81n-xe-bus.jpeg?alt=media&token=68a94673-1703-4978-8edc-46d26951e92a',
        10.741718414034755,
        106.67337103029278,
        true
    ), (
        12,
        2,
        '90 Đ. 102 Cao Lỗ, Phường 4, Quận 8, Thành phố Hồ Chí Minh, Việt Nam',
        'Nhà chờ xe buýt',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Column_Outdoor-Advertising-Pillar-Mockup-PSD.jpeg7421084b-030d-42ab-b2ef-7498ebc118fb?alt=media&token=36623d13-caa8-4ad4-ac91-ed2b470330fd',
        10.740345755662574,
        106.67561085849688,
        true
    );

-- Dữ liệu mẫu cho bảng ReportType
-- (Đã có dữ liệu mẫu trong đoạn tạo bảng)

-- Dữ liệu mẫu cho bảng Detail
INSERT INTO
    `detail` (
        report_content,
        image_url_1,
        image_url_2,
        width,
        height,
        `lat`,
        `lng`
    )
VALUES (
        'Content A',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F1662892613618.jpg919448b3-25d1-4488-b565-3b426c980c6a?alt=media&token=92d64588-0c7a-451c-9363-01648d5c4c74',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FCity%20lights%20(Anime%20Background).jpg0c1069f9-5a1b-40f9-8171-7513dc627248?alt=media&token=24074b26-ce6b-4aa4-93ad-579fbc8e4c0f',
        30.0,
        40.0,
        12.0,
        22.0
    ), (
        'Content B',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F1662892613618.jpg919448b3-25d1-4488-b565-3b426c980c6a?alt=media&token=92d64588-0c7a-451c-9363-01648d5c4c74',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FCity%20lights%20(Anime%20Background).jpg0c1069f9-5a1b-40f9-8171-7513dc627248?alt=media&token=24074b26-ce6b-4aa4-93ad-579fbc8e4c0f',
        35.0,
        45.0,
        18.0,
        28.0
    );

-- Dữ liệu mẫu cho bảng AdvertisingBoard
INSERT INTO
    `advertising_board` (
        board_type_id,
        advertisement_content,
        advertisement_image_url,
        width,
        height,
        point_id,
        contract_id
    )
VALUES (
        1,
        'The text in this cute Facebook ad design is brilliantly positioned. The funny part (secret SaaS) speaks loudest with the big font, but the pain point grabs your attention first with the contrasting yellow highlighting.',
        'https://www.wordstream.com/wp-content/uploads/2022/02/facebook-ad-examples-grin-480x660.png',
        50.0,
        60.0,
        1,
        1
    ), (
        2,
        'The text in this cute Facebook ad design is brilliantly positioned. The funny part (secret SaaS) speaks loudest with the big font, but the pain point grabs your attention first with the contrasting yellow highlighting.',
        'https://www.wordstream.com/wp-content/uploads/2022/02/facebook-ad-examples-grin-480x660.png',
        55.0,
        65.0,
        1,
        2
    ), (
        3,
        'The text in this cute Facebook ad design is brilliantly positioned. The funny part (secret SaaS) speaks loudest with the big font, but the pain point grabs your attention first with the contrasting yellow highlighting.',
        'https://www.wordstream.com/wp-content/uploads/2022/02/facebook-ad-examples-grin-480x660.png',
        100.0,
        70.0,
        1,
        1
    );

-- Dữ liệu mẫu cho bảng Report
INSERT INTO
    `report` (
        report_time,
        processing_info,
        fullname_rp,
        email_rp,
        phone_rp,
        `status`,
        detail_id,
        report_type_id,
        point_id,
        board_id
    )
VALUES (
        '2023-01-15',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'John Doe',
        'john@example.com',
        '111222333',
        'pending',
        1,
        1,
        1,
        NULL
    ), (
        '2023-02-20',
        'Phạt 5 triệu đối với trường hợp này.',
        'Jane Doe',
        'jane@example.com',
        '444555666',
        'pending',
        2,
        2,
        1,
        1
    ), (
        '2024-01-12',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Phuoc Dinh',
        'phuocdinh462@gmail.com',
        '0988999888',
        'processing',
        1,
        1,
        5,
        NULL
    );

-- Dữ liệu mẫu cho bảng LicensingRequest
INSERT INTO
    `licensing_request` (
        advertisement_content,
        advertisement_image_url,
        `status`,
        rejection_reason,
        user_id,
        board_type_id,
        point_id,
        width,
        height,
        contract_id,
        report_id
    )
VALUES (
        'The text in this cute Facebook ad design is brilliantly positioned. The funny part (secret SaaS) speaks loudest with the big font, but the pain point grabs your attention first with the contrasting yellow highlighting.',
        'https://www.wordstream.com/wp-content/uploads/2022/02/facebook-ad-examples-grin-480x660.png',
        'pending',
        NULL,
        4,
        1,
        1,
        50.0,
        60.0,
        1,
        1
    ), (
        'The text in this cute Facebook ad design is brilliantly positioned. The funny part (secret SaaS) speaks loudest with the big font, but the pain point grabs your attention first with the contrasting yellow highlighting.',
        'https://www.wordstream.com/wp-content/uploads/2022/02/facebook-ad-examples-grin-480x660.png',
        'pending',
        NULL,
        5,
        2,
        6,
        55.0,
        65.0,
        2,
        2
    );

-- Dữ liệu mẫu cho bảng EditRequestBoard
INSERT INTO
    `edit_request_board` (
        board_id,
        board_type_id,
        edit_status,
        advertisement_content,
        advertisement_image_url,
        reason,
        request_time,
        width,
        height,
        created_by
    )
VALUES (
        1,
        2,
        'pending',
        'Chỉnh sửa tên bảng quảng cáo.',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F1662892613618.jpg919448b3-25d1-4488-b565-3b426c980c6a?alt=media&token=92d64588-0c7a-451c-9363-01648d5c4c74',
        'Không đẹp.',
        '2023-12-24',
        10.0,
        8.0,
        4
    ), (
        1,
        2,
        'canceled',
        'Chỉnh sửa thông tin, hình ảnh bảng quảng cáo.',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FCity%20lights%20(Anime%20Background).jpg0c1069f9-5a1b-40f9-8171-7513dc627248?alt=media&token=24074b26-ce6b-4aa4-93ad-579fbc8e4c0f',
        'Không phù hợp.',
        '2023-12-21',
        6.0,
        7.0,
        4
    ), (
        2,
        2,
        'approved',
        'Thêm ngày gia hạn.',
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F370296844_352828990475963_7472452677685245752_n%20(1).jpg8bbe4926-7c8f-4969-a5cd-5d9f65c2685b?alt=media&token=f8d9bd8d-29f0-4450-8a02-5cd036776bc0',
        'Hết hợp đồng gia hạn.',
        '2023-12-20',
        20.0,
        10.0,
        5
    );

-- Dữ liệu mẫu cho bảng EditRequestPoint
INSERT INTO
    `edit_request_point` (
        point_id,
        advertisement_type_id,
        location_type,
        is_planning,
        image_url,
        edit_status,
        reason,
        request_time,
        created_by
    )
VALUES (
        1,
        1,
        'Chợ',
        false,
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FFree-Street-Column-Advertising-Mockup-PSD.jpege1e620af-64ec-466f-aa84-5d062a7341e7?alt=media&token=95e9ee75-1837-4a3b-b9fa-e8da8c113cb7',
        'pending',
        'Tên địa điểm không hợp lệ',
        '2023-12-20',
        4
    ), (
        2,
        1,
        'Trung tâm thương mại',
        false,
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2F340842304_211052514888451_6814854970581350591_n.jpegd6986e67-e6d8-4f77-a1d5-b88e31a57f19?alt=media&token=45c08982-18fc-43ad-928c-2aa4f2dda397',
        'pending',
        'Thêm diện tích của điểm quảng cáo.',
        '2023-11-25',
        6
    ), (
        3,
        1,
        'Chợ',
        false,
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2Fjsx8_8lo8_180725-removebg.png4dc1c29d-a1ee-4603-9f5a-16b456067ac2?alt=media&token=51ea5aa2-4862-4a67-a615-7c9bd0da2f2c',
        'canceled',
        'Tện địa điểm không hợp lệ.',
        '2023-12-25',
        7
    ), (
        4,
        1,
        'Cây xăng',
        true,
        'https://firebasestorage.googleapis.com/v0/b/wncuploadimage.appspot.com/o/images%2FCity%20lights%20(Anime%20Background).jpg0c1069f9-5a1b-40f9-8171-7513dc627248?alt=media&token=24074b26-ce6b-4aa4-93ad-579fbc8e4c0f',
        'pending',
        'Không cho phép',
        '2023-11-25',
        5
    );