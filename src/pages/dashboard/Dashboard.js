import React from 'react';
import classes from './Dashboard.module.scss';
import SideBar from '../../components/sideBar/SideBar';
import HeaderTable from '../../components/headerTable/HeaderTable';
import ButtonCT from '../../components/button/ButtonCT';

const data = [
    {
        id: 1,
        title: 'Danh sách Quận, Phường',
    },
    {
        id: 2,
        title: 'Danh sách các loại hình',
    },
    {
        id: 3,
        title: 'Các điểm đặt quảng cáo',
    },
    {
        id: 4,
        title: 'Các bảng quảng cáo',
    },
    {
        id: 5,
        title: 'Xét duyệt các yêu cầu',
    },
    {
        id: 6,
        title: 'Danh sách & xét duyệt',
    },
    {
        id: 7,
        title: 'Thống kê báo cáo & xử lý',
    },
];

const Dashboard = () => {
    return (
        <div className={classes.dashboard}>
            <div style={{ height: '60px', width: '100%', background: 'blue' }}>NavBar</div>
            <div className={classes.dashboard__container}>
                <SideBar data={data} />
                <div className={classes['dashboard__container--table']}>
                    <HeaderTable />
                    <ButtonCT />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

