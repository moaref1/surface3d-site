# 0.20 layering UI review — 2026-10-09

Reviewed real native captures, not generated mockups. Two passes: first identified folder-material selection exposing mask controls and unused source controls for Pass Through; second checked the corrected folder and mask-entry states.

## Corrected
- Channel / Blend / Opacity stay adjacent in the Layers header.
- A selected mask entry is named in the purple breadcrumb and edits its own blend and opacity. Mask Invert exposes Multiply in the real native capture.
- A root mask exposes density; it does not accidentally edit owner opacity.
- Folder material selection shows folder composition guidance and Add mask, without fictitious mask controls.
- Pass Through source channels show that they use the stack below instead of editable values that cannot affect that channel.
- Hovering an effect reports its blend and opacity; no extra row of always-visible explanatory controls was added.

## Evidence
`build-020/studio-layering20-evidence/Mask-entry-controls.png`, `Folder-controls.png`, `Mask-density.png`, `Channel-controls.png`, `Pass-through.png`.

## Remaining UI work
- Source channel selection in Fill Properties and channel inspection in the Layers header are separate; make their relationship clearer without disrupting channel enablement.
- Brush toolbar still appears while a non-paint filter is selected; contextual tool availability needs refinement.
- More compact multi-effect stacks and multi-selection remain pending.
- Live Levels histogram/curves and richer folder-material effects remain pending.

The captures validate this layering milestone, not the entire application UX or production feature roadmap.
