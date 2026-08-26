(() => {
  const c = document.getElementById("carousel");
  if (!c) return;
  const s = [...c.querySelectorAll(".slide")],
    d = document.getElementById("dots"),
    p = document.getElementById("prevBtn"),
    n = document.getElementById("nextBtn");
  let i = 0,
    t = null,
    drag = false,
    x = 0;
  const ms = 5000,
    th = 50;
  s.forEach((_, j) => {
    const b = document.createElement("button");
    b.className = "dot" + (j === 0 ? " is-active" : "");
    b.setAttribute("aria-label", `Go to slide ${j + 1}`);
    b.onclick = () => go(j);
    d.appendChild(b);
  });
  function go(j) {
    i = (j + s.length) % s.length;
    s.forEach((v, k) => v.classList.toggle("is-active", k === i));
    [...d.children].forEach((v, k) => v.classList.toggle("is-active", k === i));
    c.style.setProperty("--accent", s[i].dataset.color || "#2563eb");
  }
  function next() {
    go(i + 1);
  }
  function prev() {
    go(i - 1);
  }
  function stop() {
    clearInterval(t);
    t = null;
  }
  function start() {
    stop();
    t = setInterval(next, ms);
  }
  p.onclick = () => {
    prev();
    start();
  };
  n.onclick = () => {
    next();
    start();
  };
  c.onmouseenter = stop;
  c.onmouseleave = start;
  c.onpointerdown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = true;
    x = e.clientX;
    stop();
  };
  c.onpointerup = (e) => {
    if (!drag) return;
    drag = false;
    const diff = e.clientX - x;
    if (diff < -th) next();
    else if (diff > th) prev();
    start();
  };
  c.onpointercancel = () => {
    drag = false;
    start();
  };
  document.addEventListener("visibilitychange", () =>
    document.hidden ? stop() : start(),
  );
  document
    .querySelector(".newsletter-form")
    ?.addEventListener("submit", (e) => {
      e.preventDefault();
      const b = e.currentTarget.querySelector("button"),
        old = b.innerHTML;
      b.innerHTML = 'Subscribed <ion-icon name="checkmark-outline"></ion-icon>';
      b.disabled = true;
      setTimeout(() => {
        b.innerHTML = old;
        b.disabled = false;
        e.currentTarget.reset();
      }, 2200);
    });
  go(0);
  start();
})();
