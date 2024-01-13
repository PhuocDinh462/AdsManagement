import { faEye, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import { selectSelectedWards, selectUser, setReportCoord, setReportIndex } from '~/src/store/reducers';
import request from '~/src/utils/request';
import Pagination from '~components/Pagination';
import SearchBar from '~components/SearchBar';
import classes from './styles.module.scss';

export default function Reports() {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedWards = useSelector(selectSelectedWards);
  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const fetchWardsReports = async () => {
    let reports = [];
    setLoading(true);
    for (let i = 0; i < selectedWards.length; i++) {
      await axiosPrivate
        .get(`ward/getReportListsByWardId/${selectedWards[i].ward_id}`)
        .then((res) => {
          if (res.data.data.length > 0) {
            for (let j = 0; j < res.data.data.length; j++) {
              reports.push(res.data.data[j]);
            }
          }
        })
        .catch((error) => {
          console.log('Get report lists error: ', error);
        });
    }
    setData(reports.reverse());
    setFilteredData(reports.reverse());
    setLoading(false);
  };
  const fetchSingleWardReports = async () => {
    await axiosPrivate
      .get(`ward/getReportListsByWardId/${user.ward_id}`)
      .then((res) => {
        const data = res.data.data;
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => {
        console.log('Get report lists error: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const checkUserWard = async (point_id) => {
    try {
      const res = await request.get(`/cadre/checkUserWard/${point_id}`);
      return res.data.checked;
    } catch (error) {
      console.error(error);
    }
  };

  const checkUserDistrict = async (point_id) => {
    try {
      const res = await request.get(`/cadre/checkUserDistrict/${point_id}`);
      return res.data.checked;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSocketEvent = async (eventData) => {
    // if (user.user_type === 'ward') {
    //   const checked = await checkUserWard(eventData.point_id);
    //   if (checked) {
    //     fetchSingleWardReports();
    //     alert('New Report Sent to Ward');
    //   }
    // } else if (user.user_type === 'district') {
    //   const checked = await checkUserDistrict(eventData.point_id);
    //   if (checked) {
    //     fetchWardsReports();
    //     alert('New Report Sent to District');
    //   }
    // }

    // Add report to data and filteredData
    if (eventData.point_id) {
      setData(
        data
          .map((item) => {
            return {
              ...item,
              numberOfReports: item.numberOfReports + +(item.point_id === eventData.point_id),
              latestReport: item.point_id === eventData.point_id ? eventData.created_at : item.latestReport,
            };
          })
          .sort((a, b) => new Date(b.latestReport) - new Date(a.latestReport))
      );
      setFilteredData(
        filteredData
          .map((item) => {
            return {
              ...item,
              numberOfReports: item.numberOfReports + +(item.point_id === eventData.point_id),
              latestReport: item.point_id === eventData.point_id ? eventData.created_at : item.latestReport,
            };
          })
          .sort((a, b) => new Date(b.latestReport) - new Date(a.latestReport))
      );
    } else if (eventData.board_id) {
      await axiosPrivate
        .get(`ward/getAdBoardByBoardId/${eventData.board_id}`)
        .then(async (res) => {
          setData(
            data
              .map((item) => {
                return {
                  ...item,
                  numberOfReports: item.numberOfReports + +(item.point_id === res.data.data.point_id),
                  latestReport: item.point_id === res.data.data.point_id ? eventData.created_at : item.latestReport,
                };
              })
              .sort((a, b) => new Date(b.latestReport) - new Date(a.latestReport))
          );
          setFilteredData(
            filteredData
              .map((item) => {
                return {
                  ...item,
                  numberOfReports: item.numberOfReports + +(item.point_id === res.data.data.point_id),
                  latestReport: item.point_id === res.data.data.point_id ? eventData.created_at : item.latestReport,
                };
              })
              .sort((a, b) => new Date(b.latestReport) - new Date(a.latestReport))
          );
        })
        .catch((error) => {
          console.log('Get AdBoard error: ', error);
        });
    }
  };

  // Subscribe to the socket events when the component mounts
  useSocketSubscribe('createReport', handleSocketEvent);

  // Use when user reports a spot that isn't adSpot
  useSocketSubscribe(`createReport_wardId=${user?.ward_id}`, async (eventData) => {
    // If current data already had the point
    if (data.some((item) => item.lat === eventData.lat && item.lng === eventData.lng)) {
      setData(
        data
          .map((item) => {
            return {
              ...item,
              numberOfReports: item.numberOfReports + +(item.lat === eventData.lat && item.lng === eventData.lng),
              latestReport: item.point_id === eventData.point_id ? eventData.created_at : item.latestReport,
            };
          })
          .sort((a, b) => new Date(b.latestReport) - new Date(a.latestReport))
      );
      setFilteredData(
        filteredData
          .map((item) => {
            return {
              ...item,
              numberOfReports: item.numberOfReports + +(item.lat === eventData.lat && item.lng === eventData.lng),
              latestReport: item.point_id === eventData.point_id ? eventData.created_at : item.latestReport,
            };
          })
          .sort((a, b) => new Date(b.latestReport) - new Date(a.latestReport))
      );
    } else {
      const response = await fetch(
        `https://rsapi.goong.io/Geocode?latlng=${eventData.lat},${eventData.lng}&api_key=${process.env.REACT_APP_GOONG_APIKEY}`
      );
      const _data = await response.json();
      const reportAddress =
        !_data?.error && _data?.status === 'OK' ? _data.results[0]?.formatted_address?.replace('Phường', '') : null;

      setData([
        ...data,
        {
          address: reportAddress,
          numberOfReports: 1,
          lat: eventData.lat,
          lng: eventData.lng,
          latestReport: new Date(),
        },
      ]);

      setFilteredData([
        ...filteredData,
        {
          address: reportAddress,
          numberOfReports: 1,
          lat: eventData.lat,
          lng: eventData.lng,
          latestReport: new Date(),
        },
      ]);
    }
  });

  useEffect(() => {
    if (user.user_type === 'ward') {
      (async () => {
        await axiosPrivate
          .get(`ward/getReportListsByWardId/${user.ward_id}`)
          .then((res) => {
            const data = res.data.data.sort((a, b) => new Date(b.latestReport) - new Date(a.latestReport));
            setData(data);
            setFilteredData(data);
          })
          .catch((error) => {
            console.log('Get report lists error: ', error);
          })
          .finally(() => {
            setLoading(false);
          });
      })();
    } else if (user.user_type === 'district') {
      fetchWardsReports();
    }
  }, [selectedWards]);

  const [filterKeyword, setFilterKeyword] = useState('');

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, data, filteredData]);

  useEffect(() => {
    if (!filterKeyword) {
      setFilteredData(data);
      return;
    }

    setFilteredData(
      data.filter((item) =>
        item.address
          .toLowerCase()
          .includes(filterKeyword.toLowerCase() || item.numberOfReports.toString() === filterKeyword)
      )
    );
  }, [filterKeyword]);

  return (
    <div className={classes.main_container}>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <div className={classes.searchBar_container}>
            <SearchBar placeholder="Tìm kiếm..." onChange={(keyword) => setFilterKeyword(keyword)} />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '50%' }}>Địa chỉ</th>
                <th style={{ width: '15%' }}>Số đơn báo cáo</th>
                <th style={{ width: '20%' }}>Ngày báo cáo gần nhất</th>
                <th style={{ width: '10%' }}>Công cụ</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {!loading &&
                currentTableData.map((row, rowIndex) => (
                  <tr className={classes.table__body_wrap_row} key={rowIndex}>
                    <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                    <td style={{ width: '50%' }}>{row.address}</td>
                    <td style={{ width: '15%' }}>{row.numberOfReports}</td>
                    <td style={{ width: '20%' }}>
                      {row.latestReport && format(new Date(row.latestReport), 'dd/MM/yyyy HH:mm:ss')}
                    </td>
                    <td style={{ width: '10%' }}>
                      <button
                        className={classes.btn_info}
                        onClick={() => {
                          dispatch(setReportCoord({ lat: row.lat, lng: row.lng }));
                          navigate('/home');
                        }}
                      >
                        <div className={classes.icon_container}>
                          <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                      </button>
                      <button
                        className={classes.btn_detail}
                        onClick={() => {
                          dispatch(setReportIndex(0));
                          navigate(`/reports/detail/${row?.point_id || row.lat + ',' + row.lng}`);
                        }}
                      >
                        <div className={classes.icon_container}>
                          <FontAwesomeIcon icon={faEye} />
                        </div>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={classes.paginationBar_container}>
        <Pagination
          currentPage={currentPage}
          totalCount={filteredData.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
