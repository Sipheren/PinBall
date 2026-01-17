// tools/asset-generator/src/generators/full-batch.ts
// Generate all ~200 assets from all-prompts.ts

import { GeminiAssetGenerator } from '../gemini-client.js';
import { ALL_PROMPTS, buildFullPrompt, getAssetCount, AssetPrompt } from '../prompts/all-prompts.js';
import * as fs from 'fs/promises';
import * as path from 'path';

interface GenerationStats {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  startTime: Date;
  errors: Array<{ asset: AssetPrompt; error: string }>;
}

export class FullBatchGenerator {
  private generator: GeminiAssetGenerator;
  private outputDir: string;
  private stats: GenerationStats;
  private costPerImage: number; // in dollars

  constructor(apiKey: string, outputDir: string, model: 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview' = 'gemini-2.5-flash-image') {
    this.generator = new GeminiAssetGenerator(apiKey, model);
    this.outputDir = outputDir;
    this.costPerImage = model === 'gemini-2.5-flash-image' ? 0.0195 : 0.067; // Batch pricing
    this.stats = {
      total: ALL_PROMPTS.length,
      completed: 0,
      failed: 0,
      skipped: 0,
      startTime: new Date(),
      errors: []
    };
  }

  async generateAll(options: {
    priority?: 'critical' | 'high' | 'medium' | 'low';
    category?: string;
    batchSize?: number;
    delay?: number;
  } = {}): Promise<void> {
    const { priority, category, batchSize = 5, delay = 2000 } = options;

    // Filter assets based on options
    let assetsToGenerate = ALL_PROMPTS;
    if (priority) {
      assetsToGenerate = assetsToGenerate.filter(a => a.priority === priority);
    }
    if (category) {
      assetsToGenerate = assetsToGenerate.filter(a => a.category === category);
    }

    this.stats.total = assetsToGenerate.length;

    console.log('\n' + '='.repeat(80));
    console.log('🎮 PINBALL ASSET GENERATION - FULL BATCH');
    console.log('='.repeat(80));
    console.log(`\n📊 Generation Plan:`);
    console.log(`   Total assets: ${this.stats.total}`);
    console.log(`   Batch size: ${batchSize}`);
    console.log(`   Delay between batches: ${delay}ms`);
    console.log(`   Model: gemini-2.5-flash-image (Nano Banana)`);
    console.log(`   Cost per image: $${this.costPerImage.toFixed(4)}`);
    console.log(`   Estimated total cost: $${(this.stats.total * this.costPerImage).toFixed(2)}`);

    if (priority) console.log(`   Priority filter: ${priority}`);
    if (category) console.log(`   Category filter: ${category}`);

    console.log(`\n📁 Output directory: ${this.outputDir}\n`);

    // Confirm with user
    // console.log('⚠️  This will generate ' + this.stats.total + ' assets.');
    // console.log('⚠️  Press Ctrl+C to cancel, starting in 3 seconds...\n');
    // await this.delay(3000);

    // Process in batches
    for (let i = 0; i < assetsToGenerate.length; i += batchSize) {
      const batch = assetsToGenerate.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(assetsToGenerate.length / batchSize);

      console.log(`\n${'='.repeat(80)}`);
      console.log(`📦 Batch ${batchNum}/${totalBatches}`);
      console.log(`${'='.repeat(80)}\n`);

      await Promise.all(
        batch.map(async (asset) => {
          await this.generateAsset(asset);
        })
      );

      // Rate limiting delay
      if (i + batchSize < assetsToGenerate.length) {
        console.log(`\n⏳ Rate limit delay: ${delay}ms...`);
        await this.delay(delay);
      }
    }

    // Print summary
    this.printSummary();
  }

  private async generateAsset(asset: AssetPrompt): Promise<void> {
    const [width, height] = asset.resolution.split('x').map(Number);
    const outputPath = path.join(this.outputDir, asset.filename);
    const fullPrompt = buildFullPrompt(asset);

    try {
      // Check if file already exists
      try {
        await fs.access(outputPath);
        console.log(`⊘ Skipped (exists): ${asset.filename}`);
        this.stats.skipped++;
        return;
      } catch {
        // File doesn't exist, proceed with generation
      }

      console.log(`🎨 Generating: ${asset.filename}`);
      console.log(`   ID: ${asset.id}`);
      console.log(`   Category: ${asset.category} | Priority: ${asset.priority}`);
      console.log(`   Resolution: ${asset.resolution}`);

      await this.generator.generateImage({
        prompt: fullPrompt,
        width,
        height,
        outputPath,
      });

      this.stats.completed++;
      console.log(`✅ Success: ${asset.filename}`);

    } catch (error) {
      this.stats.failed++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.stats.errors.push({ asset, error: errorMsg });
      console.error(`❌ Failed: ${asset.filename}`);
      console.error(`   Error: ${errorMsg}`);
    }
  }

  private printSummary(): void {
    const duration = Date.now() - this.stats.startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    const actualCost = this.stats.completed * this.costPerImage;

    console.log('\n' + '='.repeat(80));
    console.log('📊 GENERATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`\n✅ Completed: ${this.stats.completed}/${this.stats.total}`);
    console.log(`❌ Failed: ${this.stats.failed}`);
    console.log(`⊘ Skipped: ${this.stats.skipped}`);
    console.log(`\n⏱️  Duration: ${minutes}m ${seconds}s`);
    console.log(`💰 Actual cost: $${actualCost.toFixed(2)} (at $${this.costPerImage.toFixed(4)}/image)`);

    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Failed Assets (${this.stats.errors.length}):`);
      this.stats.errors.slice(0, 10).forEach(({ asset, error }) => {
        console.log(`   • ${asset.filename}: ${error.substring(0, 100)}`);
      });
      if (this.stats.errors.length > 10) {
        console.log(`   ... and ${this.stats.errors.length - 10} more`);
      }
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // Save error log
    if (this.stats.errors.length > 0) {
      const errorLogPath = path.join(this.outputDir, 'generation-errors.json');
      fs.writeFile(errorLogPath, JSON.stringify(this.stats.errors, null, 2));
      console.log(`📝 Error log saved to: ${errorLogPath}\n`);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async printAssetCount(): Promise<void> {
    const count = getAssetCount();

    console.log('\n📊 Asset Library Statistics\n');
    console.log('Total Assets: ' + count.total + '\n');

    console.log('By Priority:');
    Object.entries(count.byPriority)
      .sort(([, a], [, b]) => b - a)
      .forEach(([priority, num]) => {
        console.log(`  ${priority.padEnd(10)} ${num}`);
      });

    console.log('\nBy Category:');
    Object.entries(count.byCategory)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, num]) => {
        console.log(`  ${category.padEnd(15)} ${num}`);
      });

    console.log('\n');
  }
}
