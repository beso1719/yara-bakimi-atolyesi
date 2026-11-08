/* Veri katmanı: Supabase (canlı) veya bellek içi DEMO (sanal öğrenciler). Sunucu ve öğrenci sayfası ortak kullanır. */
(function(){
const CFG = window.YARA_CONFIG || {};
const hasLive = !!(CFG.SUPABASE_URL && CFG.SUPABASE_KEY && window.supabase);
let sb = null;
const client = () => (sb ||= supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_KEY, { auth: { persistSession: false }, realtime: { params: { eventsPerSecond: 20 } } }));
const errMsg = e => {
  const m = (e && (e.message || e.details || e.hint)) || String(e);
  const map = { pin_yok: 'Bu PIN ile açık bir sınav yok.', ad_alinmis: 'Bu ad alınmış; soyadının baş harfini ekle.', bitti: 'Bu sınav sona erdi.', ad_gecersiz: 'Ad 1–20 karakter olmalı.', dolu: 'Sınav dolu.', kapali: 'Bu soru kapandı.', sure_doldu: 'Süre doldu.', yetkisiz: 'Yetki hatası.' };
  for (const k in map) if (m.includes(k)) return map[k];
  if (/fetch|network|Failed/i.test(m)) return 'Bağlantı kurulamadı. İnterneti kontrol et.';
  return m;
};

/* Ağ kesintisinde (okul Wi-Fi'ı) RPC'yi birkaç kez yeniden dene; mantık hataları hemen döner */
async function rpcRetry(fn, args, tries = 3){
  let last;
  for (let i = 0; i < tries; i++){
    let r;
    try { r = await client().rpc(fn, args); } catch (e) { r = { error: e }; } // sorgu nesnesi yalnız thenable, .catch yok
    if (!r.error || !/fetch|network|Failed|timeout/i.test(r.error.message || String(r.error))) return r;
    last = r; await new Promise(res => setTimeout(res, 500 * (i + 1)));
  }
  return last;
}

/* ———————— CANLI (Supabase) ———————— */
function Live(){
  let S = null; // {id, pin, token}
  const ch = [];
  const players = new Map(), answers = new Map(); // answers key: player|q
  const cb = { player: [], answer: [], session: [] };
  const emitP = p => { const isNew = !players.has(p.id); players.set(p.id, { ...players.get(p.id), ...p }); if (isNew) cb.player.forEach(f => f(p)); };
  const emitA = a => { const k = a.player_id + '|' + a.q_index; if (answers.has(k)) return; answers.set(k, a); cb.answer.forEach(f => f(a)); };
  let poll = null;
  async function pull(){
    if (!S) return;
    const c = client();
    const [{ data: ps }, { data: as }, { data: ss }] = await Promise.all([
      c.from('yq_players').select('id,nickname,avatar,joined_at').eq('session_id', S.id),
      c.from('yq_answers').select('player_id,q_index,choice,ms').eq('session_id', S.id),
      c.from('yq_sessions').select('remote_seq,remote_cmd').eq('id', S.id).single()
    ]);
    (ps || []).forEach(emitP); (as || []).forEach(emitA);
    if (ss) cb.session.forEach(f => f(ss));
  }
  return {
    mode: 'live',
    get session(){ return S; },
    async create(title){
      const { data, error } = await rpcRetry('yq_create', { p_title: title, p_quiz: QUIZ.id });
      if (error) throw new Error(errMsg(error));
      const r = data[0]; S = { id: r.session_id, pin: r.pin, token: r.host_token };
      Y.store.set('yara_host', S);
      const c = client();
      ch.push(c.channel('yq-host-' + S.id)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'yq_players', filter: `session_id=eq.${S.id}` }, p => emitP(p.new))
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'yq_answers', filter: `session_id=eq.${S.id}` }, p => emitA(p.new))
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'yq_sessions', filter: `id=eq.${S.id}` }, p => cb.session.forEach(f => f(p.new)))
        .subscribe());
      poll = setInterval(() => pull().catch(() => {}), 2000);
      return S;
    },
    async host(patch){
      if (!S) return;
      const { error } = await rpcRetry('yq_host', { p_session: S.id, p_token: S.token, p: patch });
      if (error) throw new Error(errMsg(error));
    },
    async scores(rows){
      if (!S) return;
      const { error } = await rpcRetry('yq_host_scores', { p_session: S.id, p_token: S.token, p_rows: rows });
      if (error) throw new Error(errMsg(error));
    },
    on(type, fn){ cb[type].push(fn); },
    players: () => [...players.values()],
    answersFor: q => [...answers.values()].filter(a => a.q_index === q),
    allAnswers: () => [...answers.values()],
    refresh: pull,
    close(){ clearInterval(poll); ch.forEach(c => client().removeChannel(c)); ch.length = 0; S = null; players.clear(); answers.clear(); Object.keys(cb).forEach(k => cb[k] = []); }
  };
}
/* Yardım: önceki bir oturumu PIN ile yükle (analiz için) */
async function loadByPin(pin){
  const c = client();
  const { data: s, error } = await c.from('yq_sessions').select('*').eq('pin', pin).single();
  if (error || !s) throw new Error('Oturum bulunamadı.');
  const [{ data: ps }, { data: as }] = await Promise.all([
    c.from('yq_players').select('*').eq('session_id', s.id),
    c.from('yq_answers').select('player_id,q_index,choice,ms').eq('session_id', s.id)
  ]);
  return { session: s, players: ps || [], answers: as || [] };
}

/* ———————— DEMO (sanal sınıf) ———————— */
const BOT_NAMES = ['Zeynep', 'Elif', 'Ayşe', 'Merve', 'Büşra', 'Kübra', 'Esra', 'Sena', 'Ece', 'İrem', 'Damla', 'Selin', 'Yusuf', 'Emre', 'Burak', 'Mert', 'Kaan', 'Furkan', 'Hilal', 'Rabia', 'Gizem', 'Nur', 'Beyza', 'Tuğba', 'Ömer', 'Cansu', 'Derya', 'Sude', 'Melike', 'Aleyna', 'Berk', 'Şeyma'];
const AVATARS = ['🦊', '🐼', '🐨', '🦁', '🐯', '🐸', '🐙', '🦄', '🐝', '🦉', '🐬', '🐢', '🦋', '🐧', '🐳', '🌸', '🍀', '⭐', '🔥', '⚡'];
function Demo(n = 28){
  let S = null, status = 'idle', q = -1, qStart = 0, qDur = 20, timers = [];
  const players = new Map(), answers = [];
  const cb = { player: [], answer: [], session: [] };
  const bots = BOT_NAMES.slice(0, n).map((name, i) => ({ id: 'bot-' + i, nickname: name, avatar: AVATARS[i % AVATARS.length], skill: .45 + Math.random() * .5, speed: .35 + Math.random() * .6 }));
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  function botsAnswer(qi){
    const qq = Demo.currentQuestion; if (!qq) return;
    const nOpt = qq.options.length, misKeys = Object.keys(qq.mis || {}).map(Number);
    const hard = { 13: .25, 1: .15, 10: .2, 5: .05 }[qi] || .1;
    bots.forEach(b => {
      if (!players.has(b.id) || Math.random() < .04) return;
      const t = (1.2 + (1 - b.speed) * qDur * .75 + Math.random() * 3) * 1000;
      later(Math.min(t, qDur * 1000 - 300), () => {
        if (status !== 'question' || q !== qi) return;
        let choice;
        if (Math.random() < b.skill - hard) choice = qq.correct;
        else if (misKeys.length && Math.random() < .7) choice = misKeys[Math.floor(Math.random() * misKeys.length)];
        else { do choice = Math.floor(Math.random() * nOpt); while (choice === qq.correct && nOpt > 1 && Math.random() < .7); }
        const a = { player_id: b.id, q_index: qi, choice, ms: Math.round(performance.now() - qStart) };
        answers.push(a); cb.answer.forEach(f => f(a));
      });
    });
  }
  return {
    mode: 'demo',
    get session(){ return S; },
    async create(){ S = { id: 'demo', pin: String(100000 + Math.floor(Math.random() * 900000)), token: 'demo' }; return S; },
    async host(p){
      if (p.status) status = p.status;
      if (p.q_duration) qDur = p.q_duration;
      if (p.status === 'lobby' && !players.size){
        bots.forEach((b, i) => later(900 + i * 260 + Math.random() * 500, () => { players.set(b.id, b); cb.player.forEach(f => f(b)); }));
      }
      if (p.status === 'question'){ q = p.q_index; qStart = performance.now(); botsAnswer(q); }
    },
    async scores(){},
    on(type, fn){ cb[type].push(fn); },
    players: () => [...players.values()],
    answersFor: qi => answers.filter(a => a.q_index === qi),
    allAnswers: () => answers.slice(),
    refresh: async () => {},
    close(){ timers.forEach(clearTimeout); timers = []; S = null; players.clear(); answers.length = 0; Object.keys(cb).forEach(k => cb[k] = []); }
  };
}

/* ——— Yönetici anahtarı: oturumun sunucu anahtarı yönetici şifresiyle şifrelenip herkese açık alana konur.
   Şifreyi bilmeyen anahtarı çözemez, dolayısıyla telefondan sınavı yönetemez. Şifrenin kendisi hiçbir yerde saklanmaz. ——— */
const te = new TextEncoder(), td = new TextDecoder();
const b64 = u8 => btoa(String.fromCharCode(...u8)), unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
async function passKey(pass, salt){
  const base = await crypto.subtle.importKey('raw', te.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function seal(pass, text){
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await passKey(pass, salt), te.encode(text)));
  return 'v1:' + b64(new Uint8Array([...salt, ...iv, ...ct]));
}
async function unseal(pass, blob){
  if (!blob || !blob.startsWith('v1:')) return null;
  try {
    const u = unb64(blob.slice(3));
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u.slice(16, 28) }, await passKey(pass, u.slice(0, 16)), u.slice(28));
    return td.decode(pt);
  } catch { return null; }
}
async function sha256(s){ return [...new Uint8Array(await crypto.subtle.digest('SHA-256', te.encode(s)))].map(b => b.toString(16).padStart(2, '0')).join(''); }
// Yönetici şifresinin SHA-256 özeti (şifre kodda açık yazılmaz)
const ADMIN_HASH = '0cb37e55821fe24a543fbc144f698b11fd562dce00424507dd78e7f33edf2e5e';
const checkAdmin = async pass => (await sha256(String(pass || '').trim().toLocaleLowerCase('tr'))) === ADMIN_HASH;

window.DB = {
  hasLive, client, errMsg, loadByPin, AVATARS, rpcRetry, seal, unseal, checkAdmin,
  make(demo){ return demo || !hasLive ? Demo() : Live(); }
};
window.DemoBots = Demo;
})();
