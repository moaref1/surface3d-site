# Surface3D 0.20: layering foundation

Reference: the reviewed 2026-10-09 19-06-36 video and Layering-video-review-2026-10-09.md. This milestone implements the compositing foundation; it does not certify the entire production roadmap.

## Implemented; development checks passed (51/51)
- Independent blend modes and opacity for eight channels; Material edits compatible channels together, mixed state is explicit.
- Color Burn, Color Dodge, Soft Light and Disable; normal-only RNM/Replace/Whiteout/UDN; signed height Add/Subtract/Min/Max.
- Layer Pass Through transforms immutable accumulated input; non-pass channels retain their authored source. Masks and channel weight fade the adjustment once.
- Neutral Levels adjustment creation above selection, one undo action, chosen channels only, no automatic mask.
- Folder Pass Through versus isolated composition, per-channel modes/opacity, explicit coverage and one group mask/density operation.
- Every mask entry owns blend/opacity, including adjustment filters; GPU and native dropdown regression coverage.
- Folder material selection no longer shows mask properties; Pass Through fill channels hide unused source controls.
- Root mask density: 100% preserves the authored mask; 0% reveals the owner, independently of layer opacity.
- Compact channel/blend/opacity header, target breadcrumb, channel settings copy/paste/reset, opacity/density reset; thumbnail selection replaces duplicate Properties radio buttons.
- Levels/Invert/Blur support Height, AO, Emission and Surface opacity in addition to color/roughness/metallic. Normal remains unchanged by scalar Levels.
- Lazy, bounded adjustment/group scratch resources included in memory estimates; built-in graphs share one kernel so ordinary topology edits do not compile new variants. Custom HLSL variants retain used node kinds and bucketed intermediate-value capacity.
- Schema 22 persistence, older schemas remain readable. Sealed 0.19 is untouched.

## Required acceptance
- Numeric GPU tests: channel isolation, lower-stack refresh, mixed source/pass, zero/full opacity, mask density, folder coverage/Multiply, signed height, normal identity and save/load.
- Native input: choose roughness blend and type 37% without altering color; choose Pass Through; inspect folder/mask controls.
- Full core/GPU/native regression suite: 51/51 passed. Real UI captures reviewed twice. Separate packaged-executable validation remains open.

## Still open after this foundation
- Nested folders and folder material/filter effect stacks.
- Multi-selection, bulk reorder/grouping and linked layer/folder instances.
- Live Levels histograms and component curves.
- Explicit Stack Below/Previous Effect graph nodes and staged typed anchors, including Pass Through anchor consumers.
- Clipping/range masks and per-effect masks.
- Beyond-eight-layer residency, dependency-aware folder caching and large-stack performance acceptance.
- Full generator/brush/UDIM/baking/rendering production roadmap remains tracked separately.

Do not label these open items implemented. Root folder masks are editable graphs; this is not a nested folder-material graph system.
