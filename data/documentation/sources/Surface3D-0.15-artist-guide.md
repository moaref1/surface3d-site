# Surface3D 0.15 — branding and compact UI

Open releases/Surface3D-0.15/Surface3D.exe. Keep all package folders beside it.

The selected layered procedural mark is embedded into the executable and appears in its window/taskbar and main menu. The transparent PNG and SVG master are in assets/branding. Windows may cache Explorer icons for a previously used path; this release uses a new folder.

Paint / Bake / Graph remain named, with the active workspace highlighted. The charcoal theme, teal material ownership and violet mask ownership remain. The Assets category strip uses icons; hover reveals the category and the active category name stays visible beneath it. Import is the plus icon; export is the down arrow.

Viewport controls: cube = 3D, grid = 2D, divided rectangle = split, corners = frame, crosshair = navigate without painting, sliders = camera/lighting. Shortcuts are retained. The graph uses original layer/mask/procedural symbols. Coordinate, texture, reset and delete controls use concise icons with hover labels. Export template actions use copy, plus and trash; Bake final and Export textures retain their names.

No feature removal or document format change is intended. Existing painting, graphs, baking and export behavior remains. This pass improves the control hierarchy; it does not finish the production gaps documented in Missing-features-0.14.md.

Artist checks pending: confirm the icon in Explorer and taskbar, hover the Assets categories, switch 3D/2D/split, edit a fill and its mask without Graph, duplicate an export template, review the workspace at your display scaling. Automated and visual review evidence is recorded separately.
