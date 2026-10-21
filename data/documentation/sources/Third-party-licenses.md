# Third-party source

Dear ImGui, by Omar Cornut and contributors, MIT license.

Source: https://github.com/ocornut/imgui

Pinned tag: v1.92.2-docking; commit: 031a18c417158427217bc5890e0ec0cb7e7b4b63.

License text: `vendor/imgui/LICENSE.txt`. The library is compiled into Surface3D's UI target. Unmodified upstream Win32 and DX11 backends are used. Installed Adobe/Qt libraries are not linked.

Assimp, by the Assimp team, BSD 3-clause license. Source: https://github.com/assimp/assimp . Pinned v5.4.3, commit `c35200e38ea8f058812b83de2ef32c6093b0ece2`. Unmodified source lives in `vendor/assimp`; `LICENSE` contains the notice. Only OBJ/FBX/glTF/Collada/PLY/STL importers are enabled; no Assimp exporter is compiled. The original OBJ loader remains the default OBJ path.

Assimp's bundled zlib and supporting contributions retain their upstream notices in `vendor/assimp/contrib`. The build copies Assimp, Dear ImGui, zlib and available contribution license files beside the executable under `licenses`. Preserve that directory when distributing the binary.

Lucide, ISC license with its retained MIT-derived Feather notice. Source: https://github.com/lucide-icons/lucide . The existing vendored SVG paths, source inventory and notice remain in `vendor/lucide`; `src/ui/icons.h` draws those outlines on the native UI. The release includes `licenses/Lucide.txt`.

MikkTSpace, by Morten S. Mikkelsen and contributors, upstream zlib-style source notice. Source: https://github.com/mmikk/MikkTSpace . Pinned commit `3e895b49d05ea07e4c2133156cfa94369e19e409`. Original `mikktspace.c` and `mikktspace.h` are vendored unmodified, with their notices. SHA-256 of the C source: `de87e74107df766ce68108801262bd8d53899414236b59810509a8fc2a51e288`. The build links a separate C library; the original Surface3D wrapper is `core/tangent.*`. `licenses/MikkTSpace.txt` preserves the upstream header and notice.
