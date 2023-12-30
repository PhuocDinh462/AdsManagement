import classes from './styles.module.scss';
import React, { useState, useMemo, useEffect } from 'react';
import { faPencil, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from '~components/Pagination';
import SearchBar from '~components/SearchBar';
import { axiosRequest } from '~/src/api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectSelectedWards, selectUser, setBoardIndex } from '~/src/store/reducers';
import { useNavigate } from 'react-router';

export default function AdSpots() {
  const [data, setData] = useState([]);
  const [filteredData, setFilterData] = useState(data);
  const [filterKeyword, setFilterKeyword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const selectedWards = useSelector(selectSelectedWards);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };
  const fetchWardsSpots = async () => {
    let spots = [];
    for (let i = 0; i < selectedWards.length; i++) {
      await axiosRequest
        .get(`ward/getAdSpotsListByWardId/${selectedWards[i].ward_id}`, { headers: headers })
        .then((res) => {
          if (res.data.data.length > 0) {
            for (let j = 0; j < res.data.data.length; j++) {
              spots.push(res.data.data[j])
            }
          }
        })
        .catch((error) => {
          console.log('Get report lists error: ', error);
        });
    }
    setData(spots);
    setFilterData(spots);
  }

  useEffect(() => {
    if (user.user_type === 'ward') {
      (async () => {
        await axiosRequest
          .get(`ward/getAdSpotsListByWardId/${user.ward_id}`, { headers: headers })
          .then((res) => {
            const data = res.data.data;
            setData(data);
            setFilterData(data);
          })
          .catch((error) => {
            console.log('Get report lists error: ', error);
          });
      })();
    }
    else if (user.user_type === 'district') {
      fetchWardsSpots();
    }
  }, [selectedWards]);

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
                    <button className={classes.btn_info} onClick={() => navigate(`/point-request/${row.point_id}`)}>
                      <div className={classes.icon_container}>
                        <FontAwesomeIcon icon={faPencil} />
                      </div>
                    </button>
                    <button
                      className={classes.btn_detail}
                      onClick={() => {
                        dispatch(setBoardIndex(0));
                        navigate(`/advertising-spots/${row.point_id}`);
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
