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
      "Varsta de ~13.8 miliarde ani rezulta din masuratori cosmologice (radiatia cosmica de fond, expansiunea Universului si modele cosmologice)."
  },
  {
    type: "tf",
    question: "Calea Lactee este o galaxie eliptica.",
    options: ["True", "False"],
    correctIndex: 1,
    canonical: "False",
    optionExplanations: [
      "Incorect: galaxiile eliptice nu au brate spirale bine definite.",
      "Corect: Calea Lactee este o galaxie spirala barata, cu disc si brate."
    ],
    explanation:
      "Calea Lactee are structura de disc cu bara centrala si brate spirale, deci nu este eliptica."
  },
  {
    type: "mcq",
    question: "Ce tip de galaxie este Calea Lactee?",
    options: ["Eliptica", "Spirala barata", "Neregulata", "Lenticulara pura"],
    correctIndex: 1,
    canonical: "Spirala barata",
    optionExplanations: [
      "Eliptica ar avea aspect mai omogen, fara brate spirale evidente.",
      "Spirala barata este corect: exista o bara centrala si brate spirale.",
      "Neregulata ar insemna lipsa unei structuri stabile de tip disc + brate.",
      "Lenticulara pura are proprietati diferite si, de regula, mai putina activitate in brate."
    ],
    explanation:
      "Observatiile arata clar ca Calea Lactee este o galaxie spirala barata."
  },
  {
    type: "mcq",
    question: "Cate planete are Sistemul Solar?",
    options: ["7", "8", "9", "10"],
    correctIndex: 1,
    canonical: "8",
    optionExplanations: [
      "7 este prea putin; in modelul actual sunt 8 planete.",
      "8 este corect: Mercur, Venus, Pamant, Mars, Jupiter, Saturn, Uranus, Neptun.",
      "9 nu este corect in clasificarea actuala (Pluto este planeta pitica).",
      "10 este prea mult pentru clasificarea oficiala curenta."
    ],
    explanation:
      "Uniunea Astronomica Internationala recunoaste 8 planete in Sistemul Solar."
  },
  {
    type: "text",
    question: "Ce misiune a iesit prima din heliosfera?",
    answers: ["voyager 1", "voyager", "misiunea voyager 1"],
    canonical: "Voyager 1",
    explanation:
      "Voyager 1 a trecut heliopauza in 2012, fiind prima misiune umana intrata in spatiul interstelar."
  },
  {
    type: "tf",
    question: "Soarele se afla in centrul Calei Lactee.",
    options: ["True", "False"],
    correctIndex: 1,
    canonical: "False",
    optionExplanations: [
      "Incorect: Soarele nu este in nucleul galactic.",
      "Corect: Soarele se afla in Bratul Orion, la ~26.000 ani-lumina de centru."
    ],
    explanation:
      "Pozitia noastra este periferica fata de nucleul Calei Lactee, nu centrala."
  },
  {
    type: "mcq",
    question: "Cate miliarde de stele contine aproximativ Calea Lactee?",
    options: ["10-40 miliarde", "100-400 miliarde", "1-5 trilioane", "5-10 miliarde"],
    correctIndex: 1,
    canonical: "100-400 miliarde",
    optionExplanations: [
      "Interval prea mic pentru estimarile actuale.",
      "Corect: estimarile utilizate frecvent sunt in jur de 100-400 miliarde de stele.",
      "Interval mult prea mare pentru evaluarile standard ale Calei Lactee.",
      "Interval prea mic pentru dimensiunea reala a galaxiei noastre."
    ],
    explanation:
      "Numarul exact este dificil de masurat, dar estimarea folosita didactic este ~100-400 miliarde."
  },
  {
    type: "text",
    question: "In ce brat galactic se afla Sistemul Solar?",
    answers: ["bratul orion", "orion", "orion spur", "bratul orion spur"],
    canonical: "Bratul Orion (Orion Spur)",
    explanation:
      "Sistemul Solar este in Bratul Orion, o ramura minora intre bratele Sagittarius si Perseus."
  },
  {
    type: "tf",
    question: "Voyager 1 a intrat in spatiul interstelar in 2012.",
    options: ["True", "False"],
    correctIndex: 0,
    canonical: "True",
    optionExplanations: [
      "Corect: Voyager 1 a trecut heliopauza in august 2012.",
      "Incorect: datele misiunii confirma intrarea in mediul interstelar in 2012."
    ],
    explanation:
      "Anul 2012 este un reper major pentru explorarea spatiala interstelara."
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

  function updateStatsUI() {
    const maxPoints = QUESTIONS.length;
    const answeredRatio = answeredCount / maxPoints;
    const accuracy = answeredCount ? (totalPoints / answeredCount) * 100 : 0;

    pointsLiveNode.textContent = `${formatPoints(totalPoints)} / ${maxPoints}`;
    correctLiveNode.textContent = String(exactCount);
    nearLiveNode.textContent = String(nearCount);
    wrongLiveNode.textContent = String(wrongCount);
    accuracyLiveNode.textContent = `${accuracy.toFixed(0)}%`;
    meterFillNode.style.width = `${Math.min(100, Math.max(0, answeredRatio * 100)).toFixed(1)}%`;
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
        reason: "Nu ai introdus raspuns.",
        explanation:
          `De ce e corect: ${entry.explanation || canonical}. ` +
          "De ce raspunsul tau e gresit: nu ai oferit niciun raspuns."
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
          reason: "Valoare numerica corecta.",
          explanation: `De ce e corect: ${entry.explanation || canonical}.`
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
          reason: "Valoare numerica apropiata.",
          explanation:
            `De ce e aproape: valoarea introdusa este in vecinatatea valorii corecte ${canonical}. ` +
            `De ce e corect raspunsul oficial: ${entry.explanation || canonical}.`
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
        reason: "Raspuns foarte apropiat de forma corecta.",
        explanation: `De ce e corect: ${entry.explanation || canonical}.`
      };
    }

    if (bestSimilarity >= 0.52) {
      return {
        score: SCORE_NEAR,
        verdict: "near",
        confidence: bestSimilarity,
        canonical,
        userAnswer: rawInput,
        reason: "Raspuns partial corect.",
        explanation:
          `De ce e aproape: raspunsul tau contine doar o parte din informatie. ` +
          `De ce e corect raspunsul oficial: ${entry.explanation || canonical}.`
      };
    }

    return {
      score: SCORE_WRONG,
      verdict: "wrong",
      confidence: bestSimilarity,
      canonical,
      userAnswer: rawInput,
      reason: "Raspuns incorect.",
      explanation:
        `De ce e gresit: raspunsul tau nu se potriveste cu conceptul cerut. ` +
        `De ce e corect raspunsul oficial: ${entry.explanation || canonical}.`
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
        reason: "Varianta selectata este corecta.",
        explanation: `De ce e corect: ${correctWhy || entry.explanation || canonical}.`
      };
    }

    return {
      score: SCORE_WRONG,
      verdict: "wrong",
      confidence: 0,
      canonical,
      userAnswer: selected,
      reason: "Varianta selectata este gresita.",
      explanation:
        `De ce varianta ta e gresita: ${selectedWhy || "nu corespunde faptelor prezentate."} ` +
        `De ce varianta corecta e corecta: ${correctWhy || canonical}.`
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

    const similarityPct = `${Math.round(result.confidence * 100)}%`;
    if (result.verdict === "correct") {
      feedbackNode.className = "ok";
      feedbackNode.textContent = `Corect (+1p). ${result.reason} Apasa Next.`;
    } else if (result.verdict === "near") {
      feedbackNode.className = "near";
      feedbackNode.textContent = `Aproape (+0.5p, similaritate ${similarityPct}). Raspuns corect: ${result.canonical}.`;
    } else {
      feedbackNode.className = "bad";
      feedbackNode.textContent = `Gresit (0p). ${result.reason} Raspuns corect: ${result.canonical}.`;
    }
    explanationNode.textContent = result.explanation || "";

    scoreNode.textContent = `Scor curent: ${formatPoints(totalPoints)} / ${QUESTIONS.length}`;
    updateStatsUI();
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
      reviewNode.innerHTML = "<h4>Raport final</h4><p>Excelent: nu ai avut intrebari gresite sau partiale.</p>";
      reviewNode.hidden = false;
      return;
    }

    const itemsHtml = lowScoreItems
      .map((item) => {
        const label = item.verdict === "near" ? "Aproape (0.5p)" : "Gresit (0p)";
        return `
          <article class="quiz-review-item">
            <p><strong>${escapeHtml(label)}</strong> - ${escapeHtml(item.question)}</p>
            <p><strong>Raspunsul tau:</strong> ${escapeHtml(item.userAnswer || "(fara raspuns)")}</p>
            <p><strong>Raspuns corect:</strong> ${escapeHtml(item.canonical)}</p>
            <p><strong>De ce:</strong> ${escapeHtml(item.explanation || "Explicatia nu este disponibila.")}</p>
          </article>
        `;
      })
      .join("");

    reviewNode.innerHTML = `<h4>Statistica intrebari gresite / aproape</h4>${itemsHtml}`;
    reviewNode.hidden = false;
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
    feedbackNode.textContent = "Ai finalizat quiz-ul. Verifica raportul detaliat de mai jos.";
    scoreNode.textContent =
      `Scor final: ${formatPoints(totalPoints)} / ${QUESTIONS.length}. ` +
      `Corecte: ${exactCount}, Aproape: ${nearCount}, Gresite: ${wrongCount}. ` +
      `Acuratete finala: ${finalAccuracy.toFixed(1)}%.`;

    renderReview();
  }

  function handleSubmit() {
    if (finished || currentResult) return;

    const result = evaluateCurrentQuestion();
    if (!result) {
      feedbackNode.className = "bad";
      feedbackNode.textContent = "Selecteaza o varianta inainte sa confirmi.";
      return;
    }

    if (QUESTIONS[index].type === "text" && !normalize(answerNode.value)) {
      feedbackNode.className = "bad";
      feedbackNode.textContent = "Scrie un raspuns inainte sa confirmi.";
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
