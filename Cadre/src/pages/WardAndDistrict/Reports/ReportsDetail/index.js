import classes from './styles.module.scss';
import SearchBar from '~components/SearchBar';
import {
  faArrowLeft,
  faLocationDot,
  faCircleInfo,
  faAngleUp,
  faAngleDown,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

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
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
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
      username: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nva@gmail.com',
      reportedObject: 'Bảng quảng cáo',
      reportType: 'Tố giác sai phạm',
      reportContent:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid quidem nobis, modi ducimus impedit itaque facilis nihil enim molestias possimus officiis aspernatur aperiam quam voluptatem nam quos dignissimos voluptate expedita.',
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
    </div>
  );
}
