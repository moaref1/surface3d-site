# Native UI review: contextual effects and graph authoring

Evidence is captured from the shipped ImGui widgets by `studio_context23_smart_effect_menus`, not a generated mockup. Images are in `build-023/studio-context23-evidence`.

- Material-menu.png: direct common operations; mask creation/settings remain attached to the selected layer. No material-versus-mask question.
- Mask-menu.png and Effect-menu.png: direct mask operations from the mask thumbnail, and Add effect uses the owning mask when opened on its effect row.
- Mask-effect-row.png: selection and the mask lane identify the actual owner.
- Live-texture-controls.png: Auto update is a checkbox beside a published image's settings. It explains that publication is shared.
- Paint-node-canvas.png: a disconnected grayscale Paint node opens its own UV canvas.
- Function-instance.png: named input/output sockets, custom title plus original Graph Function type; exposed controls live in Properties.
- Function-source.png: explicit source name, typed Graph Input/Output controls and a Back arrow. The source edits defaults and shared nodes; instance data preview is pending.

The prior dock arrangement and palette remain. Advanced choices are grouped instead of duplicated target submenus. Missing baked-map or anchor prerequisites have disabled choices with relevant hover explanations. Folder material effects remain unavailable, avoiding accidental insertion into a previously selected layer.

Native clicks verify ownership from an initially different folder/mask selection, selected effect state, live graph image updates, no refresh on cosmetic rename, persistence and return from function source/Paint editing. Full-size 4K data/graph/export behavior has a separate acceptance check; it does not establish every high-DPI, layout or accessibility case.
