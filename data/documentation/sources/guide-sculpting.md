# Sculpting into the normal map

Surface3D sculpts detail straight into the normal and height of your texture: dents, folds, carved lines and stitches. You don't need a high-poly mesh, and you don't need to bake.

## Start sculpting

1. Press **Y**. A **Sculpt** layer is created above the selected layer if there isn't one.
2. Pick a sculpt brush: clay, crease, pinch, flatten, scrape and more.
3. Drag on the model. Press **X** to switch between building up and carving in.

## Cloth brushes

The cloth brushes form folds, wrinkles and stitches as relief. Stroke along the direction you want the fabric to fold.

## Keys while sculpting

| Key | Action |
|---|---|
| **X** | Invert: build up or carve in |
| **1** to **0** | Strength |
| **Shift+1** to **Shift+0** | Depth |
| **Ctrl+[** / **Ctrl+]** | Strength down / up |
| **Shift+[** / **Shift+]** | Softer / harder |
| **[** / **]** | Smaller / bigger brush |

## How it works with the rest

- The Sculpt layer is a normal layer: mask it, hide it, move it in the stack.
- Smart masks follow your sculpt: under **Properties > Mesh maps**, choose the baked maps **plus this layer**, so curvature, wear and dirt react to what you sculpted.
- Edge damage and weathering read the sculpted shape too.
