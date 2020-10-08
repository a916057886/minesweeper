import React from 'react';
import PropTypes from 'prop-types';

import css from './Board.module.css';
import Square from './Square/Square.js';

const Board = (props) => {
    return (
        <div className={css.Board}>
            {props.board.map((row, i) => (
                <div key={i} style={{margin: "0", padding: "0"}}>
                    {row.map((square, j) => (
                        <Square
                            key={(i * props.rows) + j}
                            dimension={props.squareDimension}
                            revealed={square.revealed}
                            numeric={square.number !== undefined}
                            bombed={square.bombed}
                            flagged={square.flagged}
                            number={null || square.number}
                            clicked={(event) => props.clickedHandler(event, i, j)}
                            pointerDown={() => props.pointerDownHandler(i, j)}
                            pointerUp={props.pointerUpHandler} />
                    ))}
                </div>
            ))}
        </div>
    );
};

Board.propTypes = {
    squareDimension: PropTypes.number.isRequired,
    board: PropTypes.array.isRequired,
    rows: PropTypes.number.isRequired,
    clickedHandler: PropTypes.func.isRequired,
    pointerDownHandler: PropTypes.func.isRequired,
    pointerUpHandler: PropTypes.func.isRequired
};

export default Board;