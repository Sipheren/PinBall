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

### Removed
- Old source code in `src/` directory (to be cleaned)
- Asset generator tools (using code-generated graphics instead)
- External API dependencies (Gemini, etc.)

### In Progress
- Phase 1: Foundation Setup
  - Clean existing src/ directory
  - Create fresh directory structure
  - Set up `src/utils/constants.ts`
  - Set up `src/utils/camera-utils.ts`
  - Configure TypeScript path aliases
  - Create `index.html` entry point

### Planned - Next Steps
- Phase 2: Core Engine (Physics, Renderer, Camera, Input, Game)
- Phase 3: Basic Entities (Table, Ball, Flippers, Bumpers)
- Phase 4: Graphics Enhancement (gradients, filters, effects)
- Phase 5: Multi-Level System (table loading, progress saving)
- Phase 6: UI & Polish (HUD, level select, scoring, particles)

---

## Project Reference

- **GitHub**: https://github.com/Sipheren/PinBall
- **Tech Stack**: TypeScript + PixiJS + Matter.js + Vite + Howler.js
- **Platforms**: Web, Desktop (Electron), Mobile (Capacitor)
