const catchAsync = require('../utils/catchAsync');
const connection = require('../server');
const socket = require('../app');

const getAllAdsPoint = catchAsync(async (req, res, next) => {
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

const getDetailAdsType = catchAsync(async (req, res, next) => {
  const typeId = req.params.id;
  const query = 'SELECT * FROM advertisement_type WHERE advertisement_type_id = ?';

  connection.query(query, [typeId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ status: 'error', message: 'Không tìm thấy loại quảng cáo với ID cung cấp' });
    } else {
      const advertisementType = results[0];
      res.status(200).json({ status: 'success', advertisementType });
    }
  });
});

const addAdsPoint = catchAsync(async (req, res, next) => {
  const { location_type, image_url, lat, lng, is_planning, ward_id, advertisement_type_id, address } = req.body;

  // Kiểm tra xem đã tồn tại bản ghi với cùng giá trị lat và lng chưa
  const checkExistQuery = `
    SELECT * 
    FROM advertising_point 
    WHERE lat = ? AND lng = ?;
  `;

  connection.query(checkExistQuery, [lat, lng], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error executing check exist query:', checkError);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Nếu đã tồn tại bản ghi, trả về lỗi
    if (checkResults.length > 0) {
      res.status(400).json({ error: 'Vị trí bị trùng lặp' });
      return;
    }

    // Nếu không có bản ghi trùng, tiếp tục thêm bản ghi mới
    const insertQuery = `
      INSERT INTO advertising_point 
        (location_type, image_url, lat, lng, is_planning, ward_id, advertisement_type_id, address) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    connection.query(
      insertQuery,
      [location_type, image_url, lat, lng, is_planning, ward_id, advertisement_type_id, address],
      (insertError, result) => {
        if (insertError) {
          console.error('Error executing insert query:', insertError);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        socket?.socketIo?.emit('createdAdsPoint', {
          data: {
            point_id: result.insertId,
            location_type,
            image_url,
            lat,
            lng,
            is_planning,
            ward_id,
            advertisement_type_id,
            address,
          },
        });

        socket?.socketIo?.emit(`createdAdsPoint_wardId=${ward_id}`, {
          point_id: result.insertId,
          location_type,
          image_url,
          lat,
          lng,
          is_planning,
          ward_id,
          advertisement_type_id,
          address,
        });

        res.status(201).json({
          status: 'success',
          insertedData: {
            point_id: result.insertId,
            location_type,
            image_url,
            lat,
            lng,
            is_planning,
            ward_id,
            advertisement_type_id,
            address,
          },
        });
      }
    );
  });
});

const updateAdsPoint = catchAsync(async (req, res, next) => {
  const { point_id, location_type, image_url, lat, lng, is_planning, ward_id, advertisement_type_id, address } =
    req.body;

  // Kiểm tra xem đã tồn tại bản ghi với cùng giá trị lat và lng chưa (không tính chính nó)
  const checkExistQuery = `
    SELECT * 
    FROM advertising_point 
    WHERE lat = ? AND lng = ? AND point_id <> ?;
  `;

  connection.query(checkExistQuery, [lat, lng, point_id], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error executing check exist query:', checkError);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Nếu đã tồn tại bản ghi với phần tử khác, trả về lỗi
    if (checkResults.length > 0) {
      res.status(400).json({ error: 'Vị trí bị trùng lặp' });
      return;
    }

    // Nếu không có bản ghi trùng với phần tử khác, tiếp tục cập nhật bản ghi
    const updateQuery = `
        UPDATE advertising_point
        SET
          location_type = ?,
          image_url = ?,
          lat = ?,
          lng = ?,
          is_planning = ?,
          ward_id = ?,
          advertisement_type_id = ?,
          address = ?
        WHERE point_id = ?;
      `;

    connection.query(
      updateQuery,
      [location_type, image_url, lat, lng, is_planning, ward_id, advertisement_type_id, address, point_id],
      (updateError, result) => {
        if (updateError) {
          console.error('Error executing update query:', updateError);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        socket?.socketIo?.emit(`updateAdsPoint_pointId=${point_id}`, {
          location_type: location_type,
          image_url: image_url,
          lat: lat,
          lng: lng,
          is_planning: is_planning,
          ward_id: ward_id,
          advertisement_type_id: advertisement_type_id,
          address: address,
        });

        // Use to notify
        socket?.socketIo?.emit(`updateAdsPoint_wardId=${ward_id}`);

        res.status(200).json({ status: 'success', updatedId: point_id });
      }
    );
  });
});

const deleteAdsPoint = catchAsync(async (req, res, next) => {
  const pointId = req.body.point_id;

  if (!pointId) {
    return res.status(400).json({ error: 'Missing point_id in request body' });
  }

  const deleteQuery = 'DELETE FROM advertising_point WHERE point_id = ?';

  connection.query(deleteQuery, [pointId], (error, result) => {
    console.log(pointId);
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Point not found' });
      return;
    }

    socket?.socketIo?.emit('deleteAdsPoint', {
      point_id: req.body.point_id,
    });

    res.status(200).json({ status: 'success', deletedId: pointId });
  });
});

module.exports = {
  getAllAdsPoint,
  getAdvertisementTypes,
  getDetailAdsType,
  addAdsPoint,
  updateAdsPoint,
  deleteAdsPoint,
};
