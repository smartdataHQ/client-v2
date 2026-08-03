/**
 * Turn Cube/Hasura/urql compile-error blobs into readable console rows.
 *
 * Input often looks like:
 *   [GraphQL] Error: Compile errors:
 *   Errors:
 *   ErrorDemo cube: "measures.broken_sum.type" must be one of [...]. "measures.broken_sum.sql" is not allowed
 *   Possible reasons (one of): * (...) * (...)
 */
export type FormattedCompileError = {
  severity: "error" | "warning";
  /** Short human-readable summary */
  message: string;
  /** Cube name when known */
  cube?: string;
  /** Field path, e.g. measures.broken_sum.type */
  path?: string;
  /** Allowed values when message is an enum violation */
  allowed?: string[];
};

export function formatCompileErrors(
  raw: string | undefined | null
): FormattedCompileError[] {
  if (!raw?.trim()) return [];

  let text = raw.trim();

  text = text.replace(/^\[GraphQL\]\s*/i, "");
  text = text.replace(/^Error:\s*/i, "");
  text = text.replace(/^Compile errors:\s*/i, "");
  text = text.replace(/^Errors:\s*/i, "");
  text = text.trim();

  const reasonsIdx = text.search(/\bPossible reasons\b/i);
  if (reasonsIdx >= 0) {
    text = text.slice(0, reasonsIdx).trim();
  }

  if (!text) {
    return [{ severity: "error", message: raw.trim() }];
  }

  const cubeChunks = text
    .split(/(?=(?:^|\n)\s*[A-Za-z_][\w]*\s+cube:)/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const items: FormattedCompileError[] = [];

  for (const chunk of cubeChunks.length ? cubeChunks : [text]) {
    items.push(...parseCubeChunk(chunk));
  }

  return dedupe(items);
}

function parseCubeChunk(chunk: string): FormattedCompileError[] {
  const cleaned = chunk
    .replace(/\b([A-Za-z_][\w]*)\s+cube:\s*/i, "$1: ")
    .replace(/\s+/g, " ")
    .trim();

  const cubeMatch = cleaned.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
  const cube = cubeMatch?.[1];
  const body = cubeMatch ? cubeMatch[2] : cleaned;

  const parts = body
    .split(/(?="[^"]+"\s+(?:must be|is not allowed|is required))/i)
    .map((part) =>
      part
        .replace(/^[.\s]+/, "")
        .replace(/\.\s*$/, "")
        .trim()
    )
    .filter(Boolean);

  const sources = parts.length ? parts : [body];

  return sources.map((part) => toStructuredError(part, cube));
}

function toStructuredError(part: string, cube?: string): FormattedCompileError {
  const pathMatch = part.match(/^"([^"]+)"\s+(.*)$/);
  const path = pathMatch?.[1];
  const rest = (pathMatch?.[2] || part).trim();

  const allowedMatch = rest.match(/^must be one of\s*\[([^\]]+)\]\.?\s*$/i);
  if (allowedMatch) {
    const allowed = allowedMatch[1]
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    return {
      severity: "error",
      cube,
      path,
      message: "Invalid type",
      allowed,
    };
  }

  if (/^is not allowed\.?$/i.test(rest)) {
    return {
      severity: "error",
      cube,
      path,
      message: "This property is not allowed for the current type",
    };
  }

  if (/^is required\.?$/i.test(rest)) {
    return {
      severity: "error",
      cube,
      path,
      message: "This property is required",
    };
  }

  return {
    severity: "error",
    cube,
    path,
    message: rest || part,
  };
}

function dedupe(items: FormattedCompileError[]): FormattedCompileError[] {
  const seen = new Set<string>();
  const result: FormattedCompileError[] = [];

  for (const item of items) {
    const key = [item.cube, item.path, item.message, item.allowed?.join(",")]
      .filter(Boolean)
      .join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

export default formatCompileErrors;
