import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fallPiece from '../../actions/fallPiece';
import movePiece from '../../actions/movePiece';
import collision from '../../actions/collision';
import chain from '../../actions/chain';
import fallBoard from '../../actions/fallBoard';
import gameOver from '../../actions/gameOver';
import {
  reaction,
  draw,
  drawPause,
  drawGameOver,
  drawChain,
  isSpaceInBoard,
  isGameOver
} from '../../gameHelper';
import {
  PAUSE,
  RELOAD,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_DOWN,
  ROTATE_LEFT,
  ROTATE_RIGHT
} from '../../types';

const KEY = {
  32: PAUSE,
  82: RELOAD,
  37: MOVE_LEFT,
  39: MOVE_RIGHT,
  40: MOVE_DOWN,
  65: ROTATE_LEFT,
  83: ROTATE_RIGHT
};

class GamePage extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
    this.handleKeys = this.handleKeys.bind(this);
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.handleKeys, {
      once: true
    });
    drawPause(this.canvas.current.getContext('2d'));
  };

  componentDidUpdate = () => {
    const { game } = this.props;
    if (game.gameOver) {
      window.addEventListener('keydown', this.handleKeys, {
        once: true
      });
      drawGameOver(game, this.canvas.current.getContext('2d'));
    } else if (!game.pause) {
      window.removeEventListener('keydown', this.handleKeys, {
        once: true
      });
      clearTimeout(this.fallTimeout);
      this.gameUpdate();
    } else {
      window.addEventListener('keydown', this.handleKeys, {
        once: true
      });
      drawPause(this.canvas.current.getContext('2d'));
    }
  };

  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.handleKeys, {
      once: true
    });
  };

  handleKeys = event => {
    const { game, movePiece } = this.props;
    if (!game.pause || event.keyCode === 32) {
      movePiece(KEY[event.keyCode]);
    } else {
      window.addEventListener('keydown', this.handleKeys, {
        once: true
      });
    }
  };

  gameUpdate = () => {
    const {
      game,
      collision,
      chain,
      fallPiece,
      fallBoard,
      gameOver
    } = this.props;

    let dontDraw = false;

    this.fallTimeout = setTimeout(fallPiece.bind(this), 100);

    if (game.piece && game.board) {
      let reactionList = [];
      if (game.board.length > 0) {
        if (isGameOver(game.board)) {
          gameOver();
        }
        if (isSpaceInBoard(game.board)) {
          clearTimeout(this.fallTimeout);
          draw(game, this.canvas.current.getContext('2d'));
          setTimeout(() => fallBoard(), 1000);
          dontDraw = true;
        }
        reactionList = reaction(game.board);
        if (reactionList.length > 0) {
          clearTimeout(this.fallTimeout);
          draw(game, this.canvas.current.getContext('2d'));
          drawChain(game, reactionList, this.canvas.current.getContext('2d'));
          setTimeout(() => chain(reactionList), 1000);
          setTimeout(
            () =>
              window.addEventListener('keydown', this.handleKeys, {
                once: true
              }),
            1000
          );
          dontDraw = true;
        }
      }
      for (let i = 0; i < game.piece.length; i += 1) {
        if (
          (game.piece[i].y / 50 === Math.floor(game.piece[i].y / 50) &&
            game.piece[i].x / 50 === Math.floor(game.piece[i].x / 50) &&
            game.board[game.piece[i].y / 50 + 1][game.piece[i].x / 50] > 0) ||
          game.piece[i].y === 545
        ) {
          collision(game.piece);
          break;
        }
      }
    }
    if (!dontDraw) {
      window.addEventListener('keydown', this.handleKeys, {
        once: true
      });
      draw(game, this.canvas.current.getContext('2d'));
    }
  };

  render() {
    return (
      <div>
        <canvas width="500" height="600" ref={this.canvas} />
        <div>
          [Space : Start/Pause] [R : Restart] [A or S : Rotate] [Arrows : Move]
        </div>
      </div>
    );
  }
}

GamePage.propTypes = {
  movePiece: PropTypes.func.isRequired,
  fallPiece: PropTypes.func.isRequired,
  collision: PropTypes.func.isRequired,
  chain: PropTypes.func.isRequired,
  fallBoard: PropTypes.func.isRequired,
  gameOver: PropTypes.func.isRequired,
  game: PropTypes.shape({
    piece: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        color: PropTypes.number.isRequired,
        position: PropTypes.number.isRequired
      }).isRequired
    ).isRequired,
    board: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number).isRequired)
      .isRequired,
    nextPieces: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number).isRequired
    ).isRequired,
    pause: PropTypes.bool.isRequired
  }).isRequired
};

function mapStatToProps(state) {
  return {
    game: state.game
  };
}

export default connect(
  mapStatToProps,
  { movePiece, fallPiece, collision, chain, fallBoard, gameOver }
)(GamePage);
