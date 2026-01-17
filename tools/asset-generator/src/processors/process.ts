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
    console.log(`✓ Resized: ${output}`);
  }

  // Remove background (make transparent)
  async removeBackground(input: string, output: string, threshold = 10): Promise<void> {
    const image = sharp(input);
    const { data, info } = await image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });

    // Simple background removal based on corner color
    const bgColor = { r: data[0], g: data[1], b: data[2] };

    for (let i = 0; i < data.length; i += 4) {
      const diff =
        Math.abs(data[i] - bgColor.r) +
        Math.abs(data[i + 1] - bgColor.g) +
        Math.abs(data[i + 2] - bgColor.b);
      if (diff < threshold) {
        data[i + 3] = 0; // Set alpha to 0
      }
    }

    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .png()
      .toFile(output);
    console.log(`✓ Background removed: ${output}`);
  }

  // Optimize for web
  async optimize(input: string, output: string, quality = 80): Promise<void> {
    await sharp(input).webp({ quality }).toFile(output.replace(/\.[^.]+$/, '.webp'));
    console.log(`✓ Optimized: ${output.replace(/\.[^.]+$/, '.webp')}`);
  }

  // Create spritesheet from multiple images
  async createSpritesheet(
    inputs: string[],
    output: string,
    columns: number
  ): Promise<{ path: string; json: object }> {
    const images = await Promise.all(inputs.map((f) => sharp(f).metadata()));
    const maxWidth = Math.max(...images.map((i) => i.width || 0));
    const maxHeight = Math.max(...images.map((i) => i.height || 0));

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

    console.log(`✓ Spritesheet created: ${output}`);

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
    console.log(`✓ Spritesheet metadata: ${jsonPath}`);

    return { path: output, json: metadata };
  }
}
