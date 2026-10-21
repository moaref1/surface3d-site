# Surface3D 0.14 artist acceptance

Automated checks passed separately. These checks still need artist feedback on real packs and props.

- [ ] Import several unrelated images; search their names, compare grid/list and thumbnail sizes, then drag to a layer, mask and node. Check undo/reopen.
- [ ] Drop a named BaseColor + ORM + Normal pack from Explorer. Check review assignments, create the material and compare all channels.
- [ ] Import a pack containing separate AO/roughness/metallic and an ORM map. Exclude the redundant maps. Check that ambiguous enabled duplicates produce a clear error without a partial layer.
- [ ] Select one image from a folder containing several materials. Confirm that the intended group is preselected and other groups can be chosen.
- [ ] Check NormalDX versus NormalGL in your target engine. Check gloss inversion and height zero/range with your own textures.
- [ ] Save selected to Materials, start another project and add it from the library. Check graph editing, image embedding and absence of an automatic mask.
- [ ] Export Separate PBR and Packed ORM. Import their material.s3dpack and material.s3mat. Compare the texture output to the reconstructed material. Check Unicode and long filenames.
- [ ] Inspect the default studio on glossy metal, rough metal and dielectric materials. Rotate/expose it, import a .hdr and restore Default studio.

Known limits: PNG/JPEG/TIFF/BMP, 2048 per image, sixteen images and 192 MiB per project. Filename detection follows documented suffixes; custom mapping editor is absent. Library uses a local searchable material list, without tags/favorites/rendered material thumbnails/external library paths. Exported image materials retain the final output, not original procedural history. No automated Blender/Unreal material creation is included. Larger engine/seam gaps remain listed in Missing-features-0.14.md.
