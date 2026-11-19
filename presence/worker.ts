interface Env { ROOMS: DurableObjectNamespace<PresenceRoom> }
type Peer = { id: string; name: string; x: number; y: number };
export class PresenceRoom {
  constructor(private ctx: DurableObjectState, private env: Env) {}
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") !== "websocket") return new Response("WebSocket required", { status: 426 });
    const pair = new WebSocketPair();
    const client = pair[0], server = pair[1];
    const id = crypto.randomUUID().slice(0, 8);
    const name = "VISITOR " + id.slice(0, 4).toUpperCase();
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id, name, x: 0.5, y: 0.5 } satisfies Peer);
    const peers = this.peers().filter((p) => p.id !== id);
    server.send(JSON.stringify({ type: "welcome", id, peers }));
    this.broadcast({ type: "join", peer: { id, name, x: 0.5, y: 0.5 } }, server);
    return new Response(null, { status: 101, webSocket: client });
  }
  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    let data: { type?: string; x?: number; y?: number };
    try { data = JSON.parse(typeof message === "string" ? message : new TextDecoder().decode(message)); } catch { return; }
    if (data.type !== "move") return;
    const peer = ws.deserializeAttachment<Peer>();
    if (!peer) return;
    peer.x = Math.max(0, Math.min(1, Number(data.x) || 0));
    peer.y = Math.max(0, Math.min(1, Number(data.y) || 0));
    ws.serializeAttachment(peer);
    this.broadcast({ type: "move", peer }, ws);
  }
  webSocketClose(ws: WebSocket) { this.leave(ws); }
  webSocketError(ws: WebSocket) { this.leave(ws); }
  private peers(): Peer[] { return this.ctx.getWebSockets().map((ws) => ws.deserializeAttachment<Peer>()).filter((p): p is Peer => !!p); }
  private broadcast(message: unknown, except?: WebSocket) {
    const encoded = JSON.stringify(message);
    for (const ws of this.ctx.getWebSockets()) { if (ws === except) continue; try { ws.send(encoded); } catch { ws.close(); } }
  }
  private leave(ws: WebSocket) {
    const peer = ws.deserializeAttachment<Peer>();
    try { ws.close(); } catch {}
    if (peer) this.broadcast({ type: "leave", id: peer.id });
  }
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== "/room") return new Response("Not found", { status: 404 });
    const id = env.ROOMS.idFromName("vinith-portfolio");
    return env.ROOMS.get(id).fetch(request);
  }
};