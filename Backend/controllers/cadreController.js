const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

const getAllDistrictWard = catchAsync(async (req, res, next) => {
  const query = `
    SELECT 
      district.district_id,
      district.district_name,
      district.manager_id AS district_manager_id,
      user_d.username AS district_manager_username,
      user_d.email AS district_manager_email,
      ward.ward_id,
      ward.ward_name,
      ward.manager_id AS ward_manager_id,
      user_w.username AS ward_manager_username,
      user_w.email AS ward_manager_email
    FROM district
    LEFT JOIN user AS user_d ON district.manager_id = user_d.user_id
    LEFT JOIN ward ON ward.district_id = district.district_id
    LEFT JOIN user AS user_w ON ward.manager_id = user_w.user_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});

const getDistricts = catchAsync(async (req, res, next) => {
  const query = `
    SELECT 
      district.*,
      user_d.user_id AS district_manager_id,
      user_d.username AS district_manager_username,
      user_d.email AS district_manager_email,
      user_d.dob AS district_manager_dob,
      user_d.phone AS district_manager_phone,
      user_d.user_type AS district_manager_type
    FROM district
    LEFT JOIN user AS user_d ON district.manager_id = user_d.user_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

const getWards = catchAsync(async (req, res, next) => {
  const query = `
    SELECT 
      ward.*,
      district.district_name,
      user_w.user_id AS ward_manager_id,
      user_w.username AS ward_manager_username,
      user_w.email AS ward_manager_email,
      user_w.dob AS ward_manager_dob,
      user_w.phone AS ward_manager_phone,
      user_w.user_type AS ward_manager_type
    FROM ward
    JOIN district ON ward.district_id = district.district_id
    LEFT JOIN user AS user_d ON district.manager_id = user_d.user_id
    LEFT JOIN user AS user_w ON ward.manager_id = user_w.user_id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

const getUserWithoutMgmt = catchAsync(async (req, res, next) => {
  const query = `
    SELECT u.user_id, u.username
    FROM user u
    LEFT JOIN district d ON u.user_id = d.manager_id
    LEFT JOIN ward w ON u.user_id = w.manager_id
    WHERE u.user_type IN ('district', 'ward') AND (d.manager_id IS NULL AND w.manager_id IS NULL) AND u.user_type <> 'admin';
  `;

  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json(results);
  });
});

const createAddress = catchAsync(async (req, res, next) => {
  const { addressType, districtName, selectedDistrict, wardName, user_id } = req.body;

  if (addressType === 'district') {
    const checkDistrict = 'SELECT * FROM district WHERE district_name = ?';
    connection.query(checkDistrict, [districtName], (checkError, checkResults) => {
      if (checkError) {
        console.error('Error checking district existence:', checkError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (checkResults.length > 0) {
        // Quận đã tồn tại, trả về lỗi
        res.status(400).json({ error: 'District name already exists' });
        return;
      }

      const insertDistrict = 'INSERT INTO district (district_name, manager_id) VALUES (?, ?)';
      connection.query(insertDistrict, [districtName, user_id], (error, results) => {
        if (error) {
          console.error('Error creating district:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(201).json({
            status: 'success',
            district_id: results.insertId,
            district_name: districtName,
            manager_id: user_id,
          });
        }
      });
    });
  } else if (addressType === 'ward') {
    const checkWard = 'SELECT * FROM ward WHERE ward_name = ? AND district_id = ?';
    connection.query(checkWard, [wardName, selectedDistrict], (checkError, checkResults) => {
      if (checkError) {
        console.error('Error checking ward existence:', checkError);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (checkResults.length > 0) {
        // Phường đã tồn tại, trả về lỗi
        res.status(400).json({ error: 'Ward name already exists in this district' });
        return;
      }

      // Nếu phường chưa tồn tại, thêm vào cơ sở dữ liệu
      const insertWard = 'INSERT INTO ward (ward_name, district_id, manager_id) VALUES (?, ?, ?)';
      connection.query(insertWard, [wardName, selectedDistrict, user_id], (error, results) => {
        if (error) {
          console.error('Error creating ward:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(201).json({
            status: 'success',
            ward_id: results.insertId,
            ward_name: wardName,
            district_id: selectedDistrict,
            manager_id: user_id,
          });
        }
      });
    });
  } else {
    res.status(400).json({ error: 'Invalid address type' });
  }
});

const updateAddress = catchAsync(async (req, res, next) => {
  const { addressType, id, districtName, selectedDistrict, wardName, user_id } = req.body;

  if (!id || !addressType) {
    return res.status(400).json({ error: 'Missing required information.' });
  }

  try {
    if (addressType === 'district') {
      const updateDistrict = 'UPDATE district SET district_name = ?, manager_id = ? WHERE district_id = ?';
      connection.query(updateDistrict, [districtName, user_id, id], (error, results) => {
        if (error) {
          console.error('Error updating district:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res
            .status(200)
            .json({ status: 'success', district_id: id, district_name: districtName, manager_id: user_id });
        }
      });
    } else if (addressType === 'ward') {
      const updateWard = 'UPDATE ward SET ward_name = ?, district_id = ?, manager_id = ? WHERE ward_id = ?';
      connection.query(updateWard, [wardName, selectedDistrict, user_id, id], (error, results) => {
        if (error) {
          console.error('Error updating ward:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({
            status: 'success',
            ward_id: id,
            ward_name: wardName,
            district_id: selectedDistrict,
            manager_id: user_id,
          });
        }
      });
    } else {
      res.status(400).json({ error: 'Invalid address type' });
    }
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const deleteAddress = catchAsync(async (req, res, next) => {
  const { id, type } = req.body;

  if (!id || !type) {
    return res.status(400).json({ error: 'Thiếu thông tin cần thiết.' });
  }

  try {
    if (type === 'district') {
      connection.query('DELETE FROM district WHERE district_id = ?', [id], (error, results) => {
        if (error) {
          console.error('Error creating ward:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ status: 'success' });
        }
      });
    } else if (type === 'ward') {
      connection.query('DELETE FROM ward WHERE ward_id = ?', [id], (error, results) => {
        if (error) {
          console.error('Error creating ward:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ status: 'success' });
        }
      });
    } else {
      res.status(400).json({ error: 'Loại đối tượng không hợp lệ.' });
    }
  } catch (error) {
    console.error('Error deleting object: ', error);
    res.status(500).send('Internal Server Error');
  }
});

const getWardsByDistrictId = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const selectWardsQuery = `
  SELECT * FROM ward
  WHERE manager_id IS NULL
  AND district_id = ?
`;

  connection.query(selectWardsQuery, [id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    // const response = results[0]
    return res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

const getDistrictsEmpty = catchAsync(async (req, res, next) => {
  const selectWardsQuery = `
  SELECT * FROM district
  WHERE manager_id IS NULL
`;

  connection.query(selectWardsQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    // const response = results[0]
    return res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

const getDistrictsWithWardEmpty = catchAsync(async (req, res, next) => {
  const queryString = `
  SELECT DISTINCT d.*
  FROM district d
  INNER JOIN ward w ON d.district_id = w.district_id
  WHERE w.manager_id IS NULL;
`;

  connection.query(queryString, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    // const response = results[0]
    return res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

const checkUserWard = catchAsync(async (req, res, next) => {
  const { point_id } = req.params;
  connection.query(
    'SELECT user.* FROM advertising_point JOIN ward ON advertising_point.ward_id = ward.ward_id JOIN user ON ward.manager_id = user.user_id WHERE advertising_point.point_id = ?',
    [point_id],
    (err, detailResult) => {
      if (err) {
        console.error('Error executing query: ' + err.stack);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({
        checked: detailResult[0].user_id === req.user.user_id
      });
    })
})

module.exports = {
  getDistrictsWithWardEmpty,
  getDistrictsEmpty,
  getWardsByDistrictId,
  getAllDistrictWard,
  getDistricts,
  getWards,
  createAddress,
  updateAddress,
  deleteAddress,
  getUserWithoutMgmt,
  checkUserWard
};

