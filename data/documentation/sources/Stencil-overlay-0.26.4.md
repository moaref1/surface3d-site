# Brush stencil overlay

The Brush tab shares the right-hand Properties dock. The top brush-settings button opens that tab. It contains size, flow, brush tip, stencil and stroke controls, and supports the existing panel grab/docking behavior.

Choose or drop a texture in Stencil, then enable it. Show overlay controls visibility. Overlay opacity affects display only; Mask strength affects painting. Position, scale and rotation control the stencil; Levels, gamma and inversion control its paint mask. Hold S over the viewport: left-drag moves, right-drag scales, middle-drag rotates without painting or navigating.

In 3D the plane faces the camera. Every dab stores its projection, so subsequent camera changes do not move existing paint. Both ordinary brushes and Paint nodes use per-pixel projection through the surface position map. In 2D the stencil is aligned to texture UV space and follows canvas pan/zoom. Split view displays each canvas's stencil. The overlay displays the source texture; Levels/inversion apply to paint coverage rather than changing the source thumbnail.

Project schema 30 stores dab projections. Older projects remain readable; earlier builds cannot read newly saved schema-30 projects. Overlay visibility and display opacity currently belong to the running brush UI session.

Verification passed: projected plane pixels compared against matching UV pixels for ordinary brushes and Paint nodes, projected placement changes, ordinary/graph stroke persistence, existing Levels/gamma and bounded spatial-chain checks. Native context, floating-panel docking and docked Layers detaching/redocking checks passed. The right-side Brush tab and camera-facing overlay screenshot were inspected. Initial shader compilation exceeded the old 120-second stencil-test timeout; the native first compile completed in 200 seconds, and the warm stencil/UI checks then completed in seconds. The stencil test now allows 300 seconds for a cold cache.

Build: build-023/Surface3D-0.26.4-stencil.exe, with its adjacent runtime and shaders. Screenshot: build-023/studio-context23-evidence/Stencil-overlay.png.
