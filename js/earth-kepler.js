const TEXTURE_DIR = "assets/textures";
const TEXTURE_REV = "20260410f";
const TAU = Math.PI * 2;

const PLANETS = {
  earth: {
    key: "earth",
    name: "Pamant",
    subtitle: "Textura Solar System Scope (CC BY 4.0) + date NASA",
    radius: 2.8,
    cameraDistance: 10.8,
    spin: 0.09,
    atmosphere: 0x7ab8ff,
    cloudOpacity: 0.14,
    stats: [
      ["Diametru", "12.742 km"],
      ["Distanta fata de stea", "1 AU"],
      ["Perioada orbitala", "365 zile"],
      ["Temperatura medie", "15 C"],
    ],
    facts: [
      "Pamantul nu este perfect rotund. Este turtit la poli si umflat la ecuator din cauza rotatiei.",
      "O zi siderala nu dureaza 24 ore. Are 23 ore, 56 minute si 4 secunde.",
      "Pamantul se indeparteaza de Luna cu ~3.8 cm pe an. In viitorul indepartat eclipsele totale devin imposibile.",
      "Miezul Pamantului are temperaturi apropiate de suprafata Soarelui, in jur de 5.500 C.",
      "Pamantul este singurul corp cunoscut cu placi tectonice active. Fara ele, viata complexa ar fi fost mult mai putin probabila.",
    ],
  },
  kepler: {
    key: "kepler",
    name: "Kepler-452b",
    subtitle: "Textura dedicata Kepler-452b din proiect + date NASA",
    radius: 4.48,
    cameraDistance: 14.6,
    spin: 0.07,
    atmosphere: 0xe6b77a,
    cloudOpacity: 0.32,
    stats: [
      ["Diametru estimat", "~17.000 km"],
      ["Distanta fata de stea", "1.046 AU"],
      ["Perioada orbitala", "385 zile"],
      ["Temperatura medie", "Necunoscuta"],
    ],
    facts: [
      "Daca ai sta pe Kepler-452b, gravitatia ar putea parea aproape dubla fata de Terra.",
      "Steaua ei are aproximativ 6 miliarde de ani, cu ~1.5 miliarde peste varsta Soarelui.",
      "Daca exista viata acolo, a avut teoretic cu 1.5 miliarde de ani in plus pentru evolutie.",
      "Oceanele sale, daca exista, pot fierbe lent pe masura ce steaua gazda devine mai calda.",
      "Este atat de departe incat un semnal radio trimis azi ar ajunge acolo abia in anul 3426.",
    ],
  },
};

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

function cloudTexture(seed, tint = [255, 255, 255], density = 1000) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const rand = rng(seed);

  for (let i = 0; i < Math.max(8, Math.floor(density / 120)); i += 1) {
    const y = rand() * canvas.height;
    const h = 5 + rand() * 20;
    const waviness = 40 + rand() * 120;
    const alphaPeak = 0.04 + rand() * 0.14;

    const grad = ctx.createLinearGradient(0, y, canvas.width, y + rand() * 26);
    grad.addColorStop(0, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0)`);
    grad.addColorStop(
      0.35,
      `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${alphaPeak.toFixed(3)})`,
    );
    grad.addColorStop(
      0.65,
      `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${alphaPeak.toFixed(3)})`,
    );
    grad.addColorStop(1, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0)`);
    ctx.fillStyle = grad;

    for (let x = 0; x < canvas.width; x += waviness) {
      const offsetY =
        Math.sin((x / waviness) * 1.7 + rand() * TAU) * (h * 0.45);
      ctx.fillRect(x - 8, y + offsetY, waviness + 14, h);
    }
  }

  const haze = ctx.createLinearGradient(0, 0, 0, canvas.height);
  haze.addColorStop(0, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.04)`);
  haze.addColorStop(0.5, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0)`);
  haze.addColorStop(1, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.04)`);
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas;
}

function setupTexture(tex, renderer) {
  tex.encoding = THREE.sRGBEncoding;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = Math.max(
    4,
    Math.min(12, renderer.capabilities.getMaxAnisotropy()),
  );
  tex.needsUpdate = true;
  return tex;
}

function loadTexture(loader, renderer, file) {
  return new Promise((resolve, reject) => {
    loader.load(
      `${TEXTURE_DIR}/${file}?v=${TEXTURE_REV}`,
      (tex) => resolve(setupTexture(tex, renderer)),
      undefined,
      reject,
    );
  });
}

function createPlanet(def) {
  const root = new THREE.Group();

  const surface = new THREE.Mesh(
    new THREE.SphereGeometry(def.radius, 96, 96),
    new THREE.MeshStandardMaterial({
      color: def.key === "earth" ? 0x5c89b6 : 0xbf7d4f,
      roughness: def.key === "earth" ? 0.78 : 0.86,
      metalness: 0.01,
      emissive: def.key === "earth" ? 0x142a42 : 0x1c120a,
      emissiveIntensity: 0.08,
    }),
  );
  surface.renderOrder = 1;
  root.add(surface);

  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(def.radius * 1.013, 80, 80),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: def.cloudOpacity,
      roughness: 0.95,
      metalness: 0,
      depthWrite: false,
    }),
  );
  clouds.renderOrder = 2;
  root.add(clouds);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(def.radius * 1.06, 64, 64),
    new THREE.MeshBasicMaterial({
      color: def.atmosphere,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
      depthWrite: false,
    }),
  );
  root.add(atmosphere);

  root.visible = false;

  return { key: def.key, def, root, surface, clouds, atmosphere };
}

function createPreview(canvas, def) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0, 5.1);

  scene.add(new THREE.AmbientLight(0x98b9dc, 0.76));
  const key = new THREE.DirectionalLight(0xf7e7cc, 1.22);
  key.position.set(6, 2, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x74b8ff, 0.42);
  rim.position.set(-7, 1, -6);
  scene.add(rim);

  const material = new THREE.MeshStandardMaterial({
    color: def.key === "earth" ? 0x5c89b6 : 0xbf7d4f,
    roughness: 0.84,
    metalness: 0.01,
    emissive: 0x0e1a2a,
    emissiveIntensity: 0.08,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.56, 58, 58), material);
  scene.add(mesh);

  const resize = () => {
    const w = Math.max(1, canvas.clientWidth);
    const h = Math.max(1, canvas.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  resize();
  return {
    canvas,
    renderer,
    scene,
    camera,
    mesh,
    material,
    spin: def.spin,
    resize,
  };
}

export function initEarthKeplerComparison() {
  const section = document.getElementById("earth-kepler");
  const earthBtn = document.getElementById("earth-select-btn");
  const keplerBtn = document.getElementById("kepler-select-btn");
  const earthCanvas = document.getElementById("earth-select-canvas");
  const keplerCanvas = document.getElementById("kepler-select-canvas");
  const factsTitle = document.getElementById("earth-kepler-facts-title");
  const factsList = document.getElementById("earth-kepler-facts");
  const stage = document.getElementById("planet-focus-stage");
  const feature = document.getElementById("earth-kepler-feature");
  const canvas = document.getElementById("planet-focus-canvas");
  const focusTitle = document.getElementById("planet-focus-title");
  const focusSubtitle = document.getElementById("planet-focus-subtitle");
  const grid = document.getElementById("planet-focus-facts-grid");
  const expandBtn = document.getElementById("earth-kepler-expand");
  const expandBackdrop = document.getElementById(
    "earth-kepler-expand-backdrop",
  );
  const modeChip = document.getElementById("earth-kepler-mode-chip");
  const hint = document.getElementById("earth-kepler-disassembly-hint");
  const layerPanel = document.getElementById("earth-kepler-layer-panel");
  const layerTitle = document.getElementById("earth-kepler-layer-title");
  const layerText = document.getElementById("earth-kepler-layer-text");

  if (
    !section ||
    !earthBtn ||
    !keplerBtn ||
    !earthCanvas ||
    !keplerCanvas ||
    !factsTitle ||
    !factsList ||
    !stage ||
    !feature ||
    !canvas ||
    !focusTitle ||
    !focusSubtitle ||
    !grid ||
    !expandBtn ||
    !expandBackdrop ||
    !modeChip ||
    !hint
  ) {
    return;
  }

  const hideSecondaryUi = () => {
    if (layerPanel) layerPanel.hidden = true;
    if (layerTitle) layerTitle.textContent = "Strat selectat";
    if (layerText) layerText.textContent = "";
  };

  hideSecondaryUi();

  const hasThree = Boolean(window.THREE && window.THREE.OrbitControls);
  let selected = "earth";

  const renderText = () => {
    const p = PLANETS[selected];
    factsTitle.textContent = `Fapte socante si fascinante despre ${p.name}`;
    factsList.innerHTML = p.facts.map((fact) => `<li>${fact}</li>`).join("");
    focusTitle.textContent = p.name;
    focusSubtitle.textContent = p.subtitle;
    grid.innerHTML = p.stats
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join("");
    earthBtn.classList.toggle("is-active", selected === "earth");
    keplerBtn.classList.toggle("is-active", selected === "kepler");
    earthBtn.setAttribute(
      "aria-selected",
      selected === "earth" ? "true" : "false",
    );
    keplerBtn.setAttribute(
      "aria-selected",
      selected === "kepler" ? "true" : "false",
    );
  };

  renderText();

  if (!hasThree) {
    stage.classList.add("is-3d-unavailable");
    earthCanvas.parentElement?.classList.add("is-3d-unavailable");
    keplerCanvas.parentElement?.classList.add("is-3d-unavailable");
    expandBtn.disabled = true;
    modeChip.textContent = "3D indisponibil";
    hint.textContent =
      "Browserul/dispozitivul nu poate randa scena 3D in aceasta sesiune.";
    earthBtn.addEventListener("click", () => {
      selected = "earth";
      renderText();
    });
    keplerBtn.addEventListener("click", () => {
      selected = "kepler";
      renderText();
    });
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 900);
  camera.position.set(0, 0.25, PLANETS.earth.cameraDistance);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.64;
  controls.zoomSpeed = 0.8;
  controls.enableZoom = false;
  controls.minPolarAngle = 0.08;
  controls.maxPolarAngle = Math.PI - 0.08;
  controls.target.set(0, 0, 0);
  controls.update();

  scene.add(new THREE.AmbientLight(0x5778a1, 0.34));
  scene.add(new THREE.HemisphereLight(0x8ab6e8, 0x08111f, 0.38));
  const key = new THREE.DirectionalLight(0xfde1b8, 1.45);
  key.position.set(7, 3.5, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7ab9ff, 0.62);
  rim.position.set(-8, 1.2, -7.5);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.42);
  fill.position.set(-5.5, 2.2, 7);
  scene.add(fill);

  const stars = new THREE.Points(
    (() => {
      const geometry = new THREE.BufferGeometry();
      const count = 900;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const r = THREE.MathUtils.randFloat(40, 170);
        const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
        const theta = THREE.MathUtils.randFloat(0, TAU);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.cos(phi);
        positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      return geometry;
    })(),
    new THREE.PointsMaterial({
      color: 0xb9dfff,
      size: 0.72,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  );
  scene.add(stars);

  const loader = new THREE.TextureLoader();
  const clock = new THREE.Clock();

  const earthState = createPlanet(PLANETS.earth);
  const keplerState = createPlanet(PLANETS.kepler);
  scene.add(earthState.root);
  scene.add(keplerState.root);

  const previews = [];
  try {
    previews.push(createPreview(earthCanvas, PLANETS.earth));
    previews.push(createPreview(keplerCanvas, PLANETS.kepler));
  } catch {
    earthCanvas.parentElement?.classList.add("is-3d-unavailable");
    keplerCanvas.parentElement?.classList.add("is-3d-unavailable");
  }

  let pointerDown = null;
  let fallbackExpanded = false;
  let sectionVisible = true;
  let switchTimer = 0;

  const activeState = () => (selected === "earth" ? earthState : keplerState);

  const applySelection = () => {
    earthState.root.visible = selected === "earth";
    keplerState.root.visible = selected === "kepler";
    hideSecondaryUi();
  };

  const setViewerUi = () => {
    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    modeChip.textContent = expanded ? "Mod marit" : "Mod standard";
    hint.textContent = expanded
      ? "Mod marit: foloseste drag pentru rotatie si scroll pentru zoom."
      : "Apasa Mareste pentru fullscreen. Poti roti planeta cu drag.";
  };

  const setControlRange = () => {
    const p = PLANETS[selected];
    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    controls.enableZoom = expanded;
    controls.minDistance = expanded ? p.radius * 1.45 : p.radius * 2.25;
    controls.maxDistance = expanded ? p.radius * 8.2 : p.radius * 4.1;

    const offset = camera.position.clone().sub(controls.target);
    if (offset.lengthSq() < 0.001) offset.set(0.6, 0.2, 1);
    offset
      .normalize()
      .multiplyScalar(
        THREE.MathUtils.clamp(
          p.cameraDistance,
          controls.minDistance * 1.05,
          controls.maxDistance * 0.84,
        ),
      );

    controls.target.set(0, 0, 0);
    camera.position.copy(controls.target).add(offset);
    controls.update();
  };

  const switchPlanet = (next) => {
    if (!PLANETS[next] || selected === next) return;
    selected = next;
    renderText();
    if (switchTimer) window.clearTimeout(switchTimer);
    feature.classList.add("is-switching");
    switchTimer = window.setTimeout(() => {
      feature.classList.remove("is-switching");
      switchTimer = 0;
    }, 220);
    applySelection();
    setControlRange();
    setViewerUi();
  };

  const onResize = () => {
    const w = Math.max(1, stage.clientWidth);
    const h = Math.max(1, stage.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    previews.forEach((preview) => preview.resize());
  };

  const syncExpandUi = () => {
    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    stage.classList.toggle("is-expanded", fallbackExpanded);
    expandBackdrop.hidden = !fallbackExpanded;
    document.body.classList.toggle(
      "earth-kepler-expanded-open",
      fallbackExpanded,
    );
    expandBtn.textContent = expanded ? "Micsoreaza" : "Mareste";
    expandBtn.setAttribute("aria-pressed", expanded ? "true" : "false");
    hideSecondaryUi();
    setControlRange();
    setViewerUi();
    onResize();
  };

  const onExpandSafe = () => {
    const run = async () => {
      if (
        document.fullscreenEnabled &&
        typeof stage.requestFullscreen === "function"
      ) {
        if (document.fullscreenElement === stage) {
          await document.exitFullscreen();
        } else {
          await stage.requestFullscreen();
        }
      } else {
        fallbackExpanded = !fallbackExpanded;
        syncExpandUi();
      }
    };

    run().catch(() => {
      fallbackExpanded = !fallbackExpanded;
      syncExpandUi();
    });
  };

  earthBtn.addEventListener("click", () => switchPlanet("earth"));
  keplerBtn.addEventListener("click", () => switchPlanet("kepler"));

  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pointerDown = { x: event.clientX, y: event.clientY };
    canvas.classList.add("is-grabbing");
  });

  const clearPointerState = () => {
    canvas.classList.remove("is-grabbing");
    pointerDown = null;
  };

  canvas.addEventListener("pointerup", clearPointerState);
  canvas.addEventListener("pointerleave", clearPointerState);
  canvas.addEventListener("pointercancel", clearPointerState);

  expandBtn.addEventListener("click", onExpandSafe);
  expandBackdrop.addEventListener("click", () => {
    if (!fallbackExpanded) return;
    fallbackExpanded = false;
    syncExpandUi();
  });

  const onKeyDown = (event) => {
    if (event.key === "Escape" && fallbackExpanded) {
      fallbackExpanded = false;
      syncExpandUi();
    }
  };

  const onFullscreen = () => syncExpandUi();

  window.addEventListener("keydown", onKeyDown);
  document.addEventListener("fullscreenchange", onFullscreen);
  window.addEventListener("resize", onResize);

  const observer = new window.IntersectionObserver(
    (entries) => {
      sectionVisible = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0.15 },
  );
  observer.observe(section);

  const applyTextures = async () => {
    const [earthMapRes, earthNightRes, keplerMapRes, keplerFallbackRes] =
      await Promise.allSettled([
        loadTexture(loader, renderer, "earth.jpg"),
        loadTexture(loader, renderer, "earth_night.jpg"),
        loadTexture(loader, renderer, "kepler452b_map.png"),
        loadTexture(loader, renderer, "kepler452b.jpg"),
      ]);

    const earthMap =
      earthMapRes.status === "fulfilled" ? earthMapRes.value : null;
    const earthNight =
      earthNightRes.status === "fulfilled" ? earthNightRes.value : null;
    const keplerMap =
      keplerMapRes.status === "fulfilled"
        ? keplerMapRes.value
        : keplerFallbackRes.status === "fulfilled"
          ? keplerFallbackRes.value
          : null;

    if (earthMap) {
      earthState.surface.material.map = earthMap;
      earthState.surface.material.color = new THREE.Color(0xffffff);
    }
    if (earthNight) {
      earthState.surface.material.emissiveMap = earthNight;
      earthState.surface.material.emissive = new THREE.Color(0x7da7dc);
      earthState.surface.material.emissiveIntensity = 0.14;
    } else {
      earthState.surface.material.emissiveIntensity = 0.08;
    }
    earthState.surface.material.needsUpdate = true;

    earthState.clouds.material.map = setupTexture(
      new THREE.CanvasTexture(cloudTexture(12742, [246, 252, 255], 420)),
      renderer,
    );
    earthState.clouds.material.opacity = PLANETS.earth.cloudOpacity;
    earthState.clouds.material.needsUpdate = true;

    if (keplerMap) {
      keplerState.surface.material.map = keplerMap;
      keplerState.surface.material.color = new THREE.Color(0xffffff);
    }
    keplerState.surface.material.needsUpdate = true;
    keplerState.clouds.material.map = null;
    keplerState.clouds.material.opacity = 0;
    keplerState.clouds.material.needsUpdate = true;

    if (previews[0]) {
      if (earthMap) previews[0].material.map = earthMap;
      previews[0].material.needsUpdate = true;
    }
    if (previews[1]) {
      if (keplerMap) previews[1].material.map = keplerMap;
      previews[1].material.color = new THREE.Color(
        keplerMap ? 0xffffff : 0xd79c67,
      );
      previews[1].material.needsUpdate = true;
    }
  };

  applyTextures().catch(() => {
    // Keep fallback colors if a texture fails to load.
  });

  applySelection();
  setControlRange();
  setViewerUi();
  onResize();

  let raf = 0;
  const animate = () => {
    raf = window.requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    const state = activeState();

    if (!pointerDown) {
      state.surface.rotation.y += state.def.spin * delta;
      state.clouds.rotation.y += state.def.spin * 1.14 * delta;
      state.atmosphere.rotation.y += state.def.spin * 0.18 * delta;
    }

    stars.rotation.y += delta * 0.005;
    stars.rotation.x = Math.sin(elapsed * 0.04) * 0.03;

    controls.update();

    if (
      (sectionVisible ||
        fallbackExpanded ||
        document.fullscreenElement === stage) &&
      !document.hidden
    ) {
      renderer.render(scene, camera);
      previews.forEach((preview) => {
        preview.mesh.rotation.y += preview.spin * 0.65 * delta;
        preview.renderer.render(preview.scene, preview.camera);
      });
    }
  };
  animate();

  window.addEventListener(
    "beforeunload",
    () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreen);
      if (switchTimer) window.clearTimeout(switchTimer);
      clearPointerState();
      stage.classList.remove("is-expanded");
      document.body.classList.remove("earth-kepler-expanded-open");
      expandBackdrop.hidden = true;
      hideSecondaryUi();
      if (document.fullscreenElement === stage && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    },
    { once: true },
  );
}
