import classes from './styles.module.scss';
import React, { useState, useMemo } from 'react';
import { faPencil, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '~components/Pagination';
import SearchBar from '~components/SearchBar';

export default function AdSpots() {
  const [data, setData] = useState([
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: true,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: false,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: true,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: false,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: true,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: false,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: true,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: false,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: true,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: false,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: true,
    },
    {
      address: '15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM',
      spotType: 'Công viên',
      isPlanned: false,
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
    <div className={classes.main_container}>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <div className={classes.searchBar_container}>
            <SearchBar placeholder="Tìm kiếm..." onChange={(keyword) => console.log(keyword)} />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '40%' }}>Địa chỉ</th>
                <th style={{ width: '25%' }}>Loại địa điểm</th>
                <th style={{ width: '20%' }}>Tình trạng</th>
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
                  <td style={{ width: '25%' }}>{row.spotType}</td>
                  <td
                    style={{ width: '20%' }}
                    className={[classes.isPlanned, row.isPlanned && classes['isPlanned--true']].join(' ')}
                  >
                    {row.isPlanned ? 'Đã quy hoạch' : 'Chưa quy hoạch'}
                  </td>
                  <td style={{ width: '10%' }}>
                    <button className={classes.btn_info}>
                      <div className={classes.icon_container}>
                        <FontAwesomeIcon icon={faPencil} />
                      </div>
                    </button>
                    <button className={classes.btn_detail}>
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
          totalCount={data.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
