# Surface3D 0.27.2 — measured Plane texturing performance

Built October 11, 2026. Run `build-023/Surface3D-0.27.2-performance.exe` from its existing build folder, with the adjacent shaders, assets, DLLs and shader-cache. Rebuild with `tools/build_performance272.cmd`. No ZIP was created.

## What changed

- Cache validation of immutable floating-point image payloads by shared ownership. Metadata is checked on every validation; new or explicitly published payloads still receive a complete finite/range scan. Weak cache entries do not keep image memory alive. Long import scans release the cache mutex.
- Share one-texel neutral normal/height, utility and emission resources. Allocate full-size channels only when an actual graph/effect/paint operation needs them. Enabling an untouched channel no longer creates an entire image. Shader reads safely clamp constant resources.
- Promote neutral brush channels to full-size writable images on demand, clearing them to the correct constant rather than copying incompatible resource dimensions.
- Use existing compact intermediate precision for emission buffers too. Authored normal/height stays FP32. Existing compact-texture and shared-neutral preferences remain reversible; source image precision and project resolution are retained.
- Skip owning-layer replay and material composition when previewing an unchanged independent fill graph. Graphs reading layer inputs and effect contexts retain the conservative path.
- Prepare custom HLSL shaders on a background worker. Normal authoring and node-preview paths retain the last valid GPU result while compilation is pending, then evaluate the latest document state. Export waits for the final shader. Errors stop automatic retry. Current document shader variants are pinned against cache eviction.

## Method and actual results

Same downloaded `Plane.s3d`, RTX 5050, active Biplane_Mtl_Tires texture set; full evaluation at 2048 and 4096. Original project was never saved or altered. Embedded source/baked maps retain their existing resolution; these are 4K authoring measurements, not new 4K bakes. Compact textures were already enabled in the baseline. Two final audit runs were performed sequentially, without concurrent profiling/tests.

Times below include GPU completion and synchronous diagnostic pixel readback. They are backend workload timings, **not viewport frame times or FPS**. Baseline is the previous recorded audit, not a repeated statistical population. Final ranges show two runs, not confidence intervals.

| Workload | Before | After |
|---|---:|---:|
| 2K unchanged CPU submission | 21.38 ms | 3.91–4.04 ms |
| 2K Levels edit, completion + readback | 80.85 ms | 55.12–59.35 ms |
| 2K Blend node first preview, completion + readback | 250.77 ms | 31.99–35.05 ms |
| 2K Dirt noise parameter edit | 96.60 ms | 68.47–72.26 ms |
| 2K Fractal noise parameter edit | 69.40 ms | 47.12–47.45 ms |
| 2K Patterns noise parameter edit | 69.36 ms | 43.82–47.25 ms |
| 2K estimated base texture allocation | 2555.88 MiB | 1883.88 MiB |
| 4K Levels edit, completion + readback | 1413.20 ms | 622.08–812.67 ms |
| 4K Blend node first preview | 2348.54 ms | 118.41–133.14 ms |
| 4K Dirt noise parameter edit | 945.45 ms | 574.49–660.28 ms |
| 4K Fractal noise parameter edit | 772.39 ms | 374.89–425.75 ms |
| 4K Patterns noise parameter edit | 697.69 ms | 397.93–464.75 ms |
| 4K estimated base texture allocation | 9803.88 MiB | 7115.88 MiB |

Estimated base allocation fell 26.3% at 2K and 27.4% at 4K. With preview resources, final allocation reaches 1979.88 MiB at 2K / 7499.88 MiB at 4K. This is an accounted texture allocation estimate, not total VRAM or RAM use. DXGI budget on this machine was 7142 MiB; reported DXGI residency is not stable enough across these runs to substitute for allocation accounting.

Synthetic operator edits in a private Plane copy:

| Operator parameter edit | Before 2K | After 2K | Before 4K | After 4K |
|---|---:|---:|---:|---:|
| Blur | 77.86 ms | 52.94 ms | 883.59 ms | 561.84 ms |
| Edge Detect | 75.35 ms | 51.61 ms | 872.05 ms | 527.10 ms |
| Custom HLSL, cached shader | 77.29 ms | 47.23 ms | 750.99 ms | 394.70 ms |

Fresh HLSL fixture uses a distinct scalar operation to force a real compiler cache miss. Background compilation measured **3452 ms**, with authoring-thread request **0.248 ms**. After ready, rebuild submission was **4.16 ms**. Baseline synchronous caller took **3215 ms**, including 3188 ms compilation. Compilation itself did not become faster; the blocking work moved off the authoring thread. Comment-only changes can reuse preprocessed shader cache and were not accepted as cold evidence.

Repeated float-payload document validation fell from approximately 19–21 ms to 1.1–2.0 ms with original high-precision image data retained.

## Quality and verification

Plane 2K comparison against the full-neutral-buffer reference: **zero pixel difference** for Color, Material, Normal/Height, Utility and Emission. Both paths use the same compact precision setting; this does not prove bitwise equivalence to a separate all-FP32 emission path.

**Final release verification: 7/7 focused checks passed in 70.85 seconds.** Focused release regressions cover custom HLSL, per-channel/folder composition, residency and live outputs, normal/height brush promotion, stencil persistence, Designer operator scheduling, contextual UI menus, and process logging/texture validation. Evidence: `build-023/performance-release-verification.log`.

The asynchronous test changes a parameter while compilation is pending and verifies the latest value is published. Cache tests verify replacement NaN payloads and invalid metadata are still rejected.

## Remaining work

- Full-resolution 4K effects remain expensive and previews can exceed this GPU's budget. These changes improve measured work; they do not make all 4K interactions smooth or establish 8K readiness.
- A single opacity/effect edit still recomposites the full layer stack. Incremental stack composition and more scratch reuse are the next major reductions.
- The profiling harness deliberately waits for readback. General asynchronous readback and native viewport frame-pacing measurements remain separate work; harness waits must not be presented as proven per-frame UI waits.
- Rare internal producer/function/legacy preview rebuild paths may still compile synchronously. Normal authoring, node previews and function authoring preparation are covered; a complete call-site conversion is not claimed.
- Cold startup may compile the shared shader variants for minutes if the adjacent cache is absent. Startup compilation was not optimized in this batch.

## Evidence files

- Before: `Plane-2K-layer-node-audit.txt`, `Plane-4K-layer-node-audit.txt`, `Plane-2K-operators.txt`, `Plane-4K-operators.txt` and corresponding TSVs.
- Final audits: `Plane-2048-performance-final1/2.txt`, `Plane-4096-performance-final1/2.txt` and corresponding TSVs.
- Pixel verification: `Plane-2K-performance-final-pixel-comparison.txt`.
- Operators: `Plane-2048-performance-final-operators-async.txt`, `Plane-4096-performance-final-operators-async.txt` and corresponding TSVs.
- Cold HLSL: `Plane-2048-performance-final-operators-cold.txt/.tsv`.
- Validation: `Plane-validation-after-performance.txt`.
- Earlier `performance-run*` and non-async operator results are intermediate/reference paths, not the final UI preparation measurement.
