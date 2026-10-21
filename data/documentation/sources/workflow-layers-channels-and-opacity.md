# Layers, channels and opacity



Fill layers define broad channel values or texture/procedural inputs. A connected resource replaces the uniform value; removing it restores the retained value. Ordinary layer editing happens in Paint without opening Graph.



Select the layer material or its mask thumbnail deliberately. Material effects modify material channels; mask effects modify coverage. The top stack entry is evaluated above entries below it. Masks belong to a layer or folder, and effect order changes the result.



Channel-aware blend and opacity controls operate on the currently inspected channel. Material view applies the common material control; channel views make channel-specific editing explicit. Color blend modes should not be used as normal-vector algorithms.



### Folder composition



An isolated folder composites its children separately and then blends the folder result into the lower stack. A pass-through folder lets its children interact with the incoming lower stack and fades the resulting change once. Folder masks control group coverage; child masks remain independent.



### Masks and their effects



White reveals, black hides and intermediate values provide partial coverage. Mask density controls the root mask's strength. Each mask effect can adjust how it combines with the mask below it. Use blend mode to choose the operation and opacity to control its strength.



Select the material thumbnail to adjust its appearance, or the mask thumbnail to adjust where it shows. Effects are applied in stack order; use their opacity to reduce the strength of a change.



### Normal and height layers



Normals are signed direction data. RNM is the documented default composition, with replacement, Whiteout and UDN alternatives. Height arithmetic preserves signed values. Height-to-Normal can combine a base normal with height-derived detail. Normal and height textures use linear/raw data handling, not display color conversion.



