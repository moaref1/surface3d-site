# Surface3D 0.14 missing features — priority audit

The following are still open. Existing controls, fifty recipes, linked/locked values, graph editing, image resources, mask ownership, baking, export templates, texture-pack import and the default HDR studio are implemented; their existence does not mean full Painter/Designer parity.

| Priority | Missing area | Practical impact |
|---|---|---|
| 1 | Continuous surface-aware filtering across rotated UV charts; seam-aware 2D/physics source strokes; automatic mip gutter policy | Remaining seams in spatial effects, simulations and distant sampling |
| 2 | Tablet pressure, stroke opacity, brush alpha/presets/symmetry and normal/height painting | Core production brush workflow is incomplete |
| 3 | Painted cage offsets/skew, source vertex/material/color/emission/alpha transfer and better curvature acceptance | Harder bakes need more control; supplied fitted cube still has one missed AA point |
| 4 | Multiple texture sets, UDIM, 4K+ and bounded tiled processing | One atlas at 256–2048 is the current working scope |
| 5 | Nested folders, isolated group composite/opacity and folder anchors | Complex layer organization/compositing remains limited |
| 6 | 16-bit/HDR and additional export formats, cancellable background exports, per-set outputs, portable templates | PNG8 and blocking export constrain final delivery |
| 7 | Automatic memory eviction, tiled residency, channel-aware allocation and dependency profiling | Large graph/assets still need broader memory/performance engineering |
| 8 | Executable nested subgraphs, multi-output functions/output sockets and requested procedural families | Existing reusable whole graphs and recipes are not full Designer/Blender functions |
| 9 | Configurable simulation resolution and wider physical/seam/small-island validation | Physics is a bounded 128² surface-film model |
| 10 | GPU primary projection / hardware tracing | Secondary maps use GPU acceleration; primary projection remains CPU |
| 11 | Material thumbnails, tags/favorites, external library locations, library material drag/drop and custom pack channel editor | Current library grid covers textures; material reuse uses a searchable local file list |
| 12 | EXR/DDS/TGA image support, higher precision import, arbitrary naming conventions and more packed workflows | Current image import is PNG/JPEG/TIFF/BMP to RGBA8 |
| 13 | Blender/Unreal material creation and certified roundtrips/reference assets | .s3mat is Surface3D's material format; engine wiring is manual |
| 14 | Configurable shortcuts, keyboard-only access, DPI/accessibility and wider hardware/asset acceptance | Existing native UI checks cover the tested Windows/GPU host |

The earlier twelve production areas remain tracked in Iteration-0.13-plan.md. New library/import/export-material work closes the requested 0.14 additions without marking unrelated engine areas complete.
