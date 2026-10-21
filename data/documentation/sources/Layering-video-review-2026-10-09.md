# Surface3D layering improvements from the 2026-10-09 video

Analysis only. No application or sealed release changed. Reference: C:/Users/pouya/Videos/2026-10-09 19-06-36.mp4, duration 60.35 seconds, 1280x720, 20 fps. Reviewed 121 samples at 0.5-second intervals, full-view overview sheets, the entire layer-row sequence and enlarged Properties/menu crops. Timing below is approximate. The earlier recording mainly exposed viewport/UV results; this newer recording exposes the layer controls.

## What the recording actually shows

| Time | Observed action/result | Design implication |
| --- | --- | --- |
| 0-12 s | Base color is the stack's selected channel. You select fill layers and try modes including Color Burn, Divide, Subtract and Normal; UV colors change. | Mode exploration should be fast, channel-aware and reversible, with a readable full name. |
| 14-19.5 s | You create Fill layer 8 and add Levels - Base color beneath it using the Effects menu. | Adjustments need an easy entry point, accurate owner/target indication and automatic channel-specific setup. |
| 19.5-28.5 s | Levels Properties has an affected-channel selector, histogram/handles and reset controls. You reopen the owning fill's blend menu and point to Pass Through. | Distinguish the effect's channel from the layer's compositing behavior; show the input scope before editing. |
| Around 29 s | Fill layer 8 changes to Pthr. The preview changes; the Levels histogram subsequently reflects the inherited input. | Layer-level Pass Through must supply the accumulated lower channel as input to its effects. |
| 29-39 s | You move Levels handles; the underlying UV artwork changes continuously. | Real-time numerical handles, histogram and node-backed editable adjustment; no flattening required. |
| 40-43.5 s | You reduce the Pass Through layer opacity; the visible row subsequently reads about 74%. | Opacity must fade the transformation against its incoming stack, not erase or attenuate the original stack twice. |
| 44-51 s | You multi-select several fills, create Folder 1 and drag the selected layers into it. The children become indented together. You inspect the folder context menu. | Multi-selection, group creation, drop targets and bulk Properties must be complete. The context menu alone does not prove a folder mask was applied. |
| 52-55 s | You open the folder blend menu and choose Subtract; its row reads Sub. | A folder needs its own compositing result, channel mode and opacity. |
| 56-60 s | You vary folder opacity and return it to 100%; the preview changes. | Folder opacity must have defined behavior independently of child opacities and adjustment layers above it. |

The viewport remains in Material display while the Layers selector is Base color. Those are distinct concepts. This recording does not show normal/height composition, anchor creation, nested folders, painting gestures or an actual folder Pass Through selection. Those requirements come from earlier requests and public documentation, not invented video observations.

## The two Pass Through behaviors

Painter's layer Pass Through makes accumulated lower-channel data available to an upper layer's processing. Photoshop's group Pass Through allows child adjustments/blends to interact with the surrounding stack; changing the group's mode isolates its internal composite. Both behaviors belong in Surface3D, with explicit scope. Sources: [Painter blending](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/interface/layer-stack/blending-modes), [Photoshop groups](https://helpx.adobe.com/photoshop/using/layer-opacity-blending.html).

The following are proposed original Surface3D contracts, not claims that Adobe uses these exact internal algorithms.

For an adjustment channel, let B be the immutable accumulated input, R its transformed result and w the effective adjustment weight after its channel opacity and mask. For scalar/color fields, preview the adjustment as B + w*(R-B). At zero weight, disabled effect, black adjustment mask or identity transform, preserve B exactly. Normal fields need normal-aware interpolation and normalization, not this arithmetic applied to encoded RGB. Data coverage/alpha requires its own explicit rule.

An isolated folder evaluates children against appropriate neutral channel values and explicit coverage, then composites the group once. A Pass Through folder evaluates children against a snapshot of its incoming parent stack. Proposed folder weight fades the difference between entry and exit; it must not multiply every child's opacity independently. Nested folder masks and blend scopes must be tested, not inferred from these scalar examples.

## Prioritized improvements

### P0 - compositing and adjustment foundation

1. **Layer-level Pass Through per channel.** A color adjustment must inherit Base color; Roughness and Normal can use different modes. Unaffected channels remain exactly unchanged. Distinguish Normal/source-over, Replace, Disable and Pass Through as different operations.
2. **Adjustment layer creation.** Add Levels, Curves, Hue/Saturation, Contrast and channel-specific material adjustments through one compact menu. Start with identity processing and the affected channels only. Do not create a white fill that hides the stack or an automatic white mask. Graph remains the authoritative implementation.
3. **Real folder composition.** Add folder blend, channel opacities and nested parent relationships. Expose Pass Through and isolated group behavior. Support folder effects, folder mask effects and channel exclusion. Existing 0.19 folders have visibility/mask state but no folder blend/opacity/effect stack or nested parent field.
4. **Opacity semantics.** Keep layer/channel opacity, effect opacity and brush stroke opacity distinct. Material view edits all channel opacities as requested; channel view edits that channel. Show Mixed when settings differ. Separate surface Opacity data from the opacity of a layer. Preserve the unmodified input when an adjustment's opacity is zero.
5. **Normal and height composition.** Use typed normal-aware modes with flat-normal identity and predictable strength. Define signed height Add/Subtract/Min/Max/Replace, neutral values and coverage. Preserve the completed height field and convert to normal once at the final surface boundary; make strength/scale understandable and prevent accidental double application.
6. **Masks on adjustments and groups.** Preserve editable paint/fill/generator/filter effects. Add root-mask amount/density with explicit semantics, feather, bypass, invert and reset. Density that weakens a mask is different from fading a layer; choose accurate names and neutral endpoints. Photoshop's mask properties are a useful UI reference: [filter masks](https://helpx.adobe.com/photoshop/desktop/effects-filters/smart-filters/mask-smart-filter-effects.html).

### P1 - artist interaction and linked data

7. **Compact layer UI.** Keep channel selection, Blend and Opacity close. Use full mode names in the selected control and tooltips for row abbreviations. Avoid duplicate Properties controls. Selection borders must identify material, mask or individual effect; an owner breadcrumb is sufficient without extra mode toggles.
8. **Expose input scope.** A small scope indicator says Layer, Stack below, Folder contents or Previous effect. Hover highlights affected rows; this must not interfere with viewport navigation. An identity adjustment can display its inherited preview rather than a misleading white swatch.
9. **Better Levels and Curves.** Live histogram of the actual input, per-component selection, black/white/gamma/output handles, typed values, reset and temporary before/after. Suppress stale histograms while a newer input is processing. Do not run a synchronous full texture readback on every mouse movement.
10. **Blend-mode exploration.** Searchable categorized menu, favorites, focused arrows/wheel and temporary preview that cancels without editing history. Explain incompatible channel modes; preserve per-channel differences rather than applying color Overlay to tangent normals.
11. **Bulk stack editing.** Ctrl/Shift selection, Mixed values in Properties, group selected/ungroup, stable multi-item reorder, auto-scroll/expand on drag and clear before/after/inside drop lines. Keep parent/effect selection unambiguous and preserve undo as one operation.
12. **Channel settings utilities.** Copy/paste all channel blend/opacity settings, apply to compatible channels, reset a channel or the full layer, and optional channel links. Persistent states must survive workspace/set switches. Keep inspected channel separate from brush-enabled channels and viewport display; show each purpose clearly.
13. **Paint-Graph input scopes.** Add typed Layer input, Stack below and Previous effect sources plus optional Folder input/output. Selecting a layer/mask/effect opens its own graph. Paint controls edit that graph directly; connected resources disable or explain fallback controls. Never flatten procedural edits just to use Paint.
14. **Anchor stages and dependencies.** Expand current after-effects/pre-stack layer snapshots to named typed exports at defined effect/mask stages. Supply Normal/Height/Mask/Coverage and other channel data with explicit conversions. Include find source, find consumers, stage preview, rename-safe IDs and safe reorder/delete/cycle checks. Cross-set live references need explicit mapping and are a separate later capability. [Painter anchor reference](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/effects/anchor-point).
15. **Clipping and conditional masks.** Add Clip to layer below using its coverage. Offer a reusable range-mask effect from underlying Height/Roughness/AO/Curvature/Color, with soft thresholds and preview. Treat it as an editable graph operation instead of a hidden blend formula.
16. **Reusable layer/folder instances.** Share authored material structure while keeping instance masks, mapped inputs and documented overrides. Mark local versus linked edits, allow make local and preserve external dependencies during asset export. Existing shared graph definitions are only part of this feature.

### P2 - scale and reliability

17. **Dependency-aware layer caching.** Cache isolated folders and stack boundaries. Recompute changed downstream channels/regions and anchor consumers; avoid unnecessary work on hidden/disabled results while preserving referenced hidden sources according to an explicit policy. Pass Through increases dependencies, so do not promise it costs the same as an isolated fill. [Painter performance guidance](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/technical-support/performance-guidelines/layer-management).
18. **Grow beyond eight layers safely.** Replace the fixed production blocker with bounded lazy allocation/caching and scalable stack data. Test large stacks and nested groups before increasing limits. Preserve one undo per gesture and avoid repeated full-document pixel copies.
19. **Reference compositing tests.** Add golden/numeric tests for mode-specific alpha, black/white/neutral input, HDR color, signed height, normal identities, partial masks, nested groups and zero/full weights. Compare Paint, Graph, preview and export on the same asset.
20. **Persistence and lifecycle tests.** Validate drag/reorder, grouping, duplication, material application, set switching, save/load and undo/redo with anchors, instances and adjustment masks. Deleting a producer needs deliberate relink/retain-snapshot behavior with undo, not silent substitution.

## What the release logs add to the acceptance plan

Painter 8.2.0 added folder effects, copying channel blend/opacity settings, applying them to all channels and filter blend/opacity. Historical fixes cover Pass Through masks (1.1.0), paint-effect opacity in Pass Through (5.1.1), eraser-driven Height to Normal updates and anchor deletion; recent fixes cover mask/color anchor results (12.1.1/12.1.2). These are regression cases, not evidence that Surface3D has the same bugs. [Painter history](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/release-notes/all-changes).

Photoshop's current notes highlight nondestructive adjustments, mask-gradient Multiply correctness, alpha display at different zoom levels, parameter responsiveness and painting regressions. Test those categories in our own controls and renderer. Avoid adding unrelated AI features to this layering milestone. [Photoshop release notes](https://helpx.adobe.com/photoshop/desktop/whats-new/photoshop-on-desktop-release-notes.html).

Photoshop Smart Filters also illustrate editable effect ordering with independent effect blends/opacity: [Smart Filters](https://helpx.adobe.com/photoshop/desktop/effects-filters/smart-filters/apply-and-manage-smart-filters.html). Our proposed per-effect masks would be an extension; the referenced Photoshop shared filter mask does not establish individual filter-mask parity.

## Release gate for this milestone

Reproduce the recorded sequence without Graph visible: create a neutral Base-color Levels adjustment, process the lower stack with Pass Through, change Levels interactively, fade its effect with opacity, group underlying fills, change group mode and mask, then undo/save/reload without changing the result. Repeat on Roughness and Height; run Normal through typed detail-strength controls. Verify nested Pass Through/isolated folders, anchor consumers and export against numeric references. Layer-order edits must remain fast and cancellable on a larger real project.

Implement in order: layer input/compositing contracts -> adjustment creation -> folder compositing -> channel/mask UI -> graph scopes/anchor stages -> clipping/instances -> caching and production acceptance. Only the analysis document and derived review images were written in this pass.
