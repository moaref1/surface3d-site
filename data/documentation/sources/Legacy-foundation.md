# Surface3D foundation (formerly SurfaceLab)

## Baking workspace

Click **Bake maps** or press **Ctrl+Shift+B**. Select maps with the mouse or arrow keys to see their meaning, procedural recipes and input requirements. R cycles sample resolution (256–2048), N switches normal convention, Enter exports all eight available analytic sphere maps to a fresh `bakes/sample-sphere-*` folder beside the executable. Escape closes the workspace. This new shortcut is a Surface3D choice, not a verified Painter binding.

The catalogue covers tangent normal, world normal, AO, curvature, position, thickness, material/color ID, bent normal, height/displacement and opacity/base-color/emissive transfer. The eight sample outputs are **CPU-generated analytic references**, not GPU projection bakes. AO is white for an isolated convex sphere; signed curvature and normalized inward-chord thickness are constant one. World normals, position and bent normals carry actual sphere-coordinate variation. Height and transfers are unavailable and excluded from export. PNGs are 8-bit reference data, not production HDR outputs. Each export includes `Bake.txt` with conventions and limitations.

Procedural recipes currently provide guidance; baked-map nodes and procedural fill evaluation are not connected yet. The node editor and the full concept-image layout remain to be implemented. Imported-mesh baking needs a geometry importer, low/high pairs, tangent validation, cages, ray-distance controls, hit diagnostics, sampling and dilation. No unavailable output is substituted into existing Blender/Unreal exports.

A native Windows foundation for a GPU material-painting application. This is original C++/HLSL code, without Adobe or Marmoset binaries, assets, SDKs or internal code.

## Run

Open `build-native/SurfaceLab.exe`. From Open, select `build-native/gpu-evidence/demo.slab` for the painted example. You can also pass a `.slab` filename on the command line.

Left-drag on the sample sphere or linked UV canvas to paint. Right-drag orbits the sphere. Wheel and bracket keys adjust brush size. Choose a swatch, roughness, metallic value and channels to write. Mask mode erases the selected layer; X switches between erase/restore. Fill layers take the brush settings through **Apply brush to fill**. Layers can be added, deleted, moved up/down, hidden and faded with opacity.

Ctrl+S saves, Ctrl+O opens, Ctrl+Z undoes, Ctrl+Y redoes. M toggles mask painting. F5 recompiles the shaders next to the executable; compilation errors retain the previous working shader objects. Rebuild after editing source shaders, or edit `build-native/shaders/surface.hlsl` for a live experiment. Existing stamp rasters require reopening to reflect changed brush shader code.

## Build and verify

Requirements: Windows 10/11 x64, Visual Studio C++ desktop tools and Windows SDK, CMake 3.24+, Ninja. Direct3D 11 feature level 11.0 is required. The app selects the hardware adapter with the largest dedicated memory, with explicitly labeled WARP fallback. No Vulkan SDK or third-party libraries are needed.

Run `build.cmd`. It configures Release, builds and runs both tests. This initial helper uses the Visual Studio location/toolset verified on this machine; adapt its first call for another installation. CMake itself also supports other Windows generators/toolsets.

Tests verify model history, color conversion, save/replacement/backup, failed saves, corrupt input rejection, GPU channel isolation, masks, seam wrapping, visibility, opacity, undo/redo replay and save/reopen. GPU checks also exercise the actual window mouse handler and export PNGs. `build-native/gpu-evidence/results.txt` records the tested adapter; the same folder contains captures and a demo project. This is not production hardware compatibility or performance certification.

## Save and export

Projects store layers and ordered brush stamps rather than opaque GPU memory. A save writes and flushes a temporary file, reopens/validates it, then replaces the target with its previous version kept as `.bak`. The loader checks version, bounds, numeric ranges, unique IDs and checksum. A failed commit retains the validated `.tmp`. This handles common corruption/truncation, but is not a guarantee against every disk/power failure.

Every 30 seconds while modified, a separate recovery copy is saved to `recovery/last-session.slab` beside the executable. Recovery is manual: use Open and navigate to that file. For `.bak`/`.tmp`, rename a copy to `.slab` before opening. One recovery slot is shared between launches; run one editor instance per output folder. Saves are synchronous in this foundation.

Each export creates a new timestamped folder in `exports/` beside the executable and opens that folder. Blender receives BaseColor, Roughness and Metallic PNGs. Unreal receives BaseColor and ORM: R=1 (AO unavailable), G=roughness, B=metallic. BaseColor uses sRGB encoding; data maps use linear values. Follow the generated Import.txt. No normal map or measured AO is exported.

## Boundaries

- Fixed 512×512 canvas, eight layers maximum, 100,000 stamps total, soft circular brush and normal blending.
- GPU stamping and composition use float textures for predictable results. Two starter layers allocate 34 MiB; eight allocate 88 MiB, excluding driver, swap-chain and readback storage.
- Event-driven rendering avoids a constant idle render loop. Brush dispatches cover bounded regions, including the U seam.
- CPU snapshot undo: at most 32 states and approximately 250,000 retained stamps per direction, keeping at least one state. Replay rebuilds every layer and can slow down with long histories.
- Procedural sphere with approximate lighting, not an imported mesh or engine-exact PBR rendering. UV-coordinate brush spacing means density varies near sphere poles.
- Mesh import, baking, UDIMs, normal/height painting, pressure, generators, anchors, blend modes and live Blender/Unreal bridges are future modules.
- Win32 UI with basic DPI awareness. Accessibility, keyboard navigation, scalable panel layouts, rename/search and localization remain future work.

Read `docs/Architecture.md` before the next iteration. This project is separate from the Painter installation.
