import React from 'react';
import { useSelector } from 'react-redux';
import classes from './Home.module.scss';

const Home = () => {
    return (
        <div className={classes.home}>
            <input className={classes.home_input} placeholder="nhap" />
            <p className={classes.home_text}>huynh vinh</p>
        </div>
    );
};

export default Home;

