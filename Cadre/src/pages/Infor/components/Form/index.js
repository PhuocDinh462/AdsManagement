import React, { useEffect, useRef, useState } from 'react';
import classes from './Form.module.scss';
const originalDate = "2002-01-01 00:00:00";

// Chuyển đổi sang đối tượng Date
const formatDate = (date) => {
  const dateObject = new Date(date);

  // Lấy các thành phần ngày, tháng và năm
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
  const day = String(dateObject.getDate()).padStart(2, '0');

  // Tạo chuỗi mới theo định dạng "yyyy-MM-dd"
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

const userInfo = {
  phone: "0388888888",
  dob: '2002-04-30',
  email: 'something@gmail.com',
  name: 'Nguyen Van A',
  address: '123 Dương Thị Mười',
}
const Form = (props) => {
  // Khởi tạo trạng thái cho các thông tin
  const { user, setUser } = props
  const inputPhone = useRef();
  const inputDob = useRef();
  const inputEmail = useRef();
  const inputFullName = useRef();

  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

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
      default:
        break;
    }
  };
  const handleEditState = () => {

    setEditState(false)
  }
  useEffect(() => {
    if (user) {
      inputPhone.current.value = user.phone
      inputDob.current.value = formatDate(user.dob)
      inputEmail.current.value = user.email
      inputFullName.current.value = user.username
    }
  }, [editState, user])

  useEffect(() => {

  }, [user])

  return (
    <div>

      <div className={classes['first-row']}>
        <label className={classes['title-input']}>
          Điện thoại liên lạc:
          <input type="tel" name="phone" readOnly={!editState} ref={inputPhone} onChange={handleChange} />
        </label>

        <label className={classes['title-input']}>
          Ngày sinh:
          <input type="date" name="dob" readOnly={!editState} ref={inputDob} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['second-row']}>
        <label className={classes['title-input']}>
          Email:
          <input type="email" name="email" readOnly={!editState} ref={inputEmail} onChange={handleChange} />
        </label>
      </div>

      <div className={classes['third-row']}>
        <label className={classes['title-input']}>
          Họ và Tên:
          <input type="text" name="fullName" readOnly={!editState} ref={inputFullName} onChange={handleChange} />
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
