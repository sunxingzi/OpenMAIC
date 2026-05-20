Create a professional 3D visualization widget for: {{title}}

## Visualization Type

{{visualizationType}}

## Description

{{description}}

## Key Points

{{keyPoints}}

## Objects to Visualize

{{objects}}

## Interactions

{{interactions}}

## Language

{{languageDirective}}

---

Generate a complete, professional-grade 3D visualization using Three.js. Follow the reference layout from the system prompt EXACTLY.

### MANDATORY Layout Elements (ALL required)

1. **Dark theme background** — `linear-gradient(135deg, #0c1220, #0a0e1a, #0d1117)`
2. **Title bar** (top) — concept name, knowledge source, color-coded legend icons
3. **3D Canvas** (center) — Three.js scene with OrbitControls filling entire viewport
4. **Grid ground plane** — GridHelper for spatial reference, positioned below main objects
5. **Mini-map** (upper-right, 140×140px) — orthographic top-down view of the scene
6. **Control panel** (right-side, glassmorphism) — toggle buttons, sliders with live values
7. **Principle panel** (bottom-right, glassmorphism) — physical principle explanation with highlighted keywords
8. **Bottom-center hint** — "拖拽 3D 模型观察空间分布"
9. **Version tag** — bottom-right corner, very small

### Scene Construction

1. **Three.js from CDN** using importmap for ES modules (three@0.160.0)
2. **Proper lighting**: ambient (0.4) + hemisphere + directional (main + fill)
3. **OrbitControls** with damping, min/max distance
4. **Fog** for depth: `FogExp2(0x0c1220, 0.015)`
5. **Shadows** enabled for realism
6. All objects stored in an `objects` dictionary for teacher actions

### 3D Model Requirements

For the objects described above:
1. Use appropriate Three.js geometries (SphereGeometry, TorusGeometry, CylinderGeometry, TubeGeometry, etc.)
2. For field lines / curves: use `CatmullRomCurve3` → `TubeGeometry` with semi-transparent materials
3. For current/flow arrows: cone meshes aligned to path tangents
4. For force vectors: `ArrowHelper` with color-coded directions
5. Use bright, distinct colors on the dark background
6. Apply `MeshPhongMaterial` or `MeshStandardMaterial` for lit objects
7. Use `MeshBasicMaterial` with transparency for field lines and guides

### Interaction Requirements

1. **Toggle button** — round-cornered, gradient blue, for switching direction/mode
2. **Sliders** — styled range inputs with green thumb, blue track, live value display
3. **Zoom buttons** — +/− buttons in control panel, 44px touch targets
4. **OrbitControls** for camera rotation/pan (works with touch)
5. Real-time updates when sliders change

### Animation

1. Use `requestAnimationFrame` for smooth 60fps
2. Support `animationSpeed` variable controlled by slider
3. Animate field lines, particle flows, rotations as appropriate
4. Keep performance in mind: 32-64 segments for geometries

### Mini-map

1. Orthographic camera looking straight down
2. Rendered in upper-right corner using viewport/scissor
3. Shows top-down view of all objects and field lines
4. Frame border with "俯视图 (Top)" label

### Teacher Actions Support (postMessage)

1. `SET_WIDGET_STATE` — camera position, animation speed, object visibility
2. `HIGHLIGHT_ELEMENT` — emissive glow on 3D objects (3s duration)
3. `ANNOTATE_ELEMENT` — floating labels near objects
4. `REVEAL_ELEMENT` — show hidden objects

### Widget Config

Embed a complete JSON config in the HTML:
```json
{
  "type": "visualization3d",
  "visualizationType": "{{visualizationType}}",
  "description": "...",
  "objects": [...],
  "interactions": [...],
  "presets": [...]
}
```

### Quality Checklist

- [ ] Dark theme with deep blue gradient background
- [ ] Title bar with concept name and color-coded legend
- [ ] Grid ground plane for spatial reference
- [ ] Mini-map showing top-down orthographic view
- [ ] Right-side glassmorphism control panel with toggle + slider
- [ ] Bottom-right principle explanation panel with highlighted keywords
- [ ] Bottom-center drag hint text
- [ ] Objects clearly visible with proper lighting
- [ ] Field lines / vectors rendered as tubes/arrows (if physics)
- [ ] Smooth animations
- [ ] Touch-friendly controls (44px min targets)
- [ ] Responsive (smaller panels on mobile)
- [ ] postMessage listener for teacher actions
- [ ] **NO DUPLICATED HTML** — exactly ONE `<!DOCTYPE html>`

Return ONLY the HTML document.
