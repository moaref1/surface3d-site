# Surface3D 0.27.3 interaction fixes

## Changes

- Recovery encoding, file writing and reload verification run on a worker using a stable document snapshot. The UI polls completion without waiting. Atomic replacement and verification remain enabled.
- Graph thumbnails run on a separate renderer/device on a worker at 256px. Results are published to the UI; edits coalesce while dragging, and obsolete contexts are discarded. Full-resolution material output is unchanged.
- Coordinate gizmos follow the shader's inverse coordinate transform, including rotated nonuniform scale. Move, rotate and scale are available.
- Sequential keyboard transforms: press G, R or S, then X, Y or Z. Click or Enter confirms; Escape cancels. Shift reduces sensitivity; Ctrl snaps. Constrained scaling changes only the selected axis.
- Resource budgets use atomic values so preference edits do not race worker validation.

## Measured Plane project, 2K

Evidence: `Plane-2K-background-interaction27.tsv` and `../build-023/plane-interaction27-final/Interaction27-results.txt`.

| Operation | Measured duration | Execution |
| --- | ---: | --- |
| Recovery snapshot | 0.8984 ms | UI thread |
| Recovery save and verification | 1962.43 ms | Worker |
| Thumbnail batch | 336.509 ms | Worker, 256px |
| Bevel thumbnail node evaluation | 7.9084 ms | Worker, 256px |

The earlier user log showed recovery saves blocking the UI for approximately 1.66–1.83 seconds. In this run, UI frames during the background-save interval averaged 0.378 ms, with a maximum of 48.374 ms. This automated run renders without normal presentation pacing; these are diagnostic timings, not a claim about interactive FPS. The fixture's final export/readback phase is excluded from this interval.

Native input tests verify G → Z, R → Y, S → X, pivot preservation, independent constrained axes and Escape cancellation, followed by a verified recovery reload. The Plane source project is read without modifying it; recovery test output uses an isolated evidence folder.

## Remaining limits

Full-resolution costly graph operators and explicit node-to-viewport previews can still stall. Background rendering competes for GPU resources and adds memory overhead. Flushing live graph textures before a recovery snapshot can still require UI-side readback. These changes remove the measured save and thumbnail work from the UI thread; they do not establish that every 2K/4K stutter is resolved.
