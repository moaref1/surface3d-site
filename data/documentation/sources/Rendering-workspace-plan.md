# Rendering workspace design reference

Requested workspace order: Paint / Bake / Rendering / Graph / Export. Preserve the current theme and existing Paint, Bake and Graph docks. Surface3D must be standalone: no Blender installation or background Blender process. This design reference preceded the implementation. The native renderer, shared color/precision pipeline and Poly Haven client are now implemented in 0.16; [the artist guide](Surface3D-0.16-artist-guide.md) describes the delivered scope and remaining renderer phases.

## Layout and task

An artist textures a prop, opens Rendering, frames a camera, adjusts environment and lights, selects a preview/render backend and saves a presentation image. Texture exports remain in Export. Rendering consumes the same authoritative material without a second material editor.

- Center: large preview, camera frame and contextual progress/pause/cancel controls.
- Left: Scene outliner, initially the actual imported prop, active camera, environment and existing key light. Do not imply independently editable source objects while imports collapse them into one normalized mesh.
- Right: selection Properties and Render settings, grouped into Camera, Lighting, Quality, Color and Output. Shared model controls, not duplicated state.
- Bottom: backend/device, progress, render time and separately labeled GPU allocation, OS memory usage and budget. Memory usage is not GPU utilization.

## Existing foundation confirmed in source

src/app/studio.cpp provides perspective/orthographic viewing, FOV 20–100 degrees, six axis views, framing/navigation, optional 4x MSAA, Radiance HDR import, neutral studio environment, environment and key-light rotation/strength, exposure and DXGI process-memory reporting. These are native Surface3D features, not Blender features.

## Implementation sequence

1. Native Rendering workspace: independent dock state, safe navigation-only input, shared camera/light parameters and outliner with only real scene entries. Preserve Paint/Graph/Bake state and disable paint strokes while rendering.
2. Persist saved cameras and presentation settings with schema migration; camera aspect/framing must agree with export resolution. Add PNG presentation output using explicit display transform, distinct from material export.
3. Upgrade native realtime shading: GGX/Fresnel/energy conservation, prefiltered specular IBL, diffuse irradiance, BRDF LUT, linear HDR target and explicit display transform; then lights, shadows, ground plane and quality controls. Validate against roughness/metal/normal reference props.
4. Integrate standalone OpenColorIO and image I/O with the shared color/export plan below. This serves Paint, Graph, Bake, Rendering and Export without moving their docks.
5. Evaluate embedded Apache-licensed Cycles, pin source and dependencies, and measure scene upload, material rebuild, GPU memory and cancellation. EEVEE extraction is a separate feasibility project, not a first-release dependency or a label for our native renderer.
6. Poly Haven uses its public API and the existing texture-pack/material asset path; integrate after channel semantics and higher-precision import/export are reliable.

## Backend and compatibility requirements

- Native viewport remains the available fast fallback.
- List only devices and engine capabilities returned by the active backend. Do not assume CUDA/OptiX/HIP/oneAPI works because an adapter exists; support depends on build, driver and hardware.
- Standalone backends report their own allocations plus OS process memory without double-counting. Mark unavailable statistics explicitly; CPU fallback must be visible.
- Bound resolution and samples, cancel long work, avoid simultaneous heavy bake/render jobs by default, reuse unchanged snapshots, release worker resources on job completion, measure before claiming optimization.
- First material interchange: flattened base color, roughness, metallic, tangent normal, supported height interpretation and AO. Our HLSL procedural/custom nodes cannot be assumed to execute in Cycles or EEVEE. Texture snapshot fallback preserves final appearance within shader-model limits; arbitrary native node translation is separate work.
- Match units, axes, normals, tangents, normal Y convention, camera projection and color transforms against a shared reference prop. Do not promise exact Blender/Unreal appearance without these checks.
- No unsupported controls for depth of field, multi-object transforms, multiple lights or render passes until the backend implements them.

## Benefits outside Rendering

- Paint/Graph: consistent color preview, shared material validation, camera bookmarks.
- Bake: improve native cage projection, map semantics and diagnostics; use externally prepared reference images during development, with no runtime Blender requirement.
- Import: preserve multiple mesh/material/UV/cage identity and provide file-based interchange, with no Blender requirement.
- Export: material assembly for Blender with explicit data/color encoding and normal convention.
- GPU: capability-aware device selection, measured scheduling and separate backend memory budgets.

## Acceptance

Verify repeated Paint/Bake/Rendering/Graph switching, no paint mutations in Rendering, navigation and typed controls, matching camera frame/output, cancellation without losing completed material/bakes, unsupported-device fallback, normal convention and raw data exports, and backend cleanup. Existing build/core/GPU/native regression checks must pass after implementation.

## Shared color-space and export plan (updated user request)

Use Blender's documented OCIO architecture and Painter/Toolbag artist workflows as references. Prefer direct standalone OpenColorIO and image libraries over copying GPL Blender integration code. Audit licenses of all code, configs and LUTs before bundling; preserve notices. Adobe ACE and proprietary Toolbag rendering code are not dependencies.

Distinguish four settings in the UI:

1. Input color space: asset metadata or semantic default, with per-image override; Assign interpretation and Convert pixels are different operations.
2. Project working space: initially scene-linear Rec.709/sRGB primaries; add ACEScg with actual transforms. Switching an existing project converts authored color constants, colors in strokes, color parameters and stored raster/color results from the old working space, invalidates caches and re-evaluates graphs. Leave scalar/vector/data channels untouched. Keep original source images and their declared spaces. Explain that procedural/nonlinear color operations may change appearance; do not promise lossless migration. Make conversion undoable and save config identity/version.
3. Display/View/Look: choices from the active validated OCIO config, including AgX or ACES views when supplied. These are view transforms, not texture color spaces. Display switching changes preview, not document pixels.
4. Export color space: per output row plus template defaults. Convert color maps from working space to selected destination. Data maps use Raw/Non-color. Presentation exports may apply the selected view; scene-linear EXR exports do not by default.

Provide compact Color settings in project settings and Rendering, with per-image interpretation in Assets and per-output encoding in Export. Use clear labels, tooltips, live preview and explicit conversion summary; do not add repeated controls throughout Paint. Show unavailable config spaces as unavailable rather than silently substituting them.

Image formats and precision are separate from color space. Planned initial writers: PNG 8/16-bit unsigned, JPEG 8-bit RGB with explicit alpha handling, TIFF 8/16-bit unsigned (extend supported float variants after validation), OpenEXR half/float and Radiance HDR for appropriate RGB environment/render output. Offer grayscale/RGB/RGBA only where supported. Preserve alpha semantics, compression options and supported metadata; report gamut clipping and integer range limits where relevant. EXR must retain values above 1 and negative values where valid. Height/displacement encoding needs explicit scale/bias and signed-range policy. Packed data channels remain raw; flag mixed color/data packing rather than gamma-encoding every channel.

Current limits are real prerequisites: embedded images and exports are RGBA8 and graph color paths clamp values. Add validated higher-precision source storage, serialization, GPU evaluation/storage, unclamped HDR color handling and precision-preserving readback before claiming 16-bit/HDR support. An 8-bit image written to 16-bit output does not recover precision. Update schema, thumbnails and existing project migration tests.

Reuse export templates to store filename, format, bit depth, channel layout, destination space and normal convention. Add optional color-space filename token and material manifest metadata. Validate supported combinations before starting export. Asset colors, node previews and viewport must share the same transforms, with GPU processors/LUTs cached by config and settings.

Acceptance: known color swatches and GPU/CPU transform comparisons; input assign vs convert; working-space switch/undo/save/load; view switch does not modify maps; raw normals/roughness/ORM unchanged; alpha unaffected by RGB conversion; HDR >1 survives EXR roundtrip; actual 16-bit gradient precision; format metadata; template persistence; material export/reimport consistency.

## Poly Haven API to material workflow

Integrate official public API for asset/category browsing, metadata and downloadable files. Consume the documented schema rather than hardcoding guessed filenames. Check current API terms at implementation and include the required Powered by Poly Haven credit.

Flow: Library > Poly Haven > browse/preview > choose resolution/maps > Download and add to Library > assemble reusable material. Single click selects/previews only. Explicit Apply or drag/drop onto a named material target applies it; mask conversion requires an explicit mask target. Downloads do not silently change the document.

- Map API-provided semantics to base color, roughness, metallic where present, AO, normal and displacement/height. Use neutral defaults for genuinely absent maps, retaining provenance. Do not synthesize a metallic map merely because the app has that channel.
- Use the existing texture-pack detection, channel assignment, material asset save/import and export manifest as one shared assembly pipeline for local and downloaded assets. Prefer API semantic mapping to filename heuristics; provide a small correction screen only for ambiguity.
- Retain source asset ID, resolution, source URL, map semantics, encoding and normal convention in cached material metadata. Interpret color maps explicitly; do not assume all EXRs share the same space. Treat normals/AO/roughness/displacement as data. Convert HDRI to supported environment input only after implementing appropriate decoding.
- Material export writes maps plus a manifest with channel/file/space/precision/normal/height metadata, allowing local reimport to reconstruct the material. Support existing s3mat/material-package paths with schema migration and no 8-bit downgrade hidden from the artist.
- Download asynchronously with visible size/progress/cancel, bounded concurrency, retry/backoff, validation and atomic cache publication. Sanitize filenames, validate dimensions/formats before allocation, reuse cached downloads and handle offline mode. Never scrape the website or preload the entire collection.
- Downloaded materials and individual textures remain available in Library and drag/drop targets. HDRIs feed Environment; models feed ordinary multi-mesh import after that architecture exists.

Acceptance: API response fixtures and malformed/missing-map cases; no accidental single-click apply; cancel leaves no partial asset; cached offline reopen; correct normal and color interpretation; export/reimport reconstructs equivalent material; honest unavailable resolutions/formats under current storage limits.

## Updated immediate priority

### UI ownership and fill Coordinates (latest request)

Layers is a compact stack, not an advanced settings editor. Keep visibility, material/mask thumbnails, selection, names, hierarchy, blend mode, opacity and contextual add/remove actions there. Do not place working/display spaces, file formats, bit depth, render devices, output settings or technical generator controls in Layers.

Selecting a fill material opens its existing Properties panel with Channels / Coordinates / Effects tabs. Selecting its mask opens mask properties clearly labeled with the parent layer; switching mask/material must not change the fill's coordinate state or accidentally apply assets. These are inspector tabs, not new global workspaces, and preserve existing dock positions.

Coordinates is one layer-owned, editable Coordinates node in the authoritative graph. Direct Properties controls and Graph edit the same node with the same stable ID; there is no second hidden parameter store. The automatic node remains out of the Paint interface, but is visible/editable in Graph. Use the existing unified Coordinates kind rather than duplicate UV-X/UV-Y sources.

- New fill: create/own one Coordinates node, set UV as the default, and wire its vector output to every eligible image/procedural source feeding that fill's channels. Scalar constants and shaders without a coordinate input require no artificial connection. A fill with constant-only channels still has a coordinate setup ready for later resources.
- Newly assigned color, roughness, metallic, normal, height or other coordinate-capable maps inherit that same source by default. Existing coordinates on imported materials must be preserved or explicitly migrated; do not silently replace authored mappings.
- Coordinates tab: projection selector, UV set where supported, tiling/scale, rotation, offset, XYZ link/locks and reset. Show controls relevant to the chosen projection only. All numeric controls accept typing. Modes include UV and the supported position/polar/cylinder/sphere/box/triplanar behavior, with honest capability limits. Normal can remain a coordinate source mode where meaningful; it is not a projection or tangent-normal-map setting.
- Coordinate mapping is separate from sampling: repeat/clamp/mirror and filtering remain texture resource settings. Defaults can be exposed in the tab, but must not create a second transform or double tiling. True triplanar sampling requires blending projections with surface normals; one vector connection alone cannot promise that behavior.
- Per-map override is optional and contextual: explicitly choose independent mapping, retain the shared default for all other maps, show a small override indicator and provide Reset to layer coordinates. Graph custom connections take precedence; Paint must recognize them and must not silently overwrite them on a property change.
- Mask graphs have their own coordinate ownership. Do not wire a fill material's Coordinates into its mask unless the artist explicitly links them. Effects use the existing snapshot/mapping semantics; no automatic rewiring of arbitrary custom graphs.
- Bake-bound mesh maps are an exception: keep native mesh UV correspondence by default rather than tiling position/normal/AO/curvature maps as surface materials. Any deliberate remapping must be explicit.
- Retain coordinate node identity/connections through duplication, material library save/import, Poly Haven assembly, project save/load and undo/redo. Removing a resource must preserve the layer mapping. Removing/customizing the shared node in Graph must be reflected truthfully in Properties without silently regenerating it.

Advanced settings placement:

| Setting | Location |
| --- | --- |
| Project working space and OCIO configuration | Project settings > Color |
| Texture interpretation | Library asset Properties |
| Display/View/Look | View settings and Rendering, shared state |
| Format, bit depth, channel packing, destination color space | Export settings/templates |
| Render engine, device, samples, image output | Rendering |
| Technical generator parameters | Generator Properties > Advanced and Graph |
| Fill mapping | Fill Properties > Coordinates |

Acceptance: edit shared tiling in Paint and verify every attached eligible map changes consistently; inspect the same node in Graph; add a resource and confirm inherited wiring; preserve one independent override; reset override; verify masks and mesh-map correspondence remain unaffected; test projection-specific controls and typed values; test material/Poly Haven export-import, duplication, save/load and undo; never expose unimplemented projections as working options.

1. Fix mask/effect top-to-bottom order and accidental single-click material/mask application.
2. Simplify generator artist controls in Paint; Advanced and Graph retain technical controls.
3. Implement the fill Coordinates inspector and one shared graph node per fill, including resource inheritance and deliberate overrides.
4. Establish multiple mesh/texture-set identity and Alt-hover/Alt-click selection without breaking Alt-drag navigation.
5. Implement shared color semantics, precision storage and export writers; then Poly Haven API material assembly using the shared coordinate setup.
6. Implement native Rendering workspace and shading upgrades, followed by standalone Cycles evaluation.

## Primary references

- https://github.com/blender/cycles (standalone renderer)
- https://github.com/blender/cycles/blob/main/BUILDING.md
- https://developer.blender.org/docs/features/eevee/
- https://www.blender.org/about/license/
- https://docs.blender.org/manual/en/4.4/render/cycles/baking.html
- https://developer.blender.org/docs/release_notes/5.1/eevee/
- https://docs.blender.org/manual/en/5.0/render/color_management/color_spaces.html
- https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/features/color-management/color-management
- https://docs.marmoset.co/docs/export-settings-output-maps/
- https://docs.marmoset.co/docs/media-formats/
- https://github.com/Poly-Haven/Public-API
- https://api.polyhaven.com/
