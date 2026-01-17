# Pinball Game — Detailed Development Plan

---

## Phase 1: Project Foundation

### 1.1 Project Setup

| Task | Details |
|------|---------|
| Initialize repo | Git + `.gitignore` for node_modules, dist, .env |
| Package manager | pnpm (faster, disk efficient) |
| Build tool | Vite with TypeScript template |
| Linting | ESLint + Prettier |
| Testing | Vitest for unit tests |

### 1.2 Directory Structure

```
pinball/
├── public/
│   └── assets/
│       ├── images/
│       │   ├── tables/          # Per-table sprite sheets
│       │   ├── ui/              # Menus, HUD elements
│       │   └── effects/         # Particles, glow textures
│       ├── audio/
│       │   ├── sfx/             # Sound effects (WebM/MP3)
│       │   └── music/           # Background tracks
│       └── tables/              # Table definition JSON files
├── src/
│   ├── core/
│   │   ├── Game.ts              # Main game loop
│   │   ├── Physics.ts           # Matter.js wrapper
│   │   ├── Renderer.ts          # PixiJS/Phaser wrapper
│   │   └── InputManager.ts      # Keyboard/touch/gamepad
│   ├── entities/
│   │   ├── Ball.ts
│   │   ├── Flipper.ts
│   │   ├── Bumper.ts
│   │   ├── Target.ts
│   │   ├── Ramp.ts
│   │   ├── Spinner.ts
│   │   └── Gate.ts
│   ├── systems/
│   │   ├── CollisionSystem.ts   # Collision event routing
│   │   ├── ScoreSystem.ts       # Points, multipliers, combos
│   │   ├── AudioSystem.ts       # Sound playback manager
│   │   ├── LightingSystem.ts    # Dynamic lights/glow
│   │   └── ParticleSystem.ts    # Visual effects
│   ├── tables/
│   │   ├── TableLoader.ts       # Parse table JSON + assets
│   │   ├── TableManager.ts      # Stage transitions
│   │   └── definitions/         # TypeScript table configs
│   ├── ui/
│   │   ├── HUD.ts               # Score, ball count, multiplier
│   │   ├── Menu.ts              # Main menu, pause, settings
│   │   └── Scoreboard.ts        # High scores
│   ├── utils/
│   │   ├── math.ts              # Vector helpers, angles
│   │   ├── pool.ts              # Object pooling
│   │   └── constants.ts         # Physics constants, tuning
│   └── main.ts                  # Entry point
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Phase 2: Core Engine

### 2.1 Game Loop Architecture

```typescript
// Target: 60fps render, 120Hz physics (fixed timestep)
const PHYSICS_STEP = 1000 / 120;  // 8.33ms
const MAX_SUBSTEPS = 4;

class Game {
  private accumulator = 0;
  
  update(deltaMs: number) {
    this.accumulator += deltaMs;
    
    let steps = 0;
    while (this.accumulator >= PHYSICS_STEP && steps < MAX_SUBSTEPS) {
      this.physics.step(PHYSICS_STEP);
      this.accumulator -= PHYSICS_STEP;
      steps++;
    }
    
    this.renderer.render(this.accumulator / PHYSICS_STEP); // interpolation factor
  }
}
```

### 2.2 Physics Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Gravity | `{ x: 0, y: 0.8 }` | Table tilt simulation |
| Restitution (ball) | `0.6 - 0.8` | Bounce energy retention |
| Friction (ball) | `0.02` | Rolling resistance |
| Flipper angular velocity | `±50 rad/s` | Snap response |
| CCD | Enabled | Prevent tunneling at high speeds |
| Position iterations | 10 | Collision accuracy |
| Velocity iterations | 10 | Stability |

### 2.3 Collision Categories

```typescript
enum CollisionCategory {
  BALL       = 0x0001,
  FLIPPER    = 0x0002,
  BUMPER     = 0x0004,
  WALL       = 0x0008,
  TARGET     = 0x0010,
  RAMP       = 0x0020,
  SENSOR     = 0x0040,  // Triggers without physical collision
  GATE       = 0x0080,
}
```

---

## Phase 3: Entity Implementation

### 3.1 Ball

```typescript
interface BallConfig {
  radius: number;           // 12-15px typical
  mass: number;             // 1.0 base
  restitution: number;      // 0.7 default
  friction: number;         // 0.02
  sprite: string;           // Asset key
  trailEffect: boolean;     // Motion blur/trail
}
```

**Features:**
- Continuous collision detection
- Velocity clamping (max speed limit)
- Trail particle emitter
- State: `active | locked | draining`

### 3.2 Flipper

```typescript
interface FlipperConfig {
  position: Vector2;
  side: 'left' | 'right';
  length: number;           // 80-100px
  restAngle: number;        // Radians, down position
  activeAngle: number;      // Radians, up position
  angularVelocity: number;  // 50 rad/s
  holdStrength: number;     // Force when ball rests on flipper
}
```

**Implementation:**
- Use Matter.js `Constraint` with motor
- Instant activation, gradual return
- Sound triggers: activate, deactivate, ball hit

### 3.3 Bumper

```typescript
interface BumperConfig {
  position: Vector2;
  radius: number;
  baseScore: number;
  restitution: number;      // 1.2+ for "pop"
  litState: boolean;        // Visual state
  hitAnimation: string;     // Sprite animation key
  hitSound: string;
}
```

**Behaviour:**
- Apply impulse on collision (direction = away from center)
- Flash animation + sound
- Score increment + combo tracking

### 3.4 Target

```typescript
interface TargetConfig {
  position: Vector2;
  shape: 'drop' | 'standup' | 'spinner';
  hitPoints: number;        // Hits to activate
  resetDelay: number;       // Ms before reset (drop targets)
  score: number;
  linkedGroup?: string;     // For target banks
}
```

### 3.5 Ramp

```typescript
interface RampConfig {
  entryPath: Vector2[];     // Bezier control points
  exitPath: Vector2[];
  entrySpeed: number;       // Minimum velocity to enter
  exitVelocity: Vector2;    // Applied on exit
  ballLayer: number;        // Z-index while on ramp
}
```

---

## Phase 4: Table Definition System

### 4.1 Table JSON Schema

```json
{
  "id": "classic_arcade",
  "name": "Classic Arcade",
  "difficulty": 2,
  "dimensions": { "width": 540, "height": 960 },
  "tilt": { "x": 0, "y": 0.8 },
  "assets": {
    "background": "tables/classic/bg.webp",
    "spritesheet": "tables/classic/sprites.json",
    "music": "audio/music/classic_theme.webm",
    "ambience": "audio/sfx/arcade_ambience.webm"
  },
  "layers": [
    { "type": "image", "key": "playfield", "z": 0 },
    { "type": "image", "key": "ramps_under", "z": 5 },
    { "type": "image", "key": "ramps_over", "z": 15 }
  ],
  "walls": [
    { "vertices": [[0,0], [0,960], [20,960], [20,0]], "restitution": 0.4 }
  ],
  "flippers": [
    { "side": "left", "position": [150, 880], "length": 90 },
    { "side": "right", "position": [390, 880], "length": 90 }
  ],
  "bumpers": [
    { "position": [270, 200], "radius": 30, "score": 100 },
    { "position": [200, 280], "radius": 30, "score": 100 },
    { "position": [340, 280], "radius": 30, "score": 100 }
  ],
  "targets": [],
  "ramps": [],
  "launchers": [
    { "position": [510, 900], "power": 15, "angle": -90 }
  ],
  "drains": [
    { "position": [270, 970], "width": 200 }
  ],
  "scoring": {
    "bonusMultiplierMax": 10,
    "comboWindow": 2000,
    "missions": []
  }
}
```

### 4.2 Table Loader

```typescript
class TableLoader {
  async load(tableId: string): Promise<Table> {
    const definition = await fetch(`/assets/tables/${tableId}.json`).then(r => r.json());
    
    // Parallel asset loading
    await Promise.all([
      this.renderer.loadSpritesheet(definition.assets.spritesheet),
      this.renderer.loadImage(definition.assets.background),
      this.audio.loadTrack(definition.assets.music),
      this.audio.loadTrack(definition.assets.ambience),
    ]);
    
    return new Table(definition);
  }
}
```

---

## Phase 5: Audio System

### 5.1 Sound Categories

| Category | Examples | Behaviour |
|----------|----------|-----------|
| **SFX** | Flipper click, bumper pop, target hit | Immediate, overlapping allowed |
| **Music** | Background track | Looped, crossfade between tables |
| **Ambience** | Arcade noise, crowd | Looped, low volume |
| **Voice** | "Multiball!", "Jackpot!" | Queue, no overlap |

### 5.2 Audio Manager

```typescript
class AudioSystem {
  private sfxPool: Map<string, Howl[]>;
  private music: Howl | null;
  
  playSFX(key: string, volume = 1, pan = 0) {
    const sound = this.getPooledSound(key);
    sound.volume(volume * this.masterVolume * this.sfxVolume);
    sound.stereo(pan);  // -1 left, +1 right
    sound.play();
  }
  
  playMusic(key: string, crossfadeDuration = 1000) {
    const newTrack = new Howl({ src: [this.tracks[key]], loop: true });
    if (this.music) {
      this.music.fade(this.musicVolume, 0, crossfadeDuration);
      setTimeout(() => this.music?.unload(), crossfadeDuration);
    }
    newTrack.fade(0, this.musicVolume, crossfadeDuration);
    newTrack.play();
    this.music = newTrack;
  }
}
```

### 5.3 Dynamic Audio

- **Pitch variation:** ±5% random on repeated sounds
- **Positional audio:** Pan SFX based on X position
- **Intensity layers:** Add music stems as score/combo increases

---

## Phase 6: Rendering & Effects

### 6.1 Render Layers (Z-order)

| Z | Layer |
|---|-------|
| 0 | Background |
| 5 | Under-ramp elements |
| 10 | Ball (normal) |
| 12 | Flippers, bumpers, targets |
| 15 | Over-ramp elements |
| 18 | Ball (on ramp) |
| 20 | Glass reflections, particles |
| 25 | HUD |

### 6.2 Visual Effects

```typescript
class LightingSystem {
  // Per-frame glow pass
  private glowFilter: PIXI.BlurFilter;
  private bloomThreshold = 0.8;
  
  addGlow(sprite: PIXI.Sprite, intensity: number, color: number) {
    // Apply additive blend glow sprite behind element
  }
  
  flash(position: Vector2, color: number, duration: number) {
    // Radial gradient flash for bumper hits
  }
}

class ParticleSystem {
  private pools: Map<string, Particle[]>;
  
  emit(preset: 'sparks' | 'stars' | 'smoke', position: Vector2, config?: Partial<EmitterConfig>) {
    // Spawn particles from pool
  }
}
```

### 6.3 Performance Targets

| Metric | Target |
|--------|--------|
| Frame rate | 60fps constant |
| Draw calls | < 50 per frame |
| Texture memory | < 128MB |
| Physics bodies | < 200 active |

---

## Phase 7: Input System

### 7.1 Input Mapping

```typescript
const DEFAULT_BINDINGS = {
  flipperLeft:  ['KeyA', 'ArrowLeft', 'ShiftLeft', 'gamepad:LB'],
  flipperRight: ['KeyD', 'ArrowRight', 'ShiftRight', 'gamepad:RB'],
  launch:       ['Space', 'ArrowDown', 'gamepad:A'],
  pause:        ['Escape', 'KeyP', 'gamepad:Start'],
  tiltLeft:     ['KeyQ', 'gamepad:LT'],
  tiltRight:    ['KeyE', 'gamepad:RT'],
};
```

### 7.2 Touch Controls

```
┌─────────────────────────────────┐
│                                 │
│         [Game View]             │
│                                 │
├───────────────┬─────────────────┤
│   LEFT TAP    │    RIGHT TAP    │  ← Flipper zones
│   ZONE        │    ZONE         │
└───────────────┴─────────────────┘
        [SWIPE UP = Launch]
```

---

## Phase 8: Scoring & Progression

### 8.1 Score Events

```typescript
enum ScoreEvent {
  BUMPER_HIT = 100,
  TARGET_HIT = 500,
  TARGET_BANK_COMPLETE = 5000,
  RAMP_COMPLETE = 2500,
  SPINNER_TICK = 50,
  COMBO_BONUS = 1000,      // Per combo level
  MULTIBALL_JACKPOT = 25000,
  SKILL_SHOT = 10000,
}
```

### 8.2 Multiplier System

```typescript
class ScoreSystem {
  private baseMultiplier = 1;
  private comboMultiplier = 1;
  private comboTimer = 0;
  private comboWindow = 2000; // ms
  
  addScore(event: ScoreEvent, position?: Vector2) {
    const points = event * this.baseMultiplier * this.comboMultiplier;
    this.totalScore += points;
    
    // Reset combo timer
    this.comboTimer = this.comboWindow;
    this.comboMultiplier = Math.min(this.comboMultiplier + 0.5, 10);
    
    // Visual feedback
    this.ui.showFloatingScore(points, position);
  }
  
  update(deltaMs: number) {
    if (this.comboTimer > 0) {
      this.comboTimer -= deltaMs;
      if (this.comboTimer <= 0) {
        this.comboMultiplier = 1;
      }
    }
  }
}
```

---

## Phase 9: Multi-Platform Packaging

### 9.1 Build Targets

| Platform | Tool | Output |
|----------|------|--------|
| Web | Vite | Static files (Netlify/Vercel) |
| Desktop | Electron | .exe, .dmg, .AppImage |
| iOS | Capacitor | .ipa via Xcode |
| Android | Capacitor | .apk/.aab |
| PWA | Vite PWA plugin | Installable web app |

### 9.2 Platform-Specific Adjustments

```typescript
const platform = detectPlatform();

const config = {
  web: { 
    maxFPS: 60, 
    audioFormat: 'webm',
    touchControls: false 
  },
  mobile: { 
    maxFPS: 60, 
    audioFormat: 'mp3',
    touchControls: true,
    haptics: true 
  },
  desktop: { 
    maxFPS: 144, 
    audioFormat: 'ogg',
    touchControls: false 
  },
};
```

---

## Phase 10: Development Timeline

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1-2 | Foundation | Project setup, build pipeline, basic game loop |
| 3-4 | Core Physics | Ball, flippers, walls, collision system |
| 5-6 | Entities | Bumpers, targets, ramps, gates |
| 7-8 | First Table | Complete playable table with placeholder art |
| 9-10 | Audio | Full sound system, music integration |
| 11-12 | Polish | Particles, lighting, animations |
| 13-14 | UI | Menus, HUD, settings, high scores |
| 15-16 | Multi-platform | Capacitor/Electron builds, testing |
| 17-18 | Content | Additional tables, final art assets |
| 19-20 | QA | Performance optimization, bug fixes, release |

---

## Immediate Next Steps

1. **Initialize project** — Set up Vite + TypeScript + PixiJS + Matter.js
2. **Prototype physics** — Ball + flippers + basic walls
3. **Input handling** — Keyboard controls for flippers
4. **First playable** — Minimal table with scoring

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Engine** | PixiJS (rendering) + Matter.js (physics) |
| **Language** | TypeScript |
| **Build** | Vite + pnpm |
| **Audio** | Howler.js |
| **Testing** | Vitest |
| **Desktop** | Electron |
| **Mobile** | Capacitor |
