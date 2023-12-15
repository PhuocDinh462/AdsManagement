import React, { useState } from 'react';
import classes from './ModalAdd.module.scss';

const ModalUpdate = ({ data, onClose }) => {
  const [type, setType] = useState(data.type);
  const [content, setContent] = useState(data.content);

  const handleSave = (e) => {
    e.preventDefault();
    // Thực hiện lưu dữ liệu vào cơ sở dữ liệu hoặc thực hiện các xử lý khác
    console.log('Loại:', type);
    console.log('Nội dung:', content);
    onClose();
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
                checked={data.type === 'Hình quảng cáo'}
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
                checked={data.type === 'Hình thức báo cáo'}
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

