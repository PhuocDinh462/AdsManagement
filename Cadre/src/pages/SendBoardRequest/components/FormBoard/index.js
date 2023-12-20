import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import classes from './Form.module.scss';
import localStorage from 'redux-persist/es/storage';

const boardOptions = ["Cổ động chính trị", "Quảng cáo thương mại", "Xã hội hoá"];

const FormBoard = () => {
  const user_type = localStorage.getItem('user_type');

  const formik = useFormik({
    initialValues: {
      officer: user_type,
      requestTime: '',
      address: 'Some Address',
      boardType: '',
      imageURL: null,
      width: '',
      height: '',
      content: '',
      reason: '',
    },
    validationSchema: Yup.object({
      requestTime: Yup.string().required('Thời điểm là bắt buộc'),
      boardType: Yup.string().required('Hình thức quảng cáo là bắt buộc'),
      width: Yup.number()
        .typeError('Vui lòng nhập một số')
        .required('Vui lòng nhập kích thước phù hợp')
        .min(0, 'Vui lòng nhập một số lớn hơn 0'),
      height: Yup.number()
        .typeError('Vui lòng nhập một số')
        .required('Vui lòng nhập kích thước phù hợp')
        .min(0, 'Vui lòng nhập một số lớn hơn 0'),
      content: Yup.string().required('Nội dung không được để trống'),
      reason: Yup.string().required('Vui lòng nhập lý do'),
      // Add more validation rules as needed
    }),
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    formik.setFieldValue('imageURL', selectedFile);
  };

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
          <input type="text" name="address" value={formik.values.address} />
        </label>
      </div>

      <div className={classes['third-row']}>
        <label className={classes['title-input']}>
          Hình thức quảng cáo:
          <select name="boardType" value={formik.values.boardType} onChange={formik.handleChange}>
            {boardOptions.map((board, index) => (
              <option key={index} value={board}>
                {board}
              </option>
            ))}
          </select>
          {formik.touched.boardType && formik.errors.boardType ? (
            <div className={classes.error}>{formik.errors.boardType}</div>
          ) : null}
        </label>

        <label className={classes['title-input']}>
          Hình ảnh :
          <input type="file" accept="image/*" name="imageURL" onChange={handleFileChange} />
        </label>
      </div>

      <div className={classes['fourth-row']}>
        <label className={classes['title-input']}>
          Chiều rộng:
          <input type="number" step={0.01} name="width" value={formik.values.width} onChange={formik.handleChange} />
          {formik.touched.width && formik.errors.width ? (
            <div className={classes.error}>{formik.errors.width}</div>
          ) : null}
        </label>
        <label className={classes['title-input']}>
          Chiều cao:
          <input type="number" step={0.01} name="height" value={formik.values.height} onChange={formik.handleChange} />
          {formik.touched.height && formik.errors.height ? (
            <div className={classes.error}>{formik.errors.height}</div>
          ) : null}
        </label>
      </div>

      <div className={classes['sixth-row']}>
        <label className={classes['title-input']}>
          Nội dung:
          <textarea name="content" value={formik.values.content} onChange={formik.handleChange} />
          {formik.touched.content && formik.errors.content ? (
            <div className={classes.error}>{formik.errors.content}</div>
          ) : null}
        </label>
      </div>

      <div className={classes['seventh-row']}>
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

export default FormBoard;
