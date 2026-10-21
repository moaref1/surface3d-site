# Surface3D 0.12: Paint first, Graph when needed

The reference was the supplied Painter screenshot and sampled sections of the two supplied Painter videos. This pass addressed the artist's ordinary fill/mask workflow. It is an original implementation using the Surface3D document and GPU graph evaluator; it does not copy Painter internals.

1. Open a UV-mapped prop, choose **Paint**, and add a **Fill layer**. The layer starts without a mask.
2. Select **Material** and a channel in **Properties**. Edit its **Uniform value** directly. For Roughness and Metallic, values stay in the 0–1 range. Color controls convert between displayed sRGB and stored linear RGB.
3. Drop an image from **Assets** onto the channel slot, or click **Add a resource** to choose an imported image or procedural source. Remove the assigned resource to restore the channel's saved value. Projection, image tiling and sampler settings live in the same panel. A channel requires no Value/Texture mode switch.
4. Add a mask only if needed. The layer highlights mask editing; the material and mask use distinct Properties. Mask fill sources, generators, effects and folder mask sources can be selected and edited here. Double-clicking the mask previews it and returns to the prior view on the next double-click.
5. For a weathering simulation, add **Rain film** or **Dirt transport** from the mask/effect controls. Choose **Painted areas**, **Ground contact**, **Paint + ground**, or **Whole mesh**. Set duration, flow, deposition and related controls; use the Source/Result tiles to inspect progress. **Paint source** enters explicit source-painting mode. The simulation remains a node in the background; **Graph** reveals its editable connections.
6. Choose **Graph** for a custom network. The selected layer, mask or effect opens there. Drag a resource onto the canvas or a socket, use **Shift+A** over the graph to search nodes, and click **Paint** to return. Channel and mask choices persist across workspaces. Graph source settings are also shown in Paint where they feed the selected channel.
7. Save an `.s3d` project and use the separate **Bake** and **Export** workspaces as before.

## What was checked

The native Paint fixture opens a plain project without node panels, changes a roughness fallback, drops and removes a texture, undoes/redoes, opens Graph to replace the source, returns to Paint, runs a whole-mesh Rain film simulation and preserves a folder mask. Core/GPU checks cover schema 13, replacement identity and simulated output. The full 33-check suite passed on the development build; see `Verification-0.12.md` for packaged checks.

## Current limits

This is one authored UV0 atlas, with bounded layer/node/image budgets described in the README. Rain/Dirt use a 128×128 surface-film approximation and fixed simulation steps; they are not physically complete fluid or erosion solvers. The viewport and graph render on D3D11. Geometric baking still uses CPU projection with optional GPU secondary maps. Export remains synchronous PNG8. The supplied videos and screenshot were workflow references; exact Painter feature and result parity is not claimed.
