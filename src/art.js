/* ================= çizimler (hepsi kodla üretilen SVG) ================= */
const LEVEL_ICONS = (() => {
  const w = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  return {
    flame: w('<path d="M12 2.8c.6 3 4.6 5 4.6 10a4.6 4.6 0 0 1-9.2 0c0-2.3 1.2-3.6 2.4-4.6 0 2 .9 3.2 2 3.4-.6-3.3-.5-6 .2-8.8z"/>'),
    bed: w('<path d="M3 6v13M3 15h18v4M21 15v-2.5A3.5 3.5 0 0 0 17.5 9H11v6"/><circle cx="7" cy="12" r="2.1"/>'),
    scalpel: w('<path d="M3.5 20.5L13 11l2.5 2.5c-3 4-7 6.3-12 7z"/><path d="M13 11l6.2-6.2a1.8 1.8 0 0 1 2.5 2.5L15.5 13.5"/>'),
    flask: w('<path d="M9 3h6M10 3v6.2L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.2V3"/><path d="M7.4 15h9.2"/>'),
    gauze: w('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17" stroke-width="1.1"/>'),
    search: w('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8"/><path d="M8 10.5h5M10.5 8v5" stroke-width="1.5"/>'),
    cap: w('<path d="M2 9.5l10-5 10 5-10 5z"/><path d="M6 11.5v4.8c3.3 2.3 8.7 2.3 12 0v-4.8M22 9.5v5"/>'),
  };
})();

/* ---- deri kesiti ---- */
function skinDefs(id) {
  return `
  <linearGradient id="${id}e" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7D8C0"/><stop offset="1" stop-color="#E7B38E"/></linearGradient>
  <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2B6A9"/><stop offset="1" stop-color="#DE9088"/></linearGradient>
  <pattern id="${id}f" width="18" height="14" patternUnits="userSpaceOnUse"><rect width="18" height="14" fill="#EBC56C"/><circle cx="5" cy="7" r="5" fill="#F8DE95" stroke="#D9AF55" stroke-width=".8"/><circle cx="14" cy="1.5" r="4" fill="#F8DE95" stroke="#D9AF55" stroke-width=".8"/><circle cx="14" cy="12.5" r="4" fill="#F8DE95" stroke="#D9AF55" stroke-width=".8"/></pattern>
  <pattern id="${id}m" width="14" height="7" patternUnits="userSpaceOnUse"><rect width="14" height="7" fill="#B0463F"/><path d="M0 2h14M0 5.5h14" stroke="#933630" stroke-width="1"/><path d="M7 0v7" stroke="#C25A52" stroke-width=".5"/></pattern>
  <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4ECDD"/><stop offset="1" stop-color="#D9C9AE"/></linearGradient>`;
}
function skinLayers(id, opt = {}) {
  const hair = opt.noHair ? '' : `
  <path d="M30 18 L35 34 L38 76" stroke="#4E3324" stroke-width="1.4" fill="none"/><ellipse cx="38" cy="78" rx="4" ry="5.5" fill="#D57D74" stroke="#B05B53"/>
  <path d="M232 20 L227 34 L224 74" stroke="#4E3324" stroke-width="1.4" fill="none"/><ellipse cx="224" cy="76" rx="4" ry="5.5" fill="#D57D74" stroke="#B05B53"/>
  <path d="M52 46 C52 58 47 62 53 68 C59 74 48 78 54 83" stroke="#BF6A63" stroke-width="1.3" fill="none"/>`;
  return `
  <rect x="0" y="152" width="260" height="18" fill="url(#${id}b)"/>
  <path d="M0 158h260" stroke="#CDBB9C" stroke-dasharray="2 5"/>
  <rect x="0" y="124" width="260" height="28" fill="url(#${id}m)"/>
  <rect x="0" y="88" width="260" height="36" fill="url(#${id}f)"/>
  <rect x="0" y="46" width="260" height="42" fill="url(#${id}d)"/>
  <rect x="0" y="34" width="260" height="12" fill="url(#${id}e)"/>
  <path d="M0 34.5h260" stroke="#C88E6A" stroke-width="1"/>
  <path d="M0 108 C40 102 80 114 130 106 S220 102 260 108" stroke="#C0392B" stroke-width="2.2" fill="none" opacity=".8"/>
  <path d="M0 115 C50 111 90 121 140 113 S220 111 260 117" stroke="#3E64A8" stroke-width="2.2" fill="none" opacity=".7"/>
  ${hair}`;
}
const LAYER_LABELS = `<g class="lbl"><text x="254" y="43">Epidermis</text><text x="254" y="70">Dermis</text><text x="254" y="109">Subkutan yağ</text><text x="254" y="141">Kas</text><text x="254" y="165">Kemik</text></g>`;
const svgWrap = (vb, inner, label) => `<svg viewBox="${vb}" role="img" aria-label="${label || ''}" xmlns="${NS}">${inner}</svg>`;

/* ---- yanık derinliği ---- */
function burnArt(k) {
  const id = uid('bn'), x1 = 58, x2 = 186, mid = 122;
  const D = { d1: 46, d2s: 64, d2d: 86, d3: 104, d4: 166 }[k];
  const zone = `M${x1} 34 L${x2} 34 L${x2 - 10} ${D} Q${mid} ${D + 6} ${x1 + 10} ${D} Z`;
  const grads = {
    d1: [['#E9473A', .5], ['#E9473A', .25]],
    d2s: [['#EE4E43', .62], ['#E68379', .4]],
    d2d: [['#F6EFE6', .9], ['#D6463C', .75]],
    d3: [['#4A3226', .95], ['#C7AD8E', .9]],
    d4: [['#100A08', 1], ['#5B2A20', .95]],
  }[k];
  let deco = '';
  if (k === 'd1') deco = `<rect x="${x1}" y="31" width="${x2 - x1}" height="5" rx="2.5" fill="#F05A4B" opacity=".55"/>`;
  if (k === 'd2s') deco = `<path d="M${x1 + 12} 35 Q${mid} 2 ${x2 - 12} 35 Z" fill="#FFF0D2" fill-opacity=".72" stroke="#E2AE86" stroke-width="1.4"/>
     <ellipse cx="${mid - 18}" cy="17" rx="16" ry="4" fill="#fff" opacity=".7" transform="rotate(-12 ${mid - 18} 17)"/>
     <text x="${mid}" y="28" text-anchor="middle" font-size="8" font-weight="700" fill="#9B5D3B">bül</text>`;
  if (k === 'd2d') deco = `<path d="M${x1 + 6} 35 Q${x1 + 22} 24 ${x1 + 40} 33" fill="none" stroke="#EAC9A9" stroke-width="2"/><path d="M${x2 - 40} 33 Q${x2 - 22} 25 ${x2 - 6} 35" fill="none" stroke="#EAC9A9" stroke-width="2"/>
     ${[[80, 44], [104, 56], [128, 42], [150, 60], [168, 46], [116, 70], [140, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${4 + (x % 3)}" fill="#FBF6F0" opacity=".85"/>`).join('')}
     ${[[92, 38], [136, 36], [160, 39]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff" opacity=".9"/>`).join('')}`;
  if (k === 'd3') deco = `<path d="M${x1} 34 Q${mid} 28 ${x2} 34 L${x2} 40 Q${mid} 36 ${x1} 40 Z" fill="#3B2A22"/>
     <path d="M78 33l6 6 5-5 7 6M122 31l4 7 6-4M150 32l5 6 6-5" stroke="#A88B70" stroke-width="1.2" fill="none"/>`;
  if (k === 'd4') deco = `<path d="M${x1} 34 Q${mid} 26 ${x2} 34 L${x2} 42 Q${mid} 38 ${x1} 42 Z" fill="#0B0605"/>
     <path d="M74 34l8 9 6-6 9 10 5-7M120 32l6 12 7-8 8 10M156 33l6 8 8-6" stroke="#E2622F" stroke-width="1.3" fill="none" opacity=".85"/>
     <rect x="96" y="152" width="56" height="14" fill="#2A1712" opacity=".85"/>
     <path class="smoke" d="M92 24 q-6 -8 0 -14 q6 -6 0 -12" stroke="#8A8A8A" stroke-width="3" fill="none" stroke-linecap="round"/>
     <path class="smoke" style="animation-delay:1.2s" d="M148 26 q-6 -8 0 -14 q6 -6 0 -12" stroke="#8A8A8A" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const depth = `<path d="M14 34 V${D - 3}" stroke="#B3261E" stroke-width="2"/><path d="M10 ${D - 7} L14 ${D} L18 ${D - 7}" fill="#B3261E"/><path d="M9 34h10" stroke="#B3261E" stroke-width="2"/>`;
  return svgWrap('0 0 260 170', `<defs>${skinDefs(id)}
    <linearGradient id="${id}z" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${grads[0][0]}" stop-opacity="${grads[0][1]}"/><stop offset="1" stop-color="${grads[1][0]}" stop-opacity="${grads[1][1]}"/></linearGradient></defs>
    ${skinLayers(id)}<path d="${zone}" fill="url(#${id}z)"/>${deco}${depth}${LAYER_LABELS}`, 'Deri kesitinde yanık derinliği');
}

/* ---- bası yarası evreleri ---- */
function bowl(x1, x2, d) { const cy = 34 + (d - 34) / 0.75; return `M${x1} 34 C${x1 + 6} ${cy} ${x2 - 6} ${cy} ${x2} 34 Z`; }
function ulcerArt(k) {
  const id = uid('pu'); let inner = '', defs = skinDefs(id);
  defs += `<linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E25B57"/><stop offset="1" stop-color="#A92A2E"/></linearGradient>
    <radialGradient id="${id}p" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5A1F52" stop-opacity=".9"/><stop offset="1" stop-color="#5A1F52" stop-opacity="0"/></radialGradient>
    <pattern id="${id}s" width="10" height="8" patternUnits="userSpaceOnUse"><rect width="10" height="8" fill="#D9B24E"/><path d="M0 6c3-3 5 1 10-3" stroke="#B88E2E" fill="none"/></pattern>`;
  const gran = (x1, x2, y1, y2, n) => Array.from({ length: n }, (_, i) => { const x = x1 + ((i * 37) % (x2 - x1)), y = y1 + ((i * 23) % (y2 - y1)); return `<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="#EA6560"/><circle cx="${x - 1}" cy="${y - 1.4}" r="1.2" fill="#fff" opacity=".55"/>`; }).join('');
  if (k === 's1') inner = `<ellipse cx="122" cy="39" rx="64" ry="8" fill="#D13D38" opacity=".55"/><ellipse cx="122" cy="52" rx="58" ry="10" fill="#D13D38" opacity=".18"/>
     <path d="M108 0 V20 Q108 32 122 32 Q136 32 136 20 V0" fill="#F2D0B5" stroke="#C88E6A" stroke-width="1.3"/><path d="M114 22 Q122 27 130 22" stroke="#C88E6A" fill="none"/>
     <text x="122" y="64" text-anchor="middle" font-size="8.5" font-weight="700" fill="#7A1F1C">basınca solmaz</text>`;
  if (k === 's2') inner = `<path d="${bowl(72, 172, 58)}" fill="url(#${id}w)"/><path d="${bowl(72, 172, 58)}" fill="#F48A86" opacity=".55"/>
     <ellipse cx="108" cy="42" rx="16" ry="3" fill="#fff" opacity=".6"/><ellipse cx="140" cy="46" rx="7" ry="2" fill="#fff" opacity=".5"/>`;
  if (k === 's3' || k === 'un') {
    const b = bowl(64, 180, 106);
    inner = `<clipPath id="${id}c"><path d="${b}"/></clipPath><path d="${b}" fill="url(#${id}w)"/>
      <g clip-path="url(#${id}c)"><rect x="60" y="84" width="124" height="30" fill="url(#${id}f)" opacity=".95"/>${gran(76, 168, 44, 80, 16)}</g>
      <circle cx="64" cy="35" r="4" fill="#E3A98A" stroke="#C88E6A"/><circle cx="180" cy="35" r="4" fill="#E3A98A" stroke="#C88E6A"/>`;
    if (k === 'un') inner += `<path d="M64 34 Q122 22 180 34 Q176 70 122 74 Q68 70 64 34Z" fill="url(#${id}s)"/>
      <path d="M86 36 Q104 30 120 38 Q112 54 94 52 Z" fill="#231812"/><path d="M134 36 Q156 32 168 40 Q160 58 140 54 Z" fill="#2B1D16"/>
      <path d="${b}" fill="none" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 4" opacity=".9"/>
      <text x="122" y="98" text-anchor="middle" font-size="22" font-weight="800" fill="#fff" stroke="#7A1F1C" stroke-width=".8">?</text>`;
  }
  if (k === 's4') {
    const b = bowl(56, 188, 160);
    inner = `<clipPath id="${id}c"><path d="${b}"/></clipPath><path d="${b}" fill="url(#${id}w)"/>
      <g clip-path="url(#${id}c)"><rect x="50" y="86" width="150" height="38" fill="url(#${id}f)" opacity=".9"/><rect x="50" y="124" width="150" height="28" fill="url(#${id}m)"/>
      <rect x="50" y="146" width="150" height="24" fill="url(#${id}b)"/>${gran(80, 166, 44, 82, 12)}</g>
      <path d="M58 52 Q36 60 22 54" stroke="#7A1F1C" stroke-width="2.2" stroke-dasharray="4 3" fill="none"/>
      <path d="M186 56 Q210 66 226 60" stroke="#7A1F1C" stroke-width="2.2" stroke-dasharray="4 3" fill="none"/>
      <text x="122" y="164" text-anchor="middle" font-size="8.5" font-weight="700" fill="#5A4630">kemik görünür</text>`;
  }
  if (k === 'dti') inner = `<ellipse cx="122" cy="140" rx="72" ry="30" fill="url(#${id}p)"/><ellipse cx="122" cy="110" rx="56" ry="26" fill="url(#${id}p)" opacity=".7"/>
     <ellipse cx="122" cy="39" rx="62" ry="7" fill="#6B2A5E" opacity=".75"/><path d="M104 35 Q122 20 140 35Z" fill="#5C1630" opacity=".85"/>
     <ellipse cx="116" cy="30" rx="6" ry="2" fill="#fff" opacity=".4"/>`;
  return svgWrap('0 0 260 170', `<defs>${defs}</defs>${skinLayers(id)}${inner}${LAYER_LABELS}`, 'Deri kesitinde bası yarası');
}

/* ---- cerrahi kesi iyileşme fazları ---- */
function phaseArt(k) {
  const id = uid('ph');
  const base = `<defs>${skinDefs(id)}
    <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A3222B"/><stop offset="1" stop-color="#64101A"/></linearGradient>
    <radialGradient id="${id}r" cx=".5" cy=".4" r=".55"><stop offset="0" stop-color="#FF5A4E" stop-opacity=".55"/><stop offset="1" stop-color="#FF5A4E" stop-opacity="0"/></radialGradient></defs>
    <rect width="260" height="150" fill="#F8EEE6"/>
    <g transform="translate(0,-8)">
    <rect x="0" y="112" width="260" height="46" fill="url(#${id}f)"/>
    <rect x="0" y="44" width="260" height="68" fill="url(#${id}d)"/>
    <rect x="0" y="34" width="260" height="10" fill="url(#${id}e)"/>
    <path d="M0 34.5h260" stroke="#C88E6A"/>`;
  const V = 'M110 34 L130 104 L150 34 Z';
  let inner = '';
  if (k === 'hemo') {
    inner = `<path d="${V}" fill="url(#${id}c)"/>
      <path d="M116 46l26 22M144 44l-24 30M118 66l20 20M140 62l-14 28M122 52l18-2M120 80l14 6" stroke="#F6E2D6" stroke-width=".9" opacity=".75"/>
      ${[[122, 50], [136, 58], [128, 72], [132, 88], [124, 64], [140, 46]].map(([x, y], i) => `<g class="drift" style="animation-delay:${i * .4}s"><ellipse cx="${x}" cy="${y}" rx="4.6" ry="3.2" fill="#D4322E"/><ellipse cx="${x}" cy="${y}" rx="2" ry="1.2" fill="#9E1C1C"/></g>`).join('')}
      ${[[118, 44], [146, 40], [132, 96], [126, 84], [142, 70]].map(([x, y], i) => `<ellipse class="drift" style="animation-delay:${i * .6}s" cx="${x}" cy="${y}" rx="2.6" ry="1.6" fill="#C8B4E6" stroke="#8D72C2" stroke-width=".6"/>`).join('')}
      <path d="M0 125 C60 121 100 127 120 125" stroke="#C0392B" stroke-width="1.6" fill="none"/><path d="M140 125 C160 123 200 121 260 125" stroke="#C0392B" stroke-width="1.6" fill="none"/>`;
  }
  if (k === 'infl') {
    const neut = (x, y, d) => `<g class="wobble" style="animation-delay:${d}s"><circle cx="${x}" cy="${y}" r="6.5" fill="#EEE8F7" stroke="#9575CD" stroke-width=".9"/><circle cx="${x - 2}" cy="${y - 1.5}" r="1.9" fill="#7E57C2"/><circle cx="${x + 2}" cy="${y - 1}" r="1.7" fill="#7E57C2"/><circle cx="${x}" cy="${y + 2}" r="1.7" fill="#7E57C2"/></g>`;
    const mac = (x, y, d) => `<g class="wobble" style="animation-delay:${d}s"><path d="M${x - 11} ${y} q2 -10 11 -10 q10 1 11 8 q2 9 -8 12 q-10 3 -14 -10z" fill="#F6DCB6" stroke="#C49758" stroke-width=".9"/><ellipse cx="${x}" cy="${y}" rx="4" ry="3" fill="#8D6E63"/></g>`;
    const bac = (x, y) => `<rect x="${x}" y="${y}" width="7" height="3" rx="1.5" fill="#6DBE45" opacity=".85" transform="rotate(${(x * 7) % 90} ${x} ${y})"/>`;
    inner = `<ellipse class="pulse" cx="130" cy="70" rx="110" ry="58" fill="url(#${id}r)"/>
      <path d="${V}" fill="#B6433F" opacity=".9"/>
      ${neut(124, 52, 0)}${neut(138, 76, .5)}${neut(96, 66, 1)}${neut(166, 58, 1.4)}${mac(130, 88, .3)}${mac(176, 92, .9)}${mac(86, 92, 1.2)}
      ${bac(118, 64)}${bac(142, 50)}${bac(150, 86)}${bac(108, 80)}`;
  }
  if (k === 'prol') {
    const bumps = Array.from({ length: 22 }, (_, i) => { const y = 46 + (i * 13) % 56; const hw = (y - 34) * 10 / 70; const x = 130 - (20 - hw) + ((i * 29) % Math.max(2, (40 - 2 * hw))); return `<circle cx="${x}" cy="${y}" r="${3.4 + (i % 3)}" fill="#E8605B"/><circle cx="${x - 1}" cy="${y - 1.3}" r="1.1" fill="#fff" opacity=".6"/>`; }).join('');
    const fib = [[96, 62, 20], [168, 70, -15], [84, 90, 10], [178, 96, 30], [112, 100, -25], [150, 102, 15]].map(([x, y, r]) => `<ellipse class="drift" cx="${x}" cy="${y}" rx="8" ry="2.3" fill="#F2B880" stroke="#C98B4E" stroke-width=".6" transform="rotate(${r} ${x} ${y})"/>`).join('');
    inner = `<path d="${V}" fill="#C83E3E"/>${bumps}${fib}
      <path d="M70 60 q8 -6 16 0 t16 0 M150 66 q8 -6 16 0 t16 0 M72 104 q8 -5 16 0 t16 0 M150 98 q8 -5 16 0 t16 0" stroke="#FBE3C9" stroke-width="1.2" fill="none"/>
      <path d="M124 104 q-6 -18 4 -30 q8 -10 0 -24 M136 104 q6 -16 -3 -28" stroke="#B71C1C" stroke-width="1.4" fill="none"/>
      <rect class="creep l" x="108" y="34" width="18" height="6" rx="3" fill="#F2C9A9"/><rect class="creep r" x="134" y="34" width="18" height="6" rx="3" fill="#F2C9A9"/>`;
  }
  if (k === 'mat') {
    inner = `<rect x="106" y="44" width="48" height="60" fill="#F3D4CB" opacity=".9"/>
      ${[50, 58, 66, 74, 82, 90, 98].map((y) => `<path d="M108 ${y} H152" stroke="#E2A79D" stroke-width="1.6"/>`).join('')}
      <path d="M126 34 Q130 37 134 34" stroke="#E9C5B4" stroke-width="2.4" fill="none"/>
      <path d="M40 58 q8 -5 16 0 t16 0 M188 64 q8 -5 16 0 t16 0 M50 92 q8 -5 16 0 t16 0 M182 96 q8 -5 16 0 t16 0" stroke="#F7D7CF" stroke-width="1.2" fill="none"/>`;
  }
  return svgWrap('0 0 260 150', base + inner + '</g>', 'İyileşme fazı');
}

/* ---- iyileşme tipleri ---- */
function healArt(k) {
  const id = uid('hl');
  const skin = (x0, w) => `<rect x="${x0}" y="30" width="${w}" height="10" fill="url(#${id}e)"/><rect x="${x0}" y="40" width="${w}" height="50" fill="url(#${id}d)"/><rect x="${x0}" y="90" width="${w}" height="30" fill="url(#${id}f)"/>`;
  const defs = `<defs>${skinDefs(id)}</defs><rect width="220" height="120" fill="#F8EEE6"/>`;
  if (k === 'primer') return svgWrap('0 0 220 120', defs + skin(0, 220) + `<path d="M110 30 L110 74" stroke="#9E3B33" stroke-width="2"/>
      ${[38, 50, 62].map((y) => `<path d="M100 ${y - 5} L120 ${y + 5} M120 ${y - 5} L100 ${y + 5}" stroke="#1E3A5F" stroke-width="2" stroke-linecap="round"/>`).join('')}
      <text x="110" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#5A3B2A">kenarlar dikişle yaklaştırılmış</text>`, 'Primer iyileşme');
  if (k === 'sekonder') { const b = `M62 30 C70 104 150 104 158 30 Z`; return svgWrap('0 0 220 120', defs + skin(0, 220) + `<path d="${b}" fill="#7E1D24"/>
      <clipPath id="${id}k"><path d="${b}"/></clipPath><g clip-path="url(#${id}k)"><rect x="60" y="56" width="100" height="50" fill="#D94A47"/>
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${70 + (i * 13) % 82}" cy="${60 + (i * 7) % 26}" r="${4 + i % 3}" fill="#EC6A64"/>`).join('')}</g>
      <path d="M110 70 V42 M102 50 L110 40 L118 50" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <text x="110" y="114" text-anchor="middle" font-size="10" font-weight="700" fill="#5A3B2A">granülasyonla alttan üste dolar</text>`, 'Sekonder iyileşme'); }
  return svgWrap('0 0 220 120', defs + skin(0, 96) + skin(124, 96) + `
      <path d="M22 30 C26 86 74 86 78 30 Z" fill="#B53B3B"/><path d="M30 36 l8 8 l8 -8 l8 8 l8 -8 l8 8 M34 50 l8 8 l8 -8 l8 8 l8 -8" stroke="#fff" stroke-width="2.4" fill="none"/>
      <path d="M98 60 H120 M112 52 L120 60 L112 68" stroke="#0A7A72" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <text x="109" y="46" text-anchor="middle" font-size="9" font-weight="800" fill="#0A7A72">3–5 gün</text>
      <path d="M172 30 L172 70" stroke="#9E3B33" stroke-width="2"/>${[40, 54].map((y) => `<path d="M162 ${y - 5} L182 ${y + 5} M182 ${y - 5} L162 ${y + 5}" stroke="#1E3A5F" stroke-width="2" stroke-linecap="round"/>`).join('')}
      <text x="110" y="112" text-anchor="middle" font-size="10" font-weight="700" fill="#5A3B2A">önce açık, sonra kapatılır</text>`, 'Tersiyer iyileşme');
}

/* ---- yanık fazı / ürün simgeleri ---- */
function badgeArt(kind) {
  const bg = '#F3F7F6';
  const g = {
    iv: `<path d="M50 14h20v34l-10 8-10-8z" fill="#CFE8F7" stroke="#2F7FC1" stroke-width="2"/><path d="M50 30h20" stroke="#2F7FC1"/><path d="M60 56v14 q0 10 12 10" stroke="#2F7FC1" stroke-width="2" fill="none"/><circle cx="60" cy="64" r="2.5" fill="#2F7FC1"/>`,
    shield: `<path d="M60 14l26 9v18c0 17-11 28-26 34-15-6-26-17-26-34V23z" fill="#D7EFE3" stroke="#1F7F55" stroke-width="2.2"/><path d="M48 44l8 8 16-16" stroke="#1F7F55" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    stretch: `<circle cx="60" cy="20" r="7" fill="#E9C3A3" stroke="#8A5A3B"/><path d="M60 28v24M60 34l-18-10M60 34l18-10M60 52l-12 22M60 52l12 22" stroke="#8A5A3B" stroke-width="3.2" stroke-linecap="round"/>`,
  }[kind] || '';
  return svgWrap('0 0 120 88', `<rect width="120" height="88" fill="${bg}"/>${g}`, '');
}
function dropsArt(n, extra) {
  const drop = (x, on) => `<path d="M${x} 22 C${x - 10} 38 ${x - 12} 46 ${x - 12} 52 a12 12 0 0 0 24 0 C${x + 12} 46 ${x + 10} 38 ${x} 22z" fill="${on ? '#5EA9D6' : 'none'}" stroke="#5EA9D6" stroke-width="2" ${on ? '' : 'stroke-dasharray="3 3"'}/>`;
  const bac = extra === 'bac' ? `<g fill="#6DBE45">${[[150, 30], [162, 44], [146, 52], [170, 26]].map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="4.5" rx="2.2" transform="rotate(${x % 70} ${x} ${y})"/>`).join('')}</g>` : '';
  const dry = n === 0 ? `<path d="M30 70 l10 -6 l8 5 l10 -7 l9 6 l10 -5 l9 7 l10 -6 l10 5" stroke="#B88E5A" stroke-width="2" fill="none"/>` : '';
  return svgWrap('0 0 200 84', `<rect width="200" height="84" fill="#F3F7F6"/>${drop(50, n >= 1)}${drop(90, n >= 2)}${drop(130, n >= 3)}${bac}${dry}
    <text x="100" y="80" text-anchor="middle" font-size="9.5" font-weight="700" fill="#3C5C66">${['eksüda yok / kuru', 'az eksüda', 'orta eksüda', 'çok eksüda'][n]}</text>`, 'Eksüda miktarı');
}

/* ---- insan silüeti (%TBSA) ---- */
const REGION = {
  'head-f': ['Baş-boyun (ön)', 4.5], 'trunk-f': ['Gövde ön yüz', 18], 'armR-f': ['Sağ kol (ön)', 4.5], 'armL-f': ['Sol kol (ön)', 4.5],
  'legR-f': ['Sağ bacak (ön)', 9], 'legL-f': ['Sol bacak (ön)', 9], 'peri': ['Perine', 1],
  'head-b': ['Baş-boyun (arka)', 4.5], 'trunk-b': ['Gövde arka yüz', 18], 'armR-b': ['Sağ kol (arka)', 4.5], 'armL-b': ['Sol kol (arka)', 4.5],
  'legR-b': ['Sağ bacak (arka)', 9], 'legL-b': ['Sol bacak (arka)', 9],
};
function bodyFigure(view) {
  const f = view === 'f';
  const P = {
    head: 'M45 22 a15 16 0 1 0 30 0 a15 16 0 1 0 -30 0 Z M53.5 36 h13 v10 h-13 Z',
    trunk: 'M40 46 Q60 41 80 46 Q86 48 87 57 L84 92 Q82 112 84 128 L36 128 Q38 112 36 92 L33 57 Q34 48 40 46 Z',
    arm: 'M31 49 Q24 51 23 60 L17 100 L11 131 Q9 140 12 146 Q16 151 19.5 145.5 L22.5 134 L29.5 102 L33.5 72 Z',
    leg: 'M36 130 L56 130 L56 140 L55 196 L54 232 Q54 240 49 241 L40 241 Q37 238 40 234 L41.5 196 L37 152 Z',
    peri: 'M57 130 H63 V139 Q60 145 57 139 Z',
  };
  // önden bakışta hastanın sağı izleyicinin solundadır
  const leftSide = f ? 'R' : 'L', rightSide = f ? 'L' : 'R';
  const rg = (id, d, tr) => `<path class="rg" data-r="${id}" tabindex="0" role="button" aria-pressed="false" aria-label="${REGION[id][0]}, yüzde ${fmt(REGION[id][1])}" d="${d}" ${tr ? `transform="${tr}"` : ''}><title>${REGION[id][0]} · %${fmt(REGION[id][1])}</title></path>`;
  const s = view;
  return `<div class="body-v"><svg viewBox="0 0 120 252" aria-label="${f ? 'Ön' : 'Arka'} görünüm">
    ${rg('head-' + s, P.head)}${rg('trunk-' + s, P.trunk)}
    ${rg(`arm${leftSide}-${s}`, P.arm)}${rg(`arm${rightSide}-${s}`, P.arm, 'matrix(-1 0 0 1 120 0)')}
    ${rg(`leg${leftSide}-${s}`, P.leg)}${rg(`leg${rightSide}-${s}`, P.leg, 'matrix(-1 0 0 1 120 0)')}
    ${f ? rg('peri', P.peri) : '<path d="M60 118 V128" stroke="var(--fig-line)" stroke-width="1" pointer-events="none"/>'}
    ${f ? '<path d="M54 22 h.01 M66 22 h.01" stroke="var(--fig-line)" stroke-width="2.4" stroke-linecap="round" pointer-events="none"/>' : ''}
    <text class="side-l" x="6" y="250">${f ? 'Sağ' : 'Sol'}</text><text class="side-l" x="114" y="250" text-anchor="end">${f ? 'Sol' : 'Sağ'}</text>
  </svg>${f ? 'Ön' : 'Arka'}</div>`;
}

/* ---- sırtüstü yatan hasta (risk haritası) ---- */
function supineScene() {
  return svgWrap('0 0 420 160', `
    <rect width="420" height="160" fill="#E8F1F4"/>
    <rect x="8" y="116" width="404" height="16" rx="6" fill="#BFD3DA"/><rect x="8" y="128" width="404" height="10" rx="4" fill="#9DB7C0"/>
    <rect x="14" y="98" width="62" height="20" rx="10" fill="#FFFFFF" stroke="#C9D7DB"/>
    <path d="M60 100 Q62 80 82 76 L150 72 Q190 68 214 80 Q236 86 250 92 L366 96 Q380 95 386 84 Q392 74 398 82 L396 106 Q392 116 380 116 L72 116 Q60 114 60 100 Z" fill="#EBC8A9" stroke="#B58A68" stroke-width="1.4"/>
    <circle cx="44" cy="92" r="21" fill="#EBC8A9" stroke="#B58A68" stroke-width="1.4"/>
    <path d="M40 72 Q56 64 64 80" stroke="#5B3B28" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M90 96 Q122 100 150 106 Q162 110 180 106" stroke="#D9B08E" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M120 74 Q180 70 230 84 L240 112 L110 112 Z" fill="#7FB2C9" opacity=".55"/>
    <text x="210" y="24" text-anchor="middle" font-size="12" font-weight="700" fill="#3C5C66">Sırtüstü (supin) pozisyon</text>`, 'Sırtüstü yatan hasta');
}

/* ---- steril set masası (hata avı) ---- */
function trayScene() {
  const gauze = (x, y, w = 46, h = 40, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - w / 2 + 4}" y="${y - h / 2 + 4}" width="${w}" height="${h}" rx="3" fill="#E9EEF0"/><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="3" fill="#FFFFFF" stroke="#D3DCDF"/><path d="M${x - w / 2} ${y - h / 6}h${w}M${x - w / 2} ${y + h / 6}h${w}M${x - w / 6} ${y - h / 2}v${h}M${x + w / 6} ${y - h / 2}v${h}" stroke="#E1E7EA"/></g>`;
  return svgWrap('0 0 640 420', `
    <defs>
      <pattern id="drape" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#3C8EA6"/><path d="M0 4h8M4 0v8" stroke="#469CB3" stroke-width="1"/></pattern>
      <linearGradient id="steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D5DDE0"/><stop offset="1" stop-color="#B8C4C8"/></linearGradient>
      <radialGradient id="bowlG" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#F4F7F8"/><stop offset="1" stop-color="#9AA9AE"/></radialGradient>
    </defs>
    <rect x="10" y="10" width="620" height="400" rx="20" fill="url(#steel)"/>
    <rect x="18" y="18" width="604" height="384" rx="16" fill="none" stroke="#fff" stroke-opacity=".5"/>
    <rect x="150" y="60" width="350" height="300" rx="6" fill="#20586A" opacity=".35" transform="translate(5 6)"/>
    <rect x="150" y="60" width="350" height="300" rx="6" fill="url(#drape)"/>
    <rect x="168" y="78" width="314" height="264" rx="3" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.6" stroke-dasharray="7 6"/>
    <path d="M150 352 v14 M168 352 v14 M150 360 h18" stroke="#fff" stroke-width="1.4" opacity=".9"/>
    <text x="159" y="384" text-anchor="middle" font-size="11" font-weight="700" fill="#24424C">2,5 cm</text>
    <text x="325" y="398" text-anchor="middle" font-size="12" font-weight="700" fill="#3C5C66">Steril alan (üstten görünüm)</text>
    <!-- doğru: steril eldiven paketi -->
    <g transform="translate(76 190)"><rect x="-46" y="-56" width="92" height="112" rx="4" fill="#F6F1E4" stroke="#D8CDB2"/><path d="M-46 0h92" stroke="#D8CDB2"/>
      <path d="M-30 -44 h22 v26 l-4 10 h-14 l-4 -10z" fill="#FFFFFF" stroke="#C9C9C9"/><path d="M8 8 h22 v26 l-4 10 h-14 l-4 -10z" fill="#FFFFFF" stroke="#C9C9C9"/>
      <text x="0" y="-2" text-anchor="middle" font-size="8.5" font-weight="700" fill="#6A5D3E" dy="-8">STERİL</text></g>
    <!-- doğru: atık torbası -->
    <g transform="translate(76 346)"><path d="M-34 -30 h68 l-6 60 h-56z" fill="#F2C230" stroke="#C89B12"/><path d="M-34 -30 q34 14 68 0" fill="#E2B020"/>
      <text x="0" y="8" text-anchor="middle" font-size="9" font-weight="800" fill="#6A4E00">TIBBİ</text><text x="0" y="19" text-anchor="middle" font-size="9" font-weight="800" fill="#6A4E00">ATIK</text></g>
    <!-- doğru: el antiseptiği -->
    <g transform="translate(572 322)"><rect x="-16" y="-24" width="32" height="50" rx="8" fill="#DDF2F0" stroke="#7BBFB8"/><rect x="-6" y="-36" width="12" height="12" fill="#0A7A72"/><path d="M6 -32 h10" stroke="#0A7A72" stroke-width="4"/><text x="0" y="8" text-anchor="middle" font-size="7" font-weight="800" fill="#0A7A72">EL</text></g>
    <!-- doğru: SF şişesi -->
    <g transform="translate(572 112)"><rect x="-18" y="-34" width="36" height="66" rx="8" fill="#E8F3FA" stroke="#8CB9D6"/><rect x="-8" y="-44" width="16" height="12" rx="2" fill="#8CB9D6"/><rect x="-14" y="-10" width="28" height="22" fill="#fff" stroke="#8CB9D6"/><text x="0" y="5" text-anchor="middle" font-size="9" font-weight="800" fill="#2F6E94">SF</text></g>
    <!-- doğru: gazlı bez yığını -->
    ${gauze(222, 222)}${gauze(226, 214)}
    <!-- doğru: pens -->
    <g transform="rotate(-18 300 214)"><circle cx="262" cy="206" r="8" fill="none" stroke="#9AA9AE" stroke-width="3"/><circle cx="262" cy="224" r="8" fill="none" stroke="#9AA9AE" stroke-width="3"/>
      <path d="M270 208 L338 214 M270 222 L338 216" stroke="#C3CDD0" stroke-width="4" stroke-linecap="round"/><path d="M270 208 L338 214 M270 222 L338 216" stroke="#8C9AA0" stroke-width="1.2"/></g>
    <!-- doğru: küvet -->
    <circle cx="404" cy="216" r="32" fill="url(#bowlG)" stroke="#8B9AA0"/><circle cx="404" cy="216" r="22" fill="#9B5A26" opacity=".85"/><ellipse cx="396" cy="208" rx="8" ry="4" fill="#fff" opacity=".35"/>
    <!-- hata: SKT geçmiş paket -->
    <g transform="translate(212 126)"><rect x="-34" y="-22" width="68" height="44" rx="4" fill="#F6F1E4" stroke="#D8CDB2"/><path d="M-34 -22 l8 8 h52 l8 -8" fill="none" stroke="#D8CDB2"/>
      <rect x="-24" y="2" width="48" height="14" rx="2" fill="#fff" stroke="#C23E37"/><text x="0" y="12.5" text-anchor="middle" font-size="8" font-weight="800" fill="#C23E37">SKT 03.2025</text></g>
    <!-- hata: kalem -->
    <g transform="rotate(24 306 112)"><rect x="272" y="107" width="64" height="9" rx="4" fill="#2E5FB8"/><path d="M336 107 l10 4.5 l-10 4.5z" fill="#E7D2B0"/><rect x="272" y="105" width="18" height="3" fill="#C7D3E8"/></g>
    <!-- hata: alan üzerinden uzanan kol -->
    <path d="M436 -4 C432 40 420 80 414 112" stroke="#6E9BC7" stroke-width="40" stroke-linecap="round" fill="none"/>
    <path d="M436 -4 C432 40 420 80 414 112" stroke="#7FAAD3" stroke-width="30" stroke-linecap="round" fill="none"/>
    <path d="M398 118 q-2 20 8 30 q12 10 24 -2 q8 -10 4 -30 z" fill="#F4E7D6" stroke="#CDB89A"/>
    <!-- hata: yırtık paket -->
    <g transform="translate(212 300)"><rect x="-36" y="-24" width="72" height="48" rx="4" fill="#F6F1E4" stroke="#D8CDB2"/>
      <path d="M8 -24 l-6 10 l8 6 l-7 9 l8 7 l-5 8" stroke="#8A6E3A" stroke-width="1.8" fill="none"/><path d="M10 -24 l-6 10 l8 6 l-7 9 l8 7 l-5 8 L36 24 V-24z" fill="#E7DEC8" opacity=".9"/>
      <text x="-14" y="4" text-anchor="middle" font-size="8" font-weight="800" fill="#6A5D3E">STERİL</text></g>
    <!-- hata: kirli pansuman -->
    <g transform="translate(320 300) rotate(-8)"><rect x="-30" y="-22" width="60" height="44" rx="4" fill="#FBF7EE" stroke="#D6CCB8"/>
      <ellipse cx="2" cy="2" rx="18" ry="12" fill="#D9B44A" opacity=".85"/><ellipse cx="-2" cy="0" rx="10" ry="7" fill="#B8432F" opacity=".8"/><rect x="-36" y="-6" width="12" height="10" fill="#EFE7D2" opacity=".9"/></g>
    <!-- hata: ıslak leke -->
    <path d="M396 286 q16 -14 34 -4 q18 2 16 18 q8 16 -10 22 q-14 10 -30 0 q-20 -4 -16 -18 q-8 -12 6 -18z" fill="#174A5A" opacity=".55"/>
    <circle cx="452" cy="276" r="4" fill="#174A5A" opacity=".5"/><circle cx="384" cy="326" r="3" fill="#174A5A" opacity=".5"/><ellipse cx="416" cy="296" rx="6" ry="3" fill="#fff" opacity=".3"/>
    <!-- hata: kenara taşan gazlı bez -->
    ${gauze(494, 160, 44, 38, 8)}`, 'Steril pansuman seti, üstten görünüm');
}

/* ---- tampon oyunu sahnesi ---- */
function swabScene(id) {
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const dirt = Array.from({ length: 80 }, () => { const x = 150 + (rnd() * 2 - 1) * 100, y = 66 + rnd() * 250, r = 1.4 + rnd() * 2.6; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${rnd() < .5 ? '#9C5B3C' : '#8B2F25'}" opacity="${(.45 + rnd() * .4).toFixed(2)}"/>`; }).join('');
  const sut = Array.from({ length: 10 }, (_, i) => { const y = 76 + i * 25; return `<path d="M140 ${y - 4} L160 ${y + 4}" stroke="#1E3A5F" stroke-width="2.2" stroke-linecap="round"/>`; }).join('');
  return `<svg viewBox="0 0 300 380" class="swab-svg" role="application" aria-label="Kesi temizleme alanı: parmağınla ya da fareyle silme hareketi yap" xmlns="${NS}">
    <defs><linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D2B8"/><stop offset="1" stop-color="#E4B591"/></linearGradient>
    <pattern id="${id}d" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#3C8EA6"/><path d="M0 4h8M4 0v8" stroke="#469CB3"/></pattern></defs>
    <rect x="0" y="0" width="300" height="380" rx="18" fill="url(#${id}s)"/>
    <g class="dirt">${dirt}</g>
    <g class="clean"></g>
    <path d="M150 62 C146 120 154 200 150 318" stroke="#8E2A2A" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M150 62 C146 120 154 200 150 318" stroke="#C9544D" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".8"/>
    ${sut}
    <path fill-rule="evenodd" d="M0 0H300V380H0Z M36 26 H264 Q270 26 270 32 V348 Q270 354 264 354 H36 Q30 354 30 348 V32 Q30 26 36 26Z" fill="url(#${id}d)"/>
    <g class="strokes"></g>
    <text x="150" y="16" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">BAŞ TARAFI</text>
    <text x="150" y="372" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">AYAK TARAFI</text>
  </svg>`;
}
