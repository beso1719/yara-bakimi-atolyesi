/* ================= yardımcılar ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const NS = 'http://www.w3.org/2000/svg';
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
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = (n) => n.toLocaleString('tr-TR', { maximumFractionDigits: 1 });
const reduceMotion = (() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
const cssVar = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
let _uid = 0; const uid = (p) => p + (++_uid);

const ICON = {
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11V5a1.5 1.5 0 0 1 3 0v5M12 10V4a1.5 1.5 0 0 1 3 0v6M15 10V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1-5.5-3L4 13a1.5 1.5 0 0 1 2.3-2L9 13.5"/></svg>',
  soundOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  star: (on) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path class="${on ? 'star-on' : 'star-off'}" d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z"/></svg>`,
  glove: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="glove" d="M7.2 21.5v-5.2L4.3 12.4a1.5 1.5 0 0 1 2.3-1.9l1.8 2V4.6a1.3 1.3 0 0 1 2.6 0V10V3.3a1.3 1.3 0 0 1 2.6 0V10V4.2a1.3 1.3 0 0 1 2.6 0v6.3V6.4a1.3 1.3 0 0 1 2.6 0v8.8c0 3.6-2.3 6.3-5.6 6.3z"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>',
};
const starsHTML = (n, max = 3) => Array.from({ length: max }, (_, i) => ICON.star(i < n)).join('');

/* ================= kayıt ================= */
const STORE_KEY = 'yara-bakimi-atolyesi-v1';
const Store = {
  data: { levels: {}, final: null, sound: true },
  load() { try { const d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); if (d) this.data = { ...this.data, ...d, levels: d.levels || {} }; } catch (e) { } },
  save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) { } },
};

/* ================= ses ================= */
const Sound = {
  ctx: null,
  ensure() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => { });
    return this.ctx;
  },
  tone(freq, dur = 0.12, type = 'sine', when = 0, vol = 0.1) {
    if (!Store.data.sound) return;
    const c = this.ensure(); if (!c) return;
    const t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.03);
  },
  ok() { this.tone(660, 0.1, 'triangle'); this.tone(990, 0.18, 'triangle', 0.08); },
  bad() { this.tone(196, 0.22, 'sawtooth', 0, 0.05); this.tone(147, 0.28, 'sawtooth', 0.07, 0.045); },
  tap() { this.tone(540, 0.05, 'sine', 0, 0.04); },
  win() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.2, 'triangle', i * 0.09, 0.09)); },
};

/* ================= efektler ================= */
const FX = {
  cv: null, ctx: null, parts: [], raf: 0,
  init() {
    this.cv = $('#fx'); this.ctx = this.cv.getContext('2d');
    const rs = () => { const d = window.devicePixelRatio || 1; this.cv.width = innerWidth * d; this.cv.height = innerHeight * d; this.ctx.setTransform(d, 0, 0, d, 0, 0); };
    rs(); addEventListener('resize', rs);
  },
  burst(x, y, n = 22) {
    if (reduceMotion || !this.ctx) return;
    const cols = [cssVar('--teal'), '#E6A817', cssVar('--ok'), '#F3EEE3', '#E4552F'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 5;
      this.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3, r: 2 + Math.random() * 4, c: cols[i % cols.length], life: 1, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, sq: Math.random() < 0.55 });
    }
    if (!this.raf) this.raf = requestAnimationFrame(() => this.loop());
  },
  rain() { for (let i = 0; i < 6; i++) setTimeout(() => this.burst(Math.random() * innerWidth, innerHeight * (0.1 + Math.random() * 0.3), 34), i * 130); },
  loop() {
    const c = this.ctx; c.clearRect(0, 0, innerWidth, innerHeight);
    this.parts = this.parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
    for (const p of this.parts) {
      p.vy += 0.17; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.011;
      c.globalAlpha = Math.max(0, p.life); c.fillStyle = p.c; c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
      if (p.sq) c.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { c.beginPath(); c.arc(0, 0, p.r / 1.4, 0, 7); c.fill(); }
      c.restore();
    }
    c.globalAlpha = 1;
    this.raf = this.parts.length ? requestAnimationFrame(() => this.loop()) : 0;
  },
};
function shake(el) { if (!el) return; el.classList.remove('shake'); void el.getBoundingClientRect(); el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 500); }
function floatText(el, text) {
  if (!el) return; const r = el.getBoundingClientRect();
  const f = h('div', { class: 'floater', style: { left: r.left + r.width / 2 + 'px', top: r.top + 4 + 'px' } }, text);
  document.body.append(f); setTimeout(() => f.remove(), 950);
}
function toast(kind, title, text, ms = 5600) {
  const t = $('#toast');
  t.className = 'toast ' + kind; t.innerHTML = '';
  t.append(
    h('div', { class: 'toast-ic', 'aria-hidden': 'true' }, kind === 'ok' ? '✓' : kind === 'bad' ? '!' : 'i'),
    h('div', { class: 'toast-body' }, h('strong', {}, title), text ? h('p', {}, text) : null),
    h('button', { class: 'toast-x', type: 'button', 'aria-label': 'Kapat', onclick: () => t.classList.remove('show') }, '×'),
  );
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
}
const hideToast = () => { clearTimeout(toast._t); $('#toast').classList.remove('show'); };

/* ================= sürükle-bırak + dokun ================= */
let _hoverEl = null;
function setHover(under) {
  const t = under ? under.closest('.droppable') : null;
  if (t === _hoverEl) return;
  if (_hoverEl) _hoverEl.classList.remove('hover');
  _hoverEl = t; if (t) t.classList.add('hover');
}
function enableDrag(el, { onTap, onDrop }) {
  let sx = 0, sy = 0, ghost = null, pid = null, moved = false, ox = 0, oy = 0;
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || el.disabled) return;
    sx = e.clientX; sy = e.clientY; moved = false; pid = e.pointerId;
    try { el.setPointerCapture(pid); } catch (err) { }
  });
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid) return;
    if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) {
      moved = true; const r = el.getBoundingClientRect(); ox = sx - r.left; oy = sy - r.top;
      ghost = el.cloneNode(true); ghost.classList.add('drag-ghost'); ghost.classList.remove('sel'); ghost.style.width = r.width + 'px';
      document.body.append(ghost); el.classList.add('dragging');
    }
    if (moved) {
      ghost.style.transform = `translate(${e.clientX - ox}px, ${e.clientY - oy}px) rotate(-2deg)`;
      setHover(document.elementFromPoint(e.clientX, e.clientY));
    }
  });
  const end = (e) => {
    if (e.pointerId !== pid) return; pid = null;
    if (moved) {
      const under = document.elementFromPoint(e.clientX, e.clientY);
      ghost && ghost.remove(); ghost = null; el.classList.remove('dragging'); setHover(null);
      if (e.type === 'pointerup') onDrop(under);
    } else if (e.type === 'pointerup') onTap();
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } });
}
function onActivate(el, fn) {
  el.addEventListener('click', fn);
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
}

/* ================= ekran yönetimi ================= */
let current = { screen: 'menu' };
let activeRun = null;
function swap(node) {
  hideToast();
  $$('.overlay').forEach((o) => o.remove());
  const app = $('#app'); app.replaceChildren(node);
  node.classList.add('enter');
  window.scrollTo(0, 0);
}
function stopRun() { if (activeRun) activeRun.dead = true; activeRun = null; }
function updateBar() {
  const total = LEVELS.reduce((s, l) => s + ((Store.data.levels[l.id] || {}).stars || 0), 0);
  $('#starPill').innerHTML = ICON.star(true) + `<span class="mono">${total}/${LEVELS.length * 3}</span>`;
  const sb = $('#soundBtn');
  sb.innerHTML = Store.data.sound ? ICON.soundOn : ICON.soundOff;
  sb.setAttribute('aria-label', Store.data.sound ? 'Sesi kapat' : 'Sesi aç');
}
function tape(p, label, right) {
  return h('div', {},
    label ? h('div', { class: 'tape-label' }, h('span', {}, label), right ? h('span', { class: 'mono' }, right) : null) : null,
    h('div', { class: 'tape', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(p)) }, h('i', { style: { '--p': p + '%' } })));
}

/* ================= menü ================= */
function renderMenu() {
  stopRun(); current = { screen: 'menu' };
  const total = LEVELS.reduce((s, l) => s + ((Store.data.levels[l.id] || {}).stars || 0), 0);
  const max = LEVELS.length * 3;
  const next = LEVELS.find((l) => !(Store.data.levels[l.id] || {}).stars) || LEVELS[0];
  const fin = Store.data.final;

  const hero = h('section', { class: 'hero' },
    h('div', { class: 'hero-text' },
      h('p', { class: 'eyebrow' }, 'Hemşirelik · Yara bakımı ve aseptik teknik'),
      h('h1', { html: 'Yarayı evresiyle tanı, <em>steril</em> kal.' }),
      h('p', { class: 'lede' }, 'Yanık derinliği, bası yarası evreleri ve cerrahi kesinin iyileşme fazları; ardından doğru tedavi seçimi ve aseptik pansuman. Her hata bir eldivene mal olur, 5 eldivenin var.'),
      h('div', { class: 'hero-cta' },
        h('button', { class: 'btn primary', type: 'button', onclick: () => renderIntro(next) }, total ? `Devam et: ${next.title}` : 'Başla: ' + next.title),
        h('button', { class: 'btn ghost', type: 'button', onclick: renderFinalIntro }, 'Final sınavı'))),
    heroPanel(total, max));

  const cards = h('div', { class: 'levels' }, LEVELS.map((l, i) => {
    const rec = Store.data.levels[l.id] || {};
    return h('button', { class: 'lvl', type: 'button', style: { '--c': l.color }, onclick: () => renderIntro(l), 'aria-label': `Bölüm ${i + 1}: ${l.title}` },
      rec.stars ? h('span', { class: 'done-tag' }, 'Tamamlandı') : null,
      h('div', { class: 'lvl-top' }, h('div', { class: 'lvl-ic', html: LEVEL_ICONS[l.icon] })),
      h('div', {}, h('div', { class: 'lvl-num' }, `BÖLÜM ${String(i + 1).padStart(2, '0')}`), h('h3', {}, l.title)),
      h('p', {}, l.short),
      h('div', { class: 'lvl-foot' },
        h('span', {}, `${l.rounds.length} tur`, rec.score ? ` · rekor ${rec.score}` : ''),
        h('span', { class: 'stars', html: starsHTML(rec.stars || 0) })));
  }));

  const finalCard = h('div', { class: 'final-card' },
    h('div', { class: 'lvl-ic', html: LEVEL_ICONS.cap }),
    h('div', {}, h('h3', {}, 'Final sınavı'), h('p', {}, fin ? `En iyi sonucun: ${fin.correct}/${fin.total} doğru · ${fin.grade}` : 'Tüm bölümlerden karışık 20 soru, soru başına 30 saniye. Sonunda konu konu karne alırsın.')),
    h('button', { class: 'btn primary', type: 'button', onclick: renderFinalIntro }, 'Sınava gir'));

  swap(h('main', { class: 'wrap' }, hero,
    h('h2', { class: 'sec-title' }, 'Bölümler', h('small', {}, 'İstediğin sırayla oynayabilirsin')),
    cards, finalCard,
    h('p', { class: 'foot-note' }, 'İçerik lisans düzeyi hemşirelik eğitimi için özetlenmiştir (NPIAP 2016 bası yarası sınıflaması, Dokuzlar Kuralı, Parkland formülü, temel aseptik teknik ilkeleri). Kurumunuzun protokolleri ve hekim istemi her zaman önceliklidir.')));
}

function heroPanel(total, max) {
  const phases = [['hemo', 'Hemostaz', 'dakikalar – saatler'], ['infl', 'İnflamasyon', '0 – 4/6. gün'], ['prol', 'Proliferasyon', '4 – 21. gün'], ['mat', 'Maturasyon', '21. gün – 1-2 yıl']];
  const art = h('div', { class: 'hero-art', role: 'img', 'aria-label': 'Cerrahi kesinin iyileşme fazları animasyonu' });
  phases.forEach(([k], i) => { const d = h('div', { html: phaseArt(k) }).firstElementChild; d.style.opacity = i === 0 ? 1 : 0; art.append(d); });
  const capName = h('b', {}, phases[0][1]); const capTime = h('span', {}, phases[0][2]);
  const dots = h('div', { class: 'phase-dots' }, phases.map((_, i) => h('i', { class: i === 0 ? 'on' : '' })));
  let idx = 0;
  if (!reduceMotion) {
    const tick = () => {
      if (!art.isConnected) return;
      const svgs = $$('svg', art); svgs[idx].style.opacity = 0; idx = (idx + 1) % phases.length; svgs[idx].style.opacity = 1;
      capName.textContent = phases[idx][1]; capTime.textContent = phases[idx][2];
      $$('i', dots).forEach((d, i) => d.classList.toggle('on', i === idx));
      setTimeout(tick, 3000);
    };
    setTimeout(tick, 3000);
  }
  return h('div', { class: 'hero-panel' }, art,
    h('div', { class: 'hero-cap' }, h('div', {}, capName, ' ', capTime), dots),
    tape(max ? (total / max) * 100 : 0, 'Sterilizasyon indikatörü', `${total}/${max} yıldız`));
}

/* ================= hatırlatma ================= */
function renderIntro(level) {
  stopRun(); current = { screen: 'intro', id: level.id };
  const idx = LEVELS.indexOf(level);
  swap(h('main', { class: 'wrap' },
    h('div', { class: 'intro-head' },
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Bölümlere dön', html: ICON.back, onclick: renderMenu }),
      h('div', { class: 'lvl-ic', style: { '--c': level.color }, html: LEVEL_ICONS[level.icon] }),
      h('div', {}, h('p', { class: 'eyebrow', style: { marginBottom: '4px' } }, `Bölüm ${idx + 1} · Hatırlatma kartları`), h('h1', {}, level.title))),
    h('p', { class: 'prompt' }, 'Oyuna başlamadan önce kısa bir tekrar. Kartları okuduktan sonra turlara geç; her turdaki yanlışta kısa açıklama göreceksin.'),
    h('div', { class: 'refs' }, level.ref.map((r) => h('article', { class: 'ref' },
      r.art ? h('div', { class: 'ref-art', html: r.art() }) : null,
      h('h3', {}, r.t),
      h('ul', {}, r.b.map((li) => h('li', { html: li })))))),
    h('div', { class: 'sticky-cta' },
      h('button', { class: 'btn ghost', type: 'button', onclick: renderMenu }, 'Bölümler'),
      h('button', { class: 'btn primary', type: 'button', onclick: () => { Sound.ensure(); startRun(level); } }, `Oyuna başla · ${level.rounds.length} tur`))));
}

/* ================= oyun akışı ================= */
const MAX_LIVES = 5;
const TYPE_LABEL = { match: 'Eşleştir', order: 'Sırala', quiz: 'Vaka sorusu', tf: 'Doğru mu?', tbsa: '%TBSA hesabı', spots: 'Bul', swab: 'Uygula' };
class Run {
  constructor(level) { Object.assign(this, { level, lives: MAX_LIVES, score: 0, streak: 0, correct: 0, attempts: 0, roundIdx: 0, dead: false }); }
  good(el, silent) {
    if (this.dead) return; this.correct++; this.attempts++; this.streak++;
    const pts = 100 + Math.min(this.streak - 1, 5) * 20; this.score += pts;
    if (!silent) Sound.ok();
    if (el) { const r = el.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, 16); floatText(el, '+' + pts); }
    HUD.update(this);
  }
  bad(el) {
    if (this.dead) return false; this.attempts++; this.streak = 0; this.lives--; Sound.bad(); shake(el);
    HUD.update(this, true);
    if (this.lives <= 0) { this.dead = true; setTimeout(() => renderFail(this), 1400); return false; }
    return true;
  }
  spend(n) { this.score = Math.max(0, this.score - n); this.streak = 0; HUD.update(this); }
}
const HUD = {
  update(run, hit) {
    const lv = $('#hudLives'); if (!lv) return;
    $$('svg', lv).forEach((s, i) => s.classList.toggle('lost', i >= run.lives));
    if (hit) { lv.classList.remove('hit'); void lv.offsetWidth; lv.classList.add('hit'); }
    $('#hudScore').textContent = run.score;
    $('#hudStreak').textContent = run.streak >= 3 ? `${run.streak} seri!` : '';
  },
};
function startRun(level) {
  stopRun(); const run = new Run(level); activeRun = run; current = { screen: 'intro', id: level.id };
  playRun(run);
}
async function playRun(run) {
  const L = run.level;
  for (; run.roundIdx < L.rounds.length; run.roundIdx++) {
    const r = L.rounds[run.roundIdx];
    const body = mountRound(run, r);
    await ROUNDS[r.type](body, r, run);
    if (run.dead) return;
    await roundDone(run, r);
    if (run.dead) return;
  }
  renderResult(run);
}
function mountRound(run, r) {
  const L = run.level, n = L.rounds.length, i = run.roundIdx;
  const body = h('div', { class: 'stage-body' });
  swap(h('main', { class: 'wrap' },
    h('div', { class: 'play-head' },
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Bölümden çık', html: ICON.back, onclick: () => renderIntro(L) }),
      h('div', { class: 'ph-title' }, h('small', {}, `${L.title} · Tur ${i + 1}/${n}`), h('b', {}, r.title)),
      h('div', { class: 'lives', id: 'hudLives', 'aria-label': 'Kalan eldiven' }, Array.from({ length: MAX_LIVES }, () => h('span', { html: ICON.glove }).firstElementChild)),
      h('div', {}, h('div', { class: 'score', id: 'hudScore', 'aria-label': 'Puan' }, run.score), h('span', { class: 'streak', id: 'hudStreak' }))),
    tape((i / n) * 100),
    h('section', { class: 'stage' },
      h('div', { class: 'stage-h' }, h('h2', {}, r.title), h('span', { class: 'round-type' }, TYPE_LABEL[r.type])),
      r.prompt ? h('p', { class: 'prompt' }, r.prompt) : null,
      body)));
  HUD.update(run);
  return body;
}
function roundDone(run, r) {
  return new Promise((res) => {
    Sound.win();
    const st = $('.stage'); if (st) { const rc = st.getBoundingClientRect(); FX.burst(rc.left + rc.width / 2, Math.max(80, rc.top + 60), 50); }
    const last = run.roundIdx === run.level.rounds.length - 1;
    const btn = h('button', { class: 'btn primary', type: 'button' }, last ? 'Sonuçları gör' : 'Sonraki tur →');
    const ov = h('div', { class: 'overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Tur tamamlandı' },
      h('div', { class: 'ov-card', style: { animation: 'pop .45s' } },
        h('div', { class: 'ov-check', html: ICON.check }),
        h('h3', {}, 'Tur tamamlandı'),
        h('p', {}, r.title),
        h('p', { class: 'mono' }, `Puan ${run.score} · ${run.lives} eldiven`),
        btn));
    btn.onclick = () => { ov.remove(); hideToast(); res(); };
    setTimeout(() => { document.body.append(ov); btn.focus(); }, 650);
  });
}
function renderResult(run) {
  activeRun = null;
  const L = run.level, acc = run.attempts ? run.correct / run.attempts : 1;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const rec = Store.data.levels[L.id] || {};
  const best = !rec.score || run.score > rec.score;
  Store.data.levels[L.id] = { stars: Math.max(rec.stars || 0, stars), score: Math.max(rec.score || 0, run.score) };
  Store.save(); updateBar();
  const nextL = LEVELS[LEVELS.indexOf(L) + 1];
  swap(h('main', { class: 'wrap' }, h('section', { class: 'result' },
    h('p', { class: 'eyebrow' }, L.title + ' tamamlandı'),
    h('div', { class: 'big-stars', html: starsHTML(stars) }),
    h('h1', {}, stars === 3 ? 'Kusursuz aseptik!' : stars === 2 ? 'Güvenli uygulama' : 'Geçtin, tekrar et'),
    h('p', { class: 'prompt', style: { margin: 0 } }, stars === 3 ? 'Neredeyse hiç hata yapmadın. Bu bölümü klinikte de böyle uygula.' : 'Yanlış yaptığın turları tekrar oynayarak üç yıldıza çıkabilirsin.'),
    h('div', { class: 'stats' },
      h('div', { class: 'stat' }, h('b', {}, '%' + Math.round(acc * 100)), h('span', {}, 'Doğruluk')),
      h('div', { class: 'stat' }, h('b', {}, run.score), h('span', {}, best ? 'Puan · rekor' : 'Puan')),
      h('div', { class: 'stat' }, h('b', {}, `${run.lives}/${MAX_LIVES}`), h('span', {}, 'Eldiven')),
      h('div', { class: 'stat' }, h('b', {}, `${run.correct}/${run.attempts}`), h('span', {}, 'Doğru hamle'))),
    h('div', { class: 'res-actions' },
      h('button', { class: 'btn', type: 'button', onclick: () => startRun(L) }, 'Tekrar oyna'),
      nextL ? h('button', { class: 'btn primary', type: 'button', onclick: () => renderIntro(nextL) }, `Sonraki: ${nextL.title}`)
        : h('button', { class: 'btn primary', type: 'button', onclick: renderFinalIntro }, 'Final sınavına geç'),
      h('button', { class: 'btn ghost', type: 'button', onclick: renderMenu }, 'Bölümler')))));
  setTimeout(() => FX.rain(), 200);
}
function renderFail(run) {
  if (activeRun === run) activeRun = null;
  swap(h('main', { class: 'wrap' }, h('section', { class: 'result' },
    h('div', { class: 'fail-art', html: `<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" stroke-opacity=".15" stroke-width="2"/><g transform="translate(24 20) scale(3)" opacity=".9">${ICON.glove.replace(/<\/?svg[^>]*>/g, '')}</g><path d="M30 92L92 30" stroke="#C23E37" stroke-width="7" stroke-linecap="round"/></svg>` }),
    h('p', { class: 'eyebrow' }, run.level.title),
    h('h1', {}, 'Steril alan bozuldu'),
    h('p', { class: 'prompt', style: { margin: 0 } }, 'Beş eldivenin de kontamine oldu. Klinikte bu noktada eldiven değiştirilir ve işlem baştan hazırlanır. Hatırlatma kartlarına bir göz atıp yeniden dene.'),
    h('div', { class: 'res-actions' },
      h('button', { class: 'btn primary', type: 'button', onclick: () => startRun(run.level) }, 'Yeniden dene'),
      h('button', { class: 'btn', type: 'button', onclick: () => renderIntro(run.level) }, 'Hatırlatma kartları'),
      h('button', { class: 'btn ghost', type: 'button', onclick: renderMenu }, 'Bölümler')))));
}
