import { Navigate, Route, Routes } from 'react-router-dom';

// import Home from '../pages/home/Home';
import LayoutNavBar from '../layouts/layoutNavBar';
import ActionLicense from '../pages/ActionLicense';
import ForgotPassword from '../pages/ForgotPassword';
import Infor from '../pages/Infor/Infor';
import LoginPage from '../pages/Login';
import ManageAd from '../pages/ManageAd/ManageAd';
import ManageAdLocation from '../pages/ManageAdLocation/ManageAdLocation';
import ManageDistrictWard from '../pages/ManageDistrictWard/ManageDistrictWard';
import ManageEditRequest from '../pages/ManageEditRequest/ManageEditRequest';
import ManageForm from '../pages/ManageForm/ManageForm';
import NotFoundPage from '../pages/NotFoundPage';
import ReportStats from '../pages/ReportStats';
import SendBoardRequest from '../pages/SendBoardRequest/SendBoardRequest';
import SendPointRequest from '../pages/SendPointRequest/SendPointRequest';
import AdSpots from '../pages/WardAndDistrict/AdSpots';
import Boards from '../pages/WardAndDistrict/AdSpots/Boards';
import WardAndDistrictHome from '../pages/WardAndDistrict/Home';
import Licenses from '../pages/WardAndDistrict/Licenses';
import Reports from '../pages/WardAndDistrict/Reports';
import ReportsDetail from '../pages/WardAndDistrict/Reports/ReportsDetail';
import CreateAccount from '../pages/createAccount/CreateAccount';
import Layout from './../layouts/index';

const Navigation = () => {
  const authenticated = true;
  return (
    <main>
      <Routes>
        {/* Chỗ này để trang home khi mới vào hay trang gốc (T đang để ManageForm để demo) */}
        <Route path="/" name="login" element={<LoginPage />} />
        <Route path="/forgot" name="forgot" element={<ForgotPassword />} />
        <Route path="/not_found" name="not_found" element={<NotFoundPage />} />

        {/* Layout dành cho trang có sidebar và có thanh navbar */}
        <Route element={<Layout />}>
          <Route path="/district-ward" name="district ward" element={<ManageDistrictWard />} />
          <Route path="/form" name="form" element={<ManageForm />} />

          <Route path="/ads-location" name="ads-location" element={<ManageAdLocation />} />
          <Route path="/ads" name="ads" element={<ManageAd />} />
          <Route path="/action-edit" name="ads" element={<ManageEditRequest />} />

          <Route path="/action-license" name="manage license" element={<ActionLicense />} />
          <Route path="/report-stats" name="report stats" element={<ReportStats />} />

          <Route path="/create-account" name="create account" element={<CreateAccount />} />
        </Route>

        {/* Layout dành cho trang không có sidebar, chỉ có thanh navbar */}
        <Route element={<LayoutNavBar />}>
          <Route path="/home" name="home" element={<WardAndDistrictHome />} />
          <Route path="/advertising-spots" name="advertising-spots" element={<AdSpots />} />
          <Route path="/advertising-spots/:id" name="advertising-spots/boards" element={<Boards />} />
          <Route path="/manage-license" name="licenses" element={<Licenses />} />
          <Route path="/reports" name="reports" element={<Reports />} />
          <Route path="/infor" name="infor" element={<Infor />} />
          <Route path="/board-request/:board_id" name="board-request" element={<SendBoardRequest />} />
          <Route path="/point-request/:point_id" name="point-request" element={<SendPointRequest />} />
          <Route path="/reports/detail/:id" name="reports-detail" element={<ReportsDetail />} />
        </Route>

        <Route path="*" name="notFound" element={<Navigate to="/" />} />
      </Routes>
    </main>
  );
};

export default Navigation;
