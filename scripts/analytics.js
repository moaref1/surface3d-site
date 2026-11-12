// Visit and click counting with GoatCounter (no cookies, so no consent banner is needed).
// Set CODE to the GoatCounter site code, e.g. 'surface3d' for https://surface3d.goatcounter.com. Empty = off.
(function () {
  var CODE = '';
  if (!CODE) return;
  var s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + CODE + '.goatcounter.com/count');
  document.head.appendChild(s);

  // Clicks that matter, tagged with where the visitor landed: 'reddit' on reddit.html, 'site' elsewhere.
  var source = document.body.dataset.source || 'site';
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a, button');
    if (!a || !window.goatcounter || !window.goatcounter.count) return;
    var href = a.getAttribute('href') || '', kind = a.dataset.link || '';
    if (a.matches('[data-yt], [data-yt-go]')) kind = 'video';
    else if (/^mailto:/.test(href)) kind = 'email';
    else if (/discord\.gg/.test(href)) kind = 'discord';
    else if (/github\.com\/.+\/releases/.test(href)) kind = 'download';
    if (!kind) return;
    window.goatcounter.count({ path: kind + '-' + source, title: kind + ' (' + source + ')', event: true });
  });
})();
