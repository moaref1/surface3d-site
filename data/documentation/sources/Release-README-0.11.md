# Surface3D 0.11

Run **Surface3D.exe** in this folder. Keep shaders, shader-cache and licenses beside it.

Added: editable GPU Rain/Dirt simulation nodes, reusable painted sources, ground/AO controls, folder masks, one shared Coordinates node, Ctrl-hover help, separate Node Properties and reduced graph replay after cosmetic edits.

Start with examples/Physics-brush.s3d for a painted source, examples/Physics-folder.s3d for a shared folder simulation mask, or examples/Shared-projections.s3d for coordinate routing.

To use a brush: add Physics brush in the graph, connect its output, choose Paint source, paint on the mesh, then Finish source painting. Play or change Time steps; edit the transport/deposition/evaporation controls. Space toggles node preview.

Folder: right-click its header → Mask → Add white/black mask. Select the Folder mask icon; double-click it to preview/restore. Layer and node controls now have separate panels.

This is a bounded 128 × 128 GPU surface-film simulation, not volumetric water/splashes. Projects save sources and replay simulation. The writer uses schema 12; older schema 1–11 projects load, but 0.10 cannot read a new schema-12 save.

Read docs/Surface3D-0.11-features.md for exact behavior and limits, Verification.md for actual packaged checks, and docs/Surface3D-0.11-artist-tests.md for checks still needed on your assets.
