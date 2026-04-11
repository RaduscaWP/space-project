import {
  PLANET_DEFS,
  TEXTURE_DIR,
  TEXTURE_REV,
  createAsteroidBelt,
  createLocalStarField,
  createZodiacalBand
} from "./solar-system.js?v=20260409g";

const CATALOG_SOURCES = [
  { url: "https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/v3/hyg_v38.csv.gz", gzip: true, label: "HYG v3.8" },
  { url: "https://raw.githubusercontent.com/astronexus/HYG-Database/main/hyg/v3/hyg_v37.csv.gz", gzip: true, label: "HYG v3.7" }
];

const MAX_STARS = 3000;
const INVALID_DIST_LIMIT = 100000;
const GROUP_HIT_PADDING = 58;
const STAR_HIT_RADIUS = 40;
const DEFAULT_MOVE_SPEED = 1.2;
const MIN_MOVE_SPEED = 0.35;
const MAX_MOVE_SPEED = 12;
const BASE_CAMERA_POSITION = [10, 3.1, 11.4];

const STEP_HINTS = [
  "Cauta 5 stele care formeaza litera W - constelatia Cassiopeia.",
  "Bine. Acum cauta 3 stele perfect aliniate - Centura lui Orion.",
  "Esti in Bratul Orion. Cauta o stea galbena stralucitoare singura - tipul G2, la fel ca Soarele nostru.",
  "Ai intrat in Sistemul Solar. Cauta Terra - a treia planeta de la Soare, albastra si insotita de Luna."
];

const STEP_META = [
  {
    name: "Cassiopeia",
    overlay:
      "Cauta forma de W. Daca te pierzi, foloseste butonul de recentrare ca sa revii direct spre zona corecta.",
    summary:
      "Cassiopeia e un mic zig-zag luminos. Ghidarea te ajuta sa o readuci in fata, nu sa ghicesti directia."
  },
  {
    name: "Centura lui Orion",
    overlay:
      "Tinteste trei stele aproape perfect aliniate. Daca vezi doar una sau doua, continua sa rotesti usor.",
    summary:
      "Pentru Orion cauti o linie clara. Cand ghidarea spune ca tinta e in fata, redu viteza si cauta alinierea."
  },
  {
    name: "Soarele",
    overlay:
      "Acum cauti o stea galbena solitara. Pastreaz-o in centru si apropie-te lent pana o poti selecta usor.",
    summary:
      "Soarele nu e intr-un grup. Daca ai multe stele in fata, recentreaza si cauta punctul galben singular."
  },
  {
    name: "Terra",
    overlay:
      "Ai intrat in Sistemul Solar. Terra este a treia planeta de la Soare. Daca te pierzi, apasa Recentreaza spre tinta.",
    summary:
      "Cauta planeta albastra cu o mica Luna. Ghidarea iti spune daca trebuie sa rotesti stanga, dreapta, sus sau jos."
  }
];

const SPECTRAL_COLORS = {
  O: 0x9bb0ff,
  B: 0xaac0ff,
  A: 0xf8fbff,
  F: 0xfff6df,
  G: 0xffe08a,
  K: 0xffb66f,
  M: 0xff6b5a
};

const TARGET_FALLBACKS = [
  { id: "sol-fallback", proper: "Sol", bf: "", label: "Sol", targetKey: "sol", group: "sol", spect: "G2V", mag: -26.7, lum: 1, x: 0.000005, y: 0, z: 0 },
  { id: "caph-fallback", proper: "Caph", bf: "11Bet Cas", label: "Caph", targetKey: "caph", group: "cas", spect: "F2III-IV", mag: 2.28, lum: 30.06076302628229, x: 8.600014, y: 0.344589, z: 14.409503 },
  { id: "schedar-fallback", proper: "Schedar", bf: "18Alp Cas", label: "Schedar", targetKey: "schedar", group: "cas", spect: "K0II-IIIvar", mag: 2.24, lum: 542.0008904016238, x: 37.984817, y: 6.784483, z: 58.379619 },
  { id: "gamma-cas-fallback", proper: "Cih", bf: "27Gam Cas", label: "Gamma Cas", targetKey: "gamma-cas", group: "cas", spect: "B0IV:evar", mag: 2.15, lum: 3407.218616593573, x: 79.836717, y: 20.168018, z: 146.837047 },
  { id: "ruchbah-fallback", proper: "Ruchbah", bf: "37Del Cas", label: "Ruchbah", targetKey: "ruchbah", group: "cas", spect: "A5Vv SB", mag: 2.66, lum: 69.82324040771711, x: 14.082378, y: 5.53413, z: 26.457567 },
  { id: "segin-fallback", proper: "Segin", bf: "45Eps Cas", label: "Segin", targetKey: "segin", group: "cas", spect: "B2pvar", mag: 3.35, lum: 634.453795775715, x: 49.169644, y: 26.806887, z: 113.163436 },
  { id: "mintaka-fallback", proper: "Mintaka", bf: "34Del Ori", label: "Mintaka", targetKey: "mintaka", group: "ori", spect: "O9.5II", mag: 2.25, lum: 4943.106869868354, x: 25.868117, y: 210.729667, z: -1.108306 },
  { id: "alnilam-fallback", proper: "Alnilam", bf: "46Eps Ori", label: "Alnilam", targetKey: "alnilam", group: "ori", spect: "B0Ia", mag: 1.69, lum: 67483.87308707573, x: 62.775122, y: 602.66691, z: -12.712683 },
  { id: "alnitak-fallback", proper: "Alnitak", bf: "50Zet Ori", label: "Alnitak", targetKey: "alnitak", group: "ori", spect: "O9.5Ib SB", mag: 1.74, lum: 8937.169608501978, x: 18.918488, y: 224.809409, z: -7.651875 }
];

const CANONICAL_TARGET_ORDER = TARGET_FALLBACKS.map((entry) => entry.targetKey);

export function initGasesteTerra() {
  const section = document.getElementById("gaseste-terra");
  const viewer = document.getElementById("gt-viewer");
  const canvas = document.getElementById("gt-canvas");
  const loading = document.getElementById("gt-loading");
  const progressFill = document.getElementById("gt-progress-fill");
  const progressTrack = document.querySelector(".gt-progress-track");
  const loadingStatus = document.getElementById("gt-loading-status");
  const errorEl = document.getElementById("gt-error");
  const hintEl = document.getElementById("gt-hint");
  const hintStep = document.getElementById("gt-hint-step");
  const hintText = document.getElementById("gt-hint-text");
  const minimap = document.getElementById("gt-minimap");
  const finaleEl = document.getElementById("gt-finale");
  const continueBtn = document.getElementById("gt-continue");
  const speedEl = document.getElementById("gt-speed");
  const distanceEl = document.getElementById("gt-distance");
  const objectiveTitle = document.getElementById("gt-objective-title");
  const objectiveCopy = document.getElementById("gt-objective-copy");
  const guideSummary = document.getElementById("gt-guide-summary");
  const directionTitle = document.getElementById("gt-direction-title");
  const directionText = document.getElementById("gt-direction-text");
  const overlayTitle = document.getElementById("gt-overlay-title");
  const overlayCopy = document.getElementById("gt-overlay-copy");
  const modeChip = document.getElementById("gt-mode-chip");
  const expandButton = document.getElementById("gt-expand");
  const expandBackdrop = document.getElementById("gt-expand-backdrop");
  const recenterButton = document.getElementById("gt-recenter");
  const resetButton = document.getElementById("gt-reset");

  if (
    !section ||
    !viewer ||
    !canvas ||
    !loading ||
    !progressFill ||
    !loadingStatus ||
    !hintEl ||
    !hintStep ||
    !hintText ||
    !minimap ||
    !finaleEl ||
    !continueBtn ||
    !speedEl ||
    !distanceEl ||
    !objectiveTitle ||
    !objectiveCopy ||
    !guideSummary ||
    !directionTitle ||
    !directionText ||
    !overlayTitle ||
    !overlayCopy ||
    !modeChip ||
    !expandButton ||
    !expandBackdrop ||
    !recenterButton ||
    !resetButton
  ) {
    return;
  }

  if (!window.THREE) {
    loading.hidden = true;
    errorEl.hidden = false;
    errorEl.classList.add("gt-error--badge");
    errorEl.innerHTML =
      "<p>Three.js nu este disponibil.</p><p class=\"gt-error-sub\">Sectiunea Gaseste Terra nu a putut fi pornita.</p>";
    return;
  }

  const sceneApi = buildScene({
    section,
    viewer,
    canvas,
    hintEl,
    hintStep,
    hintText,
    minimap,
    finaleEl,
    speedEl,
    distanceEl,
    objectiveTitle,
    objectiveCopy,
    guideSummary,
    directionTitle,
    directionText,
    overlayTitle,
    overlayCopy,
    modeChip,
    expandButton,
    expandBackdrop,
    recenterButton,
    resetButton
  });

  continueBtn.addEventListener("click", async () => {
    await sceneApi.collapseViewerForNavigation();
    window.setTimeout(() => {
      document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 110);
  });

  let started = false;
  let disposed = false;
  let hideErrorTimer = 0;

  const showErrorBadge = (title, subtitle) => {
    if (hideErrorTimer) window.clearTimeout(hideErrorTimer);
    errorEl.classList.add("gt-error--badge");
    errorEl.hidden = false;
    errorEl.innerHTML = `<p>${escapeHtml(title)}</p><p class="gt-error-sub">${escapeHtml(subtitle)}</p>`;
    hideErrorTimer = window.setTimeout(() => {
      errorEl.hidden = true;
      hideErrorTimer = 0;
    }, 4600);
  };

  const startLoading = async () => {
    if (started || disposed) return;
    started = true;

    try {
      const stars = await fetchStarData({
        onProgress(progress) {
          progressFill.style.width = `${progress}%`;
          progressTrack?.setAttribute("aria-valuenow", String(Math.round(progress)));
        },
        onStatus(message) {
          loadingStatus.textContent = message;
        }
      });

      if (disposed) return;
      loading.hidden = true;
      sceneApi.loadStars(stars);
      sceneApi.start();
    } catch (error) {
      console.warn("[Gaseste Terra] HYG fetch failed:", error);
      if (disposed) return;
      loading.hidden = true;
      showErrorBadge(
        "Catalogul HYG nu a putut fi descarcat.",
        "Pornim o versiune procedurala simplificata, cu aceleasi repere principale."
      );
      sceneApi.loadStars(buildFallbackStars());
      sceneApi.start();
    }
  };

  const preloadObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      preloadObserver.disconnect();
      startLoading();
    },
    { rootMargin: "160% 0px" }
  );

  preloadObserver.observe(section);

  window.addEventListener(
    "beforeunload",
    () => {
      disposed = true;
      preloadObserver.disconnect();
      if (hideErrorTimer) window.clearTimeout(hideErrorTimer);
      sceneApi.dispose();
    },
    { once: true }
  );
}

async function fetchStarData({ onProgress, onStatus }) {
  let lastError = null;

  for (const source of CATALOG_SOURCES) {
    try {
      onStatus(`Se incarca ${source.label}...`);
      onProgress(2);

      const text = await fetchCatalogText(source, {
        onProgress(progress) {
          onProgress(Math.min(84, 2 + progress * 82));
        }
      });

      onStatus("Se dezarhiveaza si se parseaza catalogul...");
      onProgress(88);

      const stars = parseHygCsv(text);
      onProgress(100);
      onStatus(`Gata - ${stars.length} stele pregatite.`);
      return stars;
    } catch (error) {
      lastError = error;
      console.warn("[Gaseste Terra] Source failed:", source.url, error);
    }
  }

  throw lastError || new Error("No HYG source could be loaded.");
}

async function fetchCatalogText(source, { onProgress }) {
  const response = await fetch(source.url, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${source.url}`);
  }

  const bytes = await readResponseBytes(response, onProgress);

  if (!source.gzip) {
    return new TextDecoder("utf-8").decode(bytes);
  }

  if (typeof DecompressionStream === "undefined") {
    throw new Error("This browser does not support gzip decompression.");
  }

  const stream = new Blob([bytes], { type: "application/gzip" })
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));

  return new Response(stream).text();
}

async function readResponseBytes(response, onProgress) {
  if (!response.body || typeof response.body.getReader !== "function") {
    const buffer = await response.arrayBuffer();
    onProgress(1);
    return new Uint8Array(buffer);
  }

  const total = Number(response.headers.get("content-length")) || 0;
  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    chunks.push(value);
    loaded += value.byteLength;

    if (total > 0) {
      onProgress(Math.min(1, loaded / total));
    } else {
      onProgress(Math.min(1, loaded / 3500000));
    }
  }

  const joined = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    joined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  onProgress(1);
  return joined;
}

function parseHygCsv(text) {
  const lines = text.split(/\r?\n/);
  if (!lines.length) return buildFallbackStars();

  const header = splitCsvLine(lines[0]);
  const columns = indexColumns(header);

  const mandatoryByKey = new Map();
  const pool = [];

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line || !line.trim()) continue;

    const cells = splitCsvLine(line);
    if (cells.length < header.length) continue;

    const dist = parseFloat(cells[columns.dist]);
    const x = parseFloat(cells[columns.x]);
    const y = parseFloat(cells[columns.y]);
    const z = parseFloat(cells[columns.z]);
    const lum = parseFloat(cells[columns.lum]);
    const mag = parseFloat(cells[columns.mag]);

    if (!Number.isFinite(dist) || dist >= INVALID_DIST_LIMIT) continue;
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
    if (!Number.isFinite(lum) || !Number.isFinite(mag)) continue;

    const proper = (cells[columns.proper] || "").trim();
    const bf = (cells[columns.bf] || "").trim();
    const spect = (cells[columns.spect] || "").trim();
    const targetKey = resolveTargetKey(proper, bf);
    const group = targetKeyToGroup(targetKey);

    const star = {
      id: (cells[columns.id] || `row-${i}`).trim(),
      proper,
      bf,
      label: displayNameForStar(proper, bf, targetKey),
      targetKey,
      group,
      spect,
      mag,
      lum,
      x,
      y,
      z,
      color: spectralColor(spect)
    };

    if (group) {
      mandatoryByKey.set(targetKey, star);
    } else {
      pool.push(star);
    }
  }

  for (const fallback of TARGET_FALLBACKS) {
    if (!mandatoryByKey.has(fallback.targetKey)) {
      mandatoryByKey.set(fallback.targetKey, {
        ...fallback,
        color: spectralColor(fallback.spect)
      });
    }
  }

  const mandatory = CANONICAL_TARGET_ORDER.map((key) => mandatoryByKey.get(key)).filter(Boolean);
  pool.sort((left, right) => right.lum - left.lum);

  return [...mandatory, ...pool.slice(0, Math.max(0, MAX_STARS - mandatory.length))];
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function indexColumns(header) {
  const find = (name) => {
    const index = header.indexOf(name);
    if (index === -1) throw new Error(`Missing HYG column: ${name}`);
    return index;
  };

  return {
    id: find("id"),
    bf: find("bf"),
    proper: find("proper"),
    dist: find("dist"),
    mag: find("mag"),
    spect: find("spect"),
    x: find("x"),
    y: find("y"),
    z: find("z"),
    lum: find("lum")
  };
}

function resolveTargetKey(proper, bf) {
  const properKey = normalizeName(proper);
  const bfKey = normalizeName(bf);

  if (properKey === "sol") return "sol";
  if (["caph", "schedar", "ruchbah", "segin", "mintaka", "alnilam", "alnitak"].includes(properKey)) {
    return properKey;
  }
  if (properKey === "cih" || properKey === "gammacas" || bfKey.includes("gamcas")) {
    return "gamma-cas";
  }
  return "";
}

function targetKeyToGroup(targetKey) {
  if (!targetKey) return "";
  if (targetKey === "sol") return "sol";
  if (["alnitak", "alnilam", "mintaka"].includes(targetKey)) return "ori";
  return "cas";
}

function normalizeName(value) {
  return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function displayNameForStar(proper, bf, targetKey) {
  if (targetKey === "gamma-cas") return "Gamma Cas";
  return proper || bf || "Stea";
}

function spectralColor(spect) {
  const initial = (spect || "").charAt(0).toUpperCase();
  return SPECTRAL_COLORS[initial] || 0xffffff;
}

function buildFallbackStars() {
  const stars = TARGET_FALLBACKS.map((star) => ({
    ...star,
    color: spectralColor(star.spect)
  }));

  const palette = Object.values(SPECTRAL_COLORS);
  for (let i = 0; i < 1000; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 16 + Math.random() * 860;

    stars.push({
      id: `fallback-${i}`,
      proper: "",
      bf: "",
      label: "Stea",
      targetKey: "",
      group: "",
      spect: "",
      mag: 2.5 + Math.random() * 5.5,
      lum: 4 + Math.random() * 2400,
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  stars.sort((left, right) => right.lum - left.lum);
  return stars.slice(0, MAX_STARS);
}

function buildScene({
  section,
  viewer,
  canvas,
  hintEl,
  hintStep,
  hintText,
  minimap,
  finaleEl,
  speedEl,
  distanceEl,
  objectiveTitle,
  objectiveCopy,
  guideSummary,
  directionTitle,
  directionText,
  overlayTitle,
  overlayCopy,
  modeChip,
  expandButton,
  expandBackdrop,
  recenterButton,
  resetButton
}) {
  const T = window.THREE;

  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x020408, 1);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;

  const scene = new T.Scene();
  scene.fog = new T.Fog(0x020408, 180, 1500);

  const camera = new T.PerspectiveCamera(60, 1, 0.05, 1800);
  camera.position.set(...BASE_CAMERA_POSITION);
  camera.lookAt(0, 0, 0);

  const euler = new T.Euler(0, 0, 0, "YXZ");
  euler.setFromQuaternion(camera.quaternion);

  scene.add(new T.AmbientLight(0x3c527d, 1.5));

  const clock = new T.Clock(false);
  const baseCameraPosition = new T.Vector3(...BASE_CAMERA_POSITION);
  const keys = Object.create(null);
  const mmCtx = minimap.getContext("2d");
  const tempForward = new T.Vector3();
  const tempRight = new T.Vector3();
  const tempProjected = new T.Vector3();
  const tempWorldPoint = new T.Vector3();
  const tempWorldPointB = new T.Vector3();
  const tweenLookTarget = new T.Vector3();
  const solarTextureLoader = new T.TextureLoader();
  const solarTextureCache = new Map();

  let destroyed = false;
  let ready = false;
  let inView = false;
  let frameId = 0;
  let step = 0;
  let moveSpeed = DEFAULT_MOVE_SPEED;
  let isDragging = false;
  let mouseDownX = 0;
  let mouseDownY = 0;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let touchX = 0;
  let touchY = 0;
  let touchMoved = false;
  let hitLocked = false;
  let glowTexture = null;
  let cameraTween = null;
  let overlayTimer = 0;
  let fallbackExpanded = false;
  let solarSystemState = null;

  let allStars = [];
  let casStars = [];
  let oriStars = [];
  let solStar = null;
  let starLayers = [];
  let highlightLayers = [];
  let sunGroup = null;
  let sunHalos = [];
  let sunLight = null;
  let solarLocalStarField = null;
  let solarZodiacalBand = null;
  let solarSystemRoot = null;
  let solarOrbitalRoot = null;
  let solarAsteroidBelt = null;
  let solarKuiperBelt = null;
  let solarPlanets = [];
  let solarEarth = null;

  function formatPc(value) {
    if (!Number.isFinite(value)) return "-";
    if (value >= 100) return `${Math.round(value)} pc`;
    if (value >= 10) return `${value.toFixed(1)} pc`;
    return `${value.toFixed(2)} pc`;
  }

  function formatSystemDistance(value) {
    if (!Number.isFinite(value)) return "-";
    return `${value >= 10 ? value.toFixed(1) : value.toFixed(2)} u. scena`;
  }

  function isNativeFullscreen() {
    return document.fullscreenElement === viewer;
  }

  function isExpanded() {
    return fallbackExpanded || isNativeFullscreen();
  }

  function updateModeChip() {
    if (solarSystemState) {
      if (solarSystemState.phase === "approach") {
        modeChip.textContent = "Intrare in Sistemul Solar";
        return;
      }
      if (solarSystemState.phase === "search") {
        modeChip.textContent = "Sistemul Solar";
        return;
      }
      modeChip.textContent = "Terra gasita";
      return;
    }
    modeChip.textContent = isExpanded() ? "Mod marit" : "Mod standard";
  }

  function syncExpandUi() {
    const expanded = isExpanded();
    viewer.classList.toggle("is-expanded", fallbackExpanded);
    document.body.classList.toggle("gaseste-terra-expanded-open", fallbackExpanded);
    expandBackdrop.hidden = !fallbackExpanded;
    expandButton.textContent = expanded ? "Micsoreaza" : "Mareste";
    expandButton.setAttribute("aria-pressed", expanded ? "true" : "false");
    expandButton.setAttribute(
      "aria-label",
      expanded ? "Revino la marimea normala a ferestrei Gaseste Terra" : "Mareste fereastra Gaseste Terra"
    );
    updateModeChip();
    resize();
    scheduleFrame();
  }

  async function onExpandClick() {
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
  }

  function onExpandClickSafe() {
    onExpandClick().catch(() => {
      fallbackExpanded = !fallbackExpanded;
      syncExpandUi();
    });
  }

  async function collapseViewerForNavigation() {
    if (isNativeFullscreen() && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {}
    }

    if (fallbackExpanded) {
      fallbackExpanded = false;
      syncExpandUi();
    }

    await new Promise((resolve) => window.setTimeout(resolve, 80));
  }

  function hideFinale() {
    if (overlayTimer) {
      window.clearTimeout(overlayTimer);
      overlayTimer = 0;
    }
    finaleEl.classList.remove("is-visible");
    finaleEl.hidden = true;
  }

  function stepTargets(stepIndex) {
    if (stepIndex === 0) return casStars;
    if (stepIndex === 1) return oriStars;
    if (stepIndex === 2 && solStar) return [solStar];
    return [];
  }

  function centroidOf(stars) {
    const center = new T.Vector3();
    if (!stars.length) return center;

    for (const star of stars) {
      center.x += star.x;
      center.y += star.y;
      center.z += star.z;
    }

    return center.multiplyScalar(1 / stars.length);
  }

  function updateSpeedLabel() {
    speedEl.textContent = `viteza ${moveSpeed >= 10 ? moveSpeed.toFixed(0) : moveSpeed.toFixed(1)} pc/s`;
  }

  function updateStepCopy(stepIndex) {
    const meta = STEP_META[Math.min(stepIndex, STEP_META.length - 1)];

    hintEl.hidden = false;
    hintStep.textContent = `Pasul ${Math.min(stepIndex + 1, 4)} / 4`;
    hintText.textContent = STEP_HINTS[Math.min(stepIndex, STEP_HINTS.length - 1)];
    objectiveTitle.textContent = `Pasul ${Math.min(stepIndex + 1, 4)} / 4 - ${meta.name}`;
    objectiveCopy.textContent = STEP_HINTS[Math.min(stepIndex, STEP_HINTS.length - 1)];
    overlayTitle.textContent = meta.name;
    overlayCopy.textContent = meta.overlay;
    guideSummary.textContent = meta.summary;
  }

  function ensureGlowTexture() {
    if (glowTexture) return glowTexture;

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowCtx = glowCanvas.getContext("2d");
    const gradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.95)");
    gradient.addColorStop(0.45, "rgba(255,255,255,0.38)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 128, 128);
    glowTexture = new T.CanvasTexture(glowCanvas);
    glowTexture.needsUpdate = true;
    return glowTexture;
  }

  function loadSolarTexture(name) {
    if (!name) return null;
    if (solarTextureCache.has(name)) return solarTextureCache.get(name);

    const texture = solarTextureLoader.load(
      `${TEXTURE_DIR}/${name}?v=${TEXTURE_REV}`,
      () => scheduleFrame(),
      undefined,
      () => {}
    );
    texture.encoding = T.sRGBEncoding;
    texture.anisotropy = Math.max(4, Math.min(12, renderer.capabilities.getMaxAnisotropy()));
    solarTextureCache.set(name, texture);
    return texture;
  }

  function setStarfieldDimming(factor = 1) {
    for (const layer of starLayers) {
      const baseOpacity = layer.userData.baseOpacity ?? layer.material.opacity;
      layer.material.opacity = baseOpacity * factor;
    }
  }

  function buildStarLayer(stars, { size, opacity, blending }) {
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);

    for (let i = 0; i < stars.length; i += 1) {
      const star = stars[i];
      positions[i * 3] = star.x;
      positions[i * 3 + 1] = star.y;
      positions[i * 3 + 2] = star.z;
      colors[i * 3] = ((star.color >> 16) & 255) / 255;
      colors[i * 3 + 1] = ((star.color >> 8) & 255) / 255;
      colors[i * 3 + 2] = (star.color & 255) / 255;
    }

    const geometry = new T.BufferGeometry();
    geometry.setAttribute("position", new T.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new T.BufferAttribute(colors, 3));

    const material = new T.PointsMaterial({
      size,
      sizeAttenuation: false,
      map: ensureGlowTexture(),
      transparent: true,
      opacity,
      alphaTest: 0.08,
      depthWrite: false,
      blending,
      vertexColors: true
    });

    const points = new T.Points(geometry, material);
    points.userData.baseOpacity = opacity;
    return points;
  }

  function buildStarPoints(stars) {
    for (const layer of starLayers) {
      scene.remove(layer);
      layer.geometry.dispose();
      layer.material.dispose();
    }
    starLayers = [];

    const bright = [];
    const medium = [];
    const dim = [];

    for (const star of stars) {
      if (star.mag <= 1.8) bright.push(star);
      else if (star.mag <= 3.6) medium.push(star);
      else dim.push(star);
    }

    starLayers = [
      buildStarLayer(bright, { size: 6.3, opacity: 0.96, blending: T.AdditiveBlending }),
      buildStarLayer(medium, { size: 3.8, opacity: 0.88, blending: T.AdditiveBlending }),
      buildStarLayer(dim, { size: 2.1, opacity: 0.76, blending: T.NormalBlending })
    ];

    for (const layer of starLayers) scene.add(layer);
    setStarfieldDimming(solarSystemState ? 0.24 : 1);
  }

  function clearHighlights() {
    for (const layer of highlightLayers) {
      scene.remove(layer);
      layer.geometry.dispose();
      layer.material.dispose();
    }
    highlightLayers = [];
  }

  function highlightStars(stars) {
    clearHighlights();
    if (!stars.length) return;

    const outer = buildStarLayer(
      stars.map((star) => ({ ...star, color: 0xff4d38 })),
      { size: 18, opacity: 0.36, blending: T.AdditiveBlending }
    );
    const inner = buildStarLayer(
      stars.map((star) => ({ ...star, color: 0xff7a63 })),
      { size: 7, opacity: 0.95, blending: T.AdditiveBlending }
    );

    scene.add(outer, inner);
    highlightLayers = [outer, inner];
  }

  function buildHomeSystem() {
    if (solarSystemRoot) return;

    solarSystemRoot = new T.Group();
    solarSystemRoot.visible = false;
    scene.add(solarSystemRoot);

    solarLocalStarField = createLocalStarField();
    solarSystemRoot.add(solarLocalStarField);

    solarOrbitalRoot = new T.Group();
    solarOrbitalRoot.rotation.x = T.MathUtils.degToRad(3.2);
    solarSystemRoot.add(solarOrbitalRoot);

    solarZodiacalBand = createZodiacalBand();
    solarZodiacalBand.rotation.z = T.MathUtils.degToRad(2.4);
    solarOrbitalRoot.add(solarZodiacalBand);

    solarAsteroidBelt = createAsteroidBelt({
      innerRadius: 67,
      outerRadius: 79,
      thickness: 2.6,
      count: 2900,
      color: 0xcdb797,
      opacity: 0.26,
      size: 0.56
    });
    solarOrbitalRoot.add(solarAsteroidBelt);

    solarKuiperBelt = createAsteroidBelt({
      innerRadius: 152,
      outerRadius: 186,
      thickness: 6.8,
      count: 2200,
      color: 0x91aed1,
      opacity: 0.14,
      size: 0.5,
      yOffset: 0.25
    });
    solarOrbitalRoot.add(solarKuiperBelt);

    sunGroup = new T.Mesh(
      new T.SphereGeometry(13.6, 64, 64),
      new T.MeshStandardMaterial({
        map: loadSolarTexture("sun.jpg"),
        emissive: new T.Color(0xffd469),
        emissiveIntensity: 0.95,
        roughness: 0.78,
        metalness: 0.02
      })
    );
    solarSystemRoot.add(sunGroup);

    const sunHalo = new T.Mesh(
      new T.SphereGeometry(17.8, 40, 40),
      new T.MeshBasicMaterial({ color: 0xffbc73, transparent: true, opacity: 0.17, depthWrite: false })
    );
    sunGroup.add(sunHalo);
    sunHalos = [sunHalo];

    sunLight = new T.PointLight(0xffde9a, 3.8, 1300, 1.4);
    solarSystemRoot.add(sunLight);

    solarPlanets = PLANET_DEFS.map((def, index) => {
      const orbitPoints = [];
      const segments = 180;
      for (let i = 0; i <= segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2;
        orbitPoints.push(new T.Vector3(Math.cos(angle) * def.orbitRadius, 0, Math.sin(angle) * def.orbitRadius * 0.96));
      }

      const alphaFalloff = T.MathUtils.clamp(1 - def.orbitRadius / 170, 0.34, 1);
      const orbitLine = new T.Line(
        new T.BufferGeometry().setFromPoints(orbitPoints),
        new T.LineBasicMaterial({
          color: new T.Color().setHSL(0.58, 0.35, 0.67 - index * 0.012),
          transparent: true,
          opacity: 0.16 * alphaFalloff
        })
      );
      solarOrbitalRoot.add(orbitLine);

      const orbitPivot = new T.Object3D();
      orbitPivot.rotation.y = Math.random() * Math.PI * 2;
      orbitPivot.userData.orbitAngle = orbitPivot.rotation.y;
      solarOrbitalRoot.add(orbitPivot);

      const translationGroup = new T.Object3D();
      translationGroup.position.x = def.orbitRadius;
      orbitPivot.add(translationGroup);

      const tiltGroup = new T.Object3D();
      translationGroup.add(tiltGroup);

      const isIceOrGas = def.key === "jupiter" || def.key === "saturn" || def.key === "uranus" || def.key === "neptune";
      const materialConfig = {
        map: loadSolarTexture(def.texture),
        roughness: isIceOrGas ? 0.68 : 0.82,
        metalness: 0.01,
        emissive: new T.Color(0x0a1220),
        emissiveIntensity: isIceOrGas ? 0.06 : 0.03
      };

      if (def.key === "earth") {
        materialConfig.emissiveMap = loadSolarTexture("earth_night.jpg");
        materialConfig.emissive = new T.Color(0x9bc8ff);
        materialConfig.emissiveIntensity = 0.22;
        materialConfig.roughness = 0.74;
      }

      const mesh = new T.Mesh(
        new T.SphereGeometry(def.radius, 56, 56),
        new T.MeshStandardMaterial(materialConfig)
      );
      tiltGroup.add(mesh);

      const planet = {
        def,
        orbitPivot,
        translationGroup,
        tiltGroup,
        mesh,
        orbitLine,
        ringMesh: null,
        satellites: [],
        wobblePhase: Math.random() * Math.PI * 2,
        spinPhase: Math.random() * Math.PI * 2
      };

      if (def.ring) {
        const ringMesh = new T.Mesh(
          new T.RingGeometry(def.ring.innerRadius, def.ring.outerRadius, 96),
          new T.MeshStandardMaterial({
            map: loadSolarTexture(def.ring.texture),
            alphaMap: loadSolarTexture(def.ring.alpha),
            transparent: true,
            side: T.DoubleSide,
            roughness: 0.9,
            metalness: 0.02,
            color: 0xd8c5a6,
            opacity: 0.92
          })
        );
        ringMesh.rotation.x = Math.PI * 0.5;
        tiltGroup.add(ringMesh);
        planet.ringMesh = ringMesh;
      }

      def.satellites.forEach((satDef) => {
        const satPivot = new T.Object3D();
        satPivot.rotation.y = Math.random() * Math.PI * 2;
        satPivot.userData.orbitAngle = satPivot.rotation.y;
        tiltGroup.add(satPivot);

        const satTranslation = new T.Object3D();
        satTranslation.position.x = satDef.orbitRadius;
        satPivot.add(satTranslation);

        const satTiltGroup = new T.Object3D();
        satTranslation.add(satTiltGroup);

        const satMesh = new T.Mesh(
          new T.SphereGeometry(satDef.radius, 28, 28),
          new T.MeshStandardMaterial({
            map: loadSolarTexture(satDef.texture),
            roughness: 0.92,
            metalness: 0.01,
            emissive: new T.Color(0x25364e),
            emissiveIntensity: 0.08
          })
        );
        satMesh.visible = def.key === "earth";
        satTiltGroup.add(satMesh);

        planet.satellites.push({
          def: satDef,
          pivot: satPivot,
          tiltGroup: satTiltGroup,
          mesh: satMesh,
          wobblePhase: Math.random() * Math.PI * 2,
          spinPhase: Math.random() * Math.PI * 2
        });
      });

      if (def.key === "earth") {
        solarEarth = planet;
      }

      return planet;
    });
  }

  function currentLookPoint() {
    tempForward.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    return camera.position.clone().addScaledVector(tempForward, 80);
  }

  function syncEulerToCamera() {
    euler.setFromQuaternion(camera.quaternion);
  }

  function tweenCameraTo(position, lookAt, duration = 1.8, onComplete = null) {
    cameraTween = {
      start: clock.running ? clock.getElapsedTime() : 0,
      duration: Math.max(0.01, duration),
      fromPosition: camera.position.clone(),
      toPosition: position.clone(),
      fromLookAt: currentLookPoint(),
      toLookAt: lookAt.clone(),
      onComplete
    };
  }

  function setPose(position, lookAt) {
    camera.position.copy(position);
    camera.lookAt(lookAt);
    syncEulerToCamera();
  }

  function previewPose(stepIndex) {
    if (stepIndex === 0) return { position: baseCameraPosition.clone(), lookAt: centroidOf(casStars) };
    if (stepIndex === 1) return { position: baseCameraPosition.clone(), lookAt: centroidOf(oriStars) };
    return { position: baseCameraPosition.clone(), lookAt: new T.Vector3(0, 0, 0) };
  }

  function focusPoseForTargets(stars) {
    if (stars.length === 1) {
      return { position: new T.Vector3(2.35, 0.52, 2.75), lookAt: new T.Vector3(stars[0].x, stars[0].y, stars[0].z) };
    }

    const center = centroidOf(stars);
    const direction = center.clone();
    if (direction.lengthSq() < 0.0001) direction.set(0.62, 0.14, 1);
    direction.normalize();

    const side = new T.Vector3(-direction.z, 0.26, direction.x);
    if (side.lengthSq() < 0.0001) side.set(1, 0.2, 0);
    side.normalize().multiplyScalar(5.8);

    const position = center.clone().multiplyScalar(0.12).add(side);
    if (position.length() > 42) position.setLength(42);

    return { position, lookAt: center };
  }

  function getSolarEarthWorldPosition(target = tempWorldPoint) {
    if (!solarEarth) return null;
    return solarEarth.mesh.getWorldPosition(target);
  }

  function solarOverviewPose() {
    return {
      position: new T.Vector3(0, 88, 190),
      lookAt: new T.Vector3(0, 0, 0)
    };
  }

  function solarSearchPose() {
    const earthPosition = getSolarEarthWorldPosition(tempWorldPoint);
    if (!earthPosition) return solarOverviewPose();

    const outward = tempWorldPointB.set(0.12, 0.42, 1);
    outward.normalize();

    return {
      position: earthPosition
        .clone()
        .add(outward.multiplyScalar(38)),
      lookAt: earthPosition.clone()
    };
  }

  function solarRevealPose() {
    const earthPosition = getSolarEarthWorldPosition(tempWorldPoint);
    if (!earthPosition) return solarSearchPose();

    const outward = tempWorldPointB.set(0.18, 0.32, 1);
    outward.normalize();

    return {
      position: earthPosition
        .clone()
        .add(outward.multiplyScalar(18)),
      lookAt: earthPosition.clone()
    };
  }

  function setSolarSystemVisible(visible) {
    if (solarSystemRoot) solarSystemRoot.visible = visible;
    if (sunLight) sunLight.visible = visible;
    setStarfieldDimming(visible ? 0.24 : 1);
  }

  function beginSolarSystemSearch() {
    if (!solarSystemState) return;
    solarSystemState.phase = "search";
    updateStepCopy(3);
    overlayTitle.textContent = "Sistemul Solar";
    overlayCopy.textContent = "Terra este a treia planeta de la Soare. Cauta planeta albastra insotita de Luna.";
    directionTitle.textContent = "Cauta Terra";
    directionText.textContent = "Terra este a treia planeta de la Soare. Daca te pierzi, apasa Recentreaza spre tinta.";
    updateModeChip();
    updateGuidance();
    scheduleFrame();
  }

  function showTerraFinale() {
    hideFinale();
    hintEl.hidden = true;
    objectiveTitle.textContent = "Acasa. Terra.";
    objectiveCopy.textContent = "Ai intrat in Sistemul Solar si ai gasit Pamantul.";
    overlayTitle.textContent = "Acasa";
    overlayCopy.textContent = "Terra ramane singura planeta vie cunoscuta. Continua spre Quiz cand esti gata.";
    guideSummary.textContent = "Pamantul a fost gasit in Sistemul Solar.";
    directionTitle.textContent = "Acasa";
    directionText.textContent = "Terra a fost gasita. Continua spre Quiz cand esti gata.";
    finaleEl.hidden = false;
    requestAnimationFrame(() => finaleEl.classList.add("is-visible"));
    updateModeChip();
  }

  function completeSolarSystemStep() {
    if (!solarSystemState || solarSystemState.phase !== "search") return;

    hitLocked = true;
    solarSystemState.phase = "complete";
    updateModeChip();

    const pose = solarRevealPose();
    tweenCameraTo(pose.position, pose.lookAt, 1.55, () => {
      hitLocked = false;
      showTerraFinale();
    });
  }

  function triggerSolarSystemSequence() {
    if (solarSystemState) return;

    buildHomeSystem();
    clearHighlights();
    hideFinale();
    solarSystemState = { phase: "approach" };
    setSolarSystemVisible(true);
    updateStepCopy(3);
    overlayTitle.textContent = "Sistemul Solar";
    overlayCopy.textContent = "Ai intrat in sistemul nostru. Terra este a treia planeta de la Soare si are o mica Luna.";
    directionTitle.textContent = "Intrare in Sistemul Solar";
    directionText.textContent = "Urmeaza zoom-ul cinematic, apoi cauta planeta albastra cu o mica Luna.";
    distanceEl.textContent = "distanta Terra: --";
    updateModeChip();

    const overviewPose = solarOverviewPose();
    tweenCameraTo(overviewPose.position, overviewPose.lookAt, 2.1, beginSolarSystemSearch);

    scheduleFrame();
  }

  function setStep(stepIndex, { instant = false } = {}) {
    step = stepIndex;
    hitLocked = false;
    hideFinale();
    if (step < 3) {
      solarSystemState = null;
      setSolarSystemVisible(false);
    }
    updateStepCopy(step);
    updateModeChip();

    if (step >= 3) {
      triggerSolarSystemSequence();
      return;
    }

    const pose = previewPose(step);
    if (instant || !clock.running) {
      setPose(pose.position, pose.lookAt);
      updateGuidance();
      return;
    }

    tweenCameraTo(pose.position, pose.lookAt, 1.4, updateGuidance);
  }

  function recenterToCurrentStep() {
    if (!ready) return;
    if (solarSystemState) {
      const pose = solarSystemState.phase === "complete" ? solarRevealPose() : solarSearchPose();
      tweenCameraTo(pose.position, pose.lookAt, 1.05, updateGuidance);
      scheduleFrame();
      return;
    }
    const pose = previewPose(step);
    tweenCameraTo(pose.position, pose.lookAt, 1.15, updateGuidance);
    scheduleFrame();
  }

  function resetCamera() {
    moveSpeed = DEFAULT_MOVE_SPEED;
    updateSpeedLabel();
    recenterToCurrentStep();
  }

  function completeCurrentStep() {
    if (hitLocked || solarSystemState) return;

    const targets = stepTargets(step);
    if (!targets.length) return;

    hitLocked = true;
    highlightStars(targets);
    const pose = focusPoseForTargets(targets);

    tweenCameraTo(pose.position, pose.lookAt, step === 2 ? 2.1 : 1.75, () => {
      window.setTimeout(() => {
        clearHighlights();
        setStep(step + 1);
      }, step === 2 ? 340 : 480);
    });
  }

  function projectWorldPosition(position, rect) {
    tempProjected.copy(position).project(camera);
    if (tempProjected.z < -1 || tempProjected.z > 1) return null;

    return {
      x: ((tempProjected.x + 1) * 0.5) * rect.width + rect.left,
      y: ((1 - tempProjected.y) * 0.5) * rect.height + rect.top
    };
  }

  function projectStar(star, rect) {
    return projectWorldPosition(tempWorldPoint.set(star.x, star.y, star.z), rect);
  }

  function projectedGroupBounds(stars, rect) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let visibleCount = 0;

    for (const star of stars) {
      const point = projectStar(star, rect);
      if (!point) continue;

      visibleCount += 1;
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    if (!visibleCount) return null;

    return {
      centerX: (minX + maxX) * 0.5,
      centerY: (minY + maxY) * 0.5,
      radiusX: Math.max(10, (maxX - minX) * 0.5 + GROUP_HIT_PADDING),
      radiusY: Math.max(10, (maxY - minY) * 0.5 + GROUP_HIT_PADDING)
    };
  }

  function checkHit(clientX, clientY) {
    if (!ready || hitLocked || cameraTween) return;
    const rect = canvas.getBoundingClientRect();

    if (solarSystemState) {
      if (solarSystemState.phase !== "search" || !solarEarth) return;

      const earthPosition = getSolarEarthWorldPosition(tempWorldPoint);
      const earthPoint = earthPosition ? projectWorldPosition(earthPosition, rect) : null;
      const hitRadius = isExpanded() ? 52 : 40;

      if (earthPoint && Math.hypot(clientX - earthPoint.x, clientY - earthPoint.y) <= hitRadius) {
        completeSolarSystemStep();
      }
      return;
    }

    const targets = stepTargets(step);
    if (!targets.length) return;

    if (targets.length > 1) {
      const bounds = projectedGroupBounds(targets, rect);
      if (bounds) {
        const dx = (clientX - bounds.centerX) / bounds.radiusX;
        const dy = (clientY - bounds.centerY) / bounds.radiusY;
        if (dx * dx + dy * dy <= 1.05) {
          completeCurrentStep();
          return;
        }
      }
    }

    for (const star of targets) {
      const point = projectStar(star, rect);
      if (point && Math.hypot(clientX - point.x, clientY - point.y) <= STAR_HIT_RADIUS) {
        completeCurrentStep();
        return;
      }
    }
  }

  function updateSolarGuidance() {
    const earthPosition = getSolarEarthWorldPosition(tempWorldPoint);
    if (!earthPosition) return;

    const distance = camera.position.distanceTo(earthPosition);
    distanceEl.textContent = `distanta Terra: ${formatSystemDistance(distance)}`;

    if (solarSystemState?.phase === "approach") {
      directionTitle.textContent = "Intrare in Sistemul Solar";
      directionText.textContent = "Camera intra acum in sistemul nostru. Pregateste-te sa cauti Terra.";
      return;
    }

    if (solarSystemState?.phase === "complete") {
      directionTitle.textContent = "Acasa";
      directionText.textContent = "Terra a fost gasita. Continua spre Quiz cand esti gata.";
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const point = projectWorldPosition(earthPosition, rect);
    const local = camera.worldToLocal(tempWorldPointB.copy(earthPosition));

    if (local.z > 0) {
      directionTitle.textContent = "Terra este in spate";
      directionText.textContent =
        "Roteste larg camera stanga sau dreapta. Daca te-ai pierdut, apasa Recentreaza spre tinta.";
      return;
    }

    if (point) {
      const onScreen =
        point.x >= rect.left &&
        point.x <= rect.right &&
        point.y >= rect.top &&
        point.y <= rect.bottom;

      if (onScreen) {
        directionTitle.textContent = "Terra este pe ecran";
        directionText.textContent =
          distance > 2.2
            ? "Tine planeta albastra in centru si apropie-te usor."
            : "Planeta albastra este aproape. Click pe ea pentru a incheia mini-jocul.";
        return;
      }
    }

    const horizontal = Math.abs(local.x / Math.max(0.6, -local.z));
    const vertical = Math.abs(local.y / Math.max(0.6, -local.z));
    const parts = [];

    if (horizontal > 0.16) parts.push(local.x > 0 ? "dreapta" : "stanga");
    if (vertical > 0.12) parts.push(local.y > 0 ? "sus" : "jos");

    if (!parts.length) {
      directionTitle.textContent = "Terra este aproape in fata";
      directionText.textContent = "Mai avanseaza putin si tine planeta albastra in centru.";
      return;
    }

    directionTitle.textContent = `Terra este ${parts.join(" ")}`;
    directionText.textContent = `Roteste camera ${parts.join(" ")} pana cand ghidarea spune ca Terra este pe ecran.`;
  }

  function updateGuidance() {
    if (!ready) return;
    if (solarSystemState) {
      updateSolarGuidance();
      return;
    }

    const targets = stepTargets(step);
    if (!targets.length) {
      directionTitle.textContent = "Ghidarea este in asteptare";
      directionText.textContent = "Tinta urmatoare va aparea imediat.";
      return;
    }

    const center = centroidOf(targets);
    const distance = camera.position.distanceTo(center);
    distanceEl.textContent = `distanta tinta: ${formatPc(distance)}`;

    const rect = canvas.getBoundingClientRect();
    const bounds = projectedGroupBounds(targets, rect);
    const local = camera.worldToLocal(center.clone());

    if (local.z > 0) {
      directionTitle.textContent = "Tinta este in spate";
      directionText.textContent =
        "Roteste larg camera stanga sau dreapta. Daca te-ai pierdut complet, apasa Recentreaza spre tinta.";
      return;
    }

    if (bounds) {
      const onScreen =
        bounds.centerX >= rect.left &&
        bounds.centerX <= rect.right &&
        bounds.centerY >= rect.top &&
        bounds.centerY <= rect.bottom;

      if (onScreen) {
        directionTitle.textContent = "Tinta este pe ecran";
        directionText.textContent =
          distance > 70
            ? "Tine clusterul in centru si apropie-te lent."
            : "Tinta este aproape. Click pe grupul corect ca sa treci la pasul urmator.";
        return;
      }
    }

    const horizontal = Math.abs(local.x / Math.max(1, -local.z));
    const vertical = Math.abs(local.y / Math.max(1, -local.z));

    const parts = [];
    if (horizontal > 0.2) parts.push(local.x > 0 ? "dreapta" : "stanga");
    if (vertical > 0.16) parts.push(local.y > 0 ? "sus" : "jos");

    if (!parts.length) {
      directionTitle.textContent = "Tinta este aproape in fata";
      directionText.textContent = "Mai avanseaza putin si tine zona centrata.";
      return;
    }

    directionTitle.textContent = `Tinta este ${parts.join(" ")}`;
    directionText.textContent = `Roteste camera ${parts.join(" ")} pana cand ghidarea spune ca tinta este pe ecran.`;
  }

  function drawMinimap() {
    const width = minimap.width;
    const height = minimap.height;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    mmCtx.clearRect(0, 0, width, height);

    const gradient = mmCtx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerX - 6);
    gradient.addColorStop(0, "rgba(239, 215, 168, 0.5)");
    gradient.addColorStop(0.2, "rgba(188, 150, 96, 0.24)");
    gradient.addColorStop(0.52, "rgba(64, 102, 184, 0.12)");
    gradient.addColorStop(1, "rgba(2, 4, 8, 0)");

    mmCtx.save();
    mmCtx.translate(centerX, centerY);
    mmCtx.scale(1, 0.4);
    mmCtx.beginPath();
    mmCtx.arc(0, 0, centerX - 7, 0, Math.PI * 2);
    mmCtx.fillStyle = gradient;
    mmCtx.fill();
    mmCtx.restore();

    mmCtx.beginPath();
    mmCtx.arc(centerX, centerY, 3.2, 0, Math.PI * 2);
    mmCtx.fillStyle = "#ffd87a";
    mmCtx.fill();

    const visibleRadius = Math.max(60, Math.min(1000, camera.position.length() * 1.2 + 40));
    const scale = (centerX - 12) / visibleRadius;
    let offsetX = camera.position.x * scale;
    let offsetY = -camera.position.z * scale;
    const distance = Math.hypot(offsetX, offsetY);
    const maxDistance = centerX - 12;

    if (distance > maxDistance) {
      offsetX = (offsetX / distance) * maxDistance;
      offsetY = (offsetY / distance) * maxDistance;
    }

    tempForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
    mmCtx.beginPath();
    mmCtx.moveTo(centerX + offsetX, centerY + offsetY);
    mmCtx.lineTo(centerX + offsetX + tempForward.x * 11, centerY + offsetY - tempForward.z * 11);
    mmCtx.strokeStyle = "rgba(79, 195, 247, 0.72)";
    mmCtx.lineWidth = 1.5;
    mmCtx.stroke();

    mmCtx.beginPath();
    mmCtx.arc(centerX + offsetX, centerY + offsetY, 4, 0, Math.PI * 2);
    mmCtx.fillStyle = "#4fc3f7";
    mmCtx.fill();
  }

  function animateSolarSystem(delta, elapsed) {
    if (!solarSystemRoot?.visible) return;

    if (sunGroup) sunGroup.rotation.y += 0.15 * delta;
    if (sunHalos[0]?.material) {
      sunHalos[0].material.opacity = 0.2 + 0.08 * Math.sin(elapsed * 1.25);
    }
    if (solarLocalStarField) {
      solarLocalStarField.rotation.y += delta * 0.008;
      solarLocalStarField.rotation.x = Math.sin(elapsed * 0.035) * 0.045;
    }
    if (solarZodiacalBand) solarZodiacalBand.rotation.z += delta * 0.0022;
    if (solarAsteroidBelt) solarAsteroidBelt.rotation.y += delta * 0.0038;
    if (solarKuiperBelt) solarKuiperBelt.rotation.y -= delta * 0.0019;

    solarPlanets.forEach((planet) => {
      planet.orbitPivot.userData.orbitAngle += planet.def.orbitSpeed * delta * 0.22;
      planet.orbitPivot.rotation.y = planet.orbitPivot.userData.orbitAngle;

      const wobble =
        T.MathUtils.degToRad(planet.def.wobbleDeg) *
        Math.sin(elapsed * planet.def.wobbleSpeed + planet.wobblePhase);
      planet.tiltGroup.rotation.z = T.MathUtils.degToRad(planet.def.tiltDeg) + wobble;

      const dynamicSpin =
        planet.def.spinSpeed * (0.86 + 0.14 * Math.sin(elapsed * 0.9 + planet.spinPhase)) * delta;
      planet.mesh.rotation.y += dynamicSpin;

      if (planet.ringMesh) {
        planet.ringMesh.rotation.z += delta * 0.01;
      }

      planet.satellites.forEach((satellite) => {
        satellite.pivot.userData.orbitAngle += satellite.def.orbitSpeed * delta * 0.24;
        satellite.pivot.rotation.y = satellite.pivot.userData.orbitAngle;

        const satWobble =
          T.MathUtils.degToRad(satellite.def.wobbleDeg) *
          Math.sin(elapsed * satellite.def.wobbleSpeed + satellite.wobblePhase);
        satellite.tiltGroup.rotation.z = T.MathUtils.degToRad(satellite.def.tiltDeg || 0) + satWobble;

        const satSpin =
          satellite.def.spinSpeed * (0.9 + 0.1 * Math.sin(elapsed * 1.1 + satellite.spinPhase)) * delta;
        satellite.mesh.rotation.y += satSpin;
      });
    });

    if (solarEarth?.mesh?.material) {
      solarEarth.mesh.material.emissiveIntensity = solarSystemState?.phase === "complete" ? 0.36 : 0.22;
    }
  }

  function isInteractionLocked() {
    return Boolean(cameraTween) || (solarSystemState && solarSystemState.phase !== "search");
  }

  function tick() {
    frameId = 0;

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    if (!cameraTween && (!solarSystemState || solarSystemState.phase === "search")) {
      tempForward.set(0, 0, -1).applyQuaternion(camera.quaternion);
      tempRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
      const movement = moveSpeed * delta;

      if (keys.KeyW || keys.ArrowUp) camera.position.addScaledVector(tempForward, movement);
      if (keys.KeyS || keys.ArrowDown) camera.position.addScaledVector(tempForward, -movement);
      if (keys.KeyA || keys.ArrowLeft) camera.position.addScaledVector(tempRight, -movement);
      if (keys.KeyD || keys.ArrowRight) camera.position.addScaledVector(tempRight, movement);
    }

    if (highlightLayers.length >= 2) {
      highlightLayers[0].material.opacity = 0.22 + 0.18 * (0.5 + 0.5 * Math.sin(elapsed * 4.4));
      highlightLayers[1].material.opacity = 0.84 + 0.1 * (0.5 + 0.5 * Math.sin(elapsed * 5.2));
    }

    if (cameraTween) {
      const progress = Math.min(1, (elapsed - cameraTween.start) / cameraTween.duration);
      const eased = smoothstep(progress);
      camera.position.lerpVectors(cameraTween.fromPosition, cameraTween.toPosition, eased);
      tweenLookTarget.lerpVectors(cameraTween.fromLookAt, cameraTween.toLookAt, eased);
      camera.lookAt(tweenLookTarget);

      if (progress >= 1) {
        const done = cameraTween.onComplete;
        cameraTween = null;
        syncEulerToCamera();
        if (typeof done === "function") done();
      }
    }

    animateSolarSystem(delta, elapsed);

    updateGuidance();
    drawMinimap();
    renderer.render(scene, camera);
    scheduleFrame();
  }

  function shouldRender() {
    return !destroyed && !document.hidden && (inView || isExpanded() || Boolean(cameraTween) || Boolean(solarSystemState));
  }

  function scheduleFrame() {
    if (destroyed || frameId || !shouldRender()) return;
    frameId = window.requestAnimationFrame(tick);
  }

  function resize() {
    const width = Math.max(2, viewer.clientWidth || section.clientWidth || window.innerWidth);
    const height = Math.max(2, viewer.clientHeight || 420);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(viewer);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      inView = Boolean(entries[0] && entries[0].isIntersecting);
      if (!inView) {
        ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].forEach((key) => {
          keys[key] = false;
        });
      }
      scheduleFrame();
    },
    { threshold: 0.12 }
  );
  intersectionObserver.observe(section);

  const onVisibilityChange = () => {
    if (!document.hidden) scheduleFrame();
  };
  const onFullscreenChange = () => syncExpandUi();
  const onBackdropClick = () => {
    if (!fallbackExpanded) return;
    fallbackExpanded = false;
    syncExpandUi();
  };

  document.addEventListener("visibilitychange", onVisibilityChange);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  expandButton.addEventListener("click", onExpandClickSafe);
  expandBackdrop.addEventListener("click", onBackdropClick);
  recenterButton.addEventListener("click", recenterToCurrentStep);
  resetButton.addEventListener("click", resetCamera);

  const onKeyDown = (event) => {
    if (!ready || (!inView && !isExpanded()) || isInteractionLocked()) return;
    keys[event.code] = true;
    scheduleFrame();
  };
  const onKeyUp = (event) => {
    keys[event.code] = false;
  };
  const onMouseDown = (event) => {
    if ((!inView && !isExpanded()) || !ready || isInteractionLocked()) return;
    isDragging = true;
    mouseDownX = lastMouseX = event.clientX;
    mouseDownY = lastMouseY = event.clientY;
    canvas.classList.add("is-grabbing");
  };
  const onMouseMove = (event) => {
    if (!isDragging || isInteractionLocked()) return;
    const dx = event.clientX - lastMouseX;
    const dy = event.clientY - lastMouseY;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    euler.y -= dx * 0.003;
    euler.x = clamp(euler.x - dy * 0.003, -Math.PI * 0.5 + 0.01, Math.PI * 0.5 - 0.01);
    camera.quaternion.setFromEuler(euler);
    scheduleFrame();
  };
  const onMouseUp = (event) => {
    const didDrag = Math.abs(event.clientX - mouseDownX) > 6 || Math.abs(event.clientY - mouseDownY) > 6;
    isDragging = false;
    canvas.classList.remove("is-grabbing");
    if (!didDrag) checkHit(event.clientX, event.clientY);
  };
  const onWheel = (event) => {
    if ((!inView && !isExpanded()) || !ready || isInteractionLocked()) return;
    event.preventDefault();
    moveSpeed = clamp(moveSpeed - event.deltaY * 0.0024, MIN_MOVE_SPEED, MAX_MOVE_SPEED);
    updateSpeedLabel();
    scheduleFrame();
  };
  const onTouchStart = (event) => {
    if ((!inView && !isExpanded()) || !ready || isInteractionLocked() || event.touches.length !== 1) return;
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
    touchMoved = false;
  };
  const onTouchMove = (event) => {
    if (event.touches.length !== 1 || isInteractionLocked()) return;
    touchMoved = true;
    const dx = event.touches[0].clientX - touchX;
    const dy = event.touches[0].clientY - touchY;
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
    euler.y -= dx * 0.004;
    euler.x = clamp(euler.x - dy * 0.004, -Math.PI * 0.5 + 0.01, Math.PI * 0.5 - 0.01);
    camera.quaternion.setFromEuler(euler);
    scheduleFrame();
  };
  const onTouchEnd = (event) => {
    if (!touchMoved && event.changedTouches.length === 1) {
      checkHit(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    }
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.addEventListener("touchstart", onTouchStart, { passive: true });
  canvas.addEventListener("touchmove", onTouchMove, { passive: true });
  canvas.addEventListener("touchend", onTouchEnd);

  updateModeChip();
  updateSpeedLabel();

  return {
    loadStars(stars) {
      allStars = stars.slice();
      casStars = allStars.filter((star) => star.group === "cas");
      oriStars = allStars.filter((star) => star.group === "ori");
      solStar = allStars.find((star) => star.group === "sol") || null;
      buildStarPoints(allStars);
      buildHomeSystem();
      ready = true;
      setStep(0, { instant: true });
    },
    start() {
      resize();
      if (!clock.running) clock.start();
      setStep(0, { instant: true });
      scheduleFrame();
    },
    collapseViewerForNavigation,
    dispose() {
      destroyed = true;
      hideFinale();
      setSolarSystemVisible(false);
      if (frameId) window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      expandButton.removeEventListener("click", onExpandClickSafe);
      expandBackdrop.removeEventListener("click", onBackdropClick);
      recenterButton.removeEventListener("click", recenterToCurrentStep);
      resetButton.removeEventListener("click", resetCamera);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      clearHighlights();
      scene.traverse((object) => {
        if (object.geometry && typeof object.geometry.dispose === "function") object.geometry.dispose();
        if (object.material) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material?.dispose?.());
        }
      });
      glowTexture?.dispose?.();
      solarTextureCache.forEach((texture) => texture?.dispose?.());
      solarTextureCache.clear();
      renderer.dispose();
    }
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(value) {
  const clamped = clamp(value, 0, 1);
  return clamped * clamped * (3 - 2 * clamped);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}
