# Surface3D 0.7 verification

Candidate built and checked on 8 October 2026, Windows x64 / Direct3D 11, NVIDIA GeForce RTX 5050. Build uses Visual Studio C++ v14.38, Release configuration. Earlier 0.6 executable package remains untouched.

## Automated result

**18/18 checks passed.** Final complete source-suite duration was 8.09 seconds with the unchanged-shader cache populated. An earlier cold graph-shader compilation took about 28 seconds inside the render check. These are observed correctness-suite/startup timings, not asset-processing benchmarks or cross-hardware performance claims.

| Check | Evidence |
| --- | --- |
| document_and_recovery | Document invariants, undo/redo, saved project/recovery |
| analytic_bake_contract | Analytic UV maps and geometry fixtures |
| studio_render_and_export | Actual native draw list and exported PNGs |
| studio_geometric_bake | Background bake result/PNG capture |
| studio_editable_graph | Native graph workspace with GPU card previews |
| gpu_pipeline | Real GPU paint/fill/material evaluation |
| masks_effects_and_anchors | Ordered snapshots, anchor dependencies and masks |
| studio_mask_effect_workspace | Actual material/mask effect interface |
| studio_export_workspace | Native export workspace/output validation |
| studio_graph_mouse_keyboard | Real selection, dragging, search, wiring, parameter edits, texture picking, navigation and export |
| studio_full_mask_view | Effective mask view capture |
| viewport_import_and_names | Mesh imports, viewport coverage/picking and export names |
| studio_compact_layout | Actual compact docked layout |
| textures_nodes_and_previews | Each implemented non-anchor/output node family dispatches and returns finite values; image/color-data sampling and preview routing |
| projection_and_ordered_layers | BVH projection, cage/name matching, normal convention, AO/thickness/cancellation and channel blend ordering |
| studio_layer_bake_mouse_keyboard | Real effect selection/painting/clipboard/undo and bake controls/job publication |
| artist_node_workflow_contract | Numerical vector dot/color luminance/HSV/range/curve/mapping/Switch, XYZ noise variation, 128-node chain, eight outputs, independent coverage/channel opacity, folder persistence/visibility, frozen schema6, region masks, full-size node/normal/ORM export, RGBE/RLE, perspective picking and MSAA |
| studio_artist_mouse_keyboard | Ctrl multi-select, batch clipboard/delete/undo, selected-only arrangement, sweep cut/undo, Space/previous-view restoration, mask double-click/restore, individual collapse, group frames, F2 rename and folder icon action |

Numerical fixtures are more specific than dispatch/finite checks; the latter alone do not establish an algorithm's correctness. Exact third-party node behavior, all operation modes and production workloads remain unverified. The new example saves/reopens successfully and produces actual normal/height/AO-aware Unreal maps.

## Visual review and fixes

Reviewed real wide graph, compact layers and native artist captures. Fixed first-frame graph clipping, old generated-card overlap, compact toolbar clipping and layer-list starvation. Native input checks exposed and fixed unrelated-row spacing during selected arrangement and hover blocking during RMB wire cutting. Preview state now has a visible label and Return control. F2 was verified after graph focus, matching graph shortcut scope.

Baking keeps its separate map/common/view controls. Perspective cage/high overlays now use the same depth/FOV factor as mesh projection. Depth-tested cage editing and robust imported polygon/cage provenance remain beyond these translucent overlays.

## Remaining acceptance

[Artist checklist](Surface3D-0.7-artist-tests.md) has explicit unchecked hands-on tasks. Cross-GPU/MSAA behavior, tablet input, visual usability, imported Blender/Unreal tangent/color matching, large meshes/graphs/atlas budgets and production performance need additional evidence. Full AAA readiness and complete Painter/Designer node parity are not certified.

The [487-row request inventory](Requested-node-catalogue.csv) distinguishes 51 bounded counterparts, 80 partial counterparts, 277 planned requests, 60 backend dependencies and 19 headings. A matching name is not accepted as an implementation.

Packaged executable checks: included procedural project opened/rendered successfully; native artist input workflow passed. A final folder-order regression verifies creating a new folder preserves the layer identity/order and exact rendered color.
