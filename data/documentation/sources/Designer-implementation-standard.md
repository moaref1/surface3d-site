# Designer node coverage and responsive authoring

The full requested Designer compositing library remains the target. The [348-entry inventory](Designer-node-index.json), separate atomic-node requirements and [coverage gate](Designer-library-audit.md) are authoritative. A visible name, seed variation or approximate substitute does not close a reference entry. Finish this coverage before authoring the requested 400 assets.

## Evidence informing the design

[Blender's dependency-graph design](https://developer.blender.org/docs/features/core/depsgraph/) updates affected dependencies rather than all scene data, and separates visibility work from evaluation. [Material Maker's renderer management](https://github.com/RodZill4/material-maker/blob/master/addons/material_maker/engine/multi_renderer.gd) uses bounded renderer availability and a separate rendering thread with frame-yielding waits. These support dependency-driven caching and bounded background jobs as design choices for Surface3D. They do not prove our implementation has their performance.

The [official Designer index](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/node-library) and each detailed node page define functional coverage. Surface3D implementations remain original. Study algorithm contracts and scheduling ideas; record licenses and attribution if any external code is later adopted.

## Required node contract

1. Record every documented input and output, disconnected default, data type and required mesh/material data. Distinguish encoded normal textures, signed vectors, color, alpha, scalar data and structured bundles.
2. Record each artist control's meaning, units, useful range, default, reset behavior and map influence. Hide inactive controls. Enable typed values, linked axes and consistent coordinate inputs where applicable.
3. Consolidate modes with the same mathematical operation and contract. Preserve recognizable reference names in search, tooltips and coverage mappings. Do not merge operations with different spatial/data semantics merely because their names resemble one another.
4. Keep type conversion explicit in the execution plan. Preserve HDR values, alpha and raw map data; normal conversion must retain orientation and renormalize at the appropriate boundary.
5. Implement exact repeat/clamp/mirror and texel-center behavior. Define filtering, image/mesh coordinate space, normal transformation and output precision. Test periodic edges and transparent pixels with independent oracles.
6. Expose useful controls in Paint and full editing in Graph against the same source data. Functions need stable port IDs, dependency closure, instance overrides, cycle rejection and meaningful error states.
7. Verify save/load, undo, duplicate, source edits, graph preview, live publication and library export. Renaming must retain the original node type and all stable connections.

## Responsiveness requirements

- Build one dependency plan per semantic graph change. Cosmetic edits, moving nodes, selection and renaming must not invalidate image computation or recompile shaders.
- Evaluate output ancestors and requested previews. Avoid full-size processing of unrelated/disconnected nodes. Thumbnail evaluation needs a bounded, separately tracked workload.
- Cache expensive spatial analysis by semantic inputs, source image revision, resolution, coordinate/boundary settings and required contextual data. Invalidate dependents, not every node.
- Keep built-in shader code stable; update parameter buffers for parameter edits. Cache custom bytecode by exact active source, types and compiler settings. Validate before replacing the working shader.
- Move expensive readback/CPU preprocessing and publication into bounded jobs. Tag results with graph/document generations, reject stale completion, coalesce rapid edits, preserve cancellation and cap queued memory. Immediate D3D11 context use needs one owner; worker code must not race UI rendering.
- Give interaction and preview work priority over final-resolution generation. Exports must wait for the current complete result, with visible progress/cancellation; never silently export an outdated preview.
- Reuse scratch fields according to dependency lifetimes. Preserve precision first; reducing precision requires independent error measurements.
- Measure input-handler time, shader compilation, CPU processing, GPU execution, readback waiting, memory and final-result latency separately. Test adding, connecting and editing dense filters at 1K, 2K and 4K.

Active-output dependency pruning is now implemented and regression-tested for full-resolution spatial work; cheap available thumbnails stay live. UI slider edits are coalesced with a final release update. Background image analysis, tiled residency and universal preview scheduling remain pending; the current implementation must not be labeled fully asynchronous or fully responsive at every node/resolution. See [current development results](Latest-development-results.md).

## Work order

1. Retain the tested 0.23 function/port, Sample Texture, live-output and 4K foundations.
2. Add scheduling and dependency-plan tests before expanding expensive operator families.
3. Complete structured material/placement data and in-context function inputs, enabling aligned multi-map transformations and distribution without ambiguous Color sockets.
4. Complete sampler/mapper/splatter contracts, dense image/normal operators and atomic programming graphs.
5. Implement and verify every remaining named noise, pattern, mask, weathering, scan, mesh and HDRI family against its detailed reference.
6. Audit duplicates and artist controls, then close individual inventory rows with evidence. Only after the complete gate passes, build 100 maps/patterns, 100 generators, 100 smart masks and 100 filters using those verified nodes.
