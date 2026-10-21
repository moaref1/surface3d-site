# Surface3D 0.18 native UI review

Reviewed actual Windows executable captures after implementation and again after the native input checks. No generated UI mockup is used as behavioral evidence. Existing workspace positions, layer ownership and the dark/teal theme are retained.

| Area | Findings and correction | Still needs artist review |
| --- | --- | --- |
| Offset | Percent/Pixels and typed values are visible; small per-axis reset works. The original bottom Paint action was clipped in the short dock: moved it above Units. | Narrow docks, different DPI and source/document resolutions. |
| Paint node | A large UV canvas, ordinary Layers and a compact Paint texture inspector work with the graph hidden. Finish, Size/Flow/Hardness, Clone, source guidance and wrap remain explicit. | Normal/vector brush UX, clone samples on real photographic repairs, repeated-tile display. |
| Clone | Alt-click sets a UV source; a source cross and brush footprint appear. Alt-drag remains navigation. One stroke is one undo. | Source-cross contrast on very bright textures; cloning over complex UV charts. |
| Outputs | Separate Texture Output publisher, actual thumbnail, Publish/Update and Project outputs shelf. Native drag reaches inactive Roughness while preserving its fallback/shared mapping. | Bulk output management, deletion/relink and automatic live-output dependencies. |
| Search/reset | Small X clears typed search; reset icons reserve space beside sliders/axes. Rendering reset widgets now have per-parameter IDs. | Pinned/color/direct numeric widgets need the same complete affordance set. |
| View wheel | Ten stable channel views on hold C; center/Escape cancel. It preserves layer selection and mask/material target. | Smaller-screen radius, user-rebindable shortcuts and longer sessions. |
| Poly Haven | Existing left Assets dock gains a visual browse/category/inspect/import flow; Import to Library and Apply are separate. | Native automation uses labeled offline swatches; live network/backend/artwork loading is checked independently. |
| New Project | A staged scene, mesh/set preview and PBR/color/UV setup. Fixed the initially clipped sample action. Cancel and Create have explicit scope. | Large real assets, relinking and assignment-preserving mesh lifecycle. |
| Fill region | Real membership overlay, no preview highlight while navigating, stable object selection after Alt-drag. | Hard/mirrored/subpixel UVs and stylus sessions. |

Published-output.png shows a small procedural fixture branching into Material Output and Texture Output. Paint-node-edit.png shows its UV repair session without Graph. Clone-seams.png shows actual Clone interaction. These colored marks are test artwork, not a claimed final tileable material.

47 development checks passed. The new native workflow asserts actual typing, clicking, drag/drop, C-wheel, search clearing, stroke undo and project persistence. Poly Haven's official live catalogue/thumbnail/two-map material/reusable import passed separately. GPU cached results match a full replay. The old reset ID/creation-menu/Decal shader omissions were fixed rather than suppressed.

Baking and Rendering retain their established docks and controls. The Desktop cube still reports 120984 fitted hits, zero misses; this does not certify production seam/cage parity. Existing rendering, export, mask/effect/anchor and custom-HLSL checks also pass. More aggressive library/inspector simplification, all missing node families and the full suite roadmap remain open.
