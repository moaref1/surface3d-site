# Artist workflow and node editor implementation checklist

Request: 7 October 2026; implementation reviewed 8 October 2026. Focus: a durable texture-authoring graph and clear artist interface. Existing paint, layer and bake operations must retain working behavior and project readers. No missing operation is considered implemented by an icon or renamed substitute.

## Understanding and design decisions

The artist edits the same graph whether it drives a material channel, mask, generator or effect. Source data, conversions, map dependencies and output channels should be visible without lengthy explanatory paragraphs. Common operation variants belong in one node with modes; legacy nodes remain loadable. Icons need tooltips, selected state and keyboard access. Separate material and mask lanes must preserve one explicit evaluation order. Typed numerical fields and renderer-dependent shader closures are different capabilities.

## P0: graph data and operations
- [x] G01 Raise the 32-node limit with bounded GPU storage and larger preview atlas.
- [x] G02 Typed value/color/vector/boolean/integer inputs.
- [x] G03 Defined automatic color-to-value, vector-to-component and scalar-to-vector conversions.
- [x] G04 Unified coordinate node: UV, position, normal; component extraction instead of duplicate UV-X/Y search entries.
- [x] G05 Vector constants, combine/separate, mapping, rotate, vector math, distance and radial tiling.
- [ ] G06 Expand scalar Math and comparisons with operation modes.
- [x] G07 Color math, HSV, combine/separate RGB, color-space conversion, blackbody and wavelength.
- [x] G08 Real 3D noise/cellular families with editable coordinates, seeds and dimensions.
- [x] G09 Brick/checker/wave/gradient/magic/tile/random/pattern operations.
- [x] G10 Normal decode/blend and height blend as real numerical operations.
- [x] G11 Material normal/height/AO/emission/opacity channel foundation.
- [x] G12 Saved typed graphs, migration from schemas 1–6 and undo/asset integrity.
- [x] G13 Every requested catalogue row mapped to a working operation, preset, backend dependency or retained gap.
- [ ] G14 Full Designer filter/warp/distance/shape families using genuine multi-pass evaluation where needed.
- [ ] G15 Blender/Unreal texture-artist equivalents; renderer/ray/hair/volume closures retained with explicit dependencies.

## P0: graph interaction and discovery
- [x] E01 Multi-selection with Ctrl/Shift and box selection.
- [x] E02 Move/delete/duplicate selected nodes together without breaking internal links.
- [x] E03 Arrange only selected nodes; unselected positions unchanged.
- [x] E04 Hold a shortcut and sweep across connections to cut them; one undo action.
- [x] E05 Spawn at mouse graph position, avoid occupied cards and respect canvas coordinates.
- [x] E06 Grouped node search with meaningful categories, aliases and descriptions.
- [x] E07 Space toggles selected-node mesh and 2D preview; preserve and restore previous view.
- [x] E08 Export a selected node as an actual full-resolution texture, with color/data choice.
- [x] E09 Global preview-off shrinks cards; individual collapse/expand persisted.
- [x] E10 Inline rename/Properties rename and keyboard shortcut.
- [x] E11 Graphs become editable automatically; remove conversion prompts.
- [x] E12 Connection snapping, invalid link/cycle feedback and clear conversion information.
- [x] E13 Visual groups/frames and keyboard grouping.
- [x] E14a Reusable whole material/mask graph assets, exposed typed controls and linked instances with independent overrides.
- [ ] E14b Nested executable subgraph nodes and reusable multi-output functions.
- [x] E15a Typed reroutes, double-click wire insertion and atomic rewiring that preserves rejected links.
- [ ] E15b Arbitrary multiple output sockets and explicit per-output selection.

## P0: UI and layers
- [x] U01 Critique current crowded panels and rebuild a consistent visual hierarchy.
- [x] U02 Compact icon actions with tooltips and shortcut labels.
- [x] U03 Vertical material/mask separation, explicit active target and compact effect rows.
- [x] U04 Double-click mask toggles preview and restores the exact previous view.
- [x] U05 Docked panels stay within their layout; eliminate overlapping forced placements.
- [x] U06 Better thumbnails, active/disabled states and layer panel action hierarchy.
- [x] U07 Remove repeated help paragraphs; retain contextual errors/tooltips.
- [ ] U08 Layer folders/groups and group masks.
- [ ] U09 Keyboard accessibility, scalable layout, compact/wide visual acceptance.

## P1: viewport, paint and masks
- [x] V01 Perspective/orthographic, meaningful FOV, named views with consistent picking.
- [x] V02 Antialiasing controls with real resolve/filter behavior.
- [x] V03 HDRI import, linear HDR lighting, environment/light rotation and exposure.
- [x] V04 Normal/height inputs visibly affect the material and export.
- [ ] P01 Brush size/flow/opacity/hardness/spacing controls and convenient shortcuts.
- [x] P02 Lazy mouse/stabilizer, brush cursor feedback and predictable stroke finish.
- [ ] P03 Triangle, polygon, UV-island and separate-mesh mask fill.
- [ ] P04 Tablet pressure and brush presets/alpha/rotation/symmetry.

## P1: bake completeness
- [x] B01 Compare current outputs against Painter's supported mesh-map catalogue.
- [x] B02 Preserve genuine normals/AO/curvature/position/thickness/ID/bent-normal/height jobs.
- [x] B03 Expose geometric ray-hit/miss coverage as Opacity Mask, matching the documented Painter baker. Source texture alpha sampling is a separate pending feature.
- [ ] B04 Source material/vertex-color ID, base-color and emissive transfer where required.
- [x] B05 Published map inputs, ranges, color/data interpretation and graph previews.
- [ ] B06 Production tangent interchange, source material sampling, robust cage correspondence and budgeted larger maps.

## Acceptance
- [x] T01 Core/GPU fixtures for new operations, conversions and migrations.
- [x] T02 Native mouse/keyboard tests for selection, cutting, safe spawn and view restoration.
- [x] T03 Actual wide/compact interface captures and node-preview/export inspection.
- [x] T04 Separate executable package, examples and explicit implemented/manual-test/pending lists.

The prior 487-row request inventory includes headings and overlapping concepts; it is not 487 independent node algorithms. Exact matching requires per-operation semantics. Full AAA readiness additionally requires large production assets, color/tangent acceptance, performance profiles and artist testing; functional fixtures alone do not certify that status.

## 0.7 review: partial items remain open

- G06: 38 numerical Math modes, Compare, integer, boolean and two-input Switch added; more reference modes still require semantic comparison.
- G14: full-resolution Blur, Transform 2D, Vector/Directional Warp, Height to Normal, Edge Detect, Morphology, Slope Blur and Curvature from Normal implemented with 16 cached input fields. Flood Fill, true distance transforms, reaction diffusion and the full Designer filter library remain missing.
- G15: relevant bounded artist equivalents mapped per row in the CSV. Renderer-dependent shader closures and unsupported procedural presets remain explicit.
- U08: flat layer folders, visibility, collapse, rename, drag/drop and persistence work. Nested folders, shared masks and group opacity are not implemented.
- U09: compact and wide layouts and several real shortcuts checked; comprehensive keyboard/accessibility acceptance still needs artist review.
- P01: size, flow, hardness, spacing and lazy mouse added; independent stroke opacity, tablet pressure and the complete Photoshop/Painter brush engine remain missing.
- P03: triangle, connected coplanar face, UV island and imported mesh-group fills work. The face mode does not retain original n-gon provenance.
- P04, B04, B06, E14b and E15b remain pending. These require new data/backend capabilities, not extra buttons.

The catalogue has 487 original rows, including 19 headings: 51 bounded equivalents, 80 partial counterparts, 277 still planned and 60 backend dependencies. These are request rows, not unique implemented node algorithms. Exact third-party numerical or preset parity is not claimed.

## Acceptance evidence

Historical 0.7: 18/18 automated checks passed; wide/compact/native captures reviewed. The separate 0.7 package includes a saved/reopened baked procedural example.

## 0.8 bake/export and graph pass

- [x] Licensed Lucide outline icon family/notices; clear active mask row/lane without mode triangles.
- [x] Shared graph definitions/instances, exposed image and typed numeric controls, portable graph assets, override reset and independent copy.
- [x] Typed reroutes, atomic wiring, safe block placement, custom HLSL signature/code editor, background compilation and failed-draft retention.
- [x] Preflight source/name/cage checks, unsplit-hard-edge warnings and independent projection/shading normals.
- [x] Isolated 64px projection check and raw bake/miss viewing in 2D/on the mesh.
- [x] Automatic current full-bake publication, stable rebake IDs and atomic 192 MiB/16-image budget checks.
- [x] Persistent three-tab export templates, custom RGBA/grayscale packing and actual output previews.
- [x] Core/GPU/native artist-input regressions: 24/24 passed. Two screenshot-review rounds documented.
- [ ] Artist acceptance, broader DCC/GPU/DPI tests and measured production performance; see Surface3D-0.8-artist-tests.md.

Next required foundation work: source/cage provenance and persisted bake signatures, certified tangent interchange, painted offset/skew, high precision/export responsiveness, multiple texture sets/UDIM, a measured GPU bake backend, nested graph functions/multiple outputs and complete requested algorithms. Working whole-graph assets do not close those remaining items.
