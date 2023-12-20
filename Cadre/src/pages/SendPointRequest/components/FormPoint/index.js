import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classes from './Form.module.scss';
import { useParams } from 'react-router';
import request from '~/src/utils/request';

const locationOptions = ["Đất công/Công viên/Hành lang an toàn giao thông", "Đất tư nhân/Nhà ở riêng lẻ", "Trung tâm thương mại", "Chợ", "Cây xăng", "Nhà chờ xe buýt"]

const FormPoint = () => {
  const user_type = localStorage.getItem('user_type');
  const { point_id } = useParams();
  const [pointInfor, setPointInfor] = useState({})


  const tokenAuth = 'Bearer ' + JSON.stringify(localStorage.getItem('token')).split('"').join('');
  const headers = {
    Authorization: tokenAuth,
  };

  const fetchPointInfor = async () => {

    try {
      const response = await request.get(`point/get_point/${point_id}`, { headers: headers });
      setPointInfor(response.data.point);
    } catch (error) {
      console.error('Error fetching surfaces:', error);
    }
  }
  useEffect(() => {
    fetchPointInfor();
  }, [])

  const formik = useFormik({
    initialValues: {
      officer: user_type,
      requestTime: '',
      address: 'Some Address',
      imageURL: '',
      location_type: '',
      isPlanning: true,
      reason: '',
    },
    validationSchema: Yup.object({
      requestTime: Yup.string().required('Vui lòng chọn thời điểm xin chỉnh sửa'),
      reason: Yup.string().required('Vui lòng nhập lý do chỉnh sửa')
    }),
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });
  useEffect(() => {
    // Update form values when boardInfor changes
    formik.setValues({
      officer: user_type,
      requestTime: '',
      address: 'Some Address',
      imageURL: pointInfor.image_url,
      location_type: pointInfor.location_type,
      isPlanning: pointInfor.is_planning ? true : false,
      reason: '',
    });
  }, [pointInfor]);


  return (
    <form onSubmit={formik.handleSubmit}>
      <div className={classes['first-row']}>
        <label className={classes['title-input']}>
          Cán bộ:
          <select name="officer" value={formik.values.officer} readOnly>
            <option value="ward">Phường</option>
            <option value="district">Quận</option>
          </select>
        </label>
        <label className={classes['title-input']}>
          Thời điểm:
          <input type="date" name="requestTime" value={formik.values.requestTime} onChange={formik.handleChange} />
          {formik.touched.requestTime && formik.errors.requestTime ? (
            <div className={classes.error}>{formik.errors.requestTime}</div>
          ) : null}
        </label>
      </div>

      <div className={classes['second-row']}>
        <label className={classes['title-input']}>
          Địa chỉ:
          <input type="text" name="address" value={formik.values.address} readOnly />
        </label>
      </div>

      <div className={classes['third-row']}>
        <label className={classes['title-input']}>
          Hình ảnh 1:
          <input type="file" accept="image/*" name="image" onChange={(e) => formik.setFieldValue('imageURL', e.target.files[0])} />

        </label>
      </div>

      <div className={classes['fourth-row']}>
        <label className={classes['title-input']}>
          Loại vị trí:
          <select name="location_type" value={formik.values.location_type} onChange={formik.handleChange}>
            <option value="" disabled hidden>Chọn loại địa điểm</option>
            {locationOptions.map((location, index) => (
              <option key={index} value={location}>{location}</option>
            ))}
          </select>

        </label>
      </div>

      <div className={classes['fifth-row']}>
        <label className={classes['title-input']}>
          Tình trạng:
          <select name="isPlanning" value={formik.values.isPlanning} onChange={formik.handleChange}>
            <option value={true}>Đã Quy Hoạch</option>
            <option value={false}>Chưa Quy Hoạch</option>
          </select>
        </label>
      </div>

      <div className={classes['sixth-row']}>
        <label className={classes['title-input']}>
          Lý do:
          <textarea name="reason" value={formik.values.reason} onChange={formik.handleChange} />
          {formik.touched.reason && formik.errors.reason ? (
            <div className={classes.error}>{formik.errors.reason}</div>
          ) : null}
        </label>
      </div>

      <button className={classes['custom-button']} type="submit">
        Submit Form
      </button>
    </form>
  );
};

export default FormPoint;
