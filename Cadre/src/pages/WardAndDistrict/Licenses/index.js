import React, { useMemo, useState } from 'react';

import classes from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import LicenseDetails from './LicenseDetails';
import SearchBar from '~/src/components/SearchBar';
import Pagination from '~/src/components/Pagination';
import ButtonCT from '~/src/components/button/ButtonCT';
import { ic_add } from '~/src/assets';
import LicenseModalAdd from './LicenseModalAdd';
const initialData = [
  {
    id: 1,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 1, content: 'Đã Cấp Phép' },
  },
  {
    id: 2,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 2, content: 'Chưa Cấp Phép' },
  },
  {
    id: 3,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 4,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 5,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 6,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 7,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 8,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 9,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 10,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 11,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },
  {
    id: 12,
    company: 'HCMUS',
    img: 'https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg',
    address: '135 THD, Quận 1, P. Cầu Ông Lãnh, TP HCM',
    numOfDate: '300',
    status: { type: 3, content: 'Đã Hủy' },
  },

  // Thêm dữ liệu khác
];
const Licenses = () => {
  const [data, setData] = useState(initialData);
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [pageSize, currentPage, data]);

  const handleOpenModalDetails = (data) => {
    setIsOpenDetails(true);
  };

  const handleCloseModalDetails = () => {
    setIsOpenDetails(false);
  };

  const handleOpenModalAdd = (data) => {
    setIsOpenAdd(true);
  };

  const handleCloseModalAdd = () => {
    setIsOpenAdd(false);
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
              {currentTableData.map((row, rowIndex) => (
                <tr className={classes.table__body_wrap_row} key={row.id} onClick={() => handleOpenModalDetails(row)}>
                  <td style={{ width: '5%' }}>{rowIndex + 1}</td>
                  <td style={{ width: '15%' }}>{row.company}</td>
                  <td style={{ width: '15%' }}>
                    <img src={row.img} alt="none" />
                  </td>
                  <td style={{ width: '30%' }}>{row.address}</td>
                  <td style={{ width: '15%' }}>{row.numOfDate}</td>
                  <td style={{ width: '15%' }}>
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
      <div className={classes.paginationBar_container}>
        <Pagination
          currentPage={currentPage}
          totalCount={data.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      {isOpenAdd && <LicenseModalAdd handleCloseModal={handleCloseModalAdd} />}
      {isOpenDetails && <LicenseDetails disabledButton={true} handleCloseModal={handleCloseModalDetails} />}
    </div>
  );
};

export default Licenses;
