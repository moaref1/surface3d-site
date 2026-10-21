# Surface3D production workflow development

User request: implement the twelve missing-feature areas, typeable numeric parameters everywhere, neutral templates, fifty grouped ready generators/effects, UV-seam handling for baking/brushes/layers, and lock/link XYZ parameters.

An item closes only with working authoring/evaluation/persistence and suitable validation. A renamed preset or button does not close an engine gap. Existing 0.12 and earlier release packages stay independent.

## Immediate artist controls and seam foundations

- [x] Numeric fields across Paint, Graph, Bake, Export, viewport and brushes: direct keyboard entry, finite/range validation and correct undo.
- [x] Neutral new project, fill/paint/graph/export templates; effects are optional and don't impose colors or masks.
- [x] Fifty categorized generators/effects with actual editable graphs, semantic mesh-map inputs, plain-language parameters and previews.
- [x] XYZ linked editing and independently locked axes where applicable; persistence and undo.
- [x] Split-UV regression meshes, brush footprint continuity, layer/filter edge padding and bake island/tangent quality diagnostics.

## Production engine backlog requested in full

- [ ] Multiple texture sets/UDIM, larger textures and bounded tiled processing.
- [ ] Higher-precision export, additional formats, cancellable background jobs, per-set output and portable templates.
- [ ] Nested folders, isolated composites, group opacity and folder-mask anchors/shared graphs.
- [ ] Tablet pressure, independent stroke opacity, alpha/preset/symmetry brush capabilities and additional painted channels.
- [ ] Cage offset/skew painting/editing; source material/vertex ID and color/emission/alpha transfer; curvature quality.
- [ ] Automatic memory eviction, channel-aware allocation, tiled residency and dependency cache profiling.
- [ ] Nested executable subgraphs, reusable multi-output functions and node output sockets.
- [ ] Flood Fill, distance transforms, richer Tile Sampler, Blue Noise, reaction diffusion and requested procedural families.
- [ ] Configurable simulation resolution, seam/small-island controls and validated extended physics.
- [ ] GPU primary projection and hardware-tracing backend.
- [ ] Keyboard access, shortcut preferences and DPI/layout acceptance.
- [ ] Reference assets and Blender/Unreal roundtrip/GPU coverage, with explicit limits.

## Reference and verification

Use the supplied Painter screenshots/video notes for grouped Assets, Layers/Properties and effect controls. The numeric and UV behavior must remain independent original code. Verify with split-UV geometry, actual GPU pixel comparisons, project roundtrips and native mouse/keyboard actions. Review captures before packaging.

## Remaining seam work

- [ ] Continuous surface-aware filter kernels across rotated UV charts; edge extension currently prevents empty-border sampling.
- [ ] Pressure/alpha/symmetry footprints and simulation-source painting across UV seams.
- [ ] Automatic mip-dependent gutter sizing and stacked-UV authoring policy.
- [ ] Wide asset acceptance including the remaining sample missed in the supplied cube's fitted projection.
