import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { axiosClient } from '~/src/api/axios';
import { selectUser } from '~/src/store/reducers';
import setLocalStorageFromCookie from '~/src/utils/setLocalStorageFromCookie';
import classes from './CreateAcount.module.scss';

const CreateAcount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [level, setLevel] = useState('district'); // Mặc định là quận

  const [listDictrict, setListDictrict] = useState([]);
  const [listWard, setListWard] = useState([]);

  const user = useSelector(selectUser);
  const tokenAuth = 'Bearer ' + user.token.split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);

    if (e.target.value === 'ward') fetchDataDistrictWithWardEmpty();
    else fetchDataDistrict();
    setDistrict(''); // Reset giá trị của location khi chọn lại cấp độ
  };

  const handleDistrictChange = async (e) => {
    setDistrict(e.target.value);

    if (level === 'ward' && e.target.value !== '') {
      fetchDataWard(e.target.value);
    }
  };

  const handleWardChange = (e) => {
    setWard(e.target.value);
  };

  const onSubmit = (dataInput) => {
    console.log(dataInput);
    if (hasEmptyStringValues(dataInput)) {
      notiError('Thông tin không hợp lệ!', 'Thông tin của quản lý chưa đầy đủ');
      return;
    } else if (district === '') {
      notiError('Thông tin không hợp lệ!', 'Bạn chưa chọn quận cho người quản lý');
      return;
    }

    let dataRequest = { ...dataInput, officer_id: district };

    if (level === 'ward') {
      if (ward === '') {
        notiError('Thông tin không hợp lệ!', 'Bạn chưa chọn phường cho người quản lý');
        return;
      }
      dataRequest = { ...dataRequest, officer_id: ward };
    }

    // Thực hiện xử lý logic khi form được submit
    fecthDataCreateAccount(dataRequest);
  };

  function hasEmptyStringValues(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] === 'string' && obj[key].trim() === '') {
        return true; // Nếu có chuỗi rỗng, trả về true
      }
    }
    return false; // Nếu không có chuỗi rỗng, trả về false
  }

  const notiError = (title, content) => {
    Swal.fire({
      icon: 'error',
      title: `${title}`,
      text: `${content}`,
    });
  };

  const notiSuccess = (title) => {
    Swal.fire({
      position: 'top-middle',
      icon: 'success',
      title: `${title}`,
      showConfirmButton: false,
      timer: 1500,
    });
  };
  const fecthDataCreateAccount = async (data) => {
    try {
      await axiosClient.post('/cadre/auth/create', data, { headers });
      reset();
      notiSuccess('Đăng ký tài khoản thành công!');
    } catch (err) {
      notiError('Lỗi đăng ký!', 'Thông tin cung cấp chưa chính xác');
      console.log(err);
    }
  };

  const fetchDataWard = async (ward_id) => {
    const response = await axiosClient.get(`/cadre/wards/district/${ward_id}`, { headers });
    setListWard(response.data);
  };

  const fetchDataDistrict = async () => {
    const response = await axiosClient.get('/cadre/districts/empty', { headers });
    setListDictrict(response.data);
  };

  const fetchDataDistrictWithWardEmpty = async () => {
    const response = await axiosClient.get('/cadre/districts/ward-empty', { headers });
    setListDictrict(response.data);
  };

  useEffect(() => {
    setLocalStorageFromCookie('user-state');
    setLocalStorageFromCookie('user_type');
    setLocalStorageFromCookie('user_id');
    setLocalStorageFromCookie('token');
    fetchDataDistrict();
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.container__header}>
        <p className={classes.container__header_title}>TẠO TÀI KHOẢN</p>
      </div>

      <div className={classes.container__body}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.wrap_form}>
            <div className={classes.container__body_left}>
              <div className={classes.form_input}>
                <label className={classes.input_label} htmlFor="name">
                  Họ tên người dùng:
                </label>
                <input
                  id="name"
                  className={classes.input_area}
                  type="text"
                  placeholder="Nguyen Van A"
                  {...register('username')}
                />
              </div>

              <div className={classes.form_input}>
                <label className={classes.input_label} htmlFor="birthday">
                  Ngày tháng năm sinh:
                </label>
                <input
                  id="birthday"
                  className={classes.input_area}
                  type="text"
                  placeholder="yyyy-mm-dd"
                  {...register('dob')}
                />
              </div>

              <div className={classes.form_input}>
                <label className={classes.input_label} htmlFor="email">
                  Email:
                </label>
                <input
                  id="email"
                  className={classes.input_area}
                  type="text"
                  placeholder="example@.gmail.com"
                  {...register('email')}
                />
              </div>

              <div className={classes.form_input}>
                <label className={classes.input_label} htmlFor="phone">
                  Số điện thoại:
                </label>
                <input
                  id="phone"
                  className={classes.input_area}
                  type="text"
                  placeholder="012345678"
                  {...register('phone')}
                />
              </div>

              <div className={classes.form_input}>
                <label className={classes.input_label} htmlFor="pass">
                  Mật khẩu:
                </label>
                <div className={classes.wrap_pass}>
                  <input
                    id="pass"
                    className={classes.input_pass}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="*****"
                    {...register('password')}
                  />
                  <FontAwesomeIcon
                    className={classes.icon_show}
                    onClick={toggleShowPassword}
                    icon={showPassword ? faEyeSlash : faEye}
                  />
                </div>
              </div>
            </div>
            <div className={classes.container__body_right}>
              <label className={classes.wrap}>
                <p className={classes.title}>Cấp độ quản lý:</p>
                <select {...register('user_type')} value={level} onChange={handleLevelChange}>
                  <option value="district">Quận</option>
                  <option value="ward">Phường</option>
                </select>
              </label>
              <label className={classes.wrap}>
                <p className={classes.title}>Chọn Quận:</p>
                <select defaultValue="" value={district} onChange={handleDistrictChange}>
                  <option value="">Trống</option>
                  {listDictrict.map((item) => {
                    return (
                      <option key={item.district_id} value={item.district_id}>
                        {item.district_name}
                      </option>
                    );
                  })}
                </select>
              </label>
              {level === 'ward' && (
                <label className={classes.wrap}>
                  <p className={classes.title}>Phường:</p>
                  <select defaultValue="" value={ward} onChange={handleWardChange}>
                    {/* Tùy thuộc vào quận hoặc phường được chọn, thêm các phường tương ứng */}
                    <option value="">Trống</option>

                    {listWard.map((item) => {
                      return (
                        <option key={item.ward_id} value={item.ward_id}>
                          {item.ward_name}
                        </option>
                      );
                    })}
                  </select>
                </label>
              )}
            </div>
          </div>
          <button type="submit" className={classes.button_submit}>
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAcount;
