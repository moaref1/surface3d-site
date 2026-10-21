# Surface3D 0.18 artist guide

Standalone Windows authoring; the dark/teal theme and Paint / Bake / Rendering / Graph / Export workspaces are retained. Earlier releases remain separate. The document, layers and graphs remain the source of truth.

## Offset, repair a seam, reuse the result

1. In Graph, connect an Image texture or procedural image to **Offset**. Add nodes with the graph search/menu; Offset is in Filters / Warp.
2. Select Offset. Choose **Percent** or **Pixels**, and type horizontal/vertical values. 50% equals 512 px on a 1024 texture. Positive horizontal/vertical values shift right/down, wrapping the opposite edge. Pixel conversion uses the texture-set resolution, not a differently sized source image. The half-tile action sets both offsets to 50%.
3. Enable the optional seam blend and adjust its horizontal/vertical widths. **Make Tileable** provides the same opposing-edge blend as a separate editable node. It is a soft overlap blend, not content-aware reconstruction; inspect details and normal strength before accepting it.
4. Choose **Paint / clone seams** on Offset. Surface3D inserts and reconnects an ordinary **Paint** node, then opens its UV canvas in Paint. The graph stays hidden. You can also add Paint anywhere in an image/mask chain.
5. Use Paint to author marks, or select **Clone**, Alt-click a source on the UV canvas and paint the repair. The source cross and brush circle indicate the two positions. **1** selects painting and **2** erases back to the incoming image. Size, Flow, Hardness, Color/Value, UV wrapping and node Opacity remain editable. **Alt-drag** navigates rather than painting. Finish painting to return to the ordinary layer controls.
6. The Paint node stores editable stroke history and procedural input. A changed input replays the marks; Clone reads the canvas before each dab. Changing node Opacity blends the painted result with its input without replaying marks. Clearing removes the marks. Undo/redo works at stroke boundaries. Node painting supports a geometry footprint in 3D; clone-source selection is currently a UV-canvas workflow, not geodesic cloning across unrelated UV charts.
7. Branch the result into one or more **Texture Output** nodes while retaining the layer's Material/Mask Output. Rename each output, select it, then choose **Publish texture**. The float texture appears under Assets → Textures → Project outputs.
8. Drag the project texture into another layer's channel, mask or graph, including another texture set. Color outputs retain working-space interpretation; scalar/vector/normal outputs retain data interpretation. An inactive channel is revealed when a compatible texture is dragged over it.
9. Edit the source graph and choose **Update texture** to refresh its existing linked uses. Publication is an explicit snapshot, not an automatic live connection between graphs. Project outputs survive save/load and source-node deletion; duplicate publisher nodes get independent output identities. Consumer references retain stable IDs across updates. Export its node or use the regular texture export workflow for files.

The supplied Ramp/Tileable-surface projects demonstrate controls and reuse. Their deliberate red/clone marks do not demonstrate a completed photographic seam repair.

## Controls and searches

Small reset icons accompany shared property sliders, linked/locked axes, brush controls and Rendering numeric controls. Reset applies the standard default, follows axis links/locks and is undoable for authored values. Tool-only brush settings do not add document history. Some color widgets, pinned controls and less common direct numeric fields still need equivalent reset affordances.

Numeric fields accept typing: double-click or Ctrl-click the value. **Shift-drag** gives finer float adjustment; **Ctrl-drag** snaps float values in 0.5-unit steps, within the parameter's range. Integer fields keep integer semantics. Search fields in Assets, node search and commands have a small **X** to clear typed text.

Hold **C** for the viewport view wheel, point at Material, Base color, Roughness, Metallic, Normal, Height, AO, Emission, Opacity or Mask, then release. The center and Escape cancel. This changes the display view, not the selected layer. Shift+C retains cycling; Ctrl+C retains copy. Normal camera navigation and painting are suspended while the wheel is open.

## Visual materials library and Poly Haven

Use the Poly Haven library category to browse materials, HDRIs and models. Search accepts multiple terms; category and local-cache filters narrow results. Thumbnails load in the background with bounded concurrency/residency. Select an asset to inspect available resolution/formats/maps. Single-click never applies it.

**Import to Library** creates a reusable embedded material and provenance without changing the current document. **Apply** remains a separate action. Download progress/cancel, validation and cache reuse are retained. Downloaded materials and ordinary local materials share the material collection. Drag a material to a layer to replace its material while keeping its mask/stack identity; drag to a compatible mesh/layer target to create a deliberate fill. Unsupported asset/target pairs do not become arbitrary node placeholders. Powered by Poly Haven credit remains visible.

The official live API catalogue/search, actual thumbnail, two-map download, material assembly and reusable import were verified. The native automated browser screenshots use six labeled original color-swatch fixtures to test selection/import behavior offline; they are not Poly Haven's actual material artwork.

## New projects and useful controls

Startup and Ctrl+N open the staged New Project setup. Import supported mesh files together; review objects/material sets, resolution, normal convention, UV diagnostics/flip/quarter-turn controls, supported PBR shader and working color. Preview is separate from the open document. Create commits the staged scene; Cancel preserves the old document. Source placement, object groups and material assignments are preserved within the current limits. Arbitrary mesh add/update/remove with assignment migration is still separate production work.

Pin useful node parameters through its controls icon; Paint/folder Properties shows the original controls. Reusable master graphs share a definition, with per-instance overrides. Editing a Paint node on a bound master first makes that instance local. Folder deletion/material replacement removes obsolete pins. Core ownership/override/persistence checks pass; broader native pin/master sessions remain artist testing.

Fill-region hover uses the same triangle/UV-island/mesh membership as the authored fill. Alt-drag/RMB/MMB/wheel navigation suppresses the overlay. Decals retain real mesh-hit placement and separate material ownership.

## Performance and limits

Ordinary nodes use a warmed general shader rather than compiling a new shader for each kind combination. Genuine Custom HLSL still compiles when its code/interface changes. Spatial-input caches reuse unchanged prerequisites, ignore cosmetic edits and invalidate on authored texture/map/mesh/color changes. New Paint marks append on the GPU; upstream changes or undo replay when required. Cache results were compared with a cold/full rebuild. A cold uncached general shader can take much longer; keep the supplied shader-cache beside the executable.

The current project bounds remain: 8 layers per texture set, 128 nodes per graph, 16 source textures/192 MiB per active set, 16 sets with a bounded inactive payload, 16 published project textures/192 MiB, 16,384 marks per Paint node, 256–2048 authoring resolution, 50,000 imported triangles and one 0..1 UV tile per set. Shared immutable output pixels are reused in memory/history, but budget checks remain conservative. This is not tiled/UDIM production residency.

Cage/seam production acceptance, the complete Designer node catalogue, normal/height/tablet/alpha/stencil/text brush tools, nested folder composites, viewport projector handles, larger assets and advanced hardware rendering remain in Iteration-0.18-plan.md and Rendering-and-artist-roadmap.md. D3D11 compute still-image rays remain separate from DXR/RT cores, DLSS, interactive accumulation, denoising and transmission.

New saves use schema 20; readers retain schemas 1–20. Use Save As when testing older projects. The executable is independent of installed Adobe, Marmoset and Blender software.
