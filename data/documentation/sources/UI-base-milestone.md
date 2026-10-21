# Current priority: a decent, stable base

User scope supersedes the earlier feature-expansion order: prioritize interface structure, interaction, familiar navigation and bugs. Retain every larger requirement in the existing ledgers. Avoid expanding small options or node/map catalogues until the main workflow is dependable.

## 0.5 verified update

The latest user request specifically adds image inputs, node previews and UE-style graph controls to the interface-first scope. This pass fixes duplicate channel control IDs, gives the viewport explicit drag ownership, and removes the small square mesh clip. Real app input checks exercise Navigate orbit, pan, right-drag zoom and wheel zoom, rather than relying only on numerical camera/picking tests.

Layer effects now group under MATERIAL and MASK, with shared source choosers for fill channels, masks and editable graph sockets. Image assets are selectable and draggable; fill tabs route actual GPU color/roughness/metallic values. Selected nodes own the relevant Properties page and evaluated preview. Socket snapping, grid snap, Arrange, single-node clipboard and shortcut additions are implemented. Thirty-seven working node kinds are distinguished from the [retained requested catalogue](Node-catalogue.md).

Remaining base priorities: real drag/drop and snapping regressions; denser graph/stack navigation; multi-selection; atomic rewiring; clearer asset replacement/removal workflow; varied device/DPI testing and import/project wizard. Full high/low/cage baking and multiple texture sets remain backend gaps. See [0.5 guide](Surface3D-0.5-features.md) for current usage and all material limits.

## Historical 0.4 baseline

| Priority | Workstream | 0.4 progress | Remaining acceptance |
|---|---|---|---|
| 1 | Broken interactions | Actual graph input test passes, including typed parameter editing | Broader adversarial overlap/drag/popup tests |
| 2 | Layer/mask separation | Separate selection, real mask thumbnails, explicit mask/effect context | Complete nesting design; cross-target effect ordering remains one numbered evaluation list |
| 3 | Viewport controls | Separate 2D/3D pan/zoom, orbit, dolly, framing and matching picks | Input coverage on large meshes and varied devices |
| 4 | Context-state bugs | Stale selection cleared; global shortcuts repaired; default Layers tab visible | Long-session and project-switch UI scenarios |
| 5 | Main workspace | Assets/viewport/right stack/properties; separate settings tab | Further comparisons against video and user testing |
| 6 | Graph usability | Real editable graphs replace preset-only diagrams | Denser graphs and clearer error presentation |
| 7 | Relevant Properties | Mask/fill/paint/effect context and narrow-panel wrapping | More consistent hierarchy and inline explanations |
| 8 | Familiar shortcuts | Working contextual F/F3, Shift+A/Delete/Ctrl+D and global commands | Remappable bindings remain deferred |
| 9 | Docking/resizing | Separate Paint/Graph/Bake layouts; compact layout inspected | Mixed-DPI/multi-monitor verification; named layouts later |
| 10 | Import/project dialogs | Open-format importer, actionable missing-UV errors, transient context reset | Project wizard and stronger import preview; no automatic production unwrap |
| 11 | Export workflow | Output table, Unicode paths/names, inline failures, real dialog interaction check | Background export/progress and broader path/failure coverage |
| 12 | Baking interface | Dedicated workspace, available-map list and large preview | Actual high/low/cage backend must precede operational controls for those features |
| 13 | Visual consistency | Shared typography/colors/icons, outlines and compact wrapping | More comprehensive sizing/accessibility review |
| 14 | Responsiveness/errors | Thumbnail caching, gesture-bound thumbnail refresh, local export errors | Profiling, GPU budgets, incremental evaluation and device-loss recovery |
| 15 | Basic end-to-end workflow | Import fixtures, UI edits, undo, schema/recovery, export checks | Manual Blender/Unreal roundtrip remains unverified |

Immediate next base pass: review the actual build with the user; refine stack hierarchy, Properties and project/import workflow; add interaction regression cases for newly found bugs. Do not represent planned controls as operational.

Reference routing: video notes in `video-reference/sections/01-workspace-and-tools.md`, `07-layers-and-effect-stack.md`, `08-masks-generators-and-filters.md`, `10-viewport-layout-and-camera.md` and `13-export-and-game-workflow.md`; complete public-history extraction in `../painter-analysis` relative to the application root. No existing requirement is deleted.
