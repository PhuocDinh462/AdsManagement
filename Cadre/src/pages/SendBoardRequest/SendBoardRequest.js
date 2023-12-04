import React from 'react';
import { useSelector } from 'react-redux';
import classes from './SendBoardRequest.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from './components/Button';
import FormBoard from './components/FormBoard';

const SendBoardRequest = () => {
    return (
        <>
            <div>
                Header
            </div>

            <div className={classes.wrapper}>
                <div className={classes['wrapper-left']}>
                    <div className={classes['header-left']}>
                        <div className={classes['title-left']}>
                            Chỉnh sửa bảng quảng cáo
                        </div>
                    </div>
                </div>

                <div className={classes['wrapper-manage-send-request']}>
                    <div className={classes['wrapper-send-request']}>
                        <div className={classes['header-manage-send-request']}>
                            <p>Yêu cầu chỉnh sửa bảng quảng cáo</p>
                        </div>

                        <div className={classes['container-manage-send-request']}>
                            <FormBoard />
                        </div>

                        <div className={classes['footer-manage-send-request']}>

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

export default SendBoardRequest;
