// tools/asset-generator/src/index.ts
import { Command } from 'commander';
import { BatchAssetGenerator } from './generators/batch.js';
import { GeminiAssetGenerator } from './gemini-client.js';
import { PROMPT_TEMPLATES, THEME_PRESETS } from './prompts/templates.js';
import * as dotenv from 'dotenv';

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
  .option('-m, --model <model>', 'AI model to use', 'gemini-2.5-flash-image')
  .action(async (options) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: GEMINI_API_KEY not set in environment');
      console.log('\nCreate a .env file with:');
      console.log('  GEMINI_API_KEY=your_api_key_here\n');
      process.exit(1);
    }

    const validThemes = Object.keys(THEME_PRESETS);
    if (!validThemes.includes(options.theme)) {
      console.error(`❌ Invalid theme. Choose from: ${validThemes.join(', ')}`);
      process.exit(1);
    }

    const validModels = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview'];
    if (!validModels.includes(options.model)) {
      console.error(`❌ Invalid model. Choose from: ${validModels.join(', ')}`);
      process.exit(1);
    }

    const generator = new BatchAssetGenerator(apiKey, {
      theme: options.theme as keyof typeof THEME_PRESETS,
      outputDir: options.output,
      model: options.model as any,
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
  .option('-m, --model <model>', 'AI model to use', 'gemini-2.5-flash-image')
  .action(async (options) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ Error: GEMINI_API_KEY not set in environment');
      console.log('\nCreate a .env file with:');
      console.log('  GEMINI_API_KEY=your_api_key_here\n');
      process.exit(1);
    }

    const validModels = ['gemini-2.5-flash-image', 'gemini-3-pro-image-preview'];
    if (!validModels.includes(options.model)) {
      console.error(`❌ Invalid model. Choose from: ${validModels.join(', ')}`);
      process.exit(1);
    }

    const generator = new GeminiAssetGenerator(apiKey, options.model as any);
    await generator.generateImage({
      prompt: options.prompt,
      width: parseInt(options.width),
      height: parseInt(options.height),
      outputPath: options.output,
    });
  });

program
  .command('list-themes')
  .description('List available theme presets')
  .action(() => {
    console.log('\n📋 Available themes:\n');
    for (const [name, theme] of Object.entries(THEME_PRESETS)) {
      console.log(`  🎨 ${name}`);
      console.log(`     Mood: ${theme.mood}`);
      console.log(`     Colors: ${theme.colors.join(', ')}`);
      console.log(`     Accents: ${theme.accents}\n`);
    }
  });

program
  .command('list-models')
  .description('List available AI models')
  .action(() => {
    console.log('\n🤖 Available models:\n');
    console.log(
      '  • gemini-2.5-flash-image   - Nano Banana (fast, default)'
    );
    console.log(
      '  • gemini-3-pro-image-preview - Nano Banana Pro (high quality)\n'
    );
  });

program.parse();
