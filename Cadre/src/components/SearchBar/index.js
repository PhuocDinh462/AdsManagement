import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';

export default function SearchBar(props) {
  const { width, placeholder, onChange } = props;

  const handleOnChange = debounce((keyword) => {
    onChange(keyword);
  }, 700);

  return (
    <div className={classes.main_container} style={{ width: width ? width : '25rem' }}>
      <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
      <input
        type="text"
        id="inputSearch"
        placeholder={placeholder}
        className={classes.text_input}
        onChange={(e) => handleOnChange(e.target.value)}
      />
    </div>
  );
}
