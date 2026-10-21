# Surface3D 0.2: working prop-texturing foundation

This is the implemented native application, distinct from the generated UI concept and the full Painter parity roadmap. It builds on the previous C++/D3D11 engine. The new shell uses Dear ImGui's MIT-licensed Win32/DX11 docking branch, pinned to v1.92.2-docking (commit 031a18c417158427217bc5890e0ec0cb7e7b4b63). No Adobe binaries, assets or procedural engine are dependencies.

## A usable workflow

1. Run `build-native/Surface3D.exe`. The original industrial elbow pipe opens with a weathered procedural base and a paint-details layer.
2. For your own prop, import a triangulated OBJ with UV coordinates inside 0–1. Imported positions are centered and normalized for preview. Supplied normals are preserved in direction and normalized; absent normals become flat face normals. This version combines all material assignments into one atlas, so supply a suitable shared UV layout.
3. Click a material sphere to add a procedural fill. Select its material thumbnail and adjust color, metallic, roughness, seed, scale, threshold, feather and roughness variation. Ctrl+click numeric sliders to enter exact values.
4. Choose a paint layer and left-drag to paint, or click a layer's mask thumbnail and paint away its contribution. 1 selects paint, 2 eraser; erasing paint-layer coverage reveals the layer below. X swaps the mask brush's grayscale value.
5. Orbit with Alt+left drag, zoom with the wheel, and use F to frame the prop. F1/F2/F3 switch split/3D/UV views. M shows material; C cycles display channels.
6. Save an `.s3d` project. Import/export a selected layer as a reusable `.s3mat` material, including its procedural settings and mask strokes.
7. Export Blender base color/roughness/metallic PNGs or Unreal base color/ORM PNGs. Base color is sRGB; data maps are linear. ORM's AO is explicitly 1 because true occlusion has not been calculated. No tangent-normal detail is exported.

## Implemented interface

Dockable/resizable/rearrangeable panels: Assets, Viewport, Texture Sets, Layers, Properties, Material Graph and Bake. Layout persists beside the executable. Reset it from Window. Panels can float inside the application window; independent OS viewport windows are not enabled.

Dark charcoal/teal theme, system typography, illustrative material thumbnails cached as GPU textures, consistent selection/focus states, contextual material versus mask targets, visibility eye controls, layer drag reordering, right-click rename/duplicate/move/delete, numeric parameters, searchable materials, and Ctrl+K command search. Numeric editing suppresses global painting shortcuts. These implement the supplied Apple guide's clarity/directness principles; fluid spring animation, screen-reader accessibility and comprehensive multi-DPI validation remain future work.

Painter bindings were checked against Adobe's current shortcuts page: https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/interface/settings/shortcuts . Ctrl+Shift+B/F8 opens Bake; F9 returns to Paint. This is a useful subset, not a complete or remappable Painter keymap. The legacy SurfaceLab shell still has different shortcuts.

## Layer and procedural behavior

Paint, uniform fill and procedural fill layers with independent channel coverage, channel enable switches, masks, visibility, layer opacity, Normal/Multiply/Add color blending, bounded undo/redo and persistent stable IDs. Roughness/metallic currently use normal interpolation regardless of the selected color blend.

The material starts as a **working template**: Coordinates -> Noise/Position Y/Brushed pattern -> Remap -> Color/Roughness -> Material Output. Edit the exposed parameters or choose **Make editable graph** to create a real typed graph. Eight node types are implemented: color, value, noise, Position Y, remap, color blend, value blend and material output. Add nodes, click an output then an input to connect, right-click inputs to disconnect, and select a node to edit its parameters and input references in Properties. Delete removes the node and resets its consumers to disconnected defaults. Cycles, missing references and mismatched color/value links are rejected.

The CPU validates and topologically orders up to 32 nodes per layer; the D3D11 compute shader evaluates them per texel. Node IDs and positions persist in the project. Graph navigation is session-local. Missing material inputs use the layer's constant defaults; missing mix/remap inputs use explicit zero/one fallback values. Color nodes store linear RGB. Arbitrary subgraphs, triplanar projection, image inputs, normal/vector operations and Designer compatibility remain future work. Paint and Graph preserve separate workspace layouts, with a larger canvas in Graph mode.

Position Y is sampled from a CPU UV raster of the current normalized mesh, uploaded to a GPU texture. It can produce vertical material transitions on the actual prop. That source is updated when mesh or paint resolution changes. The other drivers and material evaluation run in D3D11 compute shaders. Authored settings and strokes are authoritative; generated textures are derived.

## Baking behavior

The nonblocking Bake inspector keeps the mesh, layers and graph visible. Resolution 256/512/1024/2048 and padding 0–32 pixels affect actual CPU geometric-map computation. It exports normalized object Position and object-frame World Normal maps with dilation. UV coverage is computed internally for valid texels. The twelve-map catalogue explains additional maps and their procedural recipes, marking unavailable outputs planned.

Background jobs receive a mesh/settings snapshot. A cancelled or stale job cannot publish over the last ready results. Cancellation currently discards the result; it does not interrupt the worker's current calculation. Changed geometry/resolution/padding marks ready maps stale and prevents exporting them as current. Native capture checks exercised successful asynchronous publication; cancellation and stale-result paths require additional interaction/failure tests.

There is **no high-to-low projection, MikkTSpace tangent calculation, cage, ray tracer, measured AO, curvature, thickness, bent-normal or height bake** yet. The disabled normal-convention control is retained for the planned tangent-map job. The earlier analytic sphere-map exporter remains available in the legacy executable.

Geometric-map caveats: normalized preview coordinates rather than original units; last-triangle-wins UV overlap policy; degenerate UV triangles skipped; no UV-overlap diagnostics, antialiasing or ray-quality parameters. 8-bit linear PNG references are not signed/HDR production displacement data.

## Scope and reliability

One atlas at 256–2048, maximum eight layers, 100,000 authored stamps and 50,000 imported triangles. The mesh and typed graph are embedded in project version 3; version 1/2 projects load with defaults for newer fields. Project save still validates a temporary file, preserves a backup on replacement and checks checksums/ranges/IDs. Every 30 seconds of modified state, a separate `recovery/studio-session.s3d` is saved synchronously. Recovery is manual; use Open. One recovery slot is shared among studio launches, so use one instance per executable folder.

Approximate lighting and an orthographic viewport; no environment maps, camera pan, shadows, normal/height painting, pen pressure, stencil/image alpha import, groups, generators/effect stack, anchors, multiple texture sets, UDIMs, FBX/glTF/USD, `.spp`/`.sbsar` compatibility or Blender/Unreal live bridge. The preset library illustrates materials; its thumbnails are not exact renders of the live graph.

Per-layer textures use float formats. UI thumbnails and mesh-position maps are cached; the viewport redraws when needed. Material edits still replay/recompose the layer stack synchronously. There is no GPU timing, device-loss recovery or production performance certification. Full Designer/Painter feature parity is not implied.

## Verification

Six CTest checks passed on the machine's NVIDIA GeForce RTX 5050: document/recovery, analytic sample-map contracts, studio rendering/export, asynchronous geometric bake, editable graph rendering, and the existing GPU paint pipeline. Expanded checks cover OBJ negative indices and missing UV rejection, embedded mesh/procedural/settings roundtrip, normalized geometric normals, picking hit/miss, procedural seed response, output bypass, map-driven material variation, erasing and GPU reproduction after save/reopen. Additional graph checks verify output values, topological ordering, cycle/type rejection and persistence.

Native screenshot artifacts are `build-native/studio-evidence/Surface3D.png`, `build-native/studio-bake-evidence/Bake.png`, and `build-native/studio-graph-evidence/Graph.png`. These were visually inspected. They do not replace hands-on testing of every menu, drag, dialog, shortcut or accessibility mode.

## Reference coverage and next modules

The cumulative Painter 1.3.5 baseline remains the first parity target; its 317 historical statements remain preserved in `Painter-1.3.5-baseline-ledger.csv`. Later 4.1 workspace, 6.2 tile and 8.3/12.1 baking references remain in the full research ledger.

| Requirement family | Current evidence | Outstanding |
| --- | --- | --- |
| Painter-style workspace | Native docked panels and controls | Remapping, independent windows, comprehensive accessibility/DPI |
| Prop geometry | Triangulated OBJ, single atlas, picking | Multiple domains, tangents, original units, diagnostics |
| Painting | Color/rough/metal, masks and erasing | Normal/height, pressure, symmetry, stencils, clone/smudge |
| Layers | Three sources, opacity, channels, three color blends | Groups, full blend library, ordered effects and anchors |
| Materials | Original editable presets and single-layer reuse | Multilayer smart materials, image assets, versioned libraries |
| Procedural authoring | Typed editable GPU graph, validated links, geometry input and template conversion | Images, filters, subgraphs, normal/height operations, triplanar and caching |
| Baking | Position/world normals, real resolution/padding, background publication | High/low projection, cages and remaining map algorithms |
| Delivery | PNG Blender/Unreal profiles | Normal/AO, precision/formats, custom recipes and engine roundtrip |

Next engineering priorities: (1) high/low mesh pairing, tangents and first normal projection with hit diagnostics; (2) AO/curvature/thickness and bake-map resources; (3) extend the typed graph with images, filters and normal/height operations; (4) group/effect layers and smart materials. Maintain the working UI and storage while extending these modules.
