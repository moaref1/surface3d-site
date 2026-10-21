# Surface3D 0.34 — scoped 2D authoring and vertex data

## Delivered scope

No new ray tracing, volume/SDF-3D or rendering features were added in this iteration.

### Mesh data

- Vertex Color: imported RGBA color-set selection (0–7); values are preserved as data, not automatically sRGB decoded. Use RGBA Split for individual channels.
- Object ID and Material ID: integer region inputs for Compare/mask graphs.
- FBX, glTF/GLB, Collada and PLY import retain Assimp vertex colors; the authored RGB OBJ extension is also accepted. Color sets persist in schema 34 projects and texture-set splitting.
- These inputs rasterize attributes into the current UV atlas. Shared/overlapping UVs cannot encode different per-vertex values at the same texel; this does not introduce a per-vertex renderer or a volume-texture pipeline.

### Editable 2D paths and splines

Eight new nodes: Polyline, Cubic Spline, Spline Circle, Path Transform, Path Merge, Spline Render, Spline Fill and Scatter on Spline.

- Primitive curves have a point/curve view in Node Properties. Drag editable handles; Ctrl snaps to a 1/16 grid. Polyline points can be added/removed, and point coordinates can be typed.
- Cubic Spline has four editable Bezier control points; Circle supports radius, arc angles and segment quality.
- Transform changes pivot, position, rotation and scale. Merge combines independent contours.
- Render creates an antialiased stroke mask. Fill handles closed contours with even-odd holes or union. Scatter places disc/square stamps at equal arc-length intervals, with count, radius, phase, orientation, random rotation and seed.
- Path sockets are a distinct type. Connect them to Render/Fill/Scatter before ordinary image processing or Output Texture (Anchor). Geometry is independent of image resolution; raster outputs retain node-resolution controls.
- This is an original, usable 2D foundation, not the complete Designer spline/path catalogue. Mask-to-path tracing, arbitrary image mapping along splines, spline warp/bridge and full spline lists remain future work.

### Safe Transform

Repeat-safe whole-number U/V tiling, quarter-turn rotation, pivot, offsets and independent mirrors. Repeat, Clamp and Transparent boundaries are available. Normal directions and transparent color interpolation are handled explicitly. Results use the existing cached/background image-processing path; an experimental extra main-shader branch was removed after it caused expensive compilation.

### Expanded samplers and splatters

- Tile Sampler: six patterns, map attenuation, vector axis scale, background, selector influence, Over/Max/Add overlap and reverse order.
- Flood Fill Mapper: eight patterns, scale/rotation/tint/selector maps, axis scale, Stretch/Contain/Cover fitting, normal rotation/axis compensation, hue/saturation/lightness adjustment and alpha offset.
- Shape Splatter: eight shapes, density/position/scale/rotation/selector maps, axis scale, height offset/scale/influence and optional background-height occlusion.
- Blend supports eight corresponding patterns; Data Extract and To Mask share the same placement. W stores coverage + 2*logical-pattern-index, preserving legacy W=0..1 data. Sparse source/companion slots retain logical pattern identity.
- Existing input slots are preserved; new sockets are appended. Empty extended controls retain legacy behavior.
- Expanded GPU operators reuse their last input field for their completed output after the isolated dispatch. This keeps the existing 16-field main shader bank, with bounded passes and explicit bounds checks.
- These remain original 2D operators, not exact Adobe algorithm equivalence. No terrain-slope/3D conformance or Shape Splatter v2 was added.

### Local coordinates and preview repair

- New coordinate consumers have local Projection/Scale/Offset/Rotation controls in their parameter panel. The compiler supplies an invisible coordinate controller only when the coordinate socket is unconnected.
- A connected source disables local controls and overrides them. Image sampling uses that authoritative mapping while wrap/filter settings remain separate. Older saved nodes preserve their prior behavior and can opt into local controls.
- Scale stays linked by default. Offset and rotation are unlinked for new Coordinates/Mapping/local controllers; saved user choices remain intact.
- Graph cards now use the same background thumbnail atlas as Properties. Curves draw 2D curve previews directly; collapsed cards remain collapsed by default. Thumbnail work skips collapsed, unselected branches.

## Verification

The final affected regression set covers GPU sampler ports and legacy output, shared splatter data, 2D rasterization/transform/scatter, vertex import/persistence, local-coordinate overrides, Safe Transform identity, mixed resolutions, native graph controls, scene and UV/displacement behavior.

Projects save as schema 34. Keep an older copy if you need to reopen a project with a previous build.
