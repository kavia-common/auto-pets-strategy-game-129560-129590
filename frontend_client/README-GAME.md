# Auto Pets Strategy Game - Frontend Client

This is a lightweight, accessible React client implementing a simplified Super Auto Pets-like experience.

Features:
- Lobby with sign-in (mock) and Arena start
- Shop phase with roll, freeze, buy (pets and food)
- Team management: drag to rearrange, merge, level ups on merge
- Battle viewer with simulated mirror battle and detailed log
- HUD sidebar with Gold, Turn, Lives, Trophies
- Result screen placeholder
- Theming, keyboard-accessible drag/drop, high-contrast badges and buttons

Environment:
- Configure backend base URL via REACT_APP_API_BASE_URL in a .env file (see .env.example)

Routing:
- / (Lobby)
- /game (Game board)
- /profile (Profile)
- /result (Run result)

Notes:
- API calls are stubbed in src/services/api.js and can be wired to a backend REST API.
- WebSocket support can be added later in services with an event bus to update state in real-time.
