// src/pages/Gamepage/components/RankPanel.jsx
import React from 'react';

export default function RankPanel({ bests = [] }) {
  // DB에서 받아온 배열을 그대로 사용한다고 가정: [{ id, name, score }, ...]
  const top = bests.slice(0, 10);

  return (
    <aside className="rank-panel">
      <div className="rank-head">
        <h3>RANK</h3>
        {/* 초기화 버튼 제거 */}
      </div>

      {top.length === 0 ? (
        <div className="rank-empty">아직 랭킹이 없어요.</div>
      ) : (
        <ol className="rank-list">
          {top.map((r, i) => (
            <li className="rank-item" key={r.id ?? `${r.name}-${i}`}>
              <span className={`rank-no ${i === 0 ? 'is-gold' : ''}`}>{i + 1}</span>
              <span className="rank-name">{r.name ?? '익명'}</span>
              <span className="rank-score">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
      {/* 시간/날짜는 제거 */}
    </aside>
  );
}
