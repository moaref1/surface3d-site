# Surface3D 0.16 packaged verification

Verified 2026-10-09T02:38:47+00:00 on Windows/D3D11, NVIDIA GeForce RTX 5050.

**41/41 development checks and 10/10 packaged native checks passed.** Executable, four HLSL shaders, all 50 generator previews and bundled runtime DLLs match their tested/provenance files byte for byte.

Executable SHA-256: 96a963454cd5b9161a2162820a4f20fa1e56383615cc150f281878bbd5985ec7

## Behavioral evidence

- Core/GPU: source and output precision, real 16-bit PNG gradients, supported integer/float codecs, negative/HDR EXR and alpha roundtrips, OCIO working-space CPU/GPU conversion, raw-data invariance, distinct material sets and persistence, shared coordinate identity and automatic input inheritance, linked XYZ defaults, import classification and incompatible-selection rejection.
- Layer/material behavior: ordering, mask/effect ownership, uniform/resource fallbacks, shared graph authoring, anchors, all 50 actual GPU recipes, source-preview damage tracking and bounded texture storage.
- Baking: CPU-reference/GPU secondary map comparisons, cache/worker/tangent regressions, cage/projection/preflight controls, atomic multi-set publishing, edits retained during valid baking and stale/cancelled results rejected.
- Native Rendering input: independent Paint/Rendering cameras, two material sets, actual asynchronous image dimensions, cancellation without publishing a partial file, large color swatch opening, typed working-space color/undo, selected/all graph framing, and object framing preserving orbit/FOV.
- Native artist input: graph selection/links/collapse/rename/group/cut/arrange/preview, texture drag into graph/channel/mask, typed linked/locked axes, paint-first authoring, simulation controls, material-pack automatic review/confirmation and reusable library save.
- Packaged files: rendering capture; bake/shader/export authoring; saved rain and folder-mask projects; a 0.11 project load. Every native check produced a full editor PNG, empty Error.txt and a behavioral PASS report.
- Live Poly Haven: actual official API download of two 1k maps, checksum verification, material assembly and cache replay. Fixtures also checked map semantics, model dependencies, unsafe path rejection, cancellation and offline behavior.

## Practical limits

This validates the current Windows host and adapter, not all devices or complete third-party parity. The native engine is raster PBR with directional shadows and filtered HDRI; ray/hybrid transport, DLSS, denoisers, camera effects, video, decals/stencils/text and viewport transform gizmos remain unchecked in docs/Rendering-and-artist-roadmap.md. Physics is a bounded surface-film approximation. Inactive sets use editing proxies; full authored resolution is used for output. Source UVs, cross-chart filtering/UDIM and the supplied fitted cube's residual missed sample still require production work.

Artists should review their own mesh/cage/normal conventions, color configs, imported material packs and render composition using docs/Surface3D-0.16-artist-guide.md. Native screenshots in previews and verification-evidence record the actual application, not generated mockups. Microsoft runtime DLLs are supplied app-locally; no Blender installation or external rendering process is required. No general speedup or multi-GPU claim is made.
