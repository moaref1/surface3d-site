# Surface3D 0.6 — layers and projection baking

The videos were reviewed in two passes: the original overview/detail notes, then 19 newly extracted full-resolution detail frames. This release implements the focused layer/bake foundation in original C++/HLSL. Cumulative Painter 1.3.5 remains a reference target; it is not an achieved parity claim. The recorded modern interface also supplies requested behavior.

## Layer and mask workflow

Select the material swatch or mask thumbnail to choose the authoring target. MATERIAL and MASK sections each own editable effects. The numbered effect order is the evaluation order; grouping does not secretly change it. Root painting happens before effects. Select a Paint effect when a stroke must happen at a movable position inside the stack.

- Paint effects store full brush dabs. Opacity is applied once to the accumulated effect, rather than repeatedly per dab. Erasing its coverage restores its input. Paint effects can sit on a fill layer.
- Fill effects accept scalar/color/image/procedural inputs. They create coverage on empty paint layers. Material fills have Base color/Roughness/Metallic tabs; mask fills have grayscale inputs.
- Effects support enable, opacity, duplication, deletion and earlier/later movement. Drag an effect within the same layer and target to change its order.
- Layer channel selection changes the blend and opacity being edited. Base color, roughness and metallic have independent opacity/blend; shared layer opacity is also available. Ten modes: Normal, Multiply, Add, Screen, Subtract, Darken, Lighten, Difference, Overlay and Divide. RGB arithmetic is linear.
- Roughness, metallic and mask values are clamped to **0–1** at material/mask outputs and direct channel editors. General math constants can remain signed or exceed one before the final output.
- Levels has input black/white, gamma, output gain, output black/white and affected channel selection. Its histogram shows the current evaluated result, not a pre-effect histogram. Base-color Levels applies RGB together; per-component RGB Levels remains pending.
- Invert, Blur, Levels and Graph are actual filters. The effect context menu resets direct filter parameters. Installed Adobe filter resources are not loaded.
- Mask actions include white/black backgrounds, inversion, enable/disable, clear paint, removal and export of the evaluated effective mask as a raw grayscale PNG.
- With Layers focused, Ctrl+D duplicates the selected layer/effect, Delete removes it, Ctrl+C/V copies/pastes it. Portable layer copying rejects external anchor dependencies explicitly. The graph retains its own node shortcuts.
- Stable IDs, original graphs, strokes, image references and channel settings survive project reopen, undo and asset import. Used anchors cannot be silently invalidated.
- Narrow panels collapse layer creation into an Add menu. Active-channel controls remain available at the bottom; shared opacity is also on source Properties.

## Fill mapping

Material fills, mask fills and graph effects have UV projection controls:

| Setting | Current range / behavior |
|---|---|
| Tiling U/V | 0.01–128; optional linked axes |
| Rotation | -180–180 degrees, about the UV center |
| Offset U/V | -16–16 UV units |
| Wrap | Repeat, Clamp or Mirror |
| Filtering | Bilinear or Nearest |
| Reset | Restores identity mapping and default sampling |

Mapping transforms image/pattern/UV-coordinate evaluation. Attached layer snapshots and geometry position/normal inputs retain their original correspondence. Mapping is saved on each layer/effect; node-specific image repeat remains available. Projection is UV only. Triplanar, decal projection and physical-size mapping remain pending.

## Editable procedural generators

Bake maps first, then publish them with **Add checked maps to library**. They appear as stable image assets named Baked/AO, Baked/Curvature, Baked/Position, etc. Every published image can drive a fill channel, mask input or graph node.

The effect menu includes original baked cavity dirt, edge wear and thickness variation graphs. Their image, noise, math and remap nodes remain selectable, reconnectable and editable. The material variants vary roughness while reading the current color/metallic snapshot.

The **Baked mask builder** requires AO, Curvature, Position and WorldNormal. It combines editable cavity, convexity, vertical, facing, grunge, stripe scratch and Voronoi scatter drivers. Named controls expose seed, low/high levels, inversion, contrast, brightness and seven driver weights. Every source, threshold, pattern and weight remains an ordinary editable node. Node labels can be renamed and saved. Material use defaults to roughness only; channel switches are explicit.

This is an original 30-node UV graph, not Adobe's Mask Builder algorithm. Scratch stripes and cellular scatter are simple procedural patterns; triplanar blending, authored scratch/scatter image sets and proprietary micro-detail behavior are not claimed. The existing node catalogue still contains 37 implemented kinds, with 32 nodes per graph.

## Baking

Open Bake with the workspace button or F8. Choose maps on the left, settings in the middle and inspect the low mesh/cage on the right. Common, Map settings and View/Log tabs keep their settings separate. Bake, Cancel, Export and Publish stay in a fixed footer.

1. Import a low mesh with UV0 in 0–1. Retain its original coordinates.
2. Either enable **Use low mesh as high mesh**, or add high scenes. High meshes do not need UVs.
3. Set front/rear ray bounds and optional mesh-name matching.
4. For an external cage, import the same triangulated topology and expanded vertex order as the low mesh; enable cage projection.
5. Check required maps, choose resolution/padding and configure their settings.
6. Bake. Progress reports stages and rows; Cancel stops the ray work. Changed settings/sources make old results stale and prevent stale exports.
7. Inspect each computed map, publish it for generators, or export the checked maps with a manifest.

OBJ, FBX, glTF/GLB, Collada, PLY and STL are accepted through the isolated import adapter. High/cage scenes use the low import's original-coordinate transform. Older projects without that metadata must reimport the low mesh before adding matching high/cage files. Cage vertex count is checked, but corresponding vertex order must be supplied by the artist; cage editing and robust topology correspondence discovery remain pending.

### Computed map definitions

| Map | Computation / procedural use |
|---|---|
| Tangent Normal | Projected surface normal in per-triangle UV tangent frame; OpenGL/DirectX green convention. Supports mirrored UV handedness. Not certified MikkTSpace. |
| World Normal | Projected normal in the fixed object frame; facing/directional masks. Object frame equals the app's world frame. |
| Mesh-group ID | Deterministic discrete group colors; nearest sampling recommended. No averaging IDs between AA samples. Material/vertex-color ID modes remain pending. |
| AO | Actual visibility hemisphere rays; invert for cavities. |
| Curvature | Original four-neighbor projected geometric displacement estimate; 0.5 flat, above convex, below concave. Edge/cavity masks. |
| Position | Projected coordinates, fixed normalized range or low-mesh bounds; vertical and spatial masks. |
| Thickness | Inward hemisphere travel through closed surfaces; optional min/max normalization. Thin-area masks. |
| Bent Normal | Average visible hemisphere direction; orientation/visibility masks. |
| Height | Signed high-to-low displacement mapped to 0.5 ± distance/(2 × range). Retain the range and units. |
| Hit coverage | Projected hit/miss coverage. **Not source-material opacity transfer.** |

AO/bent normal expose secondary rays, minimum/maximum distance, spread, cosine/uniform distribution, backface rejection, same-group self-occlusion, linear/no attenuation and an optional ground plane with offset. Thickness has its own rays/spread/maximum distance and normalization. Curvature has radius/intensity, Position has bounds selection, Height has range. Per-map defaults can be restored.

Front/rear bounds, secondary distances, curvature radius and height range can use low bounding-box diagonal or original source units. Averaged vertex normals versus face normals select projection direction. Name matching strips configured _low/_high suffixes; _ignorebf can exempt a source group from projection backface rejection. Missing pairs and hit/miss counts appear in logs.

Anti-aliasing is None or deterministic 2×2. Padding is 0–32 pixels. Diffusion affects padding pixels; it does not blur covered pixels or interpolate ID colors. Some high-detail AA edges still need production reference-asset acceptance.

View/Log controls show/hide the low mesh and draw actual high wires or imported/distance cage overlays. Cage color and opacity are adjustable. Overlays are transparent inspection guides without depth occlusion; very large high sources use a sampled wire preview.

### Current budgets and computation

Painting, layer composition, graph evaluation and node previews run on Direct3D 11 compute. **Projection baking currently runs on a background CPU BVH**, not GPU ray tracing. No unsupported GPU-bake performance claim is made.

Bake resolution: square 16–2048 powers of two. Low mesh: up to 50,000 triangles. Each high/cage source: up to 200,000 triangles; at most four high scenes and 400,000 combined high triangles. Source file limit: 128 MiB. Maps are RGBA8 PNG, not 16-bit/float export. Published images retain the existing 16-image/32-MiB project budget; publishing too many large maps is refused atomically. Undo snapshots share immutable high-source and image data.

## Storage and verification

Schema 6 stores original mesh alignment/group metadata, high/cage snapshots, bake settings, channel blending, mappings, graph labels, Levels endpoints and effect strokes. Readers for schemas 1–5 remain. Previous releases are left separate. Backups/recovery and image reference remapping remain.

The suite includes analytic projection fixtures for bounded rays, names, cages, mirrored UVs, normals, unoccluded AO, real occluders, closed-mesh thickness and cancellation. GPU checks cover effect ordering/erasure/coverage, independent channels, output ranges, mapping, nearest/bilinear/repeat/clamp/mirror and actual mask-builder input/weight response. A frozen schema-5 fixture joins previous migration checks. Native mouse/keyboard checks exercise node and layer/bake workflows; actual captures are inspected before packaging.

## Retained work

Full Painter/Designer/Blender parity is not complete. Remaining items include multiple texture sets/material slots, folders/instances, UDIMs, production MikkTSpace, 4K/8K budgeting, GPU baking, cage sculpt/skew painting, material/vertex ID sources, source alpha/color/emissive transfer, normal/height painting, RGB-component Levels, triplanar/3D procedural mapping, full vector/BSDF/group/reroute nodes, multi-selection, tablet pressure, 16-bit/EXR/HDR workflows and matched Blender/Unreal shading acceptance.

The requested node catalogue and video backlog preserve these requirements. UI controls are exposed only for working behavior.

References: supplied recordings; public Adobe [layer stack](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/interface/layer-stack/layer-stack), [effects](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/effects/effects), [Levels](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/effects/levels), [baking controls](https://www.adobe.com/learn/substance-3d-painter/web/substance-3d-painter-baking-parameters). Those references inform behavior; implementations and limits above are Surface3D's own.
