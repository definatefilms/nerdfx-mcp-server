# nerdfx-mcp-server

Offline advisory MCP (Model Context Protocol) server for AI filmmaking. Get text-based cinematography suggestions, model comparisons, prompt drafts, production estimates, and character consistency guidance from built-in rules and reference data.

Built by [NerdFX AI](https://nerdfx.ai) — the model-agnostic AI filmmaking platform.

Source: [definatefilms/nerdfx-mcp-server](https://github.com/definatefilms/nerdfx-mcp-server).
Report public-package bugs at [GitHub Issues](https://github.com/definatefilms/nerdfx-mcp-server/issues).

**This package does not generate images, video, or audio.** It does not authenticate to NerdFX, call model providers, upload references, manage generation jobs, or spend credits. Installing it does not connect the separate authenticated NerdFX generation integration.

## What This Does

When connected to an AI assistant (Claude, Cursor, Windsurf, etc.), this server provides exactly 5 advisory tools. All return text:

| Tool | What It Does |
|------|-------------|
| `analyze_shot` | Suggests camera angle, lens, lighting, and an AI model using built-in rules |
| `compare_ai_models` | Compares built-in model reference data, with illustrative pricing and quality scores |
| `character_consistency_guide` | Detailed guide on maintaining character consistency across AI-generated shots |
| `estimate_production` | Estimates shot count, model mix, cost, and timeline from fixed assumptions |
| `prompt_engineer` | Drafts text prompts using the SCALE framework for the four supported model labels |

Model names, capabilities, prices, limits, and quality scores are bundled reference data, not live provider lookups or independently validated benchmarks. Verify current provider documentation and pricing before relying on them for a production decision. Estimates are not quotes or account-balance checks.

### Choosing the right capability

- Planning a shot, comparing reference information, drafting a prompt, or estimating a project: use this public advisory package.
- Creating or editing media, uploading reference assets, checking a generation job, or using credits: use the separate authenticated NerdFX product integration configured for your account. Its permissions, credit limits, and approval requirements apply; these actions are not available here.
- Do not treat an advisory response, a drafted prompt, or a production estimate as evidence that a generation job was submitted or completed.

## Quick Start

### Install

The public package is [nerdfx-mcp-server on npm](https://www.npmjs.com/package/nerdfx-mcp-server). Use either the optional global install below or the `npx` configuration for your client; both are not required.

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

### Run from source

```bash
git clone https://github.com/definatefilms/nerdfx-mcp-server.git
cd nerdfx-mcp-server
npm ci --ignore-scripts
npm run check
npm test
node index.js
```

The included `smithery.yaml` describes a stdio launch configuration. Its presence alone does not establish a published Smithery listing or a hosted service URL.

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

Draft a text prompt for a specific AI model. The prompt is returned for you to review and use elsewhere; it is not submitted for generation.

**Parameters:**
- `scene_description` (string, required) — Describe the scene you want
- `target_model` (string, required) — "runway", "kling", "sora", or "veo"

**Returns:** SCALE framework breakdown (Subject, Camera, Atmosphere, Lighting, Extras), copy-paste ready optimized prompt, 10 model-specific tips, prompt variations, and common mistakes to avoid.

## Requirements

- Node.js 18+
- No API keys needed for these advisory tools
- Installation may require network access; tool execution uses built-in knowledge without outbound provider requests

## How It Works

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. MCP is an open standard that lets AI assistants connect to external tools. When you add this server to your AI assistant, it gains access to specialized AI filmmaking knowledge.

By default, the server runs locally over stdio. Leave `PORT` unset and do not pass `--http` for the desktop configurations above.

### Optional HTTP transport

Setting `PORT` or passing `--http` selects the existing stateless Streamable HTTP transport. It exposes the same five advisory tools via `POST /mcp`, with health responses at `/` and `/health`. `GET /mcp` and `DELETE /mcp` return HTTP 405.

This mode binds to `0.0.0.0` and does not implement application authentication. Keep it on a trusted network or put appropriate access controls in front of it before exposing it. A locally hosted `/mcp` path is not an authenticated NerdFX generation endpoint.

## About NerdFX

[NerdFX](https://nerdfx.ai) is a separate filmmaking product. Product links and feature references in advisory responses do not make those features available through this package. Consult the product and your configured authenticated integration for its supported capabilities and account requirements.

## License

This public package and its included documentation are licensed under [MIT](LICENSE). This license does not cover the separate proprietary NerdFX product, authenticated integrations, or third-party model services.
