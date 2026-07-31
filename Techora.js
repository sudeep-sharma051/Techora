(function () {
  const carousel = document.getElementById("carousel");
  const slides = Array.from(carousel.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let current = 0;
  const AUTOPLAY_MS = 5000;
  let autoplayTimer = null;
  // ---- pause autoplay while the cursor is over the carousel ----
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  // ---- build dots ----
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("pointerdown", (e) => e.stopPropagation()); // don't let this trigger a drag
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  // ---- core: show a given slide (fade handled purely by CSS opacity) ----
  function goTo(index) {
    // the % + length trick makes this loop infinitely in both directions
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === current),
    );
    dots.forEach((d, i) => d.classList.toggle("is-active", i === current));

    // sync each slide's own color to the dots + arrow hover state
    carousel.style.setProperty("--accent", slides[current].dataset.color);
  }
  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  // ---- autoplay ----
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  // ---- arrow buttons ----
  [prevBtn, nextBtn].forEach((btn) => {
    btn.addEventListener("pointerdown", (e) => e.stopPropagation()); // don't let this trigger a drag
  });
  prevBtn.addEventListener("click", () => {
    prev();
    startAutoplay();
  });
  nextBtn.addEventListener("click", () => {
    next();
    startAutoplay();
  });

  // ---- drag to navigate (works for mouse AND touch via Pointer Events) ----
  let isDragging = false;
  let startX = 0;
  const DRAG_THRESHOLD = 50; // px the user must drag before it counts as a swipe

  carousel.addEventListener("pointerdown", (e) => {
    isDragging = true;
    startX = e.clientX;
    carousel.classList.add("dragging");
    carousel.setPointerCapture(e.pointerId);
    stopAutoplay();
  });

  carousel.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove("dragging");

    const diff = e.clientX - startX;
    if (diff < -DRAG_THRESHOLD)
      next(); // dragged left  -> next slide
    else if (diff > DRAG_THRESHOLD) prev(); // dragged right -> previous slide

    startAutoplay();
  });

  // in case the pointer leaves the carousel mid-drag
  carousel.addEventListener("pointercancel", () => {
    isDragging = false;
    carousel.classList.remove("dragging");
    startAutoplay();
  });

  goTo(0);
  startAutoplay();
})();
