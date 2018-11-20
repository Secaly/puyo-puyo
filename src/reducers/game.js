import {
  RELOAD,
  MOVE_PIECE,
  FALL_PIECE,
  MOVE_RIGHT,
  MOVE_LEFT,
  MOVE_DOWN,
  ROTATE_RIGHT,
  ROTATE_LEFT,
  COLLISION
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
  ]
};

const rotate = (pos, pieceOne, pieceTwo) => {
  switch (pos) {
    case 0: {
      return {
        ...pieceTwo,
        x: pieceOne.x,
        y: pieceOne.y + 50,
        position: pos
      };
    }
    case 1: {
      if (pieceTwo.x <= 0) {
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
      if (pieceTwo.x >= 250) {
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
  if (newBoard[11][2] > 0) {
    return [
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
    ];
  }
  return newBoard.reverse();
};

export default function game(state = initialState, action = {}) {
  switch (action.type) {
    case MOVE_PIECE:
      switch (action.move) {
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
              Math.floor(Math.random() * 4 + 1),
              Math.floor(Math.random() * 4 + 1)
            ]
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
            ]
          };
        case ROTATE_RIGHT:
          return {
            ...state,
            piece: [
              state.piece[0],
              rotate(
                (state.piece[1].position + 3) % 4,
                state.piece[0],
                state.piece[1]
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
                state.piece[1]
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
        }))
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
        ]
      };
    default:
      return state;
  }
}
