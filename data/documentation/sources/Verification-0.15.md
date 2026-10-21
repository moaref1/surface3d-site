# Surface3D 0.15 packaged verification

Verified 2026-10-08T18:51:43+00:00 on the current Windows/D3D11 host, NVIDIA GeForce RTX 5050.

All 37 development checks passed. The packaged executable also passed eight native checks: texture-pack review/confirmation and library save, typed/linked/locked parameters and generator click/mask drag, Paint-first channel/resource/undo/Graph/automatic-simulation workflow, Graph texture/coordinates/brush interactions, baking/export authoring, saved Rain project, folder mask, and a 0.11 project load. Each check captured an editor window and reported its behavior; the first five simulate UI input. Executable, shaders and all 50 library previews match the tested build byte for byte.

Executable SHA-256: c38ccf884d52f57ec414de687e1bcf7c6bac4f725bddf0d9ddbd0f58c8a67229

The 0.15 UI adds original semantic symbols, compact library/resource/viewport/export template actions and active workspace highlighting. The application loads its embedded icon in every native fixture. The unchanged pack regression compared color space, packed ORM, DirectX normal, signed height and AO/opacity after export/reimport, tested long filenames, optional duplicate exclusion, reusable embedded assets, path validation and default HDR radiance. The artist-controls regression evaluated all 50 real GPU recipes, tested split/mirrored UV charts, connected 3D painting, padding removal/replay, mirrored normal bake reconstruction, UV overlap/gutter diagnostics and project roundtrips. The previous supplied Desktop cube check imported and baked; the fitted projection still misses one supersampled point. No claim of zero misses on all meshes is made.

Artist acceptance remains in docs/Surface3D-0.15-artist-guide.md. Physics remains a bounded 128×128 surface-film approximation. Layer filters use padded UV neighborhoods rather than continuous cross-chart kernels; 2D/physics source painting remains UV based. Larger production gaps stay open in docs/Missing-features-0.14.md. These checks do not certify full third-party parity, all GPUs, or every external asset.
