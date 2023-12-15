import classes from './styles.module.scss';
import CollapseBtn from './CollapseBtn';
import { useState } from 'react';

export default function SpotInfoSidebar() {
  const [status, setStatus] = useState(true);

  return (
    <div className={[classes.main_container, status ? classes.slideIn : classes.slideOut].join(' ')}>
      <div className={classes.collapse_btn} onClick={() => setStatus(!status)}>
        <CollapseBtn status={status} />
      </div>
    </div>
  );
}
