# Requested and implemented node catalogue

## Current 0.19 implementation

There are **114 stable node kinds**, including compatibility kinds, with **128 nodes per graph**, eight inputs and six socket data types. Older axes, Fill Coordinates and dedicated Triplanar Texture remain readable but creation uses the unified Coordinates source plus component extraction. Compatible operations are merged through modes; variants are not counted as extra kinds. Shared whole-graph definitions expose typed instance controls. Nested executable subgraphs and arbitrary multiple outputs remain pending.

The original 487-row request inventory currently records **19 category, 49 bounded 0.7, 10 bounded 0.10, 79 partial 0.7, 267 planned, 3 partial 0.10, 60 backend dependency**. These are reference rows, including overlapping concepts and presets, not algorithm counts. Scope columns distinguish bounded original counterparts from exact reference parity, which is unverified. Read [Requested-node-catalogue.csv](Requested-node-catalogue.csv).

| Status | Meaning |
| --- | --- |
| Category | Original reference heading |
| Bounded 0.7 / 0.10 | Numerical operation exists with stated limits; third-party exactness unverified |
| Partial 0.7 / 0.10 | Useful related implementation exists; requested behavior/controls/data incomplete |
| Planned | Request retained; not exposed as a working feature |
| Backend dependency | Needs scene/ray/geometry/closure/light/volume/iteration capabilities |

[Requested-generator-list.txt](Requested-generator-list.txt) retains all 373 attachment lines; the CSV adds all 114 supplied Blender-index entries. The pasted 5.2 index is preserved as supplied, not asserted to match a released Blender version. A separate complete Unreal node list was not present in the retrieved files.

Current typed ports and output defaults are recorded in [the 0.19 input/output audit](Node-input-output-audit-0.19.md). It covers every registered kind but not every operation/parameter permutation. New component-wise adjustments preserve color/vector channels and alpha; legacy grayscale behavior remains selectable. Optional Base normal, resolved Blend types, active Math/Vector Math ports and disabled connected defaults now follow their actual execution.

## Exact stable inventory

| ID | Internal kind | Artist label | Addition |
| --- | --- | --- | --- |
| 0 | Scalar | Value | Retained |
| 1 | Color | Color | Retained |
| 2 | Noise | Noise | Retained |
| 3 | PositionY | Position Y | Retained |
| 4 | Remap | Remap | Retained |
| 5 | ColorMix | Color blend | Retained |
| 6 | ScalarMix | Value blend | Retained |
| 7 | Material | Material Output | Retained |
| 8 | InputColor | Layer color | Retained |
| 9 | InputRoughness | Layer roughness | Retained |
| 10 | InputMetallic | Layer metallic | Retained |
| 11 | InputMask | Layer mask | Retained |
| 12 | NormalY | Normal Y | Retained |
| 13 | AnchorColor | Anchor color | Retained |
| 14 | AnchorValue | Anchor value | Retained |
| 15 | MaskOutput | Mask Output | Retained |
| 16 | ImageColor | Image texture (color) | Retained |
| 17 | ImageValue | Image texture (value) | Retained |
| 18 | Checker | Checker | Retained |
| 19 | Gradient | Gradient | Retained |
| 20 | WhiteNoise | White noise | Retained |
| 21 | Voronoi | Voronoi | Retained |
| 22 | FractalNoise | Fractal noise | Retained |
| 23 | Invert | Invert | Retained |
| 24 | Clamp | Clamp | Retained |
| 25 | Math | Math | Retained |
| 26 | Luminance | RGB to grayscale | Retained |
| 27 | ColorRamp | Color ramp | Retained |
| 28 | Gamma | Gamma | Retained |
| 29 | Contrast | Brightness / contrast | Retained |
| 30 | UVX | UV X | Retained |
| 31 | UVY | UV Y | Retained |
| 32 | PositionX | Position X | Retained |
| 33 | PositionZ | Position Z | Retained |
| 34 | NormalX | Normal X | Retained |
| 35 | NormalZ | Normal Z | Retained |
| 36 | Wave | Wave | Retained |
| 37 | Vector | Vector | 0.7 |
| 38 | Coordinates | Coordinates | 0.7 |
| 39 | Separate | Separate XYZ | 0.7 |
| 40 | Combine | Combine XYZ | 0.7 |
| 41 | Mapping | Mapping | 0.7 |
| 42 | VectorMath | Vector Math | 0.7 |
| 43 | VectorRotate | Vector Rotate | 0.7 |
| 44 | Perlin3D | 3D Perlin Noise | 0.7 |
| 45 | Voronoi3D | 3D Voronoi | 0.7 |
| 46 | Brick | Brick Texture | 0.7 |
| 47 | Magic | Magic Texture | 0.7 |
| 48 | HSV | Hue Saturation Value | 0.7 |
| 49 | SeparateColor | Separate Color | 0.7 |
| 50 | CombineColor | Combine Color | 0.7 |
| 51 | Blackbody | Blackbody | 0.7 |
| 52 | Wavelength | Wavelength | 0.7 |
| 53 | ColorMath | Color Math | 0.7 |
| 54 | MapRange | Map Range | 0.7 |
| 55 | FloatCurve | Float Curve | 0.7 |
| 56 | Boolean | Boolean | 0.7 |
| 57 | Integer | Integer | 0.7 |
| 58 | Compare | Compare | 0.7 |
| 59 | Switch | Switch | 0.7 |
| 60 | NormalMap | Normal Map | 0.7 |
| 61 | NormalBlend | Normal Blend | 0.7 |
| 62 | HeightBlend | Height Blend | 0.7 |
| 63 | Distance | Distance | 0.7 |
| 64 | Fresnel | Fresnel | 0.7 |
| 65 | RadialTiling | Radial Tiling | 0.7 |
| 66 | Posterize | Posterize | 0.7 |
| 67 | Smoothstep | Smoothstep | 0.7 |
| 68 | Random | Random | 0.7 |
| 69 | Tile | Tile Pattern | 0.7 |
| 70 | SDF | Shape / SDF | 0.7 |
| 71 | Gradient3D | 3D Gradient | 0.7 |
| 72 | VectorTransform | Vector Transform | 0.7 |
| 73 | ColorSpace | Color Space | 0.7 |
| 74 | NoiseAdvanced | Noise / Patterns | 0.7 |
| 75 | InputNormal | Layer normal | 0.7 |
| 76 | InputHeight | Layer height | 0.7 |
| 77 | InputAO | Layer AO | 0.7 |
| 78 | InputEmission | Layer emission | 0.7 |
| 79 | InputOpacity | Layer opacity | 0.7 |
| 80 | Blur | Blur | 0.7 |
| 81 | Transform2D | Transform 2D | 0.7 |
| 82 | Warp | Vector Warp | 0.7 |
| 83 | DirectionalWarp | Directional Warp | 0.7 |
| 84 | HeightToNormal | Height to Normal | 0.7 |
| 85 | EdgeDetect | Edge Detect | 0.7 |
| 86 | Morphology | Dilate / Erode | 0.7 |
| 87 | SlopeBlur | Slope Blur | 0.7 |
| 88 | CurvatureFromNormal | Curvature from Normal | 0.7 |
| 89 | Triplanar | Triplanar Texture | 0.7 |
| 90 | Gabor | Gabor Texture | 0.7 |
| 91 | Reroute | Reroute | 0.8 |
| 92 | CustomHlsl | Custom HLSL | 0.8 |

| 93 | FillCoordinates | Fill coordinates | 0.10 |
| 94 | MeshMap | Mesh map | 0.10 |
| 95 | HistogramScan | Histogram scan | 0.10 |
| 96 | HistogramRange | Histogram range | 0.10 |
| 97 | HistogramSelect | Histogram select | 0.10 |
| 98 | Levels | Levels | 0.10 |
| 99 | Blend | Blend | 0.10 |
| 100 | DirectionalBlur | Directional blur | 0.10 |
| 101 | NonUniformBlur | Non-uniform blur | 0.10 |
| 102 | HighPass | High pass | 0.10 |
| 103 | VectorWarp | Vector warp | 0.10 |
| 104 | NormalInvert | Normal invert | 0.10 |
| 105 | NormalNormalize | Normal normalize | 0.10 |
| 106 | Simplex3D | 3D Simplex | 0.10 |
| 107 | VoronoiFractal | 3D Voronoi fractal | 0.10 |
| 108 | PhysicsBrush | Physics brush | 0.11 — bounded GPU Rain/Dirt surface transport |
| 109 | Decal | Decal | 0.17 — projective color/alpha coverage |
| 110 | Offset | Offset | 0.18 — percent/pixel wrapping |
| 111 | MakeTileable | Make tileable | 0.18 — opposing-edge overlap |
| 112 | Paint | Paint | 0.18 — generic Paint/Clone/Erase |
| 113 | TextureOutput | Texture Output | 0.18 — explicit project publication |

## Semantics and gaps

Coordinates exposes Fill/Raw UV, position, normal, polar, cylindrical, spherical, box and triplanar projections with shared transforms. Separate extracts components. Vector Math has 19 operations; Math has 38 bounded scalar modes. Switch infers its result type. Blur/Transform/Warp/Slope Blur cache full-resolution prerequisite fields, preserve connected data types and reject more than 16 cached inputs. Physics brush produces a scalar simulation mask; see the 0.11 guide for exact solver limits.

Perlin and Simplex use original XYZ gradient algorithms with seeded octave modes; Voronoi uses 3D cell neighborhoods and now supports an octave variant. Blue noise, richer tile samplers, original named grunge presets and most Designer generators remain planned. Gabor, Blackbody, Fresnel and normal-derived Curvature are original bounded approximations, not matched reference algorithms.

Material output inputs are eight texture fields. Shader closures, bundles, ray/path/volume/hair context and global iteration require different execution capabilities. 0.8 adds reusable whole graphs, exposed controls, typed reroutes, atomic rewiring and bounded custom HLSL with eight inputs/one result. Nested executable subgraphs, arbitrary multiple outputs and broad scripting remain pending.

See [0.8 behavior and limits](Surface3D-0.8-features.md), [implementation checklist](Artist-node-workflow-todo.md) and [artist validation](Surface3D-0.8-artist-tests.md). The 487-row classification retains historical 0.7 entries and explicitly updates implemented 0.10 counterparts. The remaining planned/partial/backend entries are not silently counted as completed. Fill coordinates and semantic mesh maps are input plumbing. Legacy Warp (82) remains readable; new creation menus expose one cached-field Vector warp (103).
