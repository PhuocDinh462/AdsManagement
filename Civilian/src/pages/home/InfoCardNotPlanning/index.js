import React from 'react';
import classes from './styles.module.scss';
import { ic_warning, ic_report } from '~/src/assets';
import ic_info from '../../../assets/imgs/ic_info.png';
import ButtonCT from '~/src/components/button/ButtonCT';

const InfoCardNotPlanning = (props) => {
    return (
        <div className={classes.container__infor}>
            <div className={classes['container__infor-heading']}>
                <h3>Thông tin điểm quảng cáo</h3>
            </div>
            <div className={classes['container__infor-content']}>
                <ul>
                    <li>
                        <label>Địa điểm:</label>
                        <p>{props.info.address}</p>
                    </li>
                    <li>
                        <label>Hình thức:</label>
                        <p>{props.info.advertisement_type_name}</p>
                    </li>
                    <li>
                        <label>Phân loại:</label>
                        <p>{props.info.location_type}</p>
                    </li>
                    <li>
                        <label>Trạng thái:</label>
                        <p style={{ fontWeight: 500, color: '#0a6971' }}>CHƯA QUY HOẠCH</p>
                    </li>
                </ul>
            </div>
            <div className={classes['container__infor-action']}>
                <ButtonCT
                    content={`${props.info.list_report && props.info.list_report.length} báo cáo`}
                    iconLeft={ic_report}
                    redWarning={true}
                    primary={true}
                    onClick={() => props.onClickShowDetailReportPoint()}
                    disabled={props.info.list_report && props.info.list_report.length === 0 ? true : false}
                />
                <ButtonCT
                    content="Báo cáo vi phạm"
                    className={'borderRadius7 uppercase'}
                    iconLeft={ic_warning}
                    outlineBtn={true}
                    borderRadius={true}
                    redWarning={true}
                    onClick={() => props.onClickShowReport()}
                />
            </div>
        </div>
    );
};

export default InfoCardNotPlanning;
