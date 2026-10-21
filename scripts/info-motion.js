// Info page motion: staggered reveal, card spotlight, count-up stats, hero parallax.
(function () {
  if (document.body.dataset.page !== 'about') return;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ghost numbers ("01", "02"...) taken from each card's eyebrow
  document.querySelectorAll('.info-bento > .info-card').forEach(function (card) {
    var e = card.querySelector('.eyebrow'), m = e && e.textContent.match(/^\s*(\d{2})\s*\//);
    if (m) card.setAttribute('data-num', m[1]);
  });

  // Staggered reveal
  var targets = [].slice.call(document.querySelectorAll('.info-hero-text > *, .info-shot, .info-stats li, .info-bento > .info-card'));
  targets.forEach(function (el, i) {
    el.classList.add('info-reveal');
    el.style.setProperty('--d', (el.closest('.info-hero') ? i * 0.08 : (i % 4) * 0.08) + 's');
  });
  if (reduced || !('IntersectionObserver' in window)) targets.forEach(function (el) { el.classList.add('in'); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // Spotlight follows the cursor inside each card
  document.querySelectorAll('.info-bento > .info-card').forEach(function (card) {
    card.addEventListener('pointermove', function (ev) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    });
  });

  // Count-up for numeric stats
  function count(el) {
    var end = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / 1200), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
      el.textContent = v + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll('.info-stats [data-count]');
  if (!reduced && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } });
    }, { threshold: .6 });
    nums.forEach(function (n) { cio.observe(n); });
  }

  // Gentle parallax on the hero screenshot
  var shot = document.querySelector('.info-shot');
  if (shot && !reduced && matchMedia('(min-width: 961px)').matches) {
    window.addEventListener('scroll', function () {
      var y = Math.min(window.scrollY, 600);
      shot.style.transform = 'translateY(' + (y * 0.08) + 'px)';
    }, { passive: true });
  }
})();
