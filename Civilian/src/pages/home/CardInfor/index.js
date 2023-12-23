import React from 'react';

import classes from './styles.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { ic_warning, ic_infor } from '~/src/assets';
import ButtonCT from '~/src/components/button/ButtonCT';

const CardInfor = (props) => {
    return (
        <div className={classes.container__infor}>
            <div className={classes['container__infor-heading']}>
                <h3>Trụ, cụm pano {props.title}</h3>
                <p>Đồng Khởi aaaaaaaaaa- Nguyễn Du (Sở Văn hóa và Thể thao)</p>
            </div>
            <div className={classes['container__infor-content']}>
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
            </div>
            <div className={classes['container__infor-action']}>
                <div onClick={() => props.onClickShowDetail()}>
                    <ButtonCT iconLeft={ic_infor} />
                </div>
                <ButtonCT
                    content="Báo cáo vi phạm"
                    className={'borderRadius7 uppercase'}
                    iconLeft={ic_warning}
                    outlineBtn={true}
                    borderRadius={true}
                    redWarning={true}
                />
            </div>
        </div>
    );
};

export default CardInfor;
