import React from 'react';
import ReactDOM from 'react-dom';
import classes from './Modal.module.scss';

const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className={classes.overlay} onClick={onClose}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;

