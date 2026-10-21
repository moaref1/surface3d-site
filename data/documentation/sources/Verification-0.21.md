# 0.21 development verification



The Release build completed. Full regression: **52/52 passed in 164.33 seconds**; raw report: `work/Full-suite-0.21.txt`. Executable SHA256: `b2c2816c5e8c01fd7f005e1b9dc27723763904e58e5eb6099b1de00485767062`.



The new pattern21 check uses D3D11 WARP. It verifies periodic/clamped connected components and seam-crossing bounding width; exact signed EDT against an independent brute-force oracle; Box/Gaussian checker smoothing despite point image filtering; zero-spread identity; Directional/Non-Uniform/High Pass finite behavior; constant color and normal-length preservation; typed Flood Fill output propagation; editable Tile Sampler inputs/rows; Flood Fill/Bevel cache invalidation; schema23 save/load; and adjustable image budgets with actionable Preferences errors. The cache regression now checks both the processed blur field and its downstream input, with full-replay parity.



Retained checks cover existing CPU/GPU baking, cages/seams, brush/node contracts, layers/folders/per-channel masks, exports, source textures, reusable outputs, multi-mesh scenes and native UI interactions. No promise of every Designer node or production rendering parity follows from this test count.



Actual application screenshots were inspected: `build-021/pattern21-evidence/Preferences.png`, `Bevel-UI.png`, `Rendering.png`. The native development adapter reports NVIDIA GeForce RTX 5050; the prop is visible in Rendering here. First-entry framing and color+depth MSAA compatibility fallback address known failure paths. The friend's missing-object report has not been reproduced on their PC and still requires retesting there.



Remaining: CPU shape readback is synchronous; arbitrary toroidal component bounds and full Tile Sampler/Flood Fill families are incomplete; non-uniform blur is deterministic 128-tap disk approximation. 2K quality/performance across artist hardware remains unmeasured. This is a shareable development preview, not a sealed production release.

