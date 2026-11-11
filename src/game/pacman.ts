// Scope Creep: a Pac-Man-style easter egg. Plain Canvas 2D, fixed-step update,
// swipe + keyboard input, one hand-authored maze. No engine, no reveals, pure fun.

export interface PacEvents {
  onScore(score: number): void;
  onLives(lives: number): void;
  onEnd(kind: 'over' | 'win', score: number): void;
}

export const GHOSTS = [
  { name: 'BUG', color: '#ff2d95' },
  { name: 'DEADLINE', color: '#ff8a00' },
  { name: 'SCOPE CREEP', color: '#00e5ff' },
  { name: 'LEGACY', color: '#b14bff' },
] as const;

// # wall · . pellet · o power pellet (☕) · - ghost door · G ghost house · P start · space = empty path
const MAZE = [
  '###################',
  '#o.......#.......o#',
  '#.##.###.#.###.##.#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.###.#.###.####',
  '####.#       #.####',
  '####.# ##-## #.####',
  '    .  #GGG#  .    ',
  '####.# ##### #.####',
  '####.#       #.####',
  '####.# ##### #.####',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#..#.....P.....#..#',
  '##.#.#.#####.#.#.##',
  '#....#...#...#....#',
  '#.######.#.######.#',
  '#o...............o#',
  '###################',
];
const COLS = MAZE[0].length, ROWS = MAZE.length;
const HOUSE = { x: 9, y: 9 }, DOOR = { x: 9, y: 7 };

const enum Dir { None, Up, Right, Down, Left }
const DX = [0, 0, 1, 0, -1], DY = [0, -1, 0, 1, 0];
const OPP = [Dir.None, Dir.Down, Dir.Left, Dir.Up, Dir.Right];
const SCATTER = [{ x: COLS - 2, y: 1 }, { x: 1, y: 1 }, { x: COLS - 2, y: ROWS - 2 }, { x: 1, y: ROWS - 2 }];

interface Mover { x: number; y: number; dir: Dir; want: Dir; speed: number; }
type GhostState = 'house' | 'exit' | 'roam' | 'fright' | 'eyes';
interface Ghost extends Mover { i: number; state: GhostState; release: number; decided: string; }

export class Pacman {
  private ctx: CanvasRenderingContext2D;
  private T = 16; private W = 0; private H = 0; private top = 0;
  private cells: string[][] = [];
  private pellets = 0;
  private pac: Mover = { x: 9, y: 15, dir: Dir.None, want: Dir.None, speed: 5.5 };
  private ghosts: Ghost[] = [];
  private score = 0; private lives = 3; private combo = 0;
  private running = false; private over = false;
  private freeze = 0;                         // seconds the world stays still (READY!, death)
  private frightUntil = 0; private modeAt = 0; private chase = false; private clock = 0;
  private raf = 0; private last = 0; private acc = 0;
  private flash = ''; private flashUntil = 0; private flashColor = '#ffe600';
  private wakaAt = 0; private dying = 0;
  private ro: ResizeObserver | null = null;
  private swipe: { x: number; y: number } | null = null;
  private sfx: Partial<Record<'waka' | 'power' | 'eatGhost' | 'death' | 'gameover' | 'win', () => void>> = {};

  constructor(private canvas: HTMLCanvasElement, private ev: PacEvents) {
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('no 2d context');
    this.ctx = ctx;
    this.bind();
    const host = canvas.parentElement ?? canvas;
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(host);
    this.layout();
    this.reset();
  }

  setSfx(s: typeof this.sfx) { this.sfx = s; }

  /* ---------- lifecycle ---------- */
  start() { if (this.running) return; this.running = true; this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  destroy() { this.stop(); this.ro?.disconnect(); this.unbind(); }

  reset() {
    this.cells = MAZE.map((r) => r.split(''));
    this.pellets = this.cells.flat().filter((c) => c === '.' || c === 'o').length;
    this.score = 0; this.lives = 3; this.over = false; this.clock = 0;
    this.ev.onScore(0); this.ev.onLives(3);
    this.place('READY!');
  }

  /** Put everyone back at their start tiles and freeze briefly. */
  private place(msg: string) {
    this.pac = { x: 9, y: 15, dir: Dir.None, want: Dir.None, speed: 5.5 };
    this.ghosts = GHOSTS.map((_, i) => ({ x: HOUSE.x + (i % 3) - 1, y: HOUSE.y, dir: Dir.None, want: Dir.None, speed: 4.4, i, state: 'house', release: 1 + i * 3, decided: '' }));
    this.combo = 0; this.frightUntil = 0; this.chase = false; this.modeAt = this.clock + 7; this.dying = 0;
    this.freeze = 1.6; this.flashMsg(msg, '#ffe600', 1.6);
  }

  /* ---------- layout ---------- */
  private layout() {
    const host = this.canvas.parentElement ?? this.canvas;
    const r = host.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.T = Math.max(8, Math.floor(Math.min((r.width || 320) / COLS, (r.height || 480) / (ROWS + 1))));
    this.top = this.T;                       // one tile of HUD above the maze
    this.W = this.T * COLS; this.H = this.T * (ROWS + 1);
    this.canvas.width = Math.round(this.W * dpr); this.canvas.height = Math.round(this.H * dpr);
    this.canvas.style.width = `${this.W}px`; this.canvas.style.height = `${this.H}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.cells.length) this.draw();
  }

  /* ---------- input ---------- */
  private onKey = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    const d = k === 'arrowup' || k === 'w' ? Dir.Up : k === 'arrowright' || k === 'd' ? Dir.Right : k === 'arrowdown' || k === 's' ? Dir.Down : k === 'arrowleft' || k === 'a' ? Dir.Left : Dir.None;
    if (d === Dir.None) return;
    this.pac.want = d; e.preventDefault();
  };
  private onPointer = (e: PointerEvent) => {
    if (e.type === 'pointerdown') { this.swipe = { x: e.clientX, y: e.clientY }; return; }
    if (!this.swipe) return;
    const dx = e.clientX - this.swipe.x, dy = e.clientY - this.swipe.y;
    if (Math.hypot(dx, dy) < 18) { if (e.type === 'pointerup') this.swipe = null; return; }
    this.pac.want = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? Dir.Right : Dir.Left) : (dy > 0 ? Dir.Down : Dir.Up);
    this.swipe = null;
  };
  private bind() {
    window.addEventListener('keydown', this.onKey);
    for (const t of ['pointerdown', 'pointermove', 'pointerup'] as const) this.canvas.addEventListener(t, this.onPointer);
  }
  private unbind() {
    window.removeEventListener('keydown', this.onKey);
    for (const t of ['pointerdown', 'pointermove', 'pointerup'] as const) this.canvas.removeEventListener(t, this.onPointer);
  }

  /* ---------- loop ---------- */
  private frame = (t: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (t - this.last) / 1000); this.last = t;
    this.acc += dt;
    const step = 1 / 120;
    while (this.acc >= step) { this.update(step); this.acc -= step; }
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private tile(c: number, r: number) { return this.cells[r]?.[((c % COLS) + COLS) % COLS] ?? '#'; }
  private open(c: number, r: number, ghost?: Ghost) {
    const t = this.tile(c, r);
    if (t === '-') return !!ghost && (ghost.state === 'exit' || ghost.state === 'eyes');
    return t !== '#' && t !== undefined && r >= 0 && r < ROWS;
  }

  /** Move along `dir`; at tile centres apply `want` or stop at walls. Reversals are immediate. */
  private move(e: Mover, dt: number, ghost?: Ghost) {
    if (e.want !== Dir.None && e.want === OPP[e.dir]) e.dir = e.want;
    const cx = Math.round(e.x), cy = Math.round(e.y);
    const dx = DX[e.dir], dy = DY[e.dir];
    let nx = e.x + dx * e.speed * dt, ny = e.y + dy * e.speed * dt;
    const before = (e.x - cx) * dx + (e.y - cy) * dy, after = (nx - cx) * dx + (ny - cy) * dy;
    if (e.dir === Dir.None || (before <= 0 && after >= 0)) {
      const w = e.want;
      if (w !== Dir.None && this.open(cx + DX[w], cy + DY[w], ghost)) { e.dir = w; const over = Math.max(0, after); nx = cx + DX[w] * over; ny = cy + DY[w] * over; }
      else if (e.dir === Dir.None || !this.open(cx + dx, cy + dy, ghost)) { e.dir = Dir.None; nx = cx; ny = cy; }
    }
    e.x = nx < -0.5 ? nx + COLS : nx > COLS - 0.5 ? nx - COLS : nx; e.y = ny;
  }

  private update(dt: number) {
    if (this.over) return;
    if (this.dying) { this.dying -= dt; if (this.dying <= 0) { this.dying = 0; this.lives <= 0 ? this.end('over') : this.place('READY!'); } return; }
    if (this.freeze > 0) { this.freeze -= dt; return; }
    this.clock += dt;
    if (this.clock >= this.modeAt) { this.chase = !this.chase; this.modeAt = this.clock + (this.chase ? 20 : 7); for (const g of this.ghosts) if (g.state === 'roam') g.want = OPP[g.dir]; }

    // pac
    this.pac.speed = 6;
    this.move(this.pac, dt);
    const pc = Math.round(this.pac.x), pr = Math.round(this.pac.y);
    const t = this.tile(pc, pr);
    if (t === '.' || t === 'o') {
      this.cells[pr][((pc % COLS) + COLS) % COLS] = ' '; this.pellets--;
      this.score += t === 'o' ? 50 : 10; this.ev.onScore(this.score);
      if (t === 'o') { this.frightUntil = this.clock + 6; this.combo = 0; this.sfx.power?.(); for (const g of this.ghosts) if (g.state === 'roam' || g.state === 'fright') { g.state = 'fright'; g.want = OPP[g.dir]; } }
      else if (this.clock - this.wakaAt > 0.12) { this.wakaAt = this.clock; this.sfx.waka?.(); }
      if (this.pellets <= 0) { this.end('win'); return; }
    }

    // ghosts
    const fright = this.clock < this.frightUntil;
    for (const g of this.ghosts) {
      if (g.state === 'house') { g.release -= dt; if (g.release <= 0) { g.state = 'exit'; g.x = HOUSE.x; g.y = HOUSE.y; g.dir = Dir.Up; g.want = Dir.Up; } continue; }
      if (g.state === 'fright' && !fright) g.state = 'roam';
      g.speed = g.state === 'eyes' ? 10 : g.state === 'fright' ? 2.8 : g.state === 'exit' ? 3 : 4.4;
      const gc = Math.round(g.x), gr = Math.round(g.y);
      if (g.state === 'exit') { if (gr <= DOOR.y && Math.abs(g.y - DOOR.y) < 0.05) { g.state = fright ? 'fright' : 'roam'; g.decided = ''; } }
      else if (g.state === 'eyes' && gc === DOOR.x && gr === DOOR.y && Math.abs(g.x - DOOR.x) + Math.abs(g.y - DOOR.y) < 0.1) { g.state = 'house'; g.release = 0.8; g.x = HOUSE.x; g.y = HOUSE.y; g.dir = Dir.None; continue; }
      const key = `${gc},${gr}`;
      if (g.state !== 'exit' && g.decided !== key) { g.decided = key; g.want = this.choose(g, gc, gr); }
      this.move(g, dt, g);
      // collision
      if (Math.hypot(g.x - this.pac.x, g.y - this.pac.y) < 0.6) {
        if (g.state === 'fright') {
          g.state = 'eyes'; g.decided = '';
          const pts = 200 * 2 ** this.combo++; this.score += pts; this.ev.onScore(this.score);
          this.sfx.eatGhost?.(); this.flashMsg(`${GHOSTS[g.i].name} +${pts}`, GHOSTS[g.i].color, 1.2);
          this.freeze = 0.35;
        } else if (g.state === 'roam') {
          this.lives--; this.ev.onLives(this.lives); this.dying = 1.6; this.sfx.death?.();
          this.flashMsg(`${GHOSTS[g.i].name} GOT YOU`, GHOSTS[g.i].color, 1.6);
          return;
        }
      }
    }
  }

  /** Ghost AI: at each new tile pick the open neighbour closest to the target (never reverse, random when frightened). */
  private choose(g: Ghost, c: number, r: number): Dir {
    const p = this.pac, blinky = this.ghosts[0];
    let tx: number, ty: number;
    if (g.state === 'eyes') { tx = DOOR.x; ty = DOOR.y; }
    else if (!this.chase) { tx = SCATTER[g.i].x; ty = SCATTER[g.i].y; }
    else if (g.i === 0) { tx = p.x; ty = p.y; }
    else if (g.i === 1) { tx = p.x + DX[p.dir] * 4; ty = p.y + DY[p.dir] * 4; }
    else if (g.i === 2) { tx = 2 * (p.x + DX[p.dir] * 2) - blinky.x; ty = 2 * (p.y + DY[p.dir] * 2) - blinky.y; }
    else { const far = Math.hypot(p.x - g.x, p.y - g.y) > 8; tx = far ? p.x : SCATTER[3].x; ty = far ? p.y : SCATTER[3].y; }
    const opts: Dir[] = [];
    for (const d of [Dir.Up, Dir.Left, Dir.Down, Dir.Right]) if (d !== OPP[g.dir] && this.open(c + DX[d], r + DY[d], g)) opts.push(d);
    if (!opts.length) return OPP[g.dir];
    if (g.state === 'fright') return opts[Math.floor(Math.random() * opts.length)];
    return opts.reduce((best, d) => (Math.hypot(c + DX[d] - tx, r + DY[d] - ty) < Math.hypot(c + DX[best] - tx, r + DY[best] - ty) ? d : best), opts[0]);
  }

  private end(kind: 'over' | 'win') {
    this.over = true;
    kind === 'win' ? this.sfx.win?.() : this.sfx.gameover?.();
    this.ev.onEnd(kind, this.score);
  }

  private flashMsg(m: string, color = '#ffe600', secs = 1.2) { this.flash = m; this.flashColor = color; this.flashUntil = performance.now() + secs * 1000; }

  /* ---------- render ---------- */
  private draw() {
    const g = this.ctx, T = this.T, { W, H } = this;
    const now = performance.now();
    g.fillStyle = '#05050f'; g.fillRect(0, 0, W, H);
    g.save(); g.translate(0, this.top);
    // walls: filled block + neon edge wherever a wall meets open space
    g.fillStyle = '#12123a';
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (this.cells[r][c] === '#') g.fillRect(c * T, r * T, T, T);
    g.strokeStyle = '#3d5cff'; g.lineWidth = Math.max(1, T / 8); g.shadowColor = '#3d5cff'; g.shadowBlur = T / 3; g.beginPath();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (this.cells[r][c] !== '#') continue;
      const x = c * T, y = r * T, o = g.lineWidth / 2;
      if (this.cells[r - 1]?.[c] !== undefined && this.cells[r - 1][c] !== '#') { g.moveTo(x, y + o); g.lineTo(x + T, y + o); }
      if (this.cells[r + 1]?.[c] !== undefined && this.cells[r + 1][c] !== '#') { g.moveTo(x, y + T - o); g.lineTo(x + T, y + T - o); }
      if (this.cells[r][c - 1] !== undefined && this.cells[r][c - 1] !== '#') { g.moveTo(x + o, y); g.lineTo(x + o, y + T); }
      if (this.cells[r][c + 1] !== undefined && this.cells[r][c + 1] !== '#') { g.moveTo(x + T - o, y); g.lineTo(x + T - o, y + T); }
    }
    g.stroke(); g.shadowBlur = 0;
    // door
    g.fillStyle = '#ffb3d9'; g.fillRect(DOOR.x * T, (DOOR.y + 1) * T + T * 0.4, T, T * 0.2);
    // pellets + ☕
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const blink = Math.floor(now / 250) % 2 === 0;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const t = this.cells[r][c];
      if (t === '.') { g.fillStyle = '#ffd9a8'; const s = Math.max(2, T / 6); g.fillRect(c * T + T / 2 - s / 2, r * T + T / 2 - s / 2, s, s); }
      else if (t === 'o' && blink) this.drawCup(c * T + T / 2, r * T + T / 2);
    }
    // ghosts
    for (const gh of this.ghosts) this.drawGhost(gh, now);
    // pac
    const p = this.pac, px = p.x * T + T / 2, py = p.y * T + T / 2, R = T * 0.45;
    const dir = p.dir === Dir.None ? Dir.Right : p.dir;
    const base = [0, -Math.PI / 2, 0, Math.PI / 2, Math.PI][dir];
    const mouth = this.dying ? Math.min(Math.PI, (1.6 - this.dying) * 2.2) : p.dir === Dir.None ? 0.15 : 0.15 + Math.abs(Math.sin(now / 60)) * 0.55;
    g.fillStyle = '#ffe600'; g.shadowColor = '#ffe600'; g.shadowBlur = T / 3;
    g.beginPath(); g.moveTo(px, py); g.arc(px, py, R, base + mouth, base - mouth + Math.PI * 2); g.closePath(); g.fill();
    g.shadowBlur = 0;
    if (p.x > COLS - 1.5 || p.x < 0.5) { /* tunnel wrap ghost image */ const ox = p.x < 0.5 ? COLS * T : -COLS * T; g.beginPath(); g.moveTo(px + ox, py); g.arc(px + ox, py, R, base + mouth, base - mouth + Math.PI * 2); g.closePath(); g.fill(); }
    g.restore();
    // HUD
    g.font = `${Math.max(6, Math.round(T * 0.5))}px "Press Start 2P", monospace`; g.textBaseline = 'middle';
    g.textAlign = 'left'; g.fillStyle = '#ffe600'; g.fillText(`SCORE ${String(this.score).padStart(6, '0')}`, T / 2, T / 2);
    g.textAlign = 'right'; g.fillStyle = '#ff8a00'; g.fillText(`${'☕'.repeat(Math.max(0, this.lives))}${'·'.repeat(Math.max(0, 3 - this.lives))}`, W - T / 2, T / 2);
    // flash message
    if (now < this.flashUntil) {
      g.textAlign = 'center'; g.font = `${Math.max(7, Math.round(T * 0.55))}px "Press Start 2P", monospace`;
      g.fillStyle = this.flashColor; g.shadowColor = this.flashColor; g.shadowBlur = 10;
      g.fillText(this.flash, W / 2, this.top + (HOUSE.y + 2.5) * T); g.shadowBlur = 0;
    }
  }

  /** ☕ as pixel art (a font glyph would depend on the viewer's emoji font). */
  private drawCup(cx: number, cy: number) {
    const g = this.ctx, u = Math.max(1, this.T / 10);           // one "pixel"
    g.shadowColor = '#ffe600'; g.shadowBlur = u * 3;
    g.fillStyle = '#fff4dc'; g.fillRect(cx - 3 * u, cy - u, 6 * u, 4 * u);       // cup
    g.fillRect(cx + 3 * u, cy, 2 * u, 2 * u);                                     // handle
    g.fillStyle = '#5a2d0c'; g.fillRect(cx - 2 * u, cy - u, 4 * u, u);             // coffee
    g.fillStyle = '#ffe600'; g.fillRect(cx - 2 * u, cy - 4 * u, u, 2 * u); g.fillRect(cx, cy - 4.5 * u, u, 2 * u); g.fillRect(cx + 2 * u, cy - 4 * u, u, 2 * u); // steam
    g.shadowBlur = 0;
  }

  private drawGhost(gh: Ghost, now: number) {
    const g = this.ctx, T = this.T;
    const x = gh.x * T + T / 2, y = gh.y * T + T / 2, R = T * 0.45;
    const fright = gh.state === 'fright';
    const ending = fright && this.frightUntil - this.clock < 2 && Math.floor(now / 200) % 2 === 0;
    if (gh.state !== 'eyes') {
      g.fillStyle = fright ? (ending ? '#f4f4ff' : '#2b4bff') : GHOSTS[gh.i].color;
      g.shadowColor = g.fillStyle; g.shadowBlur = fright ? 0 : T / 4;
      g.beginPath(); g.arc(x, y - R * 0.1, R, Math.PI, 0); g.lineTo(x + R, y + R * 0.8);
      const wave = Math.floor(now / 120) % 2 ? 0 : R * 0.3;
      for (let i = 0; i < 3; i++) { const bx = x + R - (i * 2 + 1) * (R / 3); g.lineTo(bx, y + R * 0.5 + (i % 2 ? wave : R * 0.3 - wave)); g.lineTo(bx - R / 3, y + R * 0.8); }
      g.closePath(); g.fill(); g.shadowBlur = 0;
    }
    // eyes
    const ex = DX[gh.dir] * R * 0.2, ey = DY[gh.dir] * R * 0.2;
    g.fillStyle = fright ? (ending ? '#2b4bff' : '#f4f4ff') : '#fff';
    for (const s of [-1, 1]) {
      g.beginPath(); g.arc(x + s * R * 0.38, y - R * 0.15, R * 0.26, 0, Math.PI * 2); g.fill();
    }
    if (!fright) { g.fillStyle = '#1b1b6e'; for (const s of [-1, 1]) { g.beginPath(); g.arc(x + s * R * 0.38 + ex, y - R * 0.15 + ey, R * 0.13, 0, Math.PI * 2); g.fill(); } }
  }
}
