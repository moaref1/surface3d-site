# Surface3D 0.17

Open **Surface3D.exe** beside this README. Keep shaders, assets, runtime DLLs and licenses beside it.

This standalone Windows build adds compact contextual layer blending/opacity, highlighted channel/map toggles with Alt isolation and mouse sweeps, a smaller library, stronger cage/ray/seam handling, world-space curvature, editable generator/map drops, projected decals and native GPU compute ray-image rendering. Initial 3D navigation is Perspective.

Use Paint for ordinary layers/masks. Assets > Decals supplies Sticker/Leak and image projection. Rendering > Output > Image renderer selects Raster or Ray tracing; Render image shows the completed image in the viewport. Ray rendering currently targets still images, with 1-256 samples and 1-8 surface bounces.

Read [the artist guide](docs/Surface3D-0.17-artist-guide.md), [verification](Verification.md) and [remaining renderer/artist work](docs/Rendering-and-artist-roadmap.md). Important remaining work includes DXR/RT cores, DLSS, hybrid rendering, denoisers, refraction/caustics, projector handles, normal-brush expansion, stencils and editable text.

Prior releases and source assets are preserved. New saves use schema 18; save upgraded projects under a new name if you need to keep opening the originals in an older release.
