# Surface3D 0.4 — usable-base interface pass

Run `build-native/Surface3D-Next.exe`. This separate executable keeps the earlier Surface3D build available. Keep `shaders` and `licenses` beside the executable.

This milestone follows the user's revised priority: fix the interface and existing workflows before expanding node libraries, texture channels or ray bakers. It remains an original Windows C++/HLSL/D3D11 application. Rust is optional. Project schema remains 4 and prior features remain available.

## What changed

- Graph node bodies now select and drag. Socket connections support both click-to-connect and drag-to-connect. Right-click an input disconnects it. Delete removes a non-output node, Ctrl+D duplicates, Shift+A/F3/Ctrl+F opens search, and Escape closes search. Graph wheel zoom keeps the point under the pointer stable. F frames the graph when that editor has focus.
- The old preset diagram is no longer presented as a connectable graph. Convert a preset, or use the graph tool, to obtain real editable nodes. The graph tool respects the selected material, mask or graph effect. Graph library templates open as editable graphs.
- Material and mask selection clear stale effect/node selection. Material swatches and mask thumbnails have separate selection outlines; masks have explicit rows and Properties headings. Thumbnails display the evaluated effective mask, including effects, inversion and bypass. Thumbnail readback waits until a paint gesture finishes; the full viewport mask view remains live.
- The full viewport can show the selected layer's effective mask on the mesh, UV view or both. Disabled masks appear white because their effective coverage reveals the entire layer.
- Middle-drag pans the hovered 3D or 2D view. Alt+left orbits 3D; Alt+right dollies; wheel zooms the hovered view. 2D and 3D cameras have separate pan/zoom. F resets view framing. Picking follows the same transforms as rendering, including resize and mesh clipping.
- Global shortcuts work from nested panels. Text entry and open popups suppress global actions. F3 searches nodes in the graph editor and selects the 2D view elsewhere.
- Texture Set Settings now has its own tab beside Layers. The Texture Sets panel is a compact list. Properties hide irrelevant material brush controls when editing a mask or fill. Narrow panels wrap controls and put long parameter labels above their values.
- F8 opens a separate Bake workspace with available-map selection, preview, settings and 3D viewport. Painting is disabled in Bake while navigation remains available. F9 returns to Paint. Paint, Graph and Bake layouts remain separate; Bake settings and map data retain their existing bounded implementation.
- Export has a resizable dialog and a filename/channel/color-space table. It supports Unicode asset names and folders, rejects invalid Windows filename components, and displays export failures inside the dialog. The actual outputs remain PNG 8-bit at project resolution, with the existing Blender and Unreal profiles.
- Mesh import uses pinned Assimp 5.4.3 for FBX, glTF/GLB, Collada, PLY and STL, alongside the existing OBJ loader. Import requires authored UV0 in 0–1. Material slots merge into the current atlas; embedded materials, textures, original units and tangents are not retained. Missing-UV errors describe the actual import requirement. The explicit API-only per-triangle UV fallback is a diagnostic aid, not automatic unwrap exposed by the UI.
- New/open project clears transient mask/effect/node selection, navigation and paint gestures. Obsolete bake results are discarded. Per-capture error files make failed diagnostics inspectable without opening a blocking message box.

## Reference use

Video 2 (`2026-10-07 15-12-00.mp4`) supplies the observed texture-set/stack/properties structure around 01:50–02:06, mask/effect nesting around 04:24–04:56 and workspace commands around 05:36–05:58. Video 1 supplies additional viewport/asset context. The existing sampled frames and section notes remain the evidence; hidden controls and audio were not newly audited.

The public [Painter release log](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/release-notes/all-changes) guides bug classes: input focus, context switching, undo, filename handling and bake visualization. The 12.1.4 non-ASCII import/export fix informed Unicode regression coverage; modern bake UI separation informed the workspace structure. These are behavioral references, not claims of Adobe code recovery or full release parity. Painter 1.3.5 remains the original cumulative baseline target; current UI references include later releases.

## Verification

Thirteen CTest checks pass on the tested NVIDIA GeForce RTX 5050. This is functional evidence, not a performance or hardware-compatibility benchmark.

`studio_graph_mouse_keyboard` injects ImGui input into the actual native app. It checks body selection/dragging, duplicate/delete/undo, search, socket reconnection/disconnection, material/mask thumbnail switching, export through the real dialog using Unicode names, F8/F9 workspace switching, and typing a node parameter with matching document/GPU changes and undo. These tests do not automate the operating system or an external application.

`viewport_import_and_names` samples captured GPU pixels to verify effective mask grayscale, inversion/bypass and 2D/3D painting coordinates after pan/zoom. It checks resize and clipped geometry, original UV glTF/Collada fixtures, Unicode OBJ paths, missing-UV rejection, socket/body hit areas and Windows filename validation. FBX, GLB and PLY importers are compiled but do not yet have dedicated reference-asset fixtures.

Existing tests retain project recovery/migration, mask/effect/anchor semantics, mesh raster baking, GPU painting and exports. Native captures cover Paint, Graph, mask/effects, Bake, Export, full mask view and the 1000×700 outer-window layout. These are actual screenshots; files under `docs/design` remain concepts.

## Remaining boundaries

One atlas, 256–2048 resolution, eight layers, eight effects per layer, 32 nodes per graph, 50,000 triangles and 100,000 dabs. Baking still computes only low-mesh Position and normalized object-frame World Normal on CPU. No high-to-low projection, cage, tangent-normal detail, AO/curvature/thickness, new painting channels, groups, UDIMs or broad Blender/Designer node coverage was added. Unreal ORM still uses AO=1. Export remains synchronous; lighting is approximate; full dependent-layer replay and O(triangle-count) picking remain optimization work.

The UI-base backlog is in `UI-base-milestone.md`. Existing visible-feature and release ledgers remain intact and are not automatically marked accepted by this release.
