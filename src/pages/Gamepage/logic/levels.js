import { getRange } from './utils';

export const BLOCK_MAX_DENSITY = 3;
const getRandomBlock = () => Math.floor(Math.random() * BLOCK_MAX_DENSITY);
const getBlocks = (rows, columns) => getRange(rows).map(() => getRange(columns).map(getRandomBlock));

export const LEVELS = [
  { lives: 1, paddleWidth: 3.5, speed: 1.0, blocks: getBlocks(3, 6) },
  { lives: 1, paddleWidth: 3.0, speed: 1.4, blocks: getBlocks(4, 7) },
  { lives: 1, paddleWidth: 2.5, speed: 1.8, blocks: getBlocks(5, 8) },
  { lives: 1, paddleWidth: 2.0, speed: 2.2, blocks: getBlocks(6, 9) },
];
