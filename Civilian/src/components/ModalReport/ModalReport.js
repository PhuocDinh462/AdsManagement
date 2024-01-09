import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import upload from '~assets/imgs/upload.png';
import classes from './ModalReport.module.scss';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import axios from 'axios';
import { storage } from '~/src/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

const ModalReport = (props) => {
    const fileInputRef = useRef(null);
    const image1Ref = useRef(null);
    const image2Ref = useRef(null);
    const [indexCur, setIndexCur] = useState(1);
    const [isUploaded, setIsUploaded] = useState({ show: false, image1: null, image2: null });
    const [isCaptchaVerified, setCaptchaVerified] = useState(false);

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return year + '-' + month + '-' + day;
    };

    const formik = useFormik({
        initialValues: {
            reportContent: '',
            imageUrl1: null,
            imageUrl2: null,
            width: props.type === 'Board' ? props.info.width : null,
            height: props.type === 'Board' ? props.info.height : null,
            lat: props.location.lat,
            lng: props.location.lng,
            reportTime: formatDateToYYYYMMDD(new Date()),
            fullnameRp: '',
            emailRp: '',
            phoneRp: '',
            status: 'pending',
            point_id: props.type === 'Point' ? props.info.point_id : null,
            board_id: props.type === 'Board' ? props.info.board_id : null,
        },
        onSubmit: async (values, { resetForm }) => {
            // Kiểm tra xem có lỗi không
            const errors = {};

            if (!values.fullnameRp) {
                errors.fullnameRp = 'Họ và tên không được bỏ trống';
            }

            if (!values.emailRp) {
                errors.emailRp = 'Email không được bỏ trống';
            }

            if (!values.phoneRp) {
                errors.phoneRp = 'Số điện thoại không được bỏ trống';
            }

            if (!values.reportContent) {
                errors.reportContent = 'Lý do không được bỏ trống';
            }

            if (!values.imageUrl1 && !values.imageUrl2) {
                errors.imageUrl1 = 'Hình ảnh không được bỏ trống';
                errors.imageUrl2 = 'Hình ảnh không được bỏ trống';
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

            try {
                await axios
                    .post(`${process.env.REACT_APP_API_ENDPOINT}/civilian/report`, values)
                    .then((res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Bạn đã gửi report thành công',
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Có lỗi xảy ra',
                            text: 'Vui lòng gửi lại biểu mẫu',
                        });
                    });

                resetForm();
                setIsUploaded(false);
                setIndexCur(1);
                props.onClose();
                props.success(true);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: 'Vui lòng gửi lại biểu mẫu',
                });
                console.error(err);
            }
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
                reader1.onload = async () => {
                    if (image1Ref.current) {
                        image1Ref.current.src = reader1.result;

                        const imageRef = ref(storage, `images/${image1.name + v4()}`);

                        try {
                            // Tải ảnh lên Firebase
                            await uploadBytes(imageRef, image1);
                            // Lấy URL của ảnh
                            const imageUrl = await getDownloadURL(imageRef);
                            // Lưu URL vào state hoặc làm bất cứ điều gì bạn muốn
                            formik.setFieldValue('imageUrl1', imageUrl);
                        } catch (error) {
                            console.error('Error uploading image:', error);
                        }
                    }
                };
                reader1.readAsDataURL(image1);
            }

            if (image2) {
                const reader2 = new FileReader();
                reader2.onload = async () => {
                    if (image2Ref.current) {
                        image2Ref.current.src = reader2.result;

                        const imageRef = ref(storage, `images/${image2.name + v4()}`);

                        try {
                            // Tải ảnh lên Firebase
                            await uploadBytes(imageRef, image2);
                            // Lấy URL của ảnh
                            const imageUrl = await getDownloadURL(imageRef);
                            // Lưu URL vào state hoặc làm bất cứ điều gì bạn muốn
                            formik.setFieldValue('imageUrl2', imageUrl);
                        } catch (error) {
                            console.error('Error uploading image:', error);
                        }
                    }
                };
                reader2.readAsDataURL(image2);
            }

            formik.setFieldValue('imageUrl2', image2 ? URL.createObjectURL(image2) : '');

            setIsUploaded({ show: true, image1, image2 });
        }
    };

    return (
        <div className={classes.adding__overlay}>
            <div className={classes.adding__modal}>
                <div className={classes.adding__modal__heading}>
                    {props.type === 'Board'
                        ? 'BÁO CÁO BẢNG QUẢNG CÁO'
                        : props.type === 'Point'
                        ? 'BÁO CÁO ĐIỂM QUẢNG CÁO'
                        : 'BÁO CÁO ĐIỂM BẤT KÌ'}
                    <FontAwesomeIcon icon={faClose} className={classes['adding__modal-ic']} onClick={props.onClose} />
                </div>

                <form onSubmit={formik.handleSubmit} className={classes.adding__modal__body}>
                    {indexCur === 1 && (
                        <>
                            <h4>Họ và tên</h4>
                            <input
                                type="text"
                                placeholder="Nhập vào Họ và tên"
                                name="fullnameRp"
                                onChange={formik.handleChange}
                                value={formik.values.fullnameRp}
                            />
                            {formik.errors.fullnameRp && <p className={classes.error}>{formik.errors.fullnameRp}</p>}
                            <h4>Email</h4>
                            <input
                                type="text"
                                placeholder="Nhập vào Email"
                                name="emailRp"
                                onChange={formik.handleChange}
                                value={formik.values.emailRp}
                            />
                            {formik.errors.emailRp && <p className={classes.error}>{formik.errors.emailRp}</p>}
                            <h4>Số điện thoại</h4>
                            <input
                                type="text"
                                placeholder="Nhập vào Số điện thoại"
                                name="phoneRp"
                                onChange={formik.handleChange}
                                value={formik.values.phoneRp}
                            />
                            {formik.errors.phoneRp && <p className={classes.error}>{formik.errors.phoneRp}</p>}
                        </>
                    )}
                    {indexCur === 2 && (
                        <>
                            <div style={{ marginBottom: '20px' }}>
                                <h4>Lý do</h4>
                                <textarea
                                    placeholder="Nhập vào lý do"
                                    name="reportContent"
                                    onChange={formik.handleChange}
                                    value={formik.values.reportContent}
                                />
                                {formik.errors.reportContent && (
                                    <p className={classes.error}>{formik.errors.reportContent}</p>
                                )}
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
                                {formik.errors.imageUrl1 && <p className={classes.error}>{formik.errors.imageUrl1}</p>}
                                {formik.errors.imageUrl2 && <p className={classes.error}>{formik.errors.imageUrl2}</p>}
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
                                        <p>Chọn 2 tấm ảnh vào đây</p>
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
