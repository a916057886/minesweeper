import React from 'react';
import PropTypes from 'prop-types';

import css from './Square.module.css';

const getNumberColor = (number) => {
    // Choose the font color depending on the value of number
    switch (number) {
        case 1:
            return "#b0e0e6";
        case 2:
            return "#376c9e";
        case 3:
            return "#252577";
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
            return "#800000";
        default: return "#b0e0e6";
    }
}

const Square = (props) => {
    // Assign different (can be multiple) CSS classes depending on the props
    const divCss = [css.Square];
    if (!props.revealed && props.flagged)                   divCss.push(css.Flag);
    if (props.revealed && props.numeric)                    divCss.push(css.Number);
    if (props.revealed && props.bombed)                     divCss.push(css.Bomb);
    if (props.revealed && !props.numeric && !props.bombed)  divCss.push(css.Empty);

    // Populate the content to display in the square depending on the props
    let content = null;
    let style = {width: props.dimension, height: props.dimension};
    // If the square is revealed and it contains a number
    if (props.revealed && props.numeric && props.number) {
        content = props.number;
        style.color = getNumberColor(props.number);
    }
    // If the square is revealed and it contains a bomb
    else if (props.revealed && props.bombed) {
        content = <i className="fas fa-bomb"></i>;
    }
    // If the square is NOT revealed and it is flagged
    else if (!props.revealed && props.flagged) {
        content = <i className="fas fa-flag"></i>;
    }

    return (
        <div
            className={divCss.join(" ")}
            style={style}
            onClick={props.clicked}
            onContextMenu={props.clicked}
            onMouseDown={props.pointerDown}
            onMouseUp={props.pointerUp}
            onTouchStart={props.pointerDown}
            onTouchEnd={props.pointerUp}
        >
            {content}
        </div>
    );
};

Square.propTypes = {
    dimension: PropTypes.number.isRequired,
    revealed: PropTypes.bool.isRequired,
    numeric: PropTypes.bool.isRequired,
    bombed: PropTypes.bool,
    flagged: PropTypes.bool,
    number: PropTypes.number,
    clicked: PropTypes.func.isRequired,
    pointerDown: PropTypes.func.isRequired,
    pointerUp: PropTypes.func.isRequired
};

export default React.memo(Square);