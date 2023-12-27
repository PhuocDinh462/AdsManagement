import classes from './styles.module.scss';
import SearchBar from '~components/SearchBar';
import {
  faArrowLeft,
  faArrowRight,
  faLocationDot,
  faAngleUp,
  faAngleDown,
  faAngleLeft,
  faFile,
  faBan,
  faBlackboard,
  faRectangleAd,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { IconTextBtn } from '~components/button';
import { useNavigate, useParams } from 'react-router';
import { axiosRequest } from '~/src/api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setBoardIndex, selectBoardIndex, setReportCoord, selectUser } from '~/src/store/reducers';
import { Backdrop } from '@mui/material';

export default function Boards() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const boardIndexStorage = useSelector(selectBoardIndex);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalUrl, setImageModalUrl] = useState();

  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState(data);

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const handleFilter = (keyword) => {
    if (!keyword) setFilteredData(data.boards);
    else
      setFilteredData(
        data.boards.filter((item) => {
          const keywordLc = keyword.toLowerCase();

          return (
            item.board_id.toString().toLowerCase().includes(keywordLc) ||
            item.width.toString().toLowerCase().includes(keywordLc) ||
            item.height.toString().toLowerCase().includes(keywordLc) ||
            (item.width + 'm x ' + item.height + 'm').includes(keywordLc) ||
            item.type_name.toString().toLowerCase().includes(keywordLc) ||
            item.advertisement_content.toString().toLowerCase().includes(keywordLc)
          );
        })
      );
    setCurrentBoardIndex(0);
  };

  useEffect(() => {
    (async () => {
      await axiosRequest
        .get(`ward/getAdBoardsBySpotId/${id}`, { headers: headers })
        .then((res) => {
          const _data = res.data.data;
          setData(_data);
          setFilteredData(_data.boards);
          if (boardIndexStorage < _data.boards?.length) setCurrentBoardIndex(boardIndexStorage);
        })
        .catch((error) => {
          console.log('Get boards error: ', error);
        });
    })();
  }, []);

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
            className={[classes.nav_btn, classes.btn].join(' ')}
            onClick={() => {
              dispatch(setReportCoord({ lat: data.lat, lng: data.lng }));
              navigate('/home');
            }}
          >
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
              currentBoardIndex >= filteredData?.length - 1 && classes['btn--disabled'],
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
          {filteredData?.map((item, index) => (
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
        <div className={classes.title}>Chi tiết điểm đặt tại {data.address}</div>

        {filteredData?.length > 0 ? (
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
                        <FontAwesomeIcon icon={faRectangleAd} />
                        <dir className={classes.itemInfo__text}>
                          {'Loại quảng cáo: ' + filteredData[currentBoardIndex]?.type_name}
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
                          <img
                            src={filteredData[currentBoardIndex]?.advertisement_image_url}
                            alt="Image Board"
                            className={classes['board_image']}
                            onClick={() => {
                              setImageModalUrl(filteredData[currentBoardIndex]?.advertisement_image_url);
                              setShowImageModal(true);
                            }}
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
                  navigate(`/board-request/${filteredData[currentBoardIndex]?.board_id}`);
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

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showImageModal}
        onClick={() => setShowImageModal(false)}
      >
        <img className={classes.imageModal} src={imageModalUrl} />
      </Backdrop>
    </div>
  );
}
