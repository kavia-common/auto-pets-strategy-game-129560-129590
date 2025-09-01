import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

// PUBLIC_INTERFACE
export default function Result() {
  /** Victory/Defeat screen placeholder. Navigate here when run ends. */
  const { lives, trophies, resetRun } = useGame();
  const nav = useNavigate();

  const isVictory = trophies >= 10;
  const isDefeat = lives <= 0;

  return (
    <div className="page" role="region" aria-label="Run Result">
      <div className="panel" style={{ textAlign: 'center' }}>
        <h2>{isVictory ? 'Victory! 🏆' : isDefeat ? 'Defeat 💥' : 'Run In Progress'}</h2>
        <p>Summary: {trophies} trophies, {lives} lives remaining.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn" onClick={() => nav('/game')}>Back to Game</button>
          <button className="btn btn-secondary" onClick={() => { resetRun(); nav('/'); }}>Return to Lobby</button>
        </div>
      </div>
    </div>
  );
}
