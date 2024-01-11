import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '~components/navBar';
import { faHouse, faLocationDot, faFlag, faFileContract } from '@fortawesome/free-solid-svg-icons';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { selectUser } from '~/src/store/reducers';

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
    path: '/manage-license',
  },
];

const LayoutNavBar = () => {
  const user = useSelector(selectUser);

  const info = (msg) =>
    toast.info(msg, {
      position: 'top-left',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      draggable: false,
    });

  useSocketSubscribe(`createReport_wardId=${user?.ward_id}`, async (res) => {
    info('Một báo cáo vừa được gửi đến cho bạn');
  });

  useSocketSubscribe(`updateAdsPoint_wardId=${user?.ward_id}`, async (res) => {
    info('Yêu cầu chỉnh sửa của bạn đã được phê duyệt');
  });

  useSocketSubscribe(`updateBoard_wardId=${user?.ward_id}`, async (res) => {
    info('Yêu cầu chỉnh sửa của bạn đã được phê duyệt');
  });

  return (
    <div className="">
      <NavBar categories={navbarCategories} />
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default LayoutNavBar;
