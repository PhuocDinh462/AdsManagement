import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { axiosClient } from '../../../api/axios';
import classes from './ModalAdd.module.scss';

const ModalUpdate = ({ data, onClose }) => {
  const [type, setType] = useState(data.type);
  const [content, setContent] = useState(data.typeName);
  console.log(data);

  const handleSave = async (e) => {
    e.preventDefault();
    const dataUpdate = {
      type: data.type,
      id: data.typeId,
      updatedValue: content,
    };
    console.log(dataUpdate);

    try {
      const response = await axiosClient.put('/cadre/updateForm', dataUpdate);

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
      <p className={classes.tilte_modal}>ChI TIẾT LOẠI HÌNH QC/HÌNH THỨC BC </p>
      <div className={classes.modal_container}>
        <div className={classes.level_wrap}>
          <p className={classes.level_wrap_title}>Loại:</p>
          <div className={classes.level_wrap_container}>
            <div>
              <label className={classes.label_add} htmlFor="type-ads">
                Loại hình quảng cáo
              </label>
              <input
                id="type-ads"
                type="radio"
                value="type"
                checked={data.type === 'advertisement'}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
            <div>
              <label className={classes.label_add} htmlFor="type-report">
                Loại hình thức báo cáo
              </label>
              <input
                id="type-report"
                type="radio"
                value="type"
                checked={data.type === 'report'}
                onChange={(e) => setType(e.target.value)}
              />
            </div>
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
            Cập nhập
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModalUpdate;

