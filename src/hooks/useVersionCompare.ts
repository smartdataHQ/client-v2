import { gql, useQuery } from "urql";

export interface VersionOption {
  id: string;
  checksum: string;
  created_at: string;
  user?: {
    display_name?: string | null;
    account?: { email?: string | null } | null;
  } | null;
}

export interface VersionWithCode extends VersionOption {
  dataschemas: Array<{ name: string; code: string }>;
}

const VERSION_OPTIONS_QUERY = gql`
  query VersionOptionsByBranchId($branch_id: uuid!) {
    versions(
      order_by: { created_at: desc }
      where: { branch_id: { _eq: $branch_id } }
      limit: 100
    ) {
      id
      checksum
      created_at
      user {
        display_name
        account {
          email
        }
      }
    }
  }
`;

const VERSIONS_WITH_CODE_QUERY = gql`
  query VersionsWithCodeByIds($ids: [uuid!]!) {
    versions(where: { id: { _in: $ids } }) {
      id
      checksum
      created_at
      user {
        display_name
        account {
          email
        }
      }
      dataschemas(order_by: { name: asc }) {
        name
        code
      }
    }
  }
`;

export const useVersionOptions = (branchId?: string) => {
  const [result] = useQuery<{ versions: VersionOption[] }>({
    query: VERSION_OPTIONS_QUERY,
    variables: { branch_id: branchId },
    pause: !branchId,
  });

  return {
    options: result.data?.versions ?? [],
    fetching: result.fetching,
  };
};

export const useVersionsWithCode = (ids: string[]) => {
  const [result] = useQuery<{ versions: VersionWithCode[] }>({
    query: VERSIONS_WITH_CODE_QUERY,
    variables: { ids },
    pause: ids.length === 0,
  });

  return {
    versions: result.data?.versions ?? [],
    fetching: result.fetching,
  };
};
