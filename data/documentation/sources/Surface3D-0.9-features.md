# Surface3D 0.9: bake and resources

This iteration retains the existing painting, layers, masks, graphs, custom HLSL, reusable assets and export templates. Painter 1.3.5 remains the historical cumulative feature reference, extended by later requested workflows. This is a tested step toward that application, not complete product parity.

## Plain layers and optional presets

New fill/paint layers have **no mask**. Add a white/black mask from Properties or the layer mask menu; only then does a mask thumbnail appear. Removing it removes the mask state and owned mask effects; undo restores them. Schema 10 preserves this distinction and retains old project readers. Older projects retain their existing masks.

Ordinary fills use values/textures without a library template. Opening their graph creates constant inputs and a Material output. New mask graphs pass through the attached mask input; named noise/baked generators are explicit choices. Saved graph/material presets remain optional library assets.

Startup and Ctrl+N use plain starter layers on a sample prop. Demo prop and saved presets are explicit optional choices. Assets opens on Textures rather than a preset shelf.

The viewport sits above the graph; Layers and selected-node Properties remain on the right. Neutral surfaces and focused parameter grouping take inspiration from [EmberGen’s documented interface](https://docs.jangafx.com/embergen/pages/references/ui_reference.html). Fill inputs use one channel tab row; the selected channel has a named output-enable checkbox.

## Artist workflow

1. Open the included prop or import a UV-mapped low mesh. F8 opens Bake; F9 returns to Paint.
2. In **Meshes**, choose Low to low for maps from the current surface, or High to low and add aligned high sources. Name matching and suffixes isolate corresponding parts.
3. In **Projection**, import a corresponding cage or set front/rear distances. Relative distances use the low bounding-box diagonal; absolute distances use original import units. Low to low disables high-surface cage controls. Show low/high/cage overlays as needed; expand Overlay appearance for styling.
4. Choose maps at the left. **Maps** contains resolution, padding, edge samples and the selected map's parameters. Selected maps can preview in 2D and on the mesh.
5. **Check projection** makes an isolated 64px hit/miss probe without replacing finished maps. **Bake final** generates all selected maps; **Bake changed** regenerates only affected selected maps when ready inputs match.
6. Finished full bakes enter Assets > Textures automatically. Feed image/baked-map nodes into material or mask graphs. **Export ready maps** writes bake PNGs; the main Export workspace retains Settings / Output templates / List of exports for packed game textures.
7. **Results** shows preparation, trace and padding time, actual worker count, cache storage, logs and preflight warnings.

## Map categories and current meaning

| Map | Artist use | Current implementation |
| --- | --- | --- |
| Tangent-space normal | Surface detail and engine normal input | MikkTSpace corner frames, OpenGL/DirectX Y convention |
| World-space normal | Directional masks and generators | Projected high surface normal |
| Ambient occlusion | Cavity/dirt masks; packed AO | Secondary rays, distance/spread/distribution/backface/self/ground controls |
| Curvature | Edge wear and cavity selection | Bounded four-neighbor geometric approximation with radius/intensity |
| Position | Directional gradients and height zoning | Projected positions with optional low-bounds normalization |
| Thickness | Thin-region masks/transmission input | Secondary rays, range/spread and optional min/max normalization |
| Mesh-group ID | Discrete part selection | Imported mesh-group colors; no source material/vertex-color ID transfer |
| Bent normal | Occlusion-aware direction | Unoccluded secondary-ray direction average |
| Signed height | Depth/displacement-related masks | Projection displacement encoded around 0.5 with explicit range |
| Opacity / ray coverage | Miss diagnostics and coverage masks | Projection hit fraction; no transfer of source material alpha |

Maps remain RGBA8 buffers/PNG files. High/cage coordinates use the low import transform. Imported cages require matching expanded triangle/vertex order. A quick probe cannot certify final-resolution subpixel quality. Cage overlays are inspection aids, not a depth-tested sculpt/paint editor.

## Bake engine improvements

- One cached immutable preparation retains ray acceleration, group metadata and Mikk frames across output/ray edits. UV bins and bounds are recreated for each bake.
- Rows run in parallel with deterministic per-pixel sample order. Automatic workers leave two cores where possible and cap at 16. Cancellation joins active workers; old/obsolete results never replace current maps.
- Padding expands a boundary frontier without copying every full map on every pass. Discrete IDs and undilated hit coverage retain their semantics.
- Map-specific edits reuse unaffected selected outputs. Geometry/cage/resolution/padding changes force all selected maps. Cached preparations and ready outputs are session state; published map pixels persist in projects.

## GPU bake acceleration

Enable GPU acceleration in Maps (default when hardware initialization succeeds). A dedicated Direct3D 11 compute device on the viewport adapter uploads a cached BVH and processes AO, bent normals, thickness and curvature rays. UV/cage projection, primary hit coverage, Mikk normal conversion, AA reduction, thickness normalization and padding retain the checked CPU path. This is compute acceleration, not DXR hardware traversal.

Packets hold at most 8,192 successful samples; input/output/staging storage is reused rather than allocating full-atlas AA sample arrays. Bake threads serialize their own context and never use the authoring immediate context. Cancellation checks during nonblocking readback polling prevent obsolete results from publishing. Errors retry on the CPU and retain a diagnostic in Results. GPU buffer storage is shown separately in the memory popup.

Results reports the backend actually used, batches and GPU buffer payload. Maps containing only primary normal/position/ID/height/coverage work use CPU projection. GPU/CPU comparison fixtures allow two PNG quantization levels; the tested prop differed by at most one. This is not broad production/hardware certification.

## GPU and memory improvements

**Compact textures** defaults on when the driver supports RGBA16F typed UAV load/store. Color, roughness/metallic, utility and coverage storage becomes smaller. Height/normal detail, emission, geometry/spatial fields and raw graph previews remain 32-bit. Computation remains 32-bit; stored eligible values have half-float rounding. Disable compact mode for a precision-sensitive comparison. This rebuilds from the document rather than degrading saved source data.

Simple brush changes compose only the union of touched clamped/wrapped rectangles; unrelated texels retain the previous result. Layers with dependent effects/graphs still rebuild fully. GPU mask thumbnails replace full-mask CPU readback. Matching readback staging is reused, and unused spatial fields can be released. Export readback remains synchronous.

Click **GPU usage / budget** in the bottom bar:

- GPU usage/budget: Windows-reported local GPU memory for this process and its current budget.
- Texture storage: counted texture payload using actual dimensions/formats/mip levels/MSAA, including staging; excludes driver overhead, swap chain, buffers and UI-owned thumbnails.
- RAM working set: resident process RAM reported by Windows, not the GPU texture estimate.
- Bake cache: storage owned by cached geometry vectors, excluding shared document/source data.
- Compact textures and Release temporary caches: reversible session controls. Cache release is disabled during a bake.

GPU budgeting is now visible; automatic resource residency/eviction is not implemented. Compact allocations and smaller logical brush dispatches are measured in [Verification-0.9.md](Verification-0.9.md); they do not establish production FPS.

## UI libraries and retained interaction

Dear ImGui supplies native docking/tabs/controls; licensed Lucide outlines supply familiar icon actions and hover labels. Bake removes the irrelevant brush toolbar/paint rail, keeps a large center viewport, groups settings by artist intent and keeps primary actions visible. Existing Paint/Graph/Export workspaces remain native; the new bake compute backend has its own graphics device/context on the same adapter.

Existing shortcuts remain: Alt+LMB orbit, MMB pan, Alt+RMB/wheel zoom, Shift+RMB HDRI rotation, Ctrl+Shift+RMB key rotation. Shift+A searches nodes; F frames; Space previews; Delete removes; F2 renames; Ctrl+RMB cuts connections. Hover icons for labels and shortcuts.

## Remaining engine work

GPU primary projection / DXR backend; painted per-group cage offsets/skew; higher-fidelity curvature and reference-asset quality tests; 16-bit/float bake/export; channel-aware lazy layer allocation; full tiled/UDIM residency; cancellable background export; broad hardware/DPI/accessibility testing. Existing one-atlas, eight-layer, 128-node, 16-image/192 MiB bounds remain. Full requested node/Painter parity remains unfinished.
