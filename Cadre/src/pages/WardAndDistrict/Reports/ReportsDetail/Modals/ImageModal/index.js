import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ImageModal(props) {
  const { image_url, setActive } = props;

  return (
    <div className={classes.container}>
      <img className={classes.image} src={image_url} />
      <div className={classes.ic} onClick={() => setActive(false)}>
        <FontAwesomeIcon icon={faXmark} />
      </div>
    </div>
  );
}
