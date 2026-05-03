import test from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const RUNTIME_FILES = [
  "index.html",
  "server.js",
  "src/main.js",
  "src/electionAssistant.js",
  "src/electionData.js",
  "src/googleServices.js",
  "src/styles.css",
  "assets/civic-path.svg"
];

test("runtime files stay within a small performance budget", async () => {
  const sizes = await Promise.all(RUNTIME_FILES.map(async (file) => (await stat(file)).size));
  const totalBytes = sizes.reduce((total, size) => total + size, 0);

  assert.ok(totalBytes < 150_000, `runtime payload is ${totalBytes} bytes`);
});

test("project ships without npm runtime dependencies", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));

  assert.deepEqual(packageJson.dependencies || {}, {});
});

test("Google API client is lazy-loaded outside the first render path", async () => {
  const mainSource = await readFile("src/main.js", "utf8");

  assert.doesNotMatch(mainSource, /import\s+\{[^}]*askGemini[^}]*\}\s+from\s+["']\.\/googleServices\.js["']/);
  assert.match(mainSource, /import\("\.\/googleServices\.js"\)/);
});
