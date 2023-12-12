import React, { useState } from 'react';
import classes from './ModalAdd.module.scss';

const ModalAdd = ({ onClose }) => {
  const [addressType, setAddressType] = useState('district');
  const [districtName, setDistrictName] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('quan 1');
  const [wardName, setWardName] = useState('');

  const handleTypeChange = (type) => {
    setAddressType(type);
    setSelectedDistrict(null);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Thực hiện lưu dữ liệu vào cơ sở dữ liệu hoặc thực hiện các xử lý khác
    console.log('Loại địa chỉ:', addressType);
    console.log('Tên quận:', districtName);
    console.log('Quận được chọn:', selectedDistrict);
    console.log('Tên phường:', wardName);

    // Sau khi lưu xong, đóng modal
    // onClose();
  };

  return (
    <form onSubmit={handleSave}>
      <p className={classes.tilte_modal}>THÊM QUẬN/PHƯỜNG </p>
      <div className={classes.modal_container}>
        <div className={classes.level_wrap}>
          <p className={classes.level_wrap_title}>Thêm Quận / Phường:</p>
          <div className={classes.level_wrap_container}>
            <div>
              <label className={classes.label_add} htmlFor="district-level">
                Thêm Quận
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
                Thêm Phường
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

        {addressType === 'district' && (
          <div className={classes.district_wrap}>
            <label htmlFor="add-district" className={classes.title_label}>
              Tên Quận:
            </label>

            <input
              className={classes.input_area}
              id="add-district"
              type="text"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
            />
          </div>
        )}

        {addressType === 'ward' && (
          <div className={classes.ward_wrap}>
            <div className={classes.district}>
              <label htmlFor="select_district" className={classes.title_label}>
                Chọn Quận:
              </label>
              <select
                id="select_district"
                className={classes.input_area}
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                {/* Option cho danh sách quận */}
                <option value="quan1">Quận 1</option>
                <option value="quan2">Quận 2</option>
                {/* Thêm các quận khác nếu cần */}
              </select>
            </div>
            <div className={classes.ward}>
              <label htmlFor="ward" className={classes.title_label}>
                Tên Phường:
              </label>
              <input
                id="ward"
                className={classes.input_area}
                type="text"
                value={wardName}
                onChange={(e) => setWardName(e.target.value)}
              />
            </div>
          </div>
        )}

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

