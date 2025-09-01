const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

async function http(path, opts = {}) {
  const res = await fetch(BASE_URL + path, { headers: { 'Content-Type': 'application/json' }, credentials: 'include', ...opts });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
}

// PUBLIC_INTERFACE
export const api = {
  /** Placeholder auth endpoints. Wire these to backend when available. */
  async login(username) {
    // return await http('/auth/login', { method: 'POST', body: JSON.stringify({ username }) });
    return { id: 'guest', username };
  },
  async profile() {
    // return await http('/me');
    return { id: 'guest', username: 'Guest' };
  },
  async startArena() {
    // return await http('/arena/start', { method: 'POST' });
    return { ok: true };
  },
};
