/* ================= tur türleri ================= */
const ROUNDS = {};
const howLine = (text) => h('p', { class: 'how' }, h('span', { html: ICON.hand }), text);

/* ---- eşleştirme ---- */
ROUNDS.match = (body, r, run) => new Promise((res) => {
  const pairs = r.pairs;
  const items = shuffle(pairs);
  const targets = r.layout === 'timeline' ? pairs : shuffle(pairs);
  let selected = null, placed = 0;
  const tray = h('div', { class: 'chip-tray', 'aria-label': 'Kartlar' });
  const grid = h('div', { class: 'targets ' + (r.layout || 'grid') });
  const clearSel = () => { if (selected) selected.classList.remove('sel'); selected = null; body.classList.remove('picking'); };
  const select = (c) => {
    if (run.dead) return; Sound.tap();
    if (selected === c) { clearSel(); return; }
    clearSel(); selected = c; c.classList.add('sel'); body.classList.add('picking');
  };
  const attempt = (c, t) => {
    if (run.dead || !c || t.classList.contains('done')) return;
    const it = pairs.find((p) => p.id === c.dataset.id);
    if (c.dataset.id === t.dataset.id) {
      run.good(t); t.classList.add('done'); t.removeAttribute('tabindex');
      const slot = $('.slot', t); slot.replaceChildren(h('span', { class: 'slot-fill' }, it.label));
      const rv = $('.t-reveal', t); if (rv) rv.hidden = false;
      c.remove(); clearSel(); placed++;
      if (placed === pairs.length) setTimeout(res, 700);
    } else {
      clearSel();
      if (run.bad(t)) toast('bad', `${it.label} buraya ait değil`, it.hint, 6500);
    }
  };
  items.forEach((it) => {
    const c = h('button', { class: 'chip', type: 'button', 'data-id': it.id }, it.label);
    enableDrag(c, { onTap: () => select(c), onDrop: (u) => { const t = u && u.closest('.target'); if (t && grid.contains(t)) attempt(c, t); } });
    tray.append(c);
  });
  targets.forEach((p) => {
    const t = h('div', { class: 'target droppable', 'data-id': p.id, tabindex: '0', role: 'button', 'aria-label': (p.time ? p.time + ', ' : '') + (p.caption || 'Hedef') },
      p.time ? h('span', { class: 't-time' }, p.time) : null,
      p.art ? h('div', { class: 't-art', html: p.art() }) : null,
      p.caption ? h('p', { class: 't-cap' }, p.caption) : null,
      h('div', { class: 'slot' }, h('span', { class: 'slot-ph' }, 'Kartı buraya bırak')),
      p.reveal ? h('p', { class: 't-reveal', hidden: true }, p.reveal) : null);
    onActivate(t, () => { if (selected) attempt(selected, t); else if (!t.classList.contains('done')) { shake(tray); toast('info', 'Önce bir kart seç', 'Üstteki kartlardan birine dokun, sonra bu alana dokun.', 2600); } });
    grid.append(t);
  });
  body.append(howLine('Bir kartı seç, sonra doğru alana dokun ya da kartı sürükleyip bırak.'), tray, grid);
});

/* ---- adım sıralama ---- */
ROUNDS.order = (body, r, run) => new Promise((res) => {
  const steps = r.steps.map((s, i) => ({ ...s, idx: i, real: true }));
  const all = shuffle([...steps, ...(r.distractors || []).map((d) => ({ ...d, real: false }))]);
  let next = 0;
  const pool = h('div', { class: 'pool' });
  const seq = h('ol', { class: 'seq droppable', 'aria-label': 'Senin sıralaman' });
  const progress = h('span', { class: 'mono' }, `0/${steps.length}`);
  steps.forEach((s, i) => seq.append(h('li', { class: 'seq-slot' + (i === 0 ? ' next' : '') }, h('span', { class: 'num' }, i + 1), h('span', { class: 'seq-txt' }, i === 0 ? 'İlk adım?' : '…'))));
  const cards = [];
  const pick = (c, st) => {
    if (run.dead || c.disabled) return;
    if (st.real && st.idx === next) {
      const slot = seq.children[next];
      slot.classList.remove('next'); slot.classList.add('filled'); $('.seq-txt', slot).textContent = st.text;
      run.good(c); c.disabled = true;
      const sr = seq.getBoundingClientRect(); if (sr.top > innerHeight || sr.bottom < 0) toast('ok', `${next + 1}. adım doğru`, st.text, 2200); c.classList.add('used'); setTimeout(() => c.remove(), 380);
      next++; progress.textContent = `${next}/${steps.length}`;
      if (seq.children[next]) { seq.children[next].classList.add('next'); $('.seq-txt', seq.children[next]).textContent = 'Sıradaki adım?'; seq.scrollTo({ top: Math.max(0, slot.offsetTop - seq.clientHeight / 2), behavior: reduceMotion ? 'auto' : 'smooth' }); }
      if (next === steps.length) setTimeout(res, 700);
    } else if (!st.real) {
      c.disabled = true; c.classList.add('trap');
      if (run.bad(c)) toast('bad', 'Bu yanlış bir uygulama', st.why, 7000);
    } else {
      if (run.bad(c)) toast('bad', 'Bu adımın sırası henüz gelmedi', st.why, 6500);
    }
  };
  all.forEach((st) => {
    const c = h('button', { class: 'step', type: 'button' }, h('span', { class: 'grip', 'aria-hidden': 'true' }), h('span', {}, st.text));
    enableDrag(c, { onTap: () => pick(c, st), onDrop: (u) => { if (u && u.closest('.seq')) pick(c, st); } });
    cards.push([c, st]); pool.append(c);
  });
  const hintBtn = h('button', { class: 'btn small ghost', type: 'button', html: ICON.bulb + '<span>İpucu (−50)</span>' });
  hintBtn.querySelector('svg').style.cssText = 'width:16px;height:16px';
  hintBtn.onclick = () => {
    const pair = cards.find(([c, st]) => st.real && st.idx === next && c.isConnected);
    if (!pair) return; run.spend(50); pair[0].classList.remove('hint'); void pair[0].offsetWidth; pair[0].classList.add('hint');
    pair[0].scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  body.append(
    howLine('Adımları doğru sırayla seç (dokun ya da sağdaki listeye sürükle). Bazı kartlar yanlış uygulamadır, onları seçme.'),
    h('div', { class: 'order-grid' },
      h('div', {}, h('h3', { class: 'col-h' }, h('span', {}, 'Adım kartları'), hintBtn), pool),
      h('div', {}, h('h3', { class: 'col-h' }, h('span', {}, 'Senin sıralaman'), progress), seq)));
});

/* ---- soru (çoktan seçmeli + doğru/yanlış) ---- */
function askQuestion(body, q, run, label, opts = {}) {
  return new Promise((res) => {
    body.replaceChildren();
    const correctIdx = q.correct || 0;
    let options = q.options.map((t, i) => ({ t, ok: i === correctIdx }));
    if (!q.fixed) options = shuffle(options);
    let answered = false, timer = null;
    const list = h('div', { class: 'opts' });
    const why = h('div', { class: 'why', hidden: true });
    const nextBtn = h('button', { class: 'btn primary', type: 'button', hidden: true, onclick: () => { clearTimeout(timer); res(); } }, opts.last ? 'Bitir' : 'Devam →');
    const tbar = opts.time ? h('div', { class: 'qtimer' }, h('i')) : null;
    const reveal = (ok, prefix) => {
      why.hidden = false; why.className = 'why' + (ok ? '' : ' bad');
      why.replaceChildren(h('span', { html: ok ? ICON.check : ICON.info }), h('div', {}, h('strong', {}, prefix), ' ', q.why || ''));
      nextBtn.hidden = false; nextBtn.focus({ preventScroll: true });
      if (opts.time && tbar) tbar.firstChild.style.transition = 'none';
    };
    const choose = (b, o) => {
      if (answered || run.dead) return; answered = true; clearTimeout(timer); list.classList.add('answered');
      const rightBtn = [...list.children][options.findIndex((x) => x.ok)];
      if (o.ok) { b.classList.add('right'); run.good(b, false, q); reveal(true, 'Doğru!'); }
      else {
        b.classList.add('wrong'); rightBtn.classList.add('right');
        if (run.bad(b, q) === false) return;
        reveal(false, `Doğru cevap: ${options.find((x) => x.ok).t}.`);
      }
    };
    options.forEach((o, i) => {
      const b = h('button', { class: 'opt', type: 'button' }, h('span', { class: 'opt-k' }, 'ABCDE'[i]), h('span', {}, o.t));
      b.onclick = () => choose(b, o); list.append(b);
    });
    const card = h('div', { class: 'q-card' + (q.fixed ? ' tf' : '') },
      h('p', { class: 'q-label' }, h('span', {}, label), opts.topic ? h('span', {}, opts.topic) : null),
      tbar,
      q.art ? h('div', { class: 'q-art', html: q.art() }) : null,
      h('h3', { class: 'q-text' }, q.q), list, why, h('div', { class: 'q-actions' }, nextBtn));
    body.append(card);
    if (opts.time) {
      requestAnimationFrame(() => requestAnimationFrame(() => { const i = tbar.firstChild; i.style.transition = `transform ${opts.time}s linear`; i.style.transform = 'scaleX(0)'; }));
      setTimeout(() => tbar.classList.add('low'), opts.time * 700);
      timer = setTimeout(() => {
        if (answered || run.dead || !card.isConnected) return; answered = true; list.classList.add('answered');
        [...list.children][options.findIndex((x) => x.ok)].classList.add('right');
        run.bad(null, q); reveal(false, `Süre doldu. Doğru cevap: ${options.find((x) => x.ok).t}.`);
      }, opts.time * 1000);
    }
  });
}
ROUNDS.quiz = async (body, r, run) => {
  for (let i = 0; i < r.questions.length; i++) {
    if (run.dead) return;
    await askQuestion(body, r.questions[i], run, `Soru ${i + 1}/${r.questions.length}`);
  }
};
const tfToQ = (it) => ({ q: it.s, options: ['Doğru', 'Yanlış'], correct: it.a ? 0 : 1, fixed: true, why: it.why });
ROUNDS.tf = async (body, r, run) => {
  const items = shuffle(r.items);
  for (let i = 0; i < items.length; i++) {
    if (run.dead) return;
    await askQuestion(body, tfToQ(items[i]), run, `İfade ${i + 1}/${items.length}`);
  }
};

/* ---- %TBSA (Dokuzlar Kuralı) ---- */
ROUNDS.tbsa = async (body, r, run) => {
  for (let i = 0; i < r.cases.length; i++) {
    if (run.dead) return;
    await tbsaCase(body, r.cases[i], run, i, r.cases.length);
  }
};
function tbsaCase(body, cs, run, i, n) {
  return new Promise((res) => {
    body.replaceChildren();
    const sel = new Set(); let locked = false;
    const total = () => [...sel].reduce((s, id) => s + REGION[id][1], 0);
    const out = h('output', { class: 'tbsa-total', 'aria-live': 'polite' }, '%0');
    const figs = h('div', { class: 'bodies', html: bodyFigure('f') + bodyFigure('b') });
    const toggle = (p) => {
      if (locked || run.dead) return; const id = p.dataset.r;
      if (sel.has(id)) sel.delete(id); else sel.add(id);
      p.classList.toggle('on', sel.has(id)); p.setAttribute('aria-pressed', sel.has(id));
      Sound.tap(); out.textContent = '%' + fmt(total());
    };
    figs.addEventListener('click', (e) => { const p = e.target.closest('[data-r]'); if (p) toggle(p); });
    figs.addEventListener('keydown', (e) => { const p = e.target.closest('[data-r]'); if (p && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(p); } });
    const why = h('div', { class: 'why', hidden: true });
    const nextBtn = h('button', { class: 'btn primary', type: 'button', hidden: true, onclick: res }, 'Devam →');
    const checkBtn = h('button', { class: 'btn primary', type: 'button' }, 'Kontrol et');
    const clearBtn = h('button', { class: 'btn', type: 'button' }, 'Temizle');
    clearBtn.onclick = () => { if (locked) return; sel.clear(); $$('.rg', figs).forEach((p) => { p.classList.remove('on'); p.setAttribute('aria-pressed', 'false'); }); out.textContent = '%0'; };
    checkBtn.onclick = () => {
      if (locked || run.dead) return;
      if (!sel.size) { toast('info', 'Önce bölgeleri işaretle', 'Yanık olan bölgelere dokunarak boya.', 2600); return; }
      locked = true; checkBtn.disabled = true; clearBtn.disabled = true;
      const ans = new Set(cs.regions);
      const ok = ans.size === sel.size && [...ans].every((x) => sel.has(x));
      const ansTotal = cs.regions.reduce((s, id) => s + REGION[id][1], 0);
      if (ok) run.good(out);
      else {
        $$('.rg', figs).forEach((p) => { const id = p.dataset.r; if (ans.has(id) && !sel.has(id)) p.classList.add('miss'); if (!ans.has(id) && sel.has(id)) p.classList.add('extra'); });
        if (run.bad(out) === false) return;
      }
      why.hidden = false; why.className = 'why' + (ok ? '' : ' bad');
      why.replaceChildren(h('span', { html: ok ? ICON.check : ICON.info }), h('div', {}, h('strong', {}, ok ? `Doğru: %${fmt(ansTotal)}.` : `Doğru cevap %${fmt(ansTotal)}. Kesik çizgili bölgeler eksik, taralı bölgeler fazla.`), ' ', cs.why));
      nextBtn.hidden = false; nextBtn.focus({ preventScroll: true });
    };
    body.append(
      h('p', { class: 'q-label' }, h('span', {}, `Vaka ${i + 1}/${n}`)),
      h('div', { class: 'tbsa' },
        h('div', {}, figs),
        h('div', { style: { display: 'grid', gap: '12px', alignContent: 'start' } },
          h('div', { class: 'case', html: cs.text }),
          h('div', {}, h('small', { style: { color: 'var(--ink-2)', fontWeight: 650 } }, 'İşaretlediğin alan'), out),
          h('div', { class: 'tbsa-actions' }, clearBtn, checkBtn),
          why, h('div', { class: 'q-actions' }, nextBtn),
          h('div', { class: 'nines', 'aria-label': 'Dokuzlar Kuralı' },
            ...[['Baş-boyun', '%9'], ['Her bir kol', '%9'], ['Gövde ön', '%18'], ['Gövde arka', '%18'], ['Her bir bacak', '%18'], ['Perine', '%1']].flatMap(([a, b]) => [h('span', {}, a), h('span', {}, b)])))));
  });
}

/* ---- sahnede nokta bulma ---- */
ROUNDS.spots = (body, r, run) => new Promise((res) => {
  const need = r.spots.filter((s) => s.err).length; let found = 0;
  const scene = h('div', { class: 'scene', html: r.scene() });
  const svg = $('svg', scene);
  const counter = h('span', { class: 'mono' }, `0/${need}`);
  const label = (s, g) => {
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('class', 'spot-lbl'); t.setAttribute('x', s.x); t.setAttribute('y', s.y - (s.r || 30) - 6); t.textContent = s.title;
    g.append(t);
  };
  const hit = (s, g) => {
    if (run.dead || g.classList.contains('checked')) return;
    g.classList.add('checked'); g.removeAttribute('tabindex'); label(s, g);
    if (s.err) {
      g.classList.add('found'); found++; counter.textContent = `${found}/${need}`; run.good(g);
      toast('ok', s.title, s.why, 6000);
      if (found === need) setTimeout(res, 1100);
    } else {
      g.classList.add('fine');
      if (run.bad(g)) toast('bad', `${s.title}: ${r.fineLabel || 'bu doğru uygulama'}`, s.why, 6000);
    }
  };
  r.spots.forEach((s) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'spot'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.setAttribute('aria-label', r.dots ? 'İşaretli nokta' : 'Sahnedeki nesne');
    g.innerHTML = `<circle class="hit" cx="${s.x}" cy="${s.y}" r="${s.r || 30}"/>${r.dots ? `<circle class="pin" cx="${s.x}" cy="${s.y}" r="7"/>` : ''}`;
    onActivate(g, () => hit(s, g));
    svg.append(g);
  });
  body.append(howLine(r.how), h('div', { class: 'scene-wrap' }, h('div', { class: 'counter' }, h('span', {}, r.counterLabel), counter), scene));
});

/* ---- tampon tekniği (cerrahi kesi temizliği) ---- */
ROUNDS.swab = (body, r, run) => new Promise((res) => {
  const id = uid('sw'), CX = 150, CENTER = 16;
  const wrap = h('div', { html: swabScene(id) });
  const svg = wrap.firstElementChild;
  const gStrokes = $('.strokes', svg), gClean = $('.clean', svg), dirt = $$('.dirt circle', svg);
  const state = { center: false, L: 0, R: 0, offL: 0, offR: 0, used: 0, done: false };
  const ck = (key, text) => h('li', { 'data-k': key }, h('span', { class: 'ck' }, ''), h('span', { class: 'ck-t' }, text));
  const checks = h('ul', { class: 'checks' }, ck('c', '1. silme: insizyon hattı'), ck('L', 'Sol yan: içten dışa 0/2'), ck('R', 'Sağ yan: içten dışa 0/2'));
  const gauzes = h('div', { class: 'gauzes', 'aria-label': 'Kullanılan tamponlar' });
  const usedTxt = h('span', { class: 'mono' }, '0');
  const refresh = () => {
    const set = (k, ok, txt) => { const li = $(`[data-k="${k}"]`, checks); li.classList.toggle('ok', ok); $('.ck', li).textContent = ok ? '✓' : ''; if (txt) $('.ck-t', li).textContent = txt; };
    set('c', state.center); set('L', state.L >= 2, `Sol yan: içten dışa ${Math.min(state.L, 2)}/2`); set('R', state.R >= 2, `Sağ yan: içten dışa ${Math.min(state.R, 2)}/2`);
    usedTxt.textContent = state.used;
  };
  const pt = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  let pts = null, live = null, pid = null;
  svg.addEventListener('pointerdown', (e) => {
    if (run.dead || state.done || e.button !== 0) return; e.preventDefault();
    pid = e.pointerId; try { svg.setPointerCapture(pid); } catch (err) { }
    pts = [pt(e)];
    live = document.createElementNS(NS, 'path'); live.setAttribute('class', 'sw-live'); gStrokes.append(live);
  });
  svg.addEventListener('pointermove', (e) => {
    if (e.pointerId !== pid || !pts) return;
    const p = pt(e), l = pts[pts.length - 1];
    if (Math.hypot(p.x - l.x, p.y - l.y) < 2.5) return;
    pts.push(p); live.setAttribute('d', 'M' + pts.map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' L'));
  });
  const end = (e) => {
    if (e.pointerId !== pid || !pts) return; pid = null;
    const P = pts, path = live; pts = null; live = null;
    if (e.type === 'pointercancel') { path.remove(); return; }
    evaluate(P, path);
  };
  svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);

  const fail = (path, title, why) => {
    path.setAttribute('class', 'sw-bad'); setTimeout(() => (path.style.opacity = 0), 60); setTimeout(() => path.remove(), 1300);
    state.used++; gauzes.append(h('i', { class: 'bad', title: 'Hatalı silme' })); refresh();
    if (run.bad(svg)) toast('bad', title, why, 6500);
  };
  const success = (path, P, title, why) => {
    path.setAttribute('class', 'sw-ok'); gClean.append(path);
    dirt.forEach((d) => { const x = +d.getAttribute('cx'), y = +d.getAttribute('cy'); if (P.some((q) => Math.abs(q.x - x) < 15 && Math.abs(q.y - y) < 12)) d.classList.add('gone'); });
    state.used++; gauzes.append(h('i', { title: 'Tampon' })); refresh();
    run.good(path); toast('ok', title, why, 3800);
    if (state.center && state.L >= 2 && state.R >= 2) { state.done = true; setTimeout(res, 1200); }
  };
  function evaluate(P, path) {
    let len = 0; for (let i = 1; i < P.length; i++) len += Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y);
    const s = P[0], e = P[P.length - 1], dx = e.x - s.x, dy = e.y - s.y;
    if (len < 50) { path.remove(); toast('info', 'Silme çok kısa', 'Tamponu kesi boyunca tek ve kesintisiz bir hareketle çek.', 2600); return; }
    if (Math.abs(dx) > Math.abs(dy)) return fail(path, 'Yatay ovma yapma', 'Kesi, kendisine dik yönde ovulmaz. Kesi boyunca dikey, tek yönde sil.');
    if (dy < 0) return fail(path, 'Aşağıdan yukarı sildin', 'Silme temizden kirliye yapılır: kesinin baş tarafındaki ucundan başlayıp aşağı doğru, tek yönde.');
    let maxY = -1e9, rev = false; for (const q of P) { if (q.y > maxY) maxY = q.y; if (maxY - q.y > 16) rev = true; }
    if (rev) return fail(path, 'İleri-geri ovma yapma', 'Tampon tek yönde, tek kez kullanılır. Geri dönen hareket kirliliği temiz bölgeye taşır.');
    if (dy < 150) return fail(path, 'Kesinin tamamını sil', 'Tek silmede kesinin üst ucundan alt ucuna kadar in; yarım silme yeni tampon harcatır.');
    const mean = P.reduce((a, q) => a + q.x, 0) / P.length, off = Math.abs(mean - CX), side = mean < CX ? 'L' : 'R';
    if (!state.center) {
      if (off <= CENTER) { state.center = true; return success(path, P, 'İnsizyon hattı temizlendi', 'İlk tampon en temiz bölge olan kesi hattının tam üzerinden, yukarıdan aşağıya geçer.'); }
      return fail(path, 'Önce insizyon hattı', 'En temiz bölge kesi hattıdır. İlk tamponla kesinin tam üzerinden sil, sonra yanlara geç.');
    }
    if (off <= CENTER) return fail(path, 'Kesi hattına geri döndün', 'Yanlara geçtikten sonra insizyon hattına dönülmez; kesi çevresindeki kir kesiye taşınır.');
    const prev = side === 'L' ? state.offL : state.offR;
    if (off < prev + 8) return fail(path, 'İçe doğru sildin', 'Her yeni tampon bir öncekinin biraz dışından geçer: içten dışa ilerle.');
    if (side === 'L') { state.L++; state.offL = off; } else { state.R++; state.offR = off; }
    success(path, P, `Yeni tampon · ${side === 'L' ? 'sol' : 'sağ'} yan`, 'Doğru: yeni tamponla, öncekinin dışından, yukarıdan aşağıya tek silme.');
  }
  body.append(
    howLine('Parmağınla ya da fareyle kesi boyunca silme hareketi çiz. Her çizgi yeni bir steril tampondur.'),
    h('div', { class: 'swab' }, svg,
      h('div', {},
        checks,
        h('p', { style: { marginTop: '14px', fontWeight: 650 } }, 'Kullanılan tampon: ', usedTxt),
        gauzes,
        h('div', { class: 'rule-box' }, 'Kural: temizden kirliye. Önce kesi hattı, sonra kesinin iki yanında içten dışa doğru; her silmede yeni tampon, silme yönü baştan ayağa.'))));
  refresh();
});
