# Surface3D 0.32.1 — displacement and artist interface refinement

## Causes found

- Generated subdivision geometry was checked against the imported mesh triangle limit during tangent generation. A valid preview could fail even with sufficient preview memory.
- The subdivision budget was tested before multiplying each level by four; the final allocation could exceed its intended budget.
- A displacement update could throw while the viewport settings popup remained open, producing the misleading ImGui Missing EndChild recovery warning.

## Changes

- Preflight final geometry growth before allocating. Preview geometry keeps its independent two-million-vertex budget; imported mesh limits remain in force for actual imported meshes.
- Subdivision control shows the maximum supported level for the current mesh. Small meshes can still use level four.
- Stored oversized levels safely use the highest level that fits the preview budget.
- Build preview mesh and GPU buffer before replacing the previous working state.
- Reserve subdivision arrays once; avoid copying large vertex/UV arrays only to clear them.
- Close the viewport settings popup during exception unwinding. Subdivision-edit errors are handled locally after restoring the document.
- Node calculation workers do not build displaced display geometry.

## Verification

Tests include safe level-four CPU and GPU previews, refusal before oversized allocation, GPU fallback for a stored level-four request on a denser mesh, existing displacement silhouette checks, native workflow interactions and mixed-resolution graph checks.

This fixes tested code paths; the exact mesh from the screenshot has not been identified/reproduced. CPU subdivision can still take time on dense meshes. Display displacement still does not alter model export or ray-render geometry.

## Artist interface refinements

- Recent projects tab in the New Project landing dialog; unavailable files are disabled. History belongs to the installation folder.
- Gold outline and eye on the node currently previewed; gold ring on previewed reroutes.
- One-click resolution selector with Default, Project and explicit sizes. New nodes have input resampling unchecked; existing saved choices remain intact.
- Multi-selection edits compatible numeric controls by matching name and type. Resolution and input resampling apply across selected processing nodes, including mixed selections. Unrelated parameters and connections are preserved.
- Ctrl + right-drag draws a persistent red connection-cut trail.
- Graph-only quick-add shortcuts, directional selection, Tab / Shift+Tab cycling, and shortcut help on slash. Text editing and other panels retain their own keys.
- Ctrl-click selection preserves the original selected node before toggling the clicked node.

See Graph-shortcuts-0.32.md for mappings. Parameter batch edits use the same undo operation as the original edit.

Input resampling OFF preserves upstream processing size and resizes the result to the selected output size. It does not force expensive processing to a new size unless enabled. Default output size is capped at 1K or the smaller project resolution.

## Final build verification

All 8 affected regression checks passed, including native artist input, document recovery/batch rules, material contracts, workflow/displacement and mixed-resolution processing. Portable startup and both landing tabs captured successfully; the recent-list and gold node-preview indicator were visually inspected. The portable folder is releases/Surface3D-0.32.1-refinement.
