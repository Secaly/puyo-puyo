import { MOVE_PIECE } from '../types';

const movePiece = move => ({
  type: MOVE_PIECE,
  move
});

export default movePiece;
