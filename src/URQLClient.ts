import { authExchange } from "@urql/exchange-auth";
import { retryExchange } from "@urql/exchange-retry";
import { createClient as createWsClient } from "graphql-ws";
import { createClient, fetchExchange, subscriptionExchange } from "urql";

import { fetchToken } from "@/hooks/useAuth";
import AuthTokensStore from "@/stores/AuthTokensStore";
import { SIGNIN } from "@/utils/constants/paths";

import type { SubscribePayload } from "graphql-ws";
import type { CombinedError, Operation } from "urql";

declare global {
  interface Window {
    HASURA_GRAPHQL_ENDPOINT?: string;
    HASURA_WS_ENDPOINT?: string;
  }
}

const HASURA_GRAPHQL_ENDPOINT =
  window.HASURA_GRAPHQL_ENDPOINT !== undefined
    ? window.HASURA_GRAPHQL_ENDPOINT
    : import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT;

const HASURA_WS_ENDPOINT =
  window.HASURA_WS_ENDPOINT !== undefined
    ? window.HASURA_WS_ENDPOINT
    : import.meta.env.VITE_HASURA_WS_ENDPOINT;

const getWsUrl = (path: string) => {
  // if url contains ws:// already
  if (path.includes("ws://") || path.includes("wss://")) {
    return path;
  }

  // if only the path
  const protocolPrefix = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocolPrefix}//${window.location.host}${path}`;
};

type Headers = {
  "content-type": string;
  "x-hasura-role"?: string;
  Authorization: string;
};

const AUTH_ERROR_CODES = new Set([
  "FORBIDDEN",
  "INVALID_JWT",
  "INVALID_HEADERS",
  "JWT_MISSING_ROLE_CLAIMS",
  "UNAUTHENTICATED",
  "ACCESS-DENIED",
]);

function isAuthError(error: CombinedError) {
  const responseStatus = error.response?.status;
  if (responseStatus === 401 || responseStatus === 403) {
    return true;
  }

  return error?.graphQLErrors?.some((e) => {
    const code = String(e.extensions?.code || "").toUpperCase();
    const message = String(e.message || "").toLowerCase();

    return (
      AUTH_ERROR_CODES.has(code) ||
      message.includes("jwt") ||
      message.includes("not authenticated") ||
      message.includes("unauthorized")
    );
  });
}

export default () => {
  const { accessToken, JWTpayload, setAuthData, cleanTokens } =
    AuthTokensStore();

  const client = useMemo(() => {
    const wsClient = createWsClient({
      url: getWsUrl(HASURA_WS_ENDPOINT),
      connectionParams: () => ({
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
      }),
    });

    const exchanges = [
      authExchange(async (utils) => ({
        addAuthToOperation: (operation: Operation) => {
          if (!accessToken) return operation;

          const claims = { ...JWTpayload };
          const headers = {
            ...claims,
          } as Headers;

          // we could pass role inside operation
          const role = operation?.context?.role;
          if (role) {
            headers["x-hasura-role"] = role;
          } else {
            headers["x-hasura-role"] = "user";
          }

          if (headers["x-hasura-role"] !== "anonymous") {
            headers.Authorization = `Bearer ${accessToken}`;
          }

          return utils.appendHeaders(operation, headers);
        },
        willAuthError: () => {
          // No payload yet — token fetch is in progress, don't trigger refreshAuth
          if (!JWTpayload?.exp) return false;

          const expirationMs = JWTpayload.exp * 1000;
          return expirationMs - Date.now() <= 60 * 1000;
        },
        didAuthError: (error: CombinedError) => {
          return isAuthError(error);
        },
        refreshAuth: async () => {
          const result = await fetchToken();
          if (!result) {
            cleanTokens();
            window.location.href = SIGNIN;
            return;
          }

          const authAccepted = setAuthData({
            accessToken: result.accessToken,
          });
          if (!authAccepted) {
            cleanTokens();
            window.location.href = SIGNIN;
          }
        },
      })),
      retryExchange({
        initialDelayMs: 500,
        maxDelayMs: 1500,
        randomDelay: true,
        maxNumberAttempts: Infinity,
      }),
      fetchExchange,
      subscriptionExchange({
        forwardSubscription: (op) => ({
          subscribe: (sink) => ({
            unsubscribe: wsClient.subscribe(op as SubscribePayload, sink),
          }),
        }),
      }),
    ];

    return createClient({
      url: HASURA_GRAPHQL_ENDPOINT,
      exchanges,
    });
  }, [JWTpayload, accessToken, cleanTokens, setAuthData]);

  return client;
};
