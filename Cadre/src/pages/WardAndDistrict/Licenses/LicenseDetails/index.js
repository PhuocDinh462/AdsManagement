import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Backdrop, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ButtonCT from '~/src/components/button/ButtonCT';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';
import { selectUser } from '~/src/store/reducers';
import { calculateDaysBetweenDates, formatDate, notiError, notiSuccess } from '~/src/utils/support';
import classes from './style.module.scss';

const statusLicense = {
  pending: {
    label: 'Chờ xử lý',
    value: 1,
  },
  approved: {
    label: 'Đã cấp phép',
    value: 2,
  },
  canceled: {
    label: 'Đã hủy',
  },
};

const adsType = ['', 'Cổ động chính trị', 'Quảng cáo thương mại', 'Xã hội hoá'];

const LicenseDetails = ({ handleCloseModal, data, fetchData }) => {
  const axiosPrivate = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const handleCancelLicense = async () => {
    setIsLoading(true);
    console.log(data);
    try {
      await axiosPrivate.patch(`/ward/license/${data.licensing_id}`, { status: 'canceled' });
      notiSuccess('Yêu cầu cấp phép đã được hủy');
      fetchData();
    } catch (error) {
      notiError('Lỗi!', 'Trạng thái chưa được cập nhật');
    } finally {
      setIsLoading(true);
      handleCloseModal();
    }
  };
  return (
    <>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <div></div>
          <h3>Chi tiết cấp phép</h3>
          <FontAwesomeIcon icon={faXmark} className={classes.ic_cancel} onClick={handleCloseModal} />
        </div>
        <div className={classes.container__content}>
          <p className={classes.container__content_title}>
            Trạng thái:
            <span
              className={` ${classes.status} ${
                statusLicense[data.status].value === 1
                  ? classes.status_pending
                  : statusLicense[data.status].value === 2
                  ? classes.status_accept
                  : classes.status_cancel
              }`}
            >
              {statusLicense[data.status].label}
            </span>
          </p>
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
                    <strong>Hình thức</strong>
                    <p>: {adsType[data.advertisement_type_id]}</p>
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
              <div className={classes.content_element}>
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
              </div>
              <div className={classes.content_element}>
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
              </div>
            </div>
          </div>
          <div className={`${classes.d_flex_end} ${classes.container__action}`}>
            <ButtonCT
              disabled={data.status !== 'pending'}
              borderRadius5
              primary
              medium
              content={data.status !== 'pending' ? statusLicense[data.status].label : 'Hủy cấp phép'}
              onClick={data.status !== 'pending' ? () => {} : handleCancelLicense}
            />
          </div>
        </div>
      </div>
      <div className={classes.bg}></div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default LicenseDetails;
