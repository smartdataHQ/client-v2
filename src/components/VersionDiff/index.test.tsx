import { render, screen } from "@testing-library/react";
import { expect, test, describe } from "vitest";

import { diffLines, toHunks } from "@/utils/helpers/versionDiff";

import VersionDiff from "./";

describe("VersionDiff Component", () => {
  test("renders an empty state when there are no hunks", () => {
    render(<VersionDiff hunks={[]} />);
    expect(screen.getByText("version_diff.no_line_changes")).toBeDefined();
  });

  test("renders changed lines with line numbers", () => {
    const hunks = toHunks(
      diffLines("cubes:\n  sql: SELECT 1", "cubes:\n  sql: SELECT 2")
    );

    render(<VersionDiff hunks={hunks} />);

    expect(screen.getByText("  sql: SELECT 1")).toBeDefined();
    expect(screen.getByText("  sql: SELECT 2")).toBeDefined();
    expect(screen.getByText("@@ -1,2 +1,2 @@")).toBeDefined();
  });
});
