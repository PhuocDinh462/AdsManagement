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
            spotReports.concat(boardReports);

            if (spotReports.length > 0) {
              if (spotReports.filter((report) => report.status === 'Processed').length === spotReports.length)
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

module.exports = { getAdSpotsByWardId, getAdBoardsBySpotId };
