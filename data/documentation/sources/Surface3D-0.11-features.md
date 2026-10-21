# Surface3D 0.11 — simulation brushes and graph foundations

This update changes the Rain and Dirt choices from procedural weathering stamps to editable GPU simulation nodes. Older weathering strokes still replay unchanged. The engine is original C++20 / D3D11 / HLSL; it does not use installed Adobe or Marmoset code.

## Physics brush

Add **Physics brush** from the Simulation category or search. The Rain / Dirt choices in Brush settings and the brush library create this node in a mask graph and enter **Paint source**.

1. Select the layer material or mask, or a folder mask. Open its graph.
2. Add Physics brush. Connect its Value output to Mask Output, a material channel, or ordinary math/blend nodes.
3. Choose Rain film or Dirt transport. Click Paint source and paint on the mesh or UV view. 1 paints; 2 erases. Alt navigation stays available.
4. Finish source painting. Set Time steps, or press Play/Pause. Reset time returns to zero; raising the target replays the simulation.
5. Change Source rate, Flow/Transport speed, Deposition, Spread/pressure and Gravity. Rain also exposes Evaporation and Dirt in water.
6. Choose Deposit, Water, Mobile dirt or Wet trail as the node output. Mask gain changes the output without discarding simulation state. Space previews the selected node on the mesh/2D; press again to restore.

Sources can be Painted areas, Ground contact, Paint + ground, or Whole mesh. Ground height controls a band relative to mesh bounds and gravity. Painted source dabs and settings are saved, so the graph can be reopened and edited. Clear source clears the painted dabs; an enabled ground/whole-mesh source continues to supply material.

Baked AO connects automatically to **Cavity trapping**. Dark AO regions slow outgoing transport and encourage deposition. Without AO the solver uses neutral cavity data. Mesh positions and welded triangle adjacency define transport edges, including bounded connections between UV islands.

### Exact simulation scope

The node evolves water and suspended dirt, transports paired fluxes along a connected surface graph, deposits mobile dirt and evaporates water. With sources/evaporation/deposition disabled, its closed-boundary transport conserves mass. Fixed-step replay is deterministic on the tested adapter.

This is a **surface-film approximation**, not a volumetric fluid/splash solver or calibrated SI-unit simulation. The editor uses a 128 × 128 simulation grid, 30 fixed steps per simulation second, a maximum target of 240 steps, 4,096 source dabs per node and eight Physics brush nodes per graph. The app advances at most four steps per active node per frame, then updates the affected graph. Multiple active simulations increase frame cost. Output samples into the project texture resolution; increasing texture resolution does not increase simulation resolution.

UV overlap, very small islands and narrow geometric features need artist review. Cross-island connections approximate geometric seams with nearest cells of adjacent triangles; they do not provide exact finite-element continuity. Mesh erosion, volume collision, splashes, calibrated viscosity and production resolution scaling remain future work. Rain/Dirt are two modes of one solver node.

The virtual-pipe GPU approach in [Mei, Decaudin and Hu (2007)](https://www-evasion.imag.fr/Publications/2007/MDH07/FastErosion_PG07.pdf) informed the transport design. Surface3D implements its own mesh-connected mask solver; it does not claim reference-algorithm equivalence.

## Folder masks

Right-click a folder → Mask → Add white mask / Add black mask / Remove mask. An indented **Folder mask** row is separate from child material/mask thumbnails. Select it to edit the folder mask; double-click its icon to preview, and double-click again to return.

Properties exposes Enabled, Invert, Background, Edit mask graph, Paint folder mask and Clear painted mask. Empty folder graphs start with Input Mask → Mask Output, preserving painted strokes. Folder graphs accept textures, procedural nodes, Custom HLSL and Physics brush. Drag a library texture onto the folder-mask icon to use it as the graph source.

A folder mask multiplies every member's contribution; child masks remain independent. Folders are flat pass-through groups, not nested or isolated group composites. Folder graphs currently cannot read layer anchors or bind saved shared graph definitions. Their mask data persists in the project. GPU mask storage is separate; unrelated material scratch textures are reused.

## One Coordinates node

New creation menus expose one Coordinates source, with Fill UV, Raw UV, Position, Normal, Polar, Cylindrical, Spherical, Box and Triplanar modes. It exposes scale, offset, rotation, cylinder/sphere axis and triplanar blend sharpness. Use Separate XYZ to extract components.

Connect the vector to multiple image/noise nodes to share projection. Image nodes retain texture-local scale, rotation, offset, wrap and filtering. Triplanar image sampling honors these controls and blends decoded color in linear space. Mapping and Vector Transform remain operations on coordinates, rather than competing coordinate sources.

For triplanar image sampling, connect Coordinates directly to Image texture. General vector math produces a plain vector and currently drops the projection marker. Blend weights use the geometric object normal; transformed projection-normal metadata is not implemented.

Older axis, Fill Coordinates and dedicated Triplanar Texture nodes remain readable but are hidden from new creation. There are 109 stable internal kinds; this number includes compatibility kinds and is not a claim of Blender/Designer parity.

## Layers and node inspection

Layers owns the selected material/mask and its effects. Only the active context's effects expand. Mask ownership remains violet. **Properties** edits the layer/effect; **Node Properties** edits the graph selection in its own docked pane. Selecting or moving a node no longer takes over or scrolls the layer inspector.

Hold Ctrl while hovering a node to see its purpose, input/output types and conversion behavior. All implemented and legacy node kinds have descriptions. Node input labels wrap above the connection picker so the narrow inspector remains readable.

## Graph latency changes

Unchanged layers keep evaluated textures. Cosmetic edits such as node position/name/collapse do not replay texture data. Unchanged thumbnail requests no longer trigger whole-document replay. Spatial input passes evaluate only the requested dependency closure, so unrelated costly nodes are excluded from that prepass. Direct painting is explicitly marked dirty, preserving correct undo/replay.

This is not a complete persistent per-node field cache. Actual connected filter changes still evaluate affected graph passes, downstream anchors can require upper-layer replay, and first-time shader compilation has a cost. Exact-source bytecode caches ship in the release.

Shader preprocessing uses a stable virtual source name, so the cache is independent of the launch folder. Packaging or moving the app no longer invalidates every shader through diagnostic file paths.

Multiple Physics brush outputs bind in topological evaluation order, preventing one node from reading another simulation's result. The native painted-source test checks a nonempty GPU deposit mask, not only saved stroke data.

## Project compatibility

Writer schema is 12; readers retain schemas 1–11. It stores simulation sources/settings and folder masks. Earlier applications cannot open new schema-12 files. Older release packages remain available. Save a copy when upgrading a project you want to retain for 0.10.
