import React from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import NavBar from '~components/navBar';

const Layout = () => {
  return (
    <div className="">
      <NavBar />
      <Outlet />
    </div>
  );
};

Layout.propTypes = {};

export default Layout;
