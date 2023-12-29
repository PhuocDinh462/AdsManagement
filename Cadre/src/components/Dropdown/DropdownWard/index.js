import classes from './styles.module.scss';
import { Checkbox } from '@mui/material';
import { colors } from '~styles/colors';

const sx = { '& .MuiSvgIcon-root': { fontSize: 18, color: colors.primary_200 } };

export default function DropdownWard(props) {
  const { } = props;

  return (
    <div className={classes.main_container}>
      <div className={classes.filterItem}>
        <div className={classes.title}>Chọn phường</div>
        <div className={classes.checkbox}>
          <Checkbox
            defaultChecked
            className={classes.checkbox__ic}
            sx={sx}
            onChange={(e) => {
              // setNoReportStatus(e.target.checked);
            }}
          />
          <div className={classes.checkbox__label}>Phường 1</div>
        </div>
        <div className={classes.checkbox}>
          <Checkbox
            defaultChecked
            className={classes.checkbox__ic}
            sx={sx}
            onChange={(e) => {
              // setBeReportedStatus(e.target.checked);
            }}
          />
          <div className={classes.checkbox__label}>Phường 2</div>
        </div>
      </div>
    </div>
  );
}
