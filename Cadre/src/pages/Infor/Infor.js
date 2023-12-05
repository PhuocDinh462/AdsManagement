import React from 'react';
import { useSelector } from 'react-redux';
import classes from './Infor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from './components/Button';
import Form from './components/Form';

const Infor = () => {
  return (
    <>
      <div>Header</div>

      <div className={classes.wrapper}>
        <div className={classes['wrapper-user']}>
          <div className={classes['header-user']}>
            <div className={classes['title-profile']}>Hồ sơ của tôi</div>
          </div>

          <div className={classes['content-user']}>
            <div className={classes['wrapper-avatar-container']}>
              <div className={classes['avatar-container']}>
                <FontAwesomeIcon icon={faUser} className={classes.iconUser} />
              </div>
            </div>
            <div className={classes['username-container']}>
              <div className={classes['username']}>Nguyen Van A</div>
            </div>
          </div>

          <div className={classes['footer-user']}>
            <div className={classes['change-password']}>
              <Button
                className={classes['button-change']}
                icon={<FontAwesomeIcon icon={faLock} className={classes.iconLock} />}
                onClick={null}
                label="Đổi mật khẩu"
              />
            </div>
          </div>
        </div>

        <div className={classes['wrapper-manage-account']}>
          <div className={classes['wrapper-account']}>
            <div className={classes['header-manage-account']}>
              <p>Quản lý thông tin tài khoản</p>
            </div>

            <div className={classes['container-manage-account']}>
              <Form />
            </div>

            <div className={classes['footer-manage-account']}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Infor;
