# Surface3D 0.17: bake reliability and compact artist controls

User direction: prioritize cages and UV seams before advanced rendering; retain the dark/teal theme, Painter-style docking and navigation/pan control.

## Work order and acceptance

1. Reproduce the original Desktop low/high cube. Improve shared-edge ray robustness, generated cages and diagnostics without filling genuine projection misses or changing authored meshes. Test imported cages, smooth/face projection and cancellation.
2. Replace four-tap curvature with a seam-independent surface neighborhood and artist quality/strength/radius controls. Preserve Painter convention: convex white, flat gray, concave black. Verify planes, spheres, cavities, rotated UV charts and CPU/GPU agreement. Improve AO sampling consistency across the surface.
3. One compact Layers row: View / Blend / Opacity. Material edits affect all channels; an individual channel edits only that channel. No separate opacity popup or gear. Preserve data, undo and old projects.
4. Replace channel/map checkboxes with highlighted controls. Alt isolates one; dragging a held button sweeps the same enable/disable choice across controls. Keep map inspection and actual bake selection distinct and accessible.
5. Compact Assets controls at the top, tighter captions, a small zoom icon and Ctrl+wheel thumbnail zoom. Apply the layout to textures, generators and material thumbnails.
6. Baked-map and generator drops create editable graph nodes/subgraphs at the drop position and can target compatible sockets. Selection alone never applies an asset.
7. Perspective is the initial 3D view; existing explicit orthographic and navigation controls remain.
8. Decal source and layer/node workflow share one authoritative representation. A viewport drop ray-picks the object and projects at that point, with depth/front-back rejection, UV/position/orientation/scale and explicit templates. Normal-brush/stencil/text and viewport handles remain individual acceptance items.
9. Extend standalone Rendering with real transport and reference scenes, using public Toolbag/Painter documentation and published algorithms. Ray/CPU/GPU/hybrid labels must correspond to implemented paths; no placeholder capability switches or claims of proprietary Toolbag code.

## Required evidence

Build and meaningful core/GPU/native checks, original cube diagnostic maps, actual UI captures, exported output and backward project load. Keep earlier sealed packages unchanged. Record behavior, hardware and known remaining limits in the release guide. Advanced renderer, decal, text and production acceptance requirements continue in Rendering-and-artist-roadmap.md.

## Implemented behavior

- Shared-edge/corner watertight projection and constrained UV barycentrics.
- 3D surface-neighborhood curvature, CPU/GPU agreement, quality/radius/strength/invert controls.
- Matching scalar seam correction and chart-aware padding that does not hide ray misses or blend unrelated charts/normal/ID data.
- Contextual blend/opacity row, numeric input, preserved other-channel output, extended blends and older-project migration.
- Highlighted channel/map controls, Alt isolation and held-mouse sweep with one undo operation.
- Compact library grid/list/zoom controls and captions, Ctrl-wheel tile sizing.
- Semantic baked maps and editable grouped generators dropped into Graph; socket conversions and safe placement.
- Initial perspective, retained camera/pan controls.
- Neutral Sticker/Leak decal sources, original GPU projector, mask/material node output, actual multi-set mesh-hit placement, direct Paint properties, coverage, undo/persistence.
- Original bounded compute ray image renderer, environment importance/MIS, GGX/diffuse indirect transport and shadows, HDR/display conversion, async image publication/result view, WARP fallback.

Remaining production requirements are explicit in Rendering-and-artist-roadmap.md. This iteration does not complete DXR/DLSS/hybrid rendering, refraction, denoising, text/stencils, normal brushes, viewport projector handles or every Painter/Toolbag feature.
