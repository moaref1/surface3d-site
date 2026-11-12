// Landing page: node graphs built in the app's design language (header colour = node family, socket colour =
// data type), a layer that opens into its graph on scroll, interactive tiles and gentle parallax.
// Per-frame work only changes transform, opacity and stroke offsets.
(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('h-js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return v < a ? a : v > b ? b : v; };
  var toast = function (t) { if (window.SurfaceSite && SurfaceSite.toast) SurfaceSite.toast(t); };

  // ---------- design language (marketing/DESIGN-LANGUAGE.md) ----------
  var FAM = { inputs: ['Inputs', '#83314a'], coords: ['Coordinates & Transforms', '#5454a0'], patterns: ['Patterns & Noise', '#aa5c1e'],
    scatter: ['Scatter & Tiles', '#966e28'], color: ['Color & Channels', '#7a7424'], filters: ['Filters', '#246283'],
    normals: ['Normals & Height', '#644696'], masks: ['Masks & Shapes', '#2e7052'], materials: ['Materials', '#28803c'], outputs: ['Outputs', '#6e2230'] };
  var SOCK = { color: ['Color', '#e9b34c'], value: ['Value', '#bdc4cf'], vector: ['Vector', '#6ea5ed'], normal: ['Normal', '#ad84e0'],
    int: ['Integer', '#68cca7'], bool: ['Boolean', '#cb798a'], path: ['Path', '#ef7e44'] };
  var BALL = function (n, size) { return 'assets/img/matballs/' + n + '-' + (size || 'sm'); };

  // rows: ['i'|'o', label, type, key, value] · ['f', label, fill 0..1, text] · ['sw', css] · ['mpv', url] · ['pv']
  function nodeHTML(cid, n) {
    var h = '<div class="n" data-fam="' + n.f + '" data-id="' + n.id + '" style="left:' + n.x + 'px;top:' + n.y + 'px;width:' + n.w + 'px;--d:' + (n.d || 0) + 's">' +
      '<div class="nh" style="--h:' + FAM[n.f][1] + '"><i></i><span class="t">' + n.t + '</span></div><div class="nb">';
    n.rows.forEach(function (r) {
      if (r[0] === 'f') h += '<div class="f"><b style="width:' + Math.round(r[2] * 100) + '%"></b><em>' + r[1] + '</em><span>' + r[3] + '</span></div>';
      else if (r[0] === 'sw') h += '<div class="sw" style="background-image:' + r[1] + '"></div>';
      else if (r[0] === 'mpv') h += '<div class="mpv" style="background-image:url(' + r[1] + ')"></div>';
      else if (r[0] === 'pv') h += '<div class="pv"></div>';
      else h += '<div class="r ' + r[0] + '">' + (r[0] === 'i' ? '<s id="' + cid + '-' + n.id + '-' + r[3] + '" style="--c:' + SOCK[r[2]][1] + '"></s>' + r[1] + (r[4] ? '<em>' + r[4] + '</em>' : '')
        : r[1] + '<s id="' + cid + '-' + n.id + '-' + r[3] + '" style="--c:' + SOCK[r[2]][1] + '"></s>') + '</div>';
    });
    return h + '</div></div>';
  }
  function renderGraph(canvas, g) {
    var cid = canvas.id;
    canvas.innerHTML = '<svg class="wires" aria-hidden="true">' + g.wires.map(function (w, i) {
      return '<path data-w="' + cid + '-' + w[0].replace('.', '-') + ' ' + cid + '-' + w[1].replace('.', '-') + '" style="--d:' + (w[2] || (.2 + i * .07)) + 's"/>';
    }).join('') + '</svg>' + g.nodes.map(function (n) { return nodeHTML(cid, n); }).join('') + (g.extra || '');
  }

  // ---------- graphs ----------
  // Real nodes from the app (names, sockets and families as Surface3D 0.94 has them).
  var GE = {
    nodes: [
      { id: 'map', t: 'Mapping', f: 'coords', x: 24, y: 24, w: 176, d: 0, rows: [['f', 'Scale', .4, '2.0'], ['f', 'Rotation Z', .25, '45'], ['o', 'Result', 'vector', 'v']] },
      { id: 'img', t: 'Gold · ambientCG', f: 'inputs', x: 24, y: 172, w: 176, d: .05, rows: [['sw', 'linear-gradient(135deg,#f7d58a,#b9832b 45%,#5d3d10)'], ['o', 'Result', 'color', 'c']] },
      { id: 'cv', t: 'Curvature', f: 'normals', x: 24, y: 310, w: 176, d: .1, rows: [['f', 'Intensity', .4, '1.6'], ['o', 'Curvature', 'value', 'e']] },
      { id: 'vor', t: 'Voronoi', f: 'patterns', x: 24, y: 432, w: 176, d: .15, rows: [['f', 'Tiles', .3, '12'], ['o', 'Result', 'value', 'o']] },
      { id: 'gn', t: 'Grunge Noise', f: 'patterns', x: 262, y: 60, w: 164, d: .2, rows: [['i', 'Coordinates', 'vector', 'c'], ['f', 'Scale', .45, '8'], ['f', 'Contrast', .6, '0.6'], ['o', 'Result', 'value', 'o']] },
      { id: 'lv', t: 'Levels', f: 'filters', x: 262, y: 300, w: 164, d: .25, rows: [['i', 'Image / value', 'value', 'v'], ['f', 'Input black', .3, '0.30'], ['f', 'Input white', .72, '0.72'], ['o', 'Result', 'value', 'o']] },
      { id: 'hn', t: 'Height to Normal', f: 'filters', x: 492, y: 40, w: 164, d: .3, rows: [['i', 'Height', 'value', 'h'], ['f', 'Strength', .6, '1.5'], ['o', 'Result', 'normal', 'n']] },
      { id: 'bl', t: 'Blend', f: 'color', x: 492, y: 210, w: 164, d: .35, rows: [['i', 'Background', 'color', 'a'], ['i', 'Foreground', 'color', 'b'], ['i', 'Opacity', 'value', 'm'], ['f', 'Mode', 1, 'Multiply'], ['o', 'Result', 'color', 'o']] },
      { id: 'sb', t: 'Slope Blur', f: 'filters', x: 492, y: 420, w: 164, d: .4, rows: [['i', 'A', 'value', 'a'], ['i', 'B', 'value', 'b'], ['f', 'Samples', .4, '16'], ['o', 'Result', 'value', 'o']] },
      { id: 'out', t: 'Material Output', f: 'outputs', x: 914, y: 40, w: 226, d: .45, rows: [['i', 'Base color', 'color', 'b'], ['i', 'Roughness', 'value', 'r'], ['i', 'Metallic', 'value', 'm', '1.00'], ['i', 'Normal', 'normal', 'n'], ['pv']] }
    ],
    wires: [['map.v', 'gn.c'], ['gn.o', 'hn.h'], ['cv.e', 'lv.v'], ['img.c', 'bl.a'], ['lv.o', 'bl.m'], ['vor.o', 'sb.a'], ['gn.o', 'sb.b'], ['hn.n', 'out.n'], ['bl.o', 'out.b'], ['sb.o', 'out.r']],
    extra: '<picture class="ge-ball" data-par="-0.04"><source type="image/webp" srcset="' + BALL('acg-metal007', 'lg') + '.webp"><img src="' + BALL('acg-metal007', 'lg') + '.png" alt="" width="1058" height="1200" loading="lazy" decoding="async"></picture>'
  };
  // Mask graphs read the layer's own (taught or painted) mask through Layer mask and end in Mask Output.
  var LAYER_GRAPHS = {
    moss: { title: 'Moss · mask graph', nodes: [
      { id: 'lm', t: 'Layer mask', f: 'inputs', x: 12, y: 14, w: 150, d: 0, rows: [['o', 'Result', 'value', 'o']] },
      { id: 'cv', t: 'Curvature', f: 'normals', x: 12, y: 92, w: 150, d: .08, rows: [['f', 'Intensity', .4, '1.6'], ['o', 'Concavity', 'value', 'e']] },
      { id: 'gn', t: 'Grunge Noise', f: 'patterns', x: 12, y: 206, w: 150, d: .16, rows: [['f', 'Scale', .4, '8'], ['o', 'Result', 'value', 'o']] },
      { id: 'lv', t: 'Levels', f: 'filters', x: 180, y: 92, w: 136, d: .24, rows: [['i', 'Image / value', 'value', 'v'], ['f', 'Input white', .72, '0.72'], ['o', 'Result', 'value', 'o']] },
      { id: 'bl', t: 'Blend', f: 'color', x: 336, y: 120, w: 124, d: .32, rows: [['i', 'Background', 'value', 'a'], ['i', 'Foreground', 'value', 'b'], ['i', 'Opacity', 'value', 'c'], ['o', 'Result', 'value', 'o']] },
      { id: 'mo', t: 'Mask Output', f: 'outputs', x: 480, y: 40, w: 152, d: .4, rows: [['i', 'A', 'value', 'a'], ['mpv', 'assets/img/masks/moss.png']] }],
      wires: [['lm.o', 'bl.a', .15], ['cv.e', 'lv.v', .25], ['lv.o', 'bl.b', .45], ['gn.o', 'bl.c', .4], ['bl.o', 'mo.a', .6]] },
    edges: { title: 'Edge wear · mask graph', nodes: [
      { id: 'cv', t: 'Curvature', f: 'normals', x: 12, y: 30, w: 150, d: 0, rows: [['f', 'Intensity', .3, '1.2'], ['o', 'Convexity', 'value', 'e']] },
      { id: 'lm', t: 'Layer mask', f: 'inputs', x: 12, y: 150, w: 150, d: .08, rows: [['o', 'Result', 'value', 'o']] },
      { id: 'gn', t: 'Grunge Noise', f: 'patterns', x: 12, y: 232, w: 150, d: .16, rows: [['f', 'Scale', .6, '16'], ['o', 'Result', 'value', 'o']] },
      { id: 'bv', t: 'Bevel', f: 'masks', x: 186, y: 150, w: 130, d: .24, rows: [['i', 'Mask', 'value', 'm'], ['o', 'Result', 'value', 'o']] },
      { id: 'bl', t: 'Blend', f: 'color', x: 336, y: 100, w: 124, d: .32, rows: [['i', 'Background', 'value', 'a'], ['i', 'Foreground', 'value', 'b'], ['i', 'Opacity', 'value', 'c'], ['o', 'Result', 'value', 'o']] },
      { id: 'mo', t: 'Mask Output', f: 'outputs', x: 480, y: 40, w: 152, d: .4, rows: [['i', 'A', 'value', 'a'], ['mpv', 'assets/img/masks/edges.png']] }],
      wires: [['cv.e', 'bl.a', .2], ['lm.o', 'bv.m', .3], ['bv.o', 'bl.b', .45], ['gn.o', 'bl.c', .4], ['bl.o', 'mo.a', .6]] },
    drips: { title: 'Rust drips · mask graph', nodes: [
      { id: 'gn', t: 'Grunge Noise', f: 'patterns', x: 12, y: 24, w: 150, d: 0, rows: [['f', 'Scale', .3, '4'], ['o', 'Result', 'value', 'o']] },
      { id: 'lm', t: 'Layer mask', f: 'inputs', x: 12, y: 150, w: 150, d: .08, rows: [['o', 'Result', 'value', 'o']] },
      { id: 'sb', t: 'Slope Blur', f: 'filters', x: 190, y: 40, w: 136, d: .16, rows: [['i', 'A', 'value', 'a'], ['i', 'B', 'value', 'b'], ['f', 'Samples', .4, '16'], ['o', 'Result', 'value', 'o']] },
      { id: 'lv', t: 'Levels', f: 'filters', x: 336, y: 150, w: 124, d: .24, rows: [['i', 'Image / value', 'value', 'v'], ['f', 'Gamma', .5, '1.2'], ['o', 'Result', 'value', 'o']] },
      { id: 'mo', t: 'Mask Output', f: 'outputs', x: 480, y: 40, w: 152, d: .32, rows: [['i', 'A', 'value', 'a'], ['mpv', 'assets/img/masks/drips.png']] }],
      wires: [['gn.o', 'sb.a', .2], ['lm.o', 'sb.b', .3], ['sb.o', 'lv.v', .45], ['lv.o', 'mo.a', .55]] }
  };

  // ---------- material wall ----------
  var M = [
    ['acg-metal007', 'Gold', 'filters', 'ambientCG'], ['ph-brown-leather', 'Brown leather', 'inputs', 'Poly Haven'], ['ph-aerial-rocks-02', 'Mossy rocks', 'masks', 'Poly Haven'],
    ['acg-marble016', 'Black marble', 'coords', 'ambientCG'], ['acg-paintedmetal006', 'Chipped paint', 'patterns', 'ambientCG'], ['ph-velour-velvet', 'Velvet', 'inputs', 'Poly Haven'],
    ['ph-red-brick-03', 'Red brick', 'scatter', 'Poly Haven'], ['acg-terrazzo013', 'Terrazzo', 'color', 'ambientCG'], ['ph-rusty-metal-02', 'Rusty metal', 'patterns', 'Poly Haven'],
    ['ph-denim-fabric', 'Denim', 'filters', 'Poly Haven'], ['ph-wood-table-001', 'Walnut', 'scatter', 'Poly Haven'], ['ph-castle-wall-slates', 'Slate wall', 'normals', 'Poly Haven'],
    ['acg-fabric038', 'Blue fabric', 'coords', 'ambientCG'], ['acg-tiles004', 'Mint tiles', 'materials', 'ambientCG'], ['ph-clay-roof-tiles', 'Clay roof', 'scatter', 'Poly Haven'],
    ['ph-mossy-rock', 'Mossy rock', 'masks', 'Poly Haven'], ['ph-corrugated-iron', 'Corrugated iron', 'filters', 'Poly Haven'], ['acg-fabric026', 'Red fabric', 'inputs', 'ambientCG'],
    ['acg-metal012', 'Brushed steel', 'coords', 'ambientCG'], ['ph-snow-02', 'Snow', 'normals', 'Poly Haven'], ['acg-tiles013', 'Checker tiles', 'color', 'ambientCG'],
    ['acg-leather034b', 'Dark leather', 'materials', 'ambientCG'], ['ph-curly-teddy-checkered', 'Teddy', 'patterns', 'Poly Haven'], ['acg-onyx015', 'Onyx', 'coords', 'ambientCG'],
    ['ph-blue-metal-plate', 'Blue plate', 'filters', 'Poly Haven'], ['ph-herringbone-parquet', 'Parquet', 'scatter', 'Poly Haven']
  ];
  var CURSOR = '<svg class="cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.6 14 L17.5 14 Z" fill="#fff" stroke="#0c0d10" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var wall = $('.h-wall');
  if (wall) {
    var rows = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 0, 18, 19, 20, 21, 22, 23, 24], [25, 9, 6, 3, 19, 12, 2, 16, 21, 5, 14, 8, 23]];
    wall.innerHTML = rows.map(function (r, i) {
      return '<div class="h-wrow" style="--dir:' + (i % 2 ? 1 : -1) * (1 - i * .15) + '">' + r.map(function (k, j) {
        var m = M[k], drag = i === 1 && j === 6, src = BALL(m[0]);
        return '<button type="button" class="card' + (drag ? ' drag' : '') + '" data-name="' + m[1] + '"><span class="nh" style="--h:' + FAM[m[2]][1] + '"><i></i>' + m[1] + '</span>' +
          '<span class="pv"><picture><source type="image/webp" srcset="' + src + '.webp"><img src="' + src + '.png" alt="' + m[1] + ' matball, ' + m[3] + '" width="494" height="560" loading="lazy" decoding="async"></picture></span>' +
          '<span class="ft">' + m[3] + ' · 2K<s></s></span>' + (drag ? CURSOR : '') + '</button>';
      }).join('') + '</div>';
    }).join('');
    wall.addEventListener('click', function (e) {
      var c = e.target.closest('.card'); if (!c) return;
      $$('.card.drag', wall).forEach(function (x) { x.classList.remove('drag'); var cur = $('.cur', x); if (cur) cur.remove(); });
      c.classList.add('drag'); c.insertAdjacentHTML('beforeend', CURSOR);
      toast(c.dataset.name + ' dropped in as a new layer');
    });
  }

  // ---------- graph editor showcase ----------
  var ge = $('#ge-canvas');
  if (ge) {
    renderGraph(ge, GE);
    $$('.ge-n').forEach(function (e) { e.textContent = GE.nodes.length; });
    var used = {};
    GE.nodes.forEach(function (n) { used[n.f] = (used[n.f] || 0) + 1; });
    $('.ge-fam').innerHTML = Object.keys(FAM).map(function (k) {
      return '<button type="button" data-f="' + k + '"' + (used[k] ? '' : ' class="none"') + ' style="--h:' + FAM[k][1] + '"><i></i>' + FAM[k][0] + '</button>';
    }).join('');
    $('.ge-sock').innerHTML = Object.keys(SOCK).map(function (k) { return '<span style="--c:' + SOCK[k][1] + '"><s></s>' + SOCK[k][0] + '</span>'; }).join('');
    $('.ge-fam').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var on = b.classList.toggle('on');
      $$('.ge-fam button').forEach(function (x) { if (x !== b) x.classList.remove('on'); });
      ge.classList.toggle('focus', on);
      $$('.n', ge).forEach(function (n) { n.classList.toggle('hit', on && n.dataset.fam === b.dataset.f); });
      if (on && !used[b.dataset.f]) toast(FAM[b.dataset.f][0] + ': not used in this graph, but in the library');
    });
  }
  var lg = $('#layer-graph');
  function showLayerGraph(key, animate) {
    var g = LAYER_GRAPHS[key]; if (!g || !lg) return;
    renderGraph(lg, g);
    $('#gp-title').textContent = g.title;
    layout();
    if (animate) { lg.classList.remove('is-on', 'is-live'); void lg.offsetWidth; lg.classList.add('is-on'); clearTimeout(lg._t); lg._t = setTimeout(function () { lg.classList.add('is-live'); }, 1300); }
  }

  // ---------- fixed-size canvases, scaled to their column ----------
  function fit() {
    $$('.h-scale').forEach(function (el) {
      var w = +el.dataset.w, h = +el.dataset.h, min = +(el.dataset.min || 0), c = el.querySelector('.h-canvas');
      var box = el.querySelector('.h-sizer');
      if (!box) { box = document.createElement('div'); box.className = 'h-sizer'; el.insertBefore(box, c); box.appendChild(c); }
      var s = clamp(el.clientWidth / w, min, 1);
      c.style.width = w + 'px'; c.style.height = h + 'px'; c.style.transform = 'scale(' + s + ')'; c._s = s;
      box.style.width = Math.round(w * s) + 'px'; box.style.height = Math.round(h * s) + 'px';
      el.classList.toggle('pan', w * s > el.clientWidth + 1);
    });
  }
  // Position inside an ancestor, ignoring transforms, so moving nodes never bend the wires.
  function pos(el, anc) { var x = 0, y = 0; while (el && el !== anc) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x: x, y: y }; }
  function centre(el, anc) { var p = pos(el, anc); return { x: p.x + el.offsetWidth / 2, y: p.y + el.offsetHeight / 2 }; }
  function bez(a, b) { var k = Math.max(40, Math.abs(b.x - a.x) * .5); return 'M' + a.x + ' ' + a.y + ' C' + (a.x + k) + ' ' + a.y + ' ' + (b.x - k) + ' ' + b.y + ' ' + b.x + ' ' + b.y; }
  function wire(canvas) {
    var svg = $('svg.wires', canvas); if (!svg) return;
    var w = canvas.offsetWidth, h = canvas.offsetHeight;
    svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    $$('path[data-w]', svg).forEach(function (p) {
      var ids = p.dataset.w.split(' '), a = document.getElementById(ids[0]), b = document.getElementById(ids[1]);
      if (!a || !b) return;
      var d = bez(centre(a, canvas), centre(b, canvas));
      p.setAttribute('d', d); p.setAttribute('pathLength', '1');
      p.style.setProperty('--c', a.style.getPropertyValue('--c'));
      if (!p._flow) { p._flow = p.cloneNode(); p._flow.removeAttribute('data-w'); p._flow.setAttribute('class', 'flow'); p._flow.style.animationDelay = (-Math.random() * 2.6).toFixed(2) + 's'; svg.appendChild(p._flow); }
      p._flow.setAttribute('d', d);
      a.classList.add('linked'); b.classList.add('linked');
    });
  }
  function licenseWire() {
    var copy = $('.h-hero-copy'), a = $('#lic-out'), b = $('#free-in'), svg = $('.h-lic-wire');
    if (!copy || !a || !b || !svg) return;
    var w = copy.offsetWidth, h = copy.offsetHeight, p = centre(a, copy), q = centre(b, copy);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var kx = Math.max(40, (q.x - p.x) * .9), ky = Math.max(30, (q.y - p.y) * .6);
    svg.firstElementChild.setAttribute('d', 'M' + p.x + ' ' + p.y + ' C' + (p.x + kx) + ' ' + p.y + ' ' + q.x + ' ' + (q.y - ky) + ' ' + q.x + ' ' + q.y);
  }
  function zoomWedge() {
    var scene = $('.h-ln-scene'), row = $('.h-lp .row.is-sel'), gp = $('#graph-panel'), svg = $('.h-zoom');
    if (!scene || !row || !gp || !svg || getComputedStyle(svg).display === 'none') return;
    var w = scene.offsetWidth, h = scene.offsetHeight, r = pos(row, scene), g = pos(gp, scene);
    var x1 = r.x + row.offsetWidth, y1 = r.y, y2 = r.y + row.offsetHeight, x2 = g.x, gy1 = g.y, gy2 = g.y + gp.offsetHeight;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.querySelector('polygon').setAttribute('points', x1 + ',' + y1 + ' ' + x2 + ',' + gy1 + ' ' + x2 + ',' + gy2 + ' ' + x1 + ',' + y2);
    svg.querySelector('path').setAttribute('d', 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + gy1 + ' M' + x1 + ' ' + y2 + ' L' + x2 + ' ' + gy2);
    svg.style.setProperty('--zx', x1 + 'px');
  }
  function layout() { fit(); $$('.h-canvas').forEach(wire); licenseWire(); zoomWedge(); }

  // ---------- interactions: drag nodes, scrub values ----------
  function canvasOf(el) { return el.closest('.h-canvas'); }
  document.addEventListener('pointerdown', function (e) {
    if (e.button > 0) return;
    var head = e.target.closest('.h-canvas .nh'), field = e.target.closest('.h-canvas .f, .f.scrub');
    if (head) {
      var node = head.parentNode, c = canvasOf(node), s = c._s || 1;
      var sx = e.clientX, sy = e.clientY, ox = node.offsetLeft, oy = node.offsetTop, moved = false;
      head.setPointerCapture(e.pointerId); node.classList.add('lift');
      var mv = function (ev) {
        var dx = (ev.clientX - sx) / s, dy = (ev.clientY - sy) / s;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 3) return; moved = true;
        node.style.left = clamp(ox + dx, -20, c.offsetWidth - node.offsetWidth + 20) + 'px';
        node.style.top = clamp(oy + dy, -10, c.offsetHeight - 40) + 'px';
        wire(c);
      };
      var up = function () { head.removeEventListener('pointermove', mv); head.removeEventListener('pointerup', up); head.removeEventListener('pointercancel', up); node.classList.remove('lift'); head._moved = moved; };
      head.addEventListener('pointermove', mv); head.addEventListener('pointerup', up); head.addEventListener('pointercancel', up);
      return;
    }
    if (field) scrub(field, e);
  });
  function scrub(f, e) {
    var span = $('span', f), bar = $('b', f);
    // The first touch works out the field's range from its starting value and keeps it on the element,
    // so a value dragged down to 0 can always be dragged back up.
    if (!f.dataset.max) {
      var txt = span.textContent.trim(), num = parseFloat(txt), fill0 = parseFloat(bar.style.width) / 100;
      if (!(num > 0) || !(fill0 > 0)) return; // labels like "Max" or "Overlay" stay put
      f.dataset.max = num / fill0; f.dataset.min = 0;
      f.dataset.dec = (txt.split('.')[1] || '').replace(/\D/g, '').length;
      f.dataset.unit = txt.replace(/^[-\d.]+/, '');
    }
    var dec = +f.dataset.dec || 0, unit = f.dataset.unit || '';
    var fill = (parseFloat(bar.style.width) || 0) / 100;
    var max = +f.dataset.max, min = +(f.dataset.min || 0);
    var r = f.getBoundingClientRect(), startX = e.clientX, startFill = fill, active = false;
    f.setPointerCapture(e.pointerId);
    var set = function (v) {
      v = clamp(v);
      bar.style.width = (v * 100).toFixed(1) + '%';
      var val = min + v * (max - min);
      span.textContent = val.toFixed(dec) + unit;
      if (f.dataset.var) { f.closest('[data-vars]').style.setProperty(f.dataset.var, v.toFixed(3)); f.dispatchEvent(new CustomEvent('scrub', { detail: v, bubbles: true })); }
    };
    var mv = function (ev) {
      var dx = ev.clientX - startX;
      if (!active && Math.abs(dx) < 4) return;
      active = true; f.classList.add('drag');
      set(startFill + dx / r.width);
    };
    var up = function (ev) {
      if (!active && ev.type === 'pointerup') set((ev.clientX - r.left) / r.width); // a tap jumps to that spot
      f.classList.remove('drag');
      f.removeEventListener('pointermove', mv); f.removeEventListener('pointerup', up); f.removeEventListener('pointercancel', up);
    };
    f.addEventListener('pointermove', mv); f.addEventListener('pointerup', up); f.addEventListener('pointercancel', up);
  }
  $$('.f.scrub').forEach(function (f) {
    var v = (+f.dataset.val - +(f.dataset.min || 0)) / (+f.dataset.max - +(f.dataset.min || 0));
    $('b', f).style.width = (v * 100) + '%';
    f.closest('[data-vars]').style.setProperty(f.dataset.var, v);
  });

  // ---------- hero: tap the material node to swap the ball ----------
  var MATS = [
    ['acg-metal007', 'Gold', 'ambientCG', 'linear-gradient(135deg,#f7d58a,#b9832b 45%,#5d3d10)', '1.00'],
    ['ph-velour-velvet', 'Velvet', 'Poly Haven', 'linear-gradient(135deg,#f07a95,#a3203f 50%,#4a0c1c)', '0.00'],
    ['ph-rusty-metal-02', 'Rusty metal', 'Poly Haven', 'linear-gradient(135deg,#d99a5b,#8a4a22 50%,#3a2414)', '0.65'],
    ['ph-denim-fabric', 'Denim', 'Poly Haven', 'linear-gradient(135deg,#8fb3de,#3d5f8f 50%,#1c2b44)', '0.00'],
    ['ph-mossy-rock', 'Mossy rock', 'Poly Haven', 'linear-gradient(135deg,#c9d36f,#6c7a3a 50%,#2f3420)', '0.00'],
    ['ph-aerial-rocks-02', 'Mossy rocks', 'Poly Haven', 'linear-gradient(135deg,#b9b07a,#6f6a45 50%,#2f2c1e)', '0.00']
  ];
  var mat = $('#hero-mat'), heroBall = $('.h-hero-ball'), mi = 0;
  function swap() {
    mi = (mi + 1) % MATS.length;
    var m = MATS[mi], src = BALL(m[0], 'lg'), pre = new Image();
    pre.onload = function () {
      heroBall.classList.add('out');
      setTimeout(function () {
        $('source', heroBall).srcset = src + '.webp'; $('img', heroBall).src = src + '.png';
        window.dispatchEvent(new Event('hero-base-swap'));
        $('img', heroBall).alt = m[1] + ' matball rendered in Surface3D with a ' + m[2] + ' material';
        $('.t', mat).textContent = m[1] + ' · ' + m[2];
        $('.sw', mat).style.backgroundImage = m[3];
        $('#hero-metal').textContent = m[4];
        heroBall.classList.remove('out');
      }, 260);
    };
    pre.src = src + '.webp';
    // warm the next one
    var nx = new Image(); nx.src = BALL(MATS[(mi + 1) % MATS.length][0], 'lg') + '.webp';
  }
  if (mat && heroBall) {
    mat.addEventListener('click', function (e) { var h = e.target.closest('.nh'); if (h && h._moved) { h._moved = false; return; } swap(); });
    mat.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); swap(); } });
  }

  // Runs fn every frame while el is on screen and the tab is visible.
  function loopWhileVisible(el, fn) {
    var on = false, raf = 0, prev = 0;
    // k = frames' worth of time since the last call at 60 fps, so speed is the same on any refresh rate
    var tick = function (t) { raf = 0; if (!on || document.hidden) { prev = 0; return; } fn(t, prev ? clamp((t - prev) / 16.7, .2, 3) : 1); prev = t; raf = requestAnimationFrame(tick); };
    var go = function () { if (on && !raf) raf = requestAnimationFrame(tick); };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { on = es[0].isIntersecting; go(); }).observe(el); else { on = true; go(); }
    document.addEventListener('visibilitychange', go);
  }
  function hexRGB(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16); }); }
  // Soft watercolour dabs with a speckled grain, one set per colour.
  var stampCache = {};
  function stamps(hex) {
    if (stampCache[hex]) return stampCache[hex];
    var out = [], rgb = hexRGB(hex).join(','), size = 64;
    for (var i = 0; i < 4; i++) {
      var s = document.createElement('canvas'); s.width = s.height = size;
      var x = s.getContext('2d'), m = size / 2, g = x.createRadialGradient(m, m, 1, m, m, m);
      g.addColorStop(0, 'rgba(' + rgb + ',.34)'); g.addColorStop(.62, 'rgba(' + rgb + ',.2)'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g; x.fillRect(0, 0, size, size);
      x.globalCompositeOperation = 'destination-out';
      for (var n = 0; n < 26; n++) { x.fillStyle = 'rgba(0,0,0,' + (.05 + Math.random() * .22) + ')'; x.beginPath(); x.arc(Math.random() * size, Math.random() * size, .5 + Math.random() * 3, 0, 7); x.fill(); }
      out.push(s);
    }
    return (stampCache[hex] = out);
  }
  function fade(x, w, h, a) { x.globalCompositeOperation = 'destination-out'; x.fillStyle = 'rgba(0,0,0,' + a + ')'; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'source-over'; }

  // ---------- hero: a paint layer on the ball. The brush paints another material over the base, like a layer
  // in the app. It starts on clean gold and picks a random material for each coat; press and drag to paint. ----------
  var paintC = $('.h-paint'), brushRing = $('.h-brush'), palette = $('.h-palette');
  if (paintC && heroBall) (function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), ctx = paintC.getContext('2d'), W = 0, H = 0, R = 0;
    var btns = $$('button', palette), mats = btns.map(function (b) {
      var img = new Image(); img.src = BALL(b.dataset.mat, b.dataset.size || 'lg') + '.webp'; if (img.decode) img.decode().catch(function () {}); return img; // decoded up front so a new coat never stalls a frame
    });
    var mi = -1, user = false, userUntil = 0, last = null, k = 0, autoPrev = null, coatAt = 0, dirty = false, painted = 0;
    function canvas() { var c = document.createElement('canvas'); c.width = paintC.width; c.height = paintC.height; return [c, c.getContext('2d')]; }
    function size() { W = paintC.offsetWidth; H = paintC.offsetHeight; paintC.width = Math.round(W * dpr); paintC.height = Math.round(H * dpr); R = W * .1; }
    size();
    var maskC = canvas(), layerC = canvas(), doneC = canvas(); // brush strokes · this coat's material · earlier coats
    var mask = maskC[1], layer = layerC[1], done = doneC[1];
    [mask, layer, done].forEach(function (x) { x.setTransform(dpr, 0, 0, dpr, 0, 0); });
    // white brush dabs with a soft edge and a little grain; they only shape the mask
    var dabs = [];
    for (var i = 0; i < 4; i++) {
      var s = document.createElement('canvas'), sz = 64; s.width = s.height = sz;
      var x = s.getContext('2d'), g = x.createRadialGradient(32, 32, 2, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.55, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, sz, sz); x.globalCompositeOperation = 'destination-out';
      for (var n = 0; n < 30; n++) { x.fillStyle = 'rgba(0,0,0,' + (.08 + Math.random() * .3) + ')'; x.beginPath(); x.arc(Math.random() * sz, Math.random() * sz, .5 + Math.random() * 3, 0, 7); x.fill(); }
      dabs.push(s);
    }
    function dab(px, py) { mask.drawImage(dabs[k++ % 4], px - R, py - R, R * 2, R * 2); dirty = true; painted++; }
    function line(a, b) { var d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.max(1, Math.ceil(d / (R * .2))); for (var i = 1; i <= n; i++) dab(a.x + (b.x - a.x) * i / n, a.y + (b.y - a.y) * i / n); }
    function ring(p) { brushRing.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px)'; }
    function local(e) { var r = paintC.getBoundingClientRect(); return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H }; }
    // the finished coat becomes part of the ball; then a new layer starts
    function commit() { if (painted) { done.drawImage(layerC[0], 0, 0, W, H); } mask.clearRect(0, 0, W, H); painted = 0; dirty = true; }
    function pick(i) {
      if (i === mi) return; commit(); mi = i;
      btns.forEach(function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', String(j === i)); });
      $('.pal-name', palette).textContent = btns[i].title;
    }
    function randomPick() { var i; do { i = Math.floor(Math.random() * mats.length); } while (i === mi && mats.length > 1); pick(i); }
    function compose() {
      var img = mats[mi]; if (!img || !img.complete) return;
      layer.globalCompositeOperation = 'copy'; layer.drawImage(maskC[0], 0, 0, W, H);
      layer.globalCompositeOperation = 'source-in'; layer.drawImage(img, 0, 0, W, H);
      layer.globalCompositeOperation = 'source-over';
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, paintC.width, paintC.height);
      ctx.drawImage(doneC[0], 0, 0); ctx.drawImage(layerC[0], 0, 0);
      dirty = false;
    }
    // a wandering path over the sphere part of the matball
    function autoAt(t) {
      var s = t / 1000, cx = W * .5, cy = H * .4, rr = W * .4;
      return { x: cx + rr * (.86 * Math.sin(s * 1.15) + .1 * Math.sin(s * 3.1)), y: cy + rr * (.78 * Math.sin(s * .71 + 1.2) + .08 * Math.cos(s * 2.3)) };
    }
    randomPick();
    loopWhileVisible(heroBall, function (t, kk) {
      // old coats slowly wear back to the base material, so the gold always comes back
      done.globalCompositeOperation = 'destination-out'; done.fillStyle = 'rgba(0,0,0,' + (.004 * kk) + ')'; done.fillRect(0, 0, W, H); done.globalCompositeOperation = 'source-over';
      dirty = true;
      if (!(user || performance.now() < userUntil || reduce)) {
        if (!coatAt) coatAt = t + 1200; // a moment of clean gold first
        if (t > coatAt) {
          if (t - coatAt > 6500) { coatAt = t; autoPrev = null; randomPick(); }
          var p = autoAt(t); if (autoPrev) line(autoPrev, p); autoPrev = p; ring(p);
          heroBall.classList.add('painting');
        }
      } else autoPrev = null;
      if (dirty) compose();
    });
    paintC.addEventListener('pointerdown', function (e) {
      e.preventDefault(); e.stopPropagation(); paintC.setPointerCapture(e.pointerId);
      user = true; last = local(e); dab(last.x, last.y); ring(last); heroBall.classList.add('painting');
    });
    paintC.addEventListener('pointermove', function (e) { var p = local(e); ring(p); if (user) { line(last, p); last = p; } });
    var stop = function () { if (!user) return; user = false; userUntil = performance.now() + 4000; coatAt = performance.now(); };
    paintC.addEventListener('pointerup', stop); paintC.addEventListener('pointercancel', stop);
    palette.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; pick(btns.indexOf(b)); userUntil = performance.now() + 6000; coatAt = performance.now(); });
    // swapping the base material starts the ball clean again
    window.addEventListener('hero-base-swap', function () { done.clearRect(0, 0, W, H); mask.clearRect(0, 0, W, H); painted = 0; dirty = true; coatAt = 0; });
  })();

  // ---------- particle brush tile: a small simulation that paints where the particles land ----------
  var ptC = $('.pt-canvas');
  if (ptC) (function () {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), ctx = ptC.getContext('2d'), W = 0, H = 0, trail, settle, tx, sx;
    var P = [], pointer = null, colour = ['#ef7e44', '#5fead8', '#e9b34c'], cIdx = 0;
    function layer() { var c = document.createElement('canvas'); c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); var x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return [c, x]; }
    function size() {
      W = ptC.offsetWidth; H = ptC.offsetHeight; if (!W || !H) return;
      ptC.width = Math.round(W * dpr); ptC.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var a = layer(), b = layer(); trail = a[0]; tx = a[1]; settle = b[0]; sx = b[1];
    }
    size(); addEventListener('resize', size);
    function emit(x, y, n, spread, col) {
      for (var i = 0; i < n; i++) P.push({ x: x, y: y, px: x, py: y, vx: (Math.random() - .5) * spread, vy: (Math.random() - .3) * spread * .5, life: 1, c: col });
    }
    function local(e) { var r = ptC.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    ptC.addEventListener('pointerdown', function (e) { e.preventDefault(); ptC.setPointerCapture(e.pointerId); pointer = local(e); cIdx = (cIdx + 1) % colour.length; });
    ptC.addEventListener('pointermove', function (e) { if (pointer) pointer = local(e); });
    ptC.addEventListener('pointerup', function () { pointer = null; }); ptC.addEventListener('pointercancel', function () { pointer = null; });
    var acc = 0;
    loopWhileVisible(ptC, function (t, k) {
      if (!ptC.parentNode.classList.contains('on')) return;
      if (W !== ptC.offsetWidth || H !== ptC.offsetHeight) size();
      if (!W) return;
      var b = { x: W * .5, y: H * .64, r: Math.min(W, H) * .3 };
      acc += k; var n = Math.floor(acc); acc -= n;
      if (pointer) emit(pointer.x, pointer.y, 6 * n, 5, colour[cIdx]);
      else if (!reduce) emit(W * .5 + Math.sin(t / 1100) * W * .3, 14, 2 * n, 4, colour[Math.floor(t / 4000) % colour.length]);
      fade(tx, W, H, Math.min(.6, .26 * k)); fade(sx, W, H, .0035 * k);
      tx.lineWidth = 2; tx.lineCap = 'round';
      for (var i = P.length - 1; i >= 0; i--) {
        var q = P[i]; q.px = q.x; q.py = q.y; q.vy += .16 * k; q.x += q.vx * k; q.y += q.vy * k; q.life -= .006 * k;
        var dx = q.x - b.x, dy = q.y - b.y, d = Math.hypot(dx, dy);
        if (d < b.r) { // landed on the ball: leave paint there
          var lx = b.x + dx / d * b.r, ly = b.y + dy / d * b.r;
          sx.drawImage(stamps(q.c)[i % 4], lx - 9, ly - 9, 18, 18); P.splice(i, 1); continue;
        }
        if (q.y > H + 10 || q.x < -10 || q.x > W + 10 || q.life <= 0) { P.splice(i, 1); continue; }
        tx.strokeStyle = q.c; tx.beginPath(); tx.moveTo(q.px, q.py); tx.lineTo(q.x, q.y); tx.stroke();
      }
      if (P.length > 900) P.splice(0, P.length - 900);
      ctx.clearRect(0, 0, W, H);
      var g = ctx.createRadialGradient(b.x - b.r * .35, b.y - b.r * .4, b.r * .1, b.x, b.y, b.r);
      g.addColorStop(0, '#5a616b'); g.addColorStop(.7, '#2b3037'); g.addColorStop(1, '#16191d');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(b.x, b.y, b.r + 2, 0, 7); ctx.clip(); ctx.drawImage(settle, 0, 0, W, H); ctx.restore();
      ctx.drawImage(trail, 0, 0, W, H);
    });
  })();

  // ---------- toolbox tiles ----------
  var sp = $('.sp-svg');
  if (sp) {
    var pts = $$('.sp-pt', sp);
    var draw = function () {
      var P = pts.map(function (c) { return [+c.getAttribute('cx'), +c.getAttribute('cy')]; });
      var d = 'M' + P[0] + ' C' + P[1] + ' ' + P[2] + ' ' + P[3];
      $('.sp-groove', sp).setAttribute('d', d); $('.sp-stitch', sp).setAttribute('d', d);
      $('.sp-handle', sp).setAttribute('d', 'M' + P[0] + ' L' + P[1] + ' M' + P[3] + ' L' + P[2]);
    };
    draw();
    pts.forEach(function (c) {
      c.addEventListener('pointerdown', function (e) {
        e.preventDefault(); c.setPointerCapture(e.pointerId); c.classList.add('drag');
        var mv = function (ev) {
          var m = sp.getScreenCTM().inverse(), pt = sp.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; pt = pt.matrixTransform(m);
          c.setAttribute('cx', clamp(pt.x, 10, 350).toFixed(1)); c.setAttribute('cy', clamp(pt.y, 10, 210).toFixed(1)); draw();
        };
        var up = function () { c.classList.remove('drag'); c.removeEventListener('pointermove', mv); c.removeEventListener('pointerup', up); c.removeEventListener('pointercancel', up); };
        c.addEventListener('pointermove', mv); c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
      });
    });
  }
  // ---------- bevels + edge damage: a painted box redrawn from the two sliders ----------
  var bvBox = $('.bv-box');
  var bevel = .6, edmg = .55;
  // corners of an isometric box (viewBox 400 x 320)
  var T = [200, 52], Rt = [330, 118], F = [200, 184], L = [70, 118], Rb = [330, 222], Fb = [200, 288], Lb = [70, 222];
  var lerp = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
  var pt = function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); };
  // A closed outline with every corner rounded by r (in px along each edge).
  function rounded(pts, r) {
    var d = '';
    pts.forEach(function (p, i) {
      var a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length];
      var la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
      var p1 = lerp(p, a, Math.min(.45, r / la)), p2 = lerp(p, b, Math.min(.45, r / lb));
      d += (i ? ' L' : 'M') + pt(p1) + ' Q' + pt(p) + ' ' + pt(p2);
    });
    return d + ' Z';
  }
  // Chips sit along the three edges that face the viewer, each with its own threshold and shape.
  var CHIPS = [];
  (function () {
    var seed = 7, rnd = function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    [[L, F], [F, Rt], [F, Fb], [T, L], [T, Rt]].forEach(function (e, k) {
      var n = k < 3 ? 16 : 7;
      for (var i = 0; i < n; i++) {
        var pts = [], m = 5 + Math.floor(rnd() * 3), s = .5 + rnd() * .9;
        for (var j = 0; j < m; j++) { var a = j / m * Math.PI * 2, rr = .55 + rnd() * .6; pts.push([Math.cos(a) * rr, Math.sin(a) * rr * .7]); }
        CHIPS.push({ e: e, u: .06 + rnd() * .88, t: rnd(), s: s, pts: pts, off: (rnd() - .5) * 6 });
      }
    });
  })();
  function shrink(pts, d) { // move every corner toward the centre by d px
    var c = pts.reduce(function (s, p) { return [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length]; }, [0, 0]);
    return pts.map(function (p) { var l = Math.hypot(p[0] - c[0], p[1] - c[1]); return lerp(p, c, Math.min(.4, d / l)); });
  }
  function drawBevel() {
    if (!bvBox) return;
    var r = bevel * 18, h = '';
    var top = [T, Rt, F, L], left = [L, F, Fb, Lb], right = [F, Rt, Rb, Fb];
    // side faces, with their top edge pushed down by the bevel
    h += '<path d="' + rounded(left, r * .35) + '" fill="url(#bvL)"/>';
    h += '<path d="' + rounded(right, r * .35) + '" fill="url(#bvR)"/>';
    if (r > .5) {
      // the chamfer: the outer top outline in a light, soft tone, then the flat top face inset inside it
      h += '<path d="' + rounded(top, r * 1.2) + '" fill="url(#bvBand)"/>';
      h += '<path d="M' + pt(lerp(L, F, .06)) + ' L' + pt(F) + ' L' + pt(lerp(F, Rt, .94)) + '" fill="none" stroke="#e4f0fa" stroke-opacity=".55" stroke-width="1.2" stroke-linejoin="round" filter="url(#bvSoft)" transform="translate(0 -' + (r * .25).toFixed(1) + ')"/>';
      h += '<path d="' + rounded(shrink(top, r * .85), r * .8) + '" fill="url(#bvTop)" filter="url(#bvSoft)"/>';
      // the vertical front edge rounds over too: a narrow lit strip
      var w = r * .55;
      h += '<path d="M' + pt([F[0] - w, F[1] + r * .4]) + ' L' + pt([F[0] + w, F[1] + r * .4]) + ' L' + pt([Fb[0] + w, Fb[1] - r * .4]) + ' L' + pt([Fb[0] - w, Fb[1] - r * .4]) + 'Z" fill="url(#bvEdge)" filter="url(#bvSoft)"/>';
    } else {
      h += '<path d="' + rounded(top, 0) + '" fill="url(#bvTop)"/>';
      h += '<path d="M' + pt(L) + ' L' + pt(F) + ' L' + pt(Rt) + ' M' + pt(F) + ' L' + pt(Fb) + '" fill="none" stroke="#0b1a2a" stroke-width="1.2"/>';
    }
    // edge damage: flakes of paint gone along the edges, bare metal underneath
    CHIPS.forEach(function (c) {
      if (c.t > edmg) return;
      var p = lerp(c.e[0], c.e[1], c.u), ang = Math.atan2(c.e[1][1] - c.e[0][1], c.e[1][0] - c.e[0][0]);
      var sz = (2.2 + 6.5 * edmg) * c.s, ca = Math.cos(ang), sa = Math.sin(ang);
      var d = c.pts.map(function (q, i) {
        var x = q[0] * sz * 1.7, y = q[1] * sz * .8 + c.off * .5; // stretched along the edge
        return (i ? 'L' : 'M') + (p[0] + x * ca - y * sa).toFixed(1) + ' ' + (p[1] + x * sa + y * ca).toFixed(1);
      }).join(' ') + 'Z';
      h += '<path d="' + d + '" fill="#9aa3ab" stroke="#0c1825" stroke-width=".9" stroke-opacity=".8"/>';
      h += '<path d="' + d + '" fill="none" stroke="#e6ecf0" stroke-width=".7" stroke-opacity=".55" transform="translate(-.6 -.6)"/>';
    });
    bvBox.innerHTML = h;
  }
  document.addEventListener('scrub', function (e) {
    if (e.target.dataset.var === '--bev') { bevel = e.detail; drawBevel(); }
    if (e.target.dataset.var === '--edmg') { edmg = e.detail; drawBevel(); }
  });
  drawBevel();

  var bk = $('.st.t-bake');
  function bake() {
    if (!bk || bk.classList.contains('run')) return;
    bk.classList.remove('done'); void bk.offsetWidth; bk.classList.add('run');
    setTimeout(function () { bk.classList.remove('run'); bk.classList.add('done'); }, reduce ? 0 : 2600);
  }
  if (bk) $('.bk-go').addEventListener('click', bake);
  var uv = $('.st.t-uv'), uvGo = $('.uv-go');
  function pack(on) { uv.classList.toggle('packed', on); uvGo.textContent = on ? 'Scatter again' : 'Pack islands'; }
  if (uv) uvGo.addEventListener('click', function () { pack(!uv.classList.contains('packed')); });
  var rd = $('.rd-stage');
  if (rd) {
    var light = function (e) {
      var r = rd.getBoundingClientRect(), x = clamp((e.clientX - r.left) / r.width), y = clamp((e.clientY - r.top) / r.height);
      rd.style.setProperty('--lx', (x * 100).toFixed(1) + '%'); rd.style.setProperty('--ly', (y * 100).toFixed(1) + '%');
    };
    rd.addEventListener('pointermove', light); rd.addEventListener('pointerdown', light);
  }

  // ---------- tool window: pick a tool; it also walks through them by itself until you touch it ----------
  var app = $('.h-app'), toolBtns = $$('.h-rail .tool'), CYCLE = 5200, toolTimer = null, toolUser = false, toolIdx = 0;
  function tool(i) {
    toolIdx = i; var k = toolBtns[i].dataset.tool;
    toolBtns.forEach(function (b, j) { b.classList.toggle('on', j === i); b.setAttribute('aria-selected', String(j === i)); b.classList.remove('timed'); });
    $$('.st, .pp', app).forEach(function (el) { el.classList.toggle('on', el.dataset.tool === k); });
    $('.app-n', app).textContent = i + 1;
    if (!toolUser && !reduce) { void toolBtns[i].offsetWidth; toolBtns[i].classList.add('timed'); }
    if (k === 'bake') setTimeout(bake, 300);
    if (k === 'uv') { pack(false); setTimeout(function () { pack(true); }, 700); }
    var rail = toolBtns[i].parentNode; if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left: toolBtns[i].offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }
  function stopCycle() { toolUser = true; clearInterval(toolTimer); toolBtns.forEach(function (b) { b.classList.remove('timed'); }); }
  if (app) {
    app.style.setProperty('--cycle', CYCLE + 'ms');
    toolBtns.forEach(function (b, i) { b.addEventListener('click', function () { stopCycle(); tool(i); }); });
    // touching anything inside the viewport or properties also ends the tour
    $$('.h-stage, .h-props', app).forEach(function (el) { el.addEventListener('pointerdown', stopCycle); });
  }
  function startCycle() {
    if (toolUser || reduce || toolTimer) return;
    tool(toolIdx);
    toolTimer = setInterval(function () { if (!document.hidden) tool((toolIdx + 1) % toolBtns.length); }, CYCLE);
  }

  // ---------- workspace tabs ----------
  var CAPS = { paint: 'Paint in layers: fills, paint, masks and effects, at 2K and 4K.', graph: 'Open a graph under the viewport. The result lands back in your layer.',
    weather: 'Weathering learns where wear belongs, then fills the whole model.', bake: 'High to low in one click. Maps show up on the model as they finish.',
    uv: 'Inspect islands, unwrap and pack, next to a checkered preview.', render: 'Studio light, HDRI and turntable before you export.' };
  var win = $('.h-win'), tabs = $$('.h-tabs [data-tab]'), wsTimer = null, wsUser = false;
  function tab(k) {
    tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.tab === k)); });
    $$('[data-shot]', win).forEach(function (p) { p.classList.toggle('on', p.dataset.shot === k); });
    $('.h-win-cap', win).textContent = CAPS[k];
  }
  tabs.forEach(function (b) { b.addEventListener('click', function () { wsUser = true; clearInterval(wsTimer); tab(b.dataset.tab); }); });

  // ---------- layer rows ----------
  var scene = $('.h-ln-scene'), userOpened = false;
  $$('.h-lp .row[data-g]').forEach(function (row) {
    var pick = function () {
      $$('.h-lp .row').forEach(function (r) { r.classList.toggle('is-sel', r === row); });
      userOpened = true;
      if (+scene.dataset.step < 2) scene.dataset.step = 3;
      showLayerGraph(row.dataset.g, true);
    };
    row.addEventListener('click', pick);
    row.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });

  // ---------- reveal ----------
  $$('.h-steps li').forEach(function (li) { li.appendChild(document.createElement('i')); });
  var heroGraph = $('#hero-graph'), heroCopy = $('.h-hero-copy');
  function goLive(c) { c.classList.add('is-on'); setTimeout(function () { c.classList.add('is-live'); }, 2000); }
  var io = null;
  if (reduce || !('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach(function (e) { e.classList.add('in'); });
    $$('.h-canvas').forEach(function (c) { c.classList.add('is-on'); });
    if (heroCopy) heroCopy.classList.add('is-on');
    $$('.h-lp').forEach(function (e) { e.classList.add('is-in'); });
    if (bk) bk.classList.add('done');
    if (uv) pack(true);
  } else {
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var t = e.target; t.classList.add('in'); io.unobserve(t);
        if (t.classList.contains('h-ge')) goLive(ge);
        if (t.classList.contains('h-app')) startCycle();
        if (t.classList.contains('h-win') && !wsUser) {
          var order = tabs.map(function (b) { return b.dataset.tab; }), i = 0;
          wsTimer = setInterval(function () { if (document.hidden) return; i = (i + 1) % order.length; tab(order[i]); }, 4200);
        }
      });
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach(function (e) { io.observe(e); });
  }

  // ---------- scroll ----------
  var layers = $('.h-layers'), steps = $$('.h-steps li'), lp = $('.h-lp');
  var lib = $('.h-lib'), band = $('.h-band'), bar = $('.h-progress');
  var lastStep = -1, ticking = false, parEls = $$('[data-par]');
  // How far a section has travelled up through the screen, 0..1. Nothing is pinned, so scrolling never stalls.
  function sectionP(el) {
    var r = el.getBoundingClientRect();
    return clamp((innerHeight * .8 - r.top) / Math.max(1, r.height * .75));
  }
  function frame() {
    ticking = false;
    var vh = innerHeight, doc = root.scrollHeight - vh;
    if (bar) bar.style.setProperty('--sp', doc > 0 ? (scrollY / doc).toFixed(4) : 0);
    if (layers && !reduce) {
      var p = sectionP(layers), r = layers.getBoundingClientRect();
      if (r.top < vh * .8) lp.classList.add('is-in');
      var st = p < .06 ? 0 : p < .18 ? 1 : p < .36 ? 2 : 3;
      if (userOpened) st = Math.max(st, 2);
      if (st !== lastStep) {
        lastStep = st; scene.dataset.step = st;
        if (st >= 2) { if (!lg.classList.contains('is-on')) { lg.classList.add('is-on'); clearTimeout(lg._t); lg._t = setTimeout(function () { lg.classList.add('is-live'); }, 1400); } }
        else { lg.classList.remove('is-on', 'is-live'); clearTimeout(lg._t); }
        zoomWedge();
      }
      steps.forEach(function (li) { li.classList.toggle('on', p >= +li.dataset.at); });
    }
    if (!reduce) {
      [lib, band].forEach(function (s) {
        if (!s) return; var lr = s.getBoundingClientRect();
        if (lr.bottom > 0 && lr.top < vh) s.style.setProperty('--p', clamp((vh - lr.top) / (lr.height + vh)).toFixed(4));
      });
      parEls.forEach(function (el) {
        var r = el.parentNode.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - vh / 2) * +el.dataset.par).toFixed(1) + 'px,0)';
      });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  if (reduce && scene) { scene.dataset.step = 3; steps.forEach(function (li) { li.classList.add('on'); }); if (lp) lp.classList.add('is-in'); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { layout(); onScroll(); });

  // ---------- YouTube: load the player only when asked ----------
  $$('[data-yt-go]').forEach(function (b) { b.addEventListener('click', function () { var p = $('[data-yt]'); if (p) { p.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); p.click(); } }); });
  $$('[data-yt]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.yt + '?autoplay=1&rel=0';
      f.title = 'Surface3D demo video';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      b.replaceWith(f);
    });
  });

  // ---------- start ----------
  showLayerGraph('moss', false);
  layout(); frame();
  var start = function () {
    layout(); frame();
    if (!reduce) requestAnimationFrame(function () { if (heroGraph) goLive(heroGraph); if (heroCopy) heroCopy.classList.add('is-on'); });
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
  if ('ResizeObserver' in window) { var ro = new ResizeObserver(function () { layout(); }); $$('.h-scale, .h-hero-copy, .h-ln-scene').forEach(function (e) { ro.observe(e); }); }
})();
