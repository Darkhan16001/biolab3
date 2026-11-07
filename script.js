
"use strict";

// ==========================================
// BIO LAB 16 — BY DARKHAN
// 80 МИНУТ • РАНДОМ • 3 КОМАНДА
// ==========================================

const $ = id => document.getElementById(id);

const STORAGE_KEY = "bio_lab_16_darkhan_v1";
const PAGE_COUNT = 16;

// 3 + 18 + 6 + 14 + 3 + 16 + 6 + 10 + 4 = 80
const PAGE_MINUTES = [
  3,  // 0 Басты бет
  3,  // 1 АҮФ құрылысы
  3,  // 2 АҮФ және АДФ
  3,  // 3 Қызметі
  3,  // 4 Митохондрия
  3,  // 5 Синтез түрлері
  3,  // 6 Хемиосмос
  6,  // 7 YouTube
  14, // 8 Конспект
  3,  // 9 Оқушылар
  16, // 10 Ауызша
  6,  // 11 Жеке тест
  4,  // 12 1-ойын
  3,  // 13 2-ойын
  3,  // 14 3-ойын
  4   // 15 Қорытынды
];

const CLASS_NAMES = [
  "Рамазан",
  "Тұрғанжан",
  "Нұрай",
  "Әлқуат",
  "Шырай",
  "Гүлсезім",
  "Маржан",
  "Мариям",
  "Жансая",
  "Азиза",
  "Ақсезім",
  "Нұрболсын",
  "Ақнұр",
  "Іңкәр",
  "Асхат",
  "Аяжан",
  "Мирас",
  "Санжар",
  "Ерасыл",
  "Нұрасыл",
  "Расул",
  "Айнұр",
  "Дархан",
  "Айкерім"
];

const TEAMS = [
  "⚡ Энергия",
  "🧬 АҮФ",
  "⚙️ Митохондрия"
];

// ==========================================
// 1. БАСТАПҚЫ КҮЙ
// ==========================================

function initialState() {
  return {
    page: 0,
    startedAt: null,
    pageEnteredAt: null,

    students: CLASS_NAMES.map((name, id) => ({
      id,
      name,
      present: true
    })),

    oral: {},
    quiz: {},
    battle: {},
    logic: {},
    creative: {},

    oralSelected: null,
    quizSelected: null,
    battleIndex: 0
  };
}

let state = initialState();

try {
  const saved = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "null"
  );

  if (
    saved &&
    Array.isArray(saved.students) &&
    saved.students.length === 24
  ) {
    state = {
      ...initialState(),
      ...saved
    };
  }
} catch (error) {
  console.warn(
    "Сақталған мәлімет оқылмады",
    error
  );
}

for (const key of [
  "oral",
  "quiz",
  "battle",
  "logic",
  "creative"
]) {
  if (
    !state[key] ||
    typeof state[key] !== "object" ||
    Array.isArray(state[key])
  ) {
    state[key] = {};
  }
}

function save() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(state)
    );
  } catch (error) {
    console.warn("Сақтау қатесі", error);
  }
}

function safe(value) {
  return String(value).replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]
  );
}

function has(object, key) {
  return Object.prototype.hasOwnProperty.call(
    object,
    key
  );
}

// ==========================================
// 2. ҚАТЫСУШЫЛАР МЕН КОМАНДАЛАР
// ==========================================

function presentStudents() {
  return state.students.filter(
    student => student.present
  );
}

function teamCount() {
  return Math.min(
    3,
    presentStudents().length
  );
}

function studentTeam(id) {
  const index = presentStudents().findIndex(
    student => student.id === id
  );

  if (index < 0 || !teamCount()) return -1;

  return index % teamCount();
}

function teamMembers(team) {
  return presentStudents().filter(
    student => studentTeam(student.id) === team
  );
}

// ==========================================
// 3. РАНДОМ ТАҢДАУ
// ==========================================

function randomFrom(items) {
  if (!items.length) return null;

  // Браузердің кездейсоқ сан генераторы
  const index = Math.floor(
    Math.random() * items.length
  );

  return items[index];
}

// ==========================================
// 4. БЕТ АУЫСТЫРУ
// ==========================================

function goTo(page) {
  page = Number(page);

  if (
    !Number.isInteger(page) ||
    page < 0 ||
    page >= PAGE_COUNT
  ) {
    return;
  }

  if (page > 0 && !state.startedAt) {
    state.startedAt = Date.now();
  }

  if (state.page === 7 && page !== 7) {
    stopVideo();
  }

  if (
    page !== state.page ||
    !state.pageEnteredAt
  ) {
    state.pageEnteredAt = Date.now();
  }

  state.page = page;
  save();

  for (let i = 0; i < PAGE_COUNT; i++) {
    const screen = $("page-" + i);
    const active = i === page;

    screen.hidden = !active;
    screen.classList.toggle("active", active);
  }

  document.querySelectorAll(".nav-btn")
    .forEach(button => {
      button.classList.toggle(
        "active",
        Number(button.dataset.page) === page
      );
    });

  $("pageIndicator").textContent =
    `${page + 1} / ${PAGE_COUNT}`;

  $("previousPage").disabled =
    page === 0;

  $("nextPage").disabled =
    page === PAGE_COUNT - 1;

  $("nextPage").textContent =
    page === PAGE_COUNT - 2
      ? "Қорытынды →"
      : "Келесі →";

  refresh();
  save();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

window.goTo = goTo;

document.querySelectorAll(".nav-btn")
  .forEach(button => {
    button.addEventListener("click", () => {
      goTo(Number(button.dataset.page));
    });
  });

$("previousPage").addEventListener(
  "click",
  () => goTo(state.page - 1)
);

$("nextPage").addEventListener(
  "click",
  () => goTo(state.page + 1)
);

// ==========================================
// 5. 80 МИНУТТЫҚ ТАЙМЕР
// ==========================================

function formatTime(seconds) {
  seconds = Math.max(0, Math.floor(seconds));

  return (
    String(Math.floor(seconds / 60))
      .padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0")
  );
}

function updateClock() {
  const now = Date.now();

  const elapsed = state.startedAt
    ? Math.floor(
        (now - state.startedAt) / 1000
      )
    : 0;

  const sectionElapsed = state.pageEnteredAt
    ? Math.floor(
        (now - state.pageEnteredAt) / 1000
      )
    : 0;

  const limit =
    PAGE_MINUTES[state.page] * 60;

  const remaining =
    Math.max(0, limit - sectionElapsed);

  $("totalClock").textContent =
    formatTime(elapsed);

  $("sectionClock").textContent =
    formatTime(remaining);

  $("totalClock").style.color =
    elapsed >= 4800
      ? "#ffdc79"
      : "#40dba9";

  $("sectionClock").style.color =
    sectionElapsed >= limit
      ? "#ff6d87"
      : "#40dba9";
}

setInterval(updateClock, 1000);

// ==========================================
// 6. ТОЛЫҚ ЭКРАН
// ==========================================

$("fullscreenBtn").addEventListener(
  "click",
  async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement
          .requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      alert(
        "Браузер толық экранды қолдамауы мүмкін."
      );
    }
  }
);

// ==========================================
// 7. АҮФ / АДФ АЙНАЛЫМЫ
// ==========================================

let cycleStep = 0;

$("cycleBtn").addEventListener("click", () => {
  cycleStep = (cycleStep + 1) % 2;

  if (cycleStep === 1) {
    $("cycleExplanation").innerHTML = `
      <b>⚡ АҮФ гидролизі:</b>
      АҮФ + H₂O → АДФ + Pi.
      Бұл реакция бос энергия бөледі.
      Жасуша энергияны
      қажетті жұмысқа пайдаланады.
    `;
  } else {
    $("cycleExplanation").innerHTML = `
      <b>🔄 АҮФ синтезі:</b>
      АДФ + Pi + энергия → АҮФ.
      АҮФ түзілуіне энергия қажет.
      Митохондриядағы АҮФ-синтаза
      протондық градиентті пайдаланады.
    `;
  }
});

// ==========================================
// 8. YOUTUBE ВИДЕОЛАРЫ
// ==========================================

const VIDEOS = [
  {
    id: "VU-XlcCKcMQ",
    title:
      "АҮФ молекуласының құрылысы мен қызметі",
    end: 180
  },
  {
    id: "c5MkyBEC02s",
    title: "АҮФ синтезі",
    end: 180
  }
];

function playVideo(index) {
  const video = VIDEOS[index];
  if (!video) return;

  $("videoPlayer").src =
    "https://www.youtube-nocookie.com/embed/" +
    video.id +
    "?start=0&end=" + video.end +
    "&rel=0&playsinline=1";

  $("videoTitle").textContent =
    "▶ " + video.title;

  $("videoLink").href =
    "https://www.youtube.com/watch?v=" +
    video.id;
}

function stopVideo() {
  $("videoPlayer").src = "about:blank";

  $("videoTitle").textContent =
    "Видео тоқтатылды.";
}

document.querySelectorAll("[data-video]")
  .forEach(button => {
    button.addEventListener("click", () => {
      playVideo(Number(button.dataset.video));
    });
  });

$("stopVideo").addEventListener(
  "click",
  stopVideo
);

// ==========================================
// 9. ҚАТЫСПАЙТЫНДАРДЫ АЛЫП ТАСТАУ
// ==========================================

function teamGamesStarted() {
  return (
    Object.keys(state.battle).length > 0 ||
    Object.keys(state.logic).length > 0 ||
    Object.keys(state.creative).length > 0
  );
}

function beforeRosterChange() {
  if (!teamGamesStarted()) return true;

  const confirmed = confirm(
    "Қатысушылар саны өзгерсе, командалар " +
    "қайта бөлінеді. Командалық ойын ұпайлары " +
    "тазаланады. Жеке бағалар сақталады. " +
    "Жалғастырамыз ба?"
  );

  if (!confirmed) return false;

  state.battle = {};
  state.logic = {};
  state.creative = {};
  state.battleIndex = 0;

  return true;
}

function attendanceChanged() {
  const active = presentStudents();

  if (
    !active.some(
      s => s.id === state.oralSelected
    )
  ) {
    state.oralSelected = null;
  }

  if (
    !active.some(
      s => s.id === state.quizSelected
    )
  ) {
    state.quizSelected = null;
  }

  save();
  refresh();

  $("attendanceFeedback").textContent =
    `✅ Қатысады: ${active.length}. ` +
    `Қатыспайды: ${24 - active.length}.`;
}

function changePresence(id, value) {
  const student = state.students[id];

  if (!student ||
      student.present === value) {
    return;
  }

  if (!beforeRosterChange()) return;

  student.present = value;

  attendanceChanged();
}

function renderAttendance() {
  const active = presentStudents();
  const absent = state.students.filter(
    student => !student.present
  );

  $("presentCount").textContent =
    active.length;

  $("absentCount").textContent =
    absent.length;

  $("teamCount").textContent =
    teamCount();

  $("presentList").innerHTML =
    active.map(student => `
      <div class="student-row">
        <span class="student-number">
          ${student.id + 1}.
        </span>

        <input
          type="text"
          maxlength="60"
          data-name="${student.id}"
          value="${safe(student.name)}"
          aria-label="Оқушының есімі"
        >

        <button
          class="small-danger"
          data-absent="${student.id}">
          ✕ Алып тастау
        </button>
      </div>
    `).join("");

  $("absentList").innerHTML =
    absent.length
      ? absent.map(student => `
          <div class="absent-row">
            <span>${safe(student.name)}</span>

            <button
              class="small-success"
              data-restore="${student.id}">
              ↩ Қайтару
            </button>
          </div>
        `).join("")
      : "<p>Қатыспайтын оқушылар жоқ.</p>";

  document.querySelectorAll("[data-absent]")
    .forEach(button => {
      button.addEventListener("click", () => {
        changePresence(
          Number(button.dataset.absent),
          false
        );
      });
    });

  document.querySelectorAll("[data-restore]")
    .forEach(button => {
      button.addEventListener("click", () => {
        changePresence(
          Number(button.dataset.restore),
          true
        );
      });
    });

  document.querySelectorAll("[data-name]")
    .forEach(input => {
      input.addEventListener("change", () => {
        const id = Number(input.dataset.name);
        const name = input.value.trim();

        if (!name) {
          input.value = state.students[id].name;
          return;
        }

        state.students[id].name = name;

        save();
        renderTeamRoster();
        renderOral();
        renderQuiz();
        renderScores();
      });
    });
}

$("allPresent").addEventListener("click", () => {
  if (
    !state.students.some(
      student => !student.present
    )
  ) {
    return;
  }

  if (!beforeRosterChange()) return;

  state.students.forEach(student => {
    student.present = true;
  });

  attendanceChanged();
});

function renderTeamRoster() {
  if (!teamCount()) {
    $("teamRoster").innerHTML =
      '<div class="card">Қатысушылар жоқ.</div>';
    return;
  }

  $("teamRoster").innerHTML =
    TEAMS.slice(0, teamCount())
      .map((name, team) => `
        <div class="team-card">
          <h3>${name}</h3>
          <p>${teamMembers(team).length} оқушы</p>

          <ol>
            ${teamMembers(team)
              .map(student => `
                <li>${safe(student.name)}</li>
              `).join("")}
          </ol>
        </div>
      `).join("");
}

// ==========================================
// 10. 24 КҮРДЕЛІ АУЫЗША СҰРАҚ
// ==========================================

const ORAL = [
  {
    q: "АҮФ молекуласының үш құрылымдық бөлігін ата және әрқайсысының рөлін түсіндір.",
    a: "Аденин — азотты негіз, рибоза — бес көміртекті қант, үш фосфат тобы — молекуланың фосфаттық бөлігі. АҮФ фосфат алмасуына және энергия беретін реакцияларға қатысады."
  },
  {
    q: "Неліктен АҮФ нуклеотид деп есептеледі?",
    a: "АҮФ құрамында азотты негіз, пентоза және фосфат топтары бар. Бұл нуклеотид құрылымына сәйкес."
  },
  {
    q: "АҮФ пен АДФ құрылымдарының айырмашылығын түсіндір.",
    a: "АҮФ құрамында үш фосфат тобы, АДФ құрамында екі фосфат тобы болады."
  },
  {
    q: "АҮФ гидролизі кезінде қандай өнімдер түзіледі және оның энергетикалық маңызы қандай?",
    a: "Әдеттегі гидролизде АДФ пен бейорганикалық фосфат түзіледі; реакцияның жалпы бос энергия өзгерісі теріс және оны жасушалық жұмысқа байланыстыруға болады."
  },
  {
    q: "«Энергия тек фосфат байланысын үзу кезінде бөлінеді» деген пікірді неге дәл емес деп есептейміз?",
    a: "Байланысты үзу энергия талап етеді. Гидролиздің жалпы энергия бөлетін қасиеті жаңа байланыстардың түзілуі мен өнімдердің тұрақтылығына байланысты."
  },
  {
    q: "Неліктен АҮФ жасушаның энергия валютасы деп аталады?",
    a: "АҮФ энергия бөлетін және энергия қажет ететін реакцияларды байланыстырып, көптеген жасушалық үдерістерге энергия береді."
  },
  {
    q: "Егер жасушада АҮФ түзілуі қатты төмендесе, белсенді тасымалға қандай әсер болуы мүмкін?",
    a: "АҮФ-ке тәуелді мембраналық сорғылардың жұмысы нашарлап, иондық градиенттерді сақтау қиындауы мүмкін."
  },
  {
    q: "Бұлшықет жиырылуы мен АҮФ арасындағы байланысты түсіндір.",
    a: "АҮФ-тің байланысуы және гидролизі актин мен миозиннің жұмыс цикліндегі өзгерістерге қатысады."
  },
  {
    q: "АҮФ синтезі кезінде АДФ-ке фосфат қосу үшін не қажет?",
    a: "Энергия қажет. Энергия субстраттық реакциядан немесе протондық градиенттен алынуы мүмкін."
  },
  {
    q: "Субстраттық фосфорланудың ерекшелігі қандай?",
    a: "Фосфат жоғары энергиялы аралық қосылыстан АДФ-ке тікелей беріледі."
  },
  {
    q: "Субстраттық фосфорлану мен тотығу фосфорлануын салыстыр.",
    a: "Субстраттық жолда фосфат тікелей беріледі. Тотығу фосфорлануында протондық градиент пен АҮФ-синтаза қатысады."
  },
  {
    q: "Митохондрияның ішкі мембранасы неге АҮФ синтезі үшін маңызды?",
    a: "Онда электрон тасымалдау кешендері мен АҮФ-синтаза орналасып, мембрананың екі жағы арасында протондық градиент жасалады."
  },
  {
    q: "Митохондрия кристаларының көп болуы қандай артықшылық береді?",
    a: "Ішкі мембрананың ауданын арттырып, тыныс алу кешендері мен АҮФ-синтазаның орналасуына мүмкіндік береді."
  },
  {
    q: "Электрон тасымалдау тізбегінің АҮФ синтезіндегі рөлі қандай?",
    a: "Электрондардың энергиясы мембрананың екі жағына H⁺ тасымалдауға жұмсалып, протондық градиент түзеді."
  },
  {
    q: "NADH және FADH₂ қандай қызмет атқарады?",
    a: "Тыныс алуда жоғары энергиялы электрондарды электрон тасымалдау тізбегіне береді."
  },
  {
    q: "Протондық градиент дегеніміз не?",
    a: "Мембрананың екі жағындағы H⁺ концентрациясы мен электрлік потенциал айырмашылығы."
  },
  {
    q: "АҮФ-синтаза протондық градиент энергиясын қалай қолданады?",
    a: "H⁺ фермент арқылы өткенде оның бөліктерінің қозғалысы мен пішін өзгерістері АДФ пен Pi-ден АҮФ түзілуіне мүмкіндік береді."
  },
  {
    q: "Хемиосмос дегеніміз не және АҮФ синтезімен қалай байланысады?",
    a: "Хемиосмос — протондардың электрохимиялық градиент бойынша мембранадан өтуі. Бұл энергия АҮФ-синтазаға беріледі."
  },
  {
    q: "Неліктен митохондриядағы ішкі мембрананың H⁺ үшін таңдаулы өткізгіштігі маңызды?",
    a: "Мембрана H⁺ иондарын еркін өткізе берсе, градиент сақталмай, АҮФ синтезінің тиімділігі төмендейді."
  },
  {
    q: "Аэробты тыныс алуда оттегінің соңғы электрон акцепторы болуы нені білдіреді?",
    a: "Оттегі электрон тасымалдау тізбегінің соңында электрондарды және протондарды қабылдап, су түзілуіне қатысады."
  },
  {
    q: "Оттегі жетіспесе тотығу фосфорлануы неліктен тежеледі?",
    a: "Соңғы электрон акцепторы жетіспегенде электрон тізбегінің қалыпты жұмысы және протондық градиентті қолдау қиындайды."
  },
  {
    q: "Фотофосфорлану мен тотығу фосфорлануының ортақ механизмі қандай?",
    a: "Екеуінде де мембранадағы протондық градиенттің энергиясын АҮФ-синтаза қолданады."
  },
  {
    q: "АҮФ молекуласы РНҚ синтезіне қандай қатысы бар?",
    a: "АҮФ РНҚ-ның құрамына кіретін аденин нуклеотидінің бастапқы құрылыс материалы ретінде қолданылады."
  },
  {
    q: "АҮФ синтезі мен гидролизінің жасуша тіршілігіндегі үздіксіз айналымын түсіндір.",
    a: "Энергия бөлетін метаболизм АДФ пен Pi-ден АҮФ түзуге жағдай жасайды. АҮФ гидролизі энергияны қажет ететін үдерістермен байланыстырылады."
  }
];

// ==========================================
// 11. АУЫЗША РАНДОМ
// ==========================================

function oralRemaining() {
  return presentStudents().filter(
    student => !has(state.oral, student.id)
  );
}

function pickOral() {
  const id = state.oralSelected;

  if (
    id !== null &&
    presentStudents().some(s => s.id === id) &&
    !has(state.oral, id)
  ) {
    $("oralFeedback").textContent =
      "Алдымен таңдалған оқушыға баға қой.";
    return;
  }

  const available = oralRemaining();

  if (!available.length) {
    state.oralSelected = null;
    save();
    renderOral();
    return;
  }

  state.oralSelected = randomFrom(available).id;

  save();
  renderOral();
}

function renderOral() {
  const active = presentStudents();
  const remaining = oralRemaining();

  $("oralProgressText").textContent =
    `${active.length - remaining.length} / ` +
    `${active.length} бағаланды`;

  const id = state.oralSelected;
  const student = active.find(s => s.id === id);

  const selected = Boolean(student);
  const graded = selected && has(state.oral, id);

  $("oralPick").disabled =
    !active.length ||
    (selected && !graded) ||
    remaining.length === 0;

  $("oralPick").textContent =
    remaining.length
      ? "🎲 Рандом таңдау"
      : "✅ Барлығы аяқталды";

  $("oralReveal").disabled = !selected;

  document.querySelectorAll(".oral-grade")
    .forEach(button => {
      button.disabled = !selected || graded;
    });

  if (!selected) {
    $("oralStudent").textContent =
      active.length
        ? "🎲 Кездейсоқ таңдау"
        : "Қатысушылар жоқ";

    $("oralQuestion").textContent =
      remaining.length
        ? "Рандом таңдау батырмасын бас."
        : "Барлық сұрақ аяқталды.";

    $("oralAnswer").hidden = true;
    $("oralAnswer").textContent = "";

    $("oralFeedback").textContent =
      `${remaining.length} оқушының сұрағы қалды.`;
  } else {
    $("oralStudent").textContent =
      "🎤 " + student.name;

    $("oralQuestion").textContent = ORAL[id].q;

    $("oralAnswer").textContent =
      "Жауап үлгісі: " + ORAL[id].a;

    if (graded) {
      $("oralAnswer").hidden = false;

      $("oralFeedback").textContent =
        `${student.name}: ${state.oral[id]} / 3 ұпай.`;
    } else {
      $("oralAnswer").hidden = true;

      $("oralFeedback").textContent =
        "Жауабын тыңдап, 0–3 ұпай қой.";
    }
  }

  $("oralResults").innerHTML =
    active.map(student => {
      const done = has(
        state.oral,
        student.id
      );

      return `
        <div class="progress-person">
          <span>${safe(student.name)}</span>
          <b>
            ${done
              ? state.oral[student.id] + " / 3"
              : "Кезекте"}
          </b>
        </div>
      `;
    }).join("");
}

$("oralPick").addEventListener(
  "click",
  pickOral
);

$("oralReveal").addEventListener(
  "click",
  () => {
    if (state.oralSelected === null) return;

    $("oralAnswer").hidden =
      !$("oralAnswer").hidden;
  }
);

document.querySelectorAll(".oral-grade")
  .forEach(button => {
    button.addEventListener("click", () => {
      const id = state.oralSelected;

      if (
        id === null ||
        has(state.oral, id) ||
        !presentStudents().some(s => s.id === id)
      ) {
        return;
      }

      state.oral[id] =
        Number(button.dataset.points);

      save();
      renderOral();
      renderScores();
    });
  });

// ==========================================
// 12. 24 ЖЕКЕ КҮРДЕЛІ ТЕСТ
// ==========================================

const QUIZ = [
  {
    q: "АҮФ молекуласының құрылымын қай нұсқа дұрыс көрсетеді?",
    options: [
      "Аденин + дезоксирибоза + 2 фосфат",
      "Аденин + рибоза + 3 фосфат",
      "Тимин + рибоза + 3 фосфат",
      "Глюкоза + 3 фосфат"
    ],
    answer: 1,
    why: "АҮФ — аденин, рибоза және үш фосфаттан тұрады."
  },
  {
    q: "АҮФ неліктен нуклеотид болып есептеледі?",
    options: [
      "Ол нәруыз болғандықтан",
      "Құрамында азотты негіз, қант және фосфат бар",
      "Құрамында май қышқылы бар",
      "Ол тек митохондрияда орналасады"
    ],
    answer: 1,
    why: "Нуклеотидтің негізгі бөліктері: негіз, пентоза және фосфат."
  },
  {
    q: "АҮФ пен АДФ-тің басты құрылымдық айырмашылығы қандай?",
    options: [
      "Адениннің болуы",
      "Рибозаның түрі",
      "Фосфат топтарының саны",
      "Екеуінің де нәруыз болуы"
    ],
    answer: 2,
    why: "АҮФ құрамында үш, АДФ құрамында екі фосфат тобы бар."
  },
  {
    q: "АҮФ гидролизіне қандай реагент қатысады?",
    options: [
      "Су",
      "Азот газы",
      "ДНҚ",
      "Крахмал"
    ],
    answer: 0,
    why: "Гидролиз — су қатысатын реакция."
  },
  {
    q: "АҮФ гидролизінің энергия бөлуін қай тұжырым дұрыс түсіндіреді?",
    options: [
      "Байланысты үзу ғана энергия бөледі",
      "Жалпы реакция өнімдерінің салыстырмалы тұрақтылығы маңызды",
      "АҮФ әрқашан жарық сіңіреді",
      "Энергия мүлде өзгермейді"
    ],
    answer: 1,
    why: "Гидролиздің бос энергия өзгерісі барлық үзілетін және түзілетін байланыстарға тәуелді."
  },
  {
    q: "АҮФ-тің «энергия валютасы» аталу себебі қандай?",
    options: [
      "Ол жасушада тек қор ретінде жиналады",
      "Энергия алмасуы мен жасушалық жұмысты байланыстырады",
      "Тек генетикалық ақпарат сақтайды",
      "Тек мембрана құрайды"
    ],
    answer: 1,
    why: "АҮФ энергияны қажет ететін үдерістермен энергия бөлетін реакцияларды байланыстырады."
  },
  {
    q: "АҮФ жетіспеуі қай үдеріске тікелей кедергі келтіруі мүмкін?",
    options: [
      "АТФ-тәуелді белсенді ион тасымалына",
      "Жарықтың таралуына",
      "Судың химиялық құрамына",
      "Гравитацияға"
    ],
    answer: 0,
    why: "Мембранадағы кей сорғылар энергияны АҮФ гидролизінен алады."
  },
  {
    q: "Миозиннің жұмыс циклі үшін қай молекула маңызды?",
    options: [
      "АҮФ",
      "Тек целлюлоза",
      "Тек хлорофилл",
      "Тек крахмал"
    ],
    answer: 0,
    why: "Бұлшықет жиырылуының молекулалық механизмі АҮФ-пен байланысты."
  },
  {
    q: "АҮФ синтезі үшін АДФ-ке тағы не қажет?",
    options: [
      "Pi және энергия",
      "Тек көмірқышқыл газы",
      "Тек оттегі молекуласы",
      "Тек су"
    ],
    answer: 0,
    why: "АҮФ түзілуі АДФ пен Pi-ді энергия жұмсап біріктіреді."
  },
  {
    q: "Субстраттық фосфорлану нені білдіреді?",
    options: [
      "Фосфаттың аралық қосылыстан АДФ-ке тікелей берілуі",
      "Протондардың тек жарықпен өтуі",
      "АҮФ-тің толық жойылуы",
      "Глюкозаның ДНҚ-ға айналуы"
    ],
    answer: 0,
    why: "Бұл механизмде фосфат субстраттан тікелей беріледі."
  },
  {
    q: "Тотығу фосфорлануының негізгі энергия көзі қандай?",
    options: [
      "Протондық электрохимиялық градиент",
      "Кездейсоқ температура өзгерісі",
      "ДНҚ ұзындығы",
      "Рибозаның массасы ғана"
    ],
    answer: 0,
    why: "АҮФ-синтаза H⁺ градиентінің энергиясын пайдаланады."
  },
  {
    q: "Эукариоттағы тотығу фосфорлануының негізгі орны қайсы?",
    options: [
      "Митохондрияның ішкі мембранасы",
      "Жасуша ядросының іші",
      "Рибосоманың беті",
      "Лизосома қуысы ғана"
    ],
    answer: 0,
    why: "Электрон тасымалдау кешендері мен АҮФ-синтаза ішкі мембранада болады."
  },
  {
    q: "Кристалар АҮФ синтезі үшін неліктен маңызды?",
    options: [
      "Ішкі мембрананың ауданын арттырады",
      "Аденинді ДНҚ-ға айналдырады",
      "Барлық мембрананы жояды",
      "Оттегіні фосфатқа айналдырады"
    ],
    answer: 0,
    why: "Кристалар — ішкі мембрананың қатпарлары."
  },
  {
    q: "Митохондрия матриксінде қай үдеріске қатысатын реакциялар жүреді?",
    options: [
      "Кребс циклі",
      "Тек фотосинтездің жарық кезеңі",
      "Тек трансляция",
      "Тек ДНҚ репликациясы"
    ],
    answer: 0,
    why: "Кребс циклі эукариоттарда митохондрия матриксімен байланысты."
  },
  {
    q: "NADH пен FADH₂ тыныс алу тізбегіне не береді?",
    options: [
      "Электрондар",
      "Дайын АҮФ-тің бәрін",
      "Рибозаның өзін",
      "Жасуша қабырғасын"
    ],
    answer: 0,
    why: "Олар электрон тасымалдаушылар болып табылады."
  },
  {
    q: "Протондарды мембранааралық кеңістікке айдау не қалыптастырады?",
    options: [
      "Электрохимиялық H⁺ градиентін",
      "Хлоропластты",
      "Жаңа ядроны",
      "Рибозаны"
    ],
    answer: 0,
    why: "Протондардың әркелкі таралуы градиент түзеді."
  },
  {
    q: "АҮФ-синтаза ферментінің негізгі қызметі қандай?",
    options: [
      "АДФ пен Pi-ден АҮФ түзу",
      "Аденинді біржола жою",
      "Глюкозаны ДНҚ-ға айналдыру",
      "Тек оттегі бөлу"
    ],
    answer: 0,
    why: "Фермент протондық градиент энергиясын АҮФ түзуге пайдаланады."
  },
  {
    q: "Хемиосмостың негізгі ерекшелігі?",
    options: [
      "Протондардың электрохимиялық градиент бойынша өтуі",
      "Тек глюкозаны механикалық бөлу",
      "Ядроның екіге бөлінуі",
      "Фосфаттардың жойылуы"
    ],
    answer: 0,
    why: "Хемиосмос мембранадағы H⁺ градиентіне негізделеді."
  },
  {
    q: "Ішкі мембрана H⁺-ті еркін өткізіп жіберсе не болуы мүмкін?",
    options: [
      "Градиент азайып, АҮФ синтезі тежеледі",
      "АҮФ-синтаза міндетті түрде көбейеді",
      "Аденин рибозаға айналады",
      "Су молекуласы жойылады"
    ],
    answer: 0,
    why: "Градиенттің сақталуы АҮФ-синтаза үшін маңызды."
  },
  {
    q: "Аэробты тыныс алуда соңғы электрон акцепторы қандай?",
    options: [
      "O₂",
      "Аденин",
      "Рибоза",
      "Крахмал"
    ],
    answer: 0,
    why: "Оттегі соңғы электрон акцепторы ретінде су түзілуіне қатысады."
  },
  {
    q: "Оттегі жетіспеген жағдайда қандай үдеріс алдымен күрделене түседі?",
    options: [
      "Митохондриядағы тотығу фосфорлануы",
      "Рибозаның химиялық элемент болуы",
      "Адениннің атомдық массасы",
      "АҮФ-тегі фосфаттың саны өздігінен артуы"
    ],
    answer: 0,
    why: "O₂ жетіспеуі электрон тасымалдау тізбегінің жұмысын тежейді."
  },
  {
    q: "Фотофосфорлану қай жерде жүреді?",
    options: [
      "Хлоропласттың тилакоид мембранасында",
      "Тек жасуша ядросында",
      "Тек цитоплазмадағы рибосомада",
      "Тек лизосомада"
    ],
    answer: 0,
    why: "Өсімдіктерде жарық реакцияларына байланысты АҮФ хлоропласт тилакоидында түзіледі."
  },
  {
    q: "Тотығу және фотофосфорланудың ортақ қасиеті?",
    options: [
      "Протондық градиент пен АҮФ-синтазаны қолдануы",
      "Екеуі де міндетті түрде тек ядро ішінде жүруі",
      "Екеуі де АҮФ жұмсамайтыны",
      "Екеуі де тек глюкозаны тікелей ыдыратуы"
    ],
    answer: 0,
    why: "Екеуі де хемиосмостық механизмді қолданады."
  },
  {
    q: "АҮФ-тің метаболизмдегі рөлін қай тұжырым жақсы көрсетеді?",
    options: [
      "Энергия бөлетін және қажет ететін үдерістерді байланыстырады",
      "Тек ұзақ мерзімдік энергия қоры",
      "Тек генетикалық код",
      "Тек құрылымдық нәруыз"
    ],
    answer: 0,
    why: "АҮФ катаболизм мен энергия қажет ететін үдерістер арасындағы байланысты қамтамасыз етеді."
  }
];

// ==========================================
// 13. ЖЕКЕ ТЕСТТІ РАНДОМ ТАҢДАУ
// ==========================================

function quizRemaining() {
  return presentStudents().filter(
    student => !has(state.quiz, student.id)
  );
}

function pickQuiz() {
  const id = state.quizSelected;

  if (
    id !== null &&
    presentStudents().some(s => s.id === id) &&
    !has(state.quiz, id)
  ) {
    $("quizFeedback").textContent =
      "Алдымен таңдалған оқушының жауабын тексер.";
    return;
  }

  const remaining = quizRemaining();

  if (!remaining.length) {
    state.quizSelected = null;
    save();
    renderQuiz();
    return;
  }

  state.quizSelected = randomFrom(remaining).id;

  save();
  renderQuiz();
}

function renderQuiz() {
  const active = presentStudents();
  const remaining = quizRemaining();

  $("quizProgressText").textContent =
    `${active.length - remaining.length} / ` +
    `${active.length} тапсырды`;

  const id = state.quizSelected;
  const student = active.find(s => s.id === id);

  const selected = Boolean(student);
  const done = selected && has(state.quiz, id);

  $("quizPick").disabled =
    !active.length ||
    (selected && !done) ||
    remaining.length === 0;

  $("quizPick").textContent =
    remaining.length
      ? "🎲 Рандом таңдау"
      : "✅ Барлығы аяқталды";

  $("quizCheck").disabled =
    !selected || done;

  if (!selected) {
    $("quizStudent").textContent =
      active.length
        ? "🎲 Оқушыны кездейсоқ таңдау"
        : "Қатысушылар жоқ";

    $("quizQuestion").textContent =
      remaining.length
        ? "Рандом батырмасын бас."
        : "Барлық тест аяқталды.";

    $("quizOptions").innerHTML = "";

    $("quizFeedback").textContent =
      `${remaining.length} оқушының тесті қалды.`;
  } else {
    const question = QUIZ[id];
    const result = state.quiz[id];

    $("quizStudent").textContent =
      "🧠 " + student.name;

    $("quizQuestion").textContent =
      question.q;

    $("quizOptions").innerHTML =
      question.options.map((option, i) => {
        const checked =
          done && result.selected === i;

        const css = done
          ? i === question.answer
            ? "correct"
            : checked ? "wrong" : ""
          : "";

        return `
          <label class="choice ${css}">
            <input type="radio"
                   name="quizAnswer"
                   value="${i}"
                   ${checked ? "checked" : ""}
                   ${done ? "disabled" : ""}>

            <span>
              ${String.fromCharCode(65 + i)}.
              ${safe(option)}
            </span>
          </label>
        `;
      }).join("");

    $("quizFeedback").textContent =
      done
        ? (result.correct ? "✅ Дұрыс! " : "❌ Қате. ") +
          question.why
        : "Дұрыс жауапты таңда.";
  }

  $("quizResults").innerHTML =
    active.map(student => {
      const finished = has(
        state.quiz,
        student.id
      );

      return `
        <div class="progress-person">
          <span>${safe(student.name)}</span>

          <b>
            ${finished
              ? state.quiz[student.id].points + " / 2"
              : "Кезекте"}
          </b>
        </div>
      `;
    }).join("");
}

$("quizPick").addEventListener(
  "click",
  pickQuiz
);

$("quizCheck").addEventListener("click", () => {
  const id = state.quizSelected;

  if (
    id === null ||
    has(state.quiz, id) ||
    !presentStudents().some(s => s.id === id)
  ) {
    return;
  }

  const selected = document.querySelector(
    'input[name="quizAnswer"]:checked'
  );

  if (!selected) {
    $("quizFeedback").textContent =
      "Алдымен жауап таңда.";
    return;
  }

  const answer = Number(selected.value);
  const correct = answer === QUIZ[id].answer;

  state.quiz[id] = {
    selected: answer,
    correct,
    points: correct ? 2 : 0
  };

  save();
  renderQuiz();
  renderScores();
});

// ==========================================
// 14. 1-ОЙЫН — ENERGY BATTLE
// ==========================================

const BATTLE = [
  {
    q: "Митохондрияның ішкі мембранасы H⁺ иондарын еркін өткізіп жіберді. Не өзгереді?",
    options: [
      "Протондық градиент әлсіреп, АҮФ синтезі төмендейді",
      "АҮФ синтезі шексіз артады",
      "Аденин рибозаға айналады",
      "Митохондрия бірден хлоропласт болады"
    ],
    answer: 0,
    why: "АҮФ-синтазаға протондар градиентінің энергиясы қажет."
  },
  {
    q: "Жасушада АҮФ-ке тәуелді ион сорғысының жұмысы бәсеңдеді. Ықтимал себеп?",
    options: [
      "АҮФ қолжетімділігінің азаюы",
      "Судың түсінің өзгеруі",
      "Рибозаның міндетті түрде жойылуы",
      "Кристалардың жарық шығаруы"
    ],
    answer: 0,
    why: "Белсенді тасымалдағы кей сорғылар АҮФ энергиясын қолданады."
  },
  {
    q: "АҮФ-синтаза жұмыс істейді, бірақ протондық градиент жойылды. Не болады?",
    options: [
      "Градиентпен жүретін АҮФ синтезі тежеледі",
      "Тотығу фосфорлануы міндетті түрде күшейеді",
      "АДФ химиялық элементке айналады",
      "Гемоглобин пайда болады"
    ],
    answer: 0,
    why: "Протондардың электрохимиялық потенциалы АҮФ-синтазаға энергия береді."
  },
  {
    q: "Бір биохимиялық реакцияда жоғары энергиялы аралық қосылыс АДФ-ке фосфат берді. Бұл қандай механизм?",
    options: [
      "Субстраттық фосфорлану",
      "Хемиосмос",
      "Тек фотолиз",
      "Транскрипция"
    ],
    answer: 0,
    why: "Фосфаттың тікелей берілуі — субстраттық фосфорланудың белгісі."
  },
  {
    q: "Бұлшықет жиырылуы үшін АҮФ гидролизі неге қажет?",
    options: [
      "Миозиннің жұмыс цикліне энергия беру үшін",
      "Рибозаны оттегіге айналдыру үшін",
      "Барлық нәруыздарды жою үшін",
      "ДНҚ-ны митохондрияға айналдыру үшін"
    ],
    answer: 0,
    why: "АҮФ миозиннің механикалық жұмыс цикліне қатысады."
  },
  {
    q: "Аэробты тыныс алуда оттегі жетіспесе, электрон тасымалдау тізбегіне қандай әсер болады?",
    options: [
      "Соңғы электрон акцепторы азайып, тізбек тежеледі",
      "Тізбек міндетті түрде күшейеді",
      "Глюкоза бірден рибозаға айналады",
      "АҮФ-тің фосфат тобы өздігінен көбейеді"
    ],
    answer: 0,
    why: "Оттегі аэробты тыныс алуда соңғы электрон акцепторы."
  },
  {
    q: "АҮФ гидролизінің энергия бөлетін қасиетін дұрыс түсіндіретін жауап?",
    options: [
      "Реакцияның жалпы бос энергия өзгерісі теріс",
      "Кез келген байланысты үзу өздігінен энергия береді",
      "Су қатыспайды",
      "Ешқандай өнім түзілмейді"
    ],
    answer: 0,
    why: "Гидролиздің энергетикалық әсері бүкіл реакцияның бастапқы және соңғы күйіне байланысты."
  },
  {
    q: "Жарық энергиясы есебінен АҮФ түзілетін жасушалық орын?",
    options: [
      "Хлоропласттың тилакоид мембранасы",
      "Тек жасуша ядросы",
      "Тек рибосома",
      "Тек митохондрия матриксі"
    ],
    answer: 0,
    why: "Фотофосфорлану жарық реакцияларымен байланысты."
  },
  {
    q: "Тотығу және фотофосфорланудың ұқсастығы неде?",
    options: [
      "Екеуі де АҮФ-синтаза мен H⁺ градиентін пайдаланады",
      "Екеуі де АҮФ-ті мүлде түзбейді",
      "Екеуі де тек бір органоидта жүреді",
      "Екеуі де мембранасыз жүреді"
    ],
    answer: 0,
    why: "Екі механизмде де АҮФ-синтаза градиент энергиясын қолданады."
  }
];

function battleTeam(index) {
  return teamCount()
    ? index % teamCount()
    : -1;
}

function renderBattle() {
  const index = Math.max(
    0,
    Math.min(
      BATTLE.length - 1,
      Number(state.battleIndex) || 0
    )
  );

  state.battleIndex = index;

  const question = BATTLE[index];
  const team = battleTeam(index);

  const done = has(state.battle, index);
  const result = state.battle[index];

  $("battleNumber").textContent =
    `Жағдаят ${index + 1} / ${BATTLE.length}`;

  $("battleTeam").textContent =
    team < 0 ? "Команда жоқ" : TEAMS[team];

  $("battleQuestion").textContent =
    question.q;

  $("battleBar").style.width =
    ((index + 1) / BATTLE.length * 100) + "%";

  $("battleOptions").innerHTML =
    question.options.map((option, i) => {
      const checked =
        done && result.selected === i;

      const css = done
        ? i === question.answer
          ? "correct"
          : checked ? "wrong" : ""
        : "";

      return `
        <label class="choice ${css}">
          <input type="radio"
                 name="battleAnswer"
                 value="${i}"
                 ${checked ? "checked" : ""}
                 ${done ? "disabled" : ""}>

          <span>
            ${String.fromCharCode(65 + i)}.
            ${safe(option)}
          </span>
        </label>
      `;
    }).join("");

  $("battleCheck").disabled =
    done || !teamCount();

  $("battleNext").textContent =
    index === BATTLE.length - 1
      ? "2-ойынға өту →"
      : "Келесі жағдаят →";

  $("battleFeedback").textContent =
    done
      ? (result.correct ? "✅ Дұрыс! " : "❌ Қате. ") +
        question.why
      : teamCount()
        ? "Командамен талқылап, жауап таңдаңдар."
        : "Алдымен қатысушыларды белгілеңдер.";
}

$("battleCheck").addEventListener("click", () => {
  const index = state.battleIndex;

  if (!teamCount() || has(state.battle, index)) {
    return;
  }

  const selected = document.querySelector(
    'input[name="battleAnswer"]:checked'
  );

  if (!selected) {
    $("battleFeedback").textContent =
      "Бір жауап нұсқасын таңда.";
    return;
  }

  const answer = Number(selected.value);
  const correct = answer === BATTLE[index].answer;

  state.battle[index] = {
    selected: answer,
    correct,
    points: correct ? 3 : 0
  };

  save();
  renderBattle();
  renderScores();
});

$("battleNext").addEventListener("click", () => {
  if (state.battleIndex >= BATTLE.length - 1) {
    goTo(13);
    return;
  }

  state.battleIndex++;
  save();
  renderBattle();
});

// ==========================================
// 15. 2-ОЙЫН — ҒЫЛЫМИ ДЕТЕКТИВ
// ==========================================

const LOGIC = [
  [
    {
      text: "АҮФ құрамында аденин, рибоза және үш фосфат тобы бар.",
      correct: true,
      why: "АҮФ-тің негізгі химиялық құрылысы осы бөліктерден тұрады."
    },
    {
      text: "АҮФ пен АДФ құрамындағы фосфат топтарының саны бірдей.",
      correct: false,
      why: "АҮФ-те үш, АДФ-те екі фосфат тобы болады."
    },
    {
      text: "АҮФ гидролизі жасушалық жұмысты энергиямен қамтамасыз етуге қатыса алады.",
      correct: true,
      why: "АҮФ гидролизі энергия қажет ететін реакциялармен байланысады."
    },
    {
      text: "Кез келген химиялық байланысты үзу өздігінен энергия бөледі.",
      correct: false,
      why: "Байланысты үзу энергия талап етеді; толық реакцияның энергия өзгерісі басқа байланыстардың түзілуіне де тәуелді."
    }
  ],
  [
    {
      text: "Субстраттық фосфорлануда фосфат АДФ-ке аралық қосылыстан тікелей беріледі.",
      correct: true,
      why: "Бұл — субстраттық фосфорланудың анықтамасы."
    },
    {
      text: "Тотығу фосфорлануы протондық градиентке тәуелді.",
      correct: true,
      why: "Градиент энергиясы АҮФ-синтазаға беріледі."
    },
    {
      text: "АҮФ-синтаза электрондардың соңғы акцепторы болып табылады.",
      correct: false,
      why: "Аэробты тыныс алуда соңғы электрон акцепторы — оттегі."
    },
    {
      text: "Митохондрияның ішкі мембранасының құрылысы АҮФ синтезіне қатысы жоқ.",
      correct: false,
      why: "Осы мембранада тотығу фосфорлануының кешендері орналасады."
    }
  ],
  [
    {
      text: "NADH және FADH₂ тыныс алу тізбегіне электрондар береді.",
      correct: true,
      why: "Олар — тотықсызданған электрон тасымалдаушылар."
    },
    {
      text: "Хемиосмос протондық электрохимиялық градиентпен байланысты.",
      correct: true,
      why: "H⁺ градиент бойымен АҮФ-синтаза арқылы өтеді."
    },
    {
      text: "Фотофосфорлану өсімдіктің хлоропластында жүруі мүмкін.",
      correct: true,
      why: "Фотосинтездің жарық реакцияларында АҮФ синтезделеді."
    },
    {
      text: "Оттегі мүлде болмаса да аэробты электрон тасымалдау тізбегі қалыпты үздіксіз жұмыс істей береді.",
      correct: false,
      why: "Соңғы электрон акцепторы жетіспесе, тізбектің қалыпты жұмысы тежеледі."
    }
  ]
];

function renderLogic() {
  if (!teamCount()) {
    $("logicArea").innerHTML =
      '<div class="card">Қатысушылар жоқ.</div>';
    return;
  }

  $("logicArea").innerHTML =
    LOGIC.slice(0, teamCount())
      .map((items, team) => {
        const saved = state.logic[team];
        const done = Boolean(saved);

        const rows = items.map((item, i) => {
          const selected = done
            ? String(saved.answers[i])
            : "";

          return `
            <div class="statement">
              <p>
                <b>${i + 1}.</b>
                ${safe(item.text)}
              </p>

              <select
                data-logic="${team}-${i}"
                ${done ? "disabled" : ""}>

                <option value="">
                  Жауап таңда
                </option>

                <option value="true"
                  ${selected === "true"
                    ? "selected" : ""}>
                  ✅ Дұрыс
                </option>

                <option value="false"
                  ${selected === "false"
                    ? "selected" : ""}>
                  ❌ Қате
                </option>
              </select>
            </div>
          `;
        }).join("");

        const explanations = done
          ? items.map((item, i) => `
              <p>
                ${i + 1}.
                <b>
                  ${saved.answers[i] === item.correct
                    ? "✅"
                    : "❌"}
                </b>
                ${safe(item.why)}
              </p>
            `).join("")
          : "";

        return `
          <div class="logic-panel">
            <h3>${TEAMS[team]}</h3>

            <p>
              Тұжырымдарды ғылыми
              негізде талдаңдар.
            </p>

            ${rows}

            <button
              class="btn primary"
              data-logic-check="${team}"
              ${done ? "disabled" : ""}>
              🧩 Тексеру
            </button>

            <p class="feedback"
               id="logicFeedback-${team}">
              ${done
                ? `Нәтиже: ${saved.points} / 4 ұпай`
                : ""}
            </p>

            ${done
              ? `<div class="answer-panel">
                   ${explanations}
                 </div>`
              : ""}
          </div>
        `;
      }).join("");

  document.querySelectorAll("[data-logic-check]")
    .forEach(button => {
      button.addEventListener("click", () => {
        const team =
          Number(button.dataset.logicCheck);

        if (has(state.logic, team)) return;

        const items = LOGIC[team];

        const fields = items.map((item, i) =>
          document.querySelector(
            `[data-logic="${team}-${i}"]`
          )
        );

        if (
          fields.some(
            field => field.value === ""
          )
        ) {
          $("logicFeedback-" + team).textContent =
            "Төрт жауапты түгел таңдаңдар.";
          return;
        }

        const answers = fields.map(
          field => field.value === "true"
        );

        const points = answers.reduce(
          (sum, answer, i) =>
            sum + Number(
              answer === items[i].correct
            ),
          0
        );

        state.logic[team] = {
          answers,
          points
        };

        save();
        renderLogic();
        renderScores();
      });
    });
}

// ==========================================
// 16. 3-ОЙЫН — АҮФ ЗЕРТХАНАСЫ
// ==========================================

const CREATIVE = [
  {
    title: "🧬 АҮФ молекуласын зертте",
    task:
      "АҮФ молекуласының сызбасын жаса. " +
      "Аденинді, рибозаны, α, β, γ фосфаттарды белгіле. " +
      "АҮФ гидролизінің теңдеуін жазып, " +
      "энергетикалық мағынасын түсіндір.",
    rubric:
      "2 ұпай — құрылым; " +
      "2 ұпай — гидролиз және түсіндіру; " +
      "1 ұпай — ғылыми қорғау."
  },
  {
    title: "⚙️ АҮФ-синтаза механизмін түсіндір",
    task:
      "Митохондрияның ішкі мембранасын, " +
      "матрикс пен мембранааралық кеңістікті сыз. " +
      "H⁺ градиентін және АҮФ-синтазаның " +
      "АДФ + Pi-ден АҮФ түзуін көрсет.",
    rubric:
      "2 ұпай — дұрыс схема; " +
      "2 ұпай — механизм; " +
      "1 ұпай — дәлел."
  },
  {
    title: "🔬 Ғылыми тәжірибені талда",
    task:
      "Митохондрия мембранасы H⁺ иондарын " +
      "еркін өткізіп жіберді деп елестет. " +
      "Протондық градиент пен АҮФ синтезінің " +
      "не болатынын көрсететін себеп-салдар " +
      "сызбасын жаса. Қорытындыны дәлелде.",
    rubric:
      "2 ұпай — себеп-салдар сызбасы; " +
      "2 ұпай — ғылыми түсіндіру; " +
      "1 ұпай — қорытынды."
  }
];

function renderCreative() {
  if (!teamCount()) {
    $("creativeArea").innerHTML =
      '<div class="card">Алдымен қатысушыларды белгіле.</div>';
    return;
  }

  $("creativeArea").innerHTML =
    CREATIVE.slice(0, teamCount())
      .map((task, team) => {
        const score = has(state.creative, team)
          ? state.creative[team]
          : null;

        return `
          <div class="creative-panel">
            <h3>${TEAMS[team]}</h3>
            <h3>${safe(task.title)}</h3>

            <p>${safe(task.task)}</p>

            <p>
              <b>Бағалау:</b>
              ${safe(task.rubric)}
            </p>

            <label for="creative-${team}">
              0–5 ұпай
            </label>

            <select id="creative-${team}">
              <option value="">Ұпай таңда</option>

              ${[0, 1, 2, 3, 4, 5]
                .map(n => `
                  <option value="${n}"
                    ${score === n
                      ? "selected"
                      : ""}>
                    ${n} ұпай
                  </option>
                `).join("")}
            </select>

            <button
              class="btn success"
              data-creative-save="${team}">
              🏅 Бағаны сақтау
            </button>

            <p class="feedback"
               id="creativeFeedback-${team}">
              ${score === null
                ? "Әлі бағаланған жоқ."
                : score + " / 5 ұпай сақталды."}
            </p>
          </div>
        `;
      }).join("");

  document.querySelectorAll("[data-creative-save]")
    .forEach(button => {
      button.addEventListener("click", () => {
        const team =
          Number(button.dataset.creativeSave);

        const value =
          $("creative-" + team).value;

        if (value === "") {
          $("creativeFeedback-" + team).textContent =
            "Алдымен ұпай таңда.";
          return;
        }

        state.creative[team] = Number(value);

        save();
        renderCreative();
        renderScores();
      });
    });
}

// ==========================================
// 17. ЖЕКЕ ЖӘНЕ КОМАНДАЛЫҚ ҰПАЙ
// ==========================================

function personalPoints(id) {
  let points = 0;

  if (has(state.oral, id)) {
    points += Number(state.oral[id]) || 0;
  }

  if (has(state.quiz, id)) {
    points +=
      Number(state.quiz[id].points) || 0;
  }

  return points;
}

function gamePoints(team) {
  let points = 0;

  BATTLE.forEach((item, index) => {
    if (
      battleTeam(index) === team &&
      has(state.battle, index)
    ) {
      points += state.battle[index].points;
    }
  });

  if (has(state.logic, team)) {
    points += state.logic[team].points;
  }

  if (has(state.creative, team)) {
    points += state.creative[team];
  }

  return points;
}

// Команда саны әртүрлі болса,
// жеке ұпайлардың орташа мәнін қолданамыз.

function teamPoints(team) {
  const members = teamMembers(team);

  if (!members.length) return 0;

  const personalSum = members.reduce(
    (total, student) =>
      total + personalPoints(student.id),
    0
  );

  const average =
    personalSum / members.length;

  const personalContribution =
    Math.round(average * 2);

  return personalContribution +
    gamePoints(team);
}

function scoreCards() {
  return TEAMS.slice(0, teamCount())
    .map((name, team) => `
      <div class="team-card">
        <h3>${name}</h3>

        <div class="team-score">
          ${teamPoints(team)} ұпай
        </div>

        <p>
          ${teamMembers(team).length} оқушы
        </p>

        <p>
          Командалық ойын:
          ${gamePoints(team)} ұпай
        </p>
      </div>
    `).join("");
}

function renderScores() {
  const cards = scoreCards();

  $("game1Scores").innerHTML = cards;
  $("game2Scores").innerHTML = cards;
  $("game3Scores").innerHTML = cards;
  $("finalScores").innerHTML = cards;

  $("sidebarScores").innerHTML =
    state.page < 9
      ? ""
      : TEAMS.slice(0, teamCount())
          .map((name, team) => `
            <div class="mini-score">
              <span>${name}</span>
              <b>${teamPoints(team)}</b>
            </div>
          `).join("");

  renderFinal();
}

// ==========================================
// 18. ҚОРЫТЫНДЫ ЖӘНЕ ЖЕҢІМПАЗ
// ==========================================

function renderFinal() {
  const active = presentStudents();

  if (!active.length) {
    $("winner").textContent =
      "Қатысушылар белгіленген жоқ.";

    $("studentResults").innerHTML = "";
    return;
  }

  const scores = Array.from(
    { length: teamCount() },
    (_, team) => teamPoints(team)
  );

  const maximum = Math.max(...scores);

  const winners = scores
    .map((score, index) => ({
      score,
      index
    }))
    .filter(item => item.score === maximum);

  const assessed =
    active.some(student =>
      has(state.oral, student.id) ||
      has(state.quiz, student.id)
    ) ||
    teamGamesStarted();

  if (!assessed) {
    $("winner").textContent =
      "Нәтижелер ойын аяқталғаннан кейін көрсетіледі.";
  } else if (winners.length === 1) {
    $("winner").innerHTML =
      "🏆 ЖЕҢІМПАЗ КОМАНДА<br>" +
      TEAMS[winners[0].index] +
      "<br>" +
      maximum + " ұпай";
  } else {
    $("winner").innerHTML =
      "🤝 НӘТИЖЕЛЕР ТЕҢ<br>" +
      winners.map(item =>
        TEAMS[item.index]
      ).join(" және ") +
      "<br>" +
      maximum + " ұпай";
  }

  $("studentResults").innerHTML =
    active.map(student => {
      const id = student.id;

      const oral = has(state.oral, id)
        ? state.oral[id]
        : "—";

      const quiz = has(state.quiz, id)
        ? state.quiz[id].points
        : "—";

      return `
        <tr>
          <td>${safe(student.name)}</td>

          <td>
            ${TEAMS[studentTeam(id)]}
          </td>

          <td>${oral}</td>
          <td>${quiz}</td>

          <td>
            <b>${personalPoints(id)}</b>
          </td>
        </tr>
      `;
    }).join("");
}

// ==========================================
// 19. КОНСПЕКТІНІ КӨШІРУ
// ==========================================

$("copyNotes").addEventListener(
  "click",
  async () => {
    const text = $("notesContent").innerText;

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(text);
      } else {
        const area =
          document.createElement("textarea");

        area.value = text;
        area.style.position = "fixed";
        area.style.opacity = "0";

        document.body.appendChild(area);
        area.select();

        const copied =
          document.execCommand("copy");

        area.remove();

        if (!copied) {
          throw new Error("Copy failed");
        }
      }

      alert("✅ Конспект көшірілді!");
    } catch (error) {
      alert(
        "Автоматты көшіру мүмкін болмады. " +
        "Мәтінді қолмен белгілеп көшір."
      );
    }
  }
);

// ==========================================
// 20. ЖАҢА САБАҚ
// ==========================================

$("resetLesson").addEventListener(
  "click",
  () => {
    const confirmed = confirm(
      "Жаңа сабақ бастаймыз ба? " +
      "Барлық бағалар мен қатысу белгілері тазаланады."
    );

    if (!confirmed) return;

    state = initialState();

    save();
    stopVideo();
    goTo(0);
  }
);

// ==========================================
// 21. БАРЛЫҚ БЕТТІ ЖАҢАРТУ
// ==========================================

function refresh() {
  renderAttendance();
  renderTeamRoster();

  renderOral();
  renderQuiz();

  renderBattle();
  renderLogic();
  renderCreative();

  renderScores();

  updateClock();
}

// ==========================================
// 22. САЙТТЫ ІСКЕ ҚОСУ
// ==========================================

function initialize() {
  const page = Math.max(
    0,
    Math.min(
      PAGE_COUNT - 1,
      Number(state.page) || 0
    )
  );

  goTo(page);
}

initialize();
