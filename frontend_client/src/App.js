import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { GameProvider, useGame } from './context/GameContext';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Profile from './pages/Profile';
import Result from './pages/Result';

// PUBLIC_INTERFACE
function AppShell() {
  /** Main shell renders header, sidebar HUD, and inner routed content (Lobby/Game/Profile). */
  const { gold, turn, lives, trophies, user, resetRun } = useGame();
  const location = useLocation();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const atGame = location.pathname.startsWith('/game');

  return (
    <div className="app-shell" data-theme="light" aria-live="polite">
      <header className="header" role="banner">
        <div className="brand">
          <div aria-hidden="true" className="brand-logo" />
          <div>
            <h1>Auto Pets Strategy</h1>
            <span>Playful auto-battler</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link className="btn btn-ghost" to="/">Lobby</Link>
          <Link className="btn btn-ghost" to="/profile">Profile</Link>
          <button className="btn btn-secondary" onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} aria-label="Toggle theme">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          {atGame && (
            <button className="btn btn-danger" onClick={resetRun} aria-label="Reset current run">Reset Run</button>
          )}
        </div>
      </header>

      <aside className="sidebar" role="complementary" aria-label="Game HUD">
        <div className="panel">
          <div className="hud-item">
            <span className="hud-title">Player</span>
            <div className="hud-value">{user?.username || 'Guest'}</div>
          </div>
          <div className="hud-item">
            <span className="hud-title">Gold</span>
            <div className="hud-value">🪙 {gold}</div>
          </div>
          <div className="hud-item">
            <span className="hud-title">Turn</span>
            <div className="hud-value">🔄 {turn}</div>
          </div>
          <div className="hud-item">
            <span className="hud-title">Lives</span>
            <div className="hud-value">❤️ {lives}</div>
          </div>
          <div className="hud-item">
            <span className="hud-title">Trophies</span>
            <div className="hud-value">🏆 {trophies}</div>
          </div>
        </div>

        <div className="panel" aria-live="polite">
          <div className="section-title"><span>Tips</span></div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>Drag pets to rearrange</li>
            <li>Buy pets/food in Shop</li>
            <li>Freeze to keep for next turn</li>
            <li>Roll to refresh shop</li>
          </ul>
        </div>
      </aside>

      <main className="main" role="main">
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game" element={<Game />} />
          <Route path="/result" element={<Result />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root app: providers and router. */
  return (
    <GameProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </GameProvider>
  );
}
