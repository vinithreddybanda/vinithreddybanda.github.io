# Shared visitor presence

The portfolio itself is static GitHub Pages. Real cross-visitor cursors and online counts use this optional Cloudflare Worker.

## Deploy once

1. Install Wrangler and authenticate: `npm i -g wrangler && wrangler login`.
2. From this repository run `wrangler deploy`.
3. Copy the Worker URL and append `/room`, for example `wss://vinith-portfolio-presence.<account>.workers.dev/room`.
4. In GitHub repository Settings → Secrets and variables → Actions → Variables, add `PUBLIC_PRESENCE_URL` with that WebSocket URL.
5. Push any commit or rerun the Pages workflow.

Without the variable, the site remains fully usable and reports only the current visitor. With it, visitors see each other's cursor and the online count. Cursor positions are transient, names are random session labels, and idle peers are removed.
