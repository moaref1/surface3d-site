# Surface3D 0.29 — 17 workflow results

Build date: October 12, 2026. Original Surface3D implementations. All 11 affected regression checks passed, including native mouse/keyboard interaction, document recovery, layer blending, spatial nodes, reusable graphs and stencil behavior. This is a development build; the scoped limitations below remain relevant.

| # | Result | Evidence / supported scope |
|---|---|---|
| 1 | ✅ Faster Flood Fill | Background CPU island analysis during editing, bounded jobs, stale-result rejection and last-completed preview reuse. Independent reference comparison produced identical pixels. On the development machine, the final 2K / 16,384-island ID fixture fell from **77.60 ms to 60.06 ms**, approximately **23% less CPU time**. GPU readback/upload still has a cost; this is not GPU Flood Fill. |
| 2 | ✅ Independent tile-edge connectivity | **Connect across tile edges** is separate from image sampling wrap. Tests prove that border islands join when enabled and remain separate when disabled. |
| 3 | ✅ Controlled graph dragging | Dragging nodes/connections no longer triggers ordinary canvas panning. Node drags auto-pan only near canvas edges, at a bounded speed. Native fixture checks insertion without unintended view movement. |
| 4 | ✅ All 100 asset previews are 3D | Existing and new ready recipes now have pipe previews. Regenerated from the demo pipe with DXR on the tested adapter, with a fallback bake path. Every preview is 256 × 256. This is 100 ready assets, not completion of the earlier 400-asset request. |
| 5 | ✅ Multiple layer selection | Shift selects a contiguous range; Ctrl toggles items. Compatible duplicate/delete, visibility, reordering and folder moves retain ordering and stable identities. |
| 6 | ✅ Drag-copy masks | Drag a mask thumbnail onto a layer or folder. The source remains; the copy receives independent effect identities. Folder copies become editable mask graphs. Native drag and core ownership checks pass. Layer and folder GPU masks both match the independent 0.46 expectation for a 0.3 mask with 40% Invert; folder compositing is also checked. |
| 7 | ✅ Insert nodes into connections | A compatible node dragged onto a wire receives a visual insertion target. Release inserts transactionally; ambiguous sockets and invalid cycles are rejected. |
| 8 | ✅ Connections in either direction | Start at an input or an output. Dragging an input into empty graph space opens compatible-output search and connects the chosen node. |
| 9 | ✅ Compatible search and project history | Search filters the pending socket type and ranks matches before per-project recent nodes. Enter adds the highlighted/first result. History persists in the project. This is local recent usage, not predictive learning. |
| 10 | ✅ Selected-only arrangement and shortcuts | Ctrl+L arranges the selected nodes; with no selection it arranges the graph. Existing node-search, preview and editing shortcuts remain available. |
| 11 | ✅ Compact reroute points | Reroutes are 14-pixel points with larger invisible hit targets. Left/right halves accept input/output interactions; Alt-drag moves the point. |
| 12 | ✅ Height-driven preview geometry | Optional subdivision and actual height-driven vertex displacement. **Disabled by default.** Strength and midpoint are editable. The independent off/on fixture changed 1,097 silhouette pixels. Raster preview only: original authoring/bake/export mesh and ray-tracing geometry retain their base geometry. |
| 13 | ✅ UV workspace beside Bake | Separate 2D UV canvas and 3D checker view, synchronized island selection, seam boundaries, approximate overlaps, texel density, UV-channel selection and tile/outside-0–1 diagnostics. UVs outside 0–1 remain legal. Density currently uses preview units; small overlaps can escape sampled diagnostics. |
| 14 | ✅ Basic UV editing | Auto unwrap, move/rotate/scale, G/R/S followed by axis keys, typed input, snapping, fine adjustment, cancellation and simple selected/all-island packing. The unwrap is **box-projected charts**, suited to simple props; it is not an organic-mesh conformal unwrap. Packing uses island rectangles and optional 90° rotation. |
| 15 | ✅ Reversible UV edits and paint transfer | Surface-attached painting is remapped transactionally; undo/redo restores it. Legacy UV-only marks are counted and warned about. Changed UVs invalidate baked-map bindings and flag rebaking instead of silently using old maps. Arbitrary topology changes cannot guarantee paint transfer. |
| 16 | ✅ Export 3D Model | OBJ + MTL export for the scene or selected object, retaining active UVs, normals, object and material names. Optional adjacent texture export uses the existing texture template system. This first implementation exports the active UV channel, not FBX/glTF or a complete shader interchange. |
| 17 | ✅ Reload / Replace Mesh | Reload the persisted source file or choose a replacement. Match material/texture sets, retain compatible layers/graphs/settings and object state, reproject attached paint and identify rebaking work. Unmatchable painted surfaces are rejected or reported rather than discarded. |

## Validation records

- `build-023/workflow29-regressions.log`: 11 / 11 affected checks passed, 112.91 seconds total.
- `build-023/workflow29-final-validation.log`: all three final workflow checks passed, including the independent rendered layer/folder mask comparison.
- `build-023/workflow29-flood-timing.txt`: independent before/after CPU timings and pixel agreement.
- `build-023/workflow29-evidence/Results.txt`: core/GPU contracts, UV editing, persistence, OBJ roundtrip and displacement.
- `build-023/workflow29-ui/Workflow29-UI-results.txt`: native interaction contracts.
- `build-023/workflow29-ui/Workflow29-7.png`: UV layout/checker capture.
- `build-023/workflow29-evidence/Displacement-off.png` and `Displacement-on.png`: actual geometry silhouette comparison.
- `build-023/workflow29-assets.log`: 100 preview regeneration result on the NVIDIA GeForce RTX 5050 development adapter.

These are measured results on one machine. They do not establish universal hardware speed, complete Substance Designer parity, unlimited 8K authoring or production certification. Projects now use schema 31; previous releases are preserved, but older builds cannot read new-schema projects.
