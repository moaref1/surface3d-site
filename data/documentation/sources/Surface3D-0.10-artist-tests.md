# Surface3D 0.10: tests awaiting the artist

Automated fixture results are separate from these unchecked production checks.

- [ ] Open the packaged application; locate Custom HLSL through search and the code icon. Edit a useful texture function, compile, save, reopen and compare its result.
- [ ] Drag real color, roughness and normal assets onto graph/socket/channel/material/mask targets. Verify the selected context, linear/sRGB choice and undo; test different image sizes.
- [ ] Share Fill coordinates or Mapping among two images and a noise. Compare repeat/clamp/mirror, linked/unlinked scale, rotated UVs and nearest/bilinear sampling.
- [ ] Create nodes at several zoom/pan positions, near other cards and canvas edges. Check nearest placement, selected-group snapping, typed magnet targets and cycle rejection.
- [ ] Texture a real game prop; switch between material/mask/effect/node without confusing the active target. Use layer channel tabs and node input controls at 100%, 125%, 150% and 200% Windows scaling.
- [ ] Bake the supplied cube using Fitted-cube settings; compare original high details, corner normals, six UV seams and undilated coverage. Investigate the remaining missed sample before declaring final quality.
- [ ] Use Fit distances on Blender and Unreal meshes with differing scale/name suffixes. Test separate groups, explicit cage, backface and rear-hit settings; inspect normals against target-engine tangents.
- [ ] Rebake only AO and confirm live Mesh map nodes and material AO update while unaffected image IDs/content remain. Override a semantic map and its normal convention, undo, save and reopen.
- [ ] Apply Rain to a black mask over a stain fill. Tune density/width/length/gravity and compare AO/world-normal influences with and without maps. Confirm whether the bounded UV footprint fits the artistic use.
- [ ] Apply Dirt from Ground and Brush stroke origin, including Z-up meshes. Tune ground height/coverage/growth/breakup; paint, erase, undo and reopen a long session.
- [ ] Inspect Weathered-pipe and Fitted-cube examples in the delivered app. Compare against Painter/Toolbag under the same geometry/tangent/ray/AA settings, rather than screenshot appearance alone.
- [ ] Exercise export templates and channel packing with actual Unreal/Blender assets. Validate PNG8 precision and normal convention; high-precision/UDIM output remains a future feature.
- [ ] Measure long high-poly sessions, peak process GPU usage/budget, CPU cache and resource release on another GPU/driver. A fixture pass is not a production performance or device-loss certification.
