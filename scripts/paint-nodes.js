// Site-wide paint and node touches. Everything here is decoration added on top of the pages.
(function () {
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var INK = { terracotta: [168, 80, 60], ochre: [197, 138, 74], sage: [150, 152, 118], teal: [63, 199, 166], olive: [92, 88, 50] };

  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; }
  function deform(pts, depth, spread) {
    for (var d = 0; d < depth; d++) {
      var next = [];
      for (var i = 0; i < pts.length; i++) {
        var a = pts[i], b = pts[(i + 1) % pts.length], len = Math.hypot(b.x - a.x, b.y - a.y);
        next.push(a, { x: (a.x + b.x) / 2 + gauss() * len * spread, y: (a.y + b.y) / 2 + gauss() * len * spread });
      }
      pts = next;
    }
    return pts;
  }
  // Procedural watercolour: many faint, randomly deformed copies of one shape build up soft pigment edges.
  function blob(rgb, size) {
    var c = document.createElement('canvas'); c.width = c.height = size;
    var x = c.getContext('2d'), m = size / 2, r = size * .31, shape = [];
    for (var i = 0; i < 9; i++) {
      var t = i / 9 * Math.PI * 2, k = 1 + gauss() * .22;
      shape.push({ x: m + Math.cos(t) * r * k, y: m + Math.sin(t) * r * k });
    }
    shape = deform(shape, 2, .28);
    x.fillStyle = 'rgba(' + rgb.join(',') + ',.03)';
    for (var l = 0; l < 40; l++) {
      var p = deform(shape, 3, .3 + l / 40 * .34);
      x.beginPath(); x.moveTo(p[0].x, p[0].y);
      for (var j = 1; j < p.length; j++) x.lineTo(p[j].x, p[j].y);
      x.closePath(); x.fill();
    }
    x.globalCompositeOperation = 'destination-out';
    // Blooms: pale patches where the water pushed the pigment away.
    for (var w = 0; w < 7; w++) {
      var wx = m + gauss() * r, wy = m + gauss() * r, wr = r * (.2 + Math.random() * .4), wg = x.createRadialGradient(wx, wy, 0, wx, wy, wr);
      wg.addColorStop(0, 'rgba(0,0,0,.34)'); wg.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = wg; x.fillRect(wx - wr, wy - wr, wr * 2, wr * 2);
    }
    for (var n = 0; n < 240; n++) {
      x.fillStyle = 'rgba(0,0,0,' + Math.random() * .1 + ')';
      x.beginPath(); x.arc(Math.random() * size, Math.random() * size, Math.random() * 3.5 + .4, 0, 7); x.fill();
    }
    return c;
  }

  // A cluster of painted shapes tied together by thin node wires.
  function bleed(host, recipe) {
    var el = document.createElement('div'); el.className = 'pn-bleed'; el.setAttribute('aria-hidden', 'true');
    recipe.forEach(function (b) {
      var c = blob(INK[b.ink], 420); c.className = 'pn-blob';
      c.style.cssText = 'left:' + b.x + '%;top:' + b.y + '%;width:' + b.s + '%;--depth:' + b.d;
      el.appendChild(c);
    });
    el.insertAdjacentHTML('beforeend', '<svg class="pn-lines" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet"><path pathLength="1" d="M20 210C110 210 90 70 190 70S300 190 380 120"/><path pathLength="1" d="M60 270C150 270 170 170 240 170S340 260 390 230"/><circle cx="20" cy="210" r="3.5"/><circle cx="380" cy="120" r="3.5"/><circle cx="60" cy="270" r="3.5"/><circle cx="390" cy="230" r="3.5"/></svg>');
    host.classList.add('pn-has-bleed'); host.prepend(el);
    return el;
  }
  var RECIPES = [
    [{ ink: 'terracotta', x: 8, y: -6, s: 56, d: 14 }, { ink: 'sage', x: 42, y: 14, s: 52, d: 26 }, { ink: 'ochre', x: 20, y: 40, s: 44, d: 20 }],
    [{ ink: 'teal', x: 10, y: 0, s: 54, d: 18 }, { ink: 'ochre', x: 44, y: 22, s: 46, d: 28 }, { ink: 'terracotta', x: 28, y: 44, s: 36, d: 12 }]
  ];
  function addBleeds() {
    var hosts = document.querySelectorAll('main .page-hero:not(.info-hero), .documentation-heading');
    hosts.forEach(function (h, i) { bleed(h, RECIPES[i % 2]); });
    document.querySelectorAll('.home-end-inner,.final-cta').forEach(function (h) { bleed(h, RECIPES[1]).classList.add('pn-bleed-soft'); });
  }

  // Cards, chapter titles and footer fade up as they scroll in.
  var seen = reduced || !('IntersectionObserver' in window) ? null : new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('pn-in'); seen.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -30px 0px' });
  var CARDS = '.feature-entry,.tutorial-card,.price-card,.info-card,.showcase-card,.download-card,.download-steps li,.support-panel';
  function watch() {
    if (!seen) return;
    document.querySelectorAll(CARDS).forEach(function (c) {
      if (c.dataset.pnWatched) return;
      c.dataset.pnWatched = '1'; c.classList.add('pn-rise');
      var r = c.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) c.classList.add('pn-in'); else seen.observe(c);
    });
  }
  function headings() {
    var inks = ['#a8503c', '#3fc7a6', '#c58a4a', '#969876', '#7fe8cd', '#a8503c'], i = 0;
    document.querySelectorAll('.workflow-story .story-copy h3,.render-feature-head h3').forEach(function (h) {
      h.classList.add('pn-stroke'); h.style.setProperty('--ink', inks[i++ % inks.length]);
      if (seen) { h.classList.add('pn-rise-text'); seen.observe(h); } else h.classList.add('pn-in');
    });
  }

  // Home page: chapters as a chain of nodes on the page edge, wired up as you scroll.
  function rail() {
    var links = [].slice.call(document.querySelectorAll('.workflow-nav a'));
    if (!links.length) return;
    var nav = document.createElement('nav'); nav.className = 'pn-rail'; nav.setAttribute('aria-label', 'Chapters');
    nav.innerHTML = '<svg viewBox="0 0 20 300" preserveAspectRatio="none" aria-hidden="true"><path class="pn-rail-bg" d="M10 0C2 50 18 100 10 150S2 250 10 300"/><path class="pn-rail-fill" pathLength="1" d="M10 0C2 50 18 100 10 150S2 250 10 300"/></svg>';
    var dots = links.map(function (a, i) {
      var d = document.createElement('a'); d.href = a.getAttribute('href'); d.style.top = (i / (links.length - 1) * 100) + '%';
      d.setAttribute('aria-label', a.textContent); d.innerHTML = '<span>' + a.textContent + '</span>';
      nav.appendChild(d); return d;
    });
    document.body.appendChild(nav);
    var story = document.querySelector('.workflow-story'), fill = nav.querySelector('.pn-rail-fill'), ticking = false;
    function update() {
      ticking = false;
      var r = story.getBoundingClientRect(), p = Math.max(0, Math.min(1, (innerHeight * .5 - r.top) / r.height));
      fill.style.strokeDashoffset = 1 - p;
      nav.classList.toggle('pn-rail-on', r.top < innerHeight * .25 && r.bottom > innerHeight * .4);
      dots.forEach(function (d, i) { d.classList.toggle('on', p >= i / (dots.length - 1) - .001); });
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update); update();
  }

  // Mouse: a pigment glow follows the cursor inside cards, and painted shapes drift with it.
  function mouse() {
    if (!finePointer || reduced) return;
    var pending = null;
    document.addEventListener('pointermove', function (e) {
      if (!pending) requestAnimationFrame(function () {
        var ev = pending; pending = null;
        var card = ev.target.closest && ev.target.closest(CARDS);
        if (card) { var r = card.getBoundingClientRect(); card.style.setProperty('--mx', ev.clientX - r.left + 'px'); card.style.setProperty('--my', ev.clientY - r.top + 'px'); }
        document.documentElement.style.setProperty('--pn-x', (ev.clientX / innerWidth - .5).toFixed(3));
        document.documentElement.style.setProperty('--pn-y', (ev.clientY / innerHeight - .5).toFixed(3));
      });
      pending = e;
    }, { passive: true });
  }

  function start() {
    headings(); rail(); watch();
    addEventListener('surface-features-rendered', function () { setTimeout(watch); });
    addEventListener('surface-content-updated', function () { setTimeout(watch); });
  }
  if (window.SurfaceSite && SurfaceSite.ready) SurfaceSite.ready.then(start); else start();
})();
