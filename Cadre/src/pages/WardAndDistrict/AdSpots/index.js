import classes from './styles.module.scss';
import React, { useState, useMemo, useEffect } from 'react';
import { faPencil, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '~components/Pagination';
import SearchBar from '~components/SearchBar';
import { Link } from 'react-router-dom';
import { axiosRequest } from '~/src/api/axios';

export default function AdSpots() {
  const [data, setData] = useState([]);
  const [filteredData, setFilterData] = useState(data);
  const [filterKeyword, setFilterKeyword] = useState('');

  useEffect(() => {
    (async () => {
      await axiosRequest
        .get(`ward/getAdSpotsListByWardId/1`)
        .then((res) => {
          const data = res.data.data;
          setData(data);
          setFilterData(data);
        })
        .catch((error) => {
          console.log('Get report lists error: ', error);
        });
    })();
  }, []);

  useEffect(() => {
    if (!filterKeyword) {
      setFilterData(data);
      return;
    }

    setFilterData(
      data.filter(
        (item) =>
          item.address.toLowerCase().includes(filterKeyword.toLowerCase()) ||
          item.location_type.toLowerCase().includes(filterKeyword.toLowerCase()) ||
          (item.is_planning === 1 ? 'Đã quy hoạch' : 'Chưa quy hoạch')
            .toLowerCase()
            .includes(filterKeyword.toLowerCase())
      )
    );
  }, [filterKeyword]);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, data, filteredData]);

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
                <tr className={classes.table__body_wrap_row} key={row.point_id}>
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '40%' }}>{row.address}</td>
                  <td style={{ width: '25%' }}>{row.location_type}</td>
                  <td
                    style={{ width: '20%' }}
                    className={[classes.isPlanned, row.is_planning && classes['isPlanned--true']].join(' ')}
                  >
                    {row.is_planning ? 'Đã quy hoạch' : 'Chưa quy hoạch'}
                  </td>
                  <td style={{ width: '10%' }}>
                    <Link to={`/point-request/${row.point_id}`}>
                      <button className={classes.btn_info}>
                        <div className={classes.icon_container}>
                          <FontAwesomeIcon icon={faPencil} />
                        </div>
                      </button>
                    </Link>
                    <Link to={`/advertising-spots/${row.point_id}`}>
                      <button className={classes.btn_detail}>
                        <div className={classes.icon_container}>
                          <FontAwesomeIcon icon={faEye} />
                        </div>
                      </button>
                    </Link>
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
