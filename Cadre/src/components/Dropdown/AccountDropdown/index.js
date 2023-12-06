import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSignOut } from '@fortawesome/free-solid-svg-icons';

export default function AccountDropdown() {
  return (
    <div className={classes.main_container}>
      <div className={classes.item_container}>
        <FontAwesomeIcon icon={faInfoCircle} className={classes.item_info_icon} />
        <div className={classes.item_info_name}>Thông tin tài khoản</div>
      </div>

      <div className={classes.divider} />

      <div className={classes.item_container}>
        <FontAwesomeIcon icon={faSignOut} className={classes.item_logout_icon} />
        <div className={classes.item_logout_name}>Đăng xuất</div>
      </div>
    </div>
  );
}
