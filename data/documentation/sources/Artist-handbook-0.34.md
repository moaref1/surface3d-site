# Surface3D artist handbook

This manual is assembled from the current local Surface3D documentation and native node registry. The latest documented authoring build is **0.34**, schema **34**. Older release notes are included as versioned history; their former limits or pending items are not automatically current.

## Start a project

Open the New Project dialog, import a mesh and review material/texture-set assignments. Recent projects are available on the landing dialog. Keep a backup when moving between schema versions. Preserve the complete application folder, including its shaders and runtime resources.

Use Texture Sets to select the material you are authoring. Use Scene to show or hide separate objects. Check UV coverage before painting. UVs outside 0–1 can be intentional for trims; overlapping or repeating UVs share texture pixels, so a stroke can appear on more than one face.

## Layers, channels and opacity

Fill layers define broad channel values or texture/procedural inputs. A connected resource replaces the uniform value; removing it restores the retained value. Ordinary layer editing happens in Paint without opening Graph.

Select the layer material or its mask thumbnail deliberately. Material effects modify material channels; mask effects modify coverage. The top stack entry is evaluated above entries below it. Masks belong to a layer or folder, and effect order changes the result.

Channel-aware blend and opacity controls operate on the currently inspected channel. Material view applies the common material control; channel views make channel-specific editing explicit. Color blend modes should not be used as normal-vector algorithms.

### Folder composition

An isolated folder composites its children separately and then blends the folder result into the lower stack. A pass-through folder lets its children interact with the incoming lower stack and fades the resulting change once. Folder masks control group coverage; child masks remain independent.

### Masks and their effects

White reveals, black hides and intermediate values provide partial coverage. Mask density controls the root mask's strength. Individual Fill/Paint/Graph mask effects and supported filters have their own blend/opacity contracts. Root coverage is not a color layer with an Overlay setting.

For Levels, Invert and Blur mask filters, the current documented contract is `lerp(input, blend(input, filtered), effectOpacity)`. Choose the owning material or mask first; contextual menus then expose suitable operations.

### Normal and height layers

Normals are signed direction data. RNM is the documented default composition, with replacement, Whiteout and UDN alternatives. Height arithmetic preserves signed values. Height-to-Normal can combine a base normal with height-derived detail. Normal and height textures use linear/raw data handling, not display color conversion.

## Brushes, Paint nodes and stencils

Paint layers are the direct workflow. A Paint node makes hand-authored or clone strokes part of a procedural graph. It can edit a grayscale mask or a disconnected result; it does not have to connect to Base Color. Finish returns to the prior viewing mode.

Use the brush panel for radius, opacity, spacing and supported channel values. Stencil controls include an image, camera-facing overlay, placement, opacity and Levels/inversion. See the brush/stencil guides and current shortcut reference for exact input gestures.

Physics Brush is a mesh-connected surface-film/transport solver for water or dirt, not a volumetric fluid simulator. Source marks and solver parameters determine the replayed mask. Use the documented exposed controls; do not assume outputs that the solver does not store.

## Graph editing and reusable results

Right-click empty graph space or use Shift+A to open search. Type a name, navigate with arrows and press Enter to add it. Space previews a selected result in the current 2D/3D/split view. The previewed node has a gold indicator. Ctrl-hover shows native help.

Reroutes organize wires without changing their values. Graph functions expose typed named inputs/results and can be nested. Output identities stay stable when renamed/reordered; removed connected ports and recursive dependencies are rejected.

Output Texture (Anchor) publishes a reusable named project result. Live consumers share the underlying result; this is distinct from exporting an image file. Use the current live-output guide for publication modes, ownership and feedback restrictions. Snapshot export remains useful for portable graph/material assets.

## Resolution and performance

New processing nodes default to min(project resolution, 1024). Choose Default, Project or an explicit per-node size. Input resampling is off by default for new nodes: processing can retain an upstream size and resize its finished output. Enabling it resamples inputs before processing at the selected resolution.

Shift slows parameter scrubbing; Ctrl provides supported snapping. Compatible multi-selected parameters can be batch edited by matching name and type. Expensive pixel-neighborhood nodes may need cached fields, additional GPU passes or CPU work. Profiling/log records and the cost view help identify the actual expensive stage. Full 4K work still requires memory and hardware-specific evaluation; do not assume universal real-time performance.

## Coordinates and projection

Coordinates supplies shared UV, position/normal or procedural projection modes. For supported new coordinate consumers, unconnected inputs use a local hidden controller with Projection, Scale, Offset and Rotation. Connecting a coordinate source overrides/disables the local controls. Wrap/filter settings remain separate.

Scale is linked by default for new controllers; offset and rotation are independent. Non-UV visual coordinate controls are shared by fill-layer Coordinates and graph workflows. Refer to the visual-transform/shortcut guides before editing axis constraints.

## Baking and cleanup

Select the low/high meshes, check name matching and fit the cage. Inspect projection before raising sample counts. Choose only the maps you need. Compatible selective-map rebakes retain other maps; changed source/cage/resolution may require a full bake. Completed maps are published automatically, while live previews are bounded display copies.

Auto, existing GPU compute, DXR hardware rays and CPU are documented engine choices. DXR uses capability checks and has compute/CPU fallback. Look at the engine actually reported in Results. DLSS is not a bake-quality technique. Current generated bake maps are RGBA8; exporting them in a higher-bit container does not create additional source precision.

AO spread, bias/distance, cage direction and hard-edge handling can affect visible seams or face bands. More samples do not fix an incorrect projection. The DXR guide documents tested fixtures and remaining work rather than promising identical performance on every vendor.

## UV editing and model iteration

The UV workspace supports inspection and the documented basic editing/packing workflow. Use checker/island/seam diagnostics, move/rotate/scale and configured padding. Mesh reload/replacement preserves matching authoring state where possible; UV/topology changes can require paint transfer and rebaking. Keep backups and review transfer diagnostics.

Display displacement is optional. Subdivision is budgeted and may fall back/refuse an expensive request. The documented display displacement does not automatically modify exported geometry or ray-render geometry.

## Paths, vertex data and samplers

Vertex Color retains imported RGBA data; choose a color set and use RGBA Split for components. Object ID and Material ID provide region data. Do not automatically interpret packed vertex data as sRGB color.

Polyline, Cubic Spline and Spline Circle create 2D paths. Transform/Merge keep path data, while Spline Render, Spline Fill and Scatter on Spline rasterize image outputs. Fill supports even-odd holes or union. The current path system is a 2D foundation; tracing/bridge/warp and full external-catalogue parity are not claimed.

Current authoring notes describe six Tile Sampler patterns, eight Flood Fill Mapper patterns and eight Shape Splatter shapes, with extended map/selector/fit controls. Splatter Blend, Data Extract and To Mask share placement data; matching logical pattern identities matters. Read the node entry and 0.34 notes for the exposed controls and limitations.

## Export, color and library

Separate color maps from linear data maps. Confirm normal conventions, channel packing, alpha and output format/resolution before export. Texture export and presentation-image rendering serve different outputs. Use the color/export guides for supported format/precision choices.

Library imports, texture-pack assembly, graph outputs and Poly Haven material/HDRI workflows are distinct operations. Select/preview is not the same as applying an asset. Keep cached downloads, source resolution and resource budgets visible while working.

## How to use this reference

The Node Reference contains the compiled native node kinds plus clearly marked source-only definitions, including contextual and retained legacy entries. Socket and parameter tables reflect the default registered mode. Some direct editors and mode-specific controls are described in the guides rather than numeric metadata. This inventory is not a claim of complete Substance Designer equivalence.
