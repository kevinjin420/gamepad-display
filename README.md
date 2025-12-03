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
- `primaryColor` - Color for pressed buttons (default: `'#0d6efd'`)
- `colors` - Fine-grained color control: `primary`, `buttonOutline`, `stickBase`, `buttonLabel`
- `width`, `height` - SVG viewBox dimensions (default: 225×120)
- `autoInjectStyles` - Auto-inject CSS (default: `true`)

### Methods

**`update(axes: number[], buttons: number[])`** - Update display with gamepad state

**`setColor(color: string)`** - Change primary color

**`setColors(colors: Partial<GamepadDisplayColors>)`** - Update multiple colors

**`getColors()`** - Get current color configuration

**`destroy()`** - Clean up resources

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
