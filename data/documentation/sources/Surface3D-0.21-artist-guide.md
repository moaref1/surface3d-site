# 0.21 shape and blur guide



In Graph, search Blur under filters. Spread is measured in pixels; its support extends approximately twice the spread in each axis. Box and Gaussian are separate kernels. Zero spread preserves the source. Directional Blur uses Radius and Angle; Non-Uniform Blur receives a radius mask. High Pass removes the low-frequency component around neutral gray.



Under Shapes / Processing, connect a binary or grayscale mask to Flood Fill, Distance Field or Bevel. Threshold selects the foreground. Connect across tile edges is enabled by default; disable it for disconnected image borders. Flood Fill Output chooses island random gray/color, index, center UV, bounding size or gradient. Distance Field chooses Inside, Outside or Signed, with Range in pixels. Bevel uses Width in pixels, Profile and signed Height; feed it to height or Height to Normal.



Under Patterns / Distribution, connect an image or mask to Tile Sampler. Columns/Rows control the grid, Size controls pattern coverage, and seeded position/size/rotation variation adds irregularity. RGBA patterns compose with alpha; scalar masks combine by maximum. Normal/vector sources are converted to scalar, not distributed as normal maps. Use Height to Normal after distributing a height mask.



Blur and Tile Sampler execute on the GPU. Flood Fill, Distance Field and Bevel currently read back the input and perform full-resolution CPU analysis, then upload and cache their result. Changing their input or parameters recomputes it; moving/renaming a node does not. Large analyses can pause the interface. These are single-image texture operations, not mesh topology tools.



Save creates schema23 projects. The new executable opens earlier projects; older executables cannot open schema23 projects. Keep a copy before saving an older project in this build.



## Preferences and sharing



File > Preferences controls image memory (default 512MiB,64–2048), texture import size (256–2048), typed numeric values, locked docked panels and viewport antialiasing. Save preferences persists them beside the executable. Image memory includes imported float data and previews per texture set; it is not a GPU VRAM allocation limit. Existing graph, layer and 16-source-image limits remain.



For larger Poly Haven materials, raise the image limit or choose a smaller import size before importing. Existing images are not resized when the preference changes. Reducing the budget below loaded project needs is rejected.



Extract and send the complete development ZIP/folder. Open Surface3D.exe from that folder. Rendering opens in live view and frames all visible geometry on its first entry. Unsupported color/depth 4xMSAA falls back to single-sample rendering. Confirm the missing-object issue on the friend's PC with this package.

