# Surface3D 0.19

Run **Surface3D.exe** with the included folders/DLLs. This standalone Windows development release retains Paint, Bake, Rendering, Graph and Export, original branding and prior tools.

Added: clearer selected-effect Blend/Opacity ownership; eight-channel brushes and independent erase; stroke opacity/flow, stable spacing, UV ellipse tips and Photoshop brush keys; corrected node types/parameters and component-wise color adjustments; Normal + Height in mesh/UV/ray rendering and texture export; live provisional bake previews, separate map selection/enablement and higher sample presets; thin-lens image depth of field and saved-camera lens controls.

Read [the artist guide](docs/Surface3D-0.19-artist-guide.md), [verified checks](Verification.md), [iteration checklist](docs/Iteration-0.19-plan.md) and [remaining production work](docs/Rendering-and-artist-roadmap.md). Examples and actual native captures are included.

GPU GI currently uses D3D11 compute, not RTX/DXR execution. The DXR label reports capability only. Baking remains CPU primary projection plus optional GPU secondary work, RGBA8, up to 2048. Full production cage/skew repair, high-resolution/float baking, full node-suite parity and universal hardware validation remain open. Tablet pressure input needs testing on a real pen device.

Older 0.18 and earlier packages remain separate. Version 21 projects retain readers for 1–21. Keep shaders and warmed cache beside the executable; custom shaders may require compilation. Visual Poly Haven remains a reusable material/HDRI/model library integration; the unchanged API integration includes prior live-test provenance from 0.18, and native browser fixtures use labeled original offline swatches.
