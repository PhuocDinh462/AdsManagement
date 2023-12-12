import React, { useState } from 'react';
import classes from './HeaderTable.module.scss';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalAdd from '~/src/pages/ManageDistrictWard/components/ModalAdd';

const HeaderTable = ({ title }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  return (
    <div className={classes.header}>
      <p className={classes.header__title}>{title}</p>
      <div className={classes.header__buttonAdd} onClick={handleAddClick}>
        <FontAwesomeIcon icon={faPlus} />
        <p className={classes.add}>Thêm</p>

        {/* Hiển thị modal khi isModalOpen là true */}
        {isModalOpen && <ModalAdd onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default HeaderTable;

