import { render, screen, fireEvent } from "@testing-library/react";
import { expect, vi, test, describe } from "vitest";

import VersionsList from "./";

const mockVersions = [
  {
    id: "1",
    checksum: "checksum1",
    user: { avatarUrl: "url1", display_name: "user1" },
    created_at: "2022-01-02",
    dataschemas: [
      {
        name: "Orders.yml",
        code: "cubes:\n  - name: Orders\n    sql: SELECT 2",
      },
    ],
  },
  {
    id: "2",
    checksum: "checksum2",
    user: { avatarUrl: "url2", display_name: "user2" },
    created_at: "2022-01-01",
    dataschemas: [
      {
        name: "Orders.yml",
        code: "cubes:\n  - name: Orders\n    sql: SELECT 1",
      },
    ],
  },
];

vi.mock("@/hooks/useVersions", () => ({
  __esModule: true,
  default: () => ({
    versions: mockVersions,
    currentVersion: mockVersions[0],
    totalCount: 2,
    queries: { allData: { fetching: false } },
  }),
}));

vi.mock("@/hooks/useTableState", () => ({
  __esModule: true,
  default: () => ({
    tableState: { paginationVars: {}, pageSize: 5, currentPage: 1 },
    onPageChange: vi.fn(),
  }),
}));

vi.mock("@/hooks/useVersionCompare", () => ({
  useVersionOptions: () => ({ options: mockVersions, fetching: false }),
  useVersionsWithCode: () => ({ versions: mockVersions, fetching: false }),
}));

describe("VersionsList Component", () => {
  test("renders the VersionsList component", () => {
    render(<VersionsList onRestore={() => {}} />);
    const titleElement = screen.getByText("versions_list");
    expect(titleElement).toBeDefined();
  });

  test("hides restore on the current version", () => {
    render(<VersionsList onRestore={() => {}} />);
    const buttonElements = screen.getAllByText("common:words.restore");
    expect(buttonElements.length).toBe(1);
    expect(screen.getByText("common:words.current")).toBeDefined();
  });

  test("shows author, timestamp, and relative time", () => {
    render(<VersionsList onRestore={() => {}} />);
    expect(screen.getByText("user1")).toBeDefined();
    expect(screen.getByText("user2")).toBeDefined();
    expect(screen.getByText(/2022-01-02/)).toBeDefined();
    expect(screen.getByText(/2022-01-01/)).toBeDefined();
  });

  test("shows line-change totals against the previous version", () => {
    render(<VersionsList onRestore={() => {}} />);
    expect(screen.getByText("+1")).toBeDefined();
    expect(screen.getByText("-1")).toBeDefined();
    expect(screen.getByText("Initial version")).toBeDefined();
  });

  test("previews restore then confirms", () => {
    const mockOnRestore = vi.fn();
    render(<VersionsList onRestore={mockOnRestore} />);
    fireEvent.click(screen.getByText("common:words.restore"));
    expect(mockOnRestore).not.toHaveBeenCalled();
    expect(screen.getByText("Restore this version?")).toBeDefined();
    fireEvent.click(screen.getByTestId("confirm-restore"));
    expect(mockOnRestore).toHaveBeenCalledWith(
      mockVersions[1].checksum,
      mockVersions[1].dataschemas
    );
  });

  test("shows changed lines when a version row is expanded", () => {
    const { container } = render(<VersionsList onRestore={() => {}} />);
    const expandButton = container.querySelector(
      "button.ant-table-row-expand-icon"
    );

    expect(expandButton).toBeTruthy();
    fireEvent.click(expandButton as Element);

    expect(screen.getByText("Orders.yml")).toBeDefined();
    expect(screen.getByText("    sql: SELECT 1")).toBeDefined();
    expect(screen.getByText("    sql: SELECT 2")).toBeDefined();
  });
});
