# gamepad-display

Framework-agnostic gamepad visualization component. Display real-time gamepad input with an SVG-based controller diagram.

## Installation

```bash
npm install gamepad-display
```

## Usage

### Vanilla JavaScript

```javascript
import { GamepadDisplay } from 'gamepad-display';

const container = document.getElementById('gamepad-container');
const display = new GamepadDisplay(container);

function updateGamepad() {
  const gamepads = navigator.getGamepads();
  const gamepad = gamepads[0];

  if (gamepad) {
    const axes = Array.from(gamepad.axes);
    const buttons = gamepad.buttons.map(b => b.value);
    display.update(axes, buttons);
  }

  requestAnimationFrame(updateGamepad);
}

updateGamepad();
```

### React

```jsx
import { useEffect, useRef } from 'react';
import { GamepadDisplay } from 'gamepad-display';

function GamepadComponent() {
  const containerRef = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    displayRef.current = new GamepadDisplay(containerRef.current);

    const updateGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];

      if (gamepad) {
        const axes = Array.from(gamepad.axes);
        const buttons = gamepad.buttons.map(b => b.value);
        displayRef.current.update(axes, buttons);
      }

      requestAnimationFrame(updateGamepad);
    };

    updateGamepad();

    return () => displayRef.current?.destroy();
  }, []);

  return <div ref={containerRef} />;
}
```

### Vue

```vue
<template>
  <div ref="container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { GamepadDisplay } from 'gamepad-display';

const container = ref(null);
let display = null;
let animationId = null;

onMounted(() => {
  display = new GamepadDisplay(container.value);

  const updateGamepad = () => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0];

    if (gamepad) {
      const axes = Array.from(gamepad.axes);
      const buttons = gamepad.buttons.map(b => b.value);
      display.update(axes, buttons);
    }

    animationId = requestAnimationFrame(updateGamepad);
  };

  updateGamepad();
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  display?.destroy();
});
</script>
```

### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { GamepadDisplay } from 'gamepad-display';

  let container;
  let display;
  let animationId;

  onMount(() => {
    display = new GamepadDisplay(container);

    const updateGamepad = () => {
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];

      if (gamepad) {
        const axes = Array.from(gamepad.axes);
        const buttons = gamepad.buttons.map(b => b.value);
        display.update(axes, buttons);
      }

      animationId = requestAnimationFrame(updateGamepad);
    };

    updateGamepad();
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    display?.destroy();
  });
</script>

<div bind:this={container}></div>
```

## API

### Constructor

```typescript
new GamepadDisplay(container: HTMLElement, options?: GamepadDisplayOptions)
```

#### Options

```typescript
interface GamepadDisplayColors {
  primary?: string;          // Color for pressed buttons
  buttonOutline?: string;    // Color for unpressed button outlines
  stickBase?: string;        // Color for analog stick base circles
  buttonLabel?: string;      // Color for button labels (A, B, X, Y)
}

interface GamepadDisplayOptions {
  width?: number;            // SVG viewBox width (default: 225)
  height?: number;           // SVG viewBox height (default: 120)
  primaryColor?: string;     // Shorthand for colors.primary (default: '#0d6efd')
  colors?: GamepadDisplayColors; // Fine-grained color control
  autoInjectStyles?: boolean; // Automatically inject CSS (default: true)
}
```

**Default colors:**
- `primary`: `#0d6efd` (blue)
- `buttonOutline`: `#6c757d` (gray)
- `stickBase`: `#dee2e6` (light gray)
- `buttonLabel`: `#6c757d` (gray)

### Methods

#### `update(axes: number[], buttons: number[]): void`

Update the display with current gamepad state.

- `axes`: Array of axis values (typically 4 values for two analog sticks, range -1 to 1)
- `buttons`: Array of button values (16 values for standard gamepad, range 0 to 1)

#### `setColor(color: string): void`

Change the primary color used for pressed buttons.

```javascript
display.setColor('#22c55e');
```

#### `setColors(colors: Partial<GamepadDisplayColors>): void`

Update multiple colors at once. Only specified colors will be changed.

```javascript
display.setColors({
  primary: '#22c55e',
  buttonOutline: '#ffffff',
  stickBase: '#888888',
  buttonLabel: '#ffffff'
});
```

#### `getColors(): GamepadDisplayColors`

Get the current color configuration.

```javascript
const colors = display.getColors();
console.log(colors.primary);
```

#### `destroy(): void`

Remove the display and clean up resources.

```javascript
display.destroy();
```

### Color Customization Examples

**Using the `colors` option:**

```javascript
const display = new GamepadDisplay(container, {
  colors: {
    primary: '#22c55e',       // Green for pressed buttons
    buttonOutline: '#ffffff', // White outlines
    stickBase: '#888888',     // Gray stick bases
    buttonLabel: '#ffffff'    // White labels
  }
});
```

**Using the legacy `primaryColor` option:**

```javascript
const display = new GamepadDisplay(container, {
  primaryColor: '#ff0000'  // Red for pressed buttons
});
```

**Changing colors dynamically:**

```javascript
display.setColor('#ff0000');

display.setColors({
  primary: '#00ff00',
  buttonOutline: '#ffffff'
});
```

### Styling

Styles are automatically injected by default. To disable auto-injection and use your own CSS:

```javascript
const display = new GamepadDisplay(container, {
  autoInjectStyles: false
});
```

Then import the CSS separately:

```javascript
import 'gamepad-display/styles.css';
```

Or customize the CSS variables:

```css
.gamepad-svg {
  --control-primary: #22c55e;
  --button-outline: #ffffff;
  --stick-base: #888888;
  --button-label: #ffffff;
}
```

## Button Mapping

Standard gamepad button indices:
- 0-3: Face buttons (A, B, X, Y)
- 4-5: Shoulder buttons (L1, R1)
- 6-7: Triggers (L2, R2)
- 8-9: Select/Start
- 10-11: Stick buttons (L3, R3)
- 12-15: D-pad (Up, Down, Left, Right)

Standard gamepad axis indices:
- 0-1: Left stick (X, Y)
- 2-3: Right stick (X, Y)

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and connect a gamepad to see the demo.

## Build

```bash
npm run build
```

## License

MIT
