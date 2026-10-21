# Output, persistent paint and node interaction refinement

Scope: plan items 8, 9 and 10 only. No baking, OpenPBR, DLSS or rendering changes.

## Implemented

- Output Texture: independent project/256/512/1024/2048/4096 resolution, persisted Manual/Live/After adjustment policy, producer-side automatic updates even without a live consumer, stable identity, rename propagation, actual Float32/linear-color or data indication, linked texture entry count, last-publication dimensions and EXR Float32 snapshot export. Existing consumers and cycle detection are retained.
- Node search: all built-in descriptions are searchable; separate words match independently; hover descriptions; persisted Favorites/Recent filters; releasing a socket drag onto empty canvas opens a type-matching search and inserts/connects the chosen built-in node. Existing right-click, Shift+A, Enter and contextual layer/mask controls remain.
- Persistent painting: mesh replacement transfers surface-attached dabs using geometry correspondence and barycentric attachment rather than old UV lookup. Exact geometry with new UVs and bounded same-order deformation are supported; correspondence is built once per texture set. Layer, effect, folder and graph Paint dabs and graph definitions are retained. Texture sets are matched by material name, including inactive sets. Clone source UV offsets transfer through their own surface attachments. Unsupported matches reject replacement atomically instead of relocating paint silently. Existing stroke records are saved, replayed and undoable; canvas-only painting remains UV/canvas space.

## Limits still open

- General retopology transfer with artist-visible uncertain matches is not implemented. Deformation matching assumes stable corner ordering and checks displacement/normal thresholds; it is not semantic object tracking.
- Brush normal/tip orientation and clone footprint equivalence across arbitrary UV rotations/distortion need further acceptance. Physics results are not automatically transferred as a simulation cache.
- Search automatically connects exact socket types; comprehensive conversion-aware ranking, function/asset suggestions in this socket search remain open.
- Output Texture retains Float32 working data. Arbitrary usage metadata, alternative internal precision, detailed consumer navigation, explicit stale fingerprints and background publication remain open. Live publications can still perform synchronous GPU readback.

Run the new native output-controls fixture and surface paint transfer tests alongside the existing regressions before sharing the build.

Update policy note: Manual disables producer-initiated refresh; an existing consumer with Auto update enabled can still request a refresh. After adjustment defers producer publication during an active mouse drag. Float32 describes the published pixel storage, not a guarantee that every GPU intermediate computes at Float32 precision.


## Trim import and replacement fix

- Visible node name is Output Texture (Anchor); serialized node type and resource IDs remain compatible.
- Mesh UVs are preserved outside 0–1, including negative/repeated trim coordinates. Non-finite and extreme numeric coordinates remain invalid. This does not provide multi-tile UDIM baking; current baking remains a single atlas.
- UI mesh replacement retains unmatched surface marks as UV-space paint and reports the count. Matched marks still reproject; undo restores the previous mesh. Strict core transfer remains available by omitting the fallback counter. Material-set splitting/removal still has protective checks.
- Shared GPU-only live output reuse remains pending; the current live implementation still publishes through CPU readback.
- Regression: trim coordinates remain unchanged; unmatched marks retain UV placement; existing successful reprojection and persistence checks pass.


## Manual brush locality

Manual 3D seam-aware paint now passes an explicit object-space radius derived from the viewport brush size, instead of magnifying its footprint according to local UV density. CPU tests verify radius invariance under a 100x UV shrink; GPU tests verify a small-chart stroke paints its hit and leaves distant regions untouched. Stacked/repeated UVs still share pixels and therefore repeat texture paint. The UV-only brush mode and existing stored strokes retain their prior behavior.
