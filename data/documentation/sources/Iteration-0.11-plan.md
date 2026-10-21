# Surface3D 0.11 implementation plan

- [x] Reproduce graph delay; avoid whole-document thumbnail replay, cache unchanged layers, prune spatial source passes to dependencies, measure Edge Detect graph edits.
- [x] One visible Coordinates node: fill/raw UV, position, normal, polar, cylindrical, spherical, box, triplanar; shared transforms and image sampling.
- [x] Ctrl-hover explanations for every implemented node, including types and use.
- [x] GPU Physics brush node: authored source strokes, rain film transport/deposition/evaporation and dirt diffusion/settling; editable controls, play/pause/reset and mask output.
- [x] Folder masks: white/black/paint/procedural controls, same shared result across members, persistence and independent child masks.
- [x] Separate Layers from node inspection; explicit Material/Mask ownership, compact expandable effects; dedicated Node Properties.
- [x] Core/GPU behavioral tests, native visual review, backward project reads, new executable/package and artist test guide.

Simulation contract: an original bounded surface-film solver on UV texels and mesh-derived connected edges, not a volumetric fluid engine. Fixed timesteps, nonnegative conservative transport, gravity and evaporation/deposition. Painted sources and settings are document state; simulation textures are derived and replayable. Cross-island transport uses mesh adjacency rather than treating atlas neighbours as connected.
