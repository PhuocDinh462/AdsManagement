import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NavBarItem(props) {
  const { name, icon, path, active } = props;

  return (
    <a href={path} className={classes.main_container}>
      <FontAwesomeIcon icon={icon} className={`${classes['item_icon']} ${active ? classes['item--active'] : ''}`} />
      <div className={`${classes['item_text']} ${active ? classes['item--active'] : ''}`}>{name}</div>
    </a>
  );
}
