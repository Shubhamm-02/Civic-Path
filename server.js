import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8"
};

export function createStaticServer({ rootDir = process.cwd() } = {}) {
  return createServer(createRequestHandler({ rootDir }));
}

export function createRequestHandler({ rootDir = process.cwd() } = {}) {
  const root = resolve(rootDir);

  return async function handleStaticRequest(req, res) {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
      const filePath = resolveRequestPath(url.pathname, root);

      if (!filePath) {
        sendText(res, 403, "Forbidden");
        return;
      }

      const body = await readFile(filePath);
      res.writeHead(200, {
        "Content-Type": CONTENT_TYPES[extname(filePath)] || "application/octet-stream",
        "X-Content-Type-Options": "nosniff"
      });
      res.end(body);
    } catch {
      sendText(res, 404, "Not found");
    }
  };
}

export function resolveRequestPath(pathname, rootDir = process.cwd()) {
  const root = resolve(rootDir);
  const decodedPath = safelyDecodePath(pathname);
  const requestedPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const relativePath = requestedPath.replace(/^\/+/, "");
  const resolvedPath = resolve(root, relativePath);
  const rootBoundary = root.endsWith(sep) ? root : `${root}${sep}`;

  if (resolvedPath !== root && !resolvedPath.startsWith(rootBoundary)) {
    return null;
  }

  return resolvedPath;
}

function safelyDecodePath(pathname) {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return "/";
  }
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Content-Type-Options": "nosniff"
  });
  res.end(message);
}

const isEntryPoint = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isEntryPoint) {
  const port = Number(process.env.PORT) || 8080;
  createStaticServer().listen(port, "0.0.0.0", () => {
    console.log(`CivicPath listening on ${port}`);
  });
}
