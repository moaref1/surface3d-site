# Surface3D 0.28 assets development

50 additional compound procedural presets (IDs 50–99) join the existing 50 recipes. They combine existing surface/pattern drivers with independently editable breakup scale, seed and coverage controls. They are editable graphs, not 50 new node algorithms. Groups remain Surface, Wear, Deposits, Patterns, Adjustments and Filters.

Demo-pipe thumbnail generation now requests the DXR backend when DXR 1.1 is available, otherwise the compute backend. All ten mesh maps are published to the demo project. Preview assets are 256px; this does not change project authoring resolution. Existing IDs 0–49 remain stable. Library thumbnail storage expands to 100 entries.

The executable compiles. The combined regression check timed out before generating previews; focused generation is run separately. The newly added advanced nodes remain development work and have not received a complete production audit.

Focused generation passed for all 100 recipes on NVIDIA GeForce RTX 5050. Demo-pipe DXR hardware-rays bake: 310.646 ms, 256px, eight rays, one-pixel padding. All 100 PNG previews and baked demo project were generated. This timing is not a 4K bake benchmark.
