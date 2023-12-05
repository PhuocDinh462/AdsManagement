import React from 'react';
import classes from './ItemSide.module.scss';

const ItemSide = ({ item, isSelected, onItemClick }) => {
  return (
    <div className={`${classes.item} ${isSelected ? classes.selectedItem : ''}`} onClick={() => onItemClick(item.id)}>
      <div className={classes.item__title}>{item.title}</div>
    </div>
  );
};

export default ItemSide;
