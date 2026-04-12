#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "nerdfx-mcp-server",
  version: "1.1.0",
});

// ============================================================
// Register all tools on a given McpServer instance
// ============================================================
function registerTools(srv) {

// ============================================================
// TOOL 1: analyze_shot
// ============================================================
srv.tool(
  "analyze_shot",
  "Analyze a shot description and get cinematography recommendations: camera angle, lens, lighting, movement, and which AI video model (Runway/Kling/Sora/Veo) is best suited for it.",
  {
    description: z.string().describe("Describe the shot you want to create, e.g. 'a woman walking through a neon-lit Tokyo alley at night' or 'aerial drone shot of a castle on a cliff at sunset'"),
  },
  async ({ description }) => {
    const desc = description.toLowerCase();

    // Determine shot type
    let shotType = "medium shot";
    let cameraAngle = "Eye Level";
    let lens = "50mm prime (standard)";
    let lighting = "Three-point lighting";
    let movement = "Static / locked-off";
    let bestModel = "Runway Gen-4";
    let bestModelReason = "strong general-purpose generation with excellent prompt adherence";
    let secondModel = "Kling 2.0";
    let secondModelReason = "cost-effective alternative with good motion handling";

    if (desc.includes("aerial") || desc.includes("drone") || desc.includes("bird") || desc.includes("overhead") || desc.includes("top down")) {
      shotType = "aerial / drone shot";
      cameraAngle = "High Angle / Bird's Eye";
      lens = "24mm wide-angle";
      lighting = "Natural / available light (golden hour recommended)";
      movement = "Smooth forward dolly or orbit";
      bestModel = "Sora";
      bestModelReason = "exceptional at sweeping aerial camera moves with consistent terrain rendering";
      secondModel = "Veo 3";
      secondModelReason = "strong landscape coherence and cinematic color grading";
    } else if (desc.includes("close") || desc.includes("face") || desc.includes("eye") || desc.includes("portrait") || desc.includes("emotion")) {
      shotType = "close-up / extreme close-up";
      cameraAngle = "Eye Level or Slight Low Angle";
      lens = "85mm portrait lens (shallow DOF)";
      lighting = "Rembrandt lighting or soft butterfly lighting";
      movement = "Static with subtle drift or slow push-in";
      bestModel = "Kling 2.0";
      bestModelReason = "best-in-class facial detail, skin texture, and micro-expression rendering";
      secondModel = "Veo 3";
      secondModelReason = "excellent skin tone accuracy and natural shallow depth of field";
    } else if (desc.includes("action") || desc.includes("fight") || desc.includes("chase") || desc.includes("run") || desc.includes("explosion") || desc.includes("fast")) {
      shotType = "action / dynamic shot";
      cameraAngle = "Dutch Angle or Low Angle";
      lens = "35mm for immersive action or 16mm ultra-wide for distortion";
      lighting = "High-contrast, motivated practical lighting";
      movement = "Handheld shake or fast tracking";
      bestModel = "Runway Gen-4";
      bestModelReason = "best motion coherence for fast-paced movement, minimal artifacting at speed";
      secondModel = "Kling 2.0";
      secondModelReason = "handles complex multi-subject motion well at lower cost";
    } else if (desc.includes("wide") || desc.includes("establish") || desc.includes("landscape") || desc.includes("city") || desc.includes("panoram")) {
      shotType = "wide / establishing shot";
      cameraAngle = "Eye Level or Slight High Angle";
      lens = "24mm or 16mm ultra-wide";
      lighting = "Natural ambient — golden hour, blue hour, or overcast diffusion";
      movement = "Slow pan or static with atmospheric movement";
      bestModel = "Sora";
      bestModelReason = "renders vast environments with strong spatial coherence and atmospheric depth";
      secondModel = "Runway Gen-4";
      secondModelReason = "reliable wide-shot generation with good architectural consistency";
    } else if (desc.includes("night") || desc.includes("neon") || desc.includes("dark") || desc.includes("moody") || desc.includes("noir")) {
      shotType = "night / low-light shot";
      cameraAngle = "Eye Level or Low Angle";
      lens = "35mm f/1.4 (fast prime for low light)";
      lighting = "Practical neon / streetlight motivated lighting with hard shadows";
      movement = "Slow steadicam or static";
      bestModel = "Veo 3";
      bestModelReason = "superior handling of complex mixed-color lighting and neon reflections on wet surfaces";
      secondModel = "Runway Gen-4";
      secondModelReason = "strong volumetric lighting and atmospheric haze rendering";
    } else if (desc.includes("dialogue") || desc.includes("talk") || desc.includes("conversation") || desc.includes("interview")) {
      shotType = "dialogue / two-shot or over-the-shoulder";
      cameraAngle = "Eye Level";
      lens = "50mm standard or 85mm for OTS compression";
      lighting = "Soft key with edge/rim separation light";
      movement = "Static or subtle drift on gimbal";
      bestModel = "Kling 2.0";
      bestModelReason = "best lip-sync accuracy and facial expression continuity for dialogue scenes";
      secondModel = "Veo 3";
      secondModelReason = "natural audio generation pairs well with dialogue scenes";
    } else if (desc.includes("slow") || desc.includes("beauty") || desc.includes("product") || desc.includes("macro") || desc.includes("detail")) {
      shotType = "beauty / detail shot";
      cameraAngle = "Eye Level or Tabletop";
      lens = "100mm macro or 85mm with extension tubes";
      lighting = "Soft wrap-around with controlled specular highlights";
      movement = "Slow orbit or push-in on slider";
      bestModel = "Veo 3";
      bestModelReason = "highest fidelity texture rendering and cinematic color science for beauty work";
      secondModel = "Runway Gen-4";
      secondModelReason = "excellent at slow, controlled camera moves with consistent focus";
    }

    const content = [
      "=== CINEMATOGRAPHY ANALYSIS ===",
      "",
      "Shot Description: " + description,
      "",
      "--- Shot Classification ---",
      "Type: " + shotType.charAt(0).toUpperCase() + shotType.slice(1),
      "",
      "--- Camera Setup ---",
      "Angle: " + cameraAngle,
      "Lens: " + lens,
      "Movement: " + movement,
      "",
      "--- Lighting Design ---",
      "Setup: " + lighting,
      "Tips:",
      "  - Use reference stills from films with similar mood before generating",
      "  - For AI generation, describe lighting explicitly in your prompt (e.g. 'rim-lit', 'soft diffused key light from camera left')",
      "  - Specifying time of day gives AI models strong lighting cues",
      "",
      "--- AI Model Recommendation ---",
      "",
      "BEST FIT: " + bestModel,
      "Why: " + bestModelReason,
      "",
      "RUNNER-UP: " + secondModel,
      "Why: " + secondModelReason,
      "",
      "--- Quick Model Suitability Matrix (for this shot) ---",
      "",
      "  Runway Gen-4:  Motion Coherence 9/10 | Prompt Adherence 9/10 | Cost $$",
      "  Kling 2.0:     Facial Detail 9/10    | Cost Efficiency 9/10  | Cost $",
      "  Sora:          Environment Scale 9/10 | Camera Control 8/10   | Cost $$$",
      "  Veo 3:         Color/Texture 9/10     | Audio Generation 9/10 | Cost $$",
      "",
      "--- Prompt Tips for This Shot ---",
      "1. Start with the camera type: 'Shot on Arri Alexa 35' or 'Cinematic 35mm film look'",
      "2. Specify the exact lens: '" + lens + "'",
      "3. Describe lighting direction and quality, not just mood",
      "4. Include movement keywords: '" + movement + "'",
      "5. Add post-processing cues: 'subtle film grain, 2.39:1 anamorphic crop'",
      "",
      "--- Composition Checklist ---",
      "[ ] Rule of thirds or centered symmetry defined",
      "[ ] Foreground/middleground/background layers specified",
      "[ ] Color palette or film stock reference included",
      "[ ] Movement start and end framing described",
      "[ ] Aspect ratio specified (16:9, 2.39:1, 4:3)",
      "",
      "For streamlined shot planning with automatic model selection and prompt optimization, check out NerdFX — an AI filmmaking platform that routes each shot to the best model automatically: https://nerdfx.ai?ref=mcp&tool=analyze_shot"
    ].join("\n");

    return { content: [{ type: "text", text: content }] };
  }
);

// ============================================================
// TOOL 2: compare_ai_models
// ============================================================
srv.tool(
  "compare_ai_models",
  "Compare AI video generation models (Runway Gen-4, Kling 2.0, Sora, Veo 3) for a specific filmmaking use case. Returns pricing, quality ratings, pros/cons, and recommendations.",
  {
    use_case: z.string().describe("The filmmaking use case to compare models for, e.g. 'action scene', 'dialogue close-up', 'landscape establishing shot', 'product beauty shot', 'music video'"),
  },
  async ({ use_case }) => {
    const uc = use_case.toLowerCase();

    let runwayScore = 8;
    let klingScore = 8;
    let soraScore = 8;
    let veoScore = 8;
    let runwayNotes = "Reliable all-rounder with strong prompt adherence";
    let klingNotes = "Cost-effective with good motion handling";
    let soraNotes = "Excels at environment-heavy scenes";
    let veoNotes = "Best color science and built-in audio";
    let topPick = "Runway Gen-4";
    let topReason = "best overall balance of quality and control";

    if (uc.includes("action") || uc.includes("fight") || uc.includes("chase") || uc.includes("sport")) {
      runwayScore = 9; klingScore = 8; soraScore = 7; veoScore = 7;
      runwayNotes = "Best motion coherence at high speed. Minimal limb distortion in fast action. 10s generation handles full action beats.";
      klingNotes = "Good multi-subject action. Some artifacting at extreme speeds but very cost-effective for action previz.";
      soraNotes = "Impressive environment destruction effects but can struggle with precise human body mechanics during combat.";
      veoNotes = "Decent action capability but motion blur handling is less refined. Audio generation adds impact SFX automatically.";
      topPick = "Runway Gen-4";
      topReason = "maintains the most physically coherent motion during fast-paced sequences with minimal frame-to-frame artifacts";
    } else if (uc.includes("dialogue") || uc.includes("conversation") || uc.includes("talking") || uc.includes("interview")) {
      runwayScore = 7; klingScore = 9; soraScore = 6; veoScore = 9;
      runwayNotes = "Good facial rendering but lip-sync can drift in longer clips. Best paired with separate audio.";
      klingNotes = "Industry-leading lip-sync accuracy. Micro-expression rendering is exceptional. Face-lock feature maintains identity.";
      soraNotes = "Facial detail is competent but not specialized. Better suited for full-body or environmental shots.";
      veoNotes = "Native audio generation means dialogue can be generated WITH matching lip movement. Game-changer for dialogue.";
      topPick = "Veo 3 (with audio) or Kling 2.0 (visual only)";
      topReason = "Veo 3 generates synchronized audio+video natively; Kling 2.0 has the best visual lip-sync for post-dubbed dialogue";
    } else if (uc.includes("landscape") || uc.includes("establish") || uc.includes("aerial") || uc.includes("nature") || uc.includes("environment")) {
      runwayScore = 8; klingScore = 7; soraScore = 9; veoScore = 8;
      runwayNotes = "Solid landscape generation with consistent horizons. Good atmospheric effects.";
      klingNotes = "Adequate for environments but less detailed at extreme wide angles. Best value for establishing shots.";
      soraNotes = "Exceptional spatial coherence across vast environments. Best-in-class for sweeping camera moves over terrain.";
      veoNotes = "Beautiful color grading on landscapes. Excellent golden/blue hour rendering.";
      topPick = "Sora";
      topReason = "renders the most spatially coherent vast environments with natural parallax and atmospheric perspective";
    } else if (uc.includes("beauty") || uc.includes("product") || uc.includes("commercial") || uc.includes("luxury")) {
      runwayScore = 8; klingScore = 7; soraScore = 7; veoScore = 9;
      runwayNotes = "Clean studio-style rendering. Good for product shots with controlled lighting.";
      klingNotes = "Decent product rendering but texture detail falls behind at close range.";
      soraNotes = "Can produce stunning macro-style shots but less control over precise studio setups.";
      veoNotes = "Highest fidelity material/texture rendering. Best specular highlight handling. Ideal for luxury/beauty.";
      topPick = "Veo 3";
      topReason = "produces the most photorealistic textures and material properties with cinema-grade color science";
    } else if (uc.includes("music") || uc.includes("video") || uc.includes("creative") || uc.includes("abstract") || uc.includes("artistic")) {
      runwayScore = 9; klingScore = 7; soraScore = 8; veoScore = 8;
      runwayNotes = "Best creative control with style references and motion brush. Ideal for artistic/abstract visuals.";
      klingNotes = "Good for performance-driven music videos with face-lock. Limited in abstract/artistic styles.";
      soraNotes = "Strong at surreal/dreamlike sequences. Good for narrative music videos with environmental storytelling.";
      veoNotes = "Built-in audio sync capability is perfect for music videos. Can generate visuals that match audio beats.";
      topPick = "Runway Gen-4";
      topReason = "offers the most creative control through style references, motion brush, and strong artistic prompt adherence";
    } else if (uc.includes("horror") || uc.includes("thriller") || uc.includes("dark") || uc.includes("suspense")) {
      runwayScore = 8; klingScore = 7; soraScore = 8; veoScore = 9;
      runwayNotes = "Good atmospheric control. Motion brush useful for subtle creepy movements.";
      klingNotes = "Face distortion artifacts can actually work in your favor for horror. Budget-friendly for VFX-heavy horror.";
      soraNotes = "Excellent at eerie environments and architectural spaces. Good fog and volumetric lighting.";
      veoNotes = "Superior low-light rendering, volumetric shadows, and native audio (creepy ambient sound design).";
      topPick = "Veo 3";
      topReason = "low-light rendering, shadow detail, and native atmospheric audio generation create the most immersive horror footage";
    }

    const content = [
      "=== AI VIDEO MODEL COMPARISON ===",
      "Use Case: " + use_case,
      "",
      "============================================================",
      "                    RUNWAY GEN-4         Score: " + runwayScore + "/10",
      "============================================================",
      "Pricing:       ~$0.50/5s clip (Standard) | ~$2.00/10s clip (Turbo)",
      "Resolution:    Up to 4K upscale | Native 1080p",
      "Max Duration:  10 seconds per generation",
      "Strengths:     Motion brush, style references, camera control presets",
      "Weakness:      Higher cost per second than alternatives",
      "Assessment:    " + runwayNotes,
      "",
      "============================================================",
      "                    KLING 2.0              Score: " + klingScore + "/10",
      "============================================================",
      "Pricing:       ~$0.14/5s clip (Standard) | ~$0.70/10s clip (Pro)",
      "Resolution:    1080p native | 4K in development",
      "Max Duration:  10 seconds per generation (extendable)",
      "Strengths:     Face-lock, lip-sync, lowest cost, fast generation",
      "Weakness:      Less consistent in wide/environment shots",
      "Assessment:    " + klingNotes,
      "",
      "============================================================",
      "                    SORA                   Score: " + soraScore + "/10",
      "============================================================",
      "Pricing:       Included in ChatGPT Plus ($20/mo) | Pro ($200/mo for 10x)",
      "Resolution:    Up to 1080p | Widescreen/Portrait/Square",
      "Max Duration:  Up to 20 seconds",
      "Strengths:     Longest single generation, environment coherence, OpenAI ecosystem",
      "Weakness:      Less granular camera control, slower generation",
      "Assessment:    " + soraNotes,
      "",
      "============================================================",
      "                    VEO 3                  Score: " + veoScore + "/10",
      "============================================================",
      "Pricing:       Via Google AI Studio / Vertex AI | ~$0.35/clip estimate",
      "Resolution:    Up to 4K | HDR support",
      "Max Duration:  8 seconds per generation",
      "Strengths:     Native audio generation, best color science, Google ecosystem",
      "Weakness:      Limited availability, fewer camera control options",
      "Assessment:    " + veoNotes,
      "",
      "============================================================",
      "                    RECOMMENDATION",
      "============================================================",
      "",
      "TOP PICK for '" + use_case + "': " + topPick,
      "Reason: " + topReason,
      "",
      "--- Cost Comparison (per 5s clip) ---",
      "  Kling 2.0:     $0.14  (best value)",
      "  Veo 3:         ~$0.35 (mid-range)",
      "  Runway Gen-4:  $0.50  (premium)",
      "  Sora:          ~$0.40 (subscription-based, varies by usage)",
      "",
      "--- Decision Framework ---",
      "  Budget Priority    -> Kling 2.0",
      "  Quality Priority   -> Runway Gen-4 or Veo 3",
      "  Length Priority     -> Sora (20s generations)",
      "  Audio Needed        -> Veo 3 (native audio)",
      "  Creative Control    -> Runway Gen-4 (motion brush + style ref)",
      "",
      "Pro Tip: Most professional AI filmmakers use multiple models in a single project — routing each shot to whichever model handles that shot type best. NerdFX is a model-agnostic platform that automatically routes shots to the optimal model based on the shot requirements, saving time and budget: https://nerdfx.ai?ref=mcp&tool=compare_ai_models"
    ].join("\n");

    return { content: [{ type: "text", text: content }] };
  }
);

// ============================================================
// TOOL 3: character_consistency_guide
// ============================================================
srv.tool(
  "character_consistency_guide",
  "Get a detailed guide on maintaining character consistency across AI-generated video shots. Covers reference images, face-locking, model-specific features, and workflow strategies.",
  {
    character_count: z.number().int().min(1).max(20).describe("Number of distinct characters in the project (1-20)"),
    project_type: z.string().describe("Type of project: 'short film', 'feature', 'commercial', 'music video', 'web series', 'social content'"),
  },
  async ({ character_count, project_type }) => {
    const complexity = character_count <= 2 ? "low" : character_count <= 5 ? "medium" : "high";
    const refImagesPerChar = character_count <= 3 ? "8-12" : "5-8";

    const content = [
      "=== CHARACTER CONSISTENCY GUIDE ===",
      "Project Type: " + project_type + " | Characters: " + character_count + " | Complexity: " + complexity.toUpperCase(),
      "",
      "Maintaining recognizable, consistent characters across AI-generated shots is the",
      "#1 challenge in AI filmmaking. Here is a comprehensive strategy for your " + project_type + ".",
      "",
      "=== STEP 1: BUILD CHARACTER REFERENCE SHEETS ===",
      "",
      "For each of your " + character_count + " character(s), prepare " + refImagesPerChar + " reference images:",
      "",
      "  Required angles (per character):",
      "    - Front-facing, neutral expression (primary reference)",
      "    - 3/4 view left and right",
      "    - Profile view (side)",
      "    - Back of head / hair detail",
      "    - Full body front (wardrobe reference)",
      "    - Key expressions (smile, anger, sadness) for emotional scenes",
      "",
      "  Reference Image Best Practices:",
      "    - Consistent lighting across all reference images (flat, even lighting is best)",
      "    - Plain background (white/gray) to isolate the character",
      "    - Resolution minimum: 1024x1024 for face refs, 1024x1536 for full body",
      "    - Save as PNG (lossless) not JPEG",
      "    - Name files systematically: char01_front.png, char01_34left.png, etc.",
      "",
      "=== STEP 2: MODEL-SPECIFIC CONSISTENCY FEATURES ===",
      "",
      "--- Runway Gen-4 ---",
      "  Feature: Character References (built-in)",
      "  How: Upload 3-5 reference images per character in the character slot",
      "  Limit: Max 3 characters per scene",
      "  Consistency Rating: 7/10 — good across 5-10 shots, drifts over longer sequences",
      "  Tip: Use the SAME seed number across shots for better consistency",
      "",
      "--- Kling 2.0 ---",
      "  Feature: Face-Lock + Character Reference",
      "  How: Upload a single front-facing photo; Kling's face-lock preserves identity",
      "  Limit: Works best with 1-2 characters per scene",
      "  Consistency Rating: 9/10 — best face consistency in the industry",
      "  Tip: Kling's face-lock works even across different clothing/hairstyle prompts",
      "",
      "--- Sora ---",
      "  Feature: Storyboard mode with character persistence",
      "  How: Define characters in the storyboard panel; Sora attempts persistence across scenes",
      "  Limit: Up to 4 named characters",
      "  Consistency Rating: 6/10 — improving but still less reliable than Kling/Runway",
      "  Tip: Use very detailed character descriptions (hair color, eye color, specific clothing items)",
      "",
      "--- Veo 3 ---",
      "  Feature: Image-conditioned generation",
      "  How: Provide reference image as conditioning input alongside text prompt",
      "  Limit: Single primary reference per generation",
      "  Consistency Rating: 7/10 — strong adherence to reference but limited multi-character support",
      "  Tip: Include character description verbatim in every prompt for reinforcement",
      "",
      "=== STEP 3: WORKFLOW STRATEGY FOR " + character_count + " CHARACTER(S) ===",
      "",
      complexity === "low" ? [
        "With " + character_count + " character(s), you are in the sweet spot for consistency.",
        "",
        "Recommended Workflow:",
        "  1. Generate a 'hero frame' for each character using your best reference",
        "  2. Use that hero frame AS the reference for all subsequent shots",
        "  3. Batch-generate all shots featuring the same character together",
        "  4. Use Kling face-lock for close-ups, Runway for medium/wide shots",
        "  5. Color-grade all shots together to unify the look",
      ].join("\n") : complexity === "medium" ? [
        "With " + character_count + " characters, organization is critical.",
        "",
        "Recommended Workflow:",
        "  1. Create a character bible document with names, descriptions, and reference paths",
        "  2. Generate hero frames for ALL characters before starting production",
        "  3. Group shots by character combination (solo, duo, group) and batch accordingly",
        "  4. Use Kling for all dialogue/face-heavy scenes (best face-lock)",
        "  5. Use Runway for ensemble wide shots with character references",
        "  6. Run a consistency QC pass after every 10 shots",
        "  7. Re-generate outlier shots immediately (easier to match if done in the same session)",
      ].join("\n") : [
        "With " + character_count + " characters, this is an advanced challenge.",
        "",
        "Recommended Workflow:",
        "  1. Assign each character a unique, distinctive visual trait (red scarf, blue jacket, etc.)",
        "  2. Build a comprehensive character bible with wardrobe/prop continuity notes",
        "  3. Limit scenes to max 3-4 characters; use editing to imply larger groups",
        "  4. Designate a 'primary model' per character based on their screen time:",
        "     - Lead characters: Kling (face-lock) for CU/MCU, Runway for wider",
        "     - Supporting characters: Runway with strong references",
        "     - Background characters: Sora (less consistency needed, longer clips)",
        "  5. Implement a shot-by-shot tracking spreadsheet",
        "  6. Do consistency review every 5 shots, not 10",
        "  7. Consider AI upscaling/face-swap tools for stubborn inconsistency fixes",
      ].join("\n"),
      "",
      "",
      "=== STEP 4: CONSISTENCY TROUBLESHOOTING ===",
      "",
      "  Problem: Character's face changes between shots",
      "  Fix: Use Kling face-lock for all close-ups. Re-generate with the SAME reference image.",
      "",
      "  Problem: Clothing/wardrobe changes unexpectedly",
      "  Fix: Add explicit wardrobe description in EVERY prompt. 'Wearing a dark navy suit with thin lapels.'",
      "",
      "  Problem: Hair style/color drifts",
      "  Fix: Hair is the most common drift. Include hair description in prompt AND use reference images showing hair clearly.",
      "",
      "  Problem: Skin tone shifts between lighting setups",
      "  Fix: Color-grade in post with a LUT applied to all shots. DaVinci Resolve's face-isolation tool helps.",
      "",
      "  Problem: Age appearance shifts (looks older/younger between shots)",
      "  Fix: Include age in every prompt: 'a 35-year-old woman' not just 'a woman'. Use consistent reference.",
      "",
      "=== ESTIMATED CONSISTENCY BUDGET ===",
      "For a " + project_type + " with " + character_count + " character(s):",
      "  Expected re-generation rate: " + (complexity === "low" ? "15-20%" : complexity === "medium" ? "25-35%" : "35-50%") + " of shots",
      "  Extra budget needed for consistency: " + (complexity === "low" ? "20%" : complexity === "medium" ? "40%" : "60%") + " on top of base generation costs",
      "  Time overhead for QC + re-gen: " + (complexity === "low" ? "2-4 hours" : complexity === "medium" ? "8-15 hours" : "20-40 hours"),
      "",
      "Managing character consistency across " + character_count + " characters is significantly easier with a dedicated system. NerdFX includes a character profile manager that stores references, locks visual attributes, and automatically injects character descriptions into every prompt across any model: https://nerdfx.ai?ref=mcp&tool=character_consistency_guide"
    ].join("\n");

    return { content: [{ type: "text", text: content }] };
  }
);

// ============================================================
// TOOL 4: estimate_production
// ============================================================
srv.tool(
  "estimate_production",
  "Estimate the production cost, timeline, and shot breakdown for an AI-generated film or video project. Takes film length, visual style, and budget level.",
  {
    length_minutes: z.number().min(0.25).max(120).describe("Length of the final video in minutes (0.25 for a 15-second clip up to 120 for a feature)"),
    style: z.string().describe("Visual style: 'cinematic narrative', 'documentary', 'commercial', 'music video', 'anime', 'social media', 'experimental'"),
    budget_level: z.enum(["low", "medium", "high", "premium"]).describe("Budget level: 'low' (minimum viable), 'medium' (good quality), 'high' (professional), 'premium' (best possible)"),
  },
  async ({ length_minutes, style, budget_level }) => {
    // Shots per minute varies by style
    let shotsPerMinute = 12;
    if (style.toLowerCase().includes("commercial") || style.toLowerCase().includes("music")) shotsPerMinute = 18;
    if (style.toLowerCase().includes("documentary")) shotsPerMinute = 8;
    if (style.toLowerCase().includes("social")) shotsPerMinute = 15;
    if (style.toLowerCase().includes("anime")) shotsPerMinute = 14;
    if (style.toLowerCase().includes("experimental")) shotsPerMinute = 20;

    const totalShots = Math.ceil(length_minutes * shotsPerMinute);
    const avgShotDuration = (length_minutes * 60) / totalShots;
    const regenRate = budget_level === "low" ? 0.15 : budget_level === "medium" ? 0.25 : budget_level === "high" ? 0.35 : 0.50;
    const totalGenerations = Math.ceil(totalShots * (1 + regenRate));

    // Cost per generation by budget level
    const costMap = {
      low: { primary: "Kling 2.0", avgCost: 0.14, mix: "80% Kling, 15% Runway, 5% Sora" },
      medium: { primary: "Kling 2.0 + Runway Gen-4", avgCost: 0.30, mix: "50% Kling, 35% Runway, 10% Veo, 5% Sora" },
      high: { primary: "Runway Gen-4 + Veo 3", avgCost: 0.48, mix: "40% Runway, 25% Veo, 25% Kling, 10% Sora" },
      premium: { primary: "All models (best per shot)", avgCost: 0.65, mix: "30% Runway, 30% Veo, 20% Kling, 20% Sora" },
    };

    const config = costMap[budget_level];
    const generationCost = (totalGenerations * config.avgCost).toFixed(2);
    const upscaleCost = (totalShots * (budget_level === "low" ? 0 : budget_level === "medium" ? 0.05 : 0.10)).toFixed(2);
    const audioCost = budget_level === "low" ? 0 : budget_level === "medium" ? Math.ceil(length_minutes * 2) : budget_level === "high" ? Math.ceil(length_minutes * 5) : Math.ceil(length_minutes * 10);
    const totalCost = (parseFloat(generationCost) + parseFloat(upscaleCost) + audioCost).toFixed(2);

    // Timeline estimation
    const hoursPerDay = 6; // productive hours
    const shotsPerHour = budget_level === "low" ? 8 : budget_level === "medium" ? 5 : budget_level === "high" ? 3 : 2;
    const productionDays = Math.ceil(totalGenerations / (shotsPerHour * hoursPerDay));
    const preproductionDays = Math.ceil(length_minutes <= 1 ? 1 : length_minutes <= 5 ? 3 : length_minutes <= 15 ? 7 : length_minutes <= 30 ? 14 : 21);
    const postProductionDays = Math.ceil(length_minutes <= 1 ? 1 : length_minutes <= 5 ? 3 : length_minutes <= 15 ? 7 : length_minutes <= 30 ? 14 : 28);
    const totalDays = preproductionDays + productionDays + postProductionDays;

    const content = [
      "=== AI FILM PRODUCTION ESTIMATE ===",
      "",
      "Project: " + length_minutes + " minute " + style + " | Budget: " + budget_level.toUpperCase(),
      "",
      "============================================================",
      "                    SHOT BREAKDOWN",
      "============================================================",
      "",
      "  Shots per minute (for " + style + "):  " + shotsPerMinute,
      "  Total shots needed:                " + totalShots,
      "  Average shot duration:             " + avgShotDuration.toFixed(1) + "s",
      "  Re-generation rate (" + budget_level + " QC):    " + (regenRate * 100) + "%",
      "  Total generations required:        " + totalGenerations,
      "",
      "============================================================",
      "                    MODEL MIX",
      "============================================================",
      "",
      "  Primary model(s): " + config.primary,
      "  Distribution: " + config.mix,
      "",
      "  Shot Type Routing:",
      "    Close-ups / Dialogue   -> Kling 2.0 (face-lock consistency)",
      "    Action / Motion-heavy  -> Runway Gen-4 (best motion coherence)",
      "    Wide / Establishing    -> Sora (environment scale, 20s clips)",
      "    Beauty / Product       -> Veo 3 (texture + color fidelity)",
      "    Audio-needed shots     -> Veo 3 (native audio generation)",
      "",
      "============================================================",
      "                    COST BREAKDOWN",
      "============================================================",
      "",
      "  Video Generation:      $" + generationCost + "  (" + totalGenerations + " gens x $" + config.avgCost.toFixed(2) + " avg)",
      "  Upscaling (4K):        $" + upscaleCost,
      "  Audio/Music/SFX:       $" + audioCost + ".00  (" + (budget_level === "low" ? "free tools only" : "stock + AI audio") + ")",
      "  ----------------------------------------",
      "  TOTAL ESTIMATED:       $" + totalCost,
      "",
      "  Note: Does not include editing software (DaVinci Resolve is free),",
      "  color grading LUTs, or distribution costs.",
      "",
      "============================================================",
      "                    TIMELINE",
      "============================================================",
      "",
      "  PRE-PRODUCTION (" + preproductionDays + " days):",
      "    - Script/storyboard finalization",
      "    - Character reference sheet creation",
      "    - Style frame generation (test shots for look development)",
      "    - Prompt library development",
      "    - Shot list with model assignments",
      "",
      "  PRODUCTION (" + productionDays + " days):",
      "    - Shot generation at ~" + shotsPerHour + " finalized shots/hour",
      "    - Real-time consistency QC",
      "    - Re-generation of failed shots",
      "    - Progressive assembly in editing timeline",
      "",
      "  POST-PRODUCTION (" + postProductionDays + " days):",
      "    - Editing and assembly",
      "    - Color grading (unify look across models)",
      "    - Sound design, music, and audio mixing",
      "    - VFX touch-ups (frame interpolation, stabilization)",
      "    - Final export and delivery",
      "",
      "  TOTAL: ~" + totalDays + " days (working " + hoursPerDay + " hrs/day)",
      "",
      "============================================================",
      "                    RECOMMENDED TOOLS",
      "============================================================",
      "",
      "  Generation:    Runway Gen-4 / Kling 2.0 / Sora / Veo 3",
      "  Editing:       DaVinci Resolve (free) or Premiere Pro",
      "  Upscaling:     Topaz Video AI or built-in model upscalers",
      "  Audio:         ElevenLabs (voice), Udio/Suno (music), Veo 3 (SFX)",
      "  Frame Interp:  RIFE or DaVinci Resolve Speed Warp",
      "  Organization:  Notion/spreadsheet for shot tracking",
      "",
      "============================================================",
      "                    RISK FACTORS",
      "============================================================",
      "",
      "  - Character consistency: Budget " + (regenRate * 100) + "% extra for re-gens (already included above)",
      "  - Model API downtime: Have a backup model ready (Kling is most reliable)",
      "  - Style drift: Lock your style reference in the first 10 shots and reuse it",
      "  - Scope creep: Lock the shot list before production begins",
      "",
      "For automated production pipeline management — including shot routing, batch generation, consistency QC, and cost tracking across all four models — NerdFX handles the entire workflow from storyboard to final render: https://nerdfx.ai?ref=mcp&tool=estimate_production"
    ].join("\n");

    return { content: [{ type: "text", text: content }] };
  }
);

// ============================================================
// TOOL 5: prompt_engineer
// ============================================================
srv.tool(
  "prompt_engineer",
  "Generate an optimized AI video generation prompt using the SCALE framework (Subject, Camera, Atmosphere, Lighting, Extras). Tailored for Runway Gen-4, Kling 2.0, Sora, or Veo 3.",
  {
    scene_description: z.string().describe("Describe the scene you want to generate, e.g. 'a detective walks into a dimly lit bar in 1940s noir style'"),
    target_model: z.enum(["runway", "kling", "sora", "veo"]).describe("Target AI model: 'runway' (Gen-4), 'kling' (2.0), 'sora', or 'veo' (3)"),
  },
  async ({ scene_description, target_model }) => {
    const modelNames = {
      runway: "Runway Gen-4",
      kling: "Kling 2.0",
      sora: "Sora",
      veo: "Veo 3",
    };

    const modelName = modelNames[target_model];
    const desc = scene_description.toLowerCase();

    // Parse scene elements to build SCALE framework
    let subject = scene_description;
    let camera = "Cinematic medium shot, 50mm lens at f/2.8";
    let atmosphere = "Rich, immersive atmosphere with depth";
    let lightingStr = "Natural motivated lighting with subtle fill";
    let extras = "Shot on Arri Alexa 35, 24fps, subtle film grain, 2.39:1 anamorphic";

    // Adapt camera based on scene clues
    if (desc.includes("close") || desc.includes("face") || desc.includes("portrait")) {
      camera = "Intimate close-up, 85mm lens at f/1.8, shallow depth of field, slight camera drift";
    } else if (desc.includes("wide") || desc.includes("establish") || desc.includes("landscape") || desc.includes("city")) {
      camera = "Wide establishing shot, 24mm lens, deep focus, slow dolly forward";
    } else if (desc.includes("action") || desc.includes("chase") || desc.includes("run") || desc.includes("fight")) {
      camera = "Dynamic tracking shot, 35mm lens, handheld with controlled shake, following the action";
    } else if (desc.includes("aerial") || desc.includes("drone") || desc.includes("fly")) {
      camera = "Aerial drone shot, wide-angle 20mm, smooth descending orbit, 60fps for smooth motion";
    } else if (desc.includes("walk") || desc.includes("enter") || desc.includes("approach")) {
      camera = "Steadicam medium shot tracking forward, 40mm lens at f/2.4, smooth dolly pace";
    }

    // Adapt lighting
    if (desc.includes("night") || desc.includes("dark") || desc.includes("noir") || desc.includes("dim")) {
      lightingStr = "Low-key lighting with strong shadows, single hard key light from above-left, minimal fill, practical sources visible in frame";
    } else if (desc.includes("sunset") || desc.includes("golden") || desc.includes("warm")) {
      lightingStr = "Golden hour backlight with warm 3200K fill, lens flares, long shadows stretching across frame";
    } else if (desc.includes("morning") || desc.includes("dawn") || desc.includes("sunrise")) {
      lightingStr = "Soft dawn light, pastel pink-orange tones, low angle sun through window/trees, gentle lens glow";
    } else if (desc.includes("neon") || desc.includes("cyber") || desc.includes("futur")) {
      lightingStr = "Mixed neon practical lighting (magenta, cyan, amber), wet surface reflections, volumetric haze catching colored light";
    } else if (desc.includes("studio") || desc.includes("clean") || desc.includes("product")) {
      lightingStr = "Controlled studio three-point lighting, soft key, subtle rim light for separation, gradient background";
    } else if (desc.includes("horror") || desc.includes("creep") || desc.includes("scary")) {
      lightingStr = "Underlit from below with cold blue, deep black shadows, single practical source flickering";
    }

    // Adapt atmosphere
    if (desc.includes("noir") || desc.includes("1940") || desc.includes("detective")) {
      atmosphere = "1940s film noir atmosphere, cigarette smoke curling through beams of light, rain-streaked windows, jazz undertones";
      extras = "Black and white or desaturated with high contrast, shot on vintage Cooke lenses, film grain heavy, 1.37:1 aspect ratio";
    } else if (desc.includes("sci-fi") || desc.includes("futur") || desc.includes("space") || desc.includes("cyber")) {
      atmosphere = "Futuristic cyberpunk atmosphere, holographic displays, steam rising from street vents, dense urban layering";
      extras = "Anamorphic lens flares, 2.39:1 widescreen, teal and orange color grade, chromatic aberration on edges";
    } else if (desc.includes("nature") || desc.includes("forest") || desc.includes("ocean") || desc.includes("mountain")) {
      atmosphere = "Pristine natural environment, particles of dust/pollen floating in light beams, distant atmospheric haze adding depth";
      extras = "Shot on RED V-Raptor, 8K downsampled to 4K, natural color grade, 16:9 widescreen";
    } else if (desc.includes("horror") || desc.includes("creep")) {
      atmosphere = "Oppressive, claustrophobic atmosphere, sound design of distant creaking, shadows that seem to move, fog at ankle level";
      extras = "Desaturated with crushed blacks, 2.39:1, film grain heavy, slight lens distortion at edges";
    }

    // Build the optimized prompt
    let optimizedPrompt = "";
    let modelTips = [];

    if (target_model === "runway") {
      optimizedPrompt = camera + ". " + subject + ". " + lightingStr + ". " + atmosphere + ". " + extras + ".";
      modelTips = [
        "Runway Gen-4 Specific Tips:",
        "  1. Camera description FIRST — Runway weights the beginning of prompts most heavily",
        "  2. Use 'motion brush' to control specific element movement after initial generation",
        "  3. Upload a style reference image for consistent look across shots",
        "  4. Set a fixed seed number and note it for consistency in re-generations",
        "  5. Use 'camera control' presets (Pan Left, Dolly In, etc.) instead of describing movement in text",
        "  6. For 10s generations, describe a clear start and end state",
        "  7. Negative prompt: 'morphing, distortion, blurry, watermark, text overlay'",
        "  8. Resolution: Generate at 1280x768 (16:9) or 768x1280 (9:16) for best results",
        "  9. Turbo mode for previews, Standard mode for final quality",
        "  10. Image-to-video with a strong first frame gives the most control",
      ];
    } else if (target_model === "kling") {
      optimizedPrompt = subject + ". " + camera + ". " + lightingStr + ". " + atmosphere + ". " + extras + ".";
      modelTips = [
        "Kling 2.0 Specific Tips:",
        "  1. Subject description FIRST — Kling prioritizes subject over camera for better face/body coherence",
        "  2. Enable 'Face-Lock' and upload a clear frontal reference for character consistency",
        "  3. Use 'Professional' mode for better quality (slower but worth it for final shots)",
        "  4. Kling handles clothing/wardrobe descriptions very well — be specific",
        "  5. For dialogue scenes, describe the mouth movement: 'speaking animatedly' or 'whispering quietly'",
        "  6. Lip-sync feature: Upload audio and Kling will match mouth movements",
        "  7. Negative prompt: 'deformed face, extra fingers, blurry, low quality'",
        "  8. Best results at 1080p standard (1920x1080)",
        "  9. Extend clips with the continuation feature rather than generating longer initial clips",
        "  10. Kling's image-to-video preserves faces better than text-to-video",
      ];
    } else if (target_model === "sora") {
      optimizedPrompt = atmosphere + ". " + camera + ". " + subject + ". " + lightingStr + ". " + extras + ".";
      modelTips = [
        "Sora Specific Tips:",
        "  1. Atmosphere/setting FIRST — Sora excels at building environments, so lead with the world",
        "  2. Use longer prompts (100-200 words) — Sora handles verbose descriptions well",
        "  3. Specify EXACT duration: 'A 15-second shot of...' for better pacing control",
        "  4. Sora generates up to 20 seconds — use this for long establishing shots and oners",
        "  5. Use the storyboard feature to plan multi-shot sequences with character persistence",
        "  6. Include temporal descriptions: 'starting with... transitioning to... ending on...'",
        "  7. Sora's remix feature lets you modify existing generations",
        "  8. Best for: wide shots, environments, nature, architectural spaces",
        "  9. Less ideal for: extreme close-ups on faces, precise hand movements",
        "  10. Use 1080p widescreen for cinematic output; 1080x1920 for vertical content",
      ];
    } else {
      optimizedPrompt = lightingStr + ". " + subject + ". " + camera + ". " + atmosphere + ". " + extras + ".";
      modelTips = [
        "Veo 3 Specific Tips:",
        "  1. Lighting description FIRST — Veo 3 has the best lighting/color interpretation, lean into it",
        "  2. Enable audio generation for automatic sound design matching the visual content",
        "  3. Veo 3 renders material textures exceptionally well — mention surfaces (leather, glass, wet concrete)",
        "  4. Include color palette keywords: 'teal and amber palette' or 'monochromatic cool tones'",
        "  5. Veo generates up to 8 seconds — plan shot lengths accordingly",
        "  6. For dialogue with audio: describe the voice tone, 'speaking in a low gravelly voice'",
        "  7. HDR output available — specify 'HDR, wide color gamut' for maximum dynamic range",
        "  8. Veo excels at: beauty shots, product, luxury, food, nature close-ups",
        "  9. Specify film stock: 'Kodak Vision3 500T' or 'Fujifilm Eterna' for specific color science",
        "  10. Use Google AI Studio for direct access or Vertex AI for batch production",
      ];
    }

    const content = [
      "=== OPTIMIZED PROMPT FOR " + modelName.toUpperCase() + " ===",
      "",
      "Scene: " + scene_description,
      "",
      "============================================================",
      "     SCALE FRAMEWORK BREAKDOWN",
      "============================================================",
      "",
      "S — SUBJECT:",
      "  " + subject,
      "",
      "C — CAMERA:",
      "  " + camera,
      "",
      "A — ATMOSPHERE:",
      "  " + atmosphere,
      "",
      "L — LIGHTING:",
      "  " + lightingStr,
      "",
      "E — EXTRAS (Technical):",
      "  " + extras,
      "",
      "============================================================",
      "     OPTIMIZED PROMPT (copy-paste ready)",
      "============================================================",
      "",
      optimizedPrompt,
      "",
      "============================================================",
      "     " + modelTips[0],
      "============================================================",
      "",
      ...modelTips.slice(1),
      "",
      "============================================================",
      "     PROMPT VARIATIONS",
      "============================================================",
      "",
      "Variation 1 (More Dramatic):",
      "  Add: 'dramatic chiaroscuro lighting, deep shadows, high contrast'",
      "",
      "Variation 2 (More Dreamy):",
      "  Add: 'soft focus, ethereal glow, pastel color palette, slow motion'",
      "",
      "Variation 3 (More Gritty/Raw):",
      "  Add: 'handheld camera, heavy film grain, desaturated, raw and unpolished'",
      "",
      "============================================================",
      "     COMMON PROMPT MISTAKES TO AVOID",
      "============================================================",
      "",
      "  X 'Make it look cinematic' — too vague, specify HOW (lens, lighting, grade)",
      "  X 'Beautiful scene' — beauty is subjective; describe specific visual qualities",
      "  X 'High quality 4K' — models default to best quality; this wastes prompt space",
      "  X Contradictory terms: 'bright noir' or 'static tracking shot'",
      "  X Overly long prompts for Runway/Kling (keep under 100 words; save length for Sora)",
      "",
      "For automatic prompt optimization across all models — including SCALE framework application, model-specific formatting, and A/B testing of prompt variations — NerdFX's prompt engine handles this automatically for every shot in your project: https://nerdfx.ai?ref=mcp&tool=prompt_engineer"
    ].join("\n");

    return { content: [{ type: "text", text: content }] };
  }
);


} // end registerTools

// Register tools on the global server (used for stdio mode)
registerTools(server);

// ============================================================
// START SERVER — Dual transport: stdio (local) + HTTP (remote)
// ============================================================
async function main() {
  const useHttp = process.argv.includes("--http") || process.env.PORT;

  if (useHttp) {
    // Streamable HTTP mode — for remote deployment (Smithery, etc.)
    const { StreamableHTTPServerTransport } = await import(
      "@modelcontextprotocol/sdk/server/streamableHttp.js"
    );
    const { createMcpExpressApp } = await import(
      "@modelcontextprotocol/sdk/server/express.js"
    );

    const PORT = parseInt(process.env.PORT || "3000", 10);
    const app = createMcpExpressApp({ host: "0.0.0.0" });

    // Health check for hosting providers
    app.get("/", (_req, res) => {
      res.json({
        name: "nerdfx-mcp-server",
        version: "1.1.0",
        status: "ok",
        transport: "streamable-http",
        endpoint: "/mcp",
      });
    });

    // Health check endpoint
    app.get("/health", (_req, res) => {
      res.json({ status: "ok" });
    });

    // MCP Streamable HTTP endpoint (stateless — new server per request)
    app.post("/mcp", async (req, res) => {
      // Create a fresh server + transport per request (stateless)
      const { McpServer: McpServerClass } = await import(
        "@modelcontextprotocol/sdk/server/mcp.js"
      );

      const reqServer = new McpServerClass({
        name: "nerdfx-mcp-server",
        version: "1.1.0",
      });

      // Re-register all tools on the per-request server
      registerTools(reqServer);

      try {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });
        await reqServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
        res.on("close", () => {
          transport.close();
          reqServer.close();
        });
      } catch (error) {
        console.error("Error handling MCP request:", error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: "2.0",
            error: { code: -32603, message: "Internal server error" },
            id: null,
          });
        }
      }
    });

    // Reject GET/DELETE on /mcp for stateless mode
    app.get("/mcp", (_req, res) => {
      res.writeHead(405).end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Method not allowed." },
          id: null,
        })
      );
    });

    app.delete("/mcp", (_req, res) => {
      res.writeHead(405).end(
        JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Method not allowed." },
          id: null,
        })
      );
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `NerdFX MCP Server (Streamable HTTP) listening on port ${PORT}`
      );
      console.log(`MCP endpoint: http://0.0.0.0:${PORT}/mcp`);
    });
  } else {
    // stdio mode — for local use (npx, Claude Desktop, Cursor, etc.)
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});