import React, { useEffect, useState } from 'react';
import classes from './ModalAdd.module.scss';
import { axiosClient } from '../../../api/axios';
import Swal from 'sweetalert2';

const ModalAdd = ({ onClose }) => {
  const [addressType, setAddressType] = useState('district');
  const [districtName, setDistrictName] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState();
  const [wardName, setWardName] = useState('');
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    axiosClient
      .get('cadre/districts')
      .then((response) => {
        setDistricts(response);
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleTypeChange = (type) => {
    setAddressType(type);
    setSelectedDistrict(null);
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      addressType,
      districtName,
      selectedDistrict,
      wardName,
    };

    // Kiểm tra nếu là quận và tên quận không được để trống
    if (data.addressType === 'district' && !data.districtName) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng nhập tên quận.',
        timer: 1500,
      });
      return;
    }

    // Kiểm tra nếu là phường và tên phường không được để trống
    if (data.addressType === 'ward' && !data.wardName) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng nhập tên phường.',
        timer: 1500,
      });
      return;
    }
    try {
      const response = await axiosClient.post('/cadre/createAddress', data);
      console.log(data);

      if (response.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Thêm thành công!',
          timer: 1500,
          showConfirmButton: false,
        });

        onClose();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Thêm thất bại!',
          timer: 1500,
          text: 'Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Thêm thất bại!',
        timer: 1500,
        text: 'Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.',
      });
    }
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
                value={selectedDistrict || ''}
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                <option value="" disabled>
                  Chọn quận
                </option>
                {districts.map((district) => (
                  <option key={district.district_id} value={district.district_id}>
                    {district.district_name}
                  </option>
                ))}
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

