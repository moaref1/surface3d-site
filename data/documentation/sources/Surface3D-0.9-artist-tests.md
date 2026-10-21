# Surface3D 0.9 artist acceptance

The automated checks in Verification-0.9.md pass. The following hands-on checks remain unverified; use a copy of an actual Blender/Unreal prop, not the demonstration fixture alone.

- [ ] Add ordinary fills; confirm there is no mask or template. Explicitly add white/black masks, remove them, undo/redo and reopen the project.
- [ ] Compare GPU acceleration on/off for high/low and low-only props with AO, bent normals, thickness and curvature; verify backend diagnostics and memory release.
- [ ] Import aligned low/high FBX or OBJ with authored UVs; verify units, axes and mesh-name pairs.
- [ ] Import a corresponding cage; inspect front/rear distances and catch deliberate local misses.
- [ ] Compare MikkTSpace normals across mirrored UVs, smooth shading and split hard edges in Blender and Unreal, with the intended triangulation and normal Y convention.
- [ ] Compare AO/thickness/curvature at artist-relevant rays/resolution to known reference renders; check thin parts, seams, cages and ray misses.
- [ ] Bake all needed maps, then change only AO rays and use Bake changed. Confirm normal/position images retain their asset IDs and pixel content.
- [ ] Change a source/cage or padding and use Bake changed. Confirm affected selected maps regenerate rather than reusing old geometry/output.
- [ ] Cancel a long bake and edit during another. Confirm the prior finished library maps survive cancellation/obsolete jobs.
- [ ] Use baked maps in separate material/mask graphs; open export templates and verify actual game texture channels.
- [ ] Compare Compact textures on/off during stacked layer edits and saves; check smooth roughness gradients and precision-sensitive procedural graphs.
- [ ] Monitor bottom GPU usage/budget, texture storage and RAM during repeated bakes/imports. Release temporary caches and repeat; distinguish payload reductions from OS residency.
- [ ] Exercise brush strokes across UV borders with masks/erase and graph-dependent layers; check unchanged texels and seam behavior.
- [ ] Resize/re-dock Bake and inspect all four tabs at the intended monitor/DPI. Confirm action buttons remain reachable and no control IDs conflict.

These checks do not substitute for unfinished implementation: Full GPU projection/DXR, painted cage/skew, high-precision files, tiled/UDIM, background export and full node parity need separate development.
