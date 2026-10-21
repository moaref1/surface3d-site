# Surface3D 0.23 development preview

Run the complete preview folder's Surface3D.exe. Keep shaders, shader-cache, assets, licenses and runtime files beside it. Schema 25 saves require this build; retain copies of older projects.

## Adding effects

Right-click the material swatch or layer name for material operations. Right-click the mask thumbnail or a mask effect for mask operations. Levels, Blur, Invert, Paint and Fill inherit that target automatically. The toolbar's effect button uses the current selection. Generators, Graph and Simulation collect the advanced choices. Add mask appears only when there is no mask; an existing mask shows its relevant settings.

## Reusable graphs

Select nodes in Graph and choose Create function. Boundary connections become typed named ports; the selection becomes a reusable Graph Function instance. Functions appear in the add/search menu. A function can return several Value, Color, Vector, Boolean, Integer or signed Normal results.

Select the instance, then use Open editable shared source (code icon). Add Graph Input and Graph Output inside that source; choose their data type, set input defaults and name ports. Use Expose controls to present useful parameters on instances. Each instance can override exposed controls; Reset returns to its shared default. The source editor edits shared defaults; its preview does not yet show the enclosing instance's incoming texture. Back returns to the enclosing graph. Source changes update instances.

The authored graph and expanded execution graph each have a 128-node limit. Functions support up to 32 inputs/results, 16 levels of nesting and 64 source definitions. Multiple named outputs use stable IDs: renaming/reordering a result preserves connections. A removed connected port, recursive dependency or over-budget expansion is rejected. Alt-click an output to disconnect its wires; deleting nodes and cutting wires also clear their selected result references.

## Graph textures and sampling

Connect Texture Output and use Update to publish its image into the project library. Reuse that image in another layer, mask or graph. For a published image, enable Auto update on its image consumer to refresh after supported upstream graph edits. The published image is shared: other live users or an explicit Update can refresh it even when one consumer's Auto update is off. Missing producers, direct texture feedback and multiple producers sharing one output identity are rejected.

Sample Texture takes an Image from any computed node and Coordinates from the shared coordinate/vector workflow. Use Repeat, Clamp or Mirror and Point/Bilinear filtering. Image-space outputs can therefore be tiled/projected after procedural evaluation. Offset blends the relocated seam; zero offset can blend the original boundary. Paint/Clone can repair the image manually.

Select a Paint node and enter painting directly. It can be disconnected or produce a grayscale mask; it does not need to feed Base color. Finish returns to the view used before painting. Renamed nodes display their original type as well as their chosen name.

Portable graph and material assets contain snapshots of graph textures; producer links belong to projects. Graph assets preserve nested function sources and required images. Material assets currently flatten functions.

## 4K workflow

Choose 4096 in Texture Set settings for 4K Paint/graph evaluation, and independently choose 4096 in Bake. Bake resolution can be higher than the editing resolution. The live bake preview is bounded to 256-square display images; completed maps retain their full 4096 size. Export ready maps writes those full-size bakes.

New imports retain up to 4096. File > Preferences controls the import size limit and CPU source-image budget. Defaults are 4096 and 1024 MiB; existing saved preferences remain in effect. The budget counts HDR precision as well as previews and is separate from GPU allocations. Eight-bit RGBA 4K images require 64 MiB each; float RGBA plus a preview requires 320 MiB each.

Texture export supports compatible PNG/JPEG/TIFF/EXR/HDR precision options. The texture set resolution determines evaluation size. Color transforms are distinct from Raw data-map output. Baking currently produces eight-bit data maps; choosing a 16-bit export container does not invent extra bake precision.

Use Check projection while adjusting the cage. Use Bake changed after editing one map's settings; source/cage/resolution changes require a full bake. Expensive secondary samples and AA multiply work, so compare settings deliberately. Higher quality cannot correct a wrongly fitted cage. Primary projection remains CPU, with optional GPU secondary tracing. No Toolbag speed parity or DXR baking is claimed.

Read [verification](Verification-0.23.md) and the [remaining scope](Iteration-0.23-plan.md). All Designer nodes and the requested 400-asset library remain unfinished.

## Latest controls

Empty graph canvas right-click or Shift+A opens node search. Type a name, use arrows to choose a result and Enter to add it; Escape closes. Space previews the selected node in your current 3D, 2D or split view. Edit its parameters without switching layers to refresh the preview. Finish painting restores the view saved before opening a Paint node canvas.

Use the graph cost icon to highlight cached/computed spatial fields. Hover for CPU preparation, shared scratch memory and the cache reason. Nodes in the shared GPU interpreter do not have individual GPU timings here. Disconnected expensive nodes wait for an output connection or explicit Space preview.

Materials expose named channel sockets and channel-grouped parameters. Split RGBA has four named outputs. Renamed nodes retain their original type beneath the name. Curvature Filter offers Curvature, Convexity and Concavity results.

Import more than 16 library images within the configured source-image budget. Images used by a graph may come from anywhere in the library. A single evaluated graph pass currently supports 16 distinct image sources; unused images use small library thumbnails instead of full-resolution GPU uploads.

In Bake, right-click a map and choose Rebake this map. Compatible existing maps remain in the library and remain available for viewing. Smooth UV normal seam repair respects each chart's tangent basis and skips hard edges. Review cages and projection coverage before increasing quality.
