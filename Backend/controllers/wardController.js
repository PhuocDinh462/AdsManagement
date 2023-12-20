const catchAsync = require('../utils/catchAsync');
const connection = require('../server');

const getAdSpotsByWardId = catchAsync(async (req, res, next) => {
  connection.query('SELECT * FROM advertising_point where ward_id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const spots = results;

    connection.query('SELECT * FROM advertising_board', [req.params.id], (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const boards = results;

      connection.query('SELECT * FROM report', [req.params.id], (err, results) => {
        if (err) {
          console.error('Error executing query: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const reports = results;

        res.status(200).json({
          status: 'success',
          data: spots.map((spot) => {
            let reportStatus = 'noReport';

            const spotReports = reports.filter((report) => report.point_id === spot.point_id);
            const idBoardOfThis = boards
              .filter((board) => board.point_id === spot.point_id)
              .map((board) => board.board_id);
            const boardReports = reports.filter((report) => idBoardOfThis.includes(report.board_id));
            const allReports = [...spotReports, ...boardReports];

            if (allReports.length > 0) {
              if (allReports.filter((report) => report.status === 'Processed').length === allReports.length)
                reportStatus = 'Processed';
              else reportStatus = 'noProcess';
            }

            return {
              ...spot,
              numberOfBoards: boards.filter((board) => board.point_id === spot.point_id).length,
              reportStatus: 1,
              reportStatus: reportStatus,
            };
          }),
        });
      });
    });
  });
});

const getInfoByPointId = catchAsync(async (req, res, next) => {
  connection.query('SELECT * FROM advertising_point where point_id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const spotInfo = results;

    connection.query(
      'SELECT * FROM advertising_board adb JOIN advertisement_type adt ON adb.board_type_id = adt.board_type_id WHERE adb.point_id = ?',
      [req.params.id],
      (err, results) => {
        if (err) {
          console.error('Error executing query: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const boardInfo = results;

        connection.query('SELECT * FROM report', (err, results) => {
          if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          const reports = results;

          res.status(200).json({
            status: 'success',
            data: {
              spotInfo: spotInfo[0]
                ? {
                    ...spotInfo[0],
                    reports: reports.filter(
                      (report) => report.point_id === spotInfo[0].point_id && report.status !== 'Processed'
                    ).length,
                  }
                : null,
              boardInfo: boardInfo.map((item) => {
                return {
                  ...item,
                  reports: reports.filter(
                    (report) => report.board_id === item.board_id && report.status !== 'Processed'
                  ).length,
                };
              }),
            },
          });
        });
      }
    );
  });
});

const getAdBoardsBySpotId = catchAsync(async (req, res, next) => {
  const query = 'SELECT * FROM advertising_board where point_id = ?';

  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(200).json({ status: 'success', data: results });
  });
});

module.exports = { getAdSpotsByWardId, getInfoByPointId, getAdBoardsBySpotId };
