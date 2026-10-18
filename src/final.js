/* ================= final sınavı ================= */
const FINAL_N = 20, FINAL_TIME = 30;
function buildPool() {
  return LEVELS.map((l) => {
    const qs = [];
    l.rounds.forEach((r) => {
      if (r.type === 'quiz') r.questions.forEach((q) => qs.push({ ...q, topic: l.id }));
      if (r.type === 'tf') r.items.forEach((it) => qs.push({ ...tfToQ(it), topic: l.id }));
    });
    return shuffle(qs);
  });
}
function pickBalanced(groups, n) {
  const g = groups.map((a) => [...a]), out = [];
  while (out.length < n && g.some((a) => a.length)) g.forEach((a) => { if (a.length && out.length < n) out.push(a.shift()); });
  return shuffle(out);
}
function renderFinalIntro() {
  stopRun(); current = { screen: 'final' };
  const fin = Store.data.final;
  swap(h('main', { class: 'wrap' },
    h('div', { class: 'intro-head' },
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Bölümlere dön', html: ICON.back, onclick: renderMenu }),
      h('div', { class: 'lvl-ic', style: { '--c': '#2E3B44' }, html: LEVEL_ICONS.cap }),
      h('div', {}, h('p', { class: 'eyebrow', style: { marginBottom: '4px' } }, 'Tüm bölümler'), h('h1', {}, 'Final sınavı'))),
    h('section', { class: 'stage' },
      h('div', { class: 'refs' },
        h('article', { class: 'ref' }, h('h3', {}, 'Kurallar'), h('ul', {},
          h('li', { html: `<b>${FINAL_N} soru</b>, altı bölümden dengeli dağıtılır.` }),
          h('li', { html: `Her soru için <b>${FINAL_TIME} saniye</b>; süre dolarsa yanlış sayılır.` }),
          h('li', { html: 'Eldiven yok: sınav sonuna kadar sürer.' }),
          h('li', { html: 'Sonunda konu konu karne alırsın.' }))),
        h('article', { class: 'ref' }, h('h3', {}, 'Derece'), h('ul', {},
          h('li', { html: '<b>%85+</b> Steril usta' }), h('li', { html: '<b>%70+</b> Güvenli uygulayıcı' }),
          h('li', { html: '<b>%50+</b> Gelişmekte' }), h('li', { html: '<b>%50 altı</b> Tekrar gerekli' }),
          fin ? h('li', { html: `En iyi sonucun: <b>${fin.correct}/${fin.total}</b> · ${fin.grade}` }) : null))),
      h('div', { class: 'q-actions', style: { marginTop: '18px' } },
        h('button', { class: 'btn primary', type: 'button', onclick: () => { Sound.ensure(); runFinal(); } }, 'Sınavı başlat')))));
}
const gradeOf = (p) => (p >= 0.85 ? 'Steril usta' : p >= 0.7 ? 'Güvenli uygulayıcı' : p >= 0.5 ? 'Gelişmekte' : 'Tekrar gerekli');
async function runFinal() {
  stopRun(); current = { screen: 'final' };
  const qs = pickBalanced(buildPool(), FINAL_N);
  const by = {}; LEVELS.forEach((l) => (by[l.id] = { c: 0, t: 0 }));
  const fr = {
    dead: false, correct: 0, streak: 0,
    good(el, _s, q) { this.correct++; this.streak++; by[q.topic].c++; Sound.ok(); if (el) { const r = el.getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, 14); } upd(); },
    bad(el) { this.streak = 0; Sound.bad(); shake(el); upd(); return true; },
  };
  activeRun = fr;
  const body = h('div', { class: 'stage-body' });
  const scoreEl = h('div', { class: 'score' }, '0');
  const tp = h('div', {});
  const titleEl = h('b', {}, 'Soru 1');
  function upd() { scoreEl.textContent = `${fr.correct} ✓`; }
  swap(h('main', { class: 'wrap' },
    h('div', { class: 'play-head', style: { gridTemplateColumns: 'auto minmax(0,1fr) auto' } },
      h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Sınavdan çık', html: ICON.back, onclick: renderFinalIntro }),
      h('div', { class: 'ph-title' }, h('small', {}, 'Final sınavı'), titleEl), scoreEl),
    tp, h('section', { class: 'stage' }, body)));
  for (let i = 0; i < qs.length; i++) {
    if (fr.dead) return;
    const q = qs[i]; by[q.topic].t++;
    titleEl.textContent = `Soru ${i + 1}/${qs.length}`;
    tp.replaceChildren(tape((i / qs.length) * 100));
    await askQuestion(body, q, fr, q.fixed ? 'Doğru mu, yanlış mı?' : 'Çoktan seçmeli', { time: FINAL_TIME, topic: LEVELS.find((l) => l.id === q.topic).title, last: i === qs.length - 1 });
  }
  if (fr.dead) return;
  activeRun = null;
  const p = fr.correct / qs.length, grade = gradeOf(p);
  const prev = Store.data.final;
  if (!prev || fr.correct > prev.correct) { Store.data.final = { correct: fr.correct, total: qs.length, grade }; Store.save(); }
  swap(h('main', { class: 'wrap' }, h('section', { class: 'result' },
    h('p', { class: 'eyebrow' }, 'Final sınavı karnesi'),
    h('div', { class: 'big-stars', html: starsHTML(p >= 0.85 ? 3 : p >= 0.7 ? 2 : p >= 0.5 ? 1 : 0) }),
    h('h1', {}, grade),
    h('p', { class: 'prompt', style: { margin: 0 } }, `${qs.length} sorudan ${fr.correct} doğru (%${Math.round(p * 100)}).`),
    h('div', { class: 'karne' },
      LEVELS.filter((l) => by[l.id].t).map((l) => {
        const v = by[l.id], pc = (v.c / v.t) * 100;
        return h('div', { class: 'karne-row' }, h('span', {}, l.title), tape(pc), h('span', { class: 'mono' }, `${v.c}/${v.t}`));
      })),
    h('p', { class: 'foot-note', style: { marginTop: 0 } }, 'İndikatör bandı ne kadar koyuysa o konuda o kadar güvendesin. Zayıf kalan bölümü yeniden oynayabilirsin.'),
    h('div', { class: 'res-actions' },
      h('button', { class: 'btn primary', type: 'button', onclick: runFinal }, 'Yeniden gir'),
      h('button', { class: 'btn ghost', type: 'button', onclick: renderMenu }, 'Bölümler')))));
  if (p >= 0.7) setTimeout(() => FX.rain(), 200);
}

/* ================= açılış ================= */
function start(data) {
  Store.load(); FX.init(); updateBar();
  $('#homeBtn').onclick = renderMenu;
  $('#soundBtn').onclick = () => { Store.data.sound = !Store.data.sound; Store.save(); updateBar(); if (Store.data.sound) Sound.tap(); };
  const s = data && data.screen;
  const lv = s === 'intro' && LEVELS.find((l) => l.id === data.id);
  if (lv) renderIntro(lv); else if (s === 'final') renderFinalIntro(); else renderMenu();
}
try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => ({ ...current })); } catch (e) { }
if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start);
else start((window.claude && window.claude.hot && window.claude.hot.data) || {});
