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

### Removed
- Gemini API asset generation system (due to API limitations)
- `scripts/assets/` directory and generation scripts
- Asset generation npm scripts and dependencies

### Planned
- Project initialization (Vite + TypeScript + PixiJS + Matter.js)
- Physics prototype (ball + flippers + basic walls)
- Input handling (keyboard controls)
- First playable table

---

## Project Reference

- **GitHub**: https://github.com/Sipheren/PinBall
- **Tech Stack**: TypeScript + PixiJS + Matter.js + Vite + Howler.js
- **Platforms**: Web, Desktop (Electron), Mobile (Capacitor)
