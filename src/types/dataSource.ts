import type { Branch_Statuses_Enum } from "@/graphql/generated";

import type { ReactNode } from "react";

export interface ApiSetupField {
  label: string;
  name: string;
  value: string;
  type?: string;
  disabled?: boolean;
}

export interface DataSource {
  name?: string;
  icon?: ReactNode;
  value?: string;
  url?: string;
  deprecated?: boolean;
}

export interface DataSoureSetupField {
  name: string;
  label: string;
  type?:
    | "text"
    | "checkbox"
    | "password"
    | "file"
    | "number"
    | "radio"
    | "select";
  rules?: object;
  value?: string;
  placeholder?: string;
  options?: { label: string; value: string }[];
  dependsOn?: { field: string; value: string };
}

export interface Column {
  attributes: [];
  name: string;
  type: string;
}

export type Table = Record<string, Column[]>;

export type Schema = Record<string, Table>;

export type DynamicForm = Record<string, any>;

export interface ApiSetupForm {
  datasource_id?: string;
  user_id?: string;
  name: string;
  db_username: string;
  db: string;
  host: string;
  password: string;
  connection?: string;
  connection_string?: string;
}

export interface DataSourceSetupForm {
  id?: string;
  name: string;
  db_params?: DynamicForm;
}

export interface DataSourceForm {
  dataSource?: DataSource;
  dataSourceSetup?: DataSourceSetupForm;
  dataModel?: DynamicForm;
  apiSetup?: ApiSetupForm;
  schema?: Schema;
}

export interface DataSourceInfo {
  id: string | null | undefined;
  type: DataSource;
  name: string;
  dbParams: DynamicForm;
  updatedAt: string;
  createdAt: string;
  branches: Branch[];
}

export interface CubeOption {
  name: string;
  title: string;
  shortTitle: string;
  type: string;
}

export interface Cube {
  name: string;
  title: string;
  dimensions: CubeOption[];
  measures: CubeOption[];
  segments: CubeOption[];
}

export interface DataSchema {
  id: string;
  name: string;
  code: string;
  checksum: string;
}

export interface Version {
  id: string;
  dataSchemas: DataSchema[];
}

export interface Branch {
  id: string;
  name: string;
  status: Branch_Statuses_Enum;
}
