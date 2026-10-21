# Weathering and teach mode

## Weathering templates

Five templates compute where wear forms on this model from rain, sky exposure, edges and gravity. No bakes are needed.

| Template | How it forms |
|---|---|
| **Rust and flaking paint** | Starts at sharp edges and wet spots, flakes paint to bare metal, streaks downward |
| **Moss** | Grows where water stays and light is low, in clumps |
| **Dirt and grime** | Collects where hands and rain cannot reach, washes into low spots |
| **Dust** | Settles on up-facing surfaces, less where rain washes or things rub |
| **Water leak stains** | Runs from a point you click: streaks, tide lines, a damp zone |

Set **Age**, **Amount**, **Pattern size**, **Breakup** and the environment (rain, standing water, sharp edges). **See why** shows the measurement behind the result on the model.

## Teach a mask

1. Click the **weathering icon** in the Layers bar. The new layer starts in teaching mode, with a green frame around the viewport.
2. **Left-drag** where the effect should go. **Right-drag** (or **Shift** + left) where it should not.
3. The **live mask** shows the result after every stroke.
4. Press **Enter** or **Done**. Then set the layer's material and colours like any fill layer.

| Key | While teaching |
|---|---|
| Left / right-drag | Here / not here |
| **E** + paint | Erase strokes |
| **Ctrl+Z** | Remove the last stroke |
| **Ctrl** + drag | Brush size and hardness |
| **Enter** | Done |

## What it learned

Properties shows the strongest reasons as sliders: **+** means more here, **−** means keep away. It can learn 25 things, from facing up and sharp edges to where water runs, bare metal and wood grain.

- **Stay near strokes**: 0% applies the rule to the whole model, 100% only around your strokes.
- **Coverage, Spread, Grunge, Edge softness, Fine detail** shape the mask and update instantly.
- **Show mask / Show material** switches the view.

## Grunge from your strokes

How you paint sets the grunge look: long strokes downhill give streaks, strokes along edges give chips, short dabs on open areas give speckle, dabs in hollows give blotches. Your brush size sets the grunge size, and a soft brush gives soft mask edges.

Teaching also reads the layers below: coatings chip, bare metal pits, stains follow wood grain. After changing those layers, click **Re-read surface**.
