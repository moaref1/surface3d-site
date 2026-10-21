# Baking and cleanup

Select the low/high meshes, check name matching and fit the cage. Inspect projection before raising sample counts. Choose only the maps you need. Compatible selective-map rebakes retain other maps; changed source/cage/resolution may require a full bake. Completed maps are published automatically, while live previews are bounded display copies.

Auto, existing GPU compute, DXR hardware rays and CPU are documented engine choices. DXR uses capability checks and has compute/CPU fallback. Look at the engine actually reported in Results. DLSS is not a bake-quality technique. Current generated bake maps are RGBA8; exporting them in a higher-bit container does not create additional source precision.

AO spread, bias/distance, cage direction and hard-edge handling can affect visible seams or face bands. More samples do not fix an incorrect projection. The DXR guide documents tested fixtures and remaining work rather than promising identical performance on every vendor.

