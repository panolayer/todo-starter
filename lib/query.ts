// Parsing for the GET /api/todos query string. Every parameter is optional
// and falls back to a default, so a bare /api/todos still lists everything.

import { STATUS_FILTERS, type StatusFilter } from "./filters";

/** Todos returned when the request does not ask for a specific number. */
export const DEFAULT_LIMIT = 50;
/** The most todos a single request can return. */
export const MAX_LIMIT = 200;
/** Longest search text the API will use; anything beyond is cut off. */
export const MAX_QUERY_LENGTH = 100;

export interface ListQuery {
  status: StatusFilter;
  q: string;
  limit: number;
}

/** Read the `status` parameter. Anything other than a known tab means "all". */
export function parseStatus(raw: string | null): StatusFilter {
  return STATUS_FILTERS.find((status) => status === raw) ?? "all";
}

/**
 * Read the `limit` parameter: how many todos to return. A missing or
 * non-numeric value falls back to DEFAULT_LIMIT; any other value is rounded
 * down and clamped to the range 1 to MAX_LIMIT.
 */
export function parseLimit(raw: string | null): number {
  if (raw === null || raw.trim() === "") return DEFAULT_LIMIT;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_LIMIT;
  return Math.min(Math.floor(n), MAX_LIMIT);
}

/** Parse the list query string. The search text is trimmed and length-capped. */
export function parseListQuery(params: URLSearchParams): ListQuery {
  return {
    status: parseStatus(params.get("status")),
    q: (params.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH),
    limit: parseLimit(params.get("limit")),
  };
}
