import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NavBarItem(props) {
  const { name, icon, path, active } = props;

  return (
    <div className={classes.main_container}>
      <FontAwesomeIcon icon={icon} className={`${classes['item_icon']} ${active ? classes['item--active'] : ''}`} />
      <a href={path} className={`${classes['item_text']} ${active ? classes['item--active'] : ''}`}>
        {name}
      </a>
    </div>
  );
}
