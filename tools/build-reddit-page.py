# Makes reddit.html, the landing page for Reddit ads, from index.html.
# Edit index.html, then run:  python tools/build-reddit-page.py
# The copy is the same page; it is hidden from search engines (so only ad clicks land on it) and points
# search engines at the main page, so visits to it can be counted as Reddit traffic.
from pathlib import Path

site = Path(__file__).resolve().parent.parent
page = (site / 'index.html').read_text(encoding='utf-8')

head_extra = ('<meta name="robots" content="noindex">'
              '<link rel="canonical" href="https://surface3d.site/">')
assert '<meta charset="utf-8">' in page and '<body data-page="home"' in page
page = page.replace('<meta charset="utf-8">', '<meta charset="utf-8">' + head_extra, 1)
page = page.replace('<body data-page="home"', '<body data-page="home" data-source="reddit"', 1)
page = page.replace('<!doctype html>', '<!doctype html>\n<!-- Generated from index.html by tools/build-reddit-page.py. Edit index.html and run the script again. -->', 1)

(site / 'reddit.html').write_text(page, encoding='utf-8')
print('wrote', site / 'reddit.html')
