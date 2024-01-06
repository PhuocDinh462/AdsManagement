import React from 'react';
import classes from './SendPointRequest.module.scss';
import FormPoint from './components/FormPoint';
import { sideImg } from '~assets/imgs/Imgs';

const SendPointRequest = () => {
  return (
    <div className={classes.container}>
      <img className={classes.img} src={sideImg} />
      <div className={classes.form}>
        <div className={classes.title}>Yêu cầu chỉnh sửa điểm đặt quảng cáo</div>
        <FormPoint />
      </div>
    </div>
  );
};

export default SendPointRequest;
