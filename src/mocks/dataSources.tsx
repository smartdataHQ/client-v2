import type { DataSourceInfo, DataSoureSetupField } from "@/types/dataSource";
import { Branch_Statuses_Enum } from "@/graphql/generated";

import Postgres from "@/assets/databases/postgre.svg";
import Mysql from "@/assets/databases/my-sql.svg";
import Mongo from "@/assets/databases/mongo.svg";
import ClickHouse from "@/assets/databases/click-house.svg";
import Redshift from "@/assets/databases/redshift.svg";
import Bigquery from "@/assets/databases/big-query.svg";
import Trino from "@/assets/databases/trino.svg";
import Mssql from "@/assets/databases/ms-sql.svg";
import Druid from "@/assets/databases/druid.svg";
import Elasticsearch from "@/assets/databases/elastic-search.svg";
import Presto from "@/assets/databases/presto.svg";
import Databricks from "@/assets/databases/databricks.svg";
import Firebolt from "@/assets/databases/firebolt.svg";
import Ksql from "@/assets/databases/ksql.svg";
import Dremio from "@/assets/databases/dremio.svg";
import Crate from "@/assets/databases/crate.svg";
import Quest from "@/assets/databases/quest.svg";
import Snowflake from "@/assets/databases/snowflake.svg";
import Materialize from "@/assets/databases/materialize.svg";
import Vertica from "@/assets/databases/vertica.svg";
import Athena from "@/assets/databases/athena.svg";
import Hive from "@/assets/databases/hive.svg";
import DuckDB from "@/assets/databases/duckdb.svg";
import Oracle from "@/assets/databases/oracle.svg";
import SQLite from "@/assets/databases/sqlite.svg";
import Pinot from "@/assets/databases/pinot.svg";

export const dataSourcesMock: DataSourceInfo[] = [
  {
    id: "35c549a8-c38a-4ff1-90a5-b3081a35aa93",
    name: "github.demo.altinity.cloud",
    dbParams: {
      ssl: true,
      host: "github.demo.altinity.cloud",
      port: "8443",
      user: "demo",
      database: "default",
      password: "demo",
    },
    createdAt: "2021-09-09T11:52:58.347143+00:00",
    updatedAt: "2023-08-25T07:04:44.238898+00:00",
    type: {
      name: "ClickHouse",
      value: "clickhouse",
      icon: { key: null, ref: null, props: {}, _owner: null, _store: {} },
    },
    branches: [
      {
        id: "0630a814-c97d-47c1-8330-1831031dd44a",
        name: "Default branch",
        status: Branch_Statuses_Enum.Active,
      },
      {
        id: "12305404-7167-4e54-88ae-a073eadf6f95",
        name: "New branch",
        status: Branch_Statuses_Enum.Created,
      },
    ],
  },
  {
    id: "d6ac8421-57a6-41a8-a8cb-d1cb416146eb",
    name: "gh-api.clickhouse.tech (Yandex Demo)",
    dbParams: {
      ssl: true,
      host: "gh-api.clickhouse.tech",
      port: "443",
      user: "play",
      database: "default",
    },
    createdAt: "2021-09-30T08:49:58.660791+00:00",
    updatedAt: "2023-08-25T11:01:50.311173+00:00",
    type: {
      name: "ClickHouse",
      value: "clickhouse",
      icon: { key: null, ref: null, props: {}, _owner: null, _store: {} },
    },
    branches: [
      {
        id: "56a3bd18-4191-406d-b26c-de22c622844f",
        name: "Default branch",
        status: Branch_Statuses_Enum.Active,
      },
      {
        id: "abf9cb43-7801-406a-a4d2-48c020f49ac2",
        name: "New branch",
        status: Branch_Statuses_Enum.Created,
      },
    ],
  },
  {
    id: "7d7eea55-ad47-4456-8a1b-badef7cf7270",
    name: "Ecom (demo db)",
    dbParams: {
      host: "demo-db.cube.dev",
      port: "5432",
      user: "cube",
      database: "ecom",
      password: "12345",
    },
    createdAt: "2023-05-05T16:17:29.337004+00:00",
    updatedAt: "2023-10-07T05:38:58.088981+00:00",
    type: {
      name: "Postgres",
      value: "postgres",
      icon: { key: null, ref: null, props: {}, _owner: null, _store: {} },
    },
    branches: [
      {
        id: "a38906c5-f8af-41f3-9af6-c6ce0925484a",
        name: "Default branch",
        status: Branch_Statuses_Enum.Active,
      },
      {
        id: "4142faf4-a1ee-4d77-a5e4-5476e1054916",
        name: "New branch",
        status: Branch_Statuses_Enum.Created,
      },
    ],
  },
];

export const dbTiles = [
  { name: "Postgres", value: "postgres", icon: <Postgres /> },
  { name: "MySQL", value: "mysql", icon: <Mysql /> },
  { name: "Mongo DB", value: "mongobi", icon: <Mongo /> },
  { name: "ClickHouse", value: "clickhouse", icon: <ClickHouse /> },
  { name: "Redshift", value: "redshift", icon: <Redshift /> },
  { name: "BigQuery", value: "bigquery", icon: <Bigquery /> },
  { name: "Trino", value: "trino", icon: <Trino /> },
  { name: "MSSQL", value: "mssql", icon: <Mssql /> },
  { name: "DRUID", value: "druid", icon: <Druid /> },
  {
    name: "ElasticSearch",
    value: "elasticsearch",
    icon: <Elasticsearch />,
    deprecated: true,
  },
  { name: "PrestoDB", value: "prestodb", icon: <Presto /> },
  { name: "Databricks", value: "databricks-jdbc", icon: <Databricks /> },
  { name: "Firebolt", value: "firebolt", icon: <Firebolt /> },
  { name: "KSQL", value: "ksql", icon: <Ksql /> },
  { name: "Dremio", value: "dremio", icon: <Dremio /> },
  { name: "Crate", value: "crate", icon: <Crate /> },
  { name: "QuestDB", value: "questdb", icon: <Quest /> },
  { name: "Snowflake", value: "snowflake", icon: <Snowflake /> },
  { name: "Materialize", value: "materialize", icon: <Materialize /> },
  { name: "Vertica", value: "vertica", icon: <Vertica /> },
  { name: "Athena", value: "athena", icon: <Athena /> },
  { name: "Hive", value: "hive", icon: <Hive /> },
  { name: "DuckDB", value: "duckdb", icon: <DuckDB /> },
  { name: "Oracle", value: "oracle", icon: <Oracle /> },
  { name: "SQLite", value: "sqlite", icon: <SQLite /> },
  { name: "Apache Pinot", value: "pinot", icon: <Pinot /> },
];

export const defaultForm: DataSoureSetupField[] = [
  {
    name: "db_params.database",
    label: "db_name",
    rules: {
      required: true,
    },
    placeholder: "db_name",
    type: "text",
  },
  {
    name: "db_params.host",
    label: "host",
    rules: {
      required: true,
    },
    placeholder: "db1.ao.us-west-1.rds.amazonaws.com",
    type: "text",
  },
  {
    name: "db_params.port",
    label: "port",
    rules: {
      required: true,
    },
    placeholder: "5432",
    type: "number",
  },
  {
    name: "db_params.user",
    label: "user",
    rules: {
      required: true,
    },
    placeholder: "db_username",
    type: "text",
  },
  {
    name: "db_params.password",
    label: "password",
    rules: {
      required: false,
    },
    placeholder: "db_password",
    type: "password",
  },
  {
    name: "db_params.ssl",
    label: "use_ssl",
    value: "yes",
    placeholder: "use_ssl",
    type: "checkbox",
  },
];

type Form = Record<string, DataSoureSetupField[]>;

export const dataSourceForms: Form = {
  default: defaultForm,
  bigquery: [
    {
      name: "db_params.keyFile",
      label: "key_file",
      rules: {
        required: true,
      },
      placeholder: "attach_file_credentials",
      type: "file",
    },
    {
      name: "db_params.projectId",
      label: "project_id",
      rules: {
        required: true,
      },
      type: "text",
    },
  ],
  mongobi: [
    ...defaultForm,
    {
      name: "db_params.ca",
      label: "ssl_ca",
      type: "text",
    },
    {
      name: "db_params.cert",
      label: "ssl_cert",
      type: "text",
    },
    {
      name: "db_params.ciphers",
      label: "ssl_ciphers",
      type: "text",
    },
    {
      name: "db_params.passphrase",
      label: "ssl_passphrase",
      type: "text",
    },
  ],
  elasticsearch: [
    {
      name: "db_params.url",
      label: "url",
      rules: {
        required: true,
      },
      type: "text",
    },
    {
      name: "db_params.username",
      label: "user",
      type: "text",
    },
    {
      name: "db_params.password",
      label: "password",
      type: "password",
    },
    {
      name: "db_params.apiId",
      label: "api_id",
      type: "text",
    },
    {
      name: "db_params.apiKey",
      label: "api_key",
      type: "text",
    },
    {
      name: "db_params.ssl",
      label: "use_ssl",
      value: "yes",
      placeholder: "use_ssl",
      type: "checkbox",
    },
  ],
  druid: [
    {
      name: "db_params.host",
      label: "host",
      rules: {
        required: true,
      },
      placeholder: "example.com",
      type: "text",
    },
    {
      name: "db_params.port",
      label: "port",
      rules: {
        required: true,
      },
      placeholder: "8082",
      type: "number",
    },
    {
      name: "db_params.user",
      label: "user",
      rules: {
        required: false,
      },
      placeholder: "username",
      type: "text",
    },
    {
      name: "db_params.password",
      label: "password",
      rules: {
        required: false,
      },
      placeholder: "password",
      type: "password",
    },
  ],
  prestodb: [
    {
      name: "db_params.host",
      label: "host",
      rules: {
        required: true,
      },
      placeholder: "example.com",
      type: "text",
    },
    {
      name: "db_params.port",
      label: "port",
      rules: {
        required: true,
      },
      placeholder: "8080",
      type: "number",
    },
    {
      name: "db_params.catalog",
      label: "catalog",
      rules: {
        required: true,
      },
      placeholder: "catalog_name",
      type: "text",
    },
    {
      name: "db_params.schema",
      label: "schema",
      rules: {
        required: false,
      },
      placeholder: "schema",
      type: "text",
    },
    {
      name: "db_params.user",
      label: "user",
      rules: {
        required: false,
      },
      placeholder: "db_username",
    },
    {
      name: "db_params.pass",
      label: "password",
      rules: {
        required: false,
      },
      placeholder: "db_password",
      type: "password",
    },
    {
      name: "db_params.ssl",
      label: "use_ssl",
      value: "yes",
      type: "checkbox",
    },
  ],
  trino: [
    {
      name: "db_params.host",
      label: "host",
      rules: {
        required: true,
      },
      placeholder: "example.com",
      type: "text",
    },
    {
      name: "db_params.port",
      label: "port",
      rules: {
        required: true,
      },
      placeholder: "8080",
      type: "number",
    },
    {
      name: "db_params.catalog",
      label: "catalog",
      rules: {
        required: true,
      },
      placeholder: "catalog_name",
      type: "text",
    },
    {
      name: "db_params.schema",
      label: "schema",
      rules: {
        required: false,
      },
      placeholder: "schema",
      type: "text",
    },
    {
      name: "db_params.user",
      label: "user",
      rules: {
        required: false,
      },
      placeholder: "db_username",
    },
    {
      name: "db_params.pass",
      label: "password",
      rules: {
        required: false,
      },
      placeholder: "db_password",
      type: "password",
    },
    {
      name: "db_params.ssl",
      label: "use_ssl",
      value: "yes",
      type: "checkbox",
    },
  ],
  snowflake: [
    {
      name: "db_params.database",
      label: "db_name",
      rules: {
        required: true,
      },
      placeholder: "SNOWFLAKE",
      type: "text",
    },
    {
      name: "db_params.warehouse",
      label: "warehouse",
      rules: {
        required: true,
      },
      placeholder: "MY_WAREHOUSE",
      type: "text",
    },
    {
      name: "db_params.orgId",
      label: "organization_id",
      rules: {
        required: true,
      },
      placeholder: "ABCDEF",
      type: "text",
    },
    {
      name: "db_params.accountId",
      label: "account_id",
      rules: {
        required: true,
      },
      placeholder: "AB12345",
      type: "text",
    },
    {
      name: "db_params.authMethod",
      label: "authentication_method",
      type: "radio",
      value: "password",
      options: [
        { label: "Username/Password", value: "password" },
        { label: "OAuth Token", value: "oauth" },
      ],
    },
    {
      name: "db_params.username",
      label: "username",
      rules: {
        required: true,
      },
      placeholder: "user",
      type: "text",
      dependsOn: { field: "db_params.authMethod", value: "password" },
    },
    {
      name: "db_params.password",
      label: "password",
      rules: {
        required: true,
      },
      placeholder: "pass",
      type: "password",
      dependsOn: { field: "db_params.authMethod", value: "password" },
    },
    {
      name: "db_params.oauthToken",
      label: "oauth_token",
      rules: {
        required: true,
      },
      placeholder: "OAuth token",
      type: "password",
      dependsOn: { field: "db_params.authMethod", value: "oauth" },
    },
    {
      name: "db_params.role",
      label: "role",
      rules: {
        required: true,
      },
      placeholder: "PUBLIC",
      type: "text",
    },
  ],
  questdb: [
    {
      name: "db_params.database",
      label: "db_name",
      rules: {
        required: false,
      },
      placeholder: "db_name",
      type: "text",
    },
    {
      name: "db_params.host",
      label: "host",
      rules: {
        required: true,
      },
      placeholder: "db1.ao.us-west-1.rds.amazonaws.com",
      type: "text",
    },
    {
      name: "db_params.port",
      label: "port",
      rules: {
        required: true,
      },
      placeholder: "5432",
      type: "number",
    },
    {
      name: "db_params.user",
      label: "user",
      rules: {
        required: false,
      },
      placeholder: "db_username",
      type: "text",
    },
    {
      name: "db_params.password",
      label: "password",
      rules: {
        required: false,
      },
      placeholder: "db_password",
      type: "password",
    },
    {
      name: "db_params.ssl",
      label: "use_ssl",
      value: "yes",
      type: "checkbox",
    },
  ],
  firebolt: [
    {
      name: "db_params.database",
      label: "db_name",
      rules: {
        required: true,
      },
      placeholder: "db_name",
      type: "text",
    },
    {
      name: "db_params.username",
      label: "username",
      rules: {
        required: false,
      },
      placeholder: "user",
      type: "text",
    },
    {
      name: "db_params.password",
      label: "password",
      rules: {
        required: false,
      },
      placeholder: "pass",
      type: "password",
    },
    {
      name: "db_params.engineName",
      label: "engine_name",
      rules: {
        required: false,
      },
      type: "text",
    },
    {
      name: "db_params.apiEndpoint",
      label: "api_endpoint",
      rules: {
        required: false,
      },
      placeholder: "api.dev.firebolt.io, api.app.firebolt.io",
      type: "text",
    },
  ],
  "databricks-jdbc": [
    {
      name: "db_params.authMethod",
      label: "authentication_method",
      type: "radio",
      value: "pat",
      options: [
        { label: "Personal Access Token", value: "pat" },
        { label: "OAuth Service Principal", value: "oauth" },
      ],
    },
    {
      name: "db_params.token",
      label: "access_token",
      rules: {
        required: true,
      },
      type: "text",
      dependsOn: { field: "db_params.authMethod", value: "pat" },
    },
    {
      name: "db_params.oauthClientId",
      label: "client_id",
      rules: {
        required: true,
      },
      placeholder: "OAuth Client ID",
      type: "text",
      dependsOn: { field: "db_params.authMethod", value: "oauth" },
    },
    {
      name: "db_params.oauthClientSecret",
      label: "client_secret",
      rules: {
        required: true,
      },
      placeholder: "OAuth Client Secret",
      type: "password",
      dependsOn: { field: "db_params.authMethod", value: "oauth" },
    },
    {
      name: "db_params.url",
      label: "databricks_jdbc_url",
      rules: {
        required: true,
      },
      type: "text",
    },
    {
      name: "db_params.database",
      label: "Database Name",
      rules: {
        required: true,
      },
      type: "text",
    },
  ],
  ksql: [
    {
      name: "db_params.host",
      label: "host",
      rules: {
        required: true,
      },
      placeholder: "example.com",
    },
    {
      name: "db_params.port",
      label: "port",
      rules: {
        required: true,
      },
      placeholder: "8088",
      type: "number",
    },
    {
      name: "db_params.username",
      label: "username",
      rules: {
        required: false,
      },
      placeholder: "user",
    },
    {
      name: "db_params.password",
      label: "password",
      rules: {
        required: false,
      },
      placeholder: "pass",
      type: "password",
    },
  ],
  oracle: [
    {
      name: "db_params.host",
      label: "host",
      rules: {
        required: true,
      },
      placeholder: "example.com",
      type: "text",
    },
    {
      name: "db_params.port",
      label: "port",
      rules: {
        required: true,
      },
      placeholder: "1521",
      type: "number",
    },
    {
      name: "db_params.user",
      label: "user",
      rules: {
        required: true,
      },
      placeholder: "db_username",
      type: "text",
    },
    {
      name: "db_params.password",
      label: "password",
      rules: {
        required: true,
      },
      placeholder: "db_password",
      type: "password",
    },
    {
      name: "db_params.serviceName",
      label: "service_name",
      rules: {
        required: true,
      },
      placeholder: "ORCL",
      type: "text",
    },
  ],
  sqlite: [
    {
      name: "db_params.database",
      label: "database_file_path",
      rules: {
        required: true,
      },
      placeholder: "/path/to/database.db",
      type: "text",
    },
  ],
  pinot: [
    {
      name: "db_params.host",
      label: "host",
      rules: {
        required: true,
      },
      placeholder: "example.com",
      type: "text",
    },
    {
      name: "db_params.port",
      label: "port",
      rules: {
        required: true,
      },
      placeholder: "8099",
      type: "number",
    },
    {
      name: "db_params.schema",
      label: "schema",
      rules: {
        required: false,
      },
      placeholder: "default",
      type: "text",
    },
  ],
  duckdb: [
    {
      name: "db_params.database",
      label: "database_file_path",
      rules: {
        required: true,
      },
      placeholder: "/path/to/database.duckdb or md:database_name",
      type: "text",
    },
  ],
  athena: [
    {
      name: "db_params.awsKey",
      label: "aws_key",
      rules: {
        required: true,
      },
      placeholder: "AKIA***",
      type: "text",
    },
    {
      name: "db_params.awsSecret",
      label: "aws_secret",
      rules: {
        required: true,
      },
      placeholder: "******",
      type: "text",
    },
    {
      name: "db_params.awsRegion",
      label: "aws_region",
      rules: {
        required: true,
      },
      placeholder: "us-west-1",
      type: "text",
    },
    {
      name: "db_params.awsS3OutputLocation",
      label: "awsS3OutputLocation",
      placeholder: "s3://bucket/path",
      type: "text",
    },
  ],
};
