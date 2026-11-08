/* Ortak yardımcılar: DOM, şablonlar, ses, depolama, QR, bildirim. Sunum ve öğrenci sayfası birlikte kullanır. */
(function(){
const Y = window.Y = {};

Y.$ = (s, r=document) => r.querySelector(s);
Y.$$ = (s, r=document) => Array.from(r.querySelectorAll(s));
Y.h = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
Y.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
Y.icon = (n, cls='') => `<i data-lucide="${n}" class="${cls}"></i>`;
Y.icons = root => { if (window.lucide) lucide.createIcons({ attrs:{ 'stroke-width':1.9 }, nameAttr:'data-lucide', root: root || document }); };
Y.sleep = ms => new Promise(r => setTimeout(r, ms));
Y.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
Y.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

Y.store = {
  get(k, d=null){ try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del(k){ try { localStorage.removeItem(k); } catch {} }
};

let toastT;
Y.toast = (msg, ms=2600) => {
  const el = document.getElementById('toast'); if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), ms);
};

/* Sınav şıkları: renk + şekil (yalnız renge dayanmamak için) */
Y.SHAPES = [
  '<svg viewBox="0 0 24 24"><path d="M12 3 L22 20 H2 Z"/></svg>',
  '<svg viewBox="0 0 24 24"><path d="M12 2 L22 12 L12 22 L2 12 Z"/></svg>',
  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
  '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'
];

/* Görseller pptx'ten çıkarıldı: assets/img/sNN-K.jpg (NN = slayt no) */
Y.img = (slide, k=1, base='') => `${base}assets/img/s${String(slide).padStart(2,'0')}-${k}.jpg`;

/* Sahne şablonları */
Y.T = {
  head(kicker, title, lead){
    return `<div class="s-head">${kicker?`<div class="kicker a">${kicker}</div>`:''}<h2 class="s-title a">${title}</h2>${lead?`<p class="s-lead a">${lead}</p>`:''}</div>`;
  },
  card({ icon, title, text='', tone='', num='', cls='', step }){
    return `<div class="card a ${tone} ${cls}" ${step?`data-step="${step}"`:''}>${num?`<span class="num">${num}</span>`:''}${icon?`<div class="ic">${Y.icon(icon)}</div>`:''}<h3>${title}</h3>${text?`<p>${text}</p>`:''}</div>`;
  },
  photo(slide, k=1, cap='', cls='', style=''){
    return `<figure class="photo a ${cls}" style="${style}" data-cap="${Y.esc(cap)}"><img src="${Y.img(slide,k)}" alt="${Y.esc(cap||'Klinik görsel')}" loading="lazy" decoding="async">${cap?`<figcaption>${cap}</figcaption>`:''}</figure>`;
  },
  bullets(items, cls=''){
    return `<ul class="bullets ${cls}">${items.map(i => `<li class="a">${i}</li>`).join('')}</ul>`;
  },
  callout(text, tone='', icon='triangle-alert'){
    return `<div class="callout a ${tone}">${Y.icon(icon)}<div>${text}</div></div>`;
  }
};

/* Görsele tıklayınca büyüt */
document.addEventListener('click', e => {
  const f = e.target.closest('.photo'); if (!f) return;
  const img = f.querySelector('img');
  const lb = Y.h(`<div class="lightbox" role="dialog" aria-label="Görsel büyütüldü"><div><img src="${img.src}" alt="${Y.esc(img.alt)}"><p>${Y.esc(f.dataset.cap||'')}</p></div></div>`);
  lb.addEventListener('click', () => lb.remove());
  document.body.appendChild(lb);
  if (window.gsap) gsap.from(lb.querySelector('img'), { scale:.9, opacity:0, duration:.35, ease:'power3.out' });
});

/* Sayaç animasyonu */
Y.countUp = (el, to, { dur=1.2, dec=0, suffix='', prefix='' }={}) => {
  const o = { v:0 };
  if (!window.gsap || Y.reduced) { el.textContent = prefix + to.toFixed(dec) + suffix; return; }
  gsap.to(o, { v:to, duration:dur, ease:'power2.out', onUpdate(){ el.textContent = prefix + o.v.toFixed(dec).replace('.', ',') + suffix; } });
};

/* QR (qrcode-generator) → SVG dizesi */
Y.qr = (text, cell=8) => {
  const q = qrcode(0, 'M'); q.addData(text); q.make();
  return q.createSvgTag({ cellSize:cell, margin:0, scalable:false });
};

/* ——— Ses: WebAudio sentezi (dosya yok) ——— */
Y.Sfx = (() => {
  let ctx, on = Y.store.get('yara_sound', true), master;
  const ac = () => {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = .5; master.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  function tone(f, t=0, d=.18, type='sine', g=.25, slide){
    if (!on) return; const c = ac(), o = c.createOscillator(), v = c.createGain(), s = c.currentTime + t;
    o.type = type; o.frequency.setValueAtTime(f, s); if (slide) o.frequency.exponentialRampToValueAtTime(slide, s + d);
    v.gain.setValueAtTime(0, s); v.gain.linearRampToValueAtTime(g, s + .012); v.gain.exponentialRampToValueAtTime(.0001, s + d);
    o.connect(v); v.connect(master); o.start(s); o.stop(s + d + .05);
  }
  function noise(t=0, d=.3, g=.2, hp=800){
    if (!on) return; const c = ac(), len = c.sampleRate * d, b = c.createBuffer(1, len, c.sampleRate), data = b.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(), f = c.createBiquadFilter(), v = c.createGain(), s = c.currentTime + t;
    src.buffer = b; f.type = 'highpass'; f.frequency.value = hp;
    v.gain.setValueAtTime(g, s); v.gain.exponentialRampToValueAtTime(.0001, s + d);
    src.connect(f); f.connect(v); v.connect(master); src.start(s);
  }
  return {
    get on(){ return on; },
    toggle(){ on = !on; Y.store.set('yara_sound', on); if (on) this.pop(); return on; },
    unlock(){ try { ac(); } catch {} },
    tick(){ tone(1200, 0, .05, 'square', .06); },
    tock(){ tone(800, 0, .06, 'square', .08); },
    pop(){ tone(520, 0, .12, 'sine', .22, 900); },
    whoosh(){ noise(0, .35, .08, 1800); },
    join(){ tone(660, 0, .1, 'triangle', .18); tone(990, .07, .14, 'triangle', .16); },
    lock(){ tone(440, 0, .08, 'triangle', .2); tone(330, .06, .1, 'triangle', .18); },
    correct(){ [523, 659, 784, 1046].forEach((f, i) => tone(f, i * .08, .25, 'triangle', .2)); },
    wrong(){ tone(220, 0, .3, 'sawtooth', .1, 140); },
    reveal(){ tone(392, 0, .5, 'sine', .2); tone(587, .05, .6, 'sine', .15); noise(0, .25, .05, 4000); },
    drum(sec=2.4){ if (!on) return; for (let t = 0; t < sec; t += .055) noise(t, .05, .07 + (t / sec) * .18, 200); },
    cymbal(){ noise(0, 1.4, .25, 3000); },
    fanfare(){ [[523,0],[659,.12],[784,.24],[1046,.36],[784,.6],[1046,.72]].forEach(([f, t]) => { tone(f, t, .35, 'triangle', .22); tone(f / 2, t, .35, 'sine', .12); }); },
    countdown(n){ tone(n ? 600 : 900, 0, n ? .12 : .4, 'triangle', .25); }
  };
})();
})();
