# Surface3D 0.7: added features awaiting artist validation

Automated checks verify selected mathematical/storage/input invariants. Every unchecked item below still needs hands-on artist validation; it is not an assertion that an implementation is missing. The separate final section lists genuinely unimplemented requirements.

Open `examples/Baked-procedural-pipe-0.7.s3d` in the 0.7 package. Try a separate imported authored-UV game prop as well. Save under a new filename and reopen it.

## P0: graph usability

- [ ] Click node bodies, Ctrl-toggle, Shift-add and box-select at different zoom levels. Check selection is clear and Properties matches the primary node.
- [ ] Move a selection, copy/paste and duplicate it. Confirm internal links survive; paste removes references to uncopied nodes.
- [ ] Delete/cut selected nodes, undo and redo; retained output nodes must stay valid. Try Ctrl+A before delete/arrange.
- [ ] Arrange only a selected branch; ensure other cards stay fixed and the arrangement feels useful.
- [ ] Hold Ctrl and sweep RMB across several wires, release, then undo once.
- [ ] Spawn nodes near the mouse at different pan/zoom positions. Check no accidental hidden/occupied placement.
- [ ] Find nodes through grouped search and aliases, including Coordinates, UV, Mapping, Normal, Height and baked images.
- [ ] Rename using F2; collapse/expand each card and toggle the global eye icon. Save/reopen and confirm per-card state survives.
- [ ] Select a node and press Space; inspect its isolated result on both mesh and 2D. Press Space again or Return and confirm prior channel/layout/navigation returns.
- [ ] While previewing, edit node parameters and connected inputs; ensure the visible result follows the graph.
- [ ] Export node textures as raw/sRGB/signed vector data; inspect their resolution and color in Blender/Unreal.
- [ ] Try automatic scalar/color/vector/bool/integer/normal conversions. Read conversion tooltips; invalid cycles must leave the old graph intact.
- [ ] Group selected nodes with Ctrl+G, remove grouping with Ctrl+Alt+G and reopen the saved graph.

## P0: layers, masks and source clarity

- [ ] Material swatches and mask thumbnails make the current target obvious. Confirm mask edits never alter material effects accidentally.
- [ ] Add Paint, Fill, Graph and generator effects in both lanes; check the selected effect controls the correct source and evaluation position.
- [ ] Double-click the mask thumbnail or row twice. Confirm isolated mask preview and restoration of the prior view.
- [ ] Assign a value, texture or procedural input to color, roughness, metallic, normal, height, AO, emission and opacity. Try image drag/drop and raw/sRGB choices.
- [ ] Adjust every channel opacity and the three supported channel blend selectors; inspect unrelated channels for contamination.
- [ ] Create/rename/collapse a folder, move layers into/out of it, hide/show it and remove the folder while retaining children. Save/reopen.
- [ ] Reorder anchored layers/effects. Invalid source ordering should be rejected with the previous project intact.
- [ ] Resize panes and use the compact layout. Toolbars, layer rows and Properties must remain accessible; hovering icons must reveal their action.

## P1: paint, viewport and bake

- [ ] Orbit/pan/dolly/wheel/frame in 3D and 2D; test perspective, FOV and all six named views with actual brush picking.
- [ ] Compare AA off/4x and inspect silhouette edges on the installed GPU.
- [ ] Import a supported HDRI, change exposure/strength and rotate environment/key light with controls and shortcuts. These settings currently last for the session.
- [ ] Compare hardness, spacing, lazy distance and finish behavior on slow/fast strokes and UV seams. Normal/height direct brushing is still unavailable.
- [ ] Fill a triangle, coplanar face, UV island and imported mesh group into the mask. Confirm only the selected region changes; undo and reopen.
- [ ] In Bake, import high meshes and a compatible cage. Compare front/rear distance, suffix pairing, low-as-high, map controls, preview, cancellation and stale-result detection.
- [ ] Bake/publish tangent normal, world normal, AO, curvature, position, thickness, mesh-group ID, bent normal, height and opacity ray coverage. Use those published images as graph inputs.
- [ ] Import final PNGs in Blender and Unreal. Verify normal Y convention, AO in ORM, roughness/metal range, height encoding and channel assignments on a reference prop.
- [ ] Reopen a prior schema-6 project and a portable material asset without lost masks/anchors/images.

## Not implemented: next engineering priorities

1. Reusable execution subgraphs/exposed parameters and graph assets; reroutes/multi-output sockets and atomic rewiring.
2. More compatible requested node algorithms/presets: 277 catalogue entries remain planned, 80 are partial and 60 require broader backends.
3. Nested layer groups, group masks/opacity, full material-valued bundles and advanced channel blends.
4. Multi-stop ramps, RGB curves/gamma, robust distance/Flood Fill/iterative fields and more generator families.
5. Production tangent/color matching, material/vertex ID, source color/alpha/emission transfer and robust cage provenance.
6. HDR project persistence/EXR, multiple atlases/texture sets/UDIM, 4K/8K budgets, tablet pressure/brush alphas and normal-height brushing.
7. Measured large-asset/large-graph performance, dependency/dirty-region recomputation and cross-GPU acceptance.

AAA readiness is not certified by the current automated checks. Artist validation results should be recorded against these concrete tasks and the per-request inventory.
