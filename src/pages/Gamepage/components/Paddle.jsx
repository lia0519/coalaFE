import React from 'react';
export default function Paddle({ x, y, width, height }) {
  return <rect className="paddle" x={x} y={y} width={width} height={height} />;
}
