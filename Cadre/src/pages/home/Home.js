import React, { useEffect, useState } from 'react';
import classes from './Home.module.scss';
import SideBars from '~components/sidebar/SideBars';
import ManageDistrictWard from '../ManageDistrictWard/ManageDistrictWard';
import ManageForm from '../ManageForm/ManageForm';

const data = [
  {
    id: 1,
    title: 'Danh sách Quận, Phường',
  },
  {
    id: 2,
    title: 'Danh sách các loại hình',
  },
  {
    id: 3,
    title: 'Các điểm đặt quảng cáo',
  },
  {
    id: 4,
    title: 'Các bảng quảng cáo',
  },
  {
    id: 5,
    title: 'Xét duyệt các yêu cầu',
  },
  {
    id: 6,
    title: 'Danh sách & xét duyệt',
  },
  {
    id: 7,
    title: 'Thống kê báo cáo & xử lý',
  },
];
const Home = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const handlePageChange = (pageId) => {
    setSelectedPage(pageId);
  };

  return (
    <div className={classes.dashboard}>
      <div style={{ height: '60px', width: '100%', background: 'blue' }}>NavBar</div>
      <div className={classes.dashboard__container}>
        <SideBars data={data} onPageChange={handlePageChange} />
        <div className={classes['dashboard__container--table']}>
          {selectedPage === 1 && <ManageDistrictWard />}
          {selectedPage === 2 && <ManageForm />}
          {/* ... render other components based on selectedPage */}
        </div>
      </div>
    </div>
  );
};

export default Home;
