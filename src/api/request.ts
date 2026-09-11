import { normalizeApiError } from "./errors";

type ApiRequestOptions = {
  retries?: number;
  signal?: AbortSignal;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 15_000;

export async function runApiRequest<T>(
  request: (signal: AbortSignal) => Promise<T>,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { retries = 0, signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  for (let attempt = 0; ; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const abort = () => controller.abort(signal?.reason);
    signal?.addEventListener("abort", abort, { once: true });

    if (signal?.aborted) abort();

    try {
      return await request(controller.signal);
    } catch (error) {
      const apiError = normalizeApiError(error);

      if (!apiError.retryable || attempt >= retries) {
        throw apiError;
      }
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", abort);
    }
  }
}
