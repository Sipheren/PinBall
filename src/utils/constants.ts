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
  FOLLOW_SPEED: 0.08, // Lerp factor (lower = smoother)
  LOOK_AHEAD: 0.5, // Velocity anticipation
  MIN_ZOOM: 0.6, // Can zoom out
  MAX_ZOOM: 1.2, // Can zoom in
  DEFAULT_ZOOM: 1.0,
  BOUNDS_PADDING: 50,
};

// Physics
export const PHYSICS = {
  GRAVITY: { x: 0, y: 0.8 },
  STEP: 1000 / 120, // 120Hz physics
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
