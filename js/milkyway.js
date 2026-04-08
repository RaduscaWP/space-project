export function initMilkyWay() {
  const marker = document.getElementById("solar-system-marker");
  const markerLabel = document.getElementById("solar-system-label");
  const detailsToggle = document.getElementById("milkyway-details-toggle");
  const orbitRing = document.getElementById("solar-orbit-ring");
  const solarSection = document.getElementById("solar-system");
  const map = document.getElementById("milkyway-map");
  const disc = document.getElementById("milkyway-disc");
  const canvas = document.getElementById("milkyway-canvas");

  const jumpToSolar = () => {
    if (!solarSection) return;
    const targetTop = Math.max(0, solarSection.getBoundingClientRect().top + window.scrollY - 10);
    window.scrollTo({ top: targetTop, behavior: "smooth" });
    window.setTimeout(() => {
      solarSection.classList.add("is-targeted");
      window.setTimeout(() => solarSection.classList.remove("is-targeted"), 1500);
    }, 250);
  };

  if (marker) marker.addEventListener("click", jumpToSolar);
  if (markerLabel) markerLabel.addEventListener("click", jumpToSolar);

  if (map && detailsToggle) {
    const setDetailsOpen = (isOpen) => {
      map.classList.toggle("is-details-open", isOpen);
      detailsToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      detailsToggle.textContent = isOpen ? "Ascunde detalii" : "Detalii";
    };

    map.classList.add("is-details-ready");
    setDetailsOpen(false);

    detailsToggle.addEventListener("click", () => {
      setDetailsOpen(!map.classList.contains("is-details-open"));
    });
  }

  if (disc && markerLabel) {
    const place = () => placeSolarMarker(disc, marker, markerLabel, orbitRing);
    place();
    window.addEventListener("resize", place);
    window.addEventListener(
      "beforeunload",
      () => {
        window.removeEventListener("resize", place);
      },
      { once: true }
    );
  }

  if (!map || !canvas) return;
  initMilkyWayCanvas(disc || map, canvas);
}

function placeSolarMarker(disc, marker, label, ring) {
  // 26,000 ly from center / 50,000 ly galactic radius ~= 0.52
  const ratio = 26000 / 50000;
  // Orion Spur direction in this map projection (lower-right quadrant).
  const angle = (34 * Math.PI) / 180;

  const width = disc.clientWidth;
  const height = disc.clientHeight;
  const radius = Math.min(width, height) * 0.5;
  const orbitRadius = radius * ratio;

  const x = width * 0.5 + Math.cos(angle) * orbitRadius;
  const y = height * 0.5 + Math.sin(angle) * orbitRadius;

  if (marker) {
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
  }

  // Place the label slightly outward on the same radial direction,
  // so it stays readable and doesn't cover the galaxy core.
  const labelRadius = orbitRadius + Math.max(34, width * 0.085);
  const rawLabelX = width * 0.5 + Math.cos(angle) * labelRadius;
  const rawLabelY = height * 0.5 + Math.sin(angle) * labelRadius;
  const pad = Math.max(18, width * 0.03);
  const labelX = Math.max(pad, Math.min(width - pad, rawLabelX));
  const labelY = Math.max(pad, Math.min(height - pad, rawLabelY));

  label.style.left = `${labelX}px`;
  label.style.top = `${labelY}px`;

  if (ring) {
    const ringSize = orbitRadius * 2;
    ring.style.width = `${ringSize}px`;
    ring.style.height = `${ringSize}px`;
  }
}

function initMilkyWayCanvas(container, canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const stars = [];
  const glows = [];
  let width = 0;
  let height = 0;
  let raf = 0;
  let active = true;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resize() {
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    stars.length = 0;
    glows.length = 0;

    const starCount = Math.max(90, Math.floor((width * height) / 4600));
    for (let i = 0; i < starCount; i += 1) {
      stars.push({
        x: random(0, width),
        y: random(0, height),
        size: random(0.5, 2.1),
        baseAlpha: random(0.14, 0.7),
        twinkleSpeed: random(0.6, 2.1),
        phase: random(0, Math.PI * 2),
        driftX: random(-0.04, 0.04),
        driftY: random(-0.03, 0.03),
        warm: Math.random() > 0.78
      });
    }

    const glowCount = 8;
    for (let i = 0; i < glowCount; i += 1) {
      glows.push({
        x: width * random(0.24, 0.76),
        y: height * random(0.2, 0.82),
        size: random(18, 65),
        alpha: random(0.025, 0.085),
        pulse: random(0.35, 0.95),
        phase: random(0, Math.PI * 2),
        warm: Math.random() > 0.72
      });
    }
  }

  function drawGlows(time) {
    for (const glow of glows) {
      const pulse = 0.85 + 0.25 * Math.sin(time * glow.pulse + glow.phase);
      const alpha = glow.alpha * pulse;
      const gradient = ctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.size);
      gradient.addColorStop(
        0,
        glow.warm
          ? `rgba(242, 213, 165, ${alpha.toFixed(3)})`
          : `rgba(114, 175, 244, ${alpha.toFixed(3)})`
      );
      gradient.addColorStop(1, "rgba(7, 14, 24, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glow.x, glow.y, glow.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStars(time) {
    for (const star of stars) {
      const twinkle = 0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.phase);
      const alpha = Math.max(0, Math.min(0.95, star.baseAlpha * twinkle));
      star.x += star.driftX;
      star.y += star.driftY;

      if (star.x < -2) star.x = width + 2;
      if (star.x > width + 2) star.x = -2;
      if (star.y < -2) star.y = height + 2;
      if (star.y > height + 2) star.y = -2;

      ctx.beginPath();
      ctx.fillStyle = star.warm
        ? `rgba(255, 233, 184, ${alpha.toFixed(3)})`
        : `rgba(188, 222, 255, ${alpha.toFixed(3)})`;
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawFrame() {
    const time = performance.now() * 0.001;
    ctx.clearRect(0, 0, width, height);
    drawGlows(time);
    drawStars(time);
  }

  function tick() {
    raf = window.requestAnimationFrame(tick);
    if (!active || document.hidden) return;
    drawFrame();
  }

  const visibilityObserver = new window.IntersectionObserver(
    (entries) => {
      active = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0.15 }
  );
  visibilityObserver.observe(container);

  window.addEventListener("resize", resize);
  window.addEventListener(
    "beforeunload",
    () => {
      window.cancelAnimationFrame(raf);
      visibilityObserver.disconnect();
    },
    { once: true }
  );

  resize();
  tick();
}
