import React from 'react';
import PropTypes from 'prop-types';

import css from './Button.module.css';

const Button = (props) => {
    return (
        <div className={css.Button} style={props.style}>
            <button type="button" onClick={props.clicked}>{props.children}</button>
        </div>
    )
};

Button.propTypes = {
    clicked: PropTypes.func.isRequired,
    style: PropTypes.object
}

export default Button;