import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { tableFromArrays, tableToIPC } from "apache-arrow";

import RestAPI from "./";

describe("RestAPI", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(window, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "error" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  test("renders RestAPI component", () => {
    render(<RestAPI dataSourceId="123" branchId="456" playgroundState={{}} />);
    const restApiElement = screen.getByTestId("rest-api");
    expect(restApiElement).toBeInTheDocument();
  });

  test("submits form and displays response", async () => {
    render(<RestAPI dataSourceId="123" branchId="456" playgroundState={{}} />);
    const submitButton = screen.getByText("common:words.send_request");
    fireEvent.click(submitButton);

    await waitFor(() => {
      const responseElement = screen.getByTestId("response");
      expect(responseElement).toBeInTheDocument();
    });
  });

  test("decodes arrow responses into schema and preview rows", async () => {
    const table = tableFromArrays({
      sales: [12, 18],
      region: ["US", "EU"],
    });
    const payload = tableToIPC(table, "stream");

    vi.spyOn(window, "fetch").mockResolvedValueOnce(
      new Response(payload, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apache.arrow.stream",
          "Content-Disposition": 'attachment; filename="query-result.arrow"',
        },
      })
    );

    render(<RestAPI dataSourceId="123" branchId="456" playgroundState={{}} />);

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Arrow"));
    fireEvent.click(screen.getByText("common:words.send_request"));

    await waitFor(() => {
      expect(screen.getByDisplayValue(/"rowCount": 2/)).toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue(/"fileName": "query-result\.arrow"/)
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue(/"previewRows": \[/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/"sales": 12/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/"region": "US"/)).toBeInTheDocument();
  });
});
