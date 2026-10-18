/* ================= çizimler ================= */
const NS = 'http://www.w3.org/2000/svg';
const sv = (vb, inner, cls, label) => `<svg viewBox="${vb}" xmlns="${NS}" ${cls ? `class="${cls}"` : ''} role="img" aria-label="${label || ''}">${inner}</svg>`;
const shadow = (cx = 50, cy = 88, rx = 32) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="6" fill="#3B2A14" opacity=".14"/>`;

const LOGO = sv('0 0 48 48', `<rect x="2" y="2" width="44" height="44" rx="14" fill="#FF7563"/>
  <g transform="rotate(-40 24 24)"><rect x="8" y="17" width="32" height="14" rx="7" fill="#FFE1C2"/><rect x="18" y="17" width="12" height="14" fill="#fff"/>
  <circle cx="21" cy="21" r="1" fill="#E7B98E"/><circle cx="27" cy="21" r="1" fill="#E7B98E"/><circle cx="21" cy="27" r="1" fill="#E7B98E"/><circle cx="27" cy="27" r="1" fill="#E7B98E"/></g>`, '', 'Yara Bakım Masası');

/* ---- yüzler ---- */
function faceSVG(expr) {
  const mouth = { worry: '<path d="M38 70 Q50 62 62 70" stroke="#8A3B2E" stroke-width="3.4" fill="none" stroke-linecap="round"/>',
    ok: '<path d="M39 66 Q50 72 61 66" stroke="#8A3B2E" stroke-width="3.4" fill="none" stroke-linecap="round"/>',
    happy: '<path d="M36 63 Q50 80 64 63 Z" fill="#B8433D"/><path d="M42 69 Q50 74 58 69" stroke="#FF9C9C" stroke-width="3" fill="none"/>' }[expr];
  const brows = expr === 'worry' ? '<path d="M31 40 L42 36 M69 40 L58 36" stroke="#5B3A25" stroke-width="3" stroke-linecap="round"/>' : '<path d="M31 37 Q36 34 42 36 M58 36 Q64 34 69 37" stroke="#5B3A25" stroke-width="3" fill="none" stroke-linecap="round"/>';
  const cheeks = expr === 'happy' ? '<circle cx="30" cy="60" r="6" fill="#FF9C9C" opacity=".6"/><circle cx="70" cy="60" r="6" fill="#FF9C9C" opacity=".6"/>' : '';
  const sweat = expr === 'worry' ? '<path d="M78 34 q-5 8 0 11 q5 -3 0 -11z" fill="#8FD0F2"/>' : '';
  return sv('0 0 100 100', `<circle cx="50" cy="54" r="36" fill="#F4CDB0"/>
    <path d="M14 50 Q12 16 50 14 Q88 16 86 50 Q80 30 62 28 Q50 36 30 30 Q18 36 14 50Z" fill="#5B3A25"/>
    <circle cx="14" cy="56" r="7" fill="#EBB894"/><circle cx="86" cy="56" r="7" fill="#EBB894"/>
    ${brows}<ellipse cx="37" cy="48" rx="4" ry="5" fill="#22314A"/><ellipse cx="63" cy="48" rx="4" ry="5" fill="#22314A"/>
    <circle cx="38.5" cy="46.5" r="1.4" fill="#fff"/><circle cx="64.5" cy="46.5" r="1.4" fill="#fff"/>${cheeks}${mouth}${sweat}`, '', 'Hastanın yüzü');
}
const NURSE = sv('0 0 100 100', `<path d="M18 100 Q20 76 50 74 Q80 76 82 100Z" fill="#22A88F"/><path d="M40 74 L50 88 L60 74" fill="#fff"/>
  <circle cx="50" cy="48" r="28" fill="#E9B48E"/>
  <path d="M22 48 Q20 18 50 18 Q80 18 78 48 Q76 34 64 30 L36 30 Q24 34 22 48Z" fill="#2E2A3A"/>
  <path d="M28 26 Q50 8 72 26 L68 32 Q50 24 32 32Z" fill="#fff" stroke="#D3E5DD" stroke-width="1.5"/>
  <path d="M47 20h6v-4h-6zM45 18h10" stroke="#FF7563" stroke-width="3"/>
  <ellipse cx="40" cy="48" rx="3.4" ry="4.2" fill="#22314A"/><ellipse cx="60" cy="48" rx="3.4" ry="4.2" fill="#22314A"/>
  <path d="M40 60 Q50 68 60 60" stroke="#8A3B2E" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="32" cy="57" r="4.5" fill="#FF9C9C" opacity=".5"/><circle cx="68" cy="57" r="4.5" fill="#FF9C9C" opacity=".5"/>`, '', 'Hemşire Deniz');

/* ---- malzeme simgeleri ---- */
const GLOVE_PATH = 'M7.2 21.5v-5.2L4.3 12.4a1.5 1.5 0 0 1 2.3-1.9l1.8 2V4.6a1.3 1.3 0 0 1 2.6 0V10V3.3a1.3 1.3 0 0 1 2.6 0V10V4.2a1.3 1.3 0 0 1 2.6 0v6.3V6.4a1.3 1.3 0 0 1 2.6 0v8.8c0 3.6-2.3 6.3-5.6 6.3z';
const ITEMS = {
  soap: { label: 'Sabun ve su', svg: `${shadow()}<path d="M22 70 Q50 82 78 70 L80 78 Q50 92 20 78Z" fill="#9ED8F2"/><rect x="22" y="44" width="56" height="30" rx="13" fill="#FF8FAB"/><rect x="22" y="44" width="56" height="17" rx="10" fill="#FFB8CB"/>
    <ellipse cx="38" cy="50" rx="8" ry="2.4" fill="#fff" opacity=".7"/>
    <circle cx="36" cy="32" r="10" fill="#fff" stroke="#8ACFF0" stroke-width="2"/><circle cx="58" cy="24" r="7" fill="#fff" stroke="#8ACFF0" stroke-width="2"/><circle cx="70" cy="38" r="5" fill="#fff" stroke="#8ACFF0" stroke-width="2"/><circle cx="33" cy="29" r="2.4" fill="#DDF0FB"/>` },
  gloves: { label: 'Eldiven', svg: `${shadow()}<g transform="translate(26 10) scale(3.2) rotate(8 12 12)"><path d="${GLOVE_PATH}" fill="#A9DDF5" stroke="#3FA2DB" stroke-width=".6"/></g>
    <g transform="translate(8 14) scale(3.2) rotate(-8 12 12)"><path d="${GLOVE_PATH}" fill="#6EC3EE" stroke="#2A7FB2" stroke-width=".6"/></g>` },
  bag: { label: 'Atık poşeti', svg: `${shadow()}<path d="M24 36 H76 L70 86 H30Z" fill="#FFD966" stroke="#D9A92A" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M24 36 Q34 22 42 34 Q50 20 58 34 Q66 22 76 36" fill="#FFE59A" stroke="#D9A92A" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M38 52 h24 M36 62 h28 M40 72 h20" stroke="#D9A92A" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>` },
  magnifier: { label: 'Yaraya bak', svg: `${shadow()}<path d="M60 60 L84 84" stroke="#9B6A3F" stroke-width="12" stroke-linecap="round"/><circle cx="42" cy="42" r="26" fill="#DDF0FB" stroke="#4A5A70" stroke-width="7"/>
    <path d="M28 34 Q32 24 42 22" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>` },
  saline: { label: 'Serum fizyolojik', svg: `${shadow()}<rect x="30" y="26" width="40" height="60" rx="12" fill="#E3F3FC" stroke="#7DB7DA" stroke-width="2.4"/><rect x="40" y="12" width="20" height="16" rx="4" fill="#3FA2DB"/>
    <rect x="34" y="46" width="32" height="24" rx="5" fill="#fff"/><text x="50" y="63" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="#2A7FB2">SF</text>
    <path d="M36 32 v40" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>` },
  gauze: { label: 'Gazlı bez', svg: `${shadow()}<rect x="24" y="30" width="54" height="50" rx="6" fill="#EAF1F4"/><rect x="20" y="24" width="54" height="50" rx="6" fill="#fff" stroke="#C8D7DD" stroke-width="2"/>
    <path d="M20 41h54M20 57h54M38 24v50M56 24v50" stroke="#DCE6EA" stroke-width="2"/>` },
  dressing: { label: 'Yeni pansuman', svg: `${shadow()}<rect x="16" y="26" width="68" height="52" rx="16" fill="#F6D9BC" stroke="#E2BE98" stroke-width="2"/><rect x="32" y="38" width="36" height="28" rx="6" fill="#fff"/>
    ${[22, 28, 72, 78].map((x) => `<circle cx="${x}" cy="40" r="1.4" fill="#E2BE98"/><circle cx="${x}" cy="64" r="1.4" fill="#E2BE98"/>`).join('')}<path d="M36 42 h14" stroke="#EAF1F4" stroke-width="3" stroke-linecap="round"/>` },
  cologne: { label: 'Kolonya', svg: `${shadow()}<rect x="40" y="10" width="20" height="14" rx="3" fill="#E1B23C"/><path d="M36 24 H64 L72 40 V82 Q72 88 66 88 H34 Q28 88 28 82 V40Z" fill="#FFF4B8" stroke="#E1C56A" stroke-width="2"/>
    <circle cx="50" cy="60" r="13" fill="#FFE066" stroke="#F2B705" stroke-width="2"/><path d="M50 47 V73 M37 60 H63 M41 51 L59 69 M59 51 L41 69" stroke="#F2B705" stroke-width="1.4"/>` },
  cotton: { label: 'Pamuk', svg: `${shadow()}<circle cx="36" cy="60" r="16" fill="#fff" stroke="#D5DEE3" stroke-width="2"/><circle cx="62" cy="58" r="18" fill="#fff" stroke="#D5DEE3" stroke-width="2"/><circle cx="50" cy="42" r="16" fill="#fff" stroke="#D5DEE3" stroke-width="2"/>
    <path d="M44 38 q4 -4 9 -2 M30 56 q4 -4 9 -2" stroke="#E6ECEF" stroke-width="2" fill="none"/>` },
  powder: { label: 'Pudra', svg: `${shadow()}<rect x="30" y="30" width="40" height="56" rx="12" fill="#FFC2D4" stroke="#F08AAB" stroke-width="2"/><rect x="34" y="18" width="32" height="14" rx="5" fill="#fff" stroke="#F08AAB" stroke-width="2"/>
    ${[40, 50, 60].map((x) => `<circle cx="${x}" cy="25" r="1.8" fill="#F08AAB"/>`).join('')}<circle cx="24" cy="14" r="2.5" fill="#fff" stroke="#EBD"/><circle cx="76" cy="12" r="3" fill="#fff" stroke="#EBD"/>
    <path d="M40 50 h20" stroke="#fff" stroke-width="4" stroke-linecap="round"/>` },
  watch: { label: 'Saat ve takılar', svg: `${shadow()}<rect x="40" y="10" width="20" height="80" rx="8" fill="#9B6A3F"/><circle cx="50" cy="50" r="20" fill="#fff" stroke="#E1B23C" stroke-width="5"/>
    <path d="M50 50 V38 M50 50 L58 54" stroke="#22314A" stroke-width="3" stroke-linecap="round"/><circle cx="78" cy="74" r="9" fill="none" stroke="#E1B23C" stroke-width="4"/><circle cx="78" cy="65" r="3" fill="#7FD3F7"/>` },
  tap: { label: 'Serin akan su', svg: `${shadow()}<rect x="14" y="16" width="44" height="16" rx="8" fill="#AEBBC4"/><path d="M50 24 H64 Q78 24 78 38 V44 H66 V40 Q66 36 62 36 H50Z" fill="#C9D3DA" stroke="#94A3AD" stroke-width="2"/>
    <rect x="26" y="8" width="18" height="8" rx="3" fill="#3FA2DB"/><path d="M72 50 Q66 62 72 70 Q78 62 72 50Z" fill="#7FC9EE"/><path d="M72 74 Q68 80 72 86 Q76 80 72 74Z" fill="#7FC9EE"/>` },
  film: { label: 'Streç film', svg: `${shadow()}<rect x="16" y="36" width="68" height="26" rx="13" fill="#D2E9F6" stroke="#8CBAD6" stroke-width="2"/><ellipse cx="18" cy="49" rx="6" ry="13" fill="#B2D6EA"/>
    <path d="M40 62 L34 88 L80 84 L84 56" fill="#E8F5FC" opacity=".8" stroke="#A9CFE4" stroke-width="2"/><path d="M44 70 l20 -2 M42 78 l26 -2" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
  hospital: { label: 'Sağlık kuruluşu', svg: `${shadow()}<rect x="20" y="30" width="60" height="56" rx="6" fill="#fff" stroke="#C8D7DD" stroke-width="2.4"/><rect x="38" y="62" width="24" height="24" rx="3" fill="#BFE3F6"/>
    <rect x="30" y="38" width="12" height="10" rx="2" fill="#BFE3F6"/><rect x="58" y="38" width="12" height="10" rx="2" fill="#BFE3F6"/><circle cx="50" cy="22" r="14" fill="#FF7563"/><path d="M50 14 V30 M42 22 H58" stroke="#fff" stroke-width="5" stroke-linecap="round"/>` },
  ice: { label: 'Buz', svg: `${shadow()}<rect x="18" y="44" width="32" height="32" rx="7" fill="#CFEFFF" stroke="#7FC9EE" stroke-width="2" transform="rotate(-8 34 60)"/><rect x="48" y="34" width="34" height="34" rx="7" fill="#E2F6FF" stroke="#7FC9EE" stroke-width="2" transform="rotate(10 65 51)"/>
    <path d="M26 52 l8 -2 M56 42 l10 2" stroke="#fff" stroke-width="3" stroke-linecap="round"/>` },
  toothpaste: { label: 'Diş macunu', svg: `${shadow()}<path d="M14 40 L70 32 L74 56 L18 64Z" fill="#fff" stroke="#9FB4C2" stroke-width="2"/><path d="M18 50 L72 44" stroke="#3FA2DB" stroke-width="6"/><rect x="72" y="36" width="14" height="20" rx="3" fill="#FF7563" transform="rotate(-8 79 46)"/>` },
  yogurt: { label: 'Yoğurt', svg: `${shadow()}<path d="M24 36 H76 L70 86 H30Z" fill="#fff" stroke="#BFD0DA" stroke-width="2.4"/><ellipse cx="50" cy="36" rx="26" ry="7" fill="#F6F9FB" stroke="#BFD0DA" stroke-width="2.4"/><rect x="28" y="52" width="44" height="16" fill="#3FA2DB"/>` },
  butter: { label: 'Tereyağı', svg: `${shadow()}<ellipse cx="50" cy="72" rx="38" ry="12" fill="#fff" stroke="#C8D7DD" stroke-width="2"/><path d="M26 66 V44 L44 34 H76 V56 L58 66Z" fill="#FFE07A" stroke="#E8B830" stroke-width="2"/><path d="M26 44 L58 44 L76 34 M58 44 V66" stroke="#E8B830" stroke-width="2" fill="none"/>` },
  needle: { label: 'İğne', svg: `${shadow()}<path d="M20 82 L76 22" stroke="#A3AFB8" stroke-width="5" stroke-linecap="round"/><ellipse cx="72" cy="26" rx="3" ry="7" fill="none" stroke="#7A8790" stroke-width="2.4" transform="rotate(42 72 26)"/>
    <path d="M74 24 Q90 40 72 54 Q60 64 72 78" stroke="#FF7563" stroke-width="3" fill="none"/>` },
  clock: { label: 'Saat başı çevir', svg: `${shadow()}<circle cx="50" cy="52" r="32" fill="#fff" stroke="#FF7563" stroke-width="6"/><circle cx="28" cy="20" r="9" fill="#FF7563"/><circle cx="72" cy="20" r="9" fill="#FF7563"/>
    <path d="M50 52 V32 M50 52 L64 60" stroke="#22314A" stroke-width="4" stroke-linecap="round"/><path d="M70 74 a26 26 0 0 0 6 -16" stroke="#22A88F" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 56 l-4 6 -6 -4" fill="#22A88F"/>` },
  pillow: { label: 'Yastık', svg: `${shadow()}<path d="M14 38 Q50 22 86 38 Q92 56 86 74 Q50 90 14 74 Q8 56 14 38Z" fill="#BFE3F6" stroke="#7DB7DA" stroke-width="2.4"/><path d="M22 44 Q50 34 78 44 Q82 56 78 68 Q50 78 22 68 Q18 56 22 44Z" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/>` },
  roll: { label: 'Küçük yastık', svg: `${shadow()}<rect x="14" y="40" width="72" height="30" rx="15" fill="#FFD27A" stroke="#E0A93C" stroke-width="2.4"/><ellipse cx="22" cy="55" rx="6" ry="13" fill="#FFE2A6" stroke="#E0A93C" stroke-width="2"/><path d="M36 44 v22 M52 44 v22 M68 44 v22" stroke="#E0A93C" stroke-width="2" opacity=".5"/>` },
  cream: { label: 'Nemlendirici', svg: `${shadow()}<rect x="22" y="42" width="56" height="42" rx="10" fill="#fff" stroke="#BFD0DA" stroke-width="2.4"/><rect x="20" y="30" width="60" height="16" rx="6" fill="#22A88F"/><rect x="30" y="56" width="40" height="16" rx="4" fill="#D4F2EA"/>
    <path d="M40 64 h20" stroke="#22A88F" stroke-width="3" stroke-linecap="round"/>` },
  food: { label: 'Su ve protein', svg: `${shadow()}<ellipse cx="38" cy="72" rx="28" ry="10" fill="#fff" stroke="#C8D7DD" stroke-width="2"/><ellipse cx="38" cy="68" rx="14" ry="8" fill="#fff" stroke="#E6ECEF"/><circle cx="38" cy="68" r="6" fill="#FFC64A"/>
    <path d="M64 30 H86 L82 84 H68Z" fill="#DDF0FB" stroke="#7DB7DA" stroke-width="2.4"/><path d="M66 46 H84 L82 84 H68Z" fill="#8FD0F2" opacity=".8"/>` },
  donut: { label: 'Simit yastık', svg: `${shadow()}<ellipse cx="50" cy="56" rx="38" ry="24" fill="#FFB38A" stroke="#E2885A" stroke-width="2.4"/><ellipse cx="50" cy="54" rx="14" ry="8" fill="#EAF6F1" stroke="#E2885A" stroke-width="2"/>` },
};
const itemSVG = (id) => sv('0 0 100 100', ITEMS[id].svg, '', ITEMS[id].label);

/* ---- eller ---- */
const HAND = (fill, extra = '') => `<g fill="${fill}"><rect x="22" y="44" width="56" height="52" rx="22"/><rect x="24" y="12" width="12" height="46" rx="6"/><rect x="38" y="2" width="12" height="52" rx="6"/>
  <rect x="52" y="5" width="12" height="50" rx="6"/><rect x="66" y="16" width="11" height="42" rx="5.5"/><rect x="2" y="44" width="13" height="36" rx="6.5" transform="rotate(-34 9 62)"/><rect x="30" y="84" width="40" height="40" rx="8"/></g>${extra}`;
const handsLayer = () => {
  const germs = `<g class="L on" data-l="germs">${[[36, 50], [56, 30], [62, 66], [44, 22]].map(([x, y], i) => `<g class="twinkle" style="animation-delay:${i * .3}s"><circle cx="${x}" cy="${y}" r="6" fill="#8BCF5A"/><circle cx="${x - 2}" cy="${y - 1}" r="1.2" fill="#22314A"/><circle cx="${x + 2}" cy="${y - 1}" r="1.2" fill="#22314A"/></g>`).join('')}</g>`;
  const bubbles = `<g class="L bubbles" data-l="bubbles">${[[30, 40], [50, 20], [66, 46], [40, 70], [58, 64], [26, 60]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${7 + (i % 3) * 2}" fill="#fff" stroke="#9FD8F5" stroke-width="2" style="animation-delay:${i * .2}s"/>`).join('')}</g>`;
  const glove = `<g class="L" data-l="gloves">${HAND('#6EC3EE')}<rect x="28" y="96" width="44" height="10" rx="4" fill="#A9DDF5"/></g>`;
  const one = `${HAND('#F1C29E')}<rect x="26" y="108" width="48" height="30" rx="6" fill="#22A88F"/>${glove}${germs}${bubbles}`;
  return `<g transform="translate(26 238) rotate(14)">${one}</g><g transform="translate(600 0) scale(-1 1)"><g transform="translate(26 238) rotate(14)">${one.replace(/data-l="(\w+)"/g, 'data-l="$1"')}</g></g>`;
};

/* ---- sahne: karın / ameliyat yarası ---- */
function bellyScene(opt = {}) {
  const inc = 'M300 112 C296 160 304 220 300 282';
  const stitches = Array.from({ length: 8 }, (_, i) => { const y = 124 + i * 21; return `<path d="M288 ${y - 4} L312 ${y + 4}" stroke="#2E4A6B" stroke-width="3" stroke-linecap="round"/>`; }).join('');
  const dirt = [[290, 140], [312, 170], [288, 200], [310, 232], [294, 258], [306, 128], [284, 176], [316, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${3 + (x % 3)}" fill="#9A4A33" opacity=".75"/>`).join('');
  const sparkle = (x, y, d) => `<path class="twinkle" style="animation-delay:${d}s" d="M${x} ${y - 12} L${x + 3} ${y - 3} L${x + 12} ${y} L${x + 3} ${y + 3} L${x} ${y + 12} L${x - 3} ${y + 3} L${x - 12} ${y} L${x - 3} ${y - 3}Z" fill="#FFC64A"/>`;
  return sv('0 0 600 380', `<defs>
      <radialGradient id="bSkin" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#F8D8BE"/><stop offset="1" stop-color="#E7B18C"/></radialGradient>
      <linearGradient id="bBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDF0FB"/><stop offset="1" stop-color="#F1F9FD"/></linearGradient></defs>
    <rect width="600" height="380" fill="url(#bBg)"/>
    <circle cx="80" cy="330" r="60" fill="#fff" opacity=".5"/><circle cx="540" cy="60" r="40" fill="#fff" opacity=".6"/>
    <ellipse cx="300" cy="270" rx="250" ry="230" fill="url(#bSkin)"/>
    <path d="M40 -10 H560 V58 Q300 108 40 58Z" fill="#8FD3C7"/><path d="M40 52 Q300 102 560 52" stroke="#6BBFB1" stroke-width="10" fill="none"/>
    <path d="M60 30 H540" stroke="#A9DDD3" stroke-width="6" stroke-dasharray="2 18" stroke-linecap="round"/>
    <ellipse cx="300" cy="322" rx="11" ry="7" fill="#C98A68"/><path d="M291 320 Q300 328 309 320" stroke="#A86B4E" stroke-width="2" fill="none"/>
    <ellipse cx="300" cy="198" rx="22" ry="96" fill="#F2A08E" opacity=".35"/>
    <path d="${inc}" stroke="#B8433D" stroke-width="6" fill="none" stroke-linecap="round"/><path d="${inc}" stroke="#E5786C" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${stitches}
    <g class="L on" data-l="dirt">${dirt}</g>
    <g class="L" data-l="clean">${sparkle(340, 150, 0)}${sparkle(262, 240, .5)}${sparkle(336, 270, .9)}</g>
    <g class="L ${opt.done ? '' : 'on'}" data-l="old">
      <rect x="252" y="98" width="96" height="200" rx="14" fill="#FFFFFF" stroke="#E2E6E8" stroke-width="2"/>
      <ellipse cx="302" cy="196" rx="24" ry="40" fill="#E9C46A" opacity=".45"/><ellipse cx="298" cy="190" rx="10" ry="18" fill="#C9634F" opacity=".35"/>
      <rect x="226" y="108" width="148" height="24" rx="4" fill="#F1E2C8" transform="rotate(-4 300 120)"/><rect x="226" y="264" width="148" height="24" rx="4" fill="#F1E2C8" transform="rotate(3 300 276)"/></g>
    <g class="L" data-l="water"><g transform="translate(408 40) rotate(28)"><rect x="-20" y="-40" width="40" height="64" rx="12" fill="#E3F3FC" stroke="#7DB7DA" stroke-width="3"/><rect x="-8" y="24" width="16" height="12" rx="3" fill="#3FA2DB"/></g>
      ${[0, 1, 2, 3, 4].map((i) => `<path class="fall" style="animation-delay:${i * .2}s" d="M${300 + (i % 2 ? 6 : -6)} ${110 + i * 30} q-6 10 0 14 q6 -4 0 -14z" fill="#7FC9EE"/>`).join('')}</g>
    <g class="L" data-l="wipe"><g class="wipe-go"><rect x="276" y="100" width="48" height="44" rx="6" fill="#fff" stroke="#BFD0DA" stroke-width="2"/><path d="M276 115h48M276 129h48M292 100v44M308 100v44" stroke="#E2EAEE"/></g></g>
    <g class="L" data-l="pat"><g class="pat-go" style="transform-origin:300px 196px"><rect x="268" y="166" width="64" height="60" rx="8" fill="#fff" stroke="#BFD0DA" stroke-width="2"/><path d="M268 186h64M268 206h64M289 166v60M311 166v60" stroke="#E2EAEE"/></g></g>
    <g class="L ${opt.done ? 'on' : ''}" data-l="new">
      <rect x="246" y="92" width="108" height="214" rx="22" fill="#F4D7BA" stroke="#E2BE98" stroke-width="2"/><rect x="264" y="110" width="72" height="178" rx="10" fill="#fff"/>
      <path d="M272 120 v60" stroke="#EAF1F4" stroke-width="6" stroke-linecap="round"/>
      ${[100, 300].map((y) => [258, 280, 300, 320, 342].map((x) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#E2BE98"/>`).join('')).join('')}</g>
    <g class="L" data-l="lens"><g class="float"><circle cx="300" cy="196" r="86" fill="#fff" fill-opacity=".14" stroke="#4A5A70" stroke-width="12"/><path d="M362 258 L420 318" stroke="#9B6A3F" stroke-width="20" stroke-linecap="round"/>
      <path d="M248 160 Q258 132 290 124" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/></g></g>
    ${opt.noHands ? '' : handsLayer()}`, 'scene', 'Karın bölgesinde ameliyat yarası');
}

/* ---- sahne: kol / yanık ---- */
function armScene() {
  return sv('0 0 600 380', `<defs><linearGradient id="aSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7D5BA"/><stop offset="1" stop-color="#E2A983"/></linearGradient>
      <radialGradient id="aBurn" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#EF4B3E"/><stop offset=".7" stop-color="#F57A68" stop-opacity=".9"/><stop offset="1" stop-color="#F7A08F" stop-opacity="0"/></radialGradient>
      <radialGradient id="aCool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F7A598"/><stop offset="1" stop-color="#F7B9A8" stop-opacity="0"/></radialGradient>
      <linearGradient id="aBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4DE"/><stop offset="1" stop-color="#FFE9C2"/></linearGradient></defs>
    <rect width="600" height="380" fill="url(#aBg)"/>
    <rect x="0" y="300" width="600" height="80" fill="#F2D3A0"/><path d="M0 300 H600" stroke="#E2BB7E" stroke-width="4"/>
    <path d="M-20 180 Q200 166 420 178 L440 180 L440 262 L420 266 Q200 278 -20 270Z" fill="url(#aSkin)"/>
    <path d="M430 178 Q470 168 520 176 Q560 180 572 196 Q580 212 566 222 L568 236 Q574 250 560 258 Q520 270 470 264 L432 262Z" fill="url(#aSkin)"/>
    <path d="M512 196 q30 -2 50 6 M516 220 q30 0 50 4 M512 242 q28 2 46 4" stroke="#C88E6A" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M-20 172 H110 V278 H-20Z" fill="#7FC6EE"/><path d="M110 172 V278" stroke="#5DA9D6" stroke-width="8"/>
    <ellipse cx="270" cy="220" rx="88" ry="40" fill="url(#aBurn)"/>
    <ellipse cx="248" cy="208" rx="22" ry="6" fill="#fff" opacity=".45"/>
    <g class="L" data-l="cool"><ellipse cx="270" cy="220" rx="96" ry="44" fill="#F8E0D2"/><ellipse cx="270" cy="220" rx="78" ry="34" fill="url(#aCool)"/></g>
    <g class="L on" data-l="watch"><rect x="404" y="170" width="30" height="104" rx="10" fill="#9B6A3F"/><circle cx="419" cy="222" r="24" fill="#fff" stroke="#E1B23C" stroke-width="6"/>
      <path d="M419 222 V208 M419 222 L428 228" stroke="#22314A" stroke-width="3.4" stroke-linecap="round"/></g>
    <g class="L" data-l="faucet"><rect x="180" y="-10" width="40" height="44" fill="#AEBBC4"/><path d="M200 26 H262 Q290 26 290 54 V66 H262 V58 Q262 52 256 52 H200Z" fill="#C9D3DA" stroke="#94A3AD" stroke-width="3"/>
      <rect x="160" y="6" width="80" height="14" rx="7" fill="#3FA2DB"/></g>
    <g class="L" data-l="stream"><rect x="262" y="66" width="28" height="140" rx="12" fill="#9FD8F5" opacity=".75"/>
      <path class="stream" d="M270 66 V206 M282 66 V206" stroke="#fff" stroke-width="3" stroke-dasharray="10 14" opacity=".9"/>
      ${[[236, 200], [312, 196], [226, 236], [320, 238]].map(([x, y], i) => `<path class="fall" style="animation-delay:${i * .25}s" d="M${x} ${y} q-5 8 0 11 q5 -3 0 -11z" fill="#7FC9EE"/>`).join('')}</g>
    <g class="L" data-l="timer"><circle cx="500" cy="80" r="40" fill="#fff" stroke="#E8EEF1" stroke-width="8"/>
      <circle class="timer-arc" cx="500" cy="80" r="28" fill="none" stroke="#3FA2DB" stroke-width="8" stroke-dasharray="176" transform="rotate(-90 500 80)"/>
      <text x="500" y="86" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="18" fill="#22314A">20 dk</text></g>
    <g class="L" data-l="film"><rect x="160" y="170" width="226" height="104" rx="18" fill="#E2F3FC" fill-opacity=".55" stroke="#9CCBE6" stroke-width="3"/>
      <path d="M182 190 L230 254 M228 184 L282 258 M290 186 L340 254" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".75"/></g>
    <g class="L" data-l="sign"><g class="float"><rect x="40" y="40" width="150" height="86" rx="18" fill="#fff" stroke="#FFB3A6" stroke-width="4"/>
      <circle cx="80" cy="83" r="22" fill="#FF7563"/><path d="M80 71 V95 M68 83 H92" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <text x="140" y="78" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="17" fill="#22314A">Gerekirse</text>
      <text x="140" y="98" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="17" fill="#22314A">başvur</text></g></g>`, 'scene', 'Ön kolda küçük yanık');
}

/* ---- sahne: yatak / bası yarasından korunma ---- */
function bedScene() {
  const body = (lat) => lat
    ? `<path d="M150 214 Q170 170 230 168 Q300 160 340 186 Q380 170 440 190 Q490 196 520 214 L520 240 L150 240Z" fill="#FFB38A"/>
       <path d="M150 214 Q170 170 230 168 Q300 160 340 186 Q380 170 440 190 Q490 196 520 214" stroke="#E2885A" stroke-width="3" fill="none"/>
       <circle cx="118" cy="196" r="30" fill="#F4CDB0"/><path d="M92 186 Q100 160 128 166 Q146 172 146 188 Q132 176 112 180Z" fill="#5B3A25"/>
       <ellipse cx="108" cy="200" rx="3.4" ry="4" fill="#22314A"/><path d="M98 212 Q104 216 110 212" stroke="#8A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : `<path d="M150 222 Q170 196 240 194 Q330 188 400 200 Q470 206 520 218 L520 240 L150 240Z" fill="#FFB38A"/>
       <path d="M150 222 Q170 196 240 194 Q330 188 400 200 Q470 206 520 218" stroke="#E2885A" stroke-width="3" fill="none"/>
       <circle cx="116" cy="204" r="30" fill="#F4CDB0"/><path d="M88 200 Q90 172 118 172 Q146 174 146 200 Q132 186 116 188 Q100 186 88 200Z" fill="#5B3A25"/>
       <ellipse cx="108" cy="204" rx="3.4" ry="4" fill="#22314A"/><ellipse cx="126" cy="204" rx="3.4" ry="4" fill="#22314A"/><path d="M108 216 Q117 222 126 216" stroke="#8A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const pt = (x, y, t, d) => `<g class="twinkle" style="animation-delay:${d}s"><circle cx="${x}" cy="${y}" r="11" fill="#FF7563" opacity=".85"/><circle cx="${x}" cy="${y}" r="5" fill="#fff"/></g><text x="${x}" y="${y + 30}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="13" fill="#B8433D">${t}</text>`;
  return sv('0 0 600 380', `<defs><linearGradient id="dBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF0FF"/><stop offset="1" stop-color="#F7F9FF"/></linearGradient></defs>
    <rect width="600" height="380" fill="url(#dBg)"/><rect x="0" y="310" width="600" height="70" fill="#E2E7F5"/>
    <rect x="380" y="40" width="120" height="90" rx="10" fill="#fff" stroke="#C9D3EA" stroke-width="4"/><path d="M440 40 V130 M380 85 H500" stroke="#C9D3EA" stroke-width="4"/><circle cx="410" cy="64" r="10" fill="#FFE59A"/>
    <rect x="30" y="140" width="26" height="170" rx="8" fill="#B98A5E"/><rect x="530" y="200" width="20" height="110" rx="6" fill="#B98A5E"/>
    <rect x="44" y="270" width="500" height="22" rx="8" fill="#C99A6B"/><rect x="54" y="236" width="480" height="36" rx="12" fill="#fff" stroke="#DCE3F0" stroke-width="2"/>
    <ellipse cx="110" cy="232" rx="50" ry="14" fill="#DDF0FB" stroke="#B7D6EA" stroke-width="2"/>
    <g class="L" data-l="pillows"><path d="M214 176 Q250 150 300 160 Q318 170 306 186 Q260 196 214 190 Z" fill="#BFE3F6" stroke="#7DB7DA" stroke-width="2.4"/>
      </g>
    <g class="L on" data-l="supine">${body(false)}</g>
    <g class="L" data-l="lateral">${body(true)}</g>
    <g class="L" data-l="pillows"><ellipse cx="420" cy="210" rx="32" ry="14" fill="#BFE3F6" stroke="#7DB7DA" stroke-width="2.4"/></g>
    <g class="L" data-l="heel"><rect x="440" y="220" width="64" height="22" rx="11" fill="#FFD27A" stroke="#E0A93C" stroke-width="2.4"/></g>
    <g class="L on" data-l="feet"><path d="M516 206 Q540 200 548 214 Q552 228 538 236 L516 236Z" fill="#F4CDB0"/></g>
    <g class="L" data-l="points">${pt(290, 236, 'kuyruk sokumu', 0)}${pt(536, 236, 'topuk', .3)}${pt(140, 236, 'kulak arkası', .6)}${pt(214, 236, 'sırt', .9)}</g>
    <g class="L" data-l="shine">${[[260, 186], [380, 186], [470, 204]].map(([x, y], i) => `<path class="twinkle" style="animation-delay:${i * .3}s" d="M${x} ${y - 12} L${x + 3} ${y - 3} L${x + 12} ${y} L${x + 3} ${y + 3} L${x} ${y + 12} L${x - 3} ${y + 3} L${x - 12} ${y} L${x - 3} ${y - 3}Z" fill="#FFC64A"/>`).join('')}</g>
    <g class="L" data-l="clock"><circle cx="230" cy="80" r="40" fill="#fff" stroke="#FF7563" stroke-width="7"/><g class="spin"><path d="M230 80 V52" stroke="#22314A" stroke-width="5" stroke-linecap="round"/></g>
      <path d="M230 80 L246 88" stroke="#22314A" stroke-width="5" stroke-linecap="round"/><text x="230" y="146" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="18" fill="#22314A">2 saatte bir</text></g>
    <g class="L" data-l="tray"><rect x="548" y="180" width="52" height="10" rx="4" fill="#B98A5E"/><path d="M556 146 H578 L575 180 H559Z" fill="#DDF0FB" stroke="#7DB7DA" stroke-width="2"/><path d="M557 158 H577 L575 180 H559Z" fill="#8FD0F2"/>
      <ellipse cx="590" cy="176" rx="12" ry="4" fill="#fff" stroke="#C8D7DD"/><circle cx="590" cy="173" r="4" fill="#FFC64A"/></g>`, 'scene', 'Yatakta yatan hasta');
}

/* ---- iyileşme takvimi çizimi ---- */
const HEAL_STAGES = [
  { red: .55, line: '#B8433D', w: 6, st: true, halo: 26 },
  { red: .35, line: '#C9564B', w: 5.5, st: true, halo: 20 },
  { red: .18, line: '#D9706A', w: 5, st: false, halo: 14 },
  { red: .1, line: '#E08A80', w: 6, st: false, halo: 10 },
  { red: .06, line: '#E7A19A', w: 7, st: false, halo: 8 },
  { red: 0, line: '#EFC9B6', w: 4, st: false, halo: 0 },
];
function healScene(i) {
  const s = HEAL_STAGES[i], inc = 'M300 92 C296 140 304 200 300 262';
  const stitches = s.st ? Array.from({ length: 8 }, (_, k) => { const y = 104 + k * 21; return `<path d="M288 ${y - 4} L312 ${y + 4}" stroke="#2E4A6B" stroke-width="3" stroke-linecap="round"/>`; }).join('') : '';
  return sv('0 0 600 340', `<defs><radialGradient id="hSkin" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#F8D8BE"/><stop offset="1" stop-color="#E7B18C"/></radialGradient></defs>
    <rect width="600" height="340" fill="#DDF0FB"/><ellipse cx="300" cy="250" rx="260" ry="230" fill="url(#hSkin)"/>
    <ellipse cx="300" cy="300" rx="11" ry="7" fill="#C98A68"/>
    ${s.halo ? `<ellipse cx="300" cy="178" rx="${s.halo}" ry="98" fill="#F2786A" opacity="${s.red}"/>` : ''}
    <path d="${inc}" stroke="${s.line}" stroke-width="${s.w}" fill="none" stroke-linecap="round"/>${stitches}`, 'scene', 'Ameliyat izinin görünümü');
}

/* ---- uyarı simgeleri ---- */
const WARN_ICONS = {
  fever: sv('0 0 48 48', '<rect x="20" y="6" width="8" height="26" rx="4" fill="#fff" stroke="#FF7563" stroke-width="2.4"/><circle cx="24" cy="36" r="8" fill="#FF7563"/><rect x="22" y="14" width="4" height="20" fill="#FF7563"/><path d="M34 12h6M34 18h4M34 24h6" stroke="#FF7563" stroke-width="2.4" stroke-linecap="round"/>'),
  red: sv('0 0 48 48', '<circle cx="24" cy="24" r="18" fill="#FFB3A6"/><circle cx="24" cy="24" r="10" fill="#FF7563"/><path d="M24 4v6M24 38v6M4 24h6M38 24h6" stroke="#FF7563" stroke-width="3" stroke-linecap="round"/>'),
  pus: sv('0 0 48 48', '<path d="M24 6 C14 20 10 26 10 32 a14 14 0 0 0 28 0 C38 26 34 20 24 6Z" fill="#D9C24A"/><path d="M18 30 a6 6 0 0 0 6 6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>'),
  open: sv('0 0 48 48', '<path d="M24 6 C18 18 30 30 24 42" stroke="#B8433D" stroke-width="3" fill="none"/><path d="M16 14 L22 18 M32 30 L26 34" stroke="#2E4A6B" stroke-width="3" stroke-linecap="round"/><path d="M28 12 q6 8 0 16" stroke="#FF7563" stroke-width="4" fill="none"/>'),
  pain: sv('0 0 48 48', '<circle cx="24" cy="24" r="18" fill="#FFE59A"/><path d="M16 20 L20 18 M32 20 L28 18" stroke="#22314A" stroke-width="2.6" stroke-linecap="round"/><path d="M16 33 Q24 26 32 33" stroke="#22314A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'),
  blister: sv('0 0 48 48', '<path d="M6 36 Q24 4 42 36Z" fill="#FFF0D2" stroke="#E2AE86" stroke-width="2.4"/><ellipse cx="18" cy="24" rx="4" ry="2" fill="#fff"/><path d="M4 36h40" stroke="#E2AE86" stroke-width="2.4"/>'),
  size: sv('0 0 48 48', '<path d="M14 40 V20 a4 4 0 0 1 8 0 V16 a4 4 0 0 1 8 0 V18 a4 4 0 0 1 8 0 V30 Q38 42 26 42Z" fill="#F4CDB0" stroke="#C88E6A" stroke-width="2"/><circle cx="26" cy="30" r="6" fill="#FF7563" opacity=".7"/>'),
  skin: sv('0 0 48 48', '<rect x="6" y="14" width="36" height="22" rx="8" fill="#F4CDB0"/><ellipse cx="24" cy="25" rx="10" ry="6" fill="#8E3A62" opacity=".75"/>'),
};
