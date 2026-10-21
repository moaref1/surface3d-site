# Surface3D 0.18

Open Surface3D.exe. Keep assets, shaders, shader-cache, licenses and the bundled runtime DLLs beside it. No Adobe, Marmoset or Blender installation is required. Earlier packages are unchanged.

Added: Photoshop-style percent/pixel Offset, optional seam blend, editable GPU Paint/Clone node, named Texture Output publication/reuse across layers and texture sets, filter-input caching, shared parameter reset icons, search clearing, C view wheel, visual Poly Haven reusable materials, staged New Project setup and pinned/master controls.

Start with examples/Native-texture-output.s3d or examples/Paint-offset.s3d. The test marks demonstrate interaction, not a completed photographic repair. See docs/Surface3D-0.18-artist-guide.md and Verification.md for exact use, checked behavior and limitations. The entire pending production scope remains in docs/Iteration-0.18-plan.md and docs/Rendering-and-artist-roadmap.md.

New project saves use schema 20, with readers for schemas 1–20. Save older projects under a new name. Texture Output publishes snapshots; choose Update texture after changing the source to refresh linked consumers. Authoring remains bounded to 2048 textures, 8 layers/set, 128 nodes/graph, 16 sets and 0..1 UV storage. Advanced hardware rays/DLSS/denoising, complete Designer parity and full production cage/seam support are not claimed.
