/* Arka plan (süzülen hücreler + ince parçacıklar) ve kutlama efektleri. */
(function(){
const FX = window.FX = {};
const cv = document.getElementById('bg'), ctx = cv && cv.getContext('2d');
let W, H, dpr, cells = [], dots = [], hueA = [45,212,191], hueB = [99,102,241], target = { a:hueA.slice(), b:hueB.slice() }, light = false, intensity = 1;

function resize(){
  dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function seed(){
  cells = Array.from({ length: 7 }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, r: 180 + Math.random() * 260, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18, k: i % 2 }));
  dots = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + .4, vy: -(Math.random() * .25 + .05), a: Math.random() * .5 + .15 }));
}
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function frame(){
  hueA = mix(hueA, target.a, .03); hueB = mix(hueB, target.b, .03);
  ctx.clearRect(0, 0, W, H);
  ctx.globalCompositeOperation = light ? 'multiply' : 'lighter';
  for (const c of cells){
    c.x += c.vx; c.y += c.vy;
    if (c.x < -c.r) c.x = W + c.r; if (c.x > W + c.r) c.x = -c.r; if (c.y < -c.r) c.y = H + c.r; if (c.y > H + c.r) c.y = -c.r;
    const col = c.k ? hueB : hueA, g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
    const al = (light ? .10 : .13) * intensity;
    g.addColorStop(0, `rgba(${col.map(Math.round)},${al})`); g.addColorStop(1, `rgba(${col.map(Math.round)},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  for (const d of dots){
    d.y += d.vy * intensity; if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
    ctx.fillStyle = light ? `rgba(15,40,70,${d.a * .35})` : `rgba(200,230,255,${d.a * .6})`;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
  }
  requestAnimationFrame(frame);
}
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
FX.palette = (a, b) => { target.a = hex(a); target.b = hex(b); };
FX.setLight = v => { light = v; };
FX.intensity = v => { intensity = v; };
if (cv){ resize(); seed(); addEventListener('resize', () => { resize(); }); if (!Y.reduced) frame(); }

/* Konfeti — kendi tuvalimizde (sahnenin üstünde) */
const fxc = document.getElementById('fx');
const conf = window.confetti && fxc ? confetti.create(fxc, { resize:true, useWorker:true }) : (window.confetti || (() => {}));
const COLORS = ['#2DD4BF','#60A5FA','#FBBF24','#FF6B5E','#A78BFA','#ffffff'];
FX.burst = (x=.5, y=.5, n=120) => conf({ particleCount:n, spread:90, startVelocity:45, origin:{ x, y }, colors:COLORS, scalar:1.1 });
FX.cannons = () => {
  conf({ particleCount:140, angle:60, spread:70, origin:{ x:0, y:.9 }, colors:COLORS, startVelocity:70 });
  conf({ particleCount:140, angle:120, spread:70, origin:{ x:1, y:.9 }, colors:COLORS, startVelocity:70 });
};
FX.fireworks = (sec=5) => {
  const end = Date.now() + sec * 1000;
  (function f(){
    conf({ particleCount:70, startVelocity:32, spread:360, ticks:80, gravity:.9, origin:{ x:Math.random() * .8 + .1, y:Math.random() * .4 + .1 }, colors:COLORS, scalar:.9 });
    if (Date.now() < end) setTimeout(f, 380 + Math.random() * 300);
  })();
};
FX.rain = (sec=4) => {
  const end = Date.now() + sec * 1000;
  (function f(){
    conf({ particleCount:6, angle:270, spread:40, startVelocity:10, gravity:.6, origin:{ x:Math.random(), y:-.05 }, colors:COLORS, ticks:300 });
    if (Date.now() < end) requestAnimationFrame(f);
  })();
};
})();
