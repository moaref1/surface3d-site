# Weathering and Teach mask

Weathering puts wear where it would really form on your model. You can use a ready template, or teach your own mask with a few strokes.

## Weathering templates

Five templates work out where wear forms from rain, sky exposure, edges and gravity. No bakes are needed.

| Template | Where it forms |
|---|---|
| **Rust and flaking paint** | Starts at sharp edges and wet spots, flakes paint to bare metal, streaks downward |
| **Moss** | Grows where water stays and light is low, in clumps |
| **Dirt and grime** | Collects where hands and rain cannot reach, washes into low spots |
| **Dust** | Settles on surfaces facing up, less where rain washes or things rub |
| **Water leak stains** | Runs from a point you click: streaks, tide lines and a damp zone |

Set **Age**, **Amount**, **Pattern size**, **Breakup** and the climate (rain, standing water, sharp edges). **See why** shows on the model what the result is based on.

## Teach a mask

A Teach mask works like a sub-layer of its layer: you teach it, and its settings show, only while it is selected.

1. Add a **weathering** layer from the Layers bar and choose to teach it. A green frame around the viewport means you are teaching.
2. **Left-drag** where the effect should go.
3. **Right-drag** (or **Shift** + left-drag) where it should not go.
4. The mask updates after every stroke. Add strokes until it looks right.
5. Press **Enter** or click **Done**, then set the layer's material like any fill layer.

| Key while teaching | Action |
|---|---|
| Left-drag / right-drag | Here / not here |
| **E** + paint | Erase strokes |
| **Ctrl+Z** | Take back the last stroke |
| **Ctrl** + drag | Brush size and hardness |
| **Enter** | Done |

## What it learned

Properties shows the strongest reasons it found as sliders: **+** means more here, **−** means keep away. It can learn 25 things, from facing up and sharp edges to where water runs, bare metal and wood grain.

- **Stay near strokes**: 0% applies the rule to the whole model, 100% only near your strokes.
- **Coverage**, **Spread**, **Grunge**, **Edge softness** and **Fine detail** shape the mask instantly.
- **Show mask** / **Show material** switches the view.

## Grunge from your strokes

How you paint sets the look: long strokes downhill give streaks, strokes along edges give chips, short dabs on open areas give speckles, and dabs in hollows give blotches. Your brush size sets the grunge size; a soft brush gives soft mask edges.

Teaching also reads the layers below it: coatings chip, bare metal pits, stains follow wood grain. After you change those layers, click **Re-read surface**.
