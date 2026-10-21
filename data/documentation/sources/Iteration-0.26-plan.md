# 0.26 artist workflow and processing work

User-authorized scope: all eleven priorities from the October 11 updated list, plus useful texture stencils integrated into Brush settings with editable Levels. Completion requires behavior and meaningful checks, not just visible controls.

1. Paint-session state: entering Graph stops painting without discarding preview; selection, paint editing and preview remain separate. Preserve view state, refresh downstream outputs, test returning between tabs.
2. Spatial processing: batch spatial operators, remap resident slots, reuse scratch textures and expose budgets; preserve dependency order, typed results and preview/thumbnail behavior above sixteen inputs. Do not merely increase a shader constant.
3. Interaction: separate draft/final caches, dependency-scoped evaluation, coalesced scrubs; preserve authored brush and export resolution; benchmark Plane.
4. Rendering: profile rotation, avoid needless work, cache shadow state correctly and support environment-linked key lights.
5. Visual coordinates: shared coordinate transforms and viewport gizmos for all applicable resources, not gradients alone; undo and graph/property synchronization.
6. Graph: E enable/bypass with correct typed behavior, keyboard selection, predictable search/Enter and immediate parameter snapping.
7. Text/stencils: editable text/vector source and placement; stencil texture picker/import/drop, enable toggle, UV placement/scale/rotation, opacity/inversion/Levels, pixel-level masking in ordinary and node brushes, save/load/undo consistency. Screen-space projection must be labeled separately if added.
8. Export: visible per-output toggles and explicit resolution evaluation; keep map formats, precision, color conversions and packing; no silent upscale claim.
9. Windows: owned secondary panels without extra taskbar entries, main Status pinned to main viewport; verify docking.
10. Presets: independent navigation and shading/color choices with stated limitations; verify existing automatic DXR selection/fallback rather than duplicate it.
11. Validation: stencil pixels and persistence, Paint state, >16-field dependency chains, Plane timing, final output comparison, native docking and selected output export.

Current audit: automatic DXR preference/fallback and Ctrl-drag snapping already exist. Rendering viewport is raster (compute path tracing is image output), so accumulation-reset speculation is not evidence of the viewport lag. Inspect the actual raster/shadow path.

Verified checkpoint — October 11, Surface3D-0.26.3-workflow:

- Build succeeded. Six regression checks passed: stencil pixels/persistence (including an equivalent 24-stage spatial chain), material node contracts, Designer operator scheduling, Paint/Graph transitions, floating-panel docking, and docked Layers detaching/redocking. Context screenshot inspected.
- Brush and Paint-node stencils use per-pixel UV-space texture masking with placement, scale, rotation, opacity, inversion and Levels/gamma. Settings persist with strokes.
- Larger reducible spatial/image DAGs use bounded GPU passes and float intermediates. This is not unlimited independent graph width, and persistent intermediate caching still needs work.
- E bypass, spatial keyboard selection and ranked name search are implemented. Export outputs have individual toggles and explicit resolution re-evaluation. Linked HDRI/light rotation and removal of a per-frame mesh radius scan are implemented.
- Still pending: visual coordinate gizmos (ImGuizmo source downloaded but not integrated), editable text/vector sources, draft/final cache separation, new Plane/Rendering benchmarks, independent navigation/color presets and stencil viewport overlays. Do not mark all eleven priorities complete.

Executable: build-023/Surface3D-0.26.3-workflow.exe. Keep its accompanying runtime/shaders directory when moving the app.

Follow-up 0.26.4: camera-facing stencil overlay, independent display opacity, right-side dockable Brush tab, S-drag placement controls and persisted per-dab camera projection implemented. Projected ordinary/Paint-node pixel comparisons and persistence passed, together with native context and docking checks. See Stencil-overlay-0.26.4.md. Visual coordinate gizmos, text/vector sources, draft/final cache separation and the other unfinished priorities remain pending.

Work in progress. No claim of completion or universal hardware performance until verified.
