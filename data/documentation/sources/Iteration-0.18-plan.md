# Surface3D artist workflow implementation

Status: 0.18 implementation complete for the checked items; 47 development checks pass. Live Poly Haven catalogue/thumbnail/material/reusable import and NVIDIA cached/full replay also pass. Packaged validation is recorded in Verification-0.18.md.

Started 9 October 2026 against the sealed 0.17 source. Preserve earlier packages and original input assets. The user authorizes the combined 19-part plan and all retained production requirements. A checked item needs actual behavior, persistence/undo where applicable, and meaningful validation.

## Artist interaction and library

- [x] Hold-C temporary viewport wheel: Material, Base color, Roughness, Metallic, Normal, Height, AO, Emission, Opacity and Mask; point/release, center cancel, Escape, unchanged layer ownership, no painting/navigation while open.
- [x] Visual Poly Haven grid/search/category filter with visible-row thumbnail loading, bounded cache, offline reuse and deliberate selection.
- [x] Import Poly Haven as a reusable library material without modifying the current document; separate explicit application; cache/provenance/integrity.
- [x] Retained texture/generator graph drops; reusable material layer/mesh drops, mask preservation, published-output channel/graph drops and inactive-channel reveal.
- [ ] Complete every asset/target compatibility pair, richer drag previews and artist validation of all pathways.
- [x] Hover a dragged texture over an inactive channel to reveal that channel; preserve fallback/shared coordinates, one undo.
- [x] Shift fine adjustment and Ctrl half-unit snapping, typed values, range/XYZ/undo consistency.
- [x] Exact fill-region preview and suppression of hover highlights during navigation.
- [x] New Project landing/setup: import, objects/material sets, resolution, normal convention, supported shaders, UV diagnostics/mapping, color and preview.
- [ ] Mesh add/update/remove with preserved assignments and explicit invalidation warnings.
- [x] Favorite parameters referencing authoritative values and reusable master surface controls/instances.

## Procedural and production engine

- [x] Offset with percent/pixel units, positive wrap, half-tile action and optional soft opposing-edge blend.
- [x] Editable general GPU Paint node: input/result, Paint/Clone/Erase, UV wrapping, opacity, marks, single-stroke undo, graph-hidden editing and replay.
- [x] Multiple named Texture Output publishers, persistent project shelf, explicit Update and linked consumers across texture sets.
- [x] Shared property/axis/brush/render reset icons; search X; standard shader reuse and unchanged spatial-input caching, append-only Paint GPU work.
- [ ] Repeated multi-tile canvas, content-aware/synthesis seam repair, geodesic clone-source picking, arbitrary brush tool parity and reset affordances for all pinned/color/direct fields.
- [ ] Executable nested multi-output graphs/functions and versioned exposed interfaces. Published Texture Output snapshots are implemented; they do not complete live multi-output functions.
- [ ] Full Designer operation audit and original algorithms; missing flood-fill/distance/blue-noise/reaction diffusion/tile/filter families.
- [ ] Complete brush/normal/height/tablet/alpha/symmetry/stencil/text workflow.
- [ ] Nested folders/isolated composites/folder anchors and safe capacity expansion.
- [ ] Painted cages/skew/source color-emission-alpha-ID transfer and production seam/tangent acceptance.
- [ ] GPU primary projection, tiled residency/eviction/channel allocation and profiling.
- [ ] Larger textures/geometry/graphs, library metadata/relink/manual pack mapping, remaining codecs and engine integration.
- [ ] Lighting/interactive ray/hardware/hybrid/denoising/DLSS/transmission/camera/pass/sequence/video requirements in Rendering-and-artist-roadmap.md.
- [x] Native mouse/keyboard workflow, output/stroke persistence/undo, cached/full result parity, hardware/WARP checks, live API and current cube diagnostic.
- [ ] DPI/large-project/real-artist acceptance, immutable async graph publication, per-dab footprint optimization, GPU completion profiling and other hardware.

## Reference interpretation

The attached Blender image shows a temporary radial/pie selection menu. Surface3D uses it for display channels, as clarified by the user: Material, Base color, Roughness and the other channels. Hold C, point at a view, release to switch; the center/Escape cancels. It never changes the active layer or mask editing target. Reference application screenshots do not provide permission or instructions to depend on proprietary runtimes.

The Poly Haven integration uses the official public API and preserves source credit. Import to Library and Apply are separate. Search/preview/selection never modify authored materials. No placeholder node or unavailable backend switch completes a requirement.

## Latest request and acceptance evidence

Offset/clone repair and reusable image output were added on top of the 0.17 base. Native Tile-paint-results.txt covers typed pixels, reset/undo, Offset-to-Paint insertion, hidden-graph painting, Clone/Alt-click/undo, publication, inactive-Roughness drag, save/load and search clearing. Workflow-results.txt covers channel wheel, modifier precision, visual offline library import, reusable material/mask preservation and staged setup. GPU checks compare cached and full results rather than timing alone. See Surface3D-0.18-artist-guide.md for supported semantics and current bounds.
