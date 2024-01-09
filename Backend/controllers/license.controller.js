const catchAsync = require('../utils/catchAsync');
const connection = require('../server');
const socket = require('../app');

const createLicensingRequest = catchAsync(async (req, res, next) => {
  const { advertisement_content, advertisement_image_url, point_id, width, height, contract_id } = req.body;

  const queryInsert = `INSERT INTO licensing_request 
    (advertisement_content, advertisement_image_url,status,point_id,user_id,width,height,contract_id) 
    VALUES (?,?,"Pending",?,?,?,?,?)`;

  connection.query(
    queryInsert,
    [advertisement_content, advertisement_image_url, point_id, req.user.user_id, width, height, contract_id],
    (error, result) => {
      if (error) {
        console.error('Error executing query: ' + error.stack);
        return res.status(401).json({
          error: 'Invalid Information.',
        });
      }

      res.status(200).json({
        status: 'success',
      });
    }
  );
});

const getAllLicenseRequest = catchAsync(async (req, res) => {
  const query = `
      SELECT 
        lr.licensing_id, 
        lr.advertisement_content, 
        lr.advertisement_image_url, 
        lr.status, 
        lr.rejection_reason, 
        lr.user_id, 
        lr.board_type_id,
        lr.point_id, 
        lr.height,
        lr.width,
        lr.contract_id,
        lr.report_id,
        lr.created_at,
        lr.updated_at,
        ap.ward_id, 
        ap.address,
        ap.advertisement_type_id, 
        ap.location_type, 
        ap.image_url, 
        ap.lat, 
        ap.lng, 
        ap.is_planning, 
        c.company_name, 
        c.company_email, 
        c.company_phone, 
        c.company_address, 
        c.company_taxcode, 
        c.start_date, 
        c.end_date, 
        c.representative 
      FROM licensing_request lr 
      LEFT JOIN advertising_point ap ON lr.point_id = ap.point_id 
      LEFT JOIN contract c ON lr.contract_id = c.contract_id;`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

const getAllLicenseRequestByWard = catchAsync(async (req, res) => {
  const { user_id } = req.user;
  console.log(user_id);

  const queryData = `
    SELECT 
      lr.licensing_id, 
      lr.advertisement_content, 
      lr.advertisement_image_url, 
      lr.status, 
      lr.rejection_reason, 
      lr.user_id, 
      lr.point_id, 
      lr.height,
      lr.width,
      ap.ward_id, 
      ap.address,
      ap.advertisement_type_id, 
      ap.location_type, 
      ap.image_url, 
      ap.lat, 
      ap.lng, 
      ap.is_planning, 
      c.contract_id, 
      c.company_name, 
      c.company_email, 
      c.company_phone, 
      c.company_address, 
      c.company_taxcode, 
      c.start_date, 
      c.end_date, 
      c.representative 
    FROM licensing_request lr 
    JOIN advertising_point ap ON lr.point_id = ap.point_id 
    JOIN contract c ON lr.contract_id = c.contract_id 
    JOIN ward w ON w.manager_id = ? AND w.ward_id = ap.ward_id`;

  connection.query(queryData, [user_id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

const getAllLicenseRequestByWardId = catchAsync(async (req, res) => {
  const { ward_id } = req.params;

  const queryData = `
    SELECT
      lr.licensing_id,
      lr.advertisement_content,
      lr.advertisement_image_url,
      lr.status,
      lr.rejection_reason,
      lr.user_id,
      lr.point_id,
      lr.height,
      lr.width,
      ap.ward_id,
      ap.address,
      ap.advertisement_type_id,
      ap.location_type,
      ap.image_url,
      ap.lat,
      ap.lng,
      ap.is_planning,
      c.contract_id,
      c.company_name,
      c.company_email,
      c.company_phone,
      c.company_address,
      c.company_taxcode,
      c.start_date,
      c.end_date,
      c.representative
    FROM licensing_request lr
    JOIN advertising_point ap ON lr.point_id = ap.point_id
    JOIN contract c ON lr.contract_id = c.contract_id
    JOIN ward w ON w.ward_id = ap.ward_id
    WHERE w.ward_id = ${ward_id}`;

  connection.query(queryData, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

const updateStatusLicenseRequest = catchAsync(async (req, res, next) => {
  const licensingId = req.params.licensingId;
  const newStatus = req.body.status;

  // Kiểm tra trạng thái mới có hợp lệ không
  if (!['pending', 'approved', 'canceled'].includes(newStatus)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  // Cập nhật trạng thái trong cơ sở dữ liệu
  const updateQuery = 'UPDATE licensing_request SET `status` = ? WHERE licensing_id = ?';

  connection.query(updateQuery, [newStatus, licensingId], (error, results) => {
    if (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Không tìm thấy bản ghi với licensing ID cung cấp' });
    } else {
      socket?.socketIo?.emit('updateStatusLicenseRequest', { licensing_id: licensingId, status: newStatus });
      res.status(200).json({ status: 'success', data: { licensing_id: licensingId, status: newStatus } });
    }
  });
});

module.exports = {
  createLicensingRequest,
  getAllLicenseRequest,
  getAllLicenseRequestByWard,
  getAllLicenseRequestByWardId,
  updateStatusLicenseRequest,
};
