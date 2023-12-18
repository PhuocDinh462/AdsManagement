import classes from './styles.module.scss';
import CollapseBtn from './CollapseBtn';
import { useState, useEffect } from 'react';
import { faQuestionCircle, faFlag, faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faAngleRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noImage } from '~assets/imgs/Imgs';
import axios from 'axios';

export default function SpotInfoSidebar(props) {
  const { spotCoord, adSpot, setCollapse } = props;
  const [status, setStatus] = useState(true);

  const ads = [
    {
      adType: 'Trụ, cụm pano',
      size: '3m x 1.6m',
      qty: '1 trụ/bảng',
      format: 'Cổ động chính trị',
      spotType: 'Đất công nghiệp/Công viên/Hành lang an toàn giao thông',
      reports: 0,
      img: 'https://panoquangcao.net/wp-content/uploads/2020/09/bien-quang-cao-tren-duong-cao-toc-2.jpg',
    },
    {
      adType: 'Trụ, cụm pano',
      size: '2.5m x 1.2m',
      qty: '1 trụ/bảng',
      format: 'Cổ động chính trị',
      spotType: 'Đất công nghiệp/Công viên/Hành lang an toàn giao thông',
      reports: 2,
      img: 'https://chuinoxvang.com/upload/images/bang-hieu-pano1.jpg',
    },
    {
      adType: 'Trụ, cụm pano',
      size: '2.5m x 1.2m',
      qty: '1 trụ/bảng',
      format: 'Cổ động chính trị',
      spotType: 'Đất công nghiệp/Công viên/Hành lang an toàn giao thông',
      reports: 0,
      img: 'https://panoquangcao.net/wp-content/uploads/2020/09/bien-quang-cao-tren-duong-cao-toc-2.jpg',
    },
  ];

  const [currentAdsIndex, setCurrentAdsIndex] = useState(0);

  const [spotName, setSpotName] = useState();
  const [spotAddress, setSpotAddress] = useState();

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `https://rsapi.goong.io/Geocode?latlng=${spotCoord.lat},${spotCoord.lng}&api_key=${process.env.REACT_APP_GOONG_APIKEY}`
        )
        .then((res) => {
          const data = res.data.results;
          setSpotName(data[0]?.name);
          setSpotAddress(data[0]?.address);
        })
        .catch((error) => {
          console.log('Get spot info error: ', error);
        });
    })();
  }, [spotCoord]);

  return (
    <div className={[classes.main_container, status ? classes.slideIn : classes.slideOut].join(' ')}>
      <div className={classes.body}>
        <div className={classes.adInfo}>
          <img
            className={classes.img}
            src={adSpot?.boards?.length > 0 ? adSpot?.boards[currentAdsIndex].image_url : noImage}
          />

          <div className={classes.content}>
            <div className={[classes.ic, classes.ad_ic].join(' ')}>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </div>
            <div className={classes.text}>
              <div className={classes.title}>Thông tin bảng quảng cáo</div>
              {adSpot?.boards?.length > 0 ? (
                <>
                  <div className={classes.type}>{ads[currentAdsIndex].adType}</div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Kích thước: </span>
                    {adSpot?.boards[currentAdsIndex].form_ad}
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Số lượng: </span>
                    {adSpot?.boards && `1 trụ/${adSpot?.boards?.length} bảng`}
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Hình thức: </span>
                    {adSpot?.advertising_type}
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Phân loại: </span>
                    {adSpot?.location_type}
                  </div>

                  <div
                    className={[
                      classes.report,
                      adSpot?.boards[currentAdsIndex].reports > 0 && classes['report--haveReports'],
                    ].join(' ')}
                  >
                    <div className={classes.report__ic}>
                      <FontAwesomeIcon icon={faFlag} />
                    </div>
                    <div className={classes.report__text}>{`${ads[currentAdsIndex].reports} báo cáo`}</div>
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
            {adSpot?.boards.length > 1 ? (
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
                <div className={classes.pagination__number}>{`${currentAdsIndex + 1}/${adSpot?.boards.length}`}</div>
                <div
                  className={[
                    classes.pagination__btn,
                    currentAdsIndex >= adSpot?.boards.length - 1 && classes['pagination__btn--disabled'],
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
              <div className={classes.report}>
                <div className={classes.report__ic}>
                  <FontAwesomeIcon icon={faFlag} />
                </div>
                <div className={classes.report__text}>0 báo cáo</div>
              </div>

              <div className={[classes.plan, !adSpot?.is_planning && classes['plan--notPlanned']].join(' ')}>
                <div className={classes.plan__ic}>
                  <FontAwesomeIcon icon={adSpot?.is_planning ? faCircleCheck : faCircleXmark} />
                </div>
                <div className={classes.plan__text}>{(adSpot?.is_planning ? 'Đã' : 'Chưa') + ' quy hoạch'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
