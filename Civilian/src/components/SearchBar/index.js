import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import classes from './styles.module.scss';
import PropTypes from 'prop-types';

const SearchBar = ({ variants = 'primary', ...props }) => {
    return (
        <div className={`${classes.container} ${classes[`container-${variants}`]}`}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={classes.ic} />
            <input type="text" id="inputSearch" placeholder="Tìm kiếm..." className={classes.text_input} />
        </div>
    );
};

SearchBar.prototype = {
    variants: PropTypes.string,
};
export default SearchBar;
