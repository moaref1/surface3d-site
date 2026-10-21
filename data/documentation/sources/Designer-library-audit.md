# Designer library reference and Surface3D coverage gate

Read the full [official library index](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/node-library), updated May 6, 2026, and the linked atomic-node, subgraph, Tile Sampler, Flood Fill Mapper, Shape Splatter, Material Adjustment Blend, Input, Output, FX-Map and Pixel Processor references. The index has 348 linked entries across 20 categories. These match the user's pasted list. Reading the index is complete; reading and verifying every individual node's full specification is still open.

The [machine-readable checklist](Designer-node-index.json) preserves every requested name. Each row remains open until its detailed reference, implementation and acceptance checks are completed. Similar names and simplified operators cannot establish parity. Surface3D uses original implementations; this is functional coverage, not Adobe binary, SBS/SBSAR or proprietary asset compatibility.

| Category | Entries |
| --- | ---: |
| Noises | 89 |
| Patterns | 48 |
| Adjustments | 29 |
| Blending | 9 |
| Blurs | 5 |
| Channels | 6 |
| Effects | 43 |
| Normal Map | 13 |
| Tiling | 2 |
| Transforms | 17 |
| Material: 1-Click | 1 |
| Material: Effects | 5 |
| Material: Transforms | 1 |
| Material: Blending | 5 |
| PBR Utilities | 8 |
| Scan Processing | 14 |
| Mask Generators | 24 |
| Weathering | 7 |
| Mesh Utilities | 5 |
| HDRI Tools | 17 |
| **Total** | **348** |

## Corrections to the implementation plan

1. Audit the [atomic-node list](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/atomic-nodes) separately. The requested library index contains compound graph instances, not every engine primitive. The index also warns that its documentation does not cover all MDL categories. Texturing-focused functionality is the present requirement; undisclosed categories cannot be assumed complete.
2. Verify reusable subgraphs before claiming compound-node coverage. 0.23 adds typed image/value ports, stable output identities, nested function references, propagation of source edits, instance parameter overrides, cycle/budget rejection and portable dependency closure. Source editing currently previews defaults; instance-connected input preview and nested exposed-parameter forwarding remain open. [Graph instances](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/graph-instances-sub-graphs)
3. Complete port architecture. 0.23 authoring has up to 32 typed named inputs/results and compiles these to eight-input, one-float4 atomic instructions. Multiple stable function outputs are implemented; structured material/splatter-data bundles remain open. Do not flatten structured data into an ambiguous Color socket.
4. Complete distribution controls. Existing Tile Sampler only has one pattern input; the reference includes multiple patterns and maps driving size, rotation, placement, tint, hiding and distribution. Map influence, defaults and inactive controls need clear artist UI. [Tile Sampler](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/texture-generators/patterns/tile-sampler)
5. Complete per-island mapping. The new mapper foundation uses separate island index/center/bounding-size fields and one pattern. Remaining coverage includes multiple patterns, map-driven scale/rotation/luminance, distribution, fit modes, normal-vector compensation and background behavior. [Flood Fill Mapper](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/effects/flood-fill-mapper)
6. Implement persistent shared placement data for Shape Splatter and its companion nodes. Reusing a random seed in several independent tile samplers does not replace the data pipeline needed to align height, normals, roughness and color. [Shape Splatter](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/texture-generators/patterns/shape-splatter)
7. Complete image-processing and normal contracts: alpha-aware dense filters, input type preservation, signed normal vectors versus encoded RGB, normal rotation after image transforms, height units, repeat/clamp boundaries and reliable full-resolution analysis. A bounded normal integration prototype is not Normal to Height HQ.
8. Multi-channel material operators now expose eight typed named channel ports and lower into existing atomics. Blend, Switch, Height Blend, Transform, Crop, Color Blend, Adjustment and generic PBR conversion have original regression-tested implementations. A structured single material socket, full Multi-Material Blend and complete reference parity remain open.
9. Treat scan processing, ray-traced graph effects, volumetric texture tools and HDRI authoring as real systems with separate acceptance work. A Height AO approximation is not mesh RTAO, and a viewport render mode is not an RT Irradiance texture node.
10. Track every named noise/pattern and mesh-generator family. Original approximate noise modes and the existing 50 ready effects provide building blocks, but do not reproduce the full reference's variants or their controls.

## Acceptance required for every row

- Read its detailed public reference; record inputs, outputs, required data and meaning of every control.
- Identify the original Surface3D implementation or consolidated mode. Record gaps precisely.
- Verify disconnected defaults, automatic conversion, alpha, normal conventions and repeat/clamp behavior.
- Compare spatially varying results against independent mathematical/image references where available.
- Test save/load, duplication, undo, cache invalidation, graph preview and texture publication.
- Provide useful artist controls in Paint and complete editing in Graph; show only relevant controls with typed values and reset.
- Measure representative interactive and full-resolution workloads. Bound temporary memory and expose progress/cancel for expensive analysis.

## 400-asset library gate

**Closed.** Finish the requested node families and reusable graph behavior first. Then author 100 maps/patterns, 100 generators, 100 smart masks and 100 filters. Each asset must have an editable source graph, meaningful differences, neutral defaults, useful exposed controls, required-map metadata and a clear category. Do not pad this count with seed-only variations or substitute presets for missing operators.

## Current 0.22 implementation batch

Crop, Sharpen, Auto Levels, Channel Mixer, Color to Mask, Replace Color, Histogram Shift, Alpha, Radial Blur, Advanced Warp, Flood Fill Mapper foundation, Normal to Height foundation, Height AO, Reaction Diffusion, Shape Style, Emboss, Pattern, Noise Pattern, Combine RGBA, Multi Switch and Mask Region are added as original operators. This batch is not full Designer coverage.

Sharpen, full-image bounds, bounded normal integration, Gray-Scott simulation and distance-based shape styles currently use cached CPU analysis; their results are uploaded to GPU graph fields. Other new operators evaluate in the D3D11 compute graph. High-resolution CPU analysis remains synchronous, so optimization/worker progress is open. No new realtime-performance claim is made.

The gaps recorded above describe the 0.22 batch. The subsequent 0.23 foundation implements nested editable shared functions, multiple named outputs, Sample Texture and live graph-backed project textures. The latest batch adds 32 original Designer-style operators, nine material/PBR operators and Split RGBA; see [current development results](Latest-development-results.md) for names and scoped evidence. The inventory now maps these implementations but keeps the reference rows open. Structured material/placement bundles, full sampler/mapper map controls, specialized scan processing, graph ray tracing and complete named recipe families remain open. Every detailed coverage row still needs its own acceptance review. The 400 new assets have not been created.
