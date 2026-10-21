# Surface3D 0.23: contextual authoring and 4K foundation

## Implemented and verified in the development preview

The current refinement batch and its remaining work are recorded in [Latest-development-results.md](Latest-development-results.md): 42 additional node kinds, dependency pruning, image residency/cache improvements, live preview/search fixes, retained-map rebaking, smooth curvature and tangent-aware normal seam repair. The complete Designer/400-assets goal remains open.

- Right-click ownership: material swatch/layer name selects material; mask thumbnail/mask effect selects mask. Direct Levels, Blur, Invert, Fill and Paint. Group generators, graphs and simulations. Disable unavailable map/anchor operations with relevant explanations; folder material effects remain unsupported.
- Typed reusable functions: extract selected nodes, retain boundaries, stable named inputs/outputs, nested source references, editable shared source, per-instance exposed overrides and source dependency export. Show both custom name and original type. Detect missing sources/ports, recursion and expansion limits.
- Sample Texture: sample any computed image with a separate coordinate input; repeat/clamp/mirror and point/bilinear filtering; alpha-aware interpolation and signed normal normalization.
- Project Texture Output: publish a reusable image, optionally enable Auto update on an image consumer. Update dependencies before consumers, reject missing/ambiguous producers and direct feedback, preserve stable image IDs. Avoid refreshes for cosmetic node edits.
- Paint node editing independent of its connection to Material/base color; restore the previous view when painting finishes.
- Offset seam blending follows the moved seam, including zero offset. Make Tileable remains independent.
- Named-output disconnect, deletion and wire cutting clear output selectors; Alt-click on an output affects that port's wires.
- Full-size 4096 import, Paint resolution, baking, persistence, graph evaluation and texture export. New default import limit 4096 and source-image memory budget 1024 MiB; saved preferences remain authoritative.
- Bake memory: retain coverage/triangle ownership without unused float position/normal fields; preview remains at most ten 256-square images. Cache CPU hemisphere/curvature sequences and compute only requested map arithmetic.
- Multi-set batch estimates count selected maps and retained diagnostics rather than a fixed bytes-per-pixel guess. Result batches and inactive source data retain explicit configurable bounds.
- GPU paint-effect channel buffers allocate only when needed; one node preview allocates one float4 result. Existing layer/compose precision remains unchanged.

## Acceptance

Run typed function/port/dependency tests, actual native menu/source/live-texture/Paint input tests and full-size 4K image/bake/native-GPU/export roundtrips. Repeat all retained regression checks after the last behavior change. Record scoped before/after bake timings without generalizing to other geometry, drivers or GPU backends. Preserve prior packages.

## Remaining work

1. GPU primary UV/cage projection and a persistent GPU map pipeline, minimizing synchronous readback. Current primary tracing remains CPU; D3D11 compute supports secondary AO, bent normal, thickness and curvature work. DXR capability is not an implemented DXR baker.
2. In-context function editing with each instance's connected input data. Current source editor previews shared defaults. Nested published-parameter forwarding is pending; extraction of those controls is rejected explicitly.
3. Structured material/placement bundles and full distribution/mapper controls; atomic programming/FX-Map/Pixel Processor coverage; remaining named noise, weathering, scan and HDRI families.
4. Broader live texture dependency tracking across layer baselines, anchors and composite-only changes; asynchronous publication. Direct graph texture dependencies are implemented, not every possible contextual feedback dependency.
5. Production tests with supplied props, cage/seam references, high-resolution/high-AA benchmarks, other vendors and low-memory devices. 4K images/bakes still use whole-atlas allocations, not tiled residency. Bakes remain RGBA8 data; higher-precision bake generation is pending even though texture export supports higher precision.
6. Only after the [Designer coverage gate](Designer-library-audit.md) passes: the requested 400 editable assets. No padded counts or placeholder equivalence.

The full Designer node requirement remains active. Follow the [implementation and responsiveness standard](Designer-implementation-standard.md): verify each detailed node contract, avoid duplicate operators, preserve typed ports and controls, and schedule expensive work independently of UI input. The current batch supplies foundations; it does not close the full library gate.

Portable graph/material exports store image snapshots, not project-local live producer links. Projects retain live links. Material export currently flattens functions; graph assets retain editable nested source graphs.
