# Surface3D combined development plan



Current priority: [Designer library audit](Designer-library-audit.md) and its [348-entry checklist](Designer-node-index.json). Complete requested node behavior, typed nested graphs and structured material/placement data before building the 400-asset library. The gate is closed. 0.22 adds an operator batch under verification, not full Designer parity.

Status: 0.21 is a checked development preview: 52/52 tests pass. See [shape/blur priorities](Iteration-0.21-plan.md) and [verification](Verification-0.21.md). Adjustable image Preferences, first-entry render framing and MSAA fallback are implemented; cross-machine rendering confirmation remains open. The previous 0.20 is an unsealed development milestone for channel/folder composition and independent mask-entry blending; see [0.20 layering plan](Iteration-0.20-plan.md). Generator and all-node acceptance passed after restoring a shared built-in kernel; the full 51-check regression passed; release packaging remains open. Surface3D 0.19 refines brush and mask-effect ownership, eight-channel paint, node contracts, Normal + Height, progressive bake previews/quality controls and sampled camera depth of field. Read the [artist guide](Surface3D-0.19-artist-guide.md), [verification](Verification-0.19.md) and [implemented/pending checklist](Iteration-0.19-plan.md). Production baking, DXR/RTX execution, realtime/hybrid GI and full Designer parity remain open. Surface3D stays standalone; existing theme and workspaces are retained.



This is the combined scope and priority list. [Rendering, color, API and coordinate technical details](Rendering-workspace-plan.md) supplement it; they do not replace or remove the requirements here.



## 1. Correct layer, mask and application behavior



- The top displayed layer/mask effect evaluates above the items underneath it. Audit actual composition, not just reverse the displayed list. Keep display, drag-reordering, evaluation and per-channel blending consistent.

- Keep masks attached visibly to their owning layer/folder; distinguish selecting material from selecting mask. New fills have no implicit white mask.

- Single click selects/previews library assets only. Apply with an explicit action, deliberate double-click or drop onto a highlighted compatible target. Mask targets and material targets remain unambiguous; all document application actions are undoable.

- Verify order and ownership after save/load, duplication, undo/redo and reordering.



## 2. Simplify Paint and keep Layers compact



- Layers contains stack controls only: visibility, thumbnails, names, hierarchy, mask ownership, blend mode, opacity and contextual actions.

- Keep advanced color, export, render and technical generator settings out of Layers.

- Generator Properties show useful artist controls first: Amount, Scale, Placement and Surface influence only where relevant. Technical controls go under Advanced and remain fully editable in Graph.

- Hide irrelevant parameters, explain unavailable baked-map inputs, use accurate simple names, neutral defaults, typed values and reset actions.

- Paint and Graph edit the same authoritative parameters. No parallel generator state or graph requirement for ordinary painting.



## 3. Fill Coordinates tab and shared graph source



- Selecting a fill shows Channels / Coordinates / Effects in its Properties panel, without moving existing docks.

- Every fill owns one stable Coordinates node. Paint hides the node and edits its parameters through Coordinates; Graph exposes that same node and its editable connections.

- Default to UV mapping and connect the source to every eligible map/procedural coordinate input. New resource assignments inherit it. Constants do not need artificial coordinate inputs.

- Expose supported projection modes, tiling/scale, rotation, offset, typed numeric controls, XYZ links/locks and reset. Show only relevant controls and do not advertise unimplemented projections.

- Texture wrap/filter settings are separate from coordinates. Avoid duplicate transforms/double tiling. True triplanar sampling needs normal-weighted projection blending.

- Optional per-map independent mapping is deliberate, indicated and resettable. Preserve custom Graph wiring and imported material mappings; Paint never silently overwrites them.

- Masks own independent coordinates unless explicitly linked. Baked position/normal/AO/curvature and other mesh-bound maps preserve their original UV correspondence by default.

- Preserve mapping/node identity through resource removal, duplication, undo, project persistence and material import/export. Reflect deleted/customized shared nodes truthfully.



## 4. Multiple meshes and texture sets



- Preserve imported objects, material assignments, texture sets, UV identity and transforms instead of collapsing everything into one mesh/atlas.

- Texture sets own their layers, masks, resolution and baked maps. Object selection and texture-set selection are related but distinct: multiple objects can share a material and one object can use multiple material slots.

- Alt-hover highlights the candidate mesh. Alt-click selects; Alt-drag retains camera navigation with an explicit drag threshold and no selection on completed navigation.

- Synchronize viewport, Texture Sets and scene outliner; choose the clicked material/texture set where unambiguous.

- Add object visibility, isolation and framing. Share the scene foundation across Paint, Bake and Rendering.



## 5. Shared color management and precision-preserving output



- Integrate standalone OpenColorIO, using Blender architecture and Painter/Toolbag workflows as references. Audit library/config/LUT licenses; do not depend on proprietary application code.

- Separate Input color space, Project working space, Display/View/Look and Export color space. Assign interpretation and Convert pixels are different operations.

- Start with scene-linear Rec.709/sRGB primaries; support ACEScg with actual transforms. Working-space changes convert authored colors, preserve data channels, invalidate caches and are undoable. Procedural results may change: do not promise exact preservation.

- AgX/ACES are view-transform choices when the active config supplies them, not texture color spaces. View switching does not alter material pixels.

- Keep normals, roughness, metallic, AO, masks and height Non-color. Preserve normal Y convention, alpha semantics and channel packing. Flag ambiguous mixed color/data packing.

- Upgrade existing RGBA8 source storage, project serialization, clamped graph color paths, GPU formats and readback before claiming higher precision or HDR.

- Planned writers: PNG 8/16-bit, JPEG 8-bit, TIFF supported integer formats, EXR half/float and Radiance HDR where appropriate. Expose only implemented format/channel/precision combinations, metadata and compression options.

- Per-output destination space and bit depth live in Export settings/templates. Presentation output stays in Rendering; raw linear EXR and data maps do not receive the display transform by default.

- Add manifest color/precision/normal/height metadata and optional color-space filename token for material export/reimport.



## 6. Standalone Rendering workspace



- Left: scene outliner. Center: large viewport with camera frame. Right: selected-item Properties and Render settings. Bottom: device/progress/render time and clearly labeled memory figures.

- Add saved cameras, projection/framing, scene transforms, multiple lights, shadows, HDRI controls, ground plane and background.

- Upgrade native shading with GGX, Fresnel, energy conservation, prefiltered specular IBL, diffuse irradiance, BRDF LUT and linear HDR/display pipeline.

- Add quality, antialiasing, exposure, image dimensions, transparency, supported output formats and render passes.

- Provide progress/cancel, capability-aware device selection and accurate allocation/OS budget reporting. GPU memory consumption is not GPU utilization.

- Later: reflection options, indirect lighting, depth of field and embedded standalone Cycles. Native D3D12/DXR is a separate possible backend; do not label native realtime shading EEVEE.

- Rendering consumes the same authored material. Share improved shading/color foundations with Paint; keep render-specific controls in Rendering. No changes to other workspace layouts.

- Coordinate heavy baking/rendering, bound work, preserve fast fallback and measure before performance claims.



## 7. Poly Haven API and reusable material pipeline



- Use the official public API for browsing metadata/downloads, not website scraping. Include required Powered by Poly Haven credit and observe current API terms.

- Browse HDRIs, textures/materials and models with search, filters, thumbnails and explicit download resolution/format/map choices.

- Async download: size, progress, cancellation, bounded concurrency, retries, validation and atomic cache publication; reuse cache and allow offline access.

- API map semantics feed the same local texture-pack-to-material assembler. Map base color, roughness, metallic where supplied, AO, normal and height/displacement; preserve encoding and normal convention. Use neutral defaults for absent maps.

- Download and add to Library creates reusable material plus individually usable textures without changing the current document. Apply is a separate deliberate action.

- Assembled materials inherit the fill's shared Coordinates setup when applied; preserve supplied mappings where needed.

- HDRIs apply explicitly to Environment; models use ordinary multi-mesh import. Preserve source IDs/URLs and metadata.

- Export material maps plus manifest/package; reimport reconstructs assignments, color spaces, precision, normal convention and height interpretation. Use existing material asset paths after necessary schema/precision upgrades.



## Settings placement



| Setting | Location |

| --- | --- |

| Stack order, visibility, mask ownership, opacity/blend | Layers |

| Material channels, mapping, effects | Fill Properties: Channels / Coordinates / Effects |

| Technical generator parameters | Generator Properties: Advanced / Graph |

| Working color space and OCIO config | Project settings: Color |

| Input texture interpretation | Library asset Properties |

| Display/View/Look | View settings / Rendering, shared state |

| Texture format, depth, packing, destination space | Export settings/templates |

| Cameras, lights, render backend and image output | Rendering |

| Online assets and cached materials/textures | Library: Poly Haven |



## 8. Acceptance and artist workflow review



- Order/ownership tests including save/load, duplicate and undo; no single-click asset application.

- Artist review of generator clarity and material/mask distinction.

- Shared coordinates across maps, explicit override/reset, Graph consistency, mask independence and baked-map correspondence.

- Multi-object/material-slot selection, Alt-click/drag conflict handling, multi-set bake/export and persistence.

- Color swatches, CPU/GPU transforms, working-space conversion, raw map invariance, alpha handling, actual 16-bit gradients and HDR EXR roundtrips.

- Poly Haven API fixtures, missing/ambiguous maps, cancel/offline cache, material export/reimport equivalence.

- Workspace switching preserves artist state; Rendering cannot accidentally paint. Verify camera frame vs image output and render cancellation.

- Reference scenes for roughness, metals, normals, shadows and output consistency. Measure GPU time/memory on stated hardware before optimization claims.

- Run required build/core/GPU/native checks after implementation; document supported features and remaining limitations honestly.



## Development order



1. Ordering and accidental application fixes.

2. Paint simplification and shared fill Coordinates.

3. Multi-mesh/texture-set architecture and selection.

4. Shared color/precision/export foundations.

5. Native Rendering workspace/shading and Poly Haven material integration, each using the shared foundations.

6. Advanced standalone rendering backends and production profiling.



## References



- https://github.com/Poly-Haven/Public-API

- https://www.blender.org/about/license/

- https://github.com/blender/cycles

- https://docs.blender.org/manual/en/5.0/render/color_management/color_spaces.html

- https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/features/color-management/color-management

- https://docs.marmoset.co/docs/render-object/

- https://docs.marmoset.co/docs/export-settings-output-maps/



## 9 October continuation



The expanded requirements are tracked in [Rendering and artist workflow continuation](Rendering-and-artist-roadmap.md): decals, stencil/text assets, viewport handles, unified import, ray/hybrid rendering, denoising, cameras and video output. They extend this plan and have their own implementation status.



## Offset, painted procedures and project texture outputs



- Offset moves/wraps an image in percent or current texture-set pixels, with a half-tile action. Optional opposing-edge blend and editable Paint/Clone repair are separate artist choices.

- Paint is an ordinary image/mask processing node, usable before/after procedural filters. Editing opens a graph-hidden Paint canvas. Stored marks replay against changed inputs; opacity remains adjustable.

- One or more named Texture Output nodes publish persistent project textures reusable in other layers, masks, graphs and sets. Explicit Update refreshes consumers with stable IDs. Automatic live inter-graph functions/dependency cycles are separate future work.

- Small parameter reset and search-clear icons, unique widget IDs and dependency cache reuse improve iteration. Completion is supported by native input checks and GPU cached/full parity; shader warmup and production residency limits remain explicit.

