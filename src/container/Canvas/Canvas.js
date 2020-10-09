import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import css from './Canvas.module.css';
import Modal from '../../component/UI/Modal/Modal.js';
import Button from '../../component/UI/Button/Button.js';
import Board from '../../component/Board/Board';
import StatusBar from '../../component/StatusBar/StatusBar';
import Backdrop from '../../component/UI/Backdrop/Backdrop';

class Canvas extends Component {
    constructor(props) {
        super();
        [this.state.rows, this.state.columns, this.state.squareDimension] = this.setup(window.innerWidth, window.innerHeight, props.numOfSquares);
        this.state.squares = this.state.rows * this.state.columns;
        this.state.bombs = props.numOfBombs;
        this.state.board = this.populateBoard();
    }

    state = {
        rows: 0,
        columns: 0,
        board: [],
        squareDimension: 0,
        squares: 0,
        squaresRevealed: 0,
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

    setup = (width, height, squares) => {
        // PC & Tablet resolution
        if (width > 700 && height > 700) {
            return [Math.ceil(Math.sqrt(squares)), Math.ceil(Math.sqrt(squares)), 50];
        }
        // Phone resolution
        else {
            if (width > 1000)   width = 1000;

            width *= 0.8;
            height *= 0.8;

            let dimension = 37;
            if (width <= 500)   dimension = 25;

            const columns = Math.floor(width / dimension);
            const rows = Math.floor(squares / columns);

            return [rows, columns, dimension];
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
        if (!this.state.success && !this.state.failed && this.state.squares - this.state.squaresRevealed === this.state.bombs) {
            const board = this.revealAllBombs(this.state.board);
            clearInterval(this.state.timer);
            this.setState({board: board, success: true});
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

    revealSquare = (board, row, column) => {
        // Count the number of adjacent bombs by the given square
        const bombCount = this.adjacentBombCount(board, row, column);

        if (board[row][column].flagged) {
            this.setState(prevState => ({squaresRevealed: prevState.squaresRevealed + 1, bombsFound: prevState.bombsFound - 1}));
        }
        else {
            this.setState(prevState => ({squaresRevealed: prevState.squaresRevealed + 1}));
        }
        
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
        // Randomly generate bombs
        const bombsPoints = this.generateBombs(row, column);

        // Assign value of "bombed" property to each square
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j].bombed = this.indexOfCoordinate(bombsPoints, i, j) >= 0;
            }
        }

        return [board, bombsPoints];
    }

    generateBombs = (row, column) => {
        const bombsPoints = [];

        // For each bomb, select a random x and y coordinate
        for (let i = 0; i < this.state.bombs; i++) {
            while (true) {
                const x = Math.floor(Math.random() * this.state.rows);
                const y = Math.floor(Math.random() * this.state.columns);

                // If this random coordinate does not equal to the first-clicked coordiate and not equal to any of the generated bomb coodinates
                if (x !== row && y !== column && this.indexOfCoordinate(bombsPoints, x, y) === -1) {
                    bombsPoints.push([x, y]);
                    break;
                }
            }
        }

        return bombsPoints;
    }

    indexOfCoordinate = (array, x, y) => {
        // Check if the given coordinate already exists in the array;
        let i = 0;
        for (; i < array.length; i++) {
            if (array[i][0] === x && array[i][1] === y) {
                break;
            }
        }
        
        return i !== array.length ? i : -1;
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
                // Set up the timer after the board is rendered
                this.setState({
                    bombsPoints: bombsPoints,
                    firstClick: false,
                    timer: setInterval(() => this.setState(prevState => ({time: prevState.time + 1})), 1000)
                });
            }

            // If the revealed square contains a bomb, reveal all the bombs
            if (board[row][column].bombed) {
                board = this.revealAllBombs(board);
                clearInterval(this.state.timer);
            }
            // If the revealed square does not contain a bomb, recursively reveal adjacent square(s) if necessary
            else {
                board = this.revealSquare(board, row, column);
            }

            this.setState(prevState => ({
                board: board,
                failed: board[row][column].bombed,
                moves: prevState.moves + 1
            }));
        }
    }

    handleRightClick = (row, column) => {
        // Place a flag on the right-clicked square if it has NOT yet been revealed
        if (!this.state.board[row][column].revealed) {
            const board = _.cloneDeep(this.state.board);
            const square = board[row][column];
            const bombsFound = square.flagged ? this.state.bombsFound - 1 : this.state.bombsFound + 1;

            square.flagged = !square.flagged;
            board[row][column] = square;

            this.setState({board: board, bombsFound: bombsFound});
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

    pointerDownHandler = (i, j) => {
        // Set up the timeout timer when mouse is held down
        this.setState({mouseDown: setTimeout(() => {
            if (!this.state.success && !this.state.failed) {
                this.handleRightClick(i, j);
            }
        }, 1000)});
    }

    pointerUpHandler = () => {
        // Clear the timeout timer after mouse is no longer held down
        clearTimeout(this.state.mouseDown);
    }

    componentDidUpdate() {
        // Check if the game has succeeded everytime a square is revealed
        this.isGameSucceeded();
    }

    render() {
        // Display the appropriate message after game is finished
        let finishedMessage = null;
        if (this.state.success) {
            finishedMessage = (
                <Fragment>
                    <Backdrop />
                    <Modal fixedPosition success>
                        You swept all the mines in {this.state.time}s with {this.state.moves} moves!
                        <Button clicked={this.props.restartHandler}>Restart</Button>
                    </Modal>
                </Fragment>
            );
        }
        else if (this.state.failed) {
            finishedMessage = (
                <Fragment>
                    <Backdrop />
                    <Modal fixedPosition>
                        Mine exploded!
                        <Button clicked={this.props.restartHandler}>Restart</Button>
                    </Modal>
                </Fragment>
            );
        }

        return (
            <Fragment>
                <div className={css.Canvas}>
                    <StatusBar
                        time={this.state.time}
                        moves={this.state.moves}
                        bombs={this.state.bombs}
                        bombsFound={this.state.bombsFound} />
                    <Board
                        squareDimension={this.state.squareDimension}
                        board={this.state.board}
                        rows={this.state.rows}
                        clickedHandler={this.squareClickedHandler}
                        pointerDownHandler={this.pointerDownHandler}
                        pointerUpHandler={this.pointerUpHandler} />
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