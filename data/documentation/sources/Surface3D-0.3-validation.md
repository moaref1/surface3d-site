# Surface3D 0.3 validation

Final build: 7 October 2026, native Windows Visual Studio v14.38 Release build. All nine CTest checks passed on the observed NVIDIA GeForce RTX 5050 adapter. Test duration is not a performance benchmark.

Checks: document_and_recovery; analytic_bake_contract; studio_render_and_export; studio_geometric_bake; studio_editable_graph; gpu_pipeline; masks_effects_and_anchors; studio_mask_effect_workspace; studio_export_workspace.

New numerical checks cover black/inverted/disabled masks, ordered and disabled effects, attached color/material snapshots, hidden source anchors, live roughness changes, effective mask references, safe source deletion/move, typed outputs, duplicate/import IDs, editable material asset preservation, GPU replay, box-blur neighborhoods and encoded Normal Y values. Original schema-1/2/3 fixtures load, migrate to schema 4 and reproduce GPU color output.

Native Paint, Graph, mask/effect and Export captures were inspected. The mask/effect review found and corrected an early return that hid effect graphs on nonprocedural layers. UI captures verify layout, not every interactive input. Rendering is approximate; HDR shading, high/low projection and advanced maps remain pending. WARP, other GPUs, varied DPI, long-running memory budgets, actual tablet input and import into Blender/Unreal have not been verified by this run.

Backlog integrity checks: 426 unique visible/requested-control IDs, 3,245 unique release-source IDs, all review-note links exist. Fifteen section notes and twelve map notes are retained. Full source parity is not claimed; brief video transitions and hidden/unexpanded controls need further inspection.

Raw test log: build-native/Testing/Temporary/LastTest.log. Actual UI screenshots and saved example projects are in build-native/studio-*-evidence. Generated images under docs/design are concepts with planned features.
