import React from 'react';
import classes from './DetailAddress.module.scss';

const DetailAddress = ({ data, onClose, filteredData }) => {
  console.log(data);

  function formatDateTime(dateTimeString) {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    };
    const formattedDate = new Date(dateTimeString).toLocaleDateString('en-US', options);
    return formattedDate;
  }
  return (
    <div className={classes.container}>
      <p className={classes.tilte_modal}>
        CHI TIẾT <span className={classes.tilte_modal}>{data.area}</span>{' '}
      </p>
      <div className={classes.wrap_content}>
        {filteredData === 'Quận' && (
          <div style={{ padding: '20px' }}>
            <p className={classes.item_info}>
              Tên
              quận&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.district_name}</span>
            </p>
            <p className={classes.item_info}>
              Tên người quản lý&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span>{data.district_manager_username}</span>
            </p>
            <p className={classes.item_info}>
              Ngày
              sinh&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.district_manager_dob && formatDateTime(data.district_manager_dob)}</span>
            </p>
            <p className={classes.item_info}>
              Email người quản lý&nbsp;&nbsp;&nbsp;&nbsp;: <span>{data.district_manager_email}</span>
            </p>
            <p className={classes.item_info}>
              Số điện thoại&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.district_manager_phone}</span>
            </p>
          </div>
        )}

        {filteredData === 'Phường' && (
          <div style={{ padding: '20px' }}>
            <p className={classes.item_info}>
              Tên
              phường&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.ward_name}</span>
            </p>
            <p className={classes.item_info}>
              Thuộc quận
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.district_name}</span>
            </p>
            <p className={classes.item_info}>
              Tên người quản lý&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.ward_manager_username}</span>
            </p>
            <p className={classes.item_info}>
              Ngày
              sinh&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.ward_manager_dob && formatDateTime(data.ward_manager_dob)}</span>
            </p>
            <p className={classes.item_info}>
              Email người quản lý&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.ward_manager_email}</span>
            </p>
            <p className={classes.item_info}>
              Số điện
              thoại&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
              <span>{data.ward_manager_phone}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailAddress;

