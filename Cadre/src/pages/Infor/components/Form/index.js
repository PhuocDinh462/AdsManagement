import React, { useState } from 'react';
import classes from './Form.module.scss';

const Form = () => {
  // Khởi tạo trạng thái cho các thông tin
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  // Hàm xử lý khi giá trị thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật trạng thái tương ứng
    switch (name) {
      case 'phone':
        setPhone(value);
        break;
      case 'dob':
        setDob(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'fullName':
        setFullName(value);
        break;
      case 'address':
        setAddress(value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <div className={classes['first-row']}>
        <label className={classes['title-input']}>
          Điện thoại liên lạc:
          <input type="tel" name="phone" value={phone} onChange={handleChange} />
        </label>

        <label className={classes['title-input']}>
          Ngày sinh:
          <input type="date" name="dob" value={dob} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['second-row']}>
        <label className={classes['title-input']}>
          Email:
          <input type="email" name="email" value={email} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['third-row']}>
        <label className={classes['title-input']}>
          Họ và Tên:
          <input type="text" name="fullName" value={fullName} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['fourth-row']}>
        <label className={classes['title-input']}>
          Địa chỉ:
          <input type="text" name="address" value={address} onChange={handleChange} />
        </label>
      </div>
    </div>
  );
};

export default Form;
