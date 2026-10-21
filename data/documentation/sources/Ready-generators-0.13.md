# The 50 ready generators and effects

All entries create editable graphs using implemented nodes. No proprietary assets are included.

## Surface

| Name | Purpose |
|---|---|
| Cavities | Invert baked AO to select occluded cavities. |
| Convex edges | Remap the positive half of baked curvature. |
| Concave edges | Remap the negative half of baked curvature. |
| Thin surfaces | Invert thickness to select thin regions. |
| Thick cores | Remap baked thickness. |
| Upward surfaces | Select normals facing object +Y. |
| Downward surfaces | Select normals facing object -Y. |
| Height gradient | Normalized mesh-position Y gradient. |
| Ground band | Select a controllable band near the bottom. |
| Side surfaces | Select faces perpendicular to object +Y. |

## Wear

| Name | Purpose |
|---|---|
| Edge chips | Break convex-edge wear with object-space fractal noise. |
| Edge scratches | Mask fine streaks by convex curvature. |
| Exposed peaks | Select high convexity with broad breakup. |
| Crevice wear | Combine concavity and cellular variation. |
| Fine abrasion | High-frequency ridged object-space noise. |
| Long scratches | Thin parallel streaks with noise breakup. |
| Cross scratches | Combine two perpendicular scratch fields. |
| Worn coating | Soft object-space patches for a paint mask. |
| Chipped patches | Cellular patch selection with edge contrast. |
| Pitted wear | Small cellular spots modulated by cavities. |

## Deposits

| Name | Purpose |
|---|---|
| Cavity dirt | AO cavities with object-space noise breakup. |
| Ground dirt | Bottom-height accumulation with breakup. |
| Settled dust | Up-facing surfaces modulated by broad noise. |
| Underside soot | Down-facing surfaces with fine variation. |
| Rain film | GPU surface transport from a whole-mesh source. |
| Ground transport | GPU dirt transport from the ground band. |
| Oily cavities | Smooth cavity mask with restrained breakup. |
| Waterline | A tunable horizontal height band. |
| Rust pits | Concave regions with cellular pitting. |
| Slope buildup | Soft upward-facing accumulation. |

## Patterns

| Name | Purpose |
|---|---|
| Fine grunge | Fine 3D fractal Perlin variation. |
| Broad grunge | Coarse 3D fractal Perlin variation. |
| Ridged grunge | 3D ridged Perlin variation. |
| Cell edges | 3D Voronoi F2-F1 edges. |
| Crackle | Narrow Voronoi cell boundaries. |
| Brushed lines | UV directional lines; rotate with Mapping. |
| Checker | UV checker pattern with frequency control. |
| Speckles | Thresholded 3D cellular randomness. |
| Brick pattern | UV brick-and-mortar pattern. |
| Woven lines | Intersect two perpendicular line patterns. |

## Adjustments

| Name | Purpose |
|---|---|
| Levels | Identity levels by default; set input/output ranges. |
| Invert | Invert the incoming mask/channel. |
| Gamma | Identity gamma by default. |
| Contrast | Identity contrast by default. |

## Filters

| Name | Purpose |
|---|---|
| Blur | Full-resolution bounded blur of the incoming field. |
| High pass | Remove low frequencies from the incoming field. |
| Edge detect | Detect gradients in the incoming field. |
| Dilate | Expand bright regions of the incoming field. |
| Erode | Contract bright regions of the incoming field. |
| Posterize | Quantize the incoming field to controllable steps. |
