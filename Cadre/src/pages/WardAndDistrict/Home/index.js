import classes from './styles.module.scss';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import FilterDropdown from '~components/Dropdown/FilterDropdown';

export default function Home() {
  const [filterActive, setFilterActive] = useState(false);

  return (
    <div className={classes.main_container}>
      <h1 className={classes.map_container}>Map</h1>

      <div className={classes.filter}>
        {filterActive && <FilterDropdown />}
        <div
          className={[classes.filter__ic, filterActive && classes['filter__ic--active']].join(' ')}
          onClick={() => setFilterActive(!filterActive)}
        >
          <FontAwesomeIcon icon={faFilter} />
        </div>
      </div>
    </div>
  );
}
