import React from 'react';
import { useSelector } from 'react-redux';
import classes from './Home.module.scss';

const Home = () => {
    return (
        <div className={classes.home}>
            <div style={{ height: '60px', width: '100%', background: 'blue' }}>NavBar</div>
        </div>
    );
};

export default Home;

