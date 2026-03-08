import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends Record<string, unknown>> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends Record<string, unknown>, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  citext: { input: any; output: any };
  float8: { input: any; output: any };
  json: { input: any; output: any };
  jsonb: { input: any; output: any };
  numeric: { input: any; output: any };
  timestamptz: { input: any; output: any };
  uuid: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _gte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lte?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Scalars["Boolean"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Boolean"]["input"]>>;
};

export type CheckConnectionOutput = {
  __typename?: "CheckConnectionOutput";
  code: Scalars["String"]["output"];
  message?: Maybe<Scalars["String"]["output"]>;
};

export type CreateTeamOutput = {
  __typename?: "CreateTeamOutput";
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type ExportDataModelsOutput = {
  __typename?: "ExportDataModelsOutput";
  download_url: Scalars["String"]["output"];
};

export type FetchDatasetOutput = {
  __typename?: "FetchDatasetOutput";
  annotation?: Maybe<Scalars["json"]["output"]>;
  data?: Maybe<Scalars["json"]["output"]>;
  dataSource?: Maybe<Scalars["String"]["output"]>;
  dbType?: Maybe<Scalars["String"]["output"]>;
  external?: Maybe<Scalars["Boolean"]["output"]>;
  hitLimit?: Maybe<Scalars["Boolean"]["output"]>;
  lastRefreshTime?: Maybe<Scalars["String"]["output"]>;
  progress?: Maybe<Scalars["json"]["output"]>;
  query?: Maybe<Scalars["json"]["output"]>;
  slowQuery?: Maybe<Scalars["Boolean"]["output"]>;
};

export type GenSqlOutput = {
  __typename?: "GenSQLOutput";
  result?: Maybe<Scalars["json"]["output"]>;
};

export type GenSourceSchemaOutput = {
  __typename?: "GenSourceSchemaOutput";
  code: Scalars["String"]["output"];
  message?: Maybe<Scalars["String"]["output"]>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["Int"]["input"]>;
  _gt?: InputMaybe<Scalars["Int"]["input"]>;
  _gte?: InputMaybe<Scalars["Int"]["input"]>;
  _in?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["Int"]["input"]>;
  _lte?: InputMaybe<Scalars["Int"]["input"]>;
  _neq?: InputMaybe<Scalars["Int"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type InviteTeamMemberOutput = {
  __typename?: "InviteTeamMemberOutput";
  code?: Maybe<Scalars["String"]["output"]>;
  memberId?: Maybe<Scalars["uuid"]["output"]>;
  message?: Maybe<Scalars["String"]["output"]>;
};

export type PreAggregationPreviewOutput = {
  __typename?: "PreAggregationPreviewOutput";
  data: Scalars["json"]["output"];
};

export type PreAggregationsOutput = {
  __typename?: "PreAggregationsOutput";
  data: Scalars["json"]["output"];
};

export type RunSourceQueryOutput = {
  __typename?: "RunSourceQueryOutput";
  result?: Maybe<Scalars["json"]["output"]>;
};

export type SendTestAlertOutput = {
  __typename?: "SendTestAlertOutput";
  error?: Maybe<Scalars["Boolean"]["output"]>;
  result?: Maybe<Scalars["json"]["output"]>;
};

export type SourceMetaOutput = {
  __typename?: "SourceMetaOutput";
  cubes?: Maybe<Scalars["json"]["output"]>;
};

export type SourceTable = {
  name: Scalars["String"]["input"];
  schema: Scalars["String"]["input"];
};

export type SourceTablesOutput = {
  __typename?: "SourceTablesOutput";
  schema?: Maybe<Scalars["json"]["output"]>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["String"]["input"]>;
  _gt?: InputMaybe<Scalars["String"]["input"]>;
  _gte?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["String"]["input"]>;
  _in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["String"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["String"]["input"]>;
  _lt?: InputMaybe<Scalars["String"]["input"]>;
  _lte?: InputMaybe<Scalars["String"]["input"]>;
  _neq?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["String"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["String"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "access_lists" */
export type Access_Lists = {
  __typename?: "access_lists";
  config: Scalars["jsonb"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  member_roles: Array<Member_Roles>;
  /** An aggregate relationship */
  member_roles_aggregate: Member_Roles_Aggregate;
  name: Scalars["String"]["output"];
  /** An object relationship */
  team: Teams;
  team_id: Scalars["uuid"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "access_lists" */
export type Access_ListsConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "access_lists" */
export type Access_ListsMember_RolesArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

/** columns and relationships of "access_lists" */
export type Access_ListsMember_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

/** aggregated selection of "access_lists" */
export type Access_Lists_Aggregate = {
  __typename?: "access_lists_aggregate";
  aggregate?: Maybe<Access_Lists_Aggregate_Fields>;
  nodes: Array<Access_Lists>;
};

export type Access_Lists_Aggregate_Bool_Exp = {
  count?: InputMaybe<Access_Lists_Aggregate_Bool_Exp_Count>;
};

export type Access_Lists_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Access_Lists_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Access_Lists_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "access_lists" */
export type Access_Lists_Aggregate_Fields = {
  __typename?: "access_lists_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Access_Lists_Max_Fields>;
  min?: Maybe<Access_Lists_Min_Fields>;
};

/** aggregate fields of "access_lists" */
export type Access_Lists_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Access_Lists_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "access_lists" */
export type Access_Lists_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Access_Lists_Max_Order_By>;
  min?: InputMaybe<Access_Lists_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Access_Lists_Append_Input = {
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "access_lists" */
export type Access_Lists_Arr_Rel_Insert_Input = {
  data: Array<Access_Lists_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Access_Lists_On_Conflict>;
};

/** Boolean expression to filter rows from the table "access_lists". All fields are combined with a logical 'AND'. */
export type Access_Lists_Bool_Exp = {
  _and?: InputMaybe<Array<Access_Lists_Bool_Exp>>;
  _not?: InputMaybe<Access_Lists_Bool_Exp>;
  _or?: InputMaybe<Array<Access_Lists_Bool_Exp>>;
  config?: InputMaybe<Jsonb_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  member_roles?: InputMaybe<Member_Roles_Bool_Exp>;
  member_roles_aggregate?: InputMaybe<Member_Roles_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  team?: InputMaybe<Teams_Bool_Exp>;
  team_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "access_lists" */
export enum Access_Lists_Constraint {
  /** unique or primary key constraint on columns "id" */
  AccessListsPkey = "access_lists_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Access_Lists_Delete_At_Path_Input = {
  config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Access_Lists_Delete_Elem_Input = {
  config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Access_Lists_Delete_Key_Input = {
  config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "access_lists" */
export type Access_Lists_Insert_Input = {
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  member_roles?: InputMaybe<Member_Roles_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  team?: InputMaybe<Teams_Obj_Rel_Insert_Input>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Access_Lists_Max_Fields = {
  __typename?: "access_lists_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "access_lists" */
export type Access_Lists_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Access_Lists_Min_Fields = {
  __typename?: "access_lists_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "access_lists" */
export type Access_Lists_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "access_lists" */
export type Access_Lists_Mutation_Response = {
  __typename?: "access_lists_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Access_Lists>;
};

/** input type for inserting object relation for remote table "access_lists" */
export type Access_Lists_Obj_Rel_Insert_Input = {
  data: Access_Lists_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Access_Lists_On_Conflict>;
};

/** on_conflict condition type for table "access_lists" */
export type Access_Lists_On_Conflict = {
  constraint: Access_Lists_Constraint;
  update_columns?: Array<Access_Lists_Update_Column>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

/** Ordering options when selecting data from "access_lists". */
export type Access_Lists_Order_By = {
  config?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member_roles_aggregate?: InputMaybe<Member_Roles_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  team?: InputMaybe<Teams_Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: access_lists */
export type Access_Lists_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Access_Lists_Prepend_Input = {
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "access_lists" */
export enum Access_Lists_Select_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "access_lists" */
export type Access_Lists_Set_Input = {
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "access_lists" */
export type Access_Lists_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Access_Lists_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Access_Lists_Stream_Cursor_Value_Input = {
  config?: InputMaybe<Scalars["jsonb"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "access_lists" */
export enum Access_Lists_Update_Column {
  /** column name */
  Config = "config",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Access_Lists_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Access_Lists_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Access_Lists_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Access_Lists_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Access_Lists_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Access_Lists_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Access_Lists_Set_Input>;
  /** filter the rows which have to be updated */
  where: Access_Lists_Bool_Exp;
};

/** columns and relationships of "alerts" */
export type Alerts = {
  __typename?: "alerts";
  created_at: Scalars["timestamptz"]["output"];
  delivery_config: Scalars["jsonb"]["output"];
  delivery_type: Scalars["String"]["output"];
  /** An object relationship */
  exploration: Explorations;
  exploration_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  locks_config: Scalars["jsonb"]["output"];
  name: Scalars["String"]["output"];
  schedule: Scalars["String"]["output"];
  /** An object relationship */
  team?: Maybe<Teams>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  trigger_config: Scalars["jsonb"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "alerts" */
export type AlertsDelivery_ConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "alerts" */
export type AlertsLocks_ConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "alerts" */
export type AlertsTrigger_ConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "alerts" */
export type Alerts_Aggregate = {
  __typename?: "alerts_aggregate";
  aggregate?: Maybe<Alerts_Aggregate_Fields>;
  nodes: Array<Alerts>;
};

export type Alerts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Alerts_Aggregate_Bool_Exp_Count>;
};

export type Alerts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Alerts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Alerts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "alerts" */
export type Alerts_Aggregate_Fields = {
  __typename?: "alerts_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Alerts_Max_Fields>;
  min?: Maybe<Alerts_Min_Fields>;
};

/** aggregate fields of "alerts" */
export type Alerts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Alerts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "alerts" */
export type Alerts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Alerts_Max_Order_By>;
  min?: InputMaybe<Alerts_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Alerts_Append_Input = {
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  locks_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  trigger_config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "alerts" */
export type Alerts_Arr_Rel_Insert_Input = {
  data: Array<Alerts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Alerts_On_Conflict>;
};

/** Boolean expression to filter rows from the table "alerts". All fields are combined with a logical 'AND'. */
export type Alerts_Bool_Exp = {
  _and?: InputMaybe<Array<Alerts_Bool_Exp>>;
  _not?: InputMaybe<Alerts_Bool_Exp>;
  _or?: InputMaybe<Array<Alerts_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  delivery_config?: InputMaybe<Jsonb_Comparison_Exp>;
  delivery_type?: InputMaybe<String_Comparison_Exp>;
  exploration?: InputMaybe<Explorations_Bool_Exp>;
  exploration_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  locks_config?: InputMaybe<Jsonb_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  schedule?: InputMaybe<String_Comparison_Exp>;
  team?: InputMaybe<Teams_Bool_Exp>;
  team_id?: InputMaybe<Uuid_Comparison_Exp>;
  trigger_config?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "alerts" */
export enum Alerts_Constraint {
  /** unique or primary key constraint on columns "id" */
  AlertsPkey = "alerts_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Alerts_Delete_At_Path_Input = {
  delivery_config?: InputMaybe<Array<Scalars["String"]["input"]>>;
  locks_config?: InputMaybe<Array<Scalars["String"]["input"]>>;
  trigger_config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Alerts_Delete_Elem_Input = {
  delivery_config?: InputMaybe<Scalars["Int"]["input"]>;
  locks_config?: InputMaybe<Scalars["Int"]["input"]>;
  trigger_config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Alerts_Delete_Key_Input = {
  delivery_config?: InputMaybe<Scalars["String"]["input"]>;
  locks_config?: InputMaybe<Scalars["String"]["input"]>;
  trigger_config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "alerts" */
export type Alerts_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  delivery_type?: InputMaybe<Scalars["String"]["input"]>;
  exploration?: InputMaybe<Explorations_Obj_Rel_Insert_Input>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  locks_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  schedule?: InputMaybe<Scalars["String"]["input"]>;
  team?: InputMaybe<Teams_Obj_Rel_Insert_Input>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  trigger_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Alerts_Max_Fields = {
  __typename?: "alerts_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  delivery_type?: Maybe<Scalars["String"]["output"]>;
  exploration_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  schedule?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "alerts" */
export type Alerts_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  delivery_type?: InputMaybe<Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  schedule?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Alerts_Min_Fields = {
  __typename?: "alerts_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  delivery_type?: Maybe<Scalars["String"]["output"]>;
  exploration_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  schedule?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "alerts" */
export type Alerts_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  delivery_type?: InputMaybe<Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  schedule?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "alerts" */
export type Alerts_Mutation_Response = {
  __typename?: "alerts_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Alerts>;
};

/** on_conflict condition type for table "alerts" */
export type Alerts_On_Conflict = {
  constraint: Alerts_Constraint;
  update_columns?: Array<Alerts_Update_Column>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

/** Ordering options when selecting data from "alerts". */
export type Alerts_Order_By = {
  created_at?: InputMaybe<Order_By>;
  delivery_config?: InputMaybe<Order_By>;
  delivery_type?: InputMaybe<Order_By>;
  exploration?: InputMaybe<Explorations_Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  locks_config?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  schedule?: InputMaybe<Order_By>;
  team?: InputMaybe<Teams_Order_By>;
  team_id?: InputMaybe<Order_By>;
  trigger_config?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: alerts */
export type Alerts_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Alerts_Prepend_Input = {
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  locks_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  trigger_config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "alerts" */
export enum Alerts_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeliveryConfig = "delivery_config",
  /** column name */
  DeliveryType = "delivery_type",
  /** column name */
  ExplorationId = "exploration_id",
  /** column name */
  Id = "id",
  /** column name */
  LocksConfig = "locks_config",
  /** column name */
  Name = "name",
  /** column name */
  Schedule = "schedule",
  /** column name */
  TeamId = "team_id",
  /** column name */
  TriggerConfig = "trigger_config",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "alerts" */
export type Alerts_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  delivery_type?: InputMaybe<Scalars["String"]["input"]>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  locks_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  schedule?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  trigger_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "alerts" */
export type Alerts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Alerts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Alerts_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  delivery_type?: InputMaybe<Scalars["String"]["input"]>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  locks_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  schedule?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  trigger_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "alerts" */
export enum Alerts_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeliveryConfig = "delivery_config",
  /** column name */
  DeliveryType = "delivery_type",
  /** column name */
  ExplorationId = "exploration_id",
  /** column name */
  Id = "id",
  /** column name */
  LocksConfig = "locks_config",
  /** column name */
  Name = "name",
  /** column name */
  Schedule = "schedule",
  /** column name */
  TeamId = "team_id",
  /** column name */
  TriggerConfig = "trigger_config",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Alerts_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Alerts_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Alerts_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Alerts_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Alerts_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Alerts_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Alerts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Alerts_Bool_Exp;
};

/** columns and relationships of "auth.account_providers" */
export type Auth_Account_Providers = {
  __typename?: "auth_account_providers";
  /** An object relationship */
  account: Auth_Accounts;
  account_id: Scalars["uuid"]["output"];
  auth_provider: Scalars["String"]["output"];
  auth_provider_unique_id: Scalars["String"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  provider: Auth_Providers;
  updated_at: Scalars["timestamptz"]["output"];
};

/** aggregated selection of "auth.account_providers" */
export type Auth_Account_Providers_Aggregate = {
  __typename?: "auth_account_providers_aggregate";
  aggregate?: Maybe<Auth_Account_Providers_Aggregate_Fields>;
  nodes: Array<Auth_Account_Providers>;
};

export type Auth_Account_Providers_Aggregate_Bool_Exp = {
  count?: InputMaybe<Auth_Account_Providers_Aggregate_Bool_Exp_Count>;
};

export type Auth_Account_Providers_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.account_providers" */
export type Auth_Account_Providers_Aggregate_Fields = {
  __typename?: "auth_account_providers_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Account_Providers_Max_Fields>;
  min?: Maybe<Auth_Account_Providers_Min_Fields>;
};

/** aggregate fields of "auth.account_providers" */
export type Auth_Account_Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "auth.account_providers" */
export type Auth_Account_Providers_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Auth_Account_Providers_Max_Order_By>;
  min?: InputMaybe<Auth_Account_Providers_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.account_providers" */
export type Auth_Account_Providers_Arr_Rel_Insert_Input = {
  data: Array<Auth_Account_Providers_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Account_Providers_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.account_providers". All fields are combined with a logical 'AND'. */
export type Auth_Account_Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Account_Providers_Bool_Exp>>;
  _not?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Account_Providers_Bool_Exp>>;
  account?: InputMaybe<Auth_Accounts_Bool_Exp>;
  account_id?: InputMaybe<Uuid_Comparison_Exp>;
  auth_provider?: InputMaybe<String_Comparison_Exp>;
  auth_provider_unique_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  provider?: InputMaybe<Auth_Providers_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.account_providers" */
export enum Auth_Account_Providers_Constraint {
  /** unique or primary key constraint on columns "auth_provider", "account_id" */
  AccountProvidersAccountIdAuthProviderKey = "account_providers_account_id_auth_provider_key",
  /** unique or primary key constraint on columns "auth_provider", "auth_provider_unique_id" */
  AccountProvidersAuthProviderAuthProviderUniqueIdKey = "account_providers_auth_provider_auth_provider_unique_id_key",
  /** unique or primary key constraint on columns "id" */
  AccountProvidersPkey = "account_providers_pkey",
}

/** input type for inserting data into table "auth.account_providers" */
export type Auth_Account_Providers_Insert_Input = {
  account?: InputMaybe<Auth_Accounts_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  auth_provider?: InputMaybe<Scalars["String"]["input"]>;
  auth_provider_unique_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  provider?: InputMaybe<Auth_Providers_Obj_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Auth_Account_Providers_Max_Fields = {
  __typename?: "auth_account_providers_max_fields";
  account_id?: Maybe<Scalars["uuid"]["output"]>;
  auth_provider?: Maybe<Scalars["String"]["output"]>;
  auth_provider_unique_id?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "auth.account_providers" */
export type Auth_Account_Providers_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  auth_provider?: InputMaybe<Order_By>;
  auth_provider_unique_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Auth_Account_Providers_Min_Fields = {
  __typename?: "auth_account_providers_min_fields";
  account_id?: Maybe<Scalars["uuid"]["output"]>;
  auth_provider?: Maybe<Scalars["String"]["output"]>;
  auth_provider_unique_id?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "auth.account_providers" */
export type Auth_Account_Providers_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  auth_provider?: InputMaybe<Order_By>;
  auth_provider_unique_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.account_providers" */
export type Auth_Account_Providers_Mutation_Response = {
  __typename?: "auth_account_providers_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Account_Providers>;
};

/** on_conflict condition type for table "auth.account_providers" */
export type Auth_Account_Providers_On_Conflict = {
  constraint: Auth_Account_Providers_Constraint;
  update_columns?: Array<Auth_Account_Providers_Update_Column>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.account_providers". */
export type Auth_Account_Providers_Order_By = {
  account?: InputMaybe<Auth_Accounts_Order_By>;
  account_id?: InputMaybe<Order_By>;
  auth_provider?: InputMaybe<Order_By>;
  auth_provider_unique_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  provider?: InputMaybe<Auth_Providers_Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.account_providers */
export type Auth_Account_Providers_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "auth.account_providers" */
export enum Auth_Account_Providers_Select_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  AuthProvider = "auth_provider",
  /** column name */
  AuthProviderUniqueId = "auth_provider_unique_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "auth.account_providers" */
export type Auth_Account_Providers_Set_Input = {
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  auth_provider?: InputMaybe<Scalars["String"]["input"]>;
  auth_provider_unique_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "auth_account_providers" */
export type Auth_Account_Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Account_Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Account_Providers_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  auth_provider?: InputMaybe<Scalars["String"]["input"]>;
  auth_provider_unique_id?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "auth.account_providers" */
export enum Auth_Account_Providers_Update_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  AuthProvider = "auth_provider",
  /** column name */
  AuthProviderUniqueId = "auth_provider_unique_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Auth_Account_Providers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Account_Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Account_Providers_Bool_Exp;
};

/** columns and relationships of "auth.account_roles" */
export type Auth_Account_Roles = {
  __typename?: "auth_account_roles";
  /** An object relationship */
  account: Auth_Accounts;
  account_id: Scalars["uuid"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  role: Scalars["String"]["output"];
  /** An object relationship */
  roleByRole: Auth_Roles;
};

/** aggregated selection of "auth.account_roles" */
export type Auth_Account_Roles_Aggregate = {
  __typename?: "auth_account_roles_aggregate";
  aggregate?: Maybe<Auth_Account_Roles_Aggregate_Fields>;
  nodes: Array<Auth_Account_Roles>;
};

export type Auth_Account_Roles_Aggregate_Bool_Exp = {
  count?: InputMaybe<Auth_Account_Roles_Aggregate_Bool_Exp_Count>;
};

export type Auth_Account_Roles_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.account_roles" */
export type Auth_Account_Roles_Aggregate_Fields = {
  __typename?: "auth_account_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Account_Roles_Max_Fields>;
  min?: Maybe<Auth_Account_Roles_Min_Fields>;
};

/** aggregate fields of "auth.account_roles" */
export type Auth_Account_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "auth.account_roles" */
export type Auth_Account_Roles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Auth_Account_Roles_Max_Order_By>;
  min?: InputMaybe<Auth_Account_Roles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.account_roles" */
export type Auth_Account_Roles_Arr_Rel_Insert_Input = {
  data: Array<Auth_Account_Roles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Account_Roles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.account_roles". All fields are combined with a logical 'AND'. */
export type Auth_Account_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Account_Roles_Bool_Exp>>;
  _not?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Account_Roles_Bool_Exp>>;
  account?: InputMaybe<Auth_Accounts_Bool_Exp>;
  account_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  roleByRole?: InputMaybe<Auth_Roles_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.account_roles" */
export enum Auth_Account_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  AccountRolesPkey = "account_roles_pkey",
  /** unique or primary key constraint on columns "account_id", "role" */
  UserRolesAccountIdRoleKey = "user_roles_account_id_role_key",
}

/** input type for inserting data into table "auth.account_roles" */
export type Auth_Account_Roles_Insert_Input = {
  account?: InputMaybe<Auth_Accounts_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  roleByRole?: InputMaybe<Auth_Roles_Obj_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Auth_Account_Roles_Max_Fields = {
  __typename?: "auth_account_roles_max_fields";
  account_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "auth.account_roles" */
export type Auth_Account_Roles_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Auth_Account_Roles_Min_Fields = {
  __typename?: "auth_account_roles_min_fields";
  account_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "auth.account_roles" */
export type Auth_Account_Roles_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.account_roles" */
export type Auth_Account_Roles_Mutation_Response = {
  __typename?: "auth_account_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Account_Roles>;
};

/** on_conflict condition type for table "auth.account_roles" */
export type Auth_Account_Roles_On_Conflict = {
  constraint: Auth_Account_Roles_Constraint;
  update_columns?: Array<Auth_Account_Roles_Update_Column>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.account_roles". */
export type Auth_Account_Roles_Order_By = {
  account?: InputMaybe<Auth_Accounts_Order_By>;
  account_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  roleByRole?: InputMaybe<Auth_Roles_Order_By>;
};

/** primary key columns input for table: auth.account_roles */
export type Auth_Account_Roles_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "auth.account_roles" */
export enum Auth_Account_Roles_Select_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Role = "role",
}

/** input type for updating data in table "auth.account_roles" */
export type Auth_Account_Roles_Set_Input = {
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "auth_account_roles" */
export type Auth_Account_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Account_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Account_Roles_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "auth.account_roles" */
export enum Auth_Account_Roles_Update_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Role = "role",
}

export type Auth_Account_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Account_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Account_Roles_Bool_Exp;
};

/** columns and relationships of "auth.accounts" */
export type Auth_Accounts = {
  __typename?: "auth_accounts";
  /** An array relationship */
  account_providers: Array<Auth_Account_Providers>;
  /** An aggregate relationship */
  account_providers_aggregate: Auth_Account_Providers_Aggregate;
  /** An array relationship */
  account_roles: Array<Auth_Account_Roles>;
  /** An aggregate relationship */
  account_roles_aggregate: Auth_Account_Roles_Aggregate;
  active: Scalars["Boolean"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  custom_register_data?: Maybe<Scalars["jsonb"]["output"]>;
  default_role: Scalars["String"]["output"];
  email?: Maybe<Scalars["citext"]["output"]>;
  id: Scalars["uuid"]["output"];
  is_anonymous: Scalars["Boolean"]["output"];
  mfa_enabled: Scalars["Boolean"]["output"];
  new_email?: Maybe<Scalars["citext"]["output"]>;
  otp_secret?: Maybe<Scalars["String"]["output"]>;
  password_hash?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  refresh_tokens: Array<Auth_Refresh_Tokens>;
  /** An aggregate relationship */
  refresh_tokens_aggregate: Auth_Refresh_Tokens_Aggregate;
  /** An object relationship */
  role: Auth_Roles;
  ticket: Scalars["uuid"]["output"];
  ticket_expires_at: Scalars["timestamptz"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "auth.accounts" */
export type Auth_AccountsAccount_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

/** columns and relationships of "auth.accounts" */
export type Auth_AccountsAccount_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

/** columns and relationships of "auth.accounts" */
export type Auth_AccountsAccount_RolesArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

/** columns and relationships of "auth.accounts" */
export type Auth_AccountsAccount_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

/** columns and relationships of "auth.accounts" */
export type Auth_AccountsCustom_Register_DataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "auth.accounts" */
export type Auth_AccountsRefresh_TokensArgs = {
  distinct_on?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

/** columns and relationships of "auth.accounts" */
export type Auth_AccountsRefresh_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

/** aggregated selection of "auth.accounts" */
export type Auth_Accounts_Aggregate = {
  __typename?: "auth_accounts_aggregate";
  aggregate?: Maybe<Auth_Accounts_Aggregate_Fields>;
  nodes: Array<Auth_Accounts>;
};

export type Auth_Accounts_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Auth_Accounts_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Auth_Accounts_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Auth_Accounts_Aggregate_Bool_Exp_Count>;
};

export type Auth_Accounts_Aggregate_Bool_Exp_Bool_And = {
  arguments: Auth_Accounts_Select_Column_Auth_Accounts_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Auth_Accounts_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Auth_Accounts_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Auth_Accounts_Select_Column_Auth_Accounts_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Auth_Accounts_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Auth_Accounts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Auth_Accounts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.accounts" */
export type Auth_Accounts_Aggregate_Fields = {
  __typename?: "auth_accounts_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Accounts_Max_Fields>;
  min?: Maybe<Auth_Accounts_Min_Fields>;
};

/** aggregate fields of "auth.accounts" */
export type Auth_Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "auth.accounts" */
export type Auth_Accounts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Auth_Accounts_Max_Order_By>;
  min?: InputMaybe<Auth_Accounts_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Auth_Accounts_Append_Input = {
  custom_register_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "auth.accounts" */
export type Auth_Accounts_Arr_Rel_Insert_Input = {
  data: Array<Auth_Accounts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Accounts_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.accounts". All fields are combined with a logical 'AND'. */
export type Auth_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Accounts_Bool_Exp>>;
  _not?: InputMaybe<Auth_Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Accounts_Bool_Exp>>;
  account_providers?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
  account_providers_aggregate?: InputMaybe<Auth_Account_Providers_Aggregate_Bool_Exp>;
  account_roles?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
  account_roles_aggregate?: InputMaybe<Auth_Account_Roles_Aggregate_Bool_Exp>;
  active?: InputMaybe<Boolean_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  custom_register_data?: InputMaybe<Jsonb_Comparison_Exp>;
  default_role?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<Citext_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_anonymous?: InputMaybe<Boolean_Comparison_Exp>;
  mfa_enabled?: InputMaybe<Boolean_Comparison_Exp>;
  new_email?: InputMaybe<Citext_Comparison_Exp>;
  otp_secret?: InputMaybe<String_Comparison_Exp>;
  password_hash?: InputMaybe<String_Comparison_Exp>;
  refresh_tokens?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
  refresh_tokens_aggregate?: InputMaybe<Auth_Refresh_Tokens_Aggregate_Bool_Exp>;
  role?: InputMaybe<Auth_Roles_Bool_Exp>;
  ticket?: InputMaybe<Uuid_Comparison_Exp>;
  ticket_expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.accounts" */
export enum Auth_Accounts_Constraint {
  /** unique or primary key constraint on columns "email" */
  AccountsEmailKey = "accounts_email_key",
  /** unique or primary key constraint on columns "new_email" */
  AccountsNewEmailKey = "accounts_new_email_key",
  /** unique or primary key constraint on columns "id" */
  AccountsPkey = "accounts_pkey",
  /** unique or primary key constraint on columns "user_id" */
  AccountsUserIdKey = "accounts_user_id_key",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Auth_Accounts_Delete_At_Path_Input = {
  custom_register_data?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Auth_Accounts_Delete_Elem_Input = {
  custom_register_data?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Auth_Accounts_Delete_Key_Input = {
  custom_register_data?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "auth.accounts" */
export type Auth_Accounts_Insert_Input = {
  account_providers?: InputMaybe<Auth_Account_Providers_Arr_Rel_Insert_Input>;
  account_roles?: InputMaybe<Auth_Account_Roles_Arr_Rel_Insert_Input>;
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  custom_register_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  default_role?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["citext"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_anonymous?: InputMaybe<Scalars["Boolean"]["input"]>;
  mfa_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  new_email?: InputMaybe<Scalars["citext"]["input"]>;
  otp_secret?: InputMaybe<Scalars["String"]["input"]>;
  password_hash?: InputMaybe<Scalars["String"]["input"]>;
  refresh_tokens?: InputMaybe<Auth_Refresh_Tokens_Arr_Rel_Insert_Input>;
  role?: InputMaybe<Auth_Roles_Obj_Rel_Insert_Input>;
  ticket?: InputMaybe<Scalars["uuid"]["input"]>;
  ticket_expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Auth_Accounts_Max_Fields = {
  __typename?: "auth_accounts_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  default_role?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["citext"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  new_email?: Maybe<Scalars["citext"]["output"]>;
  otp_secret?: Maybe<Scalars["String"]["output"]>;
  password_hash?: Maybe<Scalars["String"]["output"]>;
  ticket?: Maybe<Scalars["uuid"]["output"]>;
  ticket_expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "auth.accounts" */
export type Auth_Accounts_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  default_role?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  new_email?: InputMaybe<Order_By>;
  otp_secret?: InputMaybe<Order_By>;
  password_hash?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticket_expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Auth_Accounts_Min_Fields = {
  __typename?: "auth_accounts_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  default_role?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["citext"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  new_email?: Maybe<Scalars["citext"]["output"]>;
  otp_secret?: Maybe<Scalars["String"]["output"]>;
  password_hash?: Maybe<Scalars["String"]["output"]>;
  ticket?: Maybe<Scalars["uuid"]["output"]>;
  ticket_expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "auth.accounts" */
export type Auth_Accounts_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  default_role?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  new_email?: InputMaybe<Order_By>;
  otp_secret?: InputMaybe<Order_By>;
  password_hash?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticket_expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.accounts" */
export type Auth_Accounts_Mutation_Response = {
  __typename?: "auth_accounts_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Accounts>;
};

/** input type for inserting object relation for remote table "auth.accounts" */
export type Auth_Accounts_Obj_Rel_Insert_Input = {
  data: Auth_Accounts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Accounts_On_Conflict>;
};

/** on_conflict condition type for table "auth.accounts" */
export type Auth_Accounts_On_Conflict = {
  constraint: Auth_Accounts_Constraint;
  update_columns?: Array<Auth_Accounts_Update_Column>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.accounts". */
export type Auth_Accounts_Order_By = {
  account_providers_aggregate?: InputMaybe<Auth_Account_Providers_Aggregate_Order_By>;
  account_roles_aggregate?: InputMaybe<Auth_Account_Roles_Aggregate_Order_By>;
  active?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  custom_register_data?: InputMaybe<Order_By>;
  default_role?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_anonymous?: InputMaybe<Order_By>;
  mfa_enabled?: InputMaybe<Order_By>;
  new_email?: InputMaybe<Order_By>;
  otp_secret?: InputMaybe<Order_By>;
  password_hash?: InputMaybe<Order_By>;
  refresh_tokens_aggregate?: InputMaybe<Auth_Refresh_Tokens_Aggregate_Order_By>;
  role?: InputMaybe<Auth_Roles_Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticket_expires_at?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.accounts */
export type Auth_Accounts_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Auth_Accounts_Prepend_Input = {
  custom_register_data?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "auth.accounts" */
export enum Auth_Accounts_Select_Column {
  /** column name */
  Active = "active",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CustomRegisterData = "custom_register_data",
  /** column name */
  DefaultRole = "default_role",
  /** column name */
  Email = "email",
  /** column name */
  Id = "id",
  /** column name */
  IsAnonymous = "is_anonymous",
  /** column name */
  MfaEnabled = "mfa_enabled",
  /** column name */
  NewEmail = "new_email",
  /** column name */
  OtpSecret = "otp_secret",
  /** column name */
  PasswordHash = "password_hash",
  /** column name */
  Ticket = "ticket",
  /** column name */
  TicketExpiresAt = "ticket_expires_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** select "auth_accounts_aggregate_bool_exp_bool_and_arguments_columns" columns of table "auth.accounts" */
export enum Auth_Accounts_Select_Column_Auth_Accounts_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Active = "active",
  /** column name */
  IsAnonymous = "is_anonymous",
  /** column name */
  MfaEnabled = "mfa_enabled",
}

/** select "auth_accounts_aggregate_bool_exp_bool_or_arguments_columns" columns of table "auth.accounts" */
export enum Auth_Accounts_Select_Column_Auth_Accounts_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Active = "active",
  /** column name */
  IsAnonymous = "is_anonymous",
  /** column name */
  MfaEnabled = "mfa_enabled",
}

/** input type for updating data in table "auth.accounts" */
export type Auth_Accounts_Set_Input = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  custom_register_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  default_role?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["citext"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_anonymous?: InputMaybe<Scalars["Boolean"]["input"]>;
  mfa_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  new_email?: InputMaybe<Scalars["citext"]["input"]>;
  otp_secret?: InputMaybe<Scalars["String"]["input"]>;
  password_hash?: InputMaybe<Scalars["String"]["input"]>;
  ticket?: InputMaybe<Scalars["uuid"]["input"]>;
  ticket_expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "auth_accounts" */
export type Auth_Accounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Accounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Accounts_Stream_Cursor_Value_Input = {
  active?: InputMaybe<Scalars["Boolean"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  custom_register_data?: InputMaybe<Scalars["jsonb"]["input"]>;
  default_role?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["citext"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  is_anonymous?: InputMaybe<Scalars["Boolean"]["input"]>;
  mfa_enabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  new_email?: InputMaybe<Scalars["citext"]["input"]>;
  otp_secret?: InputMaybe<Scalars["String"]["input"]>;
  password_hash?: InputMaybe<Scalars["String"]["input"]>;
  ticket?: InputMaybe<Scalars["uuid"]["input"]>;
  ticket_expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "auth.accounts" */
export enum Auth_Accounts_Update_Column {
  /** column name */
  Active = "active",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  CustomRegisterData = "custom_register_data",
  /** column name */
  DefaultRole = "default_role",
  /** column name */
  Email = "email",
  /** column name */
  Id = "id",
  /** column name */
  IsAnonymous = "is_anonymous",
  /** column name */
  MfaEnabled = "mfa_enabled",
  /** column name */
  NewEmail = "new_email",
  /** column name */
  OtpSecret = "otp_secret",
  /** column name */
  PasswordHash = "password_hash",
  /** column name */
  Ticket = "ticket",
  /** column name */
  TicketExpiresAt = "ticket_expires_at",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Auth_Accounts_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Auth_Accounts_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Auth_Accounts_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Auth_Accounts_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Auth_Accounts_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Auth_Accounts_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Accounts_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Accounts_Bool_Exp;
};

/** columns and relationships of "auth.providers" */
export type Auth_Providers = {
  __typename?: "auth_providers";
  /** An array relationship */
  account_providers: Array<Auth_Account_Providers>;
  /** An aggregate relationship */
  account_providers_aggregate: Auth_Account_Providers_Aggregate;
  provider: Scalars["String"]["output"];
};

/** columns and relationships of "auth.providers" */
export type Auth_ProvidersAccount_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

/** columns and relationships of "auth.providers" */
export type Auth_ProvidersAccount_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

/** aggregated selection of "auth.providers" */
export type Auth_Providers_Aggregate = {
  __typename?: "auth_providers_aggregate";
  aggregate?: Maybe<Auth_Providers_Aggregate_Fields>;
  nodes: Array<Auth_Providers>;
};

/** aggregate fields of "auth.providers" */
export type Auth_Providers_Aggregate_Fields = {
  __typename?: "auth_providers_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Providers_Max_Fields>;
  min?: Maybe<Auth_Providers_Min_Fields>;
};

/** aggregate fields of "auth.providers" */
export type Auth_Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "auth.providers". All fields are combined with a logical 'AND'. */
export type Auth_Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Providers_Bool_Exp>>;
  _not?: InputMaybe<Auth_Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Providers_Bool_Exp>>;
  account_providers?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
  account_providers_aggregate?: InputMaybe<Auth_Account_Providers_Aggregate_Bool_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.providers" */
export enum Auth_Providers_Constraint {
  /** unique or primary key constraint on columns "provider" */
  ProvidersPkey = "providers_pkey",
}

/** input type for inserting data into table "auth.providers" */
export type Auth_Providers_Insert_Input = {
  account_providers?: InputMaybe<Auth_Account_Providers_Arr_Rel_Insert_Input>;
  provider?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Auth_Providers_Max_Fields = {
  __typename?: "auth_providers_max_fields";
  provider?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Auth_Providers_Min_Fields = {
  __typename?: "auth_providers_min_fields";
  provider?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "auth.providers" */
export type Auth_Providers_Mutation_Response = {
  __typename?: "auth_providers_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Providers>;
};

/** input type for inserting object relation for remote table "auth.providers" */
export type Auth_Providers_Obj_Rel_Insert_Input = {
  data: Auth_Providers_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Providers_On_Conflict>;
};

/** on_conflict condition type for table "auth.providers" */
export type Auth_Providers_On_Conflict = {
  constraint: Auth_Providers_Constraint;
  update_columns?: Array<Auth_Providers_Update_Column>;
  where?: InputMaybe<Auth_Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.providers". */
export type Auth_Providers_Order_By = {
  account_providers_aggregate?: InputMaybe<Auth_Account_Providers_Aggregate_Order_By>;
  provider?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.providers */
export type Auth_Providers_Pk_Columns_Input = {
  provider: Scalars["String"]["input"];
};

/** select columns of table "auth.providers" */
export enum Auth_Providers_Select_Column {
  /** column name */
  Provider = "provider",
}

/** input type for updating data in table "auth.providers" */
export type Auth_Providers_Set_Input = {
  provider?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "auth_providers" */
export type Auth_Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Providers_Stream_Cursor_Value_Input = {
  provider?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "auth.providers" */
export enum Auth_Providers_Update_Column {
  /** column name */
  Provider = "provider",
}

export type Auth_Providers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Providers_Bool_Exp;
};

/** columns and relationships of "auth.refresh_tokens" */
export type Auth_Refresh_Tokens = {
  __typename?: "auth_refresh_tokens";
  /** An object relationship */
  account: Auth_Accounts;
  account_id: Scalars["uuid"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  expires_at: Scalars["timestamptz"]["output"];
  refresh_token: Scalars["uuid"]["output"];
};

/** aggregated selection of "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Aggregate = {
  __typename?: "auth_refresh_tokens_aggregate";
  aggregate?: Maybe<Auth_Refresh_Tokens_Aggregate_Fields>;
  nodes: Array<Auth_Refresh_Tokens>;
};

export type Auth_Refresh_Tokens_Aggregate_Bool_Exp = {
  count?: InputMaybe<Auth_Refresh_Tokens_Aggregate_Bool_Exp_Count>;
};

export type Auth_Refresh_Tokens_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Aggregate_Fields = {
  __typename?: "auth_refresh_tokens_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Refresh_Tokens_Max_Fields>;
  min?: Maybe<Auth_Refresh_Tokens_Min_Fields>;
};

/** aggregate fields of "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Auth_Refresh_Tokens_Max_Order_By>;
  min?: InputMaybe<Auth_Refresh_Tokens_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Arr_Rel_Insert_Input = {
  data: Array<Auth_Refresh_Tokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Refresh_Tokens_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.refresh_tokens". All fields are combined with a logical 'AND'. */
export type Auth_Refresh_Tokens_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Refresh_Tokens_Bool_Exp>>;
  _not?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Refresh_Tokens_Bool_Exp>>;
  account?: InputMaybe<Auth_Accounts_Bool_Exp>;
  account_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  expires_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  refresh_token?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.refresh_tokens" */
export enum Auth_Refresh_Tokens_Constraint {
  /** unique or primary key constraint on columns "refresh_token" */
  RefreshTokensPkey = "refresh_tokens_pkey",
}

/** input type for inserting data into table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Insert_Input = {
  account?: InputMaybe<Auth_Accounts_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  refresh_token?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Auth_Refresh_Tokens_Max_Fields = {
  __typename?: "auth_refresh_tokens_max_fields";
  account_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  refresh_token?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  refresh_token?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Auth_Refresh_Tokens_Min_Fields = {
  __typename?: "auth_refresh_tokens_min_fields";
  account_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  expires_at?: Maybe<Scalars["timestamptz"]["output"]>;
  refresh_token?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  refresh_token?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Mutation_Response = {
  __typename?: "auth_refresh_tokens_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Refresh_Tokens>;
};

/** on_conflict condition type for table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_On_Conflict = {
  constraint: Auth_Refresh_Tokens_Constraint;
  update_columns?: Array<Auth_Refresh_Tokens_Update_Column>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.refresh_tokens". */
export type Auth_Refresh_Tokens_Order_By = {
  account?: InputMaybe<Auth_Accounts_Order_By>;
  account_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  expires_at?: InputMaybe<Order_By>;
  refresh_token?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.refresh_tokens */
export type Auth_Refresh_Tokens_Pk_Columns_Input = {
  refresh_token: Scalars["uuid"]["input"];
};

/** select columns of table "auth.refresh_tokens" */
export enum Auth_Refresh_Tokens_Select_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  RefreshToken = "refresh_token",
}

/** input type for updating data in table "auth.refresh_tokens" */
export type Auth_Refresh_Tokens_Set_Input = {
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  refresh_token?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "auth_refresh_tokens" */
export type Auth_Refresh_Tokens_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Refresh_Tokens_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Refresh_Tokens_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  expires_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  refresh_token?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "auth.refresh_tokens" */
export enum Auth_Refresh_Tokens_Update_Column {
  /** column name */
  AccountId = "account_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  ExpiresAt = "expires_at",
  /** column name */
  RefreshToken = "refresh_token",
}

export type Auth_Refresh_Tokens_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Refresh_Tokens_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Refresh_Tokens_Bool_Exp;
};

/** columns and relationships of "auth.roles" */
export type Auth_Roles = {
  __typename?: "auth_roles";
  /** An array relationship */
  account_roles: Array<Auth_Account_Roles>;
  /** An aggregate relationship */
  account_roles_aggregate: Auth_Account_Roles_Aggregate;
  /** An array relationship */
  accounts: Array<Auth_Accounts>;
  /** An aggregate relationship */
  accounts_aggregate: Auth_Accounts_Aggregate;
  role: Scalars["String"]["output"];
};

/** columns and relationships of "auth.roles" */
export type Auth_RolesAccount_RolesArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

/** columns and relationships of "auth.roles" */
export type Auth_RolesAccount_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

/** columns and relationships of "auth.roles" */
export type Auth_RolesAccountsArgs = {
  distinct_on?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Accounts_Order_By>>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

/** columns and relationships of "auth.roles" */
export type Auth_RolesAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Accounts_Order_By>>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

/** aggregated selection of "auth.roles" */
export type Auth_Roles_Aggregate = {
  __typename?: "auth_roles_aggregate";
  aggregate?: Maybe<Auth_Roles_Aggregate_Fields>;
  nodes: Array<Auth_Roles>;
};

/** aggregate fields of "auth.roles" */
export type Auth_Roles_Aggregate_Fields = {
  __typename?: "auth_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Auth_Roles_Max_Fields>;
  min?: Maybe<Auth_Roles_Min_Fields>;
};

/** aggregate fields of "auth.roles" */
export type Auth_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Auth_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "auth.roles". All fields are combined with a logical 'AND'. */
export type Auth_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Auth_Roles_Bool_Exp>>;
  _not?: InputMaybe<Auth_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Auth_Roles_Bool_Exp>>;
  account_roles?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
  account_roles_aggregate?: InputMaybe<Auth_Account_Roles_Aggregate_Bool_Exp>;
  accounts?: InputMaybe<Auth_Accounts_Bool_Exp>;
  accounts_aggregate?: InputMaybe<Auth_Accounts_Aggregate_Bool_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.roles" */
export enum Auth_Roles_Constraint {
  /** unique or primary key constraint on columns "role" */
  RolesPkey = "roles_pkey",
}

/** input type for inserting data into table "auth.roles" */
export type Auth_Roles_Insert_Input = {
  account_roles?: InputMaybe<Auth_Account_Roles_Arr_Rel_Insert_Input>;
  accounts?: InputMaybe<Auth_Accounts_Arr_Rel_Insert_Input>;
  role?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Auth_Roles_Max_Fields = {
  __typename?: "auth_roles_max_fields";
  role?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Auth_Roles_Min_Fields = {
  __typename?: "auth_roles_min_fields";
  role?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "auth.roles" */
export type Auth_Roles_Mutation_Response = {
  __typename?: "auth_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Auth_Roles>;
};

/** input type for inserting object relation for remote table "auth.roles" */
export type Auth_Roles_Obj_Rel_Insert_Input = {
  data: Auth_Roles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Auth_Roles_On_Conflict>;
};

/** on_conflict condition type for table "auth.roles" */
export type Auth_Roles_On_Conflict = {
  constraint: Auth_Roles_Constraint;
  update_columns?: Array<Auth_Roles_Update_Column>;
  where?: InputMaybe<Auth_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.roles". */
export type Auth_Roles_Order_By = {
  account_roles_aggregate?: InputMaybe<Auth_Account_Roles_Aggregate_Order_By>;
  accounts_aggregate?: InputMaybe<Auth_Accounts_Aggregate_Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.roles */
export type Auth_Roles_Pk_Columns_Input = {
  role: Scalars["String"]["input"];
};

/** select columns of table "auth.roles" */
export enum Auth_Roles_Select_Column {
  /** column name */
  Role = "role",
}

/** input type for updating data in table "auth.roles" */
export type Auth_Roles_Set_Input = {
  role?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "auth_roles" */
export type Auth_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Auth_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Auth_Roles_Stream_Cursor_Value_Input = {
  role?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "auth.roles" */
export enum Auth_Roles_Update_Column {
  /** column name */
  Role = "role",
}

export type Auth_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Auth_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Auth_Roles_Bool_Exp;
};

/** columns and relationships of "branch_statuses" */
export type Branch_Statuses = {
  __typename?: "branch_statuses";
  status: Scalars["String"]["output"];
};

/** aggregated selection of "branch_statuses" */
export type Branch_Statuses_Aggregate = {
  __typename?: "branch_statuses_aggregate";
  aggregate?: Maybe<Branch_Statuses_Aggregate_Fields>;
  nodes: Array<Branch_Statuses>;
};

/** aggregate fields of "branch_statuses" */
export type Branch_Statuses_Aggregate_Fields = {
  __typename?: "branch_statuses_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Branch_Statuses_Max_Fields>;
  min?: Maybe<Branch_Statuses_Min_Fields>;
};

/** aggregate fields of "branch_statuses" */
export type Branch_Statuses_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Branch_Statuses_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "branch_statuses". All fields are combined with a logical 'AND'. */
export type Branch_Statuses_Bool_Exp = {
  _and?: InputMaybe<Array<Branch_Statuses_Bool_Exp>>;
  _not?: InputMaybe<Branch_Statuses_Bool_Exp>;
  _or?: InputMaybe<Array<Branch_Statuses_Bool_Exp>>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "branch_statuses" */
export enum Branch_Statuses_Constraint {
  /** unique or primary key constraint on columns "status" */
  BranchStatusesPkey = "branch_statuses_pkey",
}

export enum Branch_Statuses_Enum {
  Active = "active",
  Archived = "archived",
  Created = "created",
}

/** Boolean expression to compare columns of type "branch_statuses_enum". All fields are combined with logical 'AND'. */
export type Branch_Statuses_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Branch_Statuses_Enum>;
  _in?: InputMaybe<Array<Branch_Statuses_Enum>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Branch_Statuses_Enum>;
  _nin?: InputMaybe<Array<Branch_Statuses_Enum>>;
};

/** input type for inserting data into table "branch_statuses" */
export type Branch_Statuses_Insert_Input = {
  status?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Branch_Statuses_Max_Fields = {
  __typename?: "branch_statuses_max_fields";
  status?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Branch_Statuses_Min_Fields = {
  __typename?: "branch_statuses_min_fields";
  status?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "branch_statuses" */
export type Branch_Statuses_Mutation_Response = {
  __typename?: "branch_statuses_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Branch_Statuses>;
};

/** input type for inserting object relation for remote table "branch_statuses" */
export type Branch_Statuses_Obj_Rel_Insert_Input = {
  data: Branch_Statuses_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Branch_Statuses_On_Conflict>;
};

/** on_conflict condition type for table "branch_statuses" */
export type Branch_Statuses_On_Conflict = {
  constraint: Branch_Statuses_Constraint;
  update_columns?: Array<Branch_Statuses_Update_Column>;
  where?: InputMaybe<Branch_Statuses_Bool_Exp>;
};

/** Ordering options when selecting data from "branch_statuses". */
export type Branch_Statuses_Order_By = {
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: branch_statuses */
export type Branch_Statuses_Pk_Columns_Input = {
  status: Scalars["String"]["input"];
};

/** select columns of table "branch_statuses" */
export enum Branch_Statuses_Select_Column {
  /** column name */
  Status = "status",
}

/** input type for updating data in table "branch_statuses" */
export type Branch_Statuses_Set_Input = {
  status?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "branch_statuses" */
export type Branch_Statuses_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Branch_Statuses_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Branch_Statuses_Stream_Cursor_Value_Input = {
  status?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "branch_statuses" */
export enum Branch_Statuses_Update_Column {
  /** column name */
  Status = "status",
}

export type Branch_Statuses_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Branch_Statuses_Set_Input>;
  /** filter the rows which have to be updated */
  where: Branch_Statuses_Bool_Exp;
};

/** columns and relationships of "branches" */
export type Branches = {
  __typename?: "branches";
  /** An object relationship */
  branch_status: Branch_Statuses;
  created_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  datasource: Datasources;
  datasource_id: Scalars["uuid"]["output"];
  /** An array relationship */
  explorations: Array<Explorations>;
  /** An aggregate relationship */
  explorations_aggregate: Explorations_Aggregate;
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  status: Branch_Statuses_Enum;
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
  /** An array relationship */
  versions: Array<Versions>;
  /** An aggregate relationship */
  versions_aggregate: Versions_Aggregate;
};

/** columns and relationships of "branches" */
export type BranchesExplorationsArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

/** columns and relationships of "branches" */
export type BranchesExplorations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

/** columns and relationships of "branches" */
export type BranchesVersionsArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

/** columns and relationships of "branches" */
export type BranchesVersions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

/** aggregated selection of "branches" */
export type Branches_Aggregate = {
  __typename?: "branches_aggregate";
  aggregate?: Maybe<Branches_Aggregate_Fields>;
  nodes: Array<Branches>;
};

export type Branches_Aggregate_Bool_Exp = {
  count?: InputMaybe<Branches_Aggregate_Bool_Exp_Count>;
};

export type Branches_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Branches_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Branches_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "branches" */
export type Branches_Aggregate_Fields = {
  __typename?: "branches_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Branches_Max_Fields>;
  min?: Maybe<Branches_Min_Fields>;
};

/** aggregate fields of "branches" */
export type Branches_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Branches_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "branches" */
export type Branches_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Branches_Max_Order_By>;
  min?: InputMaybe<Branches_Min_Order_By>;
};

/** input type for inserting array relation for remote table "branches" */
export type Branches_Arr_Rel_Insert_Input = {
  data: Array<Branches_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Branches_On_Conflict>;
};

/** Boolean expression to filter rows from the table "branches". All fields are combined with a logical 'AND'. */
export type Branches_Bool_Exp = {
  _and?: InputMaybe<Array<Branches_Bool_Exp>>;
  _not?: InputMaybe<Branches_Bool_Exp>;
  _or?: InputMaybe<Array<Branches_Bool_Exp>>;
  branch_status?: InputMaybe<Branch_Statuses_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  datasource?: InputMaybe<Datasources_Bool_Exp>;
  datasource_id?: InputMaybe<Uuid_Comparison_Exp>;
  explorations?: InputMaybe<Explorations_Bool_Exp>;
  explorations_aggregate?: InputMaybe<Explorations_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<Branch_Statuses_Enum_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  versions?: InputMaybe<Versions_Bool_Exp>;
  versions_aggregate?: InputMaybe<Versions_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "branches" */
export enum Branches_Constraint {
  /** unique or primary key constraint on columns "datasource_id", "name" */
  BranchesDatasourceIdNameKey = "branches_datasource_id_name_key",
  /** unique or primary key constraint on columns "id" */
  BranchesPkey = "branches_pkey",
}

/** input type for inserting data into table "branches" */
export type Branches_Insert_Input = {
  branch_status?: InputMaybe<Branch_Statuses_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource?: InputMaybe<Datasources_Obj_Rel_Insert_Input>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  explorations?: InputMaybe<Explorations_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Branch_Statuses_Enum>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  versions?: InputMaybe<Versions_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Branches_Max_Fields = {
  __typename?: "branches_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "branches" */
export type Branches_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Branches_Min_Fields = {
  __typename?: "branches_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "branches" */
export type Branches_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "branches" */
export type Branches_Mutation_Response = {
  __typename?: "branches_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Branches>;
};

/** input type for inserting object relation for remote table "branches" */
export type Branches_Obj_Rel_Insert_Input = {
  data: Branches_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Branches_On_Conflict>;
};

/** on_conflict condition type for table "branches" */
export type Branches_On_Conflict = {
  constraint: Branches_Constraint;
  update_columns?: Array<Branches_Update_Column>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

/** Ordering options when selecting data from "branches". */
export type Branches_Order_By = {
  branch_status?: InputMaybe<Branch_Statuses_Order_By>;
  created_at?: InputMaybe<Order_By>;
  datasource?: InputMaybe<Datasources_Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  explorations_aggregate?: InputMaybe<Explorations_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  versions_aggregate?: InputMaybe<Versions_Aggregate_Order_By>;
};

/** primary key columns input for table: branches */
export type Branches_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "branches" */
export enum Branches_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "branches" */
export type Branches_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Branch_Statuses_Enum>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "branches" */
export type Branches_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Branches_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Branches_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Branch_Statuses_Enum>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "branches" */
export enum Branches_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Status = "status",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Branches_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Branches_Set_Input>;
  /** filter the rows which have to be updated */
  where: Branches_Bool_Exp;
};

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["citext"]["input"]>;
  _gt?: InputMaybe<Scalars["citext"]["input"]>;
  _gte?: InputMaybe<Scalars["citext"]["input"]>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars["citext"]["input"]>;
  _in?: InputMaybe<Array<Scalars["citext"]["input"]>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars["citext"]["input"]>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars["citext"]["input"]>;
  _lt?: InputMaybe<Scalars["citext"]["input"]>;
  _lte?: InputMaybe<Scalars["citext"]["input"]>;
  _neq?: InputMaybe<Scalars["citext"]["input"]>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars["citext"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["citext"]["input"]>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars["citext"]["input"]>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars["citext"]["input"]>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars["citext"]["input"]>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars["citext"]["input"]>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars["citext"]["input"]>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars["citext"]["input"]>;
};

/** fields of action: "create_events" */
export type Create_Events = {
  __typename?: "create_events";
  /** the time at which this action was created */
  created_at: Scalars["timestamptz"]["output"];
  /** errors related to the invocation */
  errors?: Maybe<Scalars["json"]["output"]>;
  /** the unique id of an action */
  id: Scalars["uuid"]["output"];
  /** the output fields of this action */
  output: Events_Create_Mutation_Response;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = "ASC",
  /** descending ordering of the cursor */
  Desc = "DESC",
}

/** columns and relationships of "dashboards" */
export type Dashboards = {
  __typename?: "dashboards";
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  layout?: Maybe<Scalars["jsonb"]["output"]>;
  name: Scalars["String"]["output"];
  /** An array relationship */
  pinned_items: Array<Pinned_Items>;
  /** An aggregate relationship */
  pinned_items_aggregate: Pinned_Items_Aggregate;
  /** An object relationship */
  team?: Maybe<Teams>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Scalars["timestamptz"]["output"];
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "dashboards" */
export type DashboardsLayoutArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "dashboards" */
export type DashboardsPinned_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

/** columns and relationships of "dashboards" */
export type DashboardsPinned_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

/** aggregated selection of "dashboards" */
export type Dashboards_Aggregate = {
  __typename?: "dashboards_aggregate";
  aggregate?: Maybe<Dashboards_Aggregate_Fields>;
  nodes: Array<Dashboards>;
};

export type Dashboards_Aggregate_Bool_Exp = {
  count?: InputMaybe<Dashboards_Aggregate_Bool_Exp_Count>;
};

export type Dashboards_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Dashboards_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Dashboards_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "dashboards" */
export type Dashboards_Aggregate_Fields = {
  __typename?: "dashboards_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Dashboards_Max_Fields>;
  min?: Maybe<Dashboards_Min_Fields>;
};

/** aggregate fields of "dashboards" */
export type Dashboards_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Dashboards_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "dashboards" */
export type Dashboards_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Dashboards_Max_Order_By>;
  min?: InputMaybe<Dashboards_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Dashboards_Append_Input = {
  layout?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "dashboards" */
export type Dashboards_Arr_Rel_Insert_Input = {
  data: Array<Dashboards_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Dashboards_On_Conflict>;
};

/** Boolean expression to filter rows from the table "dashboards". All fields are combined with a logical 'AND'. */
export type Dashboards_Bool_Exp = {
  _and?: InputMaybe<Array<Dashboards_Bool_Exp>>;
  _not?: InputMaybe<Dashboards_Bool_Exp>;
  _or?: InputMaybe<Array<Dashboards_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  layout?: InputMaybe<Jsonb_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  pinned_items?: InputMaybe<Pinned_Items_Bool_Exp>;
  pinned_items_aggregate?: InputMaybe<Pinned_Items_Aggregate_Bool_Exp>;
  team?: InputMaybe<Teams_Bool_Exp>;
  team_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "dashboards" */
export enum Dashboards_Constraint {
  /** unique or primary key constraint on columns "id" */
  DashboardsPkey = "dashboards_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Dashboards_Delete_At_Path_Input = {
  layout?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Dashboards_Delete_Elem_Input = {
  layout?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Dashboards_Delete_Key_Input = {
  layout?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "dashboards" */
export type Dashboards_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  layout?: InputMaybe<Scalars["jsonb"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  pinned_items?: InputMaybe<Pinned_Items_Arr_Rel_Insert_Input>;
  team?: InputMaybe<Teams_Obj_Rel_Insert_Input>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Dashboards_Max_Fields = {
  __typename?: "dashboards_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "dashboards" */
export type Dashboards_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Dashboards_Min_Fields = {
  __typename?: "dashboards_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "dashboards" */
export type Dashboards_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "dashboards" */
export type Dashboards_Mutation_Response = {
  __typename?: "dashboards_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Dashboards>;
};

/** input type for inserting object relation for remote table "dashboards" */
export type Dashboards_Obj_Rel_Insert_Input = {
  data: Dashboards_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Dashboards_On_Conflict>;
};

/** on_conflict condition type for table "dashboards" */
export type Dashboards_On_Conflict = {
  constraint: Dashboards_Constraint;
  update_columns?: Array<Dashboards_Update_Column>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

/** Ordering options when selecting data from "dashboards". */
export type Dashboards_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  layout?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  pinned_items_aggregate?: InputMaybe<Pinned_Items_Aggregate_Order_By>;
  team?: InputMaybe<Teams_Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: dashboards */
export type Dashboards_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Dashboards_Prepend_Input = {
  layout?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "dashboards" */
export enum Dashboards_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Layout = "layout",
  /** column name */
  Name = "name",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "dashboards" */
export type Dashboards_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  layout?: InputMaybe<Scalars["jsonb"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "dashboards" */
export type Dashboards_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dashboards_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dashboards_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  layout?: InputMaybe<Scalars["jsonb"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "dashboards" */
export enum Dashboards_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Layout = "layout",
  /** column name */
  Name = "name",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Dashboards_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Dashboards_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Dashboards_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Dashboards_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Dashboards_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Dashboards_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Dashboards_Set_Input>;
  /** filter the rows which have to be updated */
  where: Dashboards_Bool_Exp;
};

/** columns and relationships of "dataschemas" */
export type Dataschemas = {
  __typename?: "dataschemas";
  checksum?: Maybe<Scalars["String"]["output"]>;
  code: Scalars["String"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  datasource: Datasources;
  datasource_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
  /** An object relationship */
  version?: Maybe<Versions>;
  version_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** aggregated selection of "dataschemas" */
export type Dataschemas_Aggregate = {
  __typename?: "dataschemas_aggregate";
  aggregate?: Maybe<Dataschemas_Aggregate_Fields>;
  nodes: Array<Dataschemas>;
};

export type Dataschemas_Aggregate_Bool_Exp = {
  count?: InputMaybe<Dataschemas_Aggregate_Bool_Exp_Count>;
};

export type Dataschemas_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Dataschemas_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Dataschemas_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "dataschemas" */
export type Dataschemas_Aggregate_Fields = {
  __typename?: "dataschemas_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Dataschemas_Max_Fields>;
  min?: Maybe<Dataschemas_Min_Fields>;
};

/** aggregate fields of "dataschemas" */
export type Dataschemas_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Dataschemas_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "dataschemas" */
export type Dataschemas_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Dataschemas_Max_Order_By>;
  min?: InputMaybe<Dataschemas_Min_Order_By>;
};

/** input type for inserting array relation for remote table "dataschemas" */
export type Dataschemas_Arr_Rel_Insert_Input = {
  data: Array<Dataschemas_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Dataschemas_On_Conflict>;
};

/** Boolean expression to filter rows from the table "dataschemas". All fields are combined with a logical 'AND'. */
export type Dataschemas_Bool_Exp = {
  _and?: InputMaybe<Array<Dataschemas_Bool_Exp>>;
  _not?: InputMaybe<Dataschemas_Bool_Exp>;
  _or?: InputMaybe<Array<Dataschemas_Bool_Exp>>;
  checksum?: InputMaybe<String_Comparison_Exp>;
  code?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  datasource?: InputMaybe<Datasources_Bool_Exp>;
  datasource_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  version?: InputMaybe<Versions_Bool_Exp>;
  version_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "dataschemas" */
export enum Dataschemas_Constraint {
  /** unique or primary key constraint on columns "id" */
  DataschemasPkey = "dataschemas_pkey",
}

/** input type for inserting data into table "dataschemas" */
export type Dataschemas_Insert_Input = {
  checksum?: InputMaybe<Scalars["String"]["input"]>;
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource?: InputMaybe<Datasources_Obj_Rel_Insert_Input>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version?: InputMaybe<Versions_Obj_Rel_Insert_Input>;
  version_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Dataschemas_Max_Fields = {
  __typename?: "dataschemas_max_fields";
  checksum?: Maybe<Scalars["String"]["output"]>;
  code?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  version_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "dataschemas" */
export type Dataschemas_Max_Order_By = {
  checksum?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  version_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Dataschemas_Min_Fields = {
  __typename?: "dataschemas_min_fields";
  checksum?: Maybe<Scalars["String"]["output"]>;
  code?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  version_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "dataschemas" */
export type Dataschemas_Min_Order_By = {
  checksum?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  version_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "dataschemas" */
export type Dataschemas_Mutation_Response = {
  __typename?: "dataschemas_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Dataschemas>;
};

/** on_conflict condition type for table "dataschemas" */
export type Dataschemas_On_Conflict = {
  constraint: Dataschemas_Constraint;
  update_columns?: Array<Dataschemas_Update_Column>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

/** Ordering options when selecting data from "dataschemas". */
export type Dataschemas_Order_By = {
  checksum?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  datasource?: InputMaybe<Datasources_Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  version?: InputMaybe<Versions_Order_By>;
  version_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: dataschemas */
export type Dataschemas_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "dataschemas" */
export enum Dataschemas_Select_Column {
  /** column name */
  Checksum = "checksum",
  /** column name */
  Code = "code",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  VersionId = "version_id",
}

/** input type for updating data in table "dataschemas" */
export type Dataschemas_Set_Input = {
  checksum?: InputMaybe<Scalars["String"]["input"]>;
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "dataschemas" */
export type Dataschemas_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Dataschemas_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Dataschemas_Stream_Cursor_Value_Input = {
  checksum?: InputMaybe<Scalars["String"]["input"]>;
  code?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  version_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "dataschemas" */
export enum Dataschemas_Update_Column {
  /** column name */
  Checksum = "checksum",
  /** column name */
  Code = "code",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  VersionId = "version_id",
}

export type Dataschemas_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Dataschemas_Set_Input>;
  /** filter the rows which have to be updated */
  where: Dataschemas_Bool_Exp;
};

/** columns and relationships of "datasources" */
export type Datasources = {
  __typename?: "datasources";
  /** An array relationship */
  branches: Array<Branches>;
  /** An aggregate relationship */
  branches_aggregate: Branches_Aggregate;
  created_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  dataschemas: Array<Dataschemas>;
  /** An aggregate relationship */
  dataschemas_aggregate: Dataschemas_Aggregate;
  db_params: Scalars["jsonb"]["output"];
  /** A computed field, executes function "hide_password" */
  db_params_computed?: Maybe<Scalars["jsonb"]["output"]>;
  db_type: Scalars["String"]["output"];
  /** An array relationship */
  explorations: Array<Explorations>;
  /** An aggregate relationship */
  explorations_aggregate: Explorations_Aggregate;
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  /** An array relationship */
  request_logs: Array<Request_Logs>;
  /** An aggregate relationship */
  request_logs_aggregate: Request_Logs_Aggregate;
  /** An array relationship */
  sql_credentials: Array<Sql_Credentials>;
  /** An aggregate relationship */
  sql_credentials_aggregate: Sql_Credentials_Aggregate;
  /** An object relationship */
  team?: Maybe<Teams>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "datasources" */
export type DatasourcesBranchesArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesBranches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesDataschemasArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesDataschemas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesDb_ParamsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "datasources" */
export type DatasourcesDb_Params_ComputedArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "datasources" */
export type DatasourcesExplorationsArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesExplorations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesRequest_LogsArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesRequest_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesSql_CredentialsArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

/** columns and relationships of "datasources" */
export type DatasourcesSql_Credentials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

/** aggregated selection of "datasources" */
export type Datasources_Aggregate = {
  __typename?: "datasources_aggregate";
  aggregate?: Maybe<Datasources_Aggregate_Fields>;
  nodes: Array<Datasources>;
};

export type Datasources_Aggregate_Bool_Exp = {
  count?: InputMaybe<Datasources_Aggregate_Bool_Exp_Count>;
};

export type Datasources_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Datasources_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Datasources_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "datasources" */
export type Datasources_Aggregate_Fields = {
  __typename?: "datasources_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Datasources_Max_Fields>;
  min?: Maybe<Datasources_Min_Fields>;
};

/** aggregate fields of "datasources" */
export type Datasources_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Datasources_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "datasources" */
export type Datasources_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Datasources_Max_Order_By>;
  min?: InputMaybe<Datasources_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Datasources_Append_Input = {
  db_params?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "datasources" */
export type Datasources_Arr_Rel_Insert_Input = {
  data: Array<Datasources_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Datasources_On_Conflict>;
};

/** Boolean expression to filter rows from the table "datasources". All fields are combined with a logical 'AND'. */
export type Datasources_Bool_Exp = {
  _and?: InputMaybe<Array<Datasources_Bool_Exp>>;
  _not?: InputMaybe<Datasources_Bool_Exp>;
  _or?: InputMaybe<Array<Datasources_Bool_Exp>>;
  branches?: InputMaybe<Branches_Bool_Exp>;
  branches_aggregate?: InputMaybe<Branches_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  dataschemas?: InputMaybe<Dataschemas_Bool_Exp>;
  dataschemas_aggregate?: InputMaybe<Dataschemas_Aggregate_Bool_Exp>;
  db_params?: InputMaybe<Jsonb_Comparison_Exp>;
  db_params_computed?: InputMaybe<Jsonb_Comparison_Exp>;
  db_type?: InputMaybe<String_Comparison_Exp>;
  explorations?: InputMaybe<Explorations_Bool_Exp>;
  explorations_aggregate?: InputMaybe<Explorations_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  request_logs?: InputMaybe<Request_Logs_Bool_Exp>;
  request_logs_aggregate?: InputMaybe<Request_Logs_Aggregate_Bool_Exp>;
  sql_credentials?: InputMaybe<Sql_Credentials_Bool_Exp>;
  sql_credentials_aggregate?: InputMaybe<Sql_Credentials_Aggregate_Bool_Exp>;
  team?: InputMaybe<Teams_Bool_Exp>;
  team_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "datasources" */
export enum Datasources_Constraint {
  /** unique or primary key constraint on columns "id" */
  DatasourcesPkey = "datasources_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Datasources_Delete_At_Path_Input = {
  db_params?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Datasources_Delete_Elem_Input = {
  db_params?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Datasources_Delete_Key_Input = {
  db_params?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "datasources" */
export type Datasources_Insert_Input = {
  branches?: InputMaybe<Branches_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dataschemas?: InputMaybe<Dataschemas_Arr_Rel_Insert_Input>;
  db_params?: InputMaybe<Scalars["jsonb"]["input"]>;
  db_type?: InputMaybe<Scalars["String"]["input"]>;
  explorations?: InputMaybe<Explorations_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  request_logs?: InputMaybe<Request_Logs_Arr_Rel_Insert_Input>;
  sql_credentials?: InputMaybe<Sql_Credentials_Arr_Rel_Insert_Input>;
  team?: InputMaybe<Teams_Obj_Rel_Insert_Input>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Datasources_Max_Fields = {
  __typename?: "datasources_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  db_type?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "datasources" */
export type Datasources_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  db_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Datasources_Min_Fields = {
  __typename?: "datasources_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  db_type?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "datasources" */
export type Datasources_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  db_type?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "datasources" */
export type Datasources_Mutation_Response = {
  __typename?: "datasources_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Datasources>;
};

/** input type for inserting object relation for remote table "datasources" */
export type Datasources_Obj_Rel_Insert_Input = {
  data: Datasources_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Datasources_On_Conflict>;
};

/** on_conflict condition type for table "datasources" */
export type Datasources_On_Conflict = {
  constraint: Datasources_Constraint;
  update_columns?: Array<Datasources_Update_Column>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

/** Ordering options when selecting data from "datasources". */
export type Datasources_Order_By = {
  branches_aggregate?: InputMaybe<Branches_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  dataschemas_aggregate?: InputMaybe<Dataschemas_Aggregate_Order_By>;
  db_params?: InputMaybe<Order_By>;
  db_params_computed?: InputMaybe<Order_By>;
  db_type?: InputMaybe<Order_By>;
  explorations_aggregate?: InputMaybe<Explorations_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  request_logs_aggregate?: InputMaybe<Request_Logs_Aggregate_Order_By>;
  sql_credentials_aggregate?: InputMaybe<Sql_Credentials_Aggregate_Order_By>;
  team?: InputMaybe<Teams_Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: datasources */
export type Datasources_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Datasources_Prepend_Input = {
  db_params?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "datasources" */
export enum Datasources_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DbParams = "db_params",
  /** column name */
  DbType = "db_type",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "datasources" */
export type Datasources_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  db_params?: InputMaybe<Scalars["jsonb"]["input"]>;
  db_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "datasources" */
export type Datasources_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Datasources_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Datasources_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  db_params?: InputMaybe<Scalars["jsonb"]["input"]>;
  db_type?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "datasources" */
export enum Datasources_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DbParams = "db_params",
  /** column name */
  DbType = "db_type",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Datasources_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Datasources_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Datasources_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Datasources_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Datasources_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Datasources_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Datasources_Set_Input>;
  /** filter the rows which have to be updated */
  where: Datasources_Bool_Exp;
};

/** suitable for Events Analytics */
export type Events = {
  __typename?: "events";
  created_at: Scalars["timestamptz"]["output"];
  data: Scalars["jsonb"]["output"];
  device_context: Scalars["jsonb"]["output"];
  id: Scalars["uuid"]["output"];
  page_context: Scalars["jsonb"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  user: Scalars["jsonb"]["output"];
};

/** suitable for Events Analytics */
export type EventsDataArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** suitable for Events Analytics */
export type EventsDevice_ContextArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** suitable for Events Analytics */
export type EventsPage_ContextArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** suitable for Events Analytics */
export type EventsUserArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "events" */
export type Events_Aggregate = {
  __typename?: "events_aggregate";
  aggregate?: Maybe<Events_Aggregate_Fields>;
  nodes: Array<Events>;
};

/** aggregate fields of "events" */
export type Events_Aggregate_Fields = {
  __typename?: "events_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Events_Max_Fields>;
  min?: Maybe<Events_Min_Fields>;
};

/** aggregate fields of "events" */
export type Events_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Events_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Events_Append_Input = {
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  device_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  page_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  user?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Boolean expression to filter rows from the table "events". All fields are combined with a logical 'AND'. */
export type Events_Bool_Exp = {
  _and?: InputMaybe<Array<Events_Bool_Exp>>;
  _not?: InputMaybe<Events_Bool_Exp>;
  _or?: InputMaybe<Array<Events_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  data?: InputMaybe<Jsonb_Comparison_Exp>;
  device_context?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  page_context?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "events" */
export enum Events_Constraint {
  /** unique or primary key constraint on columns "id" */
  EventsPkey = "events_pkey",
}

export type Events_Create_Input = {
  data: Scalars["json"]["input"];
  device_context?: InputMaybe<Scalars["json"]["input"]>;
  page_context?: InputMaybe<Scalars["json"]["input"]>;
  user: Scalars["json"]["input"];
};

export type Events_Create_Mutation_Response = {
  __typename?: "events_create_mutation_response";
  affected_rows?: Maybe<Scalars["Int"]["output"]>;
};

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Events_Delete_At_Path_Input = {
  data?: InputMaybe<Array<Scalars["String"]["input"]>>;
  device_context?: InputMaybe<Array<Scalars["String"]["input"]>>;
  page_context?: InputMaybe<Array<Scalars["String"]["input"]>>;
  user?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Events_Delete_Elem_Input = {
  data?: InputMaybe<Scalars["Int"]["input"]>;
  device_context?: InputMaybe<Scalars["Int"]["input"]>;
  page_context?: InputMaybe<Scalars["Int"]["input"]>;
  user?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Events_Delete_Key_Input = {
  data?: InputMaybe<Scalars["String"]["input"]>;
  device_context?: InputMaybe<Scalars["String"]["input"]>;
  page_context?: InputMaybe<Scalars["String"]["input"]>;
  user?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "events" */
export type Events_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  device_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  page_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** aggregate max on columns */
export type Events_Max_Fields = {
  __typename?: "events_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Events_Min_Fields = {
  __typename?: "events_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "events" */
export type Events_Mutation_Response = {
  __typename?: "events_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Events>;
};

/** on_conflict condition type for table "events" */
export type Events_On_Conflict = {
  constraint: Events_Constraint;
  update_columns?: Array<Events_Update_Column>;
  where?: InputMaybe<Events_Bool_Exp>;
};

/** Ordering options when selecting data from "events". */
export type Events_Order_By = {
  created_at?: InputMaybe<Order_By>;
  data?: InputMaybe<Order_By>;
  device_context?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  page_context?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Order_By>;
};

/** primary key columns input for table: events */
export type Events_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Events_Prepend_Input = {
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  device_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  page_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  user?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "events" */
export enum Events_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Data = "data",
  /** column name */
  DeviceContext = "device_context",
  /** column name */
  Id = "id",
  /** column name */
  PageContext = "page_context",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  User = "user",
}

/** input type for updating data in table "events" */
export type Events_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  device_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  page_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** Streaming cursor of the table "events" */
export type Events_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Events_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Events_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  data?: InputMaybe<Scalars["jsonb"]["input"]>;
  device_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  page_context?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** update columns of table "events" */
export enum Events_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Data = "data",
  /** column name */
  DeviceContext = "device_context",
  /** column name */
  Id = "id",
  /** column name */
  PageContext = "page_context",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  User = "user",
}

export type Events_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Events_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Events_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Events_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Events_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Events_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Events_Set_Input>;
  /** filter the rows which have to be updated */
  where: Events_Bool_Exp;
};

/** columns and relationships of "explorations" */
export type Explorations = {
  __typename?: "explorations";
  /** An array relationship */
  alerts: Array<Alerts>;
  /** An aggregate relationship */
  alerts_aggregate: Alerts_Aggregate;
  /** An object relationship */
  branch?: Maybe<Branches>;
  branch_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  datasource: Datasources;
  datasource_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  pinned_items: Array<Pinned_Items>;
  /** An aggregate relationship */
  pinned_items_aggregate: Pinned_Items_Aggregate;
  playground_settings: Scalars["jsonb"]["output"];
  playground_state: Scalars["jsonb"]["output"];
  /** An array relationship */
  reports: Array<Reports>;
  /** An aggregate relationship */
  reports_aggregate: Reports_Aggregate;
  updated_at: Scalars["timestamptz"]["output"];
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "explorations" */
export type ExplorationsAlertsArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

/** columns and relationships of "explorations" */
export type ExplorationsAlerts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

/** columns and relationships of "explorations" */
export type ExplorationsPinned_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

/** columns and relationships of "explorations" */
export type ExplorationsPinned_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

/** columns and relationships of "explorations" */
export type ExplorationsPlayground_SettingsArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "explorations" */
export type ExplorationsPlayground_StateArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "explorations" */
export type ExplorationsReportsArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** columns and relationships of "explorations" */
export type ExplorationsReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** aggregated selection of "explorations" */
export type Explorations_Aggregate = {
  __typename?: "explorations_aggregate";
  aggregate?: Maybe<Explorations_Aggregate_Fields>;
  nodes: Array<Explorations>;
};

export type Explorations_Aggregate_Bool_Exp = {
  count?: InputMaybe<Explorations_Aggregate_Bool_Exp_Count>;
};

export type Explorations_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Explorations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Explorations_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "explorations" */
export type Explorations_Aggregate_Fields = {
  __typename?: "explorations_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Explorations_Max_Fields>;
  min?: Maybe<Explorations_Min_Fields>;
};

/** aggregate fields of "explorations" */
export type Explorations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Explorations_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "explorations" */
export type Explorations_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Explorations_Max_Order_By>;
  min?: InputMaybe<Explorations_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Explorations_Append_Input = {
  playground_settings?: InputMaybe<Scalars["jsonb"]["input"]>;
  playground_state?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "explorations" */
export type Explorations_Arr_Rel_Insert_Input = {
  data: Array<Explorations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Explorations_On_Conflict>;
};

/** Boolean expression to filter rows from the table "explorations". All fields are combined with a logical 'AND'. */
export type Explorations_Bool_Exp = {
  _and?: InputMaybe<Array<Explorations_Bool_Exp>>;
  _not?: InputMaybe<Explorations_Bool_Exp>;
  _or?: InputMaybe<Array<Explorations_Bool_Exp>>;
  alerts?: InputMaybe<Alerts_Bool_Exp>;
  alerts_aggregate?: InputMaybe<Alerts_Aggregate_Bool_Exp>;
  branch?: InputMaybe<Branches_Bool_Exp>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  datasource?: InputMaybe<Datasources_Bool_Exp>;
  datasource_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  pinned_items?: InputMaybe<Pinned_Items_Bool_Exp>;
  pinned_items_aggregate?: InputMaybe<Pinned_Items_Aggregate_Bool_Exp>;
  playground_settings?: InputMaybe<Jsonb_Comparison_Exp>;
  playground_state?: InputMaybe<Jsonb_Comparison_Exp>;
  reports?: InputMaybe<Reports_Bool_Exp>;
  reports_aggregate?: InputMaybe<Reports_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "explorations" */
export enum Explorations_Constraint {
  /** unique or primary key constraint on columns "id" */
  ExplorationsPkey = "explorations_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Explorations_Delete_At_Path_Input = {
  playground_settings?: InputMaybe<Array<Scalars["String"]["input"]>>;
  playground_state?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Explorations_Delete_Elem_Input = {
  playground_settings?: InputMaybe<Scalars["Int"]["input"]>;
  playground_state?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Explorations_Delete_Key_Input = {
  playground_settings?: InputMaybe<Scalars["String"]["input"]>;
  playground_state?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "explorations" */
export type Explorations_Insert_Input = {
  alerts?: InputMaybe<Alerts_Arr_Rel_Insert_Input>;
  branch?: InputMaybe<Branches_Obj_Rel_Insert_Input>;
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource?: InputMaybe<Datasources_Obj_Rel_Insert_Input>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  pinned_items?: InputMaybe<Pinned_Items_Arr_Rel_Insert_Input>;
  playground_settings?: InputMaybe<Scalars["jsonb"]["input"]>;
  playground_state?: InputMaybe<Scalars["jsonb"]["input"]>;
  reports?: InputMaybe<Reports_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Explorations_Max_Fields = {
  __typename?: "explorations_max_fields";
  branch_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "explorations" */
export type Explorations_Max_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Explorations_Min_Fields = {
  __typename?: "explorations_min_fields";
  branch_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "explorations" */
export type Explorations_Min_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "explorations" */
export type Explorations_Mutation_Response = {
  __typename?: "explorations_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Explorations>;
};

/** input type for inserting object relation for remote table "explorations" */
export type Explorations_Obj_Rel_Insert_Input = {
  data: Explorations_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Explorations_On_Conflict>;
};

/** on_conflict condition type for table "explorations" */
export type Explorations_On_Conflict = {
  constraint: Explorations_Constraint;
  update_columns?: Array<Explorations_Update_Column>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

/** Ordering options when selecting data from "explorations". */
export type Explorations_Order_By = {
  alerts_aggregate?: InputMaybe<Alerts_Aggregate_Order_By>;
  branch?: InputMaybe<Branches_Order_By>;
  branch_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  datasource?: InputMaybe<Datasources_Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  pinned_items_aggregate?: InputMaybe<Pinned_Items_Aggregate_Order_By>;
  playground_settings?: InputMaybe<Order_By>;
  playground_state?: InputMaybe<Order_By>;
  reports_aggregate?: InputMaybe<Reports_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: explorations */
export type Explorations_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Explorations_Prepend_Input = {
  playground_settings?: InputMaybe<Scalars["jsonb"]["input"]>;
  playground_state?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "explorations" */
export enum Explorations_Select_Column {
  /** column name */
  BranchId = "branch_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  PlaygroundSettings = "playground_settings",
  /** column name */
  PlaygroundState = "playground_state",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "explorations" */
export type Explorations_Set_Input = {
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  playground_settings?: InputMaybe<Scalars["jsonb"]["input"]>;
  playground_state?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "explorations" */
export type Explorations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Explorations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Explorations_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  playground_settings?: InputMaybe<Scalars["jsonb"]["input"]>;
  playground_state?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "explorations" */
export enum Explorations_Update_Column {
  /** column name */
  BranchId = "branch_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  PlaygroundSettings = "playground_settings",
  /** column name */
  PlaygroundState = "playground_state",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Explorations_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Explorations_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Explorations_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Explorations_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Explorations_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Explorations_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Explorations_Set_Input>;
  /** filter the rows which have to be updated */
  where: Explorations_Bool_Exp;
};

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["float8"]["input"]>;
  _gt?: InputMaybe<Scalars["float8"]["input"]>;
  _gte?: InputMaybe<Scalars["float8"]["input"]>;
  _in?: InputMaybe<Array<Scalars["float8"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["float8"]["input"]>;
  _lte?: InputMaybe<Scalars["float8"]["input"]>;
  _neq?: InputMaybe<Scalars["float8"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["float8"]["input"]>>;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars["jsonb"]["input"]>;
  _eq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _gte?: InputMaybe<Scalars["jsonb"]["input"]>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars["String"]["input"]>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars["String"]["input"]>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars["String"]["input"]>>;
  _in?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["jsonb"]["input"]>;
  _lte?: InputMaybe<Scalars["jsonb"]["input"]>;
  _neq?: InputMaybe<Scalars["jsonb"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["jsonb"]["input"]>>;
};

/** columns and relationships of "member_roles" */
export type Member_Roles = {
  __typename?: "member_roles";
  /** An object relationship */
  access_list?: Maybe<Access_Lists>;
  access_list_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** An object relationship */
  member: Members;
  member_id: Scalars["uuid"]["output"];
  /** An object relationship */
  teamRoleByTeamRole: Team_Roles;
  team_role: Team_Roles_Enum;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregated selection of "member_roles" */
export type Member_Roles_Aggregate = {
  __typename?: "member_roles_aggregate";
  aggregate?: Maybe<Member_Roles_Aggregate_Fields>;
  nodes: Array<Member_Roles>;
};

export type Member_Roles_Aggregate_Bool_Exp = {
  count?: InputMaybe<Member_Roles_Aggregate_Bool_Exp_Count>;
};

export type Member_Roles_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Member_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Member_Roles_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "member_roles" */
export type Member_Roles_Aggregate_Fields = {
  __typename?: "member_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Member_Roles_Max_Fields>;
  min?: Maybe<Member_Roles_Min_Fields>;
};

/** aggregate fields of "member_roles" */
export type Member_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Member_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "member_roles" */
export type Member_Roles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Member_Roles_Max_Order_By>;
  min?: InputMaybe<Member_Roles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "member_roles" */
export type Member_Roles_Arr_Rel_Insert_Input = {
  data: Array<Member_Roles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Member_Roles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "member_roles". All fields are combined with a logical 'AND'. */
export type Member_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Member_Roles_Bool_Exp>>;
  _not?: InputMaybe<Member_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Member_Roles_Bool_Exp>>;
  access_list?: InputMaybe<Access_Lists_Bool_Exp>;
  access_list_id?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  member?: InputMaybe<Members_Bool_Exp>;
  member_id?: InputMaybe<Uuid_Comparison_Exp>;
  teamRoleByTeamRole?: InputMaybe<Team_Roles_Bool_Exp>;
  team_role?: InputMaybe<Team_Roles_Enum_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "member_roles" */
export enum Member_Roles_Constraint {
  /** unique or primary key constraint on columns "team_role", "member_id" */
  MemberRolesMemberIdTeamRoleKey = "member_roles_member_id_team_role_key",
  /** unique or primary key constraint on columns "id" */
  MemberRolesPkey = "member_roles_pkey",
}

/** input type for inserting data into table "member_roles" */
export type Member_Roles_Insert_Input = {
  access_list?: InputMaybe<Access_Lists_Obj_Rel_Insert_Input>;
  access_list_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  member?: InputMaybe<Members_Obj_Rel_Insert_Input>;
  member_id?: InputMaybe<Scalars["uuid"]["input"]>;
  teamRoleByTeamRole?: InputMaybe<Team_Roles_Obj_Rel_Insert_Input>;
  team_role?: InputMaybe<Team_Roles_Enum>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Member_Roles_Max_Fields = {
  __typename?: "member_roles_max_fields";
  access_list_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  member_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "member_roles" */
export type Member_Roles_Max_Order_By = {
  access_list_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Member_Roles_Min_Fields = {
  __typename?: "member_roles_min_fields";
  access_list_id?: Maybe<Scalars["uuid"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  member_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "member_roles" */
export type Member_Roles_Min_Order_By = {
  access_list_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "member_roles" */
export type Member_Roles_Mutation_Response = {
  __typename?: "member_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Member_Roles>;
};

/** on_conflict condition type for table "member_roles" */
export type Member_Roles_On_Conflict = {
  constraint: Member_Roles_Constraint;
  update_columns?: Array<Member_Roles_Update_Column>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "member_roles". */
export type Member_Roles_Order_By = {
  access_list?: InputMaybe<Access_Lists_Order_By>;
  access_list_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member?: InputMaybe<Members_Order_By>;
  member_id?: InputMaybe<Order_By>;
  teamRoleByTeamRole?: InputMaybe<Team_Roles_Order_By>;
  team_role?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: member_roles */
export type Member_Roles_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "member_roles" */
export enum Member_Roles_Select_Column {
  /** column name */
  AccessListId = "access_list_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  MemberId = "member_id",
  /** column name */
  TeamRole = "team_role",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "member_roles" */
export type Member_Roles_Set_Input = {
  access_list_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  member_id?: InputMaybe<Scalars["uuid"]["input"]>;
  team_role?: InputMaybe<Team_Roles_Enum>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "member_roles" */
export type Member_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Member_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Member_Roles_Stream_Cursor_Value_Input = {
  access_list_id?: InputMaybe<Scalars["uuid"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  member_id?: InputMaybe<Scalars["uuid"]["input"]>;
  team_role?: InputMaybe<Team_Roles_Enum>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "member_roles" */
export enum Member_Roles_Update_Column {
  /** column name */
  AccessListId = "access_list_id",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  MemberId = "member_id",
  /** column name */
  TeamRole = "team_role",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Member_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Member_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Member_Roles_Bool_Exp;
};

/** columns and relationships of "members" */
export type Members = {
  __typename?: "members";
  created_at: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  member_roles: Array<Member_Roles>;
  /** An aggregate relationship */
  member_roles_aggregate: Member_Roles_Aggregate;
  /** An object relationship */
  team: Teams;
  team_id: Scalars["uuid"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "members" */
export type MembersMember_RolesArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

/** columns and relationships of "members" */
export type MembersMember_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

/** aggregated selection of "members" */
export type Members_Aggregate = {
  __typename?: "members_aggregate";
  aggregate?: Maybe<Members_Aggregate_Fields>;
  nodes: Array<Members>;
};

export type Members_Aggregate_Bool_Exp = {
  count?: InputMaybe<Members_Aggregate_Bool_Exp_Count>;
};

export type Members_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Members_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Members_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "members" */
export type Members_Aggregate_Fields = {
  __typename?: "members_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Members_Max_Fields>;
  min?: Maybe<Members_Min_Fields>;
};

/** aggregate fields of "members" */
export type Members_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Members_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "members" */
export type Members_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Members_Max_Order_By>;
  min?: InputMaybe<Members_Min_Order_By>;
};

/** input type for inserting array relation for remote table "members" */
export type Members_Arr_Rel_Insert_Input = {
  data: Array<Members_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Members_On_Conflict>;
};

/** Boolean expression to filter rows from the table "members". All fields are combined with a logical 'AND'. */
export type Members_Bool_Exp = {
  _and?: InputMaybe<Array<Members_Bool_Exp>>;
  _not?: InputMaybe<Members_Bool_Exp>;
  _or?: InputMaybe<Array<Members_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  member_roles?: InputMaybe<Member_Roles_Bool_Exp>;
  member_roles_aggregate?: InputMaybe<Member_Roles_Aggregate_Bool_Exp>;
  team?: InputMaybe<Teams_Bool_Exp>;
  team_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "members" */
export enum Members_Constraint {
  /** unique or primary key constraint on columns "id" */
  MembersPkey = "members_pkey",
  /** unique or primary key constraint on columns "user_id", "team_id" */
  MembersUserIdTeamIdKey = "members_user_id_team_id_key",
}

/** input type for inserting data into table "members" */
export type Members_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  member_roles?: InputMaybe<Member_Roles_Arr_Rel_Insert_Input>;
  team?: InputMaybe<Teams_Obj_Rel_Insert_Input>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Members_Max_Fields = {
  __typename?: "members_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "members" */
export type Members_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Members_Min_Fields = {
  __typename?: "members_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "members" */
export type Members_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "members" */
export type Members_Mutation_Response = {
  __typename?: "members_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Members>;
};

/** input type for inserting object relation for remote table "members" */
export type Members_Obj_Rel_Insert_Input = {
  data: Members_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Members_On_Conflict>;
};

/** on_conflict condition type for table "members" */
export type Members_On_Conflict = {
  constraint: Members_Constraint;
  update_columns?: Array<Members_Update_Column>;
  where?: InputMaybe<Members_Bool_Exp>;
};

/** Ordering options when selecting data from "members". */
export type Members_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  member_roles_aggregate?: InputMaybe<Member_Roles_Aggregate_Order_By>;
  team?: InputMaybe<Teams_Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: members */
export type Members_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "members" */
export enum Members_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "members" */
export type Members_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "members" */
export type Members_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Members_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Members_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "members" */
export enum Members_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Members_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Members_Set_Input>;
  /** filter the rows which have to be updated */
  where: Members_Bool_Exp;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: "mutation_root";
  check_connection?: Maybe<CheckConnectionOutput>;
  create_events: Scalars["uuid"]["output"];
  create_team?: Maybe<CreateTeamOutput>;
  /** delete data from the table: "access_lists" */
  delete_access_lists?: Maybe<Access_Lists_Mutation_Response>;
  /** delete single row from the table: "access_lists" */
  delete_access_lists_by_pk?: Maybe<Access_Lists>;
  /** delete data from the table: "alerts" */
  delete_alerts?: Maybe<Alerts_Mutation_Response>;
  /** delete single row from the table: "alerts" */
  delete_alerts_by_pk?: Maybe<Alerts>;
  /** delete data from the table: "auth.account_providers" */
  delete_auth_account_providers?: Maybe<Auth_Account_Providers_Mutation_Response>;
  /** delete single row from the table: "auth.account_providers" */
  delete_auth_account_providers_by_pk?: Maybe<Auth_Account_Providers>;
  /** delete data from the table: "auth.account_roles" */
  delete_auth_account_roles?: Maybe<Auth_Account_Roles_Mutation_Response>;
  /** delete single row from the table: "auth.account_roles" */
  delete_auth_account_roles_by_pk?: Maybe<Auth_Account_Roles>;
  /** delete data from the table: "auth.accounts" */
  delete_auth_accounts?: Maybe<Auth_Accounts_Mutation_Response>;
  /** delete single row from the table: "auth.accounts" */
  delete_auth_accounts_by_pk?: Maybe<Auth_Accounts>;
  /** delete data from the table: "auth.providers" */
  delete_auth_providers?: Maybe<Auth_Providers_Mutation_Response>;
  /** delete single row from the table: "auth.providers" */
  delete_auth_providers_by_pk?: Maybe<Auth_Providers>;
  /** delete data from the table: "auth.refresh_tokens" */
  delete_auth_refresh_tokens?: Maybe<Auth_Refresh_Tokens_Mutation_Response>;
  /** delete single row from the table: "auth.refresh_tokens" */
  delete_auth_refresh_tokens_by_pk?: Maybe<Auth_Refresh_Tokens>;
  /** delete data from the table: "auth.roles" */
  delete_auth_roles?: Maybe<Auth_Roles_Mutation_Response>;
  /** delete single row from the table: "auth.roles" */
  delete_auth_roles_by_pk?: Maybe<Auth_Roles>;
  /** delete data from the table: "branch_statuses" */
  delete_branch_statuses?: Maybe<Branch_Statuses_Mutation_Response>;
  /** delete single row from the table: "branch_statuses" */
  delete_branch_statuses_by_pk?: Maybe<Branch_Statuses>;
  /** delete data from the table: "branches" */
  delete_branches?: Maybe<Branches_Mutation_Response>;
  /** delete single row from the table: "branches" */
  delete_branches_by_pk?: Maybe<Branches>;
  /** delete data from the table: "dashboards" */
  delete_dashboards?: Maybe<Dashboards_Mutation_Response>;
  /** delete single row from the table: "dashboards" */
  delete_dashboards_by_pk?: Maybe<Dashboards>;
  /** delete data from the table: "dataschemas" */
  delete_dataschemas?: Maybe<Dataschemas_Mutation_Response>;
  /** delete single row from the table: "dataschemas" */
  delete_dataschemas_by_pk?: Maybe<Dataschemas>;
  /** delete data from the table: "datasources" */
  delete_datasources?: Maybe<Datasources_Mutation_Response>;
  /** delete single row from the table: "datasources" */
  delete_datasources_by_pk?: Maybe<Datasources>;
  /** delete data from the table: "events" */
  delete_events?: Maybe<Events_Mutation_Response>;
  /** delete single row from the table: "events" */
  delete_events_by_pk?: Maybe<Events>;
  /** delete data from the table: "explorations" */
  delete_explorations?: Maybe<Explorations_Mutation_Response>;
  /** delete single row from the table: "explorations" */
  delete_explorations_by_pk?: Maybe<Explorations>;
  /** delete data from the table: "member_roles" */
  delete_member_roles?: Maybe<Member_Roles_Mutation_Response>;
  /** delete single row from the table: "member_roles" */
  delete_member_roles_by_pk?: Maybe<Member_Roles>;
  /** delete data from the table: "members" */
  delete_members?: Maybe<Members_Mutation_Response>;
  /** delete single row from the table: "members" */
  delete_members_by_pk?: Maybe<Members>;
  /** delete data from the table: "pinned_items" */
  delete_pinned_items?: Maybe<Pinned_Items_Mutation_Response>;
  /** delete single row from the table: "pinned_items" */
  delete_pinned_items_by_pk?: Maybe<Pinned_Items>;
  /** delete data from the table: "reports" */
  delete_reports?: Maybe<Reports_Mutation_Response>;
  /** delete single row from the table: "reports" */
  delete_reports_by_pk?: Maybe<Reports>;
  /** delete data from the table: "request_event_logs" */
  delete_request_event_logs?: Maybe<Request_Event_Logs_Mutation_Response>;
  /** delete single row from the table: "request_event_logs" */
  delete_request_event_logs_by_pk?: Maybe<Request_Event_Logs>;
  /** delete data from the table: "request_logs" */
  delete_request_logs?: Maybe<Request_Logs_Mutation_Response>;
  /** delete single row from the table: "request_logs" */
  delete_request_logs_by_pk?: Maybe<Request_Logs>;
  /** delete data from the table: "sql_credentials" */
  delete_sql_credentials?: Maybe<Sql_Credentials_Mutation_Response>;
  /** delete single row from the table: "sql_credentials" */
  delete_sql_credentials_by_pk?: Maybe<Sql_Credentials>;
  /** delete data from the table: "team_roles" */
  delete_team_roles?: Maybe<Team_Roles_Mutation_Response>;
  /** delete single row from the table: "team_roles" */
  delete_team_roles_by_pk?: Maybe<Team_Roles>;
  /** delete data from the table: "teams" */
  delete_teams?: Maybe<Teams_Mutation_Response>;
  /** delete single row from the table: "teams" */
  delete_teams_by_pk?: Maybe<Teams>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** delete data from the table: "versions" */
  delete_versions?: Maybe<Versions_Mutation_Response>;
  /** delete single row from the table: "versions" */
  delete_versions_by_pk?: Maybe<Versions>;
  export_data_models?: Maybe<ExportDataModelsOutput>;
  gen_dataschemas?: Maybe<GenSourceSchemaOutput>;
  gen_sql?: Maybe<GenSqlOutput>;
  /** insert data into the table: "access_lists" */
  insert_access_lists?: Maybe<Access_Lists_Mutation_Response>;
  /** insert a single row into the table: "access_lists" */
  insert_access_lists_one?: Maybe<Access_Lists>;
  /** insert data into the table: "alerts" */
  insert_alerts?: Maybe<Alerts_Mutation_Response>;
  /** insert a single row into the table: "alerts" */
  insert_alerts_one?: Maybe<Alerts>;
  /** insert data into the table: "auth.account_providers" */
  insert_auth_account_providers?: Maybe<Auth_Account_Providers_Mutation_Response>;
  /** insert a single row into the table: "auth.account_providers" */
  insert_auth_account_providers_one?: Maybe<Auth_Account_Providers>;
  /** insert data into the table: "auth.account_roles" */
  insert_auth_account_roles?: Maybe<Auth_Account_Roles_Mutation_Response>;
  /** insert a single row into the table: "auth.account_roles" */
  insert_auth_account_roles_one?: Maybe<Auth_Account_Roles>;
  /** insert data into the table: "auth.accounts" */
  insert_auth_accounts?: Maybe<Auth_Accounts_Mutation_Response>;
  /** insert a single row into the table: "auth.accounts" */
  insert_auth_accounts_one?: Maybe<Auth_Accounts>;
  /** insert data into the table: "auth.providers" */
  insert_auth_providers?: Maybe<Auth_Providers_Mutation_Response>;
  /** insert a single row into the table: "auth.providers" */
  insert_auth_providers_one?: Maybe<Auth_Providers>;
  /** insert data into the table: "auth.refresh_tokens" */
  insert_auth_refresh_tokens?: Maybe<Auth_Refresh_Tokens_Mutation_Response>;
  /** insert a single row into the table: "auth.refresh_tokens" */
  insert_auth_refresh_tokens_one?: Maybe<Auth_Refresh_Tokens>;
  /** insert data into the table: "auth.roles" */
  insert_auth_roles?: Maybe<Auth_Roles_Mutation_Response>;
  /** insert a single row into the table: "auth.roles" */
  insert_auth_roles_one?: Maybe<Auth_Roles>;
  /** insert data into the table: "branch_statuses" */
  insert_branch_statuses?: Maybe<Branch_Statuses_Mutation_Response>;
  /** insert a single row into the table: "branch_statuses" */
  insert_branch_statuses_one?: Maybe<Branch_Statuses>;
  /** insert data into the table: "branches" */
  insert_branches?: Maybe<Branches_Mutation_Response>;
  /** insert a single row into the table: "branches" */
  insert_branches_one?: Maybe<Branches>;
  /** insert data into the table: "dashboards" */
  insert_dashboards?: Maybe<Dashboards_Mutation_Response>;
  /** insert a single row into the table: "dashboards" */
  insert_dashboards_one?: Maybe<Dashboards>;
  /** insert data into the table: "dataschemas" */
  insert_dataschemas?: Maybe<Dataschemas_Mutation_Response>;
  /** insert a single row into the table: "dataschemas" */
  insert_dataschemas_one?: Maybe<Dataschemas>;
  /** insert data into the table: "datasources" */
  insert_datasources?: Maybe<Datasources_Mutation_Response>;
  /** insert a single row into the table: "datasources" */
  insert_datasources_one?: Maybe<Datasources>;
  /** insert data into the table: "events" */
  insert_events?: Maybe<Events_Mutation_Response>;
  /** insert a single row into the table: "events" */
  insert_events_one?: Maybe<Events>;
  /** insert data into the table: "explorations" */
  insert_explorations?: Maybe<Explorations_Mutation_Response>;
  /** insert a single row into the table: "explorations" */
  insert_explorations_one?: Maybe<Explorations>;
  /** insert data into the table: "member_roles" */
  insert_member_roles?: Maybe<Member_Roles_Mutation_Response>;
  /** insert a single row into the table: "member_roles" */
  insert_member_roles_one?: Maybe<Member_Roles>;
  /** insert data into the table: "members" */
  insert_members?: Maybe<Members_Mutation_Response>;
  /** insert a single row into the table: "members" */
  insert_members_one?: Maybe<Members>;
  /** insert data into the table: "pinned_items" */
  insert_pinned_items?: Maybe<Pinned_Items_Mutation_Response>;
  /** insert a single row into the table: "pinned_items" */
  insert_pinned_items_one?: Maybe<Pinned_Items>;
  /** insert data into the table: "reports" */
  insert_reports?: Maybe<Reports_Mutation_Response>;
  /** insert a single row into the table: "reports" */
  insert_reports_one?: Maybe<Reports>;
  /** insert data into the table: "request_event_logs" */
  insert_request_event_logs?: Maybe<Request_Event_Logs_Mutation_Response>;
  /** insert a single row into the table: "request_event_logs" */
  insert_request_event_logs_one?: Maybe<Request_Event_Logs>;
  /** insert data into the table: "request_logs" */
  insert_request_logs?: Maybe<Request_Logs_Mutation_Response>;
  /** insert a single row into the table: "request_logs" */
  insert_request_logs_one?: Maybe<Request_Logs>;
  /** insert data into the table: "sql_credentials" */
  insert_sql_credentials?: Maybe<Sql_Credentials_Mutation_Response>;
  /** insert a single row into the table: "sql_credentials" */
  insert_sql_credentials_one?: Maybe<Sql_Credentials>;
  /** insert data into the table: "team_roles" */
  insert_team_roles?: Maybe<Team_Roles_Mutation_Response>;
  /** insert a single row into the table: "team_roles" */
  insert_team_roles_one?: Maybe<Team_Roles>;
  /** insert data into the table: "teams" */
  insert_teams?: Maybe<Teams_Mutation_Response>;
  /** insert a single row into the table: "teams" */
  insert_teams_one?: Maybe<Teams>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** insert data into the table: "versions" */
  insert_versions?: Maybe<Versions_Mutation_Response>;
  /** insert a single row into the table: "versions" */
  insert_versions_one?: Maybe<Versions>;
  invite_team_member?: Maybe<InviteTeamMemberOutput>;
  run_query?: Maybe<RunSourceQueryOutput>;
  send_test_alert?: Maybe<SendTestAlertOutput>;
  /** update data of the table: "access_lists" */
  update_access_lists?: Maybe<Access_Lists_Mutation_Response>;
  /** update single row of the table: "access_lists" */
  update_access_lists_by_pk?: Maybe<Access_Lists>;
  /** update multiples rows of table: "access_lists" */
  update_access_lists_many?: Maybe<
    Array<Maybe<Access_Lists_Mutation_Response>>
  >;
  /** update data of the table: "alerts" */
  update_alerts?: Maybe<Alerts_Mutation_Response>;
  /** update single row of the table: "alerts" */
  update_alerts_by_pk?: Maybe<Alerts>;
  /** update multiples rows of table: "alerts" */
  update_alerts_many?: Maybe<Array<Maybe<Alerts_Mutation_Response>>>;
  /** update data of the table: "auth.account_providers" */
  update_auth_account_providers?: Maybe<Auth_Account_Providers_Mutation_Response>;
  /** update single row of the table: "auth.account_providers" */
  update_auth_account_providers_by_pk?: Maybe<Auth_Account_Providers>;
  /** update multiples rows of table: "auth.account_providers" */
  update_auth_account_providers_many?: Maybe<
    Array<Maybe<Auth_Account_Providers_Mutation_Response>>
  >;
  /** update data of the table: "auth.account_roles" */
  update_auth_account_roles?: Maybe<Auth_Account_Roles_Mutation_Response>;
  /** update single row of the table: "auth.account_roles" */
  update_auth_account_roles_by_pk?: Maybe<Auth_Account_Roles>;
  /** update multiples rows of table: "auth.account_roles" */
  update_auth_account_roles_many?: Maybe<
    Array<Maybe<Auth_Account_Roles_Mutation_Response>>
  >;
  /** update data of the table: "auth.accounts" */
  update_auth_accounts?: Maybe<Auth_Accounts_Mutation_Response>;
  /** update single row of the table: "auth.accounts" */
  update_auth_accounts_by_pk?: Maybe<Auth_Accounts>;
  /** update multiples rows of table: "auth.accounts" */
  update_auth_accounts_many?: Maybe<
    Array<Maybe<Auth_Accounts_Mutation_Response>>
  >;
  /** update data of the table: "auth.providers" */
  update_auth_providers?: Maybe<Auth_Providers_Mutation_Response>;
  /** update single row of the table: "auth.providers" */
  update_auth_providers_by_pk?: Maybe<Auth_Providers>;
  /** update multiples rows of table: "auth.providers" */
  update_auth_providers_many?: Maybe<
    Array<Maybe<Auth_Providers_Mutation_Response>>
  >;
  /** update data of the table: "auth.refresh_tokens" */
  update_auth_refresh_tokens?: Maybe<Auth_Refresh_Tokens_Mutation_Response>;
  /** update single row of the table: "auth.refresh_tokens" */
  update_auth_refresh_tokens_by_pk?: Maybe<Auth_Refresh_Tokens>;
  /** update multiples rows of table: "auth.refresh_tokens" */
  update_auth_refresh_tokens_many?: Maybe<
    Array<Maybe<Auth_Refresh_Tokens_Mutation_Response>>
  >;
  /** update data of the table: "auth.roles" */
  update_auth_roles?: Maybe<Auth_Roles_Mutation_Response>;
  /** update single row of the table: "auth.roles" */
  update_auth_roles_by_pk?: Maybe<Auth_Roles>;
  /** update multiples rows of table: "auth.roles" */
  update_auth_roles_many?: Maybe<Array<Maybe<Auth_Roles_Mutation_Response>>>;
  /** update data of the table: "branch_statuses" */
  update_branch_statuses?: Maybe<Branch_Statuses_Mutation_Response>;
  /** update single row of the table: "branch_statuses" */
  update_branch_statuses_by_pk?: Maybe<Branch_Statuses>;
  /** update multiples rows of table: "branch_statuses" */
  update_branch_statuses_many?: Maybe<
    Array<Maybe<Branch_Statuses_Mutation_Response>>
  >;
  /** update data of the table: "branches" */
  update_branches?: Maybe<Branches_Mutation_Response>;
  /** update single row of the table: "branches" */
  update_branches_by_pk?: Maybe<Branches>;
  /** update multiples rows of table: "branches" */
  update_branches_many?: Maybe<Array<Maybe<Branches_Mutation_Response>>>;
  /** update data of the table: "dashboards" */
  update_dashboards?: Maybe<Dashboards_Mutation_Response>;
  /** update single row of the table: "dashboards" */
  update_dashboards_by_pk?: Maybe<Dashboards>;
  /** update multiples rows of table: "dashboards" */
  update_dashboards_many?: Maybe<Array<Maybe<Dashboards_Mutation_Response>>>;
  /** update data of the table: "dataschemas" */
  update_dataschemas?: Maybe<Dataschemas_Mutation_Response>;
  /** update single row of the table: "dataschemas" */
  update_dataschemas_by_pk?: Maybe<Dataschemas>;
  /** update multiples rows of table: "dataschemas" */
  update_dataschemas_many?: Maybe<Array<Maybe<Dataschemas_Mutation_Response>>>;
  /** update data of the table: "datasources" */
  update_datasources?: Maybe<Datasources_Mutation_Response>;
  /** update single row of the table: "datasources" */
  update_datasources_by_pk?: Maybe<Datasources>;
  /** update multiples rows of table: "datasources" */
  update_datasources_many?: Maybe<Array<Maybe<Datasources_Mutation_Response>>>;
  /** update data of the table: "events" */
  update_events?: Maybe<Events_Mutation_Response>;
  /** update single row of the table: "events" */
  update_events_by_pk?: Maybe<Events>;
  /** update multiples rows of table: "events" */
  update_events_many?: Maybe<Array<Maybe<Events_Mutation_Response>>>;
  /** update data of the table: "explorations" */
  update_explorations?: Maybe<Explorations_Mutation_Response>;
  /** update single row of the table: "explorations" */
  update_explorations_by_pk?: Maybe<Explorations>;
  /** update multiples rows of table: "explorations" */
  update_explorations_many?: Maybe<
    Array<Maybe<Explorations_Mutation_Response>>
  >;
  /** update data of the table: "member_roles" */
  update_member_roles?: Maybe<Member_Roles_Mutation_Response>;
  /** update single row of the table: "member_roles" */
  update_member_roles_by_pk?: Maybe<Member_Roles>;
  /** update multiples rows of table: "member_roles" */
  update_member_roles_many?: Maybe<
    Array<Maybe<Member_Roles_Mutation_Response>>
  >;
  /** update data of the table: "members" */
  update_members?: Maybe<Members_Mutation_Response>;
  /** update single row of the table: "members" */
  update_members_by_pk?: Maybe<Members>;
  /** update multiples rows of table: "members" */
  update_members_many?: Maybe<Array<Maybe<Members_Mutation_Response>>>;
  /** update data of the table: "pinned_items" */
  update_pinned_items?: Maybe<Pinned_Items_Mutation_Response>;
  /** update single row of the table: "pinned_items" */
  update_pinned_items_by_pk?: Maybe<Pinned_Items>;
  /** update multiples rows of table: "pinned_items" */
  update_pinned_items_many?: Maybe<
    Array<Maybe<Pinned_Items_Mutation_Response>>
  >;
  /** update data of the table: "reports" */
  update_reports?: Maybe<Reports_Mutation_Response>;
  /** update single row of the table: "reports" */
  update_reports_by_pk?: Maybe<Reports>;
  /** update multiples rows of table: "reports" */
  update_reports_many?: Maybe<Array<Maybe<Reports_Mutation_Response>>>;
  /** update data of the table: "request_event_logs" */
  update_request_event_logs?: Maybe<Request_Event_Logs_Mutation_Response>;
  /** update single row of the table: "request_event_logs" */
  update_request_event_logs_by_pk?: Maybe<Request_Event_Logs>;
  /** update multiples rows of table: "request_event_logs" */
  update_request_event_logs_many?: Maybe<
    Array<Maybe<Request_Event_Logs_Mutation_Response>>
  >;
  /** update data of the table: "request_logs" */
  update_request_logs?: Maybe<Request_Logs_Mutation_Response>;
  /** update single row of the table: "request_logs" */
  update_request_logs_by_pk?: Maybe<Request_Logs>;
  /** update multiples rows of table: "request_logs" */
  update_request_logs_many?: Maybe<
    Array<Maybe<Request_Logs_Mutation_Response>>
  >;
  /** update data of the table: "sql_credentials" */
  update_sql_credentials?: Maybe<Sql_Credentials_Mutation_Response>;
  /** update single row of the table: "sql_credentials" */
  update_sql_credentials_by_pk?: Maybe<Sql_Credentials>;
  /** update multiples rows of table: "sql_credentials" */
  update_sql_credentials_many?: Maybe<
    Array<Maybe<Sql_Credentials_Mutation_Response>>
  >;
  /** update data of the table: "team_roles" */
  update_team_roles?: Maybe<Team_Roles_Mutation_Response>;
  /** update single row of the table: "team_roles" */
  update_team_roles_by_pk?: Maybe<Team_Roles>;
  /** update multiples rows of table: "team_roles" */
  update_team_roles_many?: Maybe<Array<Maybe<Team_Roles_Mutation_Response>>>;
  /** update data of the table: "teams" */
  update_teams?: Maybe<Teams_Mutation_Response>;
  /** update single row of the table: "teams" */
  update_teams_by_pk?: Maybe<Teams>;
  /** update multiples rows of table: "teams" */
  update_teams_many?: Maybe<Array<Maybe<Teams_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
  /** update data of the table: "versions" */
  update_versions?: Maybe<Versions_Mutation_Response>;
  /** update single row of the table: "versions" */
  update_versions_by_pk?: Maybe<Versions>;
  /** update multiples rows of table: "versions" */
  update_versions_many?: Maybe<Array<Maybe<Versions_Mutation_Response>>>;
};

/** mutation root */
export type Mutation_RootCheck_ConnectionArgs = {
  datasource_id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootCreate_EventsArgs = {
  objects: Array<Events_Create_Input>;
};

/** mutation root */
export type Mutation_RootCreate_TeamArgs = {
  name: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Access_ListsArgs = {
  where: Access_Lists_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Access_Lists_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_AlertsArgs = {
  where: Alerts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Alerts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_Account_ProvidersArgs = {
  where: Auth_Account_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Account_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_Account_RolesArgs = {
  where: Auth_Account_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Account_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_AccountsArgs = {
  where: Auth_Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Accounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_ProvidersArgs = {
  where: Auth_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Providers_By_PkArgs = {
  provider: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_Refresh_TokensArgs = {
  where: Auth_Refresh_Tokens_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Refresh_Tokens_By_PkArgs = {
  refresh_token: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Auth_RolesArgs = {
  where: Auth_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Auth_Roles_By_PkArgs = {
  role: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Branch_StatusesArgs = {
  where: Branch_Statuses_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Branch_Statuses_By_PkArgs = {
  status: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_BranchesArgs = {
  where: Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Branches_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_DashboardsArgs = {
  where: Dashboards_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Dashboards_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_DataschemasArgs = {
  where: Dataschemas_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Dataschemas_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_DatasourcesArgs = {
  where: Datasources_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Datasources_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_EventsArgs = {
  where: Events_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Events_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_ExplorationsArgs = {
  where: Explorations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Explorations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Member_RolesArgs = {
  where: Member_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Member_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_MembersArgs = {
  where: Members_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Members_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Pinned_ItemsArgs = {
  where: Pinned_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Pinned_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_ReportsArgs = {
  where: Reports_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Reports_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Request_Event_LogsArgs = {
  where: Request_Event_Logs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Request_Event_Logs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Request_LogsArgs = {
  where: Request_Logs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Request_Logs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Sql_CredentialsArgs = {
  where: Sql_Credentials_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Sql_Credentials_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_Team_RolesArgs = {
  where: Team_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Team_Roles_By_PkArgs = {
  name: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_TeamsArgs = {
  where: Teams_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Teams_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootDelete_VersionsArgs = {
  where: Versions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Versions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootExport_Data_ModelsArgs = {
  branch_id?: InputMaybe<Scalars["String"]["input"]>;
};

/** mutation root */
export type Mutation_RootGen_DataschemasArgs = {
  branch_id: Scalars["uuid"]["input"];
  datasource_id: Scalars["uuid"]["input"];
  format?: InputMaybe<Scalars["String"]["input"]>;
  overwrite?: InputMaybe<Scalars["Boolean"]["input"]>;
  tables: Array<SourceTable>;
};

/** mutation root */
export type Mutation_RootGen_SqlArgs = {
  exploration_id: Scalars["uuid"]["input"];
};

/** mutation root */
export type Mutation_RootInsert_Access_ListsArgs = {
  objects: Array<Access_Lists_Insert_Input>;
  on_conflict?: InputMaybe<Access_Lists_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Access_Lists_OneArgs = {
  object: Access_Lists_Insert_Input;
  on_conflict?: InputMaybe<Access_Lists_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_AlertsArgs = {
  objects: Array<Alerts_Insert_Input>;
  on_conflict?: InputMaybe<Alerts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Alerts_OneArgs = {
  object: Alerts_Insert_Input;
  on_conflict?: InputMaybe<Alerts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Account_ProvidersArgs = {
  objects: Array<Auth_Account_Providers_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Account_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Account_Providers_OneArgs = {
  object: Auth_Account_Providers_Insert_Input;
  on_conflict?: InputMaybe<Auth_Account_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Account_RolesArgs = {
  objects: Array<Auth_Account_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Account_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Account_Roles_OneArgs = {
  object: Auth_Account_Roles_Insert_Input;
  on_conflict?: InputMaybe<Auth_Account_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_AccountsArgs = {
  objects: Array<Auth_Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Accounts_OneArgs = {
  object: Auth_Accounts_Insert_Input;
  on_conflict?: InputMaybe<Auth_Accounts_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_ProvidersArgs = {
  objects: Array<Auth_Providers_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Providers_OneArgs = {
  object: Auth_Providers_Insert_Input;
  on_conflict?: InputMaybe<Auth_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Refresh_TokensArgs = {
  objects: Array<Auth_Refresh_Tokens_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Refresh_Tokens_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Refresh_Tokens_OneArgs = {
  object: Auth_Refresh_Tokens_Insert_Input;
  on_conflict?: InputMaybe<Auth_Refresh_Tokens_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_RolesArgs = {
  objects: Array<Auth_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Auth_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Auth_Roles_OneArgs = {
  object: Auth_Roles_Insert_Input;
  on_conflict?: InputMaybe<Auth_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Branch_StatusesArgs = {
  objects: Array<Branch_Statuses_Insert_Input>;
  on_conflict?: InputMaybe<Branch_Statuses_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Branch_Statuses_OneArgs = {
  object: Branch_Statuses_Insert_Input;
  on_conflict?: InputMaybe<Branch_Statuses_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_BranchesArgs = {
  objects: Array<Branches_Insert_Input>;
  on_conflict?: InputMaybe<Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Branches_OneArgs = {
  object: Branches_Insert_Input;
  on_conflict?: InputMaybe<Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_DashboardsArgs = {
  objects: Array<Dashboards_Insert_Input>;
  on_conflict?: InputMaybe<Dashboards_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Dashboards_OneArgs = {
  object: Dashboards_Insert_Input;
  on_conflict?: InputMaybe<Dashboards_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_DataschemasArgs = {
  objects: Array<Dataschemas_Insert_Input>;
  on_conflict?: InputMaybe<Dataschemas_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Dataschemas_OneArgs = {
  object: Dataschemas_Insert_Input;
  on_conflict?: InputMaybe<Dataschemas_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_DatasourcesArgs = {
  objects: Array<Datasources_Insert_Input>;
  on_conflict?: InputMaybe<Datasources_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Datasources_OneArgs = {
  object: Datasources_Insert_Input;
  on_conflict?: InputMaybe<Datasources_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_EventsArgs = {
  objects: Array<Events_Insert_Input>;
  on_conflict?: InputMaybe<Events_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Events_OneArgs = {
  object: Events_Insert_Input;
  on_conflict?: InputMaybe<Events_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ExplorationsArgs = {
  objects: Array<Explorations_Insert_Input>;
  on_conflict?: InputMaybe<Explorations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Explorations_OneArgs = {
  object: Explorations_Insert_Input;
  on_conflict?: InputMaybe<Explorations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Member_RolesArgs = {
  objects: Array<Member_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Member_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Member_Roles_OneArgs = {
  object: Member_Roles_Insert_Input;
  on_conflict?: InputMaybe<Member_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_MembersArgs = {
  objects: Array<Members_Insert_Input>;
  on_conflict?: InputMaybe<Members_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Members_OneArgs = {
  object: Members_Insert_Input;
  on_conflict?: InputMaybe<Members_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Pinned_ItemsArgs = {
  objects: Array<Pinned_Items_Insert_Input>;
  on_conflict?: InputMaybe<Pinned_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Pinned_Items_OneArgs = {
  object: Pinned_Items_Insert_Input;
  on_conflict?: InputMaybe<Pinned_Items_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_ReportsArgs = {
  objects: Array<Reports_Insert_Input>;
  on_conflict?: InputMaybe<Reports_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Reports_OneArgs = {
  object: Reports_Insert_Input;
  on_conflict?: InputMaybe<Reports_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Request_Event_LogsArgs = {
  objects: Array<Request_Event_Logs_Insert_Input>;
  on_conflict?: InputMaybe<Request_Event_Logs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Request_Event_Logs_OneArgs = {
  object: Request_Event_Logs_Insert_Input;
  on_conflict?: InputMaybe<Request_Event_Logs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Request_LogsArgs = {
  objects: Array<Request_Logs_Insert_Input>;
  on_conflict?: InputMaybe<Request_Logs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Request_Logs_OneArgs = {
  object: Request_Logs_Insert_Input;
  on_conflict?: InputMaybe<Request_Logs_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sql_CredentialsArgs = {
  objects: Array<Sql_Credentials_Insert_Input>;
  on_conflict?: InputMaybe<Sql_Credentials_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Sql_Credentials_OneArgs = {
  object: Sql_Credentials_Insert_Input;
  on_conflict?: InputMaybe<Sql_Credentials_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Team_RolesArgs = {
  objects: Array<Team_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Team_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Team_Roles_OneArgs = {
  object: Team_Roles_Insert_Input;
  on_conflict?: InputMaybe<Team_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_TeamsArgs = {
  objects: Array<Teams_Insert_Input>;
  on_conflict?: InputMaybe<Teams_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Teams_OneArgs = {
  object: Teams_Insert_Input;
  on_conflict?: InputMaybe<Teams_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_VersionsArgs = {
  objects: Array<Versions_Insert_Input>;
  on_conflict?: InputMaybe<Versions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Versions_OneArgs = {
  object: Versions_Insert_Input;
  on_conflict?: InputMaybe<Versions_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInvite_Team_MemberArgs = {
  email: Scalars["String"]["input"];
  magicLink?: InputMaybe<Scalars["Boolean"]["input"]>;
  role?: InputMaybe<Scalars["String"]["input"]>;
  teamId?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** mutation root */
export type Mutation_RootRun_QueryArgs = {
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  datasource_id: Scalars["uuid"]["input"];
  limit: Scalars["Int"]["input"];
  query: Scalars["String"]["input"];
};

/** mutation root */
export type Mutation_RootSend_Test_AlertArgs = {
  deliveryConfig: Scalars["json"]["input"];
  deliveryType: Scalars["String"]["input"];
  explorationId?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

/** mutation root */
export type Mutation_RootUpdate_Access_ListsArgs = {
  _append?: InputMaybe<Access_Lists_Append_Input>;
  _delete_at_path?: InputMaybe<Access_Lists_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Access_Lists_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Access_Lists_Delete_Key_Input>;
  _prepend?: InputMaybe<Access_Lists_Prepend_Input>;
  _set?: InputMaybe<Access_Lists_Set_Input>;
  where: Access_Lists_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Access_Lists_By_PkArgs = {
  _append?: InputMaybe<Access_Lists_Append_Input>;
  _delete_at_path?: InputMaybe<Access_Lists_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Access_Lists_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Access_Lists_Delete_Key_Input>;
  _prepend?: InputMaybe<Access_Lists_Prepend_Input>;
  _set?: InputMaybe<Access_Lists_Set_Input>;
  pk_columns: Access_Lists_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Access_Lists_ManyArgs = {
  updates: Array<Access_Lists_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_AlertsArgs = {
  _append?: InputMaybe<Alerts_Append_Input>;
  _delete_at_path?: InputMaybe<Alerts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Alerts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Alerts_Delete_Key_Input>;
  _prepend?: InputMaybe<Alerts_Prepend_Input>;
  _set?: InputMaybe<Alerts_Set_Input>;
  where: Alerts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Alerts_By_PkArgs = {
  _append?: InputMaybe<Alerts_Append_Input>;
  _delete_at_path?: InputMaybe<Alerts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Alerts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Alerts_Delete_Key_Input>;
  _prepend?: InputMaybe<Alerts_Prepend_Input>;
  _set?: InputMaybe<Alerts_Set_Input>;
  pk_columns: Alerts_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Alerts_ManyArgs = {
  updates: Array<Alerts_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Account_ProvidersArgs = {
  _set?: InputMaybe<Auth_Account_Providers_Set_Input>;
  where: Auth_Account_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Account_Providers_By_PkArgs = {
  _set?: InputMaybe<Auth_Account_Providers_Set_Input>;
  pk_columns: Auth_Account_Providers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Account_Providers_ManyArgs = {
  updates: Array<Auth_Account_Providers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Account_RolesArgs = {
  _set?: InputMaybe<Auth_Account_Roles_Set_Input>;
  where: Auth_Account_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Account_Roles_By_PkArgs = {
  _set?: InputMaybe<Auth_Account_Roles_Set_Input>;
  pk_columns: Auth_Account_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Account_Roles_ManyArgs = {
  updates: Array<Auth_Account_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_AccountsArgs = {
  _append?: InputMaybe<Auth_Accounts_Append_Input>;
  _delete_at_path?: InputMaybe<Auth_Accounts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Auth_Accounts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Auth_Accounts_Delete_Key_Input>;
  _prepend?: InputMaybe<Auth_Accounts_Prepend_Input>;
  _set?: InputMaybe<Auth_Accounts_Set_Input>;
  where: Auth_Accounts_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Accounts_By_PkArgs = {
  _append?: InputMaybe<Auth_Accounts_Append_Input>;
  _delete_at_path?: InputMaybe<Auth_Accounts_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Auth_Accounts_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Auth_Accounts_Delete_Key_Input>;
  _prepend?: InputMaybe<Auth_Accounts_Prepend_Input>;
  _set?: InputMaybe<Auth_Accounts_Set_Input>;
  pk_columns: Auth_Accounts_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Accounts_ManyArgs = {
  updates: Array<Auth_Accounts_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_ProvidersArgs = {
  _set?: InputMaybe<Auth_Providers_Set_Input>;
  where: Auth_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Providers_By_PkArgs = {
  _set?: InputMaybe<Auth_Providers_Set_Input>;
  pk_columns: Auth_Providers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Providers_ManyArgs = {
  updates: Array<Auth_Providers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Refresh_TokensArgs = {
  _set?: InputMaybe<Auth_Refresh_Tokens_Set_Input>;
  where: Auth_Refresh_Tokens_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Refresh_Tokens_By_PkArgs = {
  _set?: InputMaybe<Auth_Refresh_Tokens_Set_Input>;
  pk_columns: Auth_Refresh_Tokens_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Refresh_Tokens_ManyArgs = {
  updates: Array<Auth_Refresh_Tokens_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_RolesArgs = {
  _set?: InputMaybe<Auth_Roles_Set_Input>;
  where: Auth_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Roles_By_PkArgs = {
  _set?: InputMaybe<Auth_Roles_Set_Input>;
  pk_columns: Auth_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Auth_Roles_ManyArgs = {
  updates: Array<Auth_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Branch_StatusesArgs = {
  _set?: InputMaybe<Branch_Statuses_Set_Input>;
  where: Branch_Statuses_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Branch_Statuses_By_PkArgs = {
  _set?: InputMaybe<Branch_Statuses_Set_Input>;
  pk_columns: Branch_Statuses_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Branch_Statuses_ManyArgs = {
  updates: Array<Branch_Statuses_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_BranchesArgs = {
  _set?: InputMaybe<Branches_Set_Input>;
  where: Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Branches_By_PkArgs = {
  _set?: InputMaybe<Branches_Set_Input>;
  pk_columns: Branches_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Branches_ManyArgs = {
  updates: Array<Branches_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_DashboardsArgs = {
  _append?: InputMaybe<Dashboards_Append_Input>;
  _delete_at_path?: InputMaybe<Dashboards_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Dashboards_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Dashboards_Delete_Key_Input>;
  _prepend?: InputMaybe<Dashboards_Prepend_Input>;
  _set?: InputMaybe<Dashboards_Set_Input>;
  where: Dashboards_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Dashboards_By_PkArgs = {
  _append?: InputMaybe<Dashboards_Append_Input>;
  _delete_at_path?: InputMaybe<Dashboards_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Dashboards_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Dashboards_Delete_Key_Input>;
  _prepend?: InputMaybe<Dashboards_Prepend_Input>;
  _set?: InputMaybe<Dashboards_Set_Input>;
  pk_columns: Dashboards_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Dashboards_ManyArgs = {
  updates: Array<Dashboards_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_DataschemasArgs = {
  _set?: InputMaybe<Dataschemas_Set_Input>;
  where: Dataschemas_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Dataschemas_By_PkArgs = {
  _set?: InputMaybe<Dataschemas_Set_Input>;
  pk_columns: Dataschemas_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Dataschemas_ManyArgs = {
  updates: Array<Dataschemas_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_DatasourcesArgs = {
  _append?: InputMaybe<Datasources_Append_Input>;
  _delete_at_path?: InputMaybe<Datasources_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Datasources_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Datasources_Delete_Key_Input>;
  _prepend?: InputMaybe<Datasources_Prepend_Input>;
  _set?: InputMaybe<Datasources_Set_Input>;
  where: Datasources_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Datasources_By_PkArgs = {
  _append?: InputMaybe<Datasources_Append_Input>;
  _delete_at_path?: InputMaybe<Datasources_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Datasources_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Datasources_Delete_Key_Input>;
  _prepend?: InputMaybe<Datasources_Prepend_Input>;
  _set?: InputMaybe<Datasources_Set_Input>;
  pk_columns: Datasources_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Datasources_ManyArgs = {
  updates: Array<Datasources_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_EventsArgs = {
  _append?: InputMaybe<Events_Append_Input>;
  _delete_at_path?: InputMaybe<Events_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Events_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Events_Delete_Key_Input>;
  _prepend?: InputMaybe<Events_Prepend_Input>;
  _set?: InputMaybe<Events_Set_Input>;
  where: Events_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Events_By_PkArgs = {
  _append?: InputMaybe<Events_Append_Input>;
  _delete_at_path?: InputMaybe<Events_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Events_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Events_Delete_Key_Input>;
  _prepend?: InputMaybe<Events_Prepend_Input>;
  _set?: InputMaybe<Events_Set_Input>;
  pk_columns: Events_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Events_ManyArgs = {
  updates: Array<Events_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ExplorationsArgs = {
  _append?: InputMaybe<Explorations_Append_Input>;
  _delete_at_path?: InputMaybe<Explorations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Explorations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Explorations_Delete_Key_Input>;
  _prepend?: InputMaybe<Explorations_Prepend_Input>;
  _set?: InputMaybe<Explorations_Set_Input>;
  where: Explorations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Explorations_By_PkArgs = {
  _append?: InputMaybe<Explorations_Append_Input>;
  _delete_at_path?: InputMaybe<Explorations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Explorations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Explorations_Delete_Key_Input>;
  _prepend?: InputMaybe<Explorations_Prepend_Input>;
  _set?: InputMaybe<Explorations_Set_Input>;
  pk_columns: Explorations_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Explorations_ManyArgs = {
  updates: Array<Explorations_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Member_RolesArgs = {
  _set?: InputMaybe<Member_Roles_Set_Input>;
  where: Member_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Member_Roles_By_PkArgs = {
  _set?: InputMaybe<Member_Roles_Set_Input>;
  pk_columns: Member_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Member_Roles_ManyArgs = {
  updates: Array<Member_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_MembersArgs = {
  _set?: InputMaybe<Members_Set_Input>;
  where: Members_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Members_By_PkArgs = {
  _set?: InputMaybe<Members_Set_Input>;
  pk_columns: Members_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Members_ManyArgs = {
  updates: Array<Members_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Pinned_ItemsArgs = {
  _append?: InputMaybe<Pinned_Items_Append_Input>;
  _delete_at_path?: InputMaybe<Pinned_Items_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Pinned_Items_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Pinned_Items_Delete_Key_Input>;
  _prepend?: InputMaybe<Pinned_Items_Prepend_Input>;
  _set?: InputMaybe<Pinned_Items_Set_Input>;
  where: Pinned_Items_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Pinned_Items_By_PkArgs = {
  _append?: InputMaybe<Pinned_Items_Append_Input>;
  _delete_at_path?: InputMaybe<Pinned_Items_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Pinned_Items_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Pinned_Items_Delete_Key_Input>;
  _prepend?: InputMaybe<Pinned_Items_Prepend_Input>;
  _set?: InputMaybe<Pinned_Items_Set_Input>;
  pk_columns: Pinned_Items_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Pinned_Items_ManyArgs = {
  updates: Array<Pinned_Items_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_ReportsArgs = {
  _append?: InputMaybe<Reports_Append_Input>;
  _delete_at_path?: InputMaybe<Reports_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Reports_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Reports_Delete_Key_Input>;
  _prepend?: InputMaybe<Reports_Prepend_Input>;
  _set?: InputMaybe<Reports_Set_Input>;
  where: Reports_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Reports_By_PkArgs = {
  _append?: InputMaybe<Reports_Append_Input>;
  _delete_at_path?: InputMaybe<Reports_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Reports_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Reports_Delete_Key_Input>;
  _prepend?: InputMaybe<Reports_Prepend_Input>;
  _set?: InputMaybe<Reports_Set_Input>;
  pk_columns: Reports_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Reports_ManyArgs = {
  updates: Array<Reports_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Request_Event_LogsArgs = {
  _append?: InputMaybe<Request_Event_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Request_Event_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Request_Event_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Request_Event_Logs_Delete_Key_Input>;
  _inc?: InputMaybe<Request_Event_Logs_Inc_Input>;
  _prepend?: InputMaybe<Request_Event_Logs_Prepend_Input>;
  _set?: InputMaybe<Request_Event_Logs_Set_Input>;
  where: Request_Event_Logs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Request_Event_Logs_By_PkArgs = {
  _append?: InputMaybe<Request_Event_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Request_Event_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Request_Event_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Request_Event_Logs_Delete_Key_Input>;
  _inc?: InputMaybe<Request_Event_Logs_Inc_Input>;
  _prepend?: InputMaybe<Request_Event_Logs_Prepend_Input>;
  _set?: InputMaybe<Request_Event_Logs_Set_Input>;
  pk_columns: Request_Event_Logs_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Request_Event_Logs_ManyArgs = {
  updates: Array<Request_Event_Logs_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Request_LogsArgs = {
  _set?: InputMaybe<Request_Logs_Set_Input>;
  where: Request_Logs_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Request_Logs_By_PkArgs = {
  _set?: InputMaybe<Request_Logs_Set_Input>;
  pk_columns: Request_Logs_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Request_Logs_ManyArgs = {
  updates: Array<Request_Logs_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Sql_CredentialsArgs = {
  _set?: InputMaybe<Sql_Credentials_Set_Input>;
  where: Sql_Credentials_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Sql_Credentials_By_PkArgs = {
  _set?: InputMaybe<Sql_Credentials_Set_Input>;
  pk_columns: Sql_Credentials_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Sql_Credentials_ManyArgs = {
  updates: Array<Sql_Credentials_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Team_RolesArgs = {
  _set?: InputMaybe<Team_Roles_Set_Input>;
  where: Team_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Team_Roles_By_PkArgs = {
  _set?: InputMaybe<Team_Roles_Set_Input>;
  pk_columns: Team_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Team_Roles_ManyArgs = {
  updates: Array<Team_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_TeamsArgs = {
  _set?: InputMaybe<Teams_Set_Input>;
  where: Teams_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Teams_By_PkArgs = {
  _set?: InputMaybe<Teams_Set_Input>;
  pk_columns: Teams_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Teams_ManyArgs = {
  updates: Array<Teams_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_VersionsArgs = {
  _set?: InputMaybe<Versions_Set_Input>;
  where: Versions_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Versions_By_PkArgs = {
  _set?: InputMaybe<Versions_Set_Input>;
  pk_columns: Versions_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Versions_ManyArgs = {
  updates: Array<Versions_Updates>;
};

/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
export type Numeric_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["numeric"]["input"]>;
  _gt?: InputMaybe<Scalars["numeric"]["input"]>;
  _gte?: InputMaybe<Scalars["numeric"]["input"]>;
  _in?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["numeric"]["input"]>;
  _lte?: InputMaybe<Scalars["numeric"]["input"]>;
  _neq?: InputMaybe<Scalars["numeric"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["numeric"]["input"]>>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = "asc",
  /** in ascending order, nulls first */
  AscNullsFirst = "asc_nulls_first",
  /** in ascending order, nulls last */
  AscNullsLast = "asc_nulls_last",
  /** in descending order, nulls first */
  Desc = "desc",
  /** in descending order, nulls first */
  DescNullsFirst = "desc_nulls_first",
  /** in descending order, nulls last */
  DescNullsLast = "desc_nulls_last",
}

/** columns and relationships of "pinned_items" */
export type Pinned_Items = {
  __typename?: "pinned_items";
  created_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  dashboard: Dashboards;
  dashboard_id: Scalars["uuid"]["output"];
  /** An object relationship */
  exploration: Explorations;
  exploration_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  spec: Scalars["jsonb"]["output"];
  spec_config: Scalars["jsonb"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "pinned_items" */
export type Pinned_ItemsSpecArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "pinned_items" */
export type Pinned_ItemsSpec_ConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "pinned_items" */
export type Pinned_Items_Aggregate = {
  __typename?: "pinned_items_aggregate";
  aggregate?: Maybe<Pinned_Items_Aggregate_Fields>;
  nodes: Array<Pinned_Items>;
};

export type Pinned_Items_Aggregate_Bool_Exp = {
  count?: InputMaybe<Pinned_Items_Aggregate_Bool_Exp_Count>;
};

export type Pinned_Items_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Pinned_Items_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "pinned_items" */
export type Pinned_Items_Aggregate_Fields = {
  __typename?: "pinned_items_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Pinned_Items_Max_Fields>;
  min?: Maybe<Pinned_Items_Min_Fields>;
};

/** aggregate fields of "pinned_items" */
export type Pinned_Items_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "pinned_items" */
export type Pinned_Items_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Pinned_Items_Max_Order_By>;
  min?: InputMaybe<Pinned_Items_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Pinned_Items_Append_Input = {
  spec?: InputMaybe<Scalars["jsonb"]["input"]>;
  spec_config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "pinned_items" */
export type Pinned_Items_Arr_Rel_Insert_Input = {
  data: Array<Pinned_Items_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Pinned_Items_On_Conflict>;
};

/** Boolean expression to filter rows from the table "pinned_items". All fields are combined with a logical 'AND'. */
export type Pinned_Items_Bool_Exp = {
  _and?: InputMaybe<Array<Pinned_Items_Bool_Exp>>;
  _not?: InputMaybe<Pinned_Items_Bool_Exp>;
  _or?: InputMaybe<Array<Pinned_Items_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  dashboard?: InputMaybe<Dashboards_Bool_Exp>;
  dashboard_id?: InputMaybe<Uuid_Comparison_Exp>;
  exploration?: InputMaybe<Explorations_Bool_Exp>;
  exploration_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  spec?: InputMaybe<Jsonb_Comparison_Exp>;
  spec_config?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "pinned_items" */
export enum Pinned_Items_Constraint {
  /** unique or primary key constraint on columns "id" */
  PinnedItemsPkey = "pinned_items_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Pinned_Items_Delete_At_Path_Input = {
  spec?: InputMaybe<Array<Scalars["String"]["input"]>>;
  spec_config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Pinned_Items_Delete_Elem_Input = {
  spec?: InputMaybe<Scalars["Int"]["input"]>;
  spec_config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Pinned_Items_Delete_Key_Input = {
  spec?: InputMaybe<Scalars["String"]["input"]>;
  spec_config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "pinned_items" */
export type Pinned_Items_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dashboard?: InputMaybe<Dashboards_Obj_Rel_Insert_Input>;
  dashboard_id?: InputMaybe<Scalars["uuid"]["input"]>;
  exploration?: InputMaybe<Explorations_Obj_Rel_Insert_Input>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  spec?: InputMaybe<Scalars["jsonb"]["input"]>;
  spec_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Pinned_Items_Max_Fields = {
  __typename?: "pinned_items_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  dashboard_id?: Maybe<Scalars["uuid"]["output"]>;
  exploration_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "pinned_items" */
export type Pinned_Items_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  dashboard_id?: InputMaybe<Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Pinned_Items_Min_Fields = {
  __typename?: "pinned_items_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  dashboard_id?: Maybe<Scalars["uuid"]["output"]>;
  exploration_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "pinned_items" */
export type Pinned_Items_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  dashboard_id?: InputMaybe<Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "pinned_items" */
export type Pinned_Items_Mutation_Response = {
  __typename?: "pinned_items_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Pinned_Items>;
};

/** on_conflict condition type for table "pinned_items" */
export type Pinned_Items_On_Conflict = {
  constraint: Pinned_Items_Constraint;
  update_columns?: Array<Pinned_Items_Update_Column>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

/** Ordering options when selecting data from "pinned_items". */
export type Pinned_Items_Order_By = {
  created_at?: InputMaybe<Order_By>;
  dashboard?: InputMaybe<Dashboards_Order_By>;
  dashboard_id?: InputMaybe<Order_By>;
  exploration?: InputMaybe<Explorations_Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  spec?: InputMaybe<Order_By>;
  spec_config?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: pinned_items */
export type Pinned_Items_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Pinned_Items_Prepend_Input = {
  spec?: InputMaybe<Scalars["jsonb"]["input"]>;
  spec_config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "pinned_items" */
export enum Pinned_Items_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DashboardId = "dashboard_id",
  /** column name */
  ExplorationId = "exploration_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Spec = "spec",
  /** column name */
  SpecConfig = "spec_config",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "pinned_items" */
export type Pinned_Items_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dashboard_id?: InputMaybe<Scalars["uuid"]["input"]>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  spec?: InputMaybe<Scalars["jsonb"]["input"]>;
  spec_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "pinned_items" */
export type Pinned_Items_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Pinned_Items_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Pinned_Items_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dashboard_id?: InputMaybe<Scalars["uuid"]["input"]>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  spec?: InputMaybe<Scalars["jsonb"]["input"]>;
  spec_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "pinned_items" */
export enum Pinned_Items_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DashboardId = "dashboard_id",
  /** column name */
  ExplorationId = "exploration_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Spec = "spec",
  /** column name */
  SpecConfig = "spec_config",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Pinned_Items_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Pinned_Items_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Pinned_Items_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Pinned_Items_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Pinned_Items_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Pinned_Items_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Pinned_Items_Set_Input>;
  /** filter the rows which have to be updated */
  where: Pinned_Items_Bool_Exp;
};

export type Query_Root = {
  __typename?: "query_root";
  /** An array relationship */
  access_lists: Array<Access_Lists>;
  /** An aggregate relationship */
  access_lists_aggregate: Access_Lists_Aggregate;
  /** fetch data from the table: "access_lists" using primary key columns */
  access_lists_by_pk?: Maybe<Access_Lists>;
  /** An array relationship */
  alerts: Array<Alerts>;
  /** An aggregate relationship */
  alerts_aggregate: Alerts_Aggregate;
  /** fetch data from the table: "alerts" using primary key columns */
  alerts_by_pk?: Maybe<Alerts>;
  /** fetch data from the table: "auth.account_providers" */
  auth_account_providers: Array<Auth_Account_Providers>;
  /** fetch aggregated fields from the table: "auth.account_providers" */
  auth_account_providers_aggregate: Auth_Account_Providers_Aggregate;
  /** fetch data from the table: "auth.account_providers" using primary key columns */
  auth_account_providers_by_pk?: Maybe<Auth_Account_Providers>;
  /** fetch data from the table: "auth.account_roles" */
  auth_account_roles: Array<Auth_Account_Roles>;
  /** fetch aggregated fields from the table: "auth.account_roles" */
  auth_account_roles_aggregate: Auth_Account_Roles_Aggregate;
  /** fetch data from the table: "auth.account_roles" using primary key columns */
  auth_account_roles_by_pk?: Maybe<Auth_Account_Roles>;
  /** fetch data from the table: "auth.accounts" */
  auth_accounts: Array<Auth_Accounts>;
  /** fetch aggregated fields from the table: "auth.accounts" */
  auth_accounts_aggregate: Auth_Accounts_Aggregate;
  /** fetch data from the table: "auth.accounts" using primary key columns */
  auth_accounts_by_pk?: Maybe<Auth_Accounts>;
  /** fetch data from the table: "auth.providers" */
  auth_providers: Array<Auth_Providers>;
  /** fetch aggregated fields from the table: "auth.providers" */
  auth_providers_aggregate: Auth_Providers_Aggregate;
  /** fetch data from the table: "auth.providers" using primary key columns */
  auth_providers_by_pk?: Maybe<Auth_Providers>;
  /** fetch data from the table: "auth.refresh_tokens" */
  auth_refresh_tokens: Array<Auth_Refresh_Tokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  auth_refresh_tokens_aggregate: Auth_Refresh_Tokens_Aggregate;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  auth_refresh_tokens_by_pk?: Maybe<Auth_Refresh_Tokens>;
  /** fetch data from the table: "auth.roles" */
  auth_roles: Array<Auth_Roles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  auth_roles_aggregate: Auth_Roles_Aggregate;
  /** fetch data from the table: "auth.roles" using primary key columns */
  auth_roles_by_pk?: Maybe<Auth_Roles>;
  /** fetch data from the table: "branch_statuses" */
  branch_statuses: Array<Branch_Statuses>;
  /** fetch aggregated fields from the table: "branch_statuses" */
  branch_statuses_aggregate: Branch_Statuses_Aggregate;
  /** fetch data from the table: "branch_statuses" using primary key columns */
  branch_statuses_by_pk?: Maybe<Branch_Statuses>;
  /** An array relationship */
  branches: Array<Branches>;
  /** An aggregate relationship */
  branches_aggregate: Branches_Aggregate;
  /** fetch data from the table: "branches" using primary key columns */
  branches_by_pk?: Maybe<Branches>;
  create_events?: Maybe<Create_Events>;
  /** An array relationship */
  dashboards: Array<Dashboards>;
  /** An aggregate relationship */
  dashboards_aggregate: Dashboards_Aggregate;
  /** fetch data from the table: "dashboards" using primary key columns */
  dashboards_by_pk?: Maybe<Dashboards>;
  /** An array relationship */
  dataschemas: Array<Dataschemas>;
  /** An aggregate relationship */
  dataschemas_aggregate: Dataschemas_Aggregate;
  /** fetch data from the table: "dataschemas" using primary key columns */
  dataschemas_by_pk?: Maybe<Dataschemas>;
  /** An array relationship */
  datasources: Array<Datasources>;
  /** An aggregate relationship */
  datasources_aggregate: Datasources_Aggregate;
  /** fetch data from the table: "datasources" using primary key columns */
  datasources_by_pk?: Maybe<Datasources>;
  /** fetch data from the table: "events" */
  events: Array<Events>;
  /** fetch aggregated fields from the table: "events" */
  events_aggregate: Events_Aggregate;
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>;
  /** An array relationship */
  explorations: Array<Explorations>;
  /** An aggregate relationship */
  explorations_aggregate: Explorations_Aggregate;
  /** fetch data from the table: "explorations" using primary key columns */
  explorations_by_pk?: Maybe<Explorations>;
  fetch_dataset?: Maybe<FetchDatasetOutput>;
  fetch_meta?: Maybe<SourceMetaOutput>;
  fetch_tables?: Maybe<SourceTablesOutput>;
  /** An array relationship */
  member_roles: Array<Member_Roles>;
  /** An aggregate relationship */
  member_roles_aggregate: Member_Roles_Aggregate;
  /** fetch data from the table: "member_roles" using primary key columns */
  member_roles_by_pk?: Maybe<Member_Roles>;
  /** An array relationship */
  members: Array<Members>;
  /** An aggregate relationship */
  members_aggregate: Members_Aggregate;
  /** fetch data from the table: "members" using primary key columns */
  members_by_pk?: Maybe<Members>;
  /** An array relationship */
  pinned_items: Array<Pinned_Items>;
  /** An aggregate relationship */
  pinned_items_aggregate: Pinned_Items_Aggregate;
  /** fetch data from the table: "pinned_items" using primary key columns */
  pinned_items_by_pk?: Maybe<Pinned_Items>;
  pre_aggregation_preview?: Maybe<PreAggregationPreviewOutput>;
  pre_aggregations?: Maybe<PreAggregationsOutput>;
  /** An array relationship */
  reports: Array<Reports>;
  /** An aggregate relationship */
  reports_aggregate: Reports_Aggregate;
  /** fetch data from the table: "reports" using primary key columns */
  reports_by_pk?: Maybe<Reports>;
  /** An array relationship */
  request_event_logs: Array<Request_Event_Logs>;
  /** An aggregate relationship */
  request_event_logs_aggregate: Request_Event_Logs_Aggregate;
  /** fetch data from the table: "request_event_logs" using primary key columns */
  request_event_logs_by_pk?: Maybe<Request_Event_Logs>;
  /** An array relationship */
  request_logs: Array<Request_Logs>;
  /** An aggregate relationship */
  request_logs_aggregate: Request_Logs_Aggregate;
  /** fetch data from the table: "request_logs" using primary key columns */
  request_logs_by_pk?: Maybe<Request_Logs>;
  /** An array relationship */
  sql_credentials: Array<Sql_Credentials>;
  /** An aggregate relationship */
  sql_credentials_aggregate: Sql_Credentials_Aggregate;
  /** fetch data from the table: "sql_credentials" using primary key columns */
  sql_credentials_by_pk?: Maybe<Sql_Credentials>;
  /** fetch data from the table: "team_roles" */
  team_roles: Array<Team_Roles>;
  /** fetch aggregated fields from the table: "team_roles" */
  team_roles_aggregate: Team_Roles_Aggregate;
  /** fetch data from the table: "team_roles" using primary key columns */
  team_roles_by_pk?: Maybe<Team_Roles>;
  /** An array relationship */
  teams: Array<Teams>;
  /** An aggregate relationship */
  teams_aggregate: Teams_Aggregate;
  /** fetch data from the table: "teams" using primary key columns */
  teams_by_pk?: Maybe<Teams>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** An array relationship */
  versions: Array<Versions>;
  /** An aggregate relationship */
  versions_aggregate: Versions_Aggregate;
  /** fetch data from the table: "versions" using primary key columns */
  versions_by_pk?: Maybe<Versions>;
};

export type Query_RootAccess_ListsArgs = {
  distinct_on?: InputMaybe<Array<Access_Lists_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By>>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

export type Query_RootAccess_Lists_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Access_Lists_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By>>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

export type Query_RootAccess_Lists_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAlertsArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

export type Query_RootAlerts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

export type Query_RootAlerts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAuth_Account_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

export type Query_RootAuth_Account_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

export type Query_RootAuth_Account_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAuth_Account_RolesArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

export type Query_RootAuth_Account_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

export type Query_RootAuth_Account_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAuth_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Accounts_Order_By>>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

export type Query_RootAuth_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Accounts_Order_By>>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

export type Query_RootAuth_Accounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootAuth_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Auth_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Providers_Order_By>>;
  where?: InputMaybe<Auth_Providers_Bool_Exp>;
};

export type Query_RootAuth_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Providers_Order_By>>;
  where?: InputMaybe<Auth_Providers_Bool_Exp>;
};

export type Query_RootAuth_Providers_By_PkArgs = {
  provider: Scalars["String"]["input"];
};

export type Query_RootAuth_Refresh_TokensArgs = {
  distinct_on?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

export type Query_RootAuth_Refresh_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

export type Query_RootAuth_Refresh_Tokens_By_PkArgs = {
  refresh_token: Scalars["uuid"]["input"];
};

export type Query_RootAuth_RolesArgs = {
  distinct_on?: InputMaybe<Array<Auth_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Roles_Order_By>>;
  where?: InputMaybe<Auth_Roles_Bool_Exp>;
};

export type Query_RootAuth_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Roles_Order_By>>;
  where?: InputMaybe<Auth_Roles_Bool_Exp>;
};

export type Query_RootAuth_Roles_By_PkArgs = {
  role: Scalars["String"]["input"];
};

export type Query_RootBranch_StatusesArgs = {
  distinct_on?: InputMaybe<Array<Branch_Statuses_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branch_Statuses_Order_By>>;
  where?: InputMaybe<Branch_Statuses_Bool_Exp>;
};

export type Query_RootBranch_Statuses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branch_Statuses_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branch_Statuses_Order_By>>;
  where?: InputMaybe<Branch_Statuses_Bool_Exp>;
};

export type Query_RootBranch_Statuses_By_PkArgs = {
  status: Scalars["String"]["input"];
};

export type Query_RootBranchesArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

export type Query_RootBranches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

export type Query_RootBranches_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootCreate_EventsArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootDashboardsArgs = {
  distinct_on?: InputMaybe<Array<Dashboards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dashboards_Order_By>>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

export type Query_RootDashboards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dashboards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dashboards_Order_By>>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

export type Query_RootDashboards_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootDataschemasArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

export type Query_RootDataschemas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

export type Query_RootDataschemas_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootDatasourcesArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

export type Query_RootDatasources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

export type Query_RootDatasources_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Query_RootEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Query_RootEvents_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootExplorationsArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

export type Query_RootExplorations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

export type Query_RootExplorations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootFetch_DatasetArgs = {
  exploration_id: Scalars["uuid"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Query_RootFetch_MetaArgs = {
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  datasource_id: Scalars["uuid"]["input"];
};

export type Query_RootFetch_TablesArgs = {
  datasource_id: Scalars["uuid"]["input"];
};

export type Query_RootMember_RolesArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

export type Query_RootMember_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

export type Query_RootMember_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootMembersArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

export type Query_RootMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

export type Query_RootMembers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPinned_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

export type Query_RootPinned_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

export type Query_RootPinned_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootPre_Aggregation_PreviewArgs = {
  datasource_id: Scalars["String"]["input"];
  pre_aggregation_id: Scalars["String"]["input"];
  table_name: Scalars["String"]["input"];
};

export type Query_RootPre_AggregationsArgs = {
  datasource_id: Scalars["String"]["input"];
};

export type Query_RootReportsArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

export type Query_RootReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

export type Query_RootReports_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootRequest_Event_LogsArgs = {
  distinct_on?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Event_Logs_Order_By>>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

export type Query_RootRequest_Event_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Event_Logs_Order_By>>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

export type Query_RootRequest_Event_Logs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootRequest_LogsArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

export type Query_RootRequest_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

export type Query_RootRequest_Logs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootSql_CredentialsArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

export type Query_RootSql_Credentials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

export type Query_RootSql_Credentials_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootTeam_RolesArgs = {
  distinct_on?: InputMaybe<Array<Team_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Team_Roles_Order_By>>;
  where?: InputMaybe<Team_Roles_Bool_Exp>;
};

export type Query_RootTeam_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Team_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Team_Roles_Order_By>>;
  where?: InputMaybe<Team_Roles_Bool_Exp>;
};

export type Query_RootTeam_Roles_By_PkArgs = {
  name: Scalars["String"]["input"];
};

export type Query_RootTeamsArgs = {
  distinct_on?: InputMaybe<Array<Teams_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Teams_Order_By>>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

export type Query_RootTeams_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Teams_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Teams_Order_By>>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

export type Query_RootTeams_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Query_RootVersionsArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

export type Query_RootVersions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

export type Query_RootVersions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

/** columns and relationships of "reports" */
export type Reports = {
  __typename?: "reports";
  created_at: Scalars["timestamptz"]["output"];
  delivery_config: Scalars["jsonb"]["output"];
  delivery_type: Scalars["String"]["output"];
  /** An object relationship */
  exploration: Explorations;
  exploration_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  name: Scalars["String"]["output"];
  schedule: Scalars["String"]["output"];
  /** An object relationship */
  team?: Maybe<Teams>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "reports" */
export type ReportsDelivery_ConfigArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "reports" */
export type Reports_Aggregate = {
  __typename?: "reports_aggregate";
  aggregate?: Maybe<Reports_Aggregate_Fields>;
  nodes: Array<Reports>;
};

export type Reports_Aggregate_Bool_Exp = {
  count?: InputMaybe<Reports_Aggregate_Bool_Exp_Count>;
};

export type Reports_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Reports_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Reports_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "reports" */
export type Reports_Aggregate_Fields = {
  __typename?: "reports_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Reports_Max_Fields>;
  min?: Maybe<Reports_Min_Fields>;
};

/** aggregate fields of "reports" */
export type Reports_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Reports_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "reports" */
export type Reports_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Reports_Max_Order_By>;
  min?: InputMaybe<Reports_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Reports_Append_Input = {
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "reports" */
export type Reports_Arr_Rel_Insert_Input = {
  data: Array<Reports_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Reports_On_Conflict>;
};

/** Boolean expression to filter rows from the table "reports". All fields are combined with a logical 'AND'. */
export type Reports_Bool_Exp = {
  _and?: InputMaybe<Array<Reports_Bool_Exp>>;
  _not?: InputMaybe<Reports_Bool_Exp>;
  _or?: InputMaybe<Array<Reports_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  delivery_config?: InputMaybe<Jsonb_Comparison_Exp>;
  delivery_type?: InputMaybe<String_Comparison_Exp>;
  exploration?: InputMaybe<Explorations_Bool_Exp>;
  exploration_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  schedule?: InputMaybe<String_Comparison_Exp>;
  team?: InputMaybe<Teams_Bool_Exp>;
  team_id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "reports" */
export enum Reports_Constraint {
  /** unique or primary key constraint on columns "id" */
  ReportsPkey = "reports_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Reports_Delete_At_Path_Input = {
  delivery_config?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Reports_Delete_Elem_Input = {
  delivery_config?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Reports_Delete_Key_Input = {
  delivery_config?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for inserting data into table "reports" */
export type Reports_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  delivery_type?: InputMaybe<Scalars["String"]["input"]>;
  exploration?: InputMaybe<Explorations_Obj_Rel_Insert_Input>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  schedule?: InputMaybe<Scalars["String"]["input"]>;
  team?: InputMaybe<Teams_Obj_Rel_Insert_Input>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Reports_Max_Fields = {
  __typename?: "reports_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  delivery_type?: Maybe<Scalars["String"]["output"]>;
  exploration_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  schedule?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "reports" */
export type Reports_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  delivery_type?: InputMaybe<Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  schedule?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Reports_Min_Fields = {
  __typename?: "reports_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  delivery_type?: Maybe<Scalars["String"]["output"]>;
  exploration_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  schedule?: Maybe<Scalars["String"]["output"]>;
  team_id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "reports" */
export type Reports_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  delivery_type?: InputMaybe<Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  schedule?: InputMaybe<Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "reports" */
export type Reports_Mutation_Response = {
  __typename?: "reports_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Reports>;
};

/** on_conflict condition type for table "reports" */
export type Reports_On_Conflict = {
  constraint: Reports_Constraint;
  update_columns?: Array<Reports_Update_Column>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** Ordering options when selecting data from "reports". */
export type Reports_Order_By = {
  created_at?: InputMaybe<Order_By>;
  delivery_config?: InputMaybe<Order_By>;
  delivery_type?: InputMaybe<Order_By>;
  exploration?: InputMaybe<Explorations_Order_By>;
  exploration_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  schedule?: InputMaybe<Order_By>;
  team?: InputMaybe<Teams_Order_By>;
  team_id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: reports */
export type Reports_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Reports_Prepend_Input = {
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "reports" */
export enum Reports_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeliveryConfig = "delivery_config",
  /** column name */
  DeliveryType = "delivery_type",
  /** column name */
  ExplorationId = "exploration_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Schedule = "schedule",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "reports" */
export type Reports_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  delivery_type?: InputMaybe<Scalars["String"]["input"]>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  schedule?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "reports" */
export type Reports_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Reports_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Reports_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  delivery_config?: InputMaybe<Scalars["jsonb"]["input"]>;
  delivery_type?: InputMaybe<Scalars["String"]["input"]>;
  exploration_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  schedule?: InputMaybe<Scalars["String"]["input"]>;
  team_id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "reports" */
export enum Reports_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DeliveryConfig = "delivery_config",
  /** column name */
  DeliveryType = "delivery_type",
  /** column name */
  ExplorationId = "exploration_id",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  Schedule = "schedule",
  /** column name */
  TeamId = "team_id",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Reports_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Reports_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Reports_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Reports_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Reports_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Reports_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Reports_Set_Input>;
  /** filter the rows which have to be updated */
  where: Reports_Bool_Exp;
};

/** columns and relationships of "request_event_logs" */
export type Request_Event_Logs = {
  __typename?: "request_event_logs";
  created_at: Scalars["timestamptz"]["output"];
  duration?: Maybe<Scalars["numeric"]["output"]>;
  error?: Maybe<Scalars["String"]["output"]>;
  event: Scalars["String"]["output"];
  id: Scalars["uuid"]["output"];
  path?: Maybe<Scalars["String"]["output"]>;
  query?: Maybe<Scalars["jsonb"]["output"]>;
  query_key?: Maybe<Scalars["jsonb"]["output"]>;
  query_key_md5?: Maybe<Scalars["String"]["output"]>;
  query_sql?: Maybe<Scalars["String"]["output"]>;
  queue_prefix?: Maybe<Scalars["String"]["output"]>;
  request_id: Scalars["String"]["output"];
  /** An object relationship */
  request_log: Request_Logs;
  time_in_queue?: Maybe<Scalars["numeric"]["output"]>;
  timestamp?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_at: Scalars["timestamptz"]["output"];
};

/** columns and relationships of "request_event_logs" */
export type Request_Event_LogsQueryArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** columns and relationships of "request_event_logs" */
export type Request_Event_LogsQuery_KeyArgs = {
  path?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregated selection of "request_event_logs" */
export type Request_Event_Logs_Aggregate = {
  __typename?: "request_event_logs_aggregate";
  aggregate?: Maybe<Request_Event_Logs_Aggregate_Fields>;
  nodes: Array<Request_Event_Logs>;
};

export type Request_Event_Logs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Request_Event_Logs_Aggregate_Bool_Exp_Count>;
};

export type Request_Event_Logs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Request_Event_Logs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "request_event_logs" */
export type Request_Event_Logs_Aggregate_Fields = {
  __typename?: "request_event_logs_aggregate_fields";
  avg?: Maybe<Request_Event_Logs_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Request_Event_Logs_Max_Fields>;
  min?: Maybe<Request_Event_Logs_Min_Fields>;
  stddev?: Maybe<Request_Event_Logs_Stddev_Fields>;
  stddev_pop?: Maybe<Request_Event_Logs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Request_Event_Logs_Stddev_Samp_Fields>;
  sum?: Maybe<Request_Event_Logs_Sum_Fields>;
  var_pop?: Maybe<Request_Event_Logs_Var_Pop_Fields>;
  var_samp?: Maybe<Request_Event_Logs_Var_Samp_Fields>;
  variance?: Maybe<Request_Event_Logs_Variance_Fields>;
};

/** aggregate fields of "request_event_logs" */
export type Request_Event_Logs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "request_event_logs" */
export type Request_Event_Logs_Aggregate_Order_By = {
  avg?: InputMaybe<Request_Event_Logs_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Request_Event_Logs_Max_Order_By>;
  min?: InputMaybe<Request_Event_Logs_Min_Order_By>;
  stddev?: InputMaybe<Request_Event_Logs_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Request_Event_Logs_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Request_Event_Logs_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Request_Event_Logs_Sum_Order_By>;
  var_pop?: InputMaybe<Request_Event_Logs_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Request_Event_Logs_Var_Samp_Order_By>;
  variance?: InputMaybe<Request_Event_Logs_Variance_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Request_Event_Logs_Append_Input = {
  query?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** input type for inserting array relation for remote table "request_event_logs" */
export type Request_Event_Logs_Arr_Rel_Insert_Input = {
  data: Array<Request_Event_Logs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Request_Event_Logs_On_Conflict>;
};

/** aggregate avg on columns */
export type Request_Event_Logs_Avg_Fields = {
  __typename?: "request_event_logs_avg_fields";
  duration?: Maybe<Scalars["Float"]["output"]>;
  time_in_queue?: Maybe<Scalars["Float"]["output"]>;
};

/** order by avg() on columns of table "request_event_logs" */
export type Request_Event_Logs_Avg_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "request_event_logs". All fields are combined with a logical 'AND'. */
export type Request_Event_Logs_Bool_Exp = {
  _and?: InputMaybe<Array<Request_Event_Logs_Bool_Exp>>;
  _not?: InputMaybe<Request_Event_Logs_Bool_Exp>;
  _or?: InputMaybe<Array<Request_Event_Logs_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  duration?: InputMaybe<Numeric_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  event?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  path?: InputMaybe<String_Comparison_Exp>;
  query?: InputMaybe<Jsonb_Comparison_Exp>;
  query_key?: InputMaybe<Jsonb_Comparison_Exp>;
  query_key_md5?: InputMaybe<String_Comparison_Exp>;
  query_sql?: InputMaybe<String_Comparison_Exp>;
  queue_prefix?: InputMaybe<String_Comparison_Exp>;
  request_id?: InputMaybe<String_Comparison_Exp>;
  request_log?: InputMaybe<Request_Logs_Bool_Exp>;
  time_in_queue?: InputMaybe<Numeric_Comparison_Exp>;
  timestamp?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "request_event_logs" */
export enum Request_Event_Logs_Constraint {
  /** unique or primary key constraint on columns "id" */
  RequestEventLogsPkey = "request_event_logs_pkey",
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Request_Event_Logs_Delete_At_Path_Input = {
  query?: InputMaybe<Array<Scalars["String"]["input"]>>;
  query_key?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Request_Event_Logs_Delete_Elem_Input = {
  query?: InputMaybe<Scalars["Int"]["input"]>;
  query_key?: InputMaybe<Scalars["Int"]["input"]>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Request_Event_Logs_Delete_Key_Input = {
  query?: InputMaybe<Scalars["String"]["input"]>;
  query_key?: InputMaybe<Scalars["String"]["input"]>;
};

/** input type for incrementing numeric columns in table "request_event_logs" */
export type Request_Event_Logs_Inc_Input = {
  duration?: InputMaybe<Scalars["numeric"]["input"]>;
  time_in_queue?: InputMaybe<Scalars["numeric"]["input"]>;
};

/** input type for inserting data into table "request_event_logs" */
export type Request_Event_Logs_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  duration?: InputMaybe<Scalars["numeric"]["input"]>;
  error?: InputMaybe<Scalars["String"]["input"]>;
  event?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
  query?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key_md5?: InputMaybe<Scalars["String"]["input"]>;
  query_sql?: InputMaybe<Scalars["String"]["input"]>;
  queue_prefix?: InputMaybe<Scalars["String"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  request_log?: InputMaybe<Request_Logs_Obj_Rel_Insert_Input>;
  time_in_queue?: InputMaybe<Scalars["numeric"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate max on columns */
export type Request_Event_Logs_Max_Fields = {
  __typename?: "request_event_logs_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  duration?: Maybe<Scalars["numeric"]["output"]>;
  error?: Maybe<Scalars["String"]["output"]>;
  event?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  path?: Maybe<Scalars["String"]["output"]>;
  query_key_md5?: Maybe<Scalars["String"]["output"]>;
  query_sql?: Maybe<Scalars["String"]["output"]>;
  queue_prefix?: Maybe<Scalars["String"]["output"]>;
  request_id?: Maybe<Scalars["String"]["output"]>;
  time_in_queue?: Maybe<Scalars["numeric"]["output"]>;
  timestamp?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by max() on columns of table "request_event_logs" */
export type Request_Event_Logs_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  event?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  query_key_md5?: InputMaybe<Order_By>;
  query_sql?: InputMaybe<Order_By>;
  queue_prefix?: InputMaybe<Order_By>;
  request_id?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Request_Event_Logs_Min_Fields = {
  __typename?: "request_event_logs_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  duration?: Maybe<Scalars["numeric"]["output"]>;
  error?: Maybe<Scalars["String"]["output"]>;
  event?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  path?: Maybe<Scalars["String"]["output"]>;
  query_key_md5?: Maybe<Scalars["String"]["output"]>;
  query_sql?: Maybe<Scalars["String"]["output"]>;
  queue_prefix?: Maybe<Scalars["String"]["output"]>;
  request_id?: Maybe<Scalars["String"]["output"]>;
  time_in_queue?: Maybe<Scalars["numeric"]["output"]>;
  timestamp?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** order by min() on columns of table "request_event_logs" */
export type Request_Event_Logs_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  event?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  query_key_md5?: InputMaybe<Order_By>;
  query_sql?: InputMaybe<Order_By>;
  queue_prefix?: InputMaybe<Order_By>;
  request_id?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "request_event_logs" */
export type Request_Event_Logs_Mutation_Response = {
  __typename?: "request_event_logs_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Request_Event_Logs>;
};

/** on_conflict condition type for table "request_event_logs" */
export type Request_Event_Logs_On_Conflict = {
  constraint: Request_Event_Logs_Constraint;
  update_columns?: Array<Request_Event_Logs_Update_Column>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

/** Ordering options when selecting data from "request_event_logs". */
export type Request_Event_Logs_Order_By = {
  created_at?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  event?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  query?: InputMaybe<Order_By>;
  query_key?: InputMaybe<Order_By>;
  query_key_md5?: InputMaybe<Order_By>;
  query_sql?: InputMaybe<Order_By>;
  queue_prefix?: InputMaybe<Order_By>;
  request_id?: InputMaybe<Order_By>;
  request_log?: InputMaybe<Request_Logs_Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
  timestamp?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: request_event_logs */
export type Request_Event_Logs_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Request_Event_Logs_Prepend_Input = {
  query?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key?: InputMaybe<Scalars["jsonb"]["input"]>;
};

/** select columns of table "request_event_logs" */
export enum Request_Event_Logs_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Duration = "duration",
  /** column name */
  Error = "error",
  /** column name */
  Event = "event",
  /** column name */
  Id = "id",
  /** column name */
  Path = "path",
  /** column name */
  Query = "query",
  /** column name */
  QueryKey = "query_key",
  /** column name */
  QueryKeyMd5 = "query_key_md5",
  /** column name */
  QuerySql = "query_sql",
  /** column name */
  QueuePrefix = "queue_prefix",
  /** column name */
  RequestId = "request_id",
  /** column name */
  TimeInQueue = "time_in_queue",
  /** column name */
  Timestamp = "timestamp",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "request_event_logs" */
export type Request_Event_Logs_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  duration?: InputMaybe<Scalars["numeric"]["input"]>;
  error?: InputMaybe<Scalars["String"]["input"]>;
  event?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
  query?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key_md5?: InputMaybe<Scalars["String"]["input"]>;
  query_sql?: InputMaybe<Scalars["String"]["input"]>;
  queue_prefix?: InputMaybe<Scalars["String"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  time_in_queue?: InputMaybe<Scalars["numeric"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate stddev on columns */
export type Request_Event_Logs_Stddev_Fields = {
  __typename?: "request_event_logs_stddev_fields";
  duration?: Maybe<Scalars["Float"]["output"]>;
  time_in_queue?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev() on columns of table "request_event_logs" */
export type Request_Event_Logs_Stddev_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Request_Event_Logs_Stddev_Pop_Fields = {
  __typename?: "request_event_logs_stddev_pop_fields";
  duration?: Maybe<Scalars["Float"]["output"]>;
  time_in_queue?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_pop() on columns of table "request_event_logs" */
export type Request_Event_Logs_Stddev_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Request_Event_Logs_Stddev_Samp_Fields = {
  __typename?: "request_event_logs_stddev_samp_fields";
  duration?: Maybe<Scalars["Float"]["output"]>;
  time_in_queue?: Maybe<Scalars["Float"]["output"]>;
};

/** order by stddev_samp() on columns of table "request_event_logs" */
export type Request_Event_Logs_Stddev_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "request_event_logs" */
export type Request_Event_Logs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Request_Event_Logs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Request_Event_Logs_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  duration?: InputMaybe<Scalars["numeric"]["input"]>;
  error?: InputMaybe<Scalars["String"]["input"]>;
  event?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
  query?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key?: InputMaybe<Scalars["jsonb"]["input"]>;
  query_key_md5?: InputMaybe<Scalars["String"]["input"]>;
  query_sql?: InputMaybe<Scalars["String"]["input"]>;
  queue_prefix?: InputMaybe<Scalars["String"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  time_in_queue?: InputMaybe<Scalars["numeric"]["input"]>;
  timestamp?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** aggregate sum on columns */
export type Request_Event_Logs_Sum_Fields = {
  __typename?: "request_event_logs_sum_fields";
  duration?: Maybe<Scalars["numeric"]["output"]>;
  time_in_queue?: Maybe<Scalars["numeric"]["output"]>;
};

/** order by sum() on columns of table "request_event_logs" */
export type Request_Event_Logs_Sum_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** update columns of table "request_event_logs" */
export enum Request_Event_Logs_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Duration = "duration",
  /** column name */
  Error = "error",
  /** column name */
  Event = "event",
  /** column name */
  Id = "id",
  /** column name */
  Path = "path",
  /** column name */
  Query = "query",
  /** column name */
  QueryKey = "query_key",
  /** column name */
  QueryKeyMd5 = "query_key_md5",
  /** column name */
  QuerySql = "query_sql",
  /** column name */
  QueuePrefix = "queue_prefix",
  /** column name */
  RequestId = "request_id",
  /** column name */
  TimeInQueue = "time_in_queue",
  /** column name */
  Timestamp = "timestamp",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Request_Event_Logs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Request_Event_Logs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Request_Event_Logs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Request_Event_Logs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Request_Event_Logs_Delete_Key_Input>;
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Request_Event_Logs_Inc_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Request_Event_Logs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Request_Event_Logs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Request_Event_Logs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Request_Event_Logs_Var_Pop_Fields = {
  __typename?: "request_event_logs_var_pop_fields";
  duration?: Maybe<Scalars["Float"]["output"]>;
  time_in_queue?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_pop() on columns of table "request_event_logs" */
export type Request_Event_Logs_Var_Pop_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Request_Event_Logs_Var_Samp_Fields = {
  __typename?: "request_event_logs_var_samp_fields";
  duration?: Maybe<Scalars["Float"]["output"]>;
  time_in_queue?: Maybe<Scalars["Float"]["output"]>;
};

/** order by var_samp() on columns of table "request_event_logs" */
export type Request_Event_Logs_Var_Samp_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Request_Event_Logs_Variance_Fields = {
  __typename?: "request_event_logs_variance_fields";
  duration?: Maybe<Scalars["Float"]["output"]>;
  time_in_queue?: Maybe<Scalars["Float"]["output"]>;
};

/** order by variance() on columns of table "request_event_logs" */
export type Request_Event_Logs_Variance_Order_By = {
  duration?: InputMaybe<Order_By>;
  time_in_queue?: InputMaybe<Order_By>;
};

/** columns and relationships of "request_logs" */
export type Request_Logs = {
  __typename?: "request_logs";
  created_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  datasource: Datasources;
  datasource_id: Scalars["uuid"]["output"];
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
  end_time: Scalars["timestamptz"]["output"];
  id: Scalars["uuid"]["output"];
  path?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  request_event_logs: Array<Request_Event_Logs>;
  /** An aggregate relationship */
  request_event_logs_aggregate: Request_Event_Logs_Aggregate;
  request_id: Scalars["String"]["output"];
  start_time: Scalars["timestamptz"]["output"];
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "request_logs" */
export type Request_LogsRequest_Event_LogsArgs = {
  distinct_on?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Event_Logs_Order_By>>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

/** columns and relationships of "request_logs" */
export type Request_LogsRequest_Event_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Event_Logs_Order_By>>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

/** aggregated selection of "request_logs" */
export type Request_Logs_Aggregate = {
  __typename?: "request_logs_aggregate";
  aggregate?: Maybe<Request_Logs_Aggregate_Fields>;
  nodes: Array<Request_Logs>;
};

export type Request_Logs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Request_Logs_Aggregate_Bool_Exp_Count>;
};

export type Request_Logs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Request_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Request_Logs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "request_logs" */
export type Request_Logs_Aggregate_Fields = {
  __typename?: "request_logs_aggregate_fields";
  avg?: Maybe<Request_Logs_Avg_Fields>;
  count: Scalars["Int"]["output"];
  max?: Maybe<Request_Logs_Max_Fields>;
  min?: Maybe<Request_Logs_Min_Fields>;
  stddev?: Maybe<Request_Logs_Stddev_Fields>;
  stddev_pop?: Maybe<Request_Logs_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Request_Logs_Stddev_Samp_Fields>;
  sum?: Maybe<Request_Logs_Sum_Fields>;
  var_pop?: Maybe<Request_Logs_Var_Pop_Fields>;
  var_samp?: Maybe<Request_Logs_Var_Samp_Fields>;
  variance?: Maybe<Request_Logs_Variance_Fields>;
};

/** aggregate fields of "request_logs" */
export type Request_Logs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Request_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "request_logs" */
export type Request_Logs_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Request_Logs_Max_Order_By>;
  min?: InputMaybe<Request_Logs_Min_Order_By>;
};

/** input type for inserting array relation for remote table "request_logs" */
export type Request_Logs_Arr_Rel_Insert_Input = {
  data: Array<Request_Logs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Request_Logs_On_Conflict>;
};

/** aggregate avg on columns */
export type Request_Logs_Avg_Fields = {
  __typename?: "request_logs_avg_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** Boolean expression to filter rows from the table "request_logs". All fields are combined with a logical 'AND'. */
export type Request_Logs_Bool_Exp = {
  _and?: InputMaybe<Array<Request_Logs_Bool_Exp>>;
  _not?: InputMaybe<Request_Logs_Bool_Exp>;
  _or?: InputMaybe<Array<Request_Logs_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  datasource?: InputMaybe<Datasources_Bool_Exp>;
  datasource_id?: InputMaybe<Uuid_Comparison_Exp>;
  duration?: InputMaybe<Float8_Comparison_Exp>;
  end_time?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  path?: InputMaybe<String_Comparison_Exp>;
  request_event_logs?: InputMaybe<Request_Event_Logs_Bool_Exp>;
  request_event_logs_aggregate?: InputMaybe<Request_Event_Logs_Aggregate_Bool_Exp>;
  request_id?: InputMaybe<String_Comparison_Exp>;
  start_time?: InputMaybe<Timestamptz_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "request_logs" */
export enum Request_Logs_Constraint {
  /** unique or primary key constraint on columns "id" */
  RequestLogsPkey = "request_logs_pkey",
  /** unique or primary key constraint on columns "request_id" */
  RequestLogsRequestIdKey = "request_logs_request_id_key",
}

/** input type for inserting data into table "request_logs" */
export type Request_Logs_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource?: InputMaybe<Datasources_Obj_Rel_Insert_Input>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  end_time?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
  request_event_logs?: InputMaybe<Request_Event_Logs_Arr_Rel_Insert_Input>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  start_time?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Request_Logs_Max_Fields = {
  __typename?: "request_logs_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
  end_time?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  path?: Maybe<Scalars["String"]["output"]>;
  request_id?: Maybe<Scalars["String"]["output"]>;
  start_time?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "request_logs" */
export type Request_Logs_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  end_time?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  request_id?: InputMaybe<Order_By>;
  start_time?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Request_Logs_Min_Fields = {
  __typename?: "request_logs_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
  end_time?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  path?: Maybe<Scalars["String"]["output"]>;
  request_id?: Maybe<Scalars["String"]["output"]>;
  start_time?: Maybe<Scalars["timestamptz"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "request_logs" */
export type Request_Logs_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  end_time?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  request_id?: InputMaybe<Order_By>;
  start_time?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "request_logs" */
export type Request_Logs_Mutation_Response = {
  __typename?: "request_logs_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Request_Logs>;
};

/** input type for inserting object relation for remote table "request_logs" */
export type Request_Logs_Obj_Rel_Insert_Input = {
  data: Request_Logs_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Request_Logs_On_Conflict>;
};

/** on_conflict condition type for table "request_logs" */
export type Request_Logs_On_Conflict = {
  constraint: Request_Logs_Constraint;
  update_columns?: Array<Request_Logs_Update_Column>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

/** Ordering options when selecting data from "request_logs". */
export type Request_Logs_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource?: InputMaybe<Datasources_Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  duration?: InputMaybe<Order_By>;
  end_time?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  path?: InputMaybe<Order_By>;
  request_event_logs_aggregate?: InputMaybe<Request_Event_Logs_Aggregate_Order_By>;
  request_id?: InputMaybe<Order_By>;
  start_time?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: request_logs */
export type Request_Logs_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "request_logs" */
export enum Request_Logs_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  EndTime = "end_time",
  /** column name */
  Id = "id",
  /** column name */
  Path = "path",
  /** column name */
  RequestId = "request_id",
  /** column name */
  StartTime = "start_time",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "request_logs" */
export type Request_Logs_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  end_time?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  start_time?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate stddev on columns */
export type Request_Logs_Stddev_Fields = {
  __typename?: "request_logs_stddev_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** aggregate stddev_pop on columns */
export type Request_Logs_Stddev_Pop_Fields = {
  __typename?: "request_logs_stddev_pop_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** aggregate stddev_samp on columns */
export type Request_Logs_Stddev_Samp_Fields = {
  __typename?: "request_logs_stddev_samp_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** Streaming cursor of the table "request_logs" */
export type Request_Logs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Request_Logs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Request_Logs_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  end_time?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  path?: InputMaybe<Scalars["String"]["input"]>;
  request_id?: InputMaybe<Scalars["String"]["input"]>;
  start_time?: InputMaybe<Scalars["timestamptz"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate sum on columns */
export type Request_Logs_Sum_Fields = {
  __typename?: "request_logs_sum_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** update columns of table "request_logs" */
export enum Request_Logs_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  EndTime = "end_time",
  /** column name */
  Id = "id",
  /** column name */
  Path = "path",
  /** column name */
  RequestId = "request_id",
  /** column name */
  StartTime = "start_time",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Request_Logs_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Request_Logs_Set_Input>;
  /** filter the rows which have to be updated */
  where: Request_Logs_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Request_Logs_Var_Pop_Fields = {
  __typename?: "request_logs_var_pop_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** aggregate var_samp on columns */
export type Request_Logs_Var_Samp_Fields = {
  __typename?: "request_logs_var_samp_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** aggregate variance on columns */
export type Request_Logs_Variance_Fields = {
  __typename?: "request_logs_variance_fields";
  /** A computed field, executes function "duration" */
  duration?: Maybe<Scalars["float8"]["output"]>;
};

/** columns and relationships of "sql_credentials" */
export type Sql_Credentials = {
  __typename?: "sql_credentials";
  created_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  datasource: Datasources;
  datasource_id: Scalars["uuid"]["output"];
  id: Scalars["uuid"]["output"];
  password?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
  username: Scalars["String"]["output"];
};

/** aggregated selection of "sql_credentials" */
export type Sql_Credentials_Aggregate = {
  __typename?: "sql_credentials_aggregate";
  aggregate?: Maybe<Sql_Credentials_Aggregate_Fields>;
  nodes: Array<Sql_Credentials>;
};

export type Sql_Credentials_Aggregate_Bool_Exp = {
  count?: InputMaybe<Sql_Credentials_Aggregate_Bool_Exp_Count>;
};

export type Sql_Credentials_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Sql_Credentials_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "sql_credentials" */
export type Sql_Credentials_Aggregate_Fields = {
  __typename?: "sql_credentials_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Sql_Credentials_Max_Fields>;
  min?: Maybe<Sql_Credentials_Min_Fields>;
};

/** aggregate fields of "sql_credentials" */
export type Sql_Credentials_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "sql_credentials" */
export type Sql_Credentials_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Sql_Credentials_Max_Order_By>;
  min?: InputMaybe<Sql_Credentials_Min_Order_By>;
};

/** input type for inserting array relation for remote table "sql_credentials" */
export type Sql_Credentials_Arr_Rel_Insert_Input = {
  data: Array<Sql_Credentials_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Sql_Credentials_On_Conflict>;
};

/** Boolean expression to filter rows from the table "sql_credentials". All fields are combined with a logical 'AND'. */
export type Sql_Credentials_Bool_Exp = {
  _and?: InputMaybe<Array<Sql_Credentials_Bool_Exp>>;
  _not?: InputMaybe<Sql_Credentials_Bool_Exp>;
  _or?: InputMaybe<Array<Sql_Credentials_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  datasource?: InputMaybe<Datasources_Bool_Exp>;
  datasource_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  password?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  username?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "sql_credentials" */
export enum Sql_Credentials_Constraint {
  /** unique or primary key constraint on columns "user_id", "username", "datasource_id" */
  SqlCredentialsDatasourceIdUserIdUsernameKey = "sql_credentials_datasource_id_user_id_username_key",
  /** unique or primary key constraint on columns "id" */
  SqlCredentialsPkey = "sql_credentials_pkey",
  /** unique or primary key constraint on columns "username" */
  SqlCredentialsUsernameKey = "sql_credentials_username_key",
}

/** input type for inserting data into table "sql_credentials" */
export type Sql_Credentials_Insert_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource?: InputMaybe<Datasources_Obj_Rel_Insert_Input>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Sql_Credentials_Max_Fields = {
  __typename?: "sql_credentials_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  password?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  username?: Maybe<Scalars["String"]["output"]>;
};

/** order by max() on columns of table "sql_credentials" */
export type Sql_Credentials_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  username?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Sql_Credentials_Min_Fields = {
  __typename?: "sql_credentials_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  datasource_id?: Maybe<Scalars["uuid"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  password?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
  username?: Maybe<Scalars["String"]["output"]>;
};

/** order by min() on columns of table "sql_credentials" */
export type Sql_Credentials_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  username?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "sql_credentials" */
export type Sql_Credentials_Mutation_Response = {
  __typename?: "sql_credentials_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Sql_Credentials>;
};

/** on_conflict condition type for table "sql_credentials" */
export type Sql_Credentials_On_Conflict = {
  constraint: Sql_Credentials_Constraint;
  update_columns?: Array<Sql_Credentials_Update_Column>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

/** Ordering options when selecting data from "sql_credentials". */
export type Sql_Credentials_Order_By = {
  created_at?: InputMaybe<Order_By>;
  datasource?: InputMaybe<Datasources_Order_By>;
  datasource_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  password?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  username?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sql_credentials */
export type Sql_Credentials_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "sql_credentials" */
export enum Sql_Credentials_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  Password = "password",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  Username = "username",
}

/** input type for updating data in table "sql_credentials" */
export type Sql_Credentials_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "sql_credentials" */
export type Sql_Credentials_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sql_Credentials_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sql_Credentials_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  datasource_id?: InputMaybe<Scalars["uuid"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  password?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
  username?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "sql_credentials" */
export enum Sql_Credentials_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DatasourceId = "datasource_id",
  /** column name */
  Id = "id",
  /** column name */
  Password = "password",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
  /** column name */
  Username = "username",
}

export type Sql_Credentials_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sql_Credentials_Set_Input>;
  /** filter the rows which have to be updated */
  where: Sql_Credentials_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: "subscription_root";
  /** An array relationship */
  access_lists: Array<Access_Lists>;
  /** An aggregate relationship */
  access_lists_aggregate: Access_Lists_Aggregate;
  /** fetch data from the table: "access_lists" using primary key columns */
  access_lists_by_pk?: Maybe<Access_Lists>;
  /** fetch data from the table in a streaming manner: "access_lists" */
  access_lists_stream: Array<Access_Lists>;
  /** An array relationship */
  alerts: Array<Alerts>;
  /** An aggregate relationship */
  alerts_aggregate: Alerts_Aggregate;
  /** fetch data from the table: "alerts" using primary key columns */
  alerts_by_pk?: Maybe<Alerts>;
  /** fetch data from the table in a streaming manner: "alerts" */
  alerts_stream: Array<Alerts>;
  /** fetch data from the table: "auth.account_providers" */
  auth_account_providers: Array<Auth_Account_Providers>;
  /** fetch aggregated fields from the table: "auth.account_providers" */
  auth_account_providers_aggregate: Auth_Account_Providers_Aggregate;
  /** fetch data from the table: "auth.account_providers" using primary key columns */
  auth_account_providers_by_pk?: Maybe<Auth_Account_Providers>;
  /** fetch data from the table in a streaming manner: "auth.account_providers" */
  auth_account_providers_stream: Array<Auth_Account_Providers>;
  /** fetch data from the table: "auth.account_roles" */
  auth_account_roles: Array<Auth_Account_Roles>;
  /** fetch aggregated fields from the table: "auth.account_roles" */
  auth_account_roles_aggregate: Auth_Account_Roles_Aggregate;
  /** fetch data from the table: "auth.account_roles" using primary key columns */
  auth_account_roles_by_pk?: Maybe<Auth_Account_Roles>;
  /** fetch data from the table in a streaming manner: "auth.account_roles" */
  auth_account_roles_stream: Array<Auth_Account_Roles>;
  /** fetch data from the table: "auth.accounts" */
  auth_accounts: Array<Auth_Accounts>;
  /** fetch aggregated fields from the table: "auth.accounts" */
  auth_accounts_aggregate: Auth_Accounts_Aggregate;
  /** fetch data from the table: "auth.accounts" using primary key columns */
  auth_accounts_by_pk?: Maybe<Auth_Accounts>;
  /** fetch data from the table in a streaming manner: "auth.accounts" */
  auth_accounts_stream: Array<Auth_Accounts>;
  /** fetch data from the table: "auth.providers" */
  auth_providers: Array<Auth_Providers>;
  /** fetch aggregated fields from the table: "auth.providers" */
  auth_providers_aggregate: Auth_Providers_Aggregate;
  /** fetch data from the table: "auth.providers" using primary key columns */
  auth_providers_by_pk?: Maybe<Auth_Providers>;
  /** fetch data from the table in a streaming manner: "auth.providers" */
  auth_providers_stream: Array<Auth_Providers>;
  /** fetch data from the table: "auth.refresh_tokens" */
  auth_refresh_tokens: Array<Auth_Refresh_Tokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  auth_refresh_tokens_aggregate: Auth_Refresh_Tokens_Aggregate;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  auth_refresh_tokens_by_pk?: Maybe<Auth_Refresh_Tokens>;
  /** fetch data from the table in a streaming manner: "auth.refresh_tokens" */
  auth_refresh_tokens_stream: Array<Auth_Refresh_Tokens>;
  /** fetch data from the table: "auth.roles" */
  auth_roles: Array<Auth_Roles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  auth_roles_aggregate: Auth_Roles_Aggregate;
  /** fetch data from the table: "auth.roles" using primary key columns */
  auth_roles_by_pk?: Maybe<Auth_Roles>;
  /** fetch data from the table in a streaming manner: "auth.roles" */
  auth_roles_stream: Array<Auth_Roles>;
  /** fetch data from the table: "branch_statuses" */
  branch_statuses: Array<Branch_Statuses>;
  /** fetch aggregated fields from the table: "branch_statuses" */
  branch_statuses_aggregate: Branch_Statuses_Aggregate;
  /** fetch data from the table: "branch_statuses" using primary key columns */
  branch_statuses_by_pk?: Maybe<Branch_Statuses>;
  /** fetch data from the table in a streaming manner: "branch_statuses" */
  branch_statuses_stream: Array<Branch_Statuses>;
  /** An array relationship */
  branches: Array<Branches>;
  /** An aggregate relationship */
  branches_aggregate: Branches_Aggregate;
  /** fetch data from the table: "branches" using primary key columns */
  branches_by_pk?: Maybe<Branches>;
  /** fetch data from the table in a streaming manner: "branches" */
  branches_stream: Array<Branches>;
  create_events?: Maybe<Create_Events>;
  /** An array relationship */
  dashboards: Array<Dashboards>;
  /** An aggregate relationship */
  dashboards_aggregate: Dashboards_Aggregate;
  /** fetch data from the table: "dashboards" using primary key columns */
  dashboards_by_pk?: Maybe<Dashboards>;
  /** fetch data from the table in a streaming manner: "dashboards" */
  dashboards_stream: Array<Dashboards>;
  /** An array relationship */
  dataschemas: Array<Dataschemas>;
  /** An aggregate relationship */
  dataschemas_aggregate: Dataschemas_Aggregate;
  /** fetch data from the table: "dataschemas" using primary key columns */
  dataschemas_by_pk?: Maybe<Dataschemas>;
  /** fetch data from the table in a streaming manner: "dataschemas" */
  dataschemas_stream: Array<Dataschemas>;
  /** An array relationship */
  datasources: Array<Datasources>;
  /** An aggregate relationship */
  datasources_aggregate: Datasources_Aggregate;
  /** fetch data from the table: "datasources" using primary key columns */
  datasources_by_pk?: Maybe<Datasources>;
  /** fetch data from the table in a streaming manner: "datasources" */
  datasources_stream: Array<Datasources>;
  /** fetch data from the table: "events" */
  events: Array<Events>;
  /** fetch aggregated fields from the table: "events" */
  events_aggregate: Events_Aggregate;
  /** fetch data from the table: "events" using primary key columns */
  events_by_pk?: Maybe<Events>;
  /** fetch data from the table in a streaming manner: "events" */
  events_stream: Array<Events>;
  /** An array relationship */
  explorations: Array<Explorations>;
  /** An aggregate relationship */
  explorations_aggregate: Explorations_Aggregate;
  /** fetch data from the table: "explorations" using primary key columns */
  explorations_by_pk?: Maybe<Explorations>;
  /** fetch data from the table in a streaming manner: "explorations" */
  explorations_stream: Array<Explorations>;
  /** An array relationship */
  member_roles: Array<Member_Roles>;
  /** An aggregate relationship */
  member_roles_aggregate: Member_Roles_Aggregate;
  /** fetch data from the table: "member_roles" using primary key columns */
  member_roles_by_pk?: Maybe<Member_Roles>;
  /** fetch data from the table in a streaming manner: "member_roles" */
  member_roles_stream: Array<Member_Roles>;
  /** An array relationship */
  members: Array<Members>;
  /** An aggregate relationship */
  members_aggregate: Members_Aggregate;
  /** fetch data from the table: "members" using primary key columns */
  members_by_pk?: Maybe<Members>;
  /** fetch data from the table in a streaming manner: "members" */
  members_stream: Array<Members>;
  /** An array relationship */
  pinned_items: Array<Pinned_Items>;
  /** An aggregate relationship */
  pinned_items_aggregate: Pinned_Items_Aggregate;
  /** fetch data from the table: "pinned_items" using primary key columns */
  pinned_items_by_pk?: Maybe<Pinned_Items>;
  /** fetch data from the table in a streaming manner: "pinned_items" */
  pinned_items_stream: Array<Pinned_Items>;
  /** An array relationship */
  reports: Array<Reports>;
  /** An aggregate relationship */
  reports_aggregate: Reports_Aggregate;
  /** fetch data from the table: "reports" using primary key columns */
  reports_by_pk?: Maybe<Reports>;
  /** fetch data from the table in a streaming manner: "reports" */
  reports_stream: Array<Reports>;
  /** An array relationship */
  request_event_logs: Array<Request_Event_Logs>;
  /** An aggregate relationship */
  request_event_logs_aggregate: Request_Event_Logs_Aggregate;
  /** fetch data from the table: "request_event_logs" using primary key columns */
  request_event_logs_by_pk?: Maybe<Request_Event_Logs>;
  /** fetch data from the table in a streaming manner: "request_event_logs" */
  request_event_logs_stream: Array<Request_Event_Logs>;
  /** An array relationship */
  request_logs: Array<Request_Logs>;
  /** An aggregate relationship */
  request_logs_aggregate: Request_Logs_Aggregate;
  /** fetch data from the table: "request_logs" using primary key columns */
  request_logs_by_pk?: Maybe<Request_Logs>;
  /** fetch data from the table in a streaming manner: "request_logs" */
  request_logs_stream: Array<Request_Logs>;
  /** An array relationship */
  sql_credentials: Array<Sql_Credentials>;
  /** An aggregate relationship */
  sql_credentials_aggregate: Sql_Credentials_Aggregate;
  /** fetch data from the table: "sql_credentials" using primary key columns */
  sql_credentials_by_pk?: Maybe<Sql_Credentials>;
  /** fetch data from the table in a streaming manner: "sql_credentials" */
  sql_credentials_stream: Array<Sql_Credentials>;
  /** fetch data from the table: "team_roles" */
  team_roles: Array<Team_Roles>;
  /** fetch aggregated fields from the table: "team_roles" */
  team_roles_aggregate: Team_Roles_Aggregate;
  /** fetch data from the table: "team_roles" using primary key columns */
  team_roles_by_pk?: Maybe<Team_Roles>;
  /** fetch data from the table in a streaming manner: "team_roles" */
  team_roles_stream: Array<Team_Roles>;
  /** An array relationship */
  teams: Array<Teams>;
  /** An aggregate relationship */
  teams_aggregate: Teams_Aggregate;
  /** fetch data from the table: "teams" using primary key columns */
  teams_by_pk?: Maybe<Teams>;
  /** fetch data from the table in a streaming manner: "teams" */
  teams_stream: Array<Teams>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** An array relationship */
  versions: Array<Versions>;
  /** An aggregate relationship */
  versions_aggregate: Versions_Aggregate;
  /** fetch data from the table: "versions" using primary key columns */
  versions_by_pk?: Maybe<Versions>;
  /** fetch data from the table in a streaming manner: "versions" */
  versions_stream: Array<Versions>;
};

export type Subscription_RootAccess_ListsArgs = {
  distinct_on?: InputMaybe<Array<Access_Lists_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By>>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

export type Subscription_RootAccess_Lists_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Access_Lists_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By>>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

export type Subscription_RootAccess_Lists_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAccess_Lists_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Access_Lists_Stream_Cursor_Input>>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

export type Subscription_RootAlertsArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

export type Subscription_RootAlerts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

export type Subscription_RootAlerts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAlerts_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Alerts_Stream_Cursor_Input>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

export type Subscription_RootAuth_Account_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

export type Subscription_RootAuth_Account_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Providers_Order_By>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

export type Subscription_RootAuth_Account_Providers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAuth_Account_Providers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Account_Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Account_Providers_Bool_Exp>;
};

export type Subscription_RootAuth_Account_RolesArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

export type Subscription_RootAuth_Account_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Account_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Account_Roles_Order_By>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

export type Subscription_RootAuth_Account_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAuth_Account_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Account_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Account_Roles_Bool_Exp>;
};

export type Subscription_RootAuth_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Accounts_Order_By>>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

export type Subscription_RootAuth_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Accounts_Order_By>>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

export type Subscription_RootAuth_Accounts_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootAuth_Accounts_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Accounts_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Accounts_Bool_Exp>;
};

export type Subscription_RootAuth_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Auth_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Providers_Order_By>>;
  where?: InputMaybe<Auth_Providers_Bool_Exp>;
};

export type Subscription_RootAuth_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Providers_Order_By>>;
  where?: InputMaybe<Auth_Providers_Bool_Exp>;
};

export type Subscription_RootAuth_Providers_By_PkArgs = {
  provider: Scalars["String"]["input"];
};

export type Subscription_RootAuth_Providers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Providers_Bool_Exp>;
};

export type Subscription_RootAuth_Refresh_TokensArgs = {
  distinct_on?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

export type Subscription_RootAuth_Refresh_Tokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Refresh_Tokens_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Refresh_Tokens_Order_By>>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

export type Subscription_RootAuth_Refresh_Tokens_By_PkArgs = {
  refresh_token: Scalars["uuid"]["input"];
};

export type Subscription_RootAuth_Refresh_Tokens_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Refresh_Tokens_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Refresh_Tokens_Bool_Exp>;
};

export type Subscription_RootAuth_RolesArgs = {
  distinct_on?: InputMaybe<Array<Auth_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Roles_Order_By>>;
  where?: InputMaybe<Auth_Roles_Bool_Exp>;
};

export type Subscription_RootAuth_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Auth_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Auth_Roles_Order_By>>;
  where?: InputMaybe<Auth_Roles_Bool_Exp>;
};

export type Subscription_RootAuth_Roles_By_PkArgs = {
  role: Scalars["String"]["input"];
};

export type Subscription_RootAuth_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Auth_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Auth_Roles_Bool_Exp>;
};

export type Subscription_RootBranch_StatusesArgs = {
  distinct_on?: InputMaybe<Array<Branch_Statuses_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branch_Statuses_Order_By>>;
  where?: InputMaybe<Branch_Statuses_Bool_Exp>;
};

export type Subscription_RootBranch_Statuses_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branch_Statuses_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branch_Statuses_Order_By>>;
  where?: InputMaybe<Branch_Statuses_Bool_Exp>;
};

export type Subscription_RootBranch_Statuses_By_PkArgs = {
  status: Scalars["String"]["input"];
};

export type Subscription_RootBranch_Statuses_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Branch_Statuses_Stream_Cursor_Input>>;
  where?: InputMaybe<Branch_Statuses_Bool_Exp>;
};

export type Subscription_RootBranchesArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

export type Subscription_RootBranches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

export type Subscription_RootBranches_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootBranches_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Branches_Stream_Cursor_Input>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

export type Subscription_RootCreate_EventsArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootDashboardsArgs = {
  distinct_on?: InputMaybe<Array<Dashboards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dashboards_Order_By>>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

export type Subscription_RootDashboards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dashboards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dashboards_Order_By>>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

export type Subscription_RootDashboards_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootDashboards_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Dashboards_Stream_Cursor_Input>>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

export type Subscription_RootDataschemasArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

export type Subscription_RootDataschemas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

export type Subscription_RootDataschemas_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootDataschemas_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Dataschemas_Stream_Cursor_Input>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

export type Subscription_RootDatasourcesArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

export type Subscription_RootDatasources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

export type Subscription_RootDatasources_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootDatasources_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Datasources_Stream_Cursor_Input>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

export type Subscription_RootEventsArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Subscription_RootEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Events_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Events_Order_By>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Subscription_RootEvents_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootEvents_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Events_Stream_Cursor_Input>>;
  where?: InputMaybe<Events_Bool_Exp>;
};

export type Subscription_RootExplorationsArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

export type Subscription_RootExplorations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Explorations_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Explorations_Order_By>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

export type Subscription_RootExplorations_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootExplorations_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Explorations_Stream_Cursor_Input>>;
  where?: InputMaybe<Explorations_Bool_Exp>;
};

export type Subscription_RootMember_RolesArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

export type Subscription_RootMember_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

export type Subscription_RootMember_Roles_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootMember_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Member_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

export type Subscription_RootMembersArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

export type Subscription_RootMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

export type Subscription_RootMembers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootMembers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Members_Stream_Cursor_Input>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

export type Subscription_RootPinned_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

export type Subscription_RootPinned_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Pinned_Items_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Pinned_Items_Order_By>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

export type Subscription_RootPinned_Items_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootPinned_Items_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Pinned_Items_Stream_Cursor_Input>>;
  where?: InputMaybe<Pinned_Items_Bool_Exp>;
};

export type Subscription_RootReportsArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

export type Subscription_RootReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

export type Subscription_RootReports_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootReports_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Reports_Stream_Cursor_Input>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

export type Subscription_RootRequest_Event_LogsArgs = {
  distinct_on?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Event_Logs_Order_By>>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

export type Subscription_RootRequest_Event_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Event_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Event_Logs_Order_By>>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

export type Subscription_RootRequest_Event_Logs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootRequest_Event_Logs_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Request_Event_Logs_Stream_Cursor_Input>>;
  where?: InputMaybe<Request_Event_Logs_Bool_Exp>;
};

export type Subscription_RootRequest_LogsArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

export type Subscription_RootRequest_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

export type Subscription_RootRequest_Logs_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootRequest_Logs_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Request_Logs_Stream_Cursor_Input>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

export type Subscription_RootSql_CredentialsArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

export type Subscription_RootSql_Credentials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

export type Subscription_RootSql_Credentials_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootSql_Credentials_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Sql_Credentials_Stream_Cursor_Input>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

export type Subscription_RootTeam_RolesArgs = {
  distinct_on?: InputMaybe<Array<Team_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Team_Roles_Order_By>>;
  where?: InputMaybe<Team_Roles_Bool_Exp>;
};

export type Subscription_RootTeam_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Team_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Team_Roles_Order_By>>;
  where?: InputMaybe<Team_Roles_Bool_Exp>;
};

export type Subscription_RootTeam_Roles_By_PkArgs = {
  name: Scalars["String"]["input"];
};

export type Subscription_RootTeam_Roles_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Team_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Team_Roles_Bool_Exp>;
};

export type Subscription_RootTeamsArgs = {
  distinct_on?: InputMaybe<Array<Teams_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Teams_Order_By>>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

export type Subscription_RootTeams_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Teams_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Teams_Order_By>>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

export type Subscription_RootTeams_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootTeams_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Teams_Stream_Cursor_Input>>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootVersionsArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

export type Subscription_RootVersions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

export type Subscription_RootVersions_By_PkArgs = {
  id: Scalars["uuid"]["input"];
};

export type Subscription_RootVersions_StreamArgs = {
  batch_size: Scalars["Int"]["input"];
  cursor: Array<InputMaybe<Versions_Stream_Cursor_Input>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

/** columns and relationships of "team_roles" */
export type Team_Roles = {
  __typename?: "team_roles";
  /** An array relationship */
  member_roles: Array<Member_Roles>;
  /** An aggregate relationship */
  member_roles_aggregate: Member_Roles_Aggregate;
  name: Scalars["String"]["output"];
};

/** columns and relationships of "team_roles" */
export type Team_RolesMember_RolesArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

/** columns and relationships of "team_roles" */
export type Team_RolesMember_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Member_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Member_Roles_Order_By>>;
  where?: InputMaybe<Member_Roles_Bool_Exp>;
};

/** aggregated selection of "team_roles" */
export type Team_Roles_Aggregate = {
  __typename?: "team_roles_aggregate";
  aggregate?: Maybe<Team_Roles_Aggregate_Fields>;
  nodes: Array<Team_Roles>;
};

/** aggregate fields of "team_roles" */
export type Team_Roles_Aggregate_Fields = {
  __typename?: "team_roles_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Team_Roles_Max_Fields>;
  min?: Maybe<Team_Roles_Min_Fields>;
};

/** aggregate fields of "team_roles" */
export type Team_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Team_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "team_roles". All fields are combined with a logical 'AND'. */
export type Team_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Team_Roles_Bool_Exp>>;
  _not?: InputMaybe<Team_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Team_Roles_Bool_Exp>>;
  member_roles?: InputMaybe<Member_Roles_Bool_Exp>;
  member_roles_aggregate?: InputMaybe<Member_Roles_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "team_roles" */
export enum Team_Roles_Constraint {
  /** unique or primary key constraint on columns "name" */
  TeamRolesPkey = "team_roles_pkey",
}

export enum Team_Roles_Enum {
  Admin = "admin",
  Member = "member",
  Owner = "owner",
}

/** Boolean expression to compare columns of type "team_roles_enum". All fields are combined with logical 'AND'. */
export type Team_Roles_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Team_Roles_Enum>;
  _in?: InputMaybe<Array<Team_Roles_Enum>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _neq?: InputMaybe<Team_Roles_Enum>;
  _nin?: InputMaybe<Array<Team_Roles_Enum>>;
};

/** input type for inserting data into table "team_roles" */
export type Team_Roles_Insert_Input = {
  member_roles?: InputMaybe<Member_Roles_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

/** aggregate max on columns */
export type Team_Roles_Max_Fields = {
  __typename?: "team_roles_max_fields";
  name?: Maybe<Scalars["String"]["output"]>;
};

/** aggregate min on columns */
export type Team_Roles_Min_Fields = {
  __typename?: "team_roles_min_fields";
  name?: Maybe<Scalars["String"]["output"]>;
};

/** response of any mutation on the table "team_roles" */
export type Team_Roles_Mutation_Response = {
  __typename?: "team_roles_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Team_Roles>;
};

/** input type for inserting object relation for remote table "team_roles" */
export type Team_Roles_Obj_Rel_Insert_Input = {
  data: Team_Roles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Team_Roles_On_Conflict>;
};

/** on_conflict condition type for table "team_roles" */
export type Team_Roles_On_Conflict = {
  constraint: Team_Roles_Constraint;
  update_columns?: Array<Team_Roles_Update_Column>;
  where?: InputMaybe<Team_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "team_roles". */
export type Team_Roles_Order_By = {
  member_roles_aggregate?: InputMaybe<Member_Roles_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: team_roles */
export type Team_Roles_Pk_Columns_Input = {
  name: Scalars["String"]["input"];
};

/** select columns of table "team_roles" */
export enum Team_Roles_Select_Column {
  /** column name */
  Name = "name",
}

/** input type for updating data in table "team_roles" */
export type Team_Roles_Set_Input = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

/** Streaming cursor of the table "team_roles" */
export type Team_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Team_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Team_Roles_Stream_Cursor_Value_Input = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

/** update columns of table "team_roles" */
export enum Team_Roles_Update_Column {
  /** column name */
  Name = "name",
}

export type Team_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Team_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Team_Roles_Bool_Exp;
};

/** columns and relationships of "teams" */
export type Teams = {
  __typename?: "teams";
  /** An array relationship */
  access_lists: Array<Access_Lists>;
  /** An aggregate relationship */
  access_lists_aggregate: Access_Lists_Aggregate;
  /** An array relationship */
  alerts: Array<Alerts>;
  /** An aggregate relationship */
  alerts_aggregate: Alerts_Aggregate;
  created_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  dashboards: Array<Dashboards>;
  /** An aggregate relationship */
  dashboards_aggregate: Dashboards_Aggregate;
  /** An array relationship */
  datasources: Array<Datasources>;
  /** An aggregate relationship */
  datasources_aggregate: Datasources_Aggregate;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  members: Array<Members>;
  /** An aggregate relationship */
  members_aggregate: Members_Aggregate;
  name: Scalars["String"]["output"];
  /** An array relationship */
  reports: Array<Reports>;
  /** An aggregate relationship */
  reports_aggregate: Reports_Aggregate;
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "teams" */
export type TeamsAccess_ListsArgs = {
  distinct_on?: InputMaybe<Array<Access_Lists_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By>>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsAccess_Lists_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Access_Lists_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By>>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsAlertsArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsAlerts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsDashboardsArgs = {
  distinct_on?: InputMaybe<Array<Dashboards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dashboards_Order_By>>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsDashboards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dashboards_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dashboards_Order_By>>;
  where?: InputMaybe<Dashboards_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsDatasourcesArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsDatasources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsMembersArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsReportsArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** columns and relationships of "teams" */
export type TeamsReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** aggregated selection of "teams" */
export type Teams_Aggregate = {
  __typename?: "teams_aggregate";
  aggregate?: Maybe<Teams_Aggregate_Fields>;
  nodes: Array<Teams>;
};

export type Teams_Aggregate_Bool_Exp = {
  count?: InputMaybe<Teams_Aggregate_Bool_Exp_Count>;
};

export type Teams_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Teams_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Teams_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "teams" */
export type Teams_Aggregate_Fields = {
  __typename?: "teams_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Teams_Max_Fields>;
  min?: Maybe<Teams_Min_Fields>;
};

/** aggregate fields of "teams" */
export type Teams_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Teams_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "teams" */
export type Teams_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Teams_Max_Order_By>;
  min?: InputMaybe<Teams_Min_Order_By>;
};

/** input type for inserting array relation for remote table "teams" */
export type Teams_Arr_Rel_Insert_Input = {
  data: Array<Teams_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Teams_On_Conflict>;
};

/** Boolean expression to filter rows from the table "teams". All fields are combined with a logical 'AND'. */
export type Teams_Bool_Exp = {
  _and?: InputMaybe<Array<Teams_Bool_Exp>>;
  _not?: InputMaybe<Teams_Bool_Exp>;
  _or?: InputMaybe<Array<Teams_Bool_Exp>>;
  access_lists?: InputMaybe<Access_Lists_Bool_Exp>;
  access_lists_aggregate?: InputMaybe<Access_Lists_Aggregate_Bool_Exp>;
  alerts?: InputMaybe<Alerts_Bool_Exp>;
  alerts_aggregate?: InputMaybe<Alerts_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  dashboards?: InputMaybe<Dashboards_Bool_Exp>;
  dashboards_aggregate?: InputMaybe<Dashboards_Aggregate_Bool_Exp>;
  datasources?: InputMaybe<Datasources_Bool_Exp>;
  datasources_aggregate?: InputMaybe<Datasources_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  members?: InputMaybe<Members_Bool_Exp>;
  members_aggregate?: InputMaybe<Members_Aggregate_Bool_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  reports?: InputMaybe<Reports_Bool_Exp>;
  reports_aggregate?: InputMaybe<Reports_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "teams" */
export enum Teams_Constraint {
  /** unique or primary key constraint on columns "id" */
  TeamsPkey = "teams_pkey",
  /** unique or primary key constraint on columns "user_id", "name" */
  TeamsUserIdNameKey = "teams_user_id_name_key",
}

/** input type for inserting data into table "teams" */
export type Teams_Insert_Input = {
  access_lists?: InputMaybe<Access_Lists_Arr_Rel_Insert_Input>;
  alerts?: InputMaybe<Alerts_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dashboards?: InputMaybe<Dashboards_Arr_Rel_Insert_Input>;
  datasources?: InputMaybe<Datasources_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  members?: InputMaybe<Members_Arr_Rel_Insert_Input>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  reports?: InputMaybe<Reports_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Teams_Max_Fields = {
  __typename?: "teams_max_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "teams" */
export type Teams_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Teams_Min_Fields = {
  __typename?: "teams_min_fields";
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "teams" */
export type Teams_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "teams" */
export type Teams_Mutation_Response = {
  __typename?: "teams_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Teams>;
};

/** input type for inserting object relation for remote table "teams" */
export type Teams_Obj_Rel_Insert_Input = {
  data: Teams_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Teams_On_Conflict>;
};

/** on_conflict condition type for table "teams" */
export type Teams_On_Conflict = {
  constraint: Teams_Constraint;
  update_columns?: Array<Teams_Update_Column>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

/** Ordering options when selecting data from "teams". */
export type Teams_Order_By = {
  access_lists_aggregate?: InputMaybe<Access_Lists_Aggregate_Order_By>;
  alerts_aggregate?: InputMaybe<Alerts_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  dashboards_aggregate?: InputMaybe<Dashboards_Aggregate_Order_By>;
  datasources_aggregate?: InputMaybe<Datasources_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  members_aggregate?: InputMaybe<Members_Aggregate_Order_By>;
  name?: InputMaybe<Order_By>;
  reports_aggregate?: InputMaybe<Reports_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: teams */
export type Teams_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "teams" */
export enum Teams_Select_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "teams" */
export type Teams_Set_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "teams" */
export type Teams_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Teams_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Teams_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "teams" */
export enum Teams_Update_Column {
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  Name = "name",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Teams_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Teams_Set_Input>;
  /** filter the rows which have to be updated */
  where: Teams_Bool_Exp;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _gte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _in?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _lte?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _neq?: InputMaybe<Scalars["timestamptz"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["timestamptz"]["input"]>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: "users";
  /** An object relationship */
  account?: Maybe<Auth_Accounts>;
  /** An array relationship */
  alerts: Array<Alerts>;
  /** An aggregate relationship */
  alerts_aggregate: Alerts_Aggregate;
  avatar_url?: Maybe<Scalars["String"]["output"]>;
  /** An array relationship */
  branches: Array<Branches>;
  /** An aggregate relationship */
  branches_aggregate: Branches_Aggregate;
  created_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  dataschemas: Array<Dataschemas>;
  /** An aggregate relationship */
  dataschemas_aggregate: Dataschemas_Aggregate;
  /** An array relationship */
  datasources: Array<Datasources>;
  /** An aggregate relationship */
  datasources_aggregate: Datasources_Aggregate;
  display_name?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["uuid"]["output"];
  /** An array relationship */
  members: Array<Members>;
  /** An aggregate relationship */
  members_aggregate: Members_Aggregate;
  /** An array relationship */
  reports: Array<Reports>;
  /** An aggregate relationship */
  reports_aggregate: Reports_Aggregate;
  /** An array relationship */
  request_logs: Array<Request_Logs>;
  /** An aggregate relationship */
  request_logs_aggregate: Request_Logs_Aggregate;
  /** An array relationship */
  sql_credentials: Array<Sql_Credentials>;
  /** An aggregate relationship */
  sql_credentials_aggregate: Sql_Credentials_Aggregate;
  /** An array relationship */
  teams: Array<Teams>;
  /** An aggregate relationship */
  teams_aggregate: Teams_Aggregate;
  updated_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  versions: Array<Versions>;
  /** An aggregate relationship */
  versions_aggregate: Versions_Aggregate;
};

/** columns and relationships of "users" */
export type UsersAlertsArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersAlerts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Alerts_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Alerts_Order_By>>;
  where?: InputMaybe<Alerts_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersBranchesArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersBranches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersDataschemasArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersDataschemas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersDatasourcesArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersDatasources_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Datasources_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Datasources_Order_By>>;
  where?: InputMaybe<Datasources_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersMembersArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersMembers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Members_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Members_Order_By>>;
  where?: InputMaybe<Members_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersReportsArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersReports_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Reports_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Reports_Order_By>>;
  where?: InputMaybe<Reports_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersRequest_LogsArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersRequest_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Request_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By>>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersSql_CredentialsArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersSql_Credentials_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sql_Credentials_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Sql_Credentials_Order_By>>;
  where?: InputMaybe<Sql_Credentials_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersTeamsArgs = {
  distinct_on?: InputMaybe<Array<Teams_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Teams_Order_By>>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersTeams_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Teams_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Teams_Order_By>>;
  where?: InputMaybe<Teams_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersVersionsArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

/** columns and relationships of "users" */
export type UsersVersions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Versions_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Versions_Order_By>>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: "users_aggregate";
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: "users_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  account?: InputMaybe<Auth_Accounts_Bool_Exp>;
  alerts?: InputMaybe<Alerts_Bool_Exp>;
  alerts_aggregate?: InputMaybe<Alerts_Aggregate_Bool_Exp>;
  avatar_url?: InputMaybe<String_Comparison_Exp>;
  branches?: InputMaybe<Branches_Bool_Exp>;
  branches_aggregate?: InputMaybe<Branches_Aggregate_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  dataschemas?: InputMaybe<Dataschemas_Bool_Exp>;
  dataschemas_aggregate?: InputMaybe<Dataschemas_Aggregate_Bool_Exp>;
  datasources?: InputMaybe<Datasources_Bool_Exp>;
  datasources_aggregate?: InputMaybe<Datasources_Aggregate_Bool_Exp>;
  display_name?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  members?: InputMaybe<Members_Bool_Exp>;
  members_aggregate?: InputMaybe<Members_Aggregate_Bool_Exp>;
  reports?: InputMaybe<Reports_Bool_Exp>;
  reports_aggregate?: InputMaybe<Reports_Aggregate_Bool_Exp>;
  request_logs?: InputMaybe<Request_Logs_Bool_Exp>;
  request_logs_aggregate?: InputMaybe<Request_Logs_Aggregate_Bool_Exp>;
  sql_credentials?: InputMaybe<Sql_Credentials_Bool_Exp>;
  sql_credentials_aggregate?: InputMaybe<Sql_Credentials_Aggregate_Bool_Exp>;
  teams?: InputMaybe<Teams_Bool_Exp>;
  teams_aggregate?: InputMaybe<Teams_Aggregate_Bool_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  versions?: InputMaybe<Versions_Bool_Exp>;
  versions_aggregate?: InputMaybe<Versions_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "id" */
  UsersPkey = "users_pkey",
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  account?: InputMaybe<Auth_Accounts_Obj_Rel_Insert_Input>;
  alerts?: InputMaybe<Alerts_Arr_Rel_Insert_Input>;
  avatar_url?: InputMaybe<Scalars["String"]["input"]>;
  branches?: InputMaybe<Branches_Arr_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dataschemas?: InputMaybe<Dataschemas_Arr_Rel_Insert_Input>;
  datasources?: InputMaybe<Datasources_Arr_Rel_Insert_Input>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  members?: InputMaybe<Members_Arr_Rel_Insert_Input>;
  reports?: InputMaybe<Reports_Arr_Rel_Insert_Input>;
  request_logs?: InputMaybe<Request_Logs_Arr_Rel_Insert_Input>;
  sql_credentials?: InputMaybe<Sql_Credentials_Arr_Rel_Insert_Input>;
  teams?: InputMaybe<Teams_Arr_Rel_Insert_Input>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  versions?: InputMaybe<Versions_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: "users_max_fields";
  avatar_url?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  display_name?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: "users_min_fields";
  avatar_url?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  display_name?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: "users_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  account?: InputMaybe<Auth_Accounts_Order_By>;
  alerts_aggregate?: InputMaybe<Alerts_Aggregate_Order_By>;
  avatar_url?: InputMaybe<Order_By>;
  branches_aggregate?: InputMaybe<Branches_Aggregate_Order_By>;
  created_at?: InputMaybe<Order_By>;
  dataschemas_aggregate?: InputMaybe<Dataschemas_Aggregate_Order_By>;
  datasources_aggregate?: InputMaybe<Datasources_Aggregate_Order_By>;
  display_name?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  members_aggregate?: InputMaybe<Members_Aggregate_Order_By>;
  reports_aggregate?: InputMaybe<Reports_Aggregate_Order_By>;
  request_logs_aggregate?: InputMaybe<Request_Logs_Aggregate_Order_By>;
  sql_credentials_aggregate?: InputMaybe<Sql_Credentials_Aggregate_Order_By>;
  teams_aggregate?: InputMaybe<Teams_Aggregate_Order_By>;
  updated_at?: InputMaybe<Order_By>;
  versions_aggregate?: InputMaybe<Versions_Aggregate_Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  AvatarUrl = "avatar_url",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DisplayName = "display_name",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  avatar_url?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  avatar_url?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  AvatarUrl = "avatar_url",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  DisplayName = "display_name",
  /** column name */
  Id = "id",
  /** column name */
  UpdatedAt = "updated_at",
}

export type Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars["uuid"]["input"]>;
  _gt?: InputMaybe<Scalars["uuid"]["input"]>;
  _gte?: InputMaybe<Scalars["uuid"]["input"]>;
  _in?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
  _is_null?: InputMaybe<Scalars["Boolean"]["input"]>;
  _lt?: InputMaybe<Scalars["uuid"]["input"]>;
  _lte?: InputMaybe<Scalars["uuid"]["input"]>;
  _neq?: InputMaybe<Scalars["uuid"]["input"]>;
  _nin?: InputMaybe<Array<Scalars["uuid"]["input"]>>;
};

/** columns and relationships of "versions" */
export type Versions = {
  __typename?: "versions";
  /** An object relationship */
  branch: Branches;
  branch_id: Scalars["uuid"]["output"];
  checksum: Scalars["String"]["output"];
  created_at: Scalars["timestamptz"]["output"];
  /** An array relationship */
  dataschemas: Array<Dataschemas>;
  /** An aggregate relationship */
  dataschemas_aggregate: Dataschemas_Aggregate;
  id: Scalars["uuid"]["output"];
  markdown_doc?: Maybe<Scalars["String"]["output"]>;
  updated_at: Scalars["timestamptz"]["output"];
  /** An object relationship */
  user: Users;
  user_id: Scalars["uuid"]["output"];
};

/** columns and relationships of "versions" */
export type VersionsDataschemasArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

/** columns and relationships of "versions" */
export type VersionsDataschemas_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Dataschemas_Select_Column>>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By>>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
};

/** aggregated selection of "versions" */
export type Versions_Aggregate = {
  __typename?: "versions_aggregate";
  aggregate?: Maybe<Versions_Aggregate_Fields>;
  nodes: Array<Versions>;
};

export type Versions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Versions_Aggregate_Bool_Exp_Count>;
};

export type Versions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Versions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
  filter?: InputMaybe<Versions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "versions" */
export type Versions_Aggregate_Fields = {
  __typename?: "versions_aggregate_fields";
  count: Scalars["Int"]["output"];
  max?: Maybe<Versions_Max_Fields>;
  min?: Maybe<Versions_Min_Fields>;
};

/** aggregate fields of "versions" */
export type Versions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Versions_Select_Column>>;
  distinct?: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** order by aggregate values of table "versions" */
export type Versions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Versions_Max_Order_By>;
  min?: InputMaybe<Versions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "versions" */
export type Versions_Arr_Rel_Insert_Input = {
  data: Array<Versions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Versions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "versions". All fields are combined with a logical 'AND'. */
export type Versions_Bool_Exp = {
  _and?: InputMaybe<Array<Versions_Bool_Exp>>;
  _not?: InputMaybe<Versions_Bool_Exp>;
  _or?: InputMaybe<Array<Versions_Bool_Exp>>;
  branch?: InputMaybe<Branches_Bool_Exp>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  checksum?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  dataschemas?: InputMaybe<Dataschemas_Bool_Exp>;
  dataschemas_aggregate?: InputMaybe<Dataschemas_Aggregate_Bool_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  markdown_doc?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "versions" */
export enum Versions_Constraint {
  /** unique or primary key constraint on columns "id" */
  VersionsPkey = "versions_pkey",
}

/** input type for inserting data into table "versions" */
export type Versions_Insert_Input = {
  branch?: InputMaybe<Branches_Obj_Rel_Insert_Input>;
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  checksum?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  dataschemas?: InputMaybe<Dataschemas_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  markdown_doc?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** aggregate max on columns */
export type Versions_Max_Fields = {
  __typename?: "versions_max_fields";
  branch_id?: Maybe<Scalars["uuid"]["output"]>;
  checksum?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  markdown_doc?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by max() on columns of table "versions" */
export type Versions_Max_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  checksum?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  markdown_doc?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Versions_Min_Fields = {
  __typename?: "versions_min_fields";
  branch_id?: Maybe<Scalars["uuid"]["output"]>;
  checksum?: Maybe<Scalars["String"]["output"]>;
  created_at?: Maybe<Scalars["timestamptz"]["output"]>;
  id?: Maybe<Scalars["uuid"]["output"]>;
  markdown_doc?: Maybe<Scalars["String"]["output"]>;
  updated_at?: Maybe<Scalars["timestamptz"]["output"]>;
  user_id?: Maybe<Scalars["uuid"]["output"]>;
};

/** order by min() on columns of table "versions" */
export type Versions_Min_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  checksum?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  markdown_doc?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "versions" */
export type Versions_Mutation_Response = {
  __typename?: "versions_mutation_response";
  /** number of rows affected by the mutation */
  affected_rows: Scalars["Int"]["output"];
  /** data from the rows affected by the mutation */
  returning: Array<Versions>;
};

/** input type for inserting object relation for remote table "versions" */
export type Versions_Obj_Rel_Insert_Input = {
  data: Versions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Versions_On_Conflict>;
};

/** on_conflict condition type for table "versions" */
export type Versions_On_Conflict = {
  constraint: Versions_Constraint;
  update_columns?: Array<Versions_Update_Column>;
  where?: InputMaybe<Versions_Bool_Exp>;
};

/** Ordering options when selecting data from "versions". */
export type Versions_Order_By = {
  branch?: InputMaybe<Branches_Order_By>;
  branch_id?: InputMaybe<Order_By>;
  checksum?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  dataschemas_aggregate?: InputMaybe<Dataschemas_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  markdown_doc?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: versions */
export type Versions_Pk_Columns_Input = {
  id: Scalars["uuid"]["input"];
};

/** select columns of table "versions" */
export enum Versions_Select_Column {
  /** column name */
  BranchId = "branch_id",
  /** column name */
  Checksum = "checksum",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  MarkdownDoc = "markdown_doc",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

/** input type for updating data in table "versions" */
export type Versions_Set_Input = {
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  checksum?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  markdown_doc?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** Streaming cursor of the table "versions" */
export type Versions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Versions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Versions_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
  checksum?: InputMaybe<Scalars["String"]["input"]>;
  created_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  id?: InputMaybe<Scalars["uuid"]["input"]>;
  markdown_doc?: InputMaybe<Scalars["String"]["input"]>;
  updated_at?: InputMaybe<Scalars["timestamptz"]["input"]>;
  user_id?: InputMaybe<Scalars["uuid"]["input"]>;
};

/** update columns of table "versions" */
export enum Versions_Update_Column {
  /** column name */
  BranchId = "branch_id",
  /** column name */
  Checksum = "checksum",
  /** column name */
  CreatedAt = "created_at",
  /** column name */
  Id = "id",
  /** column name */
  MarkdownDoc = "markdown_doc",
  /** column name */
  UpdatedAt = "updated_at",
  /** column name */
  UserId = "user_id",
}

export type Versions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Versions_Set_Input>;
  /** filter the rows which have to be updated */
  where: Versions_Bool_Exp;
};

export type AllAccessListsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By> | Access_Lists_Order_By>;
}>;

export type AllAccessListsQuery = {
  __typename?: "query_root";
  access_lists: Array<{
    __typename?: "access_lists";
    id: any;
    name: string;
    config: any;
    team_id: any;
    created_at: any;
    updated_at: any;
  }>;
};

export type SubAccessListsSubscriptionVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Access_Lists_Bool_Exp>;
  order_by?: InputMaybe<Array<Access_Lists_Order_By> | Access_Lists_Order_By>;
}>;

export type SubAccessListsSubscription = {
  __typename?: "subscription_root";
  access_lists: Array<{
    __typename?: "access_lists";
    id: any;
    name: string;
    config: any;
    created_at: any;
    updated_at: any;
  }>;
};

export type AccessListQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type AccessListQuery = {
  __typename?: "query_root";
  access_lists_by_pk?: {
    __typename?: "access_lists";
    name: string;
    config: any;
    team_id: any;
  } | null;
};

export type UpdateAccessListMutationVariables = Exact<{
  pk_columns: Access_Lists_Pk_Columns_Input;
  _set: Access_Lists_Set_Input;
}>;

export type UpdateAccessListMutation = {
  __typename?: "mutation_root";
  update_access_lists_by_pk?: { __typename?: "access_lists"; id: any } | null;
};

export type DeleteAccessListMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteAccessListMutation = {
  __typename?: "mutation_root";
  delete_access_lists_by_pk?: { __typename?: "access_lists"; id: any } | null;
};

export type CreateAccessListMutationVariables = Exact<{
  object: Access_Lists_Insert_Input;
}>;

export type CreateAccessListMutation = {
  __typename?: "mutation_root";
  insert_access_lists_one?: { __typename?: "access_lists"; id: any } | null;
};

export type CreateAlertMutationVariables = Exact<{
  object: Alerts_Insert_Input;
}>;

export type CreateAlertMutation = {
  __typename?: "mutation_root";
  insert_alerts_one?: { __typename?: "alerts"; id: any } | null;
};

export type UpdateAlertMutationVariables = Exact<{
  pk_columns: Alerts_Pk_Columns_Input;
  _set: Alerts_Set_Input;
}>;

export type UpdateAlertMutation = {
  __typename?: "mutation_root";
  update_alerts_by_pk?: { __typename?: "alerts"; id: any } | null;
};

export type DeleteAlertMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteAlertMutation = {
  __typename?: "mutation_root";
  delete_alerts_by_pk?: { __typename?: "alerts"; id: any } | null;
};

export type SendTestAlertMutationVariables = Exact<{
  deliveryConfig: Scalars["json"]["input"];
  deliveryType: Scalars["String"]["input"];
  explorationId?: InputMaybe<Scalars["uuid"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type SendTestAlertMutation = {
  __typename?: "mutation_root";
  send_test_alert?: {
    __typename?: "SendTestAlertOutput";
    error?: boolean | null;
    result?: any | null;
  } | null;
};

export type SetDefaultBranchMutationVariables = Exact<{
  branch_id: Scalars["uuid"]["input"];
  datasource_id: Scalars["uuid"]["input"];
}>;

export type SetDefaultBranchMutation = {
  __typename?: "mutation_root";
  update_branches?: {
    __typename?: "branches_mutation_response";
    affected_rows: number;
  } | null;
  update_branches_by_pk?: {
    __typename?: "branches";
    id: any;
    name: string;
  } | null;
};

export type ExportDataMutationVariables = Exact<{
  branch_id?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type ExportDataMutation = {
  __typename?: "mutation_root";
  export_data_models?: {
    __typename?: "ExportDataModelsOutput";
    download_url: string;
  } | null;
};

export type CreateBranchMutationVariables = Exact<{
  object: Branches_Insert_Input;
}>;

export type CreateBranchMutation = {
  __typename?: "mutation_root";
  insert_branches_one?: { __typename?: "branches"; id: any } | null;
};

export type BranchesFieldsFragment = {
  __typename?: "branches";
  id: any;
  name: string;
  status: Branch_Statuses_Enum;
};

export type UserTeamFieldsFragment = {
  __typename?: "teams";
  id: any;
  name: string;
  created_at: any;
  updated_at: any;
  members: Array<{
    __typename?: "members";
    id: any;
    user_id: any;
    member_roles: Array<{
      __typename?: "member_roles";
      team_role: Team_Roles_Enum;
    }>;
    user: {
      __typename?: "users";
      id: any;
      avatar_url?: string | null;
      display_name?: string | null;
      account?: { __typename?: "auth_accounts"; email?: any | null } | null;
    };
  }>;
};

export type TeamMembersFieldsFragment = {
  __typename?: "teams";
  members: Array<{
    __typename?: "members";
    id: any;
    user_id: any;
    member_roles: Array<{
      __typename?: "member_roles";
      id: any;
      team_role: Team_Roles_Enum;
      created_at?: any | null;
      updated_at?: any | null;
      access_list?: {
        __typename?: "access_lists";
        id: any;
        name: string;
        config: any;
      } | null;
    }>;
    user: {
      __typename?: "users";
      id: any;
      avatar_url?: string | null;
      display_name?: string | null;
      account?: { __typename?: "auth_accounts"; email?: any | null } | null;
    };
  }>;
};

export type CurrentUserQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type CurrentUserQuery = {
  __typename?: "query_root";
  users_by_pk?: {
    __typename?: "users";
    id: any;
    display_name?: string | null;
    avatar_url?: string | null;
    account?: { __typename?: "auth_accounts"; email?: any | null } | null;
    members: Array<{
      __typename?: "members";
      member_roles: Array<{
        __typename?: "member_roles";
        team_role: Team_Roles_Enum;
      }>;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
      team: {
        __typename?: "teams";
        id: any;
        name: string;
        created_at: any;
        updated_at: any;
        members: Array<{
          __typename?: "members";
          id: any;
          user_id: any;
          member_roles: Array<{
            __typename?: "member_roles";
            team_role: Team_Roles_Enum;
          }>;
          user: {
            __typename?: "users";
            id: any;
            avatar_url?: string | null;
            display_name?: string | null;
            account?: {
              __typename?: "auth_accounts";
              email?: any | null;
            } | null;
          };
        }>;
      };
    }>;
  } | null;
};

export type SubCurrentUserSubscriptionVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type SubCurrentUserSubscription = {
  __typename?: "subscription_root";
  users_by_pk?: {
    __typename?: "users";
    id: any;
    display_name?: string | null;
    avatar_url?: string | null;
    account?: { __typename?: "auth_accounts"; email?: any | null } | null;
    members: Array<{
      __typename?: "members";
      id: any;
      user_id: any;
      member_roles: Array<{
        __typename?: "member_roles";
        id: any;
        team_role: Team_Roles_Enum;
        created_at?: any | null;
        updated_at?: any | null;
        access_list?: {
          __typename?: "access_lists";
          id: any;
          name: string;
          config: any;
        } | null;
      }>;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
      team: {
        __typename?: "teams";
        id: any;
        name: string;
        created_at: any;
        updated_at: any;
        members: Array<{
          __typename?: "members";
          id: any;
          user_id: any;
          member_roles: Array<{
            __typename?: "member_roles";
            team_role: Team_Roles_Enum;
          }>;
          user: {
            __typename?: "users";
            id: any;
            avatar_url?: string | null;
            display_name?: string | null;
            account?: {
              __typename?: "auth_accounts";
              email?: any | null;
            } | null;
          };
        }>;
      };
    }>;
  } | null;
};

export type TeamDataQueryVariables = Exact<{
  team_id: Scalars["uuid"]["input"];
}>;

export type TeamDataQuery = {
  __typename?: "query_root";
  teams_by_pk?: {
    __typename?: "teams";
    datasources: Array<{
      __typename?: "datasources";
      id: any;
      name: string;
      db_params_computed?: any | null;
      db_type: string;
      created_at: any;
      updated_at: any;
      branches: Array<{
        __typename?: "branches";
        id: any;
        name: string;
        status: Branch_Statuses_Enum;
      }>;
      sql_credentials: Array<{
        __typename?: "sql_credentials";
        id: any;
        username: string;
        created_at: any;
        updated_at: any;
        user: { __typename?: "users"; id: any; display_name?: string | null };
      }>;
    }>;
    alerts: Array<{
      __typename?: "alerts";
      id: any;
      name: string;
      delivery_type: string;
      delivery_config: any;
      trigger_config: any;
      created_at: any;
      updated_at: any;
      schedule: string;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
      exploration: {
        __typename?: "explorations";
        id: any;
        playground_state: any;
      };
    }>;
    reports: Array<{
      __typename?: "reports";
      id: any;
      name: string;
      schedule: string;
      delivery_type: string;
      delivery_config: any;
      created_at: any;
      updated_at: any;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
      exploration: {
        __typename?: "explorations";
        id: any;
        playground_state: any;
      };
    }>;
    members: Array<{
      __typename?: "members";
      id: any;
      user_id: any;
      member_roles: Array<{
        __typename?: "member_roles";
        id: any;
        team_role: Team_Roles_Enum;
        created_at?: any | null;
        updated_at?: any | null;
        access_list?: {
          __typename?: "access_lists";
          id: any;
          name: string;
          config: any;
        } | null;
      }>;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
    }>;
  } | null;
};

export type SubTeamDataSubscriptionVariables = Exact<{
  team_id: Scalars["uuid"]["input"];
}>;

export type SubTeamDataSubscription = {
  __typename?: "subscription_root";
  teams_by_pk?: {
    __typename?: "teams";
    datasources: Array<{
      __typename?: "datasources";
      id: any;
      name: string;
      db_params_computed?: any | null;
      db_type: string;
      created_at: any;
      updated_at: any;
      branches: Array<{
        __typename?: "branches";
        id: any;
        name: string;
        status: Branch_Statuses_Enum;
      }>;
      sql_credentials: Array<{
        __typename?: "sql_credentials";
        id: any;
        username: string;
        created_at: any;
        updated_at: any;
        user: { __typename?: "users"; id: any; display_name?: string | null };
      }>;
    }>;
    alerts: Array<{
      __typename?: "alerts";
      id: any;
      name: string;
      delivery_type: string;
      delivery_config: any;
      trigger_config: any;
      created_at: any;
      updated_at: any;
      schedule: string;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
      exploration: {
        __typename?: "explorations";
        id: any;
        playground_state: any;
      };
    }>;
    reports: Array<{
      __typename?: "reports";
      id: any;
      name: string;
      schedule: string;
      delivery_type: string;
      delivery_config: any;
      created_at: any;
      updated_at: any;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
      exploration: {
        __typename?: "explorations";
        id: any;
        playground_state: any;
      };
    }>;
    members: Array<{
      __typename?: "members";
      id: any;
      user_id: any;
      member_roles: Array<{
        __typename?: "member_roles";
        id: any;
        team_role: Team_Roles_Enum;
        created_at?: any | null;
        updated_at?: any | null;
        access_list?: {
          __typename?: "access_lists";
          id: any;
          name: string;
          config: any;
        } | null;
      }>;
      user: {
        __typename?: "users";
        id: any;
        avatar_url?: string | null;
        display_name?: string | null;
        account?: { __typename?: "auth_accounts"; email?: any | null } | null;
      };
    }>;
  } | null;
};

export type UpdateUserInfoMutationVariables = Exact<{
  user_id: Scalars["uuid"]["input"];
  display_name?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["citext"]["input"]>;
}>;

export type UpdateUserInfoMutation = {
  __typename?: "mutation_root";
  update_users_by_pk?: { __typename?: "users"; id: any } | null;
  update_auth_accounts?: {
    __typename?: "auth_accounts_mutation_response";
    affected_rows: number;
  } | null;
};

export type CreateDataSourceMutationVariables = Exact<{
  object: Datasources_Insert_Input;
}>;

export type CreateDataSourceMutation = {
  __typename?: "mutation_root";
  insert_datasources_one?: {
    __typename?: "datasources";
    id: any;
    name: string;
    branches: Array<{ __typename?: "branches"; id: any }>;
    sql_credentials: Array<{ __typename?: "sql_credentials"; id: any }>;
  } | null;
};

export type DatasourcesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Datasources_Bool_Exp>;
  order_by?: InputMaybe<Array<Datasources_Order_By> | Datasources_Order_By>;
}>;

export type DatasourcesQuery = {
  __typename?: "query_root";
  datasources: Array<{
    __typename?: "datasources";
    id: any;
    name: string;
    db_params_computed?: any | null;
    db_type: string;
    created_at: any;
    updated_at: any;
    branches: Array<{ __typename?: "branches"; id: any }>;
    sql_credentials: Array<{
      __typename?: "sql_credentials";
      id: any;
      username: string;
      created_at: any;
      updated_at: any;
      user: { __typename?: "users"; id: any; display_name?: string | null };
    }>;
  }>;
  datasources_aggregate: {
    __typename?: "datasources_aggregate";
    aggregate?: {
      __typename?: "datasources_aggregate_fields";
      count: number;
    } | null;
  };
};

export type AllDataSourcesSubscriptionVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Datasources_Bool_Exp>;
  order_by?: InputMaybe<Array<Datasources_Order_By> | Datasources_Order_By>;
}>;

export type AllDataSourcesSubscription = {
  __typename?: "subscription_root";
  datasources: Array<{
    __typename?: "datasources";
    id: any;
    name: string;
    db_params_computed?: any | null;
    db_type: string;
    created_at: any;
    updated_at: any;
    branches: Array<{ __typename?: "branches"; id: any }>;
    sql_credentials: Array<{
      __typename?: "sql_credentials";
      id: any;
      username: string;
      created_at: any;
      updated_at: any;
      user: { __typename?: "users"; id: any; display_name?: string | null };
    }>;
  }>;
};

export type FetchTablesQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type FetchTablesQuery = {
  __typename?: "query_root";
  fetch_tables?: {
    __typename?: "SourceTablesOutput";
    schema?: any | null;
  } | null;
};

export type FetchMetaQueryVariables = Exact<{
  datasource_id: Scalars["uuid"]["input"];
  branch_id?: InputMaybe<Scalars["uuid"]["input"]>;
}>;

export type FetchMetaQuery = {
  __typename?: "query_root";
  fetch_meta?: { __typename?: "SourceMetaOutput"; cubes?: any | null } | null;
};

export type CurrentDataSourceQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type CurrentDataSourceQuery = {
  __typename?: "query_root";
  datasources_by_pk?: {
    __typename?: "datasources";
    id: any;
    name: string;
    db_type: string;
    db_params_computed?: any | null;
    created_at: any;
    updated_at: any;
  } | null;
};

export type UpdateDataSourceMutationVariables = Exact<{
  pk_columns: Datasources_Pk_Columns_Input;
  _set: Datasources_Set_Input;
}>;

export type UpdateDataSourceMutation = {
  __typename?: "mutation_root";
  update_datasources_by_pk?: {
    __typename?: "datasources";
    id: any;
    branches: Array<{ __typename?: "branches"; id: any }>;
  } | null;
};

export type CheckConnectionMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type CheckConnectionMutation = {
  __typename?: "mutation_root";
  check_connection?: {
    __typename?: "CheckConnectionOutput";
    message?: string | null;
    code: string;
  } | null;
};

export type DeleteDataSourceMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteDataSourceMutation = {
  __typename?: "mutation_root";
  delete_datasources_by_pk?: { __typename?: "datasources"; id: any } | null;
};

export type GenDataSchemasMutationVariables = Exact<{
  datasource_id: Scalars["uuid"]["input"];
  branch_id: Scalars["uuid"]["input"];
  tables: Array<SourceTable> | SourceTable;
  overwrite?: InputMaybe<Scalars["Boolean"]["input"]>;
  format?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GenDataSchemasMutation = {
  __typename?: "mutation_root";
  gen_dataschemas?: {
    __typename?: "GenSourceSchemaOutput";
    code: string;
    message?: string | null;
  } | null;
};

export type RunSourceSqlQueryMutationVariables = Exact<{
  datasource_id: Scalars["uuid"]["input"];
  query: Scalars["String"]["input"];
  limit: Scalars["Int"]["input"];
}>;

export type RunSourceSqlQueryMutation = {
  __typename?: "mutation_root";
  run_query?: {
    __typename?: "RunSourceQueryOutput";
    result?: any | null;
  } | null;
};

export type CreateExplorationMutationVariables = Exact<{
  object: Explorations_Insert_Input;
}>;

export type CreateExplorationMutation = {
  __typename?: "mutation_root";
  insert_explorations_one?: { __typename?: "explorations"; id: any } | null;
};

export type GenSqlMutationVariables = Exact<{
  exploration_id: Scalars["uuid"]["input"];
}>;

export type GenSqlMutation = {
  __typename?: "mutation_root";
  gen_sql?: { __typename?: "GenSQLOutput"; result?: any | null } | null;
};

export type CurrentExplorationQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type CurrentExplorationQuery = {
  __typename?: "query_root";
  explorations_by_pk?: {
    __typename?: "explorations";
    id: any;
    branch_id?: any | null;
    datasource_id: any;
    playground_state: any;
    playground_settings: any;
    created_at: any;
    updated_at: any;
  } | null;
  fetch_dataset?: {
    __typename?: "FetchDatasetOutput";
    annotation?: any | null;
    data?: any | null;
    query?: any | null;
    progress?: any | null;
    hitLimit?: boolean | null;
  } | null;
};

export type MembersQueryVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Members_Bool_Exp>;
  order_by?: InputMaybe<Array<Members_Order_By> | Members_Order_By>;
}>;

export type MembersQuery = {
  __typename?: "query_root";
  members: Array<{
    __typename?: "members";
    id: any;
    updated_at: any;
    created_at: any;
    user: {
      __typename?: "users";
      id: any;
      display_name?: string | null;
      account?: { __typename?: "auth_accounts"; email?: any | null } | null;
    };
    member_roles: Array<{
      __typename?: "member_roles";
      id: any;
      team_role: Team_Roles_Enum;
      updated_at?: any | null;
      created_at?: any | null;
      access_list?: {
        __typename?: "access_lists";
        id: any;
        name: string;
      } | null;
    }>;
  }>;
};

export type UpdateMemberMutationVariables = Exact<{
  pk_columns: Members_Pk_Columns_Input;
  _set: Members_Set_Input;
}>;

export type UpdateMemberMutation = {
  __typename?: "mutation_root";
  update_members_by_pk?: { __typename?: "members"; id: any } | null;
};

export type UpdateMemberRoleMutationVariables = Exact<{
  pk_columns: Member_Roles_Pk_Columns_Input;
  _set: Member_Roles_Set_Input;
}>;

export type UpdateMemberRoleMutation = {
  __typename?: "mutation_root";
  update_member_roles_by_pk?: { __typename?: "member_roles"; id: any } | null;
};

export type DeleteMemberMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteMemberMutation = {
  __typename?: "mutation_root";
  delete_members_by_pk?: { __typename?: "members"; id: any } | null;
};

export type InviteMemberMutationVariables = Exact<{
  email: Scalars["String"]["input"];
  teamId: Scalars["uuid"]["input"];
  role?: InputMaybe<Scalars["String"]["input"]>;
  magicLink?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type InviteMemberMutation = {
  __typename?: "mutation_root";
  invite_team_member?: {
    __typename?: "InviteTeamMemberOutput";
    memberId?: any | null;
  } | null;
};

export type DefaultFieldsFragment = {
  __typename?: "request_logs";
  id: any;
  created_at: any;
  start_time: any;
  duration?: any | null;
  path?: string | null;
  user_id: any;
  datasource_id: any;
};

export type CurrentLogQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type CurrentLogQuery = {
  __typename?: "query_root";
  request_logs_by_pk?: {
    __typename?: "request_logs";
    end_time: any;
    request_id: string;
    updated_at: any;
    id: any;
    created_at: any;
    start_time: any;
    duration?: any | null;
    path?: string | null;
    user_id: any;
    datasource_id: any;
    request_event_logs: Array<{
      __typename?: "request_event_logs";
      id: any;
      duration?: any | null;
      event: string;
      path?: string | null;
      query?: any | null;
      query_key?: any | null;
      query_sql?: string | null;
      query_key_md5?: string | null;
      queue_prefix?: string | null;
      time_in_queue?: any | null;
      timestamp?: any | null;
      error?: string | null;
    }>;
  } | null;
};

export type AllLogsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By> | Request_Logs_Order_By>;
}>;

export type AllLogsQuery = {
  __typename?: "query_root";
  request_logs: Array<{
    __typename?: "request_logs";
    id: any;
    created_at: any;
    start_time: any;
    duration?: any | null;
    path?: string | null;
    user_id: any;
    datasource_id: any;
    request_event_logs_aggregate: {
      __typename?: "request_event_logs_aggregate";
      aggregate?: {
        __typename?: "request_event_logs_aggregate_fields";
        count: number;
      } | null;
    };
  }>;
  request_logs_aggregate: {
    __typename?: "request_logs_aggregate";
    aggregate?: {
      __typename?: "request_logs_aggregate_fields";
      count: number;
    } | null;
  };
};

export type SubAllLogsSubscriptionVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Request_Logs_Bool_Exp>;
  order_by?: InputMaybe<Array<Request_Logs_Order_By> | Request_Logs_Order_By>;
}>;

export type SubAllLogsSubscription = {
  __typename?: "subscription_root";
  request_logs: Array<{ __typename?: "request_logs"; id: any }>;
};

export type CreateReportMutationVariables = Exact<{
  object: Reports_Insert_Input;
}>;

export type CreateReportMutation = {
  __typename?: "mutation_root";
  insert_reports_one?: { __typename?: "reports"; id: any } | null;
};

export type UpdateReportMutationVariables = Exact<{
  pk_columns: Reports_Pk_Columns_Input;
  _set: Reports_Set_Input;
}>;

export type UpdateReportMutation = {
  __typename?: "mutation_root";
  update_reports_by_pk?: { __typename?: "reports"; id: any } | null;
};

export type DeleteReportMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteReportMutation = {
  __typename?: "mutation_root";
  delete_reports_by_pk?: { __typename?: "reports"; id: any } | null;
};

export type AllSchemasSubscriptionVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Dataschemas_Bool_Exp>;
  order_by?: InputMaybe<Array<Dataschemas_Order_By> | Dataschemas_Order_By>;
}>;

export type AllSchemasSubscription = {
  __typename?: "subscription_root";
  dataschemas: Array<{
    __typename?: "dataschemas";
    id: any;
    user_id: any;
    name: string;
    checksum?: string | null;
    datasource: { __typename?: "datasources"; team_id?: any | null };
  }>;
};

export type AllDataSchemasQueryVariables = Exact<{
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  where?: InputMaybe<Branches_Bool_Exp>;
  order_by?: InputMaybe<Array<Branches_Order_By> | Branches_Order_By>;
}>;

export type AllDataSchemasQuery = {
  __typename?: "query_root";
  branches: Array<{
    __typename?: "branches";
    id: any;
    name: string;
    status: Branch_Statuses_Enum;
    versions: Array<{
      __typename?: "versions";
      id: any;
      checksum: string;
      created_at: any;
      updated_at: any;
      user: { __typename?: "users"; display_name?: string | null };
      dataschemas: Array<{
        __typename?: "dataschemas";
        id: any;
        name: string;
        code: string;
        created_at: any;
        updated_at: any;
        datasource_id: any;
      }>;
    }>;
  }>;
};

export type DeleteSchemaMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteSchemaMutation = {
  __typename?: "mutation_root";
  update_branches_by_pk?: { __typename?: "branches"; id: any } | null;
};

export type CredentialsQueryVariables = Exact<{
  teamId: Scalars["uuid"]["input"];
}>;

export type CredentialsQuery = {
  __typename?: "query_root";
  sql_credentials: Array<{
    __typename?: "sql_credentials";
    id: any;
    username: string;
    created_at: any;
    user: { __typename?: "users"; id: any; display_name?: string | null };
    datasource: {
      __typename?: "datasources";
      id: any;
      name: string;
      db_type: string;
      db_params_computed?: any | null;
    };
  }>;
};

export type SubCredentialsSubscriptionVariables = Exact<{
  teamId: Scalars["uuid"]["input"];
}>;

export type SubCredentialsSubscription = {
  __typename?: "subscription_root";
  sql_credentials: Array<{ __typename?: "sql_credentials"; id: any }>;
};

export type InsertSqlCredentialsMutationVariables = Exact<{
  object: Sql_Credentials_Insert_Input;
}>;

export type InsertSqlCredentialsMutation = {
  __typename?: "mutation_root";
  insert_sql_credentials_one?: {
    __typename?: "sql_credentials";
    id: any;
  } | null;
};

export type DeleteCredentialsMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteCredentialsMutation = {
  __typename?: "mutation_root";
  delete_sql_credentials_by_pk?: {
    __typename?: "sql_credentials";
    id: any;
  } | null;
};

export type CreateTeamMutationVariables = Exact<{
  name: Scalars["String"]["input"];
}>;

export type CreateTeamMutation = {
  __typename?: "mutation_root";
  create_team?: {
    __typename?: "CreateTeamOutput";
    id?: any | null;
    name?: string | null;
  } | null;
};

export type EditTeamMutationVariables = Exact<{
  pk_columns: Teams_Pk_Columns_Input;
  _set: Teams_Set_Input;
}>;

export type EditTeamMutation = {
  __typename?: "mutation_root";
  update_teams_by_pk?: { __typename?: "teams"; id: any; name: string } | null;
};

export type DeleteTeamMutationVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type DeleteTeamMutation = {
  __typename?: "mutation_root";
  delete_teams_by_pk?: { __typename?: "teams"; id: any } | null;
};

export type CurrentTeamQueryVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type CurrentTeamQuery = {
  __typename?: "query_root";
  teams_by_pk?: {
    __typename?: "teams";
    id: any;
    created_at: any;
    updated_at: any;
    members: Array<{
      __typename?: "members";
      user: { __typename?: "users"; display_name?: string | null };
    }>;
  } | null;
};

export type GetUsersQueryVariables = Exact<Record<string, never>>;

export type GetUsersQuery = {
  __typename?: "query_root";
  users: Array<{ __typename?: "users"; id: any }>;
};

export type VersionDocSubscriptionVariables = Exact<{
  id: Scalars["uuid"]["input"];
}>;

export type VersionDocSubscription = {
  __typename?: "subscription_root";
  versions_by_pk?: {
    __typename?: "versions";
    markdown_doc?: string | null;
  } | null;
};

export type CreateVersionMutationVariables = Exact<{
  object: Versions_Insert_Input;
}>;

export type CreateVersionMutation = {
  __typename?: "mutation_root";
  insert_versions_one?: { __typename?: "versions"; id: any } | null;
};

export type VersionByBranchIdQueryVariables = Exact<{
  branch_id: Scalars["uuid"]["input"];
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type VersionByBranchIdQuery = {
  __typename?: "query_root";
  versions: Array<{
    __typename?: "versions";
    id: any;
    checksum: string;
    updated_at: any;
    created_at: any;
    user: { __typename?: "users"; display_name?: string | null };
    dataschemas: Array<{
      __typename?: "dataschemas";
      created_at: any;
      updated_at: any;
      datasource_id: any;
      id: any;
      user_id: any;
      name: string;
      code: string;
      checksum?: string | null;
    }>;
  }>;
  versions_aggregate: {
    __typename?: "versions_aggregate";
    aggregate?: {
      __typename?: "versions_aggregate_fields";
      count: number;
    } | null;
  };
};

export type CurrentVersionQueryVariables = Exact<{
  branch_id: Scalars["uuid"]["input"];
}>;

export type CurrentVersionQuery = {
  __typename?: "query_root";
  versions: Array<{
    __typename?: "versions";
    id: any;
    checksum: string;
    dataschemas: Array<{
      __typename?: "dataschemas";
      created_at: any;
      updated_at: any;
      datasource_id: any;
      id: any;
      user_id: any;
      name: string;
      code: string;
      checksum?: string | null;
    }>;
  }>;
};

export type VersionsCountSubscriptionVariables = Exact<{
  branch_id: Scalars["uuid"]["input"];
}>;

export type VersionsCountSubscription = {
  __typename?: "subscription_root";
  versions_aggregate: {
    __typename?: "versions_aggregate";
    aggregate?: {
      __typename?: "versions_aggregate_fields";
      count: number;
    } | null;
  };
};

export const BranchesFieldsFragmentDoc = gql`
  fragment BranchesFields on branches {
    id
    name
    status
  }
`;
export const UserTeamFieldsFragmentDoc = gql`
  fragment UserTeamFields on teams {
    id
    name
    created_at
    updated_at
    members(order_by: { updated_at: desc }) {
      id
      user_id
      member_roles {
        team_role
      }
      user {
        id
        avatar_url
        display_name
        account {
          email
        }
      }
    }
  }
`;
export const TeamMembersFieldsFragmentDoc = gql`
  fragment TeamMembersFields on teams {
    members(order_by: { updated_at: desc }) {
      id
      user_id
      member_roles {
        id
        team_role
        created_at
        updated_at
        access_list {
          id
          name
          config
        }
      }
      user {
        id
        avatar_url
        display_name
        account {
          email
        }
      }
    }
  }
`;
export const DefaultFieldsFragmentDoc = gql`
  fragment DefaultFields on request_logs {
    id
    created_at
    start_time
    duration
    path
    user_id
    datasource_id
  }
`;
export const AllAccessListsDocument = gql`
  query AllAccessLists(
    $offset: Int
    $limit: Int
    $where: access_lists_bool_exp
    $order_by: [access_lists_order_by!]
  ) {
    access_lists(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
      name
      config
      team_id
      created_at
      updated_at
    }
  }
`;

export function useAllAccessListsQuery(
  options?: Omit<Urql.UseQueryArgs<AllAccessListsQueryVariables>, "query">
) {
  return Urql.useQuery<AllAccessListsQuery, AllAccessListsQueryVariables>({
    query: AllAccessListsDocument,
    ...options,
  });
}
export const SubAccessListsDocument = gql`
  subscription SubAccessLists(
    $offset: Int
    $limit: Int
    $where: access_lists_bool_exp
    $order_by: [access_lists_order_by!]
  ) {
    access_lists(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
      name
      config
      created_at
      updated_at
    }
  }
`;

export function useSubAccessListsSubscription<
  TData = SubAccessListsSubscription
>(
  options?: Omit<
    Urql.UseSubscriptionArgs<SubAccessListsSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<SubAccessListsSubscription, TData>
) {
  return Urql.useSubscription<
    SubAccessListsSubscription,
    TData,
    SubAccessListsSubscriptionVariables
  >({ query: SubAccessListsDocument, ...options }, handler);
}
export const AccessListDocument = gql`
  query AccessList($id: uuid!) {
    access_lists_by_pk(id: $id) {
      name
      config
      team_id
    }
  }
`;

export function useAccessListQuery(
  options: Omit<Urql.UseQueryArgs<AccessListQueryVariables>, "query">
) {
  return Urql.useQuery<AccessListQuery, AccessListQueryVariables>({
    query: AccessListDocument,
    ...options,
  });
}
export const UpdateAccessListDocument = gql`
  mutation UpdateAccessList(
    $pk_columns: access_lists_pk_columns_input!
    $_set: access_lists_set_input!
  ) {
    update_access_lists_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
    }
  }
`;

export function useUpdateAccessListMutation() {
  return Urql.useMutation<
    UpdateAccessListMutation,
    UpdateAccessListMutationVariables
  >(UpdateAccessListDocument);
}
export const DeleteAccessListDocument = gql`
  mutation DeleteAccessList($id: uuid!) {
    delete_access_lists_by_pk(id: $id) {
      id
    }
  }
`;

export function useDeleteAccessListMutation() {
  return Urql.useMutation<
    DeleteAccessListMutation,
    DeleteAccessListMutationVariables
  >(DeleteAccessListDocument);
}
export const CreateAccessListDocument = gql`
  mutation CreateAccessList($object: access_lists_insert_input!) {
    insert_access_lists_one(object: $object) {
      id
    }
  }
`;

export function useCreateAccessListMutation() {
  return Urql.useMutation<
    CreateAccessListMutation,
    CreateAccessListMutationVariables
  >(CreateAccessListDocument);
}
export const CreateAlertDocument = gql`
  mutation CreateAlert($object: alerts_insert_input!) {
    insert_alerts_one(object: $object) {
      id
    }
  }
`;

export function useCreateAlertMutation() {
  return Urql.useMutation<CreateAlertMutation, CreateAlertMutationVariables>(
    CreateAlertDocument
  );
}
export const UpdateAlertDocument = gql`
  mutation UpdateAlert(
    $pk_columns: alerts_pk_columns_input!
    $_set: alerts_set_input!
  ) {
    update_alerts_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
    }
  }
`;

export function useUpdateAlertMutation() {
  return Urql.useMutation<UpdateAlertMutation, UpdateAlertMutationVariables>(
    UpdateAlertDocument
  );
}
export const DeleteAlertDocument = gql`
  mutation DeleteAlert($id: uuid!) {
    delete_alerts_by_pk(id: $id) {
      id
    }
  }
`;

export function useDeleteAlertMutation() {
  return Urql.useMutation<DeleteAlertMutation, DeleteAlertMutationVariables>(
    DeleteAlertDocument
  );
}
export const SendTestAlertDocument = gql`
  mutation SendTestAlert(
    $deliveryConfig: json!
    $deliveryType: String!
    $explorationId: uuid
    $name: String
  ) {
    send_test_alert(
      deliveryConfig: $deliveryConfig
      deliveryType: $deliveryType
      name: $name
      explorationId: $explorationId
    ) {
      error
      result
    }
  }
`;

export function useSendTestAlertMutation() {
  return Urql.useMutation<
    SendTestAlertMutation,
    SendTestAlertMutationVariables
  >(SendTestAlertDocument);
}
export const SetDefaultBranchDocument = gql`
  mutation SetDefaultBranch($branch_id: uuid!, $datasource_id: uuid!) {
    update_branches(
      _set: { status: created }
      where: { datasource_id: { _eq: $datasource_id }, status: { _eq: active } }
    ) {
      affected_rows
    }
    update_branches_by_pk(
      _set: { status: active }
      pk_columns: { id: $branch_id }
    ) {
      id
      name
    }
  }
`;

export function useSetDefaultBranchMutation() {
  return Urql.useMutation<
    SetDefaultBranchMutation,
    SetDefaultBranchMutationVariables
  >(SetDefaultBranchDocument);
}
export const ExportDataDocument = gql`
  mutation ExportData($branch_id: String) {
    export_data_models(branch_id: $branch_id) {
      download_url
    }
  }
`;

export function useExportDataMutation() {
  return Urql.useMutation<ExportDataMutation, ExportDataMutationVariables>(
    ExportDataDocument
  );
}
export const CreateBranchDocument = gql`
  mutation CreateBranch($object: branches_insert_input!) {
    insert_branches_one(object: $object) {
      id
    }
  }
`;

export function useCreateBranchMutation() {
  return Urql.useMutation<CreateBranchMutation, CreateBranchMutationVariables>(
    CreateBranchDocument
  );
}
export const CurrentUserDocument = gql`
  query CurrentUser($id: uuid!) {
    users_by_pk(id: $id) {
      id
      display_name
      avatar_url
      account {
        email
      }
      members(order_by: { updated_at: desc }) {
        member_roles {
          team_role
        }
        user {
          id
          avatar_url
          display_name
          account {
            email
          }
        }
        team {
          ...UserTeamFields
        }
      }
    }
  }
  ${UserTeamFieldsFragmentDoc}
`;

export function useCurrentUserQuery(
  options: Omit<Urql.UseQueryArgs<CurrentUserQueryVariables>, "query">
) {
  return Urql.useQuery<CurrentUserQuery, CurrentUserQueryVariables>({
    query: CurrentUserDocument,
    ...options,
  });
}
export const SubCurrentUserDocument = gql`
  subscription SubCurrentUser($id: uuid!) {
    users_by_pk(id: $id) {
      id
      display_name
      avatar_url
      account {
        email
      }
      members(order_by: { updated_at: desc }) {
        id
        user_id
        member_roles {
          id
          team_role
          created_at
          updated_at
          access_list {
            id
            name
            config
          }
        }
        user {
          id
          avatar_url
          display_name
          account {
            email
          }
        }
        team {
          ...UserTeamFields
        }
      }
    }
  }
  ${UserTeamFieldsFragmentDoc}
`;

export function useSubCurrentUserSubscription<
  TData = SubCurrentUserSubscription
>(
  options: Omit<
    Urql.UseSubscriptionArgs<SubCurrentUserSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<SubCurrentUserSubscription, TData>
) {
  return Urql.useSubscription<
    SubCurrentUserSubscription,
    TData,
    SubCurrentUserSubscriptionVariables
  >({ query: SubCurrentUserDocument, ...options }, handler);
}
export const TeamDataDocument = gql`
  query TeamData($team_id: uuid!) {
    teams_by_pk(id: $team_id) {
      ...TeamMembersFields
      datasources(order_by: { updated_at: desc }) {
        id
        name
        db_params_computed
        db_type
        created_at
        updated_at
        branches(
          where: { status: { _in: [active, created] } }
          order_by: { created_at: desc }
        ) {
          ...BranchesFields
        }
        sql_credentials(order_by: { updated_at: desc }) {
          id
          username
          created_at
          updated_at
          user {
            id
            display_name
          }
        }
      }
      alerts(order_by: { created_at: desc }) {
        id
        name
        delivery_type
        delivery_config
        trigger_config
        created_at
        updated_at
        schedule
        user {
          id
          avatar_url
          display_name
          account {
            email
          }
        }
        exploration {
          id
          playground_state
        }
      }
      reports(order_by: { created_at: desc }) {
        id
        name
        schedule
        delivery_type
        delivery_config
        created_at
        updated_at
        user {
          id
          avatar_url
          display_name
          account {
            email
          }
        }
        exploration {
          id
          playground_state
        }
      }
    }
  }
  ${TeamMembersFieldsFragmentDoc}
  ${BranchesFieldsFragmentDoc}
`;

export function useTeamDataQuery(
  options: Omit<Urql.UseQueryArgs<TeamDataQueryVariables>, "query">
) {
  return Urql.useQuery<TeamDataQuery, TeamDataQueryVariables>({
    query: TeamDataDocument,
    ...options,
  });
}
export const SubTeamDataDocument = gql`
  subscription SubTeamData($team_id: uuid!) {
    teams_by_pk(id: $team_id) {
      ...TeamMembersFields
      datasources(order_by: { updated_at: desc }) {
        id
        name
        db_params_computed
        db_type
        created_at
        updated_at
        branches(
          where: { status: { _in: [active, created] } }
          order_by: { created_at: desc }
        ) {
          ...BranchesFields
        }
        sql_credentials {
          id
          username
          created_at
          updated_at
          user {
            id
            display_name
          }
        }
      }
      alerts(order_by: { created_at: desc }) {
        id
        name
        delivery_type
        delivery_config
        trigger_config
        created_at
        updated_at
        schedule
        user {
          id
          avatar_url
          display_name
          account {
            email
          }
        }
        exploration {
          id
          playground_state
        }
      }
      reports(order_by: { created_at: desc }) {
        id
        name
        schedule
        delivery_type
        delivery_config
        created_at
        updated_at
        user {
          id
          avatar_url
          display_name
          account {
            email
          }
        }
        exploration {
          id
          playground_state
        }
      }
    }
  }
  ${TeamMembersFieldsFragmentDoc}
  ${BranchesFieldsFragmentDoc}
`;

export function useSubTeamDataSubscription<TData = SubTeamDataSubscription>(
  options: Omit<
    Urql.UseSubscriptionArgs<SubTeamDataSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<SubTeamDataSubscription, TData>
) {
  return Urql.useSubscription<
    SubTeamDataSubscription,
    TData,
    SubTeamDataSubscriptionVariables
  >({ query: SubTeamDataDocument, ...options }, handler);
}
export const UpdateUserInfoDocument = gql`
  mutation UpdateUserInfo(
    $user_id: uuid!
    $display_name: String
    $email: citext
  ) {
    update_users_by_pk(
      pk_columns: { id: $user_id }
      _set: { display_name: $display_name }
    ) {
      id
    }
    update_auth_accounts(
      where: { user_id: { _eq: $user_id } }
      _set: { email: $email }
    ) {
      affected_rows
    }
  }
`;

export function useUpdateUserInfoMutation() {
  return Urql.useMutation<
    UpdateUserInfoMutation,
    UpdateUserInfoMutationVariables
  >(UpdateUserInfoDocument);
}
export const CreateDataSourceDocument = gql`
  mutation CreateDataSource($object: datasources_insert_input!) {
    insert_datasources_one(object: $object) {
      id
      name
      branches {
        id
      }
      sql_credentials {
        id
      }
    }
  }
`;

export function useCreateDataSourceMutation() {
  return Urql.useMutation<
    CreateDataSourceMutation,
    CreateDataSourceMutationVariables
  >(CreateDataSourceDocument);
}
export const DatasourcesDocument = gql`
  query Datasources(
    $offset: Int
    $limit: Int
    $where: datasources_bool_exp
    $order_by: [datasources_order_by!]
  ) {
    datasources(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
      name
      db_params_computed
      db_type
      created_at
      updated_at
      branches(where: { status: { _eq: active } }) {
        id
      }
      sql_credentials {
        id
        username
        created_at
        updated_at
        user {
          id
          display_name
        }
      }
    }
    datasources_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`;

export function useDatasourcesQuery(
  options?: Omit<Urql.UseQueryArgs<DatasourcesQueryVariables>, "query">
) {
  return Urql.useQuery<DatasourcesQuery, DatasourcesQueryVariables>({
    query: DatasourcesDocument,
    ...options,
  });
}
export const AllDataSourcesDocument = gql`
  subscription AllDataSources(
    $offset: Int
    $limit: Int
    $where: datasources_bool_exp
    $order_by: [datasources_order_by!]
  ) {
    datasources(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
      name
      db_params_computed
      db_type
      created_at
      updated_at
      branches(where: { status: { _eq: active } }) {
        id
      }
      sql_credentials {
        id
        username
        created_at
        updated_at
        user {
          id
          display_name
        }
      }
    }
  }
`;

export function useAllDataSourcesSubscription<
  TData = AllDataSourcesSubscription
>(
  options?: Omit<
    Urql.UseSubscriptionArgs<AllDataSourcesSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<AllDataSourcesSubscription, TData>
) {
  return Urql.useSubscription<
    AllDataSourcesSubscription,
    TData,
    AllDataSourcesSubscriptionVariables
  >({ query: AllDataSourcesDocument, ...options }, handler);
}
export const FetchTablesDocument = gql`
  query FetchTables($id: uuid!) {
    fetch_tables(datasource_id: $id) {
      schema
    }
  }
`;

export function useFetchTablesQuery(
  options: Omit<Urql.UseQueryArgs<FetchTablesQueryVariables>, "query">
) {
  return Urql.useQuery<FetchTablesQuery, FetchTablesQueryVariables>({
    query: FetchTablesDocument,
    ...options,
  });
}
export const FetchMetaDocument = gql`
  query FetchMeta($datasource_id: uuid!, $branch_id: uuid) {
    fetch_meta(datasource_id: $datasource_id, branch_id: $branch_id) {
      cubes
    }
  }
`;

export function useFetchMetaQuery(
  options: Omit<Urql.UseQueryArgs<FetchMetaQueryVariables>, "query">
) {
  return Urql.useQuery<FetchMetaQuery, FetchMetaQueryVariables>({
    query: FetchMetaDocument,
    ...options,
  });
}
export const CurrentDataSourceDocument = gql`
  query CurrentDataSource($id: uuid!) {
    datasources_by_pk(id: $id) {
      id
      name
      db_type
      db_params_computed
      created_at
      updated_at
    }
  }
`;

export function useCurrentDataSourceQuery(
  options: Omit<Urql.UseQueryArgs<CurrentDataSourceQueryVariables>, "query">
) {
  return Urql.useQuery<CurrentDataSourceQuery, CurrentDataSourceQueryVariables>(
    { query: CurrentDataSourceDocument, ...options }
  );
}
export const UpdateDataSourceDocument = gql`
  mutation UpdateDataSource(
    $pk_columns: datasources_pk_columns_input!
    $_set: datasources_set_input!
  ) {
    update_datasources_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
      branches(where: { status: { _eq: active } }) {
        id
      }
    }
  }
`;

export function useUpdateDataSourceMutation() {
  return Urql.useMutation<
    UpdateDataSourceMutation,
    UpdateDataSourceMutationVariables
  >(UpdateDataSourceDocument);
}
export const CheckConnectionDocument = gql`
  mutation CheckConnection($id: uuid!) {
    check_connection(datasource_id: $id) {
      message
      code
    }
  }
`;

export function useCheckConnectionMutation() {
  return Urql.useMutation<
    CheckConnectionMutation,
    CheckConnectionMutationVariables
  >(CheckConnectionDocument);
}
export const DeleteDataSourceDocument = gql`
  mutation DeleteDataSource($id: uuid!) {
    delete_datasources_by_pk(id: $id) {
      id
    }
  }
`;

export function useDeleteDataSourceMutation() {
  return Urql.useMutation<
    DeleteDataSourceMutation,
    DeleteDataSourceMutationVariables
  >(DeleteDataSourceDocument);
}
export const GenDataSchemasDocument = gql`
  mutation GenDataSchemas(
    $datasource_id: uuid!
    $branch_id: uuid!
    $tables: [SourceTable!]!
    $overwrite: Boolean
    $format: String
  ) {
    gen_dataschemas(
      datasource_id: $datasource_id
      branch_id: $branch_id
      tables: $tables
      overwrite: $overwrite
      format: $format
    ) {
      code
      message
    }
  }
`;

export function useGenDataSchemasMutation() {
  return Urql.useMutation<
    GenDataSchemasMutation,
    GenDataSchemasMutationVariables
  >(GenDataSchemasDocument);
}
export const RunSourceSqlQueryDocument = gql`
  mutation RunSourceSQLQuery(
    $datasource_id: uuid!
    $query: String!
    $limit: Int!
  ) {
    run_query(datasource_id: $datasource_id, query: $query, limit: $limit) {
      result
    }
  }
`;

export function useRunSourceSqlQueryMutation() {
  return Urql.useMutation<
    RunSourceSqlQueryMutation,
    RunSourceSqlQueryMutationVariables
  >(RunSourceSqlQueryDocument);
}
export const CreateExplorationDocument = gql`
  mutation CreateExploration($object: explorations_insert_input!) {
    insert_explorations_one(object: $object) {
      id
    }
  }
`;

export function useCreateExplorationMutation() {
  return Urql.useMutation<
    CreateExplorationMutation,
    CreateExplorationMutationVariables
  >(CreateExplorationDocument);
}
export const GenSqlDocument = gql`
  mutation GenSQL($exploration_id: uuid!) {
    gen_sql(exploration_id: $exploration_id) {
      result
    }
  }
`;

export function useGenSqlMutation() {
  return Urql.useMutation<GenSqlMutation, GenSqlMutationVariables>(
    GenSqlDocument
  );
}
export const CurrentExplorationDocument = gql`
  query CurrentExploration($id: uuid!, $offset: Int, $limit: Int) {
    explorations_by_pk(id: $id) {
      id
      branch_id
      datasource_id
      playground_state
      playground_settings
      created_at
      updated_at
    }
    fetch_dataset(exploration_id: $id, offset: $offset, limit: $limit) {
      annotation
      data
      query
      progress
      hitLimit
    }
  }
`;

export function useCurrentExplorationQuery(
  options: Omit<Urql.UseQueryArgs<CurrentExplorationQueryVariables>, "query">
) {
  return Urql.useQuery<
    CurrentExplorationQuery,
    CurrentExplorationQueryVariables
  >({ query: CurrentExplorationDocument, ...options });
}
export const MembersDocument = gql`
  query Members(
    $offset: Int
    $limit: Int
    $where: members_bool_exp
    $order_by: [members_order_by!]
  ) {
    members(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
      user {
        id
        display_name
        account {
          email
        }
      }
      member_roles {
        id
        team_role
        access_list {
          id
          name
        }
        updated_at
        created_at
      }
      updated_at
      created_at
    }
  }
`;

export function useMembersQuery(
  options?: Omit<Urql.UseQueryArgs<MembersQueryVariables>, "query">
) {
  return Urql.useQuery<MembersQuery, MembersQueryVariables>({
    query: MembersDocument,
    ...options,
  });
}
export const UpdateMemberDocument = gql`
  mutation UpdateMember(
    $pk_columns: members_pk_columns_input!
    $_set: members_set_input!
  ) {
    update_members_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
    }
  }
`;

export function useUpdateMemberMutation() {
  return Urql.useMutation<UpdateMemberMutation, UpdateMemberMutationVariables>(
    UpdateMemberDocument
  );
}
export const UpdateMemberRoleDocument = gql`
  mutation UpdateMemberRole(
    $pk_columns: member_roles_pk_columns_input!
    $_set: member_roles_set_input!
  ) {
    update_member_roles_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
    }
  }
`;

export function useUpdateMemberRoleMutation() {
  return Urql.useMutation<
    UpdateMemberRoleMutation,
    UpdateMemberRoleMutationVariables
  >(UpdateMemberRoleDocument);
}
export const DeleteMemberDocument = gql`
  mutation DeleteMember($id: uuid!) {
    delete_members_by_pk(id: $id) {
      id
    }
  }
`;

export function useDeleteMemberMutation() {
  return Urql.useMutation<DeleteMemberMutation, DeleteMemberMutationVariables>(
    DeleteMemberDocument
  );
}
export const InviteMemberDocument = gql`
  mutation InviteMember(
    $email: String!
    $teamId: uuid!
    $role: String
    $magicLink: Boolean
  ) {
    invite_team_member(
      email: $email
      teamId: $teamId
      role: $role
      magicLink: $magicLink
    ) {
      memberId
    }
  }
`;

export function useInviteMemberMutation() {
  return Urql.useMutation<InviteMemberMutation, InviteMemberMutationVariables>(
    InviteMemberDocument
  );
}
export const CurrentLogDocument = gql`
  query CurrentLog($id: uuid!) {
    request_logs_by_pk(id: $id) {
      ...DefaultFields
      end_time
      request_id
      updated_at
      request_event_logs(order_by: { timestamp: desc }) {
        id
        duration
        event
        path
        query
        query_key
        query_sql
        query_key_md5
        queue_prefix
        time_in_queue
        timestamp
        error
      }
    }
  }
  ${DefaultFieldsFragmentDoc}
`;

export function useCurrentLogQuery(
  options: Omit<Urql.UseQueryArgs<CurrentLogQueryVariables>, "query">
) {
  return Urql.useQuery<CurrentLogQuery, CurrentLogQueryVariables>({
    query: CurrentLogDocument,
    ...options,
  });
}
export const AllLogsDocument = gql`
  query AllLogs(
    $offset: Int
    $limit: Int
    $where: request_logs_bool_exp
    $order_by: [request_logs_order_by!]
  ) {
    request_logs(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      ...DefaultFields
      request_event_logs_aggregate {
        aggregate {
          count
        }
      }
    }
    request_logs_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
  ${DefaultFieldsFragmentDoc}
`;

export function useAllLogsQuery(
  options?: Omit<Urql.UseQueryArgs<AllLogsQueryVariables>, "query">
) {
  return Urql.useQuery<AllLogsQuery, AllLogsQueryVariables>({
    query: AllLogsDocument,
    ...options,
  });
}
export const SubAllLogsDocument = gql`
  subscription SubAllLogs(
    $offset: Int
    $limit: Int
    $where: request_logs_bool_exp
    $order_by: [request_logs_order_by!]
  ) {
    request_logs(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
    }
  }
`;

export function useSubAllLogsSubscription<TData = SubAllLogsSubscription>(
  options?: Omit<
    Urql.UseSubscriptionArgs<SubAllLogsSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<SubAllLogsSubscription, TData>
) {
  return Urql.useSubscription<
    SubAllLogsSubscription,
    TData,
    SubAllLogsSubscriptionVariables
  >({ query: SubAllLogsDocument, ...options }, handler);
}
export const CreateReportDocument = gql`
  mutation CreateReport($object: reports_insert_input!) {
    insert_reports_one(object: $object) {
      id
    }
  }
`;

export function useCreateReportMutation() {
  return Urql.useMutation<CreateReportMutation, CreateReportMutationVariables>(
    CreateReportDocument
  );
}
export const UpdateReportDocument = gql`
  mutation UpdateReport(
    $pk_columns: reports_pk_columns_input!
    $_set: reports_set_input!
  ) {
    update_reports_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
    }
  }
`;

export function useUpdateReportMutation() {
  return Urql.useMutation<UpdateReportMutation, UpdateReportMutationVariables>(
    UpdateReportDocument
  );
}
export const DeleteReportDocument = gql`
  mutation DeleteReport($id: uuid!) {
    delete_reports_by_pk(id: $id) {
      id
    }
  }
`;

export function useDeleteReportMutation() {
  return Urql.useMutation<DeleteReportMutation, DeleteReportMutationVariables>(
    DeleteReportDocument
  );
}
export const AllSchemasDocument = gql`
  subscription AllSchemas(
    $offset: Int
    $limit: Int
    $where: dataschemas_bool_exp
    $order_by: [dataschemas_order_by!]
  ) {
    dataschemas(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
      user_id
      name
      checksum
      datasource {
        team_id
      }
    }
  }
`;

export function useAllSchemasSubscription<TData = AllSchemasSubscription>(
  options?: Omit<
    Urql.UseSubscriptionArgs<AllSchemasSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<AllSchemasSubscription, TData>
) {
  return Urql.useSubscription<
    AllSchemasSubscription,
    TData,
    AllSchemasSubscriptionVariables
  >({ query: AllSchemasDocument, ...options }, handler);
}
export const AllDataSchemasDocument = gql`
  query AllDataSchemas(
    $offset: Int
    $limit: Int
    $where: branches_bool_exp
    $order_by: [branches_order_by!]
  ) {
    branches(
      offset: $offset
      limit: $limit
      where: $where
      order_by: $order_by
    ) {
      id
      name
      status
      versions(order_by: { created_at: desc }) {
        id
        checksum
        created_at
        updated_at
        user {
          display_name
        }
        dataschemas {
          id
          name
          code
          created_at
          updated_at
          datasource_id
        }
      }
    }
  }
`;

export function useAllDataSchemasQuery(
  options?: Omit<Urql.UseQueryArgs<AllDataSchemasQueryVariables>, "query">
) {
  return Urql.useQuery<AllDataSchemasQuery, AllDataSchemasQueryVariables>({
    query: AllDataSchemasDocument,
    ...options,
  });
}
export const DeleteSchemaDocument = gql`
  mutation DeleteSchema($id: uuid!) {
    update_branches_by_pk(_set: { status: archived }, pk_columns: { id: $id }) {
      id
    }
  }
`;

export function useDeleteSchemaMutation() {
  return Urql.useMutation<DeleteSchemaMutation, DeleteSchemaMutationVariables>(
    DeleteSchemaDocument
  );
}
export const CredentialsDocument = gql`
  query Credentials($teamId: uuid!) {
    sql_credentials(
      where: { datasource: { team_id: { _eq: $teamId } } }
      order_by: { created_at: desc }
    ) {
      id
      username
      created_at
      user {
        id
        display_name
      }
      datasource {
        id
        name
        db_type
        db_params_computed
      }
    }
  }
`;

export function useCredentialsQuery(
  options: Omit<Urql.UseQueryArgs<CredentialsQueryVariables>, "query">
) {
  return Urql.useQuery<CredentialsQuery, CredentialsQueryVariables>({
    query: CredentialsDocument,
    ...options,
  });
}
export const SubCredentialsDocument = gql`
  subscription SubCredentials($teamId: uuid!) {
    sql_credentials(where: { datasource: { team_id: { _eq: $teamId } } }) {
      id
    }
  }
`;

export function useSubCredentialsSubscription<
  TData = SubCredentialsSubscription
>(
  options: Omit<
    Urql.UseSubscriptionArgs<SubCredentialsSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<SubCredentialsSubscription, TData>
) {
  return Urql.useSubscription<
    SubCredentialsSubscription,
    TData,
    SubCredentialsSubscriptionVariables
  >({ query: SubCredentialsDocument, ...options }, handler);
}
export const InsertSqlCredentialsDocument = gql`
  mutation InsertSqlCredentials($object: sql_credentials_insert_input!) {
    insert_sql_credentials_one(object: $object) {
      id
    }
  }
`;

export function useInsertSqlCredentialsMutation() {
  return Urql.useMutation<
    InsertSqlCredentialsMutation,
    InsertSqlCredentialsMutationVariables
  >(InsertSqlCredentialsDocument);
}
export const DeleteCredentialsDocument = gql`
  mutation DeleteCredentials($id: uuid!) {
    delete_sql_credentials_by_pk(id: $id) {
      id
    }
  }
`;

export function useDeleteCredentialsMutation() {
  return Urql.useMutation<
    DeleteCredentialsMutation,
    DeleteCredentialsMutationVariables
  >(DeleteCredentialsDocument);
}
export const CreateTeamDocument = gql`
  mutation CreateTeam($name: String!) {
    create_team(name: $name) {
      id
      name
    }
  }
`;

export function useCreateTeamMutation() {
  return Urql.useMutation<CreateTeamMutation, CreateTeamMutationVariables>(
    CreateTeamDocument
  );
}
export const EditTeamDocument = gql`
  mutation EditTeam(
    $pk_columns: teams_pk_columns_input!
    $_set: teams_set_input!
  ) {
    update_teams_by_pk(pk_columns: $pk_columns, _set: $_set) {
      id
      name
    }
  }
`;

export function useEditTeamMutation() {
  return Urql.useMutation<EditTeamMutation, EditTeamMutationVariables>(
    EditTeamDocument
  );
}
export const DeleteTeamDocument = gql`
  mutation DeleteTeam($id: uuid!) {
    delete_teams_by_pk(id: $id) {
      id
    }
  }
`;

export function useDeleteTeamMutation() {
  return Urql.useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(
    DeleteTeamDocument
  );
}
export const CurrentTeamDocument = gql`
  query CurrentTeam($id: uuid!) {
    teams_by_pk(id: $id) {
      id
      created_at
      updated_at
      members {
        user {
          display_name
        }
      }
    }
  }
`;

export function useCurrentTeamQuery(
  options: Omit<Urql.UseQueryArgs<CurrentTeamQueryVariables>, "query">
) {
  return Urql.useQuery<CurrentTeamQuery, CurrentTeamQueryVariables>({
    query: CurrentTeamDocument,
    ...options,
  });
}
export const GetUsersDocument = gql`
  query GetUsers {
    users {
      id
    }
  }
`;

export function useGetUsersQuery(
  options?: Omit<Urql.UseQueryArgs<GetUsersQueryVariables>, "query">
) {
  return Urql.useQuery<GetUsersQuery, GetUsersQueryVariables>({
    query: GetUsersDocument,
    ...options,
  });
}
export const VersionDocDocument = gql`
  subscription VersionDoc($id: uuid!) {
    versions_by_pk(id: $id) {
      markdown_doc
    }
  }
`;

export function useVersionDocSubscription<TData = VersionDocSubscription>(
  options: Omit<
    Urql.UseSubscriptionArgs<VersionDocSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<VersionDocSubscription, TData>
) {
  return Urql.useSubscription<
    VersionDocSubscription,
    TData,
    VersionDocSubscriptionVariables
  >({ query: VersionDocDocument, ...options }, handler);
}
export const CreateVersionDocument = gql`
  mutation CreateVersion($object: versions_insert_input!) {
    insert_versions_one(object: $object) {
      id
    }
  }
`;

export function useCreateVersionMutation() {
  return Urql.useMutation<
    CreateVersionMutation,
    CreateVersionMutationVariables
  >(CreateVersionDocument);
}
export const VersionByBranchIdDocument = gql`
  query versionByBranchId($branch_id: uuid!, $limit: Int, $offset: Int) {
    versions(
      limit: $limit
      offset: $offset
      order_by: { created_at: desc }
      where: { branch_id: { _eq: $branch_id } }
    ) {
      id
      checksum
      updated_at
      created_at
      user {
        display_name
      }
      dataschemas(order_by: { name: asc }) {
        created_at
        updated_at
        datasource_id
        id
        user_id
        name
        code
        checksum
      }
    }
    versions_aggregate(where: { branch_id: { _eq: $branch_id } }) {
      aggregate {
        count
      }
    }
  }
`;

export function useVersionByBranchIdQuery(
  options: Omit<Urql.UseQueryArgs<VersionByBranchIdQueryVariables>, "query">
) {
  return Urql.useQuery<VersionByBranchIdQuery, VersionByBranchIdQueryVariables>(
    { query: VersionByBranchIdDocument, ...options }
  );
}
export const CurrentVersionDocument = gql`
  query CurrentVersion($branch_id: uuid!) {
    versions(
      limit: 1
      offset: 0
      order_by: { created_at: desc }
      where: { branch_id: { _eq: $branch_id } }
    ) {
      id
      checksum
      dataschemas(order_by: { name: asc }) {
        created_at
        updated_at
        datasource_id
        id
        user_id
        name
        code
        checksum
      }
    }
  }
`;

export function useCurrentVersionQuery(
  options: Omit<Urql.UseQueryArgs<CurrentVersionQueryVariables>, "query">
) {
  return Urql.useQuery<CurrentVersionQuery, CurrentVersionQueryVariables>({
    query: CurrentVersionDocument,
    ...options,
  });
}
export const VersionsCountDocument = gql`
  subscription VersionsCount($branch_id: uuid!) {
    versions_aggregate(where: { branch_id: { _eq: $branch_id } }) {
      aggregate {
        count
      }
    }
  }
`;

export function useVersionsCountSubscription<TData = VersionsCountSubscription>(
  options: Omit<
    Urql.UseSubscriptionArgs<VersionsCountSubscriptionVariables>,
    "query"
  >,
  handler?: Urql.SubscriptionHandler<VersionsCountSubscription, TData>
) {
  return Urql.useSubscription<
    VersionsCountSubscription,
    TData,
    VersionsCountSubscriptionVariables
  >({ query: VersionsCountDocument, ...options }, handler);
}
export const namedOperations = {
  Query: {
    AllAccessLists: "AllAccessLists",
    AccessList: "AccessList",
    CurrentUser: "CurrentUser",
    TeamData: "TeamData",
    Datasources: "Datasources",
    FetchTables: "FetchTables",
    FetchMeta: "FetchMeta",
    CurrentDataSource: "CurrentDataSource",
    CurrentExploration: "CurrentExploration",
    Members: "Members",
    CurrentLog: "CurrentLog",
    AllLogs: "AllLogs",
    AllDataSchemas: "AllDataSchemas",
    Credentials: "Credentials",
    CurrentTeam: "CurrentTeam",
    GetUsers: "GetUsers",
    versionByBranchId: "versionByBranchId",
    CurrentVersion: "CurrentVersion",
  },
  Mutation: {
    UpdateAccessList: "UpdateAccessList",
    DeleteAccessList: "DeleteAccessList",
    CreateAccessList: "CreateAccessList",
    CreateAlert: "CreateAlert",
    UpdateAlert: "UpdateAlert",
    DeleteAlert: "DeleteAlert",
    SendTestAlert: "SendTestAlert",
    SetDefaultBranch: "SetDefaultBranch",
    ExportData: "ExportData",
    CreateBranch: "CreateBranch",
    UpdateUserInfo: "UpdateUserInfo",
    CreateDataSource: "CreateDataSource",
    UpdateDataSource: "UpdateDataSource",
    CheckConnection: "CheckConnection",
    DeleteDataSource: "DeleteDataSource",
    GenDataSchemas: "GenDataSchemas",
    RunSourceSQLQuery: "RunSourceSQLQuery",
    CreateExploration: "CreateExploration",
    GenSQL: "GenSQL",
    UpdateMember: "UpdateMember",
    UpdateMemberRole: "UpdateMemberRole",
    DeleteMember: "DeleteMember",
    InviteMember: "InviteMember",
    CreateReport: "CreateReport",
    UpdateReport: "UpdateReport",
    DeleteReport: "DeleteReport",
    DeleteSchema: "DeleteSchema",
    InsertSqlCredentials: "InsertSqlCredentials",
    DeleteCredentials: "DeleteCredentials",
    CreateTeam: "CreateTeam",
    EditTeam: "EditTeam",
    DeleteTeam: "DeleteTeam",
    CreateVersion: "CreateVersion",
  },
  Subscription: {
    SubAccessLists: "SubAccessLists",
    SubCurrentUser: "SubCurrentUser",
    SubTeamData: "SubTeamData",
    AllDataSources: "AllDataSources",
    SubAllLogs: "SubAllLogs",
    AllSchemas: "AllSchemas",
    SubCredentials: "SubCredentials",
    VersionDoc: "VersionDoc",
    VersionsCount: "VersionsCount",
  },
  Fragment: {
    BranchesFields: "BranchesFields",
    UserTeamFields: "UserTeamFields",
    TeamMembersFields: "TeamMembersFields",
    DefaultFields: "DefaultFields",
  },
};
