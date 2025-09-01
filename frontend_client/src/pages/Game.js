import React from 'react';
import TeamBoard from '../components/TeamBoard';
import Arena from '../components/Arena';
import Shop from '../components/Shop';
import { useGame } from '../context/GameContext';

// PUBLIC_INTERFACE
export default function Game() {
  /** Main game layout: team on top, arena middle, shop bottom. */
  const { nextTurn, gold, turn } = useGame();
  return (
    <div className="board" role="region" aria-label="Game Board">
      <div className="section-title">
        <span>Your Team</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="badge">Turn {turn}</span>
          <span className="badge">Gold 🪙 {gold}</span>
          <button className="btn" onClick={nextTurn} aria-label="End turn">End Turn</button>
        </div>
      </div>
      <TeamBoard />
      <Arena />
      <Shop />
    </div>
  );
}
