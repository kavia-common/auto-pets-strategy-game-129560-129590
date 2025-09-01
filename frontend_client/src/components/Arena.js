import React from 'react';
import { useGame } from '../context/GameContext';
import PetCard from './PetCard';

// PUBLIC_INTERFACE
export default function Arena() {
  /** Battle arena viewer with log. */
  const { team, battleLog, startBattle } = useGame();
  return (
    <div className="arena" role="region" aria-label="Battle Arena">
      <div className="section-title">
        <span>Battle Arena</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={startBattle} aria-label="Start battle">Battle!</button>
        </div>
      </div>
      <div className="teams">
        <div className="section-title"><span>Your Lineup</span></div>
        <div className="team-row">
          {team.map((p, i) => (
            <div key={i} className={`slot ${p ? 'occupied' : ''}`}>
              {p ? <PetCard pet={p} /> : <span aria-hidden="true" style={{ color: '#9ca3af', fontSize: 12 }}>Empty</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="section-title"><span>Battle Log</span></div>
      <div className="log" aria-live="polite">
        {battleLog.length === 0 ? <div>Press Battle to simulate a fight.</div> :
          battleLog.map((l, i) => <div key={i}>• {l}</div>)
        }
      </div>
    </div>
  );
}
