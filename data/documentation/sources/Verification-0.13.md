# Surface3D 0.13 packaged verification

Verified 2026-10-08T17:50:35+00:00 on the current Windows/D3D11 host, NVIDIA GeForce RTX 5050.

All 35 development checks passed. The packaged executable also passed seven native checks: typed/linked/locked parameters and generator click/mask drag, Paint-first channel/resource/undo/Graph/automatic-simulation workflow, Graph texture/coordinates/brush interactions, baking/export authoring, saved Rain project, folder mask, and a 0.11 project load. Each check captured an editor window and reported its behavior; the first four simulate UI input. Executable, shaders and all 50 library previews match the tested build byte for byte.

Executable SHA-256: 63d31ae04960b5f6963a1fd69d5d212043687016d520dcacb03d20b30ae2ce90

The artist-controls regression evaluated all 50 real GPU recipes, tested split/mirrored UV charts, connected 3D painting, padding removal/replay, mirrored normal bake reconstruction, UV overlap/gutter diagnostics and project roundtrips. The supplied Desktop cube separately imported and baked; the fitted projection still misses one supersampled point. No claim of zero misses on all meshes is made.

Artist acceptance remains in docs/Surface3D-0.13-artist-tests.md. Physics remains a bounded 128×128 surface-film approximation. Layer filters use padded UV neighborhoods rather than continuous cross-chart kernels; 2D/physics source painting remains UV based. Larger production gaps stay open in docs/Iteration-0.13-plan.md. These checks do not certify full third-party parity, all GPUs, or every external asset.
