import classes from './styles.module.scss';
import { text } from '~styles/colors';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AnnotationDropdown(props) {
  return (
    <div className={classes.main_container}>
      <div className={classes.colors}>
        <div className={classes.title}>Màu sắc</div>
        <div className={classes.item}>
          <div className={classes.item__ic} style={{ backgroundColor: '#1BB750' }} />
          <div className={classes.item__text}>Điểm đã quy hoạch</div>
        </div>
        <div className={classes.item}>
          <div className={classes.item__ic} style={{ backgroundColor: '#FF9900' }} />
          <div className={classes.item__text}>Điểm chưa quy hoạch</div>
        </div>
        <div className={classes.item}>
          <div className={classes.item__ic} style={{ backgroundColor: '#FA3C3C' }} />
          <div className={classes.item__text}>Báo cáo chưa xử lý</div>
        </div>
        <div className={classes.item}>
          <div className={classes.item__ic} style={{ backgroundColor: '#00B2FF' }} />
          <div className={classes.item__text}>Báo cáo đã xử lý</div>
        </div>
      </div>

      <div className={classes.divider} />

      <div className={classes.symbols}>
        <div className={classes.title}>Ký hiệu</div>
        <div className={classes.item}>
          <div className={classes.item__ic}>
            <div style={{ fontSize: '.9rem', fontWeight: 700, color: text.color_800, userSelect: 'none' }}>QC</div>
          </div>
          <div className={classes.item__text}>Điểm quảng cáo</div>
        </div>
        <div className={classes.item}>
          <div className={classes.item__ic}>
            <FontAwesomeIcon icon={faFlag} />
          </div>
          <div className={classes.item__text}>Điểm bị báo cáo</div>
        </div>
      </div>
    </div>
  );
}
