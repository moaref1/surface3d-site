# Surface3D 0.19 packaged verification

Verified 2026-10-09T14:38:14+00:00 on Windows/D3D11, NVIDIA GeForce RTX 5050.

**49/49 development checks and 14/14 packaged native checks passed.** Executable, five HLSL shaders, all 50 generator previews and bundled runtime DLLs match their tested/provenance files byte for byte. The package includes warmed shader bytecode and app-local runtime files.

Executable SHA-256: fad2fd58991a5f723b736a5b3904eb69d6e18140f15461725d767f0060b27972

## New functional evidence

- Brushes: spacing carries across input events and interpolates pressure. A gesture has one persistent stroke ID and an opacity coverage cap separate from per-dab flow. Fifty overlapping low-flow GPU dabs agree with the analytic cap; a second gesture adds coverage. Explicit nearest FP16 rounding prevents truncation bias at low flow. Full replay and project/history checks retain the settings.
- Eight material brush channels and independent erase: Base color, Roughness, Metallic, Normal, Height, AO, Emission and Surface opacity. Elliptical UV tips use Roundness/Angle. Paint nodes retain generic scalar/color/vector/normal behavior with the same stroke/tip controls; UV updates use clipped, disjoint wrapped regions. Geometry footprints retain the full-atlas fallback.
- Native keys: B/E, brackets/Shift-brackets, number opacity/Shift-number flow, X/D and precise cursor respect workspace/text focus. Pen pressure is connected through Windows pointer input, but an actual tablet is not certified by these automated checks.
- Layer/effect ownership: selected mask-paint effect receives typed 35% opacity and Multiply while the owning layer keeps its previous values. Material and mask effects retain distinct stacks. View/Blend/Opacity stay together, duplicate controls are removed, and a root mask/folder without a selected effect disables unsupported blend/opacity fields.
- All 114 registered node kinds have valid typed default-path GPU execution and finite-output checks. Node-contracts.csv lists their ports. Component-wise Gamma/Invert/Clamp/Contrast/Levels/Posterize preserve color/vector channels and alpha; legacy grayscale nodes retain their mode. Numeric checks cover RGBA Gamma, Blend alpha, normal type inference, Mesh Map modes, Vector Math types and Height to Normal's optional Base normal. Operation-dependent unused ports are dimmed rather than destroying stored connections. Connected defaults are disabled and Scale/Eta labels match the operations.
- Normal + Height: reoriented detail normals are shared by mesh/UV inspection, sampled images and normal export. Flat-height/base-normal and analytic ramp fixtures pass; export convention is applied after combination. Height remains separately exportable. This is not proof of every mirrored/hard UV seam, and the analytic no-mesh sphere still lacks the same detail-height shading.
- Baking: 1/4/16/64 primary AA and bounded higher secondary-ray presets; map name selects preview while a separate small toggle enables computation. Alt isolation and semantic graph drops remain. Completed rows/batches stream bounded provisional previews onto the mesh and 2D. Final assets publish atomically; cancellation, stale input and texture-set ownership tests preserve prior maps.
- GPU packet splitting: the analytic 256-square, 64-AA, four-secondary-ray plane produced 4,194,304 hits and 512 packets. CPU and NVIDIA accelerated AO/normal results agree within the asserted two-byte tolerance. WARP is rejected by the optional secondary accelerator and uses CPU fallback for baking; the image renderer can still use WARP.
- Readback wait: reusable high-resolution waitable timers avoid repeated coarse Windows Sleep(1) delay. The recorded fixture's accelerated total fell from 16,782.5 ms before to 820.161 ms after; CPU totals were 384.995 and 433.145 ms respectively. This small two-triangle/four-ray case still favors CPU. Runs were on the same adapter/build path alongside development checks, not an isolated production benchmark or a universal GPU speed claim. Both reports and executable identities are included.
- Cameras/rendering: original D3D11 compute BVH/GGX/MIS GI, shadows and reflections remain tested. New thin-lens Focus distance/F-stop pass focal-plane/defocus and save/load checks. Raster remains sharp; normalized-scene distances are not calibrated meters. The DXR label reports capability only and does not indicate a hardware tracing backend.

## Retained workflow and fixture checks

The packaged executable exercised the new brush/mask/bake/camera input path and the existing Offset/Paint/Clone/Texture Output/new-project/library/C-wheel workflow, contextual layers/maps/decals/rays, fitted cube, rendering/master controls, texture-pack import, typed axes/effects, Paint without Graph, graph/brushes, bake/custom HLSL/export, saved rain, folder mask and a schema-0.11-era project. Every run produced an editor PNG, an empty Error.txt and a behavioral PASS report.

The current Desktop inputs contain 12 low and 3200 high triangles. Fitted front 0.002/rear 0.0329107 again produced 120984 hits and zero misses; insufficient face/smooth distances retained real miss reports. Input files were unchanged. Watertight projection, curvature, manifold scalar seam repair and island-aware padding are retained. This cube does not certify all imported cages, tangents, hard/mirrored/subpixel seams or large scenes.

Offset, Make Tileable, general Paint/Clone, explicit reusable Texture Output publication, selected arrangement/reroutes/connection cutting, custom HLSL, 50 editable ready generators, coordinate controls, decal projection, folder masks, surface-film simulations, export templates/channel packing, color/OCIO/formats and native rendering remain checked. Output publication still requires explicit Update; opposing-edge blending is not content-aware synthesis.

Poly-Haven-live-0.18.txt and Graph-cache-hardware-0.18.txt are unchanged historical evidence. The API integration was not changed or re-measured on the network this iteration. Current backend/offline-library regression checks pass. Native browser captures use labeled original offline swatches rather than live Poly Haven artwork. See Retained-evidence.md and Dependency-provenance.json.

## Practical limits and artist acceptance

Bounds remain 8 layers/set, 128 nodes/graph, 16 source textures/192 MiB per active set, 16 sets with bounded inactive payload, 16 project outputs/192 MiB, 16384 marks/Paint node, 2048 textures/bakes, 50000 mesh triangles and one 0..1 UV tile/set. New saves use schema 21; readers retain 1-21.

Baking uses CPU primary projection and optional D3D11 secondary work, with RGBA8 map assets. GPU primary projection, tiled/UDIM residency, 4K/8K/float bake outputs, cage/skew painting and dedicated cleanup brushes remain open. Preview memory is bounded separately; allocation estimates are not measured peak VRAM.

Ray images execute ordinary D3D11 compute rather than DXR/RT cores. DLSS, hybrid realtime GI, denoising, transmission/caustics and an independently optimized CPU renderer remain backend work. A hardware capability probe does not implement these features.

Full Designer/Blender node parity, every parameter/operation permutation, nested live multi-output functions, arbitrary mesh lifecycle/relink, alpha-image brush tips, stencil/symmetry/text tools, adaptive pressure spacing, nested folders, independent root-mask strength and viewport decal/coordinate handles remain open. Tablet input, AMD/Intel hardware, narrow/high-DPI docks and photographic/production artist acceptance still require testing.

Read docs/Surface3D-0.19-artist-guide.md, docs/UI-review-0.19.md, docs/Iteration-0.19-plan.md and the master/rendering plans. Keep earlier projects under their original names while testing migration. Older sealed packages are preserved.

## Primary references

- [Photoshop painting controls](https://helpx.adobe.com/photoshop/using/painting-tools.html) and [Blender Bump input](https://docs.blender.org/manual/en/4.2/render/shader_nodes/vector/bump.html).
- [Material Maker paint workflow](https://rodzill4.github.io/material-maker/doc/user_interface_paint_panel.html).
- [Microsoft high-resolution waitable timers](https://learn.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-createwaitabletimerexw) and [D3D12 Options5 capability](https://learn.microsoft.com/en-us/windows/win32/api/d3d12/ns-d3d12-d3d12_feature_data_d3d12_options5).
- [Toolbag map controls](https://docs.marmoset.co/docs/map-types/) and [render controls](https://docs.marmoset.co/docs/render-object/).

Surface3D is original code using public interfaces; these references do not imply proprietary engine equivalence.
