# Surface3D 0.9 verification and measurements

Verified on 2026-10-08 with Windows, Direct3D 11 and NVIDIA GeForce RTX 5050. All **28 development checks pass**. Build output is `build-native/Surface3D-0.9.exe`; delivered output is `releases/Surface3D-0.9/Surface3D.exe`. The packaged acceptance report separately records actual runs of the delivered executable and its hash.

All **five packaged checks pass**: plain project, reusable graph project, custom HLSL project, native HLSL/bake/export authoring and native plain-layer/GPU-bake interactions. Each exits successfully with an empty error log, a real editor capture and successful behavioral assertions. Executable and shader bytes match the tested build/source. The release's `Verification.md` and `verification-evidence/Final` retain results.

## Correctness evidence

| Area | Checked behavior |
| --- | --- |
| GPU secondary-map bake | AO, bent normals, thickness and curvature execute real compute batches; analytic high/low/cage/name groups, map parameters, backface/self/ground/distribution controls, AA, padding, active cancellation and buffer clear/reuse |
| GPU versus CPU | Primary maps, hit/miss counts and undilated coverage match exactly; secondary maps allow at most two PNG byte levels and observed at most one on the pipe fixture |
| Cached/parallel CPU bake | Serial/parallel pixels match exactly; source/geometry/suffix keys invalidate preparation correctly; map-specific dependencies, pre-start/active cancellation and cache release |
| Tangent frames | Original pinned MikkTSpace, mirrored UV handedness and inverse reconstruction of interpolated raw T/B/N; matching raw viewport basis |
| Compact textures | Capability detection; eligible channels within 0.002 normalized error in the fixture; detail within 0.000001; restoring full precision replays the authoritative document |
| Brush composition | Partial/full pixels match exactly for one/two/three layers, masks, erasure and wrapping; unaffected texels retained |
| Native ordinary fills | Actual Add fill, explicit white mask, remove, undo/redo, no unsolicited saved template, local constant graph and schema 10 round trip |
| Native GPU rebake | Actual Bake final runs GPU AO; Bake changed regenerates AO only and retains unaffected normal/position image IDs and pixels |
| Memory interface | Actual status-button mouse click opens the popup; separate process GPU usage/budget, texture payload, RAM, CPU cache and GPU bake buffers |
| Retained workflows | Core persistence/recovery, layers/effects/anchors, mesh importing/navigation, typed graph interaction, reusable graph library, texture inputs/previews, custom HLSL edits/rollback and export templates with actual PNG channel assertions |

The full suite log and fresh native captures are copied into `review-09/after` when packaging. Screenshots were inspected twice and corrected; [UI-review.md](review-09/UI-review.md) records decisions and practical limits. Source review additionally removed the old unsolicited startup graph; startup and Ctrl+N now use plain starter layers. Older project readers remain supported and preserve authored masks.

## Recorded fixture measurements

These are observed end-to-end wall times from one final run, with warm shader bytecode caches. They are not a general hardware benchmark or FPS claim. The pipe fixture is 256px, AO + curvature + bent normal, 32 rays and 8px padding.

| Measurement | Final observed result |
| --- | --- |
| CPU serial, cold preparation | 2,144.18 ms total; prepare 11.0806 ms, trace 2,132.23 ms, pad 0.8716 ms |
| CPU parallel, reused preparation | 343.112 ms total; prepare 6.3307 ms, trace 335.828 ms, pad 0.9536 ms; 10 workers |
| Separate CPU/GPU comparison: CPU parallel | 308.677 ms total |
| Same comparison: hybrid GPU secondary maps | 258.068 ms total; 8 batches; 1,284,048 GPU buffer bytes |
| CPU cached geometry vectors | 1,047,564 bytes on the CPU-only pipe fixture |
| Counted full-precision authoring textures | 51,904,520 bytes (49.500 MiB) |
| Counted compact authoring textures | 37,224,456 bytes (35.500 MiB), about 28.28% less payload |
| Simple brush logical composition | 1,083 versus 196,608 layer texels; about 0.55% of the full dispatch area |

The serial/reused comparison combines workers and cache reuse; it does not isolate the cache speedup. The GPU comparison runs CPU first, then GPU with the same prepared CPU cache; it is an ordered workflow measurement, not a controlled standalone GPU-kernel comparison. Results vary with mesh complexity, resolution, ray counts, driver and concurrent work. GPU readback/upload and CPU projection/reduction remain part of the hybrid time.

Texture payload is computed from actual resource dimensions, formats, mip levels and sample counts, including reusable staging. It excludes driver overhead, swap chain, buffers and UI-owned thumbnails. GPU bake buffers are counted separately. Windows-reported process local usage/budget and shared usage include different allocation costs; no claim equates the 28% payload change with total VRAM residency. Brush numbers count logical texels, not GPU milliseconds. CPU cache figures exclude shared source/document storage and small container/string overhead. UV bins/bounds are rebuilt per bake; BVH/group metadata/Mikk frames are cached.

## Reproduce

In PowerShell from this source directory, build with:

```powershell
& .\build.cmd '-DSURFACE_STUDIO_OUTPUT_NAME=Surface3D-0.9'
```

This rebuilds and runs all 28 checks. Individual `gpu_bake_tests.exe`, `bake_optimization_tests.exe` and `gpu_optimization_tests.exe` in build-native print comparisons and allocation/timing measurements. Native checks need a Windows process with window creation, GPU access and atomic project-save permissions. Successful shader variants are cached by their exact active source/settings; cold compilation can take substantially longer.

After preparation, `python tools/verify_release_09.py` checks byte-identical executable/shaders and runs the delivered app on three projects plus native HLSL/export and plain-layer/GPU-bake interaction fixtures. `python tools/package_release_09.py --seal` records file hashes after acceptance; older releases are preserved.

## Unverified or unfinished

GPU acceleration covers secondary maps; primary UV/cage projection, Mikk conversion, reduction, normalization and padding stay on the CPU. Initialization/runtime GPU errors have a logged CPU fallback, but deliberate driver/device-loss injection and other adapters are not certified by these checks. Curvature is a bounded four-neighbor geometric approximation. Mesh ID is group color, opacity is ray coverage and all saved bake maps are RGBA8.

Real Blender/Unreal interchange, reference-quality bakes, high-poly production scenes, sustained memory behavior and monitor/DPI/accessibility need the [artist checklist](Surface3D-0.9-artist-tests.md). Full GPU projection/DXR, painted cage/skew, high-precision/UDIM files, fully tiled/channel-lazy residency, background export and full requested node parity remain unfinished. The current one-atlas/eight-layer/128-node/16-image bounds are documented in the [feature guide](Surface3D-0.9-features.md). Do not treat fixture correctness as complete Substance Painter/Marmoset parity.

## Public implementation references

- [MikkTSpace upstream](https://github.com/mmikk/MikkTSpace): pinned original tangent implementation and retained notice.
- [Microsoft typed UAV format support](https://learn.microsoft.com/en-us/windows/win32/api/d3d11/ne-d3d11-d3d11_format_support2): capability checks for compact texture loads/stores.
- [Microsoft process GPU memory budget](https://learn.microsoft.com/en-us/windows/win32/api/dxgi1_4/nf-dxgi1_4-idxgiadapter3-queryvideomemoryinfo): separate OS usage/budget counters.
- [Microsoft resource copying/readback](https://learn.microsoft.com/en-us/windows/uwp/graphics-concepts/copying-and-accessing-resource-data): staging/copy synchronization.
- [EmberGen UI reference](https://docs.jangafx.com/embergen/pages/references/ui_reference.html): pane roles used as design inspiration, implemented with the existing Dear ImGui/Lucide UI.

The bake compute shader, projection engine and UI changes are original Surface3D source. No installed Adobe/Marmoset binaries are required.
