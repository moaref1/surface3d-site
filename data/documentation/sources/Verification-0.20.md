# Surface3D 0.20 development verification — 2026-10-09

Status: development build, not sealed or packaged. The sealed 0.19 release is unchanged.

## Build and direct checks
- `tools/build_iteration20.cmd` succeeded with the supported Windows compiler/runtime.
- Numeric GPU layering test passed: per-channel adjustment, mixed source/pass, zero weight, lower-stack dependency refresh, root density, isolated/Pass Through folder coverage, folder Multiply, signed height, flat RNM identity and schema-22 round trips.
- Independent mask entries: Invert Multiply/Screen, separate upper-entry opacity, Levels/Blur Multiply, zero filter opacity and persistence passed. Fixtures use valid original document IDs and supported blur radius.
- Actual native mouse/keyboard test passed: roughness Multiply, typed 37% with color isolation, Pass Through selection, mask Invert Multiply without modifying owner/material-effect blend, folder and mask states, project round trip.
- Existing mask/effect/anchor and layer/bake native checks passed. This does not certify the still-pending Pass Through anchor dependency path.

## UI review
Reviewed real folder, root mask, independent mask-entry and pass-through captures. See `UI-review-0.20.md` and `build-020/studio-layering20-evidence`.

## Compiler experiments and current acceptance
Per-built-in-graph specialization exceeded the 180-second generator budget and the 300-second all-node check. A level-0 experiment also exceeded generator acceptance. Both were reverted. Built-in graphs now use one shared interpreter kernel, compiled with SKIP_OPTIMIZATION; ordinary graph topology edits return that existing kernel without compiling variants. Custom HLSL retains specialized/bucketed variants and level-1 compilation; other stages retain level 3.

The resulting build passed the 50-generator check in **48.76 seconds**, the dependent native library fixture in **3.44 seconds**, all-node/brush/bake check in **42.99 seconds**, numeric layering in **7.59 seconds**, and native layering in **0.96 seconds** (five checks, 103.85 seconds total). This is measured suite acceptance on this machine, not a GPU-throughput claim.

An older test asserted Screen on tangent normals and signed height. Its contract was updated to require Screen on the six compatible channels and typed defaults on Normal/Height; it then passed, including the rest of its cage/seam/curvature checks. The final full run passed **51/51 checks in 178.82 seconds**. The warm-cache generator check took **1.12 seconds**, all-node/brush/bake **39.55 seconds**, numeric layering **7.35 seconds**, and native layering **0.94 seconds**. The full run used the final executable and shader sources. Packaged executable validation is still required before sealing a release.

## Executable identity
Development EXE SHA-256: `16eb6d5e093c3cb48c56b1ca5634fbec89f69e92ae228bb69b5360fb1fb12f6e`.

No universal GPU performance, hardware compatibility or full Painter/Designer parity claim is made.
