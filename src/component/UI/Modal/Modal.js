import React from 'react';
import PropTypes from 'prop-types';

import css from './Modal.module.css';

const Modal = (props) => {
    const divCss = [css.Modal];
    if (!props.normal) {
        if (!props.success) {
            divCss.push(css.Fail);
        }
        else {
            divCss.push(css.Success);
        }
    }

    return (
        <div className={divCss.join(" ")} style={{position: props.fixedPosition ? "fixed" : "absolute"}}>
            {props.children}
        </div>
    )
};

Modal.propTypes = {
    normal: PropTypes.bool,
    success: PropTypes.bool,
    fixedPosition: PropTypes.bool
}

export default Modal;