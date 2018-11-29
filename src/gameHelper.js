import _ from 'lodash';

const searchLinks = (board, lineIndex, cellIndex, list) => {
  if (
    lineIndex - 1 >= 0 &&
    board[lineIndex - 1][cellIndex] === board[lineIndex][cellIndex] &&
    list.some(e => _.isEqual(e, [lineIndex - 1, cellIndex])) < 1
  ) {
    list.push([lineIndex - 1, cellIndex]);
    searchLinks(board, lineIndex - 1, cellIndex, list);
  }
  if (
    cellIndex + 1 < 6 &&
    board[lineIndex][cellIndex + 1] === board[lineIndex][cellIndex] &&
    list.some(e => _.isEqual(e, [lineIndex, cellIndex + 1])) < 1
  ) {
    list.push([lineIndex, cellIndex + 1]);
    searchLinks(board, lineIndex, cellIndex + 1, list);
  }
  if (
    lineIndex + 1 < 12 &&
    board[lineIndex + 1][cellIndex] === board[lineIndex][cellIndex] &&
    list.some(e => _.isEqual(e, [lineIndex + 1, cellIndex])) < 1
  ) {
    list.push([lineIndex + 1, cellIndex]);
    searchLinks(board, lineIndex + 1, cellIndex, list);
  }
  if (
    cellIndex - 1 >= 0 &&
    board[lineIndex][cellIndex - 1] === board[lineIndex][cellIndex] &&
    list.some(e => _.isEqual(e, [lineIndex, cellIndex - 1])) < 1
  ) {
    list.push([lineIndex, cellIndex - 1]);
    searchLinks(board, lineIndex, cellIndex - 1, list);
  }
  return list;
};

export const reaction = board => {
  const list = [];
  _.forEach(board, (line, lineIndex) => {
    _.forEach(line, (cell, cellIndex) => {
      if (
        cell > 0 &&
        list.some(e => e.some(e2 => _.isEqual(e2, [lineIndex, cellIndex]))) < 1
      ) {
        list.push(
          searchLinks(board, lineIndex, cellIndex, [[lineIndex, cellIndex]])
        );
      }
    });
  });
  const result = list.filter(chain => chain.length > 3);
  return result;
};

const COLOR = {
  1: 'red',
  2: 'blue',
  3: 'yellow',
  4: 'white'
};

export const draw = (game, ctx) => {
  ctx.clearRect(0, 0, 500, 600);
  ctx.strokeRect(0, 0, 300, 600);
  if (game.nextPieces) {
    ctx.fillStyle = 'black';
    ctx.font = '15px Arial';
    ctx.textAlign = 'start';
    ctx.fillText('Next pieces :', 350, 25);
    ctx.fillText('Score :', 350, 225);
    ctx.fillText(game.score, 350, 250);
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

export const drawPause = ctx => {
  ctx.clearRect(0, 0, 500, 600);
  ctx.fillStyle = 'white';
  ctx.font = '26px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Press SPACE to start or resume the game.', 250, 293);
};

export const drawGameOver = (game, ctx) => {
  ctx.clearRect(0, 0, 500, 600);
  ctx.fillStyle = 'white';
  ctx.font = '26px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', 250, 243);
  ctx.fillText(`Your score : ${game.score}`, 250, 293);
  ctx.fillText(`Press 'R' to restart a game.`, 250, 343);
};

export const drawChain = (game, reactionList, ctx) => {
  reactionList.forEach(line => {
    line.forEach(cell => {
      ctx.fillStyle = 'grey';
      ctx.clearRect(cell[1] * 50, cell[0] * 50, 50, 50);
      ctx.fillRect(cell[1] * 50, cell[0] * 50, 50, 50);
      ctx.strokeRect(cell[1] * 50, cell[0] * 50, 50, 50);
    });
  });
  ctx.fillStyle = 'white';
  ctx.font = '42px Arial';
  const score =
    reactionList.reduce((accumulator, line) => line.length + accumulator, 0) *
    100 *
    game.combo;
  ctx.textAlign = 'center';
  ctx.fillText(`COMBO x ${game.combo}`, 150, 270);
  ctx.strokeText(`COMBO x ${game.combo}`, 150, 270);
  ctx.fillText(`+ ${score} Pts !`, 150, 316);
  ctx.strokeText(`+ ${score} Pts !`, 150, 316);
};

export const isSpaceInBoard = board =>
  // return true or false if just one case is > 0 (full) and the next is 0 (empty)
  board.some((line, lineIndex) =>
    line.some(
      (cell, cellIndex) =>
        lineIndex + 1 < board.length &&
        cell > 0 &&
        board[lineIndex + 1][cellIndex] === 0
    )
  );

export const isGameOver = board => board[0][2];
