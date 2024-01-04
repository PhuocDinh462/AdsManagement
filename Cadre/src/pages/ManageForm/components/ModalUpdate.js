import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { axiosClient } from '../../../api/axios';
import classes from './ModalAdd.module.scss';

const ModalUpdate = ({ data, onClose }) => {
  const [content, setContent] = useState(data.typeName);
  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const dataUpdate = {
      type: data.type,
      id: data.typeId,
      updatedValue: content,
    };
    console.log(dataUpdate);

    try {
      const response = await axiosClient.put('/cadre/updateForm', dataUpdate, { headers });

      if (response.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật thành công!',
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại!',
          timer: 1500,
          text: 'Có lỗi xảy ra khi cập nhật nội dung. Vui lòng thử lại.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại!',
        timer: 1500,
        text: error,
      });
    }
  };
  return (
    <form onSubmit={handleSave}>
      <p className={classes.tilte_modal}>CHI TIẾT LOẠI HÌNH QC/HÌNH THỨC BC</p>
      <div className={classes.modal_container}>
        <div className={classes.level_wrap}>
          <p className={classes.level_wrap_title}>Loại:</p>
          <div className={classes.level_wrap_container}>
            {data.type === 'report' && <p>Hình thức báo cáo</p>}
            {data.type === 'advertisement' && <p>Hình thức quảng cáo</p>}
            {data.type === 'board' && <p>Loại bảng quảng cáo</p>}
          </div>
        </div>
        <div className={classes.content_wrap}>
          <label htmlFor="content" className={classes.title_label}>
            Nội dung:
          </label>
          <input
            id="content"
            className={classes.input_area}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className={classes.button_wrap}>
          <button className={classes.buttonAdd} type="submit">
            Cập nhật
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModalUpdate;

