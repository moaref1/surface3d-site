// Paints a material ball with a real stamped brush, on the same 16s clock as the graph animation.
(function () {
  var canvas = document.getElementById('hero-paint'), hero = document.querySelector('.home-hero');
  if (!canvas || !hero) return;
  var W = 640, H = 400, CX = 320, CY = 200, R = 150, LOOP = 16000;
  var START = 4000, END = 12000, FADE_FROM = 13800, FADE_TO = 15400; // ms in the loop
  var PASSES = 7, SPACING = 5, BRUSH = 54;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr; canvas.height = H * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  function layer() {
    var c = document.createElement('canvas'); c.width = W * dpr; c.height = H * dpr;
    var x = c.getContext('2d'); x.scale(dpr, dpr);
    return { c: c, x: x };
  }
  var paint = layer(), stage = layer();

  // Bristly soft stamps, one per point on the colour ramp.
  function mix(a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }); }
  var A = [63, 199, 166], B = [127, 232, 205], C = [224, 168, 94];
  var stamps = [];
  for (var i = 0; i < 24; i++) {
    var t = i / 23, rgb = t < .6 ? mix(A, B, t / .6) : mix(B, C, (t - .6) / .4);
    var s = document.createElement('canvas'), size = BRUSH * 2; s.width = s.height = size;
    var x = s.getContext('2d'), g = x.createRadialGradient(size / 2, size / 2, 2, size / 2, size / 2, size / 2);
    var col = rgb.join(',');
    g.addColorStop(0, 'rgba(' + col + ',.55)'); g.addColorStop(.62, 'rgba(' + col + ',.4)'); g.addColorStop(1, 'rgba(' + col + ',0)');
    x.fillStyle = g; x.fillRect(0, 0, size, size);
    x.globalCompositeOperation = 'destination-out';
    for (var n = 0; n < 26; n++) {
      x.fillStyle = 'rgba(0,0,0,' + (.08 + Math.random() * .22) + ')';
      x.beginPath(); x.arc(Math.random() * size, Math.random() * size, 1 + Math.random() * 5, 0, 7); x.fill();
    }
    stamps.push(s);
  }

  var ease = function (t) { return t * t * (3 - 2 * t); };
  // One continuous stroke: smooth passes back and forth across the ball.
  function brushAt(p) {
    var f = Math.min(p, .99999) * PASSES, k = Math.floor(f), u = ease(f - k);
    var dir = k % 2 ? -1 : 1, span = R * 1.02;
    var y = CY - R * .95 + (k + u * .95) * (R * 1.9 / (PASSES - 1 || 1)) * .98;
    return { x: CX + dir * (u * 2 - 1) * span, y: y + Math.sin(u * Math.PI) * 9 };
  }

  var last = 0;
  function stampTo(p) {
    var steps = Math.max(1, Math.ceil((p - last) * PASSES * R * 2.04 / SPACING));
    paint.x.save();
    for (var i = 1; i <= steps; i++) {
      var q = last + (p - last) * i / steps, b = brushAt(q);
      var idx = Math.min(23, Math.floor(((b.x - CX + R) / (2 * R) * .5 + q * .5) * 24));
      paint.x.drawImage(stamps[Math.max(0, idx)], b.x - BRUSH, b.y - BRUSH, BRUSH * 2, BRUSH * 2);
    }
    paint.x.restore();
    last = p;
  }

  // Ball shading is drawn once and reused.
  var base = layer(), light = layer();
  (function () {
    var x = base.x, g = x.createRadialGradient(CX - 45, CY - 55, 10, CX, CY, R);
    g.addColorStop(0, '#6b7178'); g.addColorStop(.7, '#3a3e44'); g.addColorStop(1, '#1d1f23');
    x.fillStyle = g; x.beginPath(); x.arc(CX, CY, R, 0, 7); x.fill();
    var l = light.x, d = l.createRadialGradient(CX - 40, CY - 50, R * .35, CX, CY, R);
    d.addColorStop(0, 'rgba(0,0,0,0)'); d.addColorStop(.72, 'rgba(0,0,0,.2)'); d.addColorStop(1, 'rgba(0,0,0,.72)');
    l.fillStyle = d; l.beginPath(); l.arc(CX, CY, R, 0, 7); l.fill();
    var h = l.createRadialGradient(CX - 55, CY - 68, 2, CX - 55, CY - 68, 62);
    h.addColorStop(0, 'rgba(255,255,255,.5)'); h.addColorStop(1, 'rgba(255,255,255,0)');
    l.fillStyle = h; l.beginPath(); l.arc(CX, CY, R, 0, 7); l.fill();
  })();

  function draw(p, alpha, cursor) {
    ctx.clearRect(0, 0, W, H);
    // floor shadow
    var f = ctx.createRadialGradient(CX, CY + R + 16, 4, CX, CY + R + 16, R);
    f.addColorStop(0, 'rgba(0,0,0,.5)'); f.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.translate(0, (CY + R + 16) * .84); ctx.scale(1, .16); ctx.fillStyle = f;
    ctx.fillRect(0, 0, W, H * 2); ctx.restore();
    ctx.drawImage(base.c, 0, 0, W, H);
    var s = stage.x; s.clearRect(0, 0, W, H);
    s.globalCompositeOperation = 'source-over'; s.globalAlpha = 1;
    s.beginPath(); s.arc(CX, CY, R, 0, 7); s.fillStyle = '#000'; s.fill();
    s.globalCompositeOperation = 'source-in'; s.globalAlpha = alpha;
    s.drawImage(paint.c, 0, 0, W, H);
    ctx.drawImage(stage.c, 0, 0, W, H);
    ctx.drawImage(light.c, 0, 0, W, H);
    if (cursor) {
      var b = brushAt(p);
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(b.x, b.y, BRUSH * .62, 0, 7); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x, b.y, 1.6, 0, 7); ctx.fill();
    }
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { stampTo(1); draw(1, 1, false); return; }

  // The graph runs on this same clock: everything builds in order, then fades together.
  var GRAPH_OUT = 13800, GRAPH_GONE = 14800;
  var parts = [].slice.call(document.querySelectorAll('.g-node,.g-wire,.g-hit')).map(function (el) {
    return { el: el, at: parseFloat(el.style.getPropertyValue('--d')) * 1000 || 0, wire: el.classList.contains('g-wire'), hit: el.classList.contains('g-hit') };
  });
  var graph = document.querySelector('.hero-stage svg');
  function drawGraph(t) {
    var out = t < GRAPH_OUT ? 1 : Math.max(0, 1 - ease(Math.min(1, (t - GRAPH_OUT) / (GRAPH_GONE - GRAPH_OUT))));
    graph.style.setProperty('--fade', out);
    parts.forEach(function (p) {
      var u;
      if (p.wire) {
        u = ease(Math.max(0, Math.min(1, (t - p.at) / 900)));
        p.el.style.strokeDashoffset = 1 - u;
        p.el.style.opacity = u > 0 ? out : 0;
      } else if (p.hit) { // the socket pops as its wire lands
        u = Math.max(0, Math.min(1, (t - p.at - 850) / 350));
        p.el.style.transform = 'scale(' + (1 + Math.sin(u * Math.PI) * .9) + ')';
        p.el.style.opacity = t > p.at + 800 ? out : 0;
      } else {
        u = ease(Math.max(0, Math.min(1, (t - p.at) / 500)));
        p.el.style.opacity = u * out;
        p.el.style.transform = 'translateY(' + (1 - u) * 10 + 'px)';
      }
    });
  }

  var clock = 0, prev = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(now - prev, 50); prev = now;
    if (hero.classList.contains('motion-paused')) return; // the graph's CSS animations pause with this class too
    var was = clock; clock = (clock + dt) % LOOP;
    if (clock < was) { paint.x.clearRect(0, 0, W, H); last = 0; }
    var p = Math.max(0, Math.min(1, (clock - START) / (END - START)));
    if (p > last) stampTo(p);
    var a = clock < FADE_FROM ? 1 : Math.max(0, 1 - ease((clock - FADE_FROM) / (FADE_TO - FADE_FROM)));
    draw(p, a, clock > START && clock < END);
    drawGraph(clock);
  }
  draw(0, 1, false); drawGraph(0);
  requestAnimationFrame(function (n) { prev = n; frame(n); });
})();
