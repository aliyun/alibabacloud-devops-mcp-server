#!/usr/bin/env node
/**
 * Automated test for the `get_current_organization_info` MCP tool.
 *
 * Strategy: spawn `dist/index.js` as a stdio child, drive it with raw
 * JSON-RPC messages (initialize -> notifications/initialized -> tools/call),
 * collect line-delimited JSON responses, then assert the tool result.
 *
 * Usage:
 *   npm run build
 *   node tests/test-get-current-organization-info.mjs
 *
 * Exit code: 0 on success, non-zero on failure.
 */
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import readline from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SERVER_ENTRY = resolve(ROOT, "dist", "index.js");
const ENV_FILE = resolve(ROOT, ".env");

if (!existsSync(SERVER_ENTRY)) {
  console.error(`[FATAL] ${SERVER_ENTRY} not found. Run "npm run build" first.`);
  process.exit(2);
}

// ---------- 1. Load .env into process.env (shallow parse, ignore comments) ----------
function loadEnv(file) {
  if (!existsSync(file)) return;
  const lines = readFileSync(file, "utf-8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
loadEnv(ENV_FILE);

if (!process.env.YUNXIAO_ACCESS_TOKEN) {
  console.error("[FATAL] YUNXIAO_ACCESS_TOKEN not set (check .env).");
  process.exit(2);
}

// ---------- 2. Spawn the MCP server ----------
const child = spawn(process.execPath, [SERVER_ENTRY], {
  cwd: ROOT,
  env: process.env,
  stdio: ["pipe", "pipe", "pipe"],
});

// Forward server stderr (where [DEBUG] logs go) to our stderr, prefixed.
child.stderr.on("data", (buf) => {
  process.stderr.write(`[server] ${buf}`);
});

child.on("error", (err) => {
  console.error("[FATAL] spawn error:", err);
  process.exit(2);
});

// ---------- 3. Line-delimited JSON-RPC framing on stdout ----------
const pending = new Map(); // id -> { resolve, reject }
const rl = readline.createInterface({ input: child.stdout });
rl.on("line", (line) => {
  const text = line.trim();
  if (!text) return;
  let msg;
  try {
    msg = JSON.parse(text);
  } catch {
    process.stderr.write(`[server-stdout-non-json] ${text}\n`);
    return;
  }
  if (msg.id !== undefined && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(msg.error);
    else resolve(msg.result);
  }
});

let nextId = 1;
function rpcCall(method, params, timeoutMs = 30_000) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error(`RPC timeout: ${method}`));
      }
    }, timeoutMs);
  });
}
function rpcNotify(method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: "2.0", method, params }) + "\n");
}

// ---------- 4. Tiny assertion helper ----------
let failed = 0;
function assert(cond, label, detail) {
  if (cond) {
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

// ---------- 5. Run the test scenario ----------
async function run() {
  console.log("▶ initialize");
  const initRes = await rpcCall("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "smoke-test", version: "1.0.0" },
  });
  assert(initRes && typeof initRes === "object", "initialize returns an object");
  assert(!!initRes?.serverInfo?.name, "serverInfo.name present", JSON.stringify(initRes?.serverInfo));

  rpcNotify("notifications/initialized");

  console.log("▶ tools/call get_current_organization_info");
  const toolRes = await rpcCall("tools/call", {
    name: "get_current_organization_info",
    arguments: {},
  });

  assert(toolRes && Array.isArray(toolRes.content), "result.content is an array");
  assert(toolRes.content?.[0]?.type === "text", "first content item type is 'text'");

  let payload;
  try {
    payload = JSON.parse(toolRes.content?.[0]?.text ?? "");
  } catch (e) {
    assert(false, "tool text payload is valid JSON", String(e));
  }

  console.log("\n--- Tool payload ---");
  console.log(JSON.stringify(payload, null, 2));
  console.log("--------------------\n");

  assert(payload && typeof payload === "object", "payload is an object");
  assert(typeof payload?.lastOrganization === "string" && payload.lastOrganization.length > 0,
    "payload.lastOrganization is a non-empty string", payload?.lastOrganization);
  assert(typeof payload?.userId === "string" && payload.userId.length > 0,
    "payload.userId is a non-empty string");
  assert(typeof payload?.userName === "string",
    "payload.userName is a string");
}

// ---------- 6. Drive ----------
const start = Date.now();
run()
  .then(() => {
    const ms = Date.now() - start;
    console.log(`\nTest finished in ${ms}ms. ${failed === 0 ? "ALL PASS" : `${failed} FAIL`}`);
    child.stdin.end();
    child.kill();
    process.exit(failed === 0 ? 0 : 1);
  })
  .catch((err) => {
    console.error("\n[FATAL] test scenario error:", err);
    child.stdin.end();
    child.kill();
    process.exit(2);
  });
