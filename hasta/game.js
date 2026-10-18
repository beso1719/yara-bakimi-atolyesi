/* ================= yardımcılar ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) { if (kid == null || kid === false) continue; el.append(kid.nodeType ? kid : document.createTextNode(String(kid))); }
  return el;
}
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const reduceMotion = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
const STAR = (on) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${on ? '#FFC64A' : '#D3E5DD'}" stroke="${on ? '#E8A417' : '#C3D8CF'}" stroke-width="1" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>`;
const starsHTML = (n) => [0, 1, 2].map((i) => STAR(i < n)).join('');
const ICO = {
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  on: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  off: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
};

/* ================= kayıt ve ses ================= */
const KEY = 'yara-bakim-masasi-v1';
const Store = {
  d: { stars: {}, sound: true },
  load() { try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (v) this.d = { ...this.d, ...v, stars: v.stars || {} }; } catch (e) { } },
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch (e) { } },
};
const Sound = {
  ctx: null,
  tone(f, dur = 0.14, type = 'sine', when = 0, vol = 0.08) {
    if (!Store.d.sound) return;
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const c = this.ctx, t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
    } catch (e) { }
  },
  ok() { this.tone(784, 0.12, 'triangle'); this.tone(1175, 0.2, 'triangle', 0.09); },
  soft() { this.tone(330, 0.16, 'sine', 0, 0.07); this.tone(262, 0.22, 'sine', 0.1, 0.06); },
  tap() { this.tone(600, 0.05, 'sine', 0, 0.04); },
  win() { [523, 659, 784, 1046, 1318].forEach((f, i) => this.tone(f, 0.22, 'triangle', i * 0.1, 0.08)); },
};
const FX = {
  cv: null, c: null, p: [], raf: 0,
  init() { this.cv = $('#fx'); this.c = this.cv.getContext('2d'); const rs = () => { const d = window.devicePixelRatio || 1; this.cv.width = innerWidth * d; this.cv.height = innerHeight * d; this.c.setTransform(d, 0, 0, d, 0, 0); }; rs(); addEventListener('resize', rs); },
  burst(x, y, n = 26) {
    if (reduceMotion) return;
    const cols = ['#FF7563', '#FFC64A', '#3FA2DB', '#22A88F', '#FF9CC0'];
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = 2 + Math.random() * 5; this.p.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3.5, r: 3 + Math.random() * 4, col: cols[i % 5], life: 1, heart: Math.random() < 0.3 }); }
    if (!this.raf) this.raf = requestAnimationFrame(() => this.loop());
  },
  rain() { for (let i = 0; i < 7; i++) setTimeout(() => this.burst(Math.random() * innerWidth, innerHeight * (0.1 + Math.random() * 0.3), 30), i * 140); },
  loop() {
    const c = this.c; c.clearRect(0, 0, innerWidth, innerHeight);
    this.p = this.p.filter((q) => q.life > 0);
    for (const q of this.p) {
      q.vy += 0.16; q.x += q.vx; q.y += q.vy; q.life -= 0.012; c.globalAlpha = Math.max(0, q.life); c.fillStyle = q.col;
      c.beginPath();
      if (q.heart) { const r = q.r; c.moveTo(q.x, q.y + r); c.bezierCurveTo(q.x - r * 2, q.y - r * 0.5, q.x - r, q.y - r * 2, q.x, q.y - r * 0.8); c.bezierCurveTo(q.x + r, q.y - r * 2, q.x + r * 2, q.y - r * 0.5, q.x, q.y + r); }
      else c.arc(q.x, q.y, q.r, 0, 6.29);
      c.fill();
    }
    c.globalAlpha = 1; this.raf = this.p.length ? requestAnimationFrame(() => this.loop()) : 0;
  },
};

/* ================= ortak parçalar ================= */
let current = { screen: 'home' };
function swap(node) { $('#app').replaceChildren(node); window.scrollTo(0, 0); }
function topbar(back) {
  const snd = h('button', { class: 'round-btn', type: 'button', 'aria-label': Store.d.sound ? 'Sesi kapat' : 'Sesi aç', html: Store.d.sound ? ICO.on : ICO.off });
  snd.onclick = () => { Store.d.sound = !Store.d.sound; Store.save(); snd.innerHTML = Store.d.sound ? ICO.on : ICO.off; snd.setAttribute('aria-label', Store.d.sound ? 'Sesi kapat' : 'Sesi aç'); Sound.tap(); };
  return h('div', { class: 'topbar' },
    back ? h('button', { class: 'round-btn', type: 'button', 'aria-label': 'Ana sayfaya dön', html: ICO.back, onclick: renderHome }) : null,
    h('button', { class: 'logo', type: 'button', onclick: renderHome, 'aria-label': 'Ana sayfa' }, h('span', { html: LOGO }), h('b', {}, 'Yara Bakım Masası')),
    h('span', { class: 'sp' }), snd);
}
function warnBox(list) {
  return h('section', { class: 'warn' },
    h('h2', {}, 'Bu belirtiler varsa doktorunuza ya da hemşirenize başvurun'),
    h('div', { class: 'warn-list' }, list.map(([ic, t]) => h('div', { class: 'wl' }, h('span', { html: WARN_ICONS[ic] }), t))));
}

/* ================= ana sayfa ================= */
function renderHome() {
  current = { screen: 'home' };
  const cards = SCENARIOS.map((s) => h('button', { class: 'scn', type: 'button', onclick: () => renderPlay(s) },
    h('div', { class: 'scn-art', html: s.thumb() }), h('h3', {}, s.title), h('p', {}, s.short),
    h('div', { class: 'scn-foot' }, h('span', { class: 'tag' }, s.tag), h('span', { class: 'stars', html: starsHTML(Store.d.stars[s.id] || 0) }))));
  cards.push(h('button', { class: 'scn', type: 'button', onclick: renderTimeline },
    h('div', { class: 'scn-art', html: healScene(2) }), h('h3', {}, 'Yaram nasıl iyileşiyor?'), h('p', {}, 'Ameliyat yarasının günden güne değişimini resimlerle görün.'),
    h('div', { class: 'scn-foot' }, h('span', { class: 'tag' }, 'Takvim'), h('span', {}))));
  swap(h('main', { class: 'wrap' }, topbar(false),
    h('section', { class: 'hero' },
      h('div', {},
        h('h1', { html: 'Yara bakımını <span>oynayarak</span> öğrenin' }),
        h('p', {}, 'Masadaki malzemeleri sırayla seçin, Hemşire Deniz her adımda ne yaptığımızı ve nedenini anlatsın. Yanlış seçerseniz sorun değil, birlikte düzeltiriz.'),
        h('div', { class: 'row-btns', style: { justifyContent: 'flex-start', marginTop: '20px' } },
          h('button', { class: 'btn main', type: 'button', onclick: () => renderPlay(SCENARIOS[0]) }, 'Pansumanla başla'),
          h('button', { class: 'btn', type: 'button', onclick: renderTimeline }, 'İyileşme takvimi'))),
      h('div', { class: 'hero-art', html: bellyScene({ done: true, noHands: true }) })),
    h('div', { class: 'cards' }, cards)));
}

/* ================= oyun ================= */
function renderPlay(scn) {
  current = { screen: 'play', id: scn.id };
  const st = { i: 0, mistakes: 0, busy: false };
  const stage = h('div', { class: 'stage droppable', html: scn.scene() });
  const svg = $('svg', stage);
  const face = h('div', { class: 'face', html: faceSVG('worry') });
  const cap = h('div', { class: 'stage-cap', 'aria-hidden': 'true' });
  stage.append(face, cap);
  const A = {
    els: (n) => $$(`[data-l="${n}"]`, svg),
    on(n) { this.els(n).forEach((e) => e.classList.add('on')); },
    off(n) { this.els(n).forEach((e) => e.classList.remove('on')); },
    add(n, c) { this.els(n).forEach((e) => e.classList.add(c)); },
    pulse(n, ms) { this.on(n); setTimeout(() => this.off(n), ms); },
  };
  const strip = h('div', { class: 'strip', 'aria-label': 'Adımlar' });
  const drawStrip = () => {
    strip.replaceChildren(...scn.steps.map((s, i) => h('div', { class: 'dot' + (i < st.i ? ' done' : i === st.i ? ' now' : ''), title: i < st.i ? s.title : `${i + 1}. adım`, html: i < st.i ? itemSVG(s.item) : String(i + 1) })));
  };
  const bubbleBox = h('div', {});
  const say = (kind, title, text, why) => {
    cap.className = 'stage-cap ' + (kind || ''); cap.textContent = title;
    bubbleBox.replaceChildren(h('div', { class: 'bubble ' + (kind || ''), role: 'status', 'aria-live': 'polite' },
      h('h2', {}, title), h('p', {}, text), why ? h('p', { class: 'why' }, h('b', {}, 'Neden? '), why) : null));
  };
  const hintBtn = h('button', { class: 'btn blue', type: 'button' }, 'İpucu');
  hintBtn.onclick = () => {
    const step = scn.steps[st.i]; if (!step) return;
    say('', `${st.i + 1}. adım`, step.hint);
    const btn = $(`.item[data-id="${step.item}"]`, table);
    if (btn) { btn.classList.remove('hint'); void btn.offsetWidth; btn.classList.add('hint'); }
  };
  const ids = [...new Set([...scn.steps.map((s) => s.item), ...scn.distractors.map((d) => d.item)])];
  const table = h('section', { class: 'table', 'aria-label': 'Malzeme masası' }, h('p', { class: 'table-title' }, 'Masadaki malzemeler'));
  const grid = h('div', { class: 'items' });
  shuffle(ids).forEach((id) => {
    const b = h('button', { class: 'item', type: 'button', 'data-id': id, html: itemSVG(id) + `<span>${ITEMS[id].label}</span>` });
    enableDrag(b, { onTap: () => choose(id, b), onDrop: (u) => { if (u && u.closest('.stage')) choose(id, b); } });
    grid.append(b);
  });
  table.append(grid);

  function choose(id, btn) {
    if (st.busy) return;
    const step = scn.steps[st.i]; if (!step) return;
    if (id === step.item) {
      st.busy = true; Sound.ok();
      fly(btn, stage).then(() => {
        step.fx(A);
        if (step.face) face.innerHTML = faceSVG(step.face);
        say('yay', step.title, step.say, step.why);
        btn.classList.add('used');
        const r = stage.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, 22);
        st.i++; drawStrip();
        setTimeout(() => { st.busy = false; if (st.i === scn.steps.length) finish(); }, st.i === scn.steps.length ? 600 : 700);
      });
    } else {
      st.mistakes++; Sound.soft();
      btn.classList.remove('wiggle'); void btn.offsetWidth; btn.classList.add('wiggle');
      const d = scn.distractors.find((x) => x.item === id);
      if (d) say('oops', `${ITEMS[id].label} kullanılmaz`, d.why);
      else if (scn.steps.slice(st.i + 1).some((s) => s.item === id)) say('oops', 'Bunu birazdan kullanacağız', 'Önce başka bir adım var. Takılırsanız "İpucu" düğmesine dokunun.');
      else say('oops', 'Bu adımı yaptık', 'Şimdi sıradaki adıma geçelim.');
    }
  }
  function finish() {
    const stars = st.mistakes === 0 ? 3 : st.mistakes <= 2 ? 2 : 1;
    Store.d.stars[scn.id] = Math.max(Store.d.stars[scn.id] || 0, stars); Store.save();
    Sound.win(); FX.rain();
    const nextBtn = h('button', { class: 'btn main', type: 'button', onclick: () => renderDone(scn, stars) }, 'Hatırlatma kartını gör');
    bubbleBox.append(h('div', { class: 'row-btns', style: { justifyContent: 'flex-start', marginTop: '12px' } }, nextBtn));
  }

  drawStrip();
  say('', 'Merhaba!', scn.intro);
  swap(h('main', { class: 'wrap' }, topbar(true),
    h('div', { class: 'play' },
      h('div', { class: 'play-head' }, h('h1', {}, scn.title), strip),
      stage,
      h('div', { class: 'nurse' },
        h('div', { class: 'nurse-top' }, h('span', { html: NURSE }), h('div', {}, h('b', {}, 'Hemşire Deniz'), h('small', {}, 'Size adım adım eşlik ediyorum'))),
        bubbleBox,
        h('div', { class: 'nurse-actions' }, hintBtn, h('button', { class: 'btn', type: 'button', onclick: () => renderPlay(scn) }, 'Baştan başla'))),
      table)));
}

function fly(btn, stage) {
  const icon = $('svg', btn), a = icon.getBoundingClientRect(), b = stage.getBoundingClientRect();
  if (reduceMotion || !document.body.animate) return Promise.resolve();
  const f = h('div', { class: 'flyer', html: icon.outerHTML }); document.body.append(f);
  const x0 = a.left, y0 = a.top, x1 = b.left + b.width / 2 - 42, y1 = Math.max(10, b.top + b.height / 2 - 42);
  const an = f.animate([
    { transform: `translate(${x0}px,${y0}px) scale(.9)` },
    { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 70}px) scale(1.35) rotate(-12deg)`, offset: 0.45 },
    { transform: `translate(${x1}px,${y1}px) scale(1.5)`, opacity: 1, offset: 0.8 },
    { transform: `translate(${x1}px,${y1}px) scale(.5)`, opacity: 0 },
  ], { duration: 820, easing: 'cubic-bezier(.3,.7,.4,1)' });
  return an.finished.then(() => f.remove(), () => f.remove());
}
function enableDrag(el, { onTap, onDrop }) {
  let sx = 0, sy = 0, ghost = null, pid = null, moved = false, ox = 0, oy = 0, hover = null;
  el.addEventListener('pointerdown', (e) => { if (e.button !== 0) return; sx = e.clientX; sy = e.clientY; moved = false; pid = e.pointerId; try { el.setPointerCapture(pid); } catch (err) { } });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid) return;
    if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) {
      moved = true; const r = el.getBoundingClientRect(); ox = sx - r.left; oy = sy - r.top;
      ghost = el.cloneNode(true); Object.assign(ghost.style, { position: 'fixed', left: 0, top: 0, width: r.width + 'px', zIndex: 600, pointerEvents: 'none', margin: 0 });
      document.body.append(ghost); el.classList.add('dragging');
    }
    if (moved) {
      ghost.style.transform = `translate(${e.clientX - ox}px,${e.clientY - oy}px) rotate(-4deg) scale(1.05)`;
      const u = document.elementFromPoint(e.clientX, e.clientY), t = u && u.closest('.droppable');
      if (t !== hover) { if (hover) hover.classList.remove('drop'); hover = t; if (t) t.classList.add('drop'); }
    }
  });
  const end = (e) => {
    if (e.pointerId !== pid) return; pid = null;
    if (moved) {
      const u = document.elementFromPoint(e.clientX, e.clientY);
      ghost && ghost.remove(); ghost = null; el.classList.remove('dragging'); if (hover) hover.classList.remove('drop'); hover = null;
      if (e.type === 'pointerup') onDrop(u);
    } else if (e.type === 'pointerup') onTap();
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } });
}

/* ================= bitiş: hatırlatma kartı ================= */
function renderDone(scn, stars) {
  current = { screen: 'home' };
  swap(h('main', { class: 'wrap' }, topbar(true),
    h('section', { class: 'done' },
      h('div', { class: 'big-face', html: faceSVG('happy') }),
      h('div', { class: 'stars', html: starsHTML(stars), style: { transform: 'scale(1.6)', margin: '6px 0' } }),
      h('h1', {}, 'Harika, tamamladınız!'),
      h('p', { style: { fontSize: '1.15rem', color: 'var(--ink-2)', maxWidth: '52ch' } }, `${scn.title}: evde hatırlamanız gereken adımlar aşağıda. Bu sayfanın ekran görüntüsünü alıp saklayabilirsiniz.`),
      h('div', { class: 'recap' }, scn.steps.map((s, i) => h('div', { class: 'rc' }, h('span', { html: itemSVG(s.item) }),
        h('div', {}, h('b', {}, h('span', { class: 'n' }, `${i + 1}. `), s.title), h('small', {}, s.say))))),
      scn.distractors.length ? h('section', { class: 'warn', style: { background: '#FFEDEA', borderColor: '#FFB3A6' } },
        h('h2', {}, 'Bunları yapmayın'),
        h('div', { class: 'warn-list' }, scn.distractors.map((d) => h('div', { class: 'wl' }, h('span', { html: itemSVG(d.item) }), ITEMS[d.item].label)))) : null,
      warnBox(scn.warn),
      h('div', { class: 'row-btns' },
        h('button', { class: 'btn main', type: 'button', onclick: () => renderPlay(scn) }, 'Tekrar oyna'),
        h('button', { class: 'btn', type: 'button', onclick: renderHome }, 'Diğer konular')))));
  setTimeout(() => FX.rain(), 150);
}

/* ================= iyileşme takvimi ================= */
function renderTimeline() {
  current = { screen: 'timeline' };
  let i = 0;
  const art = h('div', { class: 'tl-art' });
  const card = h('div', {});
  const range = h('input', { type: 'range', id: 'tlRange', min: '0', max: String(HEAL_INFO.length - 1), step: '1', value: '0', 'aria-label': 'İyileşme zamanı' });
  const btns = h('div', { class: 'tl-steps' }, HEAL_INFO.map((x, k) => h('button', { type: 'button', onclick: () => show(k) }, x.when)));
  function show(k) {
    i = k; range.value = k; Sound.tap();
    art.innerHTML = healScene(k);
    $$('button', btns).forEach((b, j) => b.classList.toggle('on', j === k));
    const x = HEAL_INFO[k];
    card.replaceChildren(h('div', { class: 'tl-card' }, h('span', { class: 'when' }, x.when), h('h2', {}, x.t), h('p', {}, x.d),
      h('div', { class: 'todo' }, x.todo.map((t) => h('div', {}, t)))));
  }
  range.addEventListener('input', () => show(+range.value));
  swap(h('main', { class: 'wrap' }, topbar(true),
    h('h1', { style: { fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '6px' } }, 'Yaram nasıl iyileşiyor?'),
    h('p', { style: { color: 'var(--ink-2)', marginBottom: '16px', fontSize: '1.1rem' } }, 'Kaydırıcıyı sürükleyin ya da bir zamana dokunun; ameliyat izinin nasıl değiştiğini görün.'),
    h('div', { class: 'tl' }, h('div', {}, art, range, btns), card),
    h('div', { style: { marginTop: '20px' } }, warnBox(SCENARIOS[0].warn))));
  show(0);
}

/* ================= açılış ================= */
function start(data) {
  Store.load(); FX.init();
  const s = data && data.screen, scn = s === 'play' && SCENARIOS.find((x) => x.id === data.id);
  if (scn) renderPlay(scn); else if (s === 'timeline') renderTimeline(); else renderHome();
}
try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => ({ ...current })); } catch (e) { }
if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start);
else start((window.claude && window.claude.hot && window.claude.hot.data) || {});
