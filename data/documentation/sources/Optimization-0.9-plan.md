# Bake and resource iteration

The existing 0.8 release remains available. Baseline: 24/24 checks pass on the native host; restricted-window/atomic-save checks require the native execution permission. This is original code plus licensed public libraries.

## This iteration

- [x] Integrate pinned MikkTSpace into baking and mesh preview without changing stored mesh vertices.
- [x] Cache immutable ray acceleration across parameter edits; bound cache ownership and validate keys.
- [x] Parallelize independent bake rows with deterministic output, cancellation and joined workers.
- [x] Replace per-padding-pass full-map copies with a bounded frontier and scratch updates.
- [x] Measure cold/repeated bake stages and cache storage in a reproducible benchmark.
- [x] Reuse unchanged maps when rebaking map-specific settings; keep obsolete/cancelled jobs atomic.
- [x] Reduce eligible GPU texture precision with capability detection, full-precision fallback and pixel regression checks.
- [x] Count actual allocated texture formats and expose OS GPU usage/budget separately.
- [x] Reuse readback resources, generate interactive mask thumbnails on the GPU and trim unused spatial fields.
- [x] Simplify Bake into Meshes, Projection, Maps and Results; use ImGui docking and Lucide icons with hover explanations.
- [x] Add a real GPU secondary-map backend with bounded packets, an independent context, CPU comparisons, cancellation and CPU fallback.
- [x] Use EmberGen pane roles as UI inspiration; neutral surfaces, viewport above graph, properties right and optional asset presets.
- [x] Make new fills start without masks/templates; persist absent/explicit masks and test native add/remove/undo/redo.
- [x] Build, run numerical/native interaction checks, review actual screenshots twice and package 0.9. All 28 development checks and five delivered-executable checks pass; the artist asset/hardware checklist remains separate.

## Subsequent engine work

Painted per-group cage offset/skew, GPU primary projection / DXR backend, 16-bit/float bake files, fully tiled authoring/UDIM, channel-aware layer allocation and cancellable background texture export remain separate architectural steps. Do not claim those exist until executable and tested. Validate Blender/Unreal assets before claiming interchange certification.

## Evidence

Compare the same fixture, settings and adapter. Record texture payload bytes separately from OS usage; record preparation, tracing and padding milliseconds separately from functional-suite duration. No extrapolated FPS or production speed promises.
