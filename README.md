# nerdfx-mcp-server

MCP (Model Context Protocol) server for AI filmmaking. Get expert cinematography analysis, AI video model comparisons, prompt engineering, production estimates, and character consistency guidance — all from your AI assistant.

Built by [NerdFX AI](https://nerdfx.ai) — the model-agnostic AI filmmaking platform.

## What This Does

When connected to an AI assistant (Claude, Cursor, Windsurf, etc.), this server provides 5 specialized tools that help with AI video production:

| Tool | What It Does |
|------|-------------|
| `analyze_shot` | Analyzes a shot description and recommends camera angle, lens, lighting, and which AI model (Runway/Kling/Sora/Veo) is best |
| `compare_ai_models` | Compares Runway Gen-4, Kling 2.0, Sora, and Veo 3 for a specific use case with pricing and quality scores |
| `character_consistency_guide` | Detailed guide on maintaining character consistency across AI-generated shots |
| `estimate_production` | Full production estimate: shot count, model mix, cost breakdown, and timeline |
| `prompt_engineer` | Generates optimized prompts using the SCALE framework for any target model |

## Quick Start

### Install

```bash
npm install -g nerdfx-mcp-server
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nerdfx": {
      "command": "npx",
      "args": ["-y", "nerdfx-mcp-server"]
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "nerdfx": {
      "command": "npx",
      "args": ["-y", "nerdfx-mcp-server"]
    }
  }
}
```

### Windsurf

Add to your Windsurf MCP configuration:

```json
{
  "mcpServers": {
    "nerdfx": {
      "command": "npx",
      "args": ["-y", "nerdfx-mcp-server"]
    }
  }
}
```

### Smithery

```bash
npx @smithery/cli install nerdfx-mcp-server --client claude
```

## Tools

### analyze_shot

Analyze a shot and get cinematography recommendations.

**Parameters:**
- `description` (string, required) — Describe the shot you want to create

**Example:** "a woman walking through a neon-lit Tokyo alley at night"

**Returns:** Shot type classification, camera angle, lens recommendation, lighting setup, camera movement, AI model recommendation with suitability matrix, prompt tips, and composition checklist.

---

### compare_ai_models

Compare AI video models for a specific use case.

**Parameters:**
- `use_case` (string, required) — The filmmaking use case to compare

**Example:** "action scene", "dialogue close-up", "landscape establishing shot"

**Returns:** Detailed comparison of Runway Gen-4, Kling 2.0, Sora, and Veo 3 with pricing, resolution, duration limits, strengths/weaknesses, quality scores, cost comparison, and decision framework.

---

### character_consistency_guide

Get a guide on maintaining character consistency.

**Parameters:**
- `character_count` (number, required) — Number of distinct characters (1-20)
- `project_type` (string, required) — Type of project (short film, feature, commercial, etc.)

**Returns:** Reference sheet requirements, model-specific consistency features (face-lock, character references), workflow strategies scaled to your character count, troubleshooting guide, and budget impact estimates.

---

### estimate_production

Estimate production costs and timeline.

**Parameters:**
- `length_minutes` (number, required) — Length of final video in minutes (0.25-120)
- `style` (string, required) — Visual style (cinematic narrative, documentary, commercial, etc.)
- `budget_level` (string, required) — "low", "medium", "high", or "premium"

**Returns:** Shot breakdown, model mix recommendation, cost breakdown (generation + upscaling + audio), timeline (pre-production + production + post), tool recommendations, and risk factors.

---

### prompt_engineer

Generate an optimized prompt for a specific AI model.

**Parameters:**
- `scene_description` (string, required) — Describe the scene you want
- `target_model` (string, required) — "runway", "kling", "sora", or "veo"

**Returns:** SCALE framework breakdown (Subject, Camera, Atmosphere, Lighting, Extras), copy-paste ready optimized prompt, 10 model-specific tips, prompt variations, and common mistakes to avoid.

## Requirements

- Node.js 18+
- No API keys needed — all tools work offline with built-in knowledge

## How It Works

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. MCP is an open standard that lets AI assistants connect to external tools. When you add this server to your AI assistant, it gains access to specialized AI filmmaking knowledge.

The server runs locally on your machine, communicates over stdio, and requires no API keys or network access.

## About NerdFX

[NerdFX](https://nerdfx.ai) is a model-agnostic AI filmmaking platform that routes each shot to the optimal AI video model (Runway, Kling, Sora, Veo) based on the shot requirements. Features include:

- Automatic model selection and prompt optimization
- Character profile management for consistency
- Batch generation across multiple models
- Production pipeline management from storyboard to final render
- Cost tracking and optimization

## License

MIT
