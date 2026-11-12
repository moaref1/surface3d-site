# Baking mesh maps

Mesh maps tell Surface3D about the shape of your model. Smart masks, generators, edge damage and weathering read them.

## Bake from your model

1. Press **F8** to open **Bake**.
2. Tick the maps you need:

| Map | Used for |
|---|---|
| **Normal** | Surface detail from a high-poly mesh |
| **Ambient occlusion** | Dirt and shadow in cavities |
| **Curvature** | Edge wear and cavity masks |
| **Thickness** | Thin areas, translucency effects |
| **Position** | Gradients from top to bottom or side to side |
| **Bent normal** | Better occlusion-aware lighting masks |
| **ID** | Selecting parts by colour |

3. Choose the size and click **Bake**. Maps appear on the model as they finish.

## Bake from a high-poly mesh

1. Pick the **low** mesh, the **high** mesh and the size.
2. Click **Bake**. Matching parts are paired for you.
3. If something looks wrong, the Bake panel shows where: you can see the **cage** and paint it.

Very dense high meshes (hundreds of millions of triangles) are loaded once into a cache and then bake quickly.

## Speed

Baking uses hardware ray tracing where your graphics card has it, and fast compute otherwise. It fills the texture gutters and repairs small problems by itself.

## Let masks follow your edits

Under **Properties > Mesh maps**, choose **Bake + (layer)** so smart masks also react to what you sculpted or damaged on that layer.
