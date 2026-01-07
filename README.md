# gamepad-display

Framework-agnostic gamepad visualization component. Display real-time gamepad input with an SVG-based controller diagram.

**Note:** Currently supports Xbox-style controllers only.

## Installation

```bash
npm install gamepad-display
```

## Quick Start

```javascript
import { GamepadDisplay } from 'gamepad-display';

const display = new GamepadDisplay(document.getElementById('container'));

function update() {
  const gamepad = navigator.getGamepads()[0];
  if (gamepad) {
    display.update(Array.from(gamepad.axes), gamepad.buttons.map(b => b.value));
  }
  requestAnimationFrame(update);
}
update();
```

## API

### `new GamepadDisplay(container, options?)`

**Options:**
- `layout` - Layout preset name (`'default'` or `'horizontal'`) or custom `GamepadLayout` object
- `primaryColor` - Color for pressed buttons (default: `'#0d6efd'`)
- `colors` - Fine-grained color control: `primary`, `buttonOutline`, `stickBase`, `buttonLabel`
- `width`, `height` - Override SVG viewBox dimensions
- `autoInjectStyles` - Auto-inject CSS (default: `true`)

### Methods

**`update(axes: number[], buttons: number[])`** - Update display with gamepad state

**`setColor(color: string)`** - Change primary color

**`setColors(colors: Partial<GamepadDisplayColors>)`** - Update multiple colors

**`getColors()`** - Get current color configuration

**`getLayout()`** - Get current layout configuration

**`destroy()`** - Clean up resources

## Layouts

Two built-in layouts are available:

- `'default'` - Standard Xbox-style controller layout (225x120)
- `'horizontal'` - Single-row compact layout, optimized for minimal vertical height (333x60)

```javascript
// Default layout
const display = new GamepadDisplay(container);

// Horizontal layout
const display = new GamepadDisplay(container, { layout: 'horizontal' });
```

### Custom Layouts

Create a custom layout by defining origins for each component group:

```javascript
import { GamepadDisplay, layouts } from 'gamepad-display';

const customLayout = {
  name: 'custom',
  width: 400,
  height: 100,
  origins: {
    leftStick: { x: 40, y: 50 },
    dpad: { x: 80, y: 30 },
    bumpersTriggers: { x: 150, y: 10 },
    centerButtons: { x: 180, y: 60 },
    faceButtons: { x: 300, y: 30 },
    rightStick: { x: 360, y: 50 }
  }
};

const display = new GamepadDisplay(container, { layout: customLayout });
```

### Examples

```javascript
const display = new GamepadDisplay(container, {
  colors: { primary: '#22c55e', buttonOutline: '#ffffff' }
});

display.setColor('#ff0000');
display.destroy();
```

## License

MIT
