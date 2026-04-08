const TEXTURE_DIR = "assets/textures";
const TEXTURE_REV = "20260408real";
const CLICK_DRAG_THRESHOLD = 8;
const TAU = Math.PI * 2;
const RAPID_TAP_WINDOW_MS = 1000;
const RAPID_TAP_COUNT = 3;

function sat(config) {
  return {
    key: config.key,
    name: config.name,
    texture: config.texture || "moon.jpg",
    radius: config.radius,
    orbitRadius: config.orbitRadius,
    orbitSpeed: config.orbitSpeed,
    spinSpeed: config.spinSpeed,
    tiltDeg: config.tiltDeg || 0,
    wobbleDeg: config.wobbleDeg || 0.3,
    wobbleSpeed: config.wobbleSpeed || 0.7,
    diameter: config.diameter,
    distanceFromPlanet: config.distanceFromPlanet,
    orbitPeriod: config.orbitPeriod,
    temp: config.temp,
    description: config.description,
    fact1: config.fact1,
    fact2: config.fact2
  };
}

function layer(config) {
  return config;
}

function createLocalStarField() {
  function createLayer({ count, minRadius, maxRadius, size, opacity, color }) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.randFloat(minRadius, maxRadius);
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const theta = THREE.MathUtils.randFloat(0, TAU);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity,
      depthWrite: false,
      sizeAttenuation: true
    });

    return new THREE.Points(geometry, material);
  }

  const group = new THREE.Group();
  group.add(
    createLayer({
      count: 1050,
      minRadius: 280,
      maxRadius: 780,
      size: 1.05,
      opacity: 0.56,
      color: 0x9dc8f5
    })
  );
  group.add(
    createLayer({
      count: 340,
      minRadius: 320,
      maxRadius: 820,
      size: 1.85,
      opacity: 0.24,
      color: 0xf7d9ad
    })
  );

  return group;
}

function createAsteroidBelt(config) {
  const { innerRadius, outerRadius, thickness, count, color, opacity, size, yOffset = 0 } = config;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const radius = THREE.MathUtils.randFloat(innerRadius, outerRadius);
    const angle = THREE.MathUtils.randFloat(0, TAU);
    const radialNoise = THREE.MathUtils.randFloatSpread(1.2);
    const x = Math.cos(angle) * radius + radialNoise;
    const z = Math.sin(angle) * radius * 0.97 + radialNoise * 0.35;
    const y = THREE.MathUtils.randFloatSpread(thickness) + yOffset;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
    sizeAttenuation: true
  });

  return new THREE.Points(geometry, material);
}

function createZodiacalBand() {
  // Disabled: large translucent ring was masking planets in the storytelling view.
  return new THREE.Group();
}

const SUN_INFO = {
  name: "Soare",
  summary: "Steaua centrala a Sistemului Solar",
  description:
    "Soarele contine peste 99% din masa Sistemului Solar si furnizeaza energia necesara planetelor.",
  diameter: "1,392,700 km",
  distance: "-",
  orbit: "~225 milioane ani in jurul centrului galactic",
  moons: "-",
  satellites: "Mercur, Venus, Pamant, Mars, Jupiter, Saturn, Uranus, Neptun",
  temp: "~5,500 C (fotosfera)",
  fact1: "Lumina Soarelui ajunge la Pamant in aproximativ 8 minute si 20 secunde.",
  fact2: "Vantul solar modeleaza heliosfera."
};

const PLANET_DEFS = [
  {
    key: "mercury",
    name: "Mercur",
    texture: "mercury.jpg",
    radius: 1.35,
    orbitRadius: 26,
    orbitSpeed: 1.1,
    spinSpeed: 0.58,
    tiltDeg: 0.03,
    wobbleDeg: 0.15,
    wobbleSpeed: 0.35,
    diameter: "4,879 km",
    distance: "0.39 AU",
    orbitPeriod: "88 zile",
    moonsTotal: "0",
    temp: "~167 C",
    summary: "Planeta stancoasa cea mai apropiata de Soare",
    description: "Are atmosfera foarte subtire si diferente termice extreme.",
    fact1: "Un an pe Mercur dureaza 88 de zile terestre.",
    fact2: "Suprafata este foarte craterizata.",
    satellites: []
  },
  {
    key: "venus",
    name: "Venus",
    texture: "venus.jpg",
    radius: 2.15,
    orbitRadius: 36,
    orbitSpeed: 0.86,
    spinSpeed: -0.14,
    tiltDeg: 177.4,
    wobbleDeg: 0.35,
    wobbleSpeed: 0.22,
    diameter: "12,104 km",
    distance: "0.72 AU",
    orbitPeriod: "225 zile",
    moonsTotal: "0",
    temp: "~464 C",
    summary: "Planeta cu efect de sera extrem",
    description: "Atmosfera densa de CO2 mentine temperatura foarte ridicata.",
    fact1: "Este cea mai fierbinte planeta din Sistemul Solar.",
    fact2: "Rotatia este retrograda.",
    satellites: []
  },
  {
    key: "earth",
    name: "Pamant",
    texture: "earth.jpg",
    radius: 2.26,
    orbitRadius: 48,
    orbitSpeed: 0.72,
    spinSpeed: 1.02,
    tiltDeg: 23.5,
    wobbleDeg: 1.25,
    wobbleSpeed: 0.65,
    diameter: "12,742 km",
    distance: "1.00 AU",
    orbitPeriod: "365 zile",
    moonsTotal: "1",
    temp: "~15 C",
    summary: "Singura planeta cunoscuta care sustine viata",
    description: "Are apa lichida stabila, atmosfera protectoare si camp magnetic activ.",
    fact1: "71% din suprafata este acoperita de apa.",
    fact2: "Inclinarea axei produce anotimpurile.",
    satellites: [
      sat({
        key: "moon",
        name: "Luna",
        radius: 0.62,
        orbitRadius: 6.3,
        orbitSpeed: 2.8,
        spinSpeed: 0.62,
        tiltDeg: 6.7,
        wobbleDeg: 0.4,
        wobbleSpeed: 0.8,
        diameter: "3,474 km",
        distanceFromPlanet: "~384,400 km",
        orbitPeriod: "27.3 zile",
        temp: "~ -20 C",
        description: "Satelitul natural al Pamantului care influenteaza mareele.",
        fact1: "Este in rotatie sincronizata cu Pamantul.",
        fact2: "Suprafata are campuri bazaltice (maria)."
      })
    ]
  },
  {
    key: "mars",
    name: "Mars",
    texture: "mars.jpg",
    radius: 1.55,
    orbitRadius: 61,
    orbitSpeed: 0.58,
    spinSpeed: 0.97,
    tiltDeg: 25.2,
    wobbleDeg: 1.1,
    wobbleSpeed: 0.6,
    diameter: "6,779 km",
    distance: "1.52 AU",
    orbitPeriod: "687 zile",
    moonsTotal: "2",
    temp: "~ -63 C",
    summary: "Planeta rosie cu urme geologice de apa",
    description: "Are atmosfera subtire si relief spectaculos.",
    fact1: "Ziua martiana dureaza 24h 37m.",
    fact2: "Calotele polare contin gheata de apa si CO2.",
    satellites: [
      sat({
        key: "phobos",
        name: "Phobos",
        radius: 0.26,
        orbitRadius: 4.7,
        orbitSpeed: 4.2,
        spinSpeed: 1.4,
        diameter: "22.4 km",
        distanceFromPlanet: "~9,376 km",
        orbitPeriod: "7h 39m",
        temp: "~ -40 C",
        description: "Cel mai mare satelit al lui Mars, foarte apropiat de planeta.",
        fact1: "Are forma neregulata.",
        fact2: "Se apropie lent de Mars."
      }),
      sat({
        key: "deimos",
        name: "Deimos",
        radius: 0.23,
        orbitRadius: 7.3,
        orbitSpeed: 2.6,
        spinSpeed: 0.95,
        diameter: "12.4 km",
        distanceFromPlanet: "~23,460 km",
        orbitPeriod: "30.3h",
        temp: "~ -40 C",
        description: "Satelit exterior cu suprafata acoperita de regolit fin.",
        fact1: "Orbita aproape circulara.",
        fact2: "Are albedo redus."
      })
    ]
  },
  {
    key: "jupiter",
    name: "Jupiter",
    texture: "jupiter.jpg",
    radius: 9.4,
    orbitRadius: 82,
    orbitSpeed: 0.35,
    spinSpeed: 1.45,
    tiltDeg: 3.1,
    wobbleDeg: 0.55,
    wobbleSpeed: 0.42,
    diameter: "139,820 km",
    distance: "5.20 AU",
    orbitPeriod: "11.9 ani",
    moonsTotal: "95",
    temp: "~ -110 C",
    summary: "Cea mai mare planeta, gigant gazos",
    description: "Este dominat de hidrogen si heliu, cu benzi atmosferice vizibile.",
    fact1: "Marea Pata Rosie este o furtuna uriasa.",
    fact2: "Are camp magnetic foarte puternic.",
    satellites: [
      sat({
        key: "io",
        name: "Io",
        radius: 0.57,
        orbitRadius: 10.2,
        orbitSpeed: 2.55,
        spinSpeed: 0.9,
        diameter: "3,643 km",
        distanceFromPlanet: "~421,700 km",
        orbitPeriod: "1.77 zile",
        temp: "~ -130 C",
        description: "Cel mai activ corp vulcanic din Sistemul Solar.",
        fact1: "Are sute de vulcani activi.",
        fact2: "Suprafata este bogata in sulf."
      }),
      sat({
        key: "europa",
        name: "Europa",
        radius: 0.54,
        orbitRadius: 13.2,
        orbitSpeed: 2.02,
        spinSpeed: 0.85,
        diameter: "3,122 km",
        distanceFromPlanet: "~670,900 km",
        orbitPeriod: "3.55 zile",
        temp: "~ -160 C",
        description: "Are gheata la suprafata si posibil ocean subteran.",
        fact1: "Suprafata este relativ neteda.",
        fact2: "Este tinta majora pentru astrobiologie."
      }),
      sat({
        key: "ganymede",
        name: "Ganymede",
        radius: 0.68,
        orbitRadius: 16.8,
        orbitSpeed: 1.62,
        spinSpeed: 0.78,
        diameter: "5,268 km",
        distanceFromPlanet: "~1,070,400 km",
        orbitPeriod: "7.15 zile",
        temp: "~ -163 C",
        description: "Cel mai mare satelit natural din Sistemul Solar.",
        fact1: "Este mai mare decat Mercur.",
        fact2: "Are camp magnetic propriu."
      }),
      sat({
        key: "callisto",
        name: "Callisto",
        radius: 0.62,
        orbitRadius: 20.8,
        orbitSpeed: 1.28,
        spinSpeed: 0.74,
        diameter: "4,821 km",
        distanceFromPlanet: "~1,882,700 km",
        orbitPeriod: "16.69 zile",
        temp: "~ -139 C",
        description: "Satelit puternic craterizat, cu suprafata foarte veche.",
        fact1: "Poate avea ocean intern sarat.",
        fact2: "Are densitate relativ mica."
      })
    ]
  },
  {
    key: "saturn",
    name: "Saturn",
    texture: "saturn.jpg",
    radius: 8.1,
    orbitRadius: 104,
    orbitSpeed: 0.27,
    spinSpeed: 1.28,
    tiltDeg: 26.7,
    wobbleDeg: 0.82,
    wobbleSpeed: 0.4,
    diameter: "116,460 km",
    distance: "9.58 AU",
    orbitPeriod: "29.4 ani",
    moonsTotal: "146",
    temp: "~ -140 C",
    summary: "Gigant gazos faimos pentru inele",
    description: "Inelele sunt formate din particule de gheata si roca.",
    fact1: "Densitatea medie este mai mica decat apa.",
    fact2: "Titan are atmosfera densa.",
    ring: {
      innerRadius: 9.4,
      outerRadius: 15.1,
      texture: "saturn_ring_alpha.png",
      alpha: "saturn_ring_alpha.png"
    },
    satellites: [
      sat({
        key: "titan",
        name: "Titan",
        radius: 0.66,
        orbitRadius: 13.8,
        orbitSpeed: 1.45,
        spinSpeed: 0.7,
        diameter: "5,149 km",
        distanceFromPlanet: "~1,221,900 km",
        orbitPeriod: "15.95 zile",
        temp: "~ -179 C",
        description: "Are atmosfera bogata in azot si lacuri de hidrocarburi.",
        fact1: "Misiunea Huygens a aterizat pe Titan in 2005.",
        fact2: "Este al doilea cel mai mare satelit din Sistemul Solar."
      }),
      sat({
        key: "enceladus",
        name: "Enceladus",
        radius: 0.3,
        orbitRadius: 10.6,
        orbitSpeed: 2.5,
        spinSpeed: 0.84,
        diameter: "504 km",
        distanceFromPlanet: "~238,000 km",
        orbitPeriod: "1.37 zile",
        temp: "~ -198 C",
        description: "Prezinta gheizere de apa in zona polara sudica.",
        fact1: "Este o tinta-cheie pentru cautarea mediilor locuibile.",
        fact2: "Are albedo foarte ridicat."
      }),
      sat({
        key: "rhea",
        name: "Rhea",
        radius: 0.4,
        orbitRadius: 16.9,
        orbitSpeed: 1.15,
        spinSpeed: 0.73,
        diameter: "1,528 km",
        distanceFromPlanet: "~527,100 km",
        orbitPeriod: "4.52 zile",
        temp: "~ -174 C",
        description: "Suprafata veche, dominata de gheata de apa.",
        fact1: "Puternic craterizata.",
        fact2: "Poate avea un inel foarte discret."
      }),
      sat({
        key: "iapetus",
        name: "Iapetus",
        radius: 0.36,
        orbitRadius: 23.8,
        orbitSpeed: 0.82,
        spinSpeed: 0.61,
        tiltDeg: 7.5,
        diameter: "1,471 km",
        distanceFromPlanet: "~3,560,800 km",
        orbitPeriod: "79.3 zile",
        temp: "~ -143 C",
        description: "Contrast mare intre emisfera intunecata si cea luminoasa.",
        fact1: "Are creasta ecuatoriala neobisnuita.",
        fact2: "Orbita inclinata fata de satelitii interni."
      })
    ]
  },
  {
    key: "uranus",
    name: "Uranus",
    texture: "uranus.jpg",
    radius: 3.7,
    orbitRadius: 124,
    orbitSpeed: 0.2,
    spinSpeed: -0.74,
    tiltDeg: 97.8,
    wobbleDeg: 1.2,
    wobbleSpeed: 0.28,
    diameter: "50,724 km",
    distance: "19.22 AU",
    orbitPeriod: "84 ani",
    moonsTotal: "28",
    temp: "~ -195 C",
    summary: "Gigant inghetat inclinat aproape pe o parte",
    description: "Axa extrema produce sezoane neobisnuite.",
    fact1: "Rotatie retrograda.",
    fact2: "Are inele intunecate discrete.",
    satellites: [
      sat({
        key: "titania",
        name: "Titania",
        radius: 0.44,
        orbitRadius: 9.6,
        orbitSpeed: 1.72,
        spinSpeed: 0.77,
        diameter: "1,578 km",
        distanceFromPlanet: "~435,900 km",
        orbitPeriod: "8.71 zile",
        temp: "~ -203 C",
        description: "Cel mai mare satelit al lui Uranus.",
        fact1: "Prezinta canioane extinse.",
        fact2: "Suprafata este un amestec de gheata si roca."
      }),
      sat({
        key: "oberon",
        name: "Oberon",
        radius: 0.43,
        orbitRadius: 12.4,
        orbitSpeed: 1.36,
        spinSpeed: 0.71,
        diameter: "1,523 km",
        distanceFromPlanet: "~583,500 km",
        orbitPeriod: "13.46 zile",
        temp: "~ -203 C",
        description: "Satelit exterior major, foarte craterizat.",
        fact1: "Are depozite intunecate in unele cratere.",
        fact2: "Luminozitate redusa."
      }),
      sat({
        key: "ariel",
        name: "Ariel",
        radius: 0.31,
        orbitRadius: 7.2,
        orbitSpeed: 2.05,
        spinSpeed: 0.86,
        diameter: "1,158 km",
        distanceFromPlanet: "~191,000 km",
        orbitPeriod: "2.52 zile",
        temp: "~ -213 C",
        description: "Are una dintre cele mai tinere suprafete la Uranus.",
        fact1: "Canioane si campii netede.",
        fact2: "Posibila activitate geologica trecuta."
      })
    ]
  },
  {
    key: "neptune",
    name: "Neptun",
    texture: "neptune.jpg",
    radius: 3.6,
    orbitRadius: 144,
    orbitSpeed: 0.16,
    spinSpeed: 1.07,
    tiltDeg: 28.3,
    wobbleDeg: 0.72,
    wobbleSpeed: 0.31,
    diameter: "49,244 km",
    distance: "30.05 AU",
    orbitPeriod: "164.8 ani",
    moonsTotal: "16",
    temp: "~ -200 C",
    summary: "Gigant inghetat cu vanturi foarte rapide",
    description: "Atmosfera bogata in metan si furtuni intense.",
    fact1: "Vanturile pot depasi 2,000 km/h.",
    fact2: "Descoperit prin calcule matematice inainte de observatie directa.",
    satellites: [
      sat({
        key: "triton",
        name: "Triton",
        radius: 0.55,
        orbitRadius: 11.2,
        orbitSpeed: 1.84,
        spinSpeed: 0.8,
        tiltDeg: 157.3,
        diameter: "2,707 km",
        distanceFromPlanet: "~354,800 km",
        orbitPeriod: "5.88 zile",
        temp: "~ -235 C",
        description: "Satelit retrograd, probabil obiect capturat.",
        fact1: "Prezinta gheizere de azot.",
        fact2: "Este unul dintre cei mai reci sateliti mari."
      })
    ]
  }
];

const BODY_INTERNAL_STRUCTURE = {
  sun: {
    title: "Structura interna a Soarelui",
    layers: [
      layer({
        id: "sun-core",
        name: "Nucleu",
        composition: "Plasma de hidrogen si heliu, foarte densa.",
        role: "Locul fuziunii nucleare unde se produce energia stelei.",
        note: "Temperatura este de ordinul a ~15 milioane K.",
        color: 0xffc95e,
        scale: 0.28,
        opacity: 0.95,
        offset: [1, 0.08, 0.16],
        spread: 3.6
      }),
      layer({
        id: "sun-radiative",
        name: "Zona radiativa",
        composition: "Plasma ionizata cu transfer energetic dominant radiativ.",
        role: "Transporta energia prin absorbtie si re-emisie de fotoni.",
        note: "Fotoni pot avea nevoie de mii pana la milioane de ani pentru tranzit.",
        color: 0xffa64d,
        scale: 0.56,
        opacity: 0.72,
        offset: [-0.52, 0.24, 0.2],
        spread: 3.2
      }),
      layer({
        id: "sun-convective",
        name: "Zona convectiva",
        composition: "Plasma mai rece, in celule convective.",
        role: "Transport energetic prin curenti ascendenti/descendenti.",
        note: "Granulatia fotosferei este efectul convectiei.",
        color: 0xff8d52,
        scale: 0.82,
        opacity: 0.5,
        offset: [0.26, -0.38, 0.48],
        spread: 3.05
      }),
      layer({
        id: "sun-photosphere",
        name: "Fotosfera / strat vizibil",
        composition: "Plasma relativ mai rece, sursa luminii vizibile.",
        role: "Suprafata aparenta de unde observam radiatia solara.",
        note: "Temperatura tipica ~5,500 C.",
        color: 0xffe7ad,
        scale: 1.02,
        opacity: 0.34,
        offset: [-0.18, 0.52, -0.34],
        spread: 2.7
      })
    ]
  },
  mercury: {
    title: "Structura interna Mercur",
    layers: [
      layer({
        id: "mercury-core",
        name: "Nucleu metalic",
        composition: "Predominant fier si nichel.",
        role: "Contribuie major la masa planetei si la campul magnetic slab.",
        note: "Nucleul ocupa o fractie foarte mare din raza planetei.",
        color: 0xc2b7ad,
        scale: 0.56,
        opacity: 0.95,
        offset: [1, 0.1, 0.16],
        spread: 1.46
      }),
      layer({
        id: "mercury-mantle",
        name: "Mantaua silicatica",
        composition: "Silicati magnezio-ferosi.",
        role: "Zona intermediara cu rol in evolutia termica.",
        note: "Relativ subtire comparativ cu nucleul.",
        color: 0xa18f84,
        scale: 0.84,
        opacity: 0.74,
        offset: [-0.52, 0.24, 0.16],
        spread: 1.34
      }),
      layer({
        id: "mercury-crust",
        name: "Crusta",
        composition: "Roci bazaltice si regolit impactic.",
        role: "Stratul solid craterizat observabil direct.",
        note: "Fara atmosfera densa, suprafata ramane puternic marcata de impacturi.",
        color: 0x87796d,
        scale: 1.02,
        opacity: 0.45,
        offset: [0.28, -0.36, 0.52],
        spread: 1.22
      })
    ]
  },
  venus: {
    title: "Structura interna Venus",
    layers: [
      layer({
        id: "venus-core",
        name: "Nucleu metalic",
        composition: "Fier si nichel.",
        role: "Centru dens al planetei, posibil partial lichid.",
        note: "Dinamic diferita fata de Pamant.",
        color: 0xd2b09c,
        scale: 0.49,
        opacity: 0.94,
        offset: [1, 0.08, 0.12],
        spread: 1.56
      }),
      layer({
        id: "venus-mantle",
        name: "Mantaua",
        composition: "Silicati fier-magneziu.",
        role: "Controleaza transferul termic intern.",
        note: "Probabil foarte activa in trecut geologic.",
        color: 0xb48765,
        scale: 0.82,
        opacity: 0.7,
        offset: [-0.48, 0.28, 0.2],
        spread: 1.44
      }),
      layer({
        id: "venus-crust-atmo",
        name: "Crusta + atmosfera densa",
        composition: "Crusta bazaltica; atmosfera bogata in CO2 cu nori de acid sulfuric.",
        role: "Genereaza efectul de sera extrem.",
        note: "Presiunea atmosferica la suprafata este ~92 bar.",
        color: 0xe1b07c,
        scale: 1.03,
        opacity: 0.42,
        offset: [0.24, -0.35, 0.56],
        spread: 1.3
      })
    ]
  },
  earth: {
    title: "Structura interna Pamant",
    layers: [
      layer({
        id: "earth-core-inner",
        name: "Nucleu intern",
        composition: "Fier-nichel solid.",
        role: "Contribuie la evolutia geodinamica a nucleului.",
        note: "Presiuni extrem de mari mentin faza solida.",
        color: 0xffd08a,
        scale: 0.2,
        opacity: 0.96,
        offset: [1, 0.06, 0.14],
        spread: 1.66
      }),
      layer({
        id: "earth-core-outer",
        name: "Nucleu extern",
        composition: "Fier-nichel lichid cu elemente usoare.",
        role: "Sursa geodinamo-ului care produce campul magnetic terestru.",
        note: "Fluxurile convective sunt esentiale pentru magnetosfera.",
        color: 0xff9e63,
        scale: 0.38,
        opacity: 0.86,
        offset: [-0.42, 0.22, 0.2],
        spread: 1.52
      }),
      layer({
        id: "earth-mantle",
        name: "Mantaua",
        composition: "Silicati bogati in Mg si Fe.",
        role: "Convecia mantalei antreneaza tectonica placilor.",
        note: "Ocupa cea mai mare parte din volumul planetei.",
        color: 0xd07f4f,
        scale: 0.78,
        opacity: 0.65,
        offset: [0.32, -0.36, 0.5],
        spread: 1.38
      }),
      layer({
        id: "earth-crust-ocean-atmo",
        name: "Crusta + oceane + atmosfera",
        composition: "Crusta silicatica, hidrosfera si atmosfera azot-oxigen.",
        role: "Mediu favorabil vietii si reglare climatica.",
        note: "Interactiunea geosfera-hidrosfera-atmosfera este critica.",
        color: 0x6da7e4,
        scale: 1.02,
        opacity: 0.36,
        offset: [-0.26, 0.5, -0.34],
        spread: 1.2
      })
    ]
  },
  mars: {
    title: "Structura interna Mars",
    layers: [
      layer({
        id: "mars-core",
        name: "Nucleu",
        composition: "Fier, nichel si elemente usoare (sulf).",
        role: "Controleaza partial dinamica termica interna.",
        note: "Datele seismice recente sugereaza nucleu lichid.",
        color: 0xe5935d,
        scale: 0.44,
        opacity: 0.93,
        offset: [1, 0.1, 0.12],
        spread: 1.52
      }),
      layer({
        id: "mars-mantle",
        name: "Mantaua",
        composition: "Silicati bogati in Fe si Mg.",
        role: "Leaga nucleul de crusta, influentand vulcanismul trecut.",
        note: "Activitate geologica mult redusa fata de trecut.",
        color: 0xc66e41,
        scale: 0.8,
        opacity: 0.69,
        offset: [-0.45, 0.25, 0.2],
        spread: 1.4
      }),
      layer({
        id: "mars-crust-atmo",
        name: "Crusta + atmosfera subtire",
        composition: "Crusta bazaltica, atmosfera dominata de CO2.",
        role: "Suprafata oxidata ce da culoarea rosie caracteristica.",
        note: "Presiune atmosferica foarte mica comparativ cu Pamantul.",
        color: 0xad5632,
        scale: 1.02,
        opacity: 0.42,
        offset: [0.26, -0.34, 0.56],
        spread: 1.24
      })
    ]
  },
  jupiter: {
    title: "Structura interna Jupiter",
    layers: [
      layer({
        id: "jupiter-core",
        name: "Nucleu dens",
        composition: "Roca/gheata sub presiune extrema.",
        role: "Semnatura interna a formarii timpurii a gigantului gazos.",
        note: "Poate fi difuz, nu neaparat nucleu solid compact.",
        color: 0xbca08c,
        scale: 0.2,
        opacity: 0.95,
        offset: [1, 0.06, 0.12],
        spread: 2.4
      }),
      layer({
        id: "jupiter-metallic-h",
        name: "Hidrogen metalic",
        composition: "Hidrogen comprimat in stare conductoare.",
        role: "Genereaza campul magnetic foarte puternic.",
        note: "Regiune esentiala pentru dinamica magnetica.",
        color: 0xa97d62,
        scale: 0.54,
        opacity: 0.78,
        offset: [-0.48, 0.24, 0.2],
        spread: 2.2
      }),
      layer({
        id: "jupiter-molecular-envelope",
        name: "Anvelopa H/He",
        composition: "Hidrogen molecular si heliu.",
        role: "Masa volumica dominanta a planetei.",
        note: "Tranzitie graduala spre straturile externe.",
        color: 0xd7ad82,
        scale: 0.84,
        opacity: 0.58,
        offset: [0.28, -0.34, 0.5],
        spread: 2
      }),
      layer({
        id: "jupiter-cloudtops",
        name: "Nori superiori",
        composition: "Amoniac, hidrosulfura de amoniu si apa in urme.",
        role: "Benzile vizibile si furtunile globale (inclusiv Marea Pata Rosie).",
        note: "Vanturi zonale puternice pe multiple latitudini.",
        color: 0xe4c9ad,
        scale: 1.02,
        opacity: 0.33,
        offset: [-0.24, 0.5, -0.34],
        spread: 1.82
      })
    ]
  },
  saturn: {
    title: "Structura interna Saturn",
    layers: [
      layer({
        id: "saturn-core",
        name: "Nucleu dens",
        composition: "Roca si gheata sub presiuni inalte.",
        role: "Centru gravitationaI al gigantului gazos.",
        note: "Datele sugereaza un nucleu extins/difuz.",
        color: 0xc7af8e,
        scale: 0.21,
        opacity: 0.94,
        offset: [1, 0.08, 0.14],
        spread: 2.24
      }),
      layer({
        id: "saturn-metallic-h",
        name: "Hidrogen metalic",
        composition: "Hidrogen in stare conductoare.",
        role: "Contribuie la campul magnetic saturnian.",
        note: "Mai putin extins decat la Jupiter.",
        color: 0xb7946a,
        scale: 0.5,
        opacity: 0.76,
        offset: [-0.48, 0.24, 0.22],
        spread: 2.06
      }),
      layer({
        id: "saturn-envelope",
        name: "Anvelopa moleculara",
        composition: "Hidrogen si heliu.",
        role: "Asigura cea mai mare parte a volumului planetar.",
        note: "Densitatea medie a planetei este sub cea a apei.",
        color: 0xe0c39a,
        scale: 0.86,
        opacity: 0.56,
        offset: [0.28, -0.34, 0.5],
        spread: 1.9
      }),
      layer({
        id: "saturn-cloudtops",
        name: "Nori superiori",
        composition: "Amoniac, hidrosulfuri si aerosoli.",
        role: "Textura vizibila a atmosferei superioare.",
        note: "Inelele se afla in exterior, dar nu sunt parte a interiorului planetar.",
        color: 0xf0d8b9,
        scale: 1.02,
        opacity: 0.34,
        offset: [-0.26, 0.48, -0.32],
        spread: 1.74
      })
    ]
  },
  uranus: {
    title: "Structura interna Uranus",
    layers: [
      layer({
        id: "uranus-core",
        name: "Nucleu stancos",
        composition: "Silicati si metale.",
        role: "Centru relativ compact al gigantului inghetat.",
        note: "Mai mic procentual decat anvelopa interna.",
        color: 0x7bb0b5,
        scale: 0.25,
        opacity: 0.93,
        offset: [1, 0.08, 0.1],
        spread: 1.9
      }),
      layer({
        id: "uranus-icy-mantle",
        name: "Mantaua de gheata fierbinte",
        composition: "Apa, amoniac, metan in stare comprimata/supracritica.",
        role: "Regiune dominanta in masa pentru gigantii inghetati.",
        note: "Aici apar conditii fizice extreme, neintalnite pe Pamant.",
        color: 0x62a9bf,
        scale: 0.75,
        opacity: 0.65,
        offset: [-0.46, 0.24, 0.22],
        spread: 1.72
      }),
      layer({
        id: "uranus-atmosphere",
        name: "Atmosfera superioara",
        composition: "Hidrogen, heliu si metan.",
        role: "Metanul absoarbe rosu si confera nuanta cian.",
        note: "Inclinarea axei produce sezoane extreme.",
        color: 0x9ad8de,
        scale: 1.02,
        opacity: 0.38,
        offset: [0.3, -0.34, 0.52],
        spread: 1.54
      })
    ]
  },
  neptune: {
    title: "Structura interna Neptun",
    layers: [
      layer({
        id: "neptune-core",
        name: "Nucleu stancos",
        composition: "Silicati si metale.",
        role: "Nucleu dens al gigantului inghetat.",
        note: "Contribuie la campul gravitationaI intern.",
        color: 0x5884b8,
        scale: 0.26,
        opacity: 0.94,
        offset: [1, 0.08, 0.12],
        spread: 1.9
      }),
      layer({
        id: "neptune-icy-mantle",
        name: "Mantaua de gheata fierbinte",
        composition: "Apa, amoniac, metan sub presiune.",
        role: "Regiune dominanta, posibil conductor intern complex.",
        note: "Poate sustine dinamica campului magnetic inclinat.",
        color: 0x3f6fa8,
        scale: 0.76,
        opacity: 0.64,
        offset: [-0.46, 0.24, 0.22],
        spread: 1.72
      }),
      layer({
        id: "neptune-atmosphere",
        name: "Atmosfera activa",
        composition: "Hidrogen, heliu si metan.",
        role: "Gazduieste vanturi extreme si furtuni intense.",
        note: "Vitezele vantului pot depasi 2,000 km/h.",
        color: 0x4d8dd8,
        scale: 1.02,
        opacity: 0.39,
        offset: [0.3, -0.34, 0.52],
        spread: 1.54
      })
    ]
  }
};

export function initSolarSystem() {
  const wrap = document.getElementById("solar-canvas-wrap");
  const canvas = document.getElementById("solar-canvas");
  const labelsRoot = document.getElementById("planet-labels");
  const focusTitle = document.getElementById("solar-focus-title");
  const expandButton = document.getElementById("solar-expand");
  const expandBackdrop = document.getElementById("solar-expand-backdrop");
  const modeChip = document.getElementById("solar-mode-chip");
  const layerHint = document.getElementById("solar-layer-hint");
  const layerPanelRoot = document.getElementById("solar-layer-panel");
  const layerPanelTitle = document.getElementById("solar-layer-title");
  const layerPanelComposition = document.getElementById("solar-layer-composition");
  const layerPanelRole = document.getElementById("solar-layer-role");
  const layerPanelNote = document.getElementById("solar-layer-note");
  const resetButton = document.getElementById("reset-view");
  const section = document.getElementById("solar-system");

  if (
    !wrap ||
    !canvas ||
    !labelsRoot ||
    !focusTitle ||
    !expandButton ||
    !expandBackdrop ||
    !modeChip ||
    !layerHint ||
    !layerPanelRoot ||
    !layerPanelTitle ||
    !layerPanelComposition ||
    !layerPanelRole ||
    !layerPanelNote ||
    !resetButton ||
    !window.THREE
  ) {
    return;
  }

  const panel = {
    name: document.getElementById("planet-name"),
    summary: document.getElementById("planet-summary"),
    description: document.getElementById("planet-description"),
    diameter: document.getElementById("planet-diameter"),
    distance: document.getElementById("planet-distance"),
    orbit: document.getElementById("planet-orbit"),
    moons: document.getElementById("planet-moons"),
    satellites: document.getElementById("planet-satellites"),
    temp: document.getElementById("planet-temp"),
    fact1: document.getElementById("planet-fact-1"),
    fact2: document.getElementById("planet-fact-2")
  };
  if (Object.values(panel).some((node) => !node)) return;

  const layerPanel = {
    root: layerPanelRoot,
    title: layerPanelTitle,
    composition: layerPanelComposition,
    role: layerPanelRole,
    note: layerPanelNote
  };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.96;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1800);
  camera.position.set(0, 88, 190);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 0.75;
  controls.minDistance = 42;
  controls.maxDistance = 420;
  controls.minPolarAngle = 0.01;
  controls.maxPolarAngle = Math.PI - 0.01;
  controls.target.set(0, 0, 0);
  controls.update();

  scene.add(new THREE.AmbientLight(0x4f6a96, 0.25));
  scene.add(new THREE.HemisphereLight(0x6e9ad7, 0x090f1b, 0.13));
  const sunLight = new THREE.PointLight(0xffde9a, 3.8, 1300, 1.4);
  scene.add(sunLight);
  const rimLight = new THREE.DirectionalLight(0x7aa9df, 0.16);
  rimLight.position.set(-180, 84, -130);
  scene.add(rimLight);

  const starField = createLocalStarField();
  scene.add(starField);

  const textureLoader = new THREE.TextureLoader();
  const textureCache = new Map();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clock = new THREE.Clock();
  const tmpVec = new THREE.Vector3();

  const orbitalRoot = new THREE.Group();
  orbitalRoot.rotation.x = THREE.MathUtils.degToRad(3.2);
  scene.add(orbitalRoot);

  const zodiacalBand = createZodiacalBand();
  zodiacalBand.rotation.z = THREE.MathUtils.degToRad(2.4);
  orbitalRoot.add(zodiacalBand);

  const asteroidBelt = createAsteroidBelt({
    innerRadius: 67,
    outerRadius: 79,
    thickness: 2.6,
    count: 2900,
    color: 0xcdb797,
    opacity: 0.26,
    size: 0.56
  });
  orbitalRoot.add(asteroidBelt);

  const kuiperBelt = createAsteroidBelt({
    innerRadius: 152,
    outerRadius: 186,
    thickness: 6.8,
    count: 2200,
    color: 0x91aed1,
    opacity: 0.14,
    size: 0.5,
    yOffset: 0.25
  });
  orbitalRoot.add(kuiperBelt);
  const environmentBelts = [zodiacalBand, asteroidBelt, kuiperBelt];

  const entities = [];
  const planets = [];
  const satellites = [];
  const orbitLines = [];

  function loadTexture(name) {
    if (!name) return null;
    if (textureCache.has(name)) return textureCache.get(name);
    const texture = textureLoader.load(`${TEXTURE_DIR}/${name}?v=${TEXTURE_REV}`, () => {}, undefined, () => {});
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = Math.max(4, Math.min(12, renderer.capabilities.getMaxAnisotropy()));
    textureCache.set(name, texture);
    return texture;
  }

  function createLabel(text, className = "planet-label") {
    const label = document.createElement("div");
    label.className = className;
    label.textContent = text;
    label.style.opacity = "0";
    labelsRoot.appendChild(label);
    return label;
  }

  function createOrbitLine(radius, orbitIndex = 0) {
    const points = [];
    const segments = 180;
    for (let i = 0; i <= segments; i += 1) {
      const a = (i / segments) * TAU;
      points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius * 0.96));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const alphaFalloff = THREE.MathUtils.clamp(1 - radius / 170, 0.34, 1);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(0.58, 0.35, 0.67 - orbitIndex * 0.012),
      transparent: true,
      opacity: 0.16 * alphaFalloff
    });
    return new THREE.Line(geometry, material);
  }

  const SUN_RADIUS = 13.6;

  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(SUN_RADIUS, 64, 64),
    new THREE.MeshStandardMaterial({
      map: loadTexture("sun.jpg"),
      emissive: new THREE.Color(0xffd469),
      emissiveIntensity: 0.95,
      roughness: 0.78,
      metalness: 0.02
    })
  );
  scene.add(sunMesh);

  const sunHalo = new THREE.Mesh(
    new THREE.SphereGeometry(17.8, 40, 40),
    new THREE.MeshBasicMaterial({ color: 0xffbc73, transparent: true, opacity: 0.17, depthWrite: false })
  );
  sunMesh.add(sunHalo);

  const sunEntity = {
    type: "sun",
    key: "sun",
    name: "Soare",
    mesh: sunMesh,
    pickTargets: [sunMesh],
    info: SUN_INFO,
    label: createLabel("Soare"),
    spinSpeed: 0.15
  };
  sunMesh.userData.pickEntity = sunEntity;
  entities.push(sunEntity);

  PLANET_DEFS.forEach((def, index) => {
    const orbitLine = createOrbitLine(def.orbitRadius, index);
    orbitLines.push(orbitLine);
    orbitalRoot.add(orbitLine);

    const orbitPivot = new THREE.Object3D();
    orbitPivot.rotation.y = Math.random() * TAU;
    orbitPivot.userData.orbitAngle = orbitPivot.rotation.y;
    orbitalRoot.add(orbitPivot);

    const translationGroup = new THREE.Object3D();
    translationGroup.position.x = def.orbitRadius;
    orbitPivot.add(translationGroup);

    const tiltGroup = new THREE.Object3D();
    translationGroup.add(tiltGroup);

    const isIceOrGas = def.key === "jupiter" || def.key === "saturn" || def.key === "uranus" || def.key === "neptune";
    const baseMaterialConfig = {
      map: loadTexture(def.texture),
      roughness: isIceOrGas ? 0.68 : 0.82,
      metalness: 0.01,
      emissive: new THREE.Color(0x0a1220),
      emissiveIntensity: isIceOrGas ? 0.06 : 0.03
    };

    if (def.key === "earth") {
      baseMaterialConfig.emissiveMap = loadTexture("earth_night.jpg");
      baseMaterialConfig.emissive = new THREE.Color(0x9bc8ff);
      baseMaterialConfig.emissiveIntensity = 0.22;
      baseMaterialConfig.roughness = 0.74;
    }

    const planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(def.radius, 56, 56),
      new THREE.MeshStandardMaterial(baseMaterialConfig)
    );
    tiltGroup.add(planetMesh);

    const planetEntity = {
      type: "planet",
      key: def.key,
      name: def.name,
      def,
      orbitPivot,
      tiltGroup,
      mesh: planetMesh,
      ringMesh: null,
      pickTargets: [planetMesh],
      orbitLine,
      satellites: [],
      label: createLabel(def.name),
      wobblePhase: Math.random() * TAU,
      spinPhase: Math.random() * TAU
    };

    if (def.ring) {
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(def.ring.innerRadius, def.ring.outerRadius, 96),
        new THREE.MeshStandardMaterial({
          map: loadTexture(def.ring.texture),
          alphaMap: loadTexture(def.ring.alpha),
          transparent: true,
          side: THREE.DoubleSide,
          roughness: 0.9,
          metalness: 0.02,
          color: 0xd8c5a6,
          opacity: 0.92
        })
      );
      ringMesh.rotation.x = Math.PI * 0.5;
      ringMesh.userData.pickEntity = planetEntity;
      tiltGroup.add(ringMesh);
      planetEntity.pickTargets.push(ringMesh);
      planetEntity.ringMesh = ringMesh;
    }

    planetMesh.userData.pickEntity = planetEntity;
    planets.push(planetEntity);
    entities.push(planetEntity);

    def.satellites.forEach((satDef) => {
      const satPivot = new THREE.Object3D();
      satPivot.rotation.y = Math.random() * TAU;
      satPivot.userData.orbitAngle = satPivot.rotation.y;
      tiltGroup.add(satPivot);

      const satTranslation = new THREE.Object3D();
      satTranslation.position.x = satDef.orbitRadius;
      satPivot.add(satTranslation);

      const satTiltGroup = new THREE.Object3D();
      satTranslation.add(satTiltGroup);

      const satMesh = new THREE.Mesh(
        new THREE.SphereGeometry(satDef.radius, 28, 28),
        new THREE.MeshStandardMaterial({
          map: loadTexture(satDef.texture),
          roughness: 0.92,
          metalness: 0.01,
          emissive: new THREE.Color(0x25364e),
          emissiveIntensity: 0.08
        })
      );
      satMesh.visible = false;
      satTiltGroup.add(satMesh);

      const satEntity = {
        type: "satellite",
        key: `${def.key}-${satDef.key}`,
        name: satDef.name,
        def: satDef,
        parentPlanet: planetEntity,
        pivot: satPivot,
        tiltGroup: satTiltGroup,
        mesh: satMesh,
        pickTargets: [satMesh],
        label: createLabel(satDef.name, "planet-label planet-label-satellite"),
        wobblePhase: Math.random() * TAU,
        spinPhase: Math.random() * TAU
      };

      satMesh.userData.pickEntity = satEntity;
      planetEntity.satellites.push(satEntity);
      satellites.push(satEntity);
      entities.push(satEntity);
    });
  });

  const disassemblyModels = new Map();

  function createDisassemblyModel(entity) {
    const structure = BODY_INTERNAL_STRUCTURE[entity.key];
    if (!structure) return;

    const parent = entity.type === "sun" ? scene : entity.tiltGroup;
    const radius = entity.type === "sun" ? SUN_RADIUS : entity.def.radius;

    const group = new THREE.Group();
    group.visible = false;
    parent.add(group);

    const layers = structure.layers.map((layerDef) => {
      const direction = new THREE.Vector3(...layerDef.offset);
      if (direction.lengthSq() < 0.0001) direction.set(1, 0, 0);
      direction.normalize();

      const geometry = new THREE.SphereGeometry(radius * layerDef.scale, 46, 46);
      const material = new THREE.MeshStandardMaterial({
        color: layerDef.color,
        transparent: true,
        opacity: layerDef.opacity,
        roughness: 0.72,
        metalness: 0.04,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.visible = true;
      mesh.userData.pickLayerId = layerDef.id;

      const outline = new THREE.Mesh(
        new THREE.SphereGeometry(radius * layerDef.scale * 1.003, 36, 36),
        new THREE.MeshBasicMaterial({
          color: 0x8fd4ff,
          wireframe: true,
          transparent: true,
          opacity: 0.08,
          depthWrite: false
        })
      );
      mesh.add(outline);

      group.add(mesh);

      return {
        def: layerDef,
        direction,
        mesh,
        baseOpacity: layerDef.opacity,
        baseEmissiveIntensity: 0
      };
    });

    disassemblyModels.set(entity.key, {
      entity,
      structure,
      group,
      radius,
      layers
    });
  }

  createDisassemblyModel(sunEntity);
  planets.forEach((planetEntity) => createDisassemblyModel(planetEntity));

  function isDisassemblable(entity) {
    return Boolean(entity && (entity.type === "sun" || entity.type === "planet") && disassemblyModels.has(entity.key));
  }

  let selectedEntity = null;
  let cameraTransition = null;
  let sectionVisible = true;
  let fallbackExpanded = false;
  let pointerDown = null;
  let pointerDragged = false;
  let pointerStartCamera = null;
  let pointerStartTarget = null;
  let rapidTapKey = "";
  let rapidTapWindow = [];
  let disassemblyKey = "";
  let disassemblyTarget = 0;
  let disassemblyCurrent = 0;
  let selectedLayerId = "";
  let modeLabelCache = "";
  let hintLabelCache = "";

  function renderPanelDefaults() {
    panel.name.textContent = "Selecteaza o planeta";
    panel.summary.textContent = "Apasa pe o planeta, pe Soare sau pe un satelit pentru detalii.";
    panel.description.textContent = "";
    panel.diameter.textContent = "-";
    panel.distance.textContent = "-";
    panel.orbit.textContent = "-";
    panel.moons.textContent = "-";
    panel.satellites.textContent = "-";
    panel.temp.textContent = "-";
    panel.fact1.textContent = "";
    panel.fact2.textContent = "";
  }

  function hideLayerPanel() {
    layerPanel.root.hidden = true;
    layerPanel.title.textContent = "Structura interna";
    layerPanel.composition.textContent = "";
    layerPanel.role.textContent = "";
    layerPanel.note.textContent = "";
  }

  function renderLayerPanel(model, layerState) {
    if (!model || !layerState) {
      hideLayerPanel();
      return;
    }

    layerPanel.root.hidden = false;
    layerPanel.title.textContent = `${model.entity.name} - ${layerState.def.name}`;
    layerPanel.composition.innerHTML = `<strong>Compozitie:</strong> ${layerState.def.composition}`;
    layerPanel.role.innerHTML = `<strong>Rol:</strong> ${layerState.def.role}`;
    layerPanel.note.innerHTML = `<strong>Nota:</strong> ${layerState.def.note}`;
  }

  function setLayerHighlight(model, layerId) {
    if (!model) return;

    model.layers.forEach((layerState) => {
      const material = layerState.mesh.material;
      if (!material) return;

      const isActive = layerState.def.id === layerId;
      material.opacity = isActive ? Math.min(1, layerState.baseOpacity + 0.18) : layerState.baseOpacity;
      material.emissive.setHex(isActive ? 0x4ca7ff : 0x000000);
      material.emissiveIntensity = isActive ? 0.75 : layerState.baseEmissiveIntensity;
      material.needsUpdate = true;
    });
  }

  function clearLayerSelection() {
    selectedLayerId = "";
    const model = disassemblyModels.get(disassemblyKey);
    if (model) setLayerHighlight(model, "");
    hideLayerPanel();
  }

  function updateSolarModeUi() {
    const expanded = isExpanded();
    const exploded = disassemblyCurrent > 0.54;
    const modeText = exploded ? "Mod disociere activ" : expanded ? "Mod marit" : "Mod standard";

    let hintText = "Mareste scena pentru modul disociere interna (triple-click in 1 secunda).";
    if (exploded) {
      hintText = "Mod disociere activ: click pe straturi pentru detalii. Triple-click pentru revenire.";
    } else if (expanded) {
      hintText = "In modul marit: triple-click (3 click-uri in 1 secunda) pe corpul selectat pentru modul disociere.";
    }

    if (modeText !== modeLabelCache) {
      modeChip.textContent = modeText;
      modeLabelCache = modeText;
    }

    if (hintText !== hintLabelCache) {
      layerHint.textContent = hintText;
      hintLabelCache = hintText;
    }
  }

  function setDisassemblyMode(nextState, instant = false) {
    const enable = Boolean(nextState);
    if (!enable) {
      disassemblyTarget = 0;
      rapidTapWindow = [];
      if (instant) {
        disassemblyCurrent = 0;
        disassemblyModels.forEach((model) => {
          model.group.visible = false;
          model.entity.mesh.visible = true;
          if (model.entity.type === "sun") sunHalo.visible = sunMesh.visible;
          if (model.entity.type === "planet" && model.entity.ringMesh) model.entity.ringMesh.visible = true;
        });
      }
      clearLayerSelection();
      updateSolarModeUi();
      return;
    }

    if (!isExpanded() || !isDisassemblable(selectedEntity)) return;
    disassemblyKey = selectedEntity.key;
    disassemblyTarget = 1;
    rapidTapWindow = [];
    updateSolarModeUi();
  }

  function makePlanetInfo(entity) {
    return {
      name: entity.def.name,
      summary: entity.def.summary,
      description: entity.def.description,
      diameter: entity.def.diameter,
      distance: entity.def.distance,
      orbit: entity.def.orbitPeriod,
      moons: entity.def.moonsTotal,
      satellites: entity.satellites.length ? entity.satellites.map((satEntity) => satEntity.name).join(", ") : "-",
      temp: entity.def.temp,
      fact1: entity.def.fact1,
      fact2: entity.def.fact2
    };
  }

  function makeSatelliteInfo(entity) {
    return {
      name: entity.name,
      summary: `Satelit natural al planetei ${entity.parentPlanet.name}`,
      description: entity.def.description,
      diameter: entity.def.diameter,
      distance: `${entity.def.distanceFromPlanet} fata de ${entity.parentPlanet.name}`,
      orbit: entity.def.orbitPeriod,
      moons: "0",
      satellites: "-",
      temp: entity.def.temp,
      fact1: entity.def.fact1,
      fact2: entity.def.fact2
    };
  }

  function renderPanelInfo(info) {
    panel.name.textContent = info.name;
    panel.summary.textContent = info.summary;
    panel.description.textContent = info.description;
    panel.diameter.textContent = info.diameter;
    panel.distance.textContent = info.distance;
    panel.orbit.textContent = info.orbit;
    panel.moons.textContent = info.moons;
    panel.satellites.textContent = info.satellites;
    panel.temp.textContent = info.temp;
    panel.fact1.textContent = `Fapt interesant: ${info.fact1}`;
    panel.fact2.textContent = info.fact2;
  }

  function isEntityVisible(entity) {
    if (entity.type === "sun") return sunMesh.visible;
    if (entity.type === "planet") return entity.orbitPivot.visible && entity.mesh.visible;
    return entity.parentPlanet.orbitPivot.visible && entity.mesh.visible;
  }

  function shouldShowLabel(entity) {
    if (!isEntityVisible(entity)) return false;
    if (!selectedEntity) return entity.type === "sun" || entity.type === "planet";
    if (selectedEntity.type === "sun") return false;
    return entity.type === "satellite";
  }

  function applySelectionVisibility() {
    const hasSelection = Boolean(selectedEntity);
    orbitLines.forEach((line) => {
      line.visible = !hasSelection;
    });
    environmentBelts.forEach((belt) => {
      belt.visible = !hasSelection;
    });

    planets.forEach((planetEntity) => {
      planetEntity.orbitPivot.visible = !hasSelection;
      planetEntity.satellites.forEach((satEntity) => {
        satEntity.mesh.visible = false;
      });
    });

    sunMesh.visible = !hasSelection;
    sunHalo.visible = !hasSelection;

    if (!selectedEntity) return;

    if (selectedEntity.type === "sun") {
      sunMesh.visible = true;
      sunHalo.visible = true;
      return;
    }

    const focusPlanet = selectedEntity.type === "planet" ? selectedEntity : selectedEntity.parentPlanet;
    focusPlanet.orbitPivot.visible = true;
    focusPlanet.satellites.forEach((satEntity) => {
      satEntity.mesh.visible = true;
    });
  }

  function getEntityWorldPosition(entity) {
    entity.mesh.getWorldPosition(tmpVec);
    return tmpVec.clone();
  }

  function getFocusDistance(entity) {
    if (entity.type === "sun") return 72;
    if (entity.type === "satellite") return Math.max(16, 14 + entity.def.radius * 14);
    return Math.max(24, 22 + entity.def.radius * 4.3);
  }

  function startCameraTransition(targetEntity) {
    const endTarget = targetEntity ? getEntityWorldPosition(targetEntity) : new THREE.Vector3(0, 0, 0);
    const endPosition = new THREE.Vector3();

    if (!targetEntity) {
      endPosition.set(0, 88, 190);
      controls.minDistance = 42;
      controls.maxDistance = 420;
    } else {
      const direction = camera.position.clone().sub(endTarget);
      if (direction.lengthSq() < 0.001) direction.set(1, 0.42, 1);
      direction.normalize();
      endPosition.copy(endTarget).add(direction.multiplyScalar(getFocusDistance(targetEntity)));
      endPosition.y += targetEntity.type === "sun" ? 9 : 4;
      controls.minDistance = targetEntity.type === "sun" ? 26 : 10;
      controls.maxDistance = targetEntity.type === "sun" ? 130 : 95;
    }

    controls.enabled = false;
    cameraTransition = {
      elapsed: 0,
      duration: targetEntity ? 0.7 : 0.8,
      startPos: camera.position.clone(),
      endPos: endPosition,
      startTarget: controls.target.clone(),
      endTarget
    };
  }

  function selectEntity(entity) {
    const previousKey = selectedEntity?.key || "";
    selectedEntity = entity;
    const currentKey = selectedEntity?.key || "";

    if (previousKey !== currentKey) {
      rapidTapWindow = [];
      rapidTapKey = currentKey;
    }

    if (!selectedEntity || !isDisassemblable(selectedEntity) || (disassemblyKey && disassemblyKey !== selectedEntity.key)) {
      setDisassemblyMode(false, true);
      if (!selectedEntity || !isDisassemblable(selectedEntity) || (disassemblyKey && disassemblyKey !== selectedEntity.key)) {
        disassemblyKey = "";
      }
    }

    applySelectionVisibility();

    if (!entity) {
      renderPanelDefaults();
      focusTitle.textContent = "";
      focusTitle.classList.remove("is-visible");
      disassemblyKey = "";
      updateSolarModeUi();
      startCameraTransition(null);
      return;
    }

    if (entity.type === "sun") renderPanelInfo(entity.info);
    if (entity.type === "planet") renderPanelInfo(makePlanetInfo(entity));
    if (entity.type === "satellite") renderPanelInfo(makeSatelliteInfo(entity));

    focusTitle.textContent = entity.name.toUpperCase();
    focusTitle.classList.add("is-visible");
    updateSolarModeUi();
    startCameraTransition(entity);
  }

  function updateLabels() {
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    entities.forEach((entity) => {
      const label = entity.label;
      if (!label) return;
      if (!shouldShowLabel(entity)) {
        label.style.opacity = "0";
        return;
      }

      const yLift =
        entity.type === "sun" ? 16 : entity.type === "planet" ? entity.def.radius + 2 : entity.def.radius + 1.4;
      entity.mesh.getWorldPosition(tmpVec);
      tmpVec.y += yLift;
      tmpVec.project(camera);

      if (!(tmpVec.z > -1 && tmpVec.z < 1)) {
        label.style.opacity = "0";
        return;
      }

      const x = (tmpVec.x * 0.5 + 0.5) * width;
      const y = (-tmpVec.y * 0.5 + 0.5) * height;
      label.style.left = `${x.toFixed(1)}px`;
      label.style.top = `${y.toFixed(1)}px`;
      label.style.opacity = "1";
    });
  }

  function animateBodies(delta, elapsed) {
    const activeModel = getActiveDisassemblyModel();
    const activeDisassemblyKey = activeModel?.entity.key || "";
    const explodedVisible = disassemblyCurrent > 0.02;

    sunMesh.rotation.y += sunEntity.spinSpeed * delta;
    sunHalo.material.opacity = 0.2 + 0.08 * Math.sin(elapsed * 1.25);
    starField.rotation.y += delta * 0.008;
    starField.rotation.x = Math.sin(elapsed * 0.035) * 0.045;
    zodiacalBand.rotation.z += delta * 0.0022;
    asteroidBelt.rotation.y += delta * 0.0038;
    kuiperBelt.rotation.y -= delta * 0.0019;

    const focusPlanet = selectedEntity
      ? selectedEntity.type === "planet"
        ? selectedEntity
        : selectedEntity.type === "satellite"
          ? selectedEntity.parentPlanet
          : null
      : null;

    planets.forEach((planetEntity) => {
      const def = planetEntity.def;
      if (!selectedEntity) {
        planetEntity.orbitPivot.userData.orbitAngle += def.orbitSpeed * delta * 0.22;
        planetEntity.orbitPivot.rotation.y = planetEntity.orbitPivot.userData.orbitAngle;
      }

      const wobble =
        THREE.MathUtils.degToRad(def.wobbleDeg) * Math.sin(elapsed * def.wobbleSpeed + planetEntity.wobblePhase);
      planetEntity.tiltGroup.rotation.z = THREE.MathUtils.degToRad(def.tiltDeg) + wobble;

      if (!(explodedVisible && activeDisassemblyKey === planetEntity.key)) {
        const dynamicSpin = def.spinSpeed * (0.86 + 0.14 * Math.sin(elapsed * 0.9 + planetEntity.spinPhase));
        const spinBoost = focusPlanet === planetEntity ? 1.22 : 1;
        planetEntity.mesh.rotation.y += dynamicSpin * spinBoost * delta;
      }
    });

    satellites.forEach((satEntity) => {
      const animateSatellite =
        !selectedEntity ||
        (selectedEntity.type === "planet" && satEntity.parentPlanet === selectedEntity) ||
        (selectedEntity.type === "satellite" && satEntity.parentPlanet === selectedEntity.parentPlanet);
      if (!animateSatellite) return;

      const def = satEntity.def;
      satEntity.pivot.userData.orbitAngle += def.orbitSpeed * delta * 0.24;
      satEntity.pivot.rotation.y = satEntity.pivot.userData.orbitAngle;

      const wobble =
        THREE.MathUtils.degToRad(def.wobbleDeg) * Math.sin(elapsed * def.wobbleSpeed + satEntity.wobblePhase);
      satEntity.tiltGroup.rotation.z = THREE.MathUtils.degToRad(def.tiltDeg || 0) + wobble;

      const dynamicSpin = def.spinSpeed * (0.9 + 0.1 * Math.sin(elapsed * 1.1 + satEntity.spinPhase));
      const spinBoost = selectedEntity === satEntity ? 1.24 : 1;
      satEntity.mesh.rotation.y += dynamicSpin * spinBoost * delta;
      satEntity.mesh.material.emissiveIntensity = selectedEntity === satEntity ? 0.2 : 0.08;
    });

    updateDisassembly(delta, elapsed);
  }

  function updateDisassembly(delta, elapsed) {
    const smoothing = Math.min(1, delta * 5.5);
    disassemblyCurrent += (disassemblyTarget - disassemblyCurrent) * smoothing;

    if (Math.abs(disassemblyCurrent - disassemblyTarget) < 0.0008) {
      disassemblyCurrent = disassemblyTarget;
    }

    const activeModel = getActiveDisassemblyModel();

    disassemblyModels.forEach((model) => {
      const isActive = Boolean(activeModel && activeModel.entity.key === model.entity.key);

      if (!isActive) {
        model.group.visible = false;
        if (model.entity.type === "planet" && model.entity.ringMesh) model.entity.ringMesh.visible = true;
        if (model.entity.type === "sun") sunHalo.visible = sunMesh.visible;
        return;
      }

      if (disassemblyCurrent <= 0.01) {
        model.group.visible = false;
        model.entity.mesh.visible = true;
        if (model.entity.type === "sun") sunHalo.visible = true;
        if (model.entity.type === "planet") {
          if (model.entity.ringMesh) model.entity.ringMesh.visible = true;
          const shouldShowSatellites =
            selectedEntity?.type === "planet"
              ? selectedEntity === model.entity
              : selectedEntity?.type === "satellite"
                ? selectedEntity.parentPlanet === model.entity
                : false;
          model.entity.satellites.forEach((satEntity) => {
            satEntity.mesh.visible = shouldShowSatellites;
          });
        }
        return;
      }

      model.group.visible = true;
      model.entity.mesh.visible = false;
      if (model.entity.type === "sun") sunHalo.visible = false;
      if (model.entity.type === "planet") {
        if (model.entity.ringMesh) model.entity.ringMesh.visible = false;
        model.entity.satellites.forEach((satEntity) => {
          satEntity.mesh.visible = false;
        });
      }

      const spinSpeed = model.entity.type === "sun" ? sunEntity.spinSpeed : model.entity.def.spinSpeed;
      model.group.rotation.y += spinSpeed * delta * 0.82;
      model.group.rotation.z = Math.sin(elapsed * 0.16 + model.radius) * 0.03 * disassemblyCurrent;

      model.layers.forEach((layerState) => {
        const shift = (layerState.def.spread || 1) * disassemblyCurrent;
        layerState.mesh.position.copy(layerState.direction).multiplyScalar(shift);
      });
    });

    if (disassemblyKey && disassemblyTarget === 0 && disassemblyCurrent <= 0.01) {
      const closedModel = disassemblyModels.get(disassemblyKey);
      if (closedModel) {
        closedModel.group.visible = false;
        closedModel.entity.mesh.visible = true;
        if (closedModel.entity.type === "planet") {
          if (closedModel.entity.ringMesh) closedModel.entity.ringMesh.visible = true;
          const shouldShowSatellites =
            selectedEntity?.type === "planet"
              ? selectedEntity === closedModel.entity
              : selectedEntity?.type === "satellite"
                ? selectedEntity.parentPlanet === closedModel.entity
                : false;
          closedModel.entity.satellites.forEach((satEntity) => {
            satEntity.mesh.visible = shouldShowSatellites;
          });
        }
      }
      disassemblyKey = "";
      clearLayerSelection();
    }

    updateSolarModeUi();
  }

  function updateCameraTransition(delta) {
    if (!cameraTransition) return;

    cameraTransition.elapsed += delta;
    const t = Math.min(1, cameraTransition.elapsed / cameraTransition.duration);
    const eased = t * t * (3 - 2 * t);
    camera.position.lerpVectors(cameraTransition.startPos, cameraTransition.endPos, eased);
    controls.target.lerpVectors(cameraTransition.startTarget, cameraTransition.endTarget, eased);
    camera.lookAt(controls.target);

    if (t >= 1) {
      cameraTransition = null;
      controls.enabled = true;
      controls.update();
    }
  }

  function pickEntity(event) {
    if (cameraTransition) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const pickTargets = [];
    entities.forEach((entity) => {
      if (!isEntityVisible(entity)) return;
      entity.pickTargets.forEach((target) => {
        if (target.visible) pickTargets.push(target);
      });
    });
    if (!pickTargets.length) return null;

    const hits = raycaster.intersectObjects(pickTargets, true);
    for (const hit of hits) {
      let current = hit.object;
      while (current && !current.userData.pickEntity) {
        current = current.parent;
      }
      if (!current?.userData.pickEntity) continue;
      const pickedEntity = current.userData.pickEntity;
      selectEntity(pickedEntity);
      return pickedEntity;
    }

    return null;
  }

  function getActiveDisassemblyModel() {
    if (!disassemblyKey) return null;
    return disassemblyModels.get(disassemblyKey) || null;
  }

  function pickLayer(event) {
    if (disassemblyCurrent < 0.54) return null;
    const model = getActiveDisassemblyModel();
    if (!model || !model.group.visible) return null;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;

    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const targets = model.layers.map((layerState) => layerState.mesh);
    const hits = raycaster.intersectObjects(targets, true);
    if (!hits.length) return null;

    let current = hits[0].object;
    while (current && !current.userData.pickLayerId) current = current.parent;
    if (!current?.userData.pickLayerId) return null;

    const layerId = current.userData.pickLayerId;
    const layerState = model.layers.find((entry) => entry.def.id === layerId);
    if (!layerState) return null;

    selectedLayerId = layerId;
    setLayerHighlight(model, layerId);
    renderLayerPanel(model, layerState);
    return layerId;
  }

  function registerRapidTap(triggerKey) {
    const key = triggerKey || selectedEntity?.key || "";
    if (!key) return false;
    if (rapidTapKey !== key) {
      rapidTapKey = key;
      rapidTapWindow = [];
    }

    const now = performance.now();
    rapidTapWindow = rapidTapWindow.filter((time) => now - time <= RAPID_TAP_WINDOW_MS);
    rapidTapWindow.push(now);

    if (rapidTapWindow.length < RAPID_TAP_COUNT) return false;

    rapidTapWindow = [];
    if (!isExpanded() || !isDisassemblable(selectedEntity)) return false;

    const shouldEnable = disassemblyTarget < 0.5;
    if (shouldEnable) {
      disassemblyKey = selectedEntity.key;
      clearLayerSelection();
      setDisassemblyMode(true);
    } else {
      setDisassemblyMode(false);
    }
    return true;
  }

  function onPointerDown(event) {
    if (event.button !== 0) return;
    canvas.classList.add("is-grabbing");
    pointerDown = { x: event.clientX, y: event.clientY };
    pointerDragged = false;
    pointerStartCamera = camera.position.clone();
    pointerStartTarget = controls.target.clone();
  }

  function onPointerMove(event) {
    if (!pointerDown) return;
    const dx = event.clientX - pointerDown.x;
    const dy = event.clientY - pointerDown.y;
    if (Math.hypot(dx, dy) > CLICK_DRAG_THRESHOLD) pointerDragged = true;
  }

  function onPointerUp(event) {
    if (!pointerDown) return;
    canvas.classList.remove("is-grabbing");
    const drag = pointerDragged;
    const cameraMoved =
      pointerStartCamera?.distanceToSquared(camera.position) > 0.0005 ||
      pointerStartTarget?.distanceToSquared(controls.target) > 0.0005;
    pointerDown = null;
    pointerDragged = false;
    pointerStartCamera = null;
    pointerStartTarget = null;

    if (!drag && !cameraMoved) {
      const pickedLayer = pickLayer(event);
      let pickedEntity = null;

      if (!pickedLayer) {
        pickedEntity = pickEntity(event);
      }

      const tapKey = pickedLayer ? disassemblyKey : pickedEntity?.key || selectedEntity?.key || "";
      registerRapidTap(tapKey);
    }
  }

  function onPointerLeave() {
    canvas.classList.remove("is-grabbing");
    pointerDown = null;
    pointerDragged = false;
    pointerStartCamera = null;
    pointerStartTarget = null;
  }

  function onResize() {
    const width = Math.max(1, wrap.clientWidth);
    const height = Math.max(1, wrap.clientHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function isNativeFullscreen() {
    return document.fullscreenElement === wrap;
  }

  function isExpanded() {
    return fallbackExpanded || isNativeFullscreen();
  }

  function syncExpandUi() {
    const expanded = isExpanded();

    wrap.classList.toggle("is-expanded", fallbackExpanded);
    expandBackdrop.hidden = !fallbackExpanded;
    document.body.classList.toggle("solar-expanded-open", fallbackExpanded);

    expandButton.textContent = expanded ? "Micsoreaza" : "Mareste";
    expandButton.setAttribute("aria-pressed", expanded ? "true" : "false");
    expandButton.setAttribute(
      "aria-label",
      expanded ? "Revino la marimea normala a scenei Sistemului Solar" : "Mareste scena Sistemului Solar"
    );

    if (!expanded && disassemblyTarget > 0.01) {
      setDisassemblyMode(false, true);
      disassemblyKey = "";
    }

    updateSolarModeUi();
    onResize();
  }

  async function onExpandClick() {
    if (document.fullscreenEnabled && typeof wrap.requestFullscreen === "function") {
      if (isNativeFullscreen()) {
        await document.exitFullscreen();
      } else {
        await wrap.requestFullscreen();
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

  function onExpandBackdropClick() {
    if (!fallbackExpanded) return;
    fallbackExpanded = false;
    syncExpandUi();
  }

  function onExpandEscape(event) {
    if (event.key !== "Escape" || !fallbackExpanded) return;
    fallbackExpanded = false;
    syncExpandUi();
  }

  const observer = new window.IntersectionObserver(
    (entries) => {
      sectionVisible = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0.14 }
  );
  observer.observe(section || wrap);

  const onFullscreenChange = () => {
    syncExpandUi();
  };

  const onResetClick = () => {
    selectEntity(null);
  };

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  expandButton.addEventListener("click", onExpandClickSafe);
  expandBackdrop.addEventListener("click", onExpandBackdropClick);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  window.addEventListener("keydown", onExpandEscape);
  resetButton.addEventListener("click", onResetClick);
  window.addEventListener("resize", onResize);

  renderPanelDefaults();
  hideLayerPanel();
  updateSolarModeUi();
  applySelectionVisibility();
  syncExpandUi();
  onResize();

  let raf = 0;
  function animate() {
    raf = window.requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.045);
    const elapsed = clock.elapsedTime;

    animateBodies(delta, elapsed);
    updateCameraTransition(delta);
    if (!cameraTransition) controls.update();
    updateLabels();

    if ((sectionVisible || isExpanded()) && !document.hidden) {
      renderer.render(scene, camera);
    }
  }
  animate();

  window.addEventListener(
    "beforeunload",
    () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onExpandEscape);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      expandButton.removeEventListener("click", onExpandClickSafe);
      expandBackdrop.removeEventListener("click", onExpandBackdropClick);
      resetButton.removeEventListener("click", onResetClick);
      canvas.classList.remove("is-grabbing");
      wrap.classList.remove("is-expanded");
      document.body.classList.remove("solar-expanded-open");
      expandBackdrop.hidden = true;
      if (document.fullscreenElement === wrap && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    },
    { once: true }
  );
}
