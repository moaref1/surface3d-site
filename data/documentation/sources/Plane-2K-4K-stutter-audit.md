# Plane 2K/4K stutter audit — 2026-10-11

## Scope and method

Read-only runs of C:/Users/pouya/Downloads/Plane.s3d on NVIDIA GeForce RTX 5050. Original project was never saved. Active set: Biplane_Mtl_Tires, 9,984 triangles, 7 layers, 1 folder, 13 effects, 96 expanded nodes and 9,860 paint dabs including effect paint. Existing baked/source textures stayed at their original resolution (mostly 2K); evaluation buffers ran at 2K or 4K. This tests texturing evaluation, not new 4K baking.

Expanded tools/project_profile.cpp with --audit (all layer opacities and eight representative existing node kinds), --operators (synthetic Fractal Noise feeding Blur, Edge Detect, or HLSL in a replacement layer), and --validation (isolated payload validation). Only diagnostic code changed; no new app performance fix in this turn. The logger concurrency check passed after rebuilding the profiler.

Each completed measurement includes an explicit GPU readback to ensure pixels finished. Submission is measured separately. Completion timings are not viewport FPS and include copying pixels to CPU. GPU timestamp intervals are inclusive and may include submission gaps; they cannot be summed as exclusive shader costs. Runs were sequential, single samples per case except validation. Cache, scheduling and residency introduce variability. No live UI camera-rotation/frame-pacing test was performed.

## Measured comparison

| Operation | 2K | 4K |
|---|---:|---:|
| Initial evaluation + readback, audit run | 545 ms | 6,525 ms |
| Unchanged rebuild submission | 21.4 ms | 22.5 ms |
| Unchanged completion + readback | 50.8 ms | 152.7 ms |
| Levels gamma edit, completion + readback | 80.8 ms | 1,413 ms |
| Each of 7 layer opacity edits, completion + readback | 69.6–73.9 ms | 356.8–953.3 ms |
| First Blend node preview, submission | 172.2 ms | 977.1 ms |
| First Blend preview, completion + readback | 250.8 ms | 2,348.5 ms |
| Dirt Noise scale edit, completion + readback | 96.6 ms | 945.4 ms |
| Fractal Noise edit, completion + readback | 69.4 ms | 772.4 ms |
| Noise/Patterns edit, completion + readback | 69.4 ms | 697.7 ms |
| Base estimated allocated textures | 2,555.9 MiB | 9,803.9 MiB |
| Peak during tested node previews | 2,779.9 MiB | 10,699.9 MiB |

Eight existing node kinds tested: Coordinates, Image Color, Image Value, Blend, Mesh Map, Noise, Fractal Noise, Noise/Patterns. Repeated unchanged previews correctly avoided layer replay; first selection replayed one owning layer (first Coordinates case replayed two because an earlier diagnostic dab also dirtied a layer).

Synthetic filter/HLSL tests used the Plane's other layers plus one replacement test layer, not the original artist graph:

| Synthetic operation | 2K completion + readback | 4K completion + readback |
|---|---:|---:|
| First Blur insertion | 133.7 ms | 1,275.3 ms |
| Noise parameter edit feeding Blur | 77.9 ms | 883.6 ms |
| First Edge Detect insertion | 75.3 ms | 859.6 ms |
| Noise parameter edit feeding Edge Detect | 75.3 ms | 872.1 ms |
| First simple HLSL insertion | 3,430.0 ms (uncached compile) | 767.7 ms (disk cache warmed by 2K run) |
| Parameter edit feeding cached HLSL | 77.3 ms | 751.0 ms |

HLSL 2K submission was 3,215.4 ms; the trace records procedural shader compile at 3,187.7 ms inside HLSL lookup/compile at 3,193.1 ms. The HLSL code was simply `return In * 0.9;`. The 4K test reused that compiled variant, so it is not a cold compilation comparison.

## Causes supported by measurements and code

1. **Synchronous HLSL compilation blocks authoring.** Renderer::customShader compiles cache misses during evaluation. Code/graph variant changes can miss the cache even when the desired math is small. This directly reproduced a three-second calling-thread stall. Fix: precompile asynchronously and publish only completed valid variants; preserve last valid result during compilation, with cancellation/coalescing. Reduce variant churn and cache by stable shader dependencies.

2. **Repeated validation of unchanged float textures adds a persistent CPU floor.** Document::validate calls TextureAsset::validate, which scans every float pixel for finiteness/range. Five original-payload runs: 18.9–20.7 ms. Five diagnostic RGBA8-only copies: 3.95–4.17 ms. This diagnostic removed float payloads only in a private copy, not a recommended quality reduction. Fix: validate immutable payloads once by revision/identity, then validate only changed document sections. Retain full validation at import/load and safe publication boundaries.

3. **4K buffers exceed the available residency budget.** Approximately 9.57 GiB base estimated allocation and 10.45 GiB during Blend preview versus reported local budget ~6.97 GiB. Dominant base allocations: layers 2,752 MiB, scratch/paint 2,496 MiB, composite 2,048 MiB, shared neutrals 1,024 MiB, geometry/seams 640 MiB, graph fields 512 MiB. Source/baked maps are only ~140 MiB. Allocation estimates are not identical to resident VRAM; DXGI usage fluctuated sharply, so specific eviction events are not proven without an external residency trace. The budget excess and disproportionate slowdown strongly indicate residency/bandwidth pressure. Compact storage was already enabled by default; explicitly enabling it repeated the same allocation total. It is not a new optimization or valid compact-versus-full comparison.

4. **Preview selection forces owning-layer replay.** selectNodePreview sets forceReplayLayer_; rebuild clears/re-evaluates the layer and loops over its paint effect dabs. Blend preview on layer 38 spends ~170 ms CPU in Layer replay at 2K despite the preview GPU interval being only ~5.4 ms. The 512 control still has ~128 ms submission for that preview, confirming a substantial CPU replay cost independent of high texture resolution. Fix: preview the requested dependency branch from cached layer inputs without replaying unrelated paint; preserve revisioned paint checkpoints.

5. **Small composition edits still process the complete stack.** Opacity edits correctly run zero graph dispatches and zero layer replays, but process 7 x resolution squared composite pixels: 29,360,128 at 2K and 117,440,512 at 4K. Fix: cache stack prefixes / folder boundaries and recomposite only affected ranges; damage tracking for brush edits.

6. **Readback is a synchronization bottleneck when used interactively.** Explicit readbacks in this harness expose queued GPU work and copies; they do not prove the viewport normally reads back every frame. Audit totals: 37 requests / 1,792 MiB at 2K versus 7,168 MiB at 4K. Fix any UI-dependent readback callers with deferred staging rings/downsampled diagnostics; retain synchronous barriers only where final export correctness needs them.

## Lower-resolution control

Same Plane at 512 evaluation, retaining original 2K imported/baked assets: base allocations 290.9 MiB, layer opacity completions 25.2–26.3 ms, Noise edit 28.9 ms, Fractal Noise 27.1 ms, Noise/Patterns 25.7 ms. GPU work shrinks strongly, but ~22 ms submission remains due to validation. This is a fixed working-resolution control, not a complete tested automatic mip-switching policy. The paint-heavy Blend preview still takes 131.3 ms completed, exposing replay overhead that mipmaps alone do not solve.

## Recommended implementation order

1. Revision-based immutable texture validation and scoped document validation.
2. Async/coalesced HLSL cache-miss compilation without stale-result publication.
3. Branch-only node previews and paint checkpoint reuse.
4. Remove oversized neutral/channel buffers; lazily allocate channel-aware scratch and recycle transient fields against the actual GPU budget.
5. Incremental composition with folder/prefix caches and damaged regions.
6. Responsive lower-resolution edits with background full-resolution settlement, avoiding whole-buffer reconstruction per drag.
7. Deferred readbacks only where needed; then measure actual UI frame-time distributions for Paint, Graph and Rendering.

## Evidence files

- Plane-2K-layer-node-audit.txt and .tsv
- Plane-4K-layer-node-audit.txt and .tsv
- Plane-2K-operators.txt and .tsv
- Plane-4K-operators.txt and .tsv
- Plane-validation-isolation.txt
- Plane-512-working-preview-audit.txt and .tsv
- Plane-4K-compact-audit.txt and .tsv (repeat with already-enabled setting)
