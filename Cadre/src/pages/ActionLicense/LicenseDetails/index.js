import React, { useEffect, useState } from 'react';
import classes from './style.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import ButtonCT from '~/src/components/button/ButtonCT';
import { axiosClient } from '~/src/api/axios';
import Swal from 'sweetalert2';

const LicenseDetails = ({ data, handleCloseModal }) => {
  const [adsType, setAdsType] = useState();
  console.log(data);

  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const fetchData = async () => {
    try {
      const response = await axiosClient.get(`/cadre/adsType/${data.advertisement_type_id}`, { headers });
      setAdsType(response.advertisementType);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  const handleAction = async (status) => {
    const dataToSend = {
      status,
    };
    try {
      const response = await axiosClient.patch(`/ward/license/${data.licensing_id}`, dataToSend, { headers });
      if (response.status === 'success') {
        if (status === 'approved') {
          Swal.fire({
            icon: 'success',
            title: 'Đã cấp phép!',
            timer: 1500,
            showConfirmButton: false,
          });

          const res = await axiosClient.post('/board/create', dataBoard, { headers });
          console.log(res);
          if (res.status === 'Create success') {
            Swal.fire({
              icon: 'success',
              title: 'Đã tạo bảng quảng cáo!',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        }
        if (status === 'canceled') {
          Swal.fire({
            icon: 'success',
            title: 'Đã từ chối!',
            timer: 1500,
            showConfirmButton: false,
          });
        }

        handleCloseModal();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại!',
          timer: 1500,
          text: 'Có lỗi xảy ra khi thêm nội dung. Vui lòng thử lại.',
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại!',
        timer: 1500,
        text: 'Có lỗi xảy ra khi thêm nội dung. Vui lòng thử lại.',
      });
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
            Trạng thái:{' '}
            <span
              className={` ${classes.status} ${
                data.status === 'approved'
                  ? classes.status_accept
                  : data.status === 'pending'
                  ? classes.status_pending
                  : classes.status_cancel
              }`}
            >
              {data.status === 'approved' ? (
                <span>Đã cấp phép</span>
              ) : data.status === 'pending' ? (
                <span>Chưa xử lý</span>
              ) : (
                <span>Đã hủy</span>
              )}
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
                    <strong>Kích thước </strong>
                    <p>
                      : {data.width}m x {data.height}m
                    </p>
                  </li>
                  {/* <li>
                    <strong>Số lượng </strong>
                    <p>: 1 trụ/bảng</p>
                  </li> */}
                  <li>
                    <strong>Hình thức</strong>
                    <p>
                      : <span>{adsType && adsType.type_name}</span>
                    </p>
                  </li>
                  <li>
                    <strong>Phân loại vị trí</strong>
                    <p>: {data.location_type}</p>
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
                <h3>Thời gian hợp đồng:</h3>
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
            <ButtonCT className={classes.btn_reject} content="Từ chối" onClick={() => handleAction('canceled')} />
            <ButtonCT className={classes.btn_accept} content="Cấp phép" onClick={() => handleAction('approved')} />
          </div>
        </div>
      </div>
      <div className={classes.bg}></div>
    </>
  );
};

export default LicenseDetails;

