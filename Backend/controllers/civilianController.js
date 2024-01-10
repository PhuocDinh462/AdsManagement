const connection = require('../server');
const socket = require('../app');
const catchAsync = require('../utils/catchAsync');

const getAllDistrictWard = catchAsync(async (req, res, next) => {
  const query = `
    SELECT 
      ap.*,
      w.ward_name,
      w.district_id,
      d.district_name,
      at.type_name AS advertisement_type_name
    FROM advertising_point ap
    INNER JOIN ward w ON ap.ward_id = w.ward_id
    INNER JOIN district d ON w.district_id = d.district_id
    INNER JOIN advertisement_type at ON ap.advertisement_type_id = at.advertisement_type_id;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json(results);
  });
});

const getAllAdsBoard = catchAsync(async (req, res, next) => {
  const query = `
  SELECT * FROM advertising_board
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json(results);
  });
});

const getAllReport = catchAsync(async (req, res, next) => {
  const query = `
  SELECT * FROM report as r, detail as d WHERE r.detail_id = d.detail_id;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json(results);
  });
});

const getAdvertisementTypes = catchAsync(async (req, res, next) => {
  const query = `
    SELECT *
    FROM advertisement_type;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(200).json(results);
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
    point_id,
    board_id,
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
        'INSERT INTO report (report_time, processing_info, fullname_rp, email_rp, phone_rp, status, detail_id, report_type_id, point_id, board_id) VALUES (?, ?, ?, ?, ?, ?, LAST_INSERT_ID(), ?, ?, ?)',
        [reportTime, processingInfo, fullnameRp, emailRp, phoneRp, status, parseInt(reportTypeId), point_id, board_id],
        (err, result) => {
          if (err) {
            console.error('Error executing query: ' + err.stack);
            return res.status(500).json({ error: 'Database error' });
          }
          connection.query(
            'SELECT * FROM report rp join detail dt on rp.detail_id = dt.detail_id WHERE rp.report_id =?',
            [result.insertId],
            async (err, results) => {
              if (err) {
                console.error('Error executing query: ' + err.stack);
                return res.status(500).json({ error: 'Database error' });
              }
              const { image_url_1, image_url_2, ...restReport } = results[0];

              socket?.socketIo?.emit('createReport', {
                ...restReport,
                image_urls: [results[0].image_url_1, results[0].image_url_2],
              });

              // Use when user reports a spot that isn't adSpot
              if (!results[0].point_id && !results[0].board_id)
                connection.query(
                  'select * from ward w join district d on w.district_id = d.district_id',
                  async (err, wardList) => {
                    if (err) {
                      console.error('Error executing query: ', err);
                      res.status(500).send('Internal Server Error');
                      return;
                    }

                    const url = `https://rsapi.goong.io/Geocode?latlng=${results[0].lat},${results[0].lng}&api_key=${process.env.GOONG_APIKEY}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    const reportAddress =
                      !data?.error && data?.status === 'OK'
                        ? data.results[0]?.formatted_address.replace('Phường', '')
                        : null;

                    const ward_id = wardList.filter(
                      (ward) =>
                        reportAddress?.toLowerCase()?.includes(ward.ward_name.replace('Phường', '').toLowerCase()) &&
                        reportAddress?.toLowerCase()?.includes(ward.district_name.toLowerCase())
                    )[0]?.ward_id;

                    if (ward_id)
                      socket?.socketIo?.emit(`createReport_wardId=${ward_id}`, {
                        ...restReport,
                        image_urls: [results[0].image_url_1, results[0].image_url_2],
                      });
                  }
                );

              res.status(200).json(results[0]);
            }
          );
        }
      );
    }
  );
});

module.exports = {
  getAllDistrictWard,
  getAllAdsBoard,
  getAllReport,
  getAdvertisementTypes,
  createReport,
};
