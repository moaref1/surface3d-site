Latest performance refinement: [Surface3D 0.27.2 measured results](Texturing-performance-0.27.2-results.md). Builds and checks the Plane workload at 2K/4K, with background HLSL preparation and reduced channel memory. Earlier feature counts and limits below remain historical coverage, not a new full-coverage claim.

# Surface3D 0.23 — current development results

Latest focused refinement: [Output Texture, persistent paint and node search](Output-paint-search-refinement.md). Independent output resolution and producer update policies, EXR snapshots, surface-based UV/deformation transfer including multiple sets, and persistent node favorites/recent search are added. General retopology and further output metadata/precision controls remain open.

This is an original standalone Windows implementation. It does **not** yet implement every Substance Designer node or the requested 400 new assets. The coverage checklist stays open; a matching name is not proof of equivalent behavior. In the repository, run `build-023/Surface3D-0.23.exe`; in the prepared portable folder, run `Surface3D.exe`. Keep its `shaders` and `assets` folders alongside it. No new ZIP was produced.

## Added node systems

The registry now contains 185 persisted node kinds, including compatibility nodes and graph outputs. This count is not Designer coverage. This development batch adds 42 kinds:

- Color/HDR: Grayscale, Chrominance, Histogram Scan Non-Uniform, Exposure, HDR Range, Color Temperature, Color Match.
- Normal/height: Facing Normal, Normal Vector Rotation, Height Normal World, Normal Sobel, Curvature Filter, Normal Transform, Height Frequency, AO Cancellation.
- Image transforms/analysis: Polar Transform, Non-Uniform Rotation, Quad Transform, Auto Crop, Summed Area, FXAA.
- PBR: Albedo Safe, PBR Validate, Dielectric F0, Metal Reflectance, PBR Convert.
- HDRI/patterns: Panorama Direction, Panorama Rotation, Nadir Extract, Advanced Gradient, Two-Point Gradient, Starburst, Scratches.
- Multi-channel materials: Base Material, Material Blend, Material Switch, Material Height Blend, Material Transform, Material Crop, Material Color Blend, Material Adjustment.
- Channels: Split RGBA, with four named Value outputs preserving HDR, negative values and alpha.

Material operators expose typed Base Color, Roughness, Metallic, Normal, Height, AO, Emission and Opacity ports. They compile into existing atomic instructions, preserve disconnected neutral values and use editable per-channel controls. Normal blending supports signed vectors and RNM; transforms compensate normal directions. These explicit channel ports are not a structured single material socket. PBR conversion currently provides generic workflow conversion; engine-specific packed targets remain open.

Curvature Filter has named Curvature, Convexity and Concavity outputs. Built-in named output connections now survive UI synchronization; they were previously cleared as though they were ordinary single-output nodes. Shared/nested functions, exposed controls, save/load, pins and undo are covered by the node tests.

Original compound variants are consolidated where their use is equivalent. Polar conversion directions share one operator. Advanced Gradient contains multiple useful modes. Existing Alpha covers premultiply/unpremultiply; another duplicate operator was not added. Legacy component-coordinate nodes remain readable for old projects and are hidden from new-node creation.

## Graph responsiveness and interaction

- Evaluate full-resolution spatial nodes only when they feed an output or are explicitly previewed. Disconnected expensive filters no longer allocate/evaluate full-size fields merely for thumbnails.
- Coalesce active slider edits at approximately 80 ms intervals, with a final release update. Values change immediately in the document; graph updates are deferred during the gesture. Expensive synchronous processing can still cause stalls.
- Restore active node previews after graph rebuilding and thumbnail generation. Space retains the current 3D, 2D or split layout and camera; node-preview names no longer refer to a destroyed temporary string.
- Empty-canvas right-click and Shift+A open node search. Enter/Keypad Enter adds the highlighted first matching built-in node; arrows move selection; Escape closes search. Node-body context actions remain available.
- Finish painting restores the layout/navigation saved when a Paint node opened its separate canvas. Ordinary Space preview does not reset artist navigation.
- The graph cost button displays cached/computed field colors, CPU preparation time, shared scratch span and why a field was invalidated. It does not report invented individual GPU timings for nodes executed in one shared shader pass.
- Immutable image revision checks compare content when payload identities differ, and adopt the current identity. Byte-identical source replacements no longer repeatedly invalidate unchanged blur/edge fields.

## Library and memory

- Removed the 16-entry library/import/project-read cap. The catalogue safety cap is 4096 entries; the configurable source-image byte budget still applies.
- Full-resolution source images are uploaded on demand. Library cards and image properties use small, independently cached thumbnails.
- Retain GPU uploads after unchanged/renamed library entries; retire removed/unused full-resolution sources after the UI frame.
- Bind only a graph's image dependencies, using local slots rather than absolute library indices. A graph may reference an image anywhere in a catalogue larger than 16 entries.
- The current shader still supports **16 distinct source images per evaluated graph pass**. This separate execution limit is checked explicitly. Whole-atlas graph storage and the eight-layer renderer limit remain; this is not complete virtual/tiled texture residency or a universal 8 GB guarantee.

## Baking and normal seams

- Rebake checked/changed maps while retaining compatible previous maps, including unchecked ones. Publish only this job's maps, preserving unrelated map identities and pixels.
- Map context menu provides Rebake this map without altering the checked-map selection.
- Bake preview reads the published library map with its own resolution, including after project load. Refresh again after publishing, so completed previews do not show an older asset.
- Smooth high-surface curvature uses normal variation without adding polygon displacement bands. Flat-shaded geometry retains geometric curvature information.
- Connected smooth UV seam repair decodes chart-specific tangent normals, averages in world space, then encodes in each chart's own MikkTSpace frame. Both DirectX/OpenGL green conventions and mirrored UVs are tested. Hard edges, nonmanifold/unrelated groups and invalid projection pixels are excluded; alpha is preserved.
- Changing seam repair settings invalidates tangent Normal as well as AO/Curvature bake requests.

## Verification and performance evidence

The initial wider test run exposed a custom-shader empty-switch error, an unchanged-source cache regression and old layout expectations. These were corrected before the final validation. The final Release build passed **58/58 checks in 343.49 seconds**. Full output: `work/Latest-full-0.23.txt`; detailed cases: `build-023/Testing/Temporary/LastTest.log`. Individual acceptance sources are `tests/designer_nodes_tests.cpp`, `tests/material_nodes_tests.cpp`, `tests/texture_graph_tests.cpp`, `tests/priority17_tests.cpp` and the native artist fixtures. The retained registry audit executes all 185 registered kinds and checks finite outputs; the new operator tests add independent numeric/image expectations. Execution alone does not prove full reference parity.

The retained blur → edge → remap cache fixture changed only the downstream remap parameter. Source-field dispatches fell from **2 to 0**, and CPU rebuild submission from **66.3077 to 0.1596 ms**. This is that fixture's cache result, not overall GPU frame time.

Full-size 4K import, ten-map high-to-low bake, graph evaluation and 16-bit PNG/TIFF/EXR roundtrips passed on the RTX 5050. The analytic AA1/low-ray plane bake took 3802.52 ms; it does not establish high-poly production throughput. Owned GPU texture allocation for that simple 4K fixture was approximately 4.875 GiB, with another 256 MiB for one node preview. These are texture allocation estimates, not measured peak/resident VRAM.

On the NVIDIA GeForce RTX 5050, smooth-curvature coarse/fine tessellation mean error measured 0.138672/255 in the analytic curved fixture. Flat/convex/concave midpoint values were 128/152/103 with CPU/GPU difference zero. These are scoped fixture results, not confirmation of every supplied prop.

`project_profile.exe` loads an artist project read-only, reports active/waiting spatial fields, measures evaluation with an explicit completion/readback barrier, and separates CPU submission from completed pixels. It does not overwrite the supplied project. The exact Plane project has not been identified. The available `Desktop/Tiling.s3d` has a 960-triangle mesh named DefaultMaterial, two source images, a five-node base material and a seven-node procedural fill with two Offset fields.

At its authored 2048 resolution on the RTX 5050, initial evaluation including readback measured **321.767 ms**. A cosmetic rename submitted in **0.2148 ms**, replaying zero layers and zero spatial graph dispatches. Estimated owned GPU textures: **2001.17 MiB**. A prior 256 run took 3088.06 ms on first initialization; the different warm states mean these runs cannot be used as a resolution-scaling comparison. Reports: `work/Tiling-current-profile.txt` and `work/Tiling-current-2K-profile.txt`. Connected edits still have real evaluation cost; no universal lag-free claim is made.

## Still required

1. Complete every detailed row of [Designer-node-index.json](Designer-node-index.json): full Tile Sampler/Flood Fill Mapper map controls, shared Shape Splatter placement data, remaining named noise/pattern/weathering/scan/HDRI families, atomic programming/FX-Map/Pixel Processor, graph ray-traced and volumetric systems.
2. Connected-instance source previews, nested exposed-parameter forwarding, structured material/placement sockets and wider contextual live-output dependency tracking.
3. Asynchronous dense CPU image analysis and publication; persistent GPU/tiled evaluation and readback scheduling; larger source banks and expanded graph/layer budgets backed by measured memory limits.
4. Primary GPU/DXR baking, higher-precision bake generation, persisted per-map stale fingerprints, final normal-plus-height seam acceptance for brush/layer/export paths, and representative high-poly/high-AA 4K performance on more vendors.
5. Complete hardware ray tracing/GI/render feature acceptance, DLSS integration and other retained rendering requests. D3D11 compute ray tracing is not DXR hardware ray tracing.
6. **After all required nodes pass:** author the 400 distinct editable assets — 100 maps, 100 generators, 100 smart masks, 100 filters — with meaningful controls and required-map metadata. The existing ready library has not been relabeled as this new collection.

Public reference: [Adobe Designer library](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/node-library). Detailed input/output parity remains governed by [the implementation standard](Designer-implementation-standard.md).

## 0.27 projection build — 2026-10-11

Visual coordinate editing is available from both fill Coordinates and the Coordinates node for Position, Normal vector, Polar, Cylindrical, Spherical, Box and Triplanar. UV/Raw UV excluded. Shared transform, Ctrl snapping, axis links/locks, undo/redo and save/load retained. Native drag/persistence/mode checks passed; rotation/scale and individual projections still need artist review.

Added six original operators: Diffusion, Mosaic, Glow, Luminance Highpass, Hald CLUT and progressive rank noise. Fixed spatial-result field binding; pixel/alpha/identity LUT/noise checks passed. No debug readbacks retained. This does not complete Designer coverage: 177 pending reference entries and 171 partial entries remain. See Visual-projection-0.27.md.

Clean Release build: build-023/Surface3D-0.27-projection.exe. Three targeted suites passed. Preserve adjacent dependencies, shaders and shader-cache when moving the build; uncached procedural compilation took approximately 305 seconds on this machine.

## 0.27.1 — background process log, 2K diagnosis

Added Window > Log with buffered background TSV recording, bounded history/queue, deferred GPU timestamps, stage/node identifiers, filters and longest-duration sorting. New padding defaults are 1 px. Removed duplicate full-resolution validation in the UI authoring rebuild path. Four targeted checks passed and the Log panel screenshot was inspected. The Plane 2K profile identified expensive initial layer replay, 20–23 ms validation, and readback waits. Synchronous HLSL cache misses remain an identified follow-up, not a solved performance claim. Full details: Process-log-0.27.1.md; Designer coverage: Designer-open-nodes-0.27.1.md. Built build-023/Surface3D-0.27.1-process-log.exe.
