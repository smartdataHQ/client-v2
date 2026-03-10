import { describe, it, expect } from "vitest";

import { validateDocument, mapBackendErrors } from "../diagnosticProvider";
import { cubeJsSpec } from "../spec";
import { parseYamlDocument } from "../yamlParser";
import { parseJsDocument } from "../jsParser";

import type { ValidationError } from "../types";

// ---------------------------------------------------------------------------
// Fixtures — YAML
// ---------------------------------------------------------------------------

const YAML_VALID_CUBE = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
        primary_key: true

      - name: status
        sql: "\${CUBE}.status"
        type: string

    measures:
      - name: count
        type: count
`;

const YAML_INVALID_PROPERTY = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
        typo_field: true
`;

const YAML_INVALID_TYPE_VALUE = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: integer
`;

const YAML_MISSING_REQUIRED = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
`;

const YAML_DEPRECATED_PROPERTY = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
        shown: true
`;

const YAML_UNKNOWN_TOP_LEVEL = `cubes:
  - name: orders
    sql_table: public.orders
    bogus_prop: hello

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
`;

// ---------------------------------------------------------------------------
// Fixtures — JS
// ---------------------------------------------------------------------------

const JS_VALID_CUBE = `cube("orders", {
  sqlTable: "public.orders",

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: "number",
      primaryKey: true,
    },
    status: {
      sql: \`\${CUBE}.status\`,
      type: "string",
    },
  },

  measures: {
    count: {
      type: "count",
    },
  },
});
`;

const JS_INVALID_PROPERTY = `cube("orders", {
  sqlTable: "public.orders",

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: "number",
      typoField: true,
    },
  },
});
`;

const JS_INVALID_TYPE_VALUE = `cube("orders", {
  sqlTable: "public.orders",

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: "integer",
    },
  },
});
`;

const JS_MISSING_REQUIRED = `cube("orders", {
  sqlTable: "public.orders",

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
    },
  },
});
`;

const JS_DEPRECATED_PROPERTY = `cube("orders", {
  sqlTable: "public.orders",

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: "number",
      shown: true,
    },
  },
});
`;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("diagnosticProvider", () => {
  describe("validateDocument", () => {
    // -------------------------------------------------------------------
    // 1. Invalid property name in a dimension
    // -------------------------------------------------------------------
    it("reports error for invalid property name in a dimension (YAML)", () => {
      const doc = parseYamlDocument(YAML_INVALID_PROPERTY);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const errors = diagnostics.filter((d) => d.severity === "error");
      expect(errors.length).toBeGreaterThanOrEqual(1);

      const typoError = errors.find((d) => d.message.includes("'typo_field'"));
      expect(typoError).toBeDefined();
      expect(typoError!.message).toContain("Unknown property");
      expect(typoError!.message).toContain("Valid properties");
    });

    it("reports error for invalid property name in a dimension (JS)", () => {
      const doc = parseJsDocument(JS_INVALID_PROPERTY);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const errors = diagnostics.filter((d) => d.severity === "error");
      expect(errors.length).toBeGreaterThanOrEqual(1);

      const typoError = errors.find((d) => d.message.includes("'typoField'"));
      expect(typoError).toBeDefined();
      expect(typoError!.message).toContain("Unknown property");
      expect(typoError!.message).toContain("Valid properties");
    });

    // -------------------------------------------------------------------
    // 2. Invalid type value for a dimension
    // -------------------------------------------------------------------
    it("reports error for invalid type value (YAML)", () => {
      const doc = parseYamlDocument(YAML_INVALID_TYPE_VALUE);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const typeError = diagnostics.find(
        (d) => d.severity === "error" && d.message.includes("'integer'")
      );
      expect(typeError).toBeDefined();
      expect(typeError!.message).toContain("Invalid value");
      expect(typeError!.message).toContain("Valid values");
      expect(typeError!.message).toContain("string");
      expect(typeError!.message).toContain("number");
      expect(typeError!.message).toContain("time");
    });

    it("reports error for invalid type value (JS)", () => {
      const doc = parseJsDocument(JS_INVALID_TYPE_VALUE);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const typeError = diagnostics.find(
        (d) => d.severity === "error" && d.message.includes("'integer'")
      );
      expect(typeError).toBeDefined();
      expect(typeError!.message).toContain("Invalid value");
      expect(typeError!.message).toContain("Valid values");
    });

    // -------------------------------------------------------------------
    // 3. Missing required property
    // -------------------------------------------------------------------
    it("reports warning for missing required property (YAML)", () => {
      const doc = parseYamlDocument(YAML_MISSING_REQUIRED);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const warnings = diagnostics.filter((d) => d.severity === "warning");
      const typeWarning = warnings.find((d) => d.message.includes("'type'"));
      expect(typeWarning).toBeDefined();
      expect(typeWarning!.message).toContain("Missing required property");
    });

    it("reports warning for missing required property (JS)", () => {
      const doc = parseJsDocument(JS_MISSING_REQUIRED);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const warnings = diagnostics.filter((d) => d.severity === "warning");
      const typeWarning = warnings.find((d) => d.message.includes("'type'"));
      expect(typeWarning).toBeDefined();
      expect(typeWarning!.message).toContain("Missing required property");
    });

    // -------------------------------------------------------------------
    // 4. Deprecated property
    // -------------------------------------------------------------------
    it("reports warning for deprecated property with replacement (YAML)", () => {
      const doc = parseYamlDocument(YAML_DEPRECATED_PROPERTY);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const warnings = diagnostics.filter((d) => d.severity === "warning");
      const deprecatedWarning = warnings.find(
        (d) => d.message.includes("'shown'") && d.message.includes("deprecated")
      );
      expect(deprecatedWarning).toBeDefined();
      expect(deprecatedWarning!.message).toContain("public");
    });

    it("reports warning for deprecated property with replacement (JS)", () => {
      const doc = parseJsDocument(JS_DEPRECATED_PROPERTY);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const warnings = diagnostics.filter((d) => d.severity === "warning");
      const deprecatedWarning = warnings.find(
        (d) => d.message.includes("'shown'") && d.message.includes("deprecated")
      );
      expect(deprecatedWarning).toBeDefined();
      expect(deprecatedWarning!.message).toContain("public");
    });

    // -------------------------------------------------------------------
    // 5. Valid document produces zero errors
    // -------------------------------------------------------------------
    it("produces zero diagnostics for a valid YAML document", () => {
      const doc = parseYamlDocument(YAML_VALID_CUBE);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      expect(diagnostics).toEqual([]);
    });

    it("produces zero diagnostics for a valid JS document", () => {
      const doc = parseJsDocument(JS_VALID_CUBE);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      expect(diagnostics).toEqual([]);
    });

    // -------------------------------------------------------------------
    // 7. Marker lifecycle: errors cleared when document becomes valid
    // -------------------------------------------------------------------
    it("returns empty array when a previously invalid document becomes valid", () => {
      // First, validate an invalid document
      const invalidDoc = parseYamlDocument(YAML_INVALID_PROPERTY);
      const invalidDiags = validateDocument(invalidDoc, cubeJsSpec);
      expect(invalidDiags.length).toBeGreaterThan(0);

      // Then, validate a valid document
      const validDoc = parseYamlDocument(YAML_VALID_CUBE);
      const validDiags = validateDocument(validDoc, cubeJsSpec);
      expect(validDiags).toEqual([]);
    });

    // -------------------------------------------------------------------
    // 8. YAML format uses snake_case property names
    // -------------------------------------------------------------------
    it("validates YAML with snake_case property names", () => {
      const yaml = `cubes:
  - name: orders
    sql_table: public.orders

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
        primary_key: true
        suggest_filter_values: true
`;
      const doc = parseYamlDocument(yaml);
      const diagnostics = validateDocument(doc, cubeJsSpec);
      expect(diagnostics).toEqual([]);
    });

    // -------------------------------------------------------------------
    // 9. JS format uses camelCase property names
    // -------------------------------------------------------------------
    it("validates JS with camelCase property names", () => {
      const js = `cube("orders", {
  sqlTable: "public.orders",

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: "number",
      primaryKey: true,
      suggestFilterValues: true,
    },
  },
});
`;
      const doc = parseJsDocument(js);
      const diagnostics = validateDocument(doc, cubeJsSpec);
      expect(diagnostics).toEqual([]);
    });

    // -------------------------------------------------------------------
    // Unknown top-level property on a cube
    // -------------------------------------------------------------------
    it("reports error for unknown top-level cube property (YAML)", () => {
      const doc = parseYamlDocument(YAML_UNKNOWN_TOP_LEVEL);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const errors = diagnostics.filter((d) => d.severity === "error");
      const bogusError = errors.find((d) => d.message.includes("'bogus_prop'"));
      expect(bogusError).toBeDefined();
      expect(bogusError!.message).toContain("Unknown property");
    });

    // -------------------------------------------------------------------
    // Diagnostics have correct position information
    // -------------------------------------------------------------------
    it("includes correct position information in diagnostics", () => {
      const doc = parseYamlDocument(YAML_INVALID_PROPERTY);
      const diagnostics = validateDocument(doc, cubeJsSpec);

      const typoError = diagnostics.find((d) =>
        d.message.includes("'typo_field'")
      );
      expect(typoError).toBeDefined();
      expect(typoError!.startLineNumber).toBeGreaterThan(0);
      expect(typoError!.startColumn).toBeGreaterThan(0);
      expect(typoError!.endLineNumber).toBeGreaterThanOrEqual(
        typoError!.startLineNumber
      );
      expect(typoError!.endColumn).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------------
  // SC-007: Zero false positives on valid models
  // -------------------------------------------------------------------
  describe("SC-007: Zero false positives on valid models", () => {
    it("produces zero errors for a YAML cube with dimensions, measures, joins, segments, and pre-aggregations", () => {
      const yaml = `cubes:
  - name: orders
    sql_table: public.orders
    data_source: default
    description: "All customer orders"
    public: true

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
        primary_key: true

      - name: status
        sql: "\${CUBE}.status"
        type: string
        title: "Order Status"
        description: "Current status of the order"

      - name: created_at
        sql: "\${CUBE}.created_at"
        type: time

      - name: total_amount
        sql: "\${CUBE}.total_amount"
        type: number
        format: currency

    measures:
      - name: count
        type: count

      - name: total_revenue
        sql: "\${CUBE}.total_amount"
        type: sum
        format: currency
        title: "Total Revenue"
        description: "Sum of all order amounts"

      - name: avg_order_value
        sql: "\${CUBE}.total_amount"
        type: avg
        format: currency

    joins:
      - name: customers
        sql: "\${CUBE}.customer_id = \${customers.id}"
        relationship: many_to_one

      - name: line_items
        sql: "\${CUBE}.id = \${line_items.order_id}"
        relationship: one_to_many

    segments:
      - name: completed_orders
        sql: "\${CUBE}.status = 'completed'"
        title: "Completed Orders"
        public: true

    pre_aggregations:
      - name: main
        type: rollup
        external: true
        scheduled_refresh: true
`;
      const doc = parseYamlDocument(yaml);
      const diagnostics = validateDocument(doc, cubeJsSpec);
      const errors = diagnostics.filter((d) => d.severity === "error");
      expect(errors).toEqual([]);
    });

    it("produces zero errors for a YAML view with cubes and includes", () => {
      const yaml = `views:
  - name: order_summary
    description: "Simplified view of order data for analysts"
    public: true

    cubes:
      - join_path: orders
        includes:
          - id
          - status
          - created_at
          - count
          - total_revenue

      - join_path: customers
        prefix: true
        includes:
          - name
          - email
`;
      const doc = parseYamlDocument(yaml);
      const diagnostics = validateDocument(doc, cubeJsSpec);
      const errors = diagnostics.filter((d) => d.severity === "error");
      expect(errors).toEqual([]);
    });

    it("produces zero errors for a JS cube with dimensions and measures using template literals", () => {
      const js = `cube("products", {
  sqlTable: "public.products",
  dataSource: "default",
  description: "Product catalog",
  public: true,

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: "number",
      primaryKey: true,
    },
    name: {
      sql: \`\${CUBE}.name\`,
      type: "string",
      title: "Product Name",
      description: "Display name of the product",
    },
    category: {
      sql: \`\${CUBE}.category\`,
      type: "string",
      suggestFilterValues: true,
    },
    price: {
      sql: \`\${CUBE}.price\`,
      type: "number",
      format: "currency",
    },
    createdAt: {
      sql: \`\${CUBE}.created_at\`,
      type: "time",
    },
  },

  measures: {
    count: {
      type: "count",
    },
    totalPrice: {
      sql: \`\${CUBE}.price\`,
      type: "sum",
      format: "currency",
    },
    avgPrice: {
      sql: \`\${CUBE}.price\`,
      type: "avg",
      format: "currency",
      title: "Average Price",
    },
    maxPrice: {
      sql: \`\${CUBE}.price\`,
      type: "max",
    },
    minPrice: {
      sql: \`\${CUBE}.price\`,
      type: "min",
    },
  },

  joins: {
    orders: {
      sql: \`\${CUBE}.id = \${orders.product_id}\`,
      relationship: "belongsTo",
    },
  },

  segments: {
    active: {
      sql: \`\${CUBE}.is_active = true\`,
      public: true,
    },
  },
});
`;
      const doc = parseJsDocument(js);
      const diagnostics = validateDocument(doc, cubeJsSpec);
      const errors = diagnostics.filter((d) => d.severity === "error");
      expect(errors).toEqual([]);
    });

    it("produces zero warnings AND zero errors for minimal valid models", () => {
      // Minimal YAML cube — just the required fields
      const yamlMinimal = `cubes:
  - name: events
    sql_table: public.events

    dimensions:
      - name: id
        sql: "\${CUBE}.id"
        type: number
        primary_key: true

    measures:
      - name: count
        type: count
`;
      const yamlDoc = parseYamlDocument(yamlMinimal);
      const yamlDiags = validateDocument(yamlDoc, cubeJsSpec);
      expect(yamlDiags).toEqual([]);

      // Minimal JS cube
      const jsMinimal = `cube("events", {
  sqlTable: "public.events",

  dimensions: {
    id: {
      sql: \`\${CUBE}.id\`,
      type: "number",
      primaryKey: true,
    },
  },

  measures: {
    count: {
      type: "count",
    },
  },
});
`;
      const jsDoc = parseJsDocument(jsMinimal);
      const jsDiags = validateDocument(jsDoc, cubeJsSpec);
      expect(jsDiags).toEqual([]);
    });

    it("produces zero errors for a JS cube using snake_case keys (smart-generated pattern)", () => {
      const js = `cube(\`semantic_events\`, {
  sql_table: \`cst.semantic_events\`,

  meta: {
    auto_generated: true,
    source_database: "cst",
    source_table: "semantic_events",
  },

  dimensions: {
    timestamp: {
      sql: \`\${CUBE}.timestamp\`,
      type: \`time\`,
      meta: {
        source_column: "timestamp",
        raw_type: "DateTime64(3)",
        auto_generated: true,
      },
    },
    event: {
      sql: \`\${CUBE}.event\`,
      type: \`string\`,
      meta: {
        source_column: "event",
        raw_type: "LowCardinality(String)",
        auto_generated: true,
      },
    },
    customer_facing: {
      sql: \`(\${CUBE}.customer_facing) = 1\`,
      type: \`boolean\`,
    },
  },

  measures: {
    count: {
      type: \`count\`,
    },
    total_duration: {
      sql: \`\${CUBE}.duration\`,
      type: \`sum\`,
    },
  },

  pre_aggregations: {
    main: {
      type: "rollup",
      external: true,
      scheduled_refresh: true,
    },
  },
});
`;
      const doc = parseJsDocument(js);
      const diagnostics = validateDocument(doc, cubeJsSpec);
      const errors = diagnostics.filter((d) => d.severity === "error");
      expect(errors).toEqual([]);
    });
  });

  // -------------------------------------------------------------------
  // 6. Backend error mapping
  // -------------------------------------------------------------------
  describe("mapBackendErrors", () => {
    it("converts ValidationError[] to DiagnosticItem[] with correct severity and position", () => {
      const backendErrors: ValidationError[] = [
        {
          severity: "error",
          message: 'Cube "foo" references unknown cube "bar"',
          fileName: "model.yml",
          startLine: 10,
          startColumn: 5,
          endLine: 10,
          endColumn: 20,
        },
        {
          severity: "warning",
          message: 'Unused dimension "baz"',
          fileName: "model.yml",
          startLine: 15,
          startColumn: 3,
          endLine: null,
          endColumn: null,
        },
      ];

      const items = mapBackendErrors(backendErrors);

      expect(items).toHaveLength(2);

      // First error
      expect(items[0].severity).toBe("error");
      expect(items[0].message).toBe('Cube "foo" references unknown cube "bar"');
      expect(items[0].startLineNumber).toBe(10);
      expect(items[0].startColumn).toBe(5);
      expect(items[0].endLineNumber).toBe(10);
      expect(items[0].endColumn).toBe(20);

      // Second warning — null end values fall back to start values
      expect(items[1].severity).toBe("warning");
      expect(items[1].message).toBe('Unused dimension "baz"');
      expect(items[1].startLineNumber).toBe(15);
      expect(items[1].startColumn).toBe(3);
      expect(items[1].endLineNumber).toBe(15);
      expect(items[1].endColumn).toBe(3);
    });

    it("returns empty array for empty input", () => {
      expect(mapBackendErrors([])).toEqual([]);
    });
  });
});
