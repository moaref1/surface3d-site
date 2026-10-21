# Surface3D 0.12 — checks on your own prop

Automated document, GPU and native-input checks passed. These artist checks still need real-asset feedback:

- Import your low mesh, fill its Color/Roughness/Metallic, then drag images onto the channel slots. Remove an image and confirm the previous value returns.
- Add a mask, select its thumbnail and add a fill/generator. Confirm the mask highlight, selected source and Properties are clear. Double-click the mask to enter/exit preview.
- Change projection/tiling from Paint, then open Graph and inspect the same image/Coordinates. Change the source in Graph and return to Paint. Confirm no duplicated or lost edits.
- Add Rain film or Dirt transport to a mask. Try painted, ground and whole-mesh sources. Adjust duration and Mask gain, compare the Source/Result tiles, and preview the result on the prop and UVs. Check seams and whether the 128² simulation grid is sufficient for that effect.
- Apply a source or simulation to a folder mask; save and reopen. Confirm all child layers still receive it.
- Bake your real high/low/cage set and export with your engine template. Inspect the result in Blender or Unreal; this iteration preserves the existing baking/export behavior.
- Resize the window and test your usual display scaling. Look for hidden channel tabs, clipping, ambiguous icons, unwanted workspace changes and graph shortcut conflicts.

The package includes Paint-texture, Rain-whole-mesh, Folder-mask and Shared-projections examples. Use copies when testing changes.
