import React, { useRef, useEffect, useState } from 'react';
import Scene from './components/Scene';
import RankPanel from './components/RankPanel';
import { registerListener } from './logic/utils';
import './styles/Game.css';

const GAME_RATIO = 0.75; // 600/800
const STORAGE_KEY = 'breakout_ranks_v1';

export default function BreakoutPage() {
  // 왼쪽(게임) 칼럼 실폭을 재기 위한 ref
  const leftColRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // 랭크(로컬 저장)
  const [ranks, setRanks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const onResize = () => {
      if (!leftColRef.current) return;
      // 왼쪽 칼럼의 실제 너비로 게임 사이즈 계산
      const w = Math.max(300, Math.floor(leftColRef.current.clientWidth));
      const h = Math.floor(w * GAME_RATIO);
      setSize({ width: w, height: h });
    };
    const un = registerListener('resize', onResize);
    onResize();
    return un;
  }, []);

  // 게임오버 콜백: 점수 저장 → 상위 50개로 유지
  const handleGameOver = (score) => {
    const entry = { id: Date.now(), score, ts: new Date().toISOString() };
    const next = [...ranks, entry].sort((a, b) => b.score - a.score).slice(0, 50);
    setRanks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const clearRanks = () => {
    setRanks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="page">
      {/* 남색 배경의 넓은 밴드 */}
      <div className="game-band">
        {/* 헤더(선택) */}
        <div className="game-head">
          <span className="game-badge">Breakout game</span>
          <h2 className="game-title">끝까지 버텨 점수를 올려보자!</h2>
          <p className="game-sub">왼쪽: 게임 / 오른쪽: 랭킹 (공유 예정)</p>
        </div>

        {/* 2칼럼 레이아웃 */}
        <div className="game-layout">
          {/* 왼쪽: 게임 */}
          <div className="game-col game-left" ref={leftColRef}>
            {size.width > 0 && (
              <div className="scene-container" style={{ height: size.height }}>
                <Scene
                  width={size.width}
                  height={size.height}
                  onGameOver={handleGameOver}
                />
              </div>
            )}
          </div>

          {/* 오른쪽: 랭크 */}
          <div className="game-col game-right">
            <RankPanel bests={ranks} onClear={clearRanks} />
          </div>
        </div>
      </div>
    </div>
  );
}
