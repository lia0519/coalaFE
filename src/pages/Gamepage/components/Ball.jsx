import React from 'react';
export default function Ball({ x, y, radius }) {
  return <circle className="ball" cx={x} cy={y} r={radius} />;
}
