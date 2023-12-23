import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

export default function AccountDropdown() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login')
  }
  const handleSeeInfor = () => {
    navigate('/infor')
  }
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
