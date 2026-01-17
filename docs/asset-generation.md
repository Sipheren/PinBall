# Pinball Asset Generation System — Gemini API

---

## Overview

Automated texture and graphics generation pipeline using Google Gemini API for consistent, high-quality game assets.

---

## Recommended Model

| Model | Use Case | Notes |
|-------|----------|-------|
| **Imagen 3** | Primary image generation | Highest quality, best for game assets |
| **Gemini 2.0 Flash** | Image generation + editing | Fast, supports conversational refinement |

---

## Asset Categories

| Category | Examples | Resolution | Format |
|----------|----------|------------|--------|
| **Backgrounds** | Playfield base, starfields | 1080x1920 | WebP/PNG |
| **Sprites** | Ball, flippers, bumpers | 64-256px | PNG (transparent) |
| **UI Elements** | Buttons, panels, icons | Various | PNG (transparent) |
| **Effects** | Particles, glow textures | 32-128px | PNG (transparent) |
| **Decorations** | Rails, lights, decals | Various | PNG (transparent) |

---

## Project Structure

```
pinball/
├── tools/
│   └── asset-generator/
│       ├── src/
│       │   ├── index.ts           # CLI entry point
│       │   ├── gemini-client.ts   # API wrapper
│       │   ├── generators/
│       │   │   ├── backgrounds.ts
│       │   │   ├── sprites.ts
│       │   │   ├── ui.ts
│       │   │   └── effects.ts
│       │   ├── prompts/
│       │   │   ├── style-guide.ts # Base style definitions
│       │   │   └── templates.ts   # Asset-specific prompts
│       │   ├── processors/
│       │   │   ├── resize.ts      # Image scaling
│       │   │   ├── spritesheet.ts # Atlas packing
│       │   │   └── optimize.ts    # Compression
│       │   └── config.ts
│       ├── output/
│       │   ├── raw/               # Direct API output
│       │   ├── processed/         # Post-processed assets
│       │   └── spritesheets/      # Packed atlases
│       ├── package.json
│       └── .env                   # API key (gitignored)
```

---

## Implementation

### 1. Gemini Client

```typescript
// tools/asset-generator/src/gemini-client.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs/promises';
import * as path from 'path';

interface GenerationConfig {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  style?: string;
  outputPath: string;
}

export class GeminiAssetGenerator {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use Imagen 3 for highest quality
    this.model = this.genAI.getGenerativeModel({ 
      model: 'imagen-3.0-generate-002' 
    });
  }

  async generateImage(config: GenerationConfig): Promise<string> {
    const { prompt, negativePrompt, width, height, outputPath } = config;

    const fullPrompt = this.buildPrompt(prompt, config.style);

    try {
      const result = await this.model.generateImages({
        prompt: fullPrompt,
        negativePrompt: negativePrompt || this.defaultNegativePrompt,
        numberOfImages: 1,
        aspectRatio: this.getAspectRatio(width, height),
        safetyFilterLevel: 'BLOCK_ONLY_HIGH',
      });

      // Save the generated image
      const imageData = result.images[0];
      const buffer = Buffer.from(imageData.bytesBase64Encoded, 'base64');
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, buffer);

      console.log(`Generated: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error(`Generation failed: ${error}`);
      throw error;
    }
  }

  async generateWithGeminiFlash(config: GenerationConfig): Promise<string> {
    // Alternative using Gemini 2.0 Flash for image generation
    const flashModel = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp-image-generation'
    });

    const result = await flashModel.generateContent({
      contents: [{ 
        role: 'user', 
        parts: [{ text: this.buildPrompt(config.prompt, config.style) }]
      }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      },
    });

    // Extract and save image from response
    for (const part of result.response.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        await fs.writeFile(config.outputPath, buffer);
        return config.outputPath;
      }
    }

    throw new Error('No image in response');
  }

  private buildPrompt(basePrompt: string, style?: string): string {
    const styleGuide = style || PINBALL_STYLE_GUIDE;
    return `${styleGuide}\n\n${basePrompt}`;
  }

  private getAspectRatio(width: number, height: number): string {
    const ratio = width / height;
    if (ratio === 1) return '1:1';
    if (ratio > 1.7) return '16:9';
    if (ratio < 0.6) return '9:16';
    if (ratio > 1.3) return '4:3';
    if (ratio < 0.8) return '3:4';
    return '1:1';
  }

  private defaultNegativePrompt = 
    'blurry, low quality, distorted, text, watermark, signature, ' +
    'photorealistic, 3D render, photograph, realistic lighting';
}

// Style guide constant
const PINBALL_STYLE_GUIDE = `
Style: Vibrant arcade pinball machine aesthetic
Art direction: Bold colors, high contrast, neon glow effects
Rendering: Clean vector-style with subtle gradients
Perspective: Top-down for playfield elements, slight 3D depth
Color palette: Deep blues, electric purples, hot pinks, neon greens, chrome silver
Lighting: Dramatic rim lighting, glowing elements, reflective surfaces
Quality: Sharp edges, game-ready, suitable for 2D game sprites
Background: Transparent where appropriate for sprites
`;
```

### 2. Prompt Templates

```typescript
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
```

### 3. Batch Generator

```typescript
// tools/asset-generator/src/generators/batch.ts
import { GeminiAssetGenerator } from '../gemini-client';
import { PROMPT_TEMPLATES, THEME_PRESETS } from '../prompts/templates';
import * as path from 'path';

interface BatchConfig {
  theme: keyof typeof THEME_PRESETS;
  outputDir: string;
}

export class BatchAssetGenerator {
  private generator: GeminiAssetGenerator;
  private config: BatchConfig;

  constructor(apiKey: string, config: BatchConfig) {
    this.generator = new GeminiAssetGenerator(apiKey);
    this.config = config;
  }

  async generateFullAssetSet(): Promise<void> {
    const theme = THEME_PRESETS[this.config.theme];
    const baseDir = this.config.outputDir;

    console.log(`Generating ${this.config.theme} theme assets...`);

    // Generate in parallel batches to respect rate limits
    const tasks = [
      // Backgrounds
      this.generateBackground(theme),
      
      // Core sprites
      ...this.generateCoreSprites(theme),
      
      // UI elements
      ...this.generateUI(theme),
      
      // Effects
      ...this.generateEffects(theme),
    ];

    // Process in batches of 5 to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      await Promise.all(batch.map(fn => fn()));
      
      // Rate limit delay
      if (i + batchSize < tasks.length) {
        console.log('Waiting for rate limit...');
        await this.delay(2000);
      }
    }

    console.log('Asset generation complete!');
  }

  private async generateBackground(theme: any): Promise<() => Promise<void>> {
    return async () => {
      await this.generator.generateImage({
        prompt: PROMPT_TEMPLATES.playfield(theme.mood),
        width: 1080,
        height: 1920,
        outputPath: path.join(this.config.outputDir, 'backgrounds', 'playfield.png'),
      });
    };
  }

  private generateCoreSprites(theme: any): Array<() => Promise<void>> {
    return [
      // Ball variants
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.ball('chrome steel'),
          width: 64,
          height: 64,
          outputPath: path.join(this.config.outputDir, 'sprites', 'ball_chrome.png'),
        });
      },
      
      // Flippers
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.flipper('left', theme.mood),
          width: 128,
          height: 48,
          outputPath: path.join(this.config.outputDir, 'sprites', 'flipper_left.png'),
        });
      },
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.flipper('right', theme.mood),
          width: 128,
          height: 48,
          outputPath: path.join(this.config.outputDir, 'sprites', 'flipper_right.png'),
        });
      },
      
      // Bumpers
      ...theme.colors.slice(0, 3).map((color: string, i: number) => {
        return async () => {
          await this.generator.generateImage({
            prompt: PROMPT_TEMPLATES.bumper('pop', color),
            width: 96,
            height: 96,
            outputPath: path.join(this.config.outputDir, 'sprites', `bumper_${i + 1}.png`),
          });
        };
      }),
      
      // Targets
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.target('drop'),
          width: 48,
          height: 64,
          outputPath: path.join(this.config.outputDir, 'sprites', 'target_drop.png'),
        });
      },
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.target('standup'),
          width: 48,
          height: 64,
          outputPath: path.join(this.config.outputDir, 'sprites', 'target_standup.png'),
        });
      },
    ];
  }

  private generateUI(theme: any): Array<() => Promise<void>> {
    return [
      // Buttons
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.button('normal', 'PLAY'),
          width: 256,
          height: 64,
          outputPath: path.join(this.config.outputDir, 'ui', 'btn_play_normal.png'),
        });
      },
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.button('hover', 'PLAY'),
          width: 256,
          height: 64,
          outputPath: path.join(this.config.outputDir, 'ui', 'btn_play_hover.png'),
        });
      },
      
      // Score display
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.scoreDisplay(8),
          width: 384,
          height: 80,
          outputPath: path.join(this.config.outputDir, 'ui', 'score_display.png'),
        });
      },
    ];
  }

  private generateEffects(theme: any): Array<() => Promise<void>> {
    return [
      // Particles
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.particle('spark'),
          width: 32,
          height: 32,
          outputPath: path.join(this.config.outputDir, 'effects', 'particle_spark.png'),
        });
      },
      async () => {
        await this.generator.generateImage({
          prompt: PROMPT_TEMPLATES.particle('star'),
          width: 32,
          height: 32,
          outputPath: path.join(this.config.outputDir, 'effects', 'particle_star.png'),
        });
      },
      
      // Light glows
      ...theme.colors.map((color: string, i: number) => {
        return async () => {
          await this.generator.generateImage({
            prompt: PROMPT_TEMPLATES.lightGlow(color),
            width: 128,
            height: 128,
            outputPath: path.join(this.config.outputDir, 'effects', `glow_${i + 1}.png`),
          });
        };
      }),
    ];
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 4. CLI Tool

```typescript
// tools/asset-generator/src/index.ts
import { Command } from 'commander';
import { BatchAssetGenerator } from './generators/batch';
import { GeminiAssetGenerator } from './gemini-client';
import { PROMPT_TEMPLATES, THEME_PRESETS } from './prompts/templates';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const program = new Command();

program
  .name('pinball-assets')
  .description('Generate pinball game assets using Gemini API')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate a full asset set for a theme')
  .option('-t, --theme <theme>', 'Theme preset', 'classic')
  .option('-o, --output <dir>', 'Output directory', './output')
  .action(async (options) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Error: GEMINI_API_KEY not set in environment');
      process.exit(1);
    }

    const validThemes = Object.keys(THEME_PRESETS);
    if (!validThemes.includes(options.theme)) {
      console.error(`Invalid theme. Choose from: ${validThemes.join(', ')}`);
      process.exit(1);
    }

    const generator = new BatchAssetGenerator(apiKey, {
      theme: options.theme as keyof typeof THEME_PRESETS,
      outputDir: path.resolve(options.output),
    });

    await generator.generateFullAssetSet();
  });

program
  .command('single')
  .description('Generate a single asset')
  .requiredOption('-p, --prompt <prompt>', 'Generation prompt')
  .option('-w, --width <width>', 'Image width', '256')
  .option('-h, --height <height>', 'Image height', '256')
  .option('-o, --output <file>', 'Output file path', './output/custom.png')
  .action(async (options) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Error: GEMINI_API_KEY not set in environment');
      process.exit(1);
    }

    const generator = new GeminiAssetGenerator(apiKey);
    await generator.generateImage({
      prompt: options.prompt,
      width: parseInt(options.width),
      height: parseInt(options.height),
      outputPath: path.resolve(options.output),
    });
  });

program
  .command('list-themes')
  .description('List available theme presets')
  .action(() => {
    console.log('\nAvailable themes:\n');
    for (const [name, theme] of Object.entries(THEME_PRESETS)) {
      console.log(`  ${name}`);
      console.log(`    Mood: ${theme.mood}`);
      console.log(`    Colors: ${theme.colors.join(', ')}`);
      console.log(`    Accents: ${theme.accents}\n`);
    }
  });

program.parse();
```

### 5. Package Configuration

```json
// tools/asset-generator/package.json
{
  "name": "pinball-asset-generator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "generate": "tsx src/index.ts generate",
    "single": "tsx src/index.ts single",
    "themes": "tsx src/index.ts list-themes",
    "build": "tsc"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "commander": "^12.0.0",
    "dotenv": "^16.4.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0"
  }
}
```

---

## Usage

### Setup

```bash
cd tools/asset-generator
pnpm install

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

### Generate Full Theme

```bash
# Generate classic theme assets
pnpm generate -- -t classic -o ./output/classic

# Generate space theme assets
pnpm generate -- -t space -o ./output/space
```

### Generate Single Asset

```bash
# Custom bumper
pnpm single -- -p "Neon pink mushroom bumper, glowing, top-down view" -w 96 -h 96 -o ./output/custom_bumper.png

# Custom background
pnpm single -- -p "Underwater coral reef pinball playfield, bioluminescent" -w 1080 -h 1920 -o ./output/underwater_bg.png
```

### List Available Themes

```bash
pnpm themes
```

---

## Post-Processing Pipeline

### Image Processor

```typescript
// tools/asset-generator/src/processors/process.ts
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

export class ImageProcessor {
  
  // Resize to exact dimensions
  async resize(input: string, output: string, width: number, height: number): Promise<void> {
    await sharp(input)
      .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(output);
  }

  // Remove background (make transparent)
  async removeBackground(input: string, output: string, threshold = 10): Promise<void> {
    const image = sharp(input);
    const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });

    // Simple background removal based on corner color
    const bgColor = { r: data[0], g: data[1], b: data[2] };

    for (let i = 0; i < data.length; i += 4) {
      const diff = Math.abs(data[i] - bgColor.r) + 
                   Math.abs(data[i + 1] - bgColor.g) + 
                   Math.abs(data[i + 2] - bgColor.b);
      if (diff < threshold) {
        data[i + 3] = 0; // Set alpha to 0
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(output);
  }

  // Optimize for web
  async optimize(input: string, output: string, quality = 80): Promise<void> {
    await sharp(input)
      .webp({ quality })
      .toFile(output.replace(/\.[^.]+$/, '.webp'));
  }

  // Create spritesheet from multiple images
  async createSpritesheet(
    inputs: string[], 
    output: string, 
    columns: number
  ): Promise<{ path: string; json: object }> {
    const images = await Promise.all(inputs.map(f => sharp(f).metadata()));
    const maxWidth = Math.max(...images.map(i => i.width || 0));
    const maxHeight = Math.max(...images.map(i => i.height || 0));
    
    const rows = Math.ceil(inputs.length / columns);
    const sheetWidth = maxWidth * columns;
    const sheetHeight = maxHeight * rows;

    const composites = inputs.map((file, i) => ({
      input: file,
      left: (i % columns) * maxWidth,
      top: Math.floor(i / columns) * maxHeight,
    }));

    await sharp({
      create: {
        width: sheetWidth,
        height: sheetHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(composites)
      .png()
      .toFile(output);

    // Generate JSON metadata for the spritesheet
    const frames: Record<string, object> = {};
    inputs.forEach((file, i) => {
      const name = path.basename(file, path.extname(file));
      frames[name] = {
        frame: {
          x: (i % columns) * maxWidth,
          y: Math.floor(i / columns) * maxHeight,
          w: maxWidth,
          h: maxHeight,
        },
      };
    });

    const jsonPath = output.replace(/\.[^.]+$/, '.json');
    const metadata = {
      frames,
      meta: {
        image: path.basename(output),
        size: { w: sheetWidth, h: sheetHeight },
        scale: 1,
      },
    };

    await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2));

    return { path: output, json: metadata };
  }
}
```

---

## Asset Manifest

Generated assets are tracked in a manifest file:

```json
// output/manifest.json
{
  "theme": "classic",
  "generated": "2025-01-17T10:30:00Z",
  "assets": {
    "backgrounds": [
      { "name": "playfield", "path": "backgrounds/playfield.png", "size": [1080, 1920] }
    ],
    "sprites": [
      { "name": "ball_chrome", "path": "sprites/ball_chrome.png", "size": [64, 64] },
      { "name": "flipper_left", "path": "sprites/flipper_left.png", "size": [128, 48] },
      { "name": "flipper_right", "path": "sprites/flipper_right.png", "size": [128, 48] },
      { "name": "bumper_1", "path": "sprites/bumper_1.png", "size": [96, 96] },
      { "name": "bumper_2", "path": "sprites/bumper_2.png", "size": [96, 96] },
      { "name": "bumper_3", "path": "sprites/bumper_3.png", "size": [96, 96] }
    ],
    "spritesheets": [
      { "name": "sprites", "path": "spritesheets/sprites.png", "json": "spritesheets/sprites.json" }
    ],
    "ui": [
      { "name": "btn_play", "path": "ui/btn_play_normal.png", "size": [256, 64] }
    ],
    "effects": [
      { "name": "particle_spark", "path": "effects/particle_spark.png", "size": [32, 32] }
    ]
  }
}
```

---

## Rate Limits & Cost Estimation

| Model | Rate Limit | Cost (approx) |
|-------|------------|---------------|
| Imagen 3 | 10 req/min | ~$0.02/image |
| Gemini 2.0 Flash | 15 req/min | ~$0.01/image |

**Full theme generation (~30 assets):** ~$0.50-0.60

---

## Integration with Main Project

Copy generated assets to the main project:

```bash
# After generation
cp -r tools/asset-generator/output/classic/* public/assets/images/tables/classic/
```

Or automate in package.json:

```json
{
  "scripts": {
    "assets:generate": "cd tools/asset-generator && pnpm generate -- -t classic -o ../../public/assets/images/tables/classic"
  }
}
```
