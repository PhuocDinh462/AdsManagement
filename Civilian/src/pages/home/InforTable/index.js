import React from 'react';
import classes from './styles.module.scss';
import { ic_infor, ic_location, ic_not_planned, ic_report, ic_warning } from '~/src/assets';
import ButtonCT from '~/src/components/button/ButtonCT';

const InforTable = (props) => {
    // When table have the infomation
    const isHaveInfor = true;

    return (
        <div className={classes.container__table}>
            <div className={classes['container__table-info']}>
                <div className={classes['container__table-heading']}>
                    <div className={classes['container__table-heading-icon']}>
                        <img src={ic_infor} alt="none" />
                    </div>
                    <h3>Thông tin bảng quảng cáo</h3>
                </div>
                <div className={classes['container__table-info-content']}>
                    <h3>{props.info.infoBoard.advertisement_content}</h3>
                    <div className={classes['container__table-info-content-detail']}>
                        <ul>
                            <li>
                                <label>Kích thước:</label>
                                <p>
                                    {props.info.infoBoard.width}m x {props.info.infoBoard.height}m
                                </p>
                            </li>
                            {/* <li>
                                    <label>Số lượng:</label>
                                    <p>2.5m x 1.2m</p>
                                </li> */}
                            <li>
                                <label>Hình thức:</label>
                                <p>{props.info.infoPoint.advertisement_type_name}</p>
                            </li>
                            <li>
                                <label>Phân loại:</label>
                                <p>{props.info.infoPoint.location_type}</p>
                            </li>
                        </ul>
                    </div>
                    <div className={classes['container__table-info-content-action']}>
                        <ButtonCT
                            content={`${props.info.infoBoard.list_report_board.length} báo cáo`}
                            iconLeft={ic_report}
                            redWarning={true}
                            primary={true}
                        />
                    </div>
                </div>
            </div>
            <div className={classes['container__table-address']}>
                <div className={classes['container__table-heading']}>
                    <div className={classes['container__table-heading-icon']}>
                        <img src={ic_location} alt="none" />
                    </div>
                    <h3>Thông tin địa điểm</h3>
                </div>
                <div className={classes['container__table-address-content']}>
                    {props.info.infoPoint.ward_name}, {props.info.infoPoint.district_name}
                </div>
            </div>
            <div className={classes['container__table-action']}>
                <ButtonCT
                    content={`${props.info.infoPoint.list_report.length} báo cáo`}
                    iconLeft={ic_report}
                    redWarning={true}
                    primary={true}
                />

                {props.info.infoPoint.is_planning === 1 ? (
                    <ButtonCT content="ĐÃ QUY HOẠCH" className={'uppercase'} notPlanned={true} primary={true} />
                ) : (
                    <ButtonCT
                        content="CHƯA QUY HOẠCH"
                        className={'uppercase'}
                        iconLeft={ic_not_planned}
                        notPlanned={true}
                        primary={true}
                    />
                )}
            </div>
        </div>
    );
};

export default InforTable;
