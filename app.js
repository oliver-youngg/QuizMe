const STORAGE_KEY = "quizme-v1";
const starterSets = window.QUIZME_STARTER_SETS;
const starterDeckSizes = {
  "biology-basics": 22,
  "psychology-101": 20,
  "world-history": 21,
  "anatomy-physiology": 22,
  "web-development": 20,
  "us-history": 22,
  chemistry: 20,
  statistics: 21,
  microeconomics: 20,
  "environmental-science": 22,
  sociology: 20,
  philosophy: 20,
  "linear-algebra": 22,
  "computer-science": 21,
  "art-history": 20,
  "algebra-functions": 22,
  "geometry-trigonometry": 22
};
const starterSources = {
  "biology-basics": {
    title: "OpenStax Biology 2e, review questions",
    url: "https://openstax.org/books/biology/pages/4-review-questions",
    license: "CC BY-NC-SA 4.0"
  },
  "psychology-101": {
    title: "OpenStax Psychology 2e, review questions",
    url: "https://openstax.org/books/psychology-2e/pages/5-review-questions",
    license: "CC BY-NC-SA 4.0"
  },
  "world-history": {
    title: "OpenStax World History, Volume 1",
    url: "https://openstax.org/books/world-history-volume-1/pages/6-4-the-roman-republic",
    license: "CC BY-NC-SA 4.0"
  },
  "anatomy-physiology": {
    title: "OpenStax Anatomy & Physiology 2e, chapter reviews",
    url: "https://openstax.org/books/anatomy-and-physiology-2e/pages/1-chapter-review",
    license: "CC BY-NC-SA 4.0"
  },
  "web-development": {
    title: "MDN Learn web development",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
    license: "CC BY-SA 2.5"
  },
  "us-history": {
    title: "OpenStax U.S. History, review questions",
    url: "https://openstax.org/books/us-history/pages/8-review-questions",
    license: "CC BY-NC-SA 4.0"
  },
  chemistry: {
    title: "OpenStax Chemistry 2e, exercises",
    url: "https://openstax.org/books/chemistry-2e/pages/18-exercises",
    license: "CC BY-NC-SA 4.0"
  },
  statistics: {
    title: "OpenStax Introductory Statistics, chapter review",
    url: "https://openstax.org/books/introductory-statistics/pages/1-chapter-review",
    license: "CC BY-NC-SA 4.0"
  },
  microeconomics: {
    title: "OpenStax Principles of Microeconomics 3e, review questions",
    url: "https://openstax.org/books/principles-microeconomics-3e/pages/3-review-questions",
    license: "CC BY-NC-SA 4.0"
  },
  "environmental-science": {
    title: "Introduction to Environmental Sciences and Sustainability",
    url: "https://openfl.pressbooks.pub/enviroscience/front-matter/introduction/",
    license: "CC BY 4.0"
  },
  sociology: {
    title: "OpenStax Introduction to Sociology 2e, section quizzes",
    url: "https://openstax.org/books/introduction-sociology-2e/pages/1-section-quiz",
    license: "CC BY-NC-SA 4.0"
  },
  philosophy: {
    title: "OpenStax Introduction to Philosophy, review questions",
    url: "https://openstax.org/books/introduction-philosophy/pages/1-review-questions",
    license: "CC BY-NC-SA 4.0"
  },
  "linear-algebra": {
    title: "A First Course in Linear Algebra, Ken Kuttler",
    url: "https://open.umn.edu/opentextbooks/textbooks/213",
    license: "CC BY 4.0"
  },
  "computer-science": {
    title: "OpenStax Introduction to Computer Science, review questions",
    url: "https://openstax.org/books/introduction-computer-science/pages/11-review-questions",
    license: "CC BY-NC-SA 4.0"
  },
  "art-history": {
    title: "Introduction to Art: Design, Context, and Meaning",
    url: "https://open.umn.edu/opentextbooks/textbooks/374",
    license: "CC BY-SA"
  },
  "algebra-functions": {
    title: "OpenStax College Algebra 2e, practice test",
    url: "https://openstax.org/books/college-algebra-2e/pages/4-practice-test",
    license: "CC BY-NC-SA 4.0"
  },
  "geometry-trigonometry": {
    title: "OpenStax Algebra and Trigonometry, chapter exercises",
    url: "https://openstax.org/books/algebra-and-trigonometry/pages/1-review-exercises",
    license: "CC BY-NC-SA 4.0"
  }
};
starterSets.forEach((set) => {
  const extra = (window.QUIZME_STARTER_EXTRAS?.[set.id] || []).map(([q, a]) => ({ q, a }));
  set.cards = [...set.cards, ...extra].slice(0, starterDeckSizes[set.id] || 20);
  set.source = starterSources[set.id];
  set.quizQuestions = set.cards
    .map((card, index) => {
      const choices = [card.a, ...set.cards.filter((_, i) => i !== index).map((other) => other.a)]
        .filter((answer, i, list) => answer && list.indexOf(answer) === i)
        .slice(0, 4);
      return choices.length === 4 ? { q: card.q, choices, correct: card.a } : null;
    })
    .filter(Boolean);
});
let state = loadState();
let currentView = "welcome";
let study = null;
let toastTimer;
let freeFlightBestScore = 0;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.sets)) {
      const oldGameSessions = (saved.studyHistory || []).filter((entry) => entry.mode === "Concept Match").length;
      const clean = {
        sets: saved.sets,
        knownCards: saved.knownCards || {},
        stats: {
          sessions: Math.max(0, (saved.stats?.sessions || 0) - oldGameSessions),
          answered: saved.stats?.answered || 0
        },
        recent: (saved.recent || []).filter((entry) => entry.mode !== "Concept Match"),
        studyHistory: (saved.studyHistory || []).filter((entry) => entry.mode !== "Concept Match"),
        reviewQueue: saved.reviewQueue || []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      const starterIds = new Set(starterSets.map((s) => s.id));
      return {
        ...clean,
        sets: [
          ...starterSets.map((s) => ({ ...s, cards: s.cards.map((c) => ({ ...c })) })),
          ...clean.sets.filter((s) => !starterIds.has(s.id))
        ]
      };
    }
  } catch (e) {}
  return {
    sets: starterSets.map((s) => ({ ...s, cards: s.cards.map((c) => ({ ...c })) })),
    knownCards: {},
    stats: { sessions: 0, answered: 0 },
    recent: [],
    studyHistory: [],
    reviewQueue: []
  };
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}
function iconColor(set) {
  return set.color || "blue";
}
function setIcon(set) {
  return `<span class="subject-icon ${iconColor(set)}">${esc(set.icon || "✦")}</span>`;
}
function navigate(view) {
  currentView = view;
  study = null;
  render();
}
function render() {
  document.getElementById("crumb-current").textContent = study
    ? study.mode === "results"
      ? "Session complete"
      : study.mode === "quiz"
        ? "Practice quiz"
        : study.mode === "game"
          ? study.game?.sandbox
            ? "Free Flight"
            : "Sky Quiz"
          : "Flashcards"
    : currentView === "library"
      ? "My study sets"
      : currentView === "create"
        ? "Create a study set"
        : "Home";
  document
    .querySelectorAll(".nav-item")
    .forEach((b) => b.classList.toggle("active", b.dataset.view === currentView && !study));
  document.body.classList.toggle("welcome-screen", !study && currentView === "welcome");
  renderSidebar();
  const content = document.getElementById("content");
  if (study) {
    content.innerHTML =
      study.mode === "results"
        ? renderResults()
        : study.mode === "flash"
          ? renderFlash()
          : study.mode === "flashDone"
            ? renderFlashComplete()
            : study.mode === "game"
              ? renderGame()
              : study.mode === "guide"
                ? renderGuide()
                : renderQuiz();
    bindStudy();
    return;
  }
  content.innerHTML =
    currentView === "welcome"
      ? renderWelcome()
      : currentView === "library"
        ? renderLibrary()
        : currentView === "create"
          ? renderBuilder()
          : renderHome();
  bindPage();
}
function renderWelcome() {
  return `<div class="welcome-page"><header class="welcome-nav"><a class="welcome-brand" href="#welcome" aria-label="QuizMe home"><span class="brand-mark">Q</span><span>Quiz<span class="brand-light">Me</span></span></a><button class="text-btn" id="welcome-dashboard">Go to dashboard&nbsp; →</button></header><section class="welcome-hero"><div class="welcome-hero-copy"><div class="eyebrow">A CALMER WAY TO STUDY</div><h1>Make learning<br><em>stick.</em></h1><p>Build a study set from what you’re learning, practice it in the way that works for you, and keep track of what still needs attention.</p><div class="welcome-hero-actions"><button class="primary-btn" id="welcome-start">Start learning&nbsp; →</button><button class="welcome-secondary" id="welcome-how">See how it works</button></div><div class="welcome-proof"><span>Flashcards</span><i>·</i><span>Practice quizzes</span><i>·</i><span>Sky Quiz</span></div></div><div class="welcome-illustration" aria-hidden="true"><div class="welcome-orbit orbit-one"></div><div class="welcome-orbit orbit-two"></div><div class="welcome-book"><div class="book-mark">Q</div><div class="book-rule"></div><div class="book-rule short"></div><div class="book-rule"></div><div class="book-rule tiny"></div><span class="book-spark">✦</span></div><div class="welcome-note note-top">One topic at a time</div><div class="welcome-note note-bottom">Progress you can feel</div></div></section><footer class="welcome-footer"><span>Made for steady progress.</span><button class="text-btn" id="welcome-dashboard-bottom">Go to dashboard&nbsp; →</button></footer></div>`;
}
function showWelcomeHowModal() {
  const root = document.getElementById("modal-root");
  root.innerHTML = `<div class="overlay welcome-how-overlay" id="welcome-how-overlay"><section class="modal welcome-how-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-how-title"><div class="modal-head"><div><div class="eyebrow">HOW QUIZME WORKS</div><h2 id="welcome-how-title">Your next study session, made simple.</h2><p>Choose a starting point. You can change your study mode any time.</p></div><button class="close-btn" id="close-welcome-how" type="button" aria-label="Close">×</button></div><div class="welcome-how-list"><article><span>01</span><div><h3>Choose or create a set</h3><p>Start with one of the topic sets, bring in notes, or make your own flashcards and questions.</p></div></article><article><span>02</span><div><h3>Practice your way</h3><p>Flip cards, take a 10-question quiz, read a study guide, or play Sky Quiz.</p></div></article><article><span>03</span><div><h3>Focus on what’s next</h3><p>Mark cards you know and spend your review time on the topics that need another look.</p></div></article></div><div class="modal-actions"><button class="primary-btn" id="welcome-how-done" type="button">Got it</button></div></section></div>`;
  const close = () => {
    root.innerHTML = "";
    document.removeEventListener("keydown", onKeyDown);
  };
  const onKeyDown = (e) => {
    if (e.key === "Escape") close();
  };
  document.getElementById("close-welcome-how").onclick = close;
  document.getElementById("welcome-how-done").onclick = close;
  document.getElementById("welcome-how-overlay").onclick = (e) => {
    if (e.target.id === "welcome-how-overlay") close();
  };
  document.addEventListener("keydown", onKeyDown);
  document.getElementById("close-welcome-how").focus();
}

function renderSidebar() {
  document.getElementById("side-sets").innerHTML = state.sets
    .slice(0, 5)
    .map((s) => `<button class="side-set" data-set="${esc(s.id)}">${esc(s.title)}</button>`)
    .join("");
  document.querySelectorAll(".side-set").forEach((b) => (b.onclick = () => openSet(b.dataset.set)));
}
function renderHome() {
  const recent = state.recent
    .slice(0, 3)
    .map((r) => {
      const s = state.sets.find((x) => x.id === r.id);
      return s
        ? `<div class="recent-row">${setIcon(s)}<div class="recent-info"><strong>${esc(s.title)}</strong><span>${esc(r.mode)} · ${esc(r.when)}</span></div><button class="text-btn" data-open="${esc(s.id)}">Study →</button></div>`
        : "";
    })
    .join("");
  return `<section class="welcome-row"><div><div class="eyebrow">YOUR STUDY SPACE</div><h1>Welcome</h1><p>A little progress today goes a long way. What would you like to learn?</p></div><button class="primary-btn" id="create-set"><span class="plus">＋</span>Create a study set</button></section>
  <section class="home-actions"><button class="secondary-btn" id="upload-notes">↑ &nbsp;Upload notes</button><button class="secondary-btn" id="explore-topics">⌕ &nbsp;Explore topics</button></section>
  <section class="dashboard-grid"><div class="hero-card"><div class="hero-copy"><div class="eyebrow">YOUR NEXT STUDY SESSION</div><h2>Turn a few minutes into real progress.</h2><p>Pick up where you left off or choose a set to start fresh.</p><button class="primary-btn hero-btn" id="browse-sets">Browse study sets&nbsp; →</button></div><div class="hero-art"><div class="art-card back"><div class="art-line"></div><div class="art-line"></div><div class="art-line"></div></div><div class="art-card front"><span class="art-spark">✦</span><div class="art-line"></div><div class="art-line"></div></div></div></div>
  <div class="stat-card"><div class="stat-top"><span>Your learning journey</span><span class="stat-icon">↗</span></div><div><div class="stat-number">${state.stats.sessions}</div><div class="stat-foot">study sessions completed</div></div><div class="stat-foot"><span>${state.stats.answered}</span> questions answered so far</div></div></section>
  <section><div class="section-head"><h2>Pick up a study set</h2><button class="text-btn" id="view-all">View all&nbsp; →</button></div><div class="sets-grid">${state.sets.slice(0, 3).map(setCard).join("") || emptySets()}</div></section>
  <section><div class="section-head"><h2>Recently studied</h2><small>Your activity stays on this device</small></div><div class="recent-list">${recent || `<div class="quiz-empty">Your recent sessions will appear here after you study.</div>`}</div></section>`;
}
function setCard(s) {
  const cardCount = s.cards?.length || 0,
    quizCount = s.quizQuestions?.length || 0,
    label =
      [cardCount ? `${cardCount} cards` : "", quizCount ? `${quizCount} quiz questions` : ""]
        .filter(Boolean)
        .join(" · ") || "Study set";
  return `<article class="set-card" data-open="${esc(s.id)}"><div class="set-card-top">${setIcon(s)}<span class="more">···</span></div><h3>${esc(s.title)}</h3><p>${esc(s.subject || "Study set")}</p><div class="set-card-bottom"><span class="card-count">▤ &nbsp;${esc(label)}</span><span class="mini-link">Study set&nbsp; →</span></div></article>`;
}
function emptySets() {
  return `<div class="empty-card"><strong>Your study space starts here</strong>Create a set from your class notes, then practice at your own pace.<br><br><button class="primary-btn" id="create-empty">＋ Create your first set</button></div>`;
}
function renderLibrary() {
  return `<section class="page-heading"><div class="eyebrow">YOUR COLLECTION</div><h1>My study sets</h1><p>All your study material, ready when you are.</p><div class="library-tools"><input class="search-input" id="search" placeholder="⌕  Search study sets" aria-label="Search study sets"><button class="primary-btn" id="create-set">＋ New study set</button></div></section><div class="sets-grid" id="library-grid">${state.sets.map(setCard).join("") || emptySets()}</div>`;
}
function bindPage() {
  document.getElementById("welcome-dashboard")?.addEventListener("click", () => navigate("home"));
  document.getElementById("welcome-dashboard-bottom")?.addEventListener("click", () => navigate("home"));
  document.getElementById("welcome-start")?.addEventListener("click", () => navigate("library"));
  document.getElementById("welcome-how")?.addEventListener("click", showWelcomeHowModal);
  document.getElementById("create-set")?.addEventListener("click", showCreateModal);
  document.getElementById("side-add").onclick = showCreateModal;
  document.getElementById("browse-sets")?.addEventListener("click", () => navigate("library"));
  document.getElementById("view-all")?.addEventListener("click", () => navigate("library"));
  document.getElementById("create-empty")?.addEventListener("click", showCreateModal);
  document.getElementById("explore-topics")?.addEventListener("click", () => navigate("library"));
  document.getElementById("upload-notes")?.addEventListener("click", uploadNotes);
  document
    .querySelectorAll(".builder-home")
    .forEach((button) => button.addEventListener("click", () => navigate("home")));
  document
    .querySelectorAll("[data-builder-tab]")
    .forEach((button) => button.addEventListener("click", () => switchBuilderTab(button.dataset.builderTab)));
  document.getElementById("add-card")?.addEventListener("click", () => {
    addBuilderCard();
    document.querySelector(".builder-card-row:last-child input")?.focus();
  });
  document.getElementById("add-quiz-question")?.addEventListener("click", () => {
    addBuilderQuizQuestion();
    document.querySelector(".builder-quiz-row:last-child .quiz-prompt")?.focus();
  });
  document.getElementById("generate-guide")?.addEventListener("click", generateGuide);
  document.getElementById("builder-form")?.addEventListener("submit", saveBuilderSet);
  document.querySelectorAll(".remove-card").forEach((button) =>
    button.addEventListener("click", () => {
      button.closest(".builder-card-row").remove();
      updateBuilderCount();
    })
  );
  document.querySelectorAll(".remove-quiz-question").forEach((button) =>
    button.addEventListener("click", () => {
      button.closest(".builder-quiz-row").remove();
      updateBuilderQuizCount();
    })
  );
  document
    .querySelectorAll("[data-open]")
    .forEach((el) => el.addEventListener("click", () => openSet(el.dataset.open)));
  document.getElementById("search")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    document.getElementById("library-grid").innerHTML =
      state.sets
        .filter((s) => (s.title + " " + s.subject).toLowerCase().includes(q))
        .map(setCard)
        .join("") || `<div class="empty-card">No study sets match “${esc(q)}”.</div>`;
    document
      .querySelectorAll("#library-grid [data-open]")
      .forEach((el) => (el.onclick = () => openSet(el.dataset.open)));
  });
}
function uploadNotes() {
  const picker = document.createElement("input");
  picker.type = "file";
  picker.accept = ".txt,.md,text/plain,text/markdown";
  picker.setAttribute("aria-label", "Choose a text file of study cards");
  picker.onchange = () => {
    const file = picker.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      navigate("create");
      document.getElementById("builder-title").value = file.name.replace(/\.(txt|md)$/i, "");
      const rows = String(reader.result || "")
        .split("\n")
        .map((line) => line.split("|"))
        .filter((pair) => pair.length >= 2 && pair[0].trim() && pair.slice(1).join("|").trim())
        .map((pair) => ({ q: pair[0].trim(), a: pair.slice(1).join("|").trim() }));
      if (rows.length) {
        document.getElementById("builder-cards").innerHTML = "";
        rows.forEach((card) => addBuilderCard(card));
        showToast(`${rows.length} cards imported. Review them before saving.`);
      } else showToast("No prompt | answer rows found. Add cards in the builder.");
    };
    reader.onerror = () => showToast("That file could not be read. Try a plain text or Markdown file.");
    reader.readAsText(file);
  };
  picker.click();
}
function showCreateModal() {
  navigate("create");
}
function renderBuilder() {
  return `<div class="builder-page"><button class="back-link builder-back builder-home" type="button">← &nbsp;Back to home</button><div class="builder-heading"><div><div class="eyebrow">STUDY SET BUILDER</div><h1>Build your next study session</h1><p>Create flashcards, a standalone practice quiz, or both. Quiz questions can also power Sky Quiz.</p></div><button class="secondary-btn" id="upload-notes" type="button">↑ &nbsp;Import notes</button></div><form id="builder-form"><div class="builder-meta"><div class="field"><label for="builder-title">Study set name</label><input id="builder-title" required maxlength="60" placeholder="e.g. Organic Chemistry: Reactions"></div><div class="field"><label for="builder-subject">Subject</label><input id="builder-subject" maxlength="30" placeholder="e.g. Chemistry"></div></div><div class="builder-workspace"><aside class="builder-tools"><div class="tool-label">CREATE WITH THIS SET</div><button class="builder-tab active" type="button" data-builder-tab="flashcards"><span>▤</span><span><strong>Flashcards</strong><small>Optional review cards</small></span></button><button class="builder-tab" type="button" data-builder-tab="quiz"><span>☑</span><span><strong>Practice quiz</strong><small>Independent questions</small></span></button><button class="builder-tab" type="button" data-builder-tab="guide"><span>✎</span><span><strong>Study guide</strong><small>Summarize key ideas</small></span></button><div class="tool-note">A quiz can have its own questions and answers without flashcards.</div></aside><div class="builder-panel"><section class="builder-section" data-builder-panel="flashcards"><div class="panel-heading"><div><h2>Flashcards</h2><p>Optional: add prompts and answers to review separately from your quiz.</p></div><span class="panel-count" id="builder-count">2 cards</span></div><div class="card-editor-head"><span>FRONT · PROMPT</span><span>BACK · ANSWER</span></div><div id="builder-cards">${builderCardRow()}${builderCardRow()}</div><button class="add-card-btn" type="button" id="add-card">＋ Add another card</button></section><section class="builder-section hidden" data-builder-panel="quiz"><div class="panel-heading"><div><h2>Practice quiz and Sky Quiz</h2><p>Write a question, four choices, and mark the correct choice. Add at least 10 questions to make a quiz.</p></div><span class="panel-count" id="builder-quiz-count">2 questions</span></div><div id="builder-quiz-questions">${builderQuizQuestionRow(0)}${builderQuizQuestionRow(1)}</div><button class="add-card-btn" type="button" id="add-quiz-question">＋ Add a quiz question</button><div class="quiz-fixed-count" style="margin-top:14px"><strong>Standalone question bank</strong><span>Sky Quiz can use these questions even if you leave the flashcard section empty.</span></div></section><section class="builder-section hidden" data-builder-panel="guide"><div class="panel-heading"><div><h2>Study guide</h2><p>Make a concise review sheet from your flashcards, then add your own notes.</p></div></div><div class="guide-callout">✦ &nbsp;Generate a starting guide from flashcards, or write your own notes.</div><div class="field"><label for="guide-content">Your study guide</label><textarea id="guide-content" class="guide-textarea" placeholder="Add definitions, examples, formulas, or connections you want to remember."></textarea></div><button type="button" class="secondary-btn" id="generate-guide">✦ &nbsp;Generate from flashcards</button></section><div class="builder-footer"><button type="button" class="text-btn builder-home">Cancel</button><button type="submit" class="primary-btn">Save study set&nbsp; →</button></div></div></div></form></div>`;
}
function builderCardRow(card = { q: "", a: "" }) {
  return `<div class="builder-card-row"><label><span class="sr-only">Card prompt</span><textarea class="card-prompt" placeholder="Write a question or key term">${esc(card.q || "")}</textarea></label><label><span class="sr-only">Card answer</span><textarea class="card-answer" placeholder="Write the answer or explanation">${esc(card.a || "")}</textarea></label><button type="button" class="remove-card" aria-label="Remove card">×</button></div>`;
}
function builderQuizQuestionRow(index, question = {}) {
  const choices = question.choices || [];
  return `<div class="builder-quiz-row"><div class="quiz-row-heading"><strong>Question ${index + 1}</strong><button type="button" class="remove-card remove-quiz-question" aria-label="Remove quiz question">×</button></div><label><span class="sr-only">Quiz question</span><textarea class="quiz-prompt" placeholder="Write the question">${esc(question.q || "")}</textarea></label><div class="quiz-choice-fields">${[0, 1, 2, 3].map((i) => `<label><span>${"ABCD"[i]}</span><input class="quiz-choice" data-choice="${i}" placeholder="Answer choice ${"ABCD"[i]}" value="${esc(choices[i] || "")}"></label>`).join("")}</div><label class="quiz-correct-label">Correct answer<select class="quiz-correct-answer">${[0, 1, 2, 3].map((i) => `<option value="${i}" ${Number(question.correctIndex || 0) === i ? "selected" : ""}>${"ABCD"[i]}</option>`).join("")}</select></label></div>`;
}
function addBuilderQuizQuestion(question = {}) {
  const root = document.getElementById("builder-quiz-questions"),
    index = root.querySelectorAll(".builder-quiz-row").length;
  root.insertAdjacentHTML("beforeend", builderQuizQuestionRow(index, question));
  root.querySelectorAll(".remove-quiz-question").forEach(
    (button) =>
      (button.onclick = () => {
        button.closest(".builder-quiz-row").remove();
        updateBuilderQuizCount();
      })
  );
  updateBuilderQuizCount();
}
function addBuilderCard(card = { q: "", a: "" }) {
  document.getElementById("builder-cards").insertAdjacentHTML("beforeend", builderCardRow(card));
  document.querySelectorAll(".remove-card").forEach(
    (button) =>
      (button.onclick = () => {
        button.closest(".builder-card-row").remove();
        updateBuilderCount();
      })
  );
  updateBuilderCount();
}
function switchBuilderTab(tab) {
  document
    .querySelectorAll("[data-builder-tab]")
    .forEach((button) => button.classList.toggle("active", button.dataset.builderTab === tab));
  document
    .querySelectorAll("[data-builder-panel]")
    .forEach((panel) => panel.classList.toggle("hidden", panel.dataset.builderPanel !== tab));
}
function updateBuilderCount() {
  const n = document.querySelectorAll(".builder-card-row").length;
  const label = document.getElementById("builder-count");
  if (label) label.textContent = `${n} ${n === 1 ? "card" : "cards"}`;
}
function updateBuilderQuizCount() {
  const n = document.querySelectorAll(".builder-quiz-row").length,
    label = document.getElementById("builder-quiz-count");
  if (label) label.textContent = `${n} ${n === 1 ? "question" : "questions"}`;
}
function generateGuide() {
  const cards = [...document.querySelectorAll(".builder-card-row")]
    .map((row) => ({
      q: row.querySelector(".card-prompt").value.trim(),
      a: row.querySelector(".card-answer").value.trim()
    }))
    .filter((card) => card.q && card.a);
  if (!cards.length) {
    showToast("Add a few flashcards first, then generate your guide.");
    return;
  }
  document.getElementById("guide-content").value = cards
    .map((card, index) => `${index + 1}. ${card.q}\n${card.a}`)
    .join("\n\n");
  showToast("Study guide drafted from your cards. Edit it to make it yours.");
}
function saveBuilderSet(event) {
  event.preventDefault();
  const title = document.getElementById("builder-title").value.trim(),
    subject = document.getElementById("builder-subject").value.trim() || "My study set";
  const cards = [...document.querySelectorAll(".builder-card-row")]
    .map((row) => ({
      q: row.querySelector(".card-prompt").value.trim(),
      a: row.querySelector(".card-answer").value.trim()
    }))
    .filter((card) => card.q && card.a);
  const rows = [...document.querySelectorAll(".builder-quiz-row")],
    quizQuestions = [],
    partial = rows.some((row) => {
      const q = row.querySelector(".quiz-prompt").value.trim(),
        choices = [...row.querySelectorAll(".quiz-choice")].map((input) => input.value.trim()),
        hasAny = q || choices.some(Boolean);
      if (!hasAny) return false;
      const correctIndex = Number(row.querySelector(".quiz-correct-answer").value);
      if (!q || choices.some((choice) => !choice) || new Set(choices).size < 4) return true;
      quizQuestions.push({ q, choices, correct: choices[correctIndex] });
      return false;
    });
  if (partial) {
    showToast("Finish each quiz question and give it four different answer choices.");
    switchBuilderTab("quiz");
    return;
  }
  if (quizQuestions.length > 0 && quizQuestions.length < 10) {
    showToast("Add at least 10 complete quiz questions, or remove the quiz questions to use flashcards for your quiz.");
    switchBuilderTab("quiz");
    return;
  }
  if (cards.length < 2 && quizQuestions.length < 10) {
    showToast("Add at least two flashcards or 10 quiz questions before saving.");
    switchBuilderTab(quizQuestions.length ? "quiz" : "flashcards");
    return;
  }
  const colors = ["violet", "mint", "amber", "blue"];
  state.sets.unshift({
    id: "set-" + Date.now(),
    title,
    subject,
    icon: "✦",
    color: colors[Math.floor(Math.random() * colors.length)],
    cards,
    quizQuestions,
    guide: document.getElementById("guide-content").value.trim(),
    quizSettings: { shuffle: true }
  });
  saveState();
  currentView = "library";
  render();
  showToast("Study set saved. Choose a mode to start learning.");
}
function openSet(id) {
  const set = state.sets.find((s) => s.id === id);
  if (!set) return;
  study = { setId: id, mode: "choose" };
  renderModeChoice();
}
function renderModeChoice() {
  const s = state.sets.find((x) => x.id === study.setId),
    cards = s.cards || [],
    independent = s.quizQuestions || [],
    quizAvailable = independent.length >= 10 || cards.length >= 10,
    gameAvailable = independent.length > 0 || cards.length > 0,
    root = document.getElementById("modal-root"),
    total = independent.length || cards.length;
  root.innerHTML = `<div class="overlay" id="overlay"><div class="modal"><div class="modal-head"><div><h2>Ready to study?</h2><p>${esc(s.title)} · ${total} ${independent.length ? "quiz questions" : "cards"}</p></div><button class="close-btn" id="close-modal">×</button></div><p style="color:#68738a;font-size:12px;margin:0 0 16px">Choose a study mode to get started.</p><div style="display:grid;gap:10px">${cards.length ? `<button class="answer-option" id="start-flash">${setIcon(s)} <span><strong>Flashcards</strong><br><small>Review each card at your own pace</small></span></button>` : ""}${quizAvailable ? `<button class="answer-option" id="start-quiz">${setIcon(s)} <span><strong>Practice quiz</strong><br><small>Take 10 questions from this set</small></span></button>` : ""}${gameAvailable ? `<button class="answer-option" id="start-game">${setIcon(s)} <span><strong>Sky Quiz</strong><br><small>Every quiz question can be played without flashcards</small></span></button>` : ""}${s.guide ? `<button class="answer-option" id="start-guide">${setIcon(s)} <span><strong>Study guide</strong><br><small>Read your saved review notes</small></span></button>` : ""}</div></div></div>`;
  const close = () => {
    root.innerHTML = "";
    study = null;
  };
  document.getElementById("close-modal").onclick = close;
  document.getElementById("overlay").onclick = (e) => {
    if (e.target.id === "overlay") close();
  };
  document.getElementById("start-flash")?.addEventListener("click", () => beginStudy("flash"));
  document.getElementById("start-quiz")?.addEventListener("click", () => beginStudy("quiz"));
  document.getElementById("start-game")?.addEventListener("click", () => beginStudy("game"));
  document.getElementById("start-guide")?.addEventListener("click", () => beginStudy("guide"));
}
function shuffledIndexes(count) {
  return Array.from({ length: count }, (_, index) => index).sort(() => Math.random() - 0.5);
}
function beginStudy(mode) {
  const setId = study.setId,
    set = state.sets.find((item) => item.id === setId),
    cards = set.cards || [],
    independent = set.quizQuestions || [],
    hasIndependent = independent.length > 0;
  if (mode === "flash") {
    const known = state.knownCards?.[setId] || [],
      available = cards.filter((card) => !known.includes(card.q));
    document.getElementById("modal-root").innerHTML = "";
    study = { setId, mode: available.length ? "flash" : "flashDone", flashCards: available, index: 0, flipped: false };
    render();
    return;
  }
  if ((mode === "quiz" || mode === "game") && isMathSet(set)) {
    const mathAnswers = hasIndependent ? independent.map((question) => question.correct) : cards.map((card) => card.a);
    if (mathAnswers.some((answer) => !isNumericAnswer(answer))) {
      showToast("Math set answers need to be numbers before starting a quiz or game.");
      return;
    }
  }
  let quizQuestions = [],
    selectedQuizCards = [];
  if (mode === "quiz") {
    if (hasIndependent) {
      if (independent.length < 10) {
        showToast("Add at least 10 quiz questions before starting a practice quiz.");
        return;
      }
      let entries = [...independent];
      if (set.quizSettings?.shuffle !== false) entries = entries.sort(() => Math.random() - 0.5);
      quizQuestions = entries.slice(0, 10);
    } else {
      if (cards.length < 10) {
        showToast("Add at least 10 flashcards or 10 quiz questions before starting a practice quiz.");
        return;
      }
      let entries = [...cards];
      if (set.quizSettings?.shuffle !== false) entries = entries.sort(() => Math.random() - 0.5);
      selectedQuizCards = entries.slice(0, 10);
      const quizSet = { ...set, cards: selectedQuizCards };
      if (quizSet.cards.some((card) => quizDistractors(quizSet, card).length < 3)) {
        showToast("Add more cards with distinct answers so every question has four choices.");
        return;
      }
    }
  }
  document.getElementById("modal-root").innerHTML = "";
  study = { setId, mode, index: 0, flipped: false, selected: null, answers: [] };
  if (mode === "quiz") {
    if (hasIndependent) study.quizQuestions = quizQuestions;
    else study.quizCards = selectedQuizCards;
  }
  if (mode === "game") {
    const total = hasIndependent ? independent.length : cards.length;
    study.game = {
      sandbox: false,
      remaining: 15,
      score: 0,
      correctTotal: 0,
      questionsAnswered: 0,
      questionsTotal: total,
      questionOpen: false,
      ended: false,
      pipeGap: 132,
      pipes: [],
      birdY: 165,
      climbing: false,
      deck: shuffledIndexes(total),
      frame: 0,
      lastTime: null
    };
  }
  render();
}
function openFreeFlight() {
  if (study?.mode === "game") {
    cancelAnimationFrame(study.game.frame);
    study.game.releaseControls?.();
  }
  document.getElementById("modal-root").innerHTML = "";
  study = {
    setId: state.sets[0].id,
    mode: "game",
    game: {
      sandbox: true,
      remaining: null,
      score: 0,
      bestScore: freeFlightBestScore,
      deaths: 0,
      consecutiveDeaths: 0,
      questionOpen: false,
      ended: false,
      paused: false,
      pipeGap: 132,
      pipes: [],
      birdY: 165,
      climbing: false,
      deck: [],
      frame: 0,
      lastTime: null
    }
  };
  render();
}
function currentSet() {
  return state.sets.find((s) => s.id === study.setId);
}
function renderStudyHeader(s) {
  const description =
    study.mode === "flash"
      ? "Flip each card, then mark it known or needing more work."
      : study.mode === "flashDone"
        ? "Your known cards are saved for next time."
        : study.mode === "game"
          ? "Fly through each obstacle, then answer a question to earn more time."
          : "Choose the best answer for each question.";
  return `<div class="study-toolbar"><button class="back-link" id="leave-study">← &nbsp;Back to sets</button><span style="color:#9aa2b1;font-size:11px">${esc(s.subject || "Study set")}</span></div><div class="study-title"><h1>${esc(s.title)}</h1><p>${description}</p>${s.source ? `<small class="source-credit">Topic reference: <a href="${esc(s.source.url)}" target="_blank" rel="noopener noreferrer">${esc(s.source.title)}</a> · ${esc(s.source.license)}</small>` : ""}</div>`;
}
function renderGame() {
  const sandbox = study.game.sandbox,
    heading = sandbox
      ? `<div class="study-toolbar"><button class="back-link" id="leave-study">← &nbsp;Back to study space</button><span style="color:#9aa2b1;font-size:11px">SANDBOX</span></div><div class="study-title"><h1>Free Flight</h1><p>Practice flying at your own pace. No timer and no questions.</p></div>`
      : renderStudyHeader(currentSet());
  const hud = sandbox
    ? `<div><span class="flight-label">FREE FLIGHT</span><strong>No timer · no questions</strong></div><div><span class="flight-label">OBSTACLES CLEARED</span><strong id="flight-score">0</strong></div><div><span class="flight-label">BEST THIS SESSION</span><strong id="flight-best">${freeFlightBestScore}</strong></div>`
    : `<div><span class="flight-label">TIME</span><strong id="flight-time">15s</strong></div><div><span class="flight-label">QUESTIONS</span><strong id="flight-score">0 / ${study.game.questionsTotal}</strong></div><div><span class="flight-label">TIME BONUS</span><strong>+5s per correct answer</strong></div>`;
  return `<div class="study-main">${heading}<section class="flight-shell"><div class="flight-hud ${sandbox ? "sandbox-hud" : ""}">${hud}</div><div class="flight-canvas-wrap"><canvas id="flight-canvas" width="720" height="360" tabindex="0" aria-label="${sandbox ? "Free Flight" : "Sky Quiz"} wave course. Hold Space, Arrow Up, or the control button to rise; release to descend."></canvas><div id="flight-question" class="flight-question hidden" role="dialog" aria-modal="true" aria-labelledby="flight-question-text"></div><div id="flight-countdown" class="flight-countdown hidden" role="status" aria-live="assertive">3</div><div id="flight-over" class="flight-over hidden" role="status"></div></div><div class="flight-controls"><span>Hold <kbd>Space</kbd> or <kbd>↑</kbd>, or hold the button to rise. Release to descend.</span><button id="flap-button" class="primary-btn" type="button">Hold to rise&nbsp; ↑</button></div></section></div>`;
}
function renderFlash() {
  const s = currentSet(),
    cards = study.flashCards,
    card = cards[study.index],
    n = study.index + 1;
  return `<div class="study-main">${renderStudyHeader(s)}<div class="progress-row"><span>Card ${n} of ${cards.length} · ${cards.length - (state.knownCards?.[s.id] || []).length} left to learn</span><span>${Math.round((n / cards.length) * 100)}% this round</span></div><div class="progress-track"><div class="progress-fill" style="width:${(n / cards.length) * 100}%"></div></div><div class="flashcard" id="flip-card" role="button" tabindex="0" aria-label="Flip flashcard"><span class="flashcard-label">${study.flipped ? "ANSWER" : "QUESTION"}</span><div class="flashcard-text">${esc(study.flipped ? card.a : card.q)}</div><span class="flip-hint">↻ &nbsp;Click to flip</span></div><div class="flash-actions flash-rating-actions"><button class="secondary-btn" id="flip-button">↻ &nbsp;Flip card</button><button class="secondary-btn" id="mark-review">Needs more work</button><button class="primary-btn" id="mark-known">Know it&nbsp; ✓</button></div><p class="flash-rating-hint">Known cards are saved and skipped in future sessions. Cards marked for more work return next time.</p></div>`;
}
function renderFlashComplete() {
  const s = currentSet(),
    known = state.knownCards?.[s.id] || [];
  return `<div class="study-main">${renderStudyHeader(s)}<div class="results-card flash-complete"><div class="result-ring" style="--score-angle:280deg"><div class="result-ring-inner">✓</div></div><h2>That’s your review for now.</h2><p>${known.length === s.cards.length ? "You marked every card as known." : `You reviewed all ${study.flashCards.length} cards that still needed practice.`} Known cards will stay out of your next flashcard session.</p><div class="result-actions"><button class="secondary-btn" id="reset-known">Reset known cards</button><button class="primary-btn" id="leave-flash">Back to study modes&nbsp; →</button></div></div></div>`;
}

function isMathSet(set) {
  return /\b(math|mathematics|algebra|geometry|trigonometry|statistics|linear algebra)\b/i.test(
    `${set.id || ""} ${set.subject || ""} ${set.title || ""}`
  );
}
function isNumericAnswer(answer) {
  return /^[-−]?\d+(?:\.\d+)?(?:\s*,\s*[-−]?\d+(?:\.\d+)?)*$/.test(String(answer || "").trim());
}
function quizDistractors(set, card) {
  const options = [...(card.d || []), ...set.cards.filter((other) => other !== card).map((other) => other.a)].filter(
    (answer) => answer && answer !== card.a
  );
  return [...new Set(isMathSet(set) ? options.filter(isNumericAnswer) : options)];
}
function quizQuestion(s, index) {
  const card = s.cards[index];
  const others = quizDistractors(s, card)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const choices = [card.a, ...others].sort(() => Math.random() - 0.5);
  return { prompt: card.q, correct: card.a, choices };
}
function ensureQuestion() {
  if (study.questions) return;
  if (study.quizQuestions) {
    study.questions = study.quizQuestions.map((question) => ({
      prompt: question.q,
      correct: question.correct,
      choices: question.choices
    }));
    return;
  }
  const set = currentSet(),
    cards = study.quizCards || set.cards;
  study.questions = cards.map((_, i) => quizQuestion({ ...set, cards }, i));
}
function renderQuiz() {
  const s = currentSet();
  ensureQuestion();
  const total = study.questions.length,
    q = study.questions[study.index],
    selected = study.selected;
  const answered = selected !== null;
  return `<div class="study-main">${renderStudyHeader(s)}<div class="progress-row"><span>Question ${study.index + 1} of ${total}</span><span>${Math.round(((study.index + 1) / total) * 100)}% complete</span></div><div class="progress-track"><div class="progress-fill" style="width:${((study.index + 1) / total) * 100}%"></div></div><div class="quiz-card"><div class="question-kicker">CHOOSE YOUR ANSWER</div><div class="question-text">${esc(q.prompt)}</div><div class="answers">${q.choices
    .map((choice, i) => {
      let cls = "";
      if (answered && choice === q.correct) cls = "correct";
      else if (answered && i === selected && choice !== q.correct) cls = "wrong";
      else if (answered && i === selected) cls = "selected";
      return `<button class="answer-option ${cls}" data-answer="${i}" ${answered ? "disabled" : ""}><span class="answer-letter">${"ABCD"[i]}</span>${esc(choice)}</button>`;
    })
    .join(
      ""
    )}</div>${answered ? `<div class="feedback ${q.choices[selected] === q.correct ? "good" : "bad"}"><strong>${q.choices[selected] === q.correct ? "That's right!" : "Not quite."}</strong> ${q.choices[selected] === q.correct ? "Nice work remembering that." : `The answer is: ${esc(q.correct)}`}</div>` : ""}<div class="quiz-actions"><button class="secondary-btn" id="skip-question" ${answered ? "disabled" : ""}>Skip question</button><button class="primary-btn" id="next-question" ${!answered ? "disabled" : ""}>${study.index === total - 1 ? "See results" : "Next question"}&nbsp; →</button></div></div></div>`;
}
function renderGuide() {
  const s = currentSet();
  return `<div class="study-main"><div class="study-toolbar"><button class="back-link" id="back-to-modes">← &nbsp;Back to study modes</button>${setIcon(s)}</div><div class="study-title"><div class="eyebrow">STUDY GUIDE</div><h1>${esc(s.title)}</h1><p>Your saved notes for this study set.</p></div><article class="saved-guide">${esc(s.guide || "No guide has been added yet.")}</article></div>`;
}
function bindStudy() {
  document.getElementById("leave-study")?.addEventListener("click", () => {
    if (study?.mode === "game") {
      cancelAnimationFrame(study.game.frame);
      study.game.releaseControls?.();
    }
    study = null;
    render();
  });
  document.getElementById("back-to-modes")?.addEventListener("click", () => {
    study.mode = "choose";
    renderModeChoice();
  });
  if (study.mode === "flash") {
    const flip = () => {
      study.flipped = !study.flipped;
      render();
    };
    document.getElementById("flip-card").onclick = flip;
    document.getElementById("flip-card").onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flip();
      }
    };
    document.getElementById("flip-button").onclick = flip;
    document.getElementById("mark-known").onclick = () => rateFlashcard(true);
    document.getElementById("mark-review").onclick = () => rateFlashcard(false);
  } else if (study.mode === "flashDone") {
    document.getElementById("leave-flash").onclick = () => {
      study.mode = "choose";
      renderModeChoice();
    };
    document.getElementById("reset-known").onclick = () => {
      state.knownCards[study.setId] = [];
      saveState();
      beginStudy("flash");
    };
  } else if (study.mode === "quiz") {
    document.querySelectorAll("[data-answer]").forEach(
      (b) =>
        (b.onclick = () => {
          study.selected = Number(b.dataset.answer);
          render();
        })
    );
    document.getElementById("skip-question").onclick = () => {
      const q = study.questions[study.index];
      study.answers.push({ skip: true, prompt: q.prompt, correctAnswer: q.correct });
      if (study.index === study.questions.length - 1) {
        finishQuiz();
        return;
      }
      moveQuestion();
    };
    document.getElementById("next-question").onclick = () => {
      const q = study.questions[study.index],
        correct = q.choices[study.selected] === q.correct;
      study.answers.push({ correct, prompt: q.prompt, answer: q.choices[study.selected], correctAnswer: q.correct });
      state.stats.answered++;
      if (study.index === study.questions.length - 1) {
        finishQuiz();
        return;
      }
      moveQuestion();
    };
  } else if (study.mode === "game") startFlightGame();
}
function flightQuestionFor(index) {
  const set = currentSet();
  if (set.quizQuestions?.length) {
    const question = set.quizQuestions[index];
    return { prompt: question.q, correct: question.correct, choices: question.choices.slice() };
  }
  const cards = set.cards,
    card = cards[index],
    wrong = isMathSet(set)
      ? cards
          .filter((_, i) => i !== index)
          .map((other) => other.a)
          .filter(isNumericAnswer)
      : [
          ...(card.d || []),
          ...cards.filter((_, i) => i !== index).map((other) => other.a),
          ...cards.filter((_, i) => i !== index).map((other) => other.q)
        ],
    choices = [...new Set(wrong.filter((choice) => choice && choice !== card.a))].slice(0, 3);
  return { prompt: card.q, correct: card.a, choices: [card.a, ...choices].sort(() => Math.random() - 0.5) };
}
function startFlightGame() {
  const session = study,
    game = session.game,
    canvas = document.getElementById("flight-canvas"),
    ctx = canvas.getContext("2d"),
    button = document.getElementById("flap-button"),
    width = canvas.width,
    height = canvas.height,
    birdX = 165,
    ground = height - 24;
  game.pipes = [
    game.sandbox ? makeSandboxObstacle(540, game.score) : { x: 540, gapY: 175, gap: 132, passed: false, width: 70 }
  ];
  const rise = () => {
      if (study === session && !game.questionOpen && !game.ended && !game.paused) game.climbing = true;
    },
    fall = () => {
      game.climbing = false;
    };
  const down = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!game.paused && !game.questionOpen && !game.ended) pauseForEscape();
        return;
      }
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        rise();
      }
    },
    up = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") fall();
    },
    pointerDown = (e) => {
      e.preventDefault();
      rise();
    },
    pointerUp = () => fall();
  window.addEventListener("keydown", down);
  window.addEventListener("keyup", up);
  window.addEventListener("blur", fall);
  canvas.addEventListener("pointerdown", pointerDown);
  button.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointercancel", pointerUp);
  game.releaseControls = () => {
    fall();
    window.removeEventListener("keydown", down);
    window.removeEventListener("keyup", up);
    window.removeEventListener("blur", fall);
    canvas.removeEventListener("pointerdown", pointerDown);
    button.removeEventListener("pointerdown", pointerDown);
    window.removeEventListener("pointerup", pointerUp);
    window.removeEventListener("pointercancel", pointerUp);
  };
  canvas.focus();
  const subject = (currentSet().subject || currentSet().title || "").toLowerCase();
  const theme = subject.includes("history")
    ? {
        sky: ["#e8ded0", "#c9b89f"],
        ground: "#897255",
        accent: "#9b754d",
        deep: "#68513c",
        light: "#d4b78e",
        motif: "CLASSICAL ARCHIVES",
        symbol: "⌂"
      }
    : subject.includes("biology") ||
        subject.includes("anatomy") ||
        subject.includes("environment") ||
        subject.includes("chemistry")
      ? {
          sky: ["#d8eee6", "#b4d4c7"],
          ground: "#557d71",
          accent: "#4e9781",
          deep: "#326c60",
          light: "#a8d6bd",
          motif: "LIVING SYSTEMS",
          symbol: "✣"
        }
      : subject.includes("math") ||
          subject.includes("algebra") ||
          subject.includes("geometry") ||
          subject.includes("statistics")
        ? {
            sky: ["#e2e7f4", "#b9c9df"],
            ground: "#576d8d",
            accent: "#6887b4",
            deep: "#415674",
            light: "#bdd4ef",
            motif: "GEOMETRY LAB",
            symbol: "△"
          }
        : subject.includes("computer") || subject.includes("website") || subject.includes("web")
          ? {
              sky: ["#d8ebed", "#a9cdd1"],
              ground: "#426a70",
              accent: "#4b9393",
              deep: "#2f5c63",
              light: "#a3d6d3",
              motif: "DIGITAL CIRCUITS",
              symbol: "⌘"
            }
          : subject.includes("psych") || subject.includes("sociology") || subject.includes("philosophy")
            ? {
                sky: ["#e7e0ee", "#c8bed5"],
                ground: "#6e5d7b",
                accent: "#957ca4",
                deep: "#5e4d70",
                light: "#d7c5df",
                motif: "IDEAS IN MOTION",
                symbol: "◎"
              }
            : subject.includes("art") || subject.includes("literature")
              ? {
                  sky: ["#f0e1d4", "#ddc4ae"],
                  ground: "#8b6656",
                  accent: "#ba8461",
                  deep: "#765448",
                  light: "#e5b995",
                  motif: "CREATIVE GALLERY",
                  symbol: "▧"
                }
              : {
                  sky: ["#e9e4d8", "#d5cbb6"],
                  ground: "#776e58",
                  accent: "#ac9564",
                  deep: "#665a45",
                  light: "#e2d2a6",
                  motif: "STUDY HALL",
                  symbol: "✦"
                };
  game.waveAngle = game.waveAngle ?? 0;
  game.trail = game.trail || [];
  game.distance = game.distance || 0;
  function makeSandboxTunnel(x, score) {
    const styles = [
      [150, 110, 110, 110, 150, 190, 190, 190, 150, 110, 110, 150],
      [190, 190, 150, 110, 110, 150, 190, 230, 230, 190, 150, 150],
      [110, 150, 190, 190, 150, 110, 110, 150, 190, 230, 230, 190],
      [230, 190, 150, 150, 190, 230, 230, 190, 150, 110, 110, 150],
      [150, 150, 190, 230, 230, 190, 150, 110, 110, 150, 190, 190],
      [110, 110, 150, 190, 230, 230, 190, 150, 110, 110, 150, 190],
      [190, 150, 110, 110, 150, 190, 230, 230, 190, 150, 110, 110],
      [150, 190, 230, 230, 190, 150, 110, 110, 150, 190, 230, 230]
    ];
    const style = Math.floor(Math.random() * styles.length),
      gap = Math.max(136, 158 - Math.min(score, 10) * 1.5),
      step = 40,
      segmentWidth = 40,
      centers = styles[style];
    return {
      type: "tunnel",
      style,
      x,
      width: (centers.length - 1) * step + segmentWidth,
      passed: false,
      segments: centers.map((gapY, index) => ({ offset: index * step, width: segmentWidth, gapY, gap }))
    };
  }
  function makeSandboxObstacle(x, score) {
    if (Math.random() < 0.3) return makeSandboxTunnel(x, score);
    const gap = Math.max(160, 190 - Math.min(score, 12) * 2.5);
    return { x, gapY: 98 + Math.random() * 138, gap, passed: false, width: 70 };
  }
  function tunnelWalls(pipe) {
    const segments = pipe.segments,
      last = segments[segments.length - 1],
      endX = pipe.x + pipe.width,
      top = (segment) => segment.gapY - segment.gap / 2,
      bottom = (segment) => segment.gapY + segment.gap / 2,
      upper = [
        { x: pipe.x, y: 0 },
        { x: endX, y: 0 },
        { x: endX, y: top(last) }
      ],
      lower = [
        { x: pipe.x, y: ground },
        { x: endX, y: ground },
        { x: endX, y: bottom(last) }
      ];
    for (let i = segments.length - 1; i >= 0; i--) {
      upper.push({ x: pipe.x + segments[i].offset, y: top(segments[i]) });
      lower.push({ x: pipe.x + segments[i].offset, y: bottom(segments[i]) });
    }
    return [upper, lower];
  }
  function playerPolygon() {
    const angle = game.waveAngle,
      cos = Math.cos(angle),
      sin = Math.sin(angle);
    return [
      [-11, -4],
      [5, -4],
      [15, 0],
      [5, 4],
      [-11, 4]
    ].map(([x, y]) => {
      x *= 0.8;
      y *= 0.8;
      return { x: birdX + x * cos - y * sin, y: game.birdY + x * sin + y * cos };
    });
  }
  function onSegment(point, a, b) {
    const cross = (point.y - a.y) * (b.x - a.x) - (point.x - a.x) * (b.y - a.y);
    if (Math.abs(cross) > 1e-7) return false;
    return (
      point.x >= Math.min(a.x, b.x) - 1e-7 &&
      point.x <= Math.max(a.x, b.x) + 1e-7 &&
      point.y >= Math.min(a.y, b.y) - 1e-7 &&
      point.y <= Math.max(a.y, b.y) + 1e-7
    );
  }
  function edgesIntersect(a, b, c, d) {
    const orient = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x),
      o1 = orient(a, b, c),
      o2 = orient(a, b, d),
      o3 = orient(c, d, a),
      o4 = orient(c, d, b);
    if (((o1 > 0 && o2 < 0) || (o1 < 0 && o2 > 0)) && ((o3 > 0 && o4 < 0) || (o3 < 0 && o4 > 0))) return true;
    return (
      (Math.abs(o1) < 1e-7 && onSegment(c, a, b)) ||
      (Math.abs(o2) < 1e-7 && onSegment(d, a, b)) ||
      (Math.abs(o3) < 1e-7 && onSegment(a, c, d)) ||
      (Math.abs(o4) < 1e-7 && onSegment(b, c, d))
    );
  }
  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[i],
        b = polygon[j];
      if (onSegment(point, a, b)) return true;
      if (a.y > point.y !== b.y > point.y && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x)
        inside = !inside;
    }
    return inside;
  }
  function polygonsTouch(a, b) {
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < b.length; j++)
        if (edgesIntersect(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length])) return true;
    return pointInPolygon(a[0], b) || pointInPolygon(b[0], a);
  }
  function tunnelContact(pipe) {
    const arrow = playerPolygon();
    return tunnelWalls(pipe).some((wall) => polygonsTouch(arrow, wall));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, theme.sky[0]);
    sky.addColorStop(1, theme.sky[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = theme.light;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = theme.ground;
    ctx.fillRect(0, ground, width, 24);
    ctx.fillStyle = theme.light;
    ctx.fillRect(0, ground, width, 3);
    game.pipes.forEach((pipe) => {
      if (pipe.type === "tunnel") {
        const segments = pipe.segments,
          last = segments[segments.length - 1],
          endX = pipe.x + pipe.width,
          topAt = (segment) => segment.gapY - segment.gap / 2,
          bottomAt = (segment) => segment.gapY + segment.gap / 2;
        ctx.fillStyle = theme.deep;
        ctx.beginPath();
        ctx.moveTo(pipe.x, 0);
        ctx.lineTo(endX, 0);
        ctx.lineTo(endX, topAt(last));
        for (let i = segments.length - 1; i >= 0; i--) ctx.lineTo(pipe.x + segments[i].offset, topAt(segments[i]));
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(pipe.x, ground);
        ctx.lineTo(endX, ground);
        ctx.lineTo(endX, bottomAt(last));
        for (let i = segments.length - 1; i >= 0; i--) ctx.lineTo(pipe.x + segments[i].offset, bottomAt(segments[i]));
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = theme.accent;
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pipe.x, topAt(segments[0]));
        segments.forEach((segment) => ctx.lineTo(pipe.x + segment.offset, topAt(segment)));
        ctx.lineTo(endX, topAt(last));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pipe.x, bottomAt(segments[0]));
        segments.forEach((segment) => ctx.lineTo(pipe.x + segment.offset, bottomAt(segment)));
        ctx.lineTo(endX, bottomAt(last));
        ctx.stroke();
        ctx.strokeStyle = theme.light;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pipe.x, topAt(segments[0]));
        segments.forEach((segment) => ctx.lineTo(pipe.x + segment.offset, topAt(segment)));
        ctx.lineTo(endX, topAt(last));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pipe.x, bottomAt(segments[0]));
        segments.forEach((segment) => ctx.lineTo(pipe.x + segment.offset, bottomAt(segment)));
        ctx.lineTo(endX, bottomAt(last));
        ctx.stroke();
        return;
      }
      const gapSize = pipe.gap || game.pipeGap,
        topH = pipe.gapY - gapSize / 2,
        bottomY = pipe.gapY + gapSize / 2;
      ctx.fillStyle = theme.deep;
      ctx.fillRect(pipe.x, 0, 70, topH);
      ctx.fillRect(pipe.x, bottomY, 70, ground - bottomY);
      ctx.fillStyle = theme.accent;
      ctx.fillRect(pipe.x + 5, 0, 60, Math.max(0, topH - 2));
      ctx.fillRect(pipe.x + 5, bottomY + 2, 60, Math.max(0, ground - bottomY - 2));
      ctx.fillStyle = theme.light;
      ctx.fillRect(pipe.x + 10, 0, 2, Math.max(0, topH - 16));
      ctx.fillRect(pipe.x + 10, bottomY + 16, 2, Math.max(0, ground - bottomY - 16));
      for (let sx = pipe.x; sx < pipe.x + 70; sx += 24) {
        ctx.fillStyle = theme.light;
        ctx.beginPath();
        ctx.moveTo(sx, topH - 1);
        ctx.lineTo(sx + 10, topH + 9);
        ctx.lineTo(sx + 20, topH - 1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = theme.deep;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = theme.light;
        ctx.beginPath();
        ctx.moveTo(sx, bottomY + 1);
        ctx.lineTo(sx + 10, bottomY - 9);
        ctx.lineTo(sx + 20, bottomY + 1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = theme.deep;
        ctx.stroke();
      }
      ctx.fillStyle = theme.light;
      ctx.font = "700 15px DM Sans, sans-serif";
      ctx.textAlign = "center";
      if (topH > 56) ctx.fillText(theme.symbol, pipe.x + 35, topH - 28);
      if (ground - bottomY > 56) ctx.fillText(theme.symbol, pipe.x + 35, bottomY + 42);
    });
    const stamp = performance.now();
    game.trail = game.trail.filter((point) => stamp - point.t < 640);
    for (let i = 1; i < game.trail.length; i++) {
      const a = game.trail[i - 1],
        b = game.trail[i],
        fade = 1 - (stamp - b.t) / 640;
      ctx.globalAlpha = Math.max(0, fade * 0.78);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.1 + fade * 1.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(birdX - (game.distance - a.distance), a.y);
      ctx.lineTo(birdX - (game.distance - b.distance), b.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(birdX, game.birdY);
    ctx.rotate(game.waveAngle);
    ctx.scale(0.8, 0.8);
    ctx.fillStyle = "#c58a42";
    ctx.beginPath();
    ctx.moveTo(-11, -4);
    ctx.lineTo(5, -4);
    ctx.lineTo(15, 0);
    ctx.lineTo(5, 4);
    ctx.lineTo(-11, 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#61482d";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#f1ce79";
    ctx.fillRect(-8, -2.1, 12, 4.2);
    ctx.fillStyle = "#dc9879";
    ctx.fillRect(-12, -4, 3, 8);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(9, -2.5);
    ctx.lineTo(15, 0);
    ctx.lineTo(9, 2.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = theme.deep;
    ctx.font = "700 14px DM Sans, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(game.sandbox ? "FREE FLIGHT" : "SKY QUIZ", 18, 26);
    ctx.font = "600 10px DM Sans, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(theme.motif, width - 18, 26);
    ctx.textAlign = "left";
  }
  function endGame(reason) {
    if (game.ended) return;
    game.ended = true;
    game.releaseControls();
    cancelAnimationFrame(game.frame);
    if (!game.sandbox) {
      recordStudySession("Sky Quiz");
      addRecent("Sky Quiz");
      saveState();
    }
    const panel = document.getElementById("flight-over"),
      complete = reason === "complete";
    panel.innerHTML = `<div class="flight-over-card"><span class="flight-label">${complete ? "SET COMPLETE" : "FLIGHT OVER"}</span><h2>${complete ? "You finished the set!" : reason === "time" ? "Time is up!" : "Watch out!"}</h2><p>${complete ? `You answered all <strong>${game.questionsTotal}</strong> questions. You got <strong>${game.correctTotal}</strong> correct.` : `You cleared <strong>${game.score}</strong> obstacles and answered <strong>${game.correctTotal}</strong> questions correctly.`}</p><div class="result-actions"><button class="secondary-btn" id="leave-flight">Back to sets</button><button class="primary-btn" id="play-flight-again">Play again&nbsp; →</button></div></div>`;
    panel.classList.remove("hidden");
    document.getElementById("leave-flight").onclick = () => {
      study = null;
      render();
    };
    document.getElementById("play-flight-again").onclick = () => beginStudy("game");
  }
  function pauseForEscape() {
    game.paused = true;
    fall();
    cancelAnimationFrame(game.frame);
    const panel = document.getElementById("flight-over");
    panel.innerHTML = `<div class="flight-over-card"><span class="flight-label">GAME PAUSED</span><h2>Take a breather.</h2><p>Your flight timer is paused. Resume when you’re ready; a 3-second countdown will give you time to prepare.</p><div class="result-actions"><button class="secondary-btn" id="leave-paused-game">Leave game</button><button class="primary-btn" id="resume-paused-game">Resume&nbsp; →</button></div></div>`;
    panel.classList.remove("hidden");
    document.getElementById("resume-paused-game").onclick = resumeAfterPause;
    document.getElementById("resume-paused-game").focus();
    document.getElementById("leave-paused-game").onclick = () => {
      game.releaseControls();
      study = null;
      render();
    };
  }
  function resumeAfterPause() {
    const panel = document.getElementById("flight-over"),
      countdown = document.getElementById("flight-countdown");
    panel.classList.add("hidden");
    let value = 3;
    countdown.classList.remove("hidden");
    const tick = () => {
      if (study !== session || game.ended) return;
      if (value === 0) {
        countdown.classList.add("hidden");
        game.paused = false;
        game.lastTime = null;
        canvas.focus();
        game.frame = requestAnimationFrame(step);
        return;
      }
      countdown.textContent = value;
      countdown.setAttribute("aria-label", `Resuming in ${value}`);
      value--;
      setTimeout(tick, 1000);
    };
    tick();
  }
  function pauseSandbox() {
    game.paused = true;
    fall();
    cancelAnimationFrame(game.frame);
    const panel = document.getElementById("flight-over");
    panel.innerHTML = `<div class="flight-over-card"><span class="flight-label">FREE FLIGHT PAUSED</span><h2>Ten crashes in a row!</h2><p>Would you like to keep practicing?</p><div class="result-actions"><button class="secondary-btn" id="stop-free-flight">Leave game</button><button class="primary-btn" id="continue-free-flight">Continue playing</button></div></div>`;
    panel.classList.remove("hidden");
    document.getElementById("stop-free-flight").onclick = () => {
      game.releaseControls();
      study = null;
      render();
    };
    document.getElementById("continue-free-flight").onclick = () => {
      game.consecutiveDeaths = 0;
      game.score = 0;
      game.pipes = [makeSandboxObstacle(width + 150, game.score)];
      game.birdY = height / 2;
      game.paused = false;
      game.lastTime = null;
      document.getElementById("flight-score").textContent = "0";
      document.getElementById("flight-over").classList.add("hidden");
      canvas.focus();
      game.frame = requestAnimationFrame(step);
    };
  }
  function askQuestion() {
    game.questionOpen = true;
    game.climbing = false;
    button.disabled = true;
    if (!game.deck.length) {
      endGame("complete");
      return;
    }
    const cardIndex = game.deck.shift(),
      question = flightQuestionFor(cardIndex),
      panel = document.getElementById("flight-question");
    panel.innerHTML = `<div class="flight-question-card"><span class="question-kicker">OBSTACLE CLEARED · TIME PAUSED · QUESTION ${game.questionsAnswered + 1} OF ${game.questionsTotal}</span><div id="flight-question-text" class="question-text">${esc(question.prompt)}</div><div class="answers">${question.choices.map((choice, i) => `<button class="answer-option" data-flight-answer="${i}"><span class="answer-letter">${"ABCD"[i]}</span>${esc(choice)}</button>`).join("")}</div><div id="flight-feedback" aria-live="polite"></div></div>`;
    panel.classList.remove("hidden");
    panel.querySelector("[data-flight-answer]")?.focus();
    panel.querySelectorAll("[data-flight-answer]").forEach(
      (answerButton) =>
        (answerButton.onclick = () => {
          if (!game.questionOpen || answerButton.disabled) return;
          const correct = question.choices[Number(answerButton.dataset.flightAnswer)] === question.correct;
          state.stats.answered++;
          game.questionsAnswered++;
          document.getElementById("flight-score").textContent = `${game.questionsAnswered} / ${game.questionsTotal}`;
          if (correct) {
            game.correctTotal++;
            game.remaining += 5;
          }
          panel.querySelectorAll("[data-flight-answer]").forEach((option) => {
            option.disabled = true;
            if (question.choices[Number(option.dataset.flightAnswer)] === question.correct)
              option.classList.add("correct");
            else if (option === answerButton) option.classList.add("wrong");
          });
          document.getElementById("flight-feedback").innerHTML =
            `<div class="feedback ${correct ? "good" : "bad"}"><strong>${correct ? "Correct! +5 seconds" : "Not quite."}</strong> ${correct ? "Your flight timer is extended." : `The answer is: ${esc(question.correct)}. Your timer resumes without a bonus.`}</div>`;
          document.getElementById("flight-time").textContent = `${Math.ceil(game.remaining)}s`;
          setTimeout(() => {
            if (study !== session || game.ended) return;
            panel.classList.add("hidden");
            panel.innerHTML = "";
            if (game.questionsAnswered >= game.questionsTotal) {
              endGame("complete");
              return;
            }
            const countdown = document.getElementById("flight-countdown");
            let value = 3;
            countdown.classList.remove("hidden");
            const tick = () => {
              if (study !== session || game.ended) return;
              if (value === 0) {
                countdown.classList.add("hidden");
                game.questionOpen = false;
                game.lastTime = null;
                button.disabled = false;
                canvas.focus();
                return;
              }
              countdown.textContent = value;
              countdown.setAttribute("aria-label", `Resuming in ${value}`);
              value--;
              setTimeout(tick, 700);
            };
            tick();
          }, 650);
        })
    );
  }
  function step(timestamp) {
    if (study !== session || game.ended || game.paused) return;
    const dt = game.lastTime === null ? 0 : Math.min(0.05, (timestamp - game.lastTime) / 1000);
    game.lastTime = timestamp;
    if (!game.questionOpen) {
      if (!game.sandbox) game.remaining = Math.max(0, game.remaining - dt);
      const pace = game.sandbox
        ? 190 + 180 * (1 - Math.exp(-game.score / 24))
        : 185 + 125 * (game.score / Math.max(1, game.questionsTotal));
      const verticalPace = game.sandbox ? pace : 185;
      const waveAngle = Math.atan2(verticalPace, pace);
      const targetAngle = game.climbing ? -waveAngle : waveAngle;
      game.waveAngle += (targetAngle - game.waveAngle) * Math.min(1, dt * 12);
      game.distance += pace * dt;
      game.birdY += (game.climbing ? -verticalPace : verticalPace) * dt;
      game.trail.push({ distance: game.distance, y: game.birdY, t: timestamp });
      game.trail = game.trail.filter((point) => timestamp - point.t < 640);
      game.pipes.forEach((pipe) => (pipe.x -= pace * dt));
      const lastObstacle = game.pipes[game.pipes.length - 1];
      if (lastObstacle.x < 390) {
        if (game.sandbox) {
          const spacing = Math.max(306, 390 - Math.min(game.score, 12) * 7),
            nextX =
              lastObstacle.type === "tunnel" ? lastObstacle.x + lastObstacle.width + 80 : lastObstacle.x + spacing;
          game.pipes.push(makeSandboxObstacle(nextX, game.score));
        } else {
          const gapSize = Math.max(88, 132 - Math.min(game.score, 11) * 4),
            spacing = Math.max(265, 350 - Math.min(game.score, 12) * 7);
          game.pipes.push({
            x: lastObstacle.x + spacing,
            gapY: 80 + Math.random() * 175,
            gap: gapSize,
            passed: false,
            width: 70
          });
        }
      }
      const collision =
        game.birdY < 5 ||
        game.birdY > ground - 5 ||
        game.pipes.some((pipe) => {
          if (pipe.type === "tunnel") return tunnelContact(pipe);
          const obstacleWidth = pipe.width || 70;
          return (
            birdX + 6 > pipe.x &&
            birdX - 6 < pipe.x + obstacleWidth &&
            (game.birdY - 4 < pipe.gapY - (pipe.gap || game.pipeGap) / 2 + 10 ||
              game.birdY + 4 > pipe.gapY + (pipe.gap || game.pipeGap) / 2 - 10)
          );
        });
      if (collision && game.sandbox) {
        game.deaths++;
        game.consecutiveDeaths++;
        game.score = 0;
        game.birdY = height / 2;
        game.climbing = false;
        game.trail = [];
        game.distance = 0;
        game.pipes = [makeSandboxObstacle(width + 150, game.score)];
        document.getElementById("flight-score").textContent = "0";
        if (game.consecutiveDeaths >= 10) {
          draw();
          pauseSandbox();
          return;
        }
      } else if (collision || (!game.sandbox && game.remaining <= 0)) {
        draw();
        endGame(game.remaining <= 0 ? "time" : "collision");
        return;
      }
      for (const pipe of game.pipes) {
        if (!pipe.passed && pipe.x + (pipe.width || 70) < birdX) {
          pipe.passed = true;
          game.score++;
          if (game.sandbox) {
            game.consecutiveDeaths = 0;
            freeFlightBestScore = Math.max(freeFlightBestScore, game.score);
            game.bestScore = freeFlightBestScore;
            document.getElementById("flight-score").textContent = game.score;
            document.getElementById("flight-best").textContent = freeFlightBestScore;
          } else {
            document.getElementById("flight-score").textContent = `${game.questionsAnswered} / ${game.questionsTotal}`;
            askQuestion();
            break;
          }
        }
      }
      game.pipes = game.pipes.filter((pipe) => pipe.x + (pipe.width || 70) > -10);
    }
    draw();
    if (!game.sandbox) document.getElementById("flight-time").textContent = `${Math.ceil(game.remaining)}s`;
    game.frame = requestAnimationFrame(step);
  }
  +draw();
  game.frame = requestAnimationFrame(step);
}

function moveQuestion() {
  if (study.index < study.questions.length - 1) {
    study.index++;
    study.selected = null;
    render();
  }
}
function recordStudySession(mode) {
  const now = new Date();
  state.stats.sessions++;
  state.studyHistory.unshift({ date: now.toISOString(), setId: study.setId, mode });
  state.studyHistory = state.studyHistory.slice(0, 180);
}
function rateFlashcard(known) {
  const set = currentSet(),
    card = study.flashCards[study.index];
  if (known) {
    state.knownCards = state.knownCards || {};
    state.knownCards[set.id] = state.knownCards[set.id] || [];
    if (!state.knownCards[set.id].includes(card.q)) state.knownCards[set.id].push(card.q);
    saveState();
  }
  if (study.index < study.flashCards.length - 1) {
    study.index++;
    study.flipped = false;
    render();
    return;
  }
  recordStudySession("Flashcards");
  addRecent("Flashcards");
  saveState();
  study = { ...study, mode: "flashDone" };
  render();
}
function finishQuiz() {
  recordStudySession("Practice quiz");
  const correctPrompts = new Set(study.answers.filter((answer) => answer.correct).map((answer) => answer.prompt));
  state.reviewQueue = state.reviewQueue.filter(
    (item) => item.setId !== study.setId || !correctPrompts.has(item.prompt)
  );
  const missed = study.answers
    .filter((answer) => !answer.correct)
    .map((answer) => ({
      setId: study.setId,
      prompt: answer.prompt,
      answer: answer.correctAnswer,
      date: new Date().toISOString()
    }));
  state.reviewQueue = [...missed, ...state.reviewQueue].slice(0, 40);
  addRecent("Practice quiz");
  saveState();
  study = { ...study, mode: "results", score: study.answers.filter((a) => a.correct).length };
  render();
}
function addRecent(mode) {
  state.recent.unshift({ id: study.setId, mode, when: "Just now" });
  state.recent = state.recent.slice(0, 8);
}
function renderResults() {
  const s = currentSet(),
    score = study.score,
    total = score === null ? s.cards.length : study.questions?.length || s.cards.length,
    percentage = score === null ? null : Math.round((score / total) * 100);
  let review =
    score === null
      ? `<div class="review-item">You worked through all <strong>${total} cards</strong>. Keep the ones that felt tricky in mind for next time.</div>`
      : study.answers
          .map((a) =>
            a.skip
              ? `<div class="review-item"><strong>Skipped:</strong> ${esc(a.prompt)}<br>Answer: ${esc(a.correctAnswer)}</div>`
              : !a.correct
                ? `<div class="review-item"><strong>Review:</strong> ${esc(a.prompt)}<br>Your answer: ${esc(a.answer)} · Answer: ${esc(a.correctAnswer)}</div>`
                : ""
          )
          .join("") || `<div class="review-item">You got every question right. Excellent recall!</div>`;
  return `<div class="study-main"><div class="study-toolbar"><button class="back-link" id="leave-study">← &nbsp;Back to sets</button><span style="color:#9aa2b1;font-size:11px">${esc(s.title)}</span></div><div class="results-card">${percentage === null ? `<div class="result-ring" style="--score-angle:78deg"><div class="result-ring-inner">✓</div></div><h2>Session complete</h2><p>You made time to learn today. That counts.</p>` : `<div class="result-ring" style="--score-angle:${percentage * 3.6}deg"><div class="result-ring-inner">${percentage}%</div></div><h2>${percentage >= 80 ? "Great work!" : percentage >= 50 ? "Nice progress!" : "Keep practicing!"}</h2><p>You got ${score} out of ${total} questions right.</p>`}<div class="review-box"><h3>${percentage === null ? "A quick reflection" : "What to review next"}</h3>${review}</div><div class="result-actions"><button class="secondary-btn" id="again-flash">Study flashcards</button>${percentage !== null ? `<button class="primary-btn" id="retry-quiz">Try quiz again&nbsp; →</button>` : `<button class="primary-btn" id="again-quiz">Take a practice quiz&nbsp; →</button>`}</div></div></div>`;
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".nav-item")) {
    navigate(e.target.closest(".nav-item").dataset.view);
  }
});
document.addEventListener("click", (e) => {
  if (e.target.id === "again-flash") beginStudy("flash");
  if (e.target.id === "retry-quiz" || e.target.id === "again-quiz") beginStudy("quiz");
});
document.getElementById("free-flight-launch").addEventListener("click", openFreeFlight);
window.addEventListener("pagehide", () => {
  freeFlightBestScore = 0;
  const best = document.getElementById("flight-best");
  if (best) best.textContent = "0";
});
function showToast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
render();
