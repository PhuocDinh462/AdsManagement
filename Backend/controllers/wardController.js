const catchAsync = require('../utils/catchAsync');
const connection = require('../server');
const socketIO = require('socket.io');
const socket = require('../app');

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

      connection.query(
        'SELECT * FROM report rp JOIN detail dt ON rp.detail_id = dt.detail_id',
        [req.params.id],
        (err, results) => {
          if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          const reports = results;

          // Find spots which is adSpot
          const adSpots = spots.map((spot) => {
            let reportStatus = 'noReport';

            const spotReports = reports.filter((report) => report.point_id === spot.point_id);
            const idBoardOfThis = boards
              .filter((board) => board.point_id === spot.point_id)
              .map((board) => board.board_id);
            const boardReports = reports.filter((report) => idBoardOfThis.includes(report.board_id));
            const allReports = [...spotReports, ...boardReports];

            if (allReports.length > 0) {
              if (allReports.filter((report) => report.status === 'processed').length === allReports.length)
                reportStatus = 'processed';
              else reportStatus = 'noProcess';
            }

            return {
              ...spot,
              numberOfBoards: boards.filter((board) => board.point_id === spot.point_id).length,
              reportStatus: 1,
              reportStatus: reportStatus,
            };
          });

          // Find spots have report but isn't adSpot
          const reportSpots = reports
            .filter((report) => !report.point_id && !report.board_id)
            .map((spot) => {
              return {
                lat: spot.lat,
                lng: spot.lng,
                reportStatus: spot.status === 'processed' ? 'processed' : 'noProcess',
              };
            });

          // Tạo một đối tượng Map để theo dõi các cặp lat và lng đã xuất hiện
          const latLngMap = new Map();

          // Lọc và tạo mảng mới dựa trên điều kiện
          const reportSpotsFiltered = reportSpots.filter((item) => {
            const latLngKey = `${item.lat}-${item.lng}`;

            // Nếu lat và lng chưa xuất hiện, thêm vào Map và giữ lại phần tử
            if (!latLngMap.has(latLngKey)) {
              latLngMap.set(latLngKey, true);
              return true;
            }

            // Nếu đã xuất hiện, chỉ giữ lại các phần tử có reportStatus là "noProcess"
            return item.reportStatus === 'noProcess';
          });

          res.status(200).json({
            status: 'success',
            data: [...adSpots, ...reportSpotsFiltered],
          });
        }
      );
    });
  });
});

const getInfoByPointId = catchAsync(async (req, res, next) => {
  connection.query(
    'SELECT * FROM advertising_point adp JOIN advertisement_type adt ON adp.advertisement_type_id = adt.advertisement_type_id where point_id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const spotInfo = results;

      connection.query(
        'SELECT * FROM advertising_board adb JOIN board_type adt ON adb.board_type_id = adt.board_type_id WHERE adb.point_id = ?',
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
                        (report) => report.point_id === spotInfo[0].point_id && report.status !== 'processed'
                      ).length,
                    }
                  : null,
                boardInfo: boardInfo.map((item) => {
                  return {
                    ...item,
                    reports: reports.filter(
                      (report) => report.board_id === item.board_id && report.status !== 'processed'
                    ).length,
                  };
                }),
              },
            });
          });
        }
      );
    }
  );
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

const getReportListsByWardId = catchAsync(async (req, res, next) => {
  connection.query('SELECT * FROM advertising_point where ward_id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const spots = results;

    connection.query('SELECT * FROM advertising_board', (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const boards = results;

      connection.query('SELECT * FROM report', async (err, results) => {
        if (err) {
          console.error('Error executing query: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        const reports = results;

        const spotReports = spots
          .map((spot) => ({
            ...spot,
            spotReports: reports.filter((report) => report.point_id === spot.point_id),
          }))
          .map((spot) => ({
            ...spot,
            idBoardOfThis: boards.filter((board) => board.point_id === spot.point_id).map((board) => board.board_id),
          }))
          .map((spot) => ({
            ...spot,
            boardReports: reports.filter((report) => spot.idBoardOfThis.includes(report.board_id)),
          }))
          .map((spot) => ({
            ...spot,
            allReports: [...spot.spotReports, ...spot.boardReports],
          }));

        const filteredSpots = spotReports
          .filter((spot) => spot.allReports.length > 0)
          .map((spot) => ({
            point_id: spot.point_id,
            lat: spot.lat,
            lng: spot.lng,
            numberOfReports: spot.allReports.length,
            lastReport: spot.allReports.map((report) => report.created_at).sort((a, b) => new Date(b) - new Date(a))[0],
          }));

        const finalData = await Promise.all(
          filteredSpots.map(async (spot) => {
            const url = `https://rsapi.goong.io/Geocode?latlng=${spot.lat},${spot.lng}&api_key=${process.env.GOONG_APIKEY}`;
            const response = await fetch(url);
            const data = await response.json();

            return {
              point_id: spot.point_id,
              address: data?.error ? null : data.results[0].formatted_address,
              numberOfReports: spot.numberOfReports,
              latestReport: spot.lastReport,
            };
          })
        );

        res.status(200).json({
          status: 'success',
          data: finalData,
        });
      });
    });
  });
});

const getReportDetailsByPointId = catchAsync(async (req, res, next) => {
  connection.query('SELECT * FROM advertising_point where point_id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const spot = results;

    connection.query('SELECT * FROM advertising_board where point_id = ?', [req.params.id], (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const boards = results;

      connection.query(
        'SELECT * FROM report rp JOIN detail dt ON rp.detail_id = dt.detail_id JOIN report_type rt ON rp.report_type_id = rt.report_type_id',
        async (err, results) => {
          if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Internal Server Error');
            return;
          }
          const reports = results;

          const spotReports = spot
            .map((spot) => ({
              ...spot,
              spotReports: reports.filter((report) => report.point_id === spot.point_id),
            }))
            .map((spot) => ({
              ...spot,
              idBoardOfThis: boards.filter((board) => board.point_id === spot.point_id).map((board) => board.board_id),
            }))
            .map((spot) => ({
              ...spot,
              boardReports: reports.filter((report) => spot.idBoardOfThis.includes(report.board_id)),
            }))
            .map((spot) => ({
              ...spot,
              allReports: [...spot.spotReports, ...spot.boardReports],
            }));

          const filteredSpots = spotReports
            .filter((spot) => spot.allReports.length > 0)
            .map((spot) => ({
              point_id: spot.point_id,
              lat: spot.lat,
              lng: spot.lng,
              reports: spot.allReports.map((report) => {
                const { image_url_1, image_url_2, ...restReport } = report;

                return {
                  ...restReport,
                  reportedObject: report.point_id ? 'Địa điểm' : 'Bảng quảng cáo',
                  image_urls: [report.image_url_1, report.image_url_2],
                  status:
                    report.status === 'processed'
                      ? 'Đã xử lý'
                      : report.status === 'processing'
                      ? 'Đang xử lý'
                      : 'Chờ xử lý',
                };
              }),
            }));

          const finalData = await Promise.all(
            filteredSpots.map(async (spot) => {
              const url = `https://rsapi.goong.io/Geocode?latlng=${spot.lat},${spot.lng}&api_key=${process.env.GOONG_APIKEY}`;
              const response = await fetch(url);
              const data = await response.json();

              return {
                point_id: spot.point_id,
                address: data?.error ? null : data.results[0].formatted_address,
                reports: spot.reports,
              };
            })
          );

          res.status(200).json({
            status: 'success',
            data: finalData[0],
          });
        }
      );
    });
  });
});

const updateReportStatus = catchAsync(async (req, res, next) => {
  const { id, status } = req.body;

  connection.query('update report set status = ? where report_id = ?', [status, id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.affectedRows === 0) res.status(401).json({ status: 'fail', msg: 'report_id is not exist' });

    connection.query('select * from report where report_id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      socket?.socketIo?.emit('changeReport', { method: 'update', data: results[0] });
      res.status(200).json({ status: 'success', data: results });
    });
  });
});

const getAdBoardByBoardId = catchAsync(async (req, res, next) => {
  const query = 'SELECT * FROM advertising_board where board_id = ?';

  connection.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(200).json({ status: 'success', data: results[0] || null });
  });
});

const getNumberOfReportsByLatLng = catchAsync(async (req, res, next) => {
  const { lat, lng } = req.body;

  connection.query(
    'SELECT * FROM report rp JOIN detail dt ON rp.detail_id = dt.detail_id where lat = ? and lng = ? and point_id is NULL and board_id is NULL',
    [lat, lng],
    (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(200).json({ status: 'success', data: { numberOfReports: results.length } });
    }
  );
});

module.exports = {
  getAdSpotsByWardId,
  getInfoByPointId,
  getAdBoardsBySpotId,
  getReportListsByWardId,
  getReportDetailsByPointId,
  updateReportStatus,
  getAdBoardByBoardId,
  getNumberOfReportsByLatLng,
};
