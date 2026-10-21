# Surface3D 0.11 — artist checks still needed

Automated evidence verifies numerical transport, graph invalidation, projection outputs, native controls and persistence. These checks remain for real work.

- [ ] Import a Blender/Unreal prop with separate UV islands; paint Rain source across a seam and inspect 2D/3D continuity.
- [ ] Compare deposit movement with gravity up/down; review sparse UV islands and thin details at the 128-grid limit.
- [ ] Use Rain in a black mask over a rough/dark wetness layer; compare Deposit, Water and Wet trail outputs.
- [ ] Use Dirt with Ground contact / Paint + ground; tune ground height, spread, rate and deposition.
- [ ] Bake AO, enable Cavity trapping, rebake AO and verify the changed retention result.
- [ ] Finish painting, change parameters afterward, scrub time and save/reopen; verify replay on your own asset.
- [ ] Test several simultaneous physics nodes and 512/1024/2048 projects for sustained frame time/memory.
- [ ] Create a folder mask through the context menu; paint it and multiply a child mask; bypass/invert independently.
- [ ] Double-click a folder mask to preview and restore; drop a texture onto it; edit a Custom HLSL folder node.
- [ ] Share one Coordinates node between color, roughness and normal textures; compare cylinder, sphere, box and triplanar.
- [ ] Verify per-texture tiling/rotation, clamp/mirror/filter and color conversion on real maps.
- [ ] Move/rename/collapse nodes in your Edge Detect graph; confirm responsive interaction, then measure connected parameter changes.
- [ ] Ctrl-hover every node you use; report unclear names/descriptions rather than guessing.
- [ ] Keep Layers/Properties and Node Properties docked; test resizing, your DPI scale and saved layouts.
- [ ] Check undo/redo after source painting, Play, mask changes and ordinary paint.
- [ ] Test on other GPUs, long sessions, memory pressure and device loss.

Known scope: surface-film transport, flat pass-through folder masks, one UV atlas, bounded graph/image budgets. AAA node-system completeness, fluid splashes/volume, arbitrary simulation resolution, nested executable subgraphs, GPU primary bake projection, UDIM/high-precision export and engine interchange certification remain unfinished.
