import ButtonCT from '~/src/components/button/ButtonCT';
import classes from './style.module.scss';

const status = {
  pending: { type: 1, content: 'Chờ Xử Lý' },
  processing: { type: 2, content: 'Đang Xử Lý' },
  processed: { type: 3, content: 'Đã Xử Lý' },
};

const reportType = ['Tố giác sai phạm', 'Đăng ký nội dung', 'Đóng góp ý kiến'];

const ReportDetails = ({ info, handleCloseModal }) => {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <h3>Chi tiết Báo cáo</h3>
        </div>
        <div className={classes.container__content}>
          <p className={classes.container__content_title}>Trạng thái: {status[info.status].content}</p>
          <div className={classes.content_block}>
            <div className={classes.content}>
              <div className={classes.content_element}>
                <h3>Thời điểm gửi</h3>
                <div className={classes.m_left_10}>
                  <strong>Thời gian: {info.report_time}</strong>
                </div>
              </div>
              <div className={classes.content_element}>
                <h3>Hình thức báo cáo</h3>
                <div className={classes.m_left_10}>
                  <strong>{reportType[info.report_type_id]}</strong>
                </div>
              </div>
              <div className={classes.content_element}>
                <h3>Thông tin người gửi</h3>
                <ul className={classes.m_left_10}>
                  <li>
                    <strong>Họ tên</strong>
                    <p>: {info.fullname_rp}</p>
                  </li>
                  <li>
                    <strong>Email</strong>
                    <p>: {info.email_rp}</p>
                  </li>
                  <li>
                    <strong>Điện thoại </strong>
                    <p>: {info.phone_rp}</p>
                  </li>
                </ul>
              </div>
              <div className={classes.content_element}>
                <h3>Nội dung báo cáo</h3>
                <div className={classes.m_left_10}>{info.report_content}</div>
              </div>
              <div className={classes.content_element}>
                <h3>Hình ảnh minh họa</h3>
                <div className={classes.m_top_10}>
                  <div className={classes.d_flex_center}>
                    <img
                      src={
                        info.board_advertisement_image_url ? info.board_advertisement_image_url : info.point_image_url
                      }
                      alt="none"
                    />
                  </div>
                </div>
              </div>
              <div className={classes.content_element}>
                <h3>Nội dung xử lý</h3>
                <div className={classes.m_left_10}>
                  <p>{info.processing_info ? info.processing_info : status[info.status].content}</p>
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
