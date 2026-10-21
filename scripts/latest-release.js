// Points every download button at the newest Windows ZIP on GitHub and shows its version.
// Without network access the buttons keep https://github.com/moaref1/Surface3D/releases/latest.
(function () {
  var API = 'https://api.github.com/repos/moaref1/Surface3D/releases?per_page=15';
  var latest = null;

  function load() {
    try { var c = sessionStorage.getItem('s3d-latest'); if (c) return Promise.resolve(JSON.parse(c)); } catch (e) {}
    return fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .then(function (list) {
        for (var i = 0; i < list.length; i++) {
          var r = list[i]; if (r.draft || r.prerelease) continue;
          var zip = (r.assets || []).filter(function (a) { return /Windows-x64\.zip$/i.test(a.name); })[0];
          if (zip) {
            var info = { version: r.tag_name.replace(/^v/, ''), url: zip.browser_download_url, size: zip.size };
            try { sessionStorage.setItem('s3d-latest', JSON.stringify(info)); } catch (e) {}
            return info;
          }
        }
        return null;
      });
  }

  function apply() {
    if (!latest) return;
    document.querySelectorAll('a[data-link="build"]').forEach(function (a) {
      if (a.href !== latest.url) a.href = latest.url;
    });
    document.querySelectorAll('.release-label').forEach(function (el) {
      var t = 'SURFACE3D ' + latest.version;
      if (el.textContent !== t) el.textContent = t;
    });
    document.querySelectorAll('.download-card p').forEach(function (el) {
      if (/ZIP download/.test(el.textContent)) el.textContent = 'Windows 64-bit · ZIP · ' + Math.round(latest.size / 1048576) + ' MB';
    });
    // Only touch the DOM when something differs, so the observer below settles.
  }

  load().then(function (info) {
    latest = info; apply();
    // site.js may set the link again after loading content.json; keep ours.
    new MutationObserver(apply).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['href'] });
  }).catch(function () {});
})();
