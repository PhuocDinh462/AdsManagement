import classes from './styles.module.scss';
import CollapseBtn from './CollapseBtn';
import { useState, useEffect } from 'react';
import { faQuestionCircle, faFlag, faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faAngleRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noImage } from '~assets/imgs/Imgs';
import axios from 'axios';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectBoardId, setBoardId } from '~/src/store/reducers';
import { useNavigate } from 'react-router';
import { useSocketSubscribe } from '~/src/hook/useSocketSubscribe';

export default function SpotInfoSidebar(props) {
  const {
    spotCoord,
    spotId,
    setCollapse,
    adSpots,
    isClickMarker,
    setAutoCompleteValue,
    setShowImageModal,
    setImageModalUrl,
  } = props;

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [status, setStatus] = useState(true);
  const [currentAdsIndex, setCurrentAdsIndex] = useState(0);
  const [spotName, setSpotName] = useState();
  const [spotAddress, setSpotAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [currentInfo, setCurrentInfo] = useState();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user?.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const boardIdStorage = useSelector(selectBoardId);

  useEffect(() => {
    setLoading(true);
    setCurrentAdsIndex(0);

    (async () => {
      await axios
        .get(
          `https://rsapi.goong.io/Geocode?latlng=${spotCoord.lat},${spotCoord.lng}&api_key=${process.env.REACT_APP_GOONG_APIKEY}`
        )
        .then((res) => {
          const data = res.data.results;
          setAutoCompleteValue(data[0].formatted_address);
          setSpotName(data[0]?.name);
          setSpotAddress(data[0]?.address);
        })
        .catch((error) => {
          console.log('Get spot info error: ', error);
        })
        .finally(() => {
          setLoading(false);
        });
    })();
  }, [spotCoord]);

  useEffect(() => {
    setStatus(true);
    if (!isClickMarker) {
      setCurrentInfo(null);
      return;
    }
    (async () => {
      setLoading(true);

      if (spotId)
        await axiosPrivate
          .get(`ward/getInfoByPointId/${spotId}`)
          .then((res) => {
            const data = res.data.data;
            setCurrentInfo(data);

            if (boardIdStorage) {
              const boardIdStorageIndex = data.boardInfo.findIndex((item) => item.board_id === boardIdStorage);
              if (boardIdStorageIndex !== -1) setCurrentAdsIndex(boardIdStorageIndex);
              dispatch(setBoardId(null));
            }
          })
          .catch((error) => {
            console.log('Get info error: ', error);
          })
          .finally(() => {
            setLoading(false);
          });
      else {
        const body = {
          lat: spotCoord.lat,
          lng: spotCoord.lng,
        };
        await axiosPrivate
          .post('ward/getNumberOfReportsByLatLng', body)
          .then((res) => {
            const data = res.data.data;
            setCurrentInfo({ spotInfo: { reports: data.numberOfReports } });
          })
          .catch((error) => {
            console.log('Get number of reports error: ', error);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    })();
  }, [spotId, adSpots]);

  const goToReportsDetail = () => {
    if (spotId) navigate(`/reports/detail/${spotId}`);
    else navigate(`/reports/detail/${spotCoord.lat},${spotCoord.lng}`);
  };

  // Socket
  useSocketSubscribe(`updateAdsPoint_pointId=${spotId}`, async (res) => {
    setCurrentInfo({
      boardInfo: currentInfo.boardInfo,
      spotInfo: {
        ...currentInfo.spotInfo,
        location_type: res.location_type ?? currentInfo.spotInfo.location_type,
        image_url: res.image_url ?? currentInfo.spotInfo.image_url,
        is_planning: res.is_planning ?? currentInfo.spotInfo.is_planning,
        advertisement_type_id: res.advertisement_type_id ?? currentInfo.spotInfo.advertisement_type_id,
      },
    });
  });

  useSocketSubscribe(`updateBoard_pointId=${spotId}`, async (res) => {
    setCurrentInfo({
      spotInfo: currentInfo.spotInfo,
      boardInfo: {
        ...currentInfo.boardInfo,
        board_type_id: res.board_type_id ?? currentInfo.boardInfo.board_type_id,
        width: res.width ?? currentInfo.boardInfo.width,
        height: res.height ?? currentInfo.boardInfo.height,
      },
    });
  });

  return (
    <div className={[classes.main_container, status ? classes.slideIn : classes.slideOut].join(' ')}>
      {!loading && (
        <div className={classes.body}>
          <div className={classes.adInfo}>
            <img
              className={[classes.img, currentInfo?.spotInfo?.image_url && classes['img--enable']].join(' ')}
              src={currentInfo?.spotInfo?.image_url || noImage}
              onClick={() => {
                const url = currentInfo?.spotInfo?.image_url;
                if (!url) return;
                setImageModalUrl(url);
                setShowImageModal(true);
              }}
            />

            <div className={classes.content}>
              <div className={[classes.ic, classes.ad_ic].join(' ')}>
                <FontAwesomeIcon icon={faQuestionCircle} />
              </div>
              <div className={classes.text}>
                <div className={classes.title}>Thông tin bảng quảng cáo</div>
                {currentInfo?.boardInfo?.length > 0 ? (
                  <>
                    <div className={classes.type}>{currentInfo?.boardInfo[currentAdsIndex].type_name}</div>
                    <div className={classes.detail}>
                      <span className={classes.label}>Kích thước: </span>
                      {`${currentInfo?.boardInfo[currentAdsIndex].width}m x ${currentInfo?.boardInfo[currentAdsIndex].height}m`}
                    </div>
                    <div className={classes.detail}>
                      <span className={classes.label}>Số lượng: </span>
                      {currentInfo?.boardInfo?.length > 0 && `1 trụ / ${currentInfo?.boardInfo?.length} bảng`}
                    </div>
                    <div className={classes.detail}>
                      <span className={classes.label}>Hình thức: </span>
                      {currentInfo?.spotInfo.type_name}
                    </div>
                    <div className={classes.detail}>
                      <span className={classes.label}>Phân loại: </span>
                      {currentInfo?.spotInfo.location_type}
                    </div>

                    <div
                      className={[
                        classes.report,
                        currentInfo?.boardInfo[currentAdsIndex]?.reports > 0 && classes['report--haveReports'],
                      ].join(' ')}
                      onClick={goToReportsDetail}
                    >
                      <div className={classes.report__ic}>
                        <FontAwesomeIcon icon={faFlag} />
                      </div>
                      <div className={classes.report__text}>{`${
                        currentInfo?.boardInfo[currentAdsIndex]?.reports | 0
                      } báo cáo`}</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={classes.type}>Chưa có dữ liệu</div>
                    <div className={classes.detail}>
                      <span className={classes.label}>Vui lòng chọn điểm trên bản đồ để xem.</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={classes.pagination}>
              {currentInfo?.boardInfo?.length > 1 ? (
                <>
                  <div className={classes.pagination__divider} />
                  <div
                    className={[
                      classes.pagination__btn,
                      currentAdsIndex <= 0 && classes['pagination__btn--disabled'],
                    ].join(' ')}
                    onClick={() => setCurrentAdsIndex(currentAdsIndex - 1)}
                  >
                    <FontAwesomeIcon icon={faAngleLeft} />
                  </div>
                  <div className={classes.pagination__number}>{`${currentAdsIndex + 1}/${
                    currentInfo?.boardInfo?.length
                  }`}</div>
                  <div
                    className={[
                      classes.pagination__btn,
                      currentAdsIndex >= currentInfo?.boardInfo?.length - 1 && classes['pagination__btn--disabled'],
                    ].join(' ')}
                    onClick={() => setCurrentAdsIndex(currentAdsIndex + 1)}
                  >
                    <FontAwesomeIcon icon={faAngleRight} />
                  </div>
                  <div className={classes.pagination__divider} />
                </>
              ) : (
                <div className={classes.pagination__divider} />
              )}
            </div>
          </div>

          <div className={classes.spotInfo}>
            <div className={[classes.ic, classes.spot_ic].join(' ')}>
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div className={classes.text}>
              <div className={classes.title}>Thông tin địa điểm</div>
              <div className={classes.spot_name}>{spotName}</div>
              <div className={classes.spot_detail}>{spotAddress}</div>

              <div className={classes.reportAndPlan}>
                <div
                  className={[
                    classes.report,
                    currentInfo?.spotInfo?.reports > 0 && classes['report--haveReports'],
                  ].join(' ')}
                  onClick={goToReportsDetail}
                >
                  <div className={classes.report__ic}>
                    <FontAwesomeIcon icon={faFlag} />
                  </div>
                  <div className={classes.report__text}>{`${currentInfo?.spotInfo?.reports | 0} báo cáo`}</div>
                </div>

                <div
                  className={[classes.plan, !currentInfo?.spotInfo?.is_planning && classes['plan--notPlanned']].join(
                    ' '
                  )}
                >
                  <div className={classes.plan__ic}>
                    <FontAwesomeIcon icon={currentInfo?.spotInfo?.is_planning ? faCircleCheck : faCircleXmark} />
                  </div>
                  <div className={classes.plan__text}>
                    {(currentInfo?.spotInfo?.is_planning ? 'Đã' : 'Chưa') + ' quy hoạch'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={classes.collapse_btn}
        onClick={() => {
          setCollapse && setCollapse(status);
          setStatus(!status);
        }}
      >
        <CollapseBtn status={status} />
      </div>
    </div>
  );
}
