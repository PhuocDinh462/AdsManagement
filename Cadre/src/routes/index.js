import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from '../pages/home/Home';
import NotFound from '../pages/notFound';
import Layout from './../layouts/index';
import ManageDistrictWard from '../pages/ManageDistrictWard/ManageDistrictWard';
import Infor from '../pages/Infor/Infor';
import SendBoardRequest from '../pages/SendBoardRequest/SendBoardRequest';
import SendPointRequest from '../pages/SendPointRequest/SendPointRequest';

const Navigation = () => {
  const authenticated = true;
  return (
    <main>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" name="home" element={<Home />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/infor" name="infor" element={<Infor />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/send-board-request" name="board-request" element={<SendBoardRequest />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/send-point-request" name="point-request" element={<SendPointRequest />} />
        </Route>
        <Route path="*" name="notFound" element={<Navigate to="/" />} />
      </Routes>
    </main>
  );
};

export default Navigation;
