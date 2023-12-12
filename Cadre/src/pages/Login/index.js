// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Backdrop, CircularProgress } from '@mui/material';

// 
// import classes from './Login.module.scss';
// import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import request from '../../utils/request';
import classes from './Login.module.scss';
import Images from '../../assets/images';
import Swal from 'sweetalert2';
export default function LoginPage() {

    const loginNavigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(() => {
        const storageUserState = JSON.parse(localStorage.getItem('user-state'));
        return storageUserState;
    });

    useEffect(() => {
        if (currentUser) loginNavigate('/');
    }, [currentUser]);

    async function handleSubmit(e) {
        e.preventDefault();
        // if (email && password) {
        //     const objLogin = {
        //         email: email,
        //         password: password,
        //     };

        //     setIsLoading(true);
        //     try {
        //         const response = await request.post('users/sign_in', objLogin);
        //         setLocalItem('user-state', true)
        //         setLocalObject('user', response.data.data)
        //         setLocalItem('token', response.data.data.token)
        //         setCurrentUser(true);
        //         Swal.fire({
        //             title: 'Đăng nhập thành công!',
        //             icon: 'success',
        //             confirmButtonText: 'Hoàn tất',
        //             width: '50rem',
        //         });
        //     } catch (error) {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Lỗi',
        //             text: 'Email hoặc mật khẩu của bạn không đúng!',
        //             width: '50rem',
        //         });
        //     }
        // }
        // else {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Lỗi',
        //         text: 'Vui lòng nhập đầy đủ email và mật khẩu của bạn',
        //         width: '50rem',
        //     });
        // }
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.wrapper__logo}>
                <img src={Images.logoImage} alt="none" />
            </div>
            <div className={classes.wrapper__form}>
                <h2>Đăng nhập</h2>
                <form action="/" onSubmit={handleSubmit}>
                    <p>
                        <input
                            type="text"
                            name="first__name"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </p>
                    <p>
                        <input
                            type="password"
                            name="password"
                            placeholder="Nhập mật khẩu của bạn"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <br />
                        <br />
                        <Link to="/forgot">
                            <label className="right-label">Quên mật khẩu?</label>
                        </Link>
                    </p>
                    <p>
                        <button id={classes.sub__btn} type="submit">
                            Đăng nhập
                        </button>
                    </p>
                </form>

            </div>
        </div>
    );
}
