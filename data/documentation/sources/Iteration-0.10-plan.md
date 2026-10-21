# Surface3D 0.10: properties, coordinates, graph input and weathering

Preserve 0.9. Inspect original references and the user's Untitled.fbx / Untitled2.fbx without modifying them. Keep ordinary layers local and mask-free until the artist adds a mask. This pass prioritizes the following observable workflows.

## Priority order and acceptance

- [x] Compare the current inspector to the recorded Painter fill/brush/filter/generator contexts and official Painter/Photoshop documentation. Record the reasons for the new hierarchy and review actual screenshots twice.
- [x] Make Properties show one selected context: Layer material, Layer mask, Effect or Node. Remove duplicate layer-opacity controls, hide unrelated brush controls and put editable source/value/texture controls before advanced settings.
- [x] Make library texture thumbnails real draggable items. Drop onto the graph, an image node, a socket, material channel or layer/mask thumbnail; preserve target identity and undo.
- [x] Make completed mesh maps bind automatically to Texture Set settings and map nodes; use baked normal/AO in the material base without adding a hidden fill/template. Persist bindings and preserve rebake identities.
- [x] Make Custom HLSL findable in categorized search, procedural input menus and a direct graph action; aliases include custom/shader/code/HLSL.
- [x] Add a vector Fill coordinates source. Share it or Mapping between image/noise nodes, with explicit coordinate input sockets. Provide working node-local wrap/filter/tiling/offset/rotation, distinct from layer mapping.
- [x] Capture graph placement at the mouse before the popup opens. Use actual node dimensions and find the nearest free position. Snap selected nodes as a block and provide compatible-socket magnetic snapping with clear wire feedback.
- [x] Reproduce the cube bake and cage problem. Fix projection/cage continuity across split shading/UV vertices while retaining the Mikk shading basis; test geometric seam continuity, coverage and desktop-asset results.
- [x] Extend the requested Designer catalogue with implemented histogram, blend, directional filtering, normal and noise-family operations/presets. Keep remaining operations recorded instead of exposing empty nodes.
- [x] Add Rain streaks and Growing dirt brushes. Make gravity, density, streak size/breakup, growth, origin, surface influence and cavity influence understandable; use available baked fields and safe neutral fallbacks. Persist stamps and verify undo/save/replay. These are deterministic surface weathering brushes, not a fluid solver.
- [x] Build and run core/GPU/native mouse/keyboard checks, review fresh Properties/coordinates/drop/custom/weathering/cage captures and package a new release with measured evidence and an artist checklist.

## Reference decisions

Painter's recording separates projection controls from material/grayscale input, and switches Properties to the selected tool/effect. Photoshop's brush settings group tip/texture/scatter controls by purpose. Surface3D will use the selected layer/effect/node title, a clear material/mask switch, named source controls, one channel selector and expandable Coordinates/Advanced groups. The node graph remains directly editable.

This pass adds working operations that fit Surface3D's texture graph. The full requested procedural catalogue, renderer closures, arbitrary multiple outputs and nested executable graphs require further engine work and stay explicit in the catalogue.

## Acceptance evidence

All 30 development checks passed in the final source build. Two visual reviews, delivered-project checks and the residual cube-miss scope are recorded in Verification-0.10.md and review-10/UI-review.md. The artist production checklist remains unchecked.
