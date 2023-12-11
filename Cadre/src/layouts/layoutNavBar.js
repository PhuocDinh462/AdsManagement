import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '~components/navBar';

const LayoutNavBar = () => {
  return (
    <div className="">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default LayoutNavBar;
