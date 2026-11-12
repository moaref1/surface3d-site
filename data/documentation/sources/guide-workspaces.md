# The interface

## Workspaces

The top bar switches between workspaces. Each one keeps its own panel layout.

| Workspace | Key | Use it for |
|---|---|---|
| **Paint** | **F9** | Layers, brushes, fills, masks, sculpting, splines, particles, decals, edge damage and weathering |
| **Bake** | **F8** | Mesh maps from your model or a high-poly mesh |
| **UV** | | Inspect, unwrap and pack UV islands |
| **Rendering** | | Look at the result: cameras, lights, HDRI, turntable, depth of field |
| **Graph** | | Node graphs with the whole window for the graph |

## Panels

| Panel | What it holds |
|---|---|
| **Layers** | The layer stack of the current texture set |
| **Properties** | Settings for whatever you clicked last: a layer, its mask, a tool or a node |
| **Assets** | Materials, smart tools, textures, HDRIs and models. Folds into an icon strip when narrow. |
| **Brushes** (**F6**) | Brush library. **Ctrl** + wheel changes the thumbnail size. |
| **Brush Settings** (**F5**) | Every setting of the current brush |

Drag a panel's tab to move it anywhere. Panels can float and dock again.

## Finding things

- **Ctrl+K** searches every command and shows its shortcut.
- The **status bar** lists the keys and mouse buttons that work where your pointer is.
- Hover any control to see what it does.

## Preferences

**File > Preferences** has:

- **Interface**: theme and size (also **Ctrl+=**, **Ctrl+-**, **Ctrl+0**).
- **Navigation**: how orbit, pan and zoom work. See [Moving around](guide-navigation.md).
- **Shortcuts**: change any key.
- **Save & Load**: autosave settings.
- **Graphics card**: which GPU backend to use (Vulkan by default, with a fallback if it fails).
