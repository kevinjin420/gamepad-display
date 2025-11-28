import { injectStyles } from './inject-styles';

export interface GamepadDisplayColors {
  primary?: string;
  buttonOutline?: string;
  stickBase?: string;
  buttonLabel?: string;
}

export interface GamepadDisplayOptions {
  width?: number;
  height?: number;
  primaryColor?: string;
  colors?: GamepadDisplayColors;
  autoInjectStyles?: boolean;
}

export interface ResolvedColors {
  primary: string;
  buttonOutline: string;
  stickBase: string;
  buttonLabel: string;
}

export class GamepadDisplay {
  private container: HTMLElement;
  private svg: SVGSVGElement;
  private elements: Map<string, SVGElement> = new Map();
  private options: Required<Omit<GamepadDisplayOptions, 'colors' | 'primaryColor'>>;
  private colors: ResolvedColors;

  private readonly origins = {
    bumpersTriggers: { x: 65, y: 15 },
    centerButtons: { x: 95, y: 60 },
    leftStick: { x: 30, y: 30 },
    dpad: { x: 8, y: 60 },
    faceButtons: { x: 175, y: 14 },
    rightStick: { x: 194, y: 88 }
  };

  constructor(container: HTMLElement, options: GamepadDisplayOptions = {}) {
    this.container = container;
    this.options = {
      width: options.width ?? 225,
      height: options.height ?? 120,
      autoInjectStyles: options.autoInjectStyles ?? true
    };

    this.colors = {
      primary: options.colors?.primary ?? options.primaryColor ?? '#0d6efd',
      buttonOutline: options.colors?.buttonOutline ?? '#6c757d',
      stickBase: options.colors?.stickBase ?? '#dee2e6',
      buttonLabel: options.colors?.buttonLabel ?? '#6c757d'
    };

    if (this.options.autoInjectStyles) {
      injectStyles();
    }

    this.svg = this.createSVG();
    this.applyColors();
    this.container.appendChild(this.svg);
  }

  private createSVG(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);
    svg.classList.add('gamepad-svg');
    svg.style.width = '100%';
    svg.style.maxWidth = '235px';
    svg.style.height = 'auto';

    this.createBumpersTriggers(svg);
    this.createLeftStick(svg);
    this.createDPad(svg);
    this.createCenterButtons(svg);
    this.createFaceButtons(svg);
    this.createRightStick(svg);

    return svg;
  }

  private createBumpersTriggers(svg: SVGSVGElement): void {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('bumpers-triggers');

    const leftBumper = this.createRect(this.origins.bumpersTriggers.x, this.origins.bumpersTriggers.y, 40, 10, 2);
    const rightBumper = this.createRect(this.origins.bumpersTriggers.x + 50, this.origins.bumpersTriggers.y, 40, 10, 2);

    const leftTriggerOutline = this.createRect(this.origins.bumpersTriggers.x, this.origins.bumpersTriggers.y + 15, 40, 15, 2);
    const leftTriggerFill = this.createRect(this.origins.bumpersTriggers.x, this.origins.bumpersTriggers.y + 15, 40, 15, 2);
    leftTriggerFill.classList.remove('button-outline');
    leftTriggerFill.classList.add('button-filled');

    const rightTriggerOutline = this.createRect(this.origins.bumpersTriggers.x + 50, this.origins.bumpersTriggers.y + 15, 40, 15, 2);
    const rightTriggerFill = this.createRect(this.origins.bumpersTriggers.x + 50, this.origins.bumpersTriggers.y + 15, 40, 15, 2);
    rightTriggerFill.classList.remove('button-outline');
    rightTriggerFill.classList.add('button-filled');

    g.append(leftBumper, rightBumper, leftTriggerOutline, leftTriggerFill, rightTriggerOutline, rightTriggerFill);
    svg.appendChild(g);

    this.elements.set('bumper-left', leftBumper);
    this.elements.set('bumper-right', rightBumper);
    this.elements.set('trigger-left', leftTriggerFill);
    this.elements.set('trigger-right', rightTriggerFill);
  }

  private createLeftStick(svg: SVGSVGElement): void {
    const base = this.createCircle(this.origins.leftStick.x, this.origins.leftStick.y, 23);
    base.classList.remove('button-outline');
    base.classList.add('stick-base');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('left-stick');

    const stick = this.createCircle(this.origins.leftStick.x, this.origins.leftStick.y, 12);

    g.appendChild(stick);
    svg.append(base, g);

    this.elements.set('left-stick-group', g);
    this.elements.set('left-stick-button', stick);
  }

  private createDPad(svg: SVGSVGElement): void {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('dpad');

    const up = this.createRect(this.origins.dpad.x + 15, this.origins.dpad.y, 12, 15, 2);
    const left = this.createRect(this.origins.dpad.x, this.origins.dpad.y + 15, 15, 12, 2);
    const down = this.createRect(this.origins.dpad.x + 15, this.origins.dpad.y + 27, 12, 15, 2);
    const right = this.createRect(this.origins.dpad.x + 27, this.origins.dpad.y + 15, 15, 12, 2);

    g.append(up, left, down, right);
    svg.appendChild(g);

    this.elements.set('dpad-up', up);
    this.elements.set('dpad-left', left);
    this.elements.set('dpad-down', down);
    this.elements.set('dpad-right', right);
  }

  private createCenterButtons(svg: SVGSVGElement): void {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('center-buttons');

    const select = this.createCircle(this.origins.centerButtons.x, this.origins.centerButtons.y, 5);
    const start = this.createCircle(this.origins.centerButtons.x + 30, this.origins.centerButtons.y, 5);

    g.append(select, start);
    svg.appendChild(g);

    this.elements.set('button-select', select);
    this.elements.set('button-start', start);
  }

  private createFaceButtons(svg: SVGSVGElement): void {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('face-buttons');

    const buttons = [
      { x: 18, y: 36, label: 'A', key: 'button-a' },
      { x: 36, y: 18, label: 'B', key: 'button-b' },
      { x: 0, y: 18, label: 'X', key: 'button-x' },
      { x: 18, y: 0, label: 'Y', key: 'button-y' }
    ];

    buttons.forEach(btn => {
      const circle = this.createCircle(
        this.origins.faceButtons.x + btn.x,
        this.origins.faceButtons.y + btn.y,
        10
      );
      const text = this.createText(
        this.origins.faceButtons.x + btn.x,
        this.origins.faceButtons.y + btn.y,
        btn.label
      );

      g.append(circle, text);
      this.elements.set(btn.key, circle);
    });

    svg.appendChild(g);
  }

  private createRightStick(svg: SVGSVGElement): void {
    const base = this.createCircle(this.origins.rightStick.x, this.origins.rightStick.y, 23);
    base.classList.remove('button-outline');
    base.classList.add('stick-base');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('right-stick');

    const stick = this.createCircle(this.origins.rightStick.x, this.origins.rightStick.y, 12);

    g.appendChild(stick);
    svg.append(base, g);

    this.elements.set('right-stick-group', g);
    this.elements.set('right-stick-button', stick);
  }

  private createRect(x: number, y: number, width: number, height: number, rx: number = 0): SVGRectElement {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    if (rx > 0) rect.setAttribute('rx', rx.toString());
    rect.classList.add('button-outline');
    return rect;
  }

  private createCircle(cx: number, cy: number, r: number): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', r.toString());
    circle.classList.add('button-outline');
    return circle;
  }

  private createText(x: number, y: number, content: string): SVGTextElement {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x.toString());
    text.setAttribute('y', y.toString());
    text.classList.add('button-label');
    text.textContent = content;
    return text;
  }

  public update(axes: number[], buttons: number[]): void {
    this.updateButton('button-a', buttons[0]);
    this.updateButton('button-b', buttons[1]);
    this.updateButton('button-x', buttons[2]);
    this.updateButton('button-y', buttons[3]);
    this.updateButton('bumper-left', buttons[4]);
    this.updateButton('bumper-right', buttons[5]);
    this.updateTrigger('trigger-left', buttons[6], 'left');
    this.updateTrigger('trigger-right', buttons[7], 'right');
    this.updateButton('button-select', buttons[8]);
    this.updateButton('button-start', buttons[9]);
    this.updateButton('left-stick-button', buttons[10]);
    this.updateButton('right-stick-button', buttons[11]);
    this.updateButton('dpad-up', buttons[12]);
    this.updateButton('dpad-down', buttons[13]);
    this.updateButton('dpad-left', buttons[14]);
    this.updateButton('dpad-right', buttons[15]);

    this.updateStick('left-stick-group', axes[0] ?? 0, axes[1] ?? 0);
    this.updateStick('right-stick-group', axes[2] ?? 0, axes[3] ?? 0);
  }

  private updateButton(key: string, value: number): void {
    const element = this.elements.get(key);
    if (!element) return;

    if (value > 0.5) {
      element.classList.add('pressed');
    } else {
      element.classList.remove('pressed');
    }
  }

  private updateTrigger(key: string, value: number, side: 'left' | 'right'): void {
    const element = this.elements.get(key);
    if (!element) return;

    const clipPath = side === 'left'
      ? `inset(0 0 0 ${(1 - value) * 100}%)`
      : `inset(0 ${(1 - value) * 100}% 0 0)`;

    element.style.clipPath = clipPath;
  }

  private updateStick(key: string, x: number, y: number): void {
    const element = this.elements.get(key);
    if (!element) return;

    element.setAttribute('transform', `translate(${x * 10}, ${y * 10})`);
  }

  private applyColors(): void {
    this.svg.style.setProperty('--control-primary', this.colors.primary);
    this.svg.style.setProperty('--button-outline', this.colors.buttonOutline);
    this.svg.style.setProperty('--stick-base', this.colors.stickBase);
    this.svg.style.setProperty('--button-label', this.colors.buttonLabel);
  }

  public destroy(): void {
    this.svg.remove();
    this.elements.clear();
  }

  public setColor(color: string): void {
    this.colors.primary = color;
    this.svg.style.setProperty('--control-primary', color);
  }

  public setColors(colors: Partial<GamepadDisplayColors>): void {
    if (colors.primary !== undefined) {
      this.colors.primary = colors.primary;
      this.svg.style.setProperty('--control-primary', colors.primary);
    }
    if (colors.buttonOutline !== undefined) {
      this.colors.buttonOutline = colors.buttonOutline;
      this.svg.style.setProperty('--button-outline', colors.buttonOutline);
    }
    if (colors.stickBase !== undefined) {
      this.colors.stickBase = colors.stickBase;
      this.svg.style.setProperty('--stick-base', colors.stickBase);
    }
    if (colors.buttonLabel !== undefined) {
      this.colors.buttonLabel = colors.buttonLabel;
      this.svg.style.setProperty('--button-label', colors.buttonLabel);
    }
  }

  public getColors(): ResolvedColors {
    return { ...this.colors };
  }
}

export { injectStyles };
