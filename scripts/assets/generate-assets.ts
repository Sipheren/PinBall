/**
 * Pinball Asset Generator using Google Gemini API
 *
 * Uses Imagen 3 (part of Gemini API) to generate textures and graphics
 * for the pinball game based on the asset manifest.
 *
 * Requirements:
 * - GEMINI_API_KEY environment variable
 * - @google/generative-ai package
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface Dimensions {
  width: number;
  height: number;
}

interface AssetDefinition {
  prompt: string;
  dimensions: Dimensions;
  output: string;
  variants?: string[];
}

interface AssetCategory {
  [key: string]: AssetDefinition | AssetCategory;
}

interface AssetManifest {
  version: string;
  lastUpdated: string;
  assets: {
    tables: AssetCategory;
    entities: AssetCategory;
    ui: AssetCategory;
    effects: AssetCategory;
  };
}

/**
 * Configuration for asset generation
 */
const CONFIG = {
  // Use Imagen 3 for image generation
  model: 'imagen-3.0-generate-001', // or 'gemini-2.5-pro-exp' with image gen

  // Generation settings
  settings: {
    numberOfImages: 1,
    aspectRatio: '', // Calculated from dimensions
    negativePrompt: 'blurry, low quality, distorted, ugly, watermark, text, signature',
    guidanceScale: 9,
    seed: undefined, // Random by default
  },

  // API settings
  maxRetries: 3,
  retryDelay: 2000, // ms
  rateLimitDelay: 1000, // ms between requests
};

/**
 * AssetGenerator class
 */
class AssetGenerator {
  private genAI: GoogleGenerativeAI;
  private manifest: AssetManifest;
  private rootDir: string;
  private generatedCount = 0;
  private failedCount = 0;
  private skippedCount = 0;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.rootDir = path.resolve(__dirname, '../../');
  }

  /**
   * Load and parse the asset manifest
   */
  async loadManifest(): Promise<void> {
    const manifestPath = path.resolve(__dirname, 'asset-manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    this.manifest = JSON.parse(manifestContent);
    console.log('✓ Loaded asset manifest version', this.manifest.version);
  }

  /**
   * Generate a single asset
   */
  async generateAsset(
    category: string,
    name: string,
    asset: AssetDefinition,
    variant?: string
  ): Promise<void> {
    const outputPath = path.resolve(this.rootDir, asset.output);
    const variantSuffix = variant ? ` (${variant})` : '';

    // Check if file already exists
    try {
      await fs.access(outputPath);
      console.log(`⊘ Skipping ${category}/${name}${variantSuffix} (already exists)`);
      this.skippedCount++;
      return;
    } catch {
      // File doesn't exist, proceed with generation
    }

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    try {
      console.log(`\n⚡ Generating ${category}/${name}${variantSuffix}...`);
      console.log(`  Prompt: ${asset.prompt.substring(0, 100)}...`);
      console.log(`  Size: ${asset.dimensions.width}x${asset.dimensions.height}`);
      console.log(`  Output: ${asset.output}`);

      // Build the full prompt with variant info if present
      let fullPrompt = asset.prompt;
      if (variant) {
        fullPrompt = `${variant} - ${asset.prompt}`;
      }

      // Call Imagen 3 API
      const model = this.genAI.getGenerativeModel({ model: CONFIG.model });

      // Note: Imagen 3 is accessed through the generative-ai SDK
      // The exact API call format depends on the SDK version
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: 'text/plain',
            data: fullPrompt,
          },
        },
      ]);

      // Extract image data from response
      const imageData = this.extractImageData(result);

      // Save the image
      await fs.writeFile(outputPath, Buffer.from(imageData, 'base64'));

      console.log(`✓ Saved to ${asset.output}`);
      this.generatedCount++;

      // Rate limiting
      await this.sleep(CONFIG.settings.rateLimitDelay);

    } catch (error) {
      console.error(`✗ Failed to generate ${category}/${name}${variantSuffix}:`, error.message);
      this.failedCount++;

      // Retry logic
      if (this.shouldRetry(error)) {
        console.log(`  Retrying...`);
        await this.sleep(CONFIG.retryDelay);
        return this.generateAsset(category, name, asset, variant);
      }
    }
  }

  /**
   * Extract image data from API response
   */
  private extractImageData(response: any): string {
    // Handle different response formats
    if (response.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      return response.response.candidates[0].content.parts[0].inlineData.data;
    }
    throw new Error('Could not extract image data from response');
  }

  /**
   * Check if error is retryable
   */
  private shouldRetry(error: any): boolean {
    const retryableErrors = ['RATE_LIMIT_EXCEEDED', 'TEMPORARY_UNAVAILABLE', 'TIMEOUT'];
    return retryableErrors.some(code => error.message?.includes(code));
  }

  /**
   * Recursively process asset categories
   */
  async processCategory(
    categoryName: string,
    category: AssetCategory,
    parentPath = ''
  ): Promise<void> {
    for (const [key, value] of Object.entries(category)) {
      const currentPath = parentPath ? `${parentPath}/${key}` : key;

      if (this.isAssetDefinition(value)) {
        // Generate the main asset
        await this.generateAsset(categoryName, currentPath, value);

        // Generate variants if present
        if (value.variants && value.variants.length > 0) {
          for (const variant of value.variants) {
            await this.generateAsset(categoryName, currentPath, value, variant);
          }
        }
      } else {
        // Recurse into sub-category
        await this.processCategory(categoryName, value as AssetCategory, currentPath);
      }
    }
  }

  /**
   * Type guard for AssetDefinition
   */
  private isAssetDefinition(value: any): value is AssetDefinition {
    return value.prompt && value.dimensions && value.output;
  }

  /**
   * Generate all assets in the manifest
   */
  async generateAll(): Promise<void> {
    console.log('\n🎨 Starting Pinball Asset Generation');
    console.log('=' .repeat(50));

    await this.loadManifest();

    // Process each top-level category
    for (const [categoryName, category] of Object.entries(this.manifest.assets)) {
      console.log(`\n📁 Processing category: ${categoryName.toUpperCase()}`);
      await this.processCategory(categoryName, category);
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Generation Summary:');
    console.log(`  ✓ Generated: ${this.generatedCount}`);
    console.log(`  ✗ Failed:    ${this.failedCount}`);
    console.log(`  ⊘ Skipped:   ${this.skippedCount}`);
    console.log(`  Total:       ${this.generatedCount + this.failedCount + this.skippedCount}`);
  }

  /**
   * Generate specific assets by path pattern
   */
  async generateByPattern(pattern: string): Promise<void> {
    console.log(`\n🎯 Generating assets matching pattern: ${pattern}`);
    await this.loadManifest();

    for (const [categoryName, category] of Object.entries(this.manifest.assets)) {
      // Find and generate matching assets
      await this.findAndGenerate(categoryName, category, '', pattern);
    }
  }

  /**
   * Find assets matching pattern and generate them
   */
  private async findAndGenerate(
    categoryName: string,
    category: AssetCategory,
    parentPath: string,
    pattern: string
  ): Promise<void> {
    for (const [key, value] of Object.entries(category)) {
      const currentPath = parentPath ? `${parentPath}/${key}` : key;

      if (this.isAssetDefinition(value)) {
        if (currentPath.toLowerCase().includes(pattern.toLowerCase())) {
          await this.generateAsset(categoryName, currentPath, value);
          if (value.variants) {
            for (const variant of value.variants) {
              await this.generateAsset(categoryName, currentPath, value, variant);
            }
          }
        }
      } else {
        await this.findAndGenerate(categoryName, value as AssetCategory, currentPath, pattern);
      }
    }
  }

  /**
   * Sleep utility for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Main execution
 */
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ Error: GEMINI_API_KEY environment variable is not set');
    console.log('\nSet it with:');
    console.log('  export GEMINI_API_KEY="your-api-key-here"');
    console.log('\nOr create a .env file:');
    console.log('  GEMINI_API_KEY=your-api-key-here');
    process.exit(1);
  }

  const generator = new AssetGenerator(apiKey);

  // Parse command line arguments
  const args = process.argv.slice(2);
  const pattern = args[0];

  if (pattern) {
    await generator.generateByPattern(pattern);
  } else {
    await generator.generateAll();
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { AssetGenerator };
