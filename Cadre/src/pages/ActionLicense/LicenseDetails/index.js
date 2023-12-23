import React from 'react';
import classes from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ButtonCT from '~/src/components/button/ButtonCT';

const LicenseDetails = ({ handleCloseModal }) => {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <div></div>
          <h3>Chi tiết cấp phép</h3>
          <FontAwesomeIcon icon={faXmark} className={classes.ic_cancel} onClick={handleCloseModal} />
        </div>
        <div className={classes.container__content}>
          <p className={classes.container__content_title}>Trạng thái: Chưa cấp phép</p>
          <div className={classes.content_block}>
            <div className={classes.content}>
              <div className={classes.content_element}>
                <h3>Bảng quảng cáo</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Địa chỉ</strong>
                    <p>: Đồng Khởi - Nguyễn Du (Sở Văn hóa và Thể thao)</p>
                  </li>
                  <li>
                    <strong>Điểm đặt</strong>
                    <p>: Phía A</p>
                  </li>
                  <li>
                    <strong>Kích thước </strong>
                    <p>: 2.5m x 1.2m</p>
                  </li>
                  <li>
                    <strong>Số lượng </strong>
                    <p>: 1 trụ/bảng</p>
                  </li>
                  <li>
                    <strong>Hình thức</strong>
                    <p>: Cổ động chính trị</p>
                  </li>
                  <li>
                    <strong>Phân loại</strong>
                    <p>: Đất công nghiệp/Công viên/Hành lang an toàn giao thông</p>
                  </li>
                </ul>
              </div>
              <div className={classes.content_element}>
                <h3>Nội dung quảng cáo</h3>
                <div className={classes.m_left_10}>
                  <div>
                    <strong>Nội dung</strong>
                    <p>
                      Chất Lượng Đỉnh Cao: Sản phẩm/dịch vụ của chúng tôi đảm bảo chất lượng tốt nhất, được chọn lựa từ
                      những nguồn cung cấp uy tín.
                    </p>
                  </div>
                  <div className={classes.m_top_10}>
                    <strong>Hình ảnh minh họa</strong>
                    <div className={classes.d_flex_center}>
                      <img
                        src="https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg"
                        alt="none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={classes.content_element}>
                <h3>Thông tin công ty đặt quảng cáo</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Tên</strong>
                    <p>: CÔNG TY CỔ PHẦN ĐẦU TƯ H2O </p>
                  </li>
                  <li>
                    <strong>Mã số thuể</strong>
                    <p>: 123456789</p>
                  </li>
                  <li>
                    <strong>Đại diện pháp luật </strong>
                    <p>: Hutavi</p>
                  </li>
                  <li>
                    <strong>Email </strong>
                    <p>: 1 trụ/bảng</p>
                  </li>
                  <li>
                    <strong>Điện thoại</strong>
                    <p>: 123456789</p>
                  </li>
                  <li>
                    <strong>Địa chỉ </strong>
                    <p>: 123 TBL, quận 20, TP TBL</p>
                  </li>
                </ul>
              </div>
              <div className={classes.content_element}>
                <h3>Thời gian hợp đồng (365 ngày)</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Ngày bắt đầu</strong>
                    <p>: 02/10/2024 </p>
                  </li>
                  <li>
                    <strong>Ngày kết thúc</strong>
                    <p>: 02/10/2025</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={`${classes.d_flex_end} ${classes.container__action}`}>
            <ButtonCT borderRadius5 primary medium content="Cấp phép" />
          </div>
        </div>
      </div>
      <div className={classes.bg}></div>
    </>
  );
};

export default LicenseDetails;

