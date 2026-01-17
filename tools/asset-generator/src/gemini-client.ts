// tools/asset-generator/src/gemini-client.ts
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs/promises';
import * as path from 'path';

export type GenerationModel =
  | 'gemini-2.5-flash-image' // Nano Banana - fast
  | 'gemini-3-pro-image-preview'; // Nano Banana Pro - high quality

interface GenerationConfig {
  prompt: string;
  negativePrompt?: string;
  width: number;
  height: number;
  style?: string;
  outputPath: string;
  model?: GenerationModel;
}

export class GeminiAssetGenerator {
  private ai: GoogleGenAI;
  private defaultModel: GenerationModel;

  constructor(apiKey: string, defaultModel: GenerationModel = 'gemini-2.5-flash-image') {
    this.ai = new GoogleGenAI({ apiKey });
    this.defaultModel = defaultModel;
  }

  async generateImage(config: GenerationConfig): Promise<string> {
    const model = config.model || this.defaultModel;

    // Both Nano Banana models use the same API format
    if (model === 'gemini-2.5-flash-image' || model === 'gemini-3-pro-image-preview') {
      return this.generateWithNanoBanana(config, model);
    }

    throw new Error(`Unknown model: ${model}`);
  }

  private async generateWithNanoBanana(
    config: GenerationConfig,
    model: GenerationModel
  ): Promise<string> {
    const fullPrompt = this.buildPrompt(config.prompt, config.style);

    try {
      console.log(`🎨 Generating with ${model}...`);

      // Call the correct API - pass prompt as plain string
      const response = await this.ai.models.generateContent({
        model,
        contents: fullPrompt, // Just pass the string directly
      });

      // Extract image from response
      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error('No parts in response');
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const buffer = Buffer.from(part.inlineData.data, 'base64');
          await fs.mkdir(path.dirname(config.outputPath), { recursive: true });
          await fs.writeFile(config.outputPath, buffer);
          console.log(`✓ Generated (${model}): ${config.outputPath}`);
          return config.outputPath;
        }
      }

      throw new Error('No image data in response');
    } catch (error) {
      console.error(`✗ Generation failed: ${error}`);
      throw error;
    }
  }

  private buildPrompt(basePrompt: string, style?: string): string {
    const styleGuide = style || PINBALL_STYLE_GUIDE;
    const sizeInfo = `\n\nImage specifications:\n- High resolution, crisp quality\n- Game-ready asset for 2D game\n- Transparent background where appropriate`;

    return `${styleGuide}\n\n${basePrompt}${sizeInfo}`;
  }

  private defaultNegativePrompt =
    'blurry, low quality, distorted, text, watermark, signature, ' +
    'photorealistic, 3D render, photograph, realistic lighting';
}

// Style guide constant
export const PINBALL_STYLE_GUIDE = `
Style: Vibrant arcade pinball machine aesthetic
Art direction: Bold colors, high contrast, neon glow effects
Rendering: Clean vector-style with subtle gradients
Perspective: Top-down for playfield elements, slight 3D depth
Color palette: Deep blues, electric purples, hot pinks, neon greens, chrome silver
Lighting: Dramatic rim lighting, glowing elements, reflective surfaces
Quality: Sharp edges, game-ready, suitable for 2D game sprites
Background: Transparent where appropriate for sprites
`;
