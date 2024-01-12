import { useEffect, useState } from 'react';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import LicenseDetails from './LicenseDetails';
import classes from './style.module.scss';

const ActionLicense = () => {
  const axiosPrivate = useAxiosPrivate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const response = await axiosPrivate.get('/ward/license');
      console.log(response.data.data);
      setData(response.data.data);
      setOriginalData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data.filter((row) => row.company_name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSocketEvent = (eventData) => {
    fetchData();
  };

  // Subscribe to the socket events when the component mounts
  useSocketSubscribe('licensingAds', handleSocketEvent);
  useSocketSubscribe('createLicenseRequest', handleSocketEvent);
  useSocketSubscribe('updateStatusLicenseRequest', handleSocketEvent);

  const handleOpenModalDetails = (data) => {
    setIsOpenDetails(true);
  };

  const handleCloseModal = async () => {
    await fetchData();
    setIsOpenDetails(false);
  };

  const handleFilterChange = (type) => {
    const filteredData = type === 'all' ? originalData : originalData.filter((item) => item.status === type);
    setData(filteredData);
    setSelectedFilter(type);
  };

  const getFilterStyle = (filter) => ({
    color: selectedFilter === filter ? '#0A6971' : '#2f2f2f',
    borderBottom: selectedFilter === filter ? '2px solid #0A6971' : 'none',
    cursor: 'pointer',
  });

  const formatDate = (dateString) => {
    const options = { month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', options);
  };

  const formatDuration = (startDate, endDate) => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    return `Từ ${formattedStartDate} đến ${formattedEndDate}`;
  };

  return (
    <div className={classes.container__wrap}>
      <div className={classes.container__wrap_header}>
        <p>Danh sách yêu cầu cấp phép quảng cáo</p>
      </div>

      <div className={classes.container}>
        <div className={classes.container__header}>
          {/* Tab Filter */}
          <div className={classes.container__header_filter}>
            <div onClick={() => handleFilterChange('all')} style={getFilterStyle('all')}>
              Tất cả
            </div>
            <div onClick={() => handleFilterChange('pending')} style={getFilterStyle('pending')}>
              Chưa cấp phép
            </div>
            <div onClick={() => handleFilterChange('approved')} style={getFilterStyle('approved')}>
              Đã cấp phép
            </div>
            <div onClick={() => handleFilterChange('canceled')} style={getFilterStyle('canceled')}>
              Đã hủy
            </div>
          </div>

          {/* Tab Search */}
          <div className={classes.container__header_search}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
            <input
              type="text"
              id="inputSearch"
              placeholder="Tìm kiếm theo công ty..."
              className={classes.text_input}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Table Header */}
        <div className={classes.table_header}>
          <table className={classes.table__header_wrap}>
            <thead className={classes.table__header_wrap_thead}>
              <tr>
                <th style={{ width: '5%' }}>STT</th>
                <th style={{ width: '15%' }}>Công ty</th>
                <th style={{ width: '10%' }}>Ảnh minh họa</th>
                <th style={{ width: '35%' }}>Địa chỉ đặt</th>
                <th style={{ width: '15%' }}>Thời hạn đăng ký</th>
                <th style={{ width: '15%' }}>Trạng thái</th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Table Body */}
        <div className={classes.table__body}>
          <table className={classes.table__body_wrap}>
            <tbody>
              {data &&
                filteredData.map((row, rowIndex) => (
                  <tr
                    className={classes.table__body_wrap_row}
                    key={rowIndex}
                    onClick={() => {
                      handleOpenModalDetails(row);
                      setIsOpenDetails(true);
                      setSelectedRowData(row);
                    }}
                  >
                    <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                    <td style={{ width: '15%' }}>{row.company_name}</td>
                    <td style={{ width: '10%' }}>
                      <img src={row.advertisement_image_url} alt="none" />
                    </td>
                    <td style={{ width: '35%' }}>
                      <span style={{ padding: '0 5px' }}> {row.address} </span>
                    </td>
                    <td style={{ width: '15%' }}>{formatDuration(row.start_date, row.end_date)}</td>
                    <td style={{ width: '15%' }}>
                      <div
                        className={` ${classes.status} ${
                          row.status === 'approved'
                            ? classes.status_accept
                            : row.status === 'pending'
                            ? classes.status_pending
                            : classes.status_cancel
                        }`}
                      >
                        {row.status === 'approved' ? (
                          <span>Đã cấp phép</span>
                        ) : row.status === 'pending' ? (
                          <span>Chưa xử lý</span>
                        ) : (
                          <span>Đã hủy</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpenDetails && <LicenseDetails data={selectedRowData} handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default ActionLicense;
