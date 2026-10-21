# 0.22 node authoring verification

Release build completed. The full regression suite passed **53/53 in 320.11 seconds**; report: `work/Full-suite-0.22.txt`. After artist-control refinements and independent normal/mapper checks, four targeted graph/UI/library/operator checks passed in 56.95 seconds (`work/Final-checks-0.22.txt`). Following the final CPU repeat/clamp/mirror boundary correction, the node operator test passed again in **53.38 seconds**. The full suite was not repeated after that bounded correction.

The new node test checks independent Gaussian filtering with transparent pixels, channel-wise full-image levels, a discrete periodic normal-to-height oracle, deterministic Gray-Scott updates, GPU alpha handling, crop boundaries, color arithmetic, switch inputs, constant-field warp invariants, radial blur, height AO, region coverage, mapper background/alpha, finite pattern/noise outputs, and schema 24 persistence. GPU operator checks use D3D11 WARP. These checks do not establish complete reference parity for every mode or high-resolution performance.

Native application screenshot: `build-022/nodes22-evidence/Crop-UI.png`. The fixture uses arranged nodes and the actual editable Crop controls; see [UI review](UI-review-0.22.md).

Twenty-one appended operators form this development batch. Cached CPU analysis is used for Sharpen, Auto Levels, Normal to Height, Reaction Diffusion and Shape Style; other operators run in the GPU graph, with geometry-derived Mask Region coverage supplied as a field. CPU readback/processing remains synchronous. No new realtime, hardware acceleration or production quality claim follows from this batch.

The [Designer audit](Designer-library-audit.md) records the larger unfinished scope. Nested function nodes, multiple named outputs, material bundles and complete distribution/scan/HDRI families are not implemented. The 400-asset library gate remains closed. Sealed 0.19 and the packaged 0.21 preview remain unchanged; 0.22 is currently a local development build.
