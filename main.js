// Smooth-ish anchor scrolling (without heavy libs)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Mobile drawer
const drawer = document.getElementById('drawer');
const menuBtn = document.getElementById('menuBtn');
const menuClose = document.getElementById('menuClose');
const setDrawer = (open) => {
  drawer.classList.toggle('is-open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  menuBtn.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
};
menuBtn?.addEventListener('click', () => setDrawer(!drawer.classList.contains('is-open')));
menuClose?.addEventListener('click', () => setDrawer(false));
drawer?.addEventListener('click', (e) => {
  if (e.target === drawer) setDrawer(false);
});
drawer?.querySelectorAll('a[href^="#"]').forEach(l => l.addEventListener('click', () => setDrawer(false)));

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  for (const ent of entries) {
    if (ent.isIntersecting) {
      ent.target.classList.add('is-in');
      io.unobserve(ent.target);
    }
  }
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Subtle 3D tilt (pointer)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = 9;
    const onMove = (ev) => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width;
      const y = (ev.clientY - r.top) / r.height;
      const rx = (y - 0.5) * -max;
      const ry = (x - 0.5) * max;
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };
    const onLeave = () => { el.style.transform = 'rotateX(0) rotateY(0)'; };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
  });
}

// Quick form: create email draft & copy
const form = document.getElementById('quickForm');
const toast = document.getElementById('toast');
const showToast = () => {
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
};

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const name = String(fd.get('name') || '').trim() || '（匿名）';
  const msg = String(fd.get('message') || '').trim() || '（相談内容なし）';
  const draft = `【お名前】\n${name}\n\n【相談内容】\n${msg}\n\n【希望の雰囲気】\nゲーミング / シネマティック / ネオン\n\n【納期】\n（未定）\n`;

  try {
    await navigator.clipboard.writeText(draft);
    showToast();
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = draft;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast();
  }
});

// Footer year
document.getElementById('year').textContent = String(new Date().getFullYear());

// Cinematic particle field + neon streaks (Canvas)
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');

let w = 0, h = 0, dpr = 1;
const resize = () => {
  dpr = Math.min(2, window.devicePixelRatio || 1);
  w = Math.floor(window.innerWidth);
  h = Math.floor(window.innerHeight);
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};
resize();
window.addEventListener('resize', resize);

const rand = (a, b) => a + Math.random() * (b - a);

const particles = Array.from({ length: 120 }, () => ({
  x: rand(0, w),
  y: rand(0, h),
  r: rand(0.6, 2.2),
  vx: rand(-0.15, 0.25),
  vy: rand(-0.08, 0.18),
  a: rand(0.12, 0.55),
  hue: rand(190, 290),
}));

const streaks = Array.from({ length: 10 }, () => ({
  x: rand(-w, w),
  y: rand(0, h),
  len: rand(240, 520),
  spd: rand(0.25, 0.55),
  w: rand(1, 2.5),
  a: rand(0.06, 0.14),
  hue: rand(190, 320),
}));

let mx = w * 0.5, my = h * 0.5;
window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

let t = 0;
function frame(){
  t += 0.006;
  ctx.clearRect(0,0,w,h);

  // soft nebula gradients
  const g1 = ctx.createRadialGradient(mx, my, 20, mx, my, Math.max(w,h) * 0.65);
  g1.addColorStop(0, 'rgba(37,246,255,0.10)');
  g1.addColorStop(0.35, 'rgba(139,92,255,0.06)');
  g1.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g1;
  ctx.fillRect(0,0,w,h);

  // streaks
  for (const s of streaks){
    s.x += s.spd;
    if (s.x - s.len > w + 120) {
      s.x = -rand(w * 0.6, w);
      s.y = rand(0, h);
      s.len = rand(240, 520);
      s.hue = rand(190, 320);
    }

    const angle = -0.25 + Math.sin(t * 0.7) * 0.06;
    const dx = Math.cos(angle) * s.len;
    const dy = Math.sin(angle) * s.len;

    const lg = ctx.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
    lg.addColorStop(0, `hsla(${s.hue}, 100%, 70%, ${s.a})`);
    lg.addColorStop(0.6, `hsla(${s.hue+30}, 100%, 65%, ${s.a*0.35})`);
    lg.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.strokeStyle = lg;
    ctx.lineWidth = s.w;
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - dx, s.y - dy);
    ctx.stroke();
  }

  // particle field
  for (const p of particles){
    // drift
    const ox = (mx - w * 0.5) * 0.00025;
    const oy = (my - h * 0.5) * 0.00025;

    p.x += p.vx + ox;
    p.y += p.vy + oy;

    if (p.x < -30) p.x = w + 30;
    if (p.x > w + 30) p.x = -30;
    if (p.y < -30) p.y = h + 30;
    if (p.y > h + 30) p.y = -30;

    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // subtle grid
  ctx.globalAlpha = 0.06;
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1;
  const gap = 64;
  const shift = (t * 120) % gap;
  for (let x = -gap; x < w + gap; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x + shift, 0);
    ctx.lineTo(x + shift, h);
    ctx.stroke();
  }
  for (let y = -gap; y < h + gap; y += gap) {
    ctx.beginPath();
    ctx.moveTo(0, y + shift);
    ctx.lineTo(w, y + shift);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(frame);
}

if (!prefersReduced) frame();
