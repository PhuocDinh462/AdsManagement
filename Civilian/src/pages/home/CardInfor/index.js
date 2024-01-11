import React from 'react';
import classes from './styles.module.scss';
import { ic_warning } from '~/src/assets';
import ic_info from '../../../assets/imgs/ic_info.png';
import ButtonCT from '~/src/components/button/ButtonCT';

const CardInfor = (props) => {
    return (
        <div className={classes.container__infor}>
            <div className={classes['container__infor-heading']}>
                <h3>{props.info.infoBoard.advertisement_content}</h3>
                <p>
                    {props.info.infoPoint.ward_name} - {props.info.infoPoint.district_name}
                </p>
            </div>
            <div className={classes['container__infor-content']}>
                <ul>
                    <li>
                        <label>Kích thước:</label>
                        <p>
                            {props.info.infoBoard.width}m x {props.info.infoBoard.height}m
                        </p>
                    </li>
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
            <div className={classes['container__infor-action']}>
                <div onClick={() => props.onClickShowDetail()}>
                    <ButtonCT iconLeft={ic_info} />
                </div>
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

export default CardInfor;
