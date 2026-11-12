# Builds data/documentation/index.json (guide list) and nodes.json (node reference) for docs.html.
#
# Node data comes from the app itself: build tools/dump_nodes.cpp against the Surface3D build (it links
# surface_core.lib) and run it to get nodes-raw.json, then:
#   python tools/build-docs.py <path to nodes-raw.json> <app version>
import json, re, sys
from pathlib import Path

site = Path(__file__).resolve().parent.parent
docs = site / 'data' / 'documentation'
raw_path, version = Path(sys.argv[1]), sys.argv[2]

# Guides in reading order: (file id, title, section)
GUIDES = [
    ('guide-getting-started', 'Getting started', 'Start here'),
    ('guide-first-texture', 'Your first texture', 'Start here'),
    ('guide-navigation', 'Moving around', 'Start here'),
    ('guide-workspaces', 'The interface', 'Start here'),
    ('guide-layers-and-masks', 'Layers and sub-layers', 'Painting'),
    ('guide-brushes', 'Brushes and tools', 'Painting'),
    ('guide-sculpting', 'Sculpting into the normal map', 'Painting'),
    ('guide-edge-damage', 'Edge damage and bevels', 'Painting'),
    ('guide-teach-mode', 'Weathering and Teach mask', 'Painting'),
    ('guide-splines-particles', 'Splines and particles', 'Painting'),
    ('guide-library', 'Material library', 'Materials and nodes'),
    ('guide-node-graphs', 'Node graphs', 'Materials and nodes'),
    ('guide-baking', 'Baking mesh maps', 'Bake, UV and export'),
    ('guide-uv-rendering-export', 'UV, Rendering and Export', 'Bake, UV and export'),
    ('guide-shortcuts', 'Keyboard shortcuts', 'Reference'),
    ('guide-saving-performance', 'Saving, performance and limits', 'Reference'),
]
for gid, _, _ in GUIDES:
    assert (docs / 'sources' / f'{gid}.md').exists(), gid

# Header colours per family, as the app's graph editor draws them.
FAMILY = {
    'Inputs': '#83314a', 'Coordinates & Transforms': '#5454a0', 'Patterns & Noise': '#aa5c1e',
    'Scatter & Tiles': '#966e28', 'Paths': '#34708c', 'Color & Channels': '#7a7424', 'Filters': '#246283',
    'Normals & Height': '#644696', 'Masks & Shapes': '#2e7052', 'Materials': '#28803c',
    'Utilities & Functions': '#505050', 'Outputs': '#6e2230',
}
ORDER = list(FAMILY)


def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def tidy(v, kind):
    if v is None:
        return None
    if kind in ('Integer', 'Boolean'):
        return int(round(v))
    return float(f'{v:.4g}')


raw = json.loads(raw_path.read_text(encoding='utf-8'))
nodes, seen = [], set()
for n in raw:
    if not n['creatable']:
        continue  # internal or retired nodes are not in the Add menu
    sid = slug(n['name'])
    while sid in seen:
        sid += '-2'
    seen.add(sid)
    nodes.append({
        'kind': sid,
        'name': n['name'],
        'category': n['category'],
        'color': FAMILY.get(n['category'], '#505050'),
        'description': n['description'],
        'spatial': n['spatial'],
        'output': n['output'],
        'inputs': n['inputs'],
        'outputs': n['outputs'],
        'parameters': [{
            'name': p['name'], 'type': p['type'], 'components': p['components'],
            'min': tidy(p['min'], p['type']), 'max': tidy(p['max'], p['type']), 'default': tidy(p['default'], p['type']),
        } for p in n['parameters']],
    })
nodes.sort(key=lambda x: (ORDER.index(x['category']) if x['category'] in ORDER else 99, x['name'].lower()))

(docs / 'nodes.json').write_text(json.dumps(nodes, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
index = {
    'version': version,
    'nodeCount': len(nodes),
    'families': [{'name': f, 'color': c, 'count': sum(1 for x in nodes if x['category'] == f)} for f, c in FAMILY.items()],
    'articles': [{'id': gid, 'title': title, 'path': f'data/documentation/sources/{gid}.md', 'category': section}
                 for gid, title, section in GUIDES],
}
(docs / 'index.json').write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{len(nodes)} nodes, {len(GUIDES)} guides, version {version}')
