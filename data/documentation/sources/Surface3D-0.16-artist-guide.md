# Surface3D 0.16 — shared materials, baking, color and Rendering

This iteration implements the working foundations of the combined master plan. Surface3D is still a standalone Windows application. Painting, editable graphs, GPU simulation brushes, the 50 ready recipes, existing shortcuts, branding and existing workspace docks remain available.

## What changed

| Area | Delivered behavior |
| --- | --- |
| Layers and masks | Top displayed effects evaluate after the effects underneath them. Mask effects stay attached to their layer or folder. New fills have no mask. Single-click library selection does not apply an asset. |
| Paint Properties | Fill properties have Channels, Coordinates and Effects. Artist controls come first; technical generator controls stay under Advanced or in Graph. Typed controls and uniform fallbacks remain available. |
| Shared Coordinates | A normal fill has one stable coordinate node behind its Paint controls. Eligible newly assigned image/noise sources inherit it. Existing wired coordinate inputs, mask mapping and mesh-map UV correspondence are preserved. Missing/customized mapping is reported instead of silently overwritten. |
| Scene and texture sets | Imported object groups, material slots and UVs are retained. Each material set owns authoring, maps and resolution. Alt-hover highlights, Alt-click selects the hit material, and Alt-drag navigates. Rendering exposes object visibility, isolation, framing and presentation transforms. |
| Color | Standalone OpenColorIO, linear Rec.709 and ACEScg working spaces, explicit texture interpretation, display/view/look controls and authored-color conversion. Data channels stay non-color. |
| Source and output precision | Original 16-bit/float source pixels survive import, evaluation and project persistence. Texture templates support PNG 8/16, JPEG 8, TIFF 8/16, EXR half/float and RGBE HDR, with supported channel combinations. |
| Multi-set baking | Bake each set with its own high sources, cage, map choices and settings. Publish the batch atomically; cancellation or changed inputs retain the previous maps. Layer edits made during a valid bake survive publication. |
| Rendering | Independent Scene/Viewport/Rendering docks; saved cameras; eight directional lights; shadows, ground and background; filtered HDRI, GGX/Fresnel shading, image sizes/passes, transparency and antialiasing. Image rendering runs on a worker with progress/cancel and GPU or WARP device selection. |
| Poly Haven | Official API browsing for materials, HDRIs and models, search, thumbnails, map/format/resolution choices, checked downloads, cancellation, cache reuse and offline metadata. Materials use the local pack assembler and saved-material library. Application is explicit. |
| Persistence | Schema 16 stores scene/material sets, shared coordinate identities, color/precision, export outputs and render cameras/lights. Readers for older released projects remain. |

## Paint a prop

1. Import a mesh using File → Import or Ctrl+I. OBJ, FBX, glTF/GLB, Collada, PLY and STL are supported; supply authored UVs for texturing.
2. Choose its material in Texture Sets. Select the fill's material thumbnail to edit Channels. A texture/resource takes precedence when connected; removing it restores the uniform fallback.
3. Use Coordinates to change the shared projection, tiling, rotation and offset. Sampling wrap/filter is separate. Graph shows the same editable source and connections.
4. Add a mask deliberately. Its thumbnail and highlight select mask editing; mask effects and material effects remain separate. Double-click the mask to preview; repeat to return.
5. Open Bake, configure the selected set's low/high/cage and map settings, then bake. Published maps appear in the library and semantic mesh-map nodes bind them. Configure other sets individually before Bake all sets.
6. Export textures through Settings / Output templates / List of exports. In a custom template, open Encoding to choose format, precision and destination color space. Enable All texture sets to write separate set folders.

## Faster everyday controls

- Import is one action in File and the library header. Select matching map images together to review an automatically detected material pack; no layer is created until Create material. A single ordinary image imports as a texture. Saved materials/graphs, project files, meshes and HDRIs are detected by their supported file types. Mixed incompatible selections are rejected before changing the document.
- New XYZ values/mapping transforms start linked; unlock or unlink axes when you need independent edits. Existing saved links/locks are preserved. Simulation gravity stays independent.
- F follows the panel under the pointer. In Graph it fits selected nodes, or all nodes when selection is empty. In the 3D viewport it fits the selected visible object, or the scene if no object is selected, without changing orbit or FOV. The Rendering Frame scene action always fits the complete visible scene.
- Layers places the selected channel blend and layer opacity above the stack. Effects shows its own blend/opacity before detailed parameters. The smaller channel-opacity control remains separate from layer opacity.
- Click the wide color swatch in fill or node properties to open its picker. RGB fields below accept typed values and preserve working-space conversion and undo.

## Color controls

Project → Color holds working space and OCIO configuration. Rendering → Color exposes the shared display/view/look settings. The bundled CG config supplies ACES views; AgX needs a compatible external OCIO config that actually supplies it. Compatible configs must expose the input/working space names used by Surface3D.

Right-click a library texture to **assign** its input interpretation without changing its pixels. After assigning sRGB, linear Rec.709 or ACEScg, **Create converted copy** converts pixels into another supported color space and retains the original. Non-color maps require no conversion.

Working-space changes convert authored colors in all sets and graph instances; roughness, metallic, normals, height, AO and masks remain data. A display/view change affects presentation rather than authored texture pixels. Texture export can choose its own destination space. Alpha stays linear.

Integer images clamp to 0–1. EXR retains supported negative/HDR values. Compact material intermediates normally use half precision; the existing full-precision control is required when evaluating at float precision. A 32-bit output container alone does not create additional precision. The presentation framebuffer is half precision and the Windows editor display is SDR.

## Rendering

Open Rendering beside Bake. Scene lists actual objects and materials, with visibility/isolation controls and saved cameras. The right panel contains Scene, Output and Color. Camera and lighting controls are kept outside Layers.

Frame the prop, adjust HDRI rotation/exposure and lights, and choose image size, pass, format and transparency in Output. Render image uses a snapshot of the authored scene on a separate device; Paint remains usable. Cancel prevents publication of a partial image, with checks between bounded stages. It cannot interrupt a GPU dispatch or codec call already in progress.

Rendering previews automatically fit the selected output aspect ratio. Paint and Rendering keep separate camera navigation. Returning to Paint restores its layout/channel/FOV/navigation. Render object transforms affect presentation rather than authored baking geometry. HDRI selection is saved by file path; make that file available when moving the project to another computer.

The GPU figure at the bottom is process memory usage against the Windows budget, not GPU utilization. The memory popup separates renderer allocation estimates and process RAM from the broader OS GPU figure.

## Poly Haven

In Assets, select Poly Haven. Choose Materials, HDRIs or Models, search, select an asset and inspect its available files. Download to Library adds a reusable asset; it does not add a layer or mask. Apply material, Use environment and Import model are separate actions. Saved materials appear under Materials; Add textures makes individual cached maps available in the current project's texture library.

Supported online choices are 1k/2k; material PNG/JPEG/EXR, Radiance HDR environments, and glTF/FBX models with required dependencies. Size/checksum validation and atomic cache publication prevent incomplete assets being treated as ready. Offline browsing uses previously cached metadata/assets. The client displays the required [Powered by Poly Haven credit](https://github.com/Poly-Haven/Public-API).

## Limits and the next production work

- Eight layers per set, sixteen texture sets and 128 nodes per graph. Authoring/source and bake resolution is bounded at 2048; presentation images at 4096. Source/image/bake/render memory budgets reject jobs exceeding supported limits.
- Imported transforms preserve the posed geometry through normalization and pretransformation. Original DCC node hierarchy, animation and editable source transform matrices are not retained; presentation transforms are separate.
- The native renderer provides direct-light shadows and filtered environment lighting. Cycles, D3D12/DXR, reflection/GI systems and depth of field remain the explicitly later renderer phase.
- This is not complete Painter, Blender or Designer node/format parity. Source meshes need suitable UVs; continuous cross-chart filtering and large-production streaming/UDIM work remain open. Physics brushes remain a bounded surface-film approximation.
- Inactive material sets use 256px viewport proxies to bound editing memory. Image rendering and texture export use their full authored resolution.
- Built-in display transforms use a sampled GPU LUT; this is not monitor calibration or native Windows HDR output. PNG/TIFF do not yet embed arbitrary OCIO/ICC profiles; color/precision metadata accompanies texture packs. Custom OCIO configs and external assets require artist validation.

The expanded ray/hybrid, DLSS/denoising, procedural sky, camera effects, video output, decal/text/stencil and viewport-handle requirements are tracked individually in [the continuation checklist](Rendering-and-artist-roadmap.md). They are not represented as implemented features in this build.

## Artist checks waiting for your assets

- Your multi-object FBX: pick different material slots with Alt-click, then orbit with Alt-drag; save/reopen and check UV/set ownership.
- Your low/high cube: inspect cage wire, missed-ray overlay and all baked maps before applying generators. Existing fitted-cube evidence still contains a residual missed sample; no universal zero-miss claim is made.
- Reorder two mask effects and two material effects; duplicate, undo and reopen. Confirm the visible top item wins.
- Assign one checker to multiple fill channels, change shared Coordinates, then deliberately wire one independent mapping in Graph. Paint must preserve that override.
- Export 16-bit PNG and float EXR plus a packed Unreal material, then reimport; compare normals, height, roughness, alpha and color interpretation.
- Render the same prop with two cameras/lights and an HDRI, cancel a second image, and return to Paint. Confirm it has the previous view and no accidental paint marks.
- Download a Poly Haven material, reopen offline and reuse it from Materials. Confirm single-click selection does not apply it.

Automated verification is recorded separately in Verification-0.16.md. Artist acceptance and validation on other GPUs remain open.
