import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faClose, faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import classes from './AddAdLocation.module.scss';
import { axiosClient } from '../../../../api/axios';
import Swal from 'sweetalert2';

const AddAdLocation = (props) => {
  const [indexCur, setIndexCur] = useState(1);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    axiosClient
      .get('cadre/wards')
      .then((response) => {
        setWards(response);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className={classes.adding__overlay}>
      <div className={classes.adding__modal}>
        <div className={classes.adding__modal__heading}>
          THÊM SẢN PHẨM
          <FontAwesomeIcon icon={faClose} className={classes['adding__modal-ic']} onClick={props.onClose} />
        </div>
        <div className={classes.adding__modal__body}>
          {indexCur === 1 && (
            <>
              <h4>Địa chỉ</h4>
              <input type="text" placeholder="Nhập vào tên địa chỉ" />
              <h4>Điểm đặt</h4>
              <input type="text" placeholder="Nhập vào giá khu vực" />
              <h4>Kích thước</h4>
              <select>
                <option>hihi</option>
                <option>hihi</option>
                <option>hihi</option>
              </select>
              <h4>Số lượng</h4>
              <input type="text" placeholder="Nhập vào giá khu vực" />
            </>
          )}
          {indexCur === 2 && (
            <>
              <h4>Hình thức</h4>
              <select>
                <option>haha</option>
                <option>haha</option>
                <option>haha</option>
              </select>
              <h4>Phân loại</h4>
              <select>
                <option>haha</option>
                <option>haha</option>
                <option>haha</option>
              </select>
              <h4>Trạng thái</h4>
              <select>
                <option>Đã quy hoạch</option>
                <option>Chưa quy hoạch</option>
              </select>
            </>
          )}
        </div>
        <div className={classes.adding__modal__line}>
          {[1, 2].map((index) => (
            <div
              key={index}
              className={classes['modal__line-item']}
              style={{
                backgroundColor: index === indexCur ? '#0A6971' : '',
              }}
            />
          ))}
        </div>
        <div className={classes.adding__modal__buttons}>
          {indexCur === 1 && <button onClick={props.onClose}>Hủy</button>}
          {indexCur === 2 && (
            <button
              onClick={() => {
                setIndexCur(1);
              }}
            >
              Quay lại
            </button>
          )}
          {indexCur === 1 && (
            <button
              onClick={() => {
                setIndexCur(2);
              }}
            >
              Tiếp tục
            </button>
          )}
          {indexCur === 2 && <button>Thêm</button>}
        </div>
      </div>
    </div>
  );
};

export default AddAdLocation;

