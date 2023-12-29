import React, { useState } from 'react';

import classes from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ReportDetails from './ReportDetails';
const initialData = [
  {
    id: 1,
    date: '12/10/2022',
    email: 'abc@gmail.com',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    typeReport: 'Tố giác sai phạm',
    status: { type: 1, content: 'Đã Xử Lý' },
  },
  {
    id: 2,
    date: '12/10/2022',
    email: 'abc@gmail.com',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    typeReport: 'Tố giác sai phạm',
    status: { type: 2, content: 'Đang Xử Lý' },
  },

  // Thêm dữ liệu khác
];
const ReportStats = () => {
  const [data, setData] = useState(initialData);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const handleOpenModalDetails = (data) => {
    setIsOpenDetails(true);
  };

  const handleCloseModal = () => {
    setIsOpenDetails(false);
  };

  const handleFilterChange = (type) => {
    const filteredData = type === 0 ? initialData : initialData.filter((item) => item.status.type === type);
    setData(filteredData);
    setSelectedFilter(type);
  };

  const getFilterStyle = (filter) => ({
    color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
    borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
    cursor: 'pointer',
  });
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
              Tất cả
            </div>
            <div onClick={() => handleFilterChange(1)} style={getFilterStyle(1)}>
              Đang xử lý
            </div>
            <div onClick={() => handleFilterChange(2)} style={getFilterStyle(2)}>
              Đã xử lý
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
              {data.map((row, rowIndex) => (
                <tr className={classes.table__body_wrap_row} key={row.id} onClick={() => handleOpenModalDetails(row)}>
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '15%' }}>{row.date}</td>
                  <td style={{ width: '25%' }}>{row.email}</td>
                  <td style={{ width: '35%' }}>{row.typeReport}</td>
                  <td style={{ width: '20%' }}>
                    <div
                      className={` ${classes.status} ${
                        row.status.type === 1
                          ? classes.status_accept
                          : row.status.type === 2
                          ? classes.status_pending
                          : classes.status_cancel
                      }`}
                    >
                      {row.status.content}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenDetails && <ReportDetails handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default ReportStats;

