import React from 'react';
import classes from './styles.module.scss';
import { ic_infor, ic_location, ic_not_planned, ic_report, ic_warning } from '~/src/assets';
import ButtonCT from '~/src/components/button/ButtonCT';

const InforTable = () => {
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
                    <h3>{isHaveInfor ? 'Trụ, cụm pano' : 'Chưa có dữ liệu'}</h3>
                    <div className={classes['container__table-info-content-detail']}>
                        {isHaveInfor ? (
                            <ul>
                                <li>
                                    <label>Kích thước:</label>
                                    <p>2.5m x 1.2m</p>
                                </li>
                                <li>
                                    <label>Số lượng:</label>
                                    <p>2.5m x 1.2m</p>
                                </li>
                                <li>
                                    <label>Hình thức:</label>
                                    <p>2.5m x 1.2m</p>
                                </li>
                                <li>
                                    <label>Phân loại:</label>
                                    <p>Đất công nghiệp/Công viên/Hành lang an toàn giao thông</p>
                                </li>
                            </ul>
                        ) : (
                            <p>Điểm này chưa có thông tin của bảng quảng cáo.</p>
                        )}
                    </div>
                    <div className={classes['container__table-info-content-action']}>
                        <ButtonCT content="2 báo cáo" iconLeft={ic_report} redWarning={true} primary={true} />
                        <ButtonCT
                            content="CHƯA QUY HOẠCH"
                            className={'uppercase'}
                            iconLeft={ic_not_planned}
                            notPlanned={true}
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
                    15, Đường Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP.HCM
                </div>
            </div>
            {!isHaveInfor && (
                <div className={classes['container__table-action']}>
                    <ButtonCT
                        content="Báo cáo vi phạm"
                        className={'borderRadius7 uppercase'}
                        iconLeft={ic_warning}
                        outlineBtn={true}
                        borderRadius={true}
                        redWarning={true}
                    />
                </div>
            )}
        </div>
    );
};

export default InforTable;
