import React from 'react';
import classes from './SetPoint.module.scss';
import PropTypes from 'prop-types';

const SetPoint = ({ title, color, size }) => {
    return (
        <div>
            <p>1</p>
        </div>
    );
};

SetPoint.prototype = {
    title: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
};
export default SetPoint;
