# Node graphs

Every layer can be opened as a node graph. Stay in layers while you paint, and open the graph when you want procedural control. The result always flows back into your layer.

## Open a graph

- Select a **Procedural fill** layer and click **Open in Graph**, or open the **Graph** workspace.
- The graph sits under the viewport, with **Node Properties** inside the graph window.

## Read a node

- The **header colour** shows the node's family, so you can find similar nodes at a glance.
- **Inputs** are on the left, **outputs** on the right.
- The **socket colour** shows the kind of data:

| Socket | Carries |
|---|---|
| Yellow | Color |
| Grey | Value (a single number per pixel, like a mask) |
| Blue | Vector (directions, coordinates) |
| Purple | Normal |
| Green | Integer |
| Pink | Boolean |
| Orange | Path (splines) |

## Build a graph

1. Hover the graph and press **Shift+A** to search and add a node. Type a few letters of its name.
2. Drag from an output socket to an input socket to connect them. Wires run left to right.
3. Select a node to edit its settings in **Node Properties**, or drag the sliders on the node itself.
4. Press **Space** on a node to preview its result.

Many settings can become inputs: connect a value to a slider and it follows that value per pixel.

## Keys in the graph

| Key | Action |
|---|---|
| **Shift+A** | Add a node |
| Middle-drag | Pan |
| **Ctrl** + right-drag | Cut wires |
| **Ctrl+D** | Duplicate |
| **Delete** | Remove |
| **F2** | Rename |
| **Space** | Preview |
| **F** | Frame the graph |
| **Ctrl+J** / **Alt+J** | Put the selection in a frame / remove the frame |
| **Ctrl+H** | Hide or show unused inputs |

## Keep big graphs tidy

- **Frames** group nodes with a title, colour and comment. Right-click a frame's title to edit it.
- **Portals**: right-click a reroute dot and choose **Make portal** to jump a wire across the graph without a long line.
- **Functions**: turn selected nodes into a reusable function with its own inputs, outputs and sliders. Open it to edit the shared definition.

## Find the right node

The [node reference](docs.html?node=grunge-noise) lists every node with what it does, its inputs, outputs and settings. Open the **Nodes** tab above the search box.
