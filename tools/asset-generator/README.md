# Pinball Asset Generator

Generate high-quality game assets for your pinball game using Google's Gemini AI.

## Features

- 🤖 **Multiple AI Models**: Imagen 3, Gemini 2.0 Flash, and Gemini 3 Pro Image Preview
- 🎨 **Theme Presets**: Classic, Space, Horror, Racing, Underwater
- 📦 **Batch Generation**: Generate full asset sets with one command
- 🎯 **Single Asset Mode**: Generate custom assets with specific prompts
- ⚡ **Rate Limit Handling**: Built-in batching and delays
- 🖼️ **Post-Processing**: Image resizing, optimization, spritesheet packing

## Setup

```bash
cd tools/asset-generator

# Install dependencies
pnpm install

# Set up API key (already configured)
cp .env.example .env
# Edit .env with your API key
```

## Usage

### List Available Themes

```bash
pnpm themes
```

### List Available Models

```bash
pnpm models
```

### Generate Full Theme

```bash
# Classic theme with Imagen 3 (default)
pnpm generate -- -t classic -o ./output/classic

# Space theme with Gemini 3 Pro
pnpm generate -- -t space -o ./output/space -m gemini-3-pro-image-preview

# Horror theme with Gemini Flash
pnpm generate -- -t horror -o ./output/horror -m gemini-2.0-flash-exp
```

### Generate Single Asset

```bash
# Custom bumper
pnpm single -- -p "Neon pink mushroom bumper, glowing, top-down view" -w 96 -h 96 -o ./output/custom_bumper.png

# Custom background with specific model
pnpm single -- -p "Underwater coral reef pinball playfield, bioluminescent" -w 1080 -h 1920 -o ./output/underwater_bg.png -m imagen-3.0-generate-002
```

## Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| `imagen-3.0-generate-002` | Highest quality | Game sprites, UI elements |
| `gemini-2.0-flash-exp` | Fast generation | Quick iterations, drafts |
| `gemini-3-pro-image-preview` | High quality + preview | Final assets, detailed work |

## Available Themes

- **classic** - Vintage 1980s arcade with neon lights
- **space** - Cosmic sci-fi with stars and planets
- **horror** - Spooky haunted carnival
- **racing** - High-speed motorsport
- **underwater** - Deep sea treasure hunt

## Output Structure

```
output/
├── backgrounds/
│   └── playfield.png
├── sprites/
│   ├── ball_chrome.png
│   ├── flipper_left.png
│   ├── flipper_right.png
│   ├── bumper_1.png
│   ├── bumper_2.png
│   ├── bumper_3.png
│   ├── target_drop.png
│   └── target_standup.png
├── ui/
│   ├── btn_play_normal.png
│   ├── btn_play_hover.png
│   └── score_display.png
└── effects/
    ├── particle_spark.png
    ├── particle_star.png
    ├── glow_1.png
    ├── glow_2.png
    ├── glow_3.png
    └── glow_4.png
```

## Integration

Copy generated assets to the main project:

```bash
# After generation
cp -r output/classic/* ../../public/assets/images/tables/classic/
```

Or add to main project package.json:

```json
{
  "scripts": {
    "assets:generate": "cd tools/asset-generator && pnpm generate -- -t classic -o ../../public/assets/images/tables/classic"
  }
}
```

## Cost Estimation

| Model | Cost (approx) | Rate Limit |
|-------|---------------|------------|
| Imagen 3 | ~$0.02/image | 10 req/min |
| Gemini 2.0 Flash | ~$0.01/image | 15 req/min |
| Gemini 3 Pro | ~$0.03/image | 10 req/min |

**Full theme (~30 assets):** ~$0.30-0.90
