(() => {
  document.body.classList.add("js-enabled");

  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const year = document.querySelector("[data-year]");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  setupReveal(revealItems);

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
})();
