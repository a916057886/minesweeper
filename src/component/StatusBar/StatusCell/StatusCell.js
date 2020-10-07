import React from 'react';
import PropTypes from 'prop-types';

import css from './StatusCell.module.css';

const StatusCell = (props) => {
    return (
        <div className={css.StatusCell} style={props.style}>
            {props.children}
        </div>
    )
};

StatusCell.propTypes = {
    style: PropTypes.object
}

export default StatusCell;