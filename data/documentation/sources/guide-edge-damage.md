# Edge damage and bevels

Edge damage puts chips and dents along the real edges of your model, including modelled bevels. It updates live while you change the settings. You don't need a high-poly bake.

## Add edge damage

1. Select the layer the damage should sit on top of.
2. Add an **Edge damage** layer.
3. Set its material. Damage on painted metal usually shows bare metal underneath.

## Shape the damage

| Setting | What it changes |
|---|---|
| **Chips** and **Chip shape** | How many chips there are and what they look like |
| **Bevel strength** | How strongly modelled bevels catch damage |
| **Which edges** | Pick which edges get damaged, so you can keep some clean |

The layer also writes its own normal and mask. **Edge damage normal** adds the dents to the surface; **Edge damage mask** can drive other layers.

## Use it in other layers

Edge damage feeds smart masks the way a high-poly bake would. Under **Properties > Mesh maps**, choose the baked maps **plus the edge damage layer**, and curvature, wear and dirt follow the damage.

## Bevels in the node graph

The **Bevel** node (Masks & Shapes) turns the edges of a mask into a rounded, linear or smooth height profile. Feed it into **Height to Normal** for soft bevels in a procedural material. See the [node reference](docs.html?node=bevel).
