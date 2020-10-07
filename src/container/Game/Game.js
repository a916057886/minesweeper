import React, { Component } from 'react';

import Canvas from '../Canvas/Canvas.js';
import Modal from '../../component/UI/Modal/Modal.js';
import Button from '../../component/UI/Button/Button.js';

class Game extends Component {
    state = {
        numOfSquares: null,
        numOfBombs: null
    }

    buttonClickedHandler = (squares, bombs) => {
        this.setState({numOfSquares: squares, numOfBombs: bombs});
    }

    gameRestartHandler = () => {
        this.setState({numOfSquares: null, numOfBombs: null});
    }

    render() {
        const display = this.state.numOfSquares
            ? (
                <Canvas
                    numOfSquares={this.state.numOfSquares}
                    numOfBombs={this.state.numOfBombs}
                    restartHandler={this.gameRestartHandler} />
            )
            : (
                <Modal>
                    Please choose the difficulty
                    <Button clicked={() => this.buttonClickedHandler(100, 10)}>Easy</Button>
                    <Button clicked={() => this.buttonClickedHandler(200, 40)}>Hard</Button>
                </Modal>
            );

        return display;
    }
}

export default Game;