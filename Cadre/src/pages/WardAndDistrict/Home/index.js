import classes from './styles.module.scss';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
  return (
    <div className={classes.main_container}>
      <h1 className={classes.map_container}>Map</h1>

      <div className={classes.filter}>
        <div className={classes.filter__ic}>
          <FontAwesomeIcon icon={faFilter} />
        </div>
      </div>
    </div>
  );
}
