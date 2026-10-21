# Surface3D 0.20 layering guide

## Channel, Blend, Opacity
Select a layer's material thumbnail. The three adjacent controls select the displayed channel, its blend and its compositing strength. Material changes every channel's opacity together. Roughness changes only Roughness; Base color changes only Base color. Different settings show Mixed. Surface opacity is texture data, distinct from layer opacity.

Right-click Blend to copy/paste all or the inspected channel's settings, or reset it. Right-click opacity to reset. Ctrl-click/double-click numeric values to type; existing Shift precision/Ctrl snapping behavior remains.

Normals offer RNM, Replace normal, Whiteout, UDN, Pass Through and Disable. Color Overlay is not a tangent-normal operation. Height offers signed Add/Subtract, minimum/maximum, replacement, Pass Through and Disable. Final Height-to-normal conversion still occurs at the surface boundary; Height exports separately.

## Adjustment workflow without Graph
Choose the inspected channel, then the effects icon and Levels adjustment above. An identity Levels layer is inserted above the selection in the same folder, with Pass Through and no mask. Select its Levels effect to edit parameters. Select its layer thumbnail to adjust channel opacity. Zero opacity, an identity effect or a black mask preserves the input beneath it.

Pass Through ignores the fill source for that channel and processes Stack below through the material effects. Other channels can still use the fill source. Scalar Levels does not process tangent normals; use a typed normal graph operation. Color, Roughness, Metallic, Height, AO, Emission and Surface opacity are supported by Levels/Invert/Blur.

## Folder workflow
Click a folder header to inspect its material blend/opacity. Pass Through evaluates children against surrounding input, then fades the completed change once. Normal/Multiply/etc isolate that channel's internal composition before blending the group. Partial child coverage is preserved. Add/select a folder mask through its existing context menu and thumbnail.

A root mask's compact header shows Density instead of layer opacity: 100% keeps the mask; 0% reveals the owner. Every entry inside a layer mask has its own blend mode and opacity, including Fill, Paint, Graph, Levels, Invert and Blur. Select the entry, then change Blend and Opacity in the header; the owner layer and other entries are unchanged. Hover an entry to see its current settings. The completed root mask remains a coverage mask, with Density rather than a color blend. Layer, mask and effect selection remain distinct; double-click the mask thumbnail to preview/back.

## Compatibility and limits
Save a new copy of older projects. Default normal composition now uses RNM even without a baked normal. Folder masks now mask the completed group once; older multi-child group appearance can consequently differ from 0.19's per-child masking. New projects use schema 22 and cannot be opened by 0.19.

Eight layers per set, one level of folders and the existing resolution/resource limits remain. Nested folders, folder material effects, multiple selected layers, typed anchor stages and correct Pass Through anchor consumption are still pending. Avoid publishing an anchor from a Pass Through adjustment until that dependency path is implemented; use an explicit texture output for reuse instead. This is a development layering foundation, not a claim of full Painter parity. Generator and all-node checks pass on the recorded test path; packaged release validation remains open. Built-in node edits reuse one shared shader, while custom HLSL still compiles separately.
