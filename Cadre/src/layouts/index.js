import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import NavBar from '~components/navBar';
import SideBars from '../components/sidebar/SideBars';
import { faKey } from '@fortawesome/free-solid-svg-icons';

const navbarCategories = [
  // {
  //   name: 'Đăng ký',
  //   icon: faKey,
  //   path: '/create-account',
  // },
];

const Layout = () => {
  return (
    <div className="">
      <NavBar categories={navbarCategories} />
      <div style={{ display: 'flex' }}>
        <SideBars />
        <Outlet />
      </div>
    </div>
  );
};

Layout.propTypes = {};

export default Layout;

