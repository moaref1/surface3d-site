# Your first texture

Follow these steps once and you will know the whole workflow: a base material, painted detail, a mask, wear on the edges and an export. It takes about 10 minutes.

## 1. Start a project

1. Press **Ctrl+N** (File > New project).
2. Pick your model (most common mesh formats work) and the texture size: **1K**, **2K** or **4K**. You can stay on the material ball to practise.
3. Click **Create**.

## 2. Bake the mesh maps

Smart masks, edge damage and weathering read the shape of your model from baked maps.

1. Press **F8** to open the **Bake** workspace.
2. Tick the maps you want. Normal, ambient occlusion, curvature and position are a good start.
3. Click **Bake**, then press **F9** to go back to **Paint**.

Details: [Baking mesh maps](guide-baking.md).

## 3. Add a base material

1. In **Layers**, add a **Fill** layer.
2. Open **Assets** on the left and drag a material onto the layer or straight onto the model. Library and free online materials work the same way.
3. The layer shows its material on a small sphere. Its settings are in **Properties**.

## 4. Paint some detail

1. Add a **Paint** layer above the fill.
2. Press **B** for the brush. Change size with **[** and **]**, hardness with **Shift+[** and **Shift+]**.
3. Paint on the model. Press **E** for the eraser.

## 5. Mask it

1. Click **+ Mask** on the paint layer.
2. Press **Q** to switch between painting the mask and painting the material.
3. Paint black to hide and white to show. **X** swaps the two.

## 6. Wear the edges

Add an **Edge damage** layer. Chips and dents appear along the real edges of your model and update as you change the settings. See [Edge damage and bevels](guide-edge-damage.md).

## 7. Check it and export

1. Open **Rendering** in the top bar to see the material under studio light.
2. Press **Ctrl+Shift+E** to export. Pick a preset or choose channels and size, then **Export**.

You're done. Save with **Ctrl+S**: projects are compressed without losing anything, and autosave keeps a copy in case something goes wrong.
