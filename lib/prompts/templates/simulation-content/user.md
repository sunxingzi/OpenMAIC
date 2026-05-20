Create a simulation widget for: {{conceptName}}

## Concept Overview

{{conceptOverview}}

## Key Points

{{keyPoints}}

## Variables to Expose

{{variables}}

## Design Idea

{{designIdea}}

## Language

{{languageDirective}}

---

Generate a complete, interactive HTML simulation following the MANDATORY two-column + tabs layout pattern:

### Layout (MANDATORY)
1. **Hint banner** at top: colored background with 1-2 sentences explaining what to observe
2. **Tab navigation** (if concept has 2+ sub-experiments): tabs below the banner to switch views
3. **Two-column main area**:
   - **Left (~60%)**: Canvas/SVG visualization area with interactive graphics
   - **Right (~40%)**: Parameter control panel with labeled sliders, computed results box, and action buttons
4. **Responsive**: On mobile, stack vertically (viz on top, controls below)

### Structure
1. **Embedded JSON config** in `<script type="application/json" id="widget-config">`
2. **Styled sliders** with label on left, current value + unit on right (e.g. "F₁ 大小: 102 N")
3. **Computed results box**: distinct background, showing real-time calculated values (updated on every slider change)
4. **Canvas visualization** that fills the left column

### Real-Time Calculation Display (CRITICAL)
1. Every slider change MUST immediately recalculate and update the results box
2. Use the `input` event on sliders (not `change`) for instant feedback
3. Format: label in muted color, value in large bold monospace font with unit
4. Example results box content:
   ```
   计算结果：
   合力大小: 62.1 N
   方向: 95.8°
   ```

### Visual Design
1. Use CSS variables (--primary: #6366f1, etc.) for consistent theming
2. Modern styled range sliders with colored thumb and track
3. Clean border and shadow on the results box
4. Polished button styles (outline for reset, filled for primary action)

### Mobile Responsiveness (CRITICAL)
1. **Control panel MUST NOT overlap canvas on mobile**
2. Flex column layout on screens < 768px
3. Canvas container: `min-height: 300px` to ensure visibility
4. Touch-friendly controls (44px minimum touch targets)

### Button Logic (CRITICAL)
1. **Main button MUST handle all states correctly:**
   - "开始演示" → Starts simulation
   - "暂停演示" → Pauses running simulation
   - "重新开始" → Resets to initial state
2. **Reset function MUST reset ALL state variables** (position, velocity, time, etc.)
3. Use clear state tracking: `{ running: boolean, ended: boolean, paused: boolean }`

### Interactivity
1. Real-time updates when sliders change — no button press needed to see computed results
2. Canvas visualization updates as sliders move
3. Keyboard shortcuts (Space = toggle, R = reset)
4. postMessage listener for teacher actions (SET_WIDGET_STATE, HIGHLIGHT_ELEMENT, etc.)

### Animation
1. When "开始演示" is clicked, there MUST be obvious visual animation
2. Objects should visibly move, rotate, or change
3. Use `requestAnimationFrame` for smooth 60fps animation
