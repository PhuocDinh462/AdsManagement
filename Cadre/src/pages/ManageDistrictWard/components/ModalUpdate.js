import React, { useEffect, useState } from 'react';
import classes from './ModalAdd.module.scss';
import Swal from 'sweetalert2';
import useAxiosPrivate from '~/src/hook/useAxiosPrivate';

const ModalUpdate = ({ onClose, data, filteredData }) => {
  const axiosPrivate = useAxiosPrivate();
  const [addressType, setAddressType] = useState(filteredData === 'Quận' ? 'district' : 'ward');

  const [districtName, setDistrictName] = useState(data.district_name);
  const [wardName, setWardName] = useState(data.ward_name);

  const [selectedDistrict, setSelectedDistrict] = useState(filteredData === 'Quận' ? data.id : data.district_id);
  const [districts, setDistricts] = useState([]);
  const [selectedManager, setSelectedManager] = useState(data.manager_id);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosPrivate
      .get('cadre/districts')
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axiosPrivate
      .get('cadre/usersWithoutMgmt')
      .then((response) => {
        const newData = {
          user_id: data.manager_id,
          username: filteredData === 'Quận' ? data.district_manager_username : data.ward_manager_username,
        };

        setUsers([...response.data, newData]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
    setDistrictName(district);
  };

  const handleUserChange = (user) => {
    setSelectedManager(user);
  };

  const handleUserChangeDistrict = (user) => {
    setSelectedManager(user);
    // setUserNameDistrict(user);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const requestData =
      addressType === 'ward'
        ? {
            addressType,
            id: data.ward_id,
            user_id: selectedManager,
            wardName,
            selectedDistrict: selectedDistrict,
          }
        : {
            addressType,
            id: data.district_id,
            user_id: selectedManager,
            districtName,
          };
    console.log(requestData);
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
      const response = await axiosPrivate.patch('/cadre/updateAddress', requestData);

      if (response.data.status === 'success') {
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

            <label htmlFor="select_user" className={classes.title_label}>
              Chọn người quản lý:
            </label>
            <select
              id="select_user"
              className={classes.input_area}
              value={selectedManager || ''}
              onChange={(e) => handleUserChangeDistrict(e.target.value)}
            >
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.username}
                </option>
              ))}
            </select>
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
                {districts.map((district) => (
                  <option key={district.district_id} value={district.district_id}>
                    {district.district_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.district}>
              <label htmlFor="select_user" className={classes.title_label}>
                Chọn người quản lý:
              </label>

              <select
                id="select_user"
                className={classes.input_area}
                value={selectedManager || ''}
                onChange={(e) => handleUserChange(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.username}
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

