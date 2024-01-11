import React, { useEffect, useState } from 'react';
import classes from './styles.module.scss';
import a from '~assets/imgs/tpb2_1.jpg';
import b from '~assets/imgs/robinswan.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DetailReport = (props) => {
    const [index, setIndex] = useState(0);
    const [infoDetailReport, setInfoDetailReport] = useState(props.info[index]);

    useEffect(() => {
        setIndex(0);
        setInfoDetailReport(props.info[index]);
    }, [props.info]);

    return (
        <div className={classes.container__table}>
            <div className={classes['container__table-info']}>
                {props.info && props.info.length !== 0 ? (
                    <>
                        <div className={classes['container__table-heading']}>
                            <h3>Thông tin chi tiết báo cáo</h3>
                        </div>
                        <div className={classes['container__table-info-content']}>
                            <div className={classes['container__table-info-content-detail']}>
                                {infoDetailReport && (
                                    <ul>
                                        <li>
                                            <label>Họ và tên:</label>
                                            <p>{infoDetailReport.fullname_rp}</p>
                                        </li>
                                        <li>
                                            <label>Email:</label>
                                            <p>{infoDetailReport.email_rp}</p>
                                        </li>
                                        <li>
                                            <label>Phone:</label>
                                            <p>{infoDetailReport.phone_rp}</p>
                                        </li>
                                        <li>
                                            <label>Lý do:</label>
                                            <p>{infoDetailReport.report_content}</p>
                                        </li>
                                        <li>
                                            <label>Trạng thái:</label>
                                            <p
                                                style={{
                                                    color: infoDetailReport.status === 'pending' ? 'red' : 'green',
                                                }}
                                            >
                                                {infoDetailReport.status === 'pending' ? 'Chưa xử lí' : 'Đã xử lí'}
                                            </p>
                                        </li>
                                        <li>
                                            <label>HÌnh ảnh:</label>
                                            <div>
                                                {infoDetailReport.image_url_1 && (
                                                    <img src={infoDetailReport.image_url_1} />
                                                )}
                                                {infoDetailReport.image_url_2 && (
                                                    <img src={infoDetailReport.image_url_2} />
                                                )}
                                                {!infoDetailReport.image_url_1 ||
                                                    (!infoDetailReport.image_url_2 && (
                                                        <div style={{ height: '200px', marginTop: 0 }}></div>
                                                    ))}
                                            </div>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className={classes.footer}>
                            <FontAwesomeIcon
                                style={{ display: props.info.length === 1 || index === 0 ? 'none' : 'block' }}
                                icon={faChevronLeft}
                                className={classes.ic}
                                onClick={() => {
                                    const newIndex = index - 1;
                                    setIndex(newIndex);
                                    setInfoDetailReport(props.info[newIndex]);
                                }}
                            />
                            <p
                                style={{
                                    marginLeft: index === 0 ? '21px' : '10px',
                                    marginRight: index === props.info.length - 1 ? '20px' : '10px',
                                }}
                            >
                                {' '}
                                {index + 1} / {props.info.length}{' '}
                            </p>
                            <FontAwesomeIcon
                                style={{
                                    display:
                                        props.info.length === 1 || index === props.info.length - 1 ? 'none' : 'block',
                                }}
                                icon={faChevronRight}
                                className={classes.ic}
                                onClick={() => {
                                    const newIndex = index + 1;
                                    setIndex(newIndex);
                                    setInfoDetailReport(props.info[newIndex]);
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <p style={{ textAlign: 'center' }}>Không có báo cáo cho điểm chưa quy hoạch này!</p>
                )}
            </div>
        </div>
    );
};

export default DetailReport;
