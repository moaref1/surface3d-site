# Surface3D 0.19 native UI review

Reviewed the existing native application first, then actual input-driven captures after implementation. The dark/teal theme, workspace positions and Painter-style Layers/Properties ownership remain. Generated mockups are not functional evidence.

| Area | Finding and implemented correction | Remaining acceptance |
| --- | --- | --- |
| Layers | Blend/Opacity could address the parent while an effect was selected. The header now names its owner and edits that effect; a native 35%/Multiply edit preserved the parent. Duplicate Properties fields are removed. | Independent root-mask strength, nested folders and artist clarity during long sessions. |
| Mask/material | Violet mask ownership and teal material ownership remain. Selection uses thumbnails/effect rows; the redundant toolbar target switch was removed. Unsupported combiner fields are disabled. | Narrow docks, many effects and accessibility beyond color cues. |
| Brush | The toolbar now distinguishes Size/Flow/Opacity; tip and pen settings are grouped. Eight material channels use meaningful bounds and independent erase. | Real pen hardware, alpha tips, full 3D elliptical tips, symmetry/stencil and photographic clone repairs. |
| Shortcuts | Brush numbers overlapped tool selection. The default Photoshop profile consistently edits opacity/flow with workspace/typing guards; the old profile remains optional. | Rebinding, non-US keyboards, high DPI and tablet buttons. |
| Nodes | Vector Scale was incorrectly presented as an exponent. Operation-specific Scale/Eta and active sockets/defaults now match execution; connected defaults are disabled. Color adjustments preserve components/alpha for new nodes. | Every operation permutation, dense graphs and deeper group UI. |
| Bake maps | The default dock clipped several small toggles. More height is allocated to Maps; all ten choices appear in the final native capture. A map name previews; its toggle enables. | Small windows still require scrolling; visual distinction needs artist feedback. |
| Bake feedback | Selected maps appear on object and 2D during completed rows/batches. Partial previews are provisional and bounded; final publication remains atomic. | Large assets, cage/skew tools and dedicated cleanup brushes. |
| Normal | Mesh/UV/image/export now shares final Normal + Height combination. | Hard/mirrored UVs, analytic no-mesh sphere and Blender/Unreal comparisons. |
| Rendering | DOF has Focus distance/F-stop in Camera and persists. Path tracing is labeled compute; hardware capability is distinguished from implementation. Controls stay outside Layers. | Scene-scale calibration, live GI/DXR and camera handles. |

Mask-effect-controls.png, Live-bake-workspace.png and Render-camera-controls.png are actual Windows captures from the new input test. The mask capture confirms View/Blend/Opacity together and selected mask-paint controls; Bake shows all ten choices and map display; Rendering shows lens parameters in the existing right dock.

49 development checks passed. Native input covers brush keys, mask selection, typed effect edits, blend selection, preview versus enablement, Alt isolation, real bake completion and camera persistence. The final standalone package has its own acceptance report. Sampling quality and production-suite parity are not inferred from a clean screenshot.

See the artist guide and iteration checklist for remaining scope. Root-mask/folder opacity is disabled when it has no supported combiner; this is a missing capability, not a hidden alternate control.
