# Surface3D 0.20 — development, not sealed

Run `build-020/Surface3D-0.20.exe` from the SurfaceLab workspace. Keep its shaders, assets and DLLs beside it. No 0.20 release package is certified yet; the sealed 0.19 release remains available unchanged.

This milestone focuses on eight-channel blending, typed normal/height modes, adjustment Pass Through, single-level isolated/Pass Through folders, mask density and independent mask-entry blend/opacity. Read `Surface3D-0.20-artist-guide.md` and `Verification-0.20.md` for checked behavior and limits.

The native test project is `build-020/studio-layering20-evidence/Layering-workflow.s3d`. New saves use schema 22. Save older projects as a new file; default normal and group-mask composition were corrected, so some older results may differ.

Nested groups, staged anchors and larger stacks remain open. All 51 development checks pass with the shared built-in kernel; packaged release validation remains open. Rendering executes D3D11 compute, not DXR/RTX hardware tracing. The app does not depend on Adobe or Blender installations.
