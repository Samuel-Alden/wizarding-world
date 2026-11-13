// js/spring.js — Lightweight Apple-style spring animation engine
// Independent springs for X/Y/scale/opacity, interruptible & velocity-aware.

const REDUCED = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const schedule = typeof requestAnimationFrame === 'function'
  ? (cb) => requestAnimationFrame(cb)
  : (cb) => setTimeout(cb, 16);

const cancel = typeof cancelAnimationFrame === 'function'
  ? (id) => cancelAnimationFrame(id)
  : (id) => clearTimeout(id);

function makeParams({ dampingRatio = 1, response = 0.4, mass = 1 } = {}) {
  const wn = 4 / response; 
  return { k: wn * wn * mass, c: 2 * dampingRatio * wn * mass, mass };
}

function step(s, target, p, dt) {
  if (dt > 0.1) dt = 0.1;
  const a = (-p.k * (s.x - target) - p.c * s.v) / p.mass;
  const v1 = s.v + a * dt;
  const x1 = s.x + v1 * dt;
  return { x: x1, v: v1 };
}

function isSettled(s, target, p) {
  return Math.abs(s.x - target) < 0.008 && Math.abs(s.v) < 0.04;
}

export class Spring {
  constructor(values, opts) {
    this.state = {}; this.target = {}; this.velocity = {};
    this.opts = { dampingRatio: 1, response: 0.4, mass: 1, ...(opts || {}) };
    this.p = makeParams(this.opts);
    for (const key in values) {
      this.state[key] = values[key];
      this.target[key] = values[key];
      this.velocity[key] = 0;
    }
    this.running = false; this.raf = null; this.last = 0;
    this.listeners = new Set(); this.onStopCb = null;
  }
  setTargets(obj) { let changed = false; for (const k in obj) { if (this.target[k] !== obj[k]) { this.target[k] = obj[k]; changed = true; } } if (changed) this.go(); }
  go() {
    if (this.running) return;
    this.running = true; this.last = performance.now();
    const loop = (now) => {
      if (!this.running) return;
      const dt = Math.min((now - this.last) / 1000, 0.1);
      this.last = now;
      this.tick(dt);
      if (this.running) this.raf = schedule(loop);
    };
    this.raf = schedule(loop);
  }
  tick(dt) {
    const p = this.p; let allSettled = true;
    for (const key in this.state) {
      const s = step({ x: this.state[key], v: this.velocity[key] }, this.target[key], p, dt);
      this.state[key] = s.x; this.velocity[key] = s.v;
      if (!isSettled(s, this.target[key], p)) allSettled = false;
    }
    this.listeners.forEach(cb => cb(this.state));
    if (allSettled) {
      for (const key in this.state) this.state[key] = this.target[key];
      this.running = false; if (this.raf) cancel(this.raf); this.raf = null;
      if (this.onStopCb) this.onStopCb();
    }
  }
  stop() { this.running = false; cancel(this.raf); this.raf = null; }
  subscribe(cb) { this.listeners.add(cb); return () => this.listeners.delete(cb); }
  onStop(cb) { this.onStopCb = cb; }
}

export function springTo(el, targets, opts) {
  if (REDUCED) {
    Object.assign(el.style, { ...targets, opacity: targets.opacity ?? 1 });
    return;
  }
  if (el._spring) el._spring.stop();
  const cur = readLive(el);
  const spring = new Spring(cur, opts);
  el._spring = spring;
  spring.subscribe(s => apply(el, s));
  spring.setTargets(targets);
  spring.onStop(() => { if (el._spring === spring) el._spring = null; });
  return spring;
}

function readLive(el) {
  const t = el.style.transform;
  let x = 0, y = 0, scale = 1;
  if (t && t !== 'none') {
    const m = t.match(/translate3d\(([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\)\s*scale\(([-\d.]+)\)/);
    if (m) { x = parseFloat(m[1]); y = parseFloat(m[2]); scale = parseFloat(m[4]); }
  }
  const opacity = parseFloat(el.style.opacity);
  return { x, y, scale, opacity: isNaN(opacity) ? 1 : opacity };
}

function apply(el, s) {
  el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) scale(${s.scale})`;
  el.style.opacity = String(s.opacity);
}

export const isReducedMotion = () => REDUCED;
