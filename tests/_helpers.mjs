// Shared helpers for the unit tests (not a test file: the runner only picks *.test.mjs).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const LIB = path.join(ROOT, "memoria", "rootfs", "app", "lib");
export const FRONT = path.join(ROOT, "frontend", "src");

/** A fresh temp directory, removed when the process exits. */
const made = [];
export function tmpDir(prefix = "memoria-test-") {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  made.push(dir);
  return dir;
}
process.on("exit", () => {
  for (const d of made) {
    try {
      fs.rmSync(d, { recursive: true, force: true });
    } catch (e) {
      /* best effort */
    }
  }
});

/** A logger that remembers what was said. */
export function fakeLog() {
  const log = { lines: [], info: (m) => log.lines.push(["info", m]), warn: (m) => log.lines.push(["warn", m]), error: (m) => log.lines.push(["error", m]) };
  log.of = (level) => log.lines.filter(([l]) => l === level).map(([, m]) => m);
  return log;
}

/** Local time in the test time zone (TZ=America/Sao_Paulo, UTC-3 all year since 2019). */
export const local = (y, mo, d, h = 0, mi = 0, s = 0, ms = 0) => new Date(y, mo - 1, d, h, mi, s, ms);

/** An HTTP server on a free port; handler(req, res, body). Returns {url, port, requests, close}. */
export async function httpServer(handler) {
  const requests = [];
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      requests.push({ method: req.method, url: req.url, headers: req.headers, rawHeaders: req.rawHeaders, body });
      handler(req, res, body);
    });
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    port,
    requests,
    close: () => new Promise((r) => (server.closeAllConnections?.(), server.close(() => r()))),
  };
}

/** A port that nothing listens on (bound then released). */
export async function closedPort() {
  const s = http.createServer();
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  const { port } = s.address();
  await new Promise((r) => s.close(r));
  return port;
}

export const json = (res, status, obj) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(obj));
};

/** Lets pending promise callbacks run. */
export const flushPromises = () => new Promise((r) => setImmediate(r));
