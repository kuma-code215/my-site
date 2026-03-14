(() => {
  document.body.classList.add("js-enabled");

  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  const counters = Array.from(document.querySelectorAll("[data-count-to]"));
  const yearElements = Array.from(document.querySelectorAll("[data-year]"));

  yearElements.forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  setupReveal(revealElements);
  setupCounters(counters);

  function setupReveal(elements) {
    if (!elements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    elements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index * 70, 260)}ms`;
      observer.observe(element);
    });
  }

  function setupCounters(items) {
    if (!items.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    items.forEach((item) => observer.observe(item));
  }

  function animateCounter(element) {
    const target = Number.parseInt(element.dataset.countTo || "0", 10);
    if (!Number.isFinite(target) || target < 0) {
      element.textContent = "0";
      return;
    }

    const duration = 1200;
    const start = performance.now();

    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = String(value);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }
})();
