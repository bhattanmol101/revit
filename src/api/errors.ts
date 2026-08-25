type SupabaseErrorLike = {
  code?: string;
  message?: string;
  status?: number;
};

export class ApiError extends Error {
  readonly code?: string;
  readonly status?: number;
  readonly retryable: boolean;

  constructor(
    message: string,
    options: {
      cause?: unknown;
      code?: string;
      retryable?: boolean;
      status?: number;
    } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = "ApiError";
    this.code = options.code;
    this.status = options.status;
    this.retryable = options.retryable ?? false;
  }
}

function isSupabaseErrorLike(error: unknown): error is SupabaseErrorLike {
  return typeof error === "object" && error !== null;
}

export function normalizeApiError(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
) {
  if (error instanceof ApiError) return error;

  const details = isSupabaseErrorLike(error) ? error : {};
  const message = details.message ?? fallbackMessage;
  const status = details.status;
  const isCancelled =
    (error instanceof Error && error.name === "AbortError") ||
    /abort|cancel/i.test(message);
  const retryable =
    isCancelled ||
    status === 408 ||
    status === 429 ||
    (typeof status === "number" && status >= 500);

  return new ApiError(
    isCancelled
      ? "The request timed out. Check your connection and try again."
      : message,
    {
      cause: error,
      code: details.code,
      retryable,
      status,
    },
  );
}
