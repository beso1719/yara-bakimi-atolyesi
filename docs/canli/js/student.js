/* Öğrenci telefonu: katıl → bekle → cevapla → sonuç → final karnesi. ?k=PIN.TOKEN ile sunum kumandası olur. */
(function(){
const { $, h, icon, esc } = Y;
const app = $('#app'), qs = new URLSearchParams(location.search);
const vibrate = p => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
const view = html => { app.innerHTML = html; Y.icons(app); return app; };
const conf = window.confetti ? confetti.create($('#fx'), { resize: true }) : () => {};

if (!DB.hasLive) { view(`<div class="center"><h1 class="t">Bağlantı ayarı yok</h1><p class="muted">Bu sınav için çevrimiçi sunucu yapılandırılmamış.</p></div>`); return; }
const c = DB.client();

/* ———— Yönetici kumandası (?k=PIN.TOKEN): sınavı telefondan başlat / geç / bitir ———— */
if (qs.get('k')) {
  const [pin, token] = qs.get('k').split('.');
  let busy = false, sid = null, cur = null;
  const send = async (cmd, btn) => {
    if (busy) return; busy = true; vibrate(25);
    if (btn) btn.classList.add('sending');
    const { error } = await DB.rpcRetry('yq_remote', { p_pin: pin, p_token: token, p_cmd: cmd });
    if (error) Y.toast(DB.errMsg(error)); else Y.toast('Gönderildi ✓', 900);
    setTimeout(() => { busy = false; btn && btn.classList.remove('sending'); refresh(); }, 600);
  };
  view(`<div class="remote admin">
    <div class="panel rstat"><div class="rk-top"><b>Yönetici kumandası</b><span class="chip mono">PIN ${esc(pin)}</span></div>
      <div class="rphase">Bağlanıyor…</div>
      <div class="rnums"><div><b class="rq">–</b><small>soru</small></div><div><b class="ra">–</b><small>cevaplayan</small></div><div><b class="rp">–</b><small>katılımcı</small></div></div>
      <div class="rbar"><i></i></div>
    </div>
    <button class="nx" data-cmd="next">…</button>
    <button class="sk" data-cmd="skip">${icon('fast-forward')}Sıralamayı atla</button>
    <button class="en" data-cmd="end">${icon('flag')}Sınavı şimdi bitir</button>
  </div>`);
  const nx = app.querySelector('.nx'), sk = app.querySelector('.sk'), en = app.querySelector('.en');
  nx.onclick = () => send(cur === 'idle' ? 'start' : 'next', nx);
  sk.onclick = () => send('skip', sk);
  en.onclick = () => { if (confirm('Sınav şimdi bitirilsin mi? Sorulan sorularla sonuçlar gösterilir.')) send('end', en); };
  const LBL = {
    idle: ['play', 'Sınavı başlat', 'Sınav ekranı hazır, lobi açılmadı'],
    lobby: ['play', 'Soruları başlat', 'Lobi açık, katılım bekleniyor'],
    get_ready: ['hourglass', 'Geri sayım…', 'Soru geliyor'],
    question: ['square', 'Soruyu bitir', 'Soru açık, cevaplar geliyor'],
    reveal: ['list-ordered', 'Sıralamayı göster', 'Cevap açıklandı'],
    board: ['arrow-right', 'Sonraki soru', 'Sıralama ekranda'],
    ended: ['chart-column', 'Sonuç analizini aç', 'Sınav bitti']
  };
  async function refresh(){
    const { data: s } = await c.from('yq_sessions').select('id,status,q_index,q_count,q_started_at,q_duration').eq('pin', pin).maybeSingle();
    if (!s) { app.querySelector('.rphase').textContent = 'Oturum bulunamadı. Sınav ekranındaki yeni QR’ı okut.'; return; }
    if (!sid) { sid = s.id; c.channel('yq-adm-' + sid).on('postgres_changes', { event: '*', schema: 'public', table: 'yq_sessions', filter: `id=eq.${sid}` }, () => refresh()).subscribe(); }
    cur = s.status;
    const [{ count: np }, { count: na }] = await Promise.all([
      c.from('yq_players').select('id', { count: 'exact', head: true }).eq('session_id', sid),
      s.q_index >= 0 ? c.from('yq_answers').select('id', { count: 'exact', head: true }).eq('session_id', sid).eq('q_index', s.q_index) : Promise.resolve({ count: 0 })
    ]);
    const lastQ = s.q_index >= s.q_count - 1;
    let [ic, t, ph] = LBL[s.status] || ['circle', '…', s.status];
    if (s.status === 'board' && lastQ) [ic, t] = ['trophy', 'Podyuma geç'];
    nx.innerHTML = icon(ic) + t; nx.disabled = s.status === 'get_ready';
    sk.hidden = !((s.status === 'reveal' || s.status === 'board') && !lastQ);
    en.hidden = s.status === 'ended' || s.status === 'idle';
    app.querySelector('.rphase').textContent = ph;
    app.querySelector('.rq').textContent = s.q_index >= 0 ? `${s.q_index + 1}/${s.q_count}` : `0/${s.q_count || '–'}`;
    app.querySelector('.rp').textContent = np ?? 0;
    app.querySelector('.ra').textContent = s.status === 'question' || s.status === 'reveal' ? `${na ?? 0}` : '–';
    const bar = app.querySelector('.rbar i');
    bar.style.width = (s.status === 'question' && np ? Math.min(100, (na / np) * 100) : 0) + '%';
    Y.icons(app);
  }
  refresh(); setInterval(() => { if (!busy) refresh().catch(() => {}); }, 1500);
  return;
}

/* ———— Katılım ———— */
const KEY = pin => 'yara_player_' + pin;
let me = null, S = null, lastKey = '', hist = {}, myAnswer = {}, timerT = null;

function joinForm(pin = '', err = ''){
  let av = Y.store.get('yara_avatar') || DB.AVATARS[Math.floor(Math.random() * DB.AVATARS.length)];
  view(`<div class="center" style="justify-content:flex-start;padding-top:4vh">
    <h1 class="t">Sınava <span class="t-teal">katıl</span></h1>
    <p class="muted">Ekrandaki PIN’i ve adını gir.</p>
  </div>
  <form class="panel" novalidate>
    <div class="field"><label for="pin">Oyun PIN’i</label><input id="pin" class="pin-in" inputmode="numeric" autocomplete="off" maxlength="6" value="${esc(pin)}" placeholder="••••••" required></div>
    <div class="field"><label for="nick">Adın</label><input id="nick" maxlength="20" autocomplete="nickname" value="${esc(Y.store.get('yara_nick') || '')}" placeholder="Örn. Zeynep K." required><span class="help">1–20 karakter. Ekranda ve sonuç listesinde görünür.</span></div>
    <div class="field"><label>Avatar</label><div class="avs">${DB.AVATARS.map(a => `<button type="button" aria-pressed="${a === av}" aria-label="Avatar ${a}">${a}</button>`).join('')}</div></div>
    <p class="err" role="alert" style="color:var(--red);font-weight:600;min-height:1.2em">${esc(err)}</p>
    <button class="btn primary block" type="submit">${icon('log-in')}Katıl</button>
  </form>`);
  app.querySelectorAll('.avs button').forEach(b => b.onclick = () => { av = b.textContent; app.querySelectorAll('.avs button').forEach(x => x.setAttribute('aria-pressed', x === b)); vibrate(10); });
  const f = app.querySelector('form');
  if (!pin) f.pin.focus(); else if (!f.nick.value) f.nick.focus();
  f.onsubmit = async e => {
    e.preventDefault();
    const p = f.pin.value.replace(/\D/g, ''), n = f.nick.value.trim(), btn = f.querySelector('[type=submit]'), er = f.querySelector('.err');
    if (p.length !== 6) { er.textContent = 'PIN 6 haneli olmalı.'; f.pin.focus(); return; }
    if (!n) { er.textContent = 'Adını yaz.'; f.nick.focus(); return; }
    btn.disabled = true; btn.innerHTML = 'Bağlanıyor…';
    const { data, error } = await c.rpc('yq_join', { p_pin: p, p_nick: n, p_avatar: av });
    if (error) { btn.disabled = false; btn.innerHTML = 'Katıl'; er.textContent = DB.errMsg(error); vibrate([40, 40, 40]); return; }
    const r = data[0];
    me = { pin: p, id: r.player_id, secret: r.secret, session: r.session_id, nickname: n, avatar: av };
    Y.store.set(KEY(p), me); Y.store.set('yara_nick', n); Y.store.set('yara_avatar', av);
    vibrate(30); start();
  };
}

/* ———— Oturum izleme ———— */
let pollT = null, live = false;
async function fetchSession(){
  const { data, error } = await c.from('yq_sessions').select('*').eq('id', me.session).single();
  if (data) onSession(data);
  else if (error && error.code === 'PGRST116') { clearInterval(pollT); Y.store.del(KEY(me.pin)); joinForm(me.pin, 'Bu oturum artık yok, yeniden katıl.'); }
}
function start(){
  hist = Y.store.get('yara_hist_' + me.pin, {});
  setWho();
  c.channel('yq-stu-' + me.session).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'yq_sessions', filter: `id=eq.${me.session}` }, p => onSession(p.new))
    .subscribe(st => { live = st === 'SUBSCRIBED'; });
  fetchSession();
  clearInterval(pollT); pollT = setInterval(() => fetchSession().catch(() => {}), 4000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) fetchSession(); });
}
function setWho(score){ $('#who').innerHTML = `<span>${esc(me.avatar)}</span><span>${esc(me.nickname)}</span>${score != null ? `<span class="sc">${score}</span>` : ''}`; }

function onSession(s){
  S = s;
  const key = s.status + '|' + s.q_index;
  if (key === lastKey) return;
  lastKey = key;
  clearInterval(timerT);
  if (s.status === 'idle' || s.status === 'lobby') return waiting();
  if (s.status === 'get_ready') return getReady();
  if (s.status === 'question') return question();
  if (s.status === 'reveal') return reveal();
  if (s.status === 'board') return boardV();
  if (s.status === 'ended') return final();
}

function waiting(){
  view(`<div class="center"><div class="big-av">${esc(me.avatar)}</div><h1 class="t">Adın ekranda!</h1><p class="muted">Sunucu sınavı başlatınca soru burada belirecek.</p><div class="wait-dots"><i></i><i></i><i></i></div></div>`);
  gsap.to(app.querySelector('.big-av'), { y: -14, duration: .9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
}
function getReady(){
  view(`<div class="center"><span class="chip violet">${esc(S.q_topic || '')}</span><h1 class="t">Soru ${S.q_index + 1}${S.q_count ? ` / ${S.q_count}` : ''}</h1><p class="muted">Hazır ol…</p><div class="big-av" style="font-size:80px">⏱️</div></div>`);
  gsap.from(app.querySelector('h1'), { scale: .6, opacity: 0, duration: .5, ease: 'back.out(2)' });
  vibrate(15);
}

function question(){
  const qi = S.q_index, opts = S.q_options || [], tf = opts.length === 2;
  const done = myAnswer[qi] != null || (hist[qi] && hist[qi].choice != null);
  view(`<div class="qhead"><span class="chip">${S.q_index + 1}${S.q_count ? ` / ${S.q_count}` : ''}</span><span class="chip violet">${esc(S.q_topic || '')}</span></div>
    <div class="tbar"><i></i></div>
    ${S.q_img ? `<div class="qpic"><img src="${esc(S.q_img)}" alt="Soru görseli"></div>` : ''}
    <div class="qtxt">${esc(S.q_text || '')}</div>
    <div class="ans ${tf ? 'tf' : ''}">${opts.map((o, i) => `<button class="ab o${o.s}" data-i="${i}"><span class="sh">${Y.SHAPES[o.s]}</span><span>${esc(o.t)}</span></button>`).join('')}</div>
    <p class="muted small lockmsg" style="text-align:center;min-height:1.2em"></p>`);
  const started = S.q_started_at ? Date.parse(S.q_started_at) : Date.now(), dur = (S.q_duration || 20) * 1000;
  const bar = app.querySelector('.tbar i');
  // sunucu-istemci saat farkına karşı yerel başlangıç: ilk görüşten itibaren
  const t0 = Date.now(), d0 = Date.now() - started, skew = d0 > 0 && d0 < 3000 ? d0 : 0; // saat farkı büyükse yerel saati kullan
  const tick = () => { const left = Math.max(0, dur - skew - (Date.now() - t0)); bar.style.transform = `scaleX(${left / dur})`; if (left < 5000) bar.style.background = 'var(--coral)'; };
  tick(); timerT = setInterval(tick, 100);
  const ans = app.querySelector('.ans');
  if (done) lockUI(myAnswer[qi] ?? hist[qi].choice);
  ans.querySelectorAll('.ab').forEach(b => b.onclick = async () => {
    if (ans.classList.contains('locked')) return;
    const choice = +b.dataset.i;
    lockUI(choice); vibrate(35);
    myAnswer[qi] = choice; hist[qi] = { ...(hist[qi] || {}), choice, topic: S.q_topic }; Y.store.set('yara_hist_' + me.pin, hist);
    const { data, error } = await DB.rpcRetry('yq_answer', { p_player: me.id, p_secret: me.secret, p_q: qi, p_choice: choice });
    const msg = app.querySelector('.lockmsg');
    if (error) { msg.textContent = DB.errMsg(error); msg.style.color = 'var(--red)'; delete hist[qi].choice; return; }
    hist[qi].ms = data; Y.store.set('yara_hist_' + me.pin, hist);
    msg.textContent = `Cevabın kilitlendi · ${(data / 1000).toFixed(1).replace('.', ',')} sn`;
  });
}
function lockUI(choice){
  const ans = app.querySelector('.ans'); if (!ans) return;
  ans.classList.add('locked');
  ans.querySelectorAll('.ab').forEach((b, i) => b.classList.toggle('mine', i === choice));
  const msg = app.querySelector('.lockmsg'); if (msg && !msg.textContent) msg.textContent = 'Cevabın gönderiliyor…';
}

async function myRow(){ const { data } = await c.from('yq_players').select('score,last_points,rank,streak,correct_count').eq('id', me.id).single(); return data || {}; }
async function playerCount(){ const { count } = await c.from('yq_players').select('id', { count: 'exact', head: true }).eq('session_id', me.session); return count || 0; }

async function reveal(){
  const qi = S.q_index, mine = hist[qi] && hist[qi].choice, correct = S.reveal_correct, opts = S.q_options || [];
  const ok = mine != null && mine === correct;
  hist[qi] = { ...(hist[qi] || {}), correct: ok, topic: S.q_topic, answered: mine != null }; Y.store.set('yara_hist_' + me.pin, hist);
  view(`<div class="center"><div class="result ${mine == null ? 'none' : ok ? 'ok' : 'no'}">
    <span class="ic">${icon(mine == null ? 'clock' : ok ? 'circle-check' : 'circle-x')}</span>
    <h2>${mine == null ? 'Süre doldu' : ok ? 'Doğru!' : 'Yanlış'}</h2>
    <div class="pts">…</div>
    ${!ok && opts[correct] ? `<p>Doğru cevap: <b>${esc(opts[correct].t)}</b></p>` : ''}
    <span class="streak" hidden></span>
  </div><p class="muted rk"></p></div>`);
  gsap.from(app.querySelector('.result'), { scale: .7, opacity: 0, duration: .5, ease: 'back.out(2)' });
  vibrate(ok ? [30, 40, 30] : [120]);
  if (ok) conf({ particleCount: 80, spread: 80, origin: { y: .6 }, colors: ['#2DD4BF', '#FBBF24', '#ffffff', '#60A5FA'] });
  await Y.sleep(900); // sunucunun skorları yazmasına zaman tanı
  const r = await myRow();
  const pts = app.querySelector('.pts'); if (!pts) return;
  pts.textContent = ok ? `+${r.last_points || 0}` : '+0';
  if (r.streak >= 2) { const st = app.querySelector('.streak'); st.hidden = false; st.textContent = `🔥 ${r.streak} seri`; }
  app.querySelector('.rk').textContent = r.rank ? `Şu an ${r.rank}. sıradasın · ${r.score} puan` : '';
  setWho(r.score);
}
async function boardV(){
  const [r, n] = await Promise.all([myRow(), playerCount()]);
  view(`<div class="center"><div class="big-av" style="font-size:72px">${esc(me.avatar)}</div><h1 class="t">${r.rank ? `${r.rank}. sıradasın` : 'Sıralama'}</h1>
    <div class="rankbox" style="width:100%"><div class="panel"><b>${r.score ?? 0}</b><small>puan</small></div><div class="panel"><b>${r.correct_count ?? 0}</b><small>doğru</small></div><div class="panel"><b>${n}</b><small>katılımcı</small></div></div>
    <p class="muted">Sıradaki soru için ekrana bak 👀</p></div>`);
  gsap.from(app.querySelectorAll('.rankbox .panel'), { y: 20, opacity: 0, stagger: .08, duration: .4 });
  setWho(r.score);
}
async function final(){
  clearInterval(pollT);
  const [r, n] = await Promise.all([myRow(), playerCount()]);
  const ak = S && S.q_options && !Array.isArray(S.q_options) && S.q_options.key;
  if (ak) {
    Object.keys(hist).forEach(k => { if (+k >= ak.length) delete hist[k]; }); // erken bitirilen sınavda sorulmayan soru
    ak.forEach((c, qi) => { const x = hist[qi] || {}; hist[qi] = { ...x, topic: S.q_options.topics[qi], correct: x.choice != null && x.choice === c, answered: x.choice != null }; });
    Y.store.set('yara_hist_' + me.pin, hist);
  }
  const topics = {};
  Object.values(hist).forEach(x => { if (!x.topic || x.correct == null) return; const t = (topics[x.topic] ||= { ok: 0, all: 0 }); t.all++; if (x.correct) t.ok++; });
  const weak = Object.entries(topics).filter(([, t]) => t.ok < t.all);
  view(`<div class="center" style="gap:16px">
    <div class="big-av">${r.rank === 1 ? '🏆' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : esc(me.avatar)}</div>
    <h1 class="t">${r.rank ? `${r.rank}. oldun!` : 'Sınav bitti'}</h1>
    <div class="rankbox" style="width:100%"><div class="panel"><b>${r.score ?? 0}</b><small>puan</small></div><div class="panel"><b>${r.correct_count ?? 0}</b><small>doğru</small></div><div class="panel"><b>${n}</b><small>kişi</small></div></div>
    <div class="panel" style="width:100%;text-align:left"><b>Konu karnen</b>
      <div class="tlist" style="margin-top:10px">${Object.entries(topics).map(([k, t]) => `<div><span>${esc(k)}</span><span class="${t.ok === t.all ? 'good' : 'bad'} mono">${t.ok}/${t.all}</span></div>`).join('') || '<p class="muted">Cevap kaydı yok.</p>'}</div>
      ${weak.length ? `<p class="muted small" style="margin-top:10px">Tekrar göz atman önerilen konular: <b style="color:var(--ink)">${weak.map(([k]) => esc(k)).join(', ')}</b></p>` : '<p class="small" style="margin-top:10px;color:var(--green)">Tüm konular tamam — tebrikler!</p>'}
    </div>
    <p class="muted small">Katıldığın için teşekkürler 💙</p></div>`);
  if (r.rank && r.rank <= 3) { const end = Date.now() + 2500; (function f(){ conf({ particleCount: 40, spread: 100, origin: { x: Math.random(), y: .3 } }); if (Date.now() < end) setTimeout(f, 300); })(); }
  setWho(r.score);
}

/* ———— Başlangıç ———— */
const pin = (qs.get('pin') || '').replace(/\D/g, '');
const saved = pin && Y.store.get(KEY(pin));
if (saved) { me = saved; start(); }
else joinForm(pin);
})();
