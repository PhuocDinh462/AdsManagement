const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

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

const getDistricts = catchAsync(async (req, res, next) => {
  const query = 'SELECT * FROM district';
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
  const query =
    'SELECT ward.*, district.district_name FROM ward JOIN district ON ward.district_id = district.district_id';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

const createAddress = catchAsync(async (req, res, next) => {
  const { addressType, districtName, selectedDistrict, wardName } = req.body;

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

      const insertDistrict = 'INSERT INTO district (district_name) VALUES (?)';
      connection.query(insertDistrict, [districtName], (error, results) => {
        if (error) {
          console.error('Error creating district:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(201).json({ status: 'success', district_id: results.insertId, district_name: districtName });
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
      const insertWard = 'INSERT INTO ward (ward_name, district_id) VALUES (?, ?)';
      connection.query(insertWard, [wardName, selectedDistrict], (error, results) => {
        if (error) {
          console.error('Error creating ward:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res
            .status(201)
            .json({ status: 'success', ward_id: results.insertId, ward_name: wardName, district_id: selectedDistrict });
        }
      });
    });
  } else {
    res.status(400).json({ error: 'Invalid address type' });
  }
});

const updateAddress = catchAsync(async (req, res, next) => {
  const { addressType, id, districtName, selectedDistrict, wardName } = req.body;
  // console.log(req.body);
  console.log('req.body');

  if (!id || !addressType) {
    return res.status(400).json({ error: 'Missing required information.' });
  }

  try {
    if (addressType === 'district') {
      const updateDistrict = 'UPDATE district SET district_name = ? WHERE district_id = ?';
      connection.query(updateDistrict, [districtName, id], (error, results) => {
        if (error) {
          console.error('Error updating district:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ status: 'success', district_id: id, district_name: districtName });
        }
      });
    } else if (addressType === 'ward') {
      const updateWard = 'UPDATE ward SET ward_name = ?, district_id = ? WHERE ward_id = ?';
      connection.query(updateWard, [wardName, selectedDistrict, id], (error, results) => {
        if (error) {
          console.error('Error updating ward:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json({ status: 'success', ward_id: id, ward_name: wardName, district_id: selectedDistrict });
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
    console.log(results);

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
    console.log(results);

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
    console.log(results);

    // const response = results[0]
    return res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

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
};
