import { initStarfield } from "./starfield.js";
import { initMilkyWay } from "./milkyway.js";
import { initSolarSystem } from "./solar-system.js?v=20260409g";
import { initVoyager } from "./voyager.js";
import { initQuiz } from "./quiz.js";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

boot();

function boot() {
  initGlobalUI();
  initGalaxyShowcase();
  initScrollReveals();
  initStoryScrollTransitions();

  // Keep page functional even if one module fails.
  safeInit("starfield", initStarfield);
  safeInit("milkyway", initMilkyWay);
  safeInit("solar-system", initSolarSystem);
  safeInit("voyager", initVoyager);
  safeInit("quiz", initQuiz);
}

function initGalaxyShowcase() {
  const cards = Array.from(document.querySelectorAll(".galaxy-type-card"));
  const preview = document.getElementById("galaxy-preview");
  const previewImage = document.getElementById("galaxy-preview-image");
  const previewType = document.getElementById("galaxy-preview-type");
  const previewCaption = document.getElementById("galaxy-preview-caption");
  const previewDescription = document.getElementById("galaxy-preview-description");
  const previewFacts = document.getElementById("galaxy-preview-facts");
  const previewSource = document.getElementById("galaxy-preview-source");
  const infoToggle = document.getElementById("galaxy-info-toggle");

  if (
    !cards.length ||
    !preview ||
    !previewImage ||
    !previewType ||
    !previewCaption ||
    !previewDescription ||
    !previewFacts ||
    !previewSource ||
    !infoToggle
  ) {
    return;
  }

  let swapTimer = 0;
  let isInfoOpen = false;
  let activeCard = null;

  function setInfoOpen(nextState) {
    isInfoOpen = Boolean(nextState);
    preview.classList.toggle("is-info-open", isInfoOpen);
    infoToggle.setAttribute("aria-expanded", isInfoOpen ? "true" : "false");
    infoToggle.textContent = isInfoOpen ? "Ascunde info" : "Arata info";
  }

  function setActiveCard(card) {
    if (!card) return;
    const isDifferentCard = activeCard !== card;

    cards.forEach((entry) => entry.classList.remove("is-active"));
    card.classList.add("is-active");
    activeCard = card;

    if (isDifferentCard) {
      setInfoOpen(false);
    }

    previewType.textContent = card.dataset.type || "";
    previewCaption.textContent = card.dataset.caption || "";
    previewDescription.textContent = card.dataset.description || "";
    previewSource.textContent = card.dataset.source || "Imagine: NASA/ESA/Hubble";

    const facts = (card.dataset.facts || "")
      .split("|")
      .map((fact) => fact.trim())
      .filter(Boolean);
    previewFacts.innerHTML = facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("");

    previewImage.classList.add("is-changing");
    if (swapTimer) window.clearTimeout(swapTimer);
    swapTimer = window.setTimeout(() => {
      if (card.dataset.image) {
        previewImage.style.backgroundImage = `url('${card.dataset.image}')`;
      }
      previewImage.classList.remove("is-changing");
      swapTimer = 0;
    }, 130);
  }

  infoToggle.addEventListener("click", () => {
    setInfoOpen(!isInfoOpen);
  });

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => setActiveCard(card));
    card.addEventListener("focus", () => setActiveCard(card));
    card.addEventListener("click", () => setActiveCard(card));
  });

  setActiveCard(cards.find((card) => card.classList.contains("is-active")) || cards[0]);
  setInfoOpen(false);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeInit(name, fn) {
  try {
    fn();
  } catch (error) {
    // Visible in browser devtools, but the rest of the page keeps running.
    console.error(`[COSMOS] Init failed for ${name}`, error);
  }
}

function initGlobalUI() {
  const scrollNextButton = document.getElementById("scroll-next");
  const restartButton = document.getElementById("restart-journey");
  const universeSection = document.getElementById("universe");

  if (scrollNextButton && universeSection) {
    scrollNextButton.addEventListener("click", () => {
      universeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function initScrollReveals() {
  const revealItems = Array.from(document.querySelectorAll(".js-reveal"));
  if (!revealItems.length) return;

  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  if (!hasGsap) {
    revealItems.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add("in-view");
      }, index * 60);
    });
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);

  revealItems.forEach((item) => {
    window.gsap.fromTo(
      item,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: "power2.out",
        onComplete: () => item.classList.add("in-view"),
        scrollTrigger: {
          trigger: item,
          start: "top 86%"
        }
      }
    );
  });
}

function initStoryScrollTransitions() {
  const panels = Array.from(document.querySelectorAll(".panel"));
  if (panels.length < 2) return;

  const reduceMotionQuery =
    typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  const reducedMotion = Boolean(reduceMotionQuery && reduceMotionQuery.matches);

  const finePointerQuery =
    typeof window.matchMedia === "function" ? window.matchMedia("(pointer: fine)") : null;
  const prefersFinePointer = Boolean(finePointerQuery && finePointerQuery.matches);
  const desktopViewport = window.innerWidth >= 980;

  document.body.classList.remove("story-scroll-snap");
  if (!reducedMotion && prefersFinePointer && desktopViewport) {
    document.body.classList.add("story-scroll-snap");
  }

  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  if (!hasGsap || reducedMotion) return;

  window.gsap.registerPlugin(window.ScrollTrigger);
  panels.forEach((panel) => {
    window.gsap.set(panel, { willChange: "transform, opacity" });
  });

  panels.forEach((panel, index) => {
    if (index === 0) return;
    const previousPanel = panels[index - 1];

    window.gsap.fromTo(
      panel,
      {
        autoAlpha: 0.66,
        yPercent: 5,
        scale: 0.985
      },
      {
        autoAlpha: 1,
        yPercent: 0,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top 92%",
          end: "top 44%",
          scrub: 0.85
        }
      }
    );

    window.gsap.fromTo(
      previousPanel,
      {
        autoAlpha: 1,
        scale: 1
      },
      {
        autoAlpha: 0.86,
        scale: 0.992,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          start: "top 92%",
          end: "top 44%",
          scrub: 0.85
        }
      }
    );
  });
}
