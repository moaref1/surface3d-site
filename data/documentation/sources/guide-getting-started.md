# Getting started

Surface3D runs on Windows 10 and 11 (64-bit) with a DirectX 11 graphics card.

## Install

1. Download the newest ZIP from the [Download page](download.html).
2. Right-click the ZIP and choose **Extract All**. Running from inside the ZIP does not work.
3. Open the extracted folder and run **Surface3D.exe**.
4. Keep everything next to the exe together: `assets`, `shaders`, `shader-cache`, `library` and the DLLs.

**Help > Check for updates** (also checked at start-up) installs new versions into the same folder.

## Your first material

1. Create a project and import your model. Choose the texture set resolution (1K, 2K or 4K).
2. Open the **Bake** workspace and bake mesh maps: normal, ambient occlusion, curvature, world-space normal and position. Smart masks and teach masks read these.
3. Back in **Paint**, add a **fill layer** for the base material. Use "Use a material" to search the library or drop a material from Assets.
4. Add details: paint layers, masks, edge damage, weathering or a taught mask.
5. Check the result in **Rendering** under an HDRI.
6. Click **Export…** in the top bar and write your texture set.

## Next

- [Workspaces](guide-workspaces.md)
- [Layers and masks](guide-layers-and-masks.md)
- [Weathering and teach mode](guide-teach-mode.md)
- [Keyboard shortcuts](guide-shortcuts.md)

## Good habits

- This is a development preview: keep backups of important projects.
- Projects saved by newer versions may not open in older ones.
- Press **Ctrl+K** to find any command and its shortcut.
