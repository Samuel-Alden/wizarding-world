// js/magic.js
import { springTo, isReducedMotion } from './spring.js';

export function initMagic() {
  if (isReducedMotion()) { document.body.classList.add('reduced-motion'); return; }
  initStarfield();
  initSparkles();
}

function initStarfield() {
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, stars;
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = [];
    const count = Math.floor((w * h) / 9000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 0.02 + 0.004,
        tw: Math.random() * 2 + 0.5
      });
    }
  }
  function draw() {
    ctx.clearRect(0,0,w,h);
    for (const s of stars) {
      s.a += s.s;
      const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(s.a * s.tw));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(243,217,139,${0.2 + 0.5 * twinkle})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize);
  requestAnimationFrame(draw);
}

function initSparkles() {
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('.gold-sparkle');
    if (!t) return;
    spawnSparkle(t);
  });
}
function spawnSparkle(el) {
  const rect = el.getBoundingClientRect();
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('div');
    s.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#F3D98B"/></svg>';
    s.style.cssText = `position:fixed; pointer-events:none; z-index:99; left:${rect.left + rect.width/2}px; top:${rect.top + rect.height/2}px;`;
    document.body.appendChild(s);
    springTo(s, { opacity: 0, x: (Math.random()*40-20), y: (Math.random()*40-20), scale: 0 }, { dampingRatio: 1, response: 0.5 });
    setTimeout(() => s.remove(), 600);
  }
}
