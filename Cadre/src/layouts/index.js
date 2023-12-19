import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import NavBar from '~components/navBar';
import SideBars from '../components/sidebar/SideBars';
import Backdrop from '@mui/material/Backdrop';

const Layout = () => {
  return (
    <div className="">
      <NavBar hideCategories />
      <div style={{ display: 'flex' }}>
        <SideBars />
        <Outlet />
      </div>
    </div>
  );
};

Layout.propTypes = {};

export default Layout;

