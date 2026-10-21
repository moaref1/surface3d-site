# Surface3D 0.5 — layers, inputs and nodes

This release fixes the reported navigation, square clipping and duplicate-control bugs, then connects image assets to the existing material/mask graph evaluator. It is an original C++/HLSL/D3D11 application. The historical cumulative Painter 1.3.5 baseline remains a target, not an achieved compatibility claim. The videos and later Painter interface remain behavioral references.

## Start and navigate

Open `releases/Surface3D-0.5/Surface3D.exe`. Keep its `shaders` and `licenses` folders beside it. This package is separate from the earlier open executable and uses its own layout files.

Click **Navigate**, or press **N** with focus outside the graph/text fields. Left-drag orbits, middle-drag pans, right-drag zooms and the wheel zooms. **F** resets framing. In painting mode, Alt+left-drag orbits, middle-drag pans and Alt+right-drag zooms. UV and mesh views have separate pan/zoom transforms. Painting is disabled while Navigate is active.

The viewport now owns drag input explicitly. Rendering uses the entire 3D region, with scissoring at the real 3D/UV boundary, instead of a small square around the mesh. Picking uses the same projection. This is still an orthographic, approximate renderer.

## Material, mask and effect context

- Select the material swatch to edit the layer's material; select its mask thumbnail to edit the mask. Selection outlines and Properties identify the current target.
- The stack exposes separate **MATERIAL** and **MASK** effect sections. Both accept editable Graph effects and the existing Levels, Invert and Blur effects. Their global evaluation order remains the numbered order shown in the stack; grouping does not silently reorder effects.
- Fill channels have **Base color**, **Roughness** and **Metallic** tabs. Each offers **Value**, **Texture**, **Procedural** and a texture drop target.
- Mask inputs and editable graph input sockets use the same source chooser. Color and scalar socket types remain explicit; use RGB to grayscale when a color must drive a mask or scalar channel.
- New procedural fills, procedural library presets and the initial procedural scene open as real editable graphs. Existing saved preset-only projects retain their appearance and can be converted by opening their graph.
- Selecting a node shows its preview, parameters and input-source controls directly in Properties. Context changes reset the panel scroll position.

The Roughness/Metallic checkbox and parameter controls have distinct ImGui IDs. Conflict detection stays enabled.

## Images throughout the workflow

1. Open **Assets → Textures → Import image**, or choose **Texture → Import image** beside an input.
2. Select the material and the desired fill channel. Choose the imported image in the Texture picker, or drag it to **Drop texture here**.
3. Choose **Edit source node** to change image interpretation, channel or UV repeat. Color images decode sRGB by default; scalar images preserve raw data.
4. For an ORM image, use the Image texture (value) node's **Green** channel for roughness and **Blue** for metallic. A grayscale mask can use luminance or an explicit RGBA channel.
5. Drag an image into the graph to create an image node. Material graphs default to Image texture (color), mask graphs to Image texture (value); both kinds are available through search.
6. Save the project or export a `.s3mat` material asset. Pixel data travels with it, and imported asset references are remapped together.

Windows WIC decodes supported PNG/JPEG/TIFF/BMP files into RGBA8, using the first frame. Current bounds: 16 images, at most 2048 pixels per edge and 32 MiB of embedded image data per project. No EXR/HDR/16-bit preservation, UDIM discovery, color-profile management or external texture hot reload is claimed. Geometry import still does not automatically import embedded model textures.

## Graph interaction

| Action | Input |
|---|---|
| Select / move a node | Left click / drag its body |
| Connect sockets | Drag output to input, or click output then input |
| Find nearby compatible socket | 18-pixel magnetic connection snapping |
| Disconnect | Alt+click socket; right-click input also works |
| Rewire an input | Ctrl+click input, then connect to a new input |
| Pan / zoom | Middle or right drag / wheel at pointer |
| Add/search | Right click empty space; Shift+A, F3 or Ctrl+F |
| Delete / duplicate | Delete / Ctrl+D or Ctrl+W |
| Copy / paste | Ctrl+C / Ctrl+V, one node |
| Undo / redo | Ctrl+Z / Ctrl+Y |
| Frame / arrange | F / Arrange button |
| Grid / previews | Snap grid toggle / Previews toggle |
| Refresh previews | Space |
| Quick creation | Hold 1 Value, 3 Color, M Multiply, L Value blend or T Image texture; click empty space |

These follow a useful subset of the [Unreal Material Editor's controls](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-material-editor-ui). Text editing and open popups suppress global commands. Single-node paste clears connections. Rewire disconnect/connect currently creates separate undo steps; cancel does not restore the disconnected connection automatically. No box selection, multi-node copy, reroute/comment nodes, graph groups or shortcut remapping yet.

Each node has an evaluated 64×64 preview, with a larger hover preview and a Properties preview. Previews use the same GPU node evaluation as the layer/effect. Effect previews read the actual attached values before that effect, so Layer color/roughness/metallic/mask inputs reflect their context. Material Output currently previews base color, not a rendered material sphere. The shared preview atlas is cached by document revision and graph target.

## Implemented node kinds: 37

| Family | Available kinds |
|---|---|
| Constants and images | Value, Color, Image texture (color), Image texture (value) |
| Texture generators | Noise, Fractal noise, White noise, Voronoi, Checker, Gradient, Wave |
| Geometry and UV | UV X, UV Y, Position X/Y/Z, Normal X/Y/Z |
| Attached layer inputs | Layer color, Layer roughness, Layer metallic, Layer mask |
| Published layer inputs | Anchor color, Anchor value |
| Operations | Remap, Color blend, Value blend, Invert, Clamp, Math, RGB to grayscale, Color ramp, Gamma, Brightness / contrast |
| Outputs | Material Output, Mask Output |

Math offers Add, Subtract, Multiply, Divide, Minimum, Maximum, Power, Absolute, Sine and Less than. Division by zero returns zero. Noise is original 2D value noise; Fractal noise combines octaves of it. Voronoi is 2D nearest-cell distance. Gradient supports U/V/radial; Wave supports U/V/radial sine. Geometry components use normalized object-space maps. Color ramp is currently black to one editable end color. These bounded implementations are not Blender/Designer algorithm parity. Full vector sockets, coordinate transforms, 3D noises, multi-stop ramps, BSDFs and full node groups need further implementation.

The [complete requested catalogue](Node-catalogue.md) retains the generator attachment and the pasted Blender list. No missing node is exposed as a nonfunctional placeholder.

## Storage, validation and tests

Project schema is **5**, with readers for schemas 1–4. Texture assets hold immutable shared pixels, so undo snapshots do not duplicate image buffers. Validation rejects invalid dimensions, budgets, dangling image references and graph type/cycle errors. Failed material imports roll back the entire document, including IDs. Existing checksum, backup and recovery behavior remains.

Fourteen functional CTest checks pass on the tested NVIDIA GeForce RTX 5050 adapter. Coverage includes:

- Actual app-owned mouse/keyboard events for node selection/movement, parameters, wiring, undo/search, fill roughness texture selection, context switches, export and mesh orbit/pan/right-drag zoom/wheel zoom.
- Duplicate hovered-control IDs; full-width panned mesh rendering and matching picking beyond the former square clip.
- Unicode WIC image import; sRGB color versus raw roughness/metallic/mask values; evaluated GPU preview matching; every implemented non-anchor/output node kind exercised on the GPU, with anchor/output checks in the existing suite.
- Embedded image save/reopen, material asset reference remapping, rollback on image-budget failure, immutable history pixels, malformed input rejection and schema 1–4 fixtures.
- Existing painting, masks, ordered effects, anchor safety, bake geometry, imported mesh fixtures, Unicode export and native workspace captures, including 1000×700 compact layout.

Captures are in `build-native/studio-*-evidence`. These are functional checks, not GPU performance benchmarks, broad hardware certification or a manual Blender/Unreal roundtrip.

## Retained boundaries and next work

One 256–2048 atlas, eight layers, eight effects per layer, 32 nodes per graph and meshes up to 50,000 triangles remain the bounded base. OBJ/FBX/glTF/GLB/Collada/PLY/STL require authored UVs; material slots merge into one atlas. Export remains synchronous 8-bit PNG with Blender channels and Unreal BaseColor/ORM; AO is fixed at 1.

Bake still produces low-mesh Position and object-space Normal maps with padding and previews. High-to-low projection, cages, real AO/curvature/thickness, tangent-space detail, normal/height painting, multiple texture sets and UDIMs remain unimplemented. No `.spp`, `.sbsar` or full Painter/Designer compatibility.

Next interface priorities: exercise drag-and-drop and socket snapping through real input regressions; make long graph/layer stacks easier to navigate; add multi-selection and atomic rewiring; improve image asset management; then extend typed vector/mapping nodes and multi-stop ramps using the retained catalogue. Preserve the [video section notes](video-reference/README.md) and [public Painter release log](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/release-notes/all-changes) as references.
