import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Infor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from './components/Button';
import Form from './components/Form';
import request from '../../utils/request';

const Infor = () => {
  const [user, setUser] = useState({})

  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };
  const fetchUserInfor = async () => {

    try {
      const response = await request.get(`account/get_infor`, {
        headers: headers,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching surfaces:', error);
    }
  };

  useEffect(() => {
    fetchUserInfor();
  }, []);

  return (
    <>
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
              <div className={classes['username']}>{user.username}</div>
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
              <Form user={user} setUser={setUser} />
            </div>

            <div className={classes['footer-manage-account']}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Infor;
