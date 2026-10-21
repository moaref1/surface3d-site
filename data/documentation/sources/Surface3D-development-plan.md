# Surface3D development plan

Current implementation update (7 October 2026): Surface3D 0.3 now has a docked modern UI, OBJ geometry, low-mesh Position/World Normal baking, editable contextual GPU graphs, ordered effects and named final-layer anchors. The original starting-point section below is historical. Read docs/Surface3D-0.3-features.md and docs/video-reference/README.md for current acceptance and the expanded backlog. Full baseline parity and high/low projection remain unfinished.

Plan written October 7, 2026. This document defines future work; it does not claim implemented parity.

## Reference version and completion contract

The previous research recommended Painter 1.3 as the early functional reference, 4.1 as the workspace reference, 6.2 for modern tiles, and 8.3/12.1 for advanced baking. It did not establish a single full-parity version. Make the first complete functional milestone **Substance Painter 1.3.5**, including inherited capabilities from beta 0.1 through 1.3.5. This pins the 1.3 family to a patch release. The modern Surface3D concept remains the UI target; we do not recreate the 2015 interface.

Source: the previously extracted user-supplied Adobe release history, cross-referenced to https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/release-notes/all-changes . The installed 12.0.2 application is supplemental evidence, not the early milestone target.

`Painter-1.3.5-baseline-ledger.csv` preserves all 317 source statements through that version: 179 under Added and 138 under Fixed. These are historical statements, not 317 unique features or a complete specification. Some source headings/classifications require semantic review: fix-like statements can appear under Added. Release notes describe changes, so inherited behavior also needs workflow/documentation inspection.

Every ledger entry must get a reviewed requirement, applicability, implementation link and acceptance check. Merge duplicate requirements while preserving every source ID. Convert fixes into regression checks. Platform-specific items receive a documented Windows equivalent or an explicit applicability decision; source-engine details such as OpenGL state controls require a documented custom-render-state equivalent. No entry silently disappears. Proprietary asset engines and file compatibility require explicit feasibility decisions rather than being marked complete by substituting a UI button.

Completion states: unassessed, specified, planned, partial, implemented, verified, or applicability decision with reason. Current ledger entries remain unassessed; a map catalogue is not a completed mesh baker.

## Current starting point

Original C++/HLSL Windows application with D3D11 painting, sphere/UV preview, simple paint/fill layers, masks, opacity, undo/redo, project IO and Blender/Unreal exports. Current baking generates eight CPU analytic sphere references and offers a twelve-map explanatory catalogue. Imported meshes, ray projection, docked modern UI and procedural graph evaluation are absent. Existing tests pass; the new native bake window has not been visually verified because the computer-use runtime could not initialize.

## UI and UX direction

Apply the supplied Apple design guide as interaction/design guidance adapted to Windows. Keep the Surface3D concept's charcoal palette and restrained teal accent, familiar Painter layout and consistent icon language. Use Segoe UI/system typography, readable contrast and clear focus outlines. Reserve translucency for small floating surfaces; keep numeric editors and production panels opaque by default. Honor reduced motion, reduced transparency, high contrast and text scaling.

Layout: top project/command bar and Paint/Bake/Graph workspaces; left tool rail and searchable asset library; central 3D/2D/split viewport; right texture sets, layer stack and contextual inspector; bottom expandable graph and job status. Panels resize, collapse, dock, save and restore. Bake is a nonblocking workspace alongside the viewport, replacing the current modal catalogue.

Interactions: immediate pressed feedback, commit on release, cancel a press by dragging away; direct splitter/slider tracking with capture; numeric typing beside every slider; units, valid ranges, reset and defaults visible. Group continuous scrubbing into one undo action. Escape cancels an edit. Motion is short, interruptible and restrained; never animate a numeric value away from the pointer or block input during a transition. Preview affordances show what changed and which maps require rebaking.

Centralize commands before assigning shortcuts. Establish a documented, remappable Painter-compatible preset by verifying actual bindings rather than assuming current SurfaceLab keys match. Preserve Windows save/open/undo conventions, show bindings in menus/tooltips, add command search and conflict reporting. Suppress painting shortcuts while typing. Treat Ctrl+Shift+B as the current Surface3D Bake binding until compatibility is verified.

## Adjustable baking model

Persist a versioned BakeSettings document; capture immutable job snapshots. Global settings inherit into each texture set and each map, with explicit overrides and a reset-to-inherited action. Parameters must alter actual computation; unavailable backend options remain visibly unavailable.

| Setting group | Parameters and interaction |
| --- | --- |
| Sources and pairing | Low/high mesh lists, explicit pairs, suffix matching, material/texture-set targets, transform/units, isolation groups |
| Projection | Cage mesh or generated cage offset, front/rear ray distances in scene units, normalized-distance option with displayed equivalent, backface policy, normal averaging, skew correction |
| Output | Resolution and aspect ratio, map enablement, normal convention, precision/format, UV set, dilation in pixels, AA/sample quality, file names and destination |
| Sampling and jobs | Deterministic seed, samples, distance limits, backend selection when available, estimated memory, preview quality, cancellation, selected-map rebake |
| Diagnostics | Missing UVs, invalid geometry/tangents, cage intersections, missed rays, overlaps, mirrored islands and pairing errors shown in viewport and list |

Validate numeric values, units, dependencies and memory before dispatch. Warn inline rather than making users discover invalid settings after Bake. Keep the last successful map set active until a complete validated replacement is published. Persist source/settings fingerprints; invalidate only affected outputs. Cancellable background jobs report map/target progress; never fabricate a percentage or GPU timing.

| Map | Specific settings | Procedural use |
| --- | --- | --- |
| Tangent normal | MikkTSpace convention, DirectX/OpenGL Y, tangent source, projection distances | Normal detail/blending; matched Blender/Unreal shading |
| World normal | Coordinate frame and axis orientation | Directional dust, snow and slope masks |
| AO | Ray count, distribution, near/far distances, spread, self/group occlusion, backfaces | Cavity dirt and material breakup; separate AO output |
| Curvature | Signed/convex/concave output, measurement radius, source method and scale | Edge wear, recess grime and mask remapping |
| Position | Coordinate frame, bounds, normalization, axis | Gradients, waterlines and height-dependent weathering |
| Thickness | Inward ray distribution, samples, maximum distance, open-surface policy, normalization | Thin-area masks, transmission/subsurface inputs |
| Material/color ID | Material/mesh/vertex-color source, palette, exact selection and filtering policy | Material assignment masks |
| Bent normal | Visibility rays, distance, frame, normalization | Ambient direction and directional masks |
| Height/displacement | Signed distances, range, midpoint, units, high precision | Height blending, parallax and displacement |
| Opacity transfer | Source alpha, coverage/filter policy and cutout threshold | Cutouts and coverage masks |
| Base-color transfer | Source material/vertex color, sampling and color-space conversion | Reusable fill color and palette inputs |
| Emissive transfer | Source emission, linear intensity/range and precision | Emission material inputs |

First target includes the six integrated 1.3 map families: normal, ID, AO, curvature, thickness and position. World normals support orientation-driven generators. Bent normals, height and transfers are additional Surface3D milestones; they do not redefine historical 1.3 parity. Ground plane, cage painting and newer advanced bake workflows belong to later reviewed requirements.

## Implementation sequence and acceptance gates

1. **Coverage and architecture.** Review every baseline statement, split combined statements, consolidate duplicates and enumerate inherited workflows. Separate commands, document, geometry, bake jobs, graph and UI. Evaluate a native UI framework in a small docking/accessibility/GPU-viewport spike before replacing the shell. Keep working C++/D3D11 modules; Rust is optional behind a narrow boundary, not a prerequisite rewrite. Gate: every source ID is traceable; UI technology choice demonstrated on Windows.
2. **Appealing interactive workspace.** Build the concept layout, system typography, icons, selection/focus states, adjustable panels and contextual inspectors. Add parameter editor components, undo-aware scrubbing and command bindings. Gate: visually verified at multiple DPI/text sizes; keyboard access, no clipping, persistent layout and no shortcut leakage into text fields.
3. **Parametric Bake workspace.** Persist common/per-set/per-map settings and presets; provide source lists, warnings, inherited overrides and stale-map indicators. Only analytic settings that affect real sample computation are enabled until the projection backend exists. Gate: settings roundtrip, invalid inputs rejected, undo/reset/inheritance work, availability accurately represented.
4. **Real geometry and first projection bake.** Validated mesh import, UV/material sets, depth-tested view, picking and MikkTSpace integration. Start with low/high pairing, cage distances, tangent normals and ray-hit diagnostics on a reference mesh. Add a measured GPU compute implementation or a separate DXR backend after testing capability/fallback paths. Gate: known geometry produces expected normals; misses/cage errors visible; mirrored UV/tangent tests; cancellation keeps last good outputs.
5. **Complete baseline maps.** Implement ID, position, AO, thickness and curvature with defined numerical conventions, sampling, AA and dilation. Add normal-world outputs and reusable map resources. Gate: reference-mesh checks, deterministic seeds, seam behavior, unit scaling and CPU/reference versus GPU tolerances. Benchmark time and peak memory at supported resolutions.
6. **Procedural fill integration.** Typed GPU graph with map-input, constant, UV/triplanar, noise, remap, blend and material-output nodes. Stable map IDs, cycle rejection, exposed parameters, caching and dependent-map invalidation. Gate: baked curvature -> remap -> noise-modulated edge-wear mask -> fill; AO -> dirt mask; adjust/rebake updates the mesh; save/reopen reproduces it.
7. **Finish cumulative Painter 1.3.5 capabilities.** Deliver all reviewed inherited painting/brush/project/library/export requirements plus 1.3 smart materials, ordered effect stacks, fill effects and effect blending, triplanar projection, shadow/alpha preview, versioned project shader settings and compile-error recovery. Include save locking and patch regression requirements. Gate: every applicable baseline requirement is verified or has an explicit unresolved decision; no full-parity claim while any required behavior is missing.
8. **Advance modern references.** Apply 4.1 workspace requirements, 6.2 tile model and 8.3/12.1 advanced baking, then the remaining full-history ledger. Add remaining Surface3D maps, deeper Designer-style graphs and tested Blender/Unreal profiles. Keep all later requirements in the roadmap; do not remove them to hit the early milestone.

## First development increment after this plan

Start with the command/UI-framework spike and persistent BakeSettings model, then replace the modal Bake catalogue with a docked inspector containing directly editable resolution, convention and map settings. Follow immediately with real mesh import and the first tangent-normal projection workflow. Do not spend another increment polishing constant sphere AO as if it were a production baker.

The first integrated demonstration must be: import low/high mesh -> inspect pairing/cage -> edit parameters -> bake selected maps with progress/cancel -> preview map -> use it in a procedural mask -> see material update -> save/reopen -> export with the chosen Blender/Unreal conventions.

Estimates follow the geometry/UI spikes. Complete Painter parity is a multi-milestone engineering effort; this plan makes no one-hour full-parity promise.
