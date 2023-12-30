import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import upload from '~assets/imgs/upload.png';
import classes from './ModalReport.module.scss';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';

const ModalReport = (props) => {
    const fileInputRef = useRef(null);
    const image1Ref = useRef(null);
    const image2Ref = useRef(null);
    const [indexCur, setIndexCur] = useState(1);
    const [isUploaded, setIsUploaded] = useState({ show: false, image1: null, image2: null });
    const [isCaptchaVerified, setCaptchaVerified] = useState(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            reason: '',
            image_url_1: null,
            image_url_2: null,
        },
        onSubmit: async (values) => {
            // Kiểm tra xem có lỗi không
            const errors = {};

            if (!values.fullName) {
                errors.fullName = 'Họ và tên không được bỏ trống';
            }

            if (!values.email) {
                errors.email = 'Email không được bỏ trống';
            }

            if (!values.phoneNumber) {
                errors.phoneNumber = 'Số điện thoại không được bỏ trống';
            }

            if (!values.reason) {
                errors.reason = 'Lý do không được bỏ trống';
            }

            if (!values.image_url_1 && !values.image_url_2) {
                errors.image_url_1 = 'Hình ảnh không được bỏ trống';
                errors.image_url_2 = 'Hình ảnh không được bỏ trống';
            }

            // Hiển thị thông báo lỗi nếu có
            if (Object.keys(errors).length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: 'Vui lòng điền đầy đủ thông tin',
                });
                return;
            }

            // Kiểm tra xem ReCAPTCHA đã được xác nhận chưa
            if (!isCaptchaVerified) {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: 'Vui lòng xác nhận ReCAPTCHA',
                });
                return;
            }

            // Nếu không có lỗi, thực hiện logic gửi form
            console.log('Form submitted with values:', values);
        },
    });

    const handleSelectImage = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;

        if (files.length >= 2) {
            // Lấy hai tấm ảnh đầu tiên từ files
            const image1 = files[0];
            const image2 = files[1];

            // Hiển thị ảnh trên giao diện (tùy thuộc vào yêu cầu của bạn)
            if (image1) {
                const reader1 = new FileReader();
                reader1.onload = () => {
                    if (image1Ref.current) {
                        image1Ref.current.src = reader1.result;
                    }
                };
                reader1.readAsDataURL(image1);
            }

            if (image2) {
                const reader2 = new FileReader();
                reader2.onload = () => {
                    if (image2Ref.current) {
                        image2Ref.current.src = reader2.result;
                    }
                };
                reader2.readAsDataURL(image2);
            }

            formik.setFieldValue('image_url_1', image1 ? URL.createObjectURL(image1) : '');
            formik.setFieldValue('image_url_2', image2 ? URL.createObjectURL(image2) : '');

            setIsUploaded({ show: true, image1, image2 });
        }
    };

    return (
        <div className={classes.adding__overlay}>
            <div className={classes.adding__modal}>
                <div className={classes.adding__modal__heading}>
                    {props.title === 'Table' ? 'BÁO CÁO BẢNG QUẢNG CÁO' : 'BÁO CÁO ĐIỂM QUẢNG CÁO'}
                    <FontAwesomeIcon icon={faClose} className={classes['adding__modal-ic']} onClick={props.onClose} />
                </div>

                <form onSubmit={formik.handleSubmit} className={classes.adding__modal__body}>
                    {indexCur === 1 && (
                        <>
                            <h4>Họ và tên</h4>
                            <input
                                type="text"
                                placeholder="Nhập vào Họ và tên"
                                name="fullName"
                                onChange={formik.handleChange}
                                value={formik.values.fullName}
                            />
                            {formik.errors.fullName && <p className={classes.error}>{formik.errors.fullName}</p>}
                            <h4>Email</h4>
                            <input
                                type="text"
                                placeholder="Nhập vào Email"
                                name="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                            {formik.errors.email && <p className={classes.error}>{formik.errors.email}</p>}
                            <h4>Số điện thoại</h4>
                            <input
                                type="text"
                                placeholder="Nhập vào Số điện thoại"
                                name="phoneNumber"
                                onChange={formik.handleChange}
                                value={formik.values.phoneNumber}
                            />
                            {formik.errors.phoneNumber && <p className={classes.error}>{formik.errors.phoneNumber}</p>}
                        </>
                    )}
                    {indexCur === 2 && (
                        <>
                            <div style={{ marginBottom: '20px' }}>
                                <h4>Lý do</h4>
                                <textarea
                                    placeholder="Nhập vào lý do"
                                    name="reason"
                                    onChange={formik.handleChange}
                                    value={formik.values.reason}
                                />
                                {formik.errors.reason && <p className={classes.error}>{formik.errors.reason}</p>}
                                <h4>Hình ảnh</h4>
                                <input
                                    type="file"
                                    id="image"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                {/* Hiển thị lỗi cho trường ảnh */}
                                {formik.errors.image_url_1 && (
                                    <p className={classes.error}>{formik.errors.image_url_1}</p>
                                )}
                                {formik.errors.image_url_2 && (
                                    <p className={classes.error}>{formik.errors.image_url_2}</p>
                                )}
                                {/* Add image upload logic here */}
                                {isUploaded.show ? (
                                    <>
                                        <div className={classes.uploaded}>
                                            <div className={classes.uploaded__content}>
                                                <div>
                                                    <img
                                                        src={
                                                            isUploaded.image1
                                                                ? URL.createObjectURL(isUploaded.image1)
                                                                : ''
                                                        }
                                                        ref={image1Ref}
                                                        alt="Image 1"
                                                    />
                                                </div>
                                                <p>{isUploaded.image1.name}</p>
                                            </div>
                                        </div>
                                        <div className={classes.uploaded}>
                                            <div className={classes.uploaded__content}>
                                                <div>
                                                    <img
                                                        src={
                                                            isUploaded.image2
                                                                ? URL.createObjectURL(isUploaded.image2)
                                                                : ''
                                                        }
                                                        ref={image2Ref}
                                                        alt="Image 2"
                                                    />
                                                </div>
                                                <p>{isUploaded.image2.name}</p>
                                            </div>
                                        </div>
                                        <div className={classes.reselect} onClick={handleSelectImage}>
                                            Chọn lại
                                        </div>
                                    </>
                                ) : (
                                    <div className={classes.upload} onClick={handleSelectImage}>
                                        <div>
                                            <img src={upload} />
                                        </div>
                                        <p>Chọn file hoặc kéo vào đây</p>
                                    </div>
                                )}
                            </div>

                            <ReCAPTCHA
                                sitekey="6LeV9TopAAAAAGWM6Cgfb1Ddf9kOUcM0B55Oqjt2"
                                onChange={(value) => {
                                    formik.setFieldValue('recaptcha', value);
                                    setCaptchaVerified(true);
                                }}
                            />
                        </>
                    )}

                    <div className={classes.adding__modal__line}>
                        {[1, 2].map((index) => (
                            <div
                                key={index}
                                className={classes['modal__line-item']}
                                style={{
                                    backgroundColor: index === indexCur ? '#0A6971' : '',
                                }}
                            />
                        ))}
                    </div>
                    <div className={classes.adding__modal__buttons}>
                        {indexCur === 1 && <button onClick={props.onClose}>Hủy</button>}
                        {indexCur === 2 && (
                            <button
                                onClick={() => {
                                    setIndexCur(1);
                                    console.log(isUploaded);
                                }}
                            >
                                Quay lại
                            </button>
                        )}
                        {indexCur === 1 && (
                            <button
                                onClick={() => {
                                    setIndexCur(2);
                                }}
                            >
                                Tiếp tục
                            </button>
                        )}
                        {indexCur === 2 && <button type="Submit">Thêm</button>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalReport;
