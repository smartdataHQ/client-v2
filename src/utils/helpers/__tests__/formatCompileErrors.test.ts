import { describe, expect, it } from "vitest";

import { formatCompileErrors } from "../formatCompileErrors";

describe("formatCompileErrors", () => {
  it("returns empty for blank input", () => {
    expect(formatCompileErrors("")).toEqual([]);
    expect(formatCompileErrors(null)).toEqual([]);
  });

  it("strips GraphQL/Joi noise and structures field errors", () => {
    const raw = `[GraphQL] Error: Compile errors:
Errors:
ErrorDemo cube: "measures.broken_sum.type" must be one of [count, number, string, boolean, time, sum, avg, min, max, countDistinct, runningTotal, countDistinctApprox]. "measures.broken_sum.sql" is not allowed Possible reasons (one of): * (measures.broken_sum.type == notARealType) must be one of [count, number, string, boolean, time, sum, avg, min, max, countDistinct, runningTotal, countDistinctApprox] * (measures.broken_sum.sql = () => 'amount') is not allowed`;

    const result = formatCompileErrors(raw);

    expect(result).toEqual([
      {
        severity: "error",
        cube: "ErrorDemo",
        path: "measures.broken_sum.type",
        message: "Invalid type",
        allowed: [
          "count",
          "number",
          "string",
          "boolean",
          "time",
          "sum",
          "avg",
          "min",
          "max",
          "countDistinct",
          "runningTotal",
          "countDistinctApprox",
        ],
      },
      {
        severity: "error",
        cube: "ErrorDemo",
        path: "measures.broken_sum.sql",
        message: "This property is not allowed for the current type",
      },
    ]);
  });

  it("keeps a simple message readable", () => {
    const result = formatCompileErrors(
      "[GraphQL] Error: Compile errors:\nOrders cube: Cube Orders doesn't exist"
    );

    expect(result).toEqual([
      {
        severity: "error",
        cube: "Orders",
        message: "Cube Orders doesn't exist",
      },
    ]);
  });
});
