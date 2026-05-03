import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { createRequestHandler, getCacheControl, resolveRequestPath } from "../server.js";

test("resolveRequestPath maps the root route to index.html", async () => {
  const root = await mkdtemp(join(tmpdir(), "civicpath-root-"));
  const resolved = resolveRequestPath("/", root);

  assert.equal(resolved, `${root}${sep}index.html`);
});

test("resolveRequestPath rejects encoded directory traversal", async () => {
  const root = await mkdtemp(join(tmpdir(), "civicpath-root-"));
  const resolved = resolveRequestPath("/%2e%2e/package.json", root);

  assert.equal(resolved, null);
});

test("createRequestHandler serves static files with safe content headers", async () => {
  const root = await mkdtemp(join(tmpdir(), "civicpath-server-"));
  await writeFile(join(root, "index.html"), "<h1>CivicPath</h1>", "utf8");

  const handler = createRequestHandler({ rootDir: root });
  const response = createMockResponse();
  await handler({ url: "/", headers: { host: "localhost" } }, response);

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers["Content-Type"], "text/html; charset=utf-8");
  assert.equal(response.headers["Cache-Control"], "no-cache");
  assert.equal(response.headers["X-Content-Type-Options"], "nosniff");
  assert.match(response.headers["Content-Security-Policy"], /generativelanguage\.googleapis\.com/);
  assert.equal(response.headers["Permissions-Policy"], "camera=(), geolocation=(), microphone=()");
  assert.equal(response.body, "<h1>CivicPath</h1>");
});

test("getCacheControl caches static resources for stable repeat loads", () => {
  assert.equal(getCacheControl(".js"), "public, max-age=3600");
  assert.equal(getCacheControl(".css"), "public, max-age=3600");
  assert.equal(getCacheControl(".html"), "no-cache");
});

function createMockResponse() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    writeHead(statusCode, headers) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(chunk = "") {
      this.body += chunk.toString();
    }
  };
}
