# 0.22 native interface review

Inspected `build-022/nodes22-evidence/Crop-UI.png` from the actual Surface3D executable on October 10, 2026. This is an application capture, not a design mockup.

Color, Crop and Material Output appear as separate arranged nodes with clear connected ports and previews. Selecting Crop exposes its mode, name, Left, Top, Width and Height controls in Node Properties, retaining typed values and reset controls. Paint properties still identify the owning material channel without requiring graph editing. The screenshot contains no visible duplicate-widget warning or overlapping dock windows.

The fixture's viewport shows Roughness while its graph modifies Base Color; its gray sphere is expected and is not evidence of the crop's color result. The Crop and output node previews show the connected color result. Further artist review should switch to Base Color and compare transparent crop versus fitted crop with a spatially varying image.

Remaining usability work: empty-library copy and toolbar density, redundant ownership labels between panels, narrow parameter scrolling, consistent artist naming across legacy nodes, and clearer context when the viewed channel differs from the edited channel. This single screenshot does not validate every new operator, graph interaction or docking arrangement. Existing native graph and artist mouse/keyboard checks passed separately.
