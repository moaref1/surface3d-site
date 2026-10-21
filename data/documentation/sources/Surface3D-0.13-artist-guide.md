# Surface3D 0.13

Open `releases/Surface3D-0.13/Surface3D.exe`. The package includes its shaders, licenses and 50 library previews. Paint stays usable without displaying nodes. Existing graph/layer/bake/export workflows remain available.

## Type a number

Double-click or Ctrl-click a slider, type a value and press Enter. Window → Show numbers as text fields makes numerical fields permanently visible for the session. Limits remain enforced: roughness and metallic are 0–1; mask values and opacity are 0–1; height remains signed. Color pickers support numeric RGB/HSV/hex entry. Ctrl+Z/Ctrl+Y undo/redo document edits. Camera and brush preferences remain session controls.

## Neutral starting points

New projects and plain fills use neutral gray, roughness 0.5 and metallic 0. A new fill has no mask, procedural pattern or shared template. The eight starting fill presets are grayscale materials with explicit matte/gloss/metal choices. New Color nodes are neutral gray and Color ramps start black to white. Separate PBR channels and Packed ORM export presets specify layout/conventions without artistic effects. Named examples and the optional styled demo are demonstrations, not default templates.

## Ready library

Assets → Generators provides 40 surface/wear/deposit/pattern recipes. Assets → Effects provides 10 adjustments/filters. Search names or descriptions; collapse groups to reduce clutter. Click a recipe to add a separate owned effect: on Material it drives roughness only, on Mask it drives that mask. Drag onto a channel resource slot to attach the recipe to that channel, or onto a material/mask thumbnail to add an owned effect.

Properties edits the real graph parameters while staying in Paint. Graph exposes the same editable network. Recipes read Mesh map inputs semantically, so rebaking replaces the driver automatically. Surface recipes without their required map show a bake notice; patterns work without a bake. Rain film and Ground transport simulate from whole-mesh/ground sources and advance on the GPU toward their editable duration. Surface previews show the actual sample prop; filters show their effect on a sample noise input. These are 50 editable graph recipes built from implemented nodes, rather than 50 new algorithms or exact third-party assets.

## XYZ controls

Coordinates, Mapping, Vector, Vector Rotate and Physics gravity show a chain button and one lock per X/Y/Z row. Linking scale retains proportions; linked offset/rotation/vector values share the change. A locked axis stays fixed during direct and linked edits. Locks/links persist and undo. These are authoring locks, not constraints on values arriving through graph connections.

## UV seams

Brush settings → Paint across UV seams in 3D is enabled by default. A dab uses its hit position, a world-space circular footprint and connected geometric faces, including split/mirrored UV charts. Different mesh groups and back-facing surfaces are excluded. Radius is derived from the hit triangle's UV density. 2D brushing retains a UV footprint. Surface dabs persist/replay, and mesh reimport reprojects their retained UV centers when possible.

Texture Set Settings → Edge padding controls 0–32 pixels. Layer channels, masks, spatial prerequisites and export/viewport composites extend the nearest covered island edge. Tangent normals are copied rather than averaged. Bake padding is separate; use enough space between UV islands for both settings. Existing MikkTSpace tangent conversion is retained and is checked on mirrored charts.

Bake → Projection/Results reports unsplit hard edges, approximate UV overlap and crowded gutters. The overlap/gutter check is capped at 256 pixels, so very small overlaps can escape detection. Padding cannot repair bad UVs, close islands at every mip level, or projection misses. Spatial filters still use UV neighborhoods with padded borders; continuous filtering across rotated charts remains required. Physics remains a bounded 128² surface-film approximation, and its painted source footprints remain UV based.

## Scope

Schema 14 reads older projects; 0.12 cannot open newly saved schema-14 files. Earlier release packages stay separate. Current limits remain one UV0 atlas, 256–2048 textures, eight layers/flat folders, 128 nodes per graph, 16 embedded RGBA8 images and synchronous PNG8 export. The larger production requests are explicitly open in Iteration-0.13-plan.md.
