const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

const getAllReport = catchAsync(async (req, res, next) => {
  try {
    const query = `
      SELECT
        r.report_type_id,
        r.report_id,
        r.report_time,
        r.processing_info,
        r.fullname_rp,
        r.email_rp,
        r.phone_rp,
        r.status,
        r.created_at AS report_created_at,
        r.updated_at AS report_updated_at,
        d.detail_id,
        d.report_content,
        d.image_url_1,
        d.image_url_2,
        d.width,
        d.height,
        d.lat AS detail_lat,
        d.lng AS detail_lng,
        a.board_id,
        a.board_type_id,
        a.advertisement_content AS board_advertisement_content,
        a.advertisement_image_url AS board_advertisement_image_url,
        a.width AS board_width,
        a.height AS board_height,
        a.created_at AS board_created_at,
        a.updated_at AS board_updated_at,
        ap.point_id,
        ap.ward_id,
        ap.advertisement_type_id,
        ap.location_type,
        ap.image_url AS point_image_url,
        ap.lat AS point_lat,
        ap.lng AS point_lng,
        ap.is_planning,
        ap.created_at AS point_created_at,
        ap.updated_at AS point_updated_at
      FROM
        report r
      LEFT JOIN
        detail d ON r.detail_id = d.detail_id
      LEFT JOIN
        advertising_board a ON r.board_id = a.board_id
      LEFT JOIN
        advertising_point ap ON r.point_id = ap.point_id
    `;

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error in getAllReports:', error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
});

module.exports = { getAllReport };
