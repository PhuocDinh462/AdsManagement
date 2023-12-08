import React, { useEffect, useRef, useState } from 'react';
import classes from './Form.module.scss';

const userInfor = {
  phone: "0388888888",
  dob: '2002-04-30',
  email: 'something@gmail.com',
  name: 'Nguyen Van A',
  address: '123 Dương Thị Mười',
}
const Form = () => {
  // Khởi tạo trạng thái cho các thông tin
  const inputPhone = useRef();
  const inputDob = useRef();
  const inputEmail = useRef();
  const inputFullName = useRef();
  const inputAddress = useRef();

  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');

  const [editState, setEditState] = useState(false);

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
  const handleEditState = () => {

    setEditState(false)
  }
  useEffect(() => {
    inputPhone.current.value = userInfor.phone
    inputDob.current.value = userInfor.dob
    inputEmail.current.value = userInfor.email
    inputFullName.current.value = userInfor.name
    inputAddress.current.value = userInfor.address

    setPhone(userInfor.phone)
    setDob(userInfor.dob)
    setEmail(userInfor.email)
    setFullName(userInfor.name)
    setAddress(userInfor.address)
  }, [editState])

  return (
    <div>
      <div className={classes['first-row']}>
        <label className={classes['title-input']}>
          Điện thoại liên lạc:
          <input type="tel" name="phone" readOnly={!editState} ref={inputPhone} value={phone} onChange={handleChange} />
        </label>

        <label className={classes['title-input']}>
          Ngày sinh:
          <input type="date" name="dob" readOnly={!editState} ref={inputDob} value={dob} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['second-row']}>
        <label className={classes['title-input']}>
          Email:
          <input type="email" name="email" readOnly={!editState} ref={inputEmail} value={email} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['third-row']}>
        <label className={classes['title-input']}>
          Họ và Tên:
          <input type="text" name="fullName" readOnly={!editState} ref={inputFullName} value={fullName} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['fourth-row']}>
        <label className={classes['title-input']}>
          Địa chỉ:
          <input type="text" name="address" readOnly={!editState} ref={inputAddress} value={address} onChange={handleChange} />
        </label>
      </div>
      {editState ? (
        <div className={classes['wrapper-handle']}>
          <button className={classes['cancel-button']} type="button" onClick={() => setEditState(false)}>Huỷ</button>
          <button className={classes['update-button']} type="button" onClick={handleEditState}>Cập nhật</button>

        </div>

      ) : (
        <button className={classes['custom-button']} type="button" onClick={() => setEditState(true)}>Chỉnh sửa</button>
      )}

    </div>
  );
};

export default Form;
