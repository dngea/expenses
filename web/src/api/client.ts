/**
 * The single place where HTTP requests are made.
 * Components must never call `fetch` directly; use the functions in `src/api/*` instead.
 */

const API_PREFIX = "/api";

/** Error thrown for any failed request. `messages` is always a list, ready to show to the user. */
export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join("\n"));
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

type QueryParams = Record<string, string | undefined>;

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: QueryParams;
}

/** Shape of NestJS error responses. */
interface BackendError {
  statusCode?: number;
  error?: string;
  message?: string | string[];
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  // method receives "GET" when no value is defined
  const { method = "GET", body, query } = options;

  const headers = new Headers({ Accept: "application/json" });
  if (body !== undefined) headers.set("Content-Type", "application/json");

  // TODO(auth): attach authentication here (e.g. Authorization header or credentials),
  // and handle 401 responses below.

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, [
      "Could not reach the server. Check your connection and try again.",
    ]);
  }

  if (!response.ok) throw await toApiError(response);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function buildUrl(path: string, query?: QueryParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) params.set(key, value);
  }
  const qs = params.toString();
  return `${API_PREFIX}${path}${qs ? `?${qs}` : ""}`;
}

async function toApiError(response: Response): Promise<ApiError> {
  let data: BackendError | undefined;
  try {
    data = (await response.json()) as BackendError;
  } catch {
    // Not JSON (e.g. proxy error when the backend is down).
  }

  const message = data?.message;
  const messages = Array.isArray(message)
    ? message
    : message
      ? [message]
      : [
          data?.error ??
            (response.statusText || `Request failed (${response.status})`),
        ];

  return new ApiError(response.status, messages);
}

/** Turns any thrown value into a list of user-facing messages. */
export function errorMessages(error: unknown): string[] {
  if (error instanceof ApiError) return error.messages;
  if (error instanceof Error) return [error.message];
  return ["Something went wrong."];
}
