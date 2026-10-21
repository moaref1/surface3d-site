# Adjustable resource budgets

File > Preferences now provides budgets for layers, folders, effects per layer, paint stamps, paint-node marks, simulation marks, library textures, published texture outputs, shared graphs, texture sets / mesh imports, scene objects / material slots, low mesh triangles, individual and combined bake-source triangles, import file size and project file size.

Use **Remove content budgets** to disable them together (including image memory), or enter **0** to remove one of these application budgets. Defaults preserve existing project behavior. These settings do not reserve memory or make hardware unlimited. Allocation failures and genuine API/format bounds still apply. Save preferences persists settings beside the executable. Resource controls are disabled during an active bake; reducing a content budget is rejected if the current project already exceeds it. No data is deleted. Projects must reopen with budgets large enough for their content.

Image memory no longer has a 2 GiB ceiling; 0 disables this budget. This counts CPU image sources, including HDR precision, rather than total VRAM. The budget also validates published outputs and inactive set sources. Image import accepts an adjustable edge up to 16384. This change is source import/validation support; full square 16K HDR import and GPU processing have not been stress tested.

## Engine capacities that still require development

- 128 expanded GPU instructions per graph. The editable graph-node budget can be set from 1 to 128. Graph function expansion still must fit that same evaluator.
- 16 source textures and 16 spatial input fields per graph pass. The library catalogue is separate from these bindings.
- Working and baking resolution remain up to 4096; image writer remains up to 8192.
- Project format retains a 32-bit payload size (below 4 GiB), explicitly checked before writing.
- Function ports, custom code size, exposed parameter/control counts, export-template counts, recursion, identifier width and parser field bounds retain structural safeguards. These are not removed by 0 budgets.
- HDR environment loader still has its existing dedicated resolution constraints.
- DXR buffers and dispatch packets remain bounded scheduling units. They do not cap total bake texels.

A multipass graph evaluator, tiled texture processing and paging are required to raise these capacities responsibly. This build does not claim unlimited graphs, unlimited VRAM or improved 4K processing speed from simply increasing budgets.

## Cage overlay fix

The cage surface previously recomputed relative distance scale (a whole-mesh bounds scan) for every drawn corner, every frame. The preview now computes that scale once when geometry/projection settings change and caches exact cage positions. It preserves the full triangle mesh and its baking origin calculation. Mesh, imported cage pointer, front distance, relative distance mode, low-as-high, cage toggle, averaged normals and projection blend invalidate the cache. Camera movement only reprojects cached positions; color/opacity changes do not rebuild geometry. Drawing the full overlay still scales with triangle count and uses the existing ImGui overlay path.
