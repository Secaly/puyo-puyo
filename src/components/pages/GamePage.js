import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fallPiece from '../../actions/fallPiece';
import movePiece from '../../actions/movePiece';
import collision from '../../actions/collision';
import {
  RELOAD,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_DOWN,
  ROTATE_LEFT,
  ROTATE_RIGHT
} from '../../types';

const KEY = {
  82: RELOAD,
  37: MOVE_LEFT,
  39: MOVE_RIGHT,
  40: MOVE_DOWN,
  65: ROTATE_LEFT,
  83: ROTATE_RIGHT
};

const COLOR = {
  1: 'red',
  2: 'blue',
  3: 'yellow',
  4: 'white'
};

class GamePage extends React.Component {
  constructor(props) {
    super(props);

    this.canvas = React.createRef();
  }

  componentDidMount = () => {
    window.addEventListener('keydown', this.handleKeys.bind(this), {
      once: true
    });
    this.gameStart();
  };

  componentDidUpdate = () => {
    this.gameUpdate();
  };

  componentWillUnmount = () => {
    window.addEventListener('keydown', this.handleKeys.bind(this), {
      once: true
    });
  };

  handleKeys = event => {
    const { movePiece } = this.props;
    movePiece(KEY[event.keyCode]);
    window.addEventListener('keydown', this.handleKeys.bind(this), {
      once: true
    });
  };

  gameStart = () => {
    const { fallPiece } = this.props;
    setInterval(() => {
      fallPiece();
    }, 100);
  };

  gameUpdate = () => {
    const { game, collision } = this.props;

    if (game.piece && game.board) {
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
    this.draw();
  };

  draw = () => {
    const { game } = this.props;

    const ctx = this.canvas.current.getContext('2d');

    ctx.clearRect(0, 0, 500, 600);
    ctx.strokeRect(0, 0, 300, 600);
    if (game.nextPieces) {
      ctx.fillStyle = 'black';
      ctx.font = '15px Arial';
      ctx.fillText('Next pieces :', 350, 25);
      ctx.fillStyle = COLOR[game.nextPieces[0][0]];
      ctx.fillRect(350, 50, 50, 50);
      ctx.strokeRect(350, 50, 50, 50);
      ctx.fillStyle = COLOR[game.nextPieces[0][1]];
      ctx.fillRect(350, 100, 50, 50);
      ctx.strokeRect(350, 100, 50, 50);
      ctx.fillStyle = COLOR[game.nextPieces[1][0]];
      ctx.fillRect(450, 50, 50, 50);
      ctx.strokeRect(450, 50, 50, 50);
      ctx.fillStyle = COLOR[game.nextPieces[1][1]];
      ctx.fillRect(450, 100, 50, 50);
      ctx.strokeRect(450, 100, 50, 50);
    }
    if (game.piece) {
      game.piece.forEach(item => {
        ctx.fillStyle = COLOR[item.color];
        ctx.fillRect(item.x, item.y, 50, 50);
        ctx.strokeRect(item.x, item.y, 50, 50);
      });
      game.board.forEach((line, indexLine) => {
        line.forEach((cell, indexColumn) => {
          if (cell > 0) {
            ctx.fillStyle = COLOR[cell];
            ctx.fillRect(indexColumn * 50, indexLine * 50, 50, 50);
            ctx.strokeRect(indexColumn * 50, indexLine * 50, 50, 50);
          }
        });
      });
    }
  };

  render() {
    return (
      <div>
        <canvas width="500" height="600" ref={this.canvas} />
        <div>[R : Reload] [A or S : Rotate] [Arrows : Move]</div>
      </div>
    );
  }
}

GamePage.propTypes = {
  movePiece: PropTypes.func.isRequired,
  fallPiece: PropTypes.func.isRequired,
  collision: PropTypes.func.isRequired,
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
    ).isRequired
  }).isRequired
};

function mapStatToProps(state) {
  return {
    game: state.game
  };
}

export default connect(
  mapStatToProps,
  { movePiece, fallPiece, collision }
)(GamePage);
