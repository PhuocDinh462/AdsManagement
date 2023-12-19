import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '~components/navBar';
import { faHouse, faLocationDot, faFlag, faFileContract } from '@fortawesome/free-solid-svg-icons';

const navbarCategories = [
  {
    name: 'Trang chủ',
    icon: faHouse,
    path: '/home',
  },
  {
    name: 'Điểm đặt',
    icon: faLocationDot,
    path: '/advertising-spots',
  },
  {
    name: 'Báo cáo',
    icon: faFlag,
    path: '/reports',
  },
  {
    name: 'Cấp phép',
    icon: faFileContract,
    path: '/licenses',
  },
];

const LayoutNavBar = () => {
  return (
    <div className="">
      <NavBar categories={navbarCategories} />
      <Outlet />
    </div>
  );
};

export default LayoutNavBar;
