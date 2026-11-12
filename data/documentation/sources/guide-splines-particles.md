# Splines and particles

## Spline strokes

Splines paint along a curve you draw on the model: seams, stitches, cables, trims and painted lines.

1. Press **P**.
2. Click on the model to place points. Drag a point to move it.
3. The stroke follows the curve with the current brush. Gradients can run along it.
4. Splines live on a **Spline** layer, so you can edit the curve later and the paint follows.

You can also scatter items along a spline, and the node graph has spline nodes (**Paths** family) such as **Cubic Spline**, **Spline Render**, **Spline Fill** and **Scatter on Spline**.

## Particle brushes

Particle brushes run a small simulation while you paint: particles fly out of the brush, fall and settle on the surface, and leave paint where they land. Use them for drips, splatter, dust and leaks.

1. Press **W**.
2. Paint on the model as usual. The particles take the brush's material and colour.
3. Change how they spray and fall in **Brush Settings** (**F5**).

For flowing liquids in a graph, the **Physics brush** node lets you paint a source and then simulates water flow or dirt moving over the surface, leaving a mask where it settles.
