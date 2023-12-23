import React, { useState } from 'react';
import ItemSide from './ItemSide/ItemSide';
import classes from './SideBars.module.scss';
import { useNavigate } from 'react-router';
import { matchRoutes, useLocation } from 'react-router-dom';

const data = [
  {
    id: 1,
    title: 'Danh sách Quận, Phường',
    path: '/district-ward',
  },
  {
    id: 2,
    title: 'Danh sách các loại hình',
    path: '/form',
  },
  {
    id: 3,
    title: 'Các điểm đặt quảng cáo',
    path: '/ads-location',
  },
  {
    id: 4,
    title: 'Các bảng quảng cáo',
    path: '/ads',
  },
  {
    id: 5,
    title: 'Xét duyệt yêu cầu chỉnh sửa',
    path: '/action-edit',
  },
  {
    id: 6,
    title: 'Xét duyệt & Cấp phép',
    path: '/action-license',
  },
  {
    id: 7,
    title: 'Thống kê báo cáo & xử lý',
    path: '/report-stats',
  },
];
const SideBars = () => {
  return (
    <div className={classes.sidebar}>
      <p className={classes.sidebar__title}>Quản lý</p>
      {data.map((item, index) => (
        <ItemSide key={index} item={item} />
      ))}
    </div>
  );
};

export default SideBars;

