import { useEffect, useState } from 'react';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { axiosClient } from '~/src/api/axios';
import { selectUser } from '~/src/store/reducers';
import ReportDetails from './ReportDetails';
import classes from './style.module.scss';

const status = {
  pending: { type: 1, content: 'Chờ Xử Lý' },
  processing: { type: 2, content: 'Đang Xử Lý' },
  processed: { type: 3, content: 'Đã Xử Lý' },
};

const reportType = ['Tố giác sai phạm', 'Đăng ký nội dung', 'Đóng góp ý kiến'];

const ReportStats = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const [reportSelected, setReportSelected] = useState();

  const [numberOf, setNumberOf] = useState({ all: 0, pending: 0, processing: 0, processed: 0 });

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const handleOpenModalDetails = (data) => {
    setReportSelected(data);
    setIsOpenDetails(true);
  };

  const handleCloseModal = () => {
    setIsOpenDetails(false);
  };

  const handleFilterChange = (type) => {
    const filteredData = type === 0 ? data : data.filter((item) => status[item.status].type === type);
    setDataFilter(filteredData);
    setSelectedFilter(type);
  };

  const getFilterStyle = (filter) => ({
    color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
    borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
    cursor: 'pointer',
  });

  const fetchDataGetReports = async () => {
    const res = await axiosClient.get('/cadre/getAllReport', { headers });
    setData(res);
    setDataFilter(res);

    const pendingNum = res.reduce((accumulator, currentValue) => {
      if (currentValue.status === 'pending') {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);

    const processingNum = res.reduce((accumulator, currentValue) => {
      if (currentValue.status === 'processing') {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);

    const processedNum = res.reduce((accumulator, currentValue) => {
      if (currentValue.status === 'processed') {
        return accumulator + 1;
      }
      return accumulator;
    }, 0);

    setNumberOf({
      ...numberOf,
      all: res.length,
      pending: pendingNum,
      processing: processingNum,
      processed: processedNum,
    });
    console.log(res);
  };

  useEffect(() => {
    fetchDataGetReports();
  }, []);
  return (
    <div className={classes.container__wrap}>
      <div className={classes.container__wrap_header}>
        <p>Thống kê báo cáo và xử lý</p>
      </div>

      <div className={classes.container}>
        <div className={classes.container__header}>
          {/* Tab Filter */}
          <div className={classes.container__header_filter}>
            <div onClick={() => handleFilterChange(0)} style={getFilterStyle(0)}>
              Tất cả ({numberOf.all})
            </div>
            <div onClick={() => handleFilterChange(1)} style={getFilterStyle(1)}>
              {status['pending'].content} ({numberOf.pending})
            </div>
            <div onClick={() => handleFilterChange(2)} style={getFilterStyle(2)}>
              {status['processing'].content} ({numberOf.processing})
            </div>
            <div onClick={() => handleFilterChange(3)} style={getFilterStyle(3)}>
              {status['processed'].content} ({numberOf.processed})
            </div>
          </div>
          {/* Tab Search */}
          <div className={classes.container__header_search}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
            <input status="text" id="inputSearch" placeholder="Tìm kiếm..." className={classes.text_input} />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '15%' }}>Thời điểm gửi</th>
                <th style={{ width: '25%' }}>Email người gửi</th>
                <th style={{ width: '35%' }}>Loại báo cáo</th>
                <th style={{ width: '20%' }}>Trạng thái</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {dataFilter.map((row, rowIndex) => (
                <tr
                  className={classes.table__body_wrap_row}
                  key={row.report_id}
                  onClick={() => handleOpenModalDetails(row)}
                >
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '15%' }}>{row.report_time}</td>
                  <td style={{ width: '25%' }}>{row.email_rp}</td>
                  <td style={{ width: '35%' }}>{reportType[row.report_type_id]}</td>
                  <td style={{ width: '20%' }}>
                    <div
                      className={` ${classes.status} ${
                        status[row.status].type === 1
                          ? classes.status_pending
                          : status[row.status].type === 1
                          ? classes.status_processing
                          : classes.status_processed
                      }`}
                    >
                      {status[row.status].content}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenDetails && <ReportDetails info={reportSelected} handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default ReportStats;
