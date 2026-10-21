# Surface3D 0.12 — Paint workflow audit and implementation

Scope: the user's last three clarifications. A complete ordinary prop workflow in Paint, direct layer/mask resources and values, optional synchronized Graph, and accessible painted/automatic simulations. These requirements extend the existing bounded engine; they do not certify all Painter or Designer features.

## Reference audit

Revisited the latest Painter screenshot (assets, viewport, Properties–Fill, Layers). Reviewed video-2 frames at 112, 234 and 268 seconds, plus newly extracted original-video frames at 240 and 278 seconds. Read the existing fill/projection, layering/effect, mask/generator and brush notes. These samples substantiate the workflow/layout; this pass does not claim a new exhaustive frame-by-frame review or recover Adobe algorithms.

Findings:

- Paint allocated a graph dock and could open it when adding resources/effects.
- Value / Texture / Procedural buttons made input assignment a mode decision.
- Removing a texture did not have an independently retained channel value.
- Material/mask effects reused graph terminology and forced source-node selection.
- Physics parameters lived in Node Properties; automatic sources were difficult to discover.
- Folder masks had basic controls but their texture/simulation controls required Graph.
- Shared graph instances could expose controls, but applying them switched workspaces.
- Duplicate projection/input controls competed for space with the actual artist task.

## Implementation and acceptance

- [x] Keep Paint's viewport full-height and hide both node panels there.
- [x] Keep Graph/Bake layouts separate; regenerate the 0.12 Paint layout without altering 0.11.
- [x] Preserve Paint on resource, generator, effect and library application.
- [x] Add one resource slot per channel/mask, with direct texture drops and a resource picker.
- [x] Retain independent uniform fallbacks and restore them on input removal.
- [x] Preserve image transforms/identity on replacement; avoid repeated replacement allocations.
- [x] Keep normal/height/AO/emission/opacity usable from Paint, alongside color/roughness/metallic.
- [x] Reuse actual graph parameter controls in Paint without displaying wiring or node-management controls.
- [x] Show only sources feeding the selected channel/mask; preserve arbitrary graph connections.
- [x] Expose common UV/projection controls and existing shared Coordinates directly.
- [x] Create named Rain film / Dirt transport effects, editable in Paint.
- [x] Expose painted, ground, combined and whole-mesh sources and duration in seconds.
- [x] Add GPU source/result thumbnails without CPU readback.
- [x] Allow result preview on mesh/UV without opening Graph.
- [x] Give folder masks the same resource/parameter controls.
- [x] Persist fallback identities in schema 13, retaining old readers.
- [x] Verify core/GPU fallback, undo, persistence and image reuse regressions.
- [x] Verify actual native Paint → Graph → Paint interaction and automatic simulation.
- [x] Run the complete existing suite and repair regressions.
- [x] Review native screenshots twice, correct clipping/confusion and publish a verified 0.12 package.

## Final review

The 33-check suite passed after the final build. The packaged application passed six additional runs for Paint input, Graph/brush input, bake/export input, saved Rain output, folder mask and an older 0.11 project. The Paint fixture verifies the actual texture drop, resource removal and uniform restoration, undo/redo, optional Graph editing and return to Paint. A Graph search focus regression was repaired: Shift+A works when hovering the graph canvas even if a neighboring dock retained focus. The simulation Duration label now sits above its slider rather than being clipped outside the panel. New Paint-created simulation effects begin at Mask gain 8 to show a useful result; existing nodes/projects keep their authored gain.

Two native screenshot reviews covered the direct roughness controls, Graph-to-Paint resource synchronization, folder masks and automatic Rain source/result controls. Physical output shows the known 128² resolution limits. No additional node kind was needed. The existing stable nodes power these new controls.

## Node decision

No new stable node kind is required for this workflow. The existing 109 kinds include image inputs, material/mask outputs, Coordinates, baked-map inputs and Physics brush. Adding a duplicate “Paint texture” or “Rain effect” node would create two authoring systems. Paint controls operate on those existing graphs. The new uniform-fallback metadata belongs to graph outputs; it is not an alternate renderer.

Remaining broader work includes the 128² physical approximation, flat folders, one atlas, bounded node/image/layer budgets, exposed-control limits on linked instances and synchronous PNG8 export. Those do not disappear through a UI redesign.
