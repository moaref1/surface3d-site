# Surface3D 0.11 verification

## Behavioral evidence

physics_and_editor_foundations exercises the actual D3D11 solver and texture renderer:
- Nonnegative finite state and mass conservation for closed rain/dirt transport.
- Gravity reversal, deterministic fixed-step replay, evaporation/deposition and source clearing.
- Independent results from multiple Physics brush nodes when graph storage and evaluation order differ.
- Ground source band/height/gravity and AO cavity retention.
- Symmetric reverse edge pairs and cube transport across UV seams.
- White/black/inverted folder masks, independent child mask, procedural folder graph and preview isolation.
- Numerical UV/Position/Normal/Polar/Cylinder/Sphere/Box coordinates, texture-local triplanar mapping.
- Edge Detect editing/readback timing; no texture replay for moving a node or requesting unchanged thumbnails.
- Ctrl-help coverage and schema-12 exact source/folder persistence.

studio_texture_drag_coordinates_and_brushes drives real editor input, including library texture drags, Custom HLSL search, node placement/snapping, preview restoration, Rain/Dirt creation and painting a simulation source on a picked mesh. Its extended path exercises folder context-menu mask creation and mask preview restoration.

All 31 required development checks passed. Eight actual packaged checks passed: physics source, folder simulation, shared projections, native artist interaction, shader/bake/export authoring, plain GPU workflow, custom project and original 0.10 project loading. The direct shader-preprocessing portability check also passed. Hardware is the local Windows NVIDIA GeForce RTX 5050 adapter; this does not certify other adapters.

## Measurements

The GPU fixture reports elapsed wall time for a 256px Noise → Edge Detect graph change followed by actual texture readback. This includes submission and waiting for completion, not just CPU submission. It is a small warm fixture, not a production graph/FPS guarantee. Cosmetic-node and unchanged-thumbnail assertions check zero replayed layers independently of timing.

The solver limits work to four steps per active node/frame; GPU state stays resident and UI advance does not read state back to the CPU. Tests explicitly read state for correctness. General graph shader compilation and first mesh topology construction still have cold-start cost.

A direct D3DPreprocess check confirms identical active source in build and release working directories. The previous relative diagnostic filename embedded the working directory into cache keys; the stable virtual source name fixes that. Packaged runs independently check launch behavior after relocation.

## Scope

Simulation is conservative paired surface transport, not calibrated volumetric fluid dynamics. No splashes, mesh erosion, arbitrary resolution or production device/UV certification. Folder masks multiply pass-through children; no nested/isolated group semantics or folder anchors/shared bindings. The existing broader request catalogue retains unimplemented features.

Native screenshots show actual editor layouts. The prior screenshots and 0.10 release remain preserved.

The empty-cache full suite took 164.96 seconds, including 127.24 seconds in the first test to compile the general shader. That bytecode ships in the package. The release-folder checks reused the portable cache. Cold shader compilation remains slow if the cache is removed or source changes.
