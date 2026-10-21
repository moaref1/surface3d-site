# Surface3D 0.10

Open **Surface3D.exe** on Windows. Keep shaders, shader-cache and licenses beside it. Direct3D 11 feature level 11.0 is required. Earlier releases are preserved. Ctrl+O opens projects in examples.

Properties now follows the selected material, mask, effect or node. Fill channels have named tabs and direct Value / Texture / Procedural input controls. Mask inputs no longer require first selecting a graph node. Coordinates, mask preview and effect settings expand separately. Ordinary fills remain mask-free and local until you add a mask or save a reusable asset.

Drag Assets > Textures thumbnails into the graph, onto image nodes/sockets, layer material or mask thumbnails, or material-channel source controls. Image nodes have a left Coordinates vector input and their own wrap/filter/local transform. Share **Fill coordinates** or **Mapping** across images/noises. Grid placement follows the canvas mouse position, group snapping preserves offsets and compatible sockets attract connections.

Find **Custom HLSL** with Shift+A > custom/HLSL/shader/code, Utilities / Custom, or the graph toolbar's code icon. Select the node, choose Edit shader, edit Code/Interface and compile. Used-node specialization speeds up custom graph compilation; successful shader caches are included.

F8 opens Bake. Use Meshes → Projection → Maps → Results. **Smooth cage across seams** welds geometric directions without changing imported shading. **Fit distances to high mesh** checks and fits a generated high-to-low cage range. Baked maps appear in Assets and connect automatically: normal combines with layer normals, AO multiplies layer AO, and **Mesh map** nodes follow semantic slots/rebakes. Settings retain map and baked-normal-format overrides. F9 returns to Paint. Ctrl+Shift+E opens Export with Settings / Output templates / List of exports.

Choose **Rain streaks** or **Growing dirt** in Assets > Brush or top-toolbar Brush settings. For reusable effects, add a colored/rough Fill, add a black mask, select it and paint value 1. Tune density/coverage, length/growth height, breakup, ground or stroke origin, surface/cavity response, gravity and seed. These are GPU surface-aware procedural brushes in the round UV footprint, not fluid/particle simulation. AO/world normals connect automatically; low normals and neutral AO are fallbacks. Parameters/origin persist per stamp in schema 11.

Examples include **Weathered-pipe.s3d**, **Fitted-cube.s3d**, **Automatic-mesh-maps.s3d**, Plain-prop, reusable graphs and Custom-coating-pipe. The cube embeds the supplied Desktop low/high geometry and fitted settings. Its diagnostic reaches 120,983 of 120,984 samples, with **one residual miss**. Original FBX hashes are unchanged. Inspect the undilated coverage and compare target-engine tangents before a final production bake.

Fifteen stable node kinds are appended, including histogram tools, Levels, Blend, directional/non-uniform blur, high pass, normals and 3D noises. The requested Designer catalogue remains partial: [Node catalogue](docs/Node-catalogue.md) records every retained reference row and its actual scope.

**30 development checks pass.** [Verification.md](Verification.md) records separate checks of this delivered executable. [Feature guide](docs/Surface3D-0.10-features.md), [measured evidence](docs/Verification-0.10.md), [UI review](docs/review-10/UI-review.md) and [artist tests awaiting you](docs/Surface3D-0.10-artist-tests.md) describe scope and limitations. Previews are real app captures. SHA256SUMS.txt records delivered file hashes.

Current bounds: one UV atlas, authoring 256–2048, eight layers/flat folders, 128 nodes per graph, 16 RGBA8 source images / 192 MiB, sixteen cached spatial fields and synchronous PNG8 export. GPU primary projection/DXR, painted cage/skew, UDIM/high-precision files, full requested node parity, advanced paint channels and cross-hardware/DPI certification remain pending. Schema 11 reads 1–10; older app versions cannot read schema 11. Retain old project copies when using previous apps.

Third-party notices are included. The app uses original C++/HLSL and public APIs; it has no installed Adobe/Marmoset runtime dependency.
