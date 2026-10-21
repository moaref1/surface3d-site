# Surface3D 0.17 packaged verification

Verified 2026-10-09T06:08:39+00:00 on Windows/D3D11, NVIDIA GeForce RTX 5050.

**44/44 development checks and 12/12 packaged native checks passed.** Executable, five HLSL shaders, all 50 generator previews and bundled runtime DLLs match their tested/provenance files byte for byte.

Executable SHA-256: 2c3fd6df011d486b855dfd2ade791cc0dffc86896f205c0f561c13d417dd270c

## New behavioral evidence

- Contextual layers: adjacent View / Blend / Opacity, typed values, Material edits all channels, individual views preserve other effective opacities; extra-channel blends and old-project migration.
- Native buttons: Alt isolation and held-mouse sweeps for fill channels and bake maps, one gesture/one undo, compact Assets controls and Ctrl-wheel thumbnail resizing.
- Graph: actual semantic baked-map drag and editable grouped generator drop; all 50 generator recipes append to both mask/material targets without replacing the existing output.
- Projection: watertight shared edges/corners across 1e-6 to 1e6 scene scales, constrained UV origins, front/rear ranges and genuine-miss diagnostics.
- Original Desktop cube: 12 low triangles / 3200 high triangles, fitted front 0.002 / rear 0.0329107, 120984 hits and zero misses. Insufficient face/smooth distances still produce real misses; padding does not hide them. Source FBX files unchanged.
- Curvature/seams: flat, convex and concave numerical fixtures, rotated-UV invariance, CPU/GPU agreement, matching scalar seams, group isolation and cancellation. Normal, ID and height maps are not indiscriminately blurred.
- Decal: actual library-to-mesh hit placement, editable Paint/Graph projector, alpha color/roughness coverage, untouched outside pixels, no implicit mask, save/load and atomic undo/redo.
- Rays: real BVH compute paths, GGX reflection, directional secondary shadows, diffuse indirect transport, HDRI importance/MIS, finite scene-linear HDR/EXR output, bounded completed work, before/during cancellation, shared material maps, reflected bytecode cache and hardware/WARP agreement.
- Native Rendering: real Output/Render image controls, asynchronous managed output at chosen dimensions, saved image shown in viewport, last-result/live navigation, Paint state preservation and resource reporting.

## Retained checks

Color/output precision, OCIO working/display conversion and raw-data invariance, export templates/channel packing, separate material sets, masks/effects/anchors, custom HLSL, physical surface-film controls, linked/locked typed XYZ, graph selection/cut/group/arrange/preview and paint-first authoring passed. Material-pack review/import and reusable library save passed. Official Poly Haven material/cache fixtures and retained live-download evidence remain included; this release run did not repeat the live network request.

The packaged executable ran the new priority workflow, fitted cube load, rendering/master controls, texture packs/library, typed axes/effects, paint without nodes, graph/brushes, bake/custom shader/export, saved rain, folder mask and a 0.11 project load. Each produced an editor PNG, empty Error.txt and behavioral PASS report.

## Practical limits

Ray tracing uses original D3D11 compute for requested still images. It does not use DXR/RT cores, DLSS, hybrid transport, denoising or interactive accumulation. WARP executes the same compute on the CPU and is not an independent optimized CPU ray engine. Refraction/caustics, full projected normal texture packs, text/stencils and viewport projector handles remain open in docs/Rendering-and-artist-roadmap.md.

The named small 64x64/64-sample/2-bounce fixture reports about 244 ms including render setup on this adapter; this is not a general production-speed claim. Ray resources is a tracer allocation estimate; whole-process GPU usage is the OS figure in the footer. Physics remains a bounded surface-film approximation. Source UVs, hard/mirrored seams, 0..1 UV storage/UDIM, larger production assets and another GPU still require artist acceptance.

Read docs/Surface3D-0.17-artist-guide.md and docs/UI-review-0.17.md. New saves use schema 18; keep older projects under their original names when testing migration. Native captures record actual UI, not generated mockups. Runtime DLLs are supplied app-locally; no Blender installation or external renderer is required. Earlier sealed releases are preserved.

## Primary algorithm/workflow references

- [Published watertight triangle construction](https://www.pbr-book.org/4ed/Shapes/Triangle_Meshes) and [path tracing/MIS](https://pbr-book.org/4ed/Light_Transport_I_Surface_Reflection/A_Better_Path_Tracer).
- [Painter normal-seam guidance](https://experienceleague.adobe.com/en/docs/substance-3d/bakers/common-issues/seams-are-visible-after-baking-a-normal-texture).
- [Toolbag projection controls](https://docs.marmoset.co/docs/projection-tools/), [map conventions](https://docs.marmoset.co/docs/map-types/) and [render modes](https://docs.marmoset.co/docs/render-object/).

Surface3D implementation is original; public references do not imply proprietary engine equivalence.
