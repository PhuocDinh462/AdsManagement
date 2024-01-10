import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setUser } from '~/src/store/reducers';
import request from '~/src/utils/request';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';

export default function AccountDropdown() {
  const axiosPrivate = useAxiosPrivate()
  const refresh_token = localStorage.getItem('refresh_token')

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const params = {
      refresh_token: refresh_token
    }
    try {
      const res = await axiosPrivate.post('/auth/logout', params)

      navigate('/');
      await localStorage.clear();
      await dispatch(setUser(null));
    } catch (error) {
      console.error('Error handle data:', error);
    }
  };
  const handleSeeInfor = () => {
    navigate('/infor');
  };
  return (
    <div className={classes.main_container}>
      <div className={classes.item_container} onClick={handleSeeInfor}>
        <FontAwesomeIcon icon={faInfoCircle} className={classes.item_info_icon} />
        <div className={classes.item_info_name}>Thông tin tài khoản</div>
      </div>

      <div className={classes.divider} />

      <div className={classes.item_container} onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOut} className={classes.item_logout_icon} />
        <div className={classes.item_logout_name}>Đăng xuất</div>
      </div>
    </div>
  );
}
