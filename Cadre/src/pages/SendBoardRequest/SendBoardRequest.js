import React from 'react';
import classes from './SendBoardRequest.module.scss';
import FormBoard from './components/FormBoard';
import { sideImg } from '~assets/imgs/Imgs';

const SendBoardRequest = () => {
  return (
    <div className={classes.container}>
      <img className={classes.img} src={sideImg} />
      <div className={classes.form}>
        <div className={classes.title}>Yêu cầu chỉnh sửa bảng quảng cáo</div>
        <FormBoard />
      </div>
    </div>
  );
};

export default SendBoardRequest;
