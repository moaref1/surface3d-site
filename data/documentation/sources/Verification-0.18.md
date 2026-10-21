# Surface3D 0.18 packaged verification

Verified 2026-10-09T10:01:42+00:00 on Windows/D3D11, NVIDIA GeForce RTX 5050.

**47/47 development checks and 13/13 packaged native checks passed.** Executable, five HLSL shaders, all 50 generator previews and bundled runtime DLLs match their tested/provenance files byte for byte. The package includes warmed shader bytecode and app-local runtime files.

Executable SHA-256: 224386ef0b273cdeff80a9332849618535d840732ee75991622d6896793fd43f

## Latest functional evidence

- Offset: positive/right-down wrapping, percent/pixel conversion, typed 128 px at a 256 texture, reset/undo, optional opposing-edge blend, standalone Make Tileable.
- General Paint node: actual brush input without Graph visible, procedural input/result, Paint/Clone/Erase/opacity/wrap, pre-dab source sampling, incremental appended marks, cold/full replay parity, stroke undo/redo and persistence. Alt-click Clone source and Alt-drag navigation are distinct.
- Texture Outputs: named publication, root project pool, stable linked local texture identities, Update/undo/save/load, duplicated publisher identity cleanup, refresh of consumers in inactive texture sets. Native publication and a library drop onto inactive Roughness passed. Publication remains explicit rather than an automatic live graph dependency.
- Performance: standard node combinations reuse the warmed general shader; unchanged spatial prerequisites reuse cached fields. In the named 256 texture/Image→Blur→Edge→Remap test, changing downstream Remap dispatches 0 rather than 2 prerequisite passes. Cached pixels agree with cold/full replay within 0.003. Genuine HLSL changes still compile.
- Recorded NVIDIA run: CPU rebuild/submission 0.2818 ms → 0.0628 ms; WARP full-suite run 49.2986 ms → 0.1633 ms. These are CPU submission times for this fixture, not total GPU completion, startup, all graph edits or production speed claims. Caches invalidate on relevant authored inputs; Paint appends on GPU while changed inputs/undo replay.
- UI: small reset icons and search X; per-parameter reset IDs, native typed values, Shift fine/Ctrl 0.5 adjustment, inactive-channel reveal and C channel-view wheel with center/Escape cancellation and unchanged layer ownership.
- New Project: staged multi-file world-normalized merge, source placement and material sets, UV transforms, supported PBR/color/normal/resolution setup, preview, cancel/commit semantics. Current limits still apply.
- Favorites/master: authoritative control references, per-instance overrides, linked/locked axes, duplication/replacement/folder cleanup and persistence. Native pin/master control sessions need further artist acceptance.
- Region: exact authored triangle/UV-island/mesh membership and no hover preview during navigation.
- Library: reusable material replacement keeps mask, layer ID/name/opacity/anchor and undo; offline visual Poly Haven import never applies on selection. Search/category filtering and deduplication/provenance checks pass.
- Live official Poly Haven API: 867 material catalogue entries, search, real thumbnail, verified Diffuse/Rough 1k downloads, material assembly, checksum cache reuse and reusable library import with thumbnail/provenance. Network evidence is included. Native automated browser images use labeled original offline swatches, not live Poly Haven artwork.

## Retained production foundations

Current Desktop inputs still contain 12 low/3200 high triangles. Fitted front 0.002 / rear 0.0329107 gives 120984 hits and zero misses. Insufficient original face/smooth distances retain genuine miss reports. Original FBX files are unchanged. Watertight projection, CPU/GPU curvature/seams, map selection/preview/publication and bake cancellation checks pass; this small cube does not certify all imported cages, tangents, hard/mirrored/subpixel seams or large production scenes.

Layer/mask/effect order, contextual View/Blend/Opacity, Alt isolation/selection sweeps, export templates/channel packing, OCIO/color/precision/codecs, custom HLSL, 50 editable ready generators, semantic baked-map graph drops, real decal hit/alpha coverage, surface-film physics, shared coordinates and linked/locked axes remain checked. Native still-image GGX/BVH/indirect/MIS transport, shadow/image/EXR output and cancellation remain checked. A generic-shader Decal omission and duplicate coordinate-creation path were corrected; all retained checks pass.

The packaged executable ran its new Offset/Paint/Output/library/setup/wheel workflow, priority layers/maps/decals/rays, fitted cube, rendering/master controls, texture packs/library, typed axes/effects, Paint without Graph, graph/brushes, bake/custom HLSL/export, saved rain, folder mask and a 0.11 saved project. Each produced an editor PNG, empty Error.txt and behavioral PASS report. New native captures and generated fixtures are included.

## Practical limits and pending acceptance

Authoring bounds remain 8 layers/set, 128 nodes/graph, 16 sources/192 MiB per active set, 16 sets with bounded inactive payload, 16 project outputs/192 MiB, 16384 marks/Paint node, 2048 textures, 50000 mesh triangles and one 0..1 UV tile/set. Immutable shared output pixels/history reduce duplicate allocation but do not implement tiled/UDIM residency or GPU primary projection. Seam blending is soft opposing-edge overlap, not content-aware synthesis. Clone source selection uses UV; full geodesic cloning is pending. Some pinned/color/direct numeric fields still need reset icons.

Ray images use original D3D11 compute, not DXR/RT cores, DLSS, hybrid transport, denoising or interactive accumulation. WARP is the same compute backend on CPU, not an independent optimized CPU renderer. Full Designer node parity, nested live multi-output functions, arbitrary mesh lifecycle/relink, normal/height/tablet/alpha/symmetry/stencil/text brush tools, nested folders, viewport decal/coordinate handles, transmission/caustics and larger/DPI/other-hardware artist acceptance remain open.

Read docs/Surface3D-0.18-artist-guide.md, docs/UI-review-0.18.md, docs/Iteration-0.18-plan.md and docs/Rendering-and-artist-roadmap.md. New saves use schema 20; readers retain 1–20. Keep older projects under original names while testing migration. Published outputs require explicit Update after source edits. Native colored ramp marks test interaction; they are not a completed photographic tileable-material example. Earlier sealed packages are preserved.

## Primary references

- [Official Poly Haven API](https://github.com/Poly-Haven/Public-API), with retained Powered by Poly Haven credit/CC0 asset provenance.
- [Published watertight triangles](https://www.pbr-book.org/4ed/Shapes/Triangle_Meshes) and [path tracing/MIS](https://pbr-book.org/4ed/Light_Transport_I_Surface_Reflection/A_Better_Path_Tracer).
- [Painter normal-seam guidance](https://experienceleague.adobe.com/en/docs/substance-3d/bakers/common-issues/seams-are-visible-after-baking-a-normal-texture) and [Toolbag projection controls](https://docs.marmoset.co/docs/projection-tools/).

Surface3D implementation is original. Public references do not imply proprietary engine equivalence.
