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
  faHourglassStart,
  faCheck,
  faDiagramProject,
  faBan,
  faBlackboard,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { IconTextBtn } from '~components/button';
import images from '~/src/assets/images';
import { useNavigate } from 'react-router';
const pointDetail = 'Chi tiết điểm đặt tại 15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM'
const ad_types = ["Cổ động chính trị", "Quảng cáo thương mại", "Xã hội hoá"]
export default function Boards() {
  const [data, setData] = useState([
    {
      id: 1,
      width: 2.5,
      height: 2.2,
      board_type_id: 2,
      username: 'Nguyễn Văn A',
      advertisement_image_url: 'abcdefghzxcvzx',
      advertisement_content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.
      
      `,

    },
    {
      id: 2,
      width: 2.5,
      height: 3.2,
      board_type_id: 1,
      advertisement_image_url: 'abcdefghzxcvzx',
      advertisement_content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',

    },
    {
      id: 3,
      width: 2.5,
      height: 4.2,
      board_type_id: 0,
      advertisement_image_url: 'abcdefghzxcvzx',
      advertisement_content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda nostrum dicta distinctio harum non quod natus ipsum ducimus, aliquid enim, nobis labore sapiente ut architecto rerum explicabo culpa nam amet soluta exercitationem! Beatae hic alias quis aliquid ex eligendi vel natus, eveniet ullam possimus, necessitatibus, reiciendis earum dolor? Necessitatibus, ullam.',

    }
  ]);

  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const boardNavigate = useNavigate();
  const [filteredData, setFilteredData] = useState(data);

  const handleFilter = (keyword) => {
    if (!keyword) setFilteredData(data);
    else
      setFilteredData(
        data.filter((item) => {
          const keywordLc = keyword.toLowerCase();

          return (
            item.username.toLowerCase().includes(keywordLc) ||
            item.phone.toLowerCase().includes(keywordLc) ||
            item.email.toLowerCase().includes(keywordLc) ||
            item.reportType.toLowerCase().includes(keywordLc) ||
            item.reportedObject.toLowerCase().includes(keywordLc) ||
            item.status.toLowerCase().includes(keywordLc)
          );
        })
      );
    setCurrentReportIndex(0);
  };

  return (
    <div className={classes.main_container}>
      <div className={classes.sideBar_container}>
        <div className={classes.searchBar_container}>
          <a href="/reports" className={[classes.back_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </a>
          <SearchBar placeholder="Tìm kiếm..." width="20rem" onChange={(keyword) => handleFilter(keyword)} />
        </div>

        <div className={classes.nav_btn_container}>
          <div
            className={[classes.nav_btn, classes.btn, filteredData.length == 0 && classes['btn--disabled']].join(' ')}
          >
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div
            className={[classes.nav_btn, classes.btn, filteredData.length == 0 && classes['btn--disabled']].join(' ')}
          >
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
              currentReportIndex >= filteredData.length - 1 && classes['btn--disabled'],
            ].join(' ')}
            onClick={() => setCurrentReportIndex(currentReportIndex + 1)}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>

        <dir className={classes.reports_container}>
          {filteredData.map((item, index) => (
            <div className={classes.report_item} key={index} onClick={() => setCurrentReportIndex(index)}>
              <dir className={classes.divider} />
              <div className={classes.username}>
                <div
                  className={[
                    classes.username__text,
                    currentReportIndex === index && classes['username__text--active'],
                  ].join(' ')}
                >
                  {index + 1 + '. Bảng ' + item.id}
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
          {pointDetail}
        </div>

        {filteredData.length > 0 ? (
          <>
            <div className={classes.userInfo_container}>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td className={classes.userInfo_col}>
                      <div className={classes.itemInfo}>
                        <FontAwesomeIcon icon={faBlackboard} />
                        <dir className={classes.itemInfo__text}>
                          {'Kích thước: ' + filteredData[currentReportIndex]?.width + 'm x ' + filteredData[currentReportIndex]?.height + "m"}
                        </dir>
                      </div>
                    </td>
                    <td className={classes.userInfo_col}>
                      <div className={classes.itemInfo}>
                        <FontAwesomeIcon icon={faFlag} />
                        <dir className={classes.itemInfo__text}>
                          {'Hình thức quảng cáo: ' + ad_types[filteredData[currentReportIndex]?.board_type_id]}
                        </dir>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.userInfo_col}>
                      <div className={classes.itemInfo}>
                        <FontAwesomeIcon icon={faFile} />
                        <span> Hình ảnh:</span>
                        <dir className={classes.itemInfo__text}>
                          <img src={images.googleImage} alt="Image Board" className={classes['board_image']} />

                        </dir>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={classes.reportContent_container}>{filteredData[currentReportIndex]?.advertisement_content}</div>

            <div className={classes.processBtn}>
              <IconTextBtn
                label='Chỉnh sửa'
                rightIc={faArrowRight}
                onClick={() => {
                  boardNavigate(`/board-request/${filteredData[currentReportIndex]?.id}`)
                }}
              />
            </div>
          </>
        ) : (
          <div className={classes.noData}>
            <div className={classes.noData__ic}>
              <FontAwesomeIcon icon={faBan} />
            </div>
            <h1 className={classes.noData__text}>Không có dữ liệu</h1>
          </div>
        )}
      </div>
    </div>
  );
}
