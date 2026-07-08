import { AsyncLocalStorage } from "node:async_hooks";
import { createHash } from "node:crypto";
import { getUserAgent } from "universal-user-agent";
import { createYunxiaoError, isYunxiaoError } from "./errors.js";
import { VERSION } from "./version.js";
import { logger, sanitizeUrl } from "./logger.js";

type RequestAuthContext = {
  token?: string;
  apiBaseUrl?: string;
  // 本次请求想启用的工具集（原始字符串，逗号分隔解析后的数组）；
  // 用于按请求裁剪 ListTools/CallTool，缓解工具过多导致的 context 膨胀。
  toolsets?: string[];
};

const requestContext = new AsyncLocalStorage<RequestAuthContext>();

export function runWithAuth<T>(auth: RequestAuthContext, fn: () => T): T {
  return requestContext.run(auth, fn);
}

/**
 * 获取本次请求指定的工具集（若未指定返回 undefined，调用方回退到全局默认）。
 */
export function getCurrentToolsets(): string[] | undefined {
  return requestContext.getStore()?.toolsets;
}

const DEFAULT_YUNXIAO_API_BASE_URL = "https://openapi-rdc.aliyuncs.com";

/**
 * Get the Yunxiao API base URL from environment variables or use the default
 * @returns The Yunxiao API base URL
 */
export function getYunxiaoApiBaseUrl(): string {
  return getCurrentSessionApiBaseUrl() || process.env.YUNXIAO_API_BASE_URL || DEFAULT_YUNXIAO_API_BASE_URL;
}

/**
 * 判断是否为 region 站。
 * 优先读显式配置 YUNXIAO_EDITION（central / region），解耦"站点判定"与"网络地址"——
 * 便于把 API 地址换成 K8s service 等不含 openapi-rdc.aliyuncs.com 的内网地址时仍正确判定。
 * 未显式配置时，回退到按 base url 域名判断(向后兼容):
 * - 域名包含 openapi-rdc.aliyuncs.com -> 中心站
 * - 其他域名 -> 认为是 region 站
 */
export function isRegionEdition(): boolean {
  const explicit = (process.env.YUNXIAO_EDITION || "").trim().toLowerCase();
  if (explicit === "central") return false;
  if (explicit === "region") return true;
  const baseUrl = getYunxiaoApiBaseUrl();
  return !baseUrl.includes("openapi-rdc.aliyuncs.com");
}

/**
 * region 站下使用的"默认 organizationId"（占位值）
 * - 默认使用 "default"
 * - 如有需要，可以通过环境变量覆盖
 */
export function getRegionDefaultOrganizationId(): string {
  return process.env.YUNXIAO_REGION_DEFAULT_ORG_ID || "default";
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  // body 可能含业务敏感数据，降到 trace（默认关闭）
  logger.trace({ rawBody: text }, "raw response body");
  if (!text) {
    return undefined;
  }
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      // Fallback: some endpoints declare JSON but return plain strings (e.g. log URL)
      return text;
    }
  }
  return text;
}

export function buildUrl(baseUrl: string, params: Record<string, string | number | undefined>): string {
  // Handle baseUrl that doesn't have protocol
  const isAbsolute = baseUrl.startsWith("http://") || baseUrl.startsWith("https://");
  const fullBaseUrl = isAbsolute ? baseUrl : `${getYunxiaoApiBaseUrl()}${baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`}`;

  try {
    const url = new URL(fullBaseUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const result = url.toString();
    logger.debug({ url: sanitizeUrl(result) }, "built url");

    // If we started with a relative URL, return just the path portion
    if (!baseUrl.startsWith('http')) {
      // Extract the path and query string from the full URL
      const urlObj = new URL(result);
      return urlObj.pathname + urlObj.search;
    }

    return result;
  } catch (error) {
    logger.error({ err: error }, "failed to build URL");

    // Fallback: manually append query parameters
    let urlWithParams = baseUrl;
    const queryParts: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`);
      }
    });

    if (queryParts.length > 0) {
      urlWithParams += (urlWithParams.includes('?') ? '&' : '?') + queryParts.join('&');
    }

    logger.debug({ url: sanitizeUrl(urlWithParams) }, "fallback url");
    return urlWithParams;
  }
}

const USER_AGENT = `modelcontextprotocol/servers/alibabacloud-devops-mcp-server/v${VERSION} ${getUserAgent()}`;

export function getCurrentSessionApiBaseUrl(): string | undefined {
  return requestContext.getStore()?.apiBaseUrl;
}

export function getCurrentSessionToken(): string | undefined {
  return requestContext.getStore()?.token ?? process.env.YUNXIAO_ACCESS_TOKEN;
}

export async function yunxiaoRequest(
  urlPath: string,
  options: RequestOptions = {},
): Promise<unknown> {
  // Check if the URL is already a full URL or a path
  const isAbsolute = urlPath.startsWith("http://") || urlPath.startsWith("https://");
  let url = isAbsolute ? urlPath : `${getYunxiaoApiBaseUrl()}${urlPath.startsWith("/") ? urlPath : `/${urlPath}`}`;
  const requestHeaders: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT,
    ...options.headers,
  };

  // Use session-specific token if available, otherwise use default token
  const token = getCurrentSessionToken();
  if (token) {
    requestHeaders["x-yunxiao-token"] = token;
  }

  logger.debug({ method: options.method || "GET", url: sanitizeUrl(url) }, "yunxiao request");
  // headers 里的 x-yunxiao-token / authorization 由 logger.redact 自动脱敏
  logger.debug({ headers: requestHeaders }, "yunxiao request headers");
  logger.trace({ body: options.body }, "yunxiao request body");

  const response = await fetch(url, {
    method : options.method || "GET",
    headers: requestHeaders,
    body: options.body ? JSON.stringify(options.body) : undefined,
  } as RequestInit);

  const responseBody = await parseResponseBody(response);
  logger.trace({ body: responseBody }, "yunxiao response body");
  logger.debug({ status: response.status, ok: response.ok }, "yunxiao response");

  if (!response.ok) {
    throw createYunxiaoError(
      response.status, 
      responseBody,
      url,
      options.method || "GET",
      requestHeaders,
      options.body
    );
  }

  return responseBody;
}

// token 有效性缓存（60s），避免每次 tools/call 都打一次用户信息接口。
type TokenCheck = { ok: boolean; exp: number };
const tokenVerifyCache = new Map<string, TokenCheck>();
const TOKEN_VERIFY_TTL_MS = 60_000;

/**
 * 轻量校验云效 token 是否有效，供 HTTP 层鉴权 gate 使用。
 * 探针接口 GET /oapi/v1/platform/user：中心站/region 通用，任意有效身份都能访问，
 * token 无效/过期时云效返回 401。
 * - true：token 有效
 * - false：token 明确无效（云效 401）
 * - "unknown"：无法判定（网络/5xx 等），调用方应放行（fail-open），避免云效抖动误伤
 * 结果按 sha256(apiBaseUrl + token) 缓存 60s；token 变化会立即换 key，无需等待过期。
 */
export async function verifyToken(
  token: string,
  apiBaseUrl?: string,
): Promise<boolean | "unknown"> {
  const key = createHash("sha256").update(`${apiBaseUrl ?? ""}\n${token}`).digest("hex");
  const now = Date.now();
  const cached = tokenVerifyCache.get(key);
  if (cached && cached.exp > now) {
    return cached.ok;
  }
  try {
    await runWithAuth({ token, apiBaseUrl }, () =>
      yunxiaoRequest("/oapi/v1/platform/user", { method: "GET" }),
    );
    tokenVerifyCache.set(key, { ok: true, exp: now + TOKEN_VERIFY_TTL_MS });
    return true;
  } catch (error) {
    if (isYunxiaoError(error) && error.status === 401) {
      tokenVerifyCache.set(key, { ok: false, exp: now + TOKEN_VERIFY_TTL_MS });
      return false;
    }
    // 网络抖动 / 5xx 等无法判定：不缓存，交由调用方 fail-open。
    // 只记状态码，不记整个 error（其 requestHeaders 含 token，且不在 logger.redact 覆盖路径内）。
    logger.debug(
      { status: isYunxiaoError(error) ? error.status : undefined },
      "verifyToken inconclusive; failing open",
    );
    return "unknown";
  }
}

export function pathEscape(filePath: string): string {
  // 先使用encodeURIComponent进行编码
  let encoded = encodeURIComponent(filePath);

  // 将编码后的%2F（/的编码）替换回/
  encoded = encoded.replace(/%2F/gi, "/");

  return encoded;
}

/**
 * Handle repository ID encoding
 * @param repositoryId Repository ID which may contain unencoded slash
 * @returns Properly encoded repository ID
 */
export function handleRepositoryIdEncoding(repositoryId: string): string {
  let encodedRepoId = repositoryId;

  // Automatically handle unencoded slashes in repositoryId
  if (repositoryId.includes("/")) {
    // Found unencoded slash, automatically URL encode it
    const parts = repositoryId.split("/", 2);
    if (parts.length === 2) {
      const encodedRepoName = encodeURIComponent(parts[1]);
      // Remove + signs from encoding (spaces are encoded as +, but we need %20)
      const formattedEncodedName = encodedRepoName.replace(/\+/g, "%20");
      encodedRepoId = `${parts[0]}%2F${formattedEncodedName}`;
    }
  }

  return encodedRepoId;
}

/**
 * Converts a floating point number to an integer string (removes decimal point and decimal part)
 * Used primarily for handling numeric IDs that might come as floats from JSON parsing
 * @param value Value to convert
 * @returns Integer string representation
 */
export function floatToIntString(value: any): string {
  // 如果传入的是字符串，先尝试转为浮点数
  if (typeof value === 'string') {
    const floatValue = parseFloat(value);
    if (!isNaN(floatValue)) {
      value = floatValue;
    } else {
      return value; // 如果转换失败，返回原字符串
    }
  }

  // 处理浮点数
  if (typeof value === 'number') {
    const intValue = Math.floor(value + 0.5); // 四舍五入转整数
    return intValue.toString();
  }

  // 处理其他情况，直接转字符串
  return String(value);
}


/**
 * 将各种时间格式转换为毫秒时间戳
 * 支持：
 * - 已有时间戳（number）直接返回
 * - Date对象转换为时间戳
 * - ISO格式日期字符串 (如: '2023-01-01T00:00:00Z')
 * - 日期字符串 (如: '2023-01-01')
 *
 * @param time 时间输入
 * @returns 毫秒时间戳
 */
export function convertToTimestamp(time: number | string | Date): number {
  if (typeof time === 'number') {
    // 如果已经是数字，假设已是时间戳
    return time;
  } else if (time instanceof Date) {
    // 如果是Date对象，转换为时间戳
    return time.getTime();
  } else if (typeof time === 'string') {
    // 尝试解析日期字符串
    const date = new Date(time);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
  }

  // 无法转换时返回原值（如果是数字）或当前时间戳
  return typeof time === 'number' ? time : Date.now();
}

/**
 * Get start of today timestamp
 * @returns Timestamp for start of the current day (00:00:00)
 */
export function getStartOfTodayTimestamp(): number {
  const now = new Date();
  // Reset time to start of day (00:00:00.000)
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

/**
 * Get end of today timestamp
 * @returns Timestamp for end of the current day (23:59:59.999)
 */
export function getEndOfTodayTimestamp(): number {
  const now = new Date();
  // Set time to end of day (23:59:59.999)
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

/**
 * Get timestamp for start of a specific day
 * @param date Date object or date string
 * @returns Timestamp for start of the specified day
 */
export function getStartOfDayTimestamp(date: Date | string): number {
  const targetDate = typeof date === 'string' ? new Date(date) : new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  return targetDate.getTime();
}

/**
 * Get timestamp for end of a specific day
 * @param date Date object or date string
 * @returns Timestamp for end of the specified day
 */
export function getEndOfDayTimestamp(date: Date | string): number {
  const targetDate = typeof date === 'string' ? new Date(date) : new Date(date);
  targetDate.setHours(23, 59, 59, 999);
  return targetDate.getTime();
}

/**
 * Get timestamp for start of current week
 * @param startOnMonday Whether week should start on Monday (true) or Sunday (false)
 * @returns Timestamp for start of the current week
 */
export function getStartOfWeekTimestamp(startOnMonday: boolean = true): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diff = startOnMonday ? 
    (dayOfWeek === 0 ? 6 : dayOfWeek - 1) : // If startOnMonday, set Sunday as day 7
    dayOfWeek;
  
  // Set to beginning of the week
  now.setDate(now.getDate() - diff);
  now.setHours(0, 0, 0, 0);
  
  return now.getTime();
}

/**
 * Get timestamp for end of current week
 * @param startOnMonday Whether week should start on Monday (true) or Sunday (false)
 * @returns Timestamp for end of the current week
 */
export function getEndOfWeekTimestamp(startOnMonday: boolean = true): number {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diff = startOnMonday ?
    (dayOfWeek === 0 ? 0 : 7 - dayOfWeek) : // If startOnMonday, set Sunday as day 7
    (6 - dayOfWeek);
  
  // Set to end of the week
  now.setDate(now.getDate() + diff);
  now.setHours(23, 59, 59, 999);
  
  return now.getTime();
}

/**
 * Get timestamp for start of current month
 * @returns Timestamp for start of the current month
 */
export function getStartOfMonthTimestamp(): number {
  const now = new Date();
  now.setDate(1); // First day of current month
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

/**
 * Get timestamp for end of current month
 * @returns Timestamp for end of the current month
 */
export function getEndOfMonthTimestamp(): number {
  const now = new Date();
  now.setMonth(now.getMonth() + 1); // Move to next month
  now.setDate(0); // Last day of previous month (i.e., current month)
  now.setHours(23, 59, 59, 999);
  return now.getTime();
}

/**
 * Analyzes natural language date reference and returns corresponding timestamp range
 * @param dateReference Natural language date reference (e.g., "today", "this week", "last month")
 * @returns Object containing start and end timestamps
 */
export function parseDateReference(dateReference?: string): { startTime: number, endTime: number } {
  if (!dateReference) {
    // Default to all time
    return {
      startTime: 0,
      endTime: Date.now()
    };
  }

  const normalizedRef = dateReference.trim().toLowerCase();
  
  // Today/yesterday
  if (normalizedRef === 'today' || normalizedRef === '今天') {
    return {
      startTime: getStartOfTodayTimestamp(),
      endTime: getEndOfTodayTimestamp()
    };
  }
  
  if (normalizedRef === 'yesterday' || normalizedRef === '昨天') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      startTime: getStartOfDayTimestamp(yesterday),
      endTime: getEndOfDayTimestamp(yesterday)
    };
  }
  
  // This week/last week
  if (normalizedRef === 'this week' || normalizedRef === '本周' || 
      normalizedRef === 'current week' || normalizedRef === '这周' || 
      normalizedRef === '这个星期') {
    return {
      startTime: getStartOfWeekTimestamp(),
      endTime: getEndOfWeekTimestamp()
    };
  }
  
  if (normalizedRef === 'last week' || normalizedRef === '上周' || 
      normalizedRef === '上個星期' || normalizedRef === '上个星期') {
    const lastWeekStart = new Date(getStartOfWeekTimestamp());
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(getEndOfWeekTimestamp());
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
    
    return {
      startTime: lastWeekStart.getTime(),
      endTime: lastWeekEnd.getTime()
    };
  }
  
  // This month/last month
  if (normalizedRef === 'this month' || normalizedRef === '本月' || 
      normalizedRef === 'current month' || normalizedRef === '这个月') {
    return {
      startTime: getStartOfMonthTimestamp(),
      endTime: getEndOfMonthTimestamp()
    };
  }
  
  if (normalizedRef === 'last month' || normalizedRef === '上月' || 
      normalizedRef === '上个月') {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    
    // Start of last month
    const startOfLastMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    
    // End of last month
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    endOfLastMonth.setHours(23, 59, 59, 999);
    
    return {
      startTime: startOfLastMonth.getTime(),
      endTime: endOfLastMonth.getTime()
    };
  }
  
  // Default to all time
  return {
    startTime: 0,
    endTime: Date.now()
  };
}
