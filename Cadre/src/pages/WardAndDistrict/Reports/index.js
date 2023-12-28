import classes from './styles.module.scss';
import React, { useState, useMemo, useEffect } from 'react';
import { faLocationDot, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '~components/Pagination';
import SearchBar from '~components/SearchBar';
import { axiosRequest } from '~/src/api/axios';
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { setReportIndex, setReportCoord, selectUser } from '~/src/store/reducers';
import { useNavigate } from 'react-router';

export default function Reports() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilterData] = useState(data);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await axiosRequest
        .get(`ward/getReportListsByWardId/${user.ward_id}`, { headers: headers })
        .then((res) => {
          const data = res.data.data;
          setData(data);
          setFilterData(data);
        })
        .catch((error) => {
          console.log('Get report lists error: ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    })();
  }, []);

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
      setFilterData(data);
      return;
    }

    setFilterData(
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
                      {row.latestReport && format(new Date(row.latestReport), 'dd/MM/yyyy')}
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
