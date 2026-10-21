# Surface3D 0.8: added features awaiting artist acceptance

The 24 automated core/GPU/native-input checks pass on the tested Windows/NVIDIA system. These hands-on checks remain deliberately unchecked: usability and real DCC/game assets need artist evidence.

## First prop

- [ ] Open Reusable-procedural-pipe-0.8; edit/reset tint, detail scale and normal strength, save/reopen.
- [ ] Import a triangulated Blender/Unreal prop; verify UV orientation, scale, grouping and navigation.
- [ ] Texture with a fill, paint layer, mask generator, normal/height and baked-map input.
- [ ] Resize panels at 100%, 150% and 200% Windows scaling; verify dialogs/channel controls remain reachable.
- [ ] Check icon meanings/tooltips and mask ownership on a crowded stack.

## Bake and cage

- [ ] Bake all ten geometric categories on a real prop with Low to low.
- [ ] Import a high and verify High to low is selected automatically.
- [ ] Test named groups, missing matches and unwanted neighboring detail projection.
- [ ] Import valid and inward/reversed cages; verify actionable rejection of the latter.
- [ ] Compare relative/source-unit front/rear distances, projection-normal blend and ray limits.
- [ ] Inspect Check projection coverage in 2D/on the mesh, then check final-resolution subpixel detail.
- [ ] Change sources during a job and cancel another; verify earlier completed maps remain intact.
- [ ] Rebake images used in graphs; verify stable IDs update without repicking.
- [ ] Compare mirrored UVs, hard edges, cage discontinuities and normals in Blender/Unreal.
- [ ] Fill the image library; verify atomic publication failure and direct ready-map export.

## Graph and HLSL

- [ ] Publish material/mask assets, expose numeric/vector/color/image controls and verify linked instances/independent overrides.
- [ ] Export/import .s3graph with default images; detach an instance without changing its result.
- [ ] Reject cycles, insert reroutes, duplicate/paste blocks, arrange selection and sweep-cut/undo.
- [ ] Space-preview typed nodes and double-click mask preview; verify exact prior view restoration.
- [ ] Edit HLSL signature/code, compile a new variant, keep working during compilation and enter an error.
- [ ] Check failed-draft retention, undo/redo and changed/removed-owner handling during compilation.

## Export

- [ ] Import Blender/Unreal outputs with correct color/data/normal settings in those applications.
- [ ] Duplicate a template, edit packing, select Use for export and compare the actual output list/files.
- [ ] Test grayscale/RGB/RGBA alpha, actual-AO ORM, signed height and custom normal packing.
- [ ] Save/reopen templates/destination/name; verify Unicode paths and existing-job protection.
- [ ] Measure a 2K layered export's responsiveness/memory; it is currently synchronous PNG8.

## Unfinished development requirements

GPU tracing, painted cage offset/skew, cage estimation, MikkTSpace certification, material/vertex-color ID and source color/emission transfer, 16-bit/EXR/4K/UDIM/multiple sets, persisted bake provenance, nested executable graphs/arbitrary multiple outputs, the full requested node catalogue, nested layer/group masks, full brush/tablet behavior, broad accessibility and cross-hardware performance. These are implementation tasks, not features merely awaiting artist testing.
