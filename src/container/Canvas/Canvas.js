import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import css from './Canvas.module.css';
import Square from '../../component/Square/Square.js';
import StatusCell from '../../component/UI/StatusCell/StatusCell.js';
import Modal from '../../component/UI/Modal/Modal.js';
import Button from '../../component/UI/Button/Button.js';

class Canvas extends PureComponent {
    constructor(props) {
        super();
        [this.state.rows, this.state.columns] = this.calculateRowsAndColumns(window.innerWidth, props.numOfSquares);
        this.state.squares = props.numOfSquares;
        this.state.bombs = props.numOfBombs;
        this.state.board = this.populateBoard();
    }

    state = {
        rows: 0,
        columns: 0,
        board: [],
        squares: 0,
        bombsPoints: [],
        bombs: 0,
        bombsFound: 0,
        moves: 0,
        time: 0,
        timer: null,
        firstClick: true,
        success: false,
        failed: false,
    }

    calculateRowsAndColumns = (width, squares) => {
        if (width <= 1000) {
            const columns = 10;
            return [squares / columns, columns];
        }
        else {
            let columns = Math.floor(width / 50);
            if (columns >= 20) {
                if (squares === 100) {
                    columns = 20;
                }
                else {
                    columns = 20;
                }
            }
            else if (columns >= 10) {
                columns = 10;
            }
            else {
                columns = 5;
            }
            return [squares / columns, columns];
        }
    }

    populateBoard = () => {
        const board = [];

        for (let i = 0; i < this.state.rows; i++) {
            // For each row, push a new array
            board.push([]);

            for (let j = 0; j < this.state.columns; j++) {
                // For each cell, push a new element
                board[i].push({
                    revealed: false,
                    flagged: false
                });
            }
        }

        return board;
    }

    isGameSucceeded = () => {
        // If bombs found is greater than the total number of bombs, game is succeeded
        if (this.state.bombsFound >= this.state.bombs) {
            clearInterval(this.state.timer);
            this.setState({success: true});
        }
    }

    revealAllBombs = (board) => {
        // Reveal all the bombs in the board
        for (let i = 0; i < this.state.bombsPoints.length; i++) {
            const bombPoint = this.state.bombsPoints[i];

            board[bombPoint[0]][bombPoint[1]].flagged = false;
            board[bombPoint[0]][bombPoint[1]].revealed = true;
        }

        return board;
    }

    revealSurroundedBombs = (board, bombsPoints) => {
        let bombCount = 0;

        for (let i = 0; i < bombsPoints.length; i++) {
            const bombPoint = bombsPoints[i];
            // Locate all the unexposed bombs, and check if it is surrounded by revealed squares
            if (!board[bombPoint[0]][bombPoint[1]].revealed) {
                if (this.isBombSurrounded(board, bombPoint[0], bombPoint[1])) {
                    board[bombPoint[0]][bombPoint[1]].revealed = true;
                    bombCount++;
                }
            }
        }

        return [board, bombCount];
    }

    isBombSurrounded = (board, row, column) => {
        let isSurrounded = true;

        // Sequentially check bomb's four edge squares if exist (not including diagnoal squares)
        isSurrounded &= this.isEdgeSurrounded(board, row, column, row - 1, column);
        isSurrounded &= this.isEdgeSurrounded(board, row, column, row + 1, column);
        isSurrounded &= this.isEdgeSurrounded(board, row, column, row, column - 1);
        isSurrounded &= this.isEdgeSurrounded(board, row, column, row, column + 1);

        return isSurrounded;
    }

    isEdgeSurrounded = (board, bombRow, bombColumn, edgeRow, edgeColumn) => {
        // If this edge is the board's boundary or this edge is a square and it is already revealed
        if (this.isIndexOutOfBounds(board, edgeRow, edgeColumn) || board[edgeRow][edgeColumn].revealed) {
            return true;
        }
        // If this edge is an unexposed bomb
        else if (!board[edgeRow][edgeColumn].revealed && board[edgeRow][edgeColumn].bombed) {
            // Alter current bomb's revealed state to true to prevent infinite recursion
            board[bombRow][bombColumn].revealed = true;
            // Check if this edged bomb is also surrounded
            const isSurrounded = this.isBombSurrounded(board, edgeRow, edgeColumn);
            // Alter current bomb's revealed state to its original value
            board[bombRow][bombColumn].revealed = false;

            return isSurrounded;
        }
        else {
            return false;
        }
    }

    revealSquare = (board, row, column) => {
        // Count the number of adjacent bombs by the given square
        const bombCount = this.adjacentBombCount(board, row, column);

        board[row][column].revealed = true;
        board[row][column].flagged = false;
        
        // If there is no adjacent bomb, automatically reveal adjacent squares as well
        if (bombCount === 0) {
            board = this.revealAdjacentSquares(board, row, column);
        }
        // If there is adjacent bomb(s), display the number of bomb(s)
        else {
            board[row][column].number = bombCount;
        }

        return board;
    }

    revealAdjacentSquares = (board, row, column) => {
        // Sequentially reveal the given square's adjacent square(s) if it has NOT yet been revealed
        if (!this.isIndexOutOfBounds(board, row - 1, column - 1) && !board[row - 1][column - 1].revealed) {
            board = this.revealSquare(board, row - 1, column - 1);
        }
        if (!this.isIndexOutOfBounds(board, row - 1, column) && !board[row - 1][column].revealed) {
            board = this.revealSquare(board, row - 1, column);
        }
        if (!this.isIndexOutOfBounds(board, row - 1, column + 1) && !board[row - 1][column + 1].revealed) {
            board = this.revealSquare(board, row - 1, column + 1);
        }
        if (!this.isIndexOutOfBounds(board, row, column - 1) && !board[row][column - 1].revealed) {
            board = this.revealSquare(board, row, column - 1);
        }
        if (!this.isIndexOutOfBounds(board, row, column + 1) && !board[row][column + 1].revealed) {
            board = this.revealSquare(board, row, column + 1);
        }
        if (!this.isIndexOutOfBounds(board, row + 1, column - 1) && !board[row + 1][column - 1].revealed) {
            board = this.revealSquare(board, row + 1, column - 1);
        }
        if (!this.isIndexOutOfBounds(board, row + 1, column) && !board[row + 1][column].revealed) {
            board = this.revealSquare(board, row + 1, column);
        }
        if (!this.isIndexOutOfBounds(board, row + 1, column + 1) && !board[row + 1][column + 1].revealed) {
            board = this.revealSquare(board, row + 1, column + 1);
        }

        return board;
    }

    adjacentBombCount = (board, row, column) => {
        let bombCount = 0;

        // Sequentially check if the given square's adjacent square(s) have bomb(s)
        if (!this.isIndexOutOfBounds(board, row - 1, column - 1) && board[row - 1][column - 1].bombed) {
            bombCount++;
        }
        if (!this.isIndexOutOfBounds(board, row - 1, column) && board[row - 1][column].bombed) {
            bombCount++;
        }
        if (!this.isIndexOutOfBounds(board, row - 1, column + 1) && board[row - 1][column + 1].bombed) {
            bombCount++;
        }
        if (!this.isIndexOutOfBounds(board, row, column - 1) && board[row][column - 1].bombed) {
            bombCount++;
        }
        if (!this.isIndexOutOfBounds(board, row, column + 1) && board[row][column + 1].bombed) {
            bombCount++;
        }
        if (!this.isIndexOutOfBounds(board, row + 1, column - 1) && board[row + 1][column - 1].bombed) {
            bombCount++;
        }
        if (!this.isIndexOutOfBounds(board, row + 1, column) && board[row + 1][column].bombed) {
            bombCount++;
        }
        if (!this.isIndexOutOfBounds(board, row + 1, column + 1) && board[row + 1][column + 1].bombed) {
            bombCount++;
        }

        return bombCount;
    }

    isIndexOutOfBounds = (board, row, column) => {
        // Check if the given row and column indices are out of bounds
        return !(row >= 0 && row < board.length && column >= 0 && column < board[row].length);
    }

    handleFirstClick = (row, column, board) => {
        const bombsPoints = [];
        let squareCount = 0;
        let bombCount = 0;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++, squareCount++) {
                // If the square is the first-clicked square, force it to not become the bomb 
                if (i === row && j === column) {
                    board[i][j].bombed = false;
                }
                // Randomly generate the bombs for the remaining squares
                else {
                    const isBomb = this.randomlyBecomeBomb(this.state.squares, this.state.bombs, squareCount, bombCount);
                    if (isBomb) {
                        bombCount++;
                        bombsPoints.push([i, j]);
                    }
                    board[i][j].bombed = isBomb;
                }
            }
        }

        return [board, bombsPoints];
    }

    randomlyBecomeBomb = (squares, bombs, squareCount, bombCount) => {
        if (bombCount < bombs) {
            // Randomly choose to become a bomb
            if (squares - squareCount > bombs - bombCount) {
                return 1 === Math.floor(Math.random() * Math.floor(squares / bombs)) + 1;
            }
            // Edge case when the number of remaining squares is equal to the number of un-generated bombs
            else {
                return true;
            }
        }
    }

    handleLeftClick = (row, column) => {
        if (!this.state.board[row][column].revealed && !this.state.board[row][column].flagged) {
            let board = _.cloneDeep(this.state.board);

            // Handle the first click situation
            let bombsPoints = this.state.bombsPoints;
            if (this.state.firstClick) {
                [board, bombsPoints] = this.handleFirstClick(row, column, board);
                this.setState({bombsPoints: bombsPoints, firstClick: false});
            }

            let newBombsFound = 0;
            // If the revealed square contains a bomb, reveal all the bombs
            if (board[row][column].bombed) {
                board = this.revealAllBombs(board);
                clearInterval(this.state.timer);
            }
            // If the revealed square does not contain a bomb, recursively reveal adjacent square(s) if necessary and reveal any bomb(s) surrounded by revealed squares
            else {
                board = this.revealSquare(board, row, column);
                [board, newBombsFound] = this.revealSurroundedBombs(board, bombsPoints);
            }

            this.setState(prevState => ({
                board: board,
                failed: board[row][column].bombed,
                bombsFound: prevState.bombsFound + newBombsFound,
                moves: prevState.moves + 1
            }));
        }
    }

    handleRightClick = (row, column) => {
        // Place a flag on the right-clicked square if it has NOT yet been revealed
        if (!this.state.board[row][column].revealed) {
            const board = _.cloneDeep(this.state.board);
            const square = board[row][column];

            square.flagged = !square.flagged;
            board[row][column] = square;

            this.setState({board: board});
        }
    }

    squareClickedHandler = (event, i, j) => {
        // Handle left click and right click on squares if game has NOT finished
        if (!this.state.success && !this.state.failed) {
            if (event.type === 'click') {
                this.handleLeftClick(i, j);
            }
            else if (event.type === 'contextmenu') {
                event.preventDefault();
                this.handleRightClick(i, j);
            }
        }
    }

    mouseDownHandler = (i, j) => {
        this.setState({mouseDown: setTimeout(() => {
            if (!this.state.success && !this.state.failed) {
                this.handleRightClick(i, j);
            }
        }, 1000)});
    }

    mouseUpHandler = () => {
        clearTimeout(this.state.mouseDown);
    }

    componentDidMount() {
        // Set up the timer after the board is rendered
        this.setState({timer: setInterval(() => this.setState(prevState => ({time: prevState.time + 1})), 1000)});
    }

    componentDidUpdate() {
        // Check if the game has succeeded everytime a square is revealed
        this.isGameSucceeded();
    }

    render() {
        let finishedMessage = null;
        if (this.state.success) {
            finishedMessage = (
                <Modal fixedPosition>
                    You swept all the mines in {this.state.time}s with {this.state.moves} moves!
                    <Button clicked={this.props.restartHandler}>Restart</Button>
                </Modal>
            );
        }
        else if (this.state.failed) {
            finishedMessage = (
                <Modal fixedPosition>
                    Bomb exploded!
                    <Button clicked={this.props.restartHandler}>Restart</Button>
                </Modal>
            );
        }

        return (
            <Fragment>
                <div className={css.Canvas}>
                    <div className={css.StatusBar}>
                        <StatusCell>
                            {this.state.time}s
                        </StatusCell>
                        <StatusCell>
                            {this.state.moves}
                            &nbsp;&nbsp;
                            <i className="fas fa-shoe-prints"></i>
                        </StatusCell>
                        <StatusCell>
                            {this.state.bombs - this.state.bombsFound}
                            &nbsp;&nbsp;
                            <i className="fas fa-bomb"></i>
                        </StatusCell>
                    </div>
                    <div className={css.Board}>
                        {this.state.board.map((row, i) => (
                            <div key={i}>
                                {row.map((square, j) => (
                                    <Square
                                        key={(i * this.state.rows) + j}
                                        revealed={square.revealed}
                                        numeric={square.number !== undefined}
                                        bombed={square.bombed}
                                        flagged={square.flagged}
                                        number={null || square.number}
                                        clicked={(event) => this.squareClickedHandler(event, i, j)}
                                        mouseDown={() => this.mouseDownHandler(i, j)}
                                        mouseUp={this.mouseUpHandler} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {finishedMessage}
            </Fragment>
        );
    }
}

Canvas.propTypes = {
    numOfSquares: PropTypes.number.isRequired,
    numOfBombs: PropTypes.number.isRequired,
    restartHandler: PropTypes.func.isRequired
}

export default Canvas;