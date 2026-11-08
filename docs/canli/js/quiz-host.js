/* Canlı sınav — sunucu ekranı: lobi → hazırlık → soru → dağılım → sıralama → … → podyum → analiz.
   Puan: doğruysa 1000 × (1 − süre/2·toplam) + seri bonusu (100/ardışık doğru, en çok 400). */
(function(){
const { $, $$, h, icon, esc } = Y;
const SHAPES = Y.SHAPES;
const styleIdx = (q, i) => q.tf ? [1, 0][i] : i; // Doğru=mavi elmas, Yanlış=kırmızı üçgen

const Quiz = window.Quiz = { active: false };
let liveDb = null, db = null, opts = null, order = [], pos = -1, phase = 'off', timerRaf = 0, tEnd = 0, autoEnd = null;
const scores = new Map(); // id → {score, correct, streak, last, ms}
let prevRanks = new Map();

const joinUrl = () => {
  const base = (window.YARA_CONFIG && YARA_CONFIG.JOIN_URL) || new URL('../katil/', location.href.split('#')[0].split('?')[0]).href;
  return base;
};
const shortUrl = u => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
const root = () => $('#quiz');
const stage = html => { const r = root(); r.innerHTML = `<div class="qstage">${html}</div>`; Y.icons(r); return r.firstElementChild; };
const topBar = (right = '') => `<div class="q-top"><div class="left">${db.mode === 'demo' ? `<span class="q-badge demo">${icon('bot')}Demo sınıf</span>` : `<span class="q-badge live"><i></i>Canlı</span>`}<span class="q-badge mono">PIN ${db.session.pin}</span>${pos >= 0 && pos < order.length ? `<span class="q-badge">Soru ${pos + 1} / ${order.length}</span>` : ''}</div><div class="q-hint">${right}</div></div>`;
const Q = () => QUIZ.questions[order[pos]];

/* ——— Başlat / lobi ——— */
Quiz.init = () => {
  Deck.on(s => { if (liveDb && liveDb.session) liveDb.host({ deck_pos: s.title || s.id }).catch(() => {}); });
};

async function ensureLive(){
  if (!DB.hasLive) throw new Error('Canlı mod için Supabase ayarı gerekli.');
  if (!liveDb){
    liveDb = DB.make(false);
    await liveDb.create('Yara Bakımı Atölyesi');
    // telefon yönetici paneli için: sunucu anahtarını yönetici şifresiyle kilitle
    if (Quiz.adminPass) { try { await liveDb.host({ deck_pos: await DB.seal(Quiz.adminPass, liveDb.session.pin + '.' + liveDb.session.token) }); } catch (e) { console.warn(e); } }
    liveDb.on('session', s => { if (s.remote_seq != null && s.remote_seq !== ensureLive.seq){ const first = ensureLive.seq == null; ensureLive.seq = s.remote_seq; if (!first) remoteCmd(s.remote_cmd); } });
  }
  return liveDb;
}
function remoteCmd(cmd){
  if (cmd === 'next') { if (Quiz.active) advance(); else if (window.Home && Home.startFromRemote) Home.startFromRemote(); }
  else if (cmd === 'skip') { if (Quiz.active) skipBoard(); }
  else if (cmd === 'end') { if (Quiz.active) finishEarly(); }
  else if (cmd === 'start') { if (!Quiz.active && window.Home && Home.startFromRemote) Home.startFromRemote(); }
}
Quiz.ensureLive = ensureLive;
Quiz.livePin = () => liveDb && liveDb.session ? liveDb.session.pin : null;

Quiz.start = async o => {
  opts = o; Y.Sfx.unlock();
  try {
    if (o.demo) { db = DB.make(true); await db.create(); }
    else {
      // aynı oturumda ikinci sınav: eski cevaplar karışmasın diye yeni oturum aç (lobi öncesi katılanlar korunur)
      if (liveDb && liveDb._used && liveDb.allAnswers().length) { liveDb.close(); liveDb = null; ensureLive.seq = null; Y.toast('Yeni sınav oturumu açıldı (yeni PIN). Telefondaki yönetici paneli yeni oturuma kendiliğinden geçer.', 5000); }
      db = await ensureLive();
      db._used = true;
    }
  } catch (e) { Y.toast(e.message + (DB.hasLive ? '' : ' Demo sınıf ile prova yapabilirsiniz.'), 5000); return; }
  order = (o.set === 'short' ? QUIZ.short : QUIZ.questions.map((_, i) => i)).slice();
  pos = -1; scores.clear(); prevRanks = new Map();
  Quiz.active = true; root().hidden = false; document.body.classList.add('quiz-on');
  startCtrl();
  FX.intensity(1.6);
  await db.host({ status: 'lobby', q_index: -1, q_count: order.length, q_duration: o.time, qset: order, reveal_correct: null, q_text: null, q_options: null });
  lobby();
};

function lobby(){
  phase = 'lobby';
  const url = joinUrl(), full = url + '?pin=' + db.session.pin;
  const el = stage(`${topBar('<span class="kbd">Boşluk</span> başlat · <span class="kbd">S</span> sıralamayı atla · <span class="kbd">E</span> bitir')}
  <div class="lobby">
    <div class="glass join-card">
      <div class="kicker">Telefonla katıl</div>
      <div class="qr-big">${Y.qr(full, 8)}</div>
      <div class="url">veya <b>${esc(shortUrl(url))}</b> adresine gir</div>
      <div class="pin">${db.session.pin.split('').map(d => `<span>${d}</span>`).join('')}</div>
    </div>
    <div class="roster">
      <div class="roster-head"><div class="count"><span class="pc mono">0</span><small>katılımcı</small></div>
        <div class="q-actions"><button class="btn" data-q="cancel">${icon('x')}İptal</button><button class="btn primary cta-big" data-q="go" disabled>${icon('play')}Sınavı başlat</button></div></div>
      <div class="players"><div class="empty-wait">Öğrenciler bekleniyor <span class="dots"><i></i><i></i><i></i></span></div></div>
    </div>
  </div>`);
  gsap.from(el.querySelector('.join-card'), { x: -60, opacity: 0, duration: .8, ease: 'expo.out' });
  gsap.from(el.querySelectorAll('.pin span'), { y: 40, opacity: 0, stagger: .06, duration: .6, ease: 'back.out(2)', delay: .3 });
  gsap.to(el.querySelector('.qr-big'), { boxShadow: '0 0 0 10px rgba(45,212,191,.25), 0 30px 80px -30px rgba(0,0,0,.8)', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  bindBtns(el);
  db.players().forEach(addPlayer);
  if (!db._wired) { db._wired = true; db.on('player', p => { if (phase === 'lobby') addPlayer(p); else if (phase === 'question') updateAnswered(); }); db.on('answer', onAnswer); }
}
let lastPop = 0;
function addPlayer(p){
  const wrap = $('#quiz .players'); if (!wrap) return;
  if (wrap.querySelector(`[data-id="${p.id}"]`)) return;
  wrap.querySelector('.empty-wait')?.remove();
  const b = h(`<span class="pl" data-id="${esc(p.id)}"><span class="av">${esc(p.avatar)}</span>${esc(p.nickname)}</span>`);
  wrap.appendChild(b);
  const n = wrap.children.length;
  wrap.classList.toggle('dense', n > 30); wrap.classList.toggle('xdense', n > 70);
  gsap.from(b, { scale: 0, opacity: 0, rotate: gsap.utils.random(-12, 12), duration: .55, ease: 'back.out(2.2)' });
  const c = $('#quiz .pc'); if (c) { c.textContent = n; gsap.fromTo(c, { scale: 1.25 }, { scale: 1, duration: .35 }); }
  const go = $('#quiz [data-q="go"]'); if (go) go.disabled = false;
  if (performance.now() - lastPop > 120) { Y.Sfx.join(); lastPop = performance.now(); }
  scores.has(p.id) || scores.set(p.id, { score: 0, correct: 0, streak: 0, last: 0, ms: 0 });
}
function bindBtns(el){
  el.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.q;
    if (a === 'cancel') exit(); else if (a === 'go' || a === 'next') advance(); else if (a === 'skip') endQuestion();
    else if (a === 'analysis') showAnalysis(); else if (a === 'deck') { exit(); Deck.go('kapanis'); }
  }));
}

/* ——— İlerleme ——— */
function advance(){
  if (phase === 'lobby') { if (!db.players().length) { Y.toast('Henüz katılan yok.'); return; } nextQuestion(); }
  else if (phase === 'question') endQuestion();
  else if (phase === 'reveal') board();
  else if (phase === 'board') nextQuestion();
  else if (phase === 'podium-done') showAnalysis();
}
Quiz.advance = advance;

/* Sıralamayı atlayıp doğrudan sonraki soruya geç */
function skipBoard(){
  if (phase === 'reveal' || phase === 'board') nextQuestion();
  else advance();
}
Quiz.skipBoard = skipBoard;

/* Sınavı istenen anda bitir: sorulmuş sorularla podyum + analiz */
async function finishEarly(){
  if (!Quiz.active || phase === 'podium' || phase === 'podium-done' || phase === 'off') return;
  if (phase === 'lobby') { exit(); return; }
  if (phase === 'question') await endQuestion();
  if (phase === 'ready') pos--; // geri sayımdaki soru sorulmamış sayılır
  order = order.slice(0, Math.max(0, pos + 1));
  if (!order.length) { exit(); Y.toast('Hiç soru sorulmadan sınav kapatıldı.'); return; }
  db.host({ qset: order, q_count: order.length }).catch(() => {});
  pos = order.length;
  podium();
}
Quiz.finishEarly = finishEarly;

/* Ekrandaki yönetici çubuğu (sahne ölçeğinden bağımsız, her zaman tıklanabilir) */
let ctrlT = 0;
const CTRL = {
  lobby: ['play', 'Sınavı başlat'], ready: ['skip-forward', 'Bekleniyor…'], question: ['square', 'Soruyu bitir'],
  reveal: ['list-ordered', 'Sıralamayı göster'], board: ['arrow-right', 'Sonraki soru'], podium: ['loader', 'Podyum…'], 'podium-done': ['chart-column', 'Sonuç analizi']
};
function startCtrl(){
  const bar = document.getElementById('qctrl'); if (!bar) return;
  bar.hidden = false;
  bar.innerHTML = `<button class="btn primary" data-c="next"></button><button class="btn" data-c="skip">${icon('fast-forward')}Sıralamayı atla</button><button class="btn" data-c="remote">${icon('smartphone')}Telefondan yönet</button><button class="btn danger" data-c="end">${icon('flag')}Sınavı bitir</button>`;
  bar.querySelector('[data-c="next"]').onclick = () => advance();
  bar.querySelector('[data-c="skip"]').onclick = () => skipBoard();
  bar.querySelector('[data-c="end"]').onclick = () => { if (phase === 'lobby' || confirm('Sınav şimdi bitirilsin mi? Sorulan sorularla sonuçlar gösterilir.')) finishEarly(); };
  bar.querySelector('[data-c="remote"]').onclick = () => window.Home && Home.showRemote();
  let last = '';
  clearInterval(ctrlT);
  ctrlT = setInterval(() => {
    if (!Quiz.active) return stopCtrl();
    const lastQ = pos >= order.length - 1;
    let [ic, t] = CTRL[phase] || ['circle', '…'];
    if (phase === 'board' && lastQ) [ic, t] = ['trophy', 'Podyuma geç'];
    if (phase === 'reveal' && lastQ) [ic, t] = ['list-ordered', 'Son sıralama'];
    const showSkip = (phase === 'reveal' || phase === 'board') && !lastQ;
    const key = phase + '|' + t + '|' + showSkip;
    if (key === last) return; last = key;
    const nx = bar.querySelector('[data-c="next"]');
    nx.innerHTML = icon(ic) + t; nx.disabled = phase === 'ready' || phase === 'podium';
    bar.querySelector('[data-c="skip"]').hidden = !showSkip;
    bar.querySelector('[data-c="end"]').hidden = phase === 'podium' || phase === 'podium-done';
    bar.querySelector('[data-c="remote"]').hidden = db && db.mode === 'demo';
    Y.icons(bar);
  }, 250);
}
function stopCtrl(){ clearInterval(ctrlT); const bar = document.getElementById('qctrl'); if (bar) { bar.hidden = true; bar.innerHTML = ''; } }

async function nextQuestion(){
  pos++;
  if (pos >= order.length) return podium();
  phase = 'ready';
  const q = Q();
  const el = stage(`${topBar()}<div class="ready"><div class="ring"></div><span class="chip violet" style="font-size:20px">${esc(QUIZ.topics[q.topic])}</span><div class="qn">Soru ${pos + 1} / ${order.length}</div><div class="big mono">3</div><div class="qn">${q.tf ? 'Doğru mu, yanlış mı?' : 'Hazır olun…'}</div></div>`);
  db.host({ status: 'get_ready', q_index: pos, q_topic: QUIZ.topics[q.topic], q_text: null, q_options: null, reveal_correct: null }).catch(e => Y.toast(e.message));
  const big = el.querySelector('.big'), ring = el.querySelector('.ring');
  for (let n = 3; n >= 1; n--) {
    if (phase !== 'ready') return;
    big.textContent = n; Y.Sfx.countdown(n);
    gsap.fromTo(big, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: 'back.out(2)' });
    gsap.fromTo(ring, { scale: .4, opacity: .8 }, { scale: 1.6, opacity: 0, duration: .9, ease: 'power2.out' });
    await Y.sleep(900);
  }
  if (phase === 'ready') question();
}

function question(){
  phase = 'question';
  const q = Q(), dur = opts.time;
  if (window.DemoBots) DemoBots.currentQuestion = q;
  const optsData = q.options.map((t, i) => ({ t, s: styleIdx(q, i) }));
  const el = stage(`${topBar('<span class="kbd">Boşluk</span> süreyi bitir')}
  <div class="qbody ${q.img ? 'has-img' : ''}">
    ${q.img ? `<div class="qimg"><img src="${Y.img(q.img[0], q.img[1])}" alt="Soru görseli"></div>` : ''}
    <div class="qtext">${esc(q.text)}</div>
    <div class="side">
      <div class="timer"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="var(--surface-2)" stroke-width="8"/><circle class="tr" cx="50" cy="50" r="44" fill="none" stroke="var(--teal)" stroke-width="8" stroke-linecap="round" stroke-dasharray="276.5" stroke-dashoffset="0"/></svg><div class="t-num">${dur}</div></div>
      <div class="answered"><b class="ac">0</b><span>/ <span class="pt">${db.players().length}</span> cevap</span></div>
    </div>
  </div>
  <div class="opts ${q.tf ? 'tf' : ''}">${optsData.map((o, i) => `<div class="opt o${o.s}" data-i="${i}"><span class="shape">${SHAPES[o.s]}</span><span class="txt">${esc(o.t)}</span><span class="cnt">0</span><span class="ok">${icon('check')}</span></div>`).join('')}</div>`);
  gsap.from(el.querySelector('.qtext'), { y: 30, opacity: 0, duration: .6, ease: 'power3.out' });
  gsap.from(el.querySelectorAll('.opt'), { y: 60, opacity: 0, scale: .9, stagger: .08, duration: .55, ease: 'back.out(1.6)', delay: .15 });
  db.host({ status: 'question', q_index: pos, q_duration: dur, q_text: q.text, q_options: optsData, q_topic: QUIZ.topics[q.topic], q_img: q.img ? Y.img(q.img[0], q.img[1], '../') : null, reveal_correct: null }).catch(e => Y.toast(e.message));
  // sayaç
  tEnd = performance.now() + dur * 1000;
  const ring = el.querySelector('.tr'), num = el.querySelector('.t-num'), tim = el.querySelector('.timer');
  let lastSec = dur;
  cancelAnimationFrame(timerRaf);
  const tick = () => {
    if (phase !== 'question') return;
    const left = Math.max(0, tEnd - performance.now()), sec = Math.ceil(left / 1000);
    ring.style.strokeDashoffset = 276.5 * (1 - left / (dur * 1000));
    if (sec !== lastSec) { lastSec = sec; num.textContent = sec; if (sec <= 5 && sec > 0) { Y.Sfx.tick(); tim.classList.add('hot'); ring.style.stroke = 'var(--coral)'; gsap.fromTo(num, { scale: 1.3 }, { scale: 1, duration: .3 }); } }
    if (left <= 0) return endQuestion();
    timerRaf = requestAnimationFrame(tick);
  };
  timerRaf = requestAnimationFrame(tick);
  // görünmez sekmede de süre dolsun
  clearTimeout(autoEnd); autoEnd = setTimeout(() => { if (phase === 'question') endQuestion(); }, dur * 1000 + 50);
  updateAnswered();
}

function onAnswer(a){ if (phase === 'question' && a.q_index === pos) updateAnswered(); }
function updateAnswered(){
  const n = db.answersFor(pos).length, total = db.players().length;
  const ac = $('#quiz .ac'), pt = $('#quiz .pt');
  if (ac) { ac.textContent = n; gsap.fromTo(ac, { scale: 1.3, color: 'var(--teal)' }, { scale: 1, color: 'var(--ink)', duration: .35 }); }
  if (pt) pt.textContent = total;
  if (phase === 'question' && total > 0 && n >= total) { clearTimeout(autoEnd); autoEnd = setTimeout(() => phase === 'question' && endQuestion(), 700); }
}

/* ——— Cevap dağılımı + puanlama ——— */
async function endQuestion(){
  if (phase !== 'question') return;
  phase = 'reveal'; cancelAnimationFrame(timerRaf); clearTimeout(autoEnd);
  await db.refresh().catch(() => {});
  const q = Q(), ans = db.answersFor(pos), dur = opts.time * 1000;
  // puanla
  prevRanks = rankMap();
  const answeredIds = new Set(ans.map(a => a.player_id));
  ans.forEach(a => {
    const s = scores.get(a.player_id) || { score: 0, correct: 0, streak: 0, last: 0, ms: 0 };
    s.ms += a.ms;
    if (a.choice === q.correct) {
      s.streak++; s.correct++;
      s.last = Math.round(1000 * (1 - Math.min(a.ms, dur) / dur / 2)) + Math.min(s.streak - 1, 4) * 100;
      s.score += s.last;
    } else { s.streak = 0; s.last = 0; }
    scores.set(a.player_id, s);
  });
  db.players().forEach(p => { if (!answeredIds.has(p.id)) { const s = scores.get(p.id) || { score: 0, correct: 0, streak: 0, last: 0, ms: 0 }; s.streak = 0; s.last = 0; scores.set(p.id, s); } });
  const ranks = rankMap();
  db.host({ status: 'reveal', reveal_correct: q.correct }).catch(e => Y.toast(e.message));
  db.scores([...scores].map(([id, s]) => ({ id, score: s.score, correct_count: s.correct, streak: s.streak, last_points: s.last, rank: ranks.get(id) }))).catch(() => {});

  // görsel
  const counts = q.options.map((_, i) => ans.filter(a => a.choice === i).length);
  const max = Math.max(1, ...counts), right = counts[q.correct], rate = ans.length ? Math.round(right / Math.max(1, db.players().length) * 100) : 0;
  const el = $('#quiz .qstage');
  el.querySelector('.q-hint').innerHTML = '<span class="kbd">Boşluk</span> sıralama';
  const body = el.querySelector('.qbody');
  body.className = 'qbody rv' + (q.img ? ' has-img' : '');
  body.innerHTML = `<div class="qtext">${esc(q.text)}</div>
    ${q.img ? `<div class="qimg"><img src="${Y.img(q.img[0], q.img[1])}" alt="Soru görseli"></div>` : ''}
    <div class="dist">${q.options.map((_, i) => { const s = styleIdx(q, i); return `<div class="bar ${i === q.correct ? 'correct' : ''}"><b>${counts[i]}</b><div class="col o${s}" data-h="${Math.max(6, counts[i] / max * 150)}"></div><span class="shape">${SHAPES[s]}</span></div>`; }).join('')}</div>
    <div class="rv-side"><div><span class="rate mono">%${rate}</span> <span class="muted">doğru</span></div><div class="explain">${icon('lightbulb')}<div><b>Neden?</b> ${esc(q.explain)}</div></div></div>`;
  Y.icons(el);
  el.querySelectorAll('.dist .col').forEach((c, i) => gsap.to(c, { height: +c.dataset.h, duration: .9, delay: .15 + i * .08, ease: 'power3.out' }));
  const optsEl = el.querySelector('.opts'); optsEl.classList.add('revealed');
  optsEl.querySelectorAll('.opt').forEach((o, i) => { o.classList.toggle('correct', i === q.correct); o.querySelector('.cnt').textContent = counts[i]; });
  Y.Sfx.reveal();
  if (rate >= 80) FX.burst(.5, .7, 90);
}

function rankMap(){
  const arr = [...scores].sort((a, b) => b[1].score - a[1].score || a[1].ms - b[1].ms);
  return new Map(arr.map(([id], i) => [id, i + 1]));
}

/* ——— Sıralama ——— */
function board(){
  phase = 'board';
  db.host({ status: 'board' }).catch(() => {});
  const pmap = new Map(db.players().map(p => [p.id, p]));
  const arr = [...scores].filter(([id]) => pmap.has(id)).sort((a, b) => b[1].score - a[1].score || a[1].ms - b[1].ms).slice(0, 5);
  const fastest = db.answersFor(pos).filter(a => a.choice === Q().correct).sort((a, b) => a.ms - b.ms)[0];
  const last = pos === order.length - 1;
  const el = stage(`${topBar(`<span class="kbd">Boşluk</span> ${last ? 'podyum' : 'sonraki soru'}`)}
  <div class="board"><h2>${last ? 'Son sıralama' : 'Sıralama'}</h2>
    ${arr.map(([id, s], i) => { const p = pmap.get(id); return `<div class="brow r${i + 1}" data-id="${esc(id)}"><span class="rk">${i + 1}</span><span class="av">${esc(p.avatar)}</span><span>${esc(p.nickname)}</span><span>${s.streak >= 3 ? `<span class="fl">🔥 ${s.streak}</span>` : ''} ${s.last ? `<span class="plus">+${s.last}</span>` : ''}</span><span class="sc" data-v="${s.score}" data-from="${s.score - s.last}">${s.score - s.last}</span></div>`; }).join('')}
    ${fastest ? `<p class="fastest">${icon('zap')} En hızlı doğru: <b>${esc(pmap.get(fastest.player_id)?.nickname || '')}</b> · ${(fastest.ms / 1000).toFixed(1).replace('.', ',')} sn</p>` : ''}
  </div>`);
  // önceki sıradan yeni sıraya kayma
  el.querySelectorAll('.brow').forEach((r, i) => {
    const before = prevRanks.get(r.dataset.id) || 6, d = Math.min(before - 1, 5) - i;
    gsap.from(r, { y: d * 82, opacity: before > 5 ? 0 : 1, duration: .9, delay: .2 + i * .05, ease: 'power3.inOut' });
    const sc = r.querySelector('.sc'), o = { v: +sc.dataset.from };
    gsap.to(o, { v: +sc.dataset.v, duration: 1.1, delay: .5, ease: 'power2.out', onUpdate(){ sc.textContent = Math.round(o.v); } });
  });
  gsap.from(el.querySelector('h2'), { y: -30, opacity: 0, duration: .6 });
  Y.Sfx.whoosh();
}

/* ——— Podyum ——— */
async function podium(){
  phase = 'podium';
  // Bitişte cevap anahtarı telefona gider: açıklama ekranını kaçıran (ya da erken bitirilen) öğrencinin karnesi de tamamlanır
  db.host({ status: 'ended', q_count: order.length, q_options: { key: order.map(i => QUIZ.questions[i].correct), topics: order.map(i => QUIZ.topics[QUIZ.questions[i].topic]) } }).catch(() => {});
  saveResult();
  const pmap = new Map(db.players().map(p => [p.id, p]));
  const top = [...scores].filter(([id]) => pmap.has(id)).sort((a, b) => b[1].score - a[1].score || a[1].ms - b[1].ms).slice(0, 3);
  const slot = (k, cls) => { const t = top[k]; const p = t && pmap.get(t[0]); return `<div class="pod ${cls}"><div class="who">${p ? `<span class="av">${esc(p.avatar)}</span><b>${esc(p.nickname)}</b><span>${t[1].score} puan</span>` : '<b>—</b>'}</div><div class="block">${k + 1}</div></div>`; };
  const el = stage(`${topBar()}
  <div class="podium-wrap"><div class="podium-title">Kazananlar</div>
    <div class="spot" style="left:calc(50% - 210px)"></div>
    <div class="podium">${slot(1, 'p2')}${slot(0, 'p1')}${slot(2, 'p3')}</div>
  </div>
  <div class="end-actions"><button class="btn primary cta-big" data-q="analysis">${icon('chart-column')}Sonuç analizi</button><button class="btn cta-big" data-q="deck" style="font-size:20px">${icon('house')}Ana ekran</button></div>`);
  bindBtns(el);
  FX.intensity(.6);
  const tl = gsap.timeline();
  Y.Sfx.drum(2.6);
  tl.from(el.querySelector('.podium-title'), { y: -40, opacity: 0, duration: .8 })
    .to(el.querySelector('.p3 .block'), { scaleY: 1, duration: .8, ease: 'back.out(1.4)' }, .6)
    .to(el.querySelector('.p3 .who'), { opacity: 1, y: 0, duration: .5 }, '>-0.1')
    .to(el.querySelector('.p2 .block'), { scaleY: 1, duration: .8, ease: 'back.out(1.4)' }, 1.5)
    .to(el.querySelector('.p2 .who'), { opacity: 1, duration: .5 }, '>-0.1')
    .to(el.querySelector('.p1 .block'), { scaleY: 1, duration: 1, ease: 'back.out(1.6)' }, 2.7)
    .to(el.querySelector('.spot'), { opacity: 1, duration: .4 }, 2.9)
    .to(el.querySelector('.p1 .who'), { opacity: 1, scale: 1.1, duration: .6, ease: 'back.out(3)' }, 3.2)
    .call(() => { Y.Sfx.cymbal(); Y.Sfx.fanfare(); FX.cannons(); FX.fireworks(4); FX.intensity(1.4); }, null, 3.2)
    .to(el.querySelector('.end-actions'), { opacity: 1, duration: .6 }, 4.4)
    .call(() => { phase = 'podium-done'; el.querySelector('.q-hint').innerHTML = '<span class="kbd">Boşluk</span> analiz'; });
}

function saveResult(){
  const players = db.players().map(p => ({ id: p.id, nickname: p.nickname, avatar: p.avatar, ...scores.get(p.id) }));
  const answers = db.allAnswers();
  const res = { pin: db.session.pin, mode: db.mode, quiz_id: QUIZ.id, order, duration: opts.time, at: Date.now(), players, answers };
  Y.store.set('yara_res_' + db.session.pin, res);
  Y.store.set('yara_last_pin', db.session.pin);
  const correct = answers.filter(a => QUIZ.questions[order[a.q_index]]?.correct === a.choice).length;
  Y.store.set('yara_last_result', { players: players.length, answers: answers.length, pct: Math.round(correct / Math.max(1, players.length * order.length) * 100) });
  Quiz.lastResult = res;
}

function showAnalysis(){ const r = Quiz.lastResult; exit(true); Analytics.open(r); }

function exit(keepSession){
  phase = 'off'; Quiz.active = false; cancelAnimationFrame(timerRaf); clearTimeout(autoEnd);
  root().hidden = true; root().innerHTML = ''; document.body.classList.remove('quiz-on'); stopCtrl();
  FX.intensity(1);
  if (db && db.mode === 'demo') db.close();
  else if (db && pos < order.length && !keepSession) db.host({ status: 'idle', q_index: -1 }).catch(() => {});
}
Quiz.exit = exit;

Quiz.key = e => {
  const k = e.key;
  if (k === 'Escape') { e.preventDefault(); if (phase === 'podium' || phase === 'podium-done' || confirm('Sınavdan çıkılsın mı?')) exit(); return; }
  if ([' ', 'Enter', 'ArrowRight', 'PageDown'].includes(k)) { e.preventDefault(); advance(); }
  else if (k === 's' || k === 'S') skipBoard();
  else if (k === 'e' || k === 'E') { if (phase === 'lobby' || confirm('Sınav şimdi bitirilsin mi?')) finishEarly(); }
  else if (k === 'a' || k === 'A') Deck.actions.sound();
  else if (k === 'f' || k === 'F') Deck.actions.fullscreen();
};
})();
