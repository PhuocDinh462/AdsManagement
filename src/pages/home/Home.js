import React from 'react';
import { useSelector } from 'react-redux';
import classes from './Home.module.scss';
import SideBar from '../../components/sidebar/sideBar';

const Home = () => {
    return (
        <div className={classes.home}>
            <SideBar />
        </div>
    );
};

export default Home;

