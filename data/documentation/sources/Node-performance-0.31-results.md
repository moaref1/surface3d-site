# Surface3D 0.31 — Ceramic / Plane node-delay audit

October 12, 2026. Tested on NVIDIA GeForce RTX 5050. Original projects in Downloads were loaded read-only; all edited graphs were in-memory diagnostic copies.

## Projects

- **ceramice.s3d:** authored 2K, 242 triangles, two layers, 32 expanded nodes, no embedded textures or bound mesh maps.
- **Plane.s3d:** authored 2K, active Tires set, 9,984 triangles, 10 layers, two folders, 23 effects, 148 expanded nodes and 12,711 painting dabs. Nineteen embedded textures; supplied baked maps are 2K. Other sets are inventoried in the accompanying evidence.

## What was measured

100 distinct useful node kinds on **each project's geometry and available texture/map data**. The controlled graph has shared noise/checker inputs, a Blur, branching Levels/Invert/Blend, normal conversion and a downstream merge/output. Each case records cold start, unchanged evaluation, three numeric edits, upstream edits and downstream edits. Normal Invert/Normalize use the upstream-change measurement in the ranking because their synthetic numeric parameter is not an artist-facing strength control.

The original project graphs were also exercised separately. Those rows are not mixed into the controlled-node ranking: real graphs have different reachability and dependencies. Some legacy nodes lack parameter metadata; controlled fallback edits use parameter 0, with validation. A parameterless/no-op edit is not evidence of that operator's algorithm cost. Cold shader compilation and initial allocations are separate from warm edits. Startup timeouts during shader integration were rerun; complete reruns replace those samples.

**Completed time includes a full diagnostic GPU readback.** It is graph completion, not an isolated per-node GPU timestamp or a direct FPS measurement. **Submit time** is time spent synchronously in evaluation/submission; it includes any blocking internal readback. Interactive mode waits for background results, then compares every color component against the synchronous cache-reference path. Final quality remains full resolution; these measurements do not rely on a lower-resolution draft.

## Fixes delivered

- ✅ Bevel / Distance Field retain exact distance analysis when radius, profile or strength changes. Input, threshold, boundary, outside-distance requirements and resolution still invalidate it.
- ✅ Normal to Height retains its solved scalar field for strength changes; input and solver changes still recompute.
- ✅ Sharpen runs the existing separable Gaussian unsharp-mask algorithm on the GPU. Threshold, amount, alpha handling and normal normalization are retained.
- ✅ Reaction Diffusion runs the existing Gray–Scott iterations on the GPU with the same iteration count and boundary rules.
- ✅ CPU filters reuse boundary coordinates; advanced image sampling skips unnecessary wrap calculations for in-bounds samples. Periodic seam correction reuses axis coefficients.
- ✅ Edited effects restore an evaluated prefix instead of replaying unchanged painting and earlier effects. The edited layer's checkpoint is preferred over dependent layers.
- ✅ Pure spatial branches no longer inherit unrelated layer painting/effect dependencies in their cache keys. Context-dependent Input nodes retain their dependencies.
- ✅ Background CPU recipe processing is bounded to two active jobs. Descendants wait for valid parent results; superseded results are not published as current work.
- ✅ Background completion invalidates the affected layer and dependent fields, not all layers. Completed results are bounded independently of an older active job.
- ✅ New filter shaders use separate modules, so adding them does not invalidate the shared shader source/cache. Numeric Levels edits do not change custom shader source, ports or variant identity and should not compile code.

## Memory bounds and remaining limits

Distance analysis: up to 256 MiB CPU cache. Height solutions: up to 128 MiB CPU cache. Completed background results: at most four entries / 512 MiB. CPU image jobs: at most two active jobs, with advanced image input captures bounded to 512 MiB per job. Oversized captures use the synchronous path. The single GPU effect checkpoint is capped at 256 MiB and checked against the current adapter budget; it can be skipped at 4K. GPU filter scratch is reused and included in allocation reporting.

Some full-resolution CPU recipes still take hundreds of milliseconds or more to **finish**, particularly HQ normal integration, patch quilting and scan cleanup. Background scheduling improves interface responsiveness, not the mathematics' instantaneous completion time. First edits may need to establish a checkpoint, and edits to genuinely shared inputs still recompute their dependents. Hardware/driver differences and normal desktop activity affect timings; three edit samples establish a local comparison, not universal certification. Full 8K authoring is not established by this audit.

## 100-node ranking — 2K

Sorted by the slower before-edit median across the two controlled projects. Values are milliseconds. “UI submit” is the interactive initial submission; final completion still includes background work and readback. Full phase data are in `100-node-ranking.csv` and raw TSV files.

| # | Node | Ceramic before → after | Plane before → after | Ceramic UI submit | Plane UI submit |
|---|---|---:|---:|---:|---:|
| 1 | Reaction Diffusion | 14055.80 → 175.61 | 14671.60 → 175.09 | 0.43 | 1.08 |
| 2 | Normal to Height | 5071.82 → 80.49 | 5890.80 → 82.58 | 22.69 | 22.69 |
| 3 | Normal to Height HQ | 2588.46 → 1072.70 | 3601.40 → 1087.15 | 4.64 | 5.30 |
| 4 | Sharpen | 1997.52 → 68.25 | 2025.45 → 66.39 | 0.35 | 1.04 |
| 5 | Make It Tile Patch | 1394.38 → 863.07 | 1130.59 → 851.39 | 4.28 | 15.95 |
| 6 | Smart Auto Tile | 1370.37 → 835.84 | 1119.20 → 858.77 | 4.32 | 8.69 |
| 7 | Make It Tile Photo | 800.59 → 464.33 | 615.07 → 296.05 | 24.65 | 51.02 |
| 8 | Shape Style | 566.51 → 560.53 | 539.83 → 615.98 | 5.85 | 5.01 |
| 9 | Lighting Cancellation | 529.96 → 343.11 | 481.55 → 340.25 | 4.46 | 10.58 |
| 10 | Color Equalizer | 513.02 → 344.70 | 487.87 → 335.69 | 4.58 | 7.88 |
| 11 | Bevel | 328.15 → 90.50 | 281.98 → 91.30 | 35.98 | 37.86 |
| 12 | Distance Field | 320.19 → 76.53 | 274.45 → 78.36 | 22.86 | 24.12 |
| 13 | Auto Crop | 196.22 → 237.57 | 203.56 → 219.17 | 150.14 | 216.76 |
| 14 | Flood Fill | 130.65 → 147.12 | 141.23 → 148.37 | 31.43 | 30.46 |
| 15 | Auto Levels | 139.11 → 146.44 | 138.10 → 125.68 | 4.35 | 22.74 |
| 16 | Blue Noise / Progressive | 109.01 → 527.48 | 110.41 → 121.64 | 62.05 | 72.89 |
| 17 | Tile Sampler | 80.82 → 132.51 | 86.54 → 135.47 | 0.50 | 1.06 |
| 18 | High pass | 49.64 → 78.08 | 73.73 → 80.03 | 0.31 | 0.99 |
| 19 | Dilate / Erode | 41.80 → 59.94 | 60.72 → 58.40 | 0.30 | 0.97 |
| 20 | Height AO | 58.55 → 90.24 | 59.07 → 90.50 | 0.29 | 1.96 |
| 21 | Edge Detect | 41.82 → 51.68 | 55.09 → 52.31 | 0.36 | 0.97 |
| 22 | Non-uniform blur | 51.38 → 76.78 | 53.16 → 78.85 | 0.41 | 1.08 |
| 23 | Non-Uniform Rotation | 51.57 → 52.99 | 42.76 → 46.68 | 0.25 | 3.62 |
| 24 | Normal normalize | 47.77 → 71.17 | 50.70 → 51.60 | 0.32 | 1.07 |
| 25 | Normal invert | 48.51 → 79.38 | 50.16 → 51.22 | 0.33 | 1.08 |
| 26 | Height to Normal / World Units | 49.96 → 66.25 | 47.31 → 55.59 | 0.46 | 1.18 |
| 27 | Curvature | 48.62 → 70.19 | 49.82 → 59.28 | 0.50 | 1.23 |
| 28 | Normal Sobel | 47.83 → 67.02 | 49.59 → 46.94 | 0.46 | 1.35 |
| 29 | 3D Simplex | 43.98 → 43.43 | 49.57 → 63.61 | 0.29 | 0.99 |
| 30 | Normal Transform | 46.41 → 66.54 | 48.50 → 47.79 | 0.33 | 1.03 |
| 31 | Blur | 44.89 → 65.70 | 47.59 → 66.91 | 0.39 | 1.04 |
| 32 | Polar Transform | 45.11 → 61.25 | 46.64 → 44.77 | 0.26 | 3.27 |
| 33 | Flood Fill Mapper | 43.55 → 55.31 | 45.98 → 56.36 | 0.31 | 1.10 |
| 34 | Color Math | 45.95 → 49.14 | 42.61 → 39.29 | 0.28 | 1.01 |
| 35 | Dirt Noise | 42.37 → 45.73 | 45.93 → 56.69 | 0.31 | 1.01 |
| 36 | Quad Transform | 45.15 → 60.58 | 45.92 → 49.20 | 0.25 | 1.44 |
| 37 | Radial Blur | 43.40 → 59.93 | 45.81 → 60.61 | 0.29 | 1.01 |
| 38 | Grunge Noise | 45.66 → 41.00 | 41.28 → 55.79 | 0.29 | 1.00 |
| 39 | 3D Voronoi fractal | 43.98 → 43.50 | 44.44 → 63.26 | 0.27 | 1.01 |
| 40 | Gamma | 41.65 → 48.70 | 44.41 → 38.57 | 0.30 | 1.13 |
| 41 | Cells Noise | 44.26 → 40.61 | 42.89 → 53.85 | 0.32 | 0.98 |
| 42 | Slope Blur | 42.86 → 58.26 | 43.78 → 58.13 | 0.31 | 0.99 |
| 43 | Vector Morph | 41.03 → 52.63 | 43.72 → 40.05 | 0.24 | 1.28 |
| 44 | Noise Upscale | 42.76 → 55.69 | 43.46 → 43.38 | 0.25 | 1.45 |
| 45 | Histogram range | 43.44 → 48.59 | 40.62 → 41.87 | 0.27 | 2.10 |
| 46 | Map Range | 43.21 → 49.11 | 41.02 → 39.22 | 0.31 | 1.26 |
| 47 | Replace Color | 43.16 → 49.35 | 40.14 → 39.26 | 0.28 | 1.00 |
| 48 | Fractal Sum | 41.37 → 40.24 | 43.02 → 55.44 | 0.27 | 0.99 |
| 49 | Brightness / contrast | 40.66 → 49.48 | 42.98 → 40.64 | 0.29 | 1.12 |
| 50 | Height to Normal | 41.56 → 53.44 | 42.83 → 41.47 | 0.29 | 1.02 |
| 51 | Curvature from Normal | 40.56 → 54.19 | 42.82 → 723.63 | 0.29 | 1.28 |
| 52 | Vector warp | 39.84 → 51.54 | 42.69 → 38.68 | 0.24 | 1.46 |
| 53 | Blend | 42.49 → 49.43 | 41.01 → 39.37 | 0.29 | 1.46 |
| 54 | Height Blend | 42.43 → 53.06 | 40.78 → 39.34 | 0.27 | 0.98 |
| 55 | BnW Spots | 41.31 → 40.85 | 42.42 → 55.56 | 0.34 | 1.00 |
| 56 | Transform 2D | 39.59 → 49.52 | 42.37 → 39.38 | 0.24 | 1.28 |
| 57 | Sample Texture | 39.61 → 52.88 | 42.30 → 40.92 | 0.34 | 1.02 |
| 58 | Shape / SDF | 40.05 → 38.24 | 42.25 → 51.35 | 0.28 | 1.00 |
| 59 | Normal Blend | 38.87 → 52.71 | 42.11 → 40.89 | 0.47 | 0.99 |
| 60 | Color to Mask | 42.09 → 48.46 | 40.60 → 38.96 | 0.26 | 1.06 |
| 61 | Fur Noise | 41.13 → 40.70 | 41.82 → 55.74 | 0.33 | 1.02 |
| 62 | Vector Warp | 39.32 → 50.43 | 41.72 → 38.70 | 0.23 | 1.40 |
| 63 | Directional Noise | 41.23 → 45.66 | 41.65 → 55.23 | 0.30 | 1.00 |
| 64 | 3D Voronoi | 41.55 → 38.94 | 41.02 → 54.28 | 0.30 | 1.11 |
| 65 | Directional blur | 40.96 → 53.59 | 41.53 → 54.16 | 0.30 | 1.05 |
| 66 | 3D Perlin Noise | 39.97 → 350.45 | 41.37 → 53.14 | 0.32 | 1.03 |
| 67 | Pattern Shapes | 38.50 → 445.29 | 41.36 → 52.67 | 0.39 | 1.02 |
| 68 | AO Cancellation | 41.27 → 48.76 | 39.87 → 39.01 | 0.27 | 1.10 |
| 69 | Exposure | 37.47 → 48.84 | 41.26 → 38.30 | 0.29 | 1.01 |
| 70 | Tile Pattern | 38.14 → 38.44 | 41.13 → 52.14 | 0.28 | 0.97 |
| 71 | Advanced Warp | 39.70 → 50.44 | 41.08 → 39.67 | 0.23 | 1.51 |
| 72 | Levels | 40.27 → 48.48 | 41.08 → 45.03 | 0.29 | 1.61 |
| 73 | Float Curve | 40.14 → 50.07 | 41.08 → 38.92 | 0.30 | 1.02 |
| 74 | Color ramp | 39.33 → 48.08 | 40.94 → 38.23 | 0.27 | 1.19 |
| 75 | Messy Fibers | 40.85 → 822.44 | 40.92 → 57.41 | 0.30 | 1.01 |
| 76 | Histogram scan | 37.84 → 48.37 | 40.90 → 41.76 | 0.22 | 1.02 |
| 77 | Brick Texture | 38.63 → 244.18 | 40.65 → 52.10 | 0.28 | 1.18 |
| 78 | Normal Map | 38.58 → 49.72 | 40.65 → 39.38 | 0.27 | 1.00 |
| 79 | Histogram Shift | 40.59 → 49.42 | 40.59 → 38.54 | 0.28 | 1.12 |
| 80 | Histogram select | 38.54 → 49.15 | 40.52 → 41.79 | 0.31 | 3.07 |
| 81 | Noise / Patterns | 40.44 → 38.63 | 38.27 → 51.57 | 0.27 | 1.02 |
| 82 | Voronoi | 40.41 → 38.76 | 39.93 → 50.95 | 0.30 | 1.05 |
| 83 | Make tileable | 38.41 → 51.23 | 40.41 → 43.12 | 0.29 | 1.02 |
| 84 | Offset | 39.08 → 51.96 | 40.39 → 43.88 | 0.34 | 1.02 |
| 85 | Gradient | 37.49 → 310.39 | 40.35 → 52.34 | 0.29 | 0.98 |
| 86 | Wave | 37.28 → 675.47 | 40.17 → 52.37 | 0.27 | 0.99 |
| 87 | Checker | 39.45 → 259.14 | 40.12 → 52.31 | 0.27 | 0.96 |
| 88 | Directional Warp | 39.04 → 49.71 | 40.02 → 38.09 | 0.21 | 1.69 |
| 89 | Fractal noise | 38.58 → 742.68 | 40.02 → 51.92 | 0.31 | 1.01 |
| 90 | Channel Mixer | 39.18 → 48.45 | 39.99 → 39.07 | 0.27 | 1.07 |
| 91 | Crop | 39.34 → 48.98 | 39.93 → 40.74 | 0.23 | 2.70 |
| 92 | Hue Saturation Value | 39.14 → 48.96 | 39.90 → 38.99 | 0.27 | 1.15 |
| 93 | Math | 39.72 → 48.15 | 39.80 → 39.33 | 0.32 | 1.02 |
| 94 | Gabor Texture | 39.79 → 38.79 | 39.38 → 51.50 | 0.31 | 1.00 |
| 95 | RGB to grayscale | 39.58 → 49.58 | 39.77 → 38.88 | 0.29 | 1.01 |
| 96 | Specialty Noise | 39.76 → 44.90 | 38.07 → 54.57 | 0.29 | 0.99 |
| 97 | Histogram Scan Non-Uniform | 39.02 → 48.35 | 39.69 → 39.66 | 0.27 | 1.36 |
| 98 | Clamp | 38.77 → 48.75 | 39.63 → 38.27 | 0.40 | 1.11 |
| 99 | 3D Gradient | 38.96 → 229.45 | 39.57 → 53.10 | 0.28 | 0.97 |
| 100 | Noise | 38.10 → 742.25 | 39.46 → 51.79 | 0.56 | 1.16 |

## Selected 4K comparisons

| Project | Node | Completed before → after (ms) | Submit before → after (ms) |
|---|---|---:|---:|
| ceramice | Bevel | 5917.97 → 444.89 | 2791.41 → 204.21 |
| ceramice | Sharpen | 8176.89 → 254.21 | 7814.66 → 0.28 |
| ceramice | Normal to Height | 20504.50 → 390.74 | 20188.50 → 138.57 |
| Plane | Bevel | 1443.71 → 402.28 | 1158.13 → 209.63 |
| Plane | Sharpen | 8249.43 → 181.84 | 7954.98 → 1.03 |
| Plane | Normal to Height | 23552.00 → 432.99 | 20532.50 → 163.22 |

## Verification and evidence

- All 100 kinds on both projects completed controlled 2K runs without operator errors.
- All 100 kinds on both projects completed interactive 2K runs with no cache-reference pixel mismatches.
- A separate 256-pixel, 100-kind reference pass checked own, upstream, downstream and downstream Levels effect edits.
- Exact CPU comparisons cover optimized filters and scan-processing paths. GPU Sharpen/Reaction checks compare against the CPU algorithm, including boundary modes. Tests also cover distance/height cache invalidation, effect-prefix composition and rapid-edit asynchronous dependency chains with an unrelated-layer replay guard.
- `build-023/node-delay31-final-build-tests.log`: affected regression build/check record.
- `build-023/node-delay31-exact-tests.log`: CPU/GPU errors and focused contracts.
- `work/node-delay31/`: original-project inventories, per-phase measurements, rerun records and the 200-row CSV.

The audit does not claim all nodes were rewritten, complete Designer parity, zero latency or a new baking speedup. The measured improvements are texturing/evaluation changes.

## Final build and next work

Final affected regression suite: **15/15 passed**, 233.28 seconds. Portable version: `releases/Surface3D-0.31-node-performance/Surface3D.exe`. Keep the entire folder.

1. Accelerate HQ normal reconstruction, patch quilting and scan recipes; background scheduling improves responsiveness but does not eliminate completion time.
2. Reduce full-resolution 4K memory pressure with channel-aware reuse and tiled processing; oversized jobs/checkpoints still fall back.
3. Extend measurements to Custom HLSL compilation, brush workloads, all remaining node kinds and other GPU vendors.
4. Recheck complex projects under sustained editing, rather than assuming single-node benchmarks remove every stutter.
5. Full Designer parity, 400 finished assets and production-ready 8K remain unfinished.
