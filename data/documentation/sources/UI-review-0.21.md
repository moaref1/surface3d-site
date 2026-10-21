# Native UI review 0.21



Inspected Preferences, selected Bevel in Graph, and Rendering from the actual app.



- Preferences fits all settings in a single panel and distinguishes imported image memory from GPU viewport memory. Budget is typed, bounded 64–2048MiB, default 512. Import edge limits affect subsequent image imports. Saved preferences live beside the executable.

- Bevel is connected visibly between the shape and material output. Its inspector exposes profile, pixel width, threshold, signed height and tile-edge connection; parameters have the existing reset controls. Long inspectors remain scrollable.

- Rendering retains Scene, Viewport and Rendering controls. The sample prop appears with the ground and lights. No library relocation is made: the user clarified that the missing item was viewport geometry.

- Shader/runtime portability is handled by a complete folder/ZIP. Cross-machine camera/MSAA handling is improved; the friend's hardware remains a required manual test.

