import { getUserAgent } from "universal-user-agent";
import { createYunxiaoError } from "./errors.js";
import { VERSION } from "./version.js";

const DEFAULT_YUNXIAO_API_BASE_URL = "https://openapi-rdc.aliyuncs.com";

/**
 * Get the Yunxiao API base URL from environment variables or use the default
 * @returns The Yunxiao API base URL
 */
export function getYunxiaoApiBaseUrl(): string {
  return process.env.YUNXIAO_API_BASE_URL || DEFAULT_YUNXIAO_API_BASE_URL;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export function debug(message: string, data?: unknown): void {
  if (data !== undefined) {
    console.error(`[DEBUG] ${message}`, typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
  } else {
    console.error(`[DEBUG] ${message}`);
  }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
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
    console.error(`[DEBUG] Final URL: ${result}`);

    // If we started with a relative URL, return just the path portion
    if (!baseUrl.startsWith('http')) {
      // Extract the path and query string from the full URL
      const urlObj = new URL(result);
      return urlObj.pathname + urlObj.search;
    }

    return result;
  } catch (error) {
    console.error(`[ERROR] Failed to build URL: ${error}`);

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

    console.error(`[DEBUG] Fallback URL: ${urlWithParams}`);
    return urlWithParams;
  }
}

const USER_AGENT = `modelcontextprotocol/servers/alibabacloud-devops-mcp-server/v${VERSION} ${getUserAgent()}`;

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

  if (process.env.YUNXIAO_ACCESS_TOKEN) {
    requestHeaders["x-yunxiao-token"] = process.env.YUNXIAO_ACCESS_TOKEN;
  }

  debug(`Request: ${options.method} ${url}`);
  debug(`Headers:`, requestHeaders);

  const response = await fetch(url, {
    method : options.method || "GET",
    headers: requestHeaders,
    body: options.body ? JSON.stringify(options.body) : undefined,
  } as RequestInit);

  const responseBody = await parseResponseBody(response);
  debug(`Response Body:`, responseBody)

  if (!response.ok) {
    throw createYunxiaoError(response.status, responseBody);
  }

  return responseBody;
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
