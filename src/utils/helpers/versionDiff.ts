export type DiffLineType = "equal" | "add" | "remove";

export interface DiffLine {
  type: DiffLineType;
  text: string;
  oldNumber: number | null;
  newNumber: number | null;
}

export interface DiffHunk {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
  lines: DiffLine[];
}

export type FileChangeKind = "added" | "removed" | "modified" | "unchanged";

export interface NamedCode {
  name: string;
  code?: string | null;
}

export interface FileChange {
  name: string;
  kind: FileChangeKind;
  previousCode: string;
  currentCode: string;
  hunks: DiffHunk[];
  added: number;
  removed: number;
}

export interface SchemaDiff {
  isInitial: boolean;
  files: FileChange[];
  changedFiles: FileChange[];
  addedLines: number;
  removedLines: number;
}

export const shortChecksum = (checksum?: string | null, length = 8): string => {
  if (!checksum) {
    return "";
  }

  if (checksum.length <= length) {
    return checksum;
  }

  return checksum.slice(0, length);
};

export interface VersionChecksumRef {
  id: string;
  checksum: string;
  created_at: string;
}

export interface RestoreRelation {
  restoredFrom?: VersionChecksumRef;
  isRestoreSource: boolean;
}

export const restoreRelations = (
  versions: VersionChecksumRef[]
): Map<string, RestoreRelation> => {
  const unique = new Map<string, VersionChecksumRef>();

  versions.forEach((version) => {
    if (version?.id && version.checksum && version.created_at) {
      unique.set(version.id, version);
    }
  });

  const byChecksum = new Map<string, VersionChecksumRef[]>();

  unique.forEach((version) => {
    const group = byChecksum.get(version.checksum) ?? [];
    group.push(version);
    byChecksum.set(version.checksum, group);
  });

  const relations = new Map<string, RestoreRelation>();

  unique.forEach((version) => {
    relations.set(version.id, { isRestoreSource: false });
  });

  byChecksum.forEach((group) => {
    const sorted = [...group].sort(
      (left, right) =>
        new Date(left.created_at).getTime() -
        new Date(right.created_at).getTime()
    );

    if (sorted.length < 2) {
      return;
    }

    for (let index = 1; index < sorted.length; index += 1) {
      const current = sorted[index];
      const previous = sorted[index - 1];
      relations.set(current.id, {
        restoredFrom: previous,
        isRestoreSource: index < sorted.length - 1,
      });
      const previousRelation = relations.get(previous.id) ?? {
        isRestoreSource: false,
      };
      relations.set(previous.id, {
        ...previousRelation,
        isRestoreSource: true,
      });
    }
  });

  return relations;
};

const DEFAULT_MAX_LCS_CELLS = 400000;
const DEFAULT_CONTEXT = 3;

export const splitLines = (value: string): string[] => {
  if (!value) {
    return [];
  }

  return value.replace(/\r\n/g, "\n").split("\n");
};

const normalizeNewlines = (value: string): string =>
  value.replace(/\r\n/g, "\n");

const countLineChanges = (
  lines: DiffLine[]
): { added: number; removed: number } => {
  let added = 0;
  let removed = 0;

  for (const line of lines) {
    if (line.type === "add") {
      added += 1;
    } else if (line.type === "remove") {
      removed += 1;
    }
  }

  return { added, removed };
};

const withLineNumbers = (
  ops: Array<{ type: DiffLineType; text: string }>
): DiffLine[] => {
  let oldNumber = 0;
  let newNumber = 0;

  return ops.map((op) => {
    if (op.type === "add") {
      newNumber += 1;
      return {
        type: op.type,
        text: op.text,
        oldNumber: null,
        newNumber,
      };
    }

    if (op.type === "remove") {
      oldNumber += 1;
      return {
        type: op.type,
        text: op.text,
        oldNumber,
        newNumber: null,
      };
    }

    oldNumber += 1;
    newNumber += 1;
    return {
      type: op.type,
      text: op.text,
      oldNumber,
      newNumber,
    };
  });
};

const diffMiddle = (
  previous: string[],
  current: string[],
  maxLcsCells: number
): Array<{ type: DiffLineType; text: string }> => {
  const n = previous.length;
  const m = current.length;

  if (!n && !m) {
    return [];
  }

  if (!n) {
    return current.map((text) => ({ type: "add" as const, text }));
  }

  if (!m) {
    return previous.map((text) => ({ type: "remove" as const, text }));
  }

  if (n * m > maxLcsCells) {
    return [
      ...previous.map((text) => ({ type: "remove" as const, text })),
      ...current.map((text) => ({ type: "add" as const, text })),
    ];
  }

  const dp: Int16Array[] = new Array(n + 1);
  for (let i = 0; i <= n; i += 1) {
    dp[i] = new Int16Array(m + 1);
  }

  for (let i = 1; i <= n; i += 1) {
    const prevLine = previous[i - 1];
    const row = dp[i];
    const prevRow = dp[i - 1];

    for (let j = 1; j <= m; j += 1) {
      if (prevLine === current[j - 1]) {
        row[j] = prevRow[j - 1] + 1;
      } else {
        row[j] = prevRow[j] >= row[j - 1] ? prevRow[j] : row[j - 1];
      }
    }
  }

  const ops: Array<{ type: DiffLineType; text: string }> = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    if (previous[i - 1] === current[j - 1]) {
      ops.push({ type: "equal", text: previous[i - 1] });
      i -= 1;
      j -= 1;
    } else if (dp[i][j - 1] >= dp[i - 1][j]) {
      ops.push({ type: "add", text: current[j - 1] });
      j -= 1;
    } else {
      ops.push({ type: "remove", text: previous[i - 1] });
      i -= 1;
    }
  }

  while (i > 0) {
    ops.push({ type: "remove", text: previous[i - 1] });
    i -= 1;
  }

  while (j > 0) {
    ops.push({ type: "add", text: current[j - 1] });
    j -= 1;
  }

  ops.reverse();
  return ops;
};

export const diffLines = (
  previous: string,
  current: string,
  maxLcsCells = DEFAULT_MAX_LCS_CELLS
): DiffLine[] => {
  const previousLines = splitLines(previous);
  const currentLines = splitLines(current);

  if (previousLines.length === currentLines.length) {
    let identical = true;
    for (let i = 0; i < previousLines.length; i += 1) {
      if (previousLines[i] !== currentLines[i]) {
        identical = false;
        break;
      }
    }
    if (identical) {
      return withLineNumbers(
        previousLines.map((text) => ({ type: "equal" as const, text }))
      );
    }
  }

  let start = 0;
  while (
    start < previousLines.length &&
    start < currentLines.length &&
    previousLines[start] === currentLines[start]
  ) {
    start += 1;
  }

  let previousEnd = previousLines.length;
  let currentEnd = currentLines.length;
  while (
    previousEnd > start &&
    currentEnd > start &&
    previousLines[previousEnd - 1] === currentLines[currentEnd - 1]
  ) {
    previousEnd -= 1;
    currentEnd -= 1;
  }

  const prefix = previousLines
    .slice(0, start)
    .map((text) => ({ type: "equal" as const, text }));
  const middle = diffMiddle(
    previousLines.slice(start, previousEnd),
    currentLines.slice(start, currentEnd),
    maxLcsCells
  );
  const suffix = previousLines
    .slice(previousEnd)
    .map((text) => ({ type: "equal" as const, text }));

  return withLineNumbers([...prefix, ...middle, ...suffix]);
};

export const toHunks = (
  lines: DiffLine[],
  context = DEFAULT_CONTEXT
): DiffHunk[] => {
  if (!lines.length) {
    return [];
  }

  const include = lines.map((line) => line.type !== "equal");
  if (!include.some(Boolean)) {
    return [];
  }

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].type === "equal") {
      continue;
    }

    const from = Math.max(0, i - context);
    const to = Math.min(lines.length - 1, i + context);
    for (let j = from; j <= to; j += 1) {
      include[j] = true;
    }
  }

  const hunks: DiffHunk[] = [];
  let index = 0;

  while (index < lines.length) {
    if (!include[index]) {
      index += 1;
      continue;
    }

    const start = index;
    while (index < lines.length && include[index]) {
      index += 1;
    }

    const chunk = lines.slice(start, index);
    const oldLines = chunk.filter((line) => line.type !== "add");
    const newLines = chunk.filter((line) => line.type !== "remove");
    const firstOld = oldLines.find((line) => line.oldNumber !== null);
    const firstNew = newLines.find((line) => line.newNumber !== null);

    hunks.push({
      oldStart: firstOld?.oldNumber ?? 0,
      oldCount: oldLines.length,
      newStart: firstNew?.newNumber ?? 0,
      newCount: newLines.length,
      lines: chunk,
    });
  }

  return hunks;
};

const makeFileChange = (
  name: string,
  kind: FileChangeKind,
  previousCode: string,
  currentCode: string
): FileChange => {
  if (kind === "unchanged") {
    return {
      name,
      kind,
      previousCode,
      currentCode,
      hunks: [],
      added: 0,
      removed: 0,
    };
  }

  const lines = diffLines(previousCode, currentCode);
  const { added, removed } = countLineChanges(lines);

  return {
    name,
    kind,
    previousCode,
    currentCode,
    hunks: toHunks(lines),
    added,
    removed,
  };
};

export const diffSchemaVersions = (
  currentFiles: NamedCode[] = [],
  previousFiles?: NamedCode[] | null
): SchemaDiff => {
  const isInitial = previousFiles == null;
  const previousMap = new Map(
    (previousFiles ?? []).map((file) => [file.name, file.code ?? ""])
  );
  const currentMap = new Map(
    currentFiles.map((file) => [file.name, file.code ?? ""])
  );
  const names = [
    ...new Set([...previousMap.keys(), ...currentMap.keys()]),
  ].sort();
  const files: FileChange[] = names.map((name) => {
    const previousCode = previousMap.get(name);
    const currentCode = currentMap.get(name);

    if (previousCode === undefined) {
      return makeFileChange(name, "added", "", currentCode ?? "");
    }

    if (currentCode === undefined) {
      return makeFileChange(name, "removed", previousCode, "");
    }

    if (normalizeNewlines(previousCode) === normalizeNewlines(currentCode)) {
      return makeFileChange(name, "unchanged", previousCode, currentCode);
    }

    return makeFileChange(name, "modified", previousCode, currentCode);
  });

  const changedFiles = files.filter((file) => file.kind !== "unchanged");
  const addedLines = changedFiles.reduce((sum, file) => sum + file.added, 0);
  const removedLines = changedFiles.reduce(
    (sum, file) => sum + file.removed,
    0
  );

  return {
    isInitial,
    files,
    changedFiles,
    addedLines,
    removedLines,
  };
};
