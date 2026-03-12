import { useState, useCallback } from "react";
import { useMutation, gql } from "urql";
import { message } from "antd";

import AuthTokensStore from "@/stores/AuthTokensStore";

const GEN_SQL_EXPORT_MUTATION = gql`
  mutation GenSQLExport($exploration_id: uuid!, $limit: Int) {
    gen_sql(exploration_id: $exploration_id, limit: $limit) {
      result
      column_metadata
      sql_signature
    }
  }
`;

type ExportFormat = "json" | "csv" | "jsonstat";

interface ColumnMetadata {
  alias: string;
  member: string;
  role: "measure" | "dimension" | "timeDimension";
}

interface UseFormatExportOptions {
  explorationId?: string;
  datasourceId?: string;
  branchId?: string;
}

export default function useFormatExport({
  explorationId,
  datasourceId,
  branchId,
}: UseFormatExportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, genSqlMutation] = useMutation(GEN_SQL_EXPORT_MUTATION);

  const exportData = useCallback(
    async (format: ExportFormat) => {
      if (!explorationId || !datasourceId) return;

      setIsExporting(true);
      setError(null);

      try {
        // Call GenSQL with limit: 0 for CSV/JSON-Stat (unlimited), no limit override for JSON
        const limit = format !== "json" ? 0 : undefined;
        const genSqlResult = await genSqlMutation({
          exploration_id: explorationId,
          limit,
        });

        if (genSqlResult.error) {
          throw new Error(genSqlResult.error.message);
        }

        const { result, column_metadata, sql_signature } =
          genSqlResult.data?.gen_sql || {};
        const sql = result?.sql;

        if (!sql) {
          throw new Error("Failed to generate SQL");
        }

        // Build run-sql request body — include sql_signature so run-sql
        // can verify this SQL was generated internally by gen_sql
        const body: Record<string, unknown> = {
          query: sql,
          format,
          sql_signature,
        };

        // For JSON-Stat, pass measure and timeDimension aliases as hints
        if (format === "jsonstat" && column_metadata) {
          const metadata = column_metadata as ColumnMetadata[];
          body.measures = metadata
            .filter((c) => c.role === "measure")
            .map((c) => c.alias);
          body.timeDimensions = metadata
            .filter((c) => c.role === "timeDimension")
            .map((c) => c.alias);
        }

        // Get JWT token from Zustand store
        const token = AuthTokensStore.getState().accessToken;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "x-hasura-datasource-id": datasourceId,
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (branchId) headers["x-hasura-branch-id"] = branchId;

        // Call run-sql directly via the /api/v1/* proxy
        const response = await fetch("/api/v1/run-sql", {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(
            errorBody?.message ||
              errorBody?.error ||
              `Export failed (${response.status})`
          );
        }

        // Download the response as a file
        const blob = await response.blob();
        const ext = format === "csv" ? "csv" : "json";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `query-result.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Export failed";
        setError(msg);
        message.error(msg);
      } finally {
        setIsExporting(false);
      }
    },
    [explorationId, datasourceId, branchId, genSqlMutation]
  );

  return { exportData, isExporting, error };
}
