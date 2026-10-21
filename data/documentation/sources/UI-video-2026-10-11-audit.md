# October 11 recording: compact UI refinement

Reference: `C:/Users/pouya/Videos/2026-10-11 11-27-23.mp4`, 50.2 seconds. Visual review at five-second intervals with full-size frames for menus and layer/settings rows; audio was not transcribed. The recording shows Painter reference behavior, not a Surface3D test.

| Time | Observation | Surface3D change |
|---|---|---|
| 0–5 s | File menu and Recent projects | Persistent twelve-project history, full-path hover, unavailable-file indication, clear-history action; Save As shortcut, Save a Copy, Reload saved project, grouped quick exports and Preferences |
| 10–15 s | Settings, shortcuts and library locations | Keep existing Preferences; no claim of complete Painter shortcut/settings coverage |
| 20 s | Window menu, save/load/reset layout | Functional Save layout and Load layout alongside existing reset and panel visibility actions |
| 25–35 s | Compact layer rows and texture-set settings | Smaller window/frame/cell padding and spacing, narrow dock separators, borderless child panels; retain the existing arrangement and channel behavior |
| 40 s | Floating properties panel | Explicit six-dot tab grab works even with workspace lock enabled; lock restored after release; native detach/redock regression checks |
| 45 s | Browser article | No application change inferred from the browser frame |

The tool rail is reduced from 52 to 46 pixels. Panels retain thin outer borders for orientation. Existing icons, colors, layers, material/mask controls and workspace locations are preserved. Drag the six-dot handle at the left of a panel tab to detach; drop on a docking target or move the floating window to another monitor. Workspace locking still protects ordinary tab dragging.

Recent history stores paths beside the executable. Clearing history does not delete projects. Save a Copy retains the active project identity. Layout files describe docking/window placement; they do not include project content.

Remaining: per-monitor user testing, fully configurable shortcuts, library-location management, and further row-level spacing refinements. This pass does not reproduce every menu in the reference video.

Final build verification: seven selected checks passed (48.74 seconds), covering layer UI, GPU sharing/preview policy/recent history, context menus, 4K import/bake/export, locked Scene and Layers native detach/redock, and configurable budgets. Captured and inspected `build-023/ui25-evidence/Compact-layout.png` and `File-menu.png`. No duplicate-ID error appeared in the captures. The existing screenshot fixture intentionally uses 512px; new user projects default to 1024px.
