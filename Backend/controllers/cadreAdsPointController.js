const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

const getAllAdsPoint = catchAsync(async (req, res, next) => {
  const query = `
    SELECT 
      ap.*,
      w.ward_name,
      w.district_id,
      d.district_name
    FROM advertising_point ap
    INNER JOIN ward w ON ap.ward_id = w.ward_id
    INNER JOIN district d ON w.district_id = d.district_id;
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

const addAdsPoint = catchAsync(async (req, res, next) => {
  const { address, region, location_type, advertising_type, image_url, lat, lng, is_planning, ward_id } = req.body;

  const query = `
    INSERT INTO advertising_point 
      (address, region, location_type, advertising_type, image_url, lat, lng, is_planning, ward_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  connection.query(
    query,
    [address, region, location_type, advertising_type, image_url, lat, lng, is_planning, ward_id],
    (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(201).json({ status: 'success', insertedId: result.insertId });
    }
  );
});

module.exports = { getAllAdsPoint, addAdsPoint };

