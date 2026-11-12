# Layers and sub-layers

A material in Surface3D is a stack of layers, read from the bottom up, like in a 2D paint app. Every layer can also be opened as a node graph when you want procedural control.

## Layer types

| Layer | What it does |
|---|---|
| **Fill** | One material over the whole model. Shows its material on a small sphere. |
| **Paint** | Brush strokes in every channel you paint. |
| **Procedural fill** | Driven by a node graph. **Open in Graph** edits it. |
| **Sculpt** | Height and normal detail you sculpt. Made automatically when you start sculpting (**Y**). |
| **Spline** | Paint or scatter along curves (**P**). |
| **Edge damage** | Chips and dents along the model's edges and bevels, live. |
| **Weathering** | Rust, moss, dirt, dust, leak stains, or a mask you teach. |
| **Folder** | Groups layers. A folder can have its own mask. |

New layers go right above the selected one, inside its folder.

## Sub-layers

Sub-layers live inside a layer and change only that layer.

- Add a **paint**, **fill** or **Levels** sub-layer with one click from the layer.
- **Ctrl+X** cuts a sub-layer and **Ctrl+V** pastes it into another layer, or just drag it across.
- Drop a sub-layer on a mask or on the material to convert it.

## Masks

1. Click **+ Mask** on a layer (folders too).
2. Press **Q** to switch between painting the mask and painting the material.
3. Paint white to show the layer, black to hide it. **X** swaps the colours, **D** resets them.

Good to know:

- Nothing adds a mask by itself; erasing or painting never creates one.
- **Delete** on a selected mask removes only the mask.
- Mask menus add effects straight into the mask (smart masks, generators, Levels).
- Blur, Smudge and Clone work on masks too.

## Working with layers

| Key | Over the Layers panel |
|---|---|
| **F2** | Rename |
| **Ctrl+D** | Duplicate |
| **Ctrl+C** / **Ctrl+V** | Copy / paste |
| **Ctrl+E** | Merge layers |
| **Ctrl+A** | Select all layers |
| **Ctrl+G** | Group into a folder |
| **Up** / **Down** | Select the layer above / below |
| **Delete** | Delete |

- **Alt**-click an eye to show only that layer. **Shift**-drag across eyes to set many at once.
- Right-click a layer for all its actions.
- An empty stack shows "No layers"; every layer can be deleted.

## Taking a channel from another layer

The **Uses** list lets a slot read from another layer: for example, a layer's roughness can follow a mask further down the stack.
