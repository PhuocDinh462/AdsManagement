import React from 'react';
import classes from './DetailAddress.module.scss';

const DetailAddress = ({ data, onClose }) => {
  console.log(data);
  return (
    <div className={classes.container}>
      <p className={classes.tilte_modal}>
        CHI TIẾT <span className={classes.tilte_modal}>{data.area}</span>{' '}
      </p>
      <div className={classes.wrap_content}>
        {data.level === 'Quận' && (
          <div style={{ padding: '20px' }}>
            <p className={classes.item_info}>
              Tên
              quận&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.area}</span>
            </p>
            <p className={classes.item_info}>
              Tên người quản lý&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>{data.managerName}</span>
            </p>
            <p className={classes.item_info}>
              Email người quản lý&nbsp;&nbsp;&nbsp;&nbsp;: <span>{data.email}</span>
            </p>
            <p className={classes.item_info}>
              Số điện thoại&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.phoneNumber}</span>
            </p>
          </div>
        )}

        {data.level === 'Phường' && (
          <div style={{ padding: '20px' }}>
            <p className={classes.item_info}>
              Tên
              phường&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.area}</span>
            </p>
            <p className={classes.item_info}>
              Thuộc quận
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.district_name}</span>
            </p>
            <p className={classes.item_info}>
              Tên người quản lý&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.managerName}</span>
            </p>
            <p className={classes.item_info}>
              Email người quản lý&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>{data.email}</span>
            </p>
            <p className={classes.item_info}>
              Số điện
              thoại&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.phoneNumber}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAddress;

