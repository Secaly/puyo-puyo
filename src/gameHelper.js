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
  const result = list.filter(chain => chain.length > 5);
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
