import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from '../pages/home/Home';
import NotFound from '../pages/notFound';
import Layout from './../layouts/index';
import ManageDistrictWard from '../pages/ManageDistrictWard/ManageDistrictWard';
import Infor from '../pages/Infor/Infor';
import SendBoardRequest from '../pages/SendBoardRequest/SendBoardRequest';
import SendPointRequest from '../pages/SendPointRequest/SendPointRequest';

import AdSpots from '../pages/WardAndDistrict/AdSpots';
import Licenses from '../pages/WardAndDistrict/Licenses';
import Reports from '../pages/WardAndDistrict/Reports';

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

        <Route element={<Layout />}>
          <Route path="/advertising-spots" name="advertising-spots" element={<AdSpots />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/reports" name="reports" element={<Reports />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/licenses" name="licenses" element={<Licenses />} />
        </Route>

        <Route path="*" name="notFound" element={<Navigate to="/" />} />
      </Routes>
    </main>
  );
};

export default Navigation;
