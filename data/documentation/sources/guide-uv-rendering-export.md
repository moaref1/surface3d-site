# UV, Rendering and Export

## UV editing

Open **UV** in the top bar to check how your texture is laid out.

1. Inspect the islands next to a checkered preview of the model.
2. Unwrap if needed, then **pack** the islands tightly into the 0–1 tile.
3. Move, rotate or scale a selection with **G**, **R** and **S**. Press **Enter** to confirm.

Fill layers can use triplanar and other projection modes, so a material can look right even where the UVs are tight.

**F2** in the viewport shows the 3D model and the UV layout side by side; **F3** shows the texture alone.

## Rendering

Open **Rendering** to look at your material before export.

- **Lighting**: cameras, lights and HDRI environments, with exposure control.
- **Turntable**, **depth of field** and **post-processing**.
- **Wireframe** and **cavity** overlays help you check the model. Final renders never include them.
- The Rendering view (camera angle, zoom, field of view, perspective) is **saved with your project**.

## Export

1. Press **Ctrl+Shift+E** (or **Export** in the top bar).
2. Pick a preset for popular game engines or glTF, or choose the channels and resolution yourself.
3. Choose separate maps, or pack ambient occlusion, roughness and metallic into one **ORM** texture.
4. Set a **file name pattern**. The full name of each file is shown under its output.
5. Click **Export**.

Colour maps and data maps (normal, roughness, height) are kept apart, so they are saved with the right colour handling.
