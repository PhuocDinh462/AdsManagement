const catchAsync = require('../utils/catchAsync');
const connection = require('../server');
const socket = require('../app');
const emailService = require('../service/emailService');

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
        async (err, results) => {
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

          connection.query(
            'SELECT * FROM ward JOIN district ON ward.district_id = district.district_id',
            [req.params.id],
            async (err, results) => {
              if (err) {
                console.error('Error executing query: ', err);
                res.status(500).send('Internal Server Error');
                return;
              }
              const wardName = results[0].ward_name;
              const districtName = results[0].district_name;

              // Find spots have report but isn't adSpot
              const reportSpots = await Promise.all(
                reports
                  .filter((report) => !report.point_id && !report.board_id)
                  .map(async (spot) => {
                    const url = `https://rsapi.goong.io/Geocode?latlng=${spot.lat},${spot.lng}&api_key=${process.env.GOONG_APIKEY}`;
                    const response = await fetch(url);
                    const data = await response.json();

                    return {
                      lat: spot.lat,
                      lng: spot.lng,
                      address: data?.error ? null : data.results[0].formatted_address,
                      reportStatus: spot.status === 'processed' ? 'processed' : 'noProcess',
                    };
                  })
              );

              // Tạo một đối tượng Map để theo dõi các cặp lat và lng đã xuất hiện
              const latLngMap = new Map();

              // Lọc và tạo mảng mới dựa trên điều kiện
              const reportSpotsCoord = reportSpots.filter((item) => {
                const latLngKey = `${item.lat}-${item.lng}`;

                // Nếu lat và lng chưa xuất hiện, thêm vào Map và giữ lại phần tử
                if (!latLngMap.has(latLngKey)) {
                  latLngMap.set(latLngKey, true);
                  return true;
                }
                return false;
              });

              const reportSpotsFiltered = reportSpotsCoord.map((spot) => {
                if (
                  reportSpots
                    .filter((item) => item.lat === spot.lat && item.lng === spot.lng)
                    .every((item) => item.reportStatus === 'processed')
                )
                  return { ...spot, reportStatus: 'processed' };
                return { ...spot, reportStatus: 'noProcess' };
              });

              res.status(200).json({
                status: 'success',
                data: [
                  ...adSpots,
                  ...reportSpotsFiltered.filter(
                    (spot) =>
                      spot.address?.toLowerCase().includes(wardName.toLowerCase()) &&
                      spot.address?.toLowerCase().includes(districtName.toLowerCase())
                  ),
                ],
              });
            }
          );
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
  connection.query(
    'select * from advertising_board ab join board_type bt on ab.board_type_id = bt.board_type_id where point_id = ?',
    [req.params.id],
    (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const boards = results;

      connection.query('select * from advertising_point where point_id = ?', [req.params.id], async (err, results) => {
        if (err) {
          console.error('Error executing query: ', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        spot = results[0];
        const url = `https://rsapi.goong.io/Geocode?latlng=${spot.lat},${spot.lng}&api_key=${process.env.GOONG_APIKEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const address = data?.error ? null : data.results[0].formatted_address;

        res.status(200).json({
          status: 'success',
          data: { address: address, lat: spot.lat, lng: spot.lng, boards: boards },
        });
      });
    }
  );
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

      connection.query(
        'SELECT * FROM report rp JOIN detail dt ON rp.detail_id = dt.detail_id',
        async (err, results) => {
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
              lastReport: spot.allReports
                .map((report) => report.created_at)
                .sort((a, b) => new Date(b) - new Date(a))[0],
            }));

          const adSpots = await Promise.all(
            filteredSpots.map(async (spot) => {
              const url = `https://rsapi.goong.io/Geocode?latlng=${spot.lat},${spot.lng}&api_key=${process.env.GOONG_APIKEY}`;
              const response = await fetch(url);
              const data = await response.json();

              return {
                point_id: spot.point_id,
                lat: spot.lat,
                lng: spot.lng,
                address: data?.error ? null : data.results[0].formatted_address,
                numberOfReports: spot.numberOfReports,
                latestReport: spot.lastReport,
              };
            })
          );

          // Find spots have report but isn't adSpot
          const reportSpots = await Promise.all(
            reports
              .filter((report) => !report.point_id && !report.board_id)
              .map(async (spot) => {
                const url = `https://rsapi.goong.io/Geocode?latlng=${spot.lat},${spot.lng}&api_key=${process.env.GOONG_APIKEY}`;
                const response = await fetch(url);
                const data = await response.json();

                return {
                  lat: spot.lat,
                  lng: spot.lng,
                  address: data?.error ? null : data.results[0]?.formatted_address,
                  created_at: spot.created_at,
                };
              })
          );

          // Tạo một đối tượng Map để theo dõi các cặp lat và lng đã xuất hiện
          const latLngMap = new Map();

          // Lọc và tạo mảng mới dựa trên điều kiện
          const reportSpotsCoord = reportSpots.filter((item) => {
            const latLngKey = `${item.lat}-${item.lng}`;

            // Nếu lat và lng chưa xuất hiện, thêm vào Map và giữ lại phần tử
            if (!latLngMap.has(latLngKey)) {
              latLngMap.set(latLngKey, true);
              return true;
            }
            return false;
          });

          const reportSpotsFiltered = reportSpotsCoord.map((spot) => {
            const currentReportSpot = reportSpots.filter((item) => item.lat === spot.lat && item.lng === spot.lng);

            return {
              address: spot.address || null,
              numberOfReports: currentReportSpot.length,
              lat: spot.lat,
              lng: spot.lng,
              latestReport: currentReportSpot
                .map((item) => item.created_at)
                .sort((a, b) => new Date(b) - new Date(a))[0],
            };
          });

          connection.query(
            'SELECT * FROM ward JOIN district ON ward.district_id = district.district_id',
            [req.params.id],
            async (err, results) => {
              if (err) {
                console.error('Error executing query: ', err);
                res.status(500).send('Internal Server Error');
                return;
              }
              const wardName = results[0].ward_name;
              const districtName = results[0].district_name;

              res.status(200).json({
                status: 'success',
                data: [
                  ...adSpots,
                  ...reportSpotsFiltered.filter(
                    (spot) =>
                      spot.address?.toLowerCase().includes(wardName.toLowerCase()) &&
                      spot.address?.toLowerCase().includes(districtName.toLowerCase())
                  ),
                ],
              });
            }
          );
        }
      );
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
                lat: spot.lat,
                lng: spot.lng,
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

const getReportDetailsByLatLng = catchAsync(async (req, res, next) => {
  const { lat, lng } = req.body;

  if (!lat || !lng)
    return res.status(401).json({
      status: 'fail',
      msg: "lat and lng can't be empty",
    });

  connection.query(
    'SELECT * FROM report rp JOIN detail dt ON rp.detail_id = dt.detail_id JOIN report_type rt ON rp.report_type_id = rt.report_type_id where lat = ? and lng = ? and rp.point_id is NULL and rp.board_id is NULL',
    [lat, lng],
    async (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      const reports = results;
      const url = `https://rsapi.goong.io/Geocode?latlng=${reports[0]?.lat},${reports[0]?.lng}&api_key=${process.env.GOONG_APIKEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const address = data?.error ? null : data.results[0]?.formatted_address;

      res.status(200).json({
        status: 'success',
        data: {
          address: address,
          lat: lat,
          lng: lng,
          reports: reports.map((report) => {
            const { image_url_1, image_url_2, ...restReport } = report;
            return {
              ...restReport,
              reportedObject: 'Địa điểm',
              image_urls: [report.image_url_1, report.image_url_2],
              status:
                report.status === 'processed'
                  ? 'Đã xử lý'
                  : report.status === 'processing'
                  ? 'Đang xử lý'
                  : 'Chờ xử lý',
            };
          }),
        },
      });
    }
  );
});

const updateReportStatus = catchAsync(async (req, res, next) => {
  const { id, status, handlingMethod } = req.body;

  connection.query(
    'update report set status = ?, processing_info = ? where report_id = ?',
    [status, handlingMethod, id],
    (err, results) => {
      if (err) {
        console.error('Error executing query: ', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (results.affectedRows === 0) res.status(401).json({ status: 'fail', msg: 'report_id is not exist' });

      connection.query(
        'select * from report rp join detail dt on rp.detail_id = dt.detail_id where report_id = ?',
        [id],
        async (err, results) => {
          if (err) {
            console.error('Error executing query: ', err);
            res.status(500).send('Internal Server Error');
            return;
          }

          socket?.socketIo?.emit('changeReport', { method: 'update', data: results[0] });

          // Send mail
          let content;

          if (results[0].status === 'pending')
            content = `<p>Chào bạn,</p>
          <p>
            Chúng tôi đã nhận được báo cáo của bạn. Chúng tôi đang xem xét và sẽ sớm phản hồi cho bạn trong thời gian sớm nhất.
          </p>
          <br/>
          <br/>
          <p>Trân trọng!</p>`;
          else if (results[0].status === 'processing')
            content = `<p>Chào bạn,</p>
          <p>
            Sau khi xem xét báo cáo của bạn, chúng tôi đã đưa ra cách giải quyết như sau: ${handlingMethod}
          </p>
          <br/>
          <br/>
          <p>Trân trọng!</p>`;
          else
            content = `<p>Chào bạn,</p>
          <p>
            Chúng tôi đã giải quyết xong báo cáo của bạn. Chúc bạn một ngày mới tốt lành.
          </p>
          <br/>
          <br/>
          <p>Trân trọng!</p>`;

          await emailService.sendMail(results[0].email_rp, 'Báo cáo', content);

          res.status(200).json({ status: 'success', data: results });
        }
      );
    }
  );
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
    'SELECT * FROM report rp JOIN detail dt ON rp.detail_id = dt.detail_id where lat = ? and lng = ? and rp.status != "processed" and point_id is NULL and board_id is NULL',
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

const getAdSpotsListByWardId = catchAsync(async (req, res, next) => {
  connection.query('SELECT * FROM advertising_point where ward_id = ?', [req.params.id], async (err, results) => {
    if (err) {
      console.error('Error executing query: ', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const finalData = await Promise.all(
      results.map(async (spot) => {
        const url = `https://rsapi.goong.io/Geocode?latlng=${spot.lat},${spot.lng}&api_key=${process.env.GOONG_APIKEY}`;
        const response = await fetch(url);
        const data = await response.json();

        return {
          ...spot,
          address: data?.error ? null : data.results[0].formatted_address,
        };
      })
    );

    res.status(200).json({
      status: 'success',
      data: finalData,
    });
  });
});

const getAllWardsByDistrictManager = catchAsync(async (req, res, next) => {
  connection.query(
    `SELECT w.* FROM ward w JOIN district d ON w.district_id = d.district_id where d.manager_id = ?`,
    [req.user.user_id], // Đặt giá trị manager_id vào mảng tham số
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      } else {
        res.status(200).json({
          status: 'success',
          wards: results,
        });
      }
    }
  );
});
module.exports = {
  getAdSpotsByWardId,
  getInfoByPointId,
  getAdBoardsBySpotId,
  getReportListsByWardId,
  getReportDetailsByPointId,
  getReportDetailsByLatLng,
  updateReportStatus,
  getAdBoardByBoardId,
  getNumberOfReportsByLatLng,
  getAdSpotsListByWardId,
  getAllWardsByDistrictManager,
};
