# Layers and masks

New layers go directly above the selected layer, inside its folder.

## Layer types

| Layer | What it does |
|---|---|
| **Fill** | A material across the model. Every channel is one row: on/off chip, value and a link button. |
| **Paint** | Brush strokes in all channels. The brush paints whatever is selected. |
| **Procedural fill** | Driven by a node graph. **Open in Graph** edits it. |
| **Sculpt** | Created when you start sculpting (**Y**). Holds height and normal detail. |
| **Spline** | Paint along a curve or scatter items (**P**). |
| **Edge damage** | Chips and dents along edges and bevels, live as you edit. |
| **Weathering** | Rust, moss, dirt, dust, leak stains, or a mask you teach. See [Weathering and teach mode](guide-teach-mode.md). |
| **Folder** | Groups layers and can carry its own mask. |

## Masks

- Click **+ Mask** on a layer to add one.
- The **paint target chip** at the top right of the toolbar shows where the next stroke goes: the material, the mask or an effect.
- Nothing adds or switches on a mask by itself. Erasing or painting never creates one.
- The Properties header shows Layer > Material / Mask / effect. Click the layer name to go back.

## Smart masks and mesh maps

Smart masks and generators read the baked mesh maps. Under **Properties > Mesh maps**, choose **Bake + (layer)** so curvature, wear and dirt react to what you sculpted or damaged.

## Layer menu

Right-click a layer for rename, duplicate, move up or down, save to Assets and delete. **F2** renames the selected layer.
