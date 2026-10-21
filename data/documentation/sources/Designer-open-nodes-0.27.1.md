# Designer nodes — open coverage, 2026-10-11

177 pending entries, 171 partial entries. Pending means no verified reference implementation in the checklist; some have equivalent general operators. Partial does not mean full Designer parity.

## pending

### 3D View (Library), HDRI Tools
- Exposure Preview
- HDR Merge
- Line Light
- Nadir Patch
- Physical Sun/Sky
- Plane Light
- Shape Light
- Sphere Light
- Straighten Horizon

### Filters, Adjustments
- Lighting Cancel High Frequencies
- Lighting Cancel Low Frequencies

### Filters, Blending
- Color (Blend Node)
- Color Burn
- Color Dodge
- Dissolve
- Linear Burn
- Luminosity (Blend Node)

### Filters, Effects
- 3D Texture Position
- 3D Texture SDF
- 3D Texture Surface Render
- 3D Texture Volume Render
- Ambient Occlusion (RTAO)
- Cross Section
- Curvature Smooth
- Curvature Sobel
- RT Shadow
- RT Irradiance
- Shadows (Filter Node)
- Vector Morph

### Filters, Normal Map
- Normal To Height HQ
- Bent Normal

### Filters, Tiling
- Make It Tile Patch
- Make It Tile Photo

### Filters, Transforms
- 3D Texture Offset
- Clone (Filter Node)
- Noise Upscale 1
- Noise Upscale 2
- Noise Upscale 3
- Non-Square Transform

### Material filters, 1-Click
- Bitmap to Material Light

### Material filters, Blending (Material)
- Multi-Material Blend

### Material filters, Effects (Material)
- Height Blend
- Season Filter
- Snow Cover
- Water Level

### Material filters, PBR Utilities
- BaseColor / Metallic / Roughness converter
- PBR Render
- PBR Render Mapping

### Material filters, Scan Processing
- Atlas Scatter
- Atlas Splitter
- Clone Patch
- Color Equalizer
- Material Clone Patch
- Multi-Angle to Albedo
- Multi-Angle to Normal
- Multi Clone Patch
- Multi Color Equalizer
- Multi Crop
- Smart Auto Tile

### Mesh based generators, Mask Generators
- Bottom To Top
- Cloth Wear
- Dirt
- Dripping Rust
- Dust
- Edge Blur
- Edge Damages
- Edge Dirt
- Edge Notch
- Edge Select
- Edge Speckle
- Edge Wear
- Fiber Glass Edge Wear
- Grease
- Ground Dirt
- Leaks
- Leather Wear
- Light
- Mask Builder
- Metal Edge Wear
- Paint Wear
- Selective Dirt
- Sun Bleach
- Surface Brush

### Mesh based generators, Utilities (Mesh based generators)
- Material Mesh Data Blender
- Material Selector
- Mesh Data Combiner

### Mesh based generators, Weathering
- Cracks Weathering
- Fabric Weathering
- Leather Weathering
- Metal Weathering
- Moss Weathering
- Rock Weathering
- Rust Weathering

### Texture generators, Noises
- BnW Spots 1
- BnW Spots 2
- BnW Spots 3
- Cells 1
- Cells 2
- Cells 3
- Cells 4
- Creased
- Directional Noise 1
- Directional Noise 2
- Directional Noise 3
- Directional Noise 4
- Directional Scratches
- Dirt 1
- Dirt 2
- Dirt 3
- Dirt 4
- Dirt 5
- Dirt Gradient
- Fluid
- Fractal Sum 1
- Fractal Sum 2
- Fractal Sum 3
- Fractal Sum 4
- Fractal Sum Base
- Fur 1
- Fur 2
- Fur 3
- Gaussian Spots 1
- Gaussian Spots 2
- Grunge Concrete
- Grunge Damas
- Grunge Galvanic Large
- Grunge Galvanic Small
- Grunge Leaks
- Grunge Leaky Paint
- Grunge Map 001
- Grunge Map 002
- Grunge Map 003
- Grunge Map 004
- Grunge Map 005
- Grunge Map 006
- Grunge Map 007
- Grunge Map 008
- Grunge Map 009
- Grunge Map 010
- Grunge Map 011
- Grunge Map 012
- Grunge Map 013
- Grunge Map 014
- Grunge Map 015
- Grunge Rough Dirty
- Grunge Rust Fine
- Grunge Scratches Dirty
- Grunge Scratches Fine
- Grunge Scratches Rough
- Grunge Shavings
- Grunge Splashes Dusty
- Grunge Spots
- Grunge Spots Dirty
- Messy Fibers 1
- Messy Fibers 2
- Messy Fibers 3
- Microscope View
- Waveform 1

### Texture generators, Patterns
- 3D Volume Mask
- Cube 3D
- Cube 3D GBuffers
- Gradient Circular
- Gradient Linear 1
- Gradient Linear 2
- Gradient Linear 3
- Height Extrude
- Mesh 1
- Mesh 2
- Panorama Shape
- Shape Extrude
- Shape Mapper
- Shape Splatter
- Shape Splatter Blend
- Shape Splatter Data Extract
- Shape Splatter to Mask
- Splatter
- Splatter Circular

## partial-reference-coverage

### 3D View (Library), HDRI Tools
- Blackbody
- Color Temperature Adjustment
- Exposure
- Nadir Extract
- Panorama 3D Position
- Gradient 2 Points
- Gradient Linear (HDRI)
- Panorama Rotation

### Filters, Adjustments
- Auto Levels
- Channel Mixer
- Chrominance Extract
- Clamp
- Color Match
- Color To Mask
- Contrast/Luminosity
- Convert To Linear
- Convert to sRGB
- Grayscale Conversion Advanced
- Hald CLUT
- HDR Range Viewer
- Height Map Frequencies Mapper
- Highpass
- Histogram Range
- Histogram Scan
- Histogram Scan Non-Uniform
- Histogram Select
- Histogram Shift
- Invert
- Luminance Highpass
- Min Max
- Pow
- Quantize
- Replace Color
- Replace Color Range
- Threshold

### Filters, Blending
- Difference
- Multi Switch
- Switch

### Filters, Blurs
- Anisotropic Blur
- Blur HQ
- Non Uniform Blur
- Radial Blur
- Slope Blur

### Filters, Channels
- RGBA Merge
- RGBA Split
- Alpha Merge
- Alpha Split
- Pre-Multiplied to Straight
- Straight to Pre-multiplied

### Filters, Effects
- Ambient Occlusion (HBAO) (Filter Node)
- Bevel (Filter Node)
- Curvature (Filter Node)
- Diffusion Color
- Diffusion Grayscale
- Diffusion UV
- Edge Detect
- Emboss With Gloss
- Extend Shape
- Flood Fill
- Flood Fill Mapper
- Flood Fill to BBox Size
- Flood Fill to Gradient
- Flood Fill to Grayscale/Color
- Flood Fill to Index
- Flood Fill to Position
- Flood Fill to Random Color
- Flood Fill to Random Grayscale
- FXAA
- Glow
- Mosaic
- Multi Directional Warp
- Non Uniform Directional Warp
- Reaction Diffusion Fast
- Shape Drop Shadow
- Shape Glow
- Shape Stroke
- Summed Area Table
- Swirl
- Uber Emboss
- Vector Warp

### Filters, Normal Map
- Facing Normal
- Height Normal Blender
- Height to Normal World Units
- Normal Blend
- Normal Combine
- Normal Invert
- Normal Normalize
- Normal Sobel
- Normal to Height
- Normal Transform
- Normal Vector Rotation

### Filters, Transforms
- Auto Crop
- Cartesian To Polar
- Polar to Cartesian
- Mirror (Filter Node)
- Safe Transform
- Non-Uniform Rotation
- Skew
- Symmetry
- Symmetry Slice
- Trapezoid Transform
- Quad Transform

### Material filters, Blending (Material)
- Material Adjustment Blend
- Material Blend
- Material Color Blend
- Material Switch

### Material filters, Effects (Material)
- Material Height Blend

### Material filters, PBR Utilities
- Base Material
- PBR Albedo Safe Color
- PBR BaseColor / Metallic Validate
- PBR Dielectric F0
- PBR Metal Reflectance

### Material filters, Scan Processing
- AO Cancellation
- Crop
- Material Crop

### Material filters, Transforms (Material)
- Material Transform

### Mesh based generators, Utilities (Mesh based generators)
- 3D Planar Projection
- Tri Planar

### Texture generators, Noises
- 3D Perlin Noise
- 3D Perlin Noise Fractal
- 3D Ridged Noise Fractal
- 3D Simplex Noise
- 3D Voronoi
- 3D Voronoi Fractal
- 3D Worley Noise
- Anisotropic Noise
- Blue Noise Fast
- Clouds 1
- Clouds 2
- Clouds 3
- Crystal 1
- Crystal 2
- Gaussian Noise
- Liquid
- Moisture Noise
- Perlin Noise
- Plasma
- Caustics
- Voronoi
- Voronoi Fractal
- White Noise
- White Noise Fast

### Texture generators, Patterns
- 3D Linear Gradient
- Alveolus
- Arc Pavement
- Brick 1
- Brick 2
- Brick Generator
- Checker 1
- Fibers 1
- Fibers 2
- Gaussian 1
- Gaussian 2
- Gradient Axial
- Gradient Axial Reflected
- Gradient Radial
- Polygon 1
- Polygon 2
- Scratches Generator
- Shape
- Star
- Starburst
- Stripes
- Tile Generator
- Tile Random
- Tile Random 2
- Tile Sampler
- Triangle Grid
- Weave 1
- Weave 2
- Weave Generator
