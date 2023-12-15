import classes from './styles.module.scss';
import CollapseBtn from './CollapseBtn';
import { useState } from 'react';
import { faQuestionCircle, faFlag, faCircleCheck, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faAngleRight, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { noImage } from '~assets/imgs/Imgs';

export default function SpotInfoSidebar() {
  const [status, setStatus] = useState(true);
  const isPlanned = true;

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

  return (
    <div className={[classes.main_container, status ? classes.slideIn : classes.slideOut].join(' ')}>
      <div className={classes.body}>
        <div className={classes.adInfo}>
          <img className={classes.img} src={ads.length > 0 ? ads[currentAdsIndex].img : noImage} />

          <div className={classes.content}>
            <div className={[classes.ic, classes.ad_ic].join(' ')}>
              <FontAwesomeIcon icon={faQuestionCircle} />
            </div>
            <div className={classes.text}>
              <div className={classes.title}>Thông tin bảng quảng cáo</div>
              {ads.length > 0 ? (
                <>
                  <div className={classes.type}>{ads[currentAdsIndex].adType}</div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Kích thước: </span>
                    {ads[currentAdsIndex].size}
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Số lượng: </span>
                    {ads[currentAdsIndex].qty}
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Hình thức: </span>
                    {ads[currentAdsIndex].format}
                  </div>
                  <div className={classes.detail}>
                    <span className={classes.label}>Phân loại: </span>
                    {ads[currentAdsIndex].spotType}
                  </div>

                  <div
                    className={[
                      classes.report,
                      ads[currentAdsIndex].reports > 0 && classes['report--haveReports'],
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
            {ads.length > 1 ? (
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
                <div className={classes.pagination__number}>{`${currentAdsIndex + 1}/${ads.length}`}</div>
                <div
                  className={[
                    classes.pagination__btn,
                    currentAdsIndex >= ads.length - 1 && classes['pagination__btn--disabled'],
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
            <div className={classes.spot_name}>Quân Chủng Hải Quân - Trung Tâm Văn Phòng Thương Mại Hải Quân</div>
            <div className={classes.spot_detail}>15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM</div>

            <div className={classes.reportAndPlan}>
              <div className={classes.report}>
                <div className={classes.report__ic}>
                  <FontAwesomeIcon icon={faFlag} />
                </div>
                <div className={classes.report__text}>0 báo cáo</div>
              </div>

              <div className={[classes.plan, !isPlanned && classes['plan--notPlanned']].join(' ')}>
                <div className={classes.plan__ic}>
                  <FontAwesomeIcon icon={isPlanned ? faCircleCheck : faCircleXmark} />
                </div>
                <div className={classes.plan__text}>{(isPlanned ? 'Đã' : 'Chưa') + ' quy hoạch'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.collapse_btn} onClick={() => setStatus(!status)}>
        <CollapseBtn status={status} />
      </div>
    </div>
  );
}
