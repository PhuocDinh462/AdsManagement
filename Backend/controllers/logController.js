const catchAsync = require('../utils/catchAsync');
const connection = require('../server'); // Sử dụng module quản lý kết nối cơ sở dữ liệu
const logConstants = require('../constants/logConstant.js');

const getAllLogs = catchAsync(async (req, res, next) => {
  connection.query(`SELECT * FROM log`, (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({
      status: 'success',
      data: results,
    });
  });
});

const isValidDateTimeFormat = (dateTimeString) => {
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}(:\d{2}(:\d{2})?)?$/;
  return dateTimeRegex.test(dateTimeString);
};

const searchDetailLog = catchAsync(async (req, res, next) => {
  const { time_start, time_end, ...otherCondition } = req.body;

  if (!isValidDateTimeFormat(time_start)) {
    return res.status(500).json({
      status: 'Invalid datetime format',
      error: "time_start must be format by 'yyyy-mm-dd hh:mm:ss'",
    });
  } else if (!isValidDateTimeFormat(time_end)) {
    return res.status(500).json({
      status: 'Invalid datetime format',
      error: "time_end must be format by 'yyyy-mm-dd hh:mm:ss'",
    });
  }

  const conditions = Object.entries(otherCondition)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => `${key} = '${value}'`)
    .join(' AND ');

  const newTimeStart = convertStringToDate(time_start);
  const newTimeEnd = convertStringToDate(time_end);

  let selectQuery = `select * from log where time_request between ? and ?`;

  selectQuery += conditions.length > 0 ? ` and ${conditions}` : '';

  connection.query(selectQuery, [newTimeStart, newTimeEnd], (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({
      status: 'Search log successfully',
      data: results,
    });
  });
});

const convertStringToDate = (str) => {
  const [datePart, timePart] = str.split(' ');

  const [year, month, day] = datePart.split('-');
  const [hours, minutes, seconds] = timePart.split(':');

  return new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes ?? 0),
    parseInt(seconds ?? 0)
  );
};

const addLog = (tokens, req, res) => {
  const data = {
    data_request: tokens.req_body(req, res),
    response: tokens.res_body(req, res),
    method: tokens.method(req, res),
    path: tokens.url(req, res),
    status: tokens.status(req, res),
    browser: tokens['user-agent'](req, res),
  };

  // Kiểm tra số lượng dòng
  const rowCountQuery = `SELECT COUNT(*) AS rowCount FROM log`;
  connection.query(rowCountQuery, (err, results) => {
    if (err) {
      console.error('Count log error:', err);
      return;
    }
    const rowCount = results[0].rowCount;
    if (rowCount >= logConstants.rowLimit) {
      const deleteQuery = `DELETE FROM log ORDER BY id LIMIT 1`;
      connection.query(deleteQuery, (err) => {
        if (err) {
          console.error('Delete log error:', err);
          return;
        }
      });
    }
  });

  const insertQuery = `INSERT INTO log (data_request, response, method, path, status, browser) VALUES
('${data.data_request}', '${data.response}', '${data.method}',
'${data.path}', '${data.status}', '${data.browser}')`;

  connection.query(insertQuery, (err) => {
    if (err) console.error('Add log error:', err);
  });

  // return JSON.stringify(data);
};

module.exports = { searchDetailLog, getAllLogs, addLog };
