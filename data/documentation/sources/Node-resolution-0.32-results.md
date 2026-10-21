# Surface3D 0.32 — actual mixed-resolution nodes

## Artist controls

Each processing node has Calculation Resolution: Default / Project / Custom (256, 512, 1024, 2048, 4096). Default is min(texture-set resolution, project node cap), initially 1024. Painting and final texture-set output retain their authored resolution.

Resample inputs before processing:
- Checked: align inputs to the chosen output resolution, then calculate there.
- Unchecked: calculate at the first connected input node's output resolution; align secondary inputs to it; resize the result to the chosen output resolution.

Input / Process / Output sizes are displayed. Material/Mask terminals compose at project resolution; Output Texture retains its separate publication-resolution controls.

Preferences includes Default node processing cap and Use Default in current graph. Existing projects migrate to Project mode to retain appearance; the button explicitly opts an old graph into the capped default. New nodes default to capped processing. Existing custom overrides remain intact.

## Implementation

Resolution boundaries are materialized in GPU float textures, not exported files or CPU readbacks. Equal-resolution prefixes stay fused. A shared-device worker reuses immutable library texture views. Cache identity includes node ancestry, calculation/output dimensions, processing order, source epoch and necessary layer/folder context. Cached upstream boundaries remain valid for downstream edits. Cached results are bounded to 256 MiB; oversized graphs can evict and recalculate fields.

Color is filtered in working linear space with premultiplied alpha. Normals are renormalized. Signed data remain floating point. Integer/boolean outputs and region/placement fields use point resampling. Multiple inputs follow the first connected input when processing-before-resampling is chosen.

Schema 33 saves resolution controls and the project cap. Older builds cannot read newly saved schema-33 projects; keep original copies.

New node previews stay collapsed by default. Thumbnail work is skipped when none are expanded. Temporary lower-resolution editing remains off by default; saved explicit preferences are respected.

## Evidence and limits

GPU tests compare a 256px Blur followed by 512/1024 upsampling with an independent uniform-resolution reference; checked/unchecked orders must differ. Tests cover repeatability, upstream cache invalidation, unit normals, transparent-color fringes, signed height and actual 1K calculation in a 2K project. Core tests cover serialization, invalid settings and old-project migration; material/function tests cover propagation through expansion.

Upsampling adds pixels, not recovered detail. Multiple resolutions add GPU passes and working memory. The 1K cap is a quality/performance choice, not a universal real-time guarantee. Cold shader compilation, fresh CPU spatial analysis and heavy custom 4K nodes can still stall. Measurements and final test results follow below.

## Measured sample

Plane 2K controlled graph, Default node cap 1K, RTX 5050: own-edit medians (three changes, full diagnostic readback included): Noise 78.44 ms, Blur 93.99 ms, Bevel 88.17 ms, Tile Sampler 184.87 ms. Synchronous submission was 2.63, 3.22, 16.12 and 8.63 ms respectively. These early samples precede shared preview-root reuse, and do not show a universal completion-time improvement. They must not be presented as real-time guarantees; the final result includes 2K composition, additional resolution passes and readback. Raw samples are in work/resolution32.

## Additional fixes

- A previewed node is materialized once and reused by its dependent output path, rather than recalculated independently for preview and material output.
- Region/placement point-filtering is preserved through reroutes and function aliases.
- Live physics masks are sampled from the parent simulation, not restarted in the resolution worker. Their resolution control sizes the sampled mask; it does not change the surface solver topology.
- Folder physics updates now invalidate the final composite after updating the folder mask. A regression reproduced the stale background-only image and now passes in both normal and uniform-reference modes.
- Live texture publication cache identity includes the project node cap.

## Final build

17 core/GPU/workflow checks passed, followed by the final 4-check rerun covering physics, mixed-resolution pixels, live publication and nested graphs (74.51 seconds). Portable startup was captured successfully with no Error.txt content. The build is releases/Surface3D-0.32-node-resolution/Surface3D.exe; keep the whole folder.
