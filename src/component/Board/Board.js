import React from 'react';
import PropTypes from 'prop-types';

import css from './Board.module.css';
import Square from './Square/Square.js';

const Board = (props) => {
    return (
        <div className={css.Board}>
            {props.board.map((row, i) => (
                <div key={i}>
                    {row.map((square, j) => (
                        <Square
                            key={(i * props.rows) + j}
                            revealed={square.revealed}
                            numeric={square.number !== undefined}
                            bombed={square.bombed}
                            flagged={square.flagged}
                            number={null || square.number}
                            clicked={(event) => props.clickedHandler(event, i, j)}
                            mouseDown={() => props.mouseDownHandler(i, j)}
                            mouseUp={props.mouseUpHandler} />
                    ))}
                </div>
            ))}
        </div>
    );
};

Board.propTypes = {
    board: PropTypes.array.isRequired,
    rows: PropTypes.number.isRequired,
    clickedHandler: PropTypes.func.isRequired,
    mouseDownHandler: PropTypes.func.isRequired,
    mouseUpHandler: PropTypes.func.isRequired
};

export default Board;