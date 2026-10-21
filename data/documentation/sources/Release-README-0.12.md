# Surface3D 0.12

Open **Surface3D.exe** in this folder. Keep `shaders`, `shader-cache` and `licenses` alongside it. Windows and Direct3D 11 feature level 11.0 are required.

Paint opens with Assets, a full-height viewport, Layers and Properties. Select a channel, edit its uniform value or drop a texture onto its resource slot. Removing the resource restores the saved value. Add masks, generators, effects and simulation sources through Paint. Graph exposes the same underlying network when you want to edit connections.

Rain film and Dirt transport have painted, ground, combined and whole-mesh sources, adjustable duration, and Source/Result tiles. These use a bounded 128×128 surface-film approximation. Bake and Export remain separate workspaces with the existing high/low/cage and template controls.

Examples are under `examples`; real editor screenshots are under `previews`. Read `docs/Surface3D-0.12-artist-guide.md` for the workflow, `docs/Surface3D-0.12-artist-tests.md` for real-asset checks, and `Verification.md` for the completed automated/package checks. The engine still has one UV0 atlas and bounded layer/node/image budgets; full Painter/Designer parity is not certified.
