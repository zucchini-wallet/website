"""Check static routes, assets, fragments, sitemap and JSON metadata without dependencies."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1] / 'dist'
class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(); self.refs=[]; self.ids=set(); self.feed(path.read_text())
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.add(a['id'])
        for key in ('href','src'):
            if key in a: self.refs.append(a[key])
pages={p:Page(p) for p in root.rglob('*.html')}
errors=[]
for path,page in pages.items():
    for ref in page.refs:
        u=urlsplit(ref)
        if u.scheme or u.netloc: continue
        target=(root / unquote(u.path).lstrip('/')) if u.path.startswith('/') else (path.parent / unquote(u.path)) if u.path else path
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): errors.append(f'{path.name}: missing {ref}')
        elif u.fragment and target in pages and u.fragment not in pages[target].ids: errors.append(f'{path.name}: missing fragment {ref}')
for url in ET.parse(root/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
    u=urlsplit(url.text); assert u.netloc=='zucchinifi.xyz'
    assert (root/u.path.lstrip('/')/'index.html').exists(), url.text
json.loads((root/'site.webmanifest').read_text())
assert not errors, '\n'.join(errors)
print(f'PASS: {len(pages)} HTML pages, local links/assets/fragments, sitemap and manifest')
