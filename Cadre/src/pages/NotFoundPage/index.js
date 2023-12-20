import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Để thực hiện validation

import request from '../../utils/request';
import classes from './NotFound.module.scss';
import Images from '../../assets/images';
import Swal from 'sweetalert2';
import getGoogleOAuthURL from '~/src/utils/getGoogleUrl';

const NotFoundPage = () => {

    return (
        <div className={classes['error-container']}>
            <div className={classes["error-message"]}>
                <h1 className={classes.status}>404</h1>
                <p className={classes.response}>Not Found</p>
                <p className={classes.message}>Sorry, Can Not Found This User In System</p>
            </div>
        </div>
    );
};

export default NotFoundPage;
