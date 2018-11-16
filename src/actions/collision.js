import { COLLISION } from '../types';

const collision = piece => ({
  type: COLLISION,
  piece
});

export default collision;
