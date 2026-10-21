# Surface3D 0.19 node input/output audit

All 114 stable registered kinds below passed typed default-graph validation and GPU finite-output execution. Numeric reference checks additionally cover RGBA adjustment/Blend alpha, normal composition, optional Base normal, Mesh Map modes and Vector Math output modes. This is not certification of every parameter combination, all Blender/Designer nodes or exact third-party algorithms.

Types are Scalar (single value), Color (RGB with alpha where supported), Vector (XYZ), Boolean, Integer and signed tangent-space Normal. Existing implicit conversion is validated at connections. Output/inputs below are resolved for the tested default connections; Blend, Switch, Paint, Reroute, Custom HLSL and operation-based nodes can have other valid resolved types. Material/Mask/Texture Output are destination nodes rather than ordinary reusable texture inputs.

Height to Normal's Base normal is optional. Math and Vector Math keep inactive stored connections but dim sockets/defaults that the current operation does not read. Connected inputs override their disabled fallback parameter. Custom HLSL's editable declarations define its actual ports. Color constants remain opaque RGB; alpha-preserving tests use image inputs.

Corrections in this iteration: component-wise adjustments with alpha preservation; dynamic Blend/background/foreground typing; Layer normal separated from height; Height to Normal with optional Base normal; normal input labels and reoriented defaults; resolved texture-input creation; active operation sockets and accurate Scale/Eta defaults. Earlier saved grayscale nodes retain compatibility.

| Stable ID | Node | Default output | Inputs |
| --- | --- | --- | --- |
| 0 | Value | Scalar | None |
| 1 | Color | Color | None |
| 2 | Noise | Scalar | Vector / coordinates: Vector |
| 3 | Position Y | Scalar | None |
| 4 | Remap | Scalar | A: Scalar |
| 5 | Color blend | Color | Background: Color; Foreground: Color; Factor: Scalar |
| 6 | Value blend | Scalar | Background: Scalar; Foreground: Scalar; Factor: Scalar |
| 7 | Material Output | Color | Base color: Color; Roughness: Scalar; Metallic: Scalar; Normal: Normal; Height: Scalar; AO: Scalar; Emission: Color; Opacity: Scalar |
| 8 | Layer color | Color | None |
| 9 | Layer roughness | Scalar | None |
| 10 | Layer metallic | Scalar | None |
| 11 | Layer mask | Scalar | None |
| 12 | Normal Y | Scalar | None |
| 13 | Anchor color | Color | None |
| 14 | Anchor value | Scalar | None |
| 15 | Mask Output | Scalar | A: Scalar |
| 16 | Image texture (color) | Color | Coordinates: Vector |
| 17 | Image texture (value) | Scalar | Coordinates: Vector |
| 18 | Checker | Scalar | Vector / coordinates: Vector |
| 19 | Gradient | Scalar | Vector / coordinates: Vector |
| 20 | White noise | Scalar | Vector / coordinates: Vector |
| 21 | Voronoi | Scalar | Vector / coordinates: Vector |
| 22 | Fractal noise | Scalar | Vector / coordinates: Vector |
| 23 | Invert | Scalar | Image / value: Scalar |
| 24 | Clamp | Scalar | Image / value: Scalar |
| 25 | Math | Scalar | Value A: Scalar; Value B: Scalar; Unused: Scalar |
| 26 | RGB to grayscale | Scalar | A: Color |
| 27 | Color ramp | Color | A: Scalar |
| 28 | Gamma | Scalar | Image / value: Scalar |
| 29 | Brightness / contrast | Scalar | Image / value: Scalar |
| 30 | UV X | Scalar | None |
| 31 | UV Y | Scalar | None |
| 32 | Position X | Scalar | None |
| 33 | Position Z | Scalar | None |
| 34 | Normal X | Scalar | None |
| 35 | Normal Z | Scalar | None |
| 36 | Wave | Scalar | Vector / coordinates: Vector |
| 37 | Vector | Vector | None |
| 38 | Coordinates | Vector | None |
| 39 | Separate XYZ | Scalar | Vector / coordinates: Vector |
| 40 | Combine XYZ | Vector | X / R: Scalar; Y / G: Scalar; Z / B: Scalar |
| 41 | Mapping | Vector | Vector / coordinates: Vector |
| 42 | Vector Math | Vector | Vector A: Vector; Vector B: Vector; Scale: Scalar |
| 43 | Vector Rotate | Vector | Vector / coordinates: Vector |
| 44 | 3D Perlin Noise | Scalar | Vector / coordinates: Vector |
| 45 | 3D Voronoi | Scalar | Vector / coordinates: Vector |
| 46 | Brick Texture | Scalar | Vector / coordinates: Vector |
| 47 | Magic Texture | Scalar | Vector / coordinates: Vector |
| 48 | Hue Saturation Value | Color | A: Color |
| 49 | Separate Color | Scalar | A: Color |
| 50 | Combine Color | Color | X / R: Scalar; Y / G: Scalar; Z / B: Scalar |
| 51 | Blackbody | Color | None |
| 52 | Wavelength | Color | None |
| 53 | Color Math | Color | A: Color; B: Color |
| 54 | Map Range | Scalar | A: Scalar |
| 55 | Float Curve | Scalar | A: Scalar |
| 56 | Boolean | Boolean | None |
| 57 | Integer | Integer | None |
| 58 | Compare | Boolean | A: Scalar; B: Scalar |
| 59 | Switch | Scalar | False: Scalar; True: Scalar; Condition: Boolean |
| 60 | Normal Map | Normal | Encoded RGB normal: Color |
| 61 | Normal Blend | Normal | Base normal: Normal; Detail normal: Normal |
| 62 | Height Blend | Scalar | Background height: Scalar; Foreground height: Scalar; Opacity: Scalar |
| 63 | Distance | Scalar | A: Vector; B: Vector |
| 64 | Fresnel | Scalar | Vector / coordinates: Vector |
| 65 | Radial Tiling | Vector | Vector / coordinates: Vector |
| 66 | Posterize | Scalar | Image / value: Scalar |
| 67 | Smoothstep | Scalar | A: Scalar |
| 68 | Random | Scalar | Vector / coordinates: Vector |
| 69 | Tile Pattern | Scalar | Vector / coordinates: Vector |
| 70 | Shape / SDF | Scalar | Vector / coordinates: Vector |
| 71 | 3D Gradient | Scalar | Vector / coordinates: Vector |
| 72 | Vector Transform | Vector | Vector / coordinates: Vector |
| 73 | Color Space | Color | A: Color |
| 74 | Noise / Patterns | Scalar | Vector / coordinates: Vector |
| 75 | Layer normal | Normal | None |
| 76 | Layer height | Scalar | None |
| 77 | Layer AO | Scalar | None |
| 78 | Layer emission | Color | None |
| 79 | Layer opacity | Scalar | None |
| 80 | Blur | Color | A: Color |
| 81 | Transform 2D | Color | A: Color |
| 82 | Vector Warp | Color | A: Color; B: Vector |
| 83 | Directional Warp | Color | A: Color; B: Scalar |
| 84 | Height to Normal | Normal | Height: Scalar; Base normal: Normal |
| 85 | Edge Detect | Scalar | A: Scalar |
| 86 | Dilate / Erode | Scalar | A: Scalar |
| 87 | Slope Blur | Color | A: Color; B: Scalar |
| 88 | Curvature from Normal | Scalar | Normal: Normal |
| 89 | Triplanar Texture | Color | Coordinates: Vector |
| 90 | Gabor Texture | Scalar | Vector / coordinates: Vector |
| 91 | Reroute | Scalar | A: Scalar |
| 92 | Custom HLSL | Scalar | In0: Scalar |
| 93 | Fill coordinates | Vector | None |
| 94 | Mesh map | Scalar | Coordinates: Vector |
| 95 | Histogram scan | Scalar | Input: Scalar |
| 96 | Histogram range | Scalar | Input: Scalar |
| 97 | Histogram select | Scalar | Input: Scalar |
| 98 | Levels | Scalar | Image / value: Scalar |
| 99 | Blend | Color | Background: Color; Foreground: Color; Opacity: Scalar |
| 100 | Directional blur | Color | A: Color |
| 101 | Non-uniform blur | Color | Image: Color; Radius mask: Scalar |
| 102 | High pass | Color | A: Color |
| 103 | Vector warp | Color | Image: Color; Offset vector: Vector |
| 104 | Normal invert | Normal | A: Normal |
| 105 | Normal normalize | Normal | A: Normal |
| 106 | 3D Simplex | Scalar | Vector / coordinates: Vector |
| 107 | 3D Voronoi fractal | Scalar | Vector / coordinates: Vector |
| 108 | Physics brush | Scalar | None |
| 109 | Decal | Color | Coordinates: Vector |
| 110 | Offset | Color | Image / mask: Color |
| 111 | Make tileable | Color | Image / mask: Color |
| 112 | Paint | Color | Image / mask: Color |
| 113 | Texture Output | Color | Image / mask: Color |

See the packaged Node-contracts.csv for raw machine-readable evidence, the artist guide for usage, and the master plan for missing node families.
