import React, { useState } from 'react';
import ItemSide from './ItemSide/ItemSide';
import classes from './SideBars.module.scss';

const SideBars = ({ data, onPageChange }) => {
  const [selectedItemId, setSelectedItemId] = useState(1);

  const handleItemClick = (id) => {
    setSelectedItemId(id);
    onPageChange(id);
  };
  return (
    <div className={classes.sidebar}>
      <p className={classes.sidebar__title}>Quản lý</p>
      {data.map((item, index) => (
        <ItemSide key={index} item={item} isSelected={selectedItemId === item.id} onItemClick={handleItemClick} />
      ))}
    </div>
  );
};

export default SideBars;
