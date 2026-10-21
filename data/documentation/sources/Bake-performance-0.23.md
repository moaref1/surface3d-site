# 4K baking: implemented improvements and the remaining bottleneck

## What the public references establish

[Painter's official system requirements](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/getting-started/system-requirements) document GPU baking through OptiX or DXR and recommend dedicated ray-tracing cores for best performance. [Toolbag's official baking page](https://marmoset.co/toolbag/baking/) documents GPU-accelerated interactive baking, preview and UV padding. Neither reference discloses the complete private bake implementation. Surface3D does not use their binaries, shaders or installed assets.

[Painter's bake troubleshooting](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/technical-issues/stability-issues/crash-while-baking) also describes preprocessed high-poly mesh caching. Surface3D already caches its own high-mesh BVH and supports per-map dependency checks and Bake changed. The comparisons below concern public behavior and Surface3D's measured implementation, not reverse-engineered internals.

## Implemented in this build

- Accept actual 4096 images, editing/graph resolution, all ten bake maps, persistence and texture export. Completed maps retain their full resolution.
- Preserve coverage and triangle ownership without constructing two unused float4 geometry maps: exactly 512 MiB avoided at 4K.
- Retain a bounded 256-square live preview while completed output retains 4096 dimensions.
- Precompute the exact hemisphere sample sequence; construct each texel's tangent basis once per ray family; precompute curvature sampling offsets. Skip arithmetic for maps not requested. These preserve sample order and quality controls.
- Count selected maps in multi-set batch storage estimates. Respect the configurable image budget instead of fixed 2K assumptions.
- Allocate GPU paint-effect channels only on demand. One node preview allocates one float4 result, rather than a complete seven-channel material set. Preserve existing precision and compositing semantics.
- Add a real 4K acceptance case covering every bake map, native GPU graph evaluation, project roundtrip and 16-bit PNG/TIFF/EXR dimensions and pixels.

The retained 256px demo-pipe fixture, AO/curvature/bent-normal, 32 rays and 8px padding, changed from 2780.12 to 2600.05 ms in serial cold execution and 424.486 to 395.921 ms in cached ten-worker execution. That is approximately 6.5–6.7% in this fixture. CPU scheduling and thermal/driver conditions affect throughput. The 4K two-triangle analytic fixture verifies correctness and allocation limits; representative high-poly benchmarks remain open.

The supplied `Untitled.fbx` low cube (12 triangles) and `Untitled2.fbx` high source (3200 triangles) also completed at 4096, four AA samples, tangent normal/coverage and 8px padding. With fitted front 0.002/rear 0.0329107 distances, projection took 2394.2 ms and reported 30,862,944 hits with zero misses. Default-distance face/smoothed projection retained misses, demonstrating the need to fit the cage. This is one supplied asset and two maps; it is not an all-map/high-sample throughput comparison with another product. Input files were only read. The normal atlas was inspected visually; full metrics and project are in `work/Cube-4K-0.23`.

## Why high-resolution baking is still expensive

4K contains four times as many texels as 2K. Supersampling multiplies primary rays; AO/thickness/bent-normal quality multiplies secondary rays. A larger cage or ray distance can increase candidate geometry. Tracing/transport accounts for most of the measured bake time.

Surface3D's primary UV-to-high-surface projection still runs on the CPU. D3D11 compute can trace selected secondary work, but packets still read back synchronously. Whole-atlas storage remains. Removing repeated arithmetic and allocations helps; it does not turn this design into a primary hardware-ray-tracing baker.

## Next implementation order

1. Record per-stage ray counts, cache hits, CPU work, GPU work, waiting and output bytes on representative supplied meshes. Benchmark cold/warm runs with identical maps, samples, cage, padding and image precision.
2. Implement primary projection in a portable GPU compute backend with the existing watertight CPU intersection path as its correctness reference. Keep a CPU fallback and cancellation. Verify thin triangles, mirrored UVs, overlapping charts, sharp corners, cage continuity and front/rear distances before enabling it by default.
3. Keep hit data and map accumulation resident between GPU passes. Reuse low-UV rasterization, high-mesh acceleration and cage data across maps. Use queued bounded transfers for preview and final output instead of waiting on each secondary packet.
4. Add a capability-selected D3D12/DXR backend for supported adapters. Share bake job/map semantics with compute and CPU paths. DXR availability is a capability, not a guarantee of driver compatibility or bake quality. Expose the actual backend and fallback reason.
5. Process output in bounded tiles, with sufficient neighborhoods for seam repair/dilation; avoid simultaneously resident unused outputs. Add memory admission, resumable/cancellable background export and higher-precision bake generation.
6. Only after independent oracle and representative-mesh checks: adaptive secondary samples or denoising. Do not smooth normal/cage errors away, alter tangent conventions, contaminate separate islands or claim denoising replaces correct projection.

## Artist controls

Use Check projection while fitting a cage, then Bake changed for a map-only adjustment. Source/cage/resolution changes invalidate all affected maps. Keep bake resolution independent of interactive texture-set resolution. Choose final samples deliberately and show the real map/backend/progress. Existing saved import-size/image-budget preferences remain active; new defaults are 4096 and 1024 MiB. The source-image budget is separate from GPU allocations.

Current bake maps are RGBA8. Higher-bit-depth texture export is supported, but an export container cannot recover precision absent from the bake. Full high-poly/high-AA 4K quality, other GPU vendors and low-memory devices still need production acceptance.
