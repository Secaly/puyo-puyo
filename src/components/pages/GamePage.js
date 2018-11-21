import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import fallPiece from '../../actions/fallPiece';
import movePiece from '../../actions/movePiece';
import collision from '../../actions/collision';
import chain from '../../actions/chain';
import { reaction, draw } from '../../gameHelper';
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
    window.removeEventListener('keydown', this.handleKeys.bind(this));
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
    const { game, collision, chain } = this.props;

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
      let reactionList = [];
      if (game.board.length > 0) {
        reactionList = reaction(game.board);
        if (reactionList.length > 0) {
          chain(reactionList);
        }
      }
    }
    draw(game, this.canvas.current.getContext('2d'));
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
  chain: PropTypes.func.isRequired,
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
  { movePiece, fallPiece, collision, chain }
)(GamePage);
