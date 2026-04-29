export class YunxiaoError extends Error {
  constructor(
      message: string,
      public readonly status: number,
      public readonly response: unknown,
      public readonly url?: string,
      public readonly method?: string,
      public readonly requestHeaders?: Record<string, string>,
      public readonly requestBody?: unknown
  ) {
    super(message);
    this.name = "YunxiaoError";
  }
}

export class YunxiaoValidationError extends YunxiaoError {
  constructor(message: string, status: number, response: unknown) {
    super(message, status, response);
    this.name = "YunxiaoValidationError";
  }
}

export class YunxiaoResourceNotFoundError extends YunxiaoError {
  constructor(resource: string) {
    super(`Resource not found: ${resource}`, 404, { message: `${resource} not found` });
    this.name = "YunxiaoResourceNotFoundError";
  }
}

export class YunxiaoAuthenticationError extends YunxiaoError {
  constructor(message = "Authentication failed") {
    super(message, 401, { message });
    this.name = "YunxiaoAuthenticationError";
  }
}

export class YunxiaoPermissionError extends YunxiaoError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, { message });
    this.name = "YunxiaoPermissionError";
  }
}

export class YunxiaoRateLimitError extends YunxiaoError {
  constructor(
      message = "Rate limit exceeded",
      public readonly resetAt: Date
  ) {
    super(message, 429, { message, reset_at: resetAt.toISOString() });
    this.name = "YunxiaoRateLimitError";
  }
}

export class YunxiaoConflictError extends YunxiaoError {
  constructor(message: string) {
    super(message, 409, { message });
    this.name = "YunxiaoConflictError";
  }
}

export function isYunxiaoError(error: unknown): error is YunxiaoError {
  return error instanceof YunxiaoError;
}

export function extractErrorMessage(response: any): string | undefined {
  // API returns errorMessage / errorDescription with detailed info, fallback to message
  return response?.errorMessage || response?.errorDescription || response?.message;
}

export function createYunxiaoError(
  status: number, 
  response: any, 
  url?: string, 
  method?: string,
  requestHeaders?: Record<string, string>,
  requestBody?: unknown
): YunxiaoError {
  switch (status) {
    case 401:
      return new YunxiaoAuthenticationError(extractErrorMessage(response));
    case 403:
      return new YunxiaoPermissionError(extractErrorMessage(response));
    case 404:
      return new YunxiaoResourceNotFoundError(extractErrorMessage(response) || "Resource");
    case 409:
      return new YunxiaoConflictError(extractErrorMessage(response) || "Conflict occurred");
    case 422:
      return new YunxiaoValidationError(
          extractErrorMessage(response) || "Validation failed",
          status,
          response
      );
    case 429:
      return new YunxiaoRateLimitError(
          extractErrorMessage(response),
          new Date(response?.reset_at || Date.now() + 60000)
      );
    default:
      return new YunxiaoError(
          extractErrorMessage(response) || "Yunxiao API error",
          status,
          response,
          url,
          method,
          requestHeaders,
          requestBody
      );
  }
}