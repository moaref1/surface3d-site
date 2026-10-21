# Architecture and iteration guide



## Surface3D 0.20 development
<!-- Historical section; see the appended 0.23 section for the current port and 4K architecture. -->



Schema 22 appends root mask density and per-channel folder blend/opacity. Separate coverage fields preserve partial channels through isolated folders; pass-through folders capture their incoming stack and fade the completed change once. Adjustment layers read an immutable lower-stack snapshot for pass-through channels while other channels retain their authored source. Scratch targets allocate lazily and are included in estimated memory.



Normal composition uses RNM by default, with typed replacement/Whiteout/UDN alternatives; height arithmetic preserves signed values. Mask filter blending is `lerp(input, blend(input, filtered), effectOpacity)` for Levels/Invert/Blur, matching the independent blend contract of mask Fill/Paint/Graph. A root mask remains coverage and has density, not a color blend.



Built-in graphs use one shared procedural kernel, preserving the prior backend path and avoiding synchronous compilation on ordinary topology changes. Custom HLSL variants contain used node kinds and a bucketed intermediate array. A per-built-in-graph specialization experiment timed out the generator and all-node checks and was reverted. A level-0 compiler experiment was also reverted. The shared built-in interpreter uses SKIP_OPTIMIZATION to avoid the expensive whole-switch optimizer; custom HLSL variants retain level 1 and other shader stages retain level 3. Generator acceptance passed in 48.76 seconds and the all-node/brush check in 42.99 seconds on the recorded test path; these are suite timings, not a universal GPU execution speedup. Custom compilation is still synchronous. Pass Through anchors, nested folders and folder material effects remain pending.



## Surface3D 0.19



Schema 21 appends stroke IDs/opacity/tip metadata, eight-channel brush values and render/camera lens controls, retaining readers 1â€“21. Stroke IDs cap coverage over one gesture and preserve deterministic replay. `core/stroke_engine` carries dab distance across input frames; `core/normal_surface` owns export normal/height composition mirrored in HLSL viewport/tracer helpers. Older component-adjustment nodes retain grayscale mode; new defaults infer color/vector types. `inputUsed` marks operation-inactive Math/Vector sockets without deleting stored edges.



GPU per-stroke R32 coverage is lazy/bounded and counted in estimated allocations. Brush FP16 writes explicitly round to nearest to reduce repeated truncation bias. Per-channel coverage persists for material/effect painting; normal/height retain full precision. Paint UV dispatch uses clipped/disjoint wrapped rectangles, while surface footprints retain the atlas fallback. History counts both physical and general Paint marks; cache trimming releases per-stroke fields.



`bake/preview` is an immutable snapshot mailbox protected by a mutex. Workers publish completed rows/GPU batches only, downsampled to at most ten 256-square RGBA8 maps. The UI polls at 12 Hz and checks active-set/input ownership; preview SRVs are independent of document map publication. CPU primary AA supports 1/4/16/64 samples and secondary rays to 512; compute packets remain bounded. Increasing sampling does not resolve incorrect cage projection.



Image tracing implements a sampled thin lens. D3D12 Options5 probes the matching adapter but does not enable a DXR backend. D3D11 compute remains the actual GI engine, with WARP fallback and shared material SRVs. The raster viewport remains interactive and sharp.



## Retained Surface3D 0.18





Schema 20 preserves readers 1â€“20 and adds general Paint marks, output resource metadata and a root project-output pool after the schema-19 favorites/UV-wrap metadata. Node IDs 110â€“113 append Offset, MakeTileable, Paint and TextureOutput without changing earlier kind IDs. Canonical project textures keep immutable pixel payloads; each set uses a linked local ID. Publication/refresh is atomic and undoable, including inactive-set snapshots. Duplicate/exported publishers reset project-local identities. Image output is an explicit snapshot boundary, not a cyclic live graph dependency.



Offset and MakeTileable use typed spatial prerequisites and normalized offsets, with UI percent/pixel conversion. NODE_PAINT owns original GPU replay, a per-node base, wrapped/geometric footprints, pre-dab clone input and append-only mark execution. Shared graph instances become local before Paint authoring. Color marks transform with the working space; data marks and normal encoding remain distinct.



Renderer caches each spatial input's exact semantic ancestry and prior layer/effect baseline. Cosmetic metadata is excluded; authored sources/maps/mesh/resolution/color, dynamic anchor/physics baselines and changed upstream operations invalidate conservatively. Cached results are checked against full replay. Standard nodes use the warmed general shader; custom function text still uses graph-specific compilation. Additional Paint bases/clone scratch are lazy and included in allocation estimates; no tiled residency or hardware-RT claim is introduced.



New Project uses staged core/project_setup mesh merge and existing material-set publication. Favorites reference authoritative controls and shared master overrides. UI-only view wheel, search/reset and modifier precision preserve ownership/history. Poly Haven browse/search/thumb futures and reusable import remain separate from application. The official API's live catalogue/artwork/material paths are checked separately from deterministic native offline fixtures.



## Surface3D 0.16



Core retains the authoritative document and stable graph identities. `fill_coordinates` owns the shared fill mapping and migration; Paint edits it while Graph exposes the same source. Color management uses static OpenColorIO 2.5.2, a pinned built-in ACES CG config, cached CPU processors, explicit Rec.709/ACEScg transforms and a 48Â³ sampled GPU display LUT. Source textures retain immutable float pixels alongside preview bytes; integer/half/float codecs and export packing are separate from GPU rendering. `image_io` uses Windows WIC and TinyEXR. Data maps and alpha remain outside color transforms. Schema 16 appends coordinates, input/precision metadata, OCIO, output encoding, material slots/scene sets and presentation settings; older released schemas remain readable.



`scene` retains flat object groups/material slots in a common normalized geometry frame. Active authoring stays at the document root; inactive sets use immutable child snapshots. Switching sets preserves authoring, with project color/export/presentation shared. Source transform matrices are pretransformed into geometry; presentation transforms do not alter bake UVs/geometry. Inactive viewport renderers use 256px proxies on the authoring device. Export and image rendering rebuild full authored sets.



`bake/scene_bake` preflights all sets, reuses prepared projection/GPU secondary-map caches, checks a bounded result budget and publishes the complete batch only against matching inputs. Layer edits made during the bake are retained. UI snapshots/jobs/control flags stay separate from core publication. Primary ray projection remains CPU; secondary AO/bent/thickness/curvature have the existing optional D3D11 compute backend. No unmeasured speedup is claimed.



Native presentation adds original GGX/Fresnel shading, 64-sample GPU environment prefilter/diffuse irradiance, a 128Â² split-sum BRDF LUT, eight 1024Â² shadow slices and PCF shadows, plus a ray-intersected ground/background. Rendering has its own docks and camera state. Async image jobs snapshot the document and own a separate D3D11 device/context; publication is staged and cancellation preserves the prior output. Baking and heavy export are coordinated with presentation work. The viewport remains SDR; half intermediates and a sampled LUT are explicit limits. Cycles/DXR/GI/DOF are separate later backends/features.



`library/poly_haven` uses Windows HTTPS and pinned public API semantics, typed map/dependency parsing, size/MD5 validation, retries, cancellation and atomic caches. Its UI owns bounded thumbnail/download futures and exposes explicit application. Texture materials use the same local pack assembler and saved `.s3mat` library. JSON is metadata, never executable instructions. Static OCIO dependencies and config notices accompany packages. Native fixtures validate output controls, camera restoration and cancellation, with independent CPU/GPU/codec/scene/cache regressions.



## Surface3D 0.15



resources/Surface3D.rc embeds a multi-resolution original Windows icon and version metadata. The window sets big/small icons explicitly. assets/branding holds the editable SVG master and transparent PNG; tools/build_brand.py regenerates the ICO and size preview. src/ui/surface_icons.h draws fourteen original semantic symbols without texture uploads. The Lucide generator preserves the Layer/Mask/Graph overrides. Compact resource/library/viewport/export controls preserve their underlying operations, stable widget scopes and fixture control points. Workspaces keep visible names and selected-state highlighting. No document or GPU evaluation change.



## Surface3D 0.14



core/texture_pack owns filename grouping, bounded version-1 metadata parsing and image-material graph assembly. The pack describes actual ExportSource channels, encoding and normal direction. Shared Coordinates feeds embedded image nodes; channel extraction, gloss inversion, normal decoding and signed-height conversion use existing GPU node implementations. Document import remains atomic and undoable. Unchecked images are omitted; conflicting enabled channel sources are rejected. The manifest only accepts local image filenames and avoids automatic execution of external instructions.



Renderer export adds the reference manifest before committing the partial job. Eligible outputs also produce an embedded single-layer material. A failed optional embedded material produces an explicit notes file while retaining the reference pack. Pack/project IO does not change schema 14. The disk material library loads assets only when selected, avoiding a second resident material/image pool.



The UI uses a unified import toolbar, active library categories, searchable texture grid/list, size control, bulk image dialog, deferred Explorer drops and a separate modal pack review. The review runs after docked windows so focus changes do not dismiss it. Reusable material save/load operates on the existing materialAsset/importMaterialAsset APIs. The default original HDR environment is generated as linear float pixels and uploaded through the existing environment path; import, rotation and exposure are retained.



Two new checks verify actual GPU export/reimport (including packed channels, sRGB, DirectX normal and signed height), filename/ambiguity rejection, persistence, default HDR range, native pack confirmation/undo and library save. Wider library and production limits remain explicit in Missing-features-0.14.md.



## Surface3D 0.13



Schema 14 appends graph axis-link/lock bits and surface-stroke/padding metadata, while retaining readers 1â€“13. The document owns all authored values. UI numeric wrappers preserve widget identities and native keyboard entry, add double-click entry and an optional field mode, and reject nonfinite/out-of-range values. Axis constraints live in core/node_axes; cosmetic locks are excluded from GPU evaluation/simulation cache keys. Neutral defaults apply only when creating new values.



core/ready_effects defines 50 stable recipe descriptors and builds actual editable graphs. Channel insertion retains uniform fallback/resource IDs and existing node positions. Semantic MeshMap nodes bind the current published map IDs. The UI-owned immutable thumbnails are generated by GPU regression checks; surface previews use the actual mesh and filters use a noise input.



core/surface_brush builds group-aware welded geometric adjacency. Authored 3D dabs retain UV center, normalized mesh position, triangle and radius; connected intersecting faces supply a per-triangle GPU eligibility buffer. The brush shader uses rasterized triangle ownership and world distance. Existing UV dabs remain valid. Reimport reprojects authored 3D centers by retained UV when possible.



A bounded nearest-covered-texel lookup is rebuilt from cached coverage when padding changes. Reused GPU scratch targets extend spatial fields, masks and final composite channels. Covered texels are unchanged; normal values are copied exactly. The payload estimate includes the added textures; OS memory remains the broader measure. Temporary field/mask scratch textures can be released. This is border extension, not a continuous surface filter across differently oriented UV charts.



core/uv_quality measures raster overlap and competing gutters on a check atlas capped at 256Â². Quantized UV/geometric edges identify islands. Bake preflight exposes these approximate diagnostics alongside existing cage/hard-edge warnings. Small/subpixel overlaps are not guaranteed detectable.



Two additional regression checks cover the 50 GPU recipes, native typed/linked/locked parameters, ready-library click and mask drag/drop, mirrored normal reconstruction, connected surface painting, padding on/off and persistence. The production backlog remains in Iteration-0.13-plan.md.





## Surface3D 0.12 additions (retained)



The Paint UI now edits the existing authoritative layer/effect/folder graphs through direct material and mask resource slots. Output nodes store per-input uniform fallback IDs plus the last assigned resource ID; replacing or removing an image does not discard the fallback. Schema 13 persists these IDs and keeps older readers. Paint and Graph share the same document operations and evaluation. The Paint layout hides Graph/Node Properties; switching workspaces changes presentation, not the authored material. Existing GPU PhysicsBrush fields now expose painted, ground, combined, and whole-mesh sources in Paint, with source/result GPU previews. The result remains a bounded 128Â² surface-film approximation.



## Surface3D 0.11 additions



Schema 12 adds persisted simulation source dabs/settings and flat folder masks/graphs/strokes. Readers retain schemas 1â€“11. Stable kind 108 is PhysicsBrush; legacy coordinate sources remain readable but hidden from creation. Every kind has Ctrl-hover help from core/node_help.cpp.



gpu/surface_simulation builds a bounded 128Â² UV raster with positions, area and symmetric mesh-adjacent edges. GPU state buffers ping-pong water/mobile dirt/deposit/wet trail. HLSL flux/integrate/output passes cap paired transport, inject sources, deposit dirt and evaporate water at dt=1/30. Authored source/settings changes reset derived state; target/output changes retain forward state when valid. Renderer owns simulations by owner/effect/node, shares topology, and invalidates cavity data on AO rebinding. This surface-film approximation does not provide volumetric fluid dynamics.



The renderer caches normalized layer state and resolved graphs, skips unchanged texture replay and conservatively invalidates downstream anchors. Direct GPU paint marks external damage for correct undo. Spatial prerequisite passes evaluate dependency closures. Folder masks own scalar targets and reuse material scratch targets. Full-folder preview honors bypass/inversion without overwriting ordinary graph thumbnails.



Layers/Properties follow material/mask/effect ownership. The separately docked Node Properties follows graph selection. Physics painting routes mesh/UV strokes into the selected node's source array. Solver state stays on the GPU during frame advance; tests/export use explicit readback. General and simulation shader bytecode caches key exact source/settings.



## Surface3D 0.9 additions (retained)



The existing native C++20 / Direct3D 11 architecture remains. Schema 10 appends explicit mask presence while retaining schemas 1â€“9; stored mesh vertices stay unchanged. Painting, graph evaluation, thumbnails and viewing run on the GPU; primary projection remains an independent CPU engine and secondary maps have an optional GPU backend. The 0.8 notes below describe retained behavior.



`bake::Cache` owns one immutable prepared scene: BVH, low/name groups and original MikkTSpace corner frames. Validated low geometry, shared immutable sources, mode and suffixes form the key; resolution/ray/map edits reuse the preparation. UV bins and bounds are recreated per bake. Active jobs retain shared ownership. Cache bytes count owned vector storage, not shared source geometry or all process memory. The UI disables cache release during a job. `project` accepts an optional shared cache and worker count; zero selects up to 16 hardware threads, leaving two cores where available. Atomic row dispatch has deterministic per-pixel sample order, per-worker hit/miss accumulation, exception propagation, cancellation and joined lifetime.



Padding uses a frontier and delayed-ready flags so each expansion reads only the previous pass. It retains discrete ID sampling, undilated projection coverage and unpadded hit opacity. `changedMaps` conservatively separates AO/bent, thickness, curvature, position, height and normal-convention dependencies. The UI merges unaffected selected ready maps after a current successful job; changing source/cage/low/resolution/padding forces complete selected-map work. Cancelled and obsolete jobs retain the prior published maps. Metadata for older unselected library maps is not a full dependency tracker.



`bake::SecondaryBackend` is a graphics-independent immutable packet interface. Prepared scenes lazily retain flat triangles/nodes/order only when requested. `gpu/compute_baker.*` creates its own D3D11 device/context on the viewport adapter, caches uploaded geometry, processes bounded 8,192-sample packets and reuses input/output/staging buffers. Its original `shaders/bake.hlsl` traces the BVH for AO, bent normals, thickness and curvature. CPU projection supplies the same surface samples and group/cage decisions; CPU reduction/normalization/padding preserve shared semantics. Bake worker access is serialized on the private context; cancellation polls readback without blocking the authoring context. GPU initialization/runtime failures retain a CPU fallback; Results names the actual backend. Bytecode is keyed by exact source/settings and reflection checks.



`Layer::maskPresent` distinguishes an explicit white mask from absence; `hasMask()` also recognizes authored mask data/effects for core callers. New ordinary layers have no mask or graph binding. Explicit creation/removal and undo/persistence retain identity. Older project masks remain present on migration. Default mask graphs pass through an attached mask input; constant fill graphs are local values, not auto-created library templates.



`core/tangent.*` wraps pinned upstream MikkTSpace without altering stored mesh vertices. Bake normals use the exact inverse of interpolated unnormalized corner T/B/N. GPU mesh uploads append those same corner frames; preview shading interpolates the raw basis and normalizes the transformed result. Mirror and smooth-normal reconstruction fixtures pass; real Blender/Unreal interchange still needs reference assets.



Eligible color/material/utility/coverage textures use RGBA16F only when the driver reports typed UAV load and store support. Normal/height detail, emission, geometry maps, spatial fields and raw graph previews retain RGBA32F; masks remain R32F. Math remains 32-bit. Changing precision rebuilds derived textures from the authoritative document. Half-float readback decodes actual formats and reuses one matching staging resource. Export still blocks on readback/PNG encoding.



GPU mask thumbnails write small RGBA8 targets directly; the UI no longer reads a full mask to the CPU. Spatial caches release excess unused fields. Simple brush dabs union actual clamped/wrapped dirty bounds; composition initializes and processes that region through the ping-pong buffers, preserving the old front outside the region. Dependent graph/effect changes retain full replay. `lastCompositePixels` measures logical layer texels, not GPU time. Callers changing layer state outside rebuild must request full composition.



Shader cache hashing preprocesses the active variant and compiles that exact source snapshot. Unrelated viewport/compositor edits no longer invalidate procedural variants. Reflection checks and last-valid-state handling remain. Cold complex variants can still be expensive.



Texture payload accounting uses actual descriptors, formats, mip levels, MSAA and staging. It excludes driver overhead, swap chain, buffers and UI-owned thumbnails. DXGI `QueryVideoMemoryInfo` supplies separate OS process usage/budget; Windows working set supplies RAM. These are distinct measures, refreshed at most once per second. There is no automatic residency/eviction controller yet.



Bake docking puts maps/2D preview left, viewport center and four setup tabs right. The status popup offers precision/cache controls; native capture tests click the actual memory button. Original Dear ImGui docking and Lucide icons remain appropriate libraries for this renderer. [Verification-0.9.md](Verification-0.9.md) records the 28-test suite and reproducible measurements.



## Surface3D 0.8 additions (historical, retained)



The native C++20/Direct3D 11/HLSL architecture remains; no Adobe/Marmoset runtime dependency is introduced. Schema 9 retains schemas 1â€“8. Schema 8 introduced shared graph definitions, exposed controls and per-instance overrides; schema 9 adds custom code/signatures, projection controls and export settings. Stable node kinds now total 93. Existing graph constant-buffer layout remains unchanged: custom code is compiled into source variants, rather than placed into GPU records. Embedded RGBA8 images remain bounded to 16 / 2048 per edge; byte budget is 192 MiB, with a 384 MiB project-file bound.



`core/graph_library.*` and `core/document_graphs.cpp` own canonical material/mask definitions, typed parameter defaults, independent overrides, image-ID remapping and atomic assets/bindings. GPU evaluation uses the effective instance graph; attached-input nodes still read that instance's pre-effect snapshot. A reusable graph is a whole-graph definition, not a nested executable function. Reroutes preserve inferred types; rewiring validates candidates before committing. Block spawn checks complete bounding rectangles.



`core/custom_hlsl.*` validates bounded signatures/math and generates typed functions for topological custom nodes. The renderer first compiles those functions without renderer globals, then compiles the complete procedural variant. A mutex protects the variant cache; shader COM ownership outlives concurrent eviction. Worker compilation uses device creation, never the immediate context. The UI captures stable layer/effect/definition/node identity, retains the last working GPU state, and applies only a compatible current source transaction. Reload generation invalidates stale compilations. Code drafts/errors are transient; successful changes use document history. Eight inputs / one typed result is the present contract.



`bake/preflight.cpp` checks source/settings validity, name pairs, cage correspondence/direction and UV/normal seam risks. Projection and shading normals are separated; tangent conversion always uses low shading normals. Full jobs retain immutable inputs/cancellation. `checkProjection` reuses the same ray path at 64px without secondary rays/dilation. Undilated coverage is separate from padded maps. `core/bake_assets.cpp` publishes full maps atomically with stable asset IDs; diagnostic probes never publish or replace them. Viewing an external bake-map SRV overrides only preview color/channel, leaving authoring/export textures unchanged. Source/setting changes invalidate ready diagnostics.



`core/export_template.*` owns bounded filename/channel/encoding definitions and pure pixel packing. GPU readback is completed before output packing. The renderer writes a new `.partial` directory and commits it only after outputs/manifest succeed, protecting existing jobs. The three UI tabs use exactly the selected template; edited and selected template identities are separate. Project settings persist. Export is synchronous PNG RGBA8; async snapshot export/high precision/UDIM remain future work.



`ui/icons.h` is generated from vendored Lucide SVG paths; source URLs/hashes and ISC/MIT notices are retained. Native fixtures use actual mouse/key controls for linked graphs, HLSL drafts, automatic bake assets, isolated projection checks and template edits/written PNGs. The current suite has 24 checks; measured correctness evidence is documented in [Verification-0.8.md](Verification-0.8.md). GPU baking, production tangent matching, budgets, accessibility and full node parity remain unverified/unfinished.



## Surface3D 0.7 additions (historical)



The original native C++/HLSL architecture remains. Core documents, graph validation, topology/region masks, geometry/baking, GPU resources and UI operations stay separate. Schema 7 adds eight node inputs, eight extra floats, collapse/group metadata, brush hardness, region-fill tags, flat folders and eight channel opacities. Readers for schemas 1-6 remain; immutable image/scene sharing preserves undo behavior. Folder moves validate anchor ordering atomically; single-layer assets strip folder ownership.



Graph records have 36 floats each (nine float4s). The constant buffer is 18,592 bytes: 40 header floats plus 128 records. Stable old node IDs remain; there are 91 kinds. Six socket data types resolve through polymorphic filter/Switch paths; conversions have explicit numerical rules. Scalar vector-math results resolve as scalar sockets. Nodes are topologically sorted with cycle/missing-link/field-budget rejection before dispatch.



Each GPU layer holds color, material, mask, signed-normal/height detail, emission, AO/opacity/height-coverage utility and separate extra-channel coverage. The compositor uses 96 bytes per layer and ping-pongs all material fields. Normal-only effects do not create AO/opacity/height coverage. Attachments sample snapshots from before the effect. Full-resolution node preview is isolated from the actual composite and can export raw data separately.



Spatial nodes cache up to 16 prerequisite fields in reusable float textures. Topological prefix passes populate those fields before the final evaluation; chained filters read completed prerequisites. These are full atlas passes, not arbitrary neighborhood reads from a per-pixel DAG. Cache allocation is reused at unchanged resolution. Filters remain bounded original kernels; distance transforms/Flood Fill/reaction diffusion need distinct global/iterative backends. The GPU has eight writable outputs and uses explicit SRV/UAV detachment.



The preview atlas is 512x1024 with 128 64x64 tiles. Preview collapse is persisted per node; global preview suppression is a session setting. Pure graph hit testing, safe spawn and cut intersection live in `ui/graph_hit.h`; selected arrangement operates on the selected induced subgraph rather than unrelated nodes. UI test event scripts are isolated in `app/artist_input_fixture.inl` but operate on the actual controls and document.



`core/environment.*` implements bounded Radiance RGBE/RLE loading into linear floating-point values. The renderer owns HDR environment textures/mips and a resolved 4x-MSAA viewport. Perspective projection matches CPU picking with inverse-depth barycentrics; FOV/lighting settings remain session state. Source-checked bytecode caches remove repeated unchanged shader compilation. Memory and IBL are estimates/approximations; production budgets and physical environment convolution remain unimplemented.



`core/region_mask.*` computes triangle, coplanar-face, UV-edge island and imported group adjacency and authors one persistent mask image/effect. Pixel data uses copy-on-write; failed allocation/validation leaves the prior document intact. Original n-gon identity, UDIM paint targets and material groups remain broader mesh-model work.



Eighteen checks include numerical new-node outputs, 128-node execution, frozen schema-6 migration, folder visibility/persistence, eight-channel opacity/coverage, actual-AO ORM, normal conventions, region masks, HDR, perspective/MSAA, real multi-selection/copy/delete/arrange/cut/group/rename and preview restoration. [Verification](Verification-0.7.md) documents exact evidence; functional tests do not certify AAA readiness.



## Surface3D 0.6 additions (historical)



Schema 6 retains readers for schemas 1â€“5 and stores low import alignment/groups, immutable high/cage scenes, bake settings, channel blends/opacities, UV mapping, Paint effect dabs, Levels endpoints, node labels and stable generator-control roles. Scene/image payloads are shared across history snapshots. Older schemas retain identity alignment; reimport low meshes before matching original-coordinate high/cage sources.



`bake/projection.*` is an original CPU triangle BVH and UV raster projector. Low/high/cage coordinates share the low import transform. Jobs capture immutable scenes/settings, publish atomic progress and check cancellation during rasterization, secondary rays and padding. Checked map storage is bounded. Source/settings changes mark prior results stale; outputs are retained for review until valid replacements arrive. Published RGBA8 maps become ordinary stable image assets with atomic budget checks.



The GPU compositor adds a Paint scratch buffer and evaluates Paint effect coverage before effect opacity, avoiding repeated opacity per dab. Fill effects generate coverage; base-color/roughness/metallic blend and opacity are independent. Final material/mask values saturate to 0â€“1. UV mapping is shared by layer/effect graph evaluation; attached snapshots and geometric maps preserve correspondence. The procedural constant buffer is 1,696 bytes (40 header floats plus 32 records of 12 floats); shader/C++ layout must remain synchronized.



`core/generators.*` builds original editable dirt, edge-wear, thickness and 30-node mask-builder graphs. Ordinary image/math/pattern nodes retain the graph's 32-node budget. Stable role enums bind generator controls even when node labels change. Copied nodes clear roles to prevent duplicate ambiguous bindings. Asset/project readers preserve role metadata and remap actual image IDs.



Sixteen functional checks include analytic ray projection, mirrored UV tangent convention, real occluders/thickness/cancellation, GPU effect ordering/ranges/sampling, frozen migrations and actual layer/bake input events. See the [0.6 guide](Surface3D-0.6-features.md), [review](review-06/Plan-and-two-reviews.md) and [verification](review-06/Verification.md). The following 0.5 and earlier additions are historical snapshots.



## Surface3D 0.5 additions



The current project format is schema 5, retaining readers for schemas 1â€“4. `core/texture.*` imports WIC RGBA8 images and stores validated, immutable shared pixel buffers. Texture IDs occupy the same document identity namespace as layers/effects. Image node references use texture IDs; anchor references use lower-layer IDs. Asset import remaps all image references together and rolls back on validation failure. Undo snapshots share pixels. Current bounds are 16 images, 2048 pixels per edge and 32 MiB image bytes.



Graphs now expose 37 typed node kinds; each graph still holds at most 32 nodes. Image color explicitly decodes sRGB, while image value selects raw data channels. The compute shader binds up to 16 image SRVs, and its existing topological evaluation can write an RGBA32F 512Ã—256 atlas with 32 evaluated 64Ã—64 node previews. Effects use their actual pre-effect snapshot. UI preview cache keys include document revision, layer and effect; no CPU preview readback is needed for UI drawing. Retired image SRVs survive through the queued ImGui frame before release.



The viewport Image is paired with an explicit mouse input item that captures drags. Navigate mode supplies unmodified orbit/pan/zoom; painter-style modified gestures remain. Rendering uses the full 3D viewport with scissoring, then maps projected coordinates to preserve the CPU pick transform. This removes the former square clipping boundary. Orthographic projection and approximate material shading remain.



Fill channels, mask sources and graph inputs share source controls. Material/mask effect groups clarify authoring context without changing global evaluation order. Property pages prioritize selected nodes. Node connections have an 18-pixel compatible-socket snap; grid snap uses 16 graph units. Single-node copy/paste, UE-style creation shortcuts and local connection error text extend existing selection/drag/search/undo behavior. Atomic rewiring and multi-selection remain pending.



Fourteen functional checks cover actual navigation events, texture picker interaction, hovered ID conflicts, full-width panned rendering/picking, image color/data/mask routing, preview pixels, all implemented non-anchor/output GPU node kinds, embedded project/asset roundtrips, rollback and schema 1â€“4 migration. Historical notes below describe earlier milestones. Read the [current feature guide](Surface3D-0.5-features.md) and [requested node catalogue](Node-catalogue.md) for exact limits; complete Blender/Designer node coverage remains future work.



## Surface3D 0.4 additions



The document and schema-4 format remain authoritative. UI context transitions now clear stale node/effect/socket state. Pure graph hit testing is in `src/ui/graph_hit.h`; Windows export-name validation is in `src/ui/file_names.h`. Tests inject events into the actual ImGui frame loop and verify resulting document, GPU and export state.



Viewport shader and CPU picking share separate 2D/3D navigation transforms. Effective mask display uses a dedicated SRV and inversion/bypass flags. Thumbnail caches key on stable layer identity and document revision; readback waits until gestures finish. Full dependent-layer replay and linear mesh picking remain optimization work.



Paint, Graph and Bake have independent layouts. Bake separates available-map selection, preview and settings but retains the existing CPU geometric-map backend. Export remains synchronous. The current import adapter isolates pinned Assimp in `src/core/mesh_import.cpp`; imported meshes require authored UV0 and collapse material slots into one normalized atlas mesh.



Thirteen functional checks and native captures cover this bounded interface pass. See [current guide](Surface3D-0.4-features.md) and [UI-base priorities](UI-base-milestone.md). The user's interface-first scope supersedes the historical vertical-slice ordering below.



## Surface3D 0.3 additions



The current schema is 4, retaining schemas 1â€“3. Layers own scalar mask state, one optional named anchor and ordered Material/Mask effects. Graphs may belong to a procedural fill or an effect; target-specific outputs and snapshot input nodes prevent recursive reads. Only lower-layer published anchors are valid. Stable references survive renames, and used sources cannot be deleted/unpublished/reordered above consumers silently.



Renderer replay clears and rebuilds each layer slot bottom-to-top, applying fills, dabs and then effects. Effect evaluation copies the attached values to reusable scratch textures before dispatch, so read/write hazards and self-feedback are avoided. Up to eight anchor color/material/mask SRVs are bound with geometry Position and Normal inputs; shader constants contain the validated topological graph order and reference slots. Each effect preserves unrelated channels and coverage. D3D11 texture arrays use constant resource indexing helpers for shader-model-5 compatibility.



Same-size layer, scratch and composite textures are now reused instead of reallocated at each parameter/stroke rebuild. Full replay remains for dependency correctness; dirty-region evaluation, immutable async export and GPU timing still need implementation. Memory reporting is estimated texture allocation, not measured peak VRAM. The grayscale preview has a revision-based cache but uses GPU readback.



The UI adds a shared brush toolbar, original tool icons, mask/effect context selection, searchable graph creation, mask result preview and export destination/profile/name preview. Native captures and nine checks cover the current scope. Single-layer material assets renumber layer/effect IDs and reject external anchor dependencies. Historical notes below describe the earlier base and remain roadmap context.



## Surface3D 0.2 additions



`src/app/studio.cpp` is the current Dear ImGui Win32/DX11 shell; the original main.cpp remains a diagnostic shell. Both use the same independent core and renderer. The modern UI renders its viewport to an offscreen SRV on the same D3D11 device, avoiding cross-device copies. Paint/Graph layout snapshots are separate from project state.



`core/mesh.*` validates bounded triangulated OBJ input and provides original fixtures and orthographic CPU picking. Meshes are embedded normalized snapshots in schema 3; original units/material groups/tangents are not retained. `bake/geometry_maps.*` rasterizes normalized position/normals in UV space. The UI background job owns immutable inputs and publishes only current results; cancellation discards results rather than stopping work mid-loop.



`core/graph.*` owns typed node identities, connections, parameters, positions, bounds, type validation and topological ordering. Nodes belong to a procedural layer. Schema 3 includes graphs and keeps version-1/2 readers. Material templates remain the fast entry point; conversion produces editable nodes. Shader constants contain up to 32 nodes in topological order; GPU compute evaluates them before composition and paint/mask replay.



The GPU caches mesh buffers and UV-position maps across material parameter edits. Full layer replay/allocation remains an optimization target. HLSL variants now include BRUSH, PROCEDURAL (template or typed graph), COMPOSE, MESH preview and fullscreen sphere/UV preview. Keep constant-buffer layouts synchronized with CPU definitions.



The original iteration notes below remain a roadmap; OBJ, small typed graphs and geometric-map outputs now partially cover those stages. Full projection, generalized layers and production performance are outstanding.





`surface_core` owns the document, validation, color conversions, bounded undo/redo and versioned project IO. It has no GPU dependency; IO uses Windows replacement APIs. IDs stay stable when layers move. Storage is bottom-to-top; the UI reverses that order. Every stamp stores its complete brush settings. Each channel has independent coverage; the mask multiplies coverage. Color is linear internally with sRGB conversion at swatches, display and color-map export.



`surface_gpu` owns Direct3D adapter/device selection, compute stamping/composition, resource lifetimes, procedural preview/picking, readback and PNG encoding. The document is authoritative; textures are derived. Each layer uses RGBA color (RGB, coverage), RGBA material (roughness, metallic, roughness coverage, metallic coverage), and a scalar mask. The compositor ping-pongs two color/material pairs. Read views are detached before writing, and backbuffer references are detached on resize. Rebuilding releases old textures first to bound peak allocation.



`src/app/main.cpp` owns the initial Win32 shell, commands, stroke interpolation, dirty status and recovery timer. Model edits checkpoint through `mutate`; a paint gesture checkpoints once for all interpolated stamps. The small GPU fixture lives here to exercise the real input path; extract a diagnostics target as it grows. Replace the shell without changing the model or shaders.



`shaders/surface.hlsl` compiles three independent variants: BRUSH, COMPOSE and viewport. All replacement shaders are created before swapping live objects. The build copies source beside the executable, which prefers that local shader folder and falls back to the development source. Keep executable and shaders together when copying the app.



## Next vertical slices



1. **Real meshes:** add `surface_geometry` with validated topology, material slots, UV sets, tangents and bounds. Start with one open-format mesh, depth-tested preview and GPU ID/UV picking. Paint targets must be independent from mesh/material slots. Test seams, mirrored UVs, poles and screen-space brush density.

2. **Responsiveness:** add D3D timestamp/disjoint queries, adapter budgets, cancellation and device-loss recovery. Benchmark before changing to FP16 or tiled dirty composition. Replace snapshots with commands and periodic raster checkpoints after measuring replay. Smoke-test duration is not a performance benchmark.

3. **First baker:** a separate `surface_bake` API receives immutable jobs with explicit low/high pairing, cages, UV targets and cancellable progress. Start with tangent normals and ray-hit debugging. A D3D12/DXR backend can sit beside D3D11 painting; share job semantics instead of device resources. Define fallback behavior before imposing a ray-tracing hardware requirement.

4. **Bake controls:** name matching/explicit groups, front/rear distances, cage editing, skew correction, projection isolation, map settings and dilation; then AO, curvature, position and thickness. Verify cage misses, pairing mistakes, tangent handedness and normal Y orientation. Keep bake groups, paint targets and export targets distinct.

5. **Layer graph:** masks/effects/instances with deterministic evaluation and cycle rejection. Specify per-channel blend semantics before generators/anchors. Use stable IDs for references. Every format change needs a schema migration and roundtrip test.

6. **Blender/Unreal:** import profiles for units, axes, UVs and tangents; exports for normal orientation, packing and color spaces. Test a shared reference scene before claiming matched shading. Add explicit asset identity, timestamps and conflict handling to a future live bridge.

7. **Production UI/persistence:** separate commands from widgets, add scalable controls, disabled states, rename/search, tablet pressure, accessibility and docking. Save/export immutable snapshots in cancellable background jobs. Add session-specific recovery and incremental raster updates.



Keep external libraries isolated with license records. Validate external input before allocation. Never silently manufacture unavailable maps or change color spaces. Deliver one usable interaction and a meaningful invariant/reference-asset check per slice. Change shader layouts and CPU parameter layouts together.



## 0.17 bake and render changes



`bake/ray_triangle.h` is the original double-precision sheared-frame watertight primary triangle test. Accepted UV barycentrics are constrained to the triangle. `bake/seams.*` repairs only matching manifold scalar seams, with group/coverage/normal checks and bounded visited storage. Island-aware padding protects authored misses and unrelated charts. Curvature samples a 3D surface neighborhood with matching CPU/GPU interpolated normals, configurable sample count and convention. High-ray secondary packets use a ray-work budget to reduce single-dispatch duration.



`core/layer_controls.h` treats a selected channel as its effective opacity. Channel edits fold an old global opacity into per-channel weights before changing one; Material edits set all channels together. Schema 17 added extra-channel blends and bake controls; schema 18 appends ray-render controls while retaining readers for 1-17. `core/decal.*` creates original neutral templates and an authoritative projective Decal graph. GPU coverage follows an actually connected color projector, not an unconnected node.



`gpu/ray_renderer.*` and original `shaders/ray.hlsl` implement bounded D3D11 compute path tracing. Median BVH leaves, sheared ray intersections, GGX/diffuse BSDF sampling, environment alias sampling with MIS, directional shadow rays, stochastic opacity and Russian roulette provide real transport. Evaluated material SRVs are shared with the immutable presentation snapshot, without uniform-size texture-array duplication. HDRI importance data has a 512x256 cap while source radiance stays at its loaded resolution. Tile dispatches are bounded; device completion is polled between groups with cancellation. Bytecode keys include exact source/settings and cached blobs are reflected before reuse. WARP executes the same shader; no DXR/DLSS claim is made. Scene transforms are presentation-only, and tangent validation normalizes a temporary copy without changing authored geometry.



The render worker publishes a file atomically, then hands a managed preview to the UI only after the future is ready. The preview has an explicit last-result/live-view switch. `applyDisplay(span)` performs bulk OCIO conversion once per image. Render-specific controls stay out of Layers.



## 0.19 GPU completion scheduling



`gpu/readback_wait.h` owns a reusable high-resolution waitable timer with RAII lifetime. Bake readback and render-event completion first yield briefly, then wait in 0.25 ms timer intervals instead of accumulating coarse `Sleep(1)` delays. Unsupported timer creation retains a compatible sleep fallback. Existing cancellation and 30-second deadlines remain; no global Windows timer-resolution change is made. The 64-AA/four-ray analytic plane verifies bounded packet splitting and CPU/GPU agreement and records scoped before/after timings. This does not change the CPU primary/GPU secondary bake division or implement DXR.



## 0.21 texture-shape processing and smoothing



Regular Blur now preprocesses its input into a cached full-resolution R32G32B32A32 field with two dense separable GPU passes. Fractional support weights, premultiplied alpha and final normal renormalization avoid sparse-sample aliasing. Intermediate field sampling uses its own linear sampler; source-image point filtering remains independent. Processed-field cache signatures include the blur/shape node's semantic parameters, not graph layout.



`core/shape_processing` implements original four-connected periodic/clamped island analysis and a separable exact Euclidean distance transform. Flood Fill, Distance Field and Bevel currently use synchronous readback, bounded CPU processing and cached upload. They are not GPU accelerated. Tile Sampler is GPU grid distribution of scalar masks or alpha-composited color patterns. Node IDs114–117 append to the stable registry and project schema23 rejects unsupported older readers. Existing node/field/resolution budgets remain.



## 0.22 image operators and reference coverage

`core/node_extensions22` defines metadata, typed ports, mode names and relevant artist controls for stable node IDs 118-138. `core/image_processing22` supplies bounded cached CPU image analysis with repeat/clamp/mirror boundaries; GPU evaluation uses the shared D3D11 graph interpreter and uploaded fields. Project schema 24 records the extended registry. Built-in graph execution retains the shared shader with skipped optimization; custom HLSL keeps its separate compilation path.

The Designer inventory contains 348 library entries and separately requires atomic-node coverage. The current eight-input, single-result interpreter needs explicit multi-output ports, nested reusable functions and structured material/placement data before compound-node parity. Shared whole-layer definitions do not supply nested function nodes. No placeholder function node is exposed. See [coverage audit](Designer-library-audit.md) and [verification](Verification-0.22.md).

## 0.23 typed functions, published textures and 4K

`core/graph_functions` compiles typed named function inputs/results into the existing atomic interpreter. Authoring allows 32 ports, stable output IDs and nested source dependencies; GPU atomic execution still has eight input slots and one float4 per instruction. Expanded instructions retain the existing 128-node/16-field budgets. Source definitions, instance overrides and dependency closure persist in schema 25. Editing previews shared defaults; enclosing-instance input preview and structured material/placement bundles remain pending.

`core/live_outputs` orders direct project texture producers before consumers, retains stable image identity and rejects direct cycles, missing/ambiguous producers and invalid port references. Semantic cache keys exclude names/layout and include producer ancestors. Publication/readback remain synchronous; layer-baseline and anchor feedback are not universally tracked. Portable assets store image snapshots; graph assets retain nested source dependencies while material assets flatten them.

4K limits apply consistently to project/texture/bake validation, image codecs, graph fields, export and UI resolution controls. CPU source-image budget is independently configurable (new default 1024 MiB); inactive texture-set images use this budget. Projects retain their selected resolution, and saved import preferences remain authoritative. GPU residency management remains separate work.

The baker rasterizes coverage and triangle ownership without unused float position/normal atlases, removing exactly 512 MiB at 4096. Preview storage stays bounded to ten 256-square display maps. Hemisphere sequences, tangent bases and curvature sample offsets are reused; arithmetic for unrequested outputs is omitted. Exact selected-map counts inform batch storage estimates. Primary projection remains CPU; optional D3D11 compute secondary tracing and synchronous packet readback are retained. Primary DXR/OptiX and tiled-atlas backends remain pending.

GPU paint-effect buffers allocate only when needed. Node preview and spatial preprocessing bind a single result field; unbound D3D11 material/mask UAV writes are discarded. The shared built-in interpreter retains its proven compiler control flow and skipped optimization. Full-precision layer, compositing and export formats are unchanged. `estimatedBytes()` counts owned texture allocations; it does not measure peak VRAM residency. See [verification](Verification-0.23.md) for full-size acceptance and scoped timings.


## DXR second baking engine

`gpu/dxr_baker` implements the existing immutable bake packet contract on a dedicated D3D12 device selected by the viewport adapter. DXR 1.1 inline queries accelerate candidate traversal; the shared edge-function triangle reconstruction retains existing encoding and backface conventions. Optional ProjectionRay/ProjectionHit packets accelerate high-to-low primary rays. UV coverage, map encoding, seam repair and padding remain CPU work. Secondary map formulas remain shared with the D3D11 path through conditional compilation of bake.hlsl. BLAS/TLAS and metadata are cached by prepared geometry identity. Bounded buffers and fence waits preserve cancellation/resource lifetime. No project schema change or DLSS dependency is introduced. See DXR-baking-development.md for verified limits and remaining work.
