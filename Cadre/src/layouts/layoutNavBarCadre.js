import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '~components/navBar';
import { faHouse, faLocationDot, faFlag, faFileContract } from '@fortawesome/free-solid-svg-icons';

const navbarCategories = [];

const LayoutNavBarCadre = () => {
  return (
    <div className="">
      <NavBar categories={navbarCategories} />
      <Outlet />
    </div>
  );
};

export default LayoutNavBarCadre;

