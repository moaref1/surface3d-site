# Surface3D 0.19 refinement checklist

Preserve sealed 0.18 and earlier releases. Use original C++/HLSL and public interfaces. This iteration prioritizes brushes, layers/masks, node correctness, Normal + Height and bake feedback. Remaining production work stays in the master plan.

## Brushes and artist controls

- [x] Carry spacing across events, interpolate pressure, stabilize and reset discontinuous gestures.
- [x] Stroke opacity cap separate from per-dab Flow; persistent stroke IDs, one undo per gesture and Paint-node replay.
- [x] Eight material channels with independent coverage/erase and sensible channel bounds.
- [x] UV tip roundness/angle, concise settings and typed values.
- [x] Correct compact FP16 rounding for overlapping low-flow dabs.
- [x] Clip UV Paint-node dispatches into disjoint wrapped rectangles; retain geometry fallback.
- [x] Photoshop B/E, brackets/Shift-brackets, number opacity/Shift-number flow, X/D and precise cursor with focus guards.
- [x] Windows native pen-pressure input, size/flow flags; real tablet acceptance remains below.
- [ ] Alpha-image tips, pressure-adaptive spacing, Shift-click straight strokes, symmetry/stencil/text tools and full Photoshop brush parity.

## Layers and masks

- [x] Shared View / Blend / Opacity header changes the selected effect or layer as appropriate.
- [x] Clear owner/target breadcrumb, violet mask context and teal material context.
- [x] Remove duplicate effect Blend/Opacity and duplicate toolbar target switch.
- [x] Disable unsupported filter blend/root-mask combiner fields rather than editing a different target.
- [x] Native typed mask-effect opacity and blend edits preserve parent settings.
- [ ] Independent root-mask strength and combiner; nested folders; broader artist/DPI acceptance.

## Node contracts and parameters

- [x] Audit 114 stable kinds, typed default paths, default GPU execution and finite outputs; provide Node-contracts.csv.
- [x] Component-wise color/vector adjustments, alpha-preserving Blend, resolved resource-input types and optional Base normal for Height to Normal.
- [x] Normal Map/Normal Blend, Switch and height/blend socket names reflect data semantics.
- [x] Math/Vector Math operation-specific active ports/defaults; disable connected defaults; correct Scale and refraction Eta labels.
- [x] Preserve saved grayscale behavior, node IDs and unused connections across operation changes.
- [x] Retain focus-aware shortcuts, previews, selected arrangement, reroutes, cutting/search and explicit texture outputs.
- [ ] Full Designer/Blender parity, all operation permutations, richer group headers/drag and live nested multi-output functions.

## Normal + Height

- [x] Shared reoriented combination in mesh/UV inspection, sampled rendering and normal export.
- [x] Keep Height independent; encode normal convention after combination.
- [x] Analytic flat-height/base-normal and ramp checks.
- [ ] Match the analytic no-mesh sphere and verify hard/mirrored/seam derivative cases against production assets.

## Baking and scheduling

- [x] Separate enable toggle from map-name preview; retain Alt isolation, sweeps and graph drops.
- [x] Show all ten map choices in the default Bake dock.
- [x] Bounded progressive mailbox; CPU rows/GPU batches supply provisional object/2D previews.
- [x] Separate partial previews from atomic publication; cancel/stale/set ownership preserves prior assets.
- [x] Draft/Balanced/Fine/Ultra sampling with 1/4/16/64 primary AA and bounded GPU packets.
- [x] CPU/GPU agreement at 64 AA; CPU fallback on software adapters.
- [x] High-resolution readback wait with cancellation/deadline and compatible fallback; scoped NVIDIA measurement.
- [x] Re-run Desktop low/high cube: 120984 fitted hits, zero misses; retain insufficient-distance reports.
- [ ] GPU primary projection, high-resolution tiled/float maps, cage/skew painting and repair tools.

## Rendering and cameras

- [x] Preserve compute GI/shadows/reflections and separate Rendering controls.
- [x] Thin-lens image DOF, Focus distance/F-stop, saved cameras and focal-plane/defocus checks.
- [x] Probe DXR capability and distinguish it from compute execution.
- [ ] DXR/RT cores, DLSS, interactive hybrid GI, denoisers, transmission/caustics and independent optimized CPU tracing.

## Acceptance

- [x] Build and 49/49 development checks, including native input captures.
- [x] Separate NVIDIA node/brush/64-AA checks; WARP fallback coverage.
- [x] Two UI reviews: initial captures and final input-driven captures.
- [x] Update guide, architecture, notes and checklist.
- [x] Separately package and verify 0.19: 14/14 packaged native checks; seal/archive after acceptance.
- [ ] Tablet, AMD/Intel, narrow/high-DPI windows, photographic brush and production cage/seam acceptance.
