# Simulation Widget Content Generator

Generate a self-contained HTML simulation with embedded widget configuration.

## Output Structure

Your output must be a complete HTML document with:

1. **Standard HTML5 structure**
2. **Embedded widget configuration** in a `<script type="application/json" id="widget-config">` tag
3. **Interactive controls** for variables
4. **Canvas or SVG visualization**
5. **Mobile-responsive design**
6. **postMessage listener** for teacher actions (REQUIRED)

## Widget Config Schema

```json
{
  "type": "simulation",
  "concept": "projectile_motion",
  "description": "...",
  "variables": [
    { "name": "angle", "label": "Launch Angle", "min": 0, "max": 90, "default": 45, "unit": "°" }
  ],
  "presets": [
    { "name": "Hit the target", "variables": { "angle": 30, "velocity": 25 } }
  ]
}
```

## CRITICAL: postMessage Listener for Teacher Actions

Your HTML MUST include this message listener to respond to teacher actions:

```javascript
window.addEventListener('message', function(event) {
  const { type, target, state, content } = event.data;

  switch (type) {
    case 'SET_WIDGET_STATE':
      if (state) {
        Object.entries(state).forEach(([key, value]) => {
          const slider = document.getElementById(key + '-slider') || document.querySelector('[data-var="' + key + '"]');
          if (slider) {
            slider.value = value;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
          }
        });
      }
      break;

    case 'HIGHLIGHT_ELEMENT':
      const highlightEl = document.querySelector(target);
      if (highlightEl) {
        highlightEl.style.outline = '3px solid rgba(139, 92, 246, 0.8)';
        highlightEl.style.outlineOffset = '4px';
        highlightEl.style.animation = 'pulse-highlight 2s infinite';
        setTimeout(() => {
          highlightEl.style.outline = '';
          highlightEl.style.animation = '';
        }, 3000);
      }
      break;

    case 'ANNOTATE_ELEMENT':
      const annotateEl = document.querySelector(target);
      if (annotateEl && content) {
        const rect = annotateEl.getBoundingClientRect();
        const tooltip = document.createElement('div');
        tooltip.className = 'teacher-annotation';
        tooltip.style.cssText = 'position:fixed; top:' + (rect.top - 40) + 'px; left:' + rect.left + 'px; background:rgba(139,92,246,0.95); color:white; padding:8px 12px; border-radius:8px; font-size:14px; z-index:1000; animation:fadeIn 0.3s;';
        tooltip.textContent = content;
        document.body.appendChild(tooltip);
        setTimeout(() => tooltip.remove(), 4000);
      }
      break;

    case 'REVEAL_ELEMENT':
      const revealEl = document.querySelector(target);
      if (revealEl) {
        revealEl.style.display = '';
        revealEl.style.opacity = '1';
      }
      break;
  }
});

const style = document.createElement('style');
style.textContent = '@keyframes pulse-highlight { 0%, 100% { outline-color: rgba(139, 92, 246, 0.8); } 50% { outline-color: rgba(139, 92, 246, 0.4); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(style);
```

## Element Naming Convention

To make highlight/annotation work, use consistent IDs for controls:
- Sliders: `id="{variable_name}-slider"` (e.g., `id="angle-slider"`, `id="velocity-slider"`)
- Buttons: `id="{action}-btn"` (e.g., `id="start-btn"`, `id="reset-btn"`)
- Displays: `id="{variable_name}-display"` (e.g., `id="acceleration-display"`)

## TARGET LAYOUT: Two-Column + Tabs (MANDATORY)

You MUST use the following premium layout pattern. This produces polished, professional results.

### Layout Structure

```
+-------------------------------------------------------------------+
|  [Hint Banner: colored background, explains the experiment goal]  |
+-------------------------------------------------------------------+
|  [Tab 1: Experiment A]  [Tab 2: Experiment B]  ...                |
+-------------------------------------------------------------------+
|                          |                                        |
|   Canvas / SVG           |   Parameter Control Panel              |
|   Visualization          |                                        |
|   (interactive area)     |   Slider Label         Value + Unit    |
|                          |   ──────────●──────── [102 N]          |
|                          |                                        |
|                          |   Slider Label         Value + Unit    |
|                          |   ────●──────────── [140°]             |
|                          |                                        |
|                          |   ┌─────────────────────────────┐      |
|                          |   │ Computed Result:             │      |
|                          |   │ 合力大小: 62.1 N             │      |
|                          |   │ 方向: 95.8°                  │      |
|                          |   └─────────────────────────────┘      |
|                          |                                        |
|                          |   [ 重置 ]        [ 暂停演示 ]         |
+-------------------------------------------------------------------+
```

### Key Layout Requirements

1. **Hint Banner** (top, full width): A colored banner (e.g. soft blue/purple background) with 1-2 sentences explaining the experiment goal and what to observe.

2. **Tab Navigation** (below banner): When the concept has multiple sub-experiments or aspects, provide tabs to switch between them. Each tab resets the visualization for that sub-experiment.

3. **Left: Visualization Area** (~60% width): Canvas or SVG rendering of the simulation. Objects, vectors, forces, etc. rendered here. Must be responsive and fill available space.

4. **Right: Parameter Control Panel** (~40% width): 
   - Each slider has a clear label on the left and current value + unit on the right
   - Sliders use styled range inputs with visible thumb and track
   - Below sliders: a **Computed Results** box with a distinct background showing calculated values in real-time
   - At the bottom: action buttons (Reset, Start/Pause)

5. **Responsive**: On mobile (<768px), stack vertically: visualization on top, controls below.

### CSS Design Tokens

Use these consistent styling values:

```css
:root {
  --primary: #6366f1;
  --primary-light: #818cf8;
  --primary-bg: #eef2ff;
  --surface: #ffffff;
  --surface-alt: #f8fafc;
  --border: #e2e8f0;
  --text: #1e293b;
  --text-muted: #64748b;
  --accent: #f59e0b;
  --success: #10b981;
  --danger: #ef4444;
  --radius: 12px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

### Slider Styling (MANDATORY)

Style range inputs for a polished, modern look:

```css
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--border);
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(99,102,241,0.3);
}
input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: none;
}
```

### Computed Results Box

Display calculated values in a visually distinct box:

```css
.results-box {
  background: var(--primary-bg);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: var(--radius);
  padding: 16px;
  margin-top: 16px;
}
.results-box .result-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.results-box .result-value {
  font-size: 18px;
  font-weight: 700;
  font-family: 'SF Mono', 'Cascadia Code', monospace;
  color: var(--primary);
}
```

## Reference HTML Template

Follow this structure closely. Adapt the content to the specific concept:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Simulation</title>
  <style>
    /* CSS variables, base styles, layout, slider styles, results box styles */
    /* ... (use the design tokens above) ... */
    
    body { margin:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--surface-alt); color: var(--text); }
    
    .hint-banner { background: var(--primary-bg); border-bottom: 1px solid rgba(99,102,241,0.15); padding: 12px 20px; font-size: 14px; color: var(--primary); }
    
    .tabs { display:flex; gap:0; border-bottom: 2px solid var(--border); padding: 0 20px; background: var(--surface); }
    .tab { padding: 10px 20px; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-muted); border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; }
    .tab.active { color: var(--primary); border-bottom-color: var(--primary); }
    .tab:hover:not(.active) { color: var(--text); }
    
    .main-layout { display: flex; height: calc(100vh - 90px); }
    .viz-area { flex: 3; position: relative; background: var(--surface); border-right: 1px solid var(--border); }
    .viz-area canvas, .viz-area svg { width:100%; height:100%; display:block; }
    
    .control-panel { flex: 2; padding: 20px; overflow-y: auto; background: var(--surface); }
    .control-panel h3 { font-size: 15px; font-weight: 600; margin: 0 0 16px; color: var(--text); }
    
    .slider-group { margin-bottom: 16px; }
    .slider-header { display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px; }
    .slider-label { font-size: 13px; color: var(--text-muted); }
    .slider-value { font-size: 14px; font-weight: 600; font-family: monospace; color: var(--primary); min-width: 60px; text-align: right; }
    
    .btn-group { display:flex; gap:8px; margin-top: 20px; }
    .btn { flex:1; padding: 10px 16px; border-radius: 8px; border: none; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .btn-outline { background: var(--surface); border: 1px solid var(--border); color: var(--text); }
    .btn-outline:hover { background: var(--surface-alt); }
    .btn-primary { background: var(--primary); color: white; }
    .btn-primary:hover { background: var(--primary-light); }
    .btn-danger { background: var(--danger); color: white; }
    .btn-danger:hover { opacity: 0.9; }
    
    @media (max-width: 768px) {
      .main-layout { flex-direction: column; height: auto; }
      .viz-area { min-height: 300px; border-right: none; border-bottom: 1px solid var(--border); }
      .control-panel { max-height: 50vh; }
    }
  </style>
</head>
<body>
  <div class="hint-banner">
    <strong>原理提示：</strong> 改变参数观察变化规律...
  </div>
  
  <div class="tabs">
    <div class="tab active" onclick="switchTab(0)">实验一</div>
    <div class="tab" onclick="switchTab(1)">实验二</div>
  </div>
  
  <div class="main-layout">
    <div class="viz-area">
      <canvas id="canvas"></canvas>
    </div>
    <div class="control-panel">
      <h3>参数调节</h3>
      <div class="slider-group">
        <div class="slider-header">
          <span class="slider-label">参数名称</span>
          <span class="slider-value" id="param1-display">50</span>
        </div>
        <input type="range" id="param1-slider" min="0" max="100" value="50">
      </div>
      <!-- More sliders ... -->
      
      <div class="results-box">
        <div class="result-label">计算结果：</div>
        <div class="result-value" id="result-display">—</div>
      </div>
      
      <div class="btn-group">
        <button class="btn btn-outline" id="reset-btn" onclick="resetSimulation()">重置</button>
        <button class="btn btn-primary" id="start-btn" onclick="toggleSimulation()">开始演示</button>
      </div>
    </div>
  </div>

  <script type="application/json" id="widget-config">
    { "type": "simulation", "concept": "...", "description": "...", "variables": [...] }
  </script>
  
  <script>
    // Simulation logic, drawing, event listeners, postMessage handler...
  </script>
</body>
</html>
```

## CRITICAL Design Requirements

### 1. Mobile Layout - NO OVERLAP
- **Control panel MUST NOT overlap with canvas on mobile**
- Use the flex column layout on mobile (< 768px): visualization on top, controls below
- Use `min-height` for canvas to ensure it's visible on mobile
- Control panel should be scrollable on mobile

### 2. Reset Button - MUST WORK CORRECTLY
- **Reset button MUST return simulation to initial state**
- Common bug: Button changes text to "重新开始" but clicking it doesn't reset

Correct implementation:
```javascript
let state = { running: false, ended: false, posX: 50, velocity: 0 };

function handleMainButton() {
  if (state.ended) {
    resetSimulation();
  } else if (state.running) {
    pauseSimulation();
  } else {
    startSimulation();
  }
}

function resetSimulation() {
  state.running = false;
  state.ended = false;
  state.posX = 50;
  state.velocity = 0;
  updateButton('启动');
  draw();
}

function onSimulationEnd() {
  state.running = false;
  state.ended = true;
  updateButton('重新开始');
}

function updateButton(text) {
  document.getElementById('mainBtn').innerText = text;
}
```

### 3. Button State Management
- Use clear state variables: `running`, `paused`, `ended`
- Button text should reflect what will happen when clicked:
  - "启动" / "开始" → Start simulation
  - "暂停" → Pause running simulation
  - "继续" → Resume paused simulation
  - "重新开始" / "重试" → Reset and start fresh (when ended)

### 4. Touch-Friendly Controls
- Minimum touch target: 44x44px for buttons
- Sliders: Increase thumb size for mobile (min 24px)
- Add `touch-action: manipulation` to prevent double-tap zoom

### 5. Canvas Sizing
- Use `ResizeObserver` or window resize event
- Canvas should fill available space
- Don't use fixed pixel dimensions

### 6. Visible Animation (CRITICAL)

**When the user clicks "启动", there MUST be OBVIOUS visual animation.**

- **Moving objects**: Objects should visibly move, rotate, or change
- **Clear motion**: Animation should be immediately noticeable
- **Multiple visual cues**: Combine motion with data updates, color changes, particle effects
- Use `requestAnimationFrame` for smooth animation

### 7. Real-Time Computed Results (CRITICAL)

- Whenever a slider changes, immediately recalculate and display results in the results box
- Use `input` event (not `change`) on sliders for real-time feedback
- Format numbers with appropriate precision (e.g. `toFixed(1)`)
- Always show units next to values
- Use monospace font for numbers

### 8. Tab System (when applicable)

- Only include tabs if the concept naturally splits into 2-3 sub-experiments
- Switching tabs should reset the visualization and update controls
- Active tab should be visually distinct (colored bottom border)
- Each tab's state is independent

### 9. Performance
- Use `requestAnimationFrame` for animations
- Clear canvas each frame
- Don't create objects in render loop
- Throttle slider input events if needed

## Common Bugs to Avoid

| Bug | Cause | Solution |
|-----|-------|----------|
| Reset doesn't work | Button calls wrong function | Ensure reset function resets ALL state variables |
| Canvas overlap on mobile | Fixed positioning | Use flex/grid with proper responsive classes |
| Simulation stuck | Missing `ended` state | Track `ended` separately from `running` |
| Button does nothing | State logic error | Clear state machine with defined transitions |
| Sliders don't update viz | Using `change` event | Use `input` event for real-time updates |
| Results not updating | Missing recalculate call | Call compute function in every slider's `input` handler |

## Output Format

Return ONLY the HTML document, no markdown fences or explanations.

**CRITICAL: Output EXACTLY ONE HTML document.**
- Do NOT duplicate content
- Do NOT include multiple `<!DOCTYPE html>` tags
- The output must end with exactly one `</html>` tag

## Quality Checklist (verify before output)

- [ ] Uses two-column layout: visualization left, controls right
- [ ] Has hint banner at top explaining the experiment
- [ ] Sliders show current value + unit inline
- [ ] Computed results displayed in a distinct results box
- [ ] Real-time updates on slider change (no button press needed to see results)
- [ ] Tabs present if concept has multiple sub-experiments
- [ ] Control panel does NOT overlap canvas on mobile
- [ ] Reset button returns simulation to EXACT initial state
- [ ] Touch targets are at least 44px
- [ ] Canvas resizes properly on window resize
- [ ] **NO DUPLICATED HTML** - exactly ONE `<!DOCTYPE html>` tag
- [ ] **Visible animation when running - user can clearly tell it's active**
- [ ] Modern, polished visual design using the design tokens above
