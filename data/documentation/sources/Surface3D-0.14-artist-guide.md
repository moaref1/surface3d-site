# Surface3D 0.14 — library and materials

Run releases/Surface3D-0.14/Surface3D.exe with assets, shaders, shader-cache and licenses beside it. Earlier releases remain separate. Projects still use schema 14; the material-pack metadata format is independently versioned.

## Import textures

Assets has one Import menu and clearly highlighted categories. Choose Textures (multiple) to embed several images in one undoable operation. Textures provides a searchable thumbnail grid, a list view, adjustable thumbnail size, dimensions, tooltips and a count/storage total. Drag these thumbnails onto Paint channels, masks or graph inputs as before. Explorer files can also be dropped onto the app: ordinary images import together; recognized material names open the pack review.

Supported images are PNG, JPEG, TIFF and BMP decoded to RGBA8, up to 2048×2048. The existing sixteen-image / 192 MiB embedded-pixel limits still apply. EXR, DDS and TGA texture import are not added in this build.

## Import a material pack

Import → Material from texture pack accepts several maps, one map (then scans sibling images), or a material.s3dpack file. It groups common channel suffixes by material name and folder, ignoring common resolution suffixes. The selected image's material is selected in the review. The material selector lets you choose among multiple detected packs.

Recognized suffixes, case insensitive with spaces/underscores/hyphens:

| Purpose | Suffixes |
|---|---|
| Base color, sRGB | BaseColor, Albedo, Diffuse, Color |
| Roughness, linear | Roughness, Rough, Glossiness, Gloss (inverted) |
| Metallic, linear | Metallic, Metalness, Metal |
| Tangent normal, linear | Normal, NormalGL, NormalDX |
| Height, linear | Height, Displacement |
| Ambient occlusion, linear | AO, AmbientOcclusion |
| Emission, sRGB | Emissive, Emission |
| Opacity, linear | Opacity, Alpha |
| Packed channels, linear | ORM / ARM = AO, Roughness, Metallic; RMA = Roughness, Metallic, AO |

Review the actual channel assignments and color space, rename the material, set DirectX normal direction, and uncheck duplicate/unwanted maps before Create material. Unknown images are reported rather than silently assigned. Two enabled maps for one channel are rejected. Naming detection is a convention, not an analysis of pixel contents. Arbitrary texture names require renaming or a metadata pack; a custom channel-mapping editor is still missing.

The import creates a fill with no mask, actual editable image/channel/normal/height nodes, shared Coordinates and retained fallback values. Base color/emission are decoded once from sRGB, scalar/normal data stays linear, packed maps are separated, normal direction is decoded and height maps use 0.5 as zero. All eight PBR channels are supported. Edit in Paint or open the same graph; remove a resource to return to its fallback. Import, save/reopen and undo/redo retain the graph and resources.

## Reuse and export materials

Materials → Save selected stores the active material as an embedded .s3mat in this app folder's library. Click a saved material to add it to another project; Refresh rescans up to 256 material files. Clean material names are shown and the full path is available on hover. The header export icon saves the selected material to a location you choose. Saved layer materials retain their editable graph and embedded textures. The current material library is a searchable list; rendered thumbnails, tags, favorites, external library locations and material drag/drop still need work.

Ordinary texture export now writes material.s3dpack beside its PNGs, describing exact channel packing, color space, normal direction and the material name. It also writes material.s3mat when those outputs can form a material within the embedded-image budget. The standard Separate PBR and Packed ORM templates are tested. If a custom template exceeds the material limits, conflicts on channels or cannot form complete RGB channels, the reference pack remains available and Material-notes.txt explains why no embedded material was created. The texture job still commits through a separate partial folder.

These exported materials are image-based reconstructions of the exported composite. They do not preserve the original layer stack or procedural history. Use Save selected/project save for that. The .s3mat is a Surface3D material, not a Blender .blend or Unreal .uasset; automated engine material creation is still missing. A metadata pack depends on its adjacent image filenames; an embedded .s3mat carries its own images.

## Default lighting

New app sessions load an original neutral HDR studio environment: 512×256 linear floating-point radiance, grayscale illumination, with bright light panels above 1.0. No downloaded image/license is required. Lighting → Default studio restores it. Import HDRI or drop a Radiance .hdr file to replace it. Environment rotation, intensity and exposure remain adjustable; Shift+RMB rotates it. This is procedural studio lighting, not a photographed location. Environment/camera preferences remain session settings.

## Validation and acceptance

37 development checks cover existing behavior plus pack detection, real GPU channel/color/normal/height/ORM roundtrips, material export/persistence, long filenames, duplicate exclusion/path validation and HDR range. Native input checks click the pack confirmation and material save, then test undo/redo and capture the actual library/dialog. Packaged verification is in Verification.md.

Try your own packs, normal conventions and folder names; compare in your game engine. See Surface3D-0.14-artist-tests.md and Missing-features-0.14.md for the remaining work. This release does not close the larger production backlog or continuous cross-chart filtering.
