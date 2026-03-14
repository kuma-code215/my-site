(() => {
  document.body.classList.add("js-enabled");

  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  setupReveal(revealItems);
  setupPointerLight();

  function setupReveal(elements) {
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 80, 260)}ms`;
      observer.observe(element);
    });
  }

  function setupPointerLight() {
    let rafId = 0;

    const update = (x, y) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const xp = `${x}%`;
        const yp = `${y}%`;
        document.documentElement.style.setProperty("--mouse-x", xp);
        document.documentElement.style.setProperty("--mouse-y", yp);
      });
    };

    window.addEventListener("pointermove", (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      update(x, y);
    });
  }
})();
