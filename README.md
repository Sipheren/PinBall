# 🎮 Pinball Game

A cross-platform pinball game built with **TypeScript**, **PixiJS**, and **Matter.js**.

## ✨ Features

- **Code-generated graphics** - All assets are drawn programmatically using PixiJS Graphics API
- **Realistic physics** - Powered by Matter.js with continuous collision detection
- **Smooth gameplay** - 60fps rendering with 120Hz physics
- **Responsive controls** - Keyboard, touch, and gamepad support

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open http://localhost:3000 in your browser.

## 🎮 Controls

### Keyboard
- **A / ←** : Left flipper
- **D / →** : Right flipper
- **Space**: Launch ball
- **P / Escape**: Pause

### Touch
- **Left half of screen**: Left flipper
- **Right half of screen**: Right flipper
- **Swipe up**: Launch ball

### Gamepad
- **LB / RB**: Flippers
- **A**: Launch
- **Start**: Pause

## 🛠️ Tech Stack

- **Renderer**: PixiJS v8 (WebGL)
- **Physics**: Matter.js
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── core/           # Game engine (Game, Physics, Renderer, Input)
├── entities/       # Game objects (Ball, Flipper, Bumper, Table)
├── systems/        # Game systems (collision, scoring, audio)
├── ui/            # User interface
├── utils/         # Constants and helpers
└── main.ts        # Entry point
```

## 🎨 Graphics System

All graphics are generated programmatically using the `GraphicsFactory` class:

```typescript
// Create a ball
const ball = GraphicsFactory.createBall();

// Create a bumper
const bumper = GraphicsFactory.createBumper('red', lit=true);

// Create a flipper
const flipper = GraphicsFactory.createFlipper('left');
```

Benefits:
- ✅ Infinite scalability
- ✅ No asset files to manage
- ✅ Easy theming and customization
- ✅ Smaller bundle size

## 🔧 Development

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## 📊 Performance

- **Target FPS**: 60
- **Physics Rate**: 120Hz (fixed timestep)
- **Draw Calls**: < 50 per frame
- **Physics Bodies**: < 200 active

## 🎯 Roadmap

- [x] Basic game engine
- [x] Ball physics
- [x] Flippers
- [x] Bumpers
- [x] Code-generated graphics
- [ ] Targets and drop targets
- [ ] Spinners
- [ ] Ramps
- [ ] Multi-ball
- [ ] Scoring system
- [ ] Sound effects and music
- [ ] Multiple tables
- [ ] High scores
- [ ] Mobile touch controls optimization
- [ ] Desktop (Electron) build
- [ ] Mobile (Capacitor) build

## 📝 License

MIT

## 👤 Author

Sipheren
