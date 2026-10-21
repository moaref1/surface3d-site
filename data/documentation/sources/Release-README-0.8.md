# Surface3D 0.8

Open **Surface3D.exe** on Windows. Keep shaders, shader-cache and licenses beside it. Direct3D 11 feature level 11.0 is required. Earlier releases are preserved.

Start with **examples/Reusable-procedural-pipe-0.8.s3d** for baked-map masks and linked surface controls, or **examples/Custom-coating-pipe.s3d** for editable custom HLSL and a custom RGBA export template. Open a project with Ctrl+O. The custom-coating example embeds two small demonstration maps; F8 offers a new ten-map 256px bake. Choose your export folder before writing files.

Added: consistent Lucide icons and explicit mask ownership; reusable material/mask graph assets and independent instance controls; typed reroutes and safer rewiring; custom HLSL with a background compiler; high/low/cage preflight, quick projection/mesh coverage, and automatic bake-library maps; Settings / Output templates / List of exports with saved channel packing.

Space previews a selected node and restores the view. Double-click a mask previews/restores it. Shift+A searches nodes, Ctrl+D duplicates, Delete removes selection, Ctrl+RMB cuts wires, F frames, F2 renames. Alt+LMB or Navigate orbits, MMB pans, wheel zooms. F8 opens Bake, F9 returns to Paint, Ctrl+Shift+E opens Export. Hover icons for names and shortcuts.

24 automated checks pass on the tested Windows/NVIDIA system. [Verification.md](Verification.md) records packaged-build checks. [Feature guide](docs/Surface3D-0.8-features.md), [artist tests](docs/Surface3D-0.8-artist-tests.md), [UI/bake/export review](docs/review-08/Bake-export-plan.md) and [node catalogue](docs/Node-catalogue.md) cover actual behavior and open work. SHA256SUMS.txt records delivered files.

The current app uses GPU painting/graphs/viewing and CPU baking. Single UV atlas, 256–2048 authoring, eight layers, 128 nodes per graph and 16 RGBA8 embedded images / 192 MiB. Export is PNG8. Painted cage offset/skew, GPU baking, certified MikkTSpace, multiple sets/UDIM, 16-bit output, nested executable graphs/multiple outputs, full node parity and tablet/brush/accessibility work remain unfinished. Complete Painter or AAA parity is not claimed.

Third-party notices are in licenses. All screenshot previews show the actual app.
