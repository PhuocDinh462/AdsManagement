import classes from './styles.module.scss';
import React, { useState, useMemo } from 'react';
import { faMagnifyingGlass, faInfo, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '~components/Pagination';

export default function Reports() {
  const [data, setData] = useState([
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Bảng quảng cáo',
      numberOfReports: 2,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Địa điểm',
      numberOfReports: 1,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Bảng quảng cáo',
      numberOfReports: 2,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Địa điểm',
      numberOfReports: 1,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Bảng quảng cáo',
      numberOfReports: 2,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Địa điểm',
      numberOfReports: 1,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Bảng quảng cáo',
      numberOfReports: 2,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Địa điểm',
      numberOfReports: 1,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Bảng quảng cáo',
      numberOfReports: 2,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Địa điểm',
      numberOfReports: 1,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Bảng quảng cáo',
      numberOfReports: 2,
      date: '12/07/2023',
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      reportedObject: 'Địa điểm',
      numberOfReports: 1,
      date: '12/07/2023',
    },
  ]);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, data]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <div className={classes.container__header_search}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
            <input type="text" id="inputSearch" placeholder="Tìm kiếm..." className={classes.text_input} />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '40%' }}>Địa chỉ</th>
                <th style={{ width: '20%' }}>Đối tượng bị báo cáo</th>
                <th style={{ width: '10%' }}>Số đơn báo cáo</th>
                <th style={{ width: '15%' }}>Ngày báo cáo gần nhất</th>
                <th style={{ width: '10%' }}>Công cụ</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {currentTableData.map((row, rowIndex) => (
                <tr className={classes.table__body_wrap_row} key={rowIndex}>
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '40%' }}>{row.address}</td>
                  <td style={{ width: '20%' }}>{row.reportedObject}</td>
                  <td style={{ width: '10%' }}>{row.numberOfReports}</td>
                  <td style={{ width: '15%' }}>{row.date}</td>
                  <td style={{ width: '10%' }}>
                    <button className={classes.btn_info}>
                      <FontAwesomeIcon icon={faInfo} />
                    </button>
                    <button className={classes.btn_detail}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={classes['pagination-bar-container']}>
        <Pagination
          currentPage={currentPage}
          totalCount={data.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}
