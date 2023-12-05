import React, { useState } from 'react';
import classes from './Form.module.scss';

const Form = () => {
  const [officer, setOfficer] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [size, setSize] = useState('');
  const [advertisementType, setAdvertisementType] = useState('');
  const [regionType, setRegionType] = useState('');
  const [content, setContent] = useState('');
  const [reason, setReason] = useState('');

  const handleFileChange = (e) => {
    // Xử lý khi người dùng chọn file hình ảnh
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };

  const handleSubmit = () => {
    // Xử lý nộp form - bạn có thể thực hiện các hành động cần thiết ở đây
    console.log("Form submitted:", {
      officer,
      timestamp,
      location,
      image,
      size,
      advertisementType,
      regionType,
      content,
      reason,
    });
  };

  return (
    <div>
      <div className={classes['first-row']}>
        <label className={classes['title-input']}>
          Cán bộ:
          <select name="officer" value={officer} onChange={(e) => setOfficer(e.target.value)}>
            <option value="phuong">Phường</option>
            <option value="quan">Quận</option>
          </select>
        </label>

        {/* <label className={classes['title-input']}>
                    Thời điểm:
                    <input type="datetime-local" name="timestamp" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
                </label> */}
        <label className={classes['title-input']}>
          Thời điểm:
          <input type="date" name="timestamp" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
        </label>
      </div>

      <div className={classes['second-row']}>
        <label className={classes['title-input']}>
          Địa chỉ:
          <input type="text" name="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
      </div>

      <div className={classes['third-row']}>
        <label className={classes['title-input']}>
          Hình ảnh 1:
          <input type="file" accept="image/*" name="image" onChange={handleFileChange} />
        </label>

        <label className={classes['title-input']}>
          Hình ảnh 2:
          <input type="file" accept="image/*" name="image" onChange={handleFileChange} />
        </label>
      </div>

      <div className={classes['fourth-row']}>
        <label className={classes['title-input']}>
          Kích thước:
          <input type="text" name="size" value={size} onChange={(e) => setSize(e.target.value)} />
        </label>
        <label className={classes['title-input']}>
          Hình thức quảng cáo:
          <select name="advertisementType" value={advertisementType} onChange={(e) => setAdvertisementType(e.target.value)}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </label>
      </div>

      <div className={classes['fifth-row']}>
        <label className={classes['title-input']}>
          Khu vực:
          <select name="regionType" value={regionType} onChange={(e) => setRegionType(e.target.value)}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </label>
      </div>

      <div className={classes['sixth-row']}>
        <label className={classes['title-input']}>
          Nội dung:
          <textarea name="content" value={content} onChange={(e) => setContent(e.target.value)} />
        </label>
      </div>

      <div className={classes['seventh-row']}>
        <label className={classes['title-input']}>
          Lý do:
          <textarea name="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
      </div>

      {/* Nút Submit Form */}
      <button className={classes['custom-button']} type="button" onClick={handleSubmit}>Submit Form</button>
    </div>
  );
};

export default Form;
