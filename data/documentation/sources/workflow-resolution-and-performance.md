# Resolution and performance

New processing nodes default to min(project resolution, 1024). Choose Default, Project or an explicit per-node size. Input resampling is off by default for new nodes: processing can retain an upstream size and resize its finished output. Enabling it resamples inputs before processing at the selected resolution.

Shift slows parameter scrubbing; Ctrl provides supported snapping. Compatible multi-selected parameters can be batch edited by matching name and type. Expensive pixel-neighborhood nodes may need cached fields, additional GPU passes or CPU work. Profiling/log records and the cost view help identify the actual expensive stage. Full 4K work still requires memory and hardware-specific evaluation; do not assume universal real-time performance.

