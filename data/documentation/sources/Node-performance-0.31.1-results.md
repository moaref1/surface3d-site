# Surface3D 0.31.1 — follow-up fixes

- New nodes start with their thumbnail previews collapsed. Existing saved node choices remain intact.
- No thumbnail job is launched when the current graph has no expanded previews.
- Adaptive lower-resolution parameter editing defaults to off. An explicitly saved preference remains respected.
- Advanced/Designer spatial kernels now use source-and-settings-keyed, reflection-validated disk bytecode caches shared by viewport and thumbnail renderer instances. Cold compilation is logged separately. Cold cache misses are still synchronous; this is not a claim of instant first-use compilation.
- Tile Sampler / Shape Splatter build their connected pattern list once per pixel instead of once per candidate tile. Placement, ordering and sampling rules remain unchanged.
- Viewport window cleanup runs on exceptions and early returns, preventing this panel from leaking its ImGui window scope.

## Resolution distinction

Ordinary procedural nodes currently inherit the texture-set evaluation resolution. The existing 1K node preference is for Output Texture publication, not a fixed resolution on every node. Fixed resolution for arbitrary nodes still needs evaluator support and is not advertised as implemented.

## Pending

- Explicit fixed/inherited resolution for arbitrary node fields, including dependency resampling and cache identity.
- Asynchronous cold compilation for advanced spatial shaders.
- Reduced readback waits for Flood Fill and fresh Bevel inputs; repeated full-quality layer changes must be measured separately.
- Sustained 2K/4K performance and multiple GPU-vendor verification.

## Verification

Seven affected checks passed; portable startup captured successfully. Plane 2K controlled Tile Sampler own-edit median (three edits, full diagnostic color readback included): previous 135.47 ms, new repeated-process run 79.68 ms. Initial evaluation still took 3.84–5.15 seconds including GPU readback/initialization waits, so first-use latency is not solved. This is one controlled graph on RTX 5050, not a universal frame-rate claim. Raw evidence: work/node-delay311/Plane-TileSampler-0.tsv and -1.tsv.
