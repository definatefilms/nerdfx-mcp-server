import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const source = read("index.js");
const pkg = JSON.parse(read("package.json"));
const lock = JSON.parse(read("package-lock.json"));
const readme = read("README.md");

// Dependency-free contract harness: capture actual registrations and run the
// real advisory handlers without starting a transport or installing the SDK.
// Schema builders are stubs, not validation; this is not an MCP integration test.
const catalog = new Map();
const schema = () => {
  const value = {};
  for (const method of ["describe", "int", "min", "max"]) {
    value[method] = () => value;
  }
  return value;
};
const start = source.indexOf("function registerTools(srv) {");
const end = source.indexOf("} // end registerTools");
assert.ok(start >= 0 && end > start, "tool-registration boundaries exist");
const registrationSource = source.slice(start, end + 1);
const context = vm.createContext({
  z: { string: schema, number: schema, enum: schema },
  sink: {
    tool(name, description, inputs, handler) {
      assert.ok(!catalog.has(name), `duplicate tool: ${name}`);
      catalog.set(name, { description, inputs, handler });
    },
  },
});
vm.runInContext(`${registrationSource}\nregisterTools(sink);`, context, {
  timeout: 1000,
});

const expected = [
  "analyze_shot",
  "compare_ai_models",
  "character_consistency_guide",
  "estimate_production",
  "prompt_engineer",
];

test("canonical public repository, support, license, and version metadata", () => {
  const repo = "https://github.com/definatefilms/nerdfx-mcp-server";
  assert.equal(pkg.repository.url, repo);
  assert.equal(pkg.bugs.url, `${repo}/issues`);
  assert.equal(pkg.license, "MIT");
  assert.match(read("LICENSE"), /^MIT License/);
  assert.equal(lock.version, pkg.version);
  assert.equal(lock.packages[""].version, pkg.version);
  assert.match(pkg.description, /Offline advisory/);
  assert.match(pkg.description, /Does not generate media or spend credits/);
  assert.ok(readme.includes(repo));
  assert.ok(readme.includes(`${repo}/issues`));
  assert.doesNotMatch(readme, /github\.com\/nerdfx\/nerdfx-mcp-server/);
});

test("all five advertised tools declare the advisory-only boundary", () => {
  assert.deepEqual([...catalog.keys()], expected);
  for (const [name, tool] of catalog) {
    assert.match(tool.description, /offline advisory/i, name);
    assert.match(tool.description, /Returns text only/i, name);
    assert.match(tool.description, /does not.*generate media/i, name);
    assert.match(tool.description, /call providers, or spend credits/i, name);
    assert.ok(readme.includes(`\`${name}\``), name);
  }
});

test("estimation and comparison do not advertise live pricing", () => {
  assert.match(catalog.get("compare_ai_models").description, /not live or verified current/);
  assert.match(catalog.get("estimate_production").description, /not a live quote/);
  assert.match(readme, /not live provider lookups/);
});

test("docs distinguish transport, installation, and product licensing", () => {
  assert.match(readme, /Installation may require network access/);
  assert.match(readme, /Leave `PORT` unset/);
  assert.match(readme, /POST \/mcp/);
  assert.match(readme, /binds to `0\.0\.0\.0`/);
  assert.match(readme, /does not implement application authentication/);
  assert.match(readme, /not an authenticated NerdFX generation endpoint/);
  assert.match(readme, /separate authenticated NerdFX product integration/);
  assert.match(readme, /does not cover the separate proprietary NerdFX product/);
  assert.match(readme, /does not establish a published Smithery listing/);
});

// Synthetic capability-selection cases assert the public catalog's contract.
// They do not measure a model's actual tool-selection or recommendation behavior.
const selectionCases = [
  ["Suggest a lens for a rooftop shot", "analyze_shot"],
  ["Compare built-in model reference data", "compare_ai_models"],
  ["Plan consistency for three characters", "character_consistency_guide"],
  ["Estimate an illustrative two-minute production budget", "estimate_production"],
  ["Draft a SCALE prompt without submitting it", "prompt_engineer"],
];
for (const [request, name] of selectionCases) {
  test(`advisory catalog supports: ${request}`, () => {
    assert.ok(catalog.has(name));
    assert.match(catalog.get(name).description, /Returns text only/i);
  });
}

test("generation, uploads, job status, and credit actions are not public tools", () => {
  for (const unsupported of [
    "generate_video", "generate_image", "generate_audio", "upload_reference",
    "get_job_status", "cancel_job", "get_credit_balance", "purchase_credits",
  ]) {
    assert.equal(catalog.has(unsupported), false, unsupported);
  }
  assert.match(catalog.get("prompt_engineer").description, /does not submit the prompt/);
  assert.match(catalog.get("character_consistency_guide").description, /does not store characters, upload references/);
});

const handlerCases = [
  ["analyze_shot", { description: "aerial drone shot of a castle" }],
  ["analyze_shot", { description: "dialogue in a neon alley at night" }],
  ["compare_ai_models", { use_case: "action scene" }],
  ["compare_ai_models", { use_case: "dialogue close-up" }],
  ["character_consistency_guide", { character_count: 1, project_type: "short film" }],
  ["character_consistency_guide", { character_count: 20, project_type: "feature" }],
  ["estimate_production", { length_minutes: 0.25, style: "commercial", budget_level: "low" }],
  ["estimate_production", { length_minutes: 120, style: "documentary", budget_level: "premium" }],
  ...["runway", "kling", "sora", "veo"].map((target_model) => [
    "prompt_engineer",
    { scene_description: "a detective in a neon-lit alley", target_model },
  ]),
];
for (const [index, [name, args]] of handlerCases.entries()) {
  test(`real handler returns advisory text, not media: ${name} case ${index + 1}`, async () => {
    const result = await catalog.get(name).handler(args);
    assert.deepEqual(Object.keys(result), ["content"]);
    assert.equal(result.content.length, 1);
    assert.equal(result.content[0].type, "text");
    assert.equal(typeof result.content[0].text, "string");
    assert.ok(result.content[0].text.length > 0);
  });
}
