import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import request from '../../utils/request';
import Images from '../../assets/images';
import classes from "./ForgotPassword.module.scss"
import Swal from 'sweetalert2';
import { Backdrop, CircularProgress } from '@mui/material';


const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const forgotNavigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            otp: '',
            confirmEmail: false, // Thêm giá trị confirmEmail vào initialValues
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email của bạn'),
            password: Yup.string().required('Vui lòng nhập mật khẩu mới của bạn'),
            otp: Yup.string().required('Vui lòng nhập mã OTP'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setSubmitting(true);

                const params = {
                    email: values.email,
                    new_password: values.password,
                    otp_verify: values.otpVerify,
                    otp: values.otp,
                };

                const res = await request.patch('auth/forgot_password', params);

                if (res.data.message === 'Incorrect OTP') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Mã OTP không đúng!',
                        width: '50rem',
                    });
                } else if (res.data.message) {
                    formik.resetForm();
                    Swal.fire({
                        title: 'Đổi mật khẩu thành công!',
                        icon: 'success',
                        confirmButtonText: 'Hoàn tất',
                        width: '50rem',
                    });
                    forgotNavigate('/login');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        // // Khi giá trị của confirmEmail thay đổi, thực hiện các hành động tương ứng
        // if (formik.values.confirmEmail) {
        //     // Thực hiện các hành động cập nhật khác nếu cần
        // }
    }, [formik.values.confirmEmail]);

    const handleSentOtp = async () => {
        try {
            formik.setSubmitting(true);
            setLoading(true)
            const res = await request.post('auth/send_otp', { email: formik.values.email });
            formik.setFieldValue('otpVerify', res.data.otpVerify);
            formik.setFieldValue('confirmEmail', true); // Cập nhật giá trị confirmEmail thành true
            Swal.fire({
                title: 'OTP đã được gửi tới email!',
                text: 'Bạn hãy điền mật khẩu và nhập mã OTP',
                icon: 'success',
                confirmButtonText: 'Hoàn tất',
                width: '50rem',
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Email của bạn không tồn tại trong hệ thống!',
                width: '50rem',
            });
        } finally {
            formik.setSubmitting(false);
            setLoading(false)

        }
    };

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.wrapper__logo}>
                    <img src={Images.logoImage} alt="none" />
                </div>
                <div className={classes.wrapper__form}>
                    <h2>Quên mật khẩu</h2>
                    <form onSubmit={formik.handleSubmit}>
                        <p>
                            <input
                                type="text"
                                name="email"
                                placeholder="Nhập email của bạn"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                                <div className={classes.error}>{formik.errors.email}</div>
                            )}
                        </p>
                        {!formik.values.confirmEmail ? (
                            <p>
                                <button
                                    type="button"
                                    value="OTP"
                                    id={classes.sub__btn}
                                    onClick={handleSentOtp}
                                    disabled={formik.isSubmitting}
                                >
                                    Gửi OTP
                                </button>
                            </p>
                        ) : (
                            <>
                                <p>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Nhập mật khẩu mới của bạn"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <div className={classes.error}>{formik.errors.password}</div>
                                    )}
                                </p>
                                <p>
                                    <input
                                        type="text"
                                        name="otp"
                                        required
                                        placeholder="Nhập mã OTP"
                                        value={formik.values.otp}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.otp && formik.errors.otp && (
                                        <div className={classes.error}>{formik.errors.otp}</div>
                                    )}
                                </p>
                                <p>
                                    <button
                                        id={classes.sub__btn}
                                        type="submit"
                                        disabled={formik.isSubmitting}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </p>
                            </>
                        )}
                    </form>
                    <footer>
                        <p>
                            <Link to="/login">Trở lại đăng nhập</Link>
                        </p>
                    </footer>
                </div>

            </div>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default ForgotPassword;
