# Surface3D 0.10: artist workflow guide

This version extends 0.9. Earlier releases and the original Desktop FBX files are preserved. The original C++/Direct3D 11 architecture, Dear ImGui docking, Lucide icons and GPU painting/graphs remain in use.

## Properties

Select a material thumbnail, mask thumbnail, effect row or graph node. The breadcrumb identifies its layer and material/mask context. Properties shows that selection's controls, resets scrolling when the selection changes, and provides a return to layer/effect settings.

A fill has named Color, Roughness, Metallic, Normal, Height, AO, Emission and Opacity tabs. Enable the channel separately from selecting the tab. Source controls choose a value, texture or procedural node. Texture name and preview remain visible. Roughness, metallic, opacity and mask values are 0–1; height values can be signed. Coordinates is expandable and independent of the material channel. Basic mask-graph inputs can be edited without selecting a node. Mask preview, effect opacity/name and combination help are expandable below the input.

No mask/template is added to an ordinary new fill. Shared graph definitions remain optional and local graphs remain directly editable.

## Texture routing and coordinates

Drag a texture thumbnail in Assets > Textures onto an empty graph area to create an image node. Drop onto an image node to replace its image, or onto an input/output socket to connect a texture of the appropriate color/value type. Drop onto a layer's material thumbnail/name to drive color. A paint layer receives a material Fill effect. Drop onto a mask thumbnail to add a connected grayscale graph effect; this switches to mask context and frames the new graph. Channel source controls and the texture preview also accept image drops. Changes participate in document undo.

Every image node exposes a left Coordinates vector socket. Fill coordinates emits the selected layer/effect's UV transform as a vector; share that output among images/noises, or connect a Mapping node. Raw Coordinates provides UV/object position/object normal choices. A connected vector replaces the image's default fill UV input. Node-local tiling, offset and rotation apply after that vector. Wrap (inherit/repeat/clamp/mirror) and Filtering (inherit/bilinear/nearest) are per-image settings. Local transform is expandable; linked U/V tiling is optional. Normal/vector data textures default to linear data when attached to typed inputs.

Shift+A, F3 or Ctrl+F opens categorized node search in the graph. Creation records the canvas mouse position before the popup appears, rounds to the 16-unit grid when enabled and finds the nearest space using the actual card dimensions. Group moves snap as one translation, preserving relative offsets. A compatible input attracts a pending wire within 22 screen pixels; the highlighted socket and endpoint show the target. Cycles are rejected. Space previews/restores the selected node on the viewport and 2D view. F frames, Delete removes, F2 renames, Ctrl+D duplicates, Ctrl+RMB cuts wires. The displayed grid follows zoom and the same 16-unit snapping.

## Custom HLSL

In Node Graph, press Shift+A and search **custom**, **HLSL**, **shader** or **code**. It is also in Utilities / Custom and available through the toolbar's code icon and Procedural input menus. Select it, open Edit shader in Properties, edit Code/Interface, then compile. It has up to eight typed inputs and one result; this is not an unrestricted Unreal material backend.

Custom graph kernels compile only the node kinds used by that graph. Cache identity includes active shader source, functions, compiler options and the sorted kind set. The general shader still contains the complete runtime node library. Packaged shader caches avoid cold startup compilation on the tested backend. Cold general compilation remains appreciably slower than warm cache startup.

## Automatic mesh maps and cage

A completed bake stores maps in Assets > Textures and binds their semantic slots in Texture Set Settings. No extra material/template is inserted. Tangent normal becomes the base normal, combines with layer normals, and retains its bake-time OpenGL/DirectX convention. AO becomes base AO and multiplies layer AO. Normal-format override and each map binding remain editable.

The **Mesh map** node selects tangent/world normal, AO, curvature, position, thickness, material ID, bent normal, height or opacity. It follows rebakes through stable image identities. Position is a normalized vector, normals are signed Normal sockets, height decodes to signed values and ID is color. Missing/invalid samples use neutral values or low-mesh geometry where appropriate.

F8 > Projection: **Smooth cage across seams** uses angle-weighted geometric directions welded by position and mesh group, instead of split shading normals. Both projection and cage overlay use the same directions. Imported shading and Mikk tangent frames are preserved. **Fit distances** probes high-to-low projection, measures signed displacement, adds a margin and verifies the fitted range. It does not alter either mesh. Use it for generated cages; explicit imported cages retain their own positions. A residual-miss warning requires inspection of alignment/name matching/directions. Positive distance and ray-limit values still matter.

The user's 12-triangle Untitled.fbx and 3,200-triangle Untitled2.fbx are reproduced in the cube review evidence and Fitted-cube example. The fitted 256px/4-sample check retains one missed sample; it is not certified as a perfect production bake. Saved maps are RGBA8, including height. Padding may hide coverage gaps in a displayed image, so the undilated diagnostic remains available.

## Rain streaks and Growing dirt

Choose Assets > Brush > Rain streaks / Growing dirt, or open Brush settings using the sliders icon in the top painting toolbar. These are deterministic, GPU surface-aware weathering brushes within the round UV footprint. They do not simulate falling particles, fluid flow or transport between UV islands.

For reusable dirt/stain material, add a Fill layer, choose its color/roughness, add a black mask, select the mask and paint value 1. X swaps mask values; size/flow/hardness/spacing/lazy mouse remain available. A white mask with value 0 can remove weathering instead.

Rain exposes density, streak length/width, breakup and trail coverage. Dirt exposes coverage, growth height, breakup and growth; choose Ground or Brush stroke origin. Ground height is normalized between mesh bounds along the up direction. Brush origin is captured at stroke start. Length/growth height are relative to normalized object coordinates. Gravity XYZ defines down; up is its opposite. Surface response exposes cavity buildup and upward-facing bias. Baked AO and world normal are used automatically; missing AO is neutral and missing world normals fall back to the low mesh. Seed and New pattern change the repeatable distribution. Paint can affect color/roughness/metallic or masks; weathering does not currently paint normal/height channels.

Parameters and stroke origin are saved per stamp and replayed deterministically. Schema 11 reads projects 1–10 and migrates recognized named baked assets into semantic slots. Earlier applications do not read schema 11; retain old project copies for them.

## Node additions and scope

Fifteen stable kinds are appended: Fill coordinates, Mesh map, Histogram scan/range/select, Levels, Blend, Directional blur, Non-uniform blur, High pass, cached Vector warp, Normal invert/normalize, 3D Simplex and 3D Voronoi fractal. Legacy pointwise Warp remains readable but is omitted from creation menus to avoid duplicate Vector warp entries. Directional/radial filters use 17 bounded samples with a maximum 64px radius; they are original counterparts, not Designer quality parity. Blend retains connected type and supplies ten modes and a mask/opacity input.

[Node-catalogue.md](Node-catalogue.md) and its CSV retain all 487 requested reference rows. Numerous generators, tile samplers, blur quality tiers and backend-dependent nodes remain partial/planned. Renderer closures, volumes, full ray context, arbitrary multiple outputs and nested executable subgraphs are not implemented.

Retained bounds: one UV atlas, authoring 256–2048, eight layers/flat folders, 128 nodes per graph, 16 RGBA8 source images / 192 MiB, sixteen cached spatial inputs, synchronous PNG8 export. GPU acceleration covers painting/graphs/viewing and secondary bake maps; primary UV/cage projection, Mikk conversion and padding remain CPU. The 0.9 compact storage/caches/dirty brush composition and separate GPU usage/texture payload/RAM counters remain. Full GPU projection, painted cage/skew, UDIM/high-precision export, channel-lazy residency, cross-GPU/DPI certification and full Painter/Designer/Blender parity remain pending.
