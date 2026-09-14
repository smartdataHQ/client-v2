import { useEffect, useMemo } from "react";
import { gql, useQuery } from "urql";

import { useCurrentVersionQuery } from "@/graphql/generated";
import type { VersionByBranchIdQueryVariables } from "@/graphql/generated";
import type { Version } from "@/types/version";

type Pagination = Omit<VersionByBranchIdQueryVariables, "where" | "order_by">;

const VERSION_BY_BRANCH_ID = gql`
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
        account {
          email
        }
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
        user {
          display_name
        }
        datasource {
          name
        }
      }
    }
    versions_aggregate(where: { branch_id: { _eq: $branch_id } }) {
      aggregate {
        count
      }
    }
  }
`;

const getListVariables = (
  branchId?: string,
  pagination?: Partial<Pagination>
): VersionByBranchIdQueryVariables => {
  let res = {
    branch_id: branchId,
  };

  if (pagination) {
    res = {
      ...res,
      ...pagination,
    };
  }

  return res;
};

interface Props {
  branchId?: string;
  pagination?: Partial<Pagination>;
}

export default ({ branchId, pagination }: Props) => {
  const [allData, execQueryAll] = useQuery({
    query: VERSION_BY_BRANCH_ID,
    variables: getListVariables(branchId, pagination),
    pause: true,
    requestPolicy: "cache-and-network",
  });

  const [currentData] = useCurrentVersionQuery({
    variables: { branch_id: branchId as string },
    pause: !branchId,
    requestPolicy: "cache-and-network",
  });

  const paginationLimit = pagination?.limit;
  const paginationOffset = pagination?.offset;

  useEffect(() => {
    if (branchId) {
      execQueryAll();
    }
  }, [branchId, paginationLimit, paginationOffset, execQueryAll]);

  const versions = useMemo(
    () => allData.data?.versions || ([] as Version[]),
    [allData.data]
  );
  const totalCount = useMemo(
    () => allData.data?.versions_aggregate.aggregate?.count || 0,
    [allData.data?.versions_aggregate.aggregate?.count]
  );
  const currentVersion = currentData.data?.versions?.[0] ?? null;

  return {
    versions,
    currentVersion,
    totalCount,
    queries: {
      allData,
      execQueryAll,
    },
  };
};
