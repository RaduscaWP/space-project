const TEXTURE_DIR = "assets/textures";
const TEXTURE_REV = "20260410f";
const TAU = Math.PI * 2;
const CLICK_DRAG_THRESHOLD = 8;

const PLANETS = {
  earth: {
    key: "earth",
    name: "Pamant",
    subtitle: "Textura Solar System Scope (CC BY 4.0) + date NASA",
    radius: 2.8,
    cameraDistance: 10.8,
    spin: 0.22,
    cutawayYaw: -1.85,
    atmosphere: 0x7ab8ff,
    cloudOpacity: 0.14,
    stats: [
      ["Diametru", "12.742 km"],
      ["Distanta fata de stea", "1 AU"],
      ["Perioada orbitala", "365 zile"],
      ["Temperatura medie", "15 C"]
    ],
    facts: [
      "Pamantul nu este perfect rotund. Este turtit la poli si umflat la ecuator din cauza rotatiei.",
      "O zi siderala nu dureaza 24 ore. Are 23 ore, 56 minute si 4 secunde.",
      "Pamantul se indeparteaza de Luna cu ~3.8 cm pe an. In viitorul indepartat eclipsele totale devin imposibile.",
      "Miezul Pamantului are temperaturi apropiate de suprafata Soarelui, in jur de 5.500 C.",
      "Pamantul este singurul corp cunoscut cu placi tectonice active. Fara ele, viata complexa ar fi fost mult mai putin probabila."
    ],
    layers: [
      {
        id: "earth-crust",
        name: "Scoarta terestra",
        shape: "earthCap",
        color: 0x9a7744,
        radius: 2.32,
        x: 3.8,
        zOffset: 0.08,
        renderOrder: 11,
        opacity: 1,
        roughness: 0.86,
        metalness: 0.01,
        depthScale: 0.58,
        palette: [0x8b7049, 0xb3915d, 0xd0b77d, 0x6c583a],
        info:
          "Scoarta e extrem de subtire: ~30 km din 6371 km raza medie. Proportional, mai subtire decat coaja unui mar raportata la fruct."
      },
      {
        id: "earth-upper-mantle",
        name: "Mantia superioara",
        shape: "earthCap",
        color: 0xbb3b1e,
        radius: 2.05,
        x: 2.6,
        zOffset: 0.16,
        renderOrder: 12,
        opacity: 1,
        roughness: 0.78,
        metalness: 0.03,
        depthScale: 0.56,
        palette: [0x692414, 0xbb3b1e, 0xe3692e, 0x35120c],
        info:
          "Placi tectonice intregi aluneca pe aceasta zona plastica si schimba fata planetei prin cutremure, vulcani si reciclarea crustei."
      },
      {
        id: "earth-lower-mantle",
        name: "Mantia inferioara",
        shape: "earthCap",
        color: 0x8e0f12,
        radius: 1.72,
        x: 1.4,
        zOffset: 0.24,
        renderOrder: 13,
        opacity: 1,
        roughness: 0.74,
        metalness: 0.04,
        depthScale: 0.54,
        palette: [0x3a0708, 0x8e0f12, 0xc32318, 0x170303],
        info:
          "Mantia, desi solida, curge lent pe timp geologic. Un circuit convectiv complet al unei roci poate dura 50-100 milioane de ani."
      },
      {
        id: "earth-outer-core",
        name: "Nucleul extern",
        shape: "earthCap",
        color: 0xff8a2f,
        radius: 1.22,
        x: 0.4,
        zOffset: 0.32,
        renderOrder: 14,
        opacity: 1,
        roughness: 0.46,
        metalness: 0.08,
        emissive: 0xff6c18,
        emissiveIntensity: 0.32,
        depthScale: 0.62,
        palette: [0x8b290c, 0xff8a2f, 0xffbe63, 0xf26f1a],
        info:
          "Fierul lichid in miscare genereaza campul magnetic al Pamantului, scutul invizibil care ne protejeaza de radiatiile solare mortale."
      },
      {
        id: "earth-inner-core",
        name: "Nucleul intern",
        shape: "sphere",
        color: 0xfff0b0,
        radius: 0.52,
        x: -0.6,
        zOffset: 0.42,
        renderOrder: 15,
        scale: 0.186,
        opacity: 1,
        roughness: 0.32,
        metalness: 0.12,
        emissive: 0xfff0a6,
        emissiveIntensity: 0.52,
        palette: [0xe7d59d, 0xfff4bc, 0xffe692, 0xd6bf7a],
        info:
          "Mai fierbinte decat suprafata Soarelui. Desi e la 5500 C, presiunea uriasa mentine fierul solid. Conform modelelor, poate contine cristale de fier imense."
      }
    ]
  },
  kepler: {
    key: "kepler",
    name: "Kepler-452b",
    subtitle: "Textura super-Terra compusa din harti Solar System Scope (CC BY 4.0)",
    radius: 4.48,
    cameraDistance: 14.6,
    spin: 0.17,
    atmosphere: 0xe6b77a,
    cloudOpacity: 0.32,
    stats: [
      ["Diametru estimat", "~17.000 km"],
      ["Distanta fata de stea", "1.046 AU"],
      ["Perioada orbitala", "385 zile"],
      ["Temperatura medie", "Necunoscuta"]
    ],
    facts: [
      "Daca ai sta pe Kepler-452b, gravitatia ar putea parea aproape dubla fata de Terra.",
      "Steaua ei are aproximativ 6 miliarde de ani, cu ~1.5 miliarde peste varsta Soarelui.",
      "Daca exista viata acolo, a avut teoretic cu 1.5 miliarde de ani in plus pentru evolutie.",
      "Oceanele sale, daca exista, pot fierbe lent pe masura ce steaua gazda devine mai calda.",
      "Este atat de departe incat un semnal radio trimis azi ar ajunge acolo abia in anul 3426."
    ],
    layers: [
      {
        id: "kepler-inner-core",
        name: "Nucleu intern ipotetic",
        shape: "sphere",
        color: 0xf6d46b,
        scale: 0.24,
        opacity: 0.96,
        offset: [0, 0, 0],
        spread: 0,
        info: "Modelele de super-Terra indica un nucleu metalic voluminos, sub presiuni capabile sa stabilizeze faze exotice ale fierului."
      },
      {
        id: "kepler-outer-core",
        name: "Nucleu extern metalic",
        shape: "torus",
        color: 0xff6a33,
        torusR: 0.37,
        torusTube: 0.09,
        opacity: 0.88,
        offset: [1, 0.08, 0.15],
        spread: 1.1,
        info: "Un nucleu lichid bogat in fier-nichel ar putea genera un camp magnetic puternic, daca planeta are convectie interna activa."
      },
      {
        id: "kepler-lower-mantle",
        name: "Mantie inferioara densa",
        shape: "sphere",
        color: 0x8f3a14,
        scale: 0.66,
        opacity: 0.74,
        offset: [0, 1, 0],
        spread: 0.96,
        info: "Silicatii la inalta presiune pot pastra caldura interna pe timp foarte lung, permitand o geologie activa in epoci mai batrane."
      },
      {
        id: "kepler-upper-mantle",
        name: "Mantie superioara plastica",
        shape: "sphere",
        color: 0xc86e33,
        scale: 0.84,
        opacity: 0.56,
        offset: [0, -1, 0],
        spread: 0.92,
        info: "Daca exista tectonica, aceasta zona ar controla vulcanismul, degazarea si stabilitatea climei pe sute de milioane de ani."
      },
      {
        id: "kepler-crust",
        name: "Scoarta + atmosfera",
        shape: "sphere",
        color: 0xb6855f,
        scale: 1.02,
        opacity: 0.32,
        offset: [-0.75, 0.24, 0.34],
        spread: 1.16,
        info: "Straturile externe pot fi dominate de roci bogate in fier oxidat si o atmosfera variabila, de la densa si fierbinte la mai temperata."
      }
    ]
  }
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

function shortestAngleDelta(from, to) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
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
    grad.addColorStop(0.35, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${alphaPeak.toFixed(3)})`);
    grad.addColorStop(0.65, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, ${alphaPeak.toFixed(3)})`);
    grad.addColorStop(1, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0)`);
    ctx.fillStyle = grad;

    for (let x = 0; x < canvas.width; x += waviness) {
      const offsetY = Math.sin((x / waviness) * 1.7 + rand() * TAU) * (h * 0.45);
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
  tex.anisotropy = Math.max(4, Math.min(12, renderer.capabilities.getMaxAnisotropy()));
  tex.needsUpdate = true;
  return tex;
}

function loadTexture(loader, renderer, file) {
  return new Promise((resolve, reject) => {
    loader.load(`${TEXTURE_DIR}/${file}?v=${TEXTURE_REV}`, (tex) => resolve(setupTexture(tex, renderer)), undefined, reject);
  });
}

function blendKeplerMap(marsImg, venusImg) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 1024;
  const ctx = c.getContext("2d");

  if (marsImg) ctx.drawImage(marsImg, 0, 0, c.width, c.height);
  if (venusImg) {
    ctx.globalCompositeOperation = "soft-light";
    ctx.globalAlpha = 0.45;
    ctx.drawImage(venusImg, 0, 0, c.width, c.height);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  const grad = ctx.createLinearGradient(0, 0, 0, c.height);
  grad.addColorStop(0, "rgba(228, 186, 132, 0.18)");
  grad.addColorStop(0.5, "rgba(210, 150, 96, 0)");
  grad.addColorStop(1, "rgba(150, 94, 52, 0.2)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  const clouds = cloudTexture(452452, [250, 236, 214], 1800);
  ctx.globalAlpha = 0.28;
  ctx.drawImage(clouds, 0, 0, c.width, c.height);
  ctx.globalAlpha = 1;

  return c;
}

function rgbFromHex(hex) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}

function layerTexture(seed, palette, grain = 1900) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const rand = rng(seed);
  const width = canvas.width;
  const height = canvas.height;

  const colors = palette.map((hex) => rgbFromHex(hex));
  const image = ctx.createImageData(width, height);
  const data = image.data;

  const c0 = colors[0];
  const c1 = colors[Math.min(1, colors.length - 1)];
  const c2 = colors[Math.min(2, colors.length - 1)];
  const phaseA = rand() * TAU;
  const phaseB = rand() * TAU;
  const phaseC = rand() * TAU;

  let index = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const waveA = 0.5 + 0.5 * Math.sin(x * 0.014 + y * 0.005 + phaseA);
      const waveB = 0.5 + 0.5 * Math.sin(x * 0.006 - y * 0.018 + phaseB);
      const waveC = 0.5 + 0.5 * Math.sin((x + y) * 0.011 + phaseC);
      const mix = Math.max(0, Math.min(1, 0.45 * waveA + 0.35 * waveB + 0.2 * waveC));
      const grainNoise = (rand() - 0.5) * 0.1;

      const r = c0[0] * (1 - mix) + c1[0] * mix + (c2[0] - c1[0]) * waveC * 0.35;
      const g = c0[1] * (1 - mix) + c1[1] * mix + (c2[1] - c1[1]) * waveC * 0.35;
      const b = c0[2] * (1 - mix) + c1[2] * mix + (c2[2] - c1[2]) * waveC * 0.35;

      data[index] = Math.max(0, Math.min(255, Math.round(r + 255 * grainNoise)));
      data[index + 1] = Math.max(0, Math.min(255, Math.round(g + 255 * grainNoise)));
      data[index + 2] = Math.max(0, Math.min(255, Math.round(b + 255 * grainNoise)));
      data[index + 3] = 255;
      index += 4;
    }
  }

  ctx.putImageData(image, 0, 0);

  for (let i = 0; i < Math.max(14, Math.floor(grain / 180)); i += 1) {
    const y = rand() * height;
    const thickness = 2 + rand() * 10;
    const color = colors[Math.floor(rand() * colors.length)];
    const alphaPeak = 0.05 + rand() * 0.16;
    const band = ctx.createLinearGradient(0, y, width, y + rand() * 16);
    band.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
    band.addColorStop(0.5, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alphaPeak.toFixed(3)})`);
    band.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
    ctx.fillStyle = band;
    ctx.fillRect(0, y, width, thickness);
  }

  return canvas;
}

function createLayerMaterial(layer, options = {}) {
  const opacity = options.opacity ?? layer.opacity;
  const transparent = options.transparent ?? (opacity < 0.985);
  return new THREE.MeshStandardMaterial({
    color: layer.color,
    transparent,
    opacity,
    roughness: layer.roughness ?? 0.72,
    metalness: layer.metalness ?? 0.04,
    emissive: layer.emissive ?? 0x000000,
    emissiveIntensity: layer.emissiveIntensity ?? 0,
    side: options.side ?? (layer.doubleSide ? THREE.DoubleSide : THREE.FrontSide),
    depthTest: options.depthTest ?? true,
    depthWrite: options.depthWrite ?? !transparent,
    ...(options.clippingPlanes ? { clippingPlanes: options.clippingPlanes } : {})
  });
}

function disassemblyState(def) {
  const group = new THREE.Group();
  group.visible = false;

  const layers = def.layers.map((layer) => {
    const dir = new THREE.Vector3(...(layer.offset || [0, 0, 0]));
    if (dir.lengthSq() > 0.001) dir.normalize();

    const hasSlice = typeof layer.sliceStart === "number" && typeof layer.sliceLength === "number";
    const geo = layer.shape === "torus"
      ? new THREE.TorusGeometry(def.radius * layer.torusR, def.radius * layer.torusTube, 40, 120)
      : new THREE.SphereGeometry(
          layer.radius ?? def.radius * layer.scale,
          hasSlice ? 92 : 68,
          hasSlice ? 74 : 68,
          hasSlice ? layer.sliceStart : 0,
          hasSlice ? layer.sliceLength : TAU
        );

    const mat = createLayerMaterial(layer);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.userData.layerId = layer.id;
    if (layer.shape === "torus") mesh.rotation.x = Math.PI * 0.5;
    if (typeof layer.scaleX === "number") mesh.scale.x = layer.scaleX;
    if (typeof layer.renderOrder === "number") mesh.renderOrder = layer.renderOrder;
    const materials = [mat];
    const textureMaterials = [mat];

    group.add(mesh);

    return {
      def: layer,
      dir,
      stack: new THREE.Vector3(layer.stackX || 0, layer.stackY || 0, layer.stackZ || 0),
      mesh,
      materials,
      textureMaterials,
      materialStates: materials.map((material) => ({
        material,
        baseOpacity: material.opacity,
        baseEmissive: material.emissiveIntensity || 0,
        baseEmissiveHex: material.emissive ? material.emissive.getHex() : 0x000000
      }))
    };
  });

  return { group, layers };
}
function createPlanet(def) {
  const root = new THREE.Group();
  const surfaceMat = new THREE.MeshStandardMaterial({
    color: def.key === "earth" ? 0x5c89b6 : 0xbf7d4f,
    roughness: def.key === "earth" ? 0.8 : 0.86,
    metalness: 0.01,
    emissive: def.key === "earth" ? 0x142a42 : 0x1c120a,
    emissiveIntensity: 0.1
  });

  const surface = new THREE.Mesh(new THREE.SphereGeometry(def.radius, 96, 96), surfaceMat);
  surface.userData.pickPlanet = def.key;
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
      depthWrite: false
    })
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
      depthWrite: false
    })
  );
  root.add(atmosphere);

  const disassembly = def.key === "earth"
    ? { group: new THREE.Group(), layers: [] }
    : disassemblyState(def);
  root.add(disassembly.group);
  root.visible = false;

  return { key: def.key, def, root, surface, clouds, atmosphere, disassembly };
}

function createPreview(canvas, def) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
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
    emissiveIntensity: 0.08
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
  return { canvas, renderer, scene, camera, mesh, material, spin: def.spin, resize };
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
  const expandBackdrop = document.getElementById("earth-kepler-expand-backdrop");
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
    !hint ||
    !layerPanel ||
    !layerTitle ||
    !layerText
  ) {
    return;
  }

  const hasThree = Boolean(window.THREE && window.THREE.OrbitControls);
  let selected = "earth";

  const renderText = () => {
    const p = PLANETS[selected];
    factsTitle.textContent = `Fapte socante si fascinante despre ${p.name}`;
    factsList.innerHTML = p.facts.map((f) => `<li>${f}</li>`).join("");
    focusTitle.textContent = p.name;
    focusSubtitle.textContent = p.subtitle;
    grid.innerHTML = p.stats.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    earthBtn.classList.toggle("is-active", selected === "earth");
    keplerBtn.classList.toggle("is-active", selected === "kepler");
    earthBtn.setAttribute("aria-selected", selected === "earth" ? "true" : "false");
    keplerBtn.setAttribute("aria-selected", selected === "kepler" ? "true" : "false");
  };

  renderText();

  if (!hasThree) {
    stage.classList.add("is-3d-unavailable");
    earthCanvas.parentElement?.classList.add("is-3d-unavailable");
    keplerCanvas.parentElement?.classList.add("is-3d-unavailable");
    expandBtn.disabled = true;
    modeChip.textContent = "3D indisponibil";
    hint.textContent = "Browserul/dispozitivul nu poate randa scena 3D in aceasta sesiune.";
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

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.localClippingEnabled = true;

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
  const cutawayFill = new THREE.DirectionalLight(0xffffff, 0.46);
  cutawayFill.position.set(-5, 2.4, 7);
  scene.add(cutawayFill);
  const stars = new THREE.Points(
    (() => {
      const g = new THREE.BufferGeometry();
      const count = 900;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const r = THREE.MathUtils.randFloat(40, 170);
        const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
        const theta = THREE.MathUtils.randFloat(0, TAU);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.cos(phi);
        pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      }
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      return g;
    })(),
    new THREE.PointsMaterial({ color: 0xb9dfff, size: 0.72, transparent: true, opacity: 0.55, depthWrite: false })
  );
  scene.add(stars);

  const loader = new THREE.TextureLoader();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
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

  let disassemblyKey = "";
  let disassemblyTarget = 0;
  let disassemblyCurrent = 0;
  let selectedLayer = "";

  let pointerDown = null;
  let pointerDragged = false;
  let startCamera = null;
  let startTarget = null;

  let tapKey = "";
  let tapTimes = [];

  let fallbackExpanded = false;
  let sectionVisible = true;
  let switchTimer = 0;

  const activeState = () => (selected === "earth" ? earthState : keplerState);

  const hideLayerPanel = () => {
    layerPanel.hidden = true;
    layerTitle.textContent = "Strat selectat";
    layerText.textContent = "";
  };
  const setLayerHighlight = (state, layerId) => {
    state.disassembly.layers.forEach((entry) => {
      const active = entry.def.id === layerId;
      entry.materialStates.forEach((stateEntry) => {
        const m = stateEntry.material;
        m.opacity = active ? Math.min(1, stateEntry.baseOpacity + 0.1) : stateEntry.baseOpacity;
        if (m.emissive) {
          const activeEmissiveHex = stateEntry.baseEmissive > 0 ? stateEntry.baseEmissiveHex : 0xffd18a;
          m.emissive.setHex(active ? activeEmissiveHex : stateEntry.baseEmissiveHex);
          m.emissiveIntensity = active ? Math.max(0.18, stateEntry.baseEmissive + 0.16) : stateEntry.baseEmissive;
        }
        m.needsUpdate = true;
      });
    });
  };

  const setModeUi = () => {
    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    const exploded = disassemblyCurrent > 0.55;
    modeChip.textContent = exploded ? "Mod disociere activ" : expanded ? "Mod marit" : "Mod standard";
    if (exploded) {
      hint.textContent = "Mod disociere activ: click pe strat pentru informatii. Triple-click rapid inchide disocierea.";
    } else if (expanded) {
      hint.textContent = "Mod marit: triple-click rapid (3 click-uri in 1 secunda) pe planeta pentru disociere.";
    } else {
      hint.textContent = "Apasa Mareste pentru fullscreen. In modul marit ai scroll pentru zoom si triple-click pentru disociere.";
    }
  };

  const applySelection = () => {
    earthState.root.visible = selected === "earth";
    keplerState.root.visible = selected === "kepler";
  };

  const setControlRange = () => {
    const p = PLANETS[selected];
    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    controls.enableZoom = expanded;
    controls.minDistance = expanded ? p.radius * 1.45 : p.radius * 2.45;
    controls.maxDistance = expanded ? p.radius * 8.2 : p.radius * 4.05;

    const offset = camera.position.clone().sub(controls.target);
    if (offset.lengthSq() < 0.001) offset.set(0.6, 0.2, 1);
    offset.normalize().multiplyScalar(THREE.MathUtils.clamp(p.cameraDistance, controls.minDistance * 1.05, controls.maxDistance * 0.85));
    camera.position.copy(controls.target).add(offset);
    controls.update();
  };

  const frameEarthCutaway = () => {
    const direction = camera.position.clone().sub(controls.target);
    if (direction.lengthSq() < 0.001) direction.set(0, 0.12, 1);
    direction.normalize();

    const aspect = Math.max(0.38, stage.clientWidth / Math.max(1, stage.clientHeight));
    const cutawaySpan = 12.2;
    const fovRadians = THREE.MathUtils.degToRad(camera.fov);
    const distanceForWidth = cutawaySpan / (2 * Math.tan(fovRadians * 0.5) * aspect);
    const distance = Math.max(15.8, Math.min(38, distanceForWidth * 1.08));
    const targetX = aspect < 0.72 ? -1.85 : -2.05;

    controls.target.set(targetX, aspect < 0.72 ? -0.25 : 0, 0);
    camera.position.copy(controls.target).add(direction.multiplyScalar(distance));
    controls.minDistance = Math.max(12.8, distance * 0.72);
    controls.maxDistance = Math.max(30, distance * 2);
    controls.update();
  };

  const setDisassembly = (on, instant = false) => {
    if (!on) {
      disassemblyTarget = 0;
      selectedLayer = "";
      hideLayerPanel();
      if (selected === "earth") {
        controls.target.set(0, 0, 0);
        setControlRange();
      }
      if (instant) {
        disassemblyCurrent = 0;
        [earthState, keplerState].forEach((s) => {
          s.disassembly.group.visible = false;
          s.surface.visible = true;
          s.clouds.visible = true;
          s.atmosphere.visible = true;
          s.surface.position.set(0, 0, 0);
          s.clouds.position.set(0, 0, 0);
          s.atmosphere.position.set(0, 0, 0);
          s.surface.scale.setScalar(1);
          s.clouds.scale.setScalar(1);
          s.atmosphere.scale.setScalar(1);
          s.disassembly.layers.forEach((entry) => entry.mesh.position.set(0, 0, 0));
          setLayerHighlight(s, "");
        });
      }
      setModeUi();
      return;
    }

    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    if (!expanded) return;

    disassemblyKey = selected;
    disassemblyTarget = 1;
    if (selected === "earth") frameEarthCutaway();
    const layers = activeState().disassembly.layers;
    const first =
      (selected === "earth" ? layers.find((entry) => entry.def.id === "earth-crust") : null) || layers[0];
    if (first) {
      selectedLayer = first.def.id;
      setLayerHighlight(activeState(), selectedLayer);
      layerPanel.hidden = false;
      layerTitle.textContent = first.def.name;
      layerText.textContent = first.def.info;
    }
    setModeUi();
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
    tapTimes = [];
    tapKey = "";
    setDisassembly(false, true);
    disassemblyKey = "";
    applySelection();
    setControlRange();
    setModeUi();
  };

  const pointerFromEvent = (event) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    return true;
  };

  const pickLayer = (event) => {
    if (disassemblyCurrent < 0.54 || disassemblyKey !== selected) return null;
    if (!pointerFromEvent(event)) return null;
    const s = activeState();
    if (!s.disassembly.group.visible) return null;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(s.disassembly.layers.map((entry) => entry.mesh), true);
    if (!hits.length) return null;

    let node = hits[0].object;
    while (node && !node.userData.layerId) node = node.parent;
    const layerId = node?.userData.layerId;
    if (!layerId) return null;

    const layer = s.disassembly.layers.find((entry) => entry.def.id === layerId);
    if (!layer) return null;

    selectedLayer = layerId;
    setLayerHighlight(s, selectedLayer);
    layerPanel.hidden = false;
    layerTitle.textContent = layer.def.name;
    layerText.textContent = layer.def.info;

    return layerId;
  };

  const hitActiveBody = (event) => {
    if (!pointerFromEvent(event)) return false;
    const s = activeState();
    raycaster.setFromCamera(pointer, camera);
    const targets = disassemblyCurrent > 0.02 && disassemblyKey === selected
      ? s.disassembly.layers.map((entry) => entry.mesh)
      : [s.surface];
    return raycaster.intersectObjects(targets, true).length > 0;
  };

  const registerTriple = () => {
    if (tapKey !== selected) {
      tapKey = selected;
      tapTimes = [];
    }
    const now = performance.now();
    tapTimes = tapTimes.filter((t) => now - t <= RAPID_TAP_WINDOW_MS);
    tapTimes.push(now);
    if (tapTimes.length < RAPID_TAP_COUNT) return;
    tapTimes = [];
    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    if (!expanded) return;
    if (disassemblyTarget < 0.5) setDisassembly(true);
    else setDisassembly(false);
  };

  const onResize = () => {
    const w = Math.max(1, stage.clientWidth);
    const h = Math.max(1, stage.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    previews.forEach((p) => p.resize());
  };

  const syncExpandUi = () => {
    const expanded = fallbackExpanded || document.fullscreenElement === stage;
    stage.classList.toggle("is-expanded", fallbackExpanded);
    expandBackdrop.hidden = !fallbackExpanded;
    document.body.classList.toggle("earth-kepler-expanded-open", fallbackExpanded);
    expandBtn.textContent = expanded ? "Micsoreaza" : "Mareste";
    expandBtn.setAttribute("aria-pressed", expanded ? "true" : "false");

    if (!expanded && disassemblyTarget > 0.01) {
      setDisassembly(false, true);
      disassemblyKey = "";
    }

    setControlRange();
    setModeUi();
    onResize();
  };

  const onExpandSafe = () => {
    const run = async () => {
      if (document.fullscreenEnabled && typeof stage.requestFullscreen === "function") {
        if (document.fullscreenElement === stage) await document.exitFullscreen();
        else await stage.requestFullscreen();
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

  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    pointerDown = { x: e.clientX, y: e.clientY };
    pointerDragged = false;
    startCamera = camera.position.clone();
    startTarget = controls.target.clone();
    canvas.classList.add("is-grabbing");
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!pointerDown) return;
    const dx = e.clientX - pointerDown.x;
    const dy = e.clientY - pointerDown.y;
    if (Math.hypot(dx, dy) > CLICK_DRAG_THRESHOLD) pointerDragged = true;
  });

  const onPointerEnd = (e) => {
    if (!pointerDown) return;
    canvas.classList.remove("is-grabbing");
    const moved =
      startCamera?.distanceToSquared(camera.position) > 0.0005 ||
      startTarget?.distanceToSquared(controls.target) > 0.0005;

    pointerDown = null;
    startCamera = null;
    startTarget = null;

    if (pointerDragged || moved) {
      pointerDragged = false;
      return;
    }

    const layerHit = pickLayer(e);
    if (layerHit || hitActiveBody(e)) registerTriple();
  };

  canvas.addEventListener("pointerup", onPointerEnd);
  canvas.addEventListener("pointerleave", () => {
    canvas.classList.remove("is-grabbing");
    pointerDown = null;
    pointerDragged = false;
    startCamera = null;
    startTarget = null;
  });

  expandBtn.addEventListener("click", onExpandSafe);
  expandBackdrop.addEventListener("click", () => {
    if (!fallbackExpanded) return;
    fallbackExpanded = false;
    syncExpandUi();
  });

  const onKeyDown = (e) => {
    if (e.key === "Escape" && fallbackExpanded) {
      fallbackExpanded = false;
      syncExpandUi();
    }
  };

  const onFullscreen = () => syncExpandUi();

  window.addEventListener("keydown", onKeyDown);
  document.addEventListener("fullscreenchange", onFullscreen);
  window.addEventListener("resize", onResize);

  const observer = new window.IntersectionObserver((entries) => {
    sectionVisible = entries.some((entry) => entry.isIntersecting);
  }, { threshold: 0.15 });
  observer.observe(section);

  const applyTextures = async () => {
    const [earthMapRes, earthNightRes, marsRes, venusRes] = await Promise.allSettled([
      loadTexture(loader, renderer, "earth.jpg"),
      loadTexture(loader, renderer, "earth_night.jpg"),
      loadTexture(loader, renderer, "mars.jpg"),
      loadTexture(loader, renderer, "venus.jpg")
    ]);

    const earthMap = earthMapRes.status === "fulfilled" ? earthMapRes.value : null;
    const earthNight = earthNightRes.status === "fulfilled" ? earthNightRes.value : null;
    const marsMap = marsRes.status === "fulfilled" ? marsRes.value : null;
    const venusMap = venusRes.status === "fulfilled" ? venusRes.value : null;

    if (earthMap) {
      earthState.surface.material.map = earthMap;
      earthState.surface.material.color = new THREE.Color(0xffffff);
      earthState.surface.material.emissiveMap = earthMap;
      earthState.surface.material.emissive = new THREE.Color(0x86aee8);
      earthState.surface.material.emissiveIntensity = 0.08;
    }
    if (earthNight) {
      earthNight.dispose?.();
    }
    earthState.surface.material.needsUpdate = true;

    earthState.clouds.material.map = setupTexture(
      new THREE.CanvasTexture(cloudTexture(12742, [246, 252, 255], 420)),
      renderer
    );
    earthState.clouds.material.opacity = 0.14;
    earthState.clouds.material.needsUpdate = true;

    const earthLayerTextures = {
      "earth-crust": setupTexture(
        new THREE.CanvasTexture(layerTexture(1201, [0x5e482d, 0x9a7744, 0xb89355, 0x3e2e1d], 1200)),
        renderer
      ),
      "earth-upper-mantle": setupTexture(
        new THREE.CanvasTexture(layerTexture(1202, [0x8a2b17, 0xd9551f, 0xee7f38, 0x682114], 1550)),
        renderer
      ),
      "earth-lower-mantle": setupTexture(
        new THREE.CanvasTexture(layerTexture(1203, [0x4a0d0d, 0x9f1111, 0xd01f14, 0x2e0808], 1650)),
        renderer
      ),
      "earth-outer-core": setupTexture(
        new THREE.CanvasTexture(layerTexture(1204, [0x8b290c, 0xff8a2f, 0xffbe63, 0xf26f1a], 1450)),
        renderer
      ),
      "earth-inner-core": setupTexture(
        new THREE.CanvasTexture(layerTexture(1205, [0xe7d59d, 0xfff4bc, 0xffe692, 0xd6bf7a], 900)),
        renderer
      )
    };

    earthState.disassembly.layers.forEach((entry) => {
      const texture = earthLayerTextures[entry.def.id];
      if (!texture) return;
      entry.textureMaterials.forEach((material) => {
        material.map = texture;
        material.roughness = 0.82;
        material.needsUpdate = true;
      });
    });

    const keplerCanvas = blendKeplerMap(marsMap?.image, venusMap?.image);
    const keplerTex = setupTexture(new THREE.CanvasTexture(keplerCanvas), renderer);
    keplerState.surface.material.map = keplerTex;
    keplerState.surface.material.color = new THREE.Color(0xd79c67);
    keplerState.surface.material.needsUpdate = true;
    keplerState.clouds.material.map = setupTexture(new THREE.CanvasTexture(cloudTexture(45217000, [250, 236, 214], 1100)), renderer);
    keplerState.clouds.material.needsUpdate = true;

    if (previews[0]) {
      if (earthMap) previews[0].material.map = earthMap;
      previews[0].material.needsUpdate = true;
    }
    if (previews[1]) {
      previews[1].material.map = keplerTex;
      previews[1].material.color = new THREE.Color(0xd79c67);
      previews[1].material.needsUpdate = true;
    }
  };

  applyTextures().catch(() => {
    // Keep fallback material colors.
  });

  hideLayerPanel();
  applySelection();
  setControlRange();
  syncExpandUi();
  onResize();

  let raf = 0;
  const animate = () => {
    raf = window.requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;

    disassemblyCurrent += (disassemblyTarget - disassemblyCurrent) * Math.min(1, delta * 5.2);
    if (Math.abs(disassemblyCurrent - disassemblyTarget) < 0.0008) disassemblyCurrent = disassemblyTarget;

    if (disassemblyKey && disassemblyTarget === 0 && disassemblyCurrent <= 0.01) {
      disassemblyKey = "";
      selectedLayer = "";
      hideLayerPanel();
      setLayerHighlight(earthState, "");
      setLayerHighlight(keplerState, "");
    }

    const state = activeState();
    const exploded = disassemblyKey === selected && disassemblyCurrent > 0.01;

    if (!exploded) {
      state.surface.visible = true;
      state.clouds.visible = true;
      state.atmosphere.visible = true;
      if (state.key === "earth") state.surface.material.emissiveIntensity = 0.18;
      if (state.key === "earth") state.clouds.material.opacity = state.def.cloudOpacity;
      state.disassembly.group.visible = false;
      state.surface.position.set(0, 0, 0);
      state.clouds.position.set(0, 0, 0);
      state.atmosphere.position.set(0, 0, 0);
      state.surface.scale.setScalar(1);
      state.clouds.scale.setScalar(1);
      state.atmosphere.scale.setScalar(1);

      if (!pointerDown) {
        state.surface.rotation.y += state.def.spin * delta;
        state.clouds.rotation.y += state.def.spin * 1.14 * delta;
      }
      state.disassembly.layers.forEach((entry) => {
        entry.mesh.position.set(0, 0, 0);
      });
    } else if (state.key === "earth") {
      const globeTargetX = -6.5;
      const globeScale = THREE.MathUtils.lerp(1, 0.72, disassemblyCurrent);
      const yawEase = Math.min(1, delta * 2.8);
      const showcaseYaw = state.def.cutawayYaw ?? state.surface.rotation.y;
      state.surface.visible = true;
      state.clouds.visible = true;
      state.atmosphere.visible = false;
      state.disassembly.group.visible = true;
      state.surface.material.emissiveIntensity = 0.28;
      state.clouds.material.opacity = 0.2;
      state.surface.position.set(globeTargetX * disassemblyCurrent, 0, -0.08 * disassemblyCurrent);
      state.clouds.position.copy(state.surface.position);
      state.atmosphere.position.copy(state.surface.position);
      state.surface.scale.setScalar(globeScale);
      state.clouds.scale.setScalar(globeScale);
      state.atmosphere.scale.setScalar(globeScale);
      state.disassembly.group.rotation.set(0, 0, 0);

      if (!pointerDown) {
        state.surface.rotation.y += shortestAngleDelta(state.surface.rotation.y, showcaseYaw) * yawEase;
        state.clouds.rotation.y += shortestAngleDelta(state.clouds.rotation.y, showcaseYaw + 0.12) * yawEase;
        state.clouds.rotation.y += state.def.spin * 0.035 * delta;
      }

      state.disassembly.layers.forEach((entry) => {
        entry.mesh.position.set(
          (entry.def.x ?? entry.stack.x) * disassemblyCurrent,
          (entry.def.y ?? 0) * disassemblyCurrent,
          (entry.def.zOffset ?? 0) * disassemblyCurrent
        );
        if (entry.def.shape === "earthCap") {
          entry.mesh.rotation.set(0, 0, 0);
          const camDir = camera.position.clone().normalize();
          entry.mesh.material.clippingPlanes[0].set(camDir.negate(), 0);
        }
        if (entry.def.id === "earth-inner-core") {
          entry.mesh.scale.setScalar(1 + 0.018 * Math.sin(elapsed * 2.4));
        }
      });
    } else {
      state.surface.material.emissiveIntensity = state.key === "earth" ? 0.18 : state.surface.material.emissiveIntensity;
      state.surface.visible = false;
      state.clouds.visible = false;
      state.atmosphere.visible = true;
      state.disassembly.group.visible = true;
      state.disassembly.group.rotation.y += state.def.spin * delta * 0.68;
      state.disassembly.group.rotation.z = Math.sin(elapsed * 0.25 + state.def.radius) * 0.035 * disassemblyCurrent;
      state.disassembly.layers.forEach((entry) => {
        const shift = (entry.def.spread || 0) * state.def.radius * disassemblyCurrent;
        entry.mesh.position.copy(entry.dir).multiplyScalar(shift);
        if (entry.def.shape === "torus") entry.mesh.rotation.y += delta * 0.4;
      });
    }

    if (state.atmosphere.visible) {
      state.atmosphere.rotation.y += state.def.spin * 0.18 * delta;
    }
    stars.rotation.y += delta * 0.005;
    stars.rotation.x = Math.sin(elapsed * 0.04) * 0.03;

    setModeUi();
    controls.update();

    if ((sectionVisible || fallbackExpanded || document.fullscreenElement === stage) && !document.hidden) {
      renderer.render(scene, camera);
      previews.forEach((p) => {
        p.mesh.rotation.y += p.spin * 0.65 * delta;
        p.renderer.render(p.scene, p.camera);
      });
    }
  };
  animate();

  window.addEventListener("beforeunload", () => {
    window.cancelAnimationFrame(raf);
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("fullscreenchange", onFullscreen);
    if (switchTimer) window.clearTimeout(switchTimer);
    canvas.classList.remove("is-grabbing");
    stage.classList.remove("is-expanded");
    document.body.classList.remove("earth-kepler-expanded-open");
    expandBackdrop.hidden = true;
    if (document.fullscreenElement === stage && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }, { once: true });
}
