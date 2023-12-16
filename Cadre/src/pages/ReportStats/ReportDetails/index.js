import React from 'react';
import classes from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ButtonCT from '~/src/components/button/ButtonCT';

const ReportDetails = ({ handleCloseModal }) => {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <h3>Chi tiết Báo cáo</h3>
        </div>
        <div className={classes.container__content}>
          <p className={classes.container__content_title}>Trạng thái: Đã xử lý</p>
          <div className={classes.content_block}>
            <div className={classes.content}>
              <div className={classes.content_element}>
                <h3>Thời điểm gửi</h3>
                <div className={classes.m_left_10}>
                  <strong>Ngày 02/10/2024</strong>
                </div>
              </div>
              <div className={classes.content_element}>
                <h3>Hình thức báo cáo</h3>
                <div className={classes.m_left_10}>
                  <strong>Tố giác sai phạm</strong>
                </div>
              </div>
              <div className={classes.content_element}>
                <h3>Thông tin người gửi</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Họ tên</strong>
                    <p>: Hutavi</p>
                  </li>
                  <li>
                    <strong>Email</strong>
                    <p>: Hutavi113@gmail.com</p>
                  </li>
                  <li>
                    <strong>Điện thoại </strong>
                    <p>: 123456789</p>
                  </li>
                </ul>
              </div>
              <div className={classes.content_element}>
                <h3>Hình ảnh minh họa</h3>
                <div className={classes.m_top_10}>
                  <div className={classes.d_flex_center}>
                    <img
                      src="https://images.fpt.shop/unsafe/filters:quality(90)/fptshop.com.vn/uploads/images/tin-tuc/138170/Originals/facebook-ads-la-gi.jpg"
                      alt="none"
                    />
                  </div>
                </div>
              </div>
              <div className={classes.content_element}>
                <h3>Nội dung xử lý</h3>
                <div className={classes.m_left_10}>
                  <p>
                    Căn cứ theo quy định tại Điểm a Khoản 3 và Điểm a Khoản 8 Điều 60 Nghị định 158/2013/NĐ-CP quy định
                    xử phạt vi phạm hành chính trong lĩnh vực văn hóa, thể thao, du lịch và quảng cáo thì hành vi đặt
                    biểu trưng, lô-gô, nhãn hiệu hàng hóa của người quảng cáo không đúng vị trí quy định trên bảng quảng
                    cáo, băng-rôn có nội dung tuyên truyền, cổ động chính trị, chính trị - xã hội sẽ bị xử phạt như sau:
                    3. Phạt tiền từ 5.000.000 đồng đến 10.000.000 đồng đối với một trong các hành vi sau đây: a) Đặt
                    biểu trưng, lô-gô, nhãn hiệu hàng hóa của người quảng cáo không đúng vị trí quy định trên bảng quảng
                    cáo, băng-rôn có nội dung tuyên truyền, cổ động chính trị, chính trị - xã hội; Biện pháp khắc phục
                    hậu quả: a) Buộc tháo dỡ quảng cáo đối với hành vi quy định tại các khoản 1, 2, 3 và 4 Điều này; Như
                    vậy, đối với hành vi bạn thắc mắc (đặt biểu trưng, lô-gô, nhãn hiệu hàng hóa của người quảng cáo
                    không đúng vị trí quy định trên bảng quảng cáo, băng-rôn có nội dung tuyên truyền, cổ động chính
                    trị, chính trị - xã hội) có thể sẽ bị phạt tiền từ 5.000.000 đồng đến 10.000.000 đồng. Đồng thời, sẽ
                    bị buộc tháo dỡ quảng cáo. Trên đây là nội dung quy định về việc xử phạt hành vi đặt biểu trưng,
                    lô-gô, nhãn hiệu hàng hóa của người quảng cáo không đúng vị trí quy định trên bảng quảng cáo,
                    băng-rôn có nội dung tuyên truyền, cổ động chính trị, chính trị - xã hội. Để hiểu rõ hơn về vấn đề
                    này bạn nên tham khảo thêm tại Nghị định 158/2013/NĐ-CP. Trân trọng!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className={`${classes.d_flex_end} ${classes.container__action}`}>
            <ButtonCT borderRadius5 primary medium content="Đóng" onClick={handleCloseModal} />
          </div>
        </div>
      </div>
      <div className={classes.bg}></div>
    </>
  );
};

export default ReportDetails;
