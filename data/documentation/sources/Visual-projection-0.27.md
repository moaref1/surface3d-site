# Surface3D 0.27 — visual projection and node batch

## Using visual triplanar

Select a fill layer. In Properties > Coordinates choose Triplanar, then Edit in 3D. Use the viewport Move / Rotate / Scale controls and drag the colored handles. Ctrl snaps translation and scale to 0.5, rotation to 15 degrees. The same shared Coordinates node remains editable in Graph; connected image maps use its transform. Position, Normal vector, Polar, Cylindrical, Spherical, Box and Triplanar modes expose the same controls in both the node inspector and fill Coordinates tab. UV and Raw UV do not expose 3D handles. Editing records an undo checkpoint and the transform is saved with the project.

## Added operators

- Diffusion: constrained iterative GPU diffusion; white seed mask, optional intensity map, color/grayscale/vector modes.
- Mosaic: iterative gradient-driven warp, source and driver inputs.
- Glow: alpha-preserving Gaussian glow, radius, strength and threshold.
- Luminance Highpass: Gaussian frequency separation with centered/signed grayscale output.
- Hald CLUT: trilinear lookup, explicit level and strength. LUT and source must use the same linear encoding. LUT detail is limited by the evaluated graph resolution.
- Blue Noise / Progressive: original seeded periodic farthest-point rank texture. This is an alternative, not Adobe's Blue Noise Fast implementation.

These are original implementations with partial reference coverage. All Designer nodes are NOT complete. The coverage index remains open; the 400-asset gate remains closed. In particular Shape Splatter data, volumetric/SDF rendering, scan processing, full procedural HDRI authoring and ray-traced graph nodes are outstanding.

## Validation

Release build succeeded. Three targeted suites passed: Designer operator contracts/pixel checks, native projector drag with persistence/undo/redo/mode availability, and stencil brush/node pixels and persistence. Move interaction was exercised automatically; rotation/scale and each projection mode still need artist review. Do not infer full Designer parity from these operator names. Cold shared shader compilation is expensive and must be distinguished from cached startup and interactive node evaluation.
