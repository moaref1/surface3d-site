# Surface3D 0.8 verification

Verified 8 October 2026 on Windows using Direct3D 11 and NVIDIA GeForce RTX 5050. Original C++20/HLSL; Release build. All 24 core/GPU/native-input checks pass on the final source. The final correctness suite completed in 10.37 seconds with warm shader caches. This is a regression-suite duration, not a production benchmark or a hardware compatibility certification.

## Checks

| Check | Evidence scope |
| --- | --- |
| document_and_recovery | Document validation, undo/recovery and persisted data |
| analytic_bake_contract | Analytic geometric map/ray expectations |
| studio_render_and_export | Actual editor rendering and written textures |
| studio_geometric_bake | Actual bake workspace/map output |
| studio_editable_graph | Procedural graph workspace/rendering |
| gpu_pipeline | Paint/fill GPU composition and output values |
| masks_effects_and_anchors | Ordered effects, material/mask separation and anchors |
| studio_mask_effect_workspace | Visible owned mask effects |
| studio_export_workspace | Actual Settings / Output templates / List of exports captures |
| studio_graph_mouse_keyboard | Native selection/connection and keyboard interaction |
| studio_full_mask_view | Effective mask display |
| viewport_import_and_names | Mesh/navigation geometry and import/name validation |
| studio_compact_layout | Narrow-panel controls and editor capture |
| textures_nodes_and_previews | Image color/data sampling, procedural pixels and previews |
| projection_and_ordered_layers | Projection, tangent convention and layer/effect behavior |
| studio_layer_bake_mouse_keyboard | Native layer/bake/cage actions |
| artist_node_workflow_contract | Typed nodes, normal/height, graph operations and persistence |
| studio_artist_mouse_keyboard | Native region masks and graph authoring actions |
| shared_graph_library_contract | Linked graphs, overrides, defaults, detach, import rollback and schemas 1–8 |
| studio_graph_library_mouse_keyboard | Actual publishing/exposing/instance controls |
| bake_preflight_and_library | Invalid sources/cages, pairings, hard-edge/UV warning, ray caps, isolated check and atomic stable bake assets |
| export_templates_and_channels | Exact packing, AO ORM, encoding/normal conventions, valid names and persistence |
| custom_hlsl_gpu_contract | Typed code execution, eight inputs, source validation and last-valid-state preservation |
| studio_shader_bake_export_mouse_keyboard | Real signature/code edits, background compilation, errors, undo/redo, automatic bake images, independent probe, readable export table and actual custom PNG values |

The final full log is retained in [Full-suite.txt](review-08/after/Full-suite.txt). Earlier fixture failures are not release verification results. Tests assert material pixel values, state and files in addition to capturing screens; the captures are not substitutes for behavioral checks.

## Two visual reviews

Reviewed Paint, Graph, mask ownership/effects, Bake Common/Checks/cage, compact inspector, HLSL and export Settings/Templates/List. Fixed clipped channel switches, collapsed export columns, competing tab emphasis, empty bake headings and a misleading Material Graph title. The [review notes](review-08/Bake-export-plan.md) and fresh [mask/graph view](review-08/after/Mask-effects.png), [projection check](review-08/after/Projection-check.png), [HLSL editor](review-08/after/HLSL-editor.png), [export list](review-08/after/Export-list.png) and [compact layout](review-08/after/Compact.png) are actual application captures.

## Packaging acceptance

The release includes the executable, matching shader, source-checked shader cache, third-party licenses, example projects/graph assets and current documentation. Executable/example launch and the packaged native authoring workflow are checked separately before release; their results are recorded in the package's Verification.md. SHA256SUMS.txt records delivered files. The clean custom-coating example has no test output destination, contains a linked custom roughness control and a selected RGBA template, and embeds two small 32px demonstration maps. Its next bake is configured for ten categories at 256px; embedded demonstration maps are not final-resolution bake evidence.

Completed packaged acceptance at 2026-10-08T03:52:23 UTC: Reusable procedural pipe, Custom coating pipe, and the real native shader/bake/export workflow each returned exit 0, an empty error log and a complete editor capture. The native workflow also verified custom PNG channels and persisted document state. Executable SHA-256: `f181368f6dfebb7709d63c36980720720b27aea21708da2f434e62453fde4e5d`; 3,066,880 bytes. It is byte-identical to the final tested development executable.

## Practical limits

Baking is asynchronous CPU BVH; paint/graphs/viewing use the GPU. Ten geometric map categories are supported; source material/vertex-color IDs and color/emission/alpha transfer are not. Tangents are per triangle, not certified MikkTSpace. Cage correspondence requires the same expanded vertex/triangle order. Coverage is undilated; the 64px check cannot establish subpixel quality at final resolution. Cage wire overlays are not depth-tested editing.

Export writes synchronous RGBA8 PNG with logical grayscale/RGB/RGBA packing. No 16-bit/EXR/TGA/TIFF, 4K/UDIM or multi-set export. Custom HLSL is bounded math, with eight typed inputs and one result; no loops/includes/resources or arbitrary multiple outputs. Whole-graph instances are implemented; nested executable graph nodes remain pending. The requested node catalogue is not fully implemented.

A new complete custom shader variant was observed taking about 27 seconds cold; exact repeated variants are cached and compilation now runs in the background. Large asset responsiveness, peak VRAM, broad GPU/driver compatibility, accessibility, DPI scaling and Blender/Unreal tangent correctness require additional evidence. The [artist checklist](Surface3D-0.8-artist-tests.md) intentionally leaves hands-on checks unchecked and distinguishes them from unfinished implementation.
