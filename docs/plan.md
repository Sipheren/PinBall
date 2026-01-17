# Pinball Game — Development Plan (Fresh Start)

---

## Project Overview

**Status:** Starting fresh - scrapping existing codebase

A fully-featured, multi-level pinball game built with TypeScript, PixiJS v8 (WebGL), and Matter.js physics.

### Core Features
1. **Dynamic camera system** that smoothly follows the ball with zoom/pan
2. **High-resolution code-generated graphics** using gradients, filters, and layered effects
3. **Multi-table progression** with score-based unlocking (traditional pinball style)

### Tech Stack
| Layer | Technology |
|-------|------------|
| **Rendering** | PixiJS v8 (WebGL) |
| **Physics** | Matter.js |
| **Language** | TypeScript |
| **Build** | Vite + pnpm |
| **Audio** | Howler.js (future) |
| **Storage** | localStorage |

---

## Architecture Overview

```
pinball/
├── src/
│   ├── core/
│   │   ├── Game.ts              # Main game loop, orchestrates everything
│   │   ├── Camera.ts            # Dynamic viewport, follows ball
│   │   ├── Renderer.ts          # PixiJS setup, layer management
│   │   ├── Physics.ts           # Matter.js wrapper, physics world
│   │   ├── InputManager.ts      # Keyboard, touch, gamepad
│   │   ├── AssetManager.ts      # Texture caching, resolution scaling
│   │   ├── ProgressManager.ts   # Save/load, high scores, unlocks
│   │   └── GraphicsFactory.ts   # Code-generated graphics
│   ├── entities/
│   │   ├── Ball.ts              # Ball physics + rendering
│   │   ├── Flipper.ts           # Left/right flippers
│   │   ├── Bumper.ts            # Pop bumpers with glow
│   │   ├── Target.ts            # Drop/standup targets
│   │   ├── Ramp.ts              # Ramps with ball layer change
│   │   ├── Spinner.ts           # Rotating spinners
│   │   └── Table.ts             # Playfield, walls, drain
│   ├── systems/
│   │   ├── CollisionSystem.ts   # Event routing for collisions
│   │   ├── ScoreSystem.ts       # Points, multipliers, combos
│   │   ├── AudioSystem.ts       # Sound effects, music (future)
│   │   └── ParticleSystem.ts    # Visual effects, sparks
│   ├── levels/
│   │   ├── TableConfig.ts       # Table definition interfaces
│   │   ├── LevelManager.ts      # Table loading, switching
│   │   └── table-definitions.json # Table data
│   ├── effects/
│   │   ├── PostProcessing.ts    # Bloom, vignette, screen shake
│   │   └── Lighting.ts          # Dynamic point lights
│   ├── ui/
│   │   ├── HUD.ts               # Score, ball count, multiplier
│   │   ├── LevelSelect.ts       # Table selection screen
│   │   └── Menu.ts              # Main menu, pause, settings
│   ├── utils/
│   │   ├── camera-utils.ts      # Lerp, clamp, coordinate transforms
│   │   └── constants.ts         # All game constants
│   └── main.ts                  # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## Phase 1: Foundation Setup

### 1.1 Project Initialization

**Tasks:**
1. Clean out existing src/ directory (keep package.json, vite.config.ts if valid)
2. Initialize fresh src/ structure
3. Configure TypeScript with strict mode
4. Set up path aliases (@/core, @/entities, etc.)

### 1.2 Core Constants

**File:** `src/utils/constants.ts`

```typescript
// Viewport (what user sees)
export const VIEWPORT = {
  WIDTH: 540,
  HEIGHT: 960,
};

// World (full playfield - 3x viewport for camera following)
export const WORLD = {
  WIDTH: 1620,
  HEIGHT: 2880,
};

// Camera settings
export const CAMERA = {
  FOLLOW_SPEED: 0.08,      // Lerp factor (lower = smoother)
  LOOK_AHEAD: 0.5,         // Velocity anticipation
  MIN_ZOOM: 0.6,           // Can zoom out
  MAX_ZOOM: 1.2,           // Can zoom in
  DEFAULT_ZOOM: 1.0,
  BOUNDS_PADDING: 50,
};

// Physics
export const PHYSICS = {
  GRAVITY: { x: 0, y: 0.8 },
  STEP: 1000 / 120,        // 120Hz physics
  MAX_SUBSTEPS: 4,
};

// Ball
export const BALL = {
  RADIUS: 12,
  MASS: 1.0,
  RESTITUTION: 0.7,
  FRICTION: 0.02,
  MAX_VELOCITY: 50,
};

// Flipper
export const FLIPPER = {
  LENGTH: 90,
  WIDTH: 16,
  ANGULAR_VELOCITY: 50,
  REST_ANGLE_LEFT: 30 * (Math.PI / 180),
  ACTIVE_ANGLE_LEFT: -30 * (Math.PI / 180),
  REST_ANGLE_RIGHT: 150 * (Math.PI / 180),
  ACTIVE_ANGLE_RIGHT: 210 * (Math.PI / 180),
};

// Collision categories for Matter.js
export const COLLISION = {
  BALL: 0x0001,
  FLIPPER: 0x0002,
  BUMPER: 0x0004,
  WALL: 0x0008,
  TARGET: 0x0010,
  RAMP: 0x0020,
  SENSOR: 0x0040,
};

// Scoring
export const SCORING = {
  BUMPER_HIT: 100,
  TARGET_HIT: 500,
  RAMP_COMPLETE: 2500,
  COMBO_WINDOW: 2000,
  COMBO_MULTIPLIER_MAX: 10,
};

// Theme colors
export const COLORS = {
  BACKGROUND: 0x1a1a2e,
  PLAYFIELD: 0x16213e,
  BALL: 0xc0c0c0,
  BALL_HIGHLIGHT: 0xffffff,
  FLIPPER_BODY: 0x4169e1,
  FLIPPER_RUBBER: 0xdc143c,
  BUMPER_BASE: 0x4a4a4a,
  BUMPER_RED: 0xff4444,
  BUMPER_BLUE: 0x4488ff,
  BUMPER_YELLOW: 0xffcc00,
};
```

---

## Phase 2: Core Engine

### 2.1 Camera System

**File:** `src/core/Camera.ts`

```typescript
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { CAMERA, VIEWPORT, WORLD } from '../utils/constants.js';

export interface CameraConfig {
  viewportWidth: number;
  viewportHeight: number;
  worldWidth: number;
  worldHeight: number;
  followSpeed: number;
  lookAhead: number;
  minZoom: number;
  maxZoom: number;
}

export enum CameraMode {
  FOLLOWING,
  FIXED,
  PANNING,
}

export class Camera {
  private container: PIXI.Container;
  private target: Matter.Body | null = null;
  private config: CameraConfig;

  // Current state
  private currentX = 0;
  private currentY = 0;
  private currentZoom = 1;

  // Target state (for smooth transitions)
  private targetX = 0;
  private targetY = 0;
  private targetZoom = 1;

  constructor(config: Partial<CameraConfig> = {}) {
    this.config = {
      viewportWidth: VIEWPORT.WIDTH,
      viewportHeight: VIEWPORT.HEIGHT,
      worldWidth: WORLD.WIDTH,
      worldHeight: WORLD.HEIGHT,
      followSpeed: CAMERA.FOLLOW_SPEED,
      lookAhead: CAMERA.LOOK_AHEAD,
      minZoom: CAMERA.MIN_ZOOM,
      maxZoom: CAMERA.MAX_ZOOM,
      ...config,
    };

    this.container = new PIXI.Container();
  }

  // Set the physics body to follow
  follow(target: Matter.Body): void {
    this.target = target;
  }

  // Stop following
  stopFollowing(): void {
    this.target = null;
  }

  // Direct position control
  setPosition(x: number, y: number): void {
    this.target = null;
    this.targetX = x;
    this.targetY = y;
  }

  // Zoom control
  setZoom(level: number): void {
    this.targetZoom = Math.max(this.config.minZoom, Math.min(this.config.maxZoom, level));
  }

  // Update camera (call every frame)
  update(deltaTime: number): void {
    if (this.target) {
      // Calculate desired position (ball centered in viewport)
      const desiredX = this.target.position.x - this.config.viewportWidth / 2;
      const desiredY = this.target.position.y - this.config.viewportHeight / 2;

      // Add velocity-based look-ahead
      const lookAheadX = this.target.velocity.x * this.config.lookAhead;
      const lookAheadY = this.target.velocity.y * this.config.lookAhead;

      this.targetX = desiredX + lookAheadX;
      this.targetY = desiredY + lookAheadY;
    }

    // Clamp to world bounds
    this.targetX = Math.max(0, Math.min(this.config.worldWidth - this.config.viewportWidth, this.targetX));
    this.targetY = Math.max(0, Math.min(this.config.worldHeight - this.config.viewportHeight, this.targetY));

    // Smooth interpolation
    const smoothFactor = this.config.followSpeed * deltaTime * 60;
    this.currentX += (this.targetX - this.currentX) * smoothFactor;
    this.currentY += (this.targetY - this.currentY) * smoothFactor;
    this.currentZoom += (this.targetZoom - this.currentZoom) * smoothFactor;

    // Apply to container
    this.container.position.set(-this.currentX, -this.currentY);
    this.container.scale.set(this.currentZoom);
  }

  // Coordinate conversion
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: (worldX - this.currentX) * this.currentZoom,
      y: (worldY - this.currentY) * this.currentZoom,
    };
  }

  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX / this.currentZoom + this.currentX,
      y: screenY / this.currentZoom + this.currentY,
    };
  }

  // Getters
  getContainer(): PIXI.Container {
    return this.container;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.currentX, y: this.currentY };
  }

  getZoom(): number {
    return this.currentZoom;
  }
}
```

### 2.2 Physics System

**File:** `src/core/Physics.ts`

```typescript
import Matter from 'matter-js';
import { PHYSICS, COLLISION } from '../utils/constants.js';

export class Physics {
  private engine: Matter.Engine;
  private runner: Matter.Runner | null = null;

  constructor() {
    this.engine = Matter.Engine.create({
      gravity: PHYSICS.GRAVITY,
    });

    // Configure for better pinball physics
    this.engine.positionIterations = 10;
    this.engine.velocityIterations = 10;

    // Enable continuous collision detection
    this.engine.enableSleeping = false;
  }

  // Create a circle body (ball, bumper)
  createCircle(x: number, y: number, radius: number, options: Matter.IBodyDefinition = {}): Matter.Body {
    return Matter.Bodies.circle(x, y, radius, {
      restitution: 0.7,
      friction: 0.02,
      density: 0.001,
      collisionFilter: {
        category: COLLISION.BALL,
      },
      ...options,
    });
  }

  // Create a rectangle body (flipper, target)
  createRectangle(x: number, y: number, width: number, height: number, options: Matter.IBodyDefinition = {}): Matter.Body {
    return Matter.Bodies.rectangle(x, y, width, height, {
      restitution: 0.4,
      friction: 0.1,
      ...options,
    });
  }

  // Create a wall from vertices
  createWall(vertices: Matter.Vector[], options: Matter.IBodyDefinition = {}): Matter.Body {
    return Matter.Bodies.fromVertices(0, 0, [vertices], {
      isStatic: true,
      restitution: 0.4,
      friction: 0.1,
      collisionFilter: {
        category: COLLISION.WALL,
      },
      ...options,
    }) as Matter.Body;
  }

  // Create a constraint (for flippers)
  createConstraint(bodyA: Matter.Body, bodyB: Matter.Body | null, options: Matter.IConstraintOptions = {}): Matter.Constraint {
    return Matter.Constraint.create({
      bodyA,
      bodyB: bodyB || undefined,
      stiffness: 1,
      length: 0,
      ...options,
    });
  }

  // Add body to world
  addBody(body: Matter.Body): void {
    Matter.Composite.add(this.engine.world, body);
  }

  // Remove body from world
  removeBody(body: Matter.Body): void {
    Matter.Composite.remove(this.engine.world, body);
  }

  // Add constraint to world
  addConstraint(constraint: Matter.Constraint): void {
    Matter.Composite.add(this.engine.world, constraint);
  }

  // Step physics
  step(deltaMs: number): void {
    Matter.Engine.update(this.engine, deltaMs);
  }

  // Get engine (for collision events)
  getEngine(): Matter.Engine {
    return this.engine;
  }

  // Start runner (for real-time)
  start(): void {
    if (!this.runner) {
      this.runner = Matter.Runner.create();
      Matter.Runner.run(this.runner, this.engine);
    }
  }

  // Stop runner
  stop(): void {
    if (this.runner) {
      Matter.Runner.stop(this.runner);
      this.runner = null;
    }
  }
}
```

### 2.3 Renderer

**File:** `src/core/Renderer.ts`

```typescript
import * as PIXI from 'pixi.js';
import { VIEWPORT } from '../utils/constants.js';

export class Renderer {
  private app: PIXI.Application;
  private layers: Map<string, PIXI.Container> = new Map();
  private cameraContainer: PIXI.Container;
  private uiContainer: PIXI.Container;

  constructor(canvas: HTMLCanvasElement) {
    this.app = new PIXI.Application({
      canvas,
      width: VIEWPORT.WIDTH,
      height: VIEWPORT.HEIGHT,
      backgroundColor: 0x1a1a2e,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: true,
    });

    this.setupLayers();
  }

  private setupLayers(): void {
    // Camera container (affected by camera movement)
    this.cameraContainer = new PIXI.Container();
    this.app.stage.addChild(this.cameraContainer);

    // Create layers inside camera container
    const cameraLayers = ['background', 'underRamp', 'ball', 'entities', 'overRamp', 'effects'];
    cameraLayers.forEach(name => {
      const layer = new PIXI.Container();
      layer.name = name;
      this.cameraContainer.addChild(layer);
      this.layers.set(name, layer);
    });

    // UI container (NOT affected by camera)
    this.uiContainer = new PIXI.Container();
    this.app.stage.addChild(this.uiContainer);
    this.layers.set('ui', this.uiContainer);
  }

  // Add to a specific layer
  addToLayer(layerName: string, displayObject: PIXI.DisplayObject): void {
    const layer = this.layers.get(layerName);
    if (layer) {
      layer.addChild(displayObject);
    }
  }

  // Remove from layer
  removeFromLayer(layerName: string, displayObject: PIXI.DisplayObject): void {
    const layer = this.layers.get(layerName);
    if (layer && layer.children.includes(displayObject)) {
      layer.removeChild(displayObject);
    }
  }

  // Get camera container (for Camera class)
  getCameraContainer(): PIXI.Container {
    return this.cameraContainer;
  }

  // Get UI container
  getUIContainer(): PIXI.Container {
    return this.uiContainer;
  }

  // Render frame
  render(): void {
    // PixiJS auto-renders, but we can force if needed
  }

  // Resize handler
  resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
  }

  // Destroy
  destroy(): void {
    this.app.destroy(true);
  }
}
```

### 2.4 Input Manager

**File:** `src/core/InputManager.ts`

```typescript
export type InputAction = 'flipperLeft' | 'flipperRight' | 'launch' | 'pause' | 'tiltLeft' | 'tiltRight';

export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private buttons: Map<InputAction, boolean> = new Map();
  private listeners: Map<InputAction, Set<() => void>> = new Map();

  // Keyboard bindings
  private bindings: Map<string, InputAction> = new Map([
    ['KeyA', 'flipperLeft'],
    ['ArrowLeft', 'flipperLeft'],
    ['ShiftLeft', 'flipperLeft'],
    ['KeyD', 'flipperRight'],
    ['ArrowRight', 'flipperRight'],
    ['ShiftRight', 'flipperRight'],
    ['Space', 'launch'],
    ['ArrowDown', 'launch'],
    ['Escape', 'pause'],
    ['KeyP', 'pause'],
    ['KeyQ', 'tiltLeft'],
    ['KeyE', 'tiltRight'],
  ]);

  constructor() {
    this.setupKeyboard();
    this.setupTouch();
  }

  private setupKeyboard(): void {
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.code, true);

      const action = this.bindings.get(e.code);
      if (action) {
        this.buttons.set(action, true);
        this.notify(action, true);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.code, false);

      const action = this.bindings.get(e.code);
      if (action) {
        this.buttons.set(action, false);
        this.notify(action, false);
      }
    });
  }

  private setupTouch(): void {
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;

      const halfWidth = window.innerWidth / 2;
      const x = e.touches[0].clientX;

      if (x < halfWidth) {
        this.buttons.set('flipperLeft', true);
        this.notify('flipperLeft', true);
      } else {
        this.buttons.set('flipperRight', true);
        this.notify('flipperRight', true);
      }
    });

    window.addEventListener('touchend', (e) => {
      const halfWidth = window.innerWidth / 2;
      const x = e.changedTouches[0].clientX;

      if (x < halfWidth) {
        this.buttons.set('flipperLeft', false);
        this.notify('flipperLeft', false);
      } else {
        this.buttons.set('flipperRight', false);
        this.notify('flipperRight', false);
      }

      // Check for swipe up (launch)
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY - touchEndY > 50) {
        this.notify('launch', true);
      }
    });
  }

  private notify(action: InputAction, pressed: boolean): void {
    const listeners = this.listeners.get(action);
    if (listeners) {
      listeners.forEach(fn => fn());
    }
  }

  // Subscribe to action events
  on(action: InputAction, callback: () => void): () => void {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set());
    }
    this.listeners.get(action)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(action)?.delete(callback);
    };
  }

  // Check if action is currently active
  isPressed(action: InputAction): boolean {
    return this.buttons.get(action) || false;
  }

  // Check if key is pressed
  isKeyPressed(code: string): boolean {
    return this.keys.get(code) || false;
  }
}
```

### 2.5 Main Game Loop

**File:** `src/core/Game.ts`

```typescript
import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { Camera } from './Camera.js';
import { InputManager } from './InputManager.js';
import { PHYSICS } from '../utils/constants.js';

export class Game {
  private physics: Physics;
  private renderer: Renderer;
  private camera: Camera;
  private input: InputManager;

  private accumulator = 0;
  private lastTime = 0;
  private paused = true;

  constructor(canvas: HTMLCanvasElement) {
    this.physics = new Physics();
    this.renderer = new Renderer(canvas);
    this.camera = new Camera();
    this.input = new InputManager();

    // Add camera to renderer
    this.renderer.getCameraContainer().addChild(this.camera.getContainer());

    this.setupInput();
  }

  private setupInput(): void {
    // Pause toggle
    this.input.on('pause', () => {
      this.togglePause();
    });

    // Launch ball
    this.input.on('launch', () => {
      if (this.paused) return;
      this.launchBall();
    });
  }

  // Start the game loop
  start(): void {
    this.paused = false;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  // Stop the game loop
  stop(): void {
    this.paused = true;
  }

  // Toggle pause state
  togglePause(): void {
    this.paused = !this.paused;
    if (!this.paused) {
      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }
  }

  // Main game loop
  private loop(currentTime: number): void {
    if (this.paused) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.update(deltaTime);

    requestAnimationFrame((t) => this.loop(t));
  }

  // Update game state
  private update(deltaMs: number): void {
    // Fixed timestep physics
    this.accumulator += deltaMs;
    const step = PHYSICS.STEP;
    const maxSteps = PHYSICS.MAX_SUBSTEPS;

    let steps = 0;
    while (this.accumulator >= step && steps < maxSteps) {
      this.physics.step(step);
      this.accumulator -= step;
      steps++;
    }

    // Update camera
    this.camera.update(deltaMs / 1000);

    // TODO: Update entities
  }

  // Launch a new ball
  private launchBall(): void {
    // TODO: Spawn ball at launcher position
  }

  // Get subsystems
  getPhysics(): Physics {
    return this.physics;
  }

  getRenderer(): Renderer {
    return this.renderer;
  }

  getCamera(): Camera {
    return this.camera;
  }

  getInput(): InputManager {
    return this.input;
  }
}
```

---

## Phase 3: Entities

### 3.1 Ball

**File:** `src/entities/Ball.ts`

```typescript
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { Physics } from '../core/Physics.js';
import { Renderer } from '../core/Renderer.js';
import { BALL, COLLISION } from '../utils/constants.js';

export class Ball {
  private body: Matter.Body;
  private graphics: PIXI.Graphics;
  private trail: PIXI.Graphics[] = [];

  constructor(physics: Physics, renderer: Renderer, x: number, y: number) {
    // Create physics body
    this.body = physics.createCircle(x, y, BALL.RADIUS, {
      collisionFilter: { category: COLLISION.BALL },
      restitution: BALL.RESTITUTION,
      friction: BALL.FRICTION,
    });
    physics.addBody(this.body);

    // Create graphics
    this.graphics = this.createGraphics();
    renderer.addToLayer('ball', this.graphics);
  }

  private createGraphics(): PIXI.Graphics {
    const g = new PIXI.Graphics();
    const r = BALL.RADIUS;

    // Shadow
    g.circle(r, r, r);
    g.fill({ color: 0x000000, alpha: 0.3 });

    // Main body (chrome effect)
    g.circle(r, r, r);
    g.fill({ color: BALL.BALL });

    // Highlight
    g.circle(r - r * 0.3, r - r * 0.3, r * 0.25);
    g.fill({ color: 0xffffff, alpha: 0.8 });

    // Secondary highlight
    g.circle(r - r * 0.4, r - r * 0.4, r * 0.1);
    g.fill({ color: 0xffffff });

    // Set pivot to center
    g.pivot.set(r, r);

    return g;
  }

  // Update graphics position
  update(): void {
    const pos = this.body.position;
    this.graphics.position.set(pos.x, pos.y);
    this.graphics.rotation = this.body.angle;

    // Clamp velocity
    const speed = Math.sqrt(this.body.velocity.x ** 2 + this.body.velocity.y ** 2);
    if (speed > BALL.MAX_VELOCITY) {
      const scale = BALL.MAX_VELOCITY / speed;
      Matter.Body.setVelocity(this.body, {
        x: this.body.velocity.x * scale,
        y: this.body.velocity.y * scale,
      });
    }
  }

  // Get physics body
  getBody(): Matter.Body {
    return this.body;
  }

  // Check if ball is below certain Y (drained)
  isDrained(yThreshold: number): boolean {
    return this.body.position.y > yThreshold;
  }

  // Destroy
  destroy(physics: Physics, renderer: Renderer): void {
    physics.removeBody(this.body);
    renderer.removeFromLayer('ball', this.graphics);
    this.graphics.destroy();
  }
}
```

### 3.2 Flipper

**File:** `src/entities/Flipper.ts`

```typescript
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { Physics } from '../core/Physics.js';
import { Renderer } from '../core/Renderer.js';
import { InputManager } from '../core/InputManager.js';
import { FLIPPER, COLLISION } from '../utils/constants.js';

export class Flipper {
  private body: Matter.Body;
  private pivot: Matter.Body;
  private constraint: Matter.Constraint;
  private graphics: PIXI.Graphics;
  private side: 'left' | 'right';
  private inputUnsub: () => void;

  constructor(
    physics: Physics,
    renderer: Renderer,
    input: InputManager,
    x: number,
    y: number,
    side: 'left' | 'right'
  ) {
    this.side = side;

    // Create flipper body
    this.body = physics.createRectangle(x, y, FLIPPER.LENGTH, FLIPPER.WIDTH, {
      collisionFilter: { category: COLLISION.FLIPPER },
      chamfer: { radius: FLIPPER.WIDTH / 2 },
      label: `flipper_${side}`,
    });

    // Create static pivot
    this.pivot = Matter.Bodies.circle(x, y, 5, { isStatic: true });

    // Create constraint
    this.constraint = physics.createConstraint(this.pivot, this.body, {
      pointA: { x: 0, y: 0 },
      pointB: { x: side === 'left' ? FLIPPER.WIDTH / 2 : FLIPPER.LENGTH - FLIPPER.WIDTH / 2, y: 0 },
    });

    physics.addBody(this.pivot);
    physics.addBody(this.body);
    physics.addConstraint(this.constraint);

    // Set initial angle
    const restAngle = side === 'left' ? FLIPPER.REST_ANGLE_LEFT : FLIPPER.REST_ANGLE_RIGHT;
    Matter.Body.setAngle(this.body, restAngle);

    // Create graphics
    this.graphics = this.createGraphics();
    this.graphics.position.set(x, y);
    this.graphics.rotation = restAngle;
    renderer.addToLayer('entities', this.graphics);

    // Subscribe to input
    const action = side === 'left' ? 'flipperLeft' : 'flipperRight';
    this.inputUnsub = input.on(action, () => this.activate());
  }

  private createGraphics(): PIXI.Graphics {
    const g = new PIXI.Graphics();

    // Body
    g.roundRect(0, 0, FLIPPER.LENGTH, FLIPPER.WIDTH, FLIPPER.WIDTH / 2);
    g.fill({ color: FLIPPER.FLIPPER_BODY });

    // Highlight
    g.roundRect(2, 2, FLIPPER.LENGTH - 4, FLIPPER.WIDTH / 3, FLIPPER.WIDTH / 4);
    g.fill({ color: 0x6495ed, alpha: 0.5 });

    // Rubber tip
    const tipX = this.side === 'left' ? FLIPPER.LENGTH - FLIPPER.WIDTH / 2 : FLIPPER.WIDTH / 2;
    g.circle(tipX, FLIPPER.WIDTH / 2, FLIPPER.WIDTH / 2 + 2);
    g.fill({ color: FLIPPER.FLIPPER_RUBBER });

    // Set pivot point
    g.pivot.set(
      this.side === 'left' ? FLIPPER.WIDTH / 2 : FLIPPER.LENGTH - FLIPPER.WIDTH / 2,
      FLIPPER.WIDTH / 2
    );

    return g;
  }

  private activate(): void {
    const targetAngle = this.side === 'left' ? FLIPPER.ACTIVE_ANGLE_LEFT : FLIPPER.ACTIVE_ANGLE_RIGHT;
    const restAngle = this.side === 'left' ? FLIPPER.REST_ANGLE_LEFT : FLIPPER.REST_ANGLE_RIGHT;

    // Apply angular velocity to flip up
    Matter.Body.setAngularVelocity(this.body, FLIPPER.ANGULAR_VELOCITY * (this.side === 'left' ? -1 : 1));

    // Return to rest after delay
    setTimeout(() => {
      Matter.Body.setAngularVelocity(this.body, -FLIPPER.ANGULAR_VELOCITY * 0.5 * (this.side === 'left' ? -1 : 1));
    }, 100);
  }

  // Update graphics
  update(): void {
    this.graphics.rotation = this.body.angle;
  }

  // Destroy
  destroy(physics: Physics, renderer: Renderer): void {
    this.inputUnsub();
    physics.removeBody(this.body);
    physics.removeBody(this.pivot);
    // @ts-ignore - remove constraint
    physics.removeBody(this.constraint);
    renderer.removeFromLayer('entities', this.graphics);
    this.graphics.destroy();
  }
}
```

### 3.3 Bumper

**File:** `src/entities/Bumper.ts`

```typescript
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { Physics } from '../core/Physics.js';
import { Renderer } from '../core/Renderer.js';
import { COLLISION } from '../utils/constants.js';

export interface BumperConfig {
  x: number;
  y: number;
  radius: number;
  color: 'red' | 'blue' | 'yellow';
  score: number;
}

export class Bumper {
  private body: Matter.Body;
  private container: PIXI.Container;
  private lit = false;
  private litTimer = 0;
  private config: BumperConfig;

  constructor(physics: Physics, renderer: Renderer, config: BumperConfig) {
    this.config = config;

    // Create physics body
    this.body = physics.createCircle(config.x, config.y, config.radius, {
      collisionFilter: { category: COLLISION.BUMPER },
      restitution: 1.3,
      label: 'bumper',
    });
    physics.addBody(this.body);

    // Create graphics
    this.container = this.createGraphics();
    this.container.position.set(config.x, config.y);
    renderer.addToLayer('entities', this.container);

    // Set up collision event
    Matter.Events.on(physics.getEngine(), 'collisionStart', (event) => {
      for (const pair of event.pairs) {
        if (pair.bodyA === this.body || pair.bodyB === this.body) {
          this.onHit();
          break;
        }
      }
    });
  }

  private createGraphics(): PIXI.Container {
    const container = new PIXI.Container();
    const r = this.config.radius;

    // Get color
    const colors = {
      red: 0xff4444,
      blue: 0x4488ff,
      yellow: 0xffcc00,
    };
    const color = colors[this.config.color];

    // Outer ring
    const outer = new PIXI.Graphics();
    outer.circle(0, 0, r);
    outer.fill({ color: 0x4a4a4a });
    container.addChild(outer);

    // LED ring
    const led = new PIXI.Graphics();
    led.circle(0, 0, r - 4);
    led.fill({ color });
    container.addChild(led);

    // Center dome
    const dome = new PIXI.Graphics();
    dome.circle(0, 0, r - 8);
    dome.fill({ color: 0x222222 });
    container.addChild(dome);

    // Highlight
    const highlight = new PIXI.Graphics();
    highlight.circle(-8, -8, 4);
    highlight.fill({ color: 0xffffff, alpha: 0.6 });
    container.addChild(highlight);

    // Glow (initially invisible)
    const glow = new PIXI.Graphics();
    glow.circle(0, 0, r + 10);
    glow.fill({ color, alpha: 0 });
    glow.name = 'glow';
    container.addChildAt(glow, 0);

    // Center pivot
    container.pivot.set(r, r);

    return container;
  }

  private onHit(): void {
    this.lit = true;
    this.litTimer = 200; // ms

    // Apply impulse away from center
    const ball = this.body;
    const bumper = this.body;
    const dx = ball.position.x - bumper.position.x;
    const dy = ball.position.y - bumper.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      Matter.Body.applyForce(ball, ball.position, {
        x: (dx / dist) * 0.05,
        y: (dy / dist) * 0.05,
      });
    }
  }

  // Update animation
  update(deltaMs: number): void {
    if (this.lit) {
      this.litTimer -= deltaMs;
      if (this.litTimer <= 0) {
        this.lit = false;
      }

      // Update glow
      const glow = this.container.getChildByName('glow') as PIXI.Graphics;
      if (glow) {
        const alpha = this.lit ? 0.5 : 0;
        glow.clear();
        glow.circle(0, 0, this.config.radius + 10);
        glow.fill({ color: this.getColor(), alpha });
      }
    }
  }

  private getColor(): number {
    const colors = { red: 0xff4444, blue: 0x4488ff, yellow: 0xffcc00 };
    return colors[this.config.color];
  }

  // Get score value
  getScore(): number {
    return this.config.score;
  }

  // Destroy
  destroy(physics: Physics, renderer: Renderer): void {
    physics.removeBody(this.body);
    renderer.removeFromLayer('entities', this.container);
    this.container.destroy();
  }
}
```

### 3.4 Table

**File:** `src/entities/Table.ts`

```typescript
import * as PIXI from 'pixi.js';
import Matter from 'matter-js';
import { Physics } from '../core/Physics.js';
import { Renderer } from '../core/Renderer.js';
import { WORLD, COLLISION } from '../utils/constants.js';

export class Table {
  private walls: Matter.Body[] = [];
  private graphics: PIXI.Graphics;
  private width: number;
  private height: number;

  constructor(physics: Physics, renderer: Renderer) {
    this.width = WORLD.WIDTH;
    this.height = WORLD.HEIGHT;

    // Create background
    this.graphics = this.createBackground();
    renderer.addToLayer('background', this.graphics);

    // Create walls
    this.createWalls(physics);
  }

  private createBackground(): PIXI.Graphics {
    const g = new PIXI.Graphics();

    // Main background
    g.roundRect(0, 0, this.width, this.height, 8);
    g.fill({ color: 0x1a1a2e });

    // Inner playfield
    g.roundRect(10, 10, this.width - 20, this.height - 20, 4);
    g.fill({ color: 0x16213e });

    // Grid lines
    g.setStrokeStyle({ width: 1, color: 0x2a2a40, alpha: 0.5 });
    for (let x = 50; x < this.width - 50; x += 50) {
      g.moveTo(x, 20);
      g.lineTo(x, this.height - 20);
    }
    for (let y = 50; y < this.height - 50; y += 50) {
      g.moveTo(20, y);
      g.lineTo(this.width - 20, y);
    }
    g.stroke();

    return g;
  }

  private createWalls(physics: Physics): void {
    const wallThickness = 20;

    // Wall definitions
    const wallDefs = [
      // Left wall
      [
        { x: 0, y: 0 },
        { x: wallThickness, y: 0 },
        { x: wallThickness, y: this.height },
        { x: 0, y: this.height },
      ],
      // Right wall
      [
        { x: this.width - wallThickness, y: 0 },
        { x: this.width, y: 0 },
        { x: this.width, y: this.height },
        { x: this.width - wallThickness, y: this.height },
      ],
      // Top wall (curved)
      [
        { x: 0, y: 0 },
        { x: this.width * 0.3, y: 0 },
        { x: this.width * 0.5, y: 30 },
        { x: this.width * 0.7, y: 0 },
        { x: this.width, y: 0 },
        { x: this.width, y: wallThickness },
        { x: 0, y: wallThickness },
      ],
      // Left slingshot
      [
        { x: 0, y: this.height - 250 },
        { x: 100, y: this.height - 200 },
        { x: 100, y: this.height - 150 },
        { x: 0, y: this.height - 100 },
      ],
      // Right slingshot
      [
        { x: this.width, y: this.height - 250 },
        { x: this.width - 100, y: this.height - 200 },
        { x: this.width - 100, y: this.height - 150 },
        { x: this.width, y: this.height - 100 },
      ],
    ];

    // Create wall bodies
    wallDefs.forEach((vertices) => {
      const wall = physics.createWall(vertices as Matter.Vector[], {
        restitution: 0.4,
        friction: 0.1,
        label: 'wall',
      });
      physics.addBody(wall);
      this.walls.push(wall);
    });
  }

  // Get drain area
  getDrainArea(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.width / 2 - 80,
      y: this.height - 60,
      width: 160,
      height: 40,
    };
  }

  // Get flipper positions
  getFlipperPositions(): {
    left: { x: number; y: number };
    right: { x: number; y: number };
  } {
    return {
      left: { x: 400, y: this.height - 120 },
      right: { x: this.width - 400, y: this.height - 120 },
    };
  }

  // Get ball spawn position
  getBallSpawnPosition(): { x: number; y: number } {
    return {
      x: this.width / 2,
      y: 200,
    };
  }

  // Check if position is in drain
  isInDrain(x: number, y: number): boolean {
    const drain = this.getDrainArea();
    return (
      x >= drain.x &&
      x <= drain.x + drain.width &&
      y >= drain.y &&
      y <= drain.y + drain.height
    );
  }

  // Destroy
  destroy(physics: Physics, renderer: Renderer): void {
    this.walls.forEach((wall) => physics.removeBody(wall));
    renderer.removeFromLayer('background', this.graphics);
    this.graphics.destroy();
  }
}
```

---

## Phase 4: Multi-Level Progression

### 4.1 Table Configuration

**File:** `src/levels/TableConfig.ts`

```typescript
export interface Vector2 {
  x: number;
  y: number;
}

export interface WallDef {
  vertices: Vector2[];
  restitution?: number;
}

export interface BumperDef {
  id: string;
  position: Vector2;
  radius: number;
  color: 'red' | 'blue' | 'yellow';
  score: number;
}

export interface FlipperDef {
  side: 'left' | 'right';
  position: Vector2;
  length?: number;
}

export interface TableTheme {
  id: string;
  name: string;
  colors: {
    background: number;
    playfield: number;
    accent: number;
  };
}

export interface UnlockRequirement {
  type: 'highScore' | 'tableComplete';
  tableId: string;
  value: number;
}

export interface TableConfig {
  id: string;
  name: string;
  theme: TableTheme;
  difficulty: 'easy' | 'medium' | 'hard';
  dimensions: {
    width: number;
    height: number;
  };
  gravity: Vector2;
  bumpers: BumperDef[];
  flippers: FlipperDef[];
  unlockRequirements?: UnlockRequirement;
}
```

### 4.2 Table Definitions JSON

**File:** `src/levels/table-definitions.json`

```json
{
  "tables": [
    {
      "id": "table_01_classic",
      "name": "Classic Arcade",
      "theme": {
        "id": "classic",
        "name": "Classic",
        "colors": {
          "background": 1752352,
          "playfield": 1447470,
          "accent": 4278190335
        }
      },
      "difficulty": "easy",
      "dimensions": { "width": 1620, "height": 2880 },
      "gravity": { "x": 0, "y": 0.8 },
      "bumpers": [
        {
          "id": "bumper_1",
          "position": { "x": 810, "y": 600 },
          "radius": 30,
          "color": "red",
          "score": 100
        },
        {
          "id": "bumper_2",
          "position": { "x": 600, "y": 800 },
          "radius": 30,
          "color": "blue",
          "score": 100
        },
        {
          "id": "bumper_3",
          "position": { "x": 1020, "y": 800 },
          "radius": 30,
          "color": "yellow",
          "score": 100
        }
      ],
      "flippers": [
        {
          "side": "left",
          "position": { "x": 400, "y": 2700 }
        },
        {
          "side": "right",
          "position": { "x": 1220, "y": 2700 }
        }
      ]
    },
    {
      "id": "table_02_space",
      "name": "Cosmic Voyage",
      "theme": {
        "id": "space",
        "name": "Space",
        "colors": {
          "background": 8947848,
          "playfield": 131586,
          "accent": 4278255360
        }
      },
      "difficulty": "medium",
      "dimensions": { "width": 1620, "height": 2880 },
      "gravity": { "x": 0, "y": 0.7 },
      "unlockRequirements": {
        "type": "highScore",
        "tableId": "table_01_classic",
        "value": 50000
      },
      "bumpers": [
        {
          "id": "bumper_1",
          "position": { "x": 810, "y": 500 },
          "radius": 35,
          "color": "red",
          "score": 150
        },
        {
          "id": "bumper_2",
          "position": { "x": 650, "y": 700 },
          "radius": 35,
          "color": "blue",
          "score": 150
        },
        {
          "id": "bumper_3",
          "position": { "x": 970, "y": 700 },
          "radius": 35,
          "color": "yellow",
          "score": 150
        }
      ],
      "flippers": [
        {
          "side": "left",
          "position": { "x": 400, "y": 2700 }
        },
        {
          "side": "right",
          "position": { "x": 1220, "y": 2700 }
        }
      ]
    },
    {
      "id": "table_03_horror",
      "name": "Haunted Mansion",
      "theme": {
        "id": "horror",
        "name": "Horror",
        "colors": {
          "background": 2105376,
          "playfield": 5197888,
          "accent": 4286513152
        }
      },
      "difficulty": "hard",
      "dimensions": { "width": 1620, "height": 2880 },
      "gravity": { "x": 0, "y": 0.9 },
      "unlockRequirements": {
        "type": "highScore",
        "tableId": "table_02_space",
        "value": 100000
      },
      "bumpers": [
        {
          "id": "bumper_1",
          "position": { "x": 810, "y": 400 },
          "radius": 40,
          "color": "red",
          "score": 200
        }
      ],
      "flippers": [
        {
          "side": "left",
          "position": { "x": 400, "y": 2700 }
        },
        {
          "side": "right",
          "position": { "x": 1220, "y": 2700 }
        }
      ]
    }
  ]
}
```

### 4.3 Progress Manager

**File:** `src/core/ProgressManager.ts`

```typescript
export interface SavedProgress {
  unlockedTables: string[];
  highScores: Record<string, number>;
  lastPlayedTable: string | null;
  version: string;
}

export class ProgressManager {
  private STORAGE_KEY = 'pinball_progress';
  private VERSION = '1.0';
  private progress: SavedProgress;

  constructor() {
    this.progress = this.load();
  }

  private load(): SavedProgress {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as SavedProgress;
        if (parsed.version === this.VERSION) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }

    // Default progress
    return {
      unlockedTables: ['table_01_classic'],
      highScores: {},
      lastPlayedTable: null,
      version: this.VERSION,
    };
  }

  save(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  isTableUnlocked(tableId: string): boolean {
    return this.progress.unlockedTables.includes(tableId);
  }

  unlockTable(tableId: string): void {
    if (!this.progress.unlockedTables.includes(tableId)) {
      this.progress.unlockedTables.push(tableId);
      this.save();
    }
  }

  getHighScore(tableId: string): number {
    return this.progress.highScores[tableId] || 0;
  }

  updateHighScore(tableId: string, score: number): boolean {
    const currentHigh = this.getHighScore(tableId);
    if (score > currentHigh) {
      this.progress.highScores[tableId] = score;
      this.save();
      return true;
    }
    return false;
  }

  setLastPlayedTable(tableId: string): void {
    this.progress.lastPlayedTable = tableId;
    this.save();
  }

  getLastPlayedTable(): string | null {
    return this.progress.lastPlayedTable;
  }

  reset(): void {
    this.progress = {
      unlockedTables: ['table_01_classic'],
      highScores: {},
      lastPlayedTable: null,
      version: this.VERSION,
    };
    this.save();
  }
}
```

---

## Phase 5: Implementation Order

### Step 1: Core Foundation (Day 1)
1. Clean existing src/ directory
2. Create fresh directory structure
3. Set up `src/utils/constants.ts`
4. Create `src/utils/camera-utils.ts` with helper functions:
   - `lerp(a, b, t)`
   - `clamp(value, min, max)`
   - `smoothStep(edge0, edge1, x)`

### Step 2: Engine Core (Day 1-2)
1. Create `src/core/Physics.ts`
2. Create `src/core/Renderer.ts`
3. Create `src/core/Camera.ts`
4. Create `src/core/InputManager.ts`
5. Create `src/core/Game.ts`
6. Update `src/main.ts` to initialize game

### Step 3: Basic Entities (Day 2-3)
1. Create `src/entities/Table.ts`
2. Create `src/entities/Ball.ts`
3. Create `src/entities/Flipper.ts`
4. Create `src/entities/Bumper.ts`
5. Wire up entities in Game.ts

### Step 4: Graphics Enhancement (Day 3-4)
1. Create `src/core/GraphicsFactory.ts` with enhanced graphics
2. Add gradient fills for metallic effects
3. Add glow effects using PIXI.BlurFilter
4. Create `src/effects/PostProcessing.ts`

### Step 5: Multi-Level System (Day 4-5)
1. Create `src/levels/TableConfig.ts`
2. Create `src/levels/table-definitions.json`
3. Create `src/levels/LevelManager.ts`
4. Create `src/core/ProgressManager.ts`
5. Integrate level loading

### Step 6: UI & Polish (Day 5-6)
1. Create `src/ui/HUD.ts` (score display)
2. Create `src/ui/LevelSelect.ts`
3. Add scoring system
4. Add combo system
5. Add particle effects

---

## Phase 6: Entry Point

**File:** `src/main.ts`

```typescript
import { Game } from './core/Game.js';

async function main() {
  const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  const game = new Game(canvas);
  game.start();
}

main().catch(console.error);
```

**File:** `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Pinball</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: #0a0a14;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      overflow: hidden;
    }
    canvas {
      max-width: 100%;
      max-height: 100vh;
      aspect-ratio: 9 / 16;
    }
  </style>
</head>
<body>
  <canvas id="gameCanvas"></canvas>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

---

## Verification Checklist

### Foundation
- [ ] Project compiles without errors
- [ ] Canvas renders with correct colors
- [ ] Game loop runs at 60fps

### Core Engine
- [ ] Physics engine initialized
- [ ] Camera container added to stage
- [ ] Input events registered
- [ ] Keyboard controls work

### Entities
- [ ] Table renders with walls
- [ ] Ball spawns and falls with gravity
- [ ] Flippers respond to input
- [ ] Bumpers bounce ball away
- [ ] Ball drains when falling below flippers

### Camera
- [ ] Camera follows ball smoothly
- [ ] Viewport clamps to world bounds
- [ ] Ball stays visible

### Multi-Level
- [ ] Can load table from JSON
- [ ] Progress saves to localStorage
- [ ] Tables unlock based on high score
