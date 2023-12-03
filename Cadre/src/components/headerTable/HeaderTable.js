import React from 'react';
import classes from './HeaderTable.module.scss';

const HeaderTable = ({ title }) => {
    return (
        <div className={classes.header}>
            <p className={classes.header__title}>{title}</p>
            <div className={classes.header__buttonAdd}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                        d="M16.6029 7.02429H10.8557V1.27714C10.8557 0.571921 10.2838 0 9.57857 0H8.30143C7.59621 0 7.02429 0.571921 7.02429 1.27714V7.02429H1.27714C0.571921 7.02429 0 7.59621 0 8.30143V9.57857C0 10.2838 0.571921 10.8557 1.27714 10.8557H7.02429V16.6029C7.02429 17.3081 7.59621 17.88 8.30143 17.88H9.57857C10.2838 17.88 10.8557 17.3081 10.8557 16.6029V10.8557H16.6029C17.3081 10.8557 17.88 10.2838 17.88 9.57857V8.30143C17.88 7.59621 17.3081 7.02429 16.6029 7.02429Z"
                        fill="white"
                    />
                </svg>{' '}
                <p className={classes.add}>Thêm</p>
            </div>
        </div>
    );
};

export default HeaderTable;

