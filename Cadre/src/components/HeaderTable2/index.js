import React from 'react';
import classes from './style.module.scss';
import ButtonCT from '../button/ButtonCT';
import { ic_add } from '~/src/assets';

const HeaderTable2 = () => {
  return (
    <div className={classes.container__header}>
      <div className={classes['container__header-title']}>
        <h3>Danh sách các loại hình</h3>
      </div>

      <div className={classes['container__header-action']}>
        <ButtonCT iconLeft={ic_add} content={'Thêm'} medium primary borderRadius outlineBtn />
      </div>
    </div>
  );
};

export default HeaderTable2;
