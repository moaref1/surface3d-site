# Surface3D 0.19 artist guide

This standalone Windows update retains the dark/teal workspaces and all 0.18 tools. The brush and mask controls, node contracts, final normal and progressive bake feedback are the focus. The full production texturing/rendering suite remains in development.

## Paint, layers and masks

Select the material or mask thumbnail on the owning layer. A mask context highlights its layer in violet; material uses teal. Select an effect row to edit that effect. The Layers header states the current owner and target.

**View / Blend / Opacity** stay together above the stack. With a layer selected, Material changes all channel opacities together; a channel view changes only that channel. With an effect selected, Blend and Opacity change that effect only. Filters that do not use a blend operation disable Blend. A root mask/folder has no independent blend operation in this build, so these fields are disabled until an effect is selected. Opacity edits are typed or dragged and remain undoable. Material and mask effects retain their own stacks; the top item is composited last.

The brush toolbar has **Size, Flow and Opacity**. Brush Opacity caps coverage during one gesture; Flow accumulates per dab. A new gesture can add further coverage. Layer/effect opacity controls the completed result. These three meanings remain separate and labeled. Brush tip options provide Hardness, Roundness and Angle, plus pen-size/pen-flow controls. UV tips can be elliptical; connected 3D footprints remain circular.

Material paint supports Base color, Roughness, Metallic, Normal, Height, AO, Emission and Surface opacity. Each has independent coverage and erasing. Normal is a signed tangent-space direction; Height is -1..1; Roughness/Metallic/AO/Opacity use 0..1. Emission permits HDR values. Mask paint uses one 0..1 value. A Paint node uses the same opacity/flow/tip controls, authored marks and replay engine for scalar, color, vector or normal images.

**Photoshop brush keys** are enabled by default in Paint: B paint, E erase, brackets size, Shift-brackets hardness, number keys stroke opacity, Shift-number flow, X foreground/background or mask-value swap, D black/white, Caps Lock precise cursor. Two digits entered quickly give an exact percentage; 0 means 100%. Disable this profile in Brush tip to retain old 1/2 tools. These keys do not operate while typing or while the Graph/Bake/Rendering workspace owns input. Alt camera navigation and Alt-click UV clone-source selection are retained.

Spacing now carries distance between input events and interpolates pressure rather than restarting at every frame. Windows pen pressure is read through the native pointer API. Pen hardware still needs artist verification; dab spacing uses the chosen base spacing and does not yet adapt to pressure-reduced tip size. Alpha-image tips, stencil projection, Shift-click straight strokes and Photoshop-wide brush parity remain open.

## Node correctness and parameters

All 114 stable registered kinds have an [input/output contract audit](Node-input-output-audit-0.19.md) and default-path GPU execution check. This does not certify every operation/parameter combination or provide all Blender/Designer node types.

New Gamma, Invert, Clamp, Contrast, Levels and Posterize nodes process color/vector channels separately. Legacy saved nodes retain grayscale behavior; their Data handling option is editable. Alpha is preserved through these adjustments and Blend. Blend infers its data type from the connected background or foreground and normalizes normal results. Layer normal no longer includes the unrelated height component.

Height to Normal has **Height** and optional **Base normal** inputs. Normal Blend labels Base normal / Detail normal and new nodes use reoriented detail blending. Normal Map expects encoded RGB and produces signed tangent-space normals. Custom HLSL retains declared typed ports and validation. Math/Vector Math mark unused sockets for the selected operation; stored connections are retained for later operation changes. Connected defaults are disabled. Vector Math Scale and refraction Eta have accurate names and appear for the operations that use them. Texture-input creation follows the resolved socket type, including color, vector and normal inputs.

Paint-node UV dabs now dispatch clipped rectangles, including disjoint wrapped regions. Geometry footprints retain the full-atlas fallback. Unchanged-input spatial caching, selected-node arrangement, reroutes, connection search/cutting, node preview/export, Offset/Clone and explicit reusable Texture Output publication from 0.18 are retained. Custom shader compilation may still be slow after source changes; the package includes warmed bytecode for its exact built-in shaders.

## Normal + Height

The mesh viewport, Normal inspection, GPU path-rendered images and normal texture export combine tangent normal with the height-derived normal using reoriented normal mapping. The shared height gradient uses central UV differences and strength 0.025. Export encodes the combined direction; DirectX/OpenGL Y convention is applied at output. The authored Height channel remains available separately. Height to Normal is a separate procedural operation with its own Strength, so do not apply the same height twice unintentionally.

## Baking feedback and quality

The small checkmark beside each map enables it. Clicking the map name previews it without changing enablement. Alt-click a checkmark isolates that map; drag through checkmarks to sweep. Map names remain draggable into Graph.

Selected map pixels appear on the mesh and in 2D as completed rows/batches become available. The preview is provisional while baking. A thread-safe preview mailbox is bounded to ten 256-pixel maps (2.5 MiB), throttled at the UI and never publishes partial document assets. Completed maps are applied atomically and stay in the library. Cancellation, changed inputs and active texture-set ownership preserve previous published maps.

Draft / Balanced / Fine / Ultra select 1 / 4 / 16 / 64 primary samples per texel and 16 / 64 / 256 / 512 secondary rays respectively. These are sampling presets, not a cage repair system. Run Projection check, fit distances, inspect Ray coverage and cage alignment before choosing expensive quality. CPU projects primary hits; a supported D3D11 compute device accelerates secondary AO/bent/thickness/curvature work. GPU packets are bounded to 8192 samples with a secondary-ray work budget; CPU fallback remains available. Increased samples cost proportionally more work.

GPU readback uses a reusable high-resolution waitable timer after a short yielding poll. The named 256-square/64-AA/four-secondary-ray plane measured accelerated total 16.8 seconds before and 0.82 seconds after this change on the tested NVIDIA adapter. The CPU took about 0.43 seconds after, so this small fixture still favors CPU. These measurements address a scheduling bottleneck, not universal GPU performance. Packaged verification contains both reports and their scope.

Ten existing maps remain available, with high-to-low / low-to-low, name matching, imported cage, averaged projection normals, distance fitting, coverage checks, original curvature logic, manifold scalar seam repair and island-aware padding. Baking is still limited to 2048 and RGBA8 map assets. Production 4K/8K tiling, float bake maps, GPU primary projection, cage/skew painting and repair brushes remain planned. A cube result is not proof of every hard, mirrored, subpixel or imported cage case.

## Rendering and cameras

Rendering stays separate from Paint. **Path tracing (compute)** produces actual GI/shadow/reflection still images with the original BVH/GGX/MIS engine. Raster remains the interactive viewport. Perspective/FOV, framing and saved cameras remain available; thin-lens Depth of field, Focus distance and F-stop now work in sampled images and persist with cameras. Distances use the normalized scene, not calibrated meters.

The DXR label reports the selected adapter capability only. This build does not execute DXR/RTX hardware tracing, DLSS, hybrid realtime GI or denoising. These remain explicit backend work in the master plan. WARP can execute the compute image renderer as a software fallback; it is not an independent optimized CPU tracer.

## Artist checks still needed

Use your tablet; try low-pressure strokes, long/slow strokes, pen lifts and UV seams. Check mask-effect Blend/Opacity ownership and typed values against your Painter workflow. Compare Normal inspection and exported normal in Blender/Unreal. Test your low/high FBX and actual cage at Fine/Ultra, cancel during baking and switch texture sets. Compare saved cameras/DOF with expected focus. Hardware evidence is limited to the tested NVIDIA adapter and WARP; AMD/Intel and tablet devices remain unverified.

## Public references

Stroke opacity/flow and keys follow the public [Photoshop painting guide](https://helpx.adobe.com/photoshop/using/painting-tools.html). Optional base-normal input follows the public [Blender Bump interface](https://docs.blender.org/manual/en/4.2/render/shader_nodes/vector/bump.html). Paint/graph workflow ideas were reviewed in [Material Maker's paint documentation](https://rodzill4.github.io/material-maker/doc/user_interface_paint_panel.html). Hardware capability uses [Microsoft D3D12 Options5](https://learn.microsoft.com/en-us/windows/win32/api/d3d12/ns-d3d12-d3d12_feature_data_d3d12_options5). Baking and render controls were compared with public [Marmoset map documentation](https://docs.marmoset.co/docs/map-types/) and [render documentation](https://docs.marmoset.co/docs/render-object/). Original Surface3D code is used; no proprietary implementation or Blender runtime is included.
