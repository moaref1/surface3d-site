# Surface3D: whole-system texturing optimization, 4K to 8K

Date: 2026-10-11. Status: investigation and implementation checklist, not completed optimization.

October 11 implementation: [0.25 results](Texturing-performance-0.25-results.md) records the first four priorities. GPU stage/allocation/readback diagnostics, unchanged preview/composition reuse, shared neutral planes and GPU-resident live outputs are implemented. P0.01–02/04/07/11–12/17 remain partial: CPU substage statistics, budget-controlled residency, uniform scalar representations, arbitrary scratch pooling, folder/function preview consolidation and per-node percentile benchmarks are not complete. The broader checklist remains open where its full acceptance criteria have not been met.

Scope: every node family and the shared texturing system: painting, layers, masks, folders, graph editing, node thumbnails and full previews, simulations, anchors/live outputs, baked-map consumers, imports and exports. The Plane project is a reproducible acceptance fixture, not the only workload to optimize. This work does not require an RTX GPU, DLSS or a wholesale language/API rewrite.

## Measured project and important correction

Inspected `C:/Users/pouya/Downloads/Plane.s3d`, 249,293,208 bytes, last saved 2026-10-11 10:41:45 local. Diagnostics never save or overwrite it. File size and last-write timestamp remained unchanged after profiling.

- Project texture resolution: 4096. Saved bake resolution: **512**, requested map bits 63.
- One texture set, one scene object, 9,984 triangles, seven layers, one folder, 13 effects.
- 96 expanded graph nodes and 9,860 recorded layer/effect paint dabs. This dab count does not include any node-owned paint/simulation marks or folder stamps.
- Seventeen embedded textures; unique retained CPU pixel payloads approximately 213.815 MiB, excluding document/mesh/container overhead.
- Bound baked maps: Normal, WorldNormal, AO, Curvature, Position, Thickness, all **512 x 512, 8-bit RGBA**.
- `Baked/ID` exists at 2048 x 2048, but its mesh-map binding is empty. Bent Normal, Height and Opacity are also unbound. Do not silently change these authored bindings during optimization.
- Wood pack maps are primarily 2K; the 16-bit displacement texture retains an 80 MiB CPU representation. The project also contains region-selection textures and a 32-bit 1K texture.
- The default output plan requires two temporary spatial fields for Slope Blur. Disconnected Make Tileable and Bevel become active only when requested by an output or preview. Zero spatial fields does **not** mean a graph/noise costs nothing: procedural instructions still execute across pixels.

Therefore this is a 4K **working-texture** problem with mostly smaller imported/baked sources. It is not evidence that 4K baked-map files themselves caused the lag. A future 4K/8K bake-map variant must be tested separately.

## Measurements and their limits

Adapter: NVIDIA GeForce RTX 5050. Sequential standalone diagnostic processes; retained authored data, resolution changed in memory for the 2K comparison. No app preferences were loaded by the diagnostic; the existing compact-texture default was retained. Driver load, other applications and cache warmth can affect results.

| Diagnostic | 2K | 4K |
| --- | ---: | ---: |
| Estimated allocated GPU textures/buffers counted by the renderer | 3,617.88 MiB / 3.533 GiB | 14,321.9 MiB / 13.986 GiB |
| Initial evaluation plus synchronous color readback, interaction run | 603.415 ms | 6,492.73 ms |
| Warm unchanged rebuild, CPU submission | 22.511 ms | 22.619 ms |
| Warm unchanged rebuild, completion plus readback | 90.425 ms | 1,987.81 ms |
| Levels gamma +1%, completion plus readback | 85.085 ms | 1,575.47 ms |
| Tiny UV diagnostic dab plus compositing/readback | 49.156 ms | 949.691 ms |
| Composited layer-pixel counter after the tiny dab | 29,360,128 | 117,440,512 |

Other cold 4K runs measured 5,339.5 and 7,059.13 ms. These are individual observations, not a statistically controlled average or a promised speedup ratio.

The UV dab uses radius 0.005, one color channel, the `Paint details` layer, and the renderer's direct UV stamp path. It is **not** a measured 3D gesture, tablet event or presentation frame. The reported composite counter equals seven full-size images; it does not count every channel write or GPU instruction.

Every completion measurement explicitly reads a full image to CPU. This adds synchronization, copying and conversion; these numbers must not be advertised as actual viewport FPS or isolated shader execution time. The diagnostic also showed that a cosmetic rename correctly replayed zero layers: semantic caching already exists.

Windows reported a local process budget of 7,142 MiB during the interaction run. A sample reported local usage 10,762.9 MiB, above that budget. Other samples fluctuated substantially, including implausibly small readings shortly after work; they are not stable peak physical-residency measurements. The 14,321.9 MiB resource estimate includes staging and other counted textures, and is **not** the same as physical VRAM residency. Oversubscription/paging is a strong concern supported by the allocation size and one budget reading; confirm it with a timeline/residency capture.

### Noise previews reproduced in the real project

Five distinct kinds were tested: 3D Voronoi, Noise, 3D Perlin, Fractal Noise and Noise/Patterns. Each was previewed, requested again unchanged, then given a temporary scale change. No edits were saved.

| Preview in the Plane project | Unchanged preview requested again, completion + readback | Scale edit, completion + readback |
| --- | ---: | ---: |
| Cells / 3D Voronoi | 1,770.13 ms | 1,892.28 ms |
| Noise | 1,831.00 ms | 1,839.05 ms |
| Breakup / 3D Perlin | 1,946.88 ms | 1,805.33 ms |
| Fractal Noise | 1,351.21 ms | 1,319.34 ms |
| Noise / Patterns | 1,338.42 ms | 1,363.42 ms |

First 3D Voronoi preview took 7,010.24 ms including readback. Preview allocation grew to 14,705.9 MiB. Every unchanged preview request replayed its owning layer. These timings include the containing layer/stack, memory pressure and readback, not just the mathematical noise kernel. They prove a shared-path problem; isolated GPU timestamp tests are still required to rank intrinsic node costs. Current graph-dispatch counters omit some ordinary/final procedural passes, so zero in that counter does not prove that noise was not evaluated.

Raw logs: `work/Plane-performance-audit/plane-2k.txt`, `plane-4k.txt`, `plane-4k-noise-previews.txt`. Repeatable utility: `tools/project_profile.cpp`.

## Source findings that drive the plan

- `src/gpu/renderer.cpp`: per-layer banks allocate color/material/mask plus detail/emission/utility/coverage. Extras allocate together even when individual channels are not authored. Detail and emission are RGBA32F. Scratch evaluation copies seven full textures before graph processing.
- `Renderer::nodePreview`: any nonzero selected node forces owning-layer replay and calls `rebuild`. Repeated identical preview requests are not an inexpensive texture reuse operation.
- `src/app/studio.cpp::changed`: calls `gpu.rebuild`, live-output updates, then the selected preview path; preview can force another rebuild after the material already updated.
- `Renderer::composite`: dirty-rectangle compositing requires no folders and no pass-through configuration. The Plane project has a folder, so this optimization cannot apply to its tiny diagnostic dab.
- `Renderer::read`: CopyResource followed immediately by blocking Map. FP16 readback is expanded into CPU float arrays.
- `src/app/live_outputs_ui.inl`: changed live publications call `readNodeResult` and create CPU texture assets, followed by another rebuild. Publication does not yet provide a common resident GPU resource to all consumers.
- The common procedural shader interprets node instructions per pixel using a large temporary values array and dynamic switch. Noise functions include octave/cell-neighborhood loops. The warmed built-in kernel currently skips compiler optimization to avoid prior compiler-time regressions. Runtime cost and shader/register pressure need measurement, not blind replacement of compiler flags.
- Some image/shape nodes use CPU processing with full-resolution transfers. GPU blur already exists and is separable; avoid replacing it merely because the application is slow overall.
- Source changes can invalidate broadly; anchor/physics dependencies are treated conservatively. Existing reachability and spatial ancestry caches should be extended rather than discarded.
- Unchanged CPU rebuild submission still costs about 23 ms on this project: graph/document traversal, semantic copies and retained stroke comparisons need profiling independently of GPU time.
- Document, bake projection, geometry rasterization and several CPU processing paths still reject resolutions above 4096. An 8192 import or export path does not make 8192 authoring supported.

## P0 — Establish complete measurements and remove redundant work

- [ ] **P0.01** Add a resource inventory by category: sources, baked maps, layer channels, composites, paint checkpoints, preview, fields, scratch, staging, simulations and inactive texture sets. Separate logical size, actual allocation estimate, DXGI budget/usage and CPU payloads.
- [ ] **P0.02** Add nonblocking GPU timestamps for procedural evaluation, filters, brush dispatch, folder/stack composition, padding and previews. Read timing queries after completion; do not introduce a per-frame wait.
- [ ] **P0.03** Record CPU durations for validation, graph lowering, document copies, stroke comparisons, shader compilation, submission, readback waits and UI presentation.
- [ ] **P0.04** Extend dispatch/cost accounting to every node family, including inline noises and final material/mask passes. For fused passes report shared-pass cost instead of inventing independent per-node times.
- [ ] **P0.05** Record p50/p95 interaction latency, queue age, cancelled jobs, recomputed pixels and bytes transferred. Run repeated captures with device, app build and project revision recorded.
- [x] **P0.06** Make repeated unchanged node-preview requests return an existing valid result, without replaying the owner layer.
- [ ] **P0.07** Combine material update and selected-preview requests into one dependency evaluation. Compute common ancestors once; avoid the current rebuild-then-forced-rebuild sequence.
- [ ] **P0.08** Keep display selection, graph panning, node movement, rename, docking and thumbnail visibility outside texture invalidation. Assert zero texture work for these events when no relevant preview is newly requested.
- [ ] **P0.09** Keep the last completed image visible while work is pending. Tag jobs/results with owner, texture set, node/output, resolution and revision; discard obsolete completions without overwriting a newer preview.
- [ ] **P0.10** Preserve 2D/3D/split view and camera state through preview changes. Show a compact pending state rather than changing layouts or displaying old results as current.

Gate: repeated unchanged previews do not replay layers; one parameter event causes one coherent evaluation; profiling distinguishes GPU execution from forced readback. Scope includes all nodes, not just the five measured noises.

## P0 — Reduce memory before claiming interactive 4K

- [ ] **P0.11** Compute channel liveness from layer channels, active effects and downstream dependencies. Allocate only required planes; removing an unused channel releases its resource after queued users finish.
- [ ] **P0.12** Represent uniform fills/default masks as constants until a spatial operation needs an image. A flat roughness or absent mask should not require a full-size image.
- [ ] **P0.13** Store masks/scalars in suitable single-channel formats. Keep independent channel coverage semantics; do not pack away required coverage or opacity information.
- [ ] **P0.14** Establish a precision contract per channel/node. Permit FP16 only where error tests pass; retain FP32 for operations/ranges that need it. Preserve signed height, HDR emission, normalized normals and exact IDs.
- [ ] **P0.15** Allocate emission/normal/height resources independently. Remove unconditional RGBA32F emission allocation for layers that never emit. Partial in 0.25: normal and height remain packed together; emission is independent and unused planes alias shared defaults.
- [ ] **P0.16** Build a reusable scratch pool matched by format, extent, usage and lifetime. Reuse sequential intermediates only after all consumers are finished; never alias resources still used by UI or queued GPU work.
- [ ] **P0.17** Copy only required input channels and changed regions. Eliminate unconditional seven-plane scratch copies for a one-channel effect or isolated node preview.
- [ ] **P0.18** Release/evict unused preview and analysis intermediates under pressure. Pin current outputs, pending work and dirty paint; rebuild clean derived data on demand.
- [ ] **P0.19** Respond to the operating-system memory budget, with adjustable cache headroom. Use a bounded resident cache rather than relying on the driver to page a 14 GiB working set.
- [ ] **P0.20** Separate preferences for CPU image cache, GPU derived cache, undo and job buffers. Provide Auto/manual settings and accurate telemetry; a cache budget must not silently truncate project content.

Gate: first target for this Plane project is approximately 4.5–5 GiB steady resources on the tested configuration, and sustained usage below a chosen safe fraction of the actual OS budget. These are proposed acceptance targets, not achieved measurements. If exact content cannot fit, use controlled residency rather than lowering authored output quality silently.

## P1 — One dependency system for all nodes and outputs

- [ ] **P1.01** Track semantic revisions per source, baked map, channel, stroke collection, node, graph function and output. Avoid repeatedly copying/comparing every graph and thousands of dabs for an unchanged edit.
- [ ] **P1.02** Cache graph lowering/topology separately from parameter values. Slider changes update parameters, not topology, UI indexes or shader source.
- [ ] **P1.03** Assign reusable results stable identities including owner, output socket, coordinate dependencies, resolution/region, type, working color space and source versions. Avoid cache ownership based only on a recycled temporary slot.
- [ ] **P1.04** Invalidate changed descendants only. A new AO map must not invalidate unrelated noise/color branches or geometry unnecessarily.
- [ ] **P1.05** Evaluate only relevant roots and their ancestors. Extend existing reachability planning to independent channel outputs and preview-only requests.
- [ ] **P1.06** Materialize expensive shared noise/function branches once when multiple consumers benefit; fuse cheap arithmetic where it saves transfers. Make this a measured cost/memory decision.
- [x] **P1.07** Implement Output Texture (Anchor) as a GPU-resident, versioned result shared by layers, graphs and library previews. Snapshot CPU pixels only for saving/exporting or required CPU consumers.
- [ ] **P1.08** Unify layer anchors and published outputs around dependency versions. Share producer results; reject cycles; preserve stable project IDs and undo/load behavior.
- [ ] **P1.09** Preserve resource lifetime across in-flight edits and publication. Stale jobs cannot expose half-written textures or release resources still displayed.
- [ ] **P1.10** Batch work so graph compilation, preview, publication and compositing cannot each re-evaluate the same dependency in one edit.

Gate: changing one noise parameter updates its consumers once; unrelated branches stay cached. Multiple live consumers share one producer result without recurring GPU→CPU→GPU publication.

## P1 — Responsive parameters, all noise families and all processing nodes

- [ ] **P1.11** Create a complete node performance inventory from the registered node kinds. Every node gets type/precision, algorithm, input footprint, temporary memory, CPU/GPU path and interactive/export behavior.
- [ ] **P1.12** Test every noise/pattern family: 2D/3D, Perlin, Simplex, Voronoi/cellular, fractal/ridged, Gabor, grunge, directional and Designer-derived variants. Test scale, seed, octaves/detail, distortion and coordinate edits.
- [ ] **P1.13** Run isolated kernels as well as real stacks. Separate intrinsic octave/neighborhood cost from forced layer replay, full compositing, over-budget allocations and readback.
- [ ] **P1.14** Profile the interpreter's value-array/register usage, branching and instruction count. Try smaller value-capacity kernels or dedicated expensive-node kernels only where measurements justify them.
- [ ] **P1.15** Keep a warmed generic path for immediate use. Any optimized graph/kernel compilation happens asynchronously and is cached by topology, not each parameter value. Retain the existing fallback if compilation fails.
- [ ] **P1.16** Benchmark improved hashing/gradient reuse and table-based alternatives for noises. Preserve deterministic seed behavior and saved patterns; version any mathematically different implementation.
- [ ] **P1.17** Provide explicit interactive quality: lower-cost preview resolution or sampled octave detail while dragging, then exact authored settings after release. Preserve coordinates, seed, scale and perceived placement across resolutions.
- [ ] **P1.18** Move frequently used CPU-bound local filters to compute. Prioritize Sharpen, shape/edge operations and other measured hot paths, not arbitrary node names.
- [ ] **P1.19** Use GPU reductions for global statistics such as Auto Levels/histograms. Read small reduced results asynchronously if the CPU needs them, not the complete image.
- [ ] **P1.20** Classify nonlocal operations correctly: flood fill, distance transform, Normal-to-Height, reaction diffusion and simulation may need global/multilevel synchronization. Preserve their algorithms; do not pretend every operation is an independent tile filter.
- [ ] **P1.21** Optimize blur/slope blur/morphology by measured sample count, separable paths, shared-memory reuse or equivalent multiscale methods. Compare final results to the reference, including normals, wrap modes and large radii.
- [ ] **P1.22** Coalesce rapid edits, cancel superseded CPU work and stop submitting obsolete GPU batches. Keep batches small enough for UI progress and driver watchdog safety; cancellation occurs at safe boundaries.
- [ ] **P1.23** Update only visible node thumbnails at modest resolution and rate. Full-resolution selected previews remain separate from the thumbnail atlas.
- [ ] **P1.24** Cache graph search/filter/layout data; opening node search and adding a disconnected node should remain responsive while texture jobs run.

Gate: every registered node has a benchmark/status entry; no node addition introduces synchronous compilation or full-image readback into ordinary UI interaction. Heavy global nodes may take time, but must not freeze the application or publish stale data.

## P1 — Painting, masks, folders and seams

- [ ] **P1.25** Propagate dirty rectangles/tiles through channel compositing, masks, isolated folders and pass-through folders while preserving their exact semantics. Remove the blanket no-folder requirement through correct implementation, not by simply toggling the condition.
- [ ] **P1.26** Extend affected regions by filter radius, warp displacement, brush falloff and seam gutters. Use conservative/global fallbacks when dependency bounds cannot be known.
- [ ] **P1.27** Keep one-channel edits local to that channel where possible. Roughness changes should not rewrite emission/color/normal unless a real dependency requires it.
- [ ] **P1.28** Cache completed brush checkpoints and append new dabs. Parameter edits unrelated to strokes must not replay all 9,860 recorded dabs.
- [ ] **P1.29** Retain surface-attached authoring strokes as authoritative data; raster/tile paint caches are derived. Resolution changes regenerate detail; UV/mesh reprojection retains ownership and reports transfer failures without corrupting paint.
- [ ] **P1.30** Handle paint-node, clone, mask, layer and folder painting through the same damage/cache rules. Clone uses a stable pre-dab source and never reads a partially overwritten target.
- [ ] **P1.31** Update tangent-aware normal blending, height-to-normal and seam dilation only where their inputs changed, with adequate neighboring samples.
- [ ] **P1.32** Store/share modified paint tiles for raster undo caches while retaining vector stroke edits and redo semantics. Do not duplicate immutable imported texture payloads already shared by history.
- [ ] **P1.33** Test repeat, mirror, clamp, trimmed/outside-0–1 UVs, overlapping UVs, mirrored tangents, split normals and cross-island brush footprints. Optimize without painting unrelated mesh regions.
- [ ] **P1.34** Separate camera navigation/selection highlights from texture invalidation. Viewing an unchanged baked map should use its existing texture.

Gate: a tiny stroke in this folder-containing project does not require seven complete 4K composite passes. Optimized output must match full recomputation, including pass-through, channel opacity and mask blend order.

## P2 — Baked maps, import/export and background jobs

- [ ] **P2.01** Keep baked maps at their authored precision/extent; sample directly. Avoid expanding 512px sources into 4K/8K duplicates per layer.
- [ ] **P2.02** Mark baked maps explicitly as data with correct normal conventions and sampling. ID maps need discrete handling; color textures keep their color transform.
- [ ] **P2.03** Publish rebaked maps atomically and invalidate only users of changed maps. Preserve unselected maps and user assignments; do not automatically bind the Plane project's unbound ID as a performance fix.
- [ ] **P2.04** Profile map upload and generator consumption independently of ray tracing. A faster bake backend cannot fix a slow layer/graph evaluation path.
- [ ] **P2.05** Extend projection/rasterization to bounded image regions and ray packets; retain CPU/compute fallback and optional hardware tracing. Share prepared geometry/BVH while respecting changes in cage, transforms and matching rules.
- [ ] **P2.06** Coordinate bake/export/graph jobs against one memory budget. Do not start several independent full-resolution devices/resources and exceed the budget collectively.
- [ ] **P2.07** Stream import decoding/conversion and prepare thumbnails separately. Retain original precision without unnecessary full-size float copies for scalar data.
- [ ] **P2.08** Export in bounded strips/tiles with a small asynchronous staging ring; pack channels and encode incrementally when codecs support it. Preserve exact final resolution and encoding.
- [ ] **P2.09** Persist source/output snapshots only at actual save/export boundaries. Use shared immutable payloads, progress and cancellation; avoid refreshing CPU copies every parameter edit.
- [ ] **P2.10** Ensure saving a live output captures its correct completed revision, including inactive texture sets; asynchronous publication cannot serialize mismatched versions.

Gate: baking, importing and exporting large maps remain cancellable without UI stalls or transient memory spikes that exhaust the GPU. Baking accuracy/cage/seams remain separate quality acceptance requirements.

## P3 — Genuine 8K authoring with bounded residency

Do not enable an 8192 dropdown before this work. An 8K image has four times the pixels of 4K. Simply scaling the present Plane allocation suggests roughly **55–56 GiB** of resources, not an 8K measurement. One 8K RGBA32F image is 1 GiB; RGBA16F is 512 MiB; R16F is 128 MiB. Mip chains add further storage when present.

- [ ] **P3.01** Introduce a logical image abstraction with tiles/regions and a bounded physical GPU cache. Start with tested 128/256/512 tile candidates; choose by measured overhead and filter behavior rather than assuming one ideal size.
- [ ] **P3.02** Schedule regions needed by current paint, the selected node and visible 2D/3D surface first. Complete all required regions at authored quality for export.
- [ ] **P3.03** Keep dirty authoritative paint protected; evict clean derived intermediates by recency/recompute cost. Add an optional disk cache with revision/type/color-space keys and safe invalidation.
- [ ] **P3.04** Store independent per-channel tiles. A roughness edit need not allocate unrelated emission or normal pages.
- [ ] **P3.05** Add gutters/halos and consistent mip generation. Test wrap boundaries, blur/warp footprints, derivatives, normals and tiled seams against a full-image reference.
- [ ] **P3.06** Define global-operation scheduling for reductions, flood-fill labels, distance transforms, iterative solvers and physics. Use bounded multilevel/global stages rather than isolated local approximations advertised as exact.
- [ ] **P3.07** Make GPU-result sharing and anchors work for logical tiled images as well as resident textures. Multiple consumers must not multiply whole-image allocations.
- [ ] **P3.08** Audit all 4096 checks: document validation, graph/image/shape processing, geometry raster, projection, selection maps, UI menus, simulations, output nodes and codecs. Replace only after each path supports the new extent safely.
- [ ] **P3.09** Audit size arithmetic, row strides, dispatch extents, index types, serialized payload lengths and decoder allocation guards. Large-project persistence must reject/handle oversized payloads safely instead of overflow.
- [ ] **P3.10** Expose Auto cache residency, interactive quality, refinement delay and final quality as distinct settings. Display authored versus currently displayed resolution without confusing them.
- [ ] **P3.11** Test on AMD/Intel/NVIDIA, integrated/shared-memory configurations and low-memory fallback. Core texturing must use supported compute paths without requiring vendor ray-tracing features.
- [ ] **P3.12** Enable 8K only after editing, previews, paint replay, baked-map consumers, undo/save/load and exports pass. Document which global operations still refine progressively.

Gate: a complete 8K output is produced at exact requested resolution while the editor uses bounded residency, remains responsive and preserves the result. Interactive preview quality may be explicit/progressive; exported quality must not depend on the temporary preview resolution.

## Acceptance matrix and proposed targets

Targets are goals to validate, not current performance claims or universal hardware promises.

- [ ] Keep the original Plane project as a read-only baseline; use generated/copied fixtures for edits and all-new bake-map variants.
- [ ] Test 2K and 4K now; 8K only after bounded authoring paths exist. Include 512px versus true 4K/8K map inputs separately.
- [ ] Cover every node kind at default, representative and maximum supported controls, plus combinations/shared functions. Classify expected cost instead of promising identical latency for all algorithms.
- [ ] Test node previews in 2D, 3D and split view, repeated Space toggles, rapid edits, disconnected nodes and preview-source changes.
- [ ] Compare incremental/tiled output against full reference recomputation for colors, scalars, masks, normals, signed height and IDs. Define channel-specific numerical tolerances and visual seam checks before changing precision.
- [ ] Confirm pattern/seed determinism, texture filtering and physical world scale across preview/export resolutions.
- [ ] Target a roughly 16–33 ms interactive presentation cadence on the reference GPU during typical painting/parameter edits, with first feedback within 100 ms through explicit progressive preview. Record p95 and distinguish UI response from full-quality completion.
- [ ] Target CPU evaluation planning under approximately 3 ms for warmed ordinary parameter edits on this fixture; the current unchanged submission is about 23 ms.
- [ ] Keep resident usage below the chosen OS-budget fraction; measure spikes during save/export/bake and project switching. Do not treat shared-memory spill as a normal optimization strategy.
- [ ] Confirm unchanged requests reuse outputs, cosmetic changes schedule no texture work, shared anchors evaluate once, and tiny strokes touch a justified small region.
- [ ] Verify no stale preview, image corruption, altered layer order, lost unselected baked maps, silent source downsizing or unbounded history growth.
- [ ] Repeat on other vendors and 4/8/12+ GiB devices before publishing compatibility/performance claims.

## Research and implementation references

Blender provides useful patterns, not a complete interchangeable texturing engine:

- [Blender 4.5 partial image updates](https://github.com/blender/blender/blob/blender-v4.5-release/source/blender/blenkernel/intern/image_partial_update.cc): region/chunk histories for incremental updates; useful for source changes and brush damage.
- [Blender GPU texture pool](https://github.com/blender/blender/blob/blender-v4.5-release/source/blender/gpu/intern/gpu_texture_pool.cc): reuse compatible temporary resources; useful for scratch lifetimes.
- [Blender image undo](https://github.com/blender/blender/blob/blender-v4.5-release/source/blender/editors/space_image/image_undo.cc): shared changed tiles; useful for derived raster-paint history.

Research/public platform guidance:

- [Microsoft resource copy/readback](https://learn.microsoft.com/en-us/windows/uwp/graphics-concepts/copying-and-accessing-resource-data): immediate CPU mapping can synchronize and stall GPU work. Apply asynchronous staging only when CPU data is genuinely required.
- [Microsoft process video-memory budgets](https://learn.microsoft.com/en-us/windows/win32/api/dxgi1_4/nf-dxgi1_4-idxgiadapter3-queryvideomemoryinfo): staying within the assigned budget matters; exceeding it can lead to paging and stutter.
- [Software Virtual Textures, van Waveren / id Software](https://mrelusive.com/publications/papers/Software-Virtual-Textures.pdf): page pools, caching, filtering and streaming without special hardware. Adapting a rendering approach to writable procedural images requires dependency, dirty-page and global-operation support; it is not a drop-in authoring solution.
- [GPU Gems: Improved Perlin Noise](https://developer.nvidia.com/gpugems/gpugems2/part-iii-high-quality-rendering/chapter-26-implementing-improved-perlin-noise): arithmetic versus lookup tradeoffs and reuse opportunities. Its historical instruction counts are not modern GPU performance predictions; benchmark alternatives while preserving saved noise semantics.
- [GPU peak-performance analysis](https://developer.nvidia.com/blog/the-peak-performance-analysis-method-for-optimizing-any-gpu-workload/): distinguish scheduling/synchronization problems from shader throughput, memory bandwidth and CPU starvation before choosing an optimization.

Recommended first implementation: unchanged/duplicate preview fixes and full resource accounting, then lazy typed channel storage and pooling, then versioned dependency/GPU-output sharing and incremental folder composition. Apply the same engine rules to all node families. Bounded tiled authoring follows after those simpler improvements are verified.
