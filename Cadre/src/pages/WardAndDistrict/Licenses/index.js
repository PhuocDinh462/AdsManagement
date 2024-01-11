import { useEffect, useMemo, useState } from 'react';

import { Backdrop, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ic_add } from '~/src/assets';
import Pagination from '~/src/components/Pagination';
import SearchBar from '~/src/components/SearchBar';
import ButtonCT from '~/src/components/button/ButtonCT';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import { removeFormLicenseReq, selectSelectedWards, selectUser } from '~/src/store/reducers';
import { calculateDaysBetweenDates, notiSuccess } from '~/src/utils/support';
import LicenseDetails from './LicenseDetails';
import LicenseModalAdd from './LicenseModalAdd';
import classes from './style.module.scss';

const statusLicense = {
  pending: { label: 'Chờ xử lý', value: 1 },
  approved: {
    label: 'Đã cấp phép',
    value: 2,
  },
  canceled: {
    label: 'Đã hủy',
    value: 3,
  },
};

const Licenses = () => {
  const axiosPrivate = useAxiosPrivate();
  const user = useSelector(selectUser);

  const [initData, setInitData] = useState([]);
  const [data, setData] = useState(initData);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const selectedWards = useSelector(selectSelectedWards);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState({});
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;

    return data.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, data]);

  const dispatch = useDispatch();
  const handleOpenModalDetails = (data) => {
    setIsOpenDetails(true);
    setSelected(data);
  };

  const handleCloseModalDetails = () => {
    setIsOpenDetails(false);
  };

  const handleOpenModalAdd = (data) => {
    setIsOpenAdd(true);
    dispatch(removeFormLicenseReq());
  };

  const handleCloseModalAdd = (isSubmit = false) => {
    setIsOpenAdd(false);
    dispatch(removeFormLicenseReq());

    if (isSubmit === true) notiSuccess('Yêu cầu cấp phép đã được gửi, vui lòng chờ xét duyệt...');
  };

  const handleFilterChange = (type) => {
    const filteredData = type === 0 ? initData : initData.filter((item) => statusLicense[item.status].value === type);
    setData(filteredData);
    setSelectedFilter(type);
  };

  const getFilterStyle = (filter) => ({
    color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
    borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
    cursor: 'pointer',
  });

  const fetchDataLicenseReq = async () => {
    setIsLoading(true);
    try {
      const res = await axiosPrivate.get('/ward/license-by-ward');

      setData(res.data.data);
      setInitData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDataLicenseReqByDistrict = async () => {
    setIsLoading(true);
    let licenses = [];
    try {
      for (let i = 0; i < selectedWards.length; i++) {
        const res = await axiosPrivate.get(`/ward/license-by-ward-id/${selectedWards[i].ward_id}`);
        if (res.data.data.length > 0) {
          for (let j = 0; j < res.data.data.length; j++) {
            licenses.push(res.data.data[j]);
          }
        }
      }
      setData(licenses);
      setInitData(licenses);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReLoadData = () => {
    if (user.user_type === 'ward') {
      fetchDataLicenseReq();
    } else if (user.user_type === 'district') {
      fetchDataLicenseReqByDistrict();
    }
  };

  useEffect(() => {
    handleReLoadData();
  }, [selectedWards]);

  useSocketSubscribe('updateStatusLicenseRequest', handleReLoadData);
  return (
    <div className={classes.container__wrap}>
      <div className={classes.container}>
        <div className={classes.container__header}>
          {/* Tab Search */}
          <div className={classes.container__header_search}>
            <SearchBar placeholder="Tìm kiếm..." onChange={(keyword) => console.log(keyword)} />
            <ButtonCT
              onClick={handleOpenModalAdd}
              iconLeft={ic_add}
              borderRadius
              primary
              medium
              content="Tạo Yêu Cầu"
            />
          </div>

          {/* Tab Filter */}
          <div className={classes.container__header_filter}>
            <div onClick={() => handleFilterChange(0)} style={getFilterStyle(0)}>
              Tất cả
            </div>
            <div onClick={() => handleFilterChange(1)} style={getFilterStyle(1)}>
              Chưa cấp phép
            </div>
            <div onClick={() => handleFilterChange(2)} style={getFilterStyle(2)}>
              Đã cấp phép
            </div>{' '}
            <div onClick={() => handleFilterChange(3)} style={getFilterStyle(3)}>
              Đã hủy
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '15%' }}>Công ty</th>
                <th style={{ width: '15%' }}>Ảnh minh họa</th>
                <th style={{ width: '30%' }}>Địa chỉ đặt</th>
                <th style={{ width: '15%' }}>Thời hạn đăng ký (Ngày)</th>
                <th style={{ width: '15%' }}>Trạng thái</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {currentTableData.map((row, rowIndex) => (
                <tr
                  className={classes.table__body_wrap_row}
                  key={row.licensing_id}
                  onClick={() => handleOpenModalDetails(row)}
                >
                  <td style={{ width: '5%' }}>{rowIndex + 1 + (currentPage - 1) * pageSize}</td>
                  <td style={{ width: '15%' }}>{row.company_name}</td>
                  <td style={{ width: '15%' }}>
                    <img src={row.advertisement_image_url} alt="none" />
                  </td>
                  <td style={{ width: '30%' }}>{row.address}</td>
                  <td style={{ width: '15%' }}>{calculateDaysBetweenDates(row.start_date, row.end_date)}</td>
                  <td style={{ width: '15%' }}>
                    <div
                      className={` ${classes.status} ${
                        statusLicense[row.status].value === 1
                          ? classes.status_pending
                          : statusLicense[row.status].value === 2
                          ? classes.status_accept
                          : classes.status_cancel
                      }`}
                    >
                      {statusLicense[row.status].label}
                    </div>
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
      {isOpenAdd && <LicenseModalAdd handleCloseModal={handleCloseModalAdd} handleReLoadData={handleReLoadData} />}
      {isOpenDetails && (
        <LicenseDetails data={selected} handleCloseModal={handleCloseModalDetails} fetchData={handleReLoadData} />
      )}
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Licenses;
