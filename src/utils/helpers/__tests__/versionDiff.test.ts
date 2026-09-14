import { describe, expect, it } from "vitest";

import {
  diffLines,
  diffSchemaVersions,
  restoreRelations,
  shortChecksum,
  splitLines,
  toHunks,
} from "../versionDiff";

describe("splitLines", () => {
  it("returns an empty array for blank input", () => {
    expect(splitLines("")).toEqual([]);
  });

  it("normalizes Windows newlines", () => {
    expect(splitLines("a\r\nb")).toEqual(["a", "b"]);
  });
});

describe("diffLines", () => {
  it("marks identical files as equal", () => {
    const lines = diffLines(
      "cubes:\n  - name: Orders",
      "cubes:\n  - name: Orders"
    );

    expect(lines).toEqual([
      { type: "equal", text: "cubes:", oldNumber: 1, newNumber: 1 },
      { type: "equal", text: "  - name: Orders", oldNumber: 2, newNumber: 2 },
    ]);
  });

  it("reports a changed line with surrounding equals", () => {
    const previous = "cubes:\n  - name: Orders\n    sql: SELECT 1";
    const current = "cubes:\n  - name: Orders\n    sql: SELECT 2";
    const lines = diffLines(previous, current);

    expect(lines).toEqual([
      { type: "equal", text: "cubes:", oldNumber: 1, newNumber: 1 },
      { type: "equal", text: "  - name: Orders", oldNumber: 2, newNumber: 2 },
      {
        type: "remove",
        text: "    sql: SELECT 1",
        oldNumber: 3,
        newNumber: null,
      },
      { type: "add", text: "    sql: SELECT 2", oldNumber: null, newNumber: 3 },
    ]);
  });

  it("treats a new file as added lines", () => {
    const lines = diffLines("", "a\nb");

    expect(lines.map((line) => line.type)).toEqual(["add", "add"]);
    expect(lines[0]).toMatchObject({
      text: "a",
      newNumber: 1,
      oldNumber: null,
    });
  });

  it("falls back to replace when the LCS table would be too large", () => {
    const lines = diffLines("a\nb", "c\nd", 1);

    expect(lines.map((line) => line.type)).toEqual([
      "remove",
      "remove",
      "add",
      "add",
    ]);
  });
});

describe("toHunks", () => {
  it("returns no hunks when nothing changed", () => {
    expect(toHunks(diffLines("a\nb", "a\nb"))).toEqual([]);
  });

  it("keeps a few unchanged lines around a change", () => {
    const previous = ["a", "b", "c", "d", "old", "e", "f", "g", "h"].join("\n");
    const current = ["a", "b", "c", "d", "new", "e", "f", "g", "h"].join("\n");
    const hunks = toHunks(diffLines(previous, current), 2);

    expect(hunks).toHaveLength(1);
    expect(hunks[0].lines.map((line) => line.text)).toEqual([
      "c",
      "d",
      "old",
      "new",
      "e",
      "f",
    ]);
    expect(hunks[0].oldStart).toBe(3);
    expect(hunks[0].newStart).toBe(3);
  });
});

describe("diffSchemaVersions", () => {
  it("treats a missing previous snapshot as the initial version", () => {
    const diff = diffSchemaVersions([
      { name: "Orders.yml", code: "cubes:\n  - name: Orders" },
    ]);

    expect(diff.isInitial).toBe(true);
    expect(diff.changedFiles).toHaveLength(1);
    expect(diff.changedFiles[0].kind).toBe("added");
    expect(diff.addedLines).toBe(2);
    expect(diff.removedLines).toBe(0);
  });

  it("classifies added, removed, and modified files", () => {
    const diff = diffSchemaVersions(
      [
        { name: "Orders.yml", code: "sql: SELECT 2" },
        { name: "Users.yml", code: "sql: SELECT 1" },
      ],
      [
        { name: "Orders.yml", code: "sql: SELECT 1" },
        { name: "LineItems.yml", code: "sql: SELECT 1" },
      ]
    );

    expect(diff.isInitial).toBe(false);
    expect(diff.changedFiles.map((file) => [file.name, file.kind])).toEqual([
      ["LineItems.yml", "removed"],
      ["Orders.yml", "modified"],
      ["Users.yml", "added"],
    ]);
    expect(diff.addedLines).toBe(2);
    expect(diff.removedLines).toBe(2);
  });

  it("ignores newline-only differences", () => {
    const diff = diffSchemaVersions(
      [{ name: "Orders.yml", code: "cubes:\r\n  - name: Orders" }],
      [{ name: "Orders.yml", code: "cubes:\n  - name: Orders" }]
    );

    expect(diff.changedFiles).toEqual([]);
    expect(diff.files[0].kind).toBe("unchanged");
  });
});

describe("shortChecksum", () => {
  it("shortens long hashes and keeps short values", () => {
    expect(shortChecksum("abcdefghijklmnop")).toBe("abcdefgh");
    expect(shortChecksum("abc")).toBe("abc");
    expect(shortChecksum("")).toBe("");
  });
});

describe("restoreRelations", () => {
  it("marks later identical checksums as restores of the older snapshot", () => {
    const relations = restoreRelations([
      { id: "old", checksum: "aaa", created_at: "2026-04-28T13:54:00Z" },
      { id: "edit", checksum: "bbb", created_at: "2026-09-14T13:43:00Z" },
      { id: "new", checksum: "aaa", created_at: "2026-09-14T13:44:00Z" },
    ]);

    expect(relations.get("new")?.restoredFrom?.id).toBe("old");
    expect(relations.get("old")?.isRestoreSource).toBe(true);
    expect(relations.get("edit")?.restoredFrom).toBeUndefined();
    expect(relations.get("edit")?.isRestoreSource).toBe(false);
  });
});
