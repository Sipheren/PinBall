# Changelog

All notable changes and progress for the PinBall game project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Initial project structure with documentation
- `docs/plan.md` - Comprehensive development plan covering 10 phases:
  - Phase 1: Project Foundation
  - Phase 2: Core Engine (PixiJS + Matter.js)
  - Phase 3: Entity Implementation (Ball, Flippers, Bumpers, Targets, Ramps, etc.)
  - Phase 4: Table Definition System (JSON-based)
  - Phase 5: Audio System (Howler.js with SFX/Music/Ambience)
  - Phase 6: Rendering & Effects (Z-layers, glow, particles)
  - Phase 7: Input System (Keyboard, gamepad, touch)
  - Phase 8: Scoring & Progression (multipliers, combos)
  - Phase 9: Multi-Platform Packaging (Web, Electron, Capacitor)
  - Phase 10: Development Timeline (20-week roadmap)
- Git repository initialized with GitHub remote

### Added - Asset Generation System
- **Gemini API Integration** - Automated texture and graphic generation using Imagen 3
- `scripts/assets/generate-assets.ts` - TypeScript script for asset generation
- `scripts/assets/asset-manifest.json` - Complete asset manifest with prompts for:
  - **Tables**: Backgrounds, walls, playfield surfaces for "classic_arcade" table
  - **Entities**: Ball, flippers, bumpers, targets, ramps, spinners, gates, slingshots
  - **UI**: HUD elements, score displays, menus, buttons, table cards
  - **Effects**: Particles (sparks, glow, trails, explosions), lighting (lens flare, bloom)
- `scripts/assets/README.md` - Comprehensive documentation for the asset system
- `package.json` - Project configuration with all dependencies
- `tsconfig.json` - TypeScript configuration with path aliases
- `.env.example` - Environment variable template for API keys
- **npm scripts**: `assets:generate`, `assets:generate:category`

### Planned
- Project initialization (Vite + TypeScript + PixiJS + Matter.js)
- Set up Gemini API key and generate initial asset set
- Physics prototype (ball + flippers + basic walls)
- Input handling (keyboard controls)
- First playable table

---

## Project Reference

- **GitHub**: https://github.com/Sipheren/PinBall
- **Tech Stack**: TypeScript + PixiJS + Matter.js + Vite + Howler.js
- **Platforms**: Web, Desktop (Electron), Mobile (Capacitor)
