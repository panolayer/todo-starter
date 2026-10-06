// Request-body checks shared by the API routes.

/** Longest title a todo may have, in characters. */
export const MAX_TITLE_LENGTH = 200;

/**
 * Read a todo title from a request body. Surrounding whitespace is trimmed;
 * the trimmed title is returned when it is a string of 1 to MAX_TITLE_LENGTH
 * characters, inclusive, so a title of exactly MAX_TITLE_LENGTH characters is
 * accepted. Anything else returns null.
 */
export function parseTitle(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const title = value.trim();
  return title.length > 0 && title.length < MAX_TITLE_LENGTH ? title : null;
}
