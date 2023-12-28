import React, { useEffect, useState } from 'react';
import classes from './ModalAdd.module.scss';
import { axiosClient } from '../../../api/axios';
import Swal from 'sweetalert2';

const ModalUpdate = ({ onClose, data }) => {
  const [addressType, setAddressType] = useState(data.level === 'Quận' ? 'district' : 'ward');
  const [districtName, setDistrictName] = useState(data.level === 'Quận' ? data.area : data.district_name);
  const [selectedDistrict, setSelectedDistrict] = useState(data.level === 'Quận' ? data.id : data.district_id);
  const [wardName, setWardName] = useState(data.level === 'Phường' ? data.area : '');
  const [districts, setDistricts] = useState([]);

  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  useEffect(() => {
    axiosClient
      .get('cadre/districts', { headers })
      .then((response) => {
        setDistricts(response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setDistrictName(district);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const requestData =
      addressType === 'ward'
        ? {
            addressType,
            id: data.id,
            wardName,
            selectedDistrict: selectedDistrict,
          }
        : {
            addressType,
            id: data.id,
            districtName,
          };
    // Kiểm tra nếu là quận và tên quận không được để trống
    if (requestData.addressType === 'district' && !requestData.districtName) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng nhập tên quận.',
        timer: 1500,
      });
      return;
    }
    // Kiểm tra nếu là phường và tên phường không được để trống
    if (requestData.addressType === 'ward' && !requestData.wardName) {
      Swal.fire({
        icon: 'warning',
        title: 'Vui lòng nhập tên phường.',
        timer: 1500,
      });
      return;
    }
    try {
      const response = await axiosClient.put('/cadre/updateAddress', requestData, { headers });

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
          text: 'Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cập nhật thất bại!',
        timer: 1500,
        text: 'Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.',
      });
    }
  };

  return (
    <form onSubmit={handleSave}>
      <p className={classes.tilte_modal}>CẬP NHẬT QUẬN/PHƯỜNG </p>
      <div className={classes.modal_container}>
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
                value={districtName || ''}
                onChange={(e) => handleDistrictChange(e.target.value)}
              >
                {districts.map((district) => (
                  <option key={district.district_id} value={district.district_name}>
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

export default ModalUpdate;

