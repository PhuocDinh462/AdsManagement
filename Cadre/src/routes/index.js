import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// import Home from '../pages/home/Home';
import NotFound from '../pages/notFound';
import Layout from './../layouts/index';
import ManageDistrictWard from '../pages/ManageDistrictWard/ManageDistrictWard';
import Infor from '../pages/Infor/Infor';
import SendBoardRequest from '../pages/SendBoardRequest/SendBoardRequest';
import SendPointRequest from '../pages/SendPointRequest/SendPointRequest';

import WardAndDistrictHomeHome from '../pages/WardAndDistrict/Home';
import AdSpots from '../pages/WardAndDistrict/AdSpots';
import Licenses from '../pages/WardAndDistrict/Licenses';
import Reports from '../pages/WardAndDistrict/Reports';
import ReportsDetail from '../pages/WardAndDistrict/Reports/ReportsDetail';
import ManageForm from '../pages/ManageForm/ManageForm';
import LoginPage from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import LayoutNavBar from '../layouts/layoutNavBar';
import CreateAccount from '../pages/createAccount/CreateAccount';
import ManageAdLocation from '../pages/ManageAdLocation/ManageAdLocation';
import ManageAd from '../pages/ManageAd/ManageAd';

const Navigation = () => {
  const authenticated = true;
  return (
    <main>
      <Routes>
        {/* Chỗ này để trang home khi mới vào hay trang gốc (T đang để ManageForm để demo) */}
        <Route path="/" name="form" element={<ManageForm />} />
        <Route path="/login" name="login" element={<LoginPage />} />
        <Route path="/forgot" name="forgot" element={<ForgotPassword />} />

        {/* Layout dành cho trang có sidebar và có thanh navbar */}
        <Route element={<Layout />}>
          <Route path="/district-ward" name="district ward" element={<ManageDistrictWard />} />
          <Route path="/form" name="form" element={<ManageForm />} />
          <Route path="/ads-location" name="ads-location" element={<ManageAdLocation />} />
          <Route path="/ads" name="ads" element={<ManageAd />} />
        </Route>

        {/* Layout dành cho trang không có sidebar, chỉ có thanh navbar */}
        <Route element={<LayoutNavBar />}>
          <Route path="/home" name="home" element={<WardAndDistrictHomeHome />} />
          <Route path="/create-account" name="create account" element={<CreateAccount />} />
          <Route path="/advertising-spots" name="advertising-spots" element={<AdSpots />} />
          <Route path="/licenses" name="licenses" element={<Licenses />} />
          <Route path="/reports" name="reports" element={<Reports />} />
          <Route path="/infor" name="infor" element={<Infor />} />
          <Route path="/board-request" name="board-request" element={<SendBoardRequest />} />
          <Route path="/point-request" name="point-request" element={<SendPointRequest />} />
          <Route path="/reports/detail/:id" name="reports-detail" element={<ReportsDetail />} />
        </Route>

        <Route path="*" name="notFound" element={<Navigate to="/" />} />
      </Routes>
    </main>
  );
};

export default Navigation;

{
  /* <Route element={<Layout />}>
        </Route>
        <Route element={<Layout />}>
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
          <Route path="/reports/detail/:id" name="reports-detail" element={<ReportsDetail />} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/licenses" name="licenses" element={<Licenses />} />
        </Route> */
}
