# 0.21 priorities: texture shapes and blur quality



Implemented in this development milestone:

- Dense separable full-resolution GPU Blur, with Box/Gaussian kernels, fractional spread, premultiplied RGBA and normalized normal outputs.

- Linear intermediate-field sampling independent of point-filtered source images.

- Dense directional blur and 128 deterministic disk samples for Non-Uniform Blur/High Pass.

- Unified Flood Fill: random gray/color, island index, center, bounding size and gradient.

- Exact Euclidean Distance Field: inside, outside and signed; repeat/clamp boundaries.

- Bevel: round, linear and smooth distance profiles with signed height.

- GPU Tile Sampler: connected image/mask, rows/columns, size, seed, rotation and variations.

- Parameter-aware cached analysis, new node descriptions/categories and schema23 persistence.



Remaining high priorities:

- Flood Fill Mapper, separate per-island modulation inputs and robust arbitrary toroidal island bounds.

- Full Tile Sampler distribution maps, masks, per-instance controls and Splatter family.

- Multi-directional/advanced warps, material bundles and smarter content-aware tiling.

- Async shape analysis and GPU implementation of connected components / exact distance analysis.

- Blur performance/quality profiling at 2K on artist hardware, especially variable-radius disk sampling.



This is original Surface3D code, not a claim of Adobe node parity. Existing graph/field limits remain.

