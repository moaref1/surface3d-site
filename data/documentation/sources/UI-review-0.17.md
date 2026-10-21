# Surface3D 0.17 native UI review

Reviewed actual Windows captures twice on 9 October 2026: first for layout/ownership, then for the completed interaction and output. These are executable captures, not generated design mockups.

## Pass 1: layout and discoverability

| Area | Verified in the capture | Remaining refinement |
| --- | --- | --- |
| Layers | View, Blend and Opacity share one compact row. The selected layer remains explicit; no settings gear or separate opacity channel picker. | Review narrow docks, long layer names and mixed-channel labels with artists. |
| Fill properties | Channels are compact highlighted buttons in two rows. Material and mask ownership remain visible; Coordinates and Effects stay beside Channels. | Further simplify effect lists and generator controls using real artist sessions. |
| Library | Import, grid/list and zoom actions occupy small top controls. Captions fit one line with full names available on hover. | Category icons need novice discoverability testing; a narrow dock should remain usable. |
| Bake | Meshes / Projection / Maps / Results, map selection and separate preview remain in Bake. Curvature radius, strength, quality and seam controls have direct numeric input. | Preview real hard/mirrored seams and imported cages; do not interpret a cube as general production acceptance. |
| Decal | Deliberate drag creates a separately named fill, with no implicit white mask. Image and direct Projection properties stay in Paint. | Projector handles, text/stencils and full normal/multi-map decals remain open. |
| Rendering | Scene, Output and Color controls stay out of Layers. Sample count and bounces appear only for ray output; raster MSAA is disabled there. | Interactive accumulation, denoising, light gizmos and additional camera effects remain open. |

## Pass 2: behavior and output

- Layer-opacity and Channel-sweep captures match actual typed-opacity, Alt-isolation, held-mouse sweep and single-operation undo assertions.
- Graph-drops shows semantic baked-map nodes and an editable grouped generator. Newly dropped nodes preserve the existing material output.
- Bake-map-sweep matches selection assertions. The original low/high cube's fitted projection has 120984 hits and zero misses; intentionally insufficient face/smooth distances still report genuine misses.
- Placed-decal matches a real triangle hit, projected color/roughness coverage, untouched pixels outside the projector, persistence and undo/redo.
- Ray-output and Ray-result show actual asynchronous output and the completed result/live switch. The small 8-sample test image intentionally shows noise; it is an interaction fixture, not a high-quality final render.
- The bottom GPU figure comes from the OS process budget. The last render's Ray resources value is an allocation estimate, not current whole-process VRAM use.

The interface retains the existing dark/teal theme, workspace placement, right-hand layer/properties docks and navigation controls. Start with a neutral material or Rendering-prop example for ordinary authoring; some test captures deliberately contain extreme parameters or simple panels.

No source mesh, UV or sealed older release was changed. Further artist acceptance and the complete rendering backlog are tracked in Rendering-and-artist-roadmap.md.

The material generated during packaged import verification is included as examples/Texture-pack-library-demo.s3mat rather than prepopulating the initial library.
