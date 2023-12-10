import React, { memo } from 'react';
import classes from './ItemSide.module.scss';
import { NavLink } from 'react-router-dom';

const ItemSide = ({ item }) => {
  console.log('first');
  return (
    <NavLink className={({ isActive }) => (isActive ? classes.active : classes.item)} to={item.path}>
      <div className={classes.item__title}>{item.title}</div>
    </NavLink>
  );
};

export default memo(ItemSide);

