import classes from './styles.module.scss';
import SearchBar from '~components/SearchBar';

export default function ReportsDetail() {
  return (
    <div className={classes.main_container}>
      <div className={classes.sidebar}>
        <SearchBar />
      </div>
    </div>
  );
}
