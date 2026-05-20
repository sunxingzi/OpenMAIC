# 3D Visualization Content Generator

Generate a self-contained HTML 3D visualization with embedded widget configuration using Three.js.

## Design Reference

Your 3D visualization should match the quality of professional physics education platforms:
- **Dark premium theme** with deep blue/black gradients
- **3D grid ground plane** for spatial reference
- **Right-side floating control panel** with glassmorphism backdrop
- **Physical principle explanation panel** in the bottom-right corner
- **Mini-map / top-down overview** in the upper-right corner
- **Smooth animations** with field lines, particle flows, vectors
- **Professional typography** with clear labels and values

## Output Structure

Your output must be a complete HTML document with:

1. **Standard HTML5 structure**
2. **Three.js loaded from CDN** (use unpkg or cdnjs)
3. **Embedded widget configuration** in a `<script type="application/json" id="widget-config">` tag
4. **3D scene with interactive controls** (OrbitControls, sliders, buttons, **ZOOM BUTTONS**)
5. **Mobile-responsive design**
6. **postMessage listener** for teacher actions (REQUIRED)

## ⚠️ CRITICAL REQUIREMENTS

### 1. SCENE LAYOUT — Professional Dark Theme

```
+--------------------------------------------------------------+
|  Title Banner (概念名称, 来源/知识点)                          |
|  ● 图例1   ● 图例2                                            |
+--------------------------------------------------------------+
|                                              ┌──────────┐    |
|                                              │ Mini-map  │    |
|                                              │ (Top View)│    |
|                                              └──────────┘    |
|                                                               |
|              3D Scene (Three.js Canvas)        ┌────────────┐ |
|              - Grid ground plane               │ 参数控制    │ |
|              - 3D models                       │ Toggle btn │ |
|              - Field lines / vectors           │ Slider     │ |
|              - Particle animations             │            │ |
|                                                └────────────┘ |
|                                                               |
|                                                ┌────────────┐ |
|              拖拽 3D 模型观察空间分布            │ 物理原理    │ |
|                                                │ 公式/说明   │ |
+--------------------------------------------------------------+
```

### 2. DARK THEME — Mandatory Style

```css
body {
  margin: 0;
  background: linear-gradient(135deg, #0c1220 0%, #0a0e1a 50%, #0d1117 100%);
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}
```

### 3. GRID GROUND PLANE — Required for spatial reference

```javascript
// Create a professional grid ground plane
const gridHelper = new THREE.GridHelper(40, 40, 0x1a3a4a, 0x0d2030);
gridHelper.position.y = -5;
scene.add(gridHelper);

// Optional: add a subtle transparent plane below the grid
const planeGeo = new THREE.PlaneGeometry(40, 40);
const planeMat = new THREE.MeshBasicMaterial({
  color: 0x0a1520,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -5.01;
scene.add(plane);
```

### 4. RIGHT-SIDE CONTROL PANEL — Glassmorphism style

```html
<div id="control-panel" style="
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 220px;
  background: rgba(15, 25, 40, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(100, 180, 255, 0.15);
  border-radius: 16px;
  padding: 20px;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
">
  <h4 style="color: #4ade80; font-size: 13px; margin: 0 0 12px; letter-spacing: 0.5px;">参数控制</h4>
  <!-- Controls go here -->
</div>
```

### 5. PHYSICAL PRINCIPLE PANEL — Bottom-right explanation

```html
<div id="principle-panel" style="
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 260px;
  background: rgba(15, 25, 40, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(100, 180, 255, 0.15);
  border-radius: 16px;
  padding: 16px;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
">
  <h4 style="color: #f97316; font-size: 13px; margin: 0 0 8px;">物理原理</h4>
  <p style="font-size: 12px; line-height: 1.6; color: #b0b8c8; margin: 0;">
    <!-- Principle description with highlighted keywords -->
    使用 <span style="color: #60a5fa;">关键概念</span> 进行标注
  </p>
</div>
```

### 6. MINI-MAP / TOP VIEW — Upper-right overview

```javascript
// Create a second camera for the mini-map (orthographic top-down view)
const miniMapSize = 160;
const miniMapCamera = new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 100);
miniMapCamera.position.set(0, 50, 0);
miniMapCamera.lookAt(0, 0, 0);

// Render mini-map in animation loop
function renderMiniMap() {
  const w = renderer.domElement.width;
  const h = renderer.domElement.height;
  const mapW = miniMapSize * window.devicePixelRatio;
  const mapH = miniMapSize * window.devicePixelRatio;
  const mapX = w - mapW - 20 * window.devicePixelRatio;
  const mapY = 20 * window.devicePixelRatio;

  renderer.setScissorTest(true);
  renderer.setViewport(mapX, h - mapY - mapH, mapW, mapH);
  renderer.setScissor(mapX, h - mapY - mapH, mapW, mapH);
  renderer.render(scene, miniMapCamera);
  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, w, h);
}
```

```html
<!-- Mini-map overlay border and label -->
<div id="minimap-frame" style="
  position: absolute;
  top: 60px;
  right: 20px;
  width: 160px;
  height: 160px;
  border: 1px solid rgba(100, 180, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
  z-index: 10;
  pointer-events: none;
">
  <div style="
    position: absolute;
    top: 4px;
    right: 8px;
    font-size: 10px;
    color: rgba(200, 220, 255, 0.6);
    letter-spacing: 0.5px;
  ">俯视图 (Top)</div>
</div>
```

### 7. TITLE BANNER — Top information bar

```html
<div id="title-bar" style="
  position: absolute;
  top: 0; left: 0; right: 0;
  background: rgba(10, 15, 25, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(100, 180, 255, 0.1);
  padding: 12px 20px;
  z-index: 10;
">
  <h2 style="color: #38bdf8; font-size: 18px; font-weight: 700; margin: 0 0 4px;">
    <!-- Title: e.g. 安培定则：环形电流磁场 -->
  </h2>
  <p style="color: #64748b; font-size: 12px; margin: 0;">
    <!-- Subtitle: e.g. 人教版高二物理·必修第三册 -->
  </p>
  <!-- Legend items -->
  <div style="margin-top: 8px; display: flex; gap: 16px;">
    <span style="font-size: 12px; color: #94a3b8;">
      <span style="display:inline-block; width:8px; height:8px; background:#3b82f6; border-radius:50%; margin-right:4px;"></span>
      图例项1
    </span>
    <span style="font-size: 12px; color: #94a3b8;">
      <span style="display:inline-block; width:8px; height:8px; background:#ef4444; border-radius:50%; margin-right:4px;"></span>
      图例项2
    </span>
  </div>
</div>
```

### 8. LIGHTING — Objects MUST be clearly visible

**ALWAYS ensure:**
- Background should NOT be pure black (use deep blue gradients)
- Ambient light intensity at least `0.4`
- Main objects MUST have dedicated lights
- Add hemisphere light for natural ambient fill

```javascript
// Professional lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x1a1a3a, 0.5);
scene.add(hemiLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
mainLight.position.set(10, 20, 10);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
fillLight.position.set(-10, 10, -10);
scene.add(fillLight);
```

### 9. ZOOM CONTROLS — REQUIRED for mobile users

Include zoom buttons in the control panel:

```javascript
document.getElementById('zoom-in-btn').addEventListener('click', () => {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  camera.position.addScaledVector(direction, 3);
});
document.getElementById('zoom-out-btn').addEventListener('click', () => {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  camera.position.addScaledVector(direction, -3);
});
```

### 10. FIELD LINES & VECTORS — For physics visualizations

When visualizing electromagnetic fields, forces, or flows, use curve-based field lines:

```javascript
// Create smooth 3D field lines using CatmullRomCurve3
function createFieldLine(points, color = 0xff4444, lineWidth = 2) {
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.03, 8, false);
  const tubeMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
  return new THREE.Mesh(tubeGeo, tubeMat);
}

// Create arrow indicators along field lines
function addArrowsToLine(curve, color, count = 5) {
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const arrowHelper = new THREE.ArrowHelper(tangent, pos, 0.5, color, 0.15, 0.08);
    scene.add(arrowHelper);
  }
}
```

### 11. TOGGLE BUTTON — For switching states

```html
<div style="display:flex; justify-content:center; margin-bottom:12px;">
  <button id="toggle-btn" style="
    width: 100%;
    padding: 10px 16px;
    border-radius: 24px;
    border: none;
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  ">切换状态：当前值</button>
</div>
```

### 12. SLIDER — Professional styled range input

```html
<div style="margin-bottom: 12px;">
  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
    <span style="font-size: 12px; color: #94a3b8;">参数名称</span>
    <span id="param-value" style="font-size: 13px; color: #60a5fa; font-weight: 600;">1.0x</span>
  </div>
  <input type="range" id="param-slider" min="0.1" max="5" step="0.1" value="1"
    style="width:100%; -webkit-appearance:none; height:6px; background:linear-gradient(90deg, #1e3a5f, #3b82f6); border-radius:3px; outline:none; cursor:pointer;">
</div>
```

```css
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  background: #4ade80;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.4);
}
```

### 13. BOTTOM-CENTER HINT

```html
<div style="
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: rgba(150, 170, 200, 0.5);
  letter-spacing: 1px;
  pointer-events: none;
  z-index: 5;
">拖拽 3D 模型观察空间分布</div>
```

### 14. VERSION TAG

```html
<div style="
  position: absolute;
  bottom: 8px;
  right: 20px;
  font-size: 10px;
  color: rgba(100, 120, 150, 0.4);
  z-index: 5;
">Interactive Physics Visualization v1.0</div>
```

## Widget Config Schema

```json
{
  "type": "visualization3d",
  "visualizationType": "physics",
  "description": "Interactive 3D physics visualization",
  "objects": [
    { "id": "coil", "type": "torus", "material": { "type": "phong", "color": "#3b82f6" } },
    { "id": "fieldLines", "type": "custom", "material": { "type": "basic", "color": "#ef4444" } }
  ],
  "interactions": [
    { "type": "orbit", "target": "camera" },
    { "type": "toggle", "param": "direction", "label": "切换方向" },
    { "type": "slider", "param": "intensity", "min": 0.1, "max": 5, "default": 1, "label": "强度" },
    { "type": "button", "action": "zoomIn", "label": "放大" },
    { "type": "button", "action": "zoomOut", "label": "缩小" }
  ],
  "presets": [
    { "name": "默认视角", "state": { "cameraPosition": [0, 5, 15] } }
  ]
}
```

## Complete HTML Template

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Visualization</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: linear-gradient(135deg, #0c1220 0%, #0a0e1a 50%, #0d1117 100%);
      color: #e0e0e0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    }
    #canvas-container { width: 100%; height: 100%; position: relative; }
    canvas { display: block; }

    /* Loading overlay */
    #loading {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, #0c1220, #0d1117);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 14px;
      z-index: 1000;
    }
    #loading .spinner {
      width: 36px; height: 36px;
      border: 3px solid rgba(59, 130, 246, 0.15);
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 12px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Glassmorphism panels */
    .glass-panel {
      background: rgba(15, 25, 40, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(100, 180, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    /* Title bar */
    #title-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      background: rgba(10, 15, 25, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(100, 180, 255, 0.08);
      padding: 12px 20px;
      z-index: 10;
    }
    #title-bar h2 { color: #38bdf8; font-size: 18px; font-weight: 700; margin: 0 0 2px; }
    #title-bar .subtitle { color: #475569; font-size: 12px; margin: 0 0 8px; }
    #title-bar .legend { display: flex; gap: 16px; flex-wrap: wrap; }
    #title-bar .legend-item { font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 4px; }
    #title-bar .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

    /* Control panel - right side */
    #control-panel {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 220px;
      z-index: 10;
      padding: 20px;
    }
    #control-panel h4 { color: #4ade80; font-size: 13px; margin: 0 0 14px; letter-spacing: 0.5px; font-weight: 600; }

    /* Toggle button */
    .toggle-btn {
      width: 100%;
      padding: 10px 16px;
      border-radius: 24px;
      border: none;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 12px rgba(59,130,246,0.3);
      margin-bottom: 16px;
    }
    .toggle-btn:hover { box-shadow: 0 6px 20px rgba(59,130,246,0.4); }
    .toggle-btn:active { transform: scale(0.97); }

    /* Slider styling */
    .slider-group { margin-bottom: 14px; }
    .slider-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .slider-label { font-size: 12px; color: #94a3b8; }
    .slider-value { font-size: 13px; color: #60a5fa; font-weight: 600; }
    input[type="range"] {
      width: 100%;
      -webkit-appearance: none;
      height: 6px;
      background: linear-gradient(90deg, #1e3a5f, #3b82f6);
      border-radius: 3px;
      outline: none;
      cursor: pointer;
    }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px; height: 16px;
      background: #4ade80;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 8px rgba(74,222,128,0.4);
    }
    input[type="range"]::-moz-range-thumb {
      width: 16px; height: 16px;
      background: #4ade80;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }

    /* Principle panel */
    #principle-panel {
      position: absolute;
      bottom: 60px;
      right: 20px;
      width: 260px;
      z-index: 10;
      padding: 16px;
    }
    #principle-panel h4 { color: #f97316; font-size: 13px; margin: 0 0 8px; font-weight: 600; }
    #principle-panel p { font-size: 12px; line-height: 1.7; color: #8895a8; margin: 0; }
    #principle-panel .keyword { color: #60a5fa; font-weight: 500; }
    #principle-panel .keyword-red { color: #f87171; font-weight: 500; }

    /* Mini-map */
    #minimap-frame {
      position: absolute;
      top: 80px;
      right: 20px;
      width: 140px;
      height: 140px;
      border: 1px solid rgba(100, 180, 255, 0.2);
      border-radius: 12px;
      overflow: hidden;
      z-index: 10;
      pointer-events: none;
    }
    #minimap-label {
      position: absolute;
      top: 4px; right: 8px;
      font-size: 10px;
      color: rgba(200, 220, 255, 0.5);
      letter-spacing: 0.5px;
    }

    /* Bottom hint */
    #bottom-hint {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: rgba(150, 170, 200, 0.4);
      letter-spacing: 1px;
      pointer-events: none;
      z-index: 5;
    }

    /* Zoom controls in control panel */
    .zoom-btns { display: flex; gap: 8px; margin-top: 12px; }
    .zoom-btns button {
      flex: 1;
      padding: 8px;
      border: 1px solid rgba(100, 180, 255, 0.2);
      border-radius: 10px;
      background: rgba(30, 50, 80, 0.5);
      color: #94a3b8;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 44px;
      min-height: 44px;
    }
    .zoom-btns button:hover { background: rgba(59, 130, 246, 0.3); color: #e0e0e0; }
    .zoom-btns button:active { transform: scale(0.95); }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      #control-panel { width: 180px; right: 10px; padding: 14px; }
      #principle-panel { width: 200px; right: 10px; padding: 12px; }
      #minimap-frame { width: 100px; height: 100px; right: 10px; }
    }
  </style>
</head>
<body>
  <!-- Loading overlay -->
  <div id="loading">
    <div style="text-align:center;">
      <div class="spinner"></div>
      加载 3D 场景中...
    </div>
  </div>

  <div id="canvas-container"></div>

  <!-- Title bar with concept info and legend -->
  <div id="title-bar">
    <h2>场景标题</h2>
    <p class="subtitle">知识来源</p>
    <div class="legend">
      <span class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span> 图例1</span>
      <span class="legend-item"><span class="legend-dot" style="background:#ef4444;"></span> 图例2</span>
    </div>
  </div>

  <!-- Mini-map frame -->
  <div id="minimap-frame">
    <div id="minimap-label">俯视图 (Top)</div>
  </div>

  <!-- Right-side control panel -->
  <div id="control-panel" class="glass-panel">
    <h4>参数控制</h4>
    <button class="toggle-btn" id="toggle-btn">切换方向：正向</button>
    <div class="slider-group">
      <div class="slider-header">
        <span class="slider-label">强度</span>
        <span class="slider-value" id="intensity-value">1.0x</span>
      </div>
      <input type="range" id="intensity-slider" min="0.1" max="5" step="0.1" value="1">
    </div>
    <div class="zoom-btns">
      <button id="zoom-in-btn" title="放大">+</button>
      <button id="zoom-out-btn" title="缩小">−</button>
    </div>
  </div>

  <!-- Physical principle panel -->
  <div id="principle-panel" class="glass-panel">
    <h4>物理原理</h4>
    <p>
      物理原理描述，使用<span class="keyword">关键概念</span>和<span class="keyword-red">重要术语</span>进行标注。
    </p>
  </div>

  <!-- Bottom hint -->
  <div id="bottom-hint">拖拽 3D 模型观察空间分布</div>

  <!-- Version -->
  <div style="position:absolute; bottom:4px; right:20px; font-size:10px; color:rgba(100,120,150,0.3); z-index:5;">
    Interactive Physics Visualization v1.0
  </div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>

  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    function checkWebGL() {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
      } catch(e) { return false; }
    }

    async function initScene() {
      try {
        if (!checkWebGL()) throw new Error('WebGL not supported');

        const container = document.getElementById('canvas-container');
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        if (width === 0 || height === 0) throw new Error('Container has zero dimensions');

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0c1220);
        scene.fog = new THREE.FogExp2(0x0c1220, 0.015);

        // Camera
        const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 500);
        camera.position.set(8, 6, 12);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = 3;
        controls.maxDistance = 50;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x1a1a3a, 0.5);
        scene.add(hemiLight);
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        scene.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
        fillLight.position.set(-10, 10, -10);
        scene.add(fillLight);

        // Grid ground plane
        const gridHelper = new THREE.GridHelper(40, 40, 0x1a3a4a, 0x0d2030);
        gridHelper.position.y = -5;
        scene.add(gridHelper);

        // Objects storage
        const objects = {};

        // Mini-map camera (orthographic top-down)
        const miniMapCamera = new THREE.OrthographicCamera(-15, 15, 15, -15, 0.1, 100);
        miniMapCamera.position.set(0, 40, 0);
        miniMapCamera.lookAt(0, 0, 0);

        // Animation state
        let animationSpeed = 1;

        // Animation loop
        function animate() {
          requestAnimationFrame(animate);
          controls.update();

          // Main render
          renderer.setScissorTest(false);
          renderer.setViewport(0, 0, renderer.domElement.width, renderer.domElement.height);
          renderer.render(scene, camera);

          // Mini-map render
          const w = renderer.domElement.width;
          const h = renderer.domElement.height;
          const dpr = renderer.getPixelRatio();
          const mapW = 140 * dpr;
          const mapH = 140 * dpr;
          const mapX = w - mapW - 20 * dpr;
          const mapY = h - 80 * dpr - mapH;

          renderer.setScissorTest(true);
          renderer.setViewport(mapX, mapY, mapW, mapH);
          renderer.setScissor(mapX, mapY, mapW, mapH);
          renderer.render(scene, miniMapCamera);
          renderer.setScissorTest(false);
        }
        animate();

        // Zoom controls
        document.getElementById('zoom-in-btn').addEventListener('click', () => {
          const dir = new THREE.Vector3();
          camera.getWorldDirection(dir);
          camera.position.addScaledVector(dir, 3);
        });
        document.getElementById('zoom-out-btn').addEventListener('click', () => {
          const dir = new THREE.Vector3();
          camera.getWorldDirection(dir);
          camera.position.addScaledVector(dir, -3);
        });

        // Handle resize
        window.addEventListener('resize', () => {
          const nw = container.clientWidth || window.innerWidth;
          const nh = container.clientHeight || window.innerHeight;
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        });

        // PostMessage handler for teacher actions
        window.addEventListener('message', (event) => {
          const { type, target, state, content } = event.data || {};
          switch (type) {
            case 'SET_WIDGET_STATE': {
              if (state) {
                if (state.cameraPosition) camera.position.set(...state.cameraPosition);
                if (state.cameraTarget) controls.target.set(...state.cameraTarget);
                if (state.animationSpeed !== undefined) animationSpeed = state.animationSpeed;
              }
              break;
            }
            case 'HIGHLIGHT_ELEMENT': {
              if (target && objects[target]) {
                const obj = objects[target];
                if (obj.material) {
                  const origEmissive = obj.material.emissive ? obj.material.emissive.getHex() : 0;
                  obj.material.emissive = new THREE.Color(0xffff00);
                  setTimeout(() => { obj.material.emissive = new THREE.Color(origEmissive); }, 3000);
                }
              }
              break;
            }
            case 'ANNOTATE_ELEMENT': {
              break;
            }
            case 'REVEAL_ELEMENT': {
              if (target && objects[target]) {
                objects[target].visible = true;
              }
              break;
            }
          }
        });

        // Hide loading
        document.getElementById('loading').style.display = 'none';

      } catch (error) {
        console.error('Scene initialization failed:', error);
        document.getElementById('loading').innerHTML =
          '<div style="text-align:center;color:#f87171;">' +
          '<div style="font-size:24px;margin-bottom:16px;">⚠️</div>' +
          '加载 3D 场景失败<br>' +
          '<small style="color:#64748b;">' + error.message + '</small><br>' +
          '<button onclick="location.reload()" style="margin-top:16px;padding:8px 20px;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;">重试</button>' +
          '</div>';
      }
    }

    initScene();
  </script>

  <script type="application/json" id="widget-config">
  {
    "type": "visualization3d",
    "visualizationType": "custom",
    "description": "3D visualization",
    "objects": [],
    "interactions": []
  }
  </script>
</body>
</html>
```

## Visualization Types & Guidelines

### 1. Physics (`physics`) — PRIMARY USE CASE
- **Electromagnetic fields**: Coils/solenoids with field lines (TubeGeometry + CatmullRomCurve3)
- **Force vectors**: ArrowHelper with color-coded directions
- **Current flow**: Animated arrow markers along wire paths
- **Grid floor** for spatial context
- **Field line density** proportional to field strength
- **Toggle for direction** (clockwise/counter-clockwise)
- **Slider for intensity** affecting field line density/strength

### 2. Solar System (`solar`)
- Sun with emissive glow (point light at center)
- Planets with **procedural textures** via Canvas API
- Orbital paths as semi-transparent torus rings
- Speed slider and planet selection

### 3. Molecular (`molecular`)
- Atoms as colored spheres (CPK color convention)
- Bonds as cylinders connecting atoms
- Ball-and-stick or space-filling toggle
- Rotation animation

### 4. Anatomy (`anatomy`)
- Organs with distinct colors and transparency layers
- Click-to-isolate individual parts
- Labels floating near each component

### 5. Geometry (`geometry`)
- 3D shapes with wireframe toggle
- Edge highlighting and measurement annotations
- Cross-section slicing plane

### 6. Custom (`custom`)
- Follow the same dark theme, grid, and panel requirements

## Creating Field Lines (Physics)

For electromagnetic field visualizations, compute field line paths mathematically:

```javascript
function computeFieldLinePoints(startPoint, direction, steps = 100, stepSize = 0.2) {
  const points = [startPoint.clone()];
  const current = startPoint.clone();

  for (let i = 0; i < steps; i++) {
    const field = computeFieldAt(current);
    if (field.length() < 0.001) break;
    field.normalize().multiplyScalar(stepSize * direction);
    current.add(field);
    points.push(current.clone());
  }
  return points;
}

function createFieldLineFromPoints(points, color) {
  if (points.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, Math.min(points.length * 2, 128), 0.025, 8, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.7
  });
  return new THREE.Mesh(tubeGeo, tubeMat);
}
```

## Creating Current Flow Arrows

```javascript
function createCurrentArrows(path, color = 0x3b82f6, count = 8) {
  const curve = new THREE.CatmullRomCurve3(path);
  const group = new THREE.Group();

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.08, 0.2, 6),
      new THREE.MeshBasicMaterial({ color })
    );
    cone.position.copy(pos);
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    group.add(cone);
  }
  return group;
}
```

## JavaScript Coding Rules

### 1. Switch Statement Scope (CRITICAL)

**CORRECT — Wrap each case in braces:**
```javascript
switch (action) {
  case 'HIGHLIGHT_ELEMENT': {
    const { elementId, highlight } = payload;
    break;
  }
  case 'ANNOTATE_ELEMENT': {
    const { elementId, text } = payload;
    break;
  }
}
```

### 2. No External Dependencies
- All textures must be procedural (Canvas API)
- Only Three.js from CDN
- No external image/font URLs

### 3. Performance
- Use `requestAnimationFrame`
- Limit geometry: 32-64 segments for spheres/tubes
- Use `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`

## Output Format

Return ONLY the HTML document, no markdown fences or explanations.

**CRITICAL: Output EXACTLY ONE HTML document.**
- Do NOT duplicate content
- Do NOT include multiple `<!DOCTYPE html>` tags
- The output must end with exactly one `</html>` tag
