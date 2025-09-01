import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';

// PUBLIC_INTERFACE
export default function Lobby() {
  /** Lobby with Arena mode start and lightweight auth. */
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const { setUser, startRun, resetRun } = useGame();
  const nav = useNavigate();

  const startArena = async () => {
    setBusy(true);
    try {
      await api.startArena();
      startRun();
      nav('/game');
    } catch (e) {
      // no-op
    } finally {
      setBusy(false);
    }
  };

  const login = async () => {
    setBusy(true);
    try {
      const u = await api.login(username || 'Guest');
      setUser(u);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="panel">
        <h2>Welcome to Auto Pets Strategy</h2>
        <p style={{ color: '#4b5563' }}>Manage your team of adorable pets, buy from the shop, and battle to earn trophies!</p>
      </div>

      <div className="panel" role="region" aria-label="Authentication">
        <h3>Sign in</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input className="input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} aria-label="Username" />
          <button className="btn" onClick={login} disabled={busy} aria-label="Login">Login</button>
          <button className="btn btn-ghost" onClick={() => { setUsername(''); setUser({ id: 'guest', username: 'Guest' }); }} aria-label="Continue as guest">Continue as Guest</button>
        </div>
      </div>

      <div className="panel" role="region" aria-label="Game Modes">
        <h3>Arena Mode</h3>
        <p>Endless run: build your team and try to win 10 trophies before losing all lives.</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" onClick={startArena} disabled={busy} aria-label="Start Arena">Start Arena</button>
          <button className="btn btn-ghost" onClick={resetRun} aria-label="Reset progress">Reset Progress</button>
        </div>
      </div>
    </div>
  );
}
