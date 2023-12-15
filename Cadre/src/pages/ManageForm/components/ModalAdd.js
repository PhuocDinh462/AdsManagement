import React, { useState } from 'react';
import classes from './ModalAdd.module.scss';

const ModalAdd = ({ onClose }) => {
  const [addressType, setAddressType] = useState('district');
  const [content, setContent] = useState('');
  const [type, setType] = useState('quan 1');

  const handleTypeChange = (type) => {
    setAddressType(type);
    setSelectedDistrict(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Thực hiện lưu dữ liệu vào cơ sở dữ liệu hoặc thực hiện các xử lý khác
    console.log('Loại địa chỉ:', addressType);
  };

  return (
    <form onSubmit={handleSave}>
      <p className={classes.tilte_modal}>THÊM LOẠI HÌNH QC/HÌNH THỨC BC </p>
      <div className={classes.modal_container}>
        <div className={classes.level_wrap}>
          <p className={classes.level_wrap_title}>Thêm loại:</p>
          <div className={classes.level_wrap_container}>
            <div>
              <label className={classes.label_add} htmlFor="district-level">
                Thêm loại hình quảng cáo
              </label>
              <input
                id="district-level"
                type="radio"
                value="district"
                checked={addressType === 'district'}
                onChange={() => handleTypeChange('district')}
              />
            </div>
            <div>
              <label className={classes.label_add} htmlFor="ward-level">
                Thêm hình thức báo cáo
              </label>
              <input
                id="ward-level"
                type="radio"
                value="ward"
                checked={addressType === 'ward'}
                onChange={() => handleTypeChange('ward')}
              />
            </div>
          </div>
        </div>
        <div className={classes.content_wrap}>
          <label htmlFor="content" className={classes.title_label}>
            Thêm nội dung:
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
            Lưu
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModalAdd;

