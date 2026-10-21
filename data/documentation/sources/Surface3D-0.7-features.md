# Surface3D 0.7 artist workflow

Native Windows prop texturing with editable texture-field graphs. This release extends the existing C++/Direct3D 11 application; it is an original implementation and does not depend on installed Adobe files. Painter 1.3.5 remains the first historical cumulative functional reference; later anchors, bake controls and the user's Blender/Designer-style graph requirements are additional targets. A release number is not a claim of complete reference parity.

## Added in this iteration

### Graph data and real numerical operations

91 stable node kinds, increased from 37. The eight older axis-specific kinds remain loadable but disappear from creation menus in favor of Coordinates plus Separate. Graphs accept 128 nodes, eight inputs per node and six socket types: value, linear color, vector, boolean, integer and signed normal. The material output has color, roughness, metallic, normal, height, AO, emission and opacity inputs. Normal/height affect the mesh preview and export; AO now feeds actual Unreal ORM output.

- Vector constants, shared Coordinates, component Separate/Combine, XYZ Mapping, Euler Rotate, 19 Vector Math modes, distance and polar/radial mapping.
- Seeded true 3D Perlin/fBm/ridged/billow and 3D nearest-cell Voronoi; 2D Gabor, brick, magic, tiled shapes, signed-distance shapes, 3D gradients and original noise variants.
- HSV, RGB component merge/extract, color blend math, color-space conversion, approximate temperature/wavelength colors, map range, cubic scalar curve, booleans, integer, comparisons and typed Switch.
- Normal decode, normal mix/whiteout, height-biased blend and attached normal/height/AO/emission/opacity snapshots.
- Full-resolution Blur, Transform 2D, Vector Warp, Directional Warp, Height to Normal, Edge Detect, morphology dilation/erosion, Slope Blur and approximate normal-derived curvature. Spatial filters cache up to 16 prerequisite fields; graphs exceeding that budget are rejected before evaluation.
- Triplanar image projection with object-space blending, image color/data mode and an editable coordinate input.

Unlinked coordinate inputs use UV defaults. 3D noise is volumetric only when XYZ coordinates are connected; use Coordinates / Position for a mesh-driven field. Coordinates returns normalized imported object position; it is not physical world units. Legacy input snapshots preserve pre-effect correspondence. Conversions are visible in socket tooltips: color uses linear luminance for scalar data, vector-to-value extracts X, scalar data broadcasts, integer rounds, boolean thresholds, and encoded color-to-normal decodes and normalizes.

### Graph interaction

| Task | Control |
| --- | --- |
| Find/add | Shift+A, Ctrl+F or F3 in graph; right-click menu; grouped search |
| Select | Click; Shift adds; Ctrl toggles; drag an empty canvas for a selection box |
| Move | Drag a selected card; selection moves together |
| Frame | F / frame icon |
| Pan/zoom | MMB or RMB drag / wheel |
| Copy/paste | Ctrl+C/V; internal copied links remap; external links are cleared on paste |
| Duplicate | Ctrl+D or Ctrl+W; preserve internal links |
| Delete | Delete; undo with Ctrl+Z |
| Arrange | Arrange icon changes only selected nodes |
| Cut wires | Hold Ctrl and sweep RMB across wires; release commits one undo step |
| Disconnect | Alt+click socket or right-click input |
| Preview | Select a node, press Space: result on mesh and 2D; Space again restores prior view |
| Rename | F2 or Node label in Properties |
| Collapse | Double-click card header or Collapse preview in Properties |
| Global previews | Eye icon hides previews and shrinks cards |
| Group frames | Ctrl+G; Ctrl+Alt+G removes selected nodes from frames |
| Export selected node | Download icon; raw, linear-to-sRGB or signed vector/normal PNG |

New nodes use graph mouse coordinates and occupied-card avoidance. Socket snapping, cycle checks and type tooltips remain available. Parameters and links update the authoritative project and GPU output immediately. Graph-backed fills/effects are directly editable. Plain mask paint remains a separate source; opening its graph adds an editable mask graph, rather than silently erasing paint.

### Layers and material/mask clarity

Layer actions use original icons with hover labels. Material and Mask have separate vertical lanes and thumbnails; choose an effect inside its lane to edit or paint at that position. Double-click the mask thumbnail or mask row to preview it; repeat to restore the previous viewport/navigation. Each enabled fill channel accepts Value, Texture or Procedural sources and drag/drop textures. Channels use compact C/R/M/N/H/A/E/O controls with full hover names.

Flat folders group contiguous layers. The folder icon groups the active layer in a new folder. Drag a layer onto the folder header, or use Move to folder in its context menu. Folders support visibility, collapse and rename; removing a folder keeps its layers. Moving layers across anchor dependency order is rejected atomically. Folders are not nested execution groups and do not yet own shared masks or opacity.

All eight channels have independent layer opacity. Color/roughness/metallic retain ten channel blend modes; extra channels use normal/data composition with separate coverage. Direct Paint/Levels/Invert/Blur effects show only channels they actually process; graph filters can target the new material channels.

Panels dock within a locked workspace by default. Window > workspace locking enables/limits undocking; drag splitters and panel tabs to adjust a layout. Paint, Graph and Bake keep separate layouts. Compact layouts wrap icon toolbars and put channel blending in a popover instead of consuming the layer list.

### Viewport, lighting and painting

- Perspective/orthographic projection, FOV 20-100 degrees, named front/back/left/right/top/bottom views and matching perspective mesh picking.
- Actual 4x MSAA when supported by the graphics adapter, resolved to the UI viewport texture.
- Radiance RGBE `.hdr` import, linear floating-point environment lighting, exposure, strength, rotation and adjustable key light. Shift+RMB rotates the environment; Ctrl+Shift+RMB rotates the key light.
- Brush size shortcuts `[ ]`, flow, stored per-dab hardness, distance-based spacing, lazy mouse distance and optional stroke finish towards the cursor. Paint/erase/mask shortcuts and 3D navigation remain.
- Mask region fill: triangle, connected coplanar face, UV island or imported separate mesh group. Each click updates a persistent region-mask image/effect, with immutable pixels for undo. It does not consume a new effect on every click.

### Baking and export

The existing separate Bake workspace retains low/high sources, optional external cage, front/rear distances, suffix pairing, low-as-high, per-map controls, preview, cancellation, stale-result detection, padding and publication to Assets. Real CPU BVH projection produces ten map categories: tangent normal, world normal, AO, curvature, position, thickness, mesh-group ID, bent normal, height and opacity mask from ray hits/misses. This iteration corrects the last map's name; it does not introduce source texture-alpha sampling. See [Adobe's opacity-baker reference](https://experienceleague.adobe.com/en/docs/substance-3d/bakers/bakers-settings/opacity-mask-from-mesh).

Exports now include normal, height, AO, emission and opacity alongside color/roughness/metallic. Unreal ORM uses the authored AO channel; normal green is flipped for the Unreal profile. All current exports are RGBA8 PNG. Signed height -1 to +1 maps to 0-1; signed normals map to RGB 0-1. Emission PNG clips to display range; it is not HDR export.

### Storage, limits and compatibility

Schema 7 stores eight graph sockets, extra parameters, labels, per-node collapse/group metadata, brush hardness, region-mask tags, folder ownership/visibility and eight channel opacities. Readers for schemas 1-6 remain. Frozen schema-6 data is migrated and rendered in regression checks. Embedded material assets exclude dangling folder references and remap image IDs.

Current limits: one authored UV0 atlas, 256-2048 resolution, eight layers, eight folders, 128 nodes per graph, 16 cached spatial inputs, 16 embedded RGBA8 images / 32 MiB image bytes, four high scenes, imported low mesh up to 50,000 triangles. Memory reporting is an estimated allocation size. Painting/graphs use the GPU; projection baking uses CPU BVH traversal. Source-checked shader bytecode caching avoids recompiling an unchanged graph shader at each startup.

HDR import supports flat RGBE and modern scanline RLE with `-Y +X` orientation; no EXR, arbitrary HDR orientation or legacy repeated-pixel encoding. Lighting/camera/brush stabilizer options are currently session settings. Environment lighting uses mip sampling as an approximation; it is not a physically prefiltered renderer.

## Still required

The 487-row request inventory is preserved in [Requested-node-catalogue.csv](Requested-node-catalogue.csv). 19 are headings; 51 have bounded working equivalents, 80 are partial, 277 remain planned and 60 depend on a broader backend. Those counts are not independent algorithms, and no exact Blender/Designer preset parity is claimed.

Priority gaps: reusable execution subgraphs and exposed parameters; reroutes and multi-output sockets; atomic rewiring; bundle-valued materials; nested folders/group masks; multi-stop color ramps; additional Designer noise/filter/pattern/generator presets; real distance transforms/Flood Fill; color gamma/curves; camera/ray/tangent inputs; MikkTSpace acceptance; material/vertex ID and source-color/alpha transfer; HDR persistence/EXR; 4K/8K/UDIM/multiple texture sets; tablet pressure/brush alphas/normal-height painting; dependency-based partial recomputation and measured production performance.

This is a broader functional foundation, not a certified AAA authoring system. Production readiness needs artist use on real assets, imported tangent/color matching in Blender/Unreal and measured large-graph behavior.

## Why the interface works this way

The design interpretation is based on visible authoring state, reversible operations, familiar interaction and contextual disclosure. Those are applied here through target lanes, channel/socket colors, result previews, restored views, one-step undo, grouped search and tooltip-equipped icons. The interpretation follows [Jakob Nielsen's usability principles](https://www.nngroup.com/articles/ten-usability-heuristics/) and familiar graph gestures from [Epic's editor shortcut reference](https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprint-editor-cheat-sheet-in-unreal-engine). It is a design rationale, not evidence that artist usability is already proven.
