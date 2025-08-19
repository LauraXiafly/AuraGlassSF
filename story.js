const SLIDES = [
 
  {
    img: 'Pic/1.png',
    fragments: [
      {
        text: 'You wake at 9 AM to the gentle clatter of trams outside your window in downtown Melbourne.',
        top: 6,  left: 59, width: 34, headline: true
      },
      {
        text: 'As the morning light filters through your Aura Glass interface, a notification hovers: “Congrats—100 000 Subscribers!”',
        top: 15, left: 61, width: 32
      },
      {
        text: 'You smile, remembering how just months ago you were a small-time streamer. Back then, unboxing rare AR skins at midnight earned you your first viral spike.',
        top: 24, left: 63, width: 31
      },
      {
        text: 'On August 4th, you signed that life-changing contract with Aura Glass Corp.',
        top: 33, left: 65, width: 28
        
      }
      
    ],
    
},

  
  {
    img: 'Pic/2.png',
    fragments: [
      {
        text: '2. Aura Glass, as the latest generation of AR glasses platform, has already become an integral part of our daily lives. Its most distinctive feature is the customisable skin settings, which allow users to express their identity through avatars created via online customisation.',
        top: 6,  left: 6,  width: 40, headline: true
      },
      {
        text: 'Initially, some users were obsessed with customising their hairstyles and outfits for their virtual outings, while avant-garde artists took it to the next level with bold and creative designs, which brings the technology level to an identity expression.',
        top: 16, left: 6,  width: 36
      },
      {
        text: 'Later, Aura Glass partnered with companies like Disney and Apple to acquire the rights to use film and TV show skins, but using them comes at a hefty price.',
        top: 26, left: 6,  width: 38
      },
      {
        text: 'The signing of the contract with Aura Glass, then, means that you will be able to obtain rare AR skins earlier and help promote Aura Glass. For now, you would consider it a win-win situation.',
        top: 12, left: 56, width: 36
      }
    ]
  },

  {
    img: 'Pic/3.png',
    fragments: [
      {
        text: '3. Yesterday you boarded the early flight to Melbourne, boarding pass in one hand and assorted avatar presets in the glass in the other. The city welcomed you with its familiar hum—cafés, bicycles, towering glass façades.',
        top: 16, left: 8,  width: 38, headline: true
      },
      {
        text: 'Now, stepping through the doors of the cavernous convention center, you find yourself surrounded by a riot of self-expression: A pop-art comic face smiles as its dotted red and yellow skin shifts with each blink. Nearby, a man in neon samurai armour stands for photos, mist curling around his feet. Aura Con isn’t just a trade show—it’s a living gallery of identity',
        top: 28, left: 10, width: 38
      },
      {
        text: 'You pause at the Disney booth, where classic princess gowns have been repurposed as premium AR skins—but the price tags make you wince. Apple’s corner dazzles with cinematic avatars you can “rent,” reminding you how quickly selfhood has become a commodity.',
        top: 12, left: 58, width: 36
      },
      {
        text: "But today isn't about shopping—it's about sharing. As an aura-glass signed influencer, on the main stage you'll unveil a new retro skin of a classic movie character that Aura-glass corp just recently get the use of copyright.",
        top: 24, left: 60, width: 36
      }
    ]
  }
];



const FADE_MS = 800;          
const PAUSE_AFTER_MS = 2000;  
const FRAG_GAP_MS = FADE_MS + PAUSE_AFTER_MS;

const COLLISION_GAP = 14;   
const MAX_PUSH_TRIES = 60;    





// helped with copilot
function getInitialSlideIndex() {
  const url = new URL(window.location.href);
  const n = parseInt(url.searchParams.get('slide'), 10);
  if (!isNaN(n) && n >= 1 && n <= SLIDES.length) return n - 1;
  return 0;
}

let index = getInitialSlideIndex();
window.currentIndex = index;


const bgEl = document.getElementById('bg');
const dotsEl = document.getElementById('dots');
const goLiveEl = document.getElementById('goLive');


function renderDots() {
  dotsEl.innerHTML = '';
  for (let i = 0; i < SLIDES.length; i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i === index ? ' active' : '');
    d.title = `Go to slide ${i+1}`;
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }
}

const fragmentsLayer = document.getElementById('fragments');

function renderFragments(slide){
  if(!fragmentsLayer) return;
  fragmentsLayer.innerHTML = '';

  
  if (goLiveEl) {
    goLiveEl.classList.remove('show');
    goLiveEl.setAttribute('aria-hidden', 'true');
    goLiveEl.tabIndex = -1;
  }

  const placedRects = [];
  const overlap = (a, b) => !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);

  const frags = (slide.fragments || []);
  frags.forEach((frag, i) => {
    const el = document.createElement('div');
    el.className = 'fragment' + (frag.headline ? ' headline' : '');
    el.textContent = frag.text;

    el.style.left = frag.left + '%';
    if (frag.width) el.style.width = frag.width + 'vw';

    const rot = (Math.random()*2 - 1) * 1.2;
    el.style.transform += ` rotate(${rot}deg)`;

    fragmentsLayer.appendChild(el);

    let push = 0;
    el.style.top = `calc(${frag.top}% + ${push}px)`;

    let tries = 0;
    let rect = el.getBoundingClientRect();
    while (tries < MAX_PUSH_TRIES && placedRects.some(r => overlap(rect, r))) {
      push += COLLISION_GAP;
      el.style.top = `calc(${frag.top}% + ${push}px)`;
      rect = el.getBoundingClientRect();
      tries++;
    }
    placedRects.push(rect);

   
    const isLastFragment = (i === frags.length - 1);
    if (isLastFragment && goLiveEl) {
      el.addEventListener('transitionend', (ev) => {
        
        if (ev.propertyName !== 'opacity') return;
        
        if (index !== SLIDES.length - 1) return;

        goLiveEl.classList.add('show');
        goLiveEl.removeAttribute('aria-hidden');
        goLiveEl.tabIndex = 0;
      }, { once: true });
    }

    setTimeout(() => el.classList.add('show'), i * FRAG_GAP_MS);
  });
}




function renderSlide() {
  const s = SLIDES[index];
  bgEl.src = s.img;

 
  renderFragments(s);                

  ensureCornerNumber();
  document.querySelector('.corner-number').textContent = String(index + 1);
  renderDots();

  const url = new URL(window.location.href);
  url.searchParams.set('slide', String(index + 1));
  window.history.replaceState(null, '', url.toString());
}


renderSlide();

function ensureCornerNumber() {
  if (!document.querySelector('.corner-number')) {
    const n = document.createElement('div');
    n.className = 'corner-number';
    document.body.appendChild(n);
  }
}


function prev() { 
  index=(index-1+SLIDES.length)%SLIDES.length; 
  window.currentIndex=index; 
  renderSlide(); AUDIO.syncToSlide(index); 
}


function next() { 
  index=(index+1)%SLIDES.length;
   window.currentIndex=index; 
   renderSlide(); 
   AUDIO.syncToSlide(index);

  }

function goTo(i) {
  index = i;
  window.currentIndex = index;
  renderSlide();
  AUDIO.syncToSlide(index);
}
// Wire up controls
document.getElementById('prev').addEventListener('click', prev);
document.getElementById('next').addEventListener('click', next);

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
});

// === Slide 音频控制器 ===
// 映射：第0、1页 -> A；第2页 -> B；其它页静音
const AUDIO = {
  // 按你的页码需求改这里（0基）：0=第一页,1=第二页,2=第三页
  map: { 0: 'a', 1: 'a', 2: 'b' },

  players: {
    a: new Audio('Sound/1.MP3'),
    b: new Audio('Sound/con.MP3')
  },
  currentKey: null,   // 目前正在播放的 key: 'a' | 'b' | null
  started: false,

  init() {
    for (const p of Object.values(this.players)) {
      p.loop = true;
      p.preload = 'auto';
      p.volume = 0.28; // 初始音量可调
    }

    // 自动播放策略：先尝试，失败就等一次用户交互
    const kickOnce = async () => {
      this.started = true;
      // 让当前页的音频与初始页同步（需要你在初始化时把 currentIndex 设好，见下方集成）
      this.syncToSlide(window.currentIndex ?? 0, true);
      window.removeEventListener('pointerdown', kickOnce, true);
      window.removeEventListener('keydown', kickOnce, true);
    };
    window.addEventListener('pointerdown', kickOnce, true);
    window.addEventListener('keydown', kickOnce, true);
  },

  async syncToSlide(index, immediate = false) {
    const key = this.map[index];

    // 没有映射：全部暂停
    if (!key) {
      this.stopAll();
      this.currentKey = null;
      return;
    }

    // 已经在播同一首：确保在播即可（避免跨 1→2 重启）
    if (this.currentKey === key) {
      const p = this.players[key];
      if (p.paused) p.play().catch(() => {});
      return;
    }

    // 切换曲目：对上一首做淡出，新的淡入（保留各自播放进度）
    const toPlay = this.players[key];
    const toPause = this.currentKey ? this.players[this.currentKey] : null;
    this.currentKey = key;

    if (toPause) await this.fade(toPause, toPause.volume, 0, 250).finally(() => toPause.pause());

    const start = () => {
      toPlay.play().catch(() => {});
      this.fade(toPlay, 0, 0.28, 250);
    };
    if (immediate) start(); else start();
  },

  stopAll() {
    for (const p of Object.values(this.players)) p.pause();
  },

  fade(audio, from, to, ms) {
    audio.volume = from;
    const steps = 10;
    const step = (to - from) / steps;
    const interval = ms / steps;
    return new Promise((resolve) => {
      let i = 0;
      const id = setInterval(() => {
        i++;
        audio.volume = Math.max(0, Math.min(1, audio.volume + step));
        if (i >= steps) { clearInterval(id); audio.volume = to; resolve(); }
      }, interval);
    });
  }
};


window.addEventListener('pagehide', () => AUDIO.stopAll());
document.addEventListener('visibilitychange', () => {
  
  if (document.visibilityState === 'hidden') AUDIO.stopAll();
});



// ===== 4)（可选）页面变为可见时再试一次，防止 bfcache / 资源迟到 =====
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && !AUDIO.currentKey) {
    const idx = (typeof window.currentIndex === 'number') ? window.currentIndex : 0;
    AUDIO.syncToSlide(idx, true);
  }
}, { once: true });


const audio = document.getElementById('bg-audio');
const soundBtn = document.getElementById('sound-toggle');
let audioTried = false;

// ===== 在文件顶部 AUDIO 外面加一个标记 =====
let AUTOPLAY_STARTED = false;

// ===== tryMutedAutoplay 成功后设为 true =====
track.play().then(() => {
  console.log('[audio] muted autoplay started on', key);
  setTimeout(() => {
    for (const p of Object.values(AUDIO.players)) p.muted = false;
    AUDIO.fade(track, 0.0, 0.28, 350);
    AUDIO.currentKey = key;
    AUTOPLAY_STARTED = true; // <—— 加这一行
  }, 100);
})

// ===== kickOnce 里避免二次触发 =====
const kickOnce = async () => {
  this.started = true;
  if (!AUTOPLAY_STARTED) {
    this.syncToSlide(window.currentIndex ?? 0, true);
  }
  window.removeEventListener('pointerdown', kickOnce, true);
  window.removeEventListener('keydown',  kickOnce, true);
};
