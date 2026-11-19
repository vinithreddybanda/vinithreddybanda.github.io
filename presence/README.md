# Live visitor presence

This small Cloudflare Durable Object provides the real cross-visitor cursor channel. It is deliberately separate from the GitHub Pages static site.

## Deploy

1. Install Wrangler: `npm i -g wrangler`
2. Authenticate: `wrangler login`
3. From this folder run: `wrangler deploy`
4. Copy the deployed Worker URL and append `/room`, for example `wss://vinith-portfolio-presence.<account>.workers.dev/room`.
5. Set the GitHub Actions repository variable `PUBLIC_PRESENCE_URL` to that WebSocket URL and expose it to the Astro build step. The browser connects only when this value exists.

The static portfolio works without the Worker. Without the endpoint, the header reports only the current visitor. With it, visitor count and pointer positions are broadcast to everyone in the room. The Worker does not store cursor history or personal information.

## Local

`npx wrangler dev` starts the presence Worker locally. Set `PUBLIC_PRESENCE_URL=ws://127.0.0.1:8787/room` in the local Astro environment to test it.

## Notes

The Worker uses one Durable Object room for the portfolio. Each socket receives a short-lived generated visitor label. Coordinates are normalized to the viewport and are not persisted.
