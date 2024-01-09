import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.module.scss';

const BoardDetails = ({ onClose, data }) => {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <div></div>
          <h3>Chi tiết bảng quảng cáo</h3>
          <FontAwesomeIcon icon={faXmark} className={classes.ic_cancel} onClick={onClose} />
        </div>
        <div className={classes.container__content}>
          <div className={classes.content_block}>
            <div className={classes.content}>
              <div className={classes.content_element}>
                <h3>Bảng quảng cáo</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Địa chỉ</strong>
                    <p>: {data.address}</p>
                  </li>
                  <li>
                    <strong>Loại vị trí</strong>
                    <p>: {data.location_type}</p>
                  </li>
                  <li>
                    <strong>Kích thước </strong>
                    <p>: {`${data.width}m x ${data.height}m`}</p>
                  </li>

                  <li>
                    <strong>Loại bảng quảng cáo</strong>
                    <p>: {data.type_name}</p>
                  </li>
                </ul>
              </div>
              <div className={classes.content_element}>
                <h3>Nội dung quảng cáo</h3>
                <div className={classes.m_left_10}>
                  <div>
                    <strong>Nội dung</strong>
                    <p>{data.advertisement_content}</p>
                  </div>
                  <div className={classes.m_top_10}>
                    <strong>Hình ảnh minh họa</strong>
                    <div className={classes.d_flex_center}>
                      <img src={data.advertisement_image_url} alt="none" />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className={classes.content_element}>
                <h3>Thông tin công ty đặt quảng cáo</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Tên</strong>
                    <p>: {data.company_name} </p>
                  </li>
                  <li>
                    <strong>Mã số thuể</strong>
                    <p>: {data.company_taxcode}</p>
                  </li>
                  <li>
                    <strong>Đại diện pháp luật </strong>
                    <p>: {data.representative}</p>
                  </li>
                  <li>
                    <strong>Email </strong>
                    <p>: {data.company_email}</p>
                  </li>
                  <li>
                    <strong>Điện thoại</strong>
                    <p>: {data.company_phone}</p>
                  </li>
                  <li>
                    <strong>Địa chỉ </strong>
                    <p>: {data.company_address}</p>
                  </li>
                </ul>
              </div> */}
              {/* <div className={classes.content_element}>
                <h3>Thời gian hợp đồng ({calculateDaysBetweenDates(data.start_date, data.end_date)} ngày)</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Ngày bắt đầu</strong>
                    <p>: {formatDate(data.start_date)} </p>
                  </li>
                  <li>
                    <strong>Ngày kết thúc</strong>
                    <p>: {formatDate(data.end_date)}</p>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
          {/* <div className={`${classes.d_flex_end} ${classes.container__action}`}>
          </div> */}
        </div>
      </div>
      <div className={classes.bg}></div>
    </>
  );
};

export default BoardDetails;
