# Surface3D 0.32.1 — displacement crash fix

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
