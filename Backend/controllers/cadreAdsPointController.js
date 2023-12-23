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
  const { location_type, image_url, lat, lng, is_planning, form_ads, ward_id } = req.body;

  const query = `
    INSERT INTO advertising_point 
      (location_type, image_url, lat, lng, is_planning, form_ads, ward_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;

  connection.query(query, [location_type, image_url, lat, lng, is_planning, form_ads, ward_id], (error, result) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.status(201).json({ status: 'success', insertedId: result.insertId });
  });
});

const updateAdsPoint = catchAsync(async (req, res, next) => {
  const { point_id, location_type, image_url, lat, lng, is_planning, form_ads, ward_id } = req.body;

  const query = `
    UPDATE advertising_point
    SET
      location_type = ?,
      image_url = ?,
      lat = ?,
      lng = ?,
      is_planning = ?,
      form_ads = ?,
      ward_id = ?
    WHERE point_id = ?;
  `;

  connection.query(
    query,
    [location_type, image_url, lat, lng, is_planning, form_ads, ward_id, point_id],
    (error, result) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Point not found' });
        return;
      }

      res.status(200).json({ status: 'success', updatedId: point_id });
    }
  );
});

const deleteAdsPoint = catchAsync(async (req, res, next) => {
  const { pointId } = req.params;

  const query = `
    DELETE FROM advertising_point
    WHERE point_id = ?;
  `;

  connection.query(query, [pointId], (error, result) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Point not found' });
      return;
    }

    res.status(200).json({ status: 'success', deletedId: pointId });
  });
});

module.exports = { getAllAdsPoint, addAdsPoint, updateAdsPoint, deleteAdsPoint };

