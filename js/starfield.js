const SKY_IMAGE_PATH = "assets/images/starfield-eso-allsky.jpg";

export function initStarfield() {
  const canvas = document.getElementById("starfield-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let animationFrame = 0;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const starSamples = [];
  const fallbackStars = [];
  let skyImage = null;
  let skyReady = false;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resetCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seedFallbackStars() {
    fallbackStars.length = 0;
    const count = Math.max(180, Math.floor((width * height) / 10000));
    for (let i = 0; i < count; i += 1) {
      const angle = random(0, Math.PI * 2);
      fallbackStars.push({
        x: random(0, width),
        y: random(0, height),
        size: random(0.5, 1.6),
        driftX: Math.cos(angle) * random(0.003, 0.02),
        driftY: Math.sin(angle) * random(0.003, 0.018),
        phase: random(0, Math.PI * 2),
        speed: random(0.6, 1.8),
        warm: Math.random() > 0.82
      });
    }
  }

  function buildSamplesFromSky(image) {
    starSamples.length = 0;

    const sampleW = 1600;
    const sampleH = Math.floor(sampleW / 2);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = sampleW;
    tempCanvas.height = sampleH;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    tempCtx.drawImage(image, 0, 0, sampleW, sampleH);
    const pixels = tempCtx.getImageData(0, 0, sampleW, sampleH).data;

    for (let y = 1; y < sampleH; y += 2) {
      for (let x = 1; x < sampleW; x += 2) {
        const idx = (y * sampleW + x) * 4;
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

        if (luma < 132) continue;

        const probability = Math.min(0.55, (luma - 132) / 250);
        if (Math.random() > probability * 0.34) continue;

        starSamples.push({
          x: x / sampleW,
          y: y / sampleH,
          size: 0.45 + (luma - 132) * 0.018,
          alpha: 0.18 + (luma - 132) * 0.0024,
          phase: random(0, Math.PI * 2),
          speed: random(0.35, 1.6),
          warm: r > b
        });
      }
    }
  }

  function loadSky() {
    const image = new Image();
    image.onload = () => {
      skyImage = image;
      skyReady = true;
      buildSamplesFromSky(image);
    };
    image.onerror = () => {
      skyReady = false;
      skyImage = null;
    };
    image.src = SKY_IMAGE_PATH;
  }

  function drawRealSky(time) {
    if (!skyReady || !skyImage) return false;

    const aspect = skyImage.width / skyImage.height;
    const drawHeight = Math.max(height, width / aspect);
    const drawWidth = drawHeight * aspect;
    const drawY = (height - drawHeight) * 0.5;
    const scrollPx = (time * 1.5) % drawWidth;
    let startX = -scrollPx;

    while (startX < width) {
      context.drawImage(skyImage, startX, drawY, drawWidth, drawHeight);
      startX += drawWidth;
    }

    // Subtle deep-space vignette for readability.
    context.fillStyle = "rgba(2, 4, 8, 0.38)";
    context.fillRect(0, 0, width, height);

    // Twinkle from real sampled stars.
    const firstX = -scrollPx;
    for (const star of starSamples) {
      const baseX = star.x * drawWidth;
      const y = drawY + star.y * drawHeight;
      if (y < -8 || y > height + 8) continue;

      const twinkle = 0.6 + 0.4 * Math.sin(time * star.speed + star.phase);
      const alpha = Math.max(0.09, Math.min(0.95, star.alpha * twinkle));

      for (let wrap = 0; wrap < 2; wrap += 1) {
        const x = firstX + baseX + wrap * drawWidth;
        if (x < -8 || x > width + 8) continue;
        context.beginPath();
        context.fillStyle = star.warm
          ? `rgba(255, 224, 165, ${alpha.toFixed(3)})`
          : `rgba(188, 224, 255, ${alpha.toFixed(3)})`;
        context.arc(x, y, Math.min(2.15, star.size * 0.22), 0, Math.PI * 2);
        context.fill();
      }
    }

    // Faint galactic haze.
    context.save();
    context.translate(width * 0.52, height * 0.52);
    context.rotate(-0.26);
    context.scale(1.55, 0.5);
    const glow = context.createRadialGradient(0, 0, 0, 0, 0, Math.max(width, height) * 0.36);
    glow.addColorStop(0, "rgba(226, 206, 170, 0.09)");
    glow.addColorStop(0.36, "rgba(122, 180, 250, 0.065)");
    glow.addColorStop(1, "rgba(5, 12, 24, 0)");
    context.fillStyle = glow;
    context.beginPath();
    context.arc(0, 0, Math.max(width, height) * 0.36, 0, Math.PI * 2);
    context.fill();
    context.restore();

    return true;
  }

  function drawFallback(time) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "rgba(2, 4, 8, 0.58)";
    context.fillRect(0, 0, width, height);

    for (const star of fallbackStars) {
      star.x += star.driftX;
      star.y += star.driftY;
      if (star.x < -4) star.x = width + 4;
      if (star.x > width + 4) star.x = -4;
      if (star.y < -4) star.y = height + 4;
      if (star.y > height + 4) star.y = -4;

      const twinkle = 0.62 + 0.38 * Math.sin(time * star.speed + star.phase);
      const alpha = Math.max(0.12, Math.min(0.95, twinkle));
      context.beginPath();
      context.fillStyle = star.warm
        ? `rgba(255, 225, 171, ${alpha.toFixed(3)})`
        : `rgba(190, 223, 255, ${alpha.toFixed(3)})`;
      context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      context.fill();
    }
  }

  function drawFrame() {
    const time = performance.now() * 0.001;
    context.clearRect(0, 0, width, height);
    const drewRealSky = drawRealSky(time);
    if (!drewRealSky) {
      drawFallback(time);
    }
  }

  function animate() {
    animationFrame = window.requestAnimationFrame(animate);
    if (document.hidden) return;
    drawFrame();
  }

  resetCanvas();
  seedFallbackStars();
  loadSky();
  animate();

  window.addEventListener("resize", () => {
    resetCanvas();
    seedFallbackStars();
  });

  window.addEventListener(
    "beforeunload",
    () => {
      window.cancelAnimationFrame(animationFrame);
    },
    { once: true }
  );
}
