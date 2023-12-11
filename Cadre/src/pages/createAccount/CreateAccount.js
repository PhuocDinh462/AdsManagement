import React, { useState } from 'react';
import classes from './CreateAcount.module.scss';
import { logo } from '~assets/imgs/Imgs';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CreateAcount = () => {
  const [username, setUsename] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [level, setLevel] = useState('district'); // Mặc định là quận
  const [location, setLocation] = useState(''); // Quận hoặc phường tùy thuộc vào level

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
    setDistrict(''); // Reset giá trị của location khi chọn lại cấp độ
  };

  const handleWardChange = (e) => {
    setWard(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Thực hiện xử lý logic khi form được submit
    console.log('Form submitted with the following data:');
    console.log('Username:', username);
    console.log('Birthday:', birthday);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Password:', password);
    console.log('Level:', level);
    console.log('District:', district);
    console.log('Ward:', ward);
  };

  return (
    <div className={classes.container}>
      <div className={classes.container__header}>
        <p className={classes.container__header_title}>TẠO TÀI KHOẢN</p>
        <img className={classes.container__header_logo} src={logo} alt="logo" />
      </div>

      <div className={classes.container__body}>
        <form className={classes.form} onSubmit={handleSubmit}>
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
                  value={username}
                  placeholder="Nguyen Van A"
                  onChange={(e) => setUsename(e.target.value)}
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
                  value={birthday}
                  placeholder="dd/mm/yy"
                  onChange={(e) => setBirthday(e.target.value)}
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
                  value={email}
                  placeholder="example@.gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={phone}
                  placeholder="012345678"
                  onChange={(e) => setPhone(e.target.value)}
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
                    value={password}
                    placeholder="*****"
                    onChange={(e) => setPassword(e.target.value)}
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
                <select value={level} onChange={handleLevelChange}>
                  <option value="district">Quận</option>
                  <option value="ward">Phường</option>
                </select>
              </label>
              <label className={classes.wrap}>
                <p className={classes.title}>Chọn Quận:</p>
                <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="quan1">Quận 1</option>
                  <option value="quan2">Quận 2</option>
                </select>
              </label>
              {level === 'ward' && (
                <label className={classes.wrap}>
                  <p className={classes.title}>Phường:</p>
                  <select value={ward} onChange={handleWardChange}>
                    {/* Tùy thuộc vào quận hoặc phường được chọn, thêm các phường tương ứng */}
                    {district === 'quan1' && (
                      <>
                        <option value="phuongA">Phường A</option>
                        <option value="phuongB">Phường B</option>
                        {/* Thêm các phường của Quận 1 */}
                      </>
                    )}
                    {district === 'quan2' && (
                      <>
                        <option value="phuongX">Phường X</option>
                        <option value="phuongY">Phường Y</option>
                        {/* Thêm các phường của Quận 2 */}
                      </>
                    )}
                  </select>
                </label>
              )}
            </div>
          </div>
          <button className={classes.button_submit}>Đăng ký</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAcount;

