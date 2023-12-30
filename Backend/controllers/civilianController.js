const connection = require('../server');
const socket = require('../app');
const catchAsync = require('../utils/catchAsync');

const getAllDistrictWard = catchAsync(async (req, res, next) => {
  const query = `
    SELECT
      district.district_id AS districtId,
      district.district_name AS districtName,
      district.manager_id AS districtManagerId,
      ward.ward_id AS wardId,
      ward.ward_name AS wardName,
      ward.manager_id AS wardManagerId,
      user.username AS managerName,
      user.email,
      user.phone AS phoneNumber
    FROM
      ward
    LEFT JOIN user ON ward.manager_id = user.user_id
    LEFT JOIN district ON ward.district_id = district.district_id
  
    WHERE ward.ward_id IS NOT NULL
  
    UNION
  
    SELECT
      district.district_id AS districtId,
      district.district_name AS districtName,
      district.manager_id AS districtManagerId,
      null AS wardId,
      null AS wardName,
      null AS wardManagerId,
      user.username AS managerName,
      user.email,
      user.phone AS phoneNumber
    FROM
      district
    LEFT JOIN user ON district.manager_id = user.user_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Group the results by district
    const groupedResults = results.reduce((acc, result) => {
      const districtId = result.districtId;

      if (!acc[districtId]) {
        acc[districtId] = {
          districtId,
          districtName: result.districtName,
          districtManager: {
            id: result.districtManagerId,
            name: result.managerName,
            email: result.email,
            phone: result.phoneNumber,
          },
          wards: [],
        };
      }

      // If ward information is present, add it to the wards array
      if (result.wardId !== null) {
        acc[districtId].wards.push({
          id: result.wardId,
          name: result.wardName,
          manager: {
            id: result.wardManagerId,
            name: result.managerName,
            email: result.email,
            phone: result.phoneNumber,
          },
        });
      }

      return acc;
    }, {});

    // Convert the grouped results to an array
    const finalResults = Object.values(groupedResults);

    res.json(finalResults);
  });
});

const createReport = catchAsync(async (req, res, next) => {
  const {
    reportContent,
    imageUrl1,
    imageUrl2,
    width,
    height,
    lat,
    lng,
    reportTime,
    processingInfo,
    fullnameRp,
    emailRp,
    phoneRp,
    status,
    reportTypeId,
  } = req.body;

  // Bắt đầu bằng việc thêm dữ liệu vào bảng Detail
  connection.query(
    'INSERT INTO detail (report_content, image_url_1, image_url_2, width, height, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [reportContent, imageUrl1, imageUrl2, width, height, lat, lng],
    (err, detailResult) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return res.status(500).json({ error: 'Database error' });
      }

      // Lấy id mới được tạo từ bảng Detail
      const detailId = detailResult.insertId;

      // Tiếp theo, thêm dữ liệu vào bảng Report, sử dụng LAST_INSERT_ID() để lấy id từ bảng Detail
      connection.query(
        'INSERT INTO report (report_time, processing_info, fullname_rp, email_rp, phone_rp, status, detail_id, report_type_id) VALUES (?, ?, ?, ?, ?, ?, LAST_INSERT_ID(), ?)',
        [reportTime, processingInfo, fullnameRp, emailRp, phoneRp, status, reportTypeId],
        (err) => {
          if (err) {
            console.error('Error executing query: ' + err.stack);
            return res.status(500).json({ error: 'Database error' });
          }

          // Nếu không có lỗi, trả về thành công
          res.status(200).json({
            detailId: detailId,
          });
        }
      );
    }
  );
});

module.exports = {
  getAllDistrictWard,
  createReport,
};
