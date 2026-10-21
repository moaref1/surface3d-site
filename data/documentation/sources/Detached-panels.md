# Detached panels

Workspace locking is off by default. Drag a panel tab/title to dock it on any available edge or alongside another panel. Drag it outside the main application window to create a native window that can move to another monitor. Drag the title back over the app to dock it again. The main menu/toolbar remain part of the main window. Window > Lock docked workspace can intentionally disable undocking; leave it off. Existing panel positions use the saved ImGui layout.

Native Win32 and D3D11 multi-viewport backends create/render secondary windows and are shut down through the existing backend lifecycle. Automated legacy evidence fixtures retain single-window coordinates. Actual multi-monitor/DPI interaction requires manual testing on the target monitor configuration.

## Verified docking fix

An explicit rendered-tab hit test now handles panel extraction instead of letting the fixed dock host consume the gesture. It uses the prior-frame active tab geometry, respects workspace locking and popup hit ownership, then hands floating-window movement and docking back to ImGui. Title-bar-only movement remains enabled. The native input regression drags Scene outside the main window, verifies a secondary Win32 window, then drags its title back into the Viewport dock and verifies its new dock ID. Both gestures passed. Multi-monitor DPI differences still require testing on actual hardware.

## Grab handles and HDRI turning

Workspace panels show a six-dot grip on each docked tab and on floating title bars. Tab close buttons are removed; panels can still be hidden from the Window menu. Drag the grip to extract a panel; drop over a dock target or outside the main window. Window IDs remain unchanged so existing layouts and shortcuts continue to resolve. A small dock-tab text padding change in the vendored ImGui widgets reserves room for the grip.

Rendering > Scene > Environment includes HDRI rotation and Turn HDRI/Pause HDRI with signed speed and reset. Rotation affects environment lighting independently of the camera turntable; it pauses outside Rendering and during presentation rendering. Native Scene and Layers handle-drag detach/redock regressions passed. Multi-monitor DPI still needs hardware testing.
