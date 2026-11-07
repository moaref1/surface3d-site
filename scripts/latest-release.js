// Points every download button at the newest release assets on GitHub and shows their version.
// Without network access the buttons keep https://github.com/moaref1/Surface3D/releases/latest.
(function () {
  var API = 'https://api.github.com/repos/moaref1/Surface3D/releases?per_page=15';
  var KEY = 's3d-latest-2';
  var latest = null;
  var isLinux = /Linux|X11/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);

  function asset(r, re) {
    var a = (r.assets || []).filter(function (x) { return re.test(x.name); })[0];
    return a ? { version: r.tag_name.replace(/^v/, ''), url: a.browser_download_url, size: a.size } : null;
  }

  function load() {
    try { var c = sessionStorage.getItem(KEY); if (c) return Promise.resolve(JSON.parse(c)); } catch (e) {}
    return fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .then(function (list) {
        var info = { windows: null, linux: null };
        list.forEach(function (r) {
          if (r.draft || r.prerelease) return;
          info.windows = info.windows || asset(r, /Windows-x64\.zip$/i);
          info.linux = info.linux || asset(r, /\.AppImage$/i);
        });
        try { sessionStorage.setItem(KEY, JSON.stringify(info)); } catch (e) {}
        return info;
      });
  }

  function setHref(selector, item) {
    if (!item) return;
    document.querySelectorAll(selector).forEach(function (a) { if (a.href !== item.url) a.href = item.url; });
  }

  function card(os, item, kind) {
    var el = document.querySelector('.download-card[data-os="' + os + '"]');
    if (!el || !item) return;
    var label = el.querySelector('.release-label'), t = 'SURFACE3D ' + item.version;
    if (label.textContent !== t) label.textContent = t;
    var p = el.querySelector('.release-label ~ p');
    var size = kind + ' · ' + Math.round(item.size / 1048576) + ' MB';
    if (p && p.textContent !== size) p.textContent = size;
  }

  function apply() {
    if (!latest) return;
    setHref('a[data-link="build"]:not(.download-card a)', isLinux && latest.linux ? latest.linux : latest.windows);
    setHref('.download-card a[data-link="build"]', latest.windows);
    setHref('a[data-link="linux"]', latest.linux);
    card('windows', latest.windows, 'ZIP');
    card('linux', latest.linux, 'AppImage');
    // Only touch the DOM when something differs, so the observer below settles.
  }

  // Linux visitors see their download first, even before the release list arrives.
  if (isLinux) {
    document.querySelectorAll('[data-os-label]').forEach(function (el) { el.textContent = 'Download'; });
    var mine = document.querySelector('.download-card[data-os="linux"]');
    if (mine) { mine.classList.add('is-mine'); mine.parentNode.insertBefore(mine, document.querySelector('.download-card[data-os="windows"]')); }
  }

  load().then(function (info) {
    latest = info; apply();
    // site.js may set the link again after loading content.json; keep ours.
    new MutationObserver(apply).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
  }).catch(function () {});
})();
