import React, { useEffect, useState } from 'react';
import classes from './DetailActionEdit.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPhone,
  faEnvelope,
  faCalendarDays,
  faCircleInfo,
  faClipboard,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons';
import { axiosClient } from '~/src/api/axios';
import Swal from 'sweetalert2';
import Image from '~/src/assets/images/pexels-david-geib-3220846.jpg';
import Image1 from '~/src/assets/images/google_logo.png';

const DetailActionEdit = ({ data, onClose }) => {
  const [dataPoint, setDataPoint] = useState([]);
  const [dataBoard, setDataBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const responsePoints = await axiosClient.get('/cadre/adsPoint');
      setDataPoint(responsePoints);
      console.log(responsePoints);

      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <p className={classes.title}>Chi tiết yêu cầu chỉnh sửa</p>
      </div>
      <div className={classes.container_wrap}>
        <div className={classes.wrap_infor}>
          <div className={classes.infor_left}>
            <ul>
              <li>
                <span>
                  <FontAwesomeIcon icon={faUser} className={classes.icon_infor} />
                </span>
                <span style={{ color: '#0C7F89', fontWeight: '600', marginLeft: '10px' }}>
                  Cán bộ yêu cầu&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>{' '}
                <span>Nguyễn Văn A</span>
              </li>
              <li>
                <span>
                  <FontAwesomeIcon icon={faPhone} className={classes.icon_infor} />
                </span>
                <span style={{ color: '#0C7F89', fontWeight: '600', marginLeft: '10px' }}>
                  Số điện thoại&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :
                </span>{' '}
                <span>0812345678</span>
              </li>
              <li>
                <span>
                  <FontAwesomeIcon icon={faEnvelope} className={classes.icon_infor} />
                </span>
                <span style={{ color: '#0C7F89', fontWeight: '600', marginLeft: '10px' }}>
                  Email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>{' '}
                <span>abc@gmail.com</span>
              </li>
            </ul>
          </div>
          <div className={classes.infor_right}>
            <ul>
              <li>
                <span>
                  <FontAwesomeIcon icon={faCalendarDays} className={classes.icon_infor} />
                </span>
                <span style={{ color: '#0C7F89', fontWeight: '600', marginLeft: '10px' }}>
                  Ngày yêu
                  cầu&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>{' '}
                <span>Nguyễn Văn A</span>
              </li>
              <li>
                <span>
                  <FontAwesomeIcon icon={faCircleInfo} className={classes.icon_infor} />
                </span>
                <span style={{ color: '#0C7F89', fontWeight: '600', marginLeft: '10px' }}>
                  Đối tượng cần chỉnh sửa&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>{' '}
                <span>0812345678</span>
              </li>
              <li>
                <span>
                  <FontAwesomeIcon icon={faClipboard} className={classes.icon_infor} />
                </span>
                <span style={{ color: '#0C7F89', fontWeight: '600', marginLeft: '10px' }}>
                  Lý do chỉnh
                  sửa&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>{' '}
                <span>abc@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className={classes.container_edit}>
          <div className={classes.edit_left}>
            <div className={classes.wrap_content}>
              <div className={classes.title_edit}>
                <p>Thông tin ban đầu</p>
              </div>
              <div className={classes.scroll_content}>
                {data.board_id && (
                  <div className={classes.img_ads}>
                    <img src={Image} alt="Ảnh bảng quảng cáo" />
                  </div>
                )}
                {data.board_id && (
                  <div className={classes.ads_infor}>
                    <FontAwesomeIcon icon={faCircleQuestion} color="#00B2FF" />
                    <div>
                      <p className={classes.title_ads_infor}>Thông tin bảng quảng cáo</p>
                      <p className={classes.type_ads}>Trụ, cụm pano</p>
                      <p className={classes.item_ads}>
                        Kích thước: <span>1mx1m</span>
                      </p>
                      <p className={classes.item_ads}>
                        Quy hoạch: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Hình thức: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Phân loại: <span>1mx1m</span>
                      </p>
                    </div>
                  </div>
                )}

                {data.point_id && (
                  <div className={classes.img_ads}>
                    <img src={Image} alt="Ảnh bảng quảng cáo" />
                  </div>
                )}
                {data.point_id && (
                  <div className={classes.point_infor}>
                    <FontAwesomeIcon icon={faLocationDot} color="#00B2FF" />
                    <div>
                      <p className={classes.title_point_infor}>Thông tin bảng quảng cáo</p>
                      <p className={classes.type_ads}>Trụ, cụm pano</p>
                      <p className={classes.item_ads}>
                        Kích thước: <span>1mx1m</span>
                      </p>
                      <p className={classes.item_ads}>
                        Quy hoạch: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Hình thức: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Phân loại: <span>1mx1m</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={classes.edit_right}>
            <div className={classes.wrap_content}>
              <div className={classes.title_edit}>
                <p>Thông tin sau thay đổi</p>
              </div>
              <div className={classes.scroll_content}>
                {data.board_id && (
                  <div className={`${classes.img_ads} ${classes.boardImg}`}>
                    <img src={Image} alt="Ảnh bảng quảng cáo" />
                  </div>
                )}
                {data.board_id && (
                  <div className={classes.ads_infor}>
                    <FontAwesomeIcon icon={faCircleQuestion} color="#00B2FF" />
                    <div style={{ height: '100%' }}>
                      <p className={classes.title_ads_infor}>Thông tin bảng quảng cáo</p>
                      <p className={classes.type_ads}>Trụ, cụm pano</p>
                      <p className={classes.item_ads}>
                        Kích thước:{' '}
                        <span>
                          {data.width}m x {data.height}m
                        </span>
                      </p>
                      <p className={classes.item_ads}>
                        Quy hoạch: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Hình thức: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Phân loại: <span>1mx1m</span>
                      </p>
                    </div>
                  </div>
                )}
                {data.point_id && (
                  <div className={`${classes.img_ads} ${classes.pointImg}`}>
                    <img src={Image} alt="Ảnh bảng quảng cáo" />
                  </div>
                )}

                {data.point_id && (
                  <div className={classes.point_infor}>
                    <FontAwesomeIcon icon={faLocationDot} color="#00B2FF" />
                    <div style={{ height: '100%' }}>
                      <p className={classes.title_point_infor}>Thông tin bảng quảng cáo</p>
                      <p className={classes.type_ads}>Trụ, cụm pano</p>
                      <p className={classes.item_ads}>
                        Kích thước: <span>1mx1m</span>
                      </p>
                      <p className={classes.item_ads}>
                        Quy hoạch: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Hình thức: <span>1mx1m</span>
                      </p>{' '}
                      <p className={classes.item_ads}>
                        Phân loại: <span>1mx1m</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.wrap_btn}>
        <div className={classes.btn_reject}>Từ chối</div>
        <div className={classes.btn_ok}>Duyệt</div>
      </div>
    </div>
  );
};

export default DetailActionEdit;

