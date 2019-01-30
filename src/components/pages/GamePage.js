import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import fallPiece from "../../actions/fallPiece";
import movePiece from "../../actions/movePiece";
import collision from "../../actions/collision";
import chain from "../../actions/chain";
import fallBoard from "../../actions/fallBoard";
import gameOver from "../../actions/gameOver";
import {
  reaction,
  draw,
  drawPause,
  drawGameOver,
  drawChain,
  isSpaceInBoard,
  isGameOver
} from "../../gameHelper";
import {
  PAUSE,
  RELOAD,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_DOWN,
  ROTATE_LEFT,
  ROTATE_RIGHT
} from "../../types";

const KEY = {
  32: PAUSE,
  82: RELOAD,
  37: MOVE_LEFT,
  39: MOVE_RIGHT,
  40: MOVE_DOWN,
  65: ROTATE_LEFT,
  83: ROTATE_RIGHT
};

const GamePage = props => {
  // constructor(props) {
  //   super(props);

  //   this.canvas = React.createRef();
  //   this.handleKeys = this.handleKeys.bind(this);
  // }

  const canvas = useRef();

  // componentDidMount = () => {
  //   window.addEventListener("keydown", this.handleKeys, {
  //     once: true
  //   });
  //   drawPause(this.canvas.current.getContext("2d"));
  // };

  useEffect(() => {
    // key handler hook

    const handleKeys = event => {
      if (!props.game.pause || event.keyCode === 32) {
        props.movePiece(KEY[event.keyCode]);
      } else {
        window.addEventListener("keydown", handleKeys, {
          once: true
        });
      }
    };

    window.addEventListener("keydown", handleKeys, {
      once: true
    });
    return () => {
      window.removeEventListener("keydown", handleKeys, {
        once: true
      });
    };
  }, []);

  useEffect(() => {
    drawPause(canvas.current.getContext("2d"));
  }, []);

  useEffect(() => {
    const handleKeys = event => {
      if (!props.game.pause || event.keyCode === 32) {
        props.movePiece(KEY[event.keyCode]);
      } else {
        window.addEventListener("keydown", handleKeys, {
          once: true
        });
      }
    };

    window.removeEventListener("keydown", handleKeys, {
      once: true
    });
    if (props.game.gameOver) {
      window.addEventListener("keydown", handleKeys, {
        once: true
      });
      drawGameOver(props.game, canvas.current.getContext("2d"));
    } else if (props.game.pause) {
      window.addEventListener("keydown", handleKeys, {
        once: true
      });
      drawPause(canvas.current.getContext("2d"));
    } else {
      clearTimeout(fallTimeout());
      gameUpdate();
    }
  });

  // componentDidUpdate = () => {
  //   const { game } = this.props;
  //   window.removeEventListener("keydown", this.handleKeys, {
  //     once: true
  //   });
  //   if (game.gameOver) {
  //     window.addEventListener("keydown", this.handleKeys, {
  //       once: true
  //     });
  //     drawGameOver(game, this.canvas.current.getContext("2d"));
  //   } else if (game.pause) {
  //     window.addEventListener("keydown", this.handleKeys, {
  //       once: true
  //     });
  //     drawPause(this.canvas.current.getContext("2d"));
  //   } else {
  //     clearTimeout(this.fallTimeout);
  //     this.gameUpdate();
  //   }
  // };

  // componentWillUnmount = () => {
  //   window.removeEventListener("keydown", this.handleKeys, {
  //     once: true
  //   });
  // };

  const fallTimeout = () =>
    setTimeout(
      fallPiece.bind(this),
      100 /
        (10 - Math.floor((props.game.timer % (1000 * 60 * 60)) / (1000 * 30)))
    );

  const gameUpdate = () => {
    let dontDraw = false;

    if (props.game.piece && props.game.board) {
      let reactionList = [];
      if (props.game.startTimer && props.game.timer <= 0) {
        props.gameOver();
      }
      if (props.game.board.length > 0) {
        if (isGameOver(props.game.board)) {
          props.gameOver();
        }
        if (isSpaceInBoard(props.game.board)) {
          clearTimeout(fallTimeout());
          draw(props.game, canvas.current.getContext("2d"));
          setTimeout(() => props.fallBoard(), 100);
          dontDraw = true;
        }
        reactionList = reaction(props.game.board);
        if (reactionList.length > 0) {
          clearTimeout(fallTimeout());
          draw(props.game, canvas.current.getContext("2d"));
          drawChain(props.game, reactionList, canvas.current.getContext("2d"));
          setTimeout(() => props.chain(reactionList), 1000);
          setTimeout(
            () =>
              window.addEventListener("keydown", handleKeys(), {
                once: true
              }),
            1000
          );
          dontDraw = true;
        }
      }
      for (let i = 0; i < props.game.piece.length; i += 1) {
        if (
          (props.game.piece[i].y / 50 ===
            Math.floor(props.game.piece[i].y / 50) &&
            props.game.piece[i].x / 50 ===
              Math.floor(props.game.piece[i].x / 50) &&
            props.game.board[props.game.piece[i].y / 50 + 1][
              props.game.piece[i].x / 50
            ] > 0) ||
          props.game.piece[i].y === 545
        ) {
          props.collision(props.game.piece);
          break;
        }
      }
    }
    if (!dontDraw) {
      window.addEventListener("keydown", handleKeys(), {
        once: true
      });
      draw(props.game, canvas.current.getContext("2d"));
    }
  };

  return (
    <div>
      <canvas width="500" height="600" ref={canvas} />
      <div>
        [Space : Start/Pause] [R : Restart] [A or S : Rotate] [Arrows : Move]
      </div>
    </div>
  );
};

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
