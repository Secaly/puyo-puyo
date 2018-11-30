import _ from 'lodash';

import {
  PAUSE,
  RELOAD,
  MOVE_PIECE,
  FALL_PIECE,
  FALL_BOARD,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_DOWN,
  ROTATE_RIGHT,
  ROTATE_LEFT,
  COLLISION,
  CHAIN,
  GAME_OVER
} from '../types';

const initialState = {
  piece: [
    {
      id: 1,
      x: 100,
      y: -50,
      color: Math.floor(Math.random() * 4 + 1),
      position: -1
    },
    {
      id: 2,
      x: 100,
      y: 0,
      color: Math.floor(Math.random() * 4 + 1),
      position: 0
    }
  ],
  board: [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
  ],
  nextPieces: [
    [Math.floor(Math.random() * 4 + 1), Math.floor(Math.random() * 4 + 1)],
    [Math.floor(Math.random() * 4 + 1), Math.floor(Math.random() * 4 + 1)]
  ],
  pause: true,
  score: 0,
  combo: 1,
  gameOver: false,
  startTimer: new Date().getTime() + 300000,
  timer: 300000
};

// if (
//   (game.piece[i].y / 50 === Math.floor(game.piece[i].y / 50) &&
//     game.piece[i].x / 50 === Math.floor(game.piece[i].x / 50) &&
//     game.board[game.piece[i].y / 50 + 1][game.piece[i].x / 50] > 0) ||
//   game.piece[i].y === 545

const rotate = (pos, pieceOne, pieceTwo, board) => {
  switch (pos) {
    case 0: {
      if (
        pieceOne.y + 50 > 545 ||
        board[Math.ceil(pieceOne.y / 50) + 1][Math.floor(pieceOne.x / 50)] > 0
      ) {
        return pieceTwo;
      }
      return {
        ...pieceTwo,
        x: pieceOne.x,
        y: pieceOne.y + 50,
        position: pos
      };
    }
    case 1: {
      if (
        pieceTwo.x <= 0 ||
        (Math.floor(pieceOne.x / 50) - 1 >= 0 &&
          pieceOne.y >= 0 &&
          board[Math.ceil(pieceOne.y / 50)][Math.floor(pieceOne.x / 50) - 1] >
            0)
      ) {
        return pieceTwo;
      }
      return {
        ...pieceTwo,
        x: pieceOne.x - 50,
        y: pieceOne.y,
        position: pos
      };
    }
    case 2: {
      return {
        ...pieceTwo,
        x: pieceOne.x,
        y: pieceOne.y - 50,
        position: pos
      };
    }
    case 3: {
      if (
        pieceTwo.x >= 250 ||
        (Math.floor(pieceOne.x / 50) + 1 < 6 &&
          pieceOne.y >= 0 &&
          board[Math.ceil(pieceOne.y / 50)][Math.ceil(pieceOne.x / 50) + 1] > 0)
      ) {
        return pieceTwo;
      }
      return {
        ...pieceTwo,
        x: pieceOne.x + 50,
        y: pieceOne.y,
        position: pos
      };
    }
    default:
      return pieceTwo;
  }
};

const collision = (piece, board) => {
  const newBoard = board.reverse();
  piece.sort((a, b) => {
    if (a.y > b.y) return -1;
    if (a.y < b.y) return 1;
    return 0;
  });
  piece.forEach(item => {
    let placed = false;
    board.forEach((line, index) => {
      if (line[item.x / 50] === 0 && placed === false) {
        newBoard[index][item.x / 50] = item.color;
        placed = true;
      }
    });
  });
  return newBoard.reverse();
};

const chain = (reaction, board) => {
  const newBoard = board;
  reaction.forEach(chain =>
    chain.forEach(cell => {
      newBoard[cell[0]][cell[1]] = 0;
    })
  );
  return newBoard;
};

const score = (reaction, combo) =>
  reaction.reduce((accumulator, line) => line.length + accumulator, 0) *
  100 *
  combo;

const fallBoard = board => {
  const newBoard = board.reverse();
  _.forEach(newBoard, (line, lineIndex) => {
    _.forEach(line, (cell, cellIndex) => {
      if (cell === 0) {
        for (let index = lineIndex + 1; index < board.length; index += 1) {
          if (
            newBoard[index][cellIndex] > 0 &&
            newBoard[lineIndex][cellIndex] === 0
          ) {
            newBoard[lineIndex][cellIndex] = newBoard[index][cellIndex];
            newBoard[index][cellIndex] = 0;
          }
        }
      }
    });
  });
  return newBoard.reverse();
};

export default function game(state = initialState, action = {}) {
  switch (action.type) {
    case MOVE_PIECE:
      switch (action.move) {
        case PAUSE:
          if (state.gameOver) {
            return {
              ...state,
              pause: false
            };
          }
          return {
            ...state,
            pause: !state.pause,
            startTimer: new Date().getTime() + 300000 - (300000 - state.timer)
          };
        case RELOAD:
          return {
            piece: [
              {
                id: 1,
                x: 100,
                y: -50,
                color: Math.floor(Math.random() * 4 + 1),
                position: -1
              },
              {
                id: 2,
                x: 100,
                y: 0,
                color: Math.floor(Math.random() * 4 + 1),
                position: 0
              }
            ],
            board: [
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0]
            ],
            nextPieces: [
              [
                Math.floor(Math.random() * 4 + 1),
                Math.floor(Math.random() * 4 + 1)
              ],
              [
                Math.floor(Math.random() * 4 + 1),
                Math.floor(Math.random() * 4 + 1)
              ]
            ],
            pause: true,
            score: 0,
            combo: 1,
            gameOver: false,
            startTimer: new Date().getTime() + 300000,
            timer: 300000
          };
        case MOVE_RIGHT:
          if (
            state.piece[0].x >= 250 ||
            state.piece[1].x >= 250 ||
            state.board[Math.abs(Math.ceil(state.piece[0].y / 50))][
              state.piece[0].x / 50 + 1
            ] > 0 ||
            state.board[Math.abs(Math.ceil(state.piece[1].y / 50))][
              state.piece[1].x / 50 + 1
            ] > 0
          ) {
            return state;
          }
          return {
            ...state,
            piece: state.piece.map(item => ({
              ...item,
              x: item.x + 50
            }))
          };
        case MOVE_LEFT:
          if (
            state.piece[0].x <= 0 ||
            state.piece[1].x <= 0 ||
            state.board[Math.abs(Math.ceil(state.piece[0].y / 50))][
              state.piece[0].x / 50 - 1
            ] > 0 ||
            state.board[Math.abs(Math.ceil(state.piece[1].y / 50))][
              state.piece[1].x / 50 - 1
            ] > 0
          ) {
            return state;
          }
          return {
            ...state,
            piece: state.piece.map(item => ({
              ...item,
              x: item.x - 50
            }))
          };
        case MOVE_DOWN:
          return {
            ...state,
            piece: [
              {
                id: 1,
                x: 100,
                y: -50,
                color: state.nextPieces[0][0],
                position: -1
              },
              {
                id: 2,
                x: 100,
                y: 0,
                color: state.nextPieces[0][1],
                position: 0
              }
            ],
            board: collision(state.piece, state.board),
            nextPieces: [
              state.nextPieces[1],
              [
                Math.floor(Math.random() * 4 + 1),
                Math.floor(Math.random() * 4 + 1)
              ]
            ],
            combo: 1
          };
        case ROTATE_RIGHT:
          return {
            ...state,
            piece: [
              state.piece[0],
              rotate(
                (state.piece[1].position + 3) % 4,
                state.piece[0],
                state.piece[1],
                state.board
              )
            ]
          };
        case ROTATE_LEFT:
          return {
            ...state,
            piece: [
              state.piece[0],
              rotate(
                (state.piece[1].position + 5) % 4,
                state.piece[0],
                state.piece[1],
                state.board
              )
            ]
          };
        default:
          return state;
      }
    case FALL_PIECE:
      return {
        ...state,
        piece: state.piece.map(item => ({
          ...item,
          y: item.y + 5
        })),
        timer: state.startTimer - new Date().getTime()
      };
    case FALL_BOARD:
      return {
        ...state,
        board: fallBoard(state.board)
      };
    case COLLISION:
      return {
        ...state,
        piece: [
          {
            id: 1,
            x: 100,
            y: -50,
            color: state.nextPieces[0][0],
            position: -1
          },
          {
            id: 2,
            x: 100,
            y: 0,
            color: state.nextPieces[0][1],
            position: 0
          }
        ],
        board: collision(action.piece, state.board),
        nextPieces: [
          state.nextPieces[1],
          [Math.floor(Math.random() * 4 + 1), Math.floor(Math.random() * 4 + 1)]
        ],
        combo: 1
      };
    case CHAIN:
      return {
        ...state,
        board: chain(action.reaction, state.board),
        score: state.score + score(action.reaction, state.combo),
        combo: state.combo + 1
      };
    case GAME_OVER:
      return {
        ...state,
        gameOver: true
      };
    default:
      return state;
  }
}
