import { useState, useCallback } from "react";
import { message } from "antd";

import AuthTokensStore from "@/stores/AuthTokensStore";
import type { PlaygroundState } from "@/types/exploration";
import type { SortBy } from "@/types/sort";

type ExportFormat = "json" | "csv" | "jsonstat" | "arrow";

interface UseFormatExportOptions {
  datasourceId?: string;
  branchId?: string;
  query?: PlaygroundState;
}

const normalizeOrders = (orders: SortBy[]) => {
  return (orders || []).reduce(
    (acc, cur) => ({ ...acc, [cur.id]: cur.desc ? "desc" : "asc" }),
    {}
  );
};

const getFileNameFromDisposition = (header: string | null) => {
  if (!header) return null;

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const quotedMatch = header.match(/filename="([^"]+)"/i);
  if (quotedMatch?.[1]) {
    return quotedMatch[1];
  }

  const plainMatch = header.match(/filename=([^;]+)/i);
  return plainMatch?.[1]?.trim() || null;
};

const getDefaultFileName = (format: ExportFormat) => {
  const ext = format === "csv" ? "csv" : format === "arrow" ? "arrow" : "json";
  return `query-result.${ext}`;
};

const buildLoadRequestBody = (format: ExportFormat, query: PlaygroundState) => {
  const body: Record<string, unknown> = {
    query: {
      ...query,
      order: normalizeOrders(query?.order || []),
    },
  };

  if (format !== "json") {
    body.format = format;
  }

  return body;
};

async function downloadResponse(response: Response, format: ExportFormat) {
  const blob = await response.blob();
  const fileName =
    getFileNameFromDisposition(response.headers.get("content-disposition")) ||
    getDefaultFileName(format);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function useFormatExport({
  datasourceId,
  branchId,
  query,
}: UseFormatExportOptions) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(
    async (format: ExportFormat) => {
      if (!query || !datasourceId) return;

      setIsExporting(true);
      setError(null);

      try {
        const token = AuthTokensStore.getState().accessToken;
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "x-hasura-datasource-id": datasourceId,
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (branchId) headers["x-hasura-branch-id"] = branchId;

        const body = buildLoadRequestBody(format, query);

        while (true) {
          const response = await fetch("/api/v1/load", {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          });
          const contentType = response.headers.get("content-type") || "";
          const isJsonResponse = contentType.includes("application/json");

          if (!response.ok) {
            const errorBody = isJsonResponse
              ? await response.json().catch(() => null)
              : null;
            throw new Error(
              errorBody?.message ||
                errorBody?.error ||
                `Export failed (${response.status})`
            );
          }

          if (isJsonResponse) {
            const responseBody = await response.json().catch(() => null);
            if (responseBody?.error === "Continue wait") {
              continue;
            }

            if (format === "json" || format === "jsonstat") {
              const jsonBlob = new Blob(
                [JSON.stringify(responseBody, null, 2)],
                { type: "application/json" }
              );
              await downloadResponse(
                new Response(jsonBlob, {
                  headers: response.headers,
                }),
                format
              );
              break;
            }

            throw new Error(
              responseBody?.message || responseBody?.error || "Export failed"
            );
          }

          await downloadResponse(response, format);
          break;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Export failed";
        setError(msg);
        message.error(msg);
      } finally {
        setIsExporting(false);
      }
    },
    [datasourceId, branchId, query]
  );

  return { exportData, isExporting, error };
}
