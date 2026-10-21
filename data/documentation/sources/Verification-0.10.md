# Surface3D 0.10 verification

Verified 2026-10-08 on Windows / Direct3D 11 / NVIDIA GeForce RTX 5050. All **30 development checks passed** with the final application and shader source. The complete final suite took 123.89 seconds. The first surface-workflow check took 83.39 seconds and included cold general-shader compilation; this is not a bake/per-frame time. Custom-HLSL checks took 5.07 seconds; native texture/coordinate/brush interactions took 5.14 seconds. These are ordered fixture wall times, not isolated compile/GPU-kernel benchmarks.

Build: build-native/Surface3D-0.10.exe. Delivery: releases/Surface3D-0.10/Surface3D.exe. The package's Verification.md records delivered-process acceptance, byte-identical executable/shaders and its hash. CMake metadata was updated after the suite; confirming the build reported no work, so the tested executable remained identical.

All **nine packaged checks passed**: Plain prop, reusable graph, Custom coating, native shader/bake/export authoring, native plain fills/GPU bake, native texture routing/coordinates/brushes, Weathered pipe, Automatic maps and Fitted cube. Each used the actual copied executable, exited 0, produced an empty error log, a real editor PNG and successful behavioral assertions. Executable/shader hashes match the tested build/source. The packaged report and verification-evidence/Final retain the results.

## New behavior checked

| Area | Behavioral evidence |
| --- | --- |
| Shared coordinates | Two textures share vector coordinates; explicit Fill coordinates equals implicit fill transforms pixel for pixel |
| Per-image sampling | Negative repeat/mirror, independent clamp, inherited layer wrap, nearest sampling and local rotation have asserted GPU results |
| Automatic maps | Publishing inserts no unsolicited graph/layer; saved DirectX normal is applied; AO is applied/multiplied; flat layer normal preserves the baked base through RNM |
| Semantic rebake | AO Mesh map node follows rebake; normal and AO image IDs remain stable; map bindings/convention round-trip |
| Weathering | Nonempty nonsolid rain pattern, deterministic replay, seed variation, different ground/stroke-origin dirt, AO cavity response and exact schema 11 replay |
| Added numerical nodes | Histogram scan/range/select, Levels, polymorphic multiply Blend, uniform-field filtering/high pass, normal axis/normalization, cached vector displacement and seeded 3D noise changes |
| Geometric cage | Duplicate cube positions receive identical welded directions; inset-cube fit recovers all fixture misses; original/shading mesh remains unchanged |
| Native UI | Actual image drag to canvas/material/mask; Custom HLSL search; popup-safe mouse/grid placement; attraction outside ordinary pin hit radius; Space preview/restore; Rain/Dirt menu selection; conflicting widget ID checks |
| Retained behavior | CPU/GPU bake comparison, cancellation/cache invalidation, Mikk frames, mask/effect/anchor stacks, imports/navigation, texture graph/spatial inputs, shared assets, custom shader editing/rollback, compact GPU storage/dirty brush compose and export channel/PNG assertions |

LastTest.log contains 30 Test Passed entries and no Test Failed entries. The package preparation copies it into review-10/after/Full-suite.txt along with actual editor screenshots and concise GPU/native results. These are runtime checks, not merely source inspection.

## Desktop cube reproduction

The original files were read only: Desktop/Untitled.fbx, 12 triangles; Desktop/Untitled2.fbx, 3,200 triangles. Both have group Cube.001; imported scale is 0.0075. SHA-256 values were saved and verified unchanged after diagnosis.

At 256px, four samples and 8px padding, the **undilated hit/miss counts** were:

| Projection | Hits | Misses | Total observed wall time |
| --- | ---: | ---: | ---: |
| Face directions / default range | 114,605 | 6,379 | 15.0532 ms |
| Welded smooth directions / default range | 115,656 | 5,328 | 13.6808 ms |
| Welded directions / fitted front 0.002, rear 0.0329108 | 120,983 | 1 | 15.1476 ms |

Distances are fractions of low bounding-box diagonal. Fitting first probes at 128px, then the separate final check uses 256px. The one missed sample remains a known limitation; do not describe this as a zero-miss or certified production bake. Padding/display smoothness is not the coverage measurement. Timings are a single small normal/opacity fixture, not a high-poly bake benchmark. Source hashes, metrics, Face/Smooth/Fitted coverage/normal PNGs and the embedded Fitted-cube project are in review-10/cube-final.

Both Fitted-cube and Weathered-pipe were opened using the final development app. Each exited 0 with an empty Error.txt, actual editor PNG and successful deterministic project/GPU replay assertions. The second visual review inspected these along with Properties, mask input, shared coordinates, custom search, both brush controls, projection and export screens. [UI review](review-10/UI-review.md) records decisions and remaining layout limits.

## Implementation boundaries

The custom shader compiler now specializes its switch cases by used graph kinds and keys caches by exact active source/settings plus functions/kinds. It retains the general full-library runtime path. Shipping a valid cache prevents the tested warm startup from paying the full cold compile cost; cold compilation remains slow. No measured FPS/percentage speedup is claimed for this iteration. Incomplete compiler experiments remain historical notes in review-10 and are not final benchmarks.

Rain/dirt are deterministic procedural surface patterns, not a particle/flow solver. Weather brushes use position, world/low normals and AO, with a round UV footprint; they do not transport paint between islands or paint normal/height channels. Histogram/blur/noise implementations are bounded original counterparts; Designer algorithm parity is unverified. The catalogue retains 267 planned reference rows, 82 partial rows and 60 backend dependencies, as well as bounded entries and headings.

The 0.9 GPU/memory implementation is retained: secondary map compute, cached/parallel primary CPU work, Mikk frames, half-precision eligible storage, partial simple-brush composition, GPU thumbnails, reusable staging and separate process GPU usage/budget, texture payload and RAM counts. [0.9 measurements](Verification-0.9.md) are historical fixture measurements and were not converted into general performance promises.

Current limits and unfinished production checks are in [the feature guide](Surface3D-0.10-features.md) and [artist checklist](Surface3D-0.10-artist-tests.md). Full Designer/Painter/Blender parity, GPU primary projection/DXR, painted cage/skew, UDIM/high precision, nested executable graphs/multiple outputs and cross-GPU/DPI certification are pending.

## Reproduce

In PowerShell from the source directory: `& .\build.cmd '-DSURFACE_STUDIO_OUTPUT_NAME=Surface3D-0.10'`. The new check is surface_workflow_tests.exe; native surface routing is `--test-surface-input`. cube_bake_diagnostic.exe accepts low.fbx, high.fbx and an evidence folder and writes a fitted review project without editing inputs.

Prepare only a new release with tools/package_release_10.py; run tools/verify_release_10.py against the copied executable; seal using tools/package_release_10.py --seal after acceptance. Older release directories are preserved. Native checks need a Windows process with GPU/window and atomic-save access.
