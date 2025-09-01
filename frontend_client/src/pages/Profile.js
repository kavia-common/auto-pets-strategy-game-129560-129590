import React from 'react';
import { useGame } from '../context/GameContext';

// PUBLIC_INTERFACE
export default function Profile() {
  /** Simple profile screen, extend when backend is connected. */
  const { user, trophies, lives, turn } = useGame();
  return (
    <div className="page" role="region" aria-label="Profile">
      <div className="panel">
        <h2>Profile</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          <div><strong>Username:</strong> {user?.username || 'Guest'}</div>
          <div><strong>Current Turn:</strong> {turn}</div>
          <div><strong>Trophies:</strong> {trophies}</div>
          <div><strong>Lives:</strong> {lives}</div>
        </div>
      </div>
    </div>
  );
}
