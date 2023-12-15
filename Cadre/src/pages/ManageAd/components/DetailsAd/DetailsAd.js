import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import classes from './DetailsAd.module.scss';

const DetailsAd = (props) => {
  const [indexCur, setIndexCur] = useState(1);

  return (
    <div className={classes.adding__overlay}>
      <div className={classes.adding__modal}>
        <div className={classes.adding__modal__heading}>
          THÊM SẢN PHẨM
          <FontAwesomeIcon icon={faClose} className={classes['adding__modal-ic']} onClick={props.onClose} />
        </div>
        <ul>
          <li>
            <strong>Khu vực &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>: Đồng Khởi
            - Nguyễn Du (Sở Văn hóa và Thể thao)
          </li>
          <li>
            <strong>Điểm đặt &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>: Phía A
          </li>
          <li>
            <strong>Kích thước &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>: 2.5m x 1.2m
          </li>
          <li>
            <strong>Số lượng&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>: 1 trụ/bảng
          </li>
          <li>
            <strong>Hình thức&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>: Cổ động chính trị
          </li>
          <li>
            <strong>Phân loại&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>: Đất công
            nghiệp/Công viên/Hành lang an toàn giao thông
          </li>
          <li>
            <strong>Trạng thái&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>: Chưa quy hoạch
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DetailsAd;
