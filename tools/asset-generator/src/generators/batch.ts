// tools/asset-generator/src/generators/batch.ts
import { GeminiAssetGenerator } from '../gemini-client.js';
import { PROMPT_TEMPLATES, THEME_PRESETS } from '../prompts/templates.js';
import * as path from 'path';

interface BatchConfig {
  theme: keyof typeof THEME_PRESETS;
  outputDir: string;
  model?: 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';
}

export class BatchAssetGenerator {
  private generator: GeminiAssetGenerator;
  private config: BatchConfig;

  constructor(apiKey: string, config: BatchConfig) {
    this.generator = new GeminiAssetGenerator(apiKey, config.model);
    this.config = config;
  }

  async generateFullAssetSet(): Promise<void> {
    const theme = THEME_PRESETS[this.config.theme];
    const baseDir = this.config.outputDir;

    console.log(`\n🎨 Generating ${this.config.theme} theme assets...`);
    console.log(`   Model: ${this.config.model || 'gemini-2.5-flash-image'}`);
    console.log(`   Output: ${baseDir}\n`);

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
    let completed = 0;

    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tasks.length / batchSize)}`);

      await Promise.all(
        batch.map(async (fn) => {
          try {
            await fn();
            completed++;
          } catch (error) {
            console.error(`✗ Task failed: ${error}`);
          }
        })
      );

      // Rate limit delay
      if (i + batchSize < tasks.length) {
        console.log(`\n⏳ Progress: ${completed}/${tasks.length} - Waiting for rate limit...`);
        await this.delay(2000);
      }
    }

    console.log(`\n✅ Asset generation complete! Generated ${completed}/${tasks.length} assets.\n`);
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
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
