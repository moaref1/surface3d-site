# Process logging — Surface3D 0.27.1

Open Window > Log. Recording runs in the background even when the panel is closed. Use Longest first, Stalls only (8 ms+), and the text filter to locate expensive work. Pause with Record; Clear view clears history without deleting the disk log. Copy log path locates the current TSV file under %LOCALAPPDATA%/Surface3D/Logs.

The logger records application CPU stages, node evaluation, shader compilation, graph compilation, validation, history, project I/O, GPU readback, viewport rendering, and available deferred GPU stage timestamps. Each entry includes duration, resolution, thread, layer/effect/node identifiers where available, and details. CPU entries shorter than 0.25 ms are omitted. The panel refreshes twice a second and uses clipped rows. Disk writes run on a separate buffered writer. History is bounded to 4,096 entries; the pending file queue to 8,192 entries, with an overflow counter. Files rotate at 16 MiB to one previous file per session.

These are application measurements, not a trace of every operating-system or driver operation. CPU durations are inclusive elapsed wall time and may contain waits. GPU timestamp intervals can include submission gaps. Nested timings overlap and must not be added together. The separate ray renderer currently records CPU completion time, not every ray GPU pass. Existing GPU queries are read without forcing a flush or waiting for completion.

## 2K Plane findings

Measured with Downloads/Plane.s3d at 2048 on the local machine:

- Initial evaluation plus readback: 3,986.59 ms; initial layer replay CPU interval: 3,531.36 ms.
- Document validation: approximately 20–23 ms.
- Unchanged rebuild submission: 23.42 ms; cosmetic rebuild: 23.05 ms.
- Four readbacks accumulated 178.59 ms of GPU waiting in the renderer metrics.
- Estimated texture allocations: 2,555.88 MiB; DXGI local process memory approximately 2,710 MiB.

See Plane-2K-process-log-profile.txt for the full harness report. This is not a measurement of interactive camera rotation or HLSL parameter dragging.

The UI authoring path now skips a duplicate validation when the exact unchanged document was just validated by its caller. Draft-resolution and ordinary renderer callers retain validation. This removes redundant work; no overall stutter-free claim is made.

Custom HLSL shader cache misses can still compile synchronously during evaluation. Graph topology changes can change generated shader source even when custom code is unchanged. The new log makes lookup/compile stages visible; asynchronous cache-miss scheduling and reducing shader variant churn remain follow-up work.

## Defaults and verification

New documents/projects use 1 px seam padding. Saved project values remain unchanged.

Four checks passed: texturing residency/live outputs, Designer operator contracts, native smart effect menus, and concurrent logger flushing/padding. The Log panel was captured and visually inspected in build-023/Log-panel.png.

Designer-open-nodes-0.27.1.md lists 177 pending reference entries and 171 partial entries. Pending means checklist coverage is unverified; some already have equivalent general operators. Partial is not full Designer parity. No new Designer nodes were added in this logging change.
