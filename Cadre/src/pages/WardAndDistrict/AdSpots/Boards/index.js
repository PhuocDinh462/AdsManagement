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
import { useEffect, useState } from 'react';
import { IconTextBtn } from '~components/button';
import { useNavigate, useParams } from 'react-router';
import request from '~/src/utils/request';
import { useDispatch, useSelector } from 'react-redux';
import { setBoardIndex, selectBoardIndex, setReportCoord } from '~/src/store/reducers';

const pointDetail = 'Chi tiết điểm đặt tại 15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM';
const ad_types = ['Cổ động chính trị', 'Quảng cáo thương mại', 'Xã hội hoá'];

export default function Boards() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const boardIndexStorage = useSelector(selectBoardIndex);

  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const boardNavigate = useNavigate();
  const [filteredData, setFilteredData] = useState(data);
  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };
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
  };
  const fetchBoards = async () => {
    try {
      const res = await request.get(`board/get_boards_by_point/${id}`, { headers: headers });
      setData(res.data.board);
      if (boardIndexStorage < res.data.board.length) setCurrentBoardIndex(boardIndexStorage);
    } catch (error) {
      console.log('Error fetching data: ' + error.message);
    }
  };
  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [data]);

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
          <div className={[classes.nav_btn, classes.btn].join(' ')}>
            <FontAwesomeIcon icon={faLocationDot} />
          </div>
          <div
            className={[classes.nav_btn, classes.btn, currentBoardIndex <= 0 && classes['btn--disabled']].join(' ')}
            onClick={() => {
              setCurrentBoardIndex(currentBoardIndex - 1);
              dispatch(setBoardIndex(currentBoardIndex - 1));
            }}
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </div>
          <div
            className={[
              classes.nav_btn,
              classes.btn,
              currentBoardIndex >= filteredData.length - 1 && classes['btn--disabled'],
            ].join(' ')}
            onClick={() => {
              setCurrentBoardIndex(currentBoardIndex + 1);
              dispatch(setBoardIndex(currentBoardIndex + 1));
            }}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
        </div>

        <dir className={classes.reports_container}>
          {filteredData.map((item, index) => (
            <div
              className={classes.report_item}
              key={index}
              onClick={() => {
                setCurrentBoardIndex(index);
                dispatch(setBoardIndex(index));
              }}
            >
              <dir className={classes.divider} />
              <div className={classes.username}>
                <div
                  className={[
                    classes.username__text,
                    currentBoardIndex === index && classes['username__text--active'],
                  ].join(' ')}
                >
                  {console.log(item)}
                  {index + 1 + '. Bảng ' + item.board_id}
                </div>
                <div
                  className={[
                    classes.username__ic,
                    currentBoardIndex === index && classes['username__ic--active'],
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
        <div className={classes.title}>{pointDetail}</div>

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
                          {'Kích thước: ' +
                            filteredData[currentBoardIndex]?.width +
                            'm x ' +
                            filteredData[currentBoardIndex]?.height +
                            'm'}
                        </dir>
                      </div>
                    </td>
                    <td className={classes.userInfo_col}>
                      <div className={classes.itemInfo}>
                        <FontAwesomeIcon icon={faFlag} />
                        <dir className={classes.itemInfo__text}>
                          {'Hình thức quảng cáo: ' + ad_types[filteredData[currentBoardIndex]?.board_type_id]}
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
                          {/* <img src={images.googleImage} alt="Image Board" className={classes['board_image']} /> */}
                          <img
                            src={filteredData[currentBoardIndex]?.advertisement_image_url}
                            alt="Image Board"
                            className={classes['board_image']}
                          />
                        </dir>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={classes.reportContent_container}>
              {filteredData[currentBoardIndex]?.advertisement_content}
            </div>

            <div className={classes.processBtn}>
              <IconTextBtn
                label="Chỉnh sửa"
                rightIc={faArrowRight}
                onClick={() => {
                  boardNavigate(`/board-request/${filteredData[currentBoardIndex]?.board_id}`);
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
