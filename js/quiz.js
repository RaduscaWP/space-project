const SCORE_EXACT = 1;
const SCORE_NEAR = 0.5;
const SCORE_WRONG = 0;

const QUESTIONS = [
  {
    type: "text",
    question: "Care este varsta aproximativa a Universului?",
    answers: ["13.8", "13,8", "13.8 miliarde ani", "13,8 miliarde ani"],
    canonical: "13.8 miliarde ani",
    numericTarget: 13.8,
    numericToleranceFull: 0.25,
    numericToleranceHalf: 1.2,
    explanation:
      "Valoarea de ~13.8 miliarde ani vine din mai multe masuratori independente: radiatia cosmica de fond, viteza de expansiune a Universului si modelele cosmologice actuale."
  },
  {
    type: "tf",
    question: "Calea Lactee este o galaxie eliptica.",
    options: ["True", "False"],
    correctIndex: 1,
    canonical: "False",
    optionExplanations: [
      "Gresit: galaxiile eliptice nu au brate spirale.",
      "Corect: Calea Lactee are disc, bara centrala si brate spirale bine definite."
    ],
    explanation:
      "Calea Lactee e o galaxie spirala barata — are bara centrala si brate spirale, nu forma ovala a celor eliptice."
  },
  {
    type: "mcq",
    question: "Ce tip de galaxie este Calea Lactee?",
    options: ["Eliptica", "Spirala barata", "Neregulata", "Lenticulara pura"],
    correctIndex: 1,
    canonical: "Spirala barata",
    optionExplanations: [
      "Eliptica ar arata mai uniform, fara brate spirale vizibile.",
      "Corect: Calea Lactee are o bara centrala si brate spirale.",
      "Neregulata ar insemna lipsa unui disc si a unor brate structurate.",
      "Lenticulara e un tip intermediar, de obicei cu mai putina activitate stelara in brate."
    ],
    explanation:
      "Observatiile arata clar ca Calea Lactee e o galaxie spirala barata — disc, bara si brate spirale."
  },
  {
    type: "mcq",
    question: "Cate planete are Sistemul Solar?",
    options: ["7", "8", "9", "10"],
    correctIndex: 1,
    canonical: "8",
    optionExplanations: [
      "Prea putin — in clasificarea actuala sunt 8 planete.",
      "Corect: Mercur, Venus, Pamant, Mars, Jupiter, Saturn, Uranus, Neptun.",
      "9 nu mai e corect — Pluto a fost retrogradat la planeta pitica in 2006.",
      "10 e prea mult pentru clasificarea oficiala."
    ],
    explanation:
      "Uniunea Astronomica Internationala recunoaste oficial 8 planete in Sistemul Solar."
  },
  {
    type: "text",
    question: "Ce misiune a iesit prima din heliosfera?",
    answers: ["voyager 1", "voyager", "misiunea voyager 1"],
    canonical: "Voyager 1",
    explanation:
      "Voyager 1 a depasit heliopauza in 2012 — prima nava construita de om care a ajuns in spatiu interstelar."
  },
  {
    type: "tf",
    question: "Soarele se afla in centrul Calei Lactee.",
    options: ["True", "False"],
    correctIndex: 1,
    canonical: "False",
    optionExplanations: [
      "Gresit: Soarele nu e in nucleul galactic.",
      "Corect: Soarele e in Bratul Orion, la vreo 26.000 ani-lumina de centru."
    ],
    explanation:
      "Suntem la periferia Calei Lactee, nu la centru — o pozitie destul de obisnuita intr-o galaxie spirala."
  },
  {
    type: "mcq",
    question: "Cate miliarde de stele contine aproximativ Calea Lactee?",
    options: ["10-40 miliarde", "100-400 miliarde", "1-5 trilioane", "5-10 miliarde"],
    correctIndex: 1,
    canonical: "100-400 miliarde",
    optionExplanations: [
      "Prea putin — estimarile actuale sunt mult mai mari.",
      "Corect: estimarile uzuale se invart in jurul a 100-400 de miliarde de stele.",
      "Prea mult — nicio evaluare serioasa nu ajunge la un trilion pentru Calea Lactee.",
      "Prea putin — galaxia noastra e mai mare de atat."
    ],
    explanation:
      "Numarul exact e greu de stabilit, dar estimarea folosita e de ~100-400 de miliarde de stele."
  },
  {
    type: "text",
    question: "In ce brat galactic se afla Sistemul Solar?",
    answers: ["bratul orion", "orion", "orion spur", "bratul orion spur"],
    canonical: "Bratul Orion (Orion Spur)",
    explanation:
      "Sistemul Solar e in Bratul Orion — o ramura minora a Calei Lactee, intre bratele Sagittarius si Perseus."
  },
  {
    type: "tf",
    question: "Voyager 1 a intrat in spatiul interstelar in 2012.",
    options: ["True", "False"],
    correctIndex: 0,
    canonical: "True",
    optionExplanations: [
      "Corect: Voyager 1 a depasit heliopauza in august 2012.",
      "Gresit: datele misiunii confirma clar intrarea in spatiu interstelar in 2012."
    ],
    explanation:
      "2012 e un moment de referinta in istoria explorarilor spatiale — prima nava care paraseste oficial Sistemul Solar."
  }
];

export function initQuiz() {
  const questionNode = document.getElementById("quiz-question");
  const progressNode = document.getElementById("quiz-progress");
  const typeNode = document.getElementById("quiz-type");
  const answerNode = document.getElementById("quiz-answer");
  const optionsNode = document.getElementById("quiz-options");
  const feedbackNode = document.getElementById("quiz-feedback");
  const explanationNode = document.getElementById("quiz-explanation");
  const scoreNode = document.getElementById("quiz-score");
  const submitButton = document.getElementById("quiz-submit");
  const nextButton = document.getElementById("quiz-next");
  const restartButton = document.getElementById("quiz-restart");
  const reviewNode = document.getElementById("quiz-review");

  const pointsLiveNode = document.getElementById("quiz-points-live");
  const correctLiveNode = document.getElementById("quiz-correct-live");
  const nearLiveNode = document.getElementById("quiz-near-live");
  const wrongLiveNode = document.getElementById("quiz-wrong-live");
  const accuracyLiveNode = document.getElementById("quiz-accuracy-live");
  const meterFillNode = document.getElementById("quiz-meter-fill");

  const requiredNodes = [
    questionNode,
    progressNode,
    typeNode,
    answerNode,
    optionsNode,
    feedbackNode,
    explanationNode,
    scoreNode,
    submitButton,
    nextButton,
    restartButton,
    reviewNode,
    pointsLiveNode,
    correctLiveNode,
    nearLiveNode,
    wrongLiveNode,
    accuracyLiveNode,
    meterFillNode
  ];
  if (requiredNodes.some((node) => !node)) return;

  let index = 0;
  let answeredCount = 0;
  let totalPoints = 0;
  let exactCount = 0;
  let nearCount = 0;
  let wrongCount = 0;
  let finished = false;
  let currentResult = null;
  let selectedOptionIndex = null;
  const attempts = [];

  function normalize(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ");
  }

  function tokenize(value) {
    return normalize(value)
      .split(/[^a-z0-9]+/)
      .map((token) => token.trim())
      .filter(Boolean);
  }

  function extractNumber(value) {
    const match = normalize(value).match(/-?\d+(?:[.,]\d+)?/);
    if (!match) return null;
    const parsed = Number(match[0].replace(",", "."));
    return Number.isFinite(parsed) ? parsed : null;
  }

  function levenshteinRatio(a, b) {
    if (a === b) return 1;
    if (!a.length || !b.length) return 0;

    const rows = a.length + 1;
    const cols = b.length + 1;
    const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

    for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
    for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

    for (let i = 1; i < rows; i += 1) {
      for (let j = 1; j < cols; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const distance = matrix[rows - 1][cols - 1];
    return 1 - distance / Math.max(a.length, b.length);
  }

  function tokenOverlapRatio(a, b) {
    const tokensA = new Set(tokenize(a));
    const tokensB = new Set(tokenize(b));
    if (!tokensA.size || !tokensB.size) return 0;

    let intersection = 0;
    tokensA.forEach((token) => {
      if (tokensB.has(token)) intersection += 1;
    });

    return intersection / Math.max(tokensA.size, tokensB.size);
  }

  function formatPoints(value) {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  function getTypeLabel(type) {
    if (type === "mcq") return "Alege varianta corecta";
    if (type === "tf") return "True / False";
    return "Text liber";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function bumpNode(node) {
    if (!node) return;
    node.classList.remove("is-stat-bump");
    void node.offsetWidth; // reflow to restart animation
    node.classList.add("is-stat-bump");
    setTimeout(() => node.classList.remove("is-stat-bump"), 320);
  }

  function updateStatsUI(bumpChanged) {
    const maxPoints = QUESTIONS.length;
    const answeredRatio = answeredCount / maxPoints;
    const accuracy = answeredCount ? (totalPoints / answeredCount) * 100 : 0;

    pointsLiveNode.textContent = `${formatPoints(totalPoints)} / ${maxPoints}`;
    correctLiveNode.textContent = String(exactCount);
    nearLiveNode.textContent = String(nearCount);
    wrongLiveNode.textContent = String(wrongCount);
    accuracyLiveNode.textContent = `${accuracy.toFixed(0)}%`;
    meterFillNode.style.width = `${Math.min(100, Math.max(0, answeredRatio * 100)).toFixed(1)}%`;

    if (bumpChanged) {
      bumpNode(pointsLiveNode);
      if (exactCount > 0 || nearCount > 0 || wrongCount > 0) {
        bumpNode(accuracyLiveNode);
      }
    }
  }

  function renderOptions(entry) {
    optionsNode.innerHTML = "";
    selectedOptionIndex = null;

    entry.options.forEach((option, optionIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => {
        if (currentResult || finished) return;
        selectedOptionIndex = optionIndex;
        optionsNode.querySelectorAll(".quiz-option").forEach((node) => node.classList.remove("is-selected"));
        button.classList.add("is-selected");
      });
      optionsNode.appendChild(button);
    });
  }

  function showQuestion() {
    const entry = QUESTIONS[index];
    questionNode.textContent = entry.question;
    progressNode.textContent = `${index + 1}/${QUESTIONS.length}`;
    typeNode.textContent = getTypeLabel(entry.type);
    feedbackNode.textContent = "";
    feedbackNode.className = "";
    explanationNode.textContent = "";
    scoreNode.textContent = `Scor curent: ${formatPoints(totalPoints)} / ${QUESTIONS.length}`;
    reviewNode.hidden = true;

    currentResult = null;
    submitButton.disabled = false;
    nextButton.disabled = true;
    nextButton.textContent = "Next";

    if (entry.type === "text") {
      optionsNode.hidden = true;
      optionsNode.innerHTML = "";
      answerNode.hidden = false;
      answerNode.disabled = false;
      answerNode.value = "";
      answerNode.placeholder = "Scrie raspunsul aici...";
      answerNode.focus();
      return;
    }

    answerNode.hidden = true;
    answerNode.disabled = true;
    answerNode.value = "";
    optionsNode.hidden = false;
    renderOptions(entry);
  }

  function evaluateText(entry, rawInput) {
    const userInput = normalize(rawInput);
    const canonical = entry.canonical || entry.answers[0];
    const normalizedAnswers = entry.answers.map((answer) => normalize(answer));

    if (!userInput) {
      return {
        score: SCORE_WRONG,
        verdict: "wrong",
        confidence: 0,
        canonical,
        userAnswer: "(fara raspuns)",
        reason: "Nu ai scris nimic.",
        explanation:
          `Raspuns corect: ${entry.explanation || canonical}. ` +
          "Nu ai introdus niciun raspuns."
      };
    }

    const numericInput = extractNumber(userInput);
    if (numericInput !== null && typeof entry.numericTarget === "number") {
      const fullTol = entry.numericToleranceFull ?? 0;
      const halfTol = entry.numericToleranceHalf ?? fullTol;
      const diff = Math.abs(numericInput - entry.numericTarget);
      if (diff <= fullTol) {
        return {
          score: SCORE_EXACT,
          verdict: "correct",
          confidence: 1,
          canonical,
          userAnswer: rawInput,
          reason: "Valoare corecta.",
          explanation: `Corect: ${entry.explanation || canonical}.`
        };
      }
      if (diff <= halfTol) {
        const conf = 1 - diff / (halfTol || 1);
        return {
          score: SCORE_NEAR,
          verdict: "near",
          confidence: Math.max(0.5, conf),
          canonical,
          userAnswer: rawInput,
          reason: "Valoare apropiata.",
          explanation:
            `Aproape — ai dat ${canonical} ca referinta. ` +
            `${entry.explanation || canonical}.`
        };
      }
    }

    let bestSimilarity = 0;
    for (const answer of normalizedAnswers) {
      const containment =
        userInput.includes(answer) || answer.includes(userInput)
          ? Math.min(userInput.length, answer.length) / Math.max(userInput.length, answer.length)
          : 0;
      const similarity = Math.max(containment, levenshteinRatio(userInput, answer), tokenOverlapRatio(userInput, answer));
      if (similarity > bestSimilarity) bestSimilarity = similarity;
    }

    if (bestSimilarity >= 0.86) {
      return {
        score: SCORE_EXACT,
        verdict: "correct",
        confidence: bestSimilarity,
        canonical,
        userAnswer: rawInput,
        reason: "Raspuns corect.",
        explanation: `${entry.explanation || canonical}.`
      };
    }

    if (bestSimilarity >= 0.52) {
      return {
        score: SCORE_NEAR,
        verdict: "near",
        confidence: bestSimilarity,
        canonical,
        userAnswer: rawInput,
        reason: "Partial corect.",
        explanation:
          `Raspunsul tau acopera doar o parte din informatie. ` +
          `${entry.explanation || canonical}.`
      };
    }

    return {
      score: SCORE_WRONG,
      verdict: "wrong",
      confidence: bestSimilarity,
      canonical,
      userAnswer: rawInput,
      reason: "Raspuns gresit.",
      explanation:
        `Raspunsul tau nu corespunde. ` +
        `${entry.explanation || canonical}.`
    };
  }

  function evaluateChoice(entry) {
    if (selectedOptionIndex === null) {
      return null;
    }

    const selected = entry.options[selectedOptionIndex];
    const canonical = entry.options[entry.correctIndex] || entry.canonical || "";
    const optionExplanations = entry.optionExplanations || [];
    const selectedWhy = optionExplanations[selectedOptionIndex] || "";
    const correctWhy = optionExplanations[entry.correctIndex] || entry.explanation || "";
    if (selectedOptionIndex === entry.correctIndex) {
      return {
        score: SCORE_EXACT,
        verdict: "correct",
        confidence: 1,
        canonical,
        userAnswer: selected,
        reason: "Varianta corecta.",
        explanation: `${correctWhy || entry.explanation || canonical}.`
      };
    }

    return {
      score: SCORE_WRONG,
      verdict: "wrong",
      confidence: 0,
      canonical,
      userAnswer: selected,
      reason: "Varianta gresita.",
      explanation:
        `${selectedWhy || "Nu corespunde faptelor."} ` +
        `Raspuns corect: ${correctWhy || canonical}.`
    };
  }

  function evaluateCurrentQuestion() {
    const entry = QUESTIONS[index];
    if (entry.type === "text") {
      return evaluateText(entry, answerNode.value);
    }
    return evaluateChoice(entry);
  }

  function applyResult(result) {
    answeredCount += 1;
    totalPoints += result.score;

    if (result.score === SCORE_EXACT) exactCount += 1;
    else if (result.score === SCORE_NEAR) nearCount += 1;
    else wrongCount += 1;

    attempts.push({
      question: QUESTIONS[index].question,
      type: QUESTIONS[index].type,
      points: result.score,
      verdict: result.verdict,
      userAnswer: result.userAnswer,
      canonical: result.canonical,
      explanation: result.explanation || ""
    });

    const quizCard = document.querySelector(".quiz-card");
    const similarityPct = `${Math.round(result.confidence * 100)}%`;
    if (result.verdict === "correct") {
      feedbackNode.className = "ok";
      feedbackNode.textContent = `Corect! (+1p) ${result.reason}`;
      if (quizCard) {
        quizCard.classList.remove("is-correct-pulse", "is-wrong-shake");
        void quizCard.offsetWidth;
        quizCard.classList.add("is-correct-pulse");
        setTimeout(() => quizCard.classList.remove("is-correct-pulse"), 500);
      }
    } else if (result.verdict === "near") {
      feedbackNode.className = "near";
      feedbackNode.textContent = `Aproape (+0.5p, ${similarityPct} similaritate). Raspuns corect: ${result.canonical}.`;
    } else {
      feedbackNode.className = "bad";
      feedbackNode.textContent = `Gresit (0p). ${result.reason} Raspuns: ${result.canonical}.`;
      if (quizCard) {
        quizCard.classList.remove("is-correct-pulse", "is-wrong-shake");
        void quizCard.offsetWidth;
        quizCard.classList.add("is-wrong-shake");
        setTimeout(() => quizCard.classList.remove("is-wrong-shake"), 400);
      }
    }
    explanationNode.textContent = result.explanation || "";

    scoreNode.textContent = `Scor curent: ${formatPoints(totalPoints)} / ${QUESTIONS.length}`;
    updateStatsUI(true);
    currentResult = result;
    submitButton.disabled = true;
    nextButton.disabled = false;
    if (index >= QUESTIONS.length - 1) {
      nextButton.textContent = "Vezi rezultatul final";
    }
  }

  function renderReview() {
    const lowScoreItems = attempts.filter((item) => item.points < SCORE_EXACT);
    if (!lowScoreItems.length) {
      reviewNode.innerHTML = "<h4>Raport final</h4><p>Excelent — niciun raspuns gresit sau partial!</p>";
      reviewNode.hidden = false;
      return;
    }

    const itemsHtml = lowScoreItems
      .map((item) => {
        const label = item.verdict === "near" ? "Aproape (0.5p)" : "Gresit (0p)";
        return `
          <article class="quiz-review-item">
            <p><strong>${escapeHtml(label)}</strong> - ${escapeHtml(item.question)}</p>
            <p><strong>Raspunsul tau:</strong> ${escapeHtml(item.userAnswer || "(nimic)")}</p>
            <p><strong>Raspuns corect:</strong> ${escapeHtml(item.canonical)}</p>
            <p><strong>Explicatie:</strong> ${escapeHtml(item.explanation || "Nu este disponibila.")}</p>
          </article>
        `;
      })
      .join("");

    reviewNode.innerHTML = `<h4>Ce ai gresit sau dat aproape</h4>${itemsHtml}`;
    reviewNode.hidden = false;
  }

  function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext("2d");
    const colors = ["#4fc3f7", "#e8d5b7", "#76f2a2", "#ffffff", "#b8e8ff"];
    const particles = Array.from({ length: 82 }, () => ({
      x: canvas.width * (0.3 + Math.random() * 0.4),
      y: canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 10,
      vy: -(Math.random() * 9 + 4),
      r: Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.22
    }));
    let frame = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.vy += 0.22;
        p.y += p.vy;
        p.rot += p.spin;
        p.alpha = Math.max(0, 1 - frame / 90);
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
        ctx.restore();
      });
      frame += 1;
      if (frame < 100) {
        requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    }
    draw();
  }

  function finishQuiz() {
    finished = true;
    progressNode.textContent = `${QUESTIONS.length}/${QUESTIONS.length}`;
    questionNode.textContent = "Quiz finalizat";
    typeNode.textContent = "Rezultate finale";
    answerNode.hidden = true;
    optionsNode.hidden = true;
    submitButton.disabled = true;
    nextButton.disabled = true;
    meterFillNode.style.width = "100%";

    const finalAccuracy = (totalPoints / QUESTIONS.length) * 100;
    feedbackNode.className = "ok";
    feedbackNode.textContent = "Gata! Verifica raportul de mai jos.";
    scoreNode.textContent =
      `Scor final: ${formatPoints(totalPoints)} / ${QUESTIONS.length}. ` +
      `Corecte: ${exactCount}, Aproape: ${nearCount}, Gresite: ${wrongCount}. ` +
      `Acuratete finala: ${finalAccuracy.toFixed(1)}%.`;

    renderReview();

    if (totalPoints / QUESTIONS.length >= 0.5) {
      setTimeout(launchConfetti, 300);
    }
  }

  function handleSubmit() {
    if (finished || currentResult) return;

    const result = evaluateCurrentQuestion();
    if (!result) {
      feedbackNode.className = "bad";
      feedbackNode.textContent = "Alege o varianta inainte sa confirmi.";
      return;
    }

    if (QUESTIONS[index].type === "text" && !normalize(answerNode.value)) {
      feedbackNode.className = "bad";
      feedbackNode.textContent = "Scrie ceva inainte sa confirmi.";
      return;
    }

    applyResult(result);
  }

  function handleNext() {
    if (finished || !currentResult) return;
    index += 1;
    if (index >= QUESTIONS.length) {
      finishQuiz();
      return;
    }
    showQuestion();
  }

  function resetQuiz() {
    index = 0;
    answeredCount = 0;
    totalPoints = 0;
    exactCount = 0;
    nearCount = 0;
    wrongCount = 0;
    finished = false;
    currentResult = null;
    selectedOptionIndex = null;
    attempts.length = 0;

    answerNode.hidden = false;
    answerNode.disabled = false;
    optionsNode.hidden = true;
    submitButton.disabled = false;
    nextButton.disabled = true;
    nextButton.textContent = "Next";
    reviewNode.hidden = true;
    reviewNode.innerHTML = "";

    updateStatsUI();
    showQuestion();
  }

  submitButton.addEventListener("click", handleSubmit);
  nextButton.addEventListener("click", handleNext);
  restartButton.addEventListener("click", resetQuiz);
  answerNode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  });

  updateStatsUI();
  showQuestion();
}
