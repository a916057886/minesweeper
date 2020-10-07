import React from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

const Modal = (props) => {
    return (
        <div className={css.Modal} style={{position: props.fixedPosition ? "fixed" : "absolute"}}>
            {props.children}
        </div>
    )
};

Modal.propTypes = {
    fixedPosition: PropTypes.bool
}

export default Modal;