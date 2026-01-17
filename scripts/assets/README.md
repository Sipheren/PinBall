# Asset Generation System

Automated texture and graphic generation using Google Gemini API (Imagen 3).

## Overview

This system uses Google's **Imagen 3** model to generate all game assets including:
- Table backgrounds and textures
- Entity sprites (ball, flippers, bumpers, targets, ramps, etc.)
- UI elements (HUD, menus, buttons)
- Visual effects (particles, glows, lighting)

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Gemini API Key

Get your free API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Verify Setup

```bash
# Test the generation system
pnpm assets:generate
```

## Usage

### Generate All Assets

Generate every asset defined in the manifest:

```bash
pnpm assets:generate
```

### Generate Specific Category

Generate only assets matching a pattern:

```bash
# Generate only table assets
pnpm assets:generate tables

# Generate only ball
pnpm assets:generate ball

# Generate UI elements
pnpm assets:generate ui
```

### Custom Patterns

The pattern matching is case-insensitive and searches the full asset path:

```bash
# Generate all bumper variants
pnpm assets:generate bumper

# Generate all particle effects
pnpm assets:generate particle
```

## Asset Manifest

All asset definitions are in `scripts/assets/asset-manifest.json`.

### Structure

```json
{
  "assets": {
    "tables": {
      "table_name": {
        "background": { ... },
        "walls": { ... }
      }
    },
    "entities": {
      "ball": { ... },
      "flipper": { ... },
      "bumper": { ... }
    },
    "ui": {
      "hud": { ... },
      "menus": { ... }
    },
    "effects": {
      "particles": { ... },
      "lighting": { ... }
    }
  }
}
```

### Adding New Assets

Edit `asset-manifest.json` and add your asset definition:

```json
{
  "my_new_asset": {
    "prompt": "Detailed description of the image to generate",
    "dimensions": { "width": 512, "height": 512 },
    "output": "public/assets/images/category/my_new_asset.png",
    "variants": ["optional variant description"]
  }
}
```

## Prompts Best Practices

### Good Prompts

- ✅ **Specific**: "Chrome steel pinball, highly reflective metallic sphere, centered on transparent background"
- ✅ **Styled**: "Neon cyberpunk arcade style, dark purple and blue gradient with glowing grid lines"
- ✅ **Technical**: "1024x1024, seamless texture, 4K resolution"

### Bad Prompts

- ❌ Too vague: "A pinball thing"
- ❌ No context: "Make it look good"
- ❌ Missing details: "Generate a bumper"

### Prompt Template

```
[Subject], [Style/Theme], [Colors], [View Angle], [Background], [Technical Specs]

Examples:
- "Pinball flipper paddle, metallic red with white tip, glossy plastic finish, side view, transparent background"
- "Particle sprite, bright spark star shape, radial glow, yellow white gradient, seamless, 256x256"
```

## Output Structure

Generated files are saved to:

```
public/assets/
├── images/
│   ├── tables/
│   │   └── classic_arcade/
│   │       ├── background.png
│   │       ├── walls.png
│   │       └── playfield.png
│   ├── entities/
│   │   ├── ball.png
│   │   ├── flipper.png
│   │   ├── bumper.png
│   │   └── ...
│   ├── ui/
│   │   ├── hud/
│   │   └── menus/
│   └── effects/
│       ├── particles/
│       └── lighting/
```

## Rate Limiting

The system includes built-in rate limiting:
- **1 second delay** between requests (configurable)
- **Automatic retries** for transient errors
- **Skip existing files** to avoid re-generating

Adjust in `generate-assets.ts`:

```typescript
const CONFIG = {
  rateLimitDelay: 1000,  // ms between requests
  maxRetries: 3,         // retry attempts
  retryDelay: 2000,      // ms before retry
};
```

## Model Information

| Model | Use Case | Quality | Speed |
|-------|----------|---------|-------|
| **Imagen 3** | All game assets | Highest | Medium |
| Imagen 3 Fast | Drafts/prototyping | Good | Fast |

## Troubleshooting

### API Key Errors

```
❌ Error: GEMINI_API_KEY environment variable is not set
```

**Solution**: Ensure `.env` file exists with valid API key

### Rate Limit Exceeded

```
✗ Failed to generate: RATE_LIMIT_EXCEEDED
```

**Solution**: Increase `rateLimitDelay` in config, or wait and retry

### No Image Data in Response

```
✗ Failed to generate: Could not extract image data from response
```

**Solution**: Check model availability in your region, verify API key has access to Imagen 3

### Output Directory Issues

```
Error: ENOENT: no such file or directory
```

**Solution**: The script creates directories automatically. Check write permissions.

## Advanced Usage

### Programmatic Usage

```typescript
import { AssetGenerator } from './scripts/assets/generate-assets.ts';

const generator = new AssetGenerator(process.env.GEMINI_API_KEY);

// Generate all
await generator.generateAll();

// Or specific pattern
await generator.generateByPattern('bumper');
```

### Custom Post-Processing

Extend `AssetGenerator` to add post-processing:

```typescript
class CustomAssetGenerator extends AssetGenerator {
  async generateAsset(category, name, asset, variant?) {
    await super.generateAsset(category, name, asset, variant);

    // Add custom post-processing
    await this.optimizeImage(asset.output);
    await this.generateThumbnail(asset.output);
  }
}
```

## Cost Estimation

Imagen 3 pricing (as of 2025):

| Resolution | Price per Image |
|------------|-----------------|
| 512x512    | ~$0.008         |
| 1024x1024  | ~$0.02          |
| 2048x2048  | ~$0.05          |

**Estimated total for all assets**: ~$5-10 USD

## Next Steps

1. Generate initial asset set
2. Review quality and adjust prompts
3. Add custom post-processing (optimization, compression)
4. Integrate generated assets into game
5. Set up CI/CD for asset regeneration

## Resources

- [Google AI Studio](https://makersuite.google.com/)
- [Imagen 3 Documentation](https://ai.google.dev/imagen)
- [Generative AI SDK](https://github.com/google/generative-ai-js)
