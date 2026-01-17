// tools/asset-generator/src/prompts/templates.ts

export const PROMPT_TEMPLATES = {
  // Backgrounds
  playfield: (theme: string) => `
    Pinball machine playfield background, ${theme} theme.
    Top-down view, detailed surface texture with subtle wear marks.
    Dark base color with vibrant accent areas.
    Space for game elements (bumpers, ramps, targets).
    Resolution: 1080x1920 pixels, portrait orientation.
  `,

  // Sprites
  ball: (material: string) => `
    Single pinball, ${material} material.
    Perfectly spherical, highly reflective surface.
    Dramatic lighting showing glossy highlights.
    Isolated on transparent background.
    Size: 64x64 pixels, centered.
  `,

  flipper: (side: 'left' | 'right', style: string) => `
    Pinball flipper, ${side} orientation, ${style} style.
    Elongated paddle shape with rounded end.
    Metallic chrome finish with colored accent stripe.
    Slight 3D depth, top-down perspective.
    Transparent background, size: 128x48 pixels.
  `,

  bumper: (type: 'pop' | 'mushroom' | 'jet', color: string) => `
    Pinball ${type} bumper, ${color} color scheme.
    Circular design with concentric rings.
    Glowing center, chrome rim, rubberized ring.
    Top-down view, transparent background.
    Size: 96x96 pixels.
  `,

  target: (type: 'drop' | 'standup' | 'bullseye') => `
    Pinball ${type} target.
    Rectangular shape with lit indicator.
    Metallic frame, colored face plate.
    Top-down perspective, transparent background.
    Size: 48x64 pixels.
  `,

  // UI Elements
  button: (state: 'normal' | 'hover' | 'pressed', text: string) => `
    Arcade game UI button, ${state} state.
    Rounded rectangle, chrome bezel.
    Gradient fill with ${state === 'pressed' ? 'darker' : 'bright'} colors.
    Space for text: "${text}".
    Transparent background, size: 256x64 pixels.
  `,

  scoreDisplay: (digits: number) => `
    Retro LED score display panel.
    ${digits}-digit seven-segment display style.
    Dark background, glowing amber/green digits.
    Chrome frame border.
    Size: ${digits * 48}x80 pixels.
  `,

  // Effects
  particle: (type: 'spark' | 'star' | 'ring') => `
    Single ${type} particle effect sprite.
    Bright glowing center, soft falloff edges.
    Additive blend compatible (bright on black or transparent).
    Size: 32x32 pixels.
  `,

  lightGlow: (color: string) => `
    Circular light glow effect, ${color} color.
    Radial gradient from bright center to transparent edge.
    Soft, diffused appearance.
    Size: 128x128 pixels, transparent background.
  `,

  // Decorations
  ramp: (style: string) => `
    Pinball ramp piece, ${style} style.
    Transparent plastic appearance with chrome rails.
    Slight curve, top-down perspective.
    Transparent background, size: 256x512 pixels.
  `,

  rail: (length: 'short' | 'medium' | 'long') => `
    Chrome guide rail for pinball.
    Metallic finish, subtle reflections.
    ${length} length, curved or straight.
    Top-down view, transparent background.
  `,
};

export const THEME_PRESETS = {
  classic: {
    colors: ['red', 'blue', 'yellow', 'chrome'],
    mood: 'vintage 1980s arcade',
    accents: 'neon lights, starbursts',
  },
  space: {
    colors: ['deep purple', 'electric blue', 'star white', 'nebula pink'],
    mood: 'cosmic sci-fi adventure',
    accents: 'stars, planets, laser beams',
  },
  horror: {
    colors: ['blood red', 'midnight black', 'ghostly green', 'bone white'],
    mood: 'spooky haunted carnival',
    accents: 'skulls, bats, cobwebs',
  },
  racing: {
    colors: ['racing red', 'checkered black/white', 'chrome', 'tire black'],
    mood: 'high-speed motorsport',
    accents: 'flames, speedlines, trophies',
  },
  underwater: {
    colors: ['ocean blue', 'coral pink', 'seafoam green', 'sandy gold'],
    mood: 'deep sea treasure hunt',
    accents: 'bubbles, fish, treasure chests',
  },
};
