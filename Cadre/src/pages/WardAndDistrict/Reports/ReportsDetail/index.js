import classes from './styles.module.scss';
import SearchBar from '~components/SearchBar';
import {
  faArrowLeft,
  faArrowRight,
  faLocationDot,
  faCircleInfo,
  faAngleUp,
  faAngleDown,
  faAngleLeft,
  faUser,
  faPhone,
  faEnvelope,
  faFlag,
  faFile,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { IconTextBtn } from '~components/button';

export default function ReportsDetail() {
  const [data, setData] = useState([
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
    {
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
    },
    {
      username: 'Trần Văn B',
      phone: '0987654321',
      email: 'tvb@gmail.com',
      reportedObject: 'Địa điểm',
      reportType: 'Tố giác sai phạm',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',
    },
  ]);

  const [currentReportIndex, setCurrentReportIndex] = useState(0);

  return (
    <div className={classes.main_container}>
      <div className={classes.sideBar_container}>
        <div className={classes.searchBar_container}>
          <a href="/reports" className={[classes.back_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
          <SearchBar placeholder="Tìm kiếm..." width="20rem" onChange={(keyword) => console.log(keyword)} />
        </div>

        <div className={classes.nav_btn_container}>
          <div className={[classes.nav_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div className={[classes.nav_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faCircleInfo} />
          </div>
          <div
            className={[classes.nav_btn, classes.btn, currentReportIndex <= 0 && classes['btn--disabled']].join(' ')}
            onClick={() => setCurrentReportIndex(currentReportIndex - 1)}
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </div>
          <div
            className={[
              classes.nav_btn,
              classes.btn,
              currentReportIndex >= data.length - 1 && classes['btn--disabled'],
            ].join(' ')}
            onClick={() => setCurrentReportIndex(currentReportIndex + 1)}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>

        <dir className={classes.reports_container}>
          {data.map((item, index) => (
            <div className={classes.report_item} key={index} onClick={() => setCurrentReportIndex(index)}>
              <dir className={classes.divider} />
              <div className={classes.username}>
                <div
                  className={[
                    classes.username__text,
                    currentReportIndex === index && classes['username__text--active'],
                  ].join(' ')}
                >
                  {index + 1 + '. ' + item.username}
                </div>
                <div
                  className={[
                    classes.username__ic,
                    currentReportIndex === index && classes['username__ic--active'],
                  ].join(' ')}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </div>
              </div>
            </div>
          ))}
        </dir>
      </div>

      <div className={classes.content_container}>
        <div className={classes.title}>
          Chi tiết báo cáo tại 15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM
        </div>

        <div className={classes.userInfo_container}>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faUser} />
                    <dir className={classes.itemInfo__text}>
                      {'Người báo cáo: ' + data[currentReportIndex].username}
                    </dir>
                  </div>
                </td>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faFlag} />
                    <dir className={classes.itemInfo__text}>
                      {'Đối tượng bị báo cáo: ' + data[currentReportIndex].reportedObject}
                    </dir>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faPhone} />
                    <dir className={classes.itemInfo__text}>{'Số điện thoại: ' + data[currentReportIndex].phone}</dir>
                  </div>
                </td>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faFile} />
                    <dir className={classes.itemInfo__text}>
                      {'Hình thức báo cáo: ' + data[currentReportIndex].reportType}
                    </dir>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={classes.userInfo_col}>
                  <div className={classes.itemInfo}>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <dir className={classes.itemInfo__text}>{'Email: ' + data[currentReportIndex].email}</dir>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={classes.reportContent_container}>{data[currentReportIndex].reportContent}</div>

        <div className={classes.processBtn}>
          <IconTextBtn label="Xử lý" rightIc={faArrowRight} onClick={() => console.log('Xử lý')} />
        </div>
      </div>
    </div>
  );
}
