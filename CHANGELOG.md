# Changelog

All notable changes and progress for the PinBall game project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Changed - 2026-01-18
**FRESH START - Scrapping existing codebase**

Starting over with a cleaner, more focused approach based on the updated development plan in `docs/plan.md`.

**New Architecture:**
- **Tech Stack:** TypeScript + PixiJS v8 (WebGL) + Matter.js + Vite + pnpm
- **Core Features:**
  - Dynamic camera system that smoothly follows the ball with zoom/pan
  - High-resolution code-generated graphics (no external assets)
  - Multi-table progression with score-based unlocking
- **Viewport:** 540×960 (what user sees)
- **World:** 1620×2880 (full playfield - 3x viewport for camera following)
- **Physics:** 120Hz fixed timestep

**New 6-Phase Plan:**
1. **Phase 1: Foundation Setup** - Clean slate, constants, utilities, TypeScript config
2. **Phase 2: Core Engine** - Physics, Renderer, Camera, Input, Game loop
3. **Phase 3: Basic Entities** - Table, Ball, Flippers, Bumpers
4. **Phase 4: Graphics Enhancement** - Code-generated graphics with gradients, glow effects
5. **Phase 5: Multi-Level System** - Table definitions, progress manager, level loading
6. **Phase 6: UI & Polish** - HUD, level select, scoring, particles

### Added - 2026-01-18
**Phase 1: Foundation Setup ✅ COMPLETE**

- Cleaned existing `src/` directory for fresh start
- Created fresh directory structure:
  - `src/core/` - Core engine systems
  - `src/entities/` - Game entities (Ball, Flippers, etc.)
  - `src/systems/` - Game systems (Collision, Score, etc.)
  - `src/levels/` - Level definitions and management
  - `src/effects/` - Visual effects and post-processing
  - `src/ui/` - User interface components
  - `src/utils/` - Utility functions and constants
- Set up `src/utils/constants.ts` with all game constants:
  - Viewport (540×960) and World (1620×2880) dimensions
  - Camera settings (follow speed, look-ahead, zoom bounds)
  - Physics configuration (120Hz fixed timestep)
  - Ball properties (radius, restitution, friction, max velocity)
  - Flipper settings (length, width, angles, angular velocity)
  - Collision categories for Matter.js
  - Scoring constants
  - Theme colors
- Set up `src/utils/camera-utils.ts` with helper functions:
  - `lerp()` - Linear interpolation
  - `clamp()` - Value clamping
  - `smoothStep()` - Smooth interpolation
  - `worldToScreen()` - Coordinate conversion
  - `screenToWorld()` - Coordinate conversion
- Updated `index.html` with simplified structure
- Created placeholder `src/main.ts` entry point
- Verified `tsconfig.json` path aliases configuration

### Removed
- Old source code in `src/` directory
- Asset generator tools (using code-generated graphics instead)
- External API dependencies (Gemini, etc.)

### Completed - Phase 1 ✅
- ✅ Clean existing src/ directory
- ✅ Create fresh directory structure
- ✅ Set up `src/utils/constants.ts`
- ✅ Set up `src/utils/camera-utils.ts`
- ✅ Configure TypeScript path aliases
- ✅ Create `index.html` entry point

### In Progress - Phase 2 🔄
- Core Engine Implementation:
  - Create `src/core/Physics.ts` - Matter.js wrapper
  - Create `src/core/Renderer.ts` - PixiJS setup with layer management
  - Create `src/core/Camera.ts` - Dynamic following camera
  - Create `src/core/InputManager.ts` - Keyboard/touch/gamepad input
  - Create `src/core/Game.ts` - Main game loop
  - Update `src/main.ts` to initialize game

### Planned - Next Steps
- Phase 3: Basic Entities (Table, Ball, Flippers, Bumpers)
- Phase 4: Graphics Enhancement (gradients, filters, effects)
- Phase 5: Multi-Level System (table loading, progress saving)
- Phase 6: UI & Polish (HUD, level select, scoring, particles)

---

## Project Reference

- **GitHub**: https://github.com/Sipheren/PinBall
- **Tech Stack**: TypeScript + PixiJS + Matter.js + Vite + Howler.js
- **Platforms**: Web, Desktop (Electron), Mobile (Capacitor)
