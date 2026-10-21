# Paths, vertex data and samplers

Vertex Color retains imported RGBA data; choose a color set and use RGBA Split for components. Object ID and Material ID provide region data. Do not automatically interpret packed vertex data as sRGB color.

Polyline, Cubic Spline and Spline Circle create 2D paths. Transform/Merge keep path data, while Spline Render, Spline Fill and Scatter on Spline rasterize image outputs. Fill supports even-odd holes or union. The current path system is a 2D foundation; tracing/bridge/warp and full external-catalogue parity are not claimed.

Current authoring notes describe six Tile Sampler patterns, eight Flood Fill Mapper patterns and eight Shape Splatter shapes, with extended map/selector/fit controls. Splatter Blend, Data Extract and To Mask share placement data; matching logical pattern identities matters. Read the node entry and 0.34 notes for the exposed controls and limitations.

