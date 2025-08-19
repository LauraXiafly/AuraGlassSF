/* ---------- 跳章节 ---------- */
function startDay() {
  window.location.href = 'chapter2.html';
}

/* ---------- 首页打字（在没有 #text 时自动跳过） ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const textDiv = document.getElementById('text');
  if (!textDiv) return;

  const lines = textDiv.dataset.lines
    ? JSON.parse(textDiv.dataset.lines)
    : [
        "Welcome back user404, Ronald",

        "It's 9 AM, OCT 18th, SYD",

        "Sorry, Location updated",

        "MELBOURNE",

        "Current local weather: 27 degrees, low wind",
        "Recommend avatar to match the weather today #AeolusShade612",
        "Check out the calendar for today."
      ];

  let lineIndex = 0;
  typeNextLine();

  function typeNextLine() {
    if (lineIndex >= lines.length) {
      const btn = document.getElementById('calendar-btn');
      if (btn) {
        btn.classList.remove('hidden');
        btn.addEventListener('click', () => {
          window.location.href = 'story.html';
        });
      }
      return;
    }

    const p = document.createElement('p');
    textDiv.appendChild(p);
    let charIndex = 0;
    const line = lines[lineIndex];
    const interval = setInterval(() => {
      p.textContent += line[charIndex++];
      if (charIndex === line.length) {
        clearInterval(interval);
        p.style.opacity = 1;
        lineIndex++;
        setTimeout(typeNextLine, 800);
      }
    }, 80);
  }
});

/* ---------- Modal：Note & Poster ---------- */
function openNoteModal(message) {
  const modal = document.getElementById('note-modal');
  const body  = document.getElementById('note-body');
  if (!modal || !body) return;
  body.textContent = message;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function openPosterModal(src, alt = 'poster') {
  const modal = document.getElementById('poster-modal');
  const img   = document.getElementById('poster-img');
  if (!modal || !img) return;
  if (src) img.src = src;    // 指定要显示的图片
  img.alt = alt;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.matches('[data-close]')) {
    closeModal(e.target.closest('.modal'));
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal.open');
    const last = openModals[openModals.length - 1];
    closeModal(last);
  }
});

/* ---------- 画一个月历的纯函数 ---------- */
function makeCalendarPanel({
  container,
  title,                   // "AUG '44"
  year,                    // 2044
  month,                   // 0-based: Aug=7, Sep=8, Oct=9
  events = {},             // { day: "label" }
  noteTexts = {},          // { day: "note content" }
  posterDay = null,        // number|null
  posterSrc = null,        // string|null  ← 指定该面板的海报图片
  highlightDay = null,     // number|null
  onHighlightClick = null, // function|null
  alignFirstToSunday = true
}) {
  const panel = document.createElement('section');
  panel.classList.add('calendar-panel');

  const h1 = document.createElement('h1');
  h1.textContent = title;
  panel.appendChild(h1);

  const grid = document.createElement('div');
  grid.classList.add('calendar');

  // 星期抬头
  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
    const hd = document.createElement('div');
    hd.classList.add('day','header');
    hd.textContent = d;
    grid.appendChild(hd);
  });

  // 计算月初与天数
  const firstDow    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // 月初占位（总是按真实星期对齐）
  for (let i = 0; i < firstDow; i++) {
    const pad = document.createElement('div');
    pad.classList.add('day');
    pad.style.border = 'none';
    grid.appendChild(pad);
  }

  // 填充日期
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.classList.add('day');

    const span = document.createElement('span');
    span.textContent = d;
    cell.appendChild(span);

    if (events[d]) {
      const ev = document.createElement('div');
      ev.classList.add('event');
      ev.textContent = events[d];
      cell.appendChild(ev);
    }

    // Note（若当天同时有 poster/highlight，则让位）
    if (noteTexts[d]) {
      cell.classList.add('clickable');
      cell.addEventListener('click', () => {
        if ((posterDay && d === posterDay) || (highlightDay && d === highlightDay)) return;
        openNoteModal(noteTexts[d]);
      });
    }

    // Poster（显式指定图片）
    if (posterDay && d === posterDay) {
      cell.classList.add('clickable');
      cell.addEventListener('click', () => {
        openPosterModal(posterSrc || null, `${title} ${d}`);
      });
    }

    // 高亮并可跳转
    if (highlightDay && d === highlightDay) {
      cell.classList.add('current');
      if (typeof onHighlightClick === 'function') {
        cell.addEventListener('click', onHighlightClick);
      }
    }

    grid.appendChild(cell);
  }

  panel.appendChild(grid);
  container.appendChild(panel);
}

/* ---------- 同页渲染三个月 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('calendar-container');
  if (!container) return;

  /* ===== AUG ===== */
  const augEvents = {
    1: "Subscription hit 100k",
    4: "Signed with Aura Glass — official influencer now",
    9: "Limited avatar “Spectral Glitch” dropped — sold out in 3h",
    19: "First collab stream with indie devs",
  };
  const augNotes = {
     1: "Never imagined unboxing rare skins could let me hit this amount of fans.", // ← 不显示 8/1 的 note
    4: "Contract signed. Early access to rare skins = growth engine.",
    9: "Jesus, How much will Aura Glass profit from this 'limited' drop?",
    19: "Indie tools are rough but inspiring—custom shaders need work.",
  };
  makeCalendarPanel({
    container,
    title: "AUG '44",
    year: 2044,            // 与 OCT 统一
    month: 7,              // 8 月
    events: augEvents,
    noteTexts: augNotes,
    alignFirstToSunday: true
  });

  // 给 8/1 绑定“点开海报 Pic/poster8.png”
  const calendars = document.querySelectorAll('.calendar-panel .calendar');
  const augCal = calendars[0]; // 假设顺序是 8 → 9 → 10 月
  if (augCal) {
    const firstDowAug = new Date(2044, 7, 1).getDay();
    const cellIndexAug1 = 7 + firstDowAug + 0; // 7个抬头 + 占位 + (1-1)
    const aug1Cell = augCal.children[cellIndexAug1];
    if (aug1Cell) {
      aug1Cell.classList.add('clickable');
      aug1Cell.addEventListener('click', () => {
        openPosterModal('Pic/poster8.png', 'AUG 1 Poster');
      });
    }
  }

  /* ===== SEP ===== */
  const sepEvents = {
    2:  "Rumor leak: new tiered pricing for identity rentals",
    7:  "Featured on “Virtual Vogue” podcast about digital identity",
    12: "Pre-Con AR workshop on avatar customization",
    22: "Brand rep hinted at traffic surcharge pilot",
    28: "Flight to Melbourne scheduled"
  };
  const sepNotes = {
    2:  "Leak may be deliberate hype — pricing model feels exploitative.",
    12: "Workshop brief: avoid IP skins on stage demo.",
    22: "Traffic surcharge = corporate paywall for visibility?",
    28: "Travel reminder: carry non-commercial fallback preset."
  };
  makeCalendarPanel({
    container,
    title: "SEP '44",
    year: 2044,
    month: 8,            // 9 月
    events: sepEvents,
    noteTexts: sepNotes
  });

  /* ===== OCT ===== */
  const octEvents = {
    7:  "Audience Q: 'Is identity rentable?'",
    13: "Backup: newsreel public-domain avatar verified",
    17: "Fly to Melbourne",
    18: "Aura-Con Melbourne Live starts",
  };
  const octNotes = {
    7:  "Audience question lingered in chat — commodification critique?",
    13: "Verification succeeded — fallback avatar ready.",
  };
  makeCalendarPanel({
    container,
    title: "OCT '44",
    year: 2044,
    month: 9,                  // 10 月
    events: octEvents,
    noteTexts: octNotes,
    posterDay: 17,             // 10/17 弹海报
    posterSrc: 'Pic/poster.png', // 10/17 指定海报（与 8/1 独立互不影响）
    highlightDay: 18,
    onHighlightClick: () => {
      window.location.href = 'story-live.html?slide=1';
    }
  });
});

/* ---------- 章节 2 背景音（仅在 chapter2.html 生效） ---------- */
(function () {
  const onChapter2 =
    (document.body && document.body.dataset.page === 'chapter2') ||
    /(^|\/)chapter2\.html$/i.test(location.pathname);

  if (!onChapter2) return;

  const audioEl = document.getElementById('bg-glitch') || new Audio('glitch.mp3');
  audioEl.loop = true;
  audioEl.preload = 'auto';
  audioEl.volume = 0.25;

  let started = false;

  async function startAudio() {
    if (started) return;
    try {
      await audioEl.play();
      started = true;
      window.removeEventListener('pointerdown', startAudioOnce, true);
      window.removeEventListener('keydown', startAudioOnce, true);
    } catch (err) {}
  }
  const startAudioOnce = () => startAudio();

  startAudio();
  window.addEventListener('pointerdown', startAudioOnce, true);
  window.addEventListener('keydown', startAudioOnce, true);

  window.addEventListener('pagehide', () => {
    try {
      audioEl.pause();
      audioEl.currentTime = 0;
    } catch {}
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && started && audioEl.paused) {
      audioEl.play().catch(() => {});
    } else if (document.visibilityState === 'hidden') {
      audioEl.pause();
    }
  });
})();
