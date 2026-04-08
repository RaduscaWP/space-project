const VOYAGER_MODEL_MAIN_URL = "assets/models/voyager-probe-b.glb";
const VOYAGER_MODEL_DETAIL_URL = "assets/models/voyager-probe-b-antenna.glb";
const DRACO_DECODER_PATH = "assets/libs/draco/";
const SPACE_PANORAMA_URL = "assets/images/starfield-eso-allsky.jpg";

const RAPID_CLICK_WINDOW_MS = 1000;
const RAPID_CLICK_TARGET = 3;

const VOYAGER_PART_LIBRARY = {
  antenna: {
    title: "Antena de mare castig",
    functionText:
      "Function: transmite/primeste semnale radio pe distante interstelare folosind Deep Space Network.",
    materialText:
      "Materiale: aluminiu structural, suprafete metalice cu acoperiri termo-optice si elemente compozite.",
    noteText:
      "Detaliu: orientarea antenei este critica, pentru ca puterea semnalului la Pamant este extrem de mica.",
    explodeAxis: [1.12, 0.26, 0.08],
    explodeDistance: 1.42
  },
  bus: {
    title: "Corpul sondei (bus)",
    functionText:
      "Function: gazduieste avionica, telecomunicatii, control atitudine, memorie si distributia energiei.",
    materialText:
      "Materiale: aluminiu, titan local, cablaje ecranate, panouri structurale multistrat.",
    noteText:
      "Detaliu: aici sunt sistemele care mentin misiunea operationala de zeci de ani.",
    explodeAxis: [-0.34, 0.28, -0.35],
    explodeDistance: 1.06
  },
  booms: {
    title: "Brate si structuri externe",
    functionText:
      "Function: separa senzori/instrumente de corp pentru masuratori mai curate ale campurilor si plasmei.",
    materialText:
      "Materiale: elemente metalice usoare, suporturi rigide si puncte de fixare amortizate.",
    noteText:
      "Detaliu: geometria acestor brate reduce interferentele produse de electronica principala.",
    explodeAxis: [-0.92, 0.34, 0.72],
    explodeDistance: 1.56
  },
  rtg: {
    title: "Sistem energetic RTG",
    functionText:
      "Function: genereaza energie electrica din caldura radioizotopica (nu din lumina solara).",
    materialText:
      "Materiale: unitati RTG ecranate, elemente termo-electrice si radiatoare dedicate.",
    noteText:
      "Important: Voyager nu are panouri solare; la aceasta distanta energia vine din RTG.",
    explodeAxis: [-0.68, -0.8, 0.38],
    explodeDistance: 1.68
  },
  instruments: {
    title: "Pachet de instrumente stiintifice",
    functionText:
      "Function: masoara plasma, campuri magnetice, radiatii si particule energetice din heliosfera/interstelar.",
    materialText:
      "Materiale: senzori de inalta precizie, componente electronice ecranate si carcase termo-stabile.",
    noteText:
      "Detaliu: datele acestor instrumente au confirmat iesirea in mediul interstelar.",
    explodeAxis: [0.22, 0.78, 0.76],
    explodeDistance: 1.44
  },
  golden_record: {
    title: "Golden Record",
    functionText:
      "Function: arhiva culturala cu sunete, imagini si muzica de pe Pamant, destinata unui posibil contact viitor.",
    materialText:
      "Materiale: disc placat cu aur, carcasa de protectie si instructiuni gravate.",
    noteText:
      "Detaliu: include saluturi in mai multe limbi si secvente audio reprezentative pentru omenire.",
    explodeAxis: [-0.12, 0.14, 1.08],
    explodeDistance: 1.32
  }
};

export function initVoyager() {
  const section = document.getElementById("voyager");
  const viewer = document.getElementById("voyager-viewer");
  const canvas = document.getElementById("voyager-canvas");
  const expandButton = document.getElementById("voyager-expand");
  const expandBackdrop = document.getElementById("voyager-expand-backdrop");
  const modeChip = document.getElementById("voyager-mode-chip");
  const explodeHint = document.getElementById("voyager-explode-hint");
  const partPanel = document.getElementById("voyager-part-panel");
  const partTitle = document.getElementById("voyager-part-title");
  const partFunction = document.getElementById("voyager-part-function");
  const partMaterial = document.getElementById("voyager-part-material");
  const partNote = document.getElementById("voyager-part-note");
  const openButton = document.getElementById("voyager-probe");
  const resetButton = document.getElementById("voyager-reset");
  const status = document.getElementById("interstellar-status");
  const modal = document.getElementById("voyager-modal");
  const closeButton = document.getElementById("voyager-close");
  const distanceNode = document.getElementById("voyager-distance-live");
  const loadingNode = document.getElementById("voyager-loading");
  const fallbackNode = document.getElementById("voyager-fallback");

  if (
    !section ||
    !viewer ||
    !canvas ||
    !expandButton ||
    !expandBackdrop ||
    !modeChip ||
    !explodeHint ||
    !partPanel ||
    !partTitle ||
    !partFunction ||
    !partMaterial ||
    !partNote ||
    !openButton ||
    !resetButton ||
    !status ||
    !modal ||
    !closeButton ||
    !distanceNode ||
    !loadingNode ||
    !fallbackNode
  ) {
    return;
  }

  let distance = Number.parseFloat(distanceNode.textContent.replace(",", ".")) || 24.0;
  const distanceTimer = window.setInterval(() => {
    distance += 0.002;
    distanceNode.textContent = distance.toFixed(3);
  }, 2600);

  const viewerApi = initVoyagerViewer({
    section,
    viewer,
    canvas,
    expandButton,
    expandBackdrop,
    modeChip,
    explodeHint,
    partPanel,
    partTitle,
    partFunction,
    partMaterial,
    partNote,
    resetButton,
    status,
    loadingNode,
    fallbackNode
  });

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  const onKeyDown = (event) => {
    if (event.key === "Escape") closeModal();
  };
  window.addEventListener("keydown", onKeyDown);

  window.addEventListener(
    "beforeunload",
    () => {
      window.clearInterval(distanceTimer);
      window.removeEventListener("keydown", onKeyDown);
      if (viewerApi && typeof viewerApi.dispose === "function") {
        viewerApi.dispose();
      }
    },
    { once: true }
  );
}

function initVoyagerViewer({
  section,
  viewer,
  canvas,
  expandButton,
  expandBackdrop,
  modeChip,
  explodeHint,
  partPanel,
  partTitle,
  partFunction,
  partMaterial,
  partNote,
  resetButton,
  status,
  loadingNode,
  fallbackNode
}) {
  if (!window.THREE || !window.THREE.OrbitControls) {
    loadingNode.hidden = true;
    fallbackNode.hidden = false;
    status.classList.add("visible");
    modeChip.textContent = "3D indisponibil";
    return null;
  }

  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.physicallyCorrectLights = true;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 180);
  const homeCameraPosition = new THREE.Vector3(0.62, 1.04, 3.6);
  const homeTarget = new THREE.Vector3(0, 0.08, 0);
  camera.position.copy(homeCameraPosition);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.minDistance = 1.2;
  controls.maxDistance = 8.8;
  controls.minPolarAngle = 0.02;
  controls.maxPolarAngle = Math.PI - 0.02;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.34;
  controls.target.copy(homeTarget);
  controls.update();

  const ambient = new THREE.AmbientLight(0x7589a8, 0.52);
  const hemisphere = new THREE.HemisphereLight(0x8bb6ff, 0x0c1320, 0.42);
  const key = new THREE.DirectionalLight(0xfff1d9, 2.1);
  const rim = new THREE.DirectionalLight(0x71aef4, 1.05);
  const warm = new THREE.PointLight(0xffc77f, 8.2, 34, 2.1);

  key.position.set(4.7, 2.8, 4.2);
  rim.position.set(-3.8, 1.8, -3.2);
  warm.position.set(1.35, -0.9, 2.2);

  scene.add(ambient, hemisphere, key, rim, warm);

  const textureLoader = new THREE.TextureLoader();
  const realSpace = createRealSpaceBackdrop(THREE, textureLoader);
  scene.add(realSpace);

  const starsFar = createStarShell(THREE, {
    count: 1300,
    innerRadius: 26,
    outerRadius: 74,
    size: 0.085,
    opacity: 0.56
  });
  const starsNear = createStarShell(THREE, {
    count: 860,
    innerRadius: 14,
    outerRadius: 38,
    size: 0.12,
    opacity: 0.62
  });
  scene.add(starsFar, starsNear);

  const modelRoot = new THREE.Group();
  scene.add(modelRoot);

  const fallbackModel = createFallbackVoyager(THREE);
  fallbackModel.visible = true;
  modelRoot.add(fallbackModel);

  let activeModel = fallbackModel;
  let autoRotateResumeTimer = 0;
  let frame = 0;
  let destroyed = false;
  let inView = false;
  let fallbackExpanded = false;
  let explodeTarget = 0;
  let explodeCurrent = 0;
  let explodedUiState = false;
  let selectedPartId = "";
  let clickWindow = [];

  let interactiveMeshes = [];
  let partMap = new Map();

  prepareModelPartMap(fallbackModel);

  const onControlStart = () => {
    if (autoRotateResumeTimer) window.clearTimeout(autoRotateResumeTimer);
    controls.autoRotate = false;
  };

  const onControlEnd = () => {
    if (autoRotateResumeTimer) window.clearTimeout(autoRotateResumeTimer);
    autoRotateResumeTimer = window.setTimeout(() => {
      if (explodeTarget > 0.5) return;
      controls.autoRotate = true;
    }, 1200);
  };

  controls.addEventListener("start", onControlStart);
  controls.addEventListener("end", onControlEnd);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const pointerState = { x: 0, y: 0, moved: false };

  const onPointerDown = (event) => {
    canvas.classList.add("is-grabbing");
    pointerState.x = event.clientX;
    pointerState.y = event.clientY;
    pointerState.moved = false;
  };

  const onPointerMove = (event) => {
    const dx = event.clientX - pointerState.x;
    const dy = event.clientY - pointerState.y;
    if (dx * dx + dy * dy > 36) pointerState.moved = true;
  };

  const onPointerUp = (event) => {
    canvas.classList.remove("is-grabbing");
    if (pointerState.moved) return;

    const rapidToggled = isExpanded() ? registerRapidTap() : false;
    if (!rapidToggled && explodeCurrent > 0.54) {
      const hitPartId = pickPart(event.clientX, event.clientY);
      if (hitPartId) selectPart(hitPartId);
    }
  };

  const onPointerLeave = () => {
    canvas.classList.remove("is-grabbing");
    pointerState.moved = true;
  };

  const onWindowPointerUp = () => {
    canvas.classList.remove("is-grabbing");
  };

  function registerRapidTap() {
    const now = performance.now();
    clickWindow = clickWindow.filter((time) => now - time <= RAPID_CLICK_WINDOW_MS);
    clickWindow.push(now);
    if (clickWindow.length >= RAPID_CLICK_TARGET) {
      clickWindow = [];
      toggleExplodedMode();
      return true;
    }
    return false;
  }

  function pickPart(clientX, clientY) {
    if (!interactiveMeshes.length) return "";
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return "";

    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersections = raycaster.intersectObjects(interactiveMeshes, true);
    if (!intersections.length) return "";

    let node = intersections[0].object;
    while (node && !node.userData.voyagerPartId) node = node.parent;
    return node && node.userData.voyagerPartId ? node.userData.voyagerPartId : "";
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  window.addEventListener("pointerup", onWindowPointerUp);

  const isNativeFullscreen = () => document.fullscreenElement === viewer;
  const isExpanded = () => fallbackExpanded || isNativeFullscreen();
  const shouldRender = () => !destroyed && !document.hidden && (inView || isExpanded());

  function syncExpandUi() {
    const expanded = isExpanded();
    viewer.classList.toggle("is-expanded", fallbackExpanded);
    document.body.classList.toggle("voyager-expanded-open", fallbackExpanded);
    expandBackdrop.hidden = !fallbackExpanded;

    expandButton.textContent = expanded ? "Micsoreaza" : "Mareste";
    expandButton.setAttribute("aria-pressed", expanded ? "true" : "false");
    expandButton.setAttribute(
      "aria-label",
      expanded ? "Revino la marimea normala a ferestrei Voyager" : "Mareste fereastra Voyager"
    );

    if (!expanded && explodeTarget > 0) {
      setExplodedMode(false);
    }

    explodeHint.style.opacity = expanded ? "1" : "0.78";
    if (!expanded) {
      explodeHint.textContent = "Mareste fereastra pentru modul disociere 3D (triple-click in 1 secunda).";
    }

    updateModeChip();

    resizeRenderer();
    requestFrame();
  }

  function updateModeChip() {
    const expanded = isExpanded();
    if (explodeCurrent > 0.54) {
      modeChip.textContent = "Mod disociere activ";
      return;
    }

    if (expanded) {
      modeChip.textContent = "Mod marit";
      return;
    }

    modeChip.textContent = "Mod standard";
  }

  function setExplodedMode(nextState) {
    const enable = Boolean(nextState);
    explodeTarget = enable ? 1 : 0;
    clickWindow = [];

    if (enable) {
      controls.autoRotate = false;
      status.classList.add("visible");
      status.textContent = "Mod disociere: selecteaza componentele prin click";
      explodeHint.textContent = "Apasa din nou rapid de 3 ori pentru a reveni la modelul compact.";
    } else {
      if (autoRotateResumeTimer) window.clearTimeout(autoRotateResumeTimer);
      autoRotateResumeTimer = window.setTimeout(() => {
        controls.autoRotate = true;
      }, 350);

      status.textContent = "Spatiu interstelar";
      const expanded = isExpanded();
      explodeHint.textContent = expanded
        ? "In modul marit: apasa rapid de 3 ori pe Voyager (in 1 secunda) pentru disociere pe componente."
        : "Mareste fereastra pentru modul disociere 3D (triple-click in 1 secunda).";
      clearSelectedPart();
    }

    updateModeChip();
    requestFrame();
  }

  function toggleExplodedMode() {
    if (!isExpanded()) return;
    const shouldEnable = explodeTarget < 0.5;
    setExplodedMode(shouldEnable);
  }

  function clearSelectedPart() {
    if (!selectedPartId || !partMap.has(selectedPartId)) {
      selectedPartId = "";
      partPanel.hidden = true;
      return;
    }

    const previous = partMap.get(selectedPartId);
    previous.meshes.forEach((mesh) => setMeshHighlight(mesh, false));
    selectedPartId = "";
    partPanel.hidden = true;
  }

  function selectPart(partId) {
    if (!partId || !partMap.has(partId)) return;
    if (selectedPartId === partId) return;

    clearSelectedPart();

    const entry = partMap.get(partId);
    selectedPartId = partId;

    entry.meshes.forEach((mesh) => setMeshHighlight(mesh, true));

    partTitle.textContent = entry.meta.title;
    partFunction.innerHTML = `<strong>Rol:</strong> ${entry.meta.functionText.replace(/^Function:\s*/i, "")}`;
    partMaterial.innerHTML = `<strong>Materiale:</strong> ${entry.meta.materialText.replace(/^Materiale:\s*/i, "")}`;
    partNote.innerHTML = `<strong>Nota:</strong> ${entry.meta.noteText.replace(/^Detaliu:\s*/i, "").replace(/^Important:\s*/i, "")}`;
    partPanel.hidden = false;
  }

  function prepareModelPartMap(root) {
    clearSelectedPart();
    interactiveMeshes = [];
    partMap = new Map();

    const partIds = Object.keys(VOYAGER_PART_LIBRARY);
    partIds.forEach((partId) => {
      const source = VOYAGER_PART_LIBRARY[partId];
      partMap.set(partId, {
        id: partId,
        meta: source,
        direction: new THREE.Vector3(...source.explodeAxis).normalize(),
        distance: source.explodeDistance,
        meshes: []
      });
    });

    const localCenter = new THREE.Vector3();

    root.traverse((node) => {
      if (!node.isMesh) return;

      const partId = classifyVoyagerPart(node, root, localCenter, THREE);
      const bucket = partMap.get(partId) || partMap.get("bus");

      node.userData.voyagerPartId = bucket.id;
      node.userData.voyagerBasePosition = node.position.clone();
      node.userData.voyagerHighlightBase = captureMaterialHighlightState(node.material);

      bucket.meshes.push(node);
      interactiveMeshes.push(node);
    });

    partMap.forEach((entry, partId) => {
      if (entry.meshes.length) return;
      partMap.delete(partId);
    });
  }

  const onFullscreenChange = () => {
    syncExpandUi();
  };

  const onExpandClick = async () => {
    if (document.fullscreenEnabled && typeof viewer.requestFullscreen === "function") {
      if (isNativeFullscreen()) {
        await document.exitFullscreen();
      } else {
        await viewer.requestFullscreen();
      }
      return;
    }

    fallbackExpanded = !fallbackExpanded;
    syncExpandUi();
  };

  const onExpandClickSafe = () => {
    onExpandClick().catch(() => {
      fallbackExpanded = !fallbackExpanded;
      syncExpandUi();
    });
  };

  const onBackdropClick = () => {
    if (!fallbackExpanded) return;
    fallbackExpanded = false;
    syncExpandUi();
  };

  const onExpandEscape = (event) => {
    if (event.key === "Escape" && fallbackExpanded) {
      fallbackExpanded = false;
      syncExpandUi();
    }
  };

  expandButton.addEventListener("click", onExpandClickSafe);
  expandBackdrop.addEventListener("click", onBackdropClick);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  window.addEventListener("keydown", onExpandEscape);

  const observer = new window.IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      inView = Boolean(entry && entry.isIntersecting);
      if (inView) requestFrame();
    },
    { threshold: 0.24 }
  );
  observer.observe(section);

  const resizeObserver = new window.ResizeObserver(() => {
    resizeRenderer();
    requestFrame();
  });
  resizeObserver.observe(viewer);

  const onVisibilityChange = () => {
    if (!document.hidden) requestFrame();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  const onResetClick = () => {
    controls.target.copy(homeTarget);
    camera.position.copy(homeCameraPosition);
    controls.update();
    controls.autoRotate = true;
    requestFrame();
  };
  resetButton.addEventListener("click", onResetClick);

  loadVoyagerModel({
    THREE,
    modelRoot,
    fallbackModel,
    loadingNode,
    fallbackNode,
    onLoaded(model) {
      activeModel = model;
      prepareModelPartMap(activeModel);
      status.classList.add("visible");
      updateModeChip();
      requestFrame();
    }
  });

  function resizeRenderer() {
    const rect = viewer.getBoundingClientRect();
    const width = Math.max(2, Math.floor(rect.width));
    const height = Math.max(2, Math.floor(rect.height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();

  function tick() {
    frame = 0;
    if (!shouldRender()) return;

    const delta = clock.getDelta();
    const elapsed = clock.elapsedTime;

    const skyPrimary = realSpace.userData.skyPrimary;
    const skySecondary = realSpace.userData.skySecondary;

    skyPrimary.rotation.y += delta * 0.0045;
    skySecondary.rotation.y -= delta * 0.0021;
    skySecondary.rotation.z = Math.sin(elapsed * 0.03) * 0.06;

    starsFar.rotation.y += delta * 0.0048;
    starsFar.rotation.x = Math.sin(elapsed * 0.09) * 0.024;
    starsNear.rotation.y -= delta * 0.0028;
    starsNear.rotation.x = Math.cos(elapsed * 0.12) * 0.028;

    if (activeModel) {
      activeModel.rotation.y += delta * 0.19;
      activeModel.rotation.z = Math.sin(elapsed * 0.16) * 0.014;
    }

    updateExplodedTransforms(delta);

    controls.update();
    renderer.render(scene, camera);
    requestFrame();
  }

  function requestFrame() {
    if (destroyed || frame || !shouldRender()) return;
    frame = window.requestAnimationFrame(tick);
  }

  function updateExplodedTransforms(delta) {
    if (!interactiveMeshes.length) return;

    const blend = Math.min(1, delta * 5.4);
    explodeCurrent += (explodeTarget - explodeCurrent) * blend;

    if (Math.abs(explodeTarget - explodeCurrent) < 0.0008) {
      explodeCurrent = explodeTarget;
    }

    partMap.forEach((entry) => {
      const amount = explodeCurrent * entry.distance;
      entry.meshes.forEach((mesh) => {
        const base = mesh.userData.voyagerBasePosition;
        if (!base) return;
        mesh.position.copy(base).addScaledVector(entry.direction, amount);
      });
    });

    const isExplodedNow = explodeCurrent > 0.54;
    if (isExplodedNow !== explodedUiState) {
      explodedUiState = isExplodedNow;
      updateModeChip();
      if (!isExplodedNow) clearSelectedPart();
    }
  }

  function disposeMaterial(material) {
    if (!material) return;
    const maps = [
      "map",
      "aoMap",
      "alphaMap",
      "bumpMap",
      "normalMap",
      "roughnessMap",
      "metalnessMap",
      "emissiveMap",
      "specularMap"
    ];
    maps.forEach((slot) => {
      if (material[slot]) material[slot].dispose();
    });
    material.dispose();
  }

  function disposeObject3D(root) {
    root.traverse((node) => {
      if (node.geometry) node.geometry.dispose();
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(node.material);
        }
      }
    });
  }

  syncExpandUi();

  return {
    dispose() {
      destroyed = true;
      if (frame) window.cancelAnimationFrame(frame);
      if (autoRotateResumeTimer) window.clearTimeout(autoRotateResumeTimer);

      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      expandButton.removeEventListener("click", onExpandClickSafe);
      expandBackdrop.removeEventListener("click", onBackdropClick);
      window.removeEventListener("keydown", onExpandEscape);
      resetButton.removeEventListener("click", onResetClick);
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("end", onControlEnd);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerup", onWindowPointerUp);

      fallbackExpanded = false;
      viewer.classList.remove("is-expanded");
      document.body.classList.remove("voyager-expanded-open");
      expandBackdrop.hidden = true;
      expandButton.textContent = "Mareste";
      expandButton.setAttribute("aria-pressed", "false");

      if (isNativeFullscreen() && document.fullscreenElement === viewer && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }

      disposeObject3D(scene);
      controls.dispose();
      renderer.dispose();
    }
  };
}

function captureMaterialHighlightState(material) {
  const list = Array.isArray(material) ? material : [material];
  return list.map((item) => {
    if (!item) return null;
    return {
      emissive: item.emissive && item.emissive.isColor ? item.emissive.clone() : null,
      emissiveIntensity: typeof item.emissiveIntensity === "number" ? item.emissiveIntensity : null
    };
  });
}

function setMeshHighlight(mesh, highlighted) {
  if (!mesh || !mesh.material) return;

  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  const baseState = Array.isArray(mesh.userData.voyagerHighlightBase) ? mesh.userData.voyagerHighlightBase : [];

  materials.forEach((material, index) => {
    if (!material || !material.emissive || !material.emissive.isColor) return;

    const base = baseState[index] || {};

    if (highlighted) {
      material.emissive.setRGB(0.2, 0.52, 0.92);
      material.emissiveIntensity = Math.max(0.85, base.emissiveIntensity ?? 0.7);
    } else {
      if (base.emissive && base.emissive.isColor) {
        material.emissive.copy(base.emissive);
      } else {
        material.emissive.setRGB(0, 0, 0);
      }

      if (typeof base.emissiveIntensity === "number") {
        material.emissiveIntensity = base.emissiveIntensity;
      } else {
        material.emissiveIntensity = 0.4;
      }
    }

    material.needsUpdate = true;
  });
}

function classifyVoyagerPart(mesh, modelRoot, targetVector, THREE) {
  const name = (mesh.name || "").toLowerCase();
  const materialNames = getMeshMaterialNames(mesh);
  const localCenter = getMeshLocalCenter(mesh, modelRoot, targetVector, THREE);

  if (name.includes("record") || materialNames.includes("brass")) return "golden_record";

  const seemsAntenna =
    name.includes("dish") ||
    name.includes("antenna") ||
    (name.includes("tube") && localCenter.x > 0.45) ||
    localCenter.x > 1.05;

  if (seemsAntenna) return "antenna";

  if (name.includes("boom") || name.includes("acc")) return "booms";

  const seemsRtg = localCenter.x < -0.48 && localCenter.y < -0.36;
  if (seemsRtg) return "rtg";

  if (name.includes("instrument") || name.includes("sensor")) return "instruments";
  if (localCenter.z > 0.58 && localCenter.y > -0.25) return "instruments";

  if (name.includes("body") || name.includes("cube") || name.includes("mesh") || name.includes("bus")) return "bus";

  return "bus";
}

function getMeshMaterialNames(mesh) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials
    .map((item) => (item && item.name ? item.name.toLowerCase() : ""))
    .filter(Boolean)
    .join(" ");
}

function getMeshLocalCenter(mesh, modelRoot, targetVector, THREE) {
  const worldBox = new THREE.Box3().setFromObject(mesh);
  worldBox.getCenter(targetVector);
  return modelRoot.worldToLocal(targetVector);
}

function loadVoyagerModel({ THREE, modelRoot, fallbackModel, loadingNode, fallbackNode, onLoaded }) {
  const LoaderCtor = window.THREE && window.THREE.GLTFLoader;
  if (!LoaderCtor) {
    fallbackModel.visible = true;
    loadingNode.hidden = true;
    fallbackNode.hidden = false;
    onLoaded(fallbackModel);
    return;
  }

  const loader = new LoaderCtor();
  const DracoCtor = window.THREE && window.THREE.DRACOLoader;
  let draco = null;

  if (DracoCtor) {
    draco = new DracoCtor();
    draco.setDecoderPath(DRACO_DECODER_PATH);
    loader.setDRACOLoader(draco);
  }

  Promise.allSettled([
    loadGltfAsset(loader, VOYAGER_MODEL_MAIN_URL),
    loadGltfAsset(loader, VOYAGER_MODEL_DETAIL_URL)
  ])
    .then((results) => {
      const mainResult = results[0];
      const detailResult = results[1];

      if (mainResult.status !== "fulfilled" || !mainResult.value) {
        fallbackModel.visible = true;
        loadingNode.hidden = true;
        fallbackNode.hidden = false;
        onLoaded(fallbackModel);
        return;
      }

      const model = assembleVoyagerModel(THREE, mainResult.value, detailResult.status === "fulfilled" ? detailResult.value : null);
      normalizeModel(THREE, model, 4.15);
      tuneModelMaterials(model);
      model.rotation.y = Math.PI * 0.235;

      modelRoot.add(model);
      fallbackModel.visible = false;
      loadingNode.hidden = true;
      fallbackNode.hidden = true;
      onLoaded(model);
    })
    .catch(() => {
      fallbackModel.visible = true;
      loadingNode.hidden = true;
      fallbackNode.hidden = false;
      onLoaded(fallbackModel);
    })
    .finally(() => {
      if (draco) draco.dispose();
    });
}

function loadGltfAsset(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        const scene = gltf.scene || (gltf.scenes && gltf.scenes[0]);
        if (!scene) {
          reject(new Error(`Empty glTF scene for ${url}`));
          return;
        }
        resolve(scene);
      },
      undefined,
      reject
    );
  });
}

function assembleVoyagerModel(THREE, mainModel, detailModel) {
  const group = new THREE.Group();
  mainModel.name = "voyager-main";
  group.add(mainModel);

  if (detailModel) {
    detailModel.name = "voyager-detail";
    alignDetailModelToMain(THREE, mainModel, detailModel);
    group.add(detailModel);
  }

  return group;
}

function alignDetailModelToMain(THREE, mainModel, detailModel) {
  const mainBox = new THREE.Box3().setFromObject(mainModel);
  const detailBox = new THREE.Box3().setFromObject(detailModel);

  const mainSize = mainBox.getSize(new THREE.Vector3());
  const detailSize = detailBox.getSize(new THREE.Vector3());
  const mainCenter = mainBox.getCenter(new THREE.Vector3());

  const mainMax = Math.max(mainSize.x, mainSize.y, mainSize.z) || 1;
  const detailMax = Math.max(detailSize.x, detailSize.y, detailSize.z) || 1;

  const rawScale = mainMax / detailMax;
  const scale = THREE.MathUtils.clamp(rawScale, 0.25, 4);
  detailModel.scale.multiplyScalar(scale);

  const detailBoxScaled = new THREE.Box3().setFromObject(detailModel);
  const detailCenterScaled = detailBoxScaled.getCenter(new THREE.Vector3());
  const centerOffset = mainCenter.sub(detailCenterScaled);
  detailModel.position.add(centerOffset);
  detailModel.scale.multiplyScalar(1.0015);
}

function tuneModelMaterials(model) {
  model.traverse((node) => {
    if (!node.isMesh) return;

    node.castShadow = true;
    node.receiveShadow = true;

    if (!node.material) return;

    const meshName = (node.name || "").toLowerCase();
    const materials = Array.isArray(node.material) ? node.material : [node.material];

    materials.forEach((material) => {
      const materialName = (material.name || "").toLowerCase();
      const hasMap = Boolean(material.map);
      const isBrass = materialName.includes("brass") || meshName.includes("record");
      const isDishOrAntenna =
        meshName.includes("dish") ||
        meshName.includes("antenna") ||
        meshName.includes("tube") ||
        meshName.includes("boom") ||
        meshName.includes("acc");

      if (hasMap) {
        material.map.anisotropy = 16;
        material.map.encoding = window.THREE.sRGBEncoding;
      }

      if (isBrass) {
        if ("color" in material) material.color.setRGB(0.82, 0.67, 0.42);
        if ("metalness" in material) material.metalness = 0.92;
        if ("roughness" in material) material.roughness = 0.28;
      } else if (isDishOrAntenna) {
        if ("metalness" in material) material.metalness = Math.max(material.metalness ?? 0, 0.82);
        if ("roughness" in material) material.roughness = Math.min(material.roughness ?? 0.5, 0.36);
        if ("color" in material && !hasMap) material.color.setRGB(0.78, 0.82, 0.88);
      } else {
        if ("metalness" in material) material.metalness = Math.min(0.7, (material.metalness ?? 0.2) + 0.18);
        if ("roughness" in material) material.roughness = Math.max(0.2, (material.roughness ?? 0.8) - 0.2);
      }

      if (materialName.includes("clear")) {
        material.transparent = true;
        material.opacity = 0.28;
        material.depthWrite = false;
      }

      material.needsUpdate = true;
    });
  });
}

function normalizeModel(THREE, model, targetSize) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = targetSize / maxDim;
  model.scale.setScalar(scale);

  box.setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
}

function createRealSpaceBackdrop(THREE, textureLoader) {
  const group = new THREE.Group();

  const skyTexture = textureLoader.load(SPACE_PANORAMA_URL);
  skyTexture.encoding = THREE.sRGBEncoding;
  skyTexture.wrapS = THREE.RepeatWrapping;
  skyTexture.wrapT = THREE.ClampToEdgeWrapping;
  skyTexture.anisotropy = 8;

  const primaryMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.78,
    depthWrite: false
  });

  const primarySphere = new THREE.Mesh(new THREE.SphereGeometry(82, 68, 48), primaryMaterial);
  primarySphere.rotation.set(THREE.MathUtils.degToRad(12), THREE.MathUtils.degToRad(126), 0);
  group.add(primarySphere);

  const secondaryTexture = skyTexture.clone();
  secondaryTexture.encoding = THREE.sRGBEncoding;
  secondaryTexture.wrapS = THREE.RepeatWrapping;
  secondaryTexture.wrapT = THREE.ClampToEdgeWrapping;
  secondaryTexture.repeat.set(1.08, 1);

  const secondaryMaterial = new THREE.MeshBasicMaterial({
    map: secondaryTexture,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const secondarySphere = new THREE.Mesh(new THREE.SphereGeometry(73, 52, 40), secondaryMaterial);
  secondarySphere.rotation.set(THREE.MathUtils.degToRad(-8), THREE.MathUtils.degToRad(20), THREE.MathUtils.degToRad(4));
  group.add(secondarySphere);

  group.userData.skyPrimary = primarySphere;
  group.userData.skySecondary = secondarySphere;
  return group;
}

function createStarShell(THREE, options = {}) {
  const {
    count = 900,
    innerRadius = 14,
    outerRadius = 40,
    size = 0.08,
    opacity = 0.58
  } = options;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    [1, 1, 1],
    [0.86, 0.93, 1],
    [1, 0.94, 0.82],
    [0.78, 0.88, 1]
  ];

  for (let i = 0; i < count; i += 1) {
    const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);
    const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const tone = palette[Math.floor(Math.random() * palette.length)];
    const intensity = THREE.MathUtils.randFloat(0.78, 1);
    colors[i * 3] = tone[0] * intensity;
    colors[i * 3 + 1] = tone[1] * intensity;
    colors[i * 3 + 2] = tone[2] * intensity;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });

  return new THREE.Points(geometry, material);
}

function createFallbackVoyager(THREE) {
  const root = new THREE.Group();

  const metal = new THREE.MeshStandardMaterial({ color: 0xb9c8d8, metalness: 0.8, roughness: 0.34 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2a3648, metalness: 0.5, roughness: 0.55 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd3b169, metalness: 0.85, roughness: 0.2 });

  const mainBus = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 1.18, 20), darkMetal);
  mainBus.rotation.z = Math.PI / 2;
  root.add(mainBus);

  const antenna = new THREE.Mesh(new THREE.SphereGeometry(1.04, 42, 30, 0, Math.PI * 2, 0, Math.PI / 2), metal);
  antenna.scale.set(1, 1, 0.2);
  antenna.position.x = 1.07;
  antenna.rotation.z = Math.PI / 2;
  root.add(antenna);

  const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 0.45, 14), darkMetal);
  feed.position.x = 1.33;
  feed.rotation.z = Math.PI / 2;
  root.add(feed);

  const dishArmA = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.8, 10), metal);
  dishArmA.position.set(0.92, 0.24, 0);
  dishArmA.rotation.z = Math.PI * 0.35;
  root.add(dishArmA);

  const dishArmB = dishArmA.clone();
  dishArmB.position.y *= -1;
  dishArmB.rotation.z *= -1;
  root.add(dishArmB);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 1.42, 12), metal);
  mast.position.x = -0.36;
  mast.rotation.z = Math.PI / 2;
  root.add(mast);

  const goldenRecord = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 30), gold);
  goldenRecord.position.set(-0.86, 0, 0.02);
  goldenRecord.rotation.y = Math.PI / 2;
  root.add(goldenRecord);

  for (let i = 0; i < 3; i += 1) {
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.28, 12), metal);
    boom.position.set(-0.28 - i * 0.08, -0.3 - i * 0.09, 0.2 + i * 0.07);
    boom.rotation.z = -0.9 - i * 0.16;
    root.add(boom);

    const rtg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.48, 16), darkMetal);
    rtg.position.set(-0.73 - i * 0.18, -0.86 - i * 0.16, 0.38 + i * 0.13);
    rtg.rotation.z = -0.48;
    root.add(rtg);
  }

  return root;
}
