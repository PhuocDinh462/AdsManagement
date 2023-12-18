import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Để thực hiện validation

import request from '../../utils/request';
import classes from './Login.module.scss';
import Images from '../../assets/images';
import Swal from 'sweetalert2';
import getGoogleOAuthURL from '~/src/utils/getGoogleUrl';

const LoginPage = () => {
    const loginNavigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email của bạn'),
            password: Yup.string().required('Vui lòng nhập mật khẩu của bạn'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await request.post('auth/login', values);
                localStorage.setItem('user-state', true);
                localStorage.setItem('user_id', response.data.user_id);
                localStorage.setItem('token', response.data.token);
                setSubmitting(false);

                Swal.fire({
                    title: 'Đăng nhập thành công!',
                    icon: 'success',
                    confirmButtonText: 'Hoàn tất',
                    width: '50rem',
                });

                loginNavigate('/');
            } catch (error) {
                console.log(error);
                setSubmitting(false);

                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Email hoặc mật khẩu của bạn không đúng!',
                    width: '50rem',
                });
            }
        },
    });

    return (
        <div className={classes.wrapper}>
            <div className={classes.wrapper__logo}>
                <img src={Images.logoImage} alt="none" />
            </div>
            <div className={classes.wrapper__form}>
                <h2>Đăng nhập</h2>
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
                    <p>
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu của bạn"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <div className={classes.error}>{formik.errors.password}</div>
                        )}
                        <br />
                        <br />
                        <Link to="/forgot">
                            <label className={classes['right-label']}>Quên mật khẩu?</label>
                        </Link>
                    </p>
                    <p>
                        <button id={classes.sub__btn} type="submit" disabled={formik.isSubmitting}>
                            Đăng nhập
                        </button>
                    </p>
                </form>
                <a href={getGoogleOAuthURL()}>Login with google</a>
            </div>
        </div>
    );
};

export default LoginPage;
