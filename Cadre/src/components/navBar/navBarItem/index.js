import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';

export default function NavBarItem(props) {
  const { name, icon, path, active } = props;
  const navigate = useNavigate();

  return (
    <div className={classes.main_container} onClick={() => navigate(path)}>
      <FontAwesomeIcon icon={icon} className={`${classes['item_icon']} ${active && classes['item--active']}`} />
      <div className={`${classes['item_text']} ${active && classes['item--active']}`}>{name}</div>
    </div>
  );
}
