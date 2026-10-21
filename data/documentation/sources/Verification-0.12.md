# Surface3D 0.12 packaged verification

Verified 2026-10-08T15:59:08+00:00 on the current Windows/D3D11 host.

All 33 development checks passed. The packaged executable also passed six native checks: Paint-first channel/resource/undo/Graph/automatic-simulation workflow, Graph texture/coordinates/brush interactions, baking/export authoring, saved Rain project, folder mask, and a 0.11 project load. Each native check captured an editor window and reported its behavior; the first three simulate UI input. Executable and shaders match the tested build byte for byte.

Executable SHA-256: 5ae8796493d4ea9208405d7d436bb2aeff9a1b532f5b44db8f87e7aae7cdb8d6

The Rain/Dirt solver remains a bounded 128×128 approximation. These tests do not certify exact third-party parity, all external meshes, or physical accuracy.
