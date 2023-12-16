import classes from './styles.module.scss';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CollapseBtn(props) {
  return (
    <div className={classes.main_container}>
      <FontAwesomeIcon icon={props.status ? faCaretLeft : faCaretRight} />
    </div>
  );
}
