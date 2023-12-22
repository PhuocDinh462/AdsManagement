import classes from './styles.module.scss';
import { Checkbox } from '@mui/material';
import { colors } from '~styles/colors';

const sx = { '& .MuiSvgIcon-root': { fontSize: 18, color: colors.primary_200 } };

export default function FilterDropdown(props) {
  const { setNoReportStatus, setBeReportedStatus, setPlannedStatus, setNotPlanStatus } = props;

  return (
    <div className={classes.main_container}>
      <div className={classes.filterItem}>
        <div className={classes.title}>Trạng thái</div>
        <div className={classes.checkbox}>
          <Checkbox
            defaultChecked
            className={classes.checkbox__ic}
            sx={sx}
            onChange={(e) => {
              setNoReportStatus(e.target.checked);
            }}
          />
          <div className={classes.checkbox__label}>Bình thường</div>
        </div>
        <div className={classes.checkbox}>
          <Checkbox
            defaultChecked
            className={classes.checkbox__ic}
            sx={sx}
            onChange={(e) => {
              setBeReportedStatus(e.target.checked);
            }}
          />
          <div className={classes.checkbox__label}>Bị báo cáo</div>
        </div>
      </div>

      <div className={classes.divider} />

      <div className={classes.filterItem}>
        <div className={classes.title}>Quy hoạch</div>
        <div className={classes.checkbox}>
          <Checkbox
            defaultChecked
            className={classes.checkbox__ic}
            sx={sx}
            onChange={(e) => {
              setPlannedStatus(e.target.checked);
            }}
          />
          <div className={classes.checkbox__label}>Đã quy hoạch</div>
        </div>
        <div className={classes.checkbox}>
          <Checkbox
            defaultChecked
            className={classes.checkbox__ic}
            sx={sx}
            onChange={(e) => {
              setNotPlanStatus(e.target.checked);
            }}
          />
          <div className={classes.checkbox__label}>Chưa quy hoạch</div>
        </div>
      </div>
    </div>
  );
}
