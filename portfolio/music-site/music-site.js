(() => {
  document.body.classList.add("js-enabled");

  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  setupReveal(revealItems);
  setupBackgroundParallax();

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

  function setupBackgroundParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let ticking = false;

    const update = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      document.documentElement.style.setProperty("--parallax-harp", `${(y * 0.018).toFixed(2)}px`);
      document.documentElement.style.setProperty("--parallax-texture", `${(y * 0.034).toFixed(2)}px`);
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) {
          return;
        }
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }
})();
