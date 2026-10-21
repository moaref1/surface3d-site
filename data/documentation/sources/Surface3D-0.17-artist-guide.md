# Surface3D 0.17 artist guide

Open `Surface3D.exe` from the 0.17 package. Keep its companion folders and runtime DLLs beside it. Earlier sealed packages remain separate. Open older projects and save a new copy; older executables cannot read the new schema 18 save.

## Layers and channels

The Layers header has three adjacent controls: **View / Blend / Opacity**. Material changes every material channel; Base color, Roughness and other channel views change only that channel. Changing roughness opacity preserves color, metal and every other effective opacity. Double-click or Ctrl-click the number to type a percentage. Mixed means channels have different values; editing Material gives all channels the chosen value.

Channels in Properties are highlighted buttons. Click another enabled channel to edit it; click the current channel to toggle it. Alt-click isolates that channel. Hold the mouse on a toggle and sweep across other buttons to enable or disable them together. The whole sweep is one undo action.

Paint, Graph and Bake remain separate workspaces. New fills have no mask; material and mask ownership remain explicit.

## Assets and Graph

Small import, grid/list and magnifier icons are at the top of Assets. Hold Ctrl and scroll over Assets to resize tiles. Captions use one compact line; hover shows the full name. Texture, generator and decal browsing supports list/grid.

Drag a baked map into Graph: it becomes a Mesh map node bound to that semantic bake output, so later bakes remain connected. Drag a ready generator: it creates a grouped, editable subgraph without replacing the current output. Dropping onto a compatible input connects it through the usual type conversion rules. Single click does not apply an asset.

## Baking, cages and seams

Keep the low mesh, high sources and cage in the same imported coordinate frame. Use Projection > Fit distances, then Check projection to inspect coverage before a final bake. Imported cages still require matching low topology/corner identity. The supplied Fitted-cube example uses the original requested low/high cube and fitted distances.

Curvature now samples a neighborhood in 3D rather than neighboring UV pixels. Set radius for the scale of the feature, Strength for contrast, and Quality for 4/8/16/32/64 directional samples. The default is convex white, flat gray, concave black. Invert changes this convention; it does not fix a bad cage.

AO/bent-normal and thickness quality can use up to 512 rays. Higher counts take longer; GPU work is split into smaller batches. Connected UV seams repairs matching manifold scalar-map edges. Smooth AO is corrected only across compatible normals; curvature uses matching geometry. It does not merge unrelated groups or blur normal/ID/height maps. Padding fills gutters and never fills authored projection misses. Bake maps publish automatically into the library. Alt-click a map isolates it; held-mouse sweeps change a selection together.

## Decals

Choose the Decals category in Assets. Drag an imported image, Sticker or Leak onto the 3D object. It creates a fill at the actual hit position and faces the surface, including a hit on another visible texture set. It adds no white mask. Move, resize, rotate, set depth and opacity directly in Paint Properties > Projection. Edge fade and Facing limit are under Projection edges. XYZ links/locks and typed values use the existing controls.

Drag the same source into Graph for an editable Decal node. It can output color with alpha coverage or an alpha mask. The owning fill may use constant/procedural roughness or other maps; its coverage follows the connected color projector. Full projected normal-map orientation, separate multi-channel decal texture packs, gizmos, stencils and editable text are still open.

## Rendering

Rendering > Scene holds cameras, lights, HDRI and stage settings. **Output > Image renderer** offers Raster or Ray tracing. Rays calculate secondary shadows, reflections and diffuse indirect light. Increase Samples to reduce noise; Bounces controls surface path depth. Ray quality contains Surface offset and optional Direct/Indirect clamps; zero preserves full radiance.

Render image runs against an immutable snapshot on a separate context. Cancel leaves an existing output unchanged. A completed ray image appears in the viewport; the cube icon restores the live scene and camera navigation. The image icon returns to the last completed result. Changing the scene does not silently update that saved result.

PNG/JPEG/TIFF use the selected display transform for beauty/color/emission. EXR/HDR preserve scene-linear pixels; data passes remain data. The tracer shares evaluated material maps across sets rather than duplicating them in a uniform-resolution array. It uses Direct3D 11 compute. **RT-core/DXR acceleration, DLSS, denoising, hybrid mode and interactive ray accumulation are not implemented.** WARP runs the same compute path on a CPU fallback and can be much slower.

## Artist checks still to try

- Your real cage, mirrored/hard UV seams and desired export preset in Blender/Unreal.
- Contextual opacity and blend in the channels you actually use.
- Alt isolation/sweep, Ctrl-wheel thumbnail sizing and the editable grouped generator drop.
- Decal placement on different objects/material sets, size/depth/facing and final texture export.
- A metal/dielectric prop under your HDRI; ray noise/quality, output color and memory at your target resolution.

Automated numerical/native checks support this build; they do not replace artist acceptance or certify full Painter/Toolbag parity.
