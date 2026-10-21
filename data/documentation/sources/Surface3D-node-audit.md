# Surface3D node audit

**October 12, 2026 · source/build baseline: Surface3D 0.30 refinement**

This document answers four questions: which nodes should expose multiple outputs, which nodes can be consolidated, which implementations overlap or duplicate each other, and which Designer capabilities remain absent or incomplete. It is an audit and recommendation; the existing Separate XYZ remains loadable while new graphs use Split XYZ outputs.

The source registry contains **224 NodeKind entries**, including the internal GPU-only `BatchField` and terminal/interface nodes. That is not 224 distinct algorithms or proof of Designer parity. The supplied Designer checklist has **348 library entries**. Atomic nodes are a separate checklist. Many Designer library entries are reusable graphs or variations, so comparing counts alone is misleading. [Adobe library overview](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/node-library), [atomic nodes](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/atomic-nodes)

The older local coverage reports predate the 0.28 additions. Their pending counts should not be presented as today's missing-node count. The appendix below retains all 348 requested names and updates the obvious mappings from current source; **operator presence never means full reference verification**. Detailed controls and output equivalence have not been exhaustively checked for every Adobe entry.

## 1. Multiple outputs instead of mutually exclusive states

Use outputs for **different results of one analysis**. Keep modes for **different algorithms, sampling rules or processing choices**. For example, an island's ID and center should be usable together; Gaussian versus box blur should remain a kernel choice. A node can have both: an algorithm selector and several named outputs.

### Already implemented — preserve these

| Node family | Current outputs | Observation |
|---|---|---|
| Graph Function | User-defined named, typed results with stable identities | Already supports multiple outputs and nested reusable graphs. Improve usage and compilation rather than adding a second function system. |
| Split RGBA | Red, Green, Blue, Alpha | Already replaces four independent channel-selector nodes. |
| Split XYZ | X, Y, Z | Added as a typed vector input with stable named scalar outputs; legacy Separate nodes remain loadable. |
| Curvature | Curvature, Convexity, Concavity | Already lowers to one packed analysis field plus component selectors. Good pattern for other shared analyses. Smooth/Sobel remains a method selector. |
| PBR Convert | Diffuse, Specular, Glossiness, Roughness | Already exposes four outputs. This is an original conversion, not full shader interchange. |
| Base Material, Material Blend/Switch/Height Blend/Transform/Crop/Color Blend/Adjustment | Eight named material channels | Present. Outputs are individual typed ports, not a structured material bundle. |
| Multi-Material Blend, Season, Snow Cover, Water Level, Make Material | Base Color, Roughness, Metallic, Normal, Height, AO, Emissive, Opacity | Present in 0.28. Make Material estimates maps; it cannot recover physically measured material properties from one photograph. |

Evidence: `src/core/graph_functions.cpp:11`, `src/core/designer_nodes.cpp:596`, `src/core/material_nodes.cpp:228`.

### Proposed output conversions, in priority order

| Priority | Current node/state | Proposed simultaneous outputs | Sharing and remaining work |
|---|---|---|---|
| P0 | **Flood Fill**: random gray, random color, index, center, bounds, gradient selected by mode | **Index** (Integer), **Center** (Vector), **Bounds** (Vector), **Random Value** (Value), **Random Color** (Color), **Gradient** (Value), optional Coverage | Cache one component labeling result and per-island metadata. Seed and gradient angle should only regenerate derived results, not relabel the source. Bounds/center need additional metadata; avoid allocating those arrays when no spatial output is requested. |
| P0 | **Image Texture Color / Value**, Decal color/value selection | **Color**, **Alpha**, **Value**; optional explicit **Normal** interpretation | One image resource and one sampling operation where encoding permits it. Value policy must be clear: a selected channel or luminance. Color-space conversion applies to color, not arbitrary packed data or alpha. Normal decoding is an interpretation, not a free RGB-to-normal cast. |
| P0 | **Separate XYZ** component selector | **X, Y, Z** | Implemented as Split XYZ with stable named output IDs. The old component-mode node remains readable and is hidden only from graph creation search. |
| P0 | **Voronoi 3D / Fractal**, currently F1, F2−F1 or random cell result | **F1**, **F2**, **F2−F1**, **Cell ID / Random**, optional Feature Position | Share the feature-point search. Current F2−F1 is a distance difference, not the exact geometric distance to a cell border; label it accurately. Feature-position/true-border output needs real implementation. 2D Voronoi currently has a simpler result, so migration must retain its behavior. |
| P1 | **Shape Splatter Data Extract**: ID, random, local U, local V, coverage selector | **Instance ID**, **Random Value**, **Local UV**, **Coverage**, **Rotation** | All derive from existing packed data. Rotation is recoverable from the fractional part of the current Z encoding; preserve that convention during migration. Exposing separate outputs does not repair the limitations of the placement data itself. |
| P1 | **Distance Field**: inside, outside, signed selector | **Inside**, **Outside**, **Signed** | Share thresholding and needed distance transforms. Signed requires both transforms. An inside-only consumer should not pay for outside distance. Retain the current normalized/clamped-distance behavior unless physical pixel distance is a separately named output. |
| P1 | **Mesh Map**: one of ten baked maps | Named map outputs, or a collapsible **Mesh Maps** bundle with typed breakout | Reuse existing baked-map resources. Do not bake or upload every map just because this node exists. Missing maps remain clearly unavailable. This is resource access, not one shared computation generating all maps. |
| P1 | **Layer inputs / Anchor Color / Anchor Value** | Stable named material channels plus **Mask** | Make one Layer/Anchor source understandable without deleting the simpler existing entries. Reuse the same live publication. Distinguish raw layer, evaluated material and mask ownership; retain cycle/order checks. Height and signed normals need their own types. |
| P1 | **PBR Validate / HDR Range**: heatmap or invalid-mask state | **Preview/Heatmap** (Color), **Invalid** (Value), optionally low/high masks | Share range tests. Using a mask elsewhere should not switch the diagnostic preview's output type and break existing links. |
| P1 | **Coordinates / Fill Coordinates** | **Coordinates** plus optional **Position / Normal / UV** accessors, where semantics are defined | Preserve the artist's one coordinate controller. Different projections remain modes. Triplanar sampling needs blend weights and normal-aware axis sampling; one float3 is not a universal replacement for that data. Fill Coordinates must continue editing the fill layer's authoritative mapping. |
| P1 | **Color Equalizer / Lighting Cancellation** | **Corrected Color**, **Illumination**, optional Residual | Share the expensive low-pass analysis. A residual needs a documented signed range; current high-frequency cancellation is not an illumination/reconstruction pair. |
| P2 | **Height Frequency**: low/high/band selection | **Low**, **High**, **Band** | Reuse low-pass intermediates when the chosen band requires them. Computing every radius and branch eagerly can use more memory than the current single-output workflow. |
| P2 | **Atlas Splitter** element selector | **Element Color**, **Element Mask**, optional Bounds/Index metadata | Keep the element index as a parameter; outputting thousands of element ports is unusable. Use one atlas analysis and dynamic element selection. Current alpha-connected detection is a foundation, not a complete atlas-authoring system. |
| P2 | **Custom HLSL** | User-defined named typed outputs | Currently has editable inputs but a single `customOutput`. A shared wrapper/struct result can prevent evaluating the same code separately for each output. Restrict graph-visible outputs to supported types and diagnose compilation per node. |
| P2 | **Physics Brush** | Current accumulated mask; future Flow/Velocity/Wetness or Sediment outputs **only when the simulation stores them** | Inspect the simulation's authoritative fields first. Do not invent output labels backed by repeated copies of the same mask. A typed vector field needs units and direction conventions. |
| P2 | **Height-derived normal/occlusion toolkit** | Normal, AO, Bent Normal as related outputs when needed | These do not all come from the same cheap operation. Normal derivatives are cheap; ray-based AO/bent normal need separate expensive work. Treat connected outputs as independent demands, sharing only genuine intermediates. |

**First choice:** Flood Fill, Image Texture and Voronoi; Split XYZ is implemented. They remove repeated nodes or mode switching in common material graphs. Converting every noise recipe into dozens of always-visible outputs would make graphs harder to read and could increase work.

## 2. Nodes that can be consolidated

**A cleaner node menu can retain the current performance, but “zero cost” is not established by this audit.** Consolidate the artist-facing description/search while preserving specialized implementations. Do not turn everything into one shader that computes every algorithm. Confirm the resulting CPU/GPU timings and allocations before calling it performance-neutral.

| Proposed family | Current entries to review | Keep distinct within the family | Expected implementation approach |
|---|---|---|---|
| **Noise** | Noise, Fractal Noise, Perlin 3D, Simplex 3D, Voronoi/Voronoi 3D/Fractal, White Noise, Noise / Patterns, Specialty Noise, Dirt, Cells, BnW Spots, Fur, Fractal Sum, Directional, Grunge, Messy Fibers, Gabor, Blue Noise | Algorithm, dimension, fractal method and recipe; Blue Noise preprocessing and Gabor remain distinct evaluators | One searchable family, with entries opening the chosen algorithm/preset directly. Share scale/seed/coordinates controls; show only meaningful controls. Keep computational kernels separate and cache by semantic algorithm/version. |
| **Gradient** | Gradient, 3D Gradient, Gradient Advanced, Gradient 2 Points | Linear/reflected/radial/circular, dimensionality, two-point endpoints | Shared UI with clear method names. A transform does not make all formulas equivalent; retain old formula versions for saved graphs. |
| **Image Texture** | Image Color, Image Value, specialized Triplanar Texture | Interpretation, sampling, coordinate source, projection | Shared image resource/control family with typed outputs. Keep triplanar's multi-axis sampling. Default coordinates can remain hidden. |
| **Coordinates** | Coordinates, Fill Coordinates, Mapping, legacy UV X/Y and position/normal components | Coordinate source vs transform vs fill-owned controller | Unify navigation/control presentation, not ownership. Fill and standalone nodes edit different authoritative locations. Legacy component nodes stay readable in old projects. |
| **Channels** | Separate XYZ, Separate Color, Split RGBA; Combine XYZ, Combine Color, Combine RGBA | Vector, color space and alpha | Two typed families: Split and Combine. RGB/HSV/HSL choices are semantic conversions, not relabeling X/Y/Z. Use alpha-default behavior compatible with old RGB-only graphs. |
| **Blend / Mix** | Color Blend, Value Blend, Color Math, Blend, Scalar Mix, Color Mix | Typed values, opacity factor, color modes, normal methods, signed height arithmetic | One contextual artist-facing entry can dispatch the correct typed implementation. Never apply Overlay/Color Burn to signed normals. Defaults/clamping/HDR/alpha contracts must survive migration. |
| **Switch** | Switch, Multi Switch, Material Switch | Two-input, N-input and material bundle dispatch | Shared UI with dynamic inputs; inactive input evaluation and type rules remain explicit. Material Switch should not lose its eight outputs. |
| **Color adjustment** | RGB to Grayscale and Grayscale; Contrast, Gamma, Levels, Remap, Map Range | Luminance conversion, four-point remap, range mapping, image levels | Merge exact grayscale overlap; group the other adjustments rather than collapsing every operation into an enormous panel. |
| **Transform** | Transform 2D, Mapping, Polar Transform, Non-Uniform Rotation, Quad Transform, Advanced Warp transform modes | Coordinate transform vs resampling image; polar and projective mappings; map-driven controls | One search family with specialized subtypes. Retain dimensions, filter/wrap, alpha and normal compensation. |
| **Warp** | legacy Warp, Vector Warp, Vector Morph, Directional Warp, Advanced Warp | Vector offsets, slope/intensity, multi-directional and nonuniform methods | Hide legacy duplicates/aliases in creation search, with load compatibility. Keep distinct algorithms selectable. Vector Morph and Vector Warp require a sampling/type comparison before merging. |
| **Normal conversion** | Height to Normal, Height to Normal World Units, Normal Sobel | World units, central/Sobel derivatives, base normal, convention | One Height to Normal interface with method and unit controls; preserve result scale. Basic and HQ Normal to Height are quality variants of a different inverse operation. |
| **Normal composition** | Normal Blend, Normalize, Invert, Transform, Vector Rotation | Composition vs unary correction | Group these under Normal; merging all of them into one stateful node adds confusion. Optional normalization in composition is useful, but standalone Normalize still has a purpose. |
| **Scatter** | Tile Pattern, Tile Sampler, Shape Splatter, Atlas Scatter | Grid, overlapping height placement, atlas pieces and their metadata | A shared family/preset browser is appropriate; a single interchangeable computation is not. Keep shared placement data separate from shading that placement. |
| **Clone** | Clone Patch, Multi Clone Patch, Paint clone brush | Single/multiple clone placements and freehand authored strokes | One clone-patch family can expose count; keep Paint as an authored tool with persistent strokes. Procedural clone placement is not brush history. |
| **Tiling** | Offset, Make Tileable, Make It Tile Photo, Make It Tile Patch, Smart Auto Tile | Offset, seam repair, edge correction, patch distribution, coordinated material tiling | Group workflows, do not declare them equivalent. Smart Auto Tile currently duplicates Patch but needs its own genuine multi-map behavior. |
| **Material operations** | Base Material, Make Material, material blends/adjustments/transforms | Authored material vs inferred material, simple/multi/height masks, per-channel controls | A shared material bundle and reusable control components reduce wiring. Distinct artist tasks should remain recognizable. |

### Performance requirements for any consolidation

1. Choose the algorithm at graph compilation/preparation time. Avoid a huge per-pixel branch tree or eager calculation of unrelated algorithms.
2. Derive **used-output masks** from consumers and explicit preview demands. Keep output IDs stable and ports typed; a mode change must not silently reinterpret existing edges.
3. Reuse analysis by source revision, threshold, edge connectivity, dimensions and algorithm. Seed/color/gradient adjustments should not invalidate component labeling unnecessarily.
4. Reuse one image/field across layer, anchor, graph and live output consumers. Cosmetic names, position, collapse and selection must not trigger computation.
5. Do not read back to CPU and re-upload merely to extract a channel already resident on GPU. Use selectors/views or a cheap GPU extraction.
6. Pack related cheap outputs when useful; material channels and many image outputs cannot all fit into one float4. Allocate extra fields only on demand.
7. Preserve current preview resolution policy and background processing. Changing sockets is not itself a solution for synchronous CPU analysis or full-atlas 4K memory pressure.
8. Compare one output, multiple outputs, disconnected outputs, preview changes and downstream consumers at 1K/2K/4K. Check pixels, main-thread time, GPU duration, stalls and memory. No prospective merge has those measurements yet.

Current foundations: named port identity in `graph_functions.cpp`, demand planning in `graph_evaluation.cpp`, existing packed Curvature output, semantic field caches in `renderer.cpp`. Material and function expansion still creates all declared output primitives before demand planning; expanding only required outputs could also reduce CPU graph preparation.

**Specific hotspot:** the advanced CPU noise helper calculates octave noise, a cellular-neighbor search, directional noise and a fiber expression before selecting a recipe. The shader source shares the same broad structure. The compiler may eliminate unused shader work in specialized variants, so GPU overhead must be measured; the source structure alone does not prove the GPU executes every calculation. A future unified family should avoid making this worse. Evidence: `advanced_nodes28.cpp:999` and `shaders/advanced_spatial28.hlsl`, `recipe()`.

## 3. Duplicates and overlapping implementations

### Confirmed duplicate results or unused legacy overlap

| Finding | Source evidence | Recommended action |
|---|---|---|
| **Smart Auto Tile and Make It Tile Patch** have the same defaults, exposed controls and `quilt(im)` implementation | `advanced_nodes28.cpp:339`, `:575`, `:1137` | Treat this as an implementation gap. Preserve IDs; implement true material-aware Smart Auto Tile or temporarily identify its current restricted behavior. Simply deleting one would remove a requested workflow. |
| **Fractal Sum Base and Fractal Sum 1** both return the same `f` result for the same controls | `advanced_nodes28.cpp:1057`; HLSL `OPERATOR==FRACTAL`, `mode<=1` | Preserve serialized mode IDs and legacy pixels. Mode 0 is now labeled as the legacy alias of mode 1; a distinct Base formula needs a reference definition and a versioned migration before implementation. |
| **Color Equalizer and Lighting Cancellation / Low Frequencies** execute the same correction formula with the same control values | `advanced_nodes28.cpp:1396` | Share the low-frequency implementation and clarify the UI. Keep high-frequency cancellation separate; it follows a different branch and needs reference review. |
| **RGB to Grayscale and Grayscale / Luminance** use the same luminance transform | `surface.hlsl`, case 26; `designer_cases.hlsli`, case 143/op 1 | One Grayscale entry with methods; load the older simple node as a luminance alias. Other grayscale methods remain useful. |
| **White Noise and Noise / Patterns / White Noise** share the same seeded cell-hash expression at matching coordinates/scale | `surface.hlsl`, case 20 and case 74/op 3 | One White Noise algorithm with aliases in search. Do not count its menu paths as separate noise technologies. |
| **Separate Color / Alpha and Split RGBA / Alpha** provide the same channel extraction | `material_nodes.cpp:561`, which lowers Split RGBA into Separate Color selectors | Prefer Split RGBA in new graphs; keep single-channel nodes for compatibility or compact search shortcuts. This is deliberate convenience overlap, not a duplicated expensive image process. |
| **Legacy UV X/Y, Position X/Y/Z and Normal X/Y/Z** duplicate access obtainable with coordinate/geometry sources and split selectors | `studio.cpp:4970` hides them from creation search | Already hidden. Preserve serialized kinds and explicitly map units/ranges before any migration; do not delete enum entries. |
| **Warp** is already hidden as a legacy creation entry alongside the newer warp tools | `studio.cpp:4970`; `graph.cpp` name table | Keep old projects readable. Its detailed sampling contract must be compared before treating every Warp/Vector Warp result as identical. |

The source confirms expression/dispatch duplication above. Exhaustive pixel comparisons over arbitrary input images were not run for every duplicate pair in this audit. Duplicate labels, repeated names in a menu, exact formulas and similar-looking output are different kinds of evidence.

### Similar purpose, not proven duplicates

| Pair/family | Why it should not be deleted blindly |
|---|---|
| Noise vs Perlin vs Simplex vs Gabor | Different basis functions, dimensions, frequency spectra and parameter meaning. |
| Dirt vs Grunge vs Cells vs BnW Spots | Shared building blocks but distinct shaping/threshold recipes. Consolidate the browser, not their actual output identities. |
| Blur vs Directional vs Nonuniform vs Slope vs Radial | Different neighborhoods, masks, transport and edge behavior. A direction of zero does not make all blur methods equivalent. |
| High Pass vs Luminance Highpass vs Height Frequency | Color/alpha versus luminance/signed data and different filtering/range behavior. |
| Curvature from Normal vs Curvature | Older approximation versus the newer multi-output Smooth/Sobel analysis. Compare scale, sign, boundaries and normal conventions before migration. |
| Normal to Height vs Normal to Height HQ | Bounded basic solver versus multigrid Poisson integration; quality and world dimensions differ. |
| Vector Morph vs Vector Warp vs image Transform | Related image resampling but coordinate, filtering, conversion and normal treatment may differ. |
| Make Tileable vs Make It Tile Photo/Patch | Offset-centered seam blending, image boundary correction and patch synthesis are different workflows. |
| Season vs Snow Cover vs Water Level | Color change, orientation-dependent deposited material and positional wetting have distinct inputs/semantics. |
| Texture Output (Anchor) vs Layer Anchor vs Graph Output | Live publication/resource boundary, layer evaluation reference and function interface. They may share resources but have different ownership and cycle rules. |

## 4. Missing nodes and incomplete families

**Missing** below means no dedicated implemented node/workflow was found. Sometimes existing general nodes can construct a substitute. **Incomplete** means an operator exists but lacks the reference system's significant inputs, controls or behavior. **Unverified** means presence is confirmed but detailed reference parity was not established. These are not interchangeable.

### P0 — common AAA material-authoring foundations

| Capability | Current state | Work still required |
|---|---|---|
| Complete **Tile Sampler** | Present: four patterns, scale/rotation/color/density/position/selector maps | More pattern inputs, independent map influence, explicit sizing/axis modes, background, tile overlap/blending/order controls, displacement and filtering choices. Adobe's current reference documents six pattern inputs; Surface3D has four. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/texture-generators/patterns/tile-sampler) |
| Complete **Flood Fill Mapper** | Present: four patterns, index/center/bounds, scale/rotation/color/selector, Stretch/Contain/Cover and rotation compensation | Reference documents eight patterns. Missing breadth includes size/distribution modes, nonuniform dimensions, explicit map influence, rotation autoscale, full luminance/alpha/HSL controls and reliable tangent-normal compensation under nonuniform scaling. Shared Flood Fill metadata would remove repeated analyses. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/effects/flood-fill-mapper) |
| Complete **Shape Splatter** data system | All four family nodes present; two shapes, packed local UV/ID+rotation/coverage and companion evaluators | Reference supports up to eight patterns and background-height/slope-aware placement/conforming. Current Vector-encoded packed field is not a rich structured placement record. Need shared placement/height records, more pattern controls, overlap semantics and material-aligned consumers. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/texture-generators/patterns/shape-splatter) |
| True **Smart Auto Tile** | Node exists but currently identical to Patch | Coordinated Base Color/Normal/Height inputs and outputs, common crop/placement/seam decisions, edge-aware channel thresholds and normal-safe blending. Reference is a multi-map workflow; a one-image quilt is insufficient. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/material-filters/scan-processing/smart-auto-tile) |
| Complete **Make It Tile Photo / Patch** | Original periodic correction / quilting implemented | Photo: independent horizontal/vertical transition masks and warping. Patch: nonuniform stamp size, placement/rotation/color variation, controllable masks/background and repetition quality. Existing Offset + Make Tileable remains a useful separate editing workflow. [Photo reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/tiling/make-it-tile-photo), [Patch reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/tiling/make-it-tile-patch) |
| **Shape Mapper**, circular splatter and full distribution recipes | Flood Fill Mapper, Tile Sampler and Radial Tiling provide building blocks | Dedicated map/shape fitting and circular-placement controls, with reference fixtures. A renamed sampler is not automatically equivalent. |
| Complete **Mask Builder** and specialized wear recipes | Editable ready graphs and generator controls exist, using AO/curvature/position/normals | Full independent map influence/ranges, dual custom grunge, scatter/scratches and clear six-direction controls; specific cloth/leather/fiber-glass/paint/metal wear behavior. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/mesh-based-generators/mask-generators/mask-builder) |
| Editable **Text** and **SVG** graph sources | No dedicated Text/SVG NodeKind or editable font/vector graph-source workflow found | Text/font/layout/transform, persistent source and re-rasterization; SVG path import/editing or a clearly scoped SVG resource node. An imported bitmap decal is not editable text/vector content. [Text reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/text) |
| Full curves / gradient mapping | Float Curve is four control values; Color Ramp has two endpoint colors | Editable arbitrary control points/stops, interpolation, channel curves and dynamic gradient image mapping. Mark these as foundations rather than full Curve/Gradient Map parity. |
| Structured **Material** and **Placement** sockets | Eight individual material outputs; packed splatter Vector | Bundle schemas, typed breakout/merge and stable versioning. This is an interface foundation, not a missing artistic effect. |

### P1 — missing specialized processing and important incomplete contracts

| Family | Absent or incomplete behavior |
|---|---|
| **Pixel Processor** | No equivalent editable per-pixel function-graph system. Custom HLSL and Graph Function provide useful building blocks but do not constitute Designer's function graph/sampling system. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/pixel-processor) |
| **Value Processor** | No dedicated once-per-evaluation function domain. Current graph constants/math are interpreted in pixel evaluation; material-function authoring does not automatically implement scalar-domain optimization. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/value-processor) |
| **FX-Map** | No full programmable recursive pattern-placement graph/system. Tile Sampler and Splatter are specific distribution operators. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/atomic-nodes/fx-map) |
| **Bent Normal from height**, **RTAO graph node** | Bake engine can produce bent normals/AO from geometry, and Mesh Map can read them; that does not implement a height-driven graph ray-tracing operator. Need height rays, scale/physical dimensions, distance/spread/sampling controls and clear conventions. [Bent Normal reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/normal-map/bent-normal) |
| **RT Shadow**, **RT Irradiance**, complete Shadows filter | No dedicated graph nodes found. Viewport GI and DXR mesh baking do not provide these texture-processing outputs. |
| **Multi Crop**, **Multi Color Equalizer**, **Material Clone Patch** | No dedicated coordinated multi-map operators. Single-image Crop/Equalizer/Clone Patch and Material Crop are present. Needs shared spatial decisions and typed material outputs. |
| Complete **Atlas Splitter / Scatter** | Present original alpha-connected-element analysis/placement. Full atlas workflows, aligned material-map splitting/scattering and all documented controls remain unverified/incomplete. |
| Complete **Multi-Angle Albedo / Normal** | Present two-to-eight-capture estimators / fixed-light-layout photometric stereo foundation. Need input calibration, actual light direction controls, alignment validation, confidence/error handling and independent references. The albedo evaluator now rejects fewer than two connected captures; calibration, alignment validation and confidence/error handling remain open. |
| **Normal to Height HQ**, world-unit normal/height consistency | Added multigrid integration and world-unit controls, not absent. Cross-node physical scale, boundary handling, normalization and reference quality still require fixtures. |
| Complete **Uber Emboss** | Current Emboss is a single height-input grayscale lighting foundation. Reference has separate Color and Height inputs and colored ambient/diffuse/specular controls; these are not covered by the current single-input operator. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/effects/uber-emboss) |
| Blend gaps and discoverability | Color Burn/Dodge/Soft Light and signed add/subtract exist in the shader and accepted graph mode IDs, but the graph dropdown exposed only ten basic entries. | The graph Blend and Color Math selectors now map visible choices to their existing serialized IDs. Color/Luminosity blend, Dissolve and a dedicated Linear Burn mode remain missing. |
| Material Blend parity | Eight channels and per-channel controls exist. Complete ID-map selection and broader Diffuse/Specular/Glossiness/Specular Level channels still need work. Multi-Material Blend currently accepts three eight-channel materials, not arbitrary material counts or all reference selection behavior. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/material-filters/blending-material/material-blend) |
| **Material Mesh Data Blender**, **Mesh Data Combiner**, **Material Selector** | No dedicated equivalent operators found. Existing Mesh Map/Mask Region/material blends provide building blocks but not the full channel-aware utility workflows. [Material Mesh Data Blender](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/mesh-based-generators/utilities-mesh-based-generators/material-mesh-data-blender) |
| **Noise Upscale 1/2/3**, named specialty variants | One original Noise Upscale operator exists, without three verified reference-equivalent methods. Many named noise/pattern variants share one approximate family implementation. |
| **Non-Square Transform** / rectangular graph outputs | No complete distinct non-square texture-processing workflow found. A UV scale change is not an output-dimension/aspect-aware engine contract. |

### P2 — remaining recipe/advanced-domain gaps

- **Named noise recipes:** Creased, Fluid, Microscope View; complete Clouds/Crystal/Gaussian Spots/Waveform variants; independent large/small Galvanic, dirty/fine/rough scratch and spot recipes; **Grunge Map 001–015** are not supplied as fifteen distinct reference-like assets. Current Grunge Noise has twelve original style modes, not the entire named library.
- **Named pattern systems:** Mesh 1/2, full Weave/Brick/Polygon variants, Shape Mapper, circular Splatter and panorama shapes. Basic procedural building blocks exist for many, but dedicated reference recipes or all controls are absent/unverified.
- **Volumetric graph tools:** 3D Volume Mask, Cube 3D/GBuffers, 3D Texture Position/SDF/Surface Render/Volume Render/Offset, Cross Section, Height/Shape Extrude. Surface3D's 2D SDF, coordinate projection, imported mesh and viewport displacement are not the same volume-texture pipeline. Adobe's 3D Texture Offset operates on a 3D texture, not a normal 2D UV offset. [Reference](https://experienceleague.adobe.com/en/docs/substance-3d-designer/using/substance-graphs/nodes-reference-for-substance-graphs/node-library/filters/transforms/3d-texture-offset)
- **Weathering workflows:** Cracks, Fabric, Leather, Metal, Moss, Rock, Rust. Ready wear/dirt graphs are useful substitutes for some looks, not complete dedicated reference weathering systems.
- **HDRI graph authoring:** HDR Merge, Nadir Patch, Straighten Horizon, Physical Sun/Sky, panorama light-source shape/line/plane/sphere nodes and Exposure Preview. Imported HDRI lighting and rendering lights do not create these graph workflows. Existing exposure/temperature/panorama tools should be reused.
- **PBR Render / Render Mapping graph outputs:** not implemented as graph operators. Material preview/rendering tabs are different consumers.
- **MDL / full Designer import/runtime compatibility:** outside this audited compositing-node scope. Neither current `.s3d` files nor original algorithms establish `.sbs`/`.sbsar` compatibility. The official index itself does not document every category, so it cannot prove “all Designer nodes.”

## 5. Recommended follow-up order

1. **Freeze the current inventory and tests.** Preserve stable kinds/port IDs, old projects and defaults. This audit does not authorize deleting persisted operators.
2. **Flood Fill shared metadata + named outputs.** Highest-value reduction in repeated costly analysis; keep 0.29 background behavior.
3. **Image Texture and Separate XYZ outputs.** Common, inexpensive simplification with clear types and automatic interpretation.
4. **Fix confirmed false distinctions.** Fractal Sum mode 0 is disclosed as a pixel-compatible legacy alias; true material-aware Smart Auto Tile; Equalizer/Lighting names; graph blend-mode visibility.
5. **Voronoi / Splatter extract / validation multi-outputs.** Share genuine calculations and add demanded-output planning.
6. **Finish sampler, mapper, splatter and material contracts.** Add missing controls/ports with real behavior, not labels alone.
7. **Noise menu consolidation.** Unified search/presets, specialized kernels, versioned parameters and no algorithm-count inflation. Measure representative costly recipes first.
8. **Finish common authoring gaps.** Text/SVG, editable curves/ramps, coordinated scan processing and mask-building recipes.
9. **Add specialized missing systems selectively.** Pixel/Value/FX domains, ray-based graph effects and volume/HDRI authoring have distinct engineering scope; do not pretend a renamed existing node supplies them.

For every future change: disconnected defaults, stable types/ports, linear color/data handling, alpha, signed normals/heights, repeat/clamp/mirror, save/load/undo, live publication, preview and cache invalidation must be tested. Benchmark the graph including its downstream consumers, not only the isolated node. Avoid 400 presets until the necessary distinct behaviors and reusable graph contracts are reliable.

## 6. Source and review boundaries

Reviewed registry and UI: `src/core/graph.h`, `graph.cpp`, `node_extensions22.cpp`, `designer_nodes.cpp`, `material_nodes.cpp`, `advanced_nodes28.cpp`, `graph_functions.cpp`, `graph_evaluation.cpp`, `shape_processing.cpp`, `ready_effects.cpp`, `src/app/studio.cpp` and related graph controls.

Reviewed evaluation paths: `src/gpu/renderer.cpp`, Designer spatial preparation, `shaders/surface.hlsl`, `designer_cases.hlsli`, `advanced_spatial28.hlsl`. The current build passed the affected 11-check regression set; that run validates changed workflow behavior, **not all 348 Adobe contracts**. This audit reads dispatches/formulas/control metadata; it does not claim exhaustive image comparison against Adobe software or a measured zero-cost consolidation.

Two review passes were used: first inventory/port/implementation mapping, then cross-checking old missing labels, duplicate formulas, current UI availability and the detailed public references linked beside significant gaps. Findings still marked unverified need their own focused reference and acceptance review.

## Appendix — all 348 supplied library names

This appendix transforms the existing user-supplied checklist. **E** = existing operator/mode or original alternative, full parity unverified. **R** = partial recipe/building blocks only; dedicated workflow is not established. **M** = no dedicated matching workflow found. A row mapped to a generic operator does not assert the named Adobe recipe is reproduced. The important incomplete contracts are described above.

**Mapping summary:** E: 249, R: 43, M: 56. These are audit classifications, not a verified parity score.


### Noises

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| 3D Perlin Noise | E | Perlin3D / plain |
| 3D Perlin Noise Fractal | E | Perlin3D / fBm |
| 3D Ridged Noise Fractal | E | Perlin3D / ridged |
| 3D Simplex Noise | E | Simplex3D |
| 3D Voronoi | E | Voronoi3D |
| 3D Voronoi Fractal | E | VoronoiFractal |
| 3D Worley Noise | E | Voronoi3D / distance |
| Anisotropic Noise | E | NoiseAdvanced / anisotropic |
| Blue Noise Fast | E | BlueNoise / original progressive rank alternative |
| BnW Spots 1 | E | BnWSpots / corresponding recipe mode |
| BnW Spots 2 | E | BnWSpots / corresponding recipe mode |
| BnW Spots 3 | E | BnWSpots / corresponding recipe mode |
| Cells 1 | E | CellsNoise / corresponding recipe mode |
| Cells 2 | E | CellsNoise / corresponding recipe mode |
| Cells 3 | E | CellsNoise / corresponding recipe mode |
| Cells 4 | E | CellsNoise / corresponding recipe mode |
| Clouds 1 | E | NoisePattern / cloud-style noise |
| Clouds 2 | E | NoisePattern / cloud-style noise |
| Clouds 3 | E | NoisePattern / cloud-style noise |
| Creased | M | No dedicated matching node/workflow found |
| Crystal 1 | E | NoisePattern / cell-edge noise |
| Crystal 2 | E | NoisePattern / cell-edge noise |
| Directional Noise 1 | E | DirectionalNoise / corresponding recipe mode |
| Directional Noise 2 | E | DirectionalNoise / corresponding recipe mode |
| Directional Noise 3 | E | DirectionalNoise / corresponding recipe mode |
| Directional Noise 4 | E | DirectionalNoise / corresponding recipe mode |
| Directional Scratches | E | DirectionalNoise / corresponding recipe mode |
| Dirt 1 | E | DirtNoise / corresponding recipe mode |
| Dirt 2 | E | DirtNoise / corresponding recipe mode |
| Dirt 3 | E | DirtNoise / corresponding recipe mode |
| Dirt 4 | E | DirtNoise / corresponding recipe mode |
| Dirt 5 | E | DirtNoise / corresponding recipe mode |
| Dirt Gradient | E | DirtNoise / corresponding recipe mode |
| Fluid | M | No dedicated matching node/workflow found |
| Fractal Sum 1 | E | FractalSumNoise / mode 1; mode 0 remains a labeled legacy alias with identical pixels |
| Fractal Sum 2 | E | FractalSumNoise / mode; Base and 1 currently duplicate |
| Fractal Sum 3 | E | FractalSumNoise / mode; Base and 1 currently duplicate |
| Fractal Sum 4 | E | FractalSumNoise / mode; Base and 1 currently duplicate |
| Fractal Sum Base | E | FractalSumNoise / mode 0; preserved as a labeled legacy alias of mode 1 |
| Fur 1 | E | FurNoise / corresponding recipe mode |
| Fur 2 | E | FurNoise / corresponding recipe mode |
| Fur 3 | E | FurNoise / corresponding recipe mode |
| Gaussian Noise | E | NoisePattern / Gaussian |
| Gaussian Spots 1 | E | Pattern / Gaussian spots; distinct reference recipe unverified |
| Gaussian Spots 2 | E | Pattern / Gaussian spots; distinct reference recipe unverified |
| Grunge Concrete | E | GrungeNoise / Concrete; original approximation |
| Grunge Damas | E | GrungeNoise / Damas; original approximation |
| Grunge Galvanic Large | R | GrungeNoise / one Galvanic style; dedicated large recipe missing |
| Grunge Galvanic Small | R | GrungeNoise / one Galvanic style; dedicated small recipe missing |
| Grunge Leaks | E | GrungeNoise / Leaks; original approximation |
| Grunge Leaky Paint | E | GrungeNoise / Leaky Paint; original approximation |
| Grunge Map 001 | M | No dedicated matching node/workflow found |
| Grunge Map 002 | M | No dedicated matching node/workflow found |
| Grunge Map 003 | M | No dedicated matching node/workflow found |
| Grunge Map 004 | M | No dedicated matching node/workflow found |
| Grunge Map 005 | M | No dedicated matching node/workflow found |
| Grunge Map 006 | M | No dedicated matching node/workflow found |
| Grunge Map 007 | M | No dedicated matching node/workflow found |
| Grunge Map 008 | M | No dedicated matching node/workflow found |
| Grunge Map 009 | M | No dedicated matching node/workflow found |
| Grunge Map 010 | M | No dedicated matching node/workflow found |
| Grunge Map 011 | M | No dedicated matching node/workflow found |
| Grunge Map 012 | M | No dedicated matching node/workflow found |
| Grunge Map 013 | M | No dedicated matching node/workflow found |
| Grunge Map 014 | M | No dedicated matching node/workflow found |
| Grunge Map 015 | M | No dedicated matching node/workflow found |
| Grunge Rough Dirty | E | GrungeNoise / Rough Dirty; original approximation |
| Grunge Rust Fine | E | GrungeNoise / Rust Fine; original approximation |
| Grunge Scratches Dirty | R | GrungeNoise / one scratch style; dedicated dirty recipe missing |
| Grunge Scratches Fine | R | GrungeNoise / one scratch style; dedicated fine recipe missing |
| Grunge Scratches Rough | R | GrungeNoise / one scratch style; dedicated rough recipe missing |
| Grunge Shavings | E | GrungeNoise / Shavings; original approximation |
| Grunge Splashes Dusty | E | GrungeNoise / Splashes; original approximation |
| Grunge Spots | E | GrungeNoise / Spots; original approximation |
| Grunge Spots Dirty | R | GrungeNoise / spots; dedicated dirty recipe missing |
| Liquid | E | NoisePattern / liquid-style noise |
| Messy Fibers 1 | E | MessyFibers / corresponding recipe mode |
| Messy Fibers 2 | E | MessyFibers / corresponding recipe mode |
| Messy Fibers 3 | E | MessyFibers / corresponding recipe mode |
| Microscope View | M | No dedicated matching node/workflow found |
| Moisture Noise | E | NoisePattern / moisture-style noise |
| Perlin Noise | E | Perlin3D with planar coordinates |
| Plasma | E | NoisePattern / plasma approximation |
| Caustics | E | NoisePattern / caustic-style noise (not physical caustics) |
| Voronoi | E | Voronoi |
| Voronoi Fractal | E | VoronoiFractal with planar coordinates |
| Waveform 1 | E | Wave / related wave foundation, named reference behavior unverified |
| White Noise | E | WhiteNoise |
| White Noise Fast | E | WhiteNoise |

### Patterns

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| 3D Linear Gradient | E | Gradient3D |
| 3D Volume Mask | M | No dedicated matching node/workflow found |
| Alveolus | E | Pattern / alveolus approximation |
| Arc Pavement | E | Pattern / arc pavement approximation |
| Brick 1 | E | Brick |
| Brick 2 | E | Brick |
| Brick Generator | E | Brick |
| Checker 1 | E | Checker |
| Cube 3D | M | No dedicated matching node/workflow found |
| Cube 3D GBuffers | M | No dedicated matching node/workflow found |
| Fibers 1 | E | Pattern / fibers |
| Fibers 2 | E | Pattern / fibers |
| Gaussian 1 | E | Pattern / Gaussian spot |
| Gaussian 2 | E | Pattern / Gaussian spot |
| Gradient Axial | E | GradientAdvanced / Linear |
| Gradient Axial Reflected | E | GradientAdvanced / Reflected |
| Gradient Circular | E | GradientAdvanced / Circular |
| Gradient Linear 1 | E | GradientAdvanced / Linear foundation; exact variant unverified |
| Gradient Linear 2 | E | GradientAdvanced / Linear foundation; exact variant unverified |
| Gradient Linear 3 | E | GradientAdvanced / Linear foundation; exact variant unverified |
| Gradient Radial | E | GradientAdvanced / Radial; exact reference behavior unverified |
| Height Extrude | M | No dedicated matching node/workflow found |
| Mesh 1 | M | No dedicated matching node/workflow found |
| Mesh 2 | M | No dedicated matching node/workflow found |
| Panorama Shape | M | No dedicated matching node/workflow found |
| Polygon 1 | E | SDF / polygon foundation |
| Polygon 2 | E | SDF / polygon foundation |
| Scratches Generator | E | Scratches |
| Shape | E | SDF |
| Shape Extrude | M | No dedicated matching node/workflow found |
| Shape Mapper | R | FloodFillMapper / related island fitting, no dedicated complete Shape Mapper |
| Shape Splatter | E | ShapeSplatter / two shapes, packed placement data |
| Shape Splatter Blend | E | ShapeSplatterBlend / color, normal, grayscale |
| Shape Splatter Data Extract | E | ShapeSplatterExtract / five selectable results |
| Shape Splatter to Mask | E | ShapeSplatterMask / all, one, fraction |
| Splatter | R | TileSampler / related distribution; dedicated splatter recipe unverified |
| Splatter Circular | R | RadialTiling + scatter building blocks; dedicated circular splatter missing |
| Star | E | Pattern / star |
| Starburst | E | Starburst |
| Stripes | E | Pattern / stripes |
| Tile Generator | E | TileSampler / foundation |
| Tile Random | E | TileSampler / random controls |
| Tile Random 2 | E | TileSampler / random controls |
| Tile Sampler | E | TileSampler / four patterns and driving maps; incomplete detailed reference controls |
| Triangle Grid | E | Pattern / triangle grid |
| Weave 1 | E | Pattern / weave |
| Weave 2 | E | Pattern / weave |
| Weave Generator | E | Pattern / weave |

### Adjustments

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Auto Levels | E | AutoLevels |
| Channel Mixer | E | ChannelMixer |
| Chrominance Extract | E | ChrominanceExtract |
| Clamp | E | Clamp |
| Color Match | E | ColorMatch |
| Color To Mask | E | ColorMask |
| Contrast/Luminosity | E | Contrast |
| Convert To Linear | E | ColorSpace / sRGB to linear |
| Convert to sRGB | E | ColorSpace / linear to sRGB |
| Grayscale Conversion Advanced | E | GrayscaleAdvanced |
| Hald CLUT | E | HaldCLUT |
| HDR Range Viewer | E | HDRRange |
| Height Map Frequencies Mapper | E | HeightFrequency / Low pass, High pass, Band pass |
| Highpass | E | HighPass |
| Histogram Range | E | HistogramRange |
| Histogram Scan | E | HistogramScan |
| Histogram Scan Non-Uniform | E | HistogramScanNonUniform |
| Histogram Select | E | HistogramSelect |
| Histogram Shift | E | HistogramShift |
| Invert | E | Invert |
| Lighting Cancel High Frequencies | E | LightingCancel / high mode; detailed semantics need review |
| Lighting Cancel Low Frequencies | E | LightingCancel / same correction as ColorEqualizer |
| Luminance Highpass | E | LuminanceHighpass |
| Min Max | E | Math / minimum or maximum |
| Pow | E | Math / power |
| Quantize | E | Posterize |
| Replace Color | E | ReplaceColor |
| Replace Color Range | E | ReplaceColor / tolerance and softness |
| Threshold | E | Math / comparison |

### Blending

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Color (Blend Node) | R | ColorSpace + blending building blocks; dedicated color/luminance-preserving blend absent |
| Color Burn | E | Blend / persisted mode 16; graph Blend and Color Math selectors expose it |
| Color Dodge | E | Blend / persisted mode 17; graph Blend and Color Math selectors expose it |
| Difference | E | Blend / difference |
| Dissolve | M | No dedicated matching node/workflow found |
| Linear Burn | R | Math/ColorMath can construct it; no named graph choice |
| Luminosity (Blend Node) | R | ColorSpace + blending building blocks; dedicated mode absent |
| Multi Switch | E | MultiSwitch |
| Switch | E | Switch |

### Blurs

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Anisotropic Blur | E | DirectionalBlur |
| Blur HQ | E | Blur / dense Gaussian |
| Non Uniform Blur | E | NonUniformBlur |
| Radial Blur | E | RadialBlur |
| Slope Blur | E | SlopeBlur |

### Channels

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| RGBA Merge | E | RGBACombine |
| RGBA Split | E | RGBASplit / Red, Green, Blue, Alpha |
| Alpha Merge | E | Alpha / merge |
| Alpha Split | E | SeparateColor / alpha |
| Pre-Multiplied to Straight | E | Alpha / unpremultiply |
| Straight to Pre-multiplied | E | Alpha / premultiply |

### Effects

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| 3D Texture Position | M | 3D volume-texture workflow absent; surface coordinates/2D SDF are different |
| 3D Texture SDF | M | 3D volume-texture workflow absent; surface coordinates/2D SDF are different |
| 3D Texture Surface Render | M | 3D volume-texture workflow absent; surface coordinates/2D SDF are different |
| 3D Texture Volume Render | M | 3D volume-texture workflow absent; surface coordinates/2D SDF are different |
| Ambient Occlusion (HBAO) (Filter Node) | E | HeightAO |
| Ambient Occlusion (RTAO) | M | No dedicated graph effect; mesh baking/viewport rendering do not replace it |
| Bevel (Filter Node) | E | Bevel |
| Cross Section | M | No dedicated matching node/workflow found |
| Curvature (Filter Node) | E | CurvatureFilter / Curvature, Convexity, Concavity |
| Curvature Smooth | E | CurvatureFilter / Smooth method, three outputs |
| Curvature Sobel | E | CurvatureFilter / Sobel method, three outputs |
| Diffusion Color | E | Diffusion / Color |
| Diffusion Grayscale | E | Diffusion / Grayscale |
| Diffusion UV | E | Diffusion / Vector |
| Edge Detect | E | EdgeDetect |
| Emboss With Gloss | E | Emboss |
| Extend Shape | E | ShapeStyle / extend |
| Flood Fill | E | FloodFill |
| Flood Fill Mapper | E | FloodFillMapper / four patterns, fit and maps; incomplete detailed reference controls |
| Flood Fill to BBox Size | E | FloodFill / bounding size |
| Flood Fill to Gradient | E | FloodFill / gradient |
| Flood Fill to Grayscale/Color | E | FloodFill / random grayscale or color |
| Flood Fill to Index | E | FloodFill / index |
| Flood Fill to Position | E | FloodFill / center |
| Flood Fill to Random Color | E | FloodFill / random color |
| Flood Fill to Random Grayscale | E | FloodFill / random grayscale |
| FXAA | E | FXAA |
| Glow | E | Glow |
| Mosaic | E | Mosaic |
| Multi Directional Warp | E | AdvancedWarp / four-direction average |
| Non Uniform Directional Warp | E | AdvancedWarp / per-pixel intensity |
| Reaction Diffusion Fast | E | ReactionDiffusion / cached CPU Gray-Scott |
| RT Shadow | M | No dedicated graph effect; mesh baking/viewport rendering do not replace it |
| RT Irradiance | M | No dedicated graph effect; mesh baking/viewport rendering do not replace it |
| Shadows (Filter Node) | M | No dedicated matching node/workflow found |
| Shape Drop Shadow | E | ShapeStyle / drop shadow |
| Shape Glow | E | ShapeStyle / glow |
| Shape Stroke | E | ShapeStyle / stroke |
| Summed Area Table | E | SummedArea |
| Swirl | E | AdvancedWarp / radial twist |
| Uber Emboss | E | Emboss / single-height grayscale foundation; full Color+Height workflow absent |
| Vector Morph | E | VectorMorph / signed offset field resampling |
| Vector Warp | E | VectorWarp |

### Normal Map

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Facing Normal | E | FacingNormal |
| Height Normal Blender | E | HeightToNormal / connected base normal |
| Height to Normal World Units | E | HeightNormalWorld |
| Normal Blend | E | NormalBlend |
| Normal Combine | E | NormalBlend / RNM or whiteout |
| Normal Invert | E | NormalInvert |
| Normal Normalize | E | NormalNormalize |
| Normal Sobel | E | NormalSobel |
| Normal to Height | E | NormalToHeight / basic bounded Poisson integration |
| Normal To Height HQ | E | NormalToHeightHQ / multigrid Poisson; reference parity unverified |
| Normal Transform | E | NormalTransform |
| Normal Vector Rotation | E | NormalVectorRotation |
| Bent Normal | M | Height-driven graph Bent Normal absent; geometry Bake + MeshMap are available |

### Tiling

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Make It Tile Patch | E | MakeTilePatch / original quilting; incomplete controls |
| Make It Tile Photo | E | MakeTilePhoto / periodic correction; incomplete controls |

### Transforms

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| 3D Texture Offset | M | 3D volume-texture workflow absent; surface coordinates/2D SDF are different |
| Auto Crop | E | AutoCrop |
| Cartesian To Polar | E | PolarTransform / Cartesian to Polar |
| Polar to Cartesian | E | PolarTransform / Polar to Cartesian |
| Clone (Filter Node) | E | ClonePatch and Paint clone / related workflows, not full contract |
| Mirror (Filter Node) | E | AdvancedWarp / U or V mirror |
| Noise Upscale 1 | E | NoiseUpscale / one original method; three distinct reference methods unverified |
| Noise Upscale 2 | E | NoiseUpscale / one original method; three distinct reference methods unverified |
| Noise Upscale 3 | E | NoiseUpscale / one original method; three distinct reference methods unverified |
| Safe Transform | E | Transform2D |
| Non-Square Transform | M | No dedicated matching node/workflow found |
| Non-Uniform Rotation | E | NonUniformRotation |
| Skew | E | AdvancedWarp / skew |
| Symmetry | E | AdvancedWarp / mirror |
| Symmetry Slice | E | AdvancedWarp / slice |
| Trapezoid Transform | E | AdvancedWarp / trapezoid |
| Quad Transform | E | QuadTransform |

### 1-Click

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Bitmap to Material Light | E | MakeMaterial / one-image estimated eight-channel material |

### Effects (Material)

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Height Blend | E | HeightBlend / scalar blend foundation; material version also exists |
| Material Height Blend | E | MaterialHeightBlend |
| Season Filter | E | Season / material tint and roughness |
| Snow Cover | E | SnowCover / world-normal coverage and material channels |
| Water Level | E | WaterLevel / position-driven wet material |

### Transforms (Material)

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Material Transform | E | MaterialTransform |

### Blending (Material)

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Material Adjustment Blend | E | MaterialAdjustment |
| Material Blend | E | MaterialBlend |
| Material Color Blend | E | MaterialColorBlend |
| Material Switch | E | MaterialSwitch |
| Multi-Material Blend | E | MultiMaterialBlend / three eight-channel materials |

### PBR Utilities

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| BaseColor / Metallic / Roughness converter | E | PBRConvert / original diffuse-specular-gloss conversion |
| Base Material | E | BaseMaterial |
| PBR Albedo Safe Color | E | PBRAlbedoSafe |
| PBR BaseColor / Metallic Validate | E | PBRValidate |
| PBR Dielectric F0 | E | DielectricF0 |
| PBR Metal Reflectance | E | MetalReflectance |
| PBR Render | M | No dedicated matching node/workflow found |
| PBR Render Mapping | M | No dedicated matching node/workflow found |

### Scan Processing

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| AO Cancellation | E | AOCancellation |
| Atlas Scatter | E | AtlasScatter / alpha-connected pieces |
| Atlas Splitter | E | AtlasSplitter / alpha-connected element selection |
| Clone Patch | E | ClonePatch / positioned source and destination |
| Color Equalizer | E | ColorEqualizer / low-frequency correction |
| Crop | E | Crop / fit or keep canvas |
| Material Clone Patch | M | No dedicated matching node/workflow found |
| Material Crop | E | MaterialCrop |
| Multi-Angle to Albedo | E | MultiAngleAlbedo / original aligned-capture estimate |
| Multi-Angle to Normal | E | MultiAngleNormal / fixed-light-layout photometric stereo |
| Multi Clone Patch | E | MultiClonePatch / count and seeded placements |
| Multi Color Equalizer | M | No dedicated matching node/workflow found |
| Multi Crop | M | No dedicated matching node/workflow found |
| Smart Auto Tile | E | SmartAutoTile / duplicates single-image Patch; material workflow incomplete |

### Mask Generators

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Bottom To Top | R | Height gradient / Position mesh map |
| Cloth Wear | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Dirt | R | Cavity dirt / AO + noise |
| Dripping Rust | R | Rain transport + Rust pits building blocks |
| Dust | R | Settled dust / world normals + noise |
| Edge Blur | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Edge Damages | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Edge Dirt | R | Crevice wear / Cavity dirt |
| Edge Notch | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Edge Select | R | Convex / Concave edges |
| Edge Speckle | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Edge Wear | R | Convex edges / Edge chips |
| Fiber Glass Edge Wear | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Grease | R | Oily cavities / AO |
| Ground Dirt | R | Ground dirt / position + noise |
| Leaks | R | Physics rain / directional noise building blocks |
| Leather Wear | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Light | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Mask Builder | R | Editable generator graphs; complete independent-map controls not established |
| Metal Edge Wear | R | Edge chips / curvature + noise |
| Paint Wear | R | Worn coating / Coating flake wear |
| Selective Dirt | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Sun Bleach | R | MeshMap + wear/noise graph building blocks; named generator contract unverified |
| Surface Brush | R | Paint + PhysicsBrush; distinct named generator unverified |

### Weathering

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Cracks Weathering | R | Wear/noise/material graph building blocks; no complete named weathering workflow |
| Fabric Weathering | R | Wear/noise/material graph building blocks; no complete named weathering workflow |
| Leather Weathering | R | Wear/noise/material graph building blocks; no complete named weathering workflow |
| Metal Weathering | R | Wear/noise/material graph building blocks; no complete named weathering workflow |
| Moss Weathering | R | Wear/noise/material graph building blocks; no complete named weathering workflow |
| Rock Weathering | R | Wear/noise/material graph building blocks; no complete named weathering workflow |
| Rust Weathering | R | Wear/noise/material graph building blocks; no complete named weathering workflow |

### Utilities (Mesh based generators)

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| 3D Planar Projection | E | Coordinates + image node |
| Material Mesh Data Blender | M | No dedicated matching node/workflow found |
| Material Selector | M | No dedicated matching node/workflow found |
| Mesh Data Combiner | M | No dedicated matching node/workflow found |
| Tri Planar | E | Coordinates / triplanar + image node |

### HDRI Tools

| Requested entry | Coverage | Current mapping / gap |
|---|---|---|
| Blackbody | E | Blackbody |
| Color Temperature Adjustment | E | ColorTemperature |
| Exposure | E | Exposure |
| Exposure Preview | M | No dedicated matching node/workflow found |
| HDR Merge | M | No dedicated matching node/workflow found |
| Nadir Extract | E | NadirExtract |
| Panorama 3D Position | E | PanoramaDirection |
| Gradient 2 Points | E | Gradient2Points |
| Gradient Linear (HDRI) | E | GradientAdvanced |
| Line Light | M | No dedicated matching node/workflow found |
| Nadir Patch | M | No dedicated matching node/workflow found |
| Physical Sun/Sky | M | No dedicated matching node/workflow found |
| Plane Light | M | No dedicated matching node/workflow found |
| Panorama Rotation | E | PanoramaRotate |
| Shape Light | M | No dedicated matching node/workflow found |
| Sphere Light | M | No dedicated matching node/workflow found |
| Straighten Horizon | M | No dedicated matching node/workflow found |
