// src/pages/Gamepage/logic/core.js
import Vector from './vector';
import { flatten, getRandomFrom, withoutElement, updateElement } from './utils';

const PADDLE_AREA = 1 / 3;
const BLOCK_HEIGHT = 1 / 3;
const PADDLE_HEIGHT = BLOCK_HEIGHT;
const BALL_RADIUS  = 1 / 5;
const DISTANCE_IN_MS = 0.005;

export const MOVEMENT = { LEFT: 'LEFT', RIGHT: 'RIGHT' };

const SCORE_MS_PER_POINT = 500;

const LEFT  = new Vector(-1, 0);
const RIGHT = new Vector( 1, 0);
const UP    = new Vector( 0,-1);
const DOWN  = new Vector( 0, 1);

const LEFT_UP  = LEFT.add(UP).normalize();
const RIGHT_UP = RIGHT.add(UP).normalize();

/* ── (삽입 위치 A) 블럭 리필 유틸 ───────────────────────────── */
const BLOCK_MAX_DENSITY = 3;
// 현재 보드의 size(정사각 스케일)에 맞춰 랜덤 블럭 rows행 생성
function makeRandomBlocks(size, rows) {
  const cols = size.width; // 가로 칸수 유지
  const blocksStart = ((size.height - size.height * PADDLE_AREA) - rows * BLOCK_HEIGHT) / 2;

  const blocks = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const density = Math.floor(Math.random() * BLOCK_MAX_DENSITY);
      blocks.push({
        density,
        position: new Vector(j, blocksStart + i * BLOCK_HEIGHT),
        width: 1,
        height: BLOCK_HEIGHT,
      });
    }
  }
  return blocks;
}
/* ───────────────────────────────────────────────────────────── */

export const getInitialPaddleAndBall = (width, height, paddleWidth) => {
  const paddleY = height - PADDLE_HEIGHT;
  const paddle = { position: new Vector((width - paddleWidth) / 2, paddleY), width: paddleWidth, height: PADDLE_HEIGHT };
  const ball   = { center: new Vector(height / 2, paddleY - BALL_RADIUS * 2), radius: BALL_RADIUS, direction: getRandomFrom(LEFT_UP, RIGHT_UP) };
  return { paddle, ball };
};

export const getGameStateFromLevel = ({ lives, paddleWidth, speed, blocks }) => {
  const width  = blocks[0].length;
  const height = width;

  const blocksStart = ((height - height * PADDLE_AREA) - blocks.length * BLOCK_HEIGHT) / 2;
  const rowsOfBlocks = blocks.map((row, i) =>
    row.map((density, j) => ({
      density,
      position: new Vector(j, blocksStart + (i * BLOCK_HEIGHT)),
      width: 1,
      height: BLOCK_HEIGHT
    }))
  );

  const size = { width, height };
  return {
    size,
    blocks: flatten(rowsOfBlocks),
    ...getInitialPaddleAndBall(size.width, size.height, paddleWidth),
    lives,
    speed,
    survivedMs: 0,
    score: 0,
    ended: false,
  };
};

const getDistortedDirection = (v, k = 0.3) => {
  const rand = () => Math.random() * k - k / 2;
  return v.add(new Vector(rand(), rand())).normalize();
};

const getNewPaddle = (paddle, size, distance, movement) => {
  if (!movement) return paddle;
  const dir = movement === MOVEMENT.LEFT ? LEFT : RIGHT;
  const { x } = paddle.position.add(dir.scaleBy(distance));
  const withX = nx => ({ ...paddle, position: new Vector(nx, paddle.position.y) });
  if (x < 0) return withX(0);
  if (x + paddle.width > size.width) return withX(size.width - paddle.width);
  return withX(x);
};

const isInBoundaries = (oneSide, otherSide, oneBoundary, otherBoundary) =>
  (oneSide >= oneBoundary && oneSide <= otherBoundary) ||
  (otherSide >= oneBoundary && otherSide <= otherBoundary);

const getAdjustedVector = (normal, vector, minAngle = 15) => {
  const angle = normal.angleBetween(vector);
  const maxAngle = 90 - minAngle;
  if (angle < 0) {
    if (angle > -minAngle) return normal.rotate(-minAngle);
    if (angle < -maxAngle) return normal.rotate(-maxAngle);
  } else {
    if (angle <  minAngle) return normal.rotate(minAngle);
    if (angle >  maxAngle) return normal.rotate(maxAngle);
  }
  return vector;
};

export const getNewGameState = (state, movement, timespan) => {
  if (state.ended) return state;

  const { size, speed, lives } = state;
  const distance = timespan * DISTANCE_IN_MS * speed;
  const paddle = getNewPaddle(state.paddle, size, distance, movement);

  // 시간/점수 누적 (0.25초마다 10점)
  const survivedMs = state.survivedMs + timespan;
  const score = Math.floor(survivedMs / SCORE_MS_PER_POINT);

  const { radius } = state.ball;
  const oldDir  = state.ball.direction;
  const newPos  = state.ball.center.add(oldDir.scaleBy(distance));
  const ballBottom = newPos.y + radius;

  if (ballBottom > size.height) {
    // 바닥에 닿으면 종료
    return { ...state, paddle, survivedMs, score, lives: lives - 1, ended: true };
  }

  const withBall = props => ({ ...state, paddle, survivedMs, score, ball: { ...state.ball, ...props } });
  const reflectTo = normal => {
    const distorted = getDistortedDirection(oldDir.reflect(normal));
    const dir = getAdjustedVector(normal, distorted);
    return withBall({ direction: dir });
  };

  const ballLeft = newPos.x - radius, ballRight = newPos.x + radius, ballTop = newPos.y - radius;
  const paddleLeft = paddle.position.x, paddleRight = paddleLeft + paddle.width, paddleTop = paddle.position.y;

  const goingDown = Math.abs(UP.angleBetween(oldDir)) > 90;
  const hitPaddle = goingDown && ballBottom >= paddleTop && ballRight >= paddleLeft && ballLeft <= paddleRight;
  if (hitPaddle) return reflectTo(UP);
  if (ballTop   <= 0) return reflectTo(DOWN);
  if (ballLeft  <= 0) return reflectTo(RIGHT);
  if (ballRight >= size.width) return reflectTo(LEFT);

  const block = state.blocks.find(({ position, width, height }) =>
    isInBoundaries(ballTop, ballBottom, position.y, position.y + height) &&
    isInBoundaries(ballLeft, ballRight, position.x, position.x + width)
  );

  if (block) {
    const density = block.density - 1;
    const newBlock = { ...block, density };
    const blocks = density < 0 ? withoutElement(state.blocks, block) : updateElement(state.blocks, block, newBlock);

    // 충돌 면 추정
    const blockTop = block.position.y;
    const blockBottom = blockTop + block.height;
    const blockLeft = block.position.x;

    const normal = (() => {
      if (ballTop > blockTop - radius && ballBottom < blockBottom + radius) {
        if (ballLeft < blockLeft) return LEFT;
        if (ballRight > blockLeft + block.width) return RIGHT;
      }
      return ballTop > blockTop ? DOWN : UP;
    })();

    // ── (삽입 위치 B) 블럭이 전멸하면 새로 리필 ──
    if (blocks.length === 0) {
      // 점수 200점(≈5초)마다 행 수 +1, 범위 3~8행
      const rows = Math.max(3, Math.min(8, 3 + Math.floor(score / 200)));
      const refill = makeRandomBlocks(state.size, rows);
      return { ...reflectTo(normal), blocks: refill };
    }
    // 기본: 갱신된 blocks 유지
    return { ...reflectTo(normal), blocks };
  }
  return withBall({ center: newPos });
};
