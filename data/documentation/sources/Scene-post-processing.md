# Scene and post processing

Scene is available next to Texture Sets in the default Paint/Graph layout. Its eye buttons hide/show individual objects. Rendering keeps its Scene outliner on the left. Switching workspaces/resetting the layout applies the default docking; saved custom docks can be moved manually. Alt camera navigation no longer highlights hovered objects. Alt-click selection is retained.

Below Cameras, Rendering has a collapsible Post Processing section with Vignette, Grain, Chromatic aberration (edge separation in pixels), Brightness, Contrast, Sharpen, Bloom, Color tint, Saturation and Reset. Defaults preserve the original image. Controls are typed and update the raster presentation in real time. Effects preserve alpha and skip non-beauty render passes; texture/data exports are unaffected.

This is a display-space image pass, including an inexpensive bloom approximation and deterministic grain. It does not yet apply to the separate ray-traced export path. Post settings are project-wide, not per-camera. Schema 28 saves the settings; older project versions load neutral defaults. Older executables cannot open schema-28 saves. Post-processing image allocations are included in the GPU estimate.

Verification: targeted CPU/GPU brush-and-library regression passed, including changed rendered pixels with post enabled and schema-28 save/load equality. Rendering UI capture inspected; long control labels receive enough space. Full 58-test suite was not rerun for this change.
