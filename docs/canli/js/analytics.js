/* Sınav sonuç analizi: konu bazında anlaşılma, soru zorluğu, kavram yanılgıları, puan dağılımı, öğrenci tablosu, CSV. */
(function(){
const { $, $$, h, icon, esc } = Y;
const Analytics = window.Analytics = {};
const TH_OK = 80, TH_REDO = 60;
const status = p => p >= TH_OK ? ['good', 'circle-check', 'İyi anlaşıldı'] : p >= TH_REDO ? ['warn', 'circle-alert', 'Pekiştirilmeli'] : ['crit', 'rotate-ccw', 'Tekrar anlatılmalı'];
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const fmtS = ms => (ms / 1000).toFixed(1).replace('.', ',') + ' sn';

function compute(res){
  const order = res.order, Qs = order.map(i => QUIZ.questions[i]);
  const P = res.players.length;
  const byQ = Qs.map((q, qi) => {
    const ans = res.answers.filter(a => a.q_index === qi);
    const counts = q.options.map((_, i) => ans.filter(a => a.choice === i).length);
    const right = counts[q.correct];
    const wrongs = counts.map((c, i) => [c, i]).filter(([, i]) => i !== q.correct).sort((a, b) => b[0] - a[0]);
    const avgMs = ans.length ? ans.reduce((s, a) => s + a.ms, 0) / ans.length : 0;
    return { q, qi, bank: order[qi], ans, counts, right, rate: pct(right, P), answered: ans.length, topWrong: wrongs[0] && wrongs[0][0] > 0 ? wrongs[0][1] : null, avgMs };
  });
  const topics = {};
  byQ.forEach(r => { const t = (topics[r.q.topic] ||= { key: r.q.topic, right: 0, total: 0, qs: [] }); t.right += r.right; t.total += P; t.qs.push(r); });
  const topicArr = Object.values(topics).map(t => ({ ...t, rate: pct(t.right, t.total) })).sort((a, b) => a.rate - b.rate);
  const pstats = res.players.map(p => {
    const mine = res.answers.filter(a => a.player_id === p.id);
    const correct = mine.filter(a => Qs[a.q_index] && Qs[a.q_index].correct === a.choice).length;
    return { ...p, correctN: correct, answeredN: mine.length, avgMs: mine.length ? mine.reduce((s, a) => s + a.ms, 0) / mine.length : 0, score: p.score || 0 };
  }).sort((a, b) => b.score - a.score || b.correctN - a.correctN);
  pstats.forEach((p, i) => p.rank = i + 1);
  const totalRight = byQ.reduce((s, r) => s + r.right, 0);
  const allMs = res.answers.reduce((s, a) => s + a.ms, 0);
  return { Qs, P, byQ, topicArr, pstats, overall: pct(totalRight, P * Qs.length), participation: pct(res.answers.length, P * Qs.length), avgMs: res.answers.length ? allMs / res.answers.length : 0 };
}

let tip;
function tooltip(el, html){
  el.addEventListener('pointerenter', () => { tip ||= document.body.appendChild(h('<div class="tip" role="tooltip"></div>')); tip.innerHTML = html; tip.classList.add('on'); });
  el.addEventListener('pointermove', e => { if (!tip) return; tip.style.left = Math.min(e.clientX + 14, innerWidth - 330) + 'px'; tip.style.top = e.clientY + 14 + 'px'; });
  el.addEventListener('pointerleave', () => tip && tip.classList.remove('on'));
}

Analytics.open = res => {
  if (!res || !res.players) { Y.toast('Analiz için sonuç bulunamadı.'); return; }
  const A = compute(res), root = $('#analysis');
  const date = new Date(res.at || Date.now()).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });
  const redo = A.byQ.filter(r => r.rate < TH_REDO).sort((a, b) => a.rate - b.rate);
  const bins = [0, 0, 0, 0, 0], maxScore = Math.max(1, ...A.pstats.map(p => p.score));
  const binLab = [0, 1, 2, 3, 4].map(i => `${Math.round(maxScore * i / 5)}–${Math.round(maxScore * (i + 1) / 5)}`);
  A.pstats.forEach(p => bins[Math.min(4, Math.floor(p.score / maxScore * 5))]++);
  const corrBins = Array(A.Qs.length + 1).fill(0); A.pstats.forEach(p => corrBins[p.correctN]++);

  root.innerHTML = `<div class="an">
    <header class="an-head">
      <div><div class="kicker">Ölçme ve değerlendirme</div><h1>Sonuç <em>analizi</em></h1>
        <div class="meta"><span class="chip">${icon('hash')}PIN ${esc(res.pin)}</span><span class="chip">${icon('calendar')}${date}</span><span class="chip ${res.mode === 'demo' ? 'amber' : 'teal'}">${res.mode === 'demo' ? 'Demo sınıf' : 'Canlı sınıf'}</span><span class="chip">${A.Qs.length} soru · ${res.duration || 20} sn</span></div></div>
      <div class="an-actions">
        <button class="btn" data-an="csv">${icon('download')}CSV indir</button>
        <button class="btn" data-an="print">${icon('printer')}Yazdır / PDF</button>
        <button class="btn primary" data-an="close">${icon('house')}Ana ekran</button>
      </div>
    </header>

    <div class="kpis">
      <div class="kpi hero"><small>Genel başarı</small><b class="cu" data-v="${A.overall}" data-s="%">0</b><span>${status(A.overall)[2]}</span></div>
      <div class="kpi"><small>Katılımcı</small><b class="cu" data-v="${A.P}">0</b><span>öğrenci</span></div>
      <div class="kpi"><small>Cevaplama oranı</small><b class="cu" data-v="${A.participation}" data-s="%">0</b><span>${res.answers.length} cevap</span></div>
      <div class="kpi"><small>Ortalama cevap süresi</small><b>${fmtS(A.avgMs)}</b><span>soru başına</span></div>
    </div>

    <section class="an-sec"><h2>Konu bazında anlaşılma</h2><p class="sub">Her konudaki soruların doğru cevaplanma oranı. Kesikli çizgiler: %${TH_REDO} (tekrar eşiği) ve %${TH_OK} (iyi anlaşıldı).</p>
      ${A.topicArr.map(t => { const s = status(t.rate); return `<div class="hb" data-tip="${esc(QUIZ.topics[t.key])}: ${t.right}/${t.total} doğru · ${t.qs.length} soru"><span class="lab">${esc(QUIZ.topics[t.key])}</span><div class="track"><i class="fillb" data-w="${t.rate}"></i><i class="th" style="left:${TH_REDO}%"></i><i class="th" style="left:${TH_OK}%"></i></div><span class="val">%${t.rate}</span><span class="st ${s[0]}">${icon(s[1])}${s[2]}</span></div>`; }).join('')}
    </section>

    <section class="an-sec"><h2>Tekrar anlatılması önerilenler</h2><p class="sub">Doğru oranı %${TH_REDO}’ın altında kalan sorular ve en çok seçilen yanlış şık.</p>
      ${redo.length ? `<div class="redo">${redo.map(r => `<div class="card">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="chip violet">${esc(QUIZ.topics[r.q.topic])}</span><span class="st crit">%${r.rate} doğru</span></div>
        <h3>${r.qi + 1}. ${esc(r.q.text)}</h3>
        <p>Doğru cevap: <b style="color:var(--ink)">${esc(r.q.options[r.q.correct])}</b></p>
        ${r.topWrong != null ? `<div class="mis"><b>${r.counts[r.topWrong]} kişi “${esc(r.q.options[r.topWrong])}” dedi.</b> ${esc((r.q.mis || {})[r.topWrong] || '')}</div>` : ''}
        <button class="btn" data-go="${esc(r.q.scene)}">${icon('gamepad-2')}Oyunda bu bölümü aç</button></div>`).join('')}</div>`
        : `<div class="all-good">${icon('party-popper')}Tüm sorularda doğru oranı %${TH_REDO}’ın üzerinde. Harika!</div>`}
    </section>

    <section class="an-sec"><h2>Soru bazında sonuçlar</h2><p class="sub">Çubuk, sınıfın cevap dağılımını gösterir. Üzerine gelince şık sayıları görünür.</p>
      <div class="legend-an"><span><i style="background:var(--teal)"></i>Doğru</span><span><i style="background:var(--coral)"></i>En çok seçilen yanlış</span><span><i style="background:color-mix(in oklab,var(--ink-3) 55%,transparent)"></i>Diğer yanlış</span><span><i style="background:var(--surface-2)"></i>Cevapsız</span></div>
      ${A.byQ.map(r => { const segs = r.counts.map((c, i) => [c, i === r.q.correct ? 'c' : i === r.topWrong ? 'm' : 'w']).filter(s => s[0] > 0); const none = A.P - r.answered;
        const tipHtml = r.q.options.map((o, i) => `${i === r.q.correct ? '✓' : '·'} ${esc(o)}: <b>${r.counts[i]}</b>`).join('<br>') + (none > 0 ? `<br>· Cevapsız: <b>${none}</b>` : '');
        return `<div class="qrow"><span class="qi">${String(r.qi + 1).padStart(2, '0')}</span><div class="qt">${esc(r.q.text)}<small>${esc(QUIZ.topics[r.q.topic])}</small></div>
        <div class="stack" data-tip="${esc(tipHtml)}">${segs.map(([c, k]) => `<i class="${k}" style="flex:${c}"></i>`).join('')}${none > 0 ? `<i class="n" style="flex:${none}"></i>` : ''}</div>
        <span class="val mono" style="text-align:right;font-weight:700">%${r.rate}</span><span class="tm muted small mono" style="text-align:right">${fmtS(r.avgMs)}</span></div>`; }).join('')}
    </section>

    <div class="two">
      <section class="an-sec"><h2>Puan dağılımı</h2><p class="sub">Öğrencilerin toplam puanlarına göre dağılımı.</p>
        <div class="hist">${bins.map((b, i) => `<div class="hcol" data-tip="${binLab[i]} puan: ${b} öğrenci"><b>${b}</b><div class="hbar" data-h="${b / Math.max(1, ...bins) * 100}"></div><small>${binLab[i]}</small></div>`).join('')}</div>
      </section>
      <section class="an-sec"><h2>Doğru sayısı</h2><p class="sub">Kaç öğrenci kaç soruyu doğru bildi.</p>
        <div class="hist">${corrBins.map((b, i) => `<div class="hcol" data-tip="${i} doğru: ${b} öğrenci"><b>${b || ''}</b><div class="hbar" data-h="${b / Math.max(1, ...corrBins) * 100}"></div><small>${i}</small></div>`).join('')}</div>
      </section>
    </div>

    <section class="an-sec"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div><h2>Öğrenciler</h2><p class="sub" style="margin:0">Sütun başlığına tıklayarak sıralayın.</p></div>
      <label class="chip" style="cursor:pointer"><input type="checkbox" class="anon"> İsimleri gizle</label></div>
      <div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><thead><tr><th data-k="rank" class="num" aria-sort="ascending">Sıra</th><th data-k="nickname">Öğrenci</th><th data-k="score" class="num">Puan</th><th data-k="correctN" class="num">Doğru</th><th data-k="answeredN" class="num">Cevap</th><th data-k="avgMs" class="num">Ort. süre</th></tr></thead><tbody></tbody></table></div>
    </section>
    <p class="muted small">Bu analiz sınav verisinden otomatik üretilmiştir. Geçmiş bir oturumu açmak için adrese <span class="mono">?analiz=PIN</span> ekleyin.</p>
  </div>`;
  root.hidden = false; root.scrollTop = 0; Y.icons(root);

  // tablo
  let sortK = 'rank', dir = 1, anon = false;
  const body = root.querySelector('tbody');
  const draw = () => {
    const rows = A.pstats.slice().sort((a, b) => (a[sortK] > b[sortK] ? 1 : a[sortK] < b[sortK] ? -1 : 0) * dir);
    body.innerHTML = rows.map(p => `<tr><td class="num">${p.rank}</td><td>${anon ? `Öğrenci ${p.rank}` : `${esc(p.avatar || '')} ${esc(p.nickname)}`}</td><td class="num">${p.score}</td><td class="num">${p.correctN} / ${A.Qs.length}</td><td class="num">${p.answeredN}</td><td class="num">${fmtS(p.avgMs)}</td></tr>`).join('');
  };
  root.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
    const k = th.dataset.k; dir = sortK === k ? -dir : (k === 'nickname' || k === 'rank' || k === 'avgMs' ? 1 : -1); sortK = k;
    root.querySelectorAll('th').forEach(t => t.removeAttribute('aria-sort')); th.setAttribute('aria-sort', dir > 0 ? 'ascending' : 'descending'); draw();
  }));
  root.querySelector('.anon').addEventListener('change', e => { anon = e.target.checked; draw(); });
  draw();

  root.querySelectorAll('[data-tip]').forEach(el => tooltip(el, el.dataset.tip));
  root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { Analytics.close(); Deck.go(b.dataset.go); }));
  root.querySelector('[data-an="close"]').addEventListener('click', () => { Analytics.close(); Deck.go('kapanis'); });
  root.querySelector('[data-an="print"]').addEventListener('click', () => print());
  root.querySelector('[data-an="csv"]').addEventListener('click', () => csv(res, A));
  requestAnimationFrame(() => {
    root.querySelectorAll('.fillb').forEach(f => f.style.width = f.dataset.w + '%');
    root.querySelectorAll('.hbar').forEach(f => f.style.height = f.dataset.h + '%');
    root.querySelectorAll('.cu').forEach(b => Y.countUp(b, +b.dataset.v, { dur: 1.4, prefix: b.dataset.s || '' }));
  });
};

function csv(res, A){
  const q = s => `"${String(s).replace(/"/g, '""')}"`;
  const head = ['Sıra', 'Öğrenci', 'Puan', 'Doğru', 'Cevaplanan', 'Ort. süre (sn)', ...A.Qs.map((_, i) => 'S' + (i + 1))];
  const lines = [head.map(q).join(';')];
  A.pstats.forEach(p => {
    const per = A.Qs.map((qq, qi) => { const a = res.answers.find(x => x.player_id === p.id && x.q_index === qi); return a ? (a.choice === qq.correct ? '1' : '0') : ''; });
    lines.push([p.rank, p.nickname, p.score, p.correctN, p.answeredN, (p.avgMs / 1000).toFixed(1).replace('.', ','), ...per].map(q).join(';'));
  });
  lines.push('');
  lines.push(['Soru', 'Konu', 'Doğru oranı %', ...['A', 'B', 'C', 'D']].map(q).join(';'));
  A.byQ.forEach(r => lines.push([r.q.text, QUIZ.topics[r.q.topic], r.rate, ...r.counts].map(q).join(';')));
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `yara-sinav-${res.pin}.csv`; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

Analytics.close = () => { const r = $('#analysis'); r.hidden = true; r.innerHTML = ''; tip && tip.classList.remove('on'); };

Analytics.openPin = async pin => {
  const local = Y.store.get('yara_res_' + pin);
  if (local) return Analytics.open(local);
  if (!DB.hasLive) return Y.toast('Bu PIN için kayıt bulunamadı.');
  try {
    const d = await DB.loadByPin(pin);
    const order = d.session.qset || QUIZ.questions.map((_, i) => i);
    Analytics.open({ pin, mode: 'live', order, duration: d.session.q_duration, at: Date.parse(d.session.created_at),
      players: d.players.map(p => ({ id: p.id, nickname: p.nickname, avatar: p.avatar, score: p.score })), answers: d.answers });
  } catch (e) { Y.toast(e.message); }
};
})();
