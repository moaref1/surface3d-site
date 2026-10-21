# Surface3D 0.23 verification

## Current refinement build — October 10

The current Release build passed **58/58 checks in 343.49 seconds**. The current complete output is `work/Latest-full-0.23.txt`; detailed output is `build-023/Testing/Temporary/LastTest.log`. See [Latest-development-results.md](Latest-development-results.md) for the 42 added node kinds, native search/preview/slider checks, image residency and cache fixes, single-map retention, smooth curvature, mirrored normal seams and measured Tiling project timings. These supersede current-build claims below; older measurements remain historical evidence.

The 185-kind registry execution audit, independent 32-operator and nine-material/RGBA checks, nested functions, retained brush/layer/mask/render checks and full 4K image/bake/export contract all passed. The complete Designer library, 400 new assets, primary DXR baking and universal hardware compatibility remain open. `tools/prepare_current_build.py` creates a new portable folder from the passing current run, verifies packaged startup and never creates a ZIP or overwrites a prior release.

## Previous preview verification

The final Release build completed. All **56/56 checks passed in 289.79 seconds** after the last runtime change. Complete report: `work/Full-suite-0.23-verified.txt`, copied into the preview as `Full-suite.txt`. The shader startup timeout was resolved by preserving the shared interpreter's proven compiler control flow. Earlier 2K-boundary and geometry-field capture checks were updated to the actual 4K limit and completed projected maps; both passed before the full rerun.

## New authoring checks

- Typed/nested functions, stable named ports, instance overrides, dependency closure, missing sources/ports, cycles and expansion budgets.
- Independent sampled-image checks for texel centers, repeat/clamp/mirror, point/bilinear filtering, transparent pixels and signed normals. Arbitrary computed image input plus separate Coordinates.
- Live project outputs: correct producer order, missing/ambiguous/cyclic producer rejection, supported upstream propagation and cache reuse after cosmetic changes. Portable snapshot and project persistence semantics.
- Named-output disconnect/deletion, clipboard references and dynamic exposed input controls.
- Actual ImGui clicks: material swatch, layer name, mask thumbnail, mask effect and toolbar Levels ownership from an initially different selection. Native Auto update refresh changes the material result; cosmetic rename avoids refresh. Disconnected grayscale Paint opens its canvas and Finish restores the prior view. Shared function source opens and Back returns.

Screenshots are in `build-023/studio-context23-evidence`; the preview copies the selected images and result reports into `evidence`. See [UI review](UI-review-0.23.md).

## Full-size 4K acceptance

`full4k_import_bake_graph_precision_export` ran on **NVIDIA GeForce RTX 5050**, hardware D3D11. It verifies real 4096 dimensions for imported normal data, all ten high-to-low maps, saved/reloaded project, native GPU graph evaluation and 16-bit PNG/TIFF/EXR pixel roundtrips. It also checks exact low-UV coverage/ownership retention, no unused bake float geometry fields, bounded live preview and one-field GPU node preview allocation.

The two-triangle analytic plane uses AA1, AO1, thickness1 and curvature4. Its final preparation/trace/padding/total timings were 253.061 / 2974.57 / 341.446 / 3569.07 ms. These establish that fixture's behavior, not high-poly/high-AA throughput. Baking still produces eight-bit data maps; higher-precision texture export does not imply higher-precision bake generation.

Two unused float4 bake geometry atlases were removed: **536,870,912 bytes (512 MiB)** at 4096. The same simple 4K material fixture's estimated owned GPU texture allocation changed from the earlier recorded 7,918,845,964 bytes to **5,234,491,404 bytes**, after lazy paint/preview allocation. One requested node preview adds 268,435,456 bytes. These count owned textures; they are not measured peak/resident VRAM and do not establish low-memory GPU compatibility.

The retained 256px demo-pipe CPU benchmark, AO/curvature/bent-normal, 32 rays and 8px padding, changed from 2780.12 to 2600.05 ms serial cold and 424.486 to 395.921 ms cached ten-worker. This is approximately 6.5–6.7% in that fixture. The before/after reports are retained in `work` and copied into preview `evidence`.

## Supplied cube

The user's low cube `Untitled.fbx` (12 triangles) and high `Untitled2.fbx` (3200 triangles) were read unchanged. At 4096, four AA samples, tangent normal/coverage and 8px padding, fitted front 0.002/rear 0.0329107 projection produced **30,862,944 hits, zero misses**, in 2394.2 ms. Default face/smoothed distances still missed some rays. Normal atlas and UV chart corners were inspected visually. This tests one asset/two maps and excludes export time from the projection timing. Diagnostics, image maps and project are in `work/Cube-4K-0.23`; the preview includes its compact metrics report.

## Portable preview and remaining acceptance

`tools/package_development23.py` requires the complete passing 56-check log, preserves older releases, copies the executable/shaders/assets/licenses/runtime files, and runs function/4K project startup captures from the packaged executable before writing the ZIP and SHA-256 manifest. Both packaged startup checks passed. Results are recorded in Build-info.json; images/results are saved under `work/Package-0.23-evidence`. This is a development preview, not a signed installer or a compatibility result for another PC.

Open: primary GPU/DXR projection, persistent GPU accumulation with queued readback, tiled residency, higher-precision bake generation, complete contextual live-output dependencies, connected-instance source previews, structured material/placement bundles, every detailed Designer reference and the 400 assets. Dense CPU image analysis/publication remain synchronous and can delay Graph. Representative high-poly/high-AA 4K benchmarks, more GPU vendors and the friend's machine still need acceptance. Read the [bake performance plan](Bake-performance-0.23.md), [Designer standard](Designer-implementation-standard.md) and [coverage gate](Designer-library-audit.md).
