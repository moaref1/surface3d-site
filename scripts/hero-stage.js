// Home hero. The ball is painted from the first frame and the loop never resets: each colour from the
// graph's Color node is brushed over the last one, so there is no empty start and no jump.
(function () {
  var canvas = document.getElementById('hero-paint'), hero = document.querySelector('.home-hero');
  if (!canvas || !hero) return;
  var W = 640, H = 400, CX = 320, CY = 200, R = 150, BRUSH = 50, PASSES = 7, SPACING = 5;
  var STROKE_MS = 6500, REST_MS = 1300;
  var COLORS = [
    { rgb: [63, 199, 166], text: '0.25 0.78 0.65' },
    { rgb: [168, 80, 60], text: '0.66 0.31 0.24' },
    { rgb: [197, 138, 74], text: '0.77 0.54 0.29' },
    { rgb: [150, 152, 118], text: '0.59 0.60 0.46' },
    { rgb: [127, 232, 205], text: '0.50 0.91 0.80' }
  ];
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr; canvas.height = H * dpr;
  var ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  function layer() {
    var c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
    var x = c.getContext('2d'); x.scale(dpr, dpr); return { c: c, x: x };
  }
  var paint = layer(), base = layer(), shade = layer();
  var ease = function (t) { return t * t * (3 - 2 * t); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  // Watercolour stamps: soft centre, slightly darker pigment rim, speckled grain.
  function makeStamps(rgb) {
    var out = [], size = BRUSH * 2, col = rgb.join(','), dark = rgb.map(function (v) { return Math.round(v * .72); }).join(',');
    for (var i = 0; i < 6; i++) {
      var s = document.createElement('canvas'); s.width = s.height = size;
      var x = s.getContext('2d'), m = size / 2, g = x.createRadialGradient(m, m, 2, m, m, m);
      g.addColorStop(0, 'rgba(' + col + ',.26)'); g.addColorStop(.6, 'rgba(' + col + ',.16)'); g.addColorStop(1, 'rgba(' + dark + ',0)');
      x.fillStyle = g; x.fillRect(0, 0, size, size);
      x.globalCompositeOperation = 'destination-out';
      for (var n = 0; n < 34; n++) {
        x.fillStyle = 'rgba(0,0,0,' + (.05 + Math.random() * .2) + ')';
        x.beginPath(); x.arc(Math.random() * size, Math.random() * size, .6 + Math.random() * 4, 0, 7); x.fill();
      }
      out.push(s);
    }
    return out;
  }
  COLORS.forEach(function (c) { c.stamps = makeStamps(c.rgb); });

  function brushAt(p) {
    var f = Math.min(p, .99999) * PASSES, k = Math.floor(f), u = ease(f - k), dir = k % 2 ? -1 : 1;
    return { x: CX + dir * (u * 2 - 1) * R * 1.02, y: CY - R * .9 + (k + u) * (R * 1.8 / PASSES) + Math.sin(u * Math.PI) * 8 };
  }
  var stampIndex = 0;
  function dab(x, y, color) {
    paint.x.drawImage(color.stamps[stampIndex++ % 6], x - BRUSH, y - BRUSH, BRUSH * 2, BRUSH * 2);
  }
  function strokeBetween(a, b, color) {
    var d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / SPACING));
    for (var i = 1; i <= n; i++) dab(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n, color);
  }

  // Ball and floor shadow are drawn once.
  (function () {
    var x = base.x;
    x.save(); x.translate(CX, CY + R + 18); x.scale(1, .13);
    var f = x.createRadialGradient(0, 0, 4, 0, 0, R);
    f.addColorStop(0, 'rgba(0,0,0,.55)'); f.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = f; x.beginPath(); x.arc(0, 0, R, 0, 7); x.fill(); x.restore();
    var g = x.createRadialGradient(CX - 45, CY - 55, 10, CX, CY, R);
    g.addColorStop(0, '#6b7178'); g.addColorStop(.7, '#3a3e44'); g.addColorStop(1, '#1d1f23');
    x.fillStyle = g; x.beginPath(); x.arc(CX, CY, R, 0, 7); x.fill();
    var l = shade.x, d = l.createRadialGradient(CX - 40, CY - 50, R * .35, CX, CY, R);
    d.addColorStop(0, 'rgba(0,0,0,0)'); d.addColorStop(.72, 'rgba(0,0,0,.2)'); d.addColorStop(1, 'rgba(0,0,0,.72)');
    l.fillStyle = d; l.beginPath(); l.arc(CX, CY, R, 0, 7); l.fill();
  })();

  // Full starting coat, so the first frame already shows a painted ball.
  for (var pre = 0, prev0 = brushAt(0); pre <= 1; pre += .004) { var b0 = brushAt(pre); strokeBetween(prev0, b0, COLORS[0]); prev0 = b0; }

  var masked = layer();
  var rough = .4, roughTarget = .4;
  function draw(cursor) {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(base.c, 0, 0, W, H);
    var s = masked.x; s.globalCompositeOperation = 'source-over'; s.clearRect(0, 0, W, H);
    s.fillStyle = '#000'; s.beginPath(); s.arc(CX, CY, R, 0, 7); s.fill();
    s.globalCompositeOperation = 'source-in'; s.drawImage(paint.c, 0, 0, W, H);
    ctx.drawImage(masked.c, 0, 0, W, H);
    ctx.drawImage(shade.c, 0, 0, W, H);
    // The Value node really drives the shine: this is the Roughness input.
    var hx = CX - 55, hy = CY - 68, hr = 26 + rough * 110, h = ctx.createRadialGradient(hx, hy, 1, hx, hy, hr);
    h.addColorStop(0, 'rgba(255,255,255,' + (.72 - rough * .55) + ')'); h.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.save(); ctx.beginPath(); ctx.arc(CX, CY, R, 0, 7); ctx.clip(); ctx.fillStyle = h; ctx.fillRect(0, 0, W, H); ctx.restore();
    if (cursor) {
      ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(cursor.x, cursor.y, BRUSH * .6, 0, 7); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cursor.x, cursor.y, 1.5, 0, 7); ctx.fill();
    }
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(null); return; }

  // Graph: wires connect once on load, then values keep flowing along them.
  var wires = [].slice.call(document.querySelectorAll('.hero-graph .g-wire'));
  var hits = [].slice.call(document.querySelectorAll('.hero-graph .g-hit'));
  var svg = document.querySelector('.hero-graph'), NS = 'http://www.w3.org/2000/svg';
  var flows = wires.map(function (w, i) {
    var c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '2.6'); c.setAttribute('class', 'g-flow');
    c.style.fill = getComputedStyle(w).stroke; svg.appendChild(c);
    return { el: c, wire: w, len: w.getTotalLength(), phase: i / wires.length };
  });
  wires.forEach(function (w) { w.style.strokeDashoffset = 1; });
  hits.forEach(function (h) { h.style.opacity = 0; });
  function drawGraph(t) {
    wires.forEach(function (w, i) {
      var at = 100 + i * 350, u = ease(clamp((t - at) / 500, 0, 1));
      w.style.strokeDashoffset = 1 - u;
      if (hits[i]) {
        var pop = clamp((t - at - 480) / 320, 0, 1);
        hits[i].style.opacity = t > at + 460 ? 1 : 0;
        hits[i].style.transform = 'scale(' + (1 + Math.sin(pop * Math.PI) * .9) + ')';
      }
    });
    if (t < 1500) return;
    flows.forEach(function (f) {
      var u = ((t - 1500) / 2600 + f.phase) % 1, pt = f.wire.getPointAtLength(u * f.len);
      f.el.setAttribute('cx', pt.x); f.el.setAttribute('cy', pt.y);
      f.el.style.opacity = Math.min(1, Math.min(u, 1 - u) * 8);
    });
  }

  var colorText = document.getElementById('g-color-value'), swatch = document.getElementById('g-color-swatch'), valueText = document.getElementById('g-value-value');
  var colorIndex = 1;
  function setColor(i) {
    var c = COLORS[i];
    if (colorText) colorText.textContent = c.text;
    if (swatch) swatch.setAttribute('fill', 'rgb(' + c.rgb.join(',') + ')');
  }
  setColor(colorIndex);

  // Mouse: over the ball the brush follows you. Elsewhere the Value node follows your horizontal position.
  var mouse = null, over = false, last = null, wasOver = false;
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var r = canvas.getBoundingClientRect(), k = W / r.width;
    mouse = { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
    over = Math.hypot(mouse.x - CX, mouse.y - CY) < R + 20;
    var hr = hero.getBoundingClientRect();
    roughTarget = clamp((e.clientX - hr.left) / hr.width, .08, .92);
    hero.style.setProperty('--px', ((e.clientX - hr.left) / hr.width - .5).toFixed(3));
    hero.style.setProperty('--py', ((e.clientY - hr.top) / hr.height - .5).toFixed(3));
  });
  hero.addEventListener('pointerleave', function () { over = false; mouse = null; });

  var clock = 0, elapsed = 0, prev = 0, shown = '';
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(now - prev, 50); prev = now;
    if (hero.classList.contains('motion-paused')) return;
    elapsed += dt;
    drawGraph(elapsed);
    rough += (roughTarget - rough) * .08;
    var label = rough.toFixed(3);
    if (label !== shown && valueText) { valueText.textContent = label; shown = label; }
    var color = COLORS[colorIndex], cursor = null;
    if (over && mouse) {
      if (!wasOver) last = mouse;
      strokeBetween(last, mouse, color);
      last = { x: mouse.x, y: mouse.y }; cursor = mouse; wasOver = true;
    } else {
      wasOver = false;
      var before = clock; clock += dt;
      if (clock < STROKE_MS) {
        strokeBetween(brushAt(before / STROKE_MS), brushAt(clock / STROKE_MS), color);
        cursor = brushAt(clock / STROKE_MS);
      } else if (clock >= STROKE_MS + REST_MS) {
        clock = 0; colorIndex = (colorIndex + 1) % COLORS.length; setColor(colorIndex);
        cursor = brushAt(0);
      }
    }
    draw(cursor);
  }
  draw(brushAt(0));
  requestAnimationFrame(function (n) { prev = n; frame(n); });
})();
