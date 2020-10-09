import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import css from './Canvas.module.css';
import Modal from '../../component/UI/Modal/Modal.js';
import Button from '../../component/UI/Button/Button.js';
import Board from '../../component/Board/Board';
import StatusBar from '../../component/StatusBar/StatusBar';
import Backdrop from '../../component/UI/Backdrop/Backdrop';

const mobileAndTabletCheck = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

class Canvas extends Component {
    constructor(props) {
        super();
        this.state.isMobile = mobileAndTabletCheck();
        [this.state.rows, this.state.columns, this.state.squareDimension] = this.setup(window.innerWidth, window.innerHeight, props.numOfSquares);
        this.state.squares = this.state.rows * this.state.columns;
        this.state.bombs = props.numOfBombs;
        this.state.board = this.populateBoard();
    }

    state = {
        isMobile: false,
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

    handleRightClick = (row, column, prevent=false) => {
        // Place a flag on the right-clicked square if it has NOT yet been revealed
        if (!prevent && !this.state.board[row][column].revealed) {
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
                this.handleRightClick(i, j, this.state.isMobile);
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