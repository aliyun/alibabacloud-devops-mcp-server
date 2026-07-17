import pino from "pino";

/**
 * 统一日志工具。
 *
 * ⚠️ 重要：MCP stdio 模式下 stdout 是 JSON-RPC 协议通道，任何写入 stdout 的日志
 * 都会污染协议、导致客户端解析失败。因此日志默认写入 stderr（fd 2）。
 * HTTP(SSE / Streamable)模式下 stdout 未被协议占用，可用 LOG_DEST=stdout 让日志改写
 * stdout，便于按 stdout 采集的日志系统（如 SLS）抓取。⚠️ stdio 模式切勿设 LOG_DEST=stdout，
 * 否则会污染协议。任何情况下都不要用 console.log（stdout）打印日志，统一使用本模块。
 *
 * - 级别：通过环境变量 LOG_LEVEL 控制（默认 info；排查问题时设为 debug/trace）。
 * - 输出流：通过环境变量 LOG_DEST 控制（stdout / stderr，默认 stderr）。
 * - 脱敏：对 token / authorization 等敏感字段自动打码，避免令牌落日志。
 * - 分级建议：
 *   - error：真正的错误
 *   - warn ：可容忍的异常/降级
 *   - info ：关键生命周期（启动、连接、会话）
 *   - debug：请求元信息（method/url/脱敏后的 headers）
 *   - trace：请求/响应 body 等大字段（默认关闭）
 */
const level = process.env.LOG_LEVEL || "info";
// 输出流 fd：stdout(1) / stderr(2)。默认 stderr —— stdio 模式下 stdout 是 JSON-RPC 协议
// 通道，必须走 stderr；HTTP 模式 stdout 空闲，可设 LOG_DEST=stdout 便于日志采集。
const logDestFd = (process.env.LOG_DEST || "stderr").toLowerCase() === "stdout" ? 1 : 2;

export const logger = pino(
  {
    level,
    base: { pid: process.pid },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      // 用字符串级别（info/debug…）而非数字，便于 SLS 检索
      level(label) {
        return { level: label };
      },
    },
    redact: {
      paths: [
        "authorization",
        "Authorization",
        "token",
        "accessToken",
        'headers["x-yunxiao-token"]',
        "headers.authorization",
        "headers.Authorization",
        '["x-yunxiao-token"]',
      ],
      censor: "***",
    },
  },
  // sync 保证顺序与退出时不丢日志
  pino.destination({ dest: logDestFd, sync: true }),
);

export default logger;

/**
 * 从 URL 中去除敏感 query（如 yunxiao_access_token），用于安全地记录 URL。
 * 支持绝对 URL 与相对路径两种形态。
 */
export function sanitizeUrl(raw: string): string {
  const SENSITIVE_QUERY_KEYS = ["yunxiao_access_token", "accessToken", "token"];
  try {
    const isAbsolute = raw.startsWith("http://") || raw.startsWith("https://");
    const u = new URL(raw, "http://placeholder.local");
    let touched = false;
    for (const k of SENSITIVE_QUERY_KEYS) {
      if (u.searchParams.has(k)) {
        u.searchParams.set(k, "***");
        touched = true;
      }
    }
    if (!touched) return raw;
    return isAbsolute ? u.toString() : u.pathname + u.search;
  } catch {
    return raw;
  }
}
