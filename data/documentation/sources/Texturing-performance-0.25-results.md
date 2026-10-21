# Surface3D 0.25: texturing performance foundations

Scope: the first four optimization priorities requested on October 11. This is an incremental D3D11 texturing update, preserving the existing D3D12/DXR baker. It does not enable 8K authoring or replace every remaining optimization in the 88-item plan.

## Implemented

1. **Measurements.** Nonblocking, bounded GPU timestamp batches cover layer replay, procedural evaluation, selected previews, thumbnails, composition, folder evaluation, field/mask padding, direct brush strokes and live publication. The Memory details popup shows category allocations and cumulative readback bytes/wait time. Inline procedural dispatches have a separate total counter; fused shader timings describe a shared pass, not invented independent node costs. Query results are polled without forcing a flush or waiting for unfinished work. Replay brushes are measured as part of their enclosing layer stage to avoid thousands of per-dab queries.
2. **Preview reuse.** Repeating an unchanged selected preview retains its valid GPU image. Paint UI changes select the preview before rebuilding, avoiding the former rebuild followed by forced owner replay. Unchanged rebuilds skip stack composition. Folder/function preview paths still have separate preparation paths.
3. **Channel allocation.** Unused normal/height, emission, utility and coverage planes share read-only default textures. A layer promotes them to writable storage when its channels, graphs, effects or brush require them. Scratch evaluation aliases read-only defaults instead of copying them. Authored normal/height and HDR emission retain FP32 storage. Full-size shared defaults remain allocated; scalar constant representations and a fully bounded residency pool are future work.
4. **GPU live outputs.** Output Texture (Anchor) publishes a versioned GPU image. Linked textures consume its SRV directly, including renderers for other texture sets sharing the device. Publication invalidates consuming layers rather than all layers. CPU pixels are snapshotted at save, recovery, export, or stopping a live publication; ordinary interactive updates do not download/reupload the image. Project replacement clears the old publication registry. Ordinary layer anchors continue using the existing resident layer images.

## Plane measurements

Fixture: `C:/Users/pouya/Downloads/Plane.s3d`, 249,293,208 bytes. Diagnostics only edit a loaded copy in memory. NVIDIA GeForce RTX 5050; working textures 4096. Its six bound baked maps are 512, not 4K. The original file remains unchanged.

First optimized interaction capture:

| Measure | Previous capture | Optimized capture |
|---|---:|---:|
| Counted allocation estimate | 14,321.9 MiB (13.99 GiB) | 9,713.88 MiB (9.49 GiB) |
| Unchanged rebuild + color readback | 1,987.81 ms | 154.227 ms |
| Levels edit + color readback | 1,575.47 ms | 954.434 ms |
| Tiny UV dab + composition/readback | 949.691 ms | 638.542 ms |
| Unchanged rebuild composited pixels | 117,440,512 | 0 |

These are individual sequential diagnostic observations, not controlled averages, actual viewport FPS, or isolated kernel speedups. The allocation estimate counts textures including staging; it is not physical VRAM residency. About 32% fewer counted allocations is useful, but 9.49 GiB remains above the measured approximately 7 GiB OS budget and the proposed 4.5–5 GiB target. Changed noises still require computation across pixels. Folder-aware dirty regions, bounded residency and CPU graph planning remain important next steps.

Build: `tools/build_texturing_performance.cmd`. Runtime: `build-023/Surface3D-0.25-performance.exe`, with adjacent shaders, assets and runtime libraries. No ZIP is created.

## Reversible defaults requested afterward

- New projects and new Output Texture nodes: 1024. Ordinary nodes evaluate at the owning graph/project resolution; thumbnail previews remain small UI images. Existing project/node resolutions are preserved.
- During numeric parameter drags: an optional 512px evaluation tier, followed by authored-resolution evaluation on release. This is freshly computed lower-resolution data, not a stale mipmap. Brushes are excluded. Saving/exporting flushes final quality first. Graph thumbnails and live publication defer while draft work is active.
- Defaults increased: imported image CPU budget 4096 MiB, import edge 8192, layers/folders 64, effects per layer 32, live outputs 64. Actual GPU shader limits remain 128 expanded nodes/16 image inputs per pass and 4096 working resolution; source import size is a separate setting.
- File > Preferences > Texturing defaults exposes project/output defaults, draft enable/disable and interactive resolution. Image/resource limits remain editable. **Restore previous limits** returns image budget/import edge to 1024 MiB/4096, layers/folders/effects to 8, outputs to 16, legacy new-project resolution to 512, outputs to Project, and disables draft evaluation. Save preferences persists the choice.
- A different-resolution or different-set live producer uses a separate evaluator on the same GPU/context and shares its published result directly. This prevents a 1K output from resizing the main 4K texture banks repeatedly. Its additional storage is reported separately in Memory details. Published color space travels with the result.

The new build's local preferences are updated to the requested defaults. Other saved user preferences remain authoritative when running another folder.

Additional Plane observations: five unchanged noise previews completed with readback in approximately 111–125 ms, with zero layer replays. Changed full-resolution noise remained slow. In the separate draft-transition run, entering 512px took 239–976 ms and restoring 4K took 4.35–4.72 seconds including readback. Changing extent currently rebuilds all seven layers; the draft tier reduces subsequent work but does not eliminate transition pauses. Persistent separate draft/final banks or a bounded residency design are still needed. These numbers do not support claiming smooth 4K/8K interaction for this project.

## Verification contract

The new performance test compares all material channels against a forced fully allocated reference, checks unchanged output/preview reuse, checks live GPU publication without CPU readback, validates consumer refresh and saved snapshots, and exercises normal/height brush promotion and normal encoding. It also checks draft policy and recent-project persistence. Existing paint, layering, material, Designer operators, nested functions, native UI and 4K import/bake/export checks accompany it.

The compact UI/File menu refinement is recorded in [the video audit](UI-video-2026-10-11-audit.md). The final build includes it.

## Research supplied during development

- [ScaleOps / Adobe case study](https://scaleops.com/resources/case-studies/adobe-and-scaleops/): demand-based sizing and reclaiming idle resources are useful principles. Its Kubernetes/cloud savings are not evidence of desktop Painter performance or a predicted Surface3D speedup.
- [NVIDIA GPU workload profiling](https://developer.nvidia.com/blog/optimize-gpu-workloads-for-graphics-applications-with-nvidia-nsight-graphics/): measure shader execution, divergence and memory stalls rather than infer performance from GPU utilization. No Nsight capture has been performed in this update.
- [Nsight activity/API matrix](https://docs.nvidia.com/nsight-graphics/UserGuide/appendix.html): D3D11 frame debugging and D3D12/Vulkan GPU profiling have different capabilities; do not assume all Shader Profiler features apply to the current D3D11 texturing backend.
- [Painter 11.1](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/release-notes/version-11-1): Adobe added Vulkan support. Changing API alone would not remove redundant evaluations, oversized texture banks or synchronous readback. Evaluate Vulkan/D3D12 migration separately after measuring the improved implementation.
