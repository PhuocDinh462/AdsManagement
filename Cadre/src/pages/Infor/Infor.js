import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './Infor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from './components/Button';
import Form from './components/Form';
import request from '../../utils/request';
import Swal from 'sweetalert2';

const Infor = () => {
  const [user, setUser] = useState({})
  const inputPassword = useRef();
  const inputNewPassword = useRef();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [openChangePassword, setOpenChangePassword] = useState(false)

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật trạng thái tương ứng
    switch (name) {
      case 'password':
        setPassword(value);
        break;
      case 'new_password':
        setNewPassword(value);
        break;
      default:
        break;
    }
  };
  const handleUpdatePassword = async () => {
    if (password && newPassword) {
      const params = {
        password: password,
        new_password: newPassword,
      }
      try {
        await request.patch(`account/change_password`, params, {
          headers: headers,
        });
        Swal.fire({
          title: 'Đổi mật khẩu thành công',
          icon: 'success',
          confirmButtonText: 'Hoàn tất',
          width: '50rem',
        });

        setOpenChangePassword(false)
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Mật khẩu bạn nhập không hợp lệ',
          width: '50rem',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Vui lòng nhập đầy đủ thông tin',
        width: '50rem',
      });
    }

  }

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
                onClick={() => setOpenChangePassword(true)}
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
              {openChangePassword ? (
                <>
                  <div className={classes['row']}>
                    <label className={classes['title-input']}>
                      Nhập mật khẩu cũ
                      <input type="password" name="password" placeholder="Nhập mật khẩu hiện tại" ref={inputPassword} onChange={handleChange} />
                    </label>
                  </div>
                  <div className={classes['row']}>
                    <label className={classes['title-input']}>
                      Nhập mật khẩu mới
                      <input type="text" name="new_password" placeholder="Nhập mật khẩu mới" ref={inputNewPassword} onChange={handleChange} />
                    </label>
                  </div>
                  <div className={classes['wrapper-handle']}>
                    <button className={classes['cancel-button']} type="button" onClick={() => setOpenChangePassword(false)}>Huỷ</button>
                    <button className={classes['update-button']} type="button" onClick={handleUpdatePassword}>Cập nhật mật khẩu</button>
                  </div>
                </>
              ) : (
                <Form user={user} setUser={setUser} headers={headers} />
              )}
            </div>

            <div className={classes['footer-manage-account']}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Infor;
