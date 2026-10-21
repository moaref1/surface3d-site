# Surface3D 0.13 checks on your props

These manual acceptance checks remain for artist feedback. The automated suite separately checks GPU pixels, saves and native mouse/keyboard interactions.

- [ ] Start a project: the fill is neutral and has no mask. Change roughness by double-clicking, type 0.37, press Enter; undo/redo. Try the always-visible numeric field mode.
- [ ] Bake a UV-mapped low/high prop. Use Results to inspect misses and UV warnings. Check that published maps appear in Textures and drive surface generators automatically.
- [ ] Add Cavities/Edge chips/Ground dirt to a mask and Broad grunge to roughness. Edit their Properties without opening Graph. Drag a generator onto a material, mask, and roughness channel. Material and mask effects should remain clearly separated.
- [ ] Open Graph and edit the same recipe. Link XYZ scale, lock Z, type X; X/Y should retain proportions while Z stays fixed. Save/reopen and undo.
- [ ] On a prop with separate and mirrored UV islands, paint across a seam in 3D. Check both the mesh and 2D result. Compare with UV-only brushing. Check a hard corner, different mesh groups and an island with different texel density.
- [ ] Compare edge padding 0, 8 and 16. Check masks, blur/normal inputs, exported maps and close islands at reduced texture resolution. Report the actual source mesh and settings when a seam persists.
- [ ] Reimport a compatible low mesh, save/reopen and compare painted results. Recheck normal convention in Blender/Unreal with your own material setup.

Known remaining limitations: UV-neighborhood filters across rotated seams, UV-only simulation source painting, 128² physics, no UDIM/multiple sets/4K, no tablet pressure/brush alpha/symmetry, no painted cage offsets/skew, no tiled residency/DXR, no nested executable graphs or multi-output functions, no 16-bit/HDR/background export. The supplied fitted cube still has one missed AA sample among 120,984 projected samples; its diagnostics are preserved.
