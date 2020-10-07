import React from 'react';
import PropTypes from 'prop-types';

import css from './StatusBar.module.css';
import StatusCell from './StatusCell/StatusCell.js';

const StatusBar = (props) => {
    return (
        <div className={css.StatusBar}>
            <StatusCell>
                {props.time}s
            </StatusCell>
            <StatusCell>
                {props.moves}
                &nbsp;&nbsp;
                <i className="fas fa-shoe-prints"></i>
            </StatusCell>
            <StatusCell>
                {props.bombs - props.bombsFound}
                &nbsp;&nbsp;
                <i className="fas fa-bomb"></i>
            </StatusCell>
        </div>
    );
};

StatusBar.propTypes = {
    time: PropTypes.number.isRequired,
    moves: PropTypes.number.isRequired,
    bombs: PropTypes.number.isRequired,
    bombsFound: PropTypes.number.isRequired
};

export default StatusBar;