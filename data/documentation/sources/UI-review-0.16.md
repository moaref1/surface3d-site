# Surface3D 0.16 UI capture review

Reviewed the actual packaged editor captures on 9 October 2026. These images are native application output, not design mockups.

| Capture | Observed behavior | Further refinement |
| --- | --- | --- |
| Paint-clean-controls | Existing dark/teal theme and Painter-style right docks retained. Blend and opacity appear above the stack; fill Channels / Coordinates / Effects and the large editable color swatch remain in Properties. | Clarify layer blend versus channel and effect blend by ownership labels/tooltips. Reduce library empty-state text and simplify the material/mask header. Channel tabs need a compact overflow menu on narrow docks. |
| Rendering | Scene list on the left, large camera viewport in the middle, Scene / Output / Color controls on the right. Camera and light settings stay out of Layers. | Add named light rows and light gizmos, improve ground and lighting defaults, and make rendering progress/status contextual. Current lighting does not provide full indirect or ray transport. |
| Rendering-output | Format/precision, pass, alpha, MSAA and actual device are together. Camera aspect is visible. | Keep MSAA clearly distinct from future path-tracing samples; unavailable ray/DLSS/denoiser settings must remain absent. Add comparison/reference views before claiming production look parity. |
| Bake-cage | Meshes / Projection / Maps / Results tabs, map list and projection preview make bake ownership visible. The captured diagnostic reports 3512 hits and zero misses for this pipe. | Inspect real high/low/cage assets, including the fitted cube with its residual missed sample. Avoid implying this pipe capture establishes general seam or cage correctness. |
| Export-template | Settings / Output templates / List of exports retained, with filenames, channel sources and encoding shown together. | Keep format/precision/color interpretation visible before writing and review arbitrary custom-packed outputs with target engines. |

The strongly alternating triangles in Paint-clean-controls and Rendering-output belong to the deliberate two-material-set verification fixture. They demonstrate independent material ownership and are not the default material appearance. Start with the neutral built-in material or examples/Rendering-prop.s3d for ordinary authoring.

The material created by the package's import/library test was moved to examples/Texture-pack-library-demo.s3mat. It remains available for deliberate import rather than appearing automatically in the initial library.

Artist validation still needs representative props, HDRIs, high/low meshes and another GPU. The unimplemented artist and rendering requirements remain in Rendering-and-artist-roadmap.md.
