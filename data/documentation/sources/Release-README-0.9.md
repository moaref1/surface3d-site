# Surface3D 0.9

Open **Surface3D.exe** on Windows. Keep shaders, shader-cache and licenses beside it. Direct3D 11 feature level 11.0 is required. Earlier releases are preserved.

Startup and Ctrl+N open plain layers on a sample prop. Open **examples/Plain-prop.s3d** for ordinary fills and an editable constant graph. Optional **examples/Reusable-procedural-pipe-0.9.s3d** and **examples/Custom-coating-pipe.s3d** demonstrate reusable graphs and custom HLSL/export templates. Ctrl+O opens a project. Example baked pixels demonstrate routing, not final production bake quality.

Press **F8** for Bake. Follow **Meshes → Projection → Maps → Results**: import low/high, inspect cage/distances, choose maps and use Bake final. Bake changed retains unaffected selected maps; Check projection makes a quick independent 64px diagnostic. Finished maps automatically appear in Assets > Textures. F9 returns to Paint. Ctrl+Shift+E opens the retained three-tab Export workspace.

Added: real GPU secondary-map acceleration (AO/bent/thickness/curvature), cached parallel CPU projection, original MikkTSpace tangents shared with mesh shading, cheaper padding, map-specific rebakes, compact eligible GPU storage, partial simple-brush composition, GPU mask thumbnails and reusable readback staging. Click the bottom **GPU usage / budget** button for separate GPU, texture-storage, RAM and cache figures, precision override and temporary-cache release.

New fills have no mask or template. Add white/black masks explicitly; ordinary graphs start with values/attached inputs. Saved presets are optional. Schema 10 preserves mask presence and reads older projects. A neutral palette with viewport above graph and Properties right takes inspiration from EmberGen.

Native UI uses Dear ImGui docking and licensed Lucide icons. Hover icons for names/shortcuts. Alt+LMB or Navigate orbits, MMB pans, wheel zooms. Shift+A searches nodes, Ctrl+D duplicates, Delete removes, Ctrl+RMB cuts wires, F frames, F2 renames and Space previews. Double-click a mask previews/restores it.

28 automated checks pass on the tested Windows/NVIDIA system. [Verification.md](Verification.md) records packaged acceptance. [Feature guide](docs/Surface3D-0.9-features.md), [measurements](docs/Verification-0.9.md), [artist tests](docs/Surface3D-0.9-artist-tests.md) and [UI review](docs/review-09/UI-review.md) describe exact scope. SHA256SUMS.txt records delivered files. Previews are actual app captures.

Primary UV/cage projection and padding remain CPU; secondary maps can use GPU compute; painting/graphs/viewing use the GPU. Current bounds: one UV atlas, 256–2048 authoring, eight layers, 128 nodes per graph, 16 RGBA8 images / 192 MiB, synchronous PNG8 export. Compact texture storage rounds eligible derived values; full precision is available. Full GPU projection/DXR, painted cage offset/skew, 16-bit/UDIM export, fully tiled residency, background export, certified Blender/Unreal interchange and full requested node parity remain unfinished.

Third-party licenses are included; no dependency on the installed Adobe application.
