# Surface3D 0.8: artist workflow and exact scope

This release builds on the existing paint, fill, masks, anchors, normal/height channels, HDRI, navigation and 91-node foundation. It adds reusable graphs, reroutes, custom HLSL, bake diagnostics and export-template authoring. Cumulative Painter 1.3.5 remains the historical reference, extended by the later requested workflows. Implementation is original; complete product parity is not claimed.

## Interface

Texture sets remain above Layers, with selection-dependent Properties below. Material/mask thumbnails select the editing target. Mask editing highlights its parent row, thumbnail and owned effect lane in violet. Material/mask ownership no longer depends on collapse triangles. Layer folders retain real disclosure controls. Effects retain their order and contextual add actions.

Lucide outline icons supply consistent save, add, arrange, view, download, brush, fill, mask, generator, anchor, graph, folder and visibility actions. Hover labels preserve names and shortcuts. ISC/MIT notices are included in licenses/Lucide.txt. Compact channel switches wrap; input tabs scroll. Neutral inactive tabs and a dark modal backdrop reduce visual competition.

The artist story is: import a UV prop, choose sources, check cage/pairing, check projection, bake, use automatic library maps, author material/mask graphs, choose an export template, inspect the actual list, export.

## Reusable graphs

Publish the current material/mask graph with the graph toolbar save icon. Expose a supported node value in Properties; name it and set its range. Instances have independent overrides and inherit unchanged defaults. Reset restores inheritance. Source edits update linked instances; source layout belongs to that definition. Independent copy detaches while retaining evaluated values.

Scalar, color, vector, boolean, integer and image controls work. Color controls display sRGB and store linear values. Integer/boolean controls preserve types; roughness/metallic/AO/opacity/mask controls get sensible 0–1 defaults. Portable .s3graph assets retain embedded default images and remap identities atomically. Material and mask definitions cannot be bound interchangeably.

Bounds: 16 definitions, 32 exposed controls each, 128 nodes per graph, eight material fields, 16 cached spatial prerequisites. These are complete graph instances; nested executable graph nodes and arbitrary multi-output functions remain pending.

## Graph interaction and HLSL

Reroutes preserve their connected data type. Double-click a wire or find Reroute in Math / Utilities. Connection replacement validates atomically, so rejected cycles preserve old links. Selected block duplication/paste keeps relative layout/internal links and finds space clear of existing cards. Search, selection, arrange, sweep cut, rename, group, collapse, node export and Space preview remain available.

Find Custom HLSL in Math / Utilities, select it and choose Edit shader. Code holds the body; Inputs and result names/types the signature. Compile checks the draft without renderer globals, then builds the GPU variant in the background. Last working pixels stay visible. Application is undoable; errors keep previous code/links. Switching/removing/rebinding the owner prevents stale application.

Types: Value, Color, Vector, Boolean, Integer and signed Normal. Up to eight inputs and one result, eight custom nodes per graph, 4096 characters per node. UV is float2; Position and Normal are signed float3 geometric inputs. Unconnected inputs are zero. Ordinary socket conversions apply. Feed sampled textures/bake values through image nodes. Local values, conditional math and the implemented intrinsic whitelist work; loops, includes, strings and renderer-resource access are unavailable. Nonfinite results become zero.

Example with a Value input named Amount: `return saturate(Amount * 0.5);`. A Color result can use `return lerp(A, B, saturate(Amount));` with appropriately typed inputs. Color math is linear. A new complete variant was observed taking about 27 seconds to compile; repeated exact variants use source-checked bytecode/memory caches. This observation is not a production performance claim.

## Bake workflow

1. Import a low with UV0 and DCC/game-compatible triangulation/normals. F8 opens Bake.
2. Choose Low to low for geometric maps from the low itself, or add high sources for High to low. High import switches the mode automatically.
3. Check maps/output size. Common contains Output, Source and Projection; Map settings follows the selected map; Checks contains diagnostics, pairing and visibility.
4. Front/rear distances use a fraction of the low bounding-box diagonal or original low-mesh units. Face to vertex direction blends projection rays without changing the shading basis. Ray limit 0 uses automatic front/rear or cage distance; positive values cap tracing.
5. Import a cage preserving expanded vertex order and triangulation. Inward/near corners and reversed/collapsed triangles block the job before acceleration. Low to low ignores the cage.
6. Match names to isolate canonical low/high projection groups. Missing matches show triangle counts. Preflight also warns about zero-area UVs and manifold hard edges with unsplit UV borders.
7. Check projection runs a cancellable 64px, one-sample check through the same ray path, without secondary rays or padding. Green means hit, red miss, empty UV space is transparent. It preserves completed maps and authoring state. Source/settings changes mark the probe outdated. Subpixel detail still needs a final-resolution bake.
8. Bake checked maps runs the full cancellable CPU BVH job. Obsolete results are discarded. Current successful results automatically become Baked/<map> image assets; rebake preserves IDs. Publication is atomic if the 16-image/192 MiB budget is exceeded; ready files remain directly exportable.
9. Select a map for 2D/raw mesh viewing. Map on mesh changes only viewing. Ray misses displays undilated coverage so padding cannot conceal misses.
10. F9 returns to Paint; use Assets > Textures in fills, masks or graphs. Export ready maps writes checked bake PNGs, coverage and a manifest. The separate material Export dialog writes the evaluated layer composite.

Overlays are translucent sampled wire geometry, not depth-tested cage editing. Ready-job diagnostics are session data; published pixels, source scenes and settings persist. After reopening, maps remain in Assets; rerun a job for fresh diagnostics/direct ready-map export. Painted offset/skew, optimal-cage estimation, explicit manual bake groups and GPU tracing remain pending.

## Map uses

| Map | Current computation | Typical procedural use |
| --- | --- | --- |
| Tangent normal | Projected normal in low shading basis; +Y/−Y | Material normal detail |
| World normal | Encoded projected geometric/object-space normal | Directional dirt/upward-facing selection |
| AO | Hemisphere visibility with distance/distribution/backface/ground controls | Crevice dirt and AO output |
| Curvature | Bounded geometric signed-bend sampling | Edge wear/cavity accents |
| Position | Projected position normalized or in low bounds | Spatial gradients/masks |
| Thickness | Inward hemisphere distance, optional normalization | Thickness masks |
| Mesh-group ID | Discrete source group colors | Piece selection with nearest sampling |
| Bent normal | Visibility-weighted direction | Directional occlusion effects |
| Height | Signed offset encoded around 0.5 | Height masks/output/height-to-normal |
| Opacity / ray coverage | Fraction of projection hits | Coverage/diagnostic masks |

All maps are data, not sRGB. World normal does not imply a complete world-transform scene pipeline. Material/vertex-color ID and source color/emission/alpha transfer are unavailable. Tangents are per-triangle, not certified MikkTSpace. Full Painter-map parity is not claimed.

## Export

Ctrl+Shift+E opens the remembered selected template. Settings chooses the real output template, folder/name. Output templates edits definitions; the header always identifies what will export. Use for export explicitly selects the edited definition. List of exports derives filenames, channel sources and encoding from that selected definition.

Blender / separate channels uses +Y normals. Unreal / packed ORM uses −Y normals and actual AO/Roughness/Metallic. Duplicate a built-in or make a new template. Up to 16 templates/16 outputs each; unique valid Windows names, enabled outputs, logical grayscale/RGB/RGBA and per-channel sources are validated. Sources include constants, base color, roughness, metallic, normal, height, AO, emission and opacity. RGB may encode sRGB; alpha is linear. Choices persist in the project.

Files are PNG RGBA8 regardless of logical channel count. A new job folder is written through .partial and committed after all outputs/manifest succeed. Existing jobs are not overwritten. Export is synchronous; TIFF/TGA/EXR, 16-bit, per-set/UDIM jobs and portable standalone export-template files remain pending.

## Production work remaining

Priority: cross-DCC tangent/normal acceptance and cage provenance; painted offset/skew/high-resolution output; material/vertex-color IDs and color/emission transfer; measured GPU baking/budgets; responsive snapshot export; multiple texture sets/UDIM; nested graphs/multiple outputs; complete requested node semantics; nested layer masks; tablet/brush engine and accessibility. Real project evidence and artist acceptance are required beyond the current functional checks.

See [artist checklist](Surface3D-0.8-artist-tests.md), [verification](Verification-0.8.md) and [UI review/research](review-08/Bake-export-plan.md).
