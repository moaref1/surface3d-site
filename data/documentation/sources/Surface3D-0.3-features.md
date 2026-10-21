# Surface3D 0.3 — masks, effects and contextual graphs
This version keeps the existing independent Windows C++/HLSL/D3D11 foundation and adds working mask/effect/anchor authoring. Rust remains optional; replacing tested GPU/core modules is not needed for this iteration.

## Run and try the new workflow
Run build-native/Surface3D.exe. For an example with a Rust generator, Levels, Blur and an anchor link, open build-native/studio-effects-evidence/studio-demo.s3d. The mesh is an original industrial elbow pipe.

1. Select a base layer and click Anchor to publish its final values. Rename the anchor in layer Properties. Graph links use stable identity, so renaming does not break them.
2. Add a Fill layer. Use Mask for white/black paint reset, inversion, enabling or removal.
3. Click + Effect -> Mask -> a noise/position/facing/anchor generator. Its editable graph can mix current-layer values and a lower anchor.
4. Select the nested effect row, choose Edit graph, add/search nodes, click output then input to connect. Right-click input disconnects. Drag headers; middle-drag pans; Frame and Zoom organize the canvas.
5. Add Levels or Blur to the mask and reorder them in the effect context menu. Each effect has enable and opacity.
6. Save the project. Export opens a profile/destination/name dialog with actual file previews.

White/black mask reset clears mask paint and sets the background, retaining effects. Remove mask removes the mask effects. A generator in Replace mode replaces incoming mask paint; Multiply/Add or Layer Mask input can preserve/modify that paint. Material fill layers receive mask paint rather than material strokes.

## Implemented
- Original tool-rail icons for Paint/Eraser/Mask/Graph/Bake/Frame, tooltips and selected states.
- Shared brush size/flow/color or mask value toolbar, editing context, dockable panels and separate Paint/Graph layouts.
- Paint, uniform fill and procedural fill layers; rename, duplicate, delete, reorder, visibility, opacity and channel switches.
- Enabled/inverted masks with scalar backgrounds, paint reset/removal and a real selected-result grayscale preview.
- Up to eight ordered Material/Mask effects per layer: Levels, Invert, Blur and editable Graph.
- Levels low/high/gamma/output gain; box blur radius 1–8 pixels; enable and opacity; graph masks Replace/Multiply/Add.
- Sixteen typed graph kinds: Value, Color, Noise, Position Y, Remap, Color/Value Mix, Material Output, Layer Color/Roughness/Metallic/Mask, Normal Y, Anchor Color/Value, Mask Output. Maximum 32 nodes per graph.
- Context graphs read a snapshot immediately before their effect. Published anchors read a lower layer's final result even if it is hidden, before its opacity/stack composition. Anchor Value supports luminance, roughness, metallic, effective mask and color coverage.
- Stable references, unique anchor names, cycle/type/output validation, safe deletion/reorder rejection, fresh identities on duplication and material import.
- Reusable independent .s3mat assets preserve masks/effects/graphs. External anchor links require removal before single-layer export; dependency pack export is pending.
- Schema-4 .s3d saves effects/masks/anchor metadata and graph references; readers retain schemas 1–3. Transactional temporary validation, backup and recovery remain.
- Export dialog chooses parent folder, asset name and Blender/Unreal profile, previews exact PNG filenames, creates a fresh job folder and optionally opens it.
- Same-size GPU texture resources are reused across rebuilds; geometry maps and mesh buffers retain existing caches.

All previous bounded features remain: OBJ mesh/embedded geometry, one atlas 256–2048, up to eight layers, at most 100,000 dabs and 50,000 mesh triangles, color/roughness/metallic painting, erasing, undo/redo, library presets, low-mesh geometric bakes and flattened texture export.

## Evaluation contract
Base fill/procedural material -> recorded material/mask dabs -> ordered effects -> effective mask inversion/bypass -> stack composition. Graphs have one target-specific output. Layer inputs are snapshots, not recursive reads. Only lower-layer anchors are legal; invalid source moves/removal/unpublication are rejected. Hidden source layers continue supplying anchors.

Color is linear internally and sRGB at display/base-color export. Material effects preserve authored channel coverage. Material graph blend modes change color; roughness/metallic interpolate by effect opacity. Levels/Invert/Blur have opacity but no separate blend operator. Masks use scalar [0,1]. World Normal is normalized object-frame data in the current mesh baker.

## Boundaries
No high-poly projection, tangent-normal detail, AO/curvature/thickness ray bake, normal/height/emission painting, image/HDR asset import, full UV transforms/triplanar, layer folders, arbitrary intermediate anchor points, multiple anchors per layer, general Designer node library, graph subgraphs, progressive render, UDIMs or live Blender/Unreal bridge. Current ORM uses AO=1. Export is 8-bit PNG at project resolution. Lighting is approximate and not shader-matched to either engine.

Graph/effect-dependent painting currently replays authored layers each input frame so live dependencies stay correct. Texture allocation is reused, but dirty-tile evaluation, checkpointed strokes, asynchronous export, profiling and memory eviction remain future optimization work. The selected-mask preview uses a small GPU readback when document state changes. No performance target is claimed from test durations.

## Verification
Nine CTest checks cover storage/recovery, analytic references, paint/export, geometric bake, material graph, existing GPU pipeline, new mask/effect/anchor semantics, effect UI and export UI. New checks verify effect order/bypass, mask inversion/bypass, attached material values, hidden live anchors, safe reference changes, duplicate/import identities, schema-4 replay, schema-1/2/3 migration fixtures, blur neighborhood values and normal-driven masks.

Native screenshots: studio-evidence/Surface3D.png, studio-bake-evidence/Bake.png, studio-graph-evidence/Graph.png, studio-effects-evidence/Effects.png and studio-export-evidence/Export.png under build-native. These are screenshots of implemented UI. Images in docs/design are concepts with planned capabilities.

The source/history/visual backlog is in docs/video-reference. Painter 1.3.5 is the initial cumulative parity target, not a completed parity claim.
