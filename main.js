(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ----- Mobile Drawer
  const drawer = $("#drawer");
  const burger = $("#burger");
  const closeBtn = $("#drawerClose");
  const backdrop = $("#drawerBackdrop");

  const openDrawer = () => {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const closeDrawer = () => {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger?.addEventListener("click", () => {
    if (drawer.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  });
  closeBtn?.addEventListener("click", closeDrawer);
  backdrop?.addEventListener("click", closeDrawer);
  $$(".drawer__link").forEach(a => a.addEventListener("click", closeDrawer));

  // ----- Smooth anchor offset (fixed header)
  const header = $(".header");
  const headerH = () => (header ? header.getBoundingClientRect().height : 0);

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const id = href.slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const y = window.scrollY + el.getBoundingClientRect().top - headerH() - 10;
    window.scrollTo({ top: y, behavior: "smooth" });
  });

  // ----- Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((ent) => {
      if (ent.isIntersecting) {
        ent.target.classList.add("is-in");
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(el => io.observe(el));

  // ----- Magnetic buttons
  const mags = $$(".magnetic");
  const finePointer = window.matchMedia && window.matchMedia('(pointer:fine)').matches;
  if (!prefersReduce && finePointer) {
    mags.forEach((btn) => {
      let raf = 0;
      const strength = 0.35;
      btn.addEventListener("mousemove", (ev) => {
        const r = btn.getBoundingClientRect();
        const dx = ev.clientX - (r.left + r.width / 2);
        const dy = ev.clientY - (r.top + r.height / 2);
        const tx = dx * strength;
        const ty = dy * strength;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = `translate(${tx}px, ${ty}px)`;
        });
      });
      btn.addEventListener("mouseleave", () => {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transition = "transform .18s ease";
        btn.style.transform = "";
        setTimeout(() => (btn.style.transition = ""), 200);
      });
    });
  }

  // ----- Canvas particles (fast)
  const canvas = $("#fx");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  let W = 0, H = 0;
  const resize = () => {
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  window.addEventListener("resize", resize, { passive: true });
  resize();

  const rand = (a, b) => a + Math.random() * (b - a);

  const palette = [
    { r: 127, g: 92, b: 255, a: 0.9 },
    { r: 0, g: 255, b: 213, a: 0.85 },
    { r: 255, g: 59, b: 212, a: 0.65 },
  ];

  const N = prefersReduce ? 0 : Math.floor((W * H) / (window.innerWidth < 760 ? 42000 : 32000));
  const parts = Array.from({ length: clamp(N, 18, 70) }, () => {
    const c = palette[(Math.random() * palette.length) | 0];
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.18, 0.18), vy: rand(-0.10, 0.22),
      r: rand(0.8, 2.2),
      c,
      p: rand(0.25, 0.95),
    };
  });

  const draw = () => {
    ctx.clearRect(0, 0, W, H);

    // soft glow background
    const g = ctx.createRadialGradient(W * 0.25, H * 0.2, 10, W * 0.25, H * 0.2, Math.max(W, H) * 0.7);
    g.addColorStop(0, "rgba(127,92,255,0.14)");
    g.addColorStop(0.45, "rgba(0,255,213,0.06)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // particles
    for (const p of parts) {
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      const alpha = p.p * (0.75 + 0.25 * Math.sin((p.x + p.y) * 0.005));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.c.r},${p.c.g},${p.c.b},${alpha * 0.45})`;
      ctx.arc(p.x, p.y, p.r * 2.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.c.r},${p.c.g},${p.c.b},${alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // subtle links (nearby)
    for (let i = 0; i < parts.length; i++) {
      for (let j = i + 1; j < parts.length; j++) {
        const a = parts[i], b = parts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          const t = 1 - Math.sqrt(d2) / 120;
          ctx.strokeStyle = `rgba(255,255,255,${t * 0.08})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  requestAnimationFrame(draw);
})();