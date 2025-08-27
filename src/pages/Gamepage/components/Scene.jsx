import React, { useEffect, useReducer, useRef } from 'react';
import { LEVELS } from '../logic/levels';
import { MOVEMENT, getNewGameState, getGameStateFromLevel } from '../logic/core';
import { registerListener } from '../logic/utils';

import Lives from './Lives';
import Block from './Block';
import Paddle from './Paddle';
import Ball from './Ball';

const MOVEMENT_KEYS = { LEFT: [65, 37], RIGHT: [68, 39] }; // A/←, D/→
const STOP_KEY = 32;            // Space
const UPDATE_EVERY = 1000 / 60; // 60fps

// 점수 기반 레벨업 & 가속 상수
const LEVEL_UP_EVERY   = 10;    // (0.5초=1점 기준) 10점마다 레벨업 ≈ 5초/레벨
const SPEED_BASE       = 1.0;
const SPEED_PER_LEVEL  = 0.25;
const MAX_SPEED        = 3.5;

const getProjectors = (containerSize, gameSize) => {
  const widthRatio = containerSize.width / gameSize.width;
  const heightRatio = containerSize.height / gameSize.height;
  const unitOnScreen = Math.min(widthRatio, heightRatio);
  return {
    projectDistance: d => d * unitOnScreen,
    projectVector: v => v.scaleBy(unitOnScreen),
  };
};

const getInitialState = (containerSize) => {
  const game = getGameStateFromLevel(LEVELS[0]);  // 레벨1 구성
  const { projectDistance, projectVector } = getProjectors(containerSize, game.size);
  return {
    level: 1,
    game,
    containerSize,
    projectDistance,
    projectVector,
    time: Date.now(),
    stopTime: undefined,
    movement: undefined,
  };
};

const ACTION = {
  CONTAINER_SIZE_CHANGE: 'CONTAINER_SIZE_CHANGE',
  KEY_DOWN: 'KEY_DOWN',
  KEY_UP: 'KEY_UP',
  TICK: 'TICK',
};

const HANDLER = {
  [ACTION.CONTAINER_SIZE_CHANGE]: (state, containerSize) => ({
    ...state,
    containerSize,
    ...getProjectors(containerSize, state.game.size),
  }),
  [ACTION.KEY_DOWN]: (state, key) => {
    if (MOVEMENT_KEYS.LEFT.includes(key)) return { ...state, movement: MOVEMENT.LEFT };
    if (MOVEMENT_KEYS.RIGHT.includes(key)) return { ...state, movement: MOVEMENT.RIGHT };
    return state;
  },
  [ACTION.KEY_UP]: (state, key) => {
    if (key === STOP_KEY) {
      if (state.game.ended) {
        // 재시작(레벨1로)
        const game = getGameStateFromLevel(LEVELS[0]);
        return { ...state, level: 1, game, stopTime: undefined, time: Date.now(), movement: undefined };
      }
      // 일시정지 토글
      if (state.stopTime) {
        return { ...state, stopTime: undefined, time: state.time + Date.now() - state.stopTime };
      } else {
        return { ...state, stopTime: Date.now(), movement: undefined };
      }
    }
    if (MOVEMENT_KEYS.LEFT.includes(key) || MOVEMENT_KEYS.RIGHT.includes(key)) {
      return { ...state, movement: undefined };
    }
    return state;
  },
  [ACTION.TICK]: (state) => {
    if (state.stopTime) return state;

    const now = Date.now();
    const elapsed = now - state.time;

    // 물리 업데이트(점수/생존시간 누적)
    const updatedGame = getNewGameState(state.game, state.movement, elapsed);

    // 점수 → 레벨 계산 & 가속
    const nextLevel = Math.max(1, Math.floor(updatedGame.score / LEVEL_UP_EVERY) + 1);
    const nextSpeed = Math.min(SPEED_BASE + (nextLevel - 1) * SPEED_PER_LEVEL, MAX_SPEED);
    const gameWithSpeed = { ...updatedGame, speed: nextSpeed };

    return { ...state, time: now, level: nextLevel, game: gameWithSpeed };
  },
};

const reducer = (state, { type, payload }) => {
  const handler = HANDLER[type];
  return handler ? handler(state, payload) : state;
};

// ⚠️ props 이름을 containerSize로 쓰고 있지만, 실제로는 {width, height, onGameOver}가 들어옵니다.
export default function Scene(containerSize) {
  const [state, dispatch] = useReducer(reducer, containerSize, getInitialState);
  const act = (type, payload) => dispatch({ type, payload });

  const { projectDistance, projectVector, level, game } = state;
  const { blocks, paddle, ball, size: { width, height }, lives, score, ended } = game;

  // 게임오버 감지 → 한 번만 콜백 호출
  const prevEnded = useRef(false);
  useEffect(() => {
    if (ended && !prevEnded.current) {
      if (typeof containerSize.onGameOver === 'function') {
        containerSize.onGameOver(score);
      }
    }
    prevEnded.current = ended;
  }, [ended, score, containerSize]);

  useEffect(() => act('CONTAINER_SIZE_CHANGE', containerSize), [containerSize]);

  useEffect(() => {
    const onKeyDown = ({ which }) => act('KEY_DOWN', which);
    const onKeyUp   = ({ which }) => act('KEY_UP', which);
    const tick = () => act('TICK');

    const timerId = setInterval(tick, UPDATE_EVERY);
    const un1 = registerListener('keydown', onKeyDown);
    const un2 = registerListener('keyup', onKeyUp);
    return () => { clearInterval(timerId); un1(); un2(); };
  }, []);

  const viewWidth  = projectDistance(width);
  const viewHeight = projectDistance(height);
  const unit = projectDistance(ball.radius);

  return (
    <svg width={viewWidth} height={viewHeight} className="scene">
      {/* HUD */}
      <text x={unit} y={unit * 2}   fontSize={unit} className="level" fontWeight="700">LEVEL: {level}</text>
      <text x={unit} y={unit * 3.2} fontSize={unit} className="level">SCORE: {score}</text>
      <Lives lives={lives} containerWidth={viewWidth} unit={unit} />

      {/* Blocks / Paddle / Ball */}
      {blocks.map(({ density, position, width, height }) => (
        <Block
          key={`${position.x}-${position.y}`}
          density={density}
          width={projectDistance(width)}
          height={projectDistance(height)}
          {...projectVector(position)}
        />
      ))}
      <Paddle
        width={projectDistance(paddle.width)}
        height={projectDistance(paddle.height)}
        {...projectVector(paddle.position)}
      />
      <Ball {...projectVector(ball.center)} radius={unit} />

      {/* Overlay */}
      {(ended || state.stopTime) && (
        <g>
          <rect x="0" y="0" width={viewWidth} height={viewHeight} fill="rgba(0,0,0,0.45)" />
          <text x={viewWidth/2} y={viewHeight/2 - unit*2} textAnchor="middle" fontSize={unit*1.6} className="level" fontWeight="bold">
            {ended ? 'GAME OVER' : 'PAUSED'}
          </text>
          <text x={viewWidth/2} y={viewHeight/2} textAnchor="middle" fontSize={unit*1.2} className="level">
            SCORE: {score}
          </text>
          <text x={viewWidth/2} y={viewHeight/2 + unit*2} textAnchor="middle" fontSize={unit} fill="#cbd5e1">
            Space 로 {ended ? '재시작' : '계속'}하기
          </text>
        </g>
      )}
    </svg>
  );
}
