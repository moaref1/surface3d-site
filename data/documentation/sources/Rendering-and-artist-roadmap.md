# Surface3D rendering and artist workflow continuation

Updated 9 October 2026 from the expanded rendering and artist-controls request. This extends [the master plan](Surface3D-master-plan.md). The current deliverable is standalone 0.18, extending the 0.17 foundation. The additional Offset/Paint/Texture Output, library/setup/view-wheel and performance checklist is in [Iteration-0.18-plan.md](Iteration-0.18-plan.md). Checked items have an implementation; unchecked items remain required work. Controls for an unavailable engine must not appear as working settings.

## Artist workflow, first

- [x] New editable XYZ controls start linked; unlink and per-axis locks remain available. Preserve existing saved choices and gravity direction.
- [x] Frame in 3D fits the visible target without resetting orbit or FOV. Frame in Graph fits selected nodes; with nothing selected, fit the whole graph.
- [x] Put layer/effect blend and opacity above detailed properties, with clear ownership and no duplicate controls.
- [x] Clicking the large color swatch opens the color editor. Numeric fields remain editable and use the same working-space conversion.
- [x] Node selection, multi-selection, grouping frames, ungrouping, reroutes, renaming, selected-only arrangement, cut connections and node previews have working implementations. Group labels and moving a whole group by its header still need improvement.
- [x] One primary Import action accepts a mesh, saved material, exported material pack, images, HDRI or project. Automatically detect matching texture channels and show the existing review before creating a material. A single plain image stays a texture. File drops use the same routing.
- [ ] Expand normal-brush controls: direction/strength, channel enablement, tangent convention, height interaction, alpha rotation/spacing and consistent resets. Preserve flow, size, tablet pressure, stabilization and replay.
- [x] Deliberate decal image/template drop creates a layer on the actual mesh hit; a reusable Decal graph node shares the same parameters.
- [ ] Decal controls: image/alpha, channel coverage, size/aspect link, position, orientation, depth limits, front/back rejection, opacity, roughness/metal/height/normal response, blend, repeat/clamp, filtering and editable source.
- [x] Neutral Sticker and Leak sources: draggable, editable, deliberately applied, undoable and included in the composed texture export.
- [ ] Stencil placement/painting, brush alphas and editable text sources for channels, masks, decals and graphs. Text needs fonts, shaping, layout, alignment, color and resolution; a fixed bitmap is not editable text.
- [ ] Viewport transform handles first for object-coordinate projections and decals: translate/rotate/scale, axis locks, snapping and typed values. Handles edit the same node and suspend painting during a drag.

## Current native rendering foundation

- [x] Separate Rendering workspace: outliner, object visibility/isolation, texture sets, transforms and saved cameras.
- [x] GPU raster PBR, GGX specular, diffuse irradiance, filtered HDRI, BRDF lookup, exposure and shared OCIO color management.
- [x] Directional lights, color/intensity, raster shadow maps/bias, default studio environment and ground stage.
- [x] UV/triplanar material inputs, material layers and modular editable graphs. UDIM storage/evaluation is still required.
- [x] Perspective/orthographic, FOV, framing and 4x MSAA where supported.
- [x] Still-image output: dimensions, alpha where supported, material inspection passes, PNG/JPEG/TIFF/EXR/HDR encoding, progress/cancellation.
- [x] Separate image-rendering device/context, preserved Paint navigation, labeled memory figures and bounded material allocations.
- [x] Rendering preview automatically fits the output aspect as a camera frame.
- [ ] Near/far clipping controls, optional composition-safe margin overlay and render comparison.
- [ ] Omni and spot lights: range, cone/falloff, shadows and light gizmos.
- [ ] Kelvin temperature/tint independent of intensity.
- [ ] Procedural sky: time/location or explicit sun direction, atmospheric turbidity, ground albedo and rotation.
- [ ] Diffuse/reflection intensity, separating artistic multipliers from physical radiance.
- [ ] Cascaded directional shadow maps, quality and consistent shadow offset/bias terminology.
- [ ] SSAO, AO color and separate diffuse/specular occlusion; ray-traced AO requires the ray backend.
- [ ] Local reflections and local diffuse scattering with explicit limits for screen-space data.
- [ ] Volumetric fog with density, scattering/absorption and lighting.
- [ ] Shadow catcher with selected/custom mesh, transparent output and a shadow pass.

## Ray and hybrid backend

- [x] Original D3D11 compute path tracer for still images: BVH, GGX/diffuse reflection, actual shadow and indirect rays, HDRI, eight directional lights, MikkTSpace normal/height shading, layered material maps, geometry/coverage alpha, managed/HDR output and cancellation.
- [x] Bounded work batches, reflected bytecode cache, existing material-map SRVs shared without an upscaled texture-array copy, separate render context and an explicit completed-result/live-view toggle.
- [x] WARP can execute the same ray compute shader as a CPU software fallback. This is not an independent optimized CPU path tracer.

The raster viewport remains interactive; ray images are requested through Rendering > Output. DXR/RT cores, hybrid lighting, temporal accumulation, DLSS, denoising, refraction/caustics and the independent CPU backend below remain open.

- [ ] Capability interface: Raster / Hybrid / Ray Traced. Keep D3D11 Raster usable; ray modes require actual standalone implementations.
- [x] Matching-adapter D3D12/DXR capability probe and an explicit compute-engine label.
- [ ] GPU hardware-accelerated tracing execution: acceleration structures, multi-mesh updates, resource budgets and fallback.
- [ ] Independent CPU ray backend with consistent materials/output; WARP raster is not CPU ray tracing.
- [ ] Hybrid Direct Lighting / Diffuse GI / Specular components, each with independent quality and denoising.
- [ ] Diffuse GI, specular, refraction, indirect and transmission bounces; define total-depth interaction and energy accounting.
- [x] HDRI importance sampling with a bounded alias distribution, BSDF/environment MIS and numerical sampling/transport reference tests. Additional area/emissive-light sampling remains open.
- [x] Direct and indirect radiance clamps, zero for unclamped output and a short explanation of their tradeoff.
- [ ] Caustic paths: Coarse / Medium / Fine presets backed by a real algorithm and comparison images.
- [ ] Viewport frame accumulation, samples per pixel, convergence, relevant-edit resets and bounded frame scheduling.
- [ ] Adaptive frame rate/resolution during editing, returning to final quality when idle.
- [ ] GPU hardware denoiser and CPU denoiser with strength controls; independently Direct Lighting / Diffuse GI / Specular where backend buffers support them.
- [ ] NVIDIA DLSS after motion vectors, depth, jitter, exposure and capability checks; native-resolution/non-NVIDIA paths and documented SDK redistribution requirements.

## Cameras and image effects

- [ ] Ray-traced and post-effect DOF, focus target/distance, f-stop and aperture shape. Distinguish a lens simulation from a screen-space effect.
- [ ] Near/far clipping, safe frame and multiple named render cameras with per-camera output.
- [ ] Lens flare, shutter-based motion blur and lens distortion, each with enable/reset.
- [ ] OCIO AgX/ACES where supplied by the config; Linear, Reinhard and the requested Hejl curve need defined implementations. These are view choices, not texture encodings.
- [ ] Per-channel curves, sharpen, bloom, vignette, Film / Digital grain: bypass and documented HDR ordering.

## Output and passes

- [ ] Additional passes: wireframe, alpha, linear depth/units, object/material ID maps, light maps, direct/indirect lighting and denoiser buffers.
- [x] Ray samples per pixel and bounce controls are distinct from raster MSAA; irrelevant raster output quality is disabled in ray mode.
- [ ] JPEG, PNG, TGA, PSD 8/16-bit and EXR 16/32-bit stills with supported precision/components. Retain TIFF/HDR.
- [ ] Image sequences using supported still formats: frame range/rate, naming, resume/cancel and atomic frame publication.
- [ ] Lossless AVI and MP4: codec discovery, frame rate/dimensions, video compression quality and clear alpha limits.
- [ ] Transparency/alpha mask and shadow-catcher alpha with consistent straight/premultiplied handling across supported outputs.

## Acceptance order

1. Verify artist fixes and the 0.16 package, including older projects.
2. Decal/text/stencil representation and 3D handles, usable through Paint and Graph.
3. Camera safe frame, lights/temperature, procedural sky, stage and raster effects.
4. Ray backend, transport/sampling tests and accumulation; then denoising and DLSS.
5. Camera effects, extra passes, sequence/video writers and reference scenes.

Require real visible behavior, typed parameters, save/load/undo, cancellation/resource limits where relevant, and an artist acceptance example. Measure GPU time/memory on named hardware. A button, enum or placeholder shader does not complete a feature.


## Primary references

The mode/component distinction follows the public [Marmoset Render Window documentation](https://docs.marmoset.co/docs/render-object/). Raster previews, hybrid components and full ray transport need different algorithms and quality controls; identical-looking UI does not make those engines equivalent.

[NVIDIA's DLSS integration guide](https://github.com/NVIDIA-RTX/Streamline/blob/main/docs/ProgrammingGuideDLSS.md) requires depth, motion vectors and separate input/output color buffers, plus correct frame constants. These are implementation dependencies before offering an upscaling switch. DLSS is not currently included.

## 0.19 camera and bake refinement

Thin-lens depth of field is implemented for compute path-traced still images with persisted focus/F-stop and saved-camera controls. Raster DOF, physical lens units, aperture shapes, live accumulation and RTX execution remain open. Progressive map snapshots and 16/64-sample primary AA with up to 512 secondary rays are implemented; primary projection remains CPU, maps RGBA8 and resolution capped at 2048. Production tiling/float maps, cage/skew painting and cleanup brushes remain required.
