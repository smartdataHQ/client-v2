/**
 * Shared types for the Cube.js language service.
 * Definitions per specs/006-model-authoring/data-model.md
 */

// ---------------------------------------------------------------------------
// Monaco Range
// ---------------------------------------------------------------------------

export interface MonacoRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

// ---------------------------------------------------------------------------
// Schema Spec Types
// ---------------------------------------------------------------------------

export type PropertyValueType =
  | "string"
  | "boolean"
  | "number"
  | "enum"
  | "object"
  | "array"
  | "sql"
  | "reference"
  | "function";

export type ReferenceType =
  | "cube"
  | "dimension"
  | "measure"
  | "segment"
  | "pre_aggregation";

export interface PropertySpec {
  key: string;
  jsKey: string;
  yamlKey: string;
  type: PropertyValueType;
  required: boolean;
  values?: string[];
  description: string;
  deprecated?: boolean;
  deprecatedBy?: string;
  children?: Record<string, PropertySpec>;
  referenceType?: ReferenceType;
}

export interface MemberTypeSpec {
  name: string;
  properties: Record<string, PropertySpec>;
  typeValues: string[];
}

export interface TemplateVariableSpec {
  name: string;
  description: string;
  methods?: string[];
  snippet?: string;
}

export interface ConstructSpec {
  name: string;
  properties: Record<string, PropertySpec>;
  memberTypes: Record<string, MemberTypeSpec>;
}

export interface SchemaSpec {
  version: string;
  constructs: Record<string, ConstructSpec>;
  templateVariables: TemplateVariableSpec[];
}

// ---------------------------------------------------------------------------
// Cube Registry Types (runtime, from FetchMeta)
// ---------------------------------------------------------------------------

export interface MemberEntry {
  name: string;
  title: string;
  type: string;
  primaryKey?: boolean;
}

export interface CubeRegistryEntry {
  name: string;
  title: string;
  type: "cube" | "view";
  dimensions: MemberEntry[];
  measures: MemberEntry[];
  segments: MemberEntry[];
}

export type RegistryStatus =
  | "empty"
  | "loading"
  | "ready"
  | "refreshing"
  | "error";

export interface TableColumnEntry {
  name: string;
  type: string;
}

// ---------------------------------------------------------------------------
// Parsed Document Types (transient, from parsers)
// ---------------------------------------------------------------------------

export interface ParseError {
  message: string;
  range: MonacoRange;
}

export interface ParsedProperty {
  key: string;
  value: unknown;
  range: MonacoRange;
  valueRange: MonacoRange;
}

export interface ParsedMember {
  name: string;
  range: MonacoRange;
  nameRange: MonacoRange;
  properties: ParsedProperty[];
}

export interface ParsedCube {
  name: string;
  nameRange: MonacoRange;
  properties: ParsedProperty[];
  members: Record<string, ParsedMember[]>;
}

export interface ParsedView {
  name: string;
  nameRange: MonacoRange;
  properties: ParsedProperty[];
  members: Record<string, ParsedMember[]>;
}

export interface ParsedDocument {
  format: "yaml" | "js";
  cubes: ParsedCube[];
  views: ParsedView[];
  errors: ParseError[];
}

// ---------------------------------------------------------------------------
// Cursor Context (union type for all possible cursor positions)
// ---------------------------------------------------------------------------

export type CursorContext =
  | { type: "unknown" }
  | { type: "cube_root"; cubeName: string; constructType: "cube" | "view" }
  | { type: "member_list"; cubeName: string; memberType: string }
  | {
      type: "member_body";
      cubeName: string;
      memberType: string;
      memberName: string;
      existingKeys: string[];
    }
  | {
      type: "property_value";
      cubeName: string;
      memberType: string | null;
      memberName: string | null;
      propertyKey: string;
    }
  | {
      type: "sql";
      cubeName: string;
      memberType: string | null;
      memberName: string | null;
      isTemplateLiteral: boolean;
      prefix: string;
    };

// ---------------------------------------------------------------------------
// Validation Error (backend → frontend)
// ---------------------------------------------------------------------------

export interface ValidationError {
  severity: "error" | "warning";
  message: string;
  fileName: string;
  startLine: number;
  startColumn: number;
  endLine: number | null;
  endColumn: number | null;
}
