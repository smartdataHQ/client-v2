import { useRef, useEffect } from "react";

import { CubeRegistry } from "@/utils/cubejs-language/registry";

export default function useCubeRegistry(
  currentMeta: any[],
  execQueryMeta: () => void,
  datasourceId?: string | null,
  branchId?: string | null,
  tablesSchema?: Record<string, any>
) {
  const registryRef = useRef(new CubeRegistry());

  useEffect(() => {
    if (currentMeta && currentMeta.length > 0) {
      registryRef.current.populate(currentMeta);
    }
  }, [currentMeta]);

  useEffect(() => {
    if (tablesSchema && Object.keys(tablesSchema).length > 0) {
      registryRef.current.populateTableColumns(tablesSchema);
    }
  }, [tablesSchema]);

  const refreshRegistry = () => {
    if (datasourceId && branchId) {
      registryRef.current.startRefresh();
      execQueryMeta();
    }
  };

  return {
    cubeRegistry: registryRef.current,
    refreshRegistry,
  };
}
