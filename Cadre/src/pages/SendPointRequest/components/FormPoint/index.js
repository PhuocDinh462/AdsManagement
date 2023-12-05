import React, { useState } from 'react';
import classes from './Form.module.scss';

const Form = () => {
  const [officer, setOfficer] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [location, setLocation] = useState('');
  const [positionType, setPositionType] = useState(null);
  const [status, setStatus] = useState('');
  const [regionType, setRegionType] = useState('');
  const [reason, setReason] = useState('');



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
          Khu vực:
          <select name="regionType" value={regionType} onChange={(e) => setRegionType(e.target.value)}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </label>
      </div>

      <div className={classes['fourth-row']}>
        <label className={classes['title-input']}>
          Loại địa điểm:
          <select name="positionType" value={positionType} onChange={(e) => setPositionType(e.target.value)}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </label>
      </div>

      <div className={classes['fifth-row']}>
        <label className={classes['title-input']}>
          Tình trạng:
          <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </select>
        </label>

      </div>

      <div className={classes['sixth-row']}>
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
