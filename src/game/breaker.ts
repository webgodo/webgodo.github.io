// Career Breaker: an Arkanoid-style game where every brick row is a job.
// Plain Canvas 2D, fixed-step physics, pointer + keyboard input, self-playing attract mode.

export interface Level { id: string; label: string; color: string; }
export interface BreakerEvents {
  onReveal(levelIndex: number): void;       // a row was fully cleared
  onScore(score: number): void;
  onLives(lives: number): void;
  onGameOver(summary: Summary): void;
  onWin(summary: Summary): void;
  onTakeover(): void;                       // player took control from attract mode
}
export interface Summary { score: number; bricks: number; totalBricks: number; seconds: number; revealed: number; }

type Power = 'multi' | 'wide' | 'slow';
interface Ball { x: number; y: number; vx: number; vy: number; }
interface Brick { r: number; c: number; alive: boolean; power?: Power; }
interface Drop { x: number; y: number; power: Power; }

const POWER_LABEL: Record<Power, string> = { multi: 'REACT', wide: 'TS', slow: 'CACHE' };
const POWER_COLOR: Record<Power, string> = { multi: '#00e5ff', wide: '#7cff4a', slow: '#ffe600' };

export class Breaker {
  private ctx: CanvasRenderingContext2D;
  private W = 0; private H = 0;
  private cols = 10;
  private bw = 0; private bh = 0; private top = 0; private gap = 3;
  private bricks: Brick[] = [];
  private balls: Ball[] = [];
  private drops: Drop[] = [];
  private paddle = { x: 0, w: 0, h: 8, targetX: 0 };
  private baseSpeed = 0;
  private score = 0; private lives = 3;
  private alive = 0; private total = 0;
  private revealedRows = new Set<number>();
  private attract = true; private running = false; private over = false;
  private raf = 0; private last = 0; private acc = 0; private startedAt = 0;
  private wideUntil = 0; private slowUntil = 0;
  private keys = { left: false, right: false };
  private particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
  private flash = ''; private flashUntil = 0;
  private ro: ResizeObserver | null = null;
  private sfx: Partial<Record<'paddle' | 'wall' | 'brick' | 'powerup' | 'reveal' | 'lose' | 'gameover' | 'win', (row?: number) => void>> = {};

  constructor(private canvas: HTMLCanvasElement, private levels: Level[], private ev: BreakerEvents) {
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('no 2d context');
    this.ctx = ctx;
    this.bind();
    this.ro = new ResizeObserver(() => this.layout());
    this.ro.observe(canvas);
    this.layout();
    this.reset();
  }

  setSfx(s: typeof this.sfx) { this.sfx = s; }

  /* ---------- lifecycle ---------- */
  start() { if (this.running) return; this.running = true; this.last = performance.now(); this.raf = requestAnimationFrame(this.frame); }
  stop() { this.running = false; cancelAnimationFrame(this.raf); }
  destroy() { this.stop(); this.ro?.disconnect(); this.unbind(); }

  /** Reset the whole board. `attract` = self-playing demo until the player touches it. */
  reset(attract = true) {
    this.attract = attract; this.over = false;
    this.score = 0; this.lives = 3; this.revealedRows.clear();
    this.drops = []; this.particles = []; this.wideUntil = 0; this.slowUntil = 0;
    this.buildBricks();
    this.serve();
    this.startedAt = performance.now();
    this.ev.onScore(0); this.ev.onLives(this.lives);
  }

  takeover() {
    if (!this.attract) return;
    this.attract = false; this.score = 0; this.revealedRows.clear(); this.lives = 3;
    this.buildBricks(); this.serve(); this.startedAt = performance.now();
    this.ev.onScore(0); this.ev.onLives(this.lives); this.ev.onTakeover();
  }

  isAttract() { return this.attract; }
  /** Paint one frame without starting the loop (used on phones until the first tap). */
  drawOnce() { this.draw(); }
  /** Cheat: reveal every level. */
  revealAll() { for (const b of this.bricks) b.alive = false; this.alive = 0; this.levels.forEach((_, r) => this.revealedRows.add(r)); this.over = true; this.flashMsg("CHEAT ACTIVATED"); this.ev.onWin(this.summary()); }

  /* ---------- layout ---------- */
  private layout() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = Math.max(240, rect.width || 600);
    const portrait = cssW < 520;
    const cssH = portrait ? Math.round(cssW * 1.15) : Math.round(cssW * 0.62);
    this.canvas.width = Math.round(cssW * dpr); this.canvas.height = Math.round(cssH * dpr);
    this.canvas.style.height = `${cssH}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.W = cssW; this.H = cssH;
    this.cols = portrait ? 6 : 10;
    this.gap = portrait ? 2 : 3;
    this.bw = (this.W - this.gap * (this.cols + 1)) / this.cols;
    this.bh = portrait ? 14 : 16;
    this.top = 10;
    this.paddle.w = portrait ? this.W * 0.26 : this.W * 0.16;
    this.paddle.h = 8;
    this.baseSpeed = portrait ? this.H * 0.55 : this.H * 0.7; // px per second
    if (this.bricks.length && this.bricks.length !== this.levels.length * this.cols) this.buildBricks();
    this.paddle.x = Math.min(Math.max(0, this.paddle.x), this.W - this.paddle.w);
    if (!this.running && this.bricks.length) this.draw(); // keep a static frame visible while paused
  }

  private buildBricks() {
    this.bricks = [];
    const rows = this.levels.length;
    for (let r = 0; r < rows; r++) for (let c = 0; c < this.cols; c++) this.bricks.push({ r, c, alive: true });
    // sprinkle power-ups: ~1 per row, deterministic by position so it's fair
    for (let r = 0; r < rows; r++) {
      const c = (r * 7 + 3) % this.cols;
      const b = this.bricks[r * this.cols + c];
      b.power = (['multi', 'wide', 'slow'] as Power[])[r % 3];
    }
    this.alive = this.total = this.bricks.length;
  }

  private serve() {
    this.paddle.x = (this.W - this.paddle.w) / 2;
    const speed = this.speed();
    const angle = (-Math.PI / 2) + (Math.random() * 0.6 - 0.3);
    this.balls = [{ x: this.W / 2, y: this.H - 40, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }];
  }

  private speed() {
    const progress = 1 - this.alive / this.total;
    let s = this.baseSpeed * (1 + progress * 0.6);
    if (performance.now() < this.slowUntil) s *= 0.7;
    return s;
  }

  /* ---------- input ---------- */
  private onPointer = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.W;
    this.paddle.targetX = x - this.paddle.w / 2;
    if (this.attract && e.type === 'pointerdown') this.takeover();
    if (e.type === 'pointerdown' && this.over) this.reset(false);
  };
  private onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') { this.keys.left = e.type === 'keydown'; if (this.attract && e.type === 'keydown') this.takeover(); e.preventDefault(); }
    if (e.key === 'ArrowRight' || e.key === 'd') { this.keys.right = e.type === 'keydown'; if (this.attract && e.type === 'keydown') this.takeover(); e.preventDefault(); }
    if ((e.key === ' ' || e.key === 'Enter') && e.type === 'keydown') { if (this.attract) this.takeover(); else if (this.over) this.reset(false); e.preventDefault(); }
  };
  private bind() {
    this.canvas.addEventListener('pointermove', this.onPointer);
    this.canvas.addEventListener('pointerdown', this.onPointer);
    this.canvas.addEventListener('keydown', this.onKey);
    this.canvas.addEventListener('keyup', this.onKey);
  }
  private unbind() {
    this.canvas.removeEventListener('pointermove', this.onPointer);
    this.canvas.removeEventListener('pointerdown', this.onPointer);
    this.canvas.removeEventListener('keydown', this.onKey);
    this.canvas.removeEventListener('keyup', this.onKey);
  }

  /* ---------- loop ---------- */
  private frame = (t: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (t - this.last) / 1000); this.last = t;
    this.acc += dt;
    const step = 1 / 240;
    while (this.acc >= step) { this.update(step); this.acc -= step; }
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private update(dt: number) {
    if (this.over) return;
    const p = this.paddle;
    const wide = performance.now() < this.wideUntil;
    const targetW = (this.W < 520 ? this.W * 0.26 : this.W * 0.16) * (wide ? 1.6 : 1);
    p.w += (targetW - p.w) * 0.2;

    // paddle movement
    if (this.attract) {
      const b = this.balls.reduce((a, b) => (b.vy > 0 && b.y > a.y ? b : a), this.balls[0]);
      const wobble = Math.sin(performance.now() / 700) * p.w * 0.25; // imperfect AI
      p.targetX = b.x - p.w / 2 + wobble;
    } else if (this.keys.left || this.keys.right) {
      p.targetX = p.x + (this.keys.right ? 1 : -1) * this.W * 1.4 * dt;
    }
    p.x += (p.targetX - p.x) * Math.min(1, dt * 25);
    p.x = Math.max(0, Math.min(this.W - p.w, p.x));

    // balls
    const py = this.H - 22;
    for (const b of this.balls) {
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (b.x < 3) { b.x = 3; b.vx = Math.abs(b.vx); this.sfx.wall?.(); }
      if (b.x > this.W - 3) { b.x = this.W - 3; b.vx = -Math.abs(b.vx); this.sfx.wall?.(); }
      if (b.y < 3) { b.y = 3; b.vy = Math.abs(b.vy); this.sfx.wall?.(); }
      // paddle
      if (b.vy > 0 && b.y >= py - 3 && b.y <= py + p.h && b.x >= p.x - 3 && b.x <= p.x + p.w + 3) {
        const hit = ((b.x - p.x) / p.w) * 2 - 1; // -1..1
        const angle = -Math.PI / 2 + hit * (Math.PI / 3);
        const s = this.speed();
        b.vx = Math.cos(angle) * s; b.vy = Math.sin(angle) * s; b.y = py - 4;
        this.sfx.paddle?.();
      }
      // bricks
      const r = Math.floor((b.y - this.top) / (this.bh + this.gap));
      const c = Math.floor((b.x - this.gap) / (this.bw + this.gap));
      if (r >= 0 && r < this.levels.length && c >= 0 && c < this.cols) {
        const k = this.bricks[r * this.cols + c];
        if (k?.alive) {
          const bx = this.gap + c * (this.bw + this.gap), by = this.top + r * (this.bh + this.gap);
          const fromSide = Math.min(b.x - bx, bx + this.bw - b.x) < Math.min(b.y - by, by + this.bh - b.y);
          if (fromSide) b.vx = -b.vx; else b.vy = -b.vy;
          this.breakBrick(k, bx + this.bw / 2, by + this.bh / 2);
        }
      }
    }
    // lost balls
    const before = this.balls.length;
    this.balls = this.balls.filter((b) => b.y < this.H + 10);
    if (this.balls.length === 0 && before > 0) this.loseLife();

    // drops
    for (const d of this.drops) d.y += this.H * 0.25 * dt;
    this.drops = this.drops.filter((d) => {
      if (d.y >= py - 6 && d.y <= py + p.h + 6 && d.x >= p.x && d.x <= p.x + p.w) { this.applyPower(d.power); return false; }
      return d.y < this.H + 10;
    });
    // particles
    for (const q of this.particles) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 400 * dt; q.life -= dt; }
    this.particles = this.particles.filter((q) => q.life > 0);
  }

  private breakBrick(k: Brick, cx: number, cy: number) {
    k.alive = false; this.alive--;
    this.score += 10 + k.r * 2;
    this.ev.onScore(this.score);
    this.sfx.brick?.(k.r);
    const color = this.levels[k.r].color;
    for (let i = 0; i < 6; i++) this.particles.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 160, vy: (Math.random() - 0.8) * 160, life: 0.4 + Math.random() * 0.3, color });
    if (k.power && !this.attract) this.drops.push({ x: cx, y: cy, power: k.power });
    // row cleared?
    const rowAlive = this.bricks.some((b) => b.r === k.r && b.alive);
    if (!rowAlive && !this.revealedRows.has(k.r)) {
      this.revealedRows.add(k.r);
      this.score += 100; this.ev.onScore(this.score);
      this.sfx.reveal?.();
      this.flashMsg(`LEVEL CLEAR: ${this.levels[k.r].label}`);
      if (!this.attract) this.ev.onReveal(k.r);
    }
    if (this.alive === 0) {
      this.over = true;
      this.sfx.win?.();
      if (this.attract) setTimeout(() => this.reset(true), 2500);
      else this.ev.onWin(this.summary());
    }
  }

  private applyPower(pw: Power) {
    this.sfx.powerup?.();
    this.flashMsg(`+${POWER_LABEL[pw]}`);
    this.score += 50; this.ev.onScore(this.score);
    if (pw === 'wide') this.wideUntil = performance.now() + 12000;
    if (pw === 'slow') this.slowUntil = performance.now() + 8000;
    if (pw === 'multi') {
      const src = this.balls[0]; if (!src) return;
      const s = Math.hypot(src.vx, src.vy);
      for (const a of [-0.5, 0.5]) {
        const ang = Math.atan2(src.vy, src.vx) + a;
        this.balls.push({ x: src.x, y: src.y, vx: Math.cos(ang) * s, vy: Math.sin(ang) * s });
      }
    }
  }

  private loseLife() {
    if (this.attract) { this.serve(); return; }
    this.lives--; this.ev.onLives(this.lives);
    this.sfx.lose?.();
    if (this.lives <= 0) {
      this.over = true; this.sfx.gameover?.();
      this.ev.onGameOver(this.summary());
    } else { this.flashMsg('☕ -1'); this.serve(); }
  }

  private summary(): Summary {
    return { score: this.score, bricks: this.total - this.alive, totalBricks: this.total, seconds: Math.round((performance.now() - this.startedAt) / 1000), revealed: this.revealedRows.size };
  }

  private flashMsg(m: string) { this.flash = m; this.flashUntil = performance.now() + 1400; }

  /* ---------- render ---------- */
  private draw() {
    const g = this.ctx; const { W, H } = this;
    g.fillStyle = '#05050f'; g.fillRect(0, 0, W, H);
    // bricks
    for (const k of this.bricks) {
      const x = this.gap + k.c * (this.bw + this.gap), y = this.top + k.r * (this.bh + this.gap);
      if (!k.alive) {
        if (this.revealedRows.has(k.r)) { g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(x, y, this.bw, this.bh); }
        continue;
      }
      g.fillStyle = this.levels[k.r].color; g.fillRect(x, y, this.bw, this.bh);
      g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x, y, this.bw, 2);
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, y + this.bh - 3, this.bw, 3);
      if (k.power && !this.attract) { g.fillStyle = '#fff'; g.fillRect(x + this.bw / 2 - 2, y + this.bh / 2 - 2, 4, 4); }
    }
    // row labels for cleared rows
    g.font = '8px "Press Start 2P", monospace'; g.textBaseline = 'middle'; g.textAlign = 'center';
    for (const r of this.revealedRows) {
      const y = this.top + r * (this.bh + this.gap) + this.bh / 2;
      g.fillStyle = this.levels[r].color; g.fillText(this.levels[r].label, W / 2, y);
    }
    // drops
    for (const d of this.drops) {
      g.fillStyle = POWER_COLOR[d.power]; g.fillRect(d.x - 14, d.y - 6, 28, 12);
      g.fillStyle = '#000'; g.font = '7px "Press Start 2P", monospace'; g.fillText(POWER_LABEL[d.power], d.x, d.y + 1);
    }
    // paddle
    const p = this.paddle, py = H - 22;
    g.fillStyle = '#00e5ff'; g.fillRect(p.x, py, p.w, p.h);
    g.fillStyle = '#ff2d95'; g.fillRect(p.x, py, 6, p.h); g.fillRect(p.x + p.w - 6, py, 6, p.h);
    g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(p.x, py, p.w, 2);
    // balls
    g.fillStyle = '#ffe600';
    for (const b of this.balls) g.fillRect(Math.round(b.x) - 3, Math.round(b.y) - 3, 6, 6);
    // particles
    for (const q of this.particles) { g.globalAlpha = Math.max(0, q.life * 2); g.fillStyle = q.color; g.fillRect(q.x, q.y, 3, 3); }
    g.globalAlpha = 1;
    // flash message
    if (performance.now() < this.flashUntil) {
      g.font = `${W < 520 ? 9 : 12}px "Press Start 2P", monospace`; g.fillStyle = '#ffe600';
      g.shadowColor = '#ffe600'; g.shadowBlur = 8; g.fillText(this.flash, W / 2, H * 0.55); g.shadowBlur = 0;
    }
    // attract banner
    if (this.attract) {
      const on = Math.floor(performance.now() / 600) % 2 === 0;
      g.font = `${W < 520 ? 9 : 12}px "Press Start 2P", monospace`;
      if (on) { g.fillStyle = '#fff'; g.shadowColor = '#00e5ff'; g.shadowBlur = 10; g.fillText(W < 520 ? 'TAP TO PLAY' : 'PRESS START / CLICK TO PLAY', W / 2, H * 0.66); g.shadowBlur = 0; }
      g.fillStyle = '#9a9ab8'; g.font = '7px "Press Start 2P", monospace'; g.fillText('DEMO', W - 24, H - 8);
    }
  }
}
