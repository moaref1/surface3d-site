# Getting started

Surface3D is a free 3D texture painting app for individuals. This page gets it running and shows you around in five minutes.

## What you need

| | |
|---|---|
| **Windows** | Windows 10 or 11, 64-bit |
| **Linux (beta)** | x86_64 with a Vulkan driver |
| **Graphics card** | Any recent card with an up-to-date driver. 8 GB of video memory is enough for smooth 4K. |

## Install on Windows

1. Download the newest **Windows ZIP** from the [landing page](index.html) or the GitHub releases page.
2. Right-click the ZIP and choose **Extract All**. Running it from inside the ZIP does not work.
3. Open the extracted folder and run **Surface3D.exe**. The first start can take a moment.
4. Keep everything in that folder together: `assets`, `shaders`, `shader-cache`, `library` and the DLLs.

## Install on Linux (beta)

1. Download the **AppImage**.
2. Make it runnable: `chmod +x Surface3D-*.AppImage`
3. Run it. It needs a working Vulkan driver.

## Updates

**File > Check for updates** looks for a newer version on GitHub and installs it into the same folder. Projects from older versions open normally; a project saved in a newer version may not open in an older one.

## Your first look

When Surface3D opens you see a material ball in a neutral studio, ready to paint.

- **Middle:** the viewport, where you paint on the model.
- **Right:** **Layers** with **Properties** below it. Properties always shows the settings of what you clicked last.
- **Left:** **Assets**: materials, smart tools, textures, HDRIs and models.
- **Top bar:** the workspaces (Paint, Bake, UV, Rendering, Graph) and **Export**.
- **Bottom:** the status bar shows the keys and mouse buttons that work right now.

> Lost? Press **Ctrl+K** and type what you want to do. Every command is listed with its shortcut.

## Next steps

1. [Your first texture](guide-first-texture.md): a 10-minute walkthrough.
2. [Moving around](guide-navigation.md): orbit, pan and zoom.
3. [Layers and sub-layers](guide-layers-and-masks.md): how a material is built.
