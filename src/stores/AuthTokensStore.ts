import { create } from "zustand";
import jwtDecode from "jwt-decode";

import type { JwtPayload } from "jwt-decode";

interface HasuraJWTPayload extends JwtPayload {
  "x-hasura-role": string;
  "x-hasura-user-id": string;
}

interface Payload extends JwtPayload {
  hasura?: HasuraJWTPayload | null;
}

type AuthData = {
  accessToken: string;
  workosAccessToken?: string | null;
};

interface TokensState {
  accessToken: string | null;
  workosAccessToken: string | null;
  JWTpayload: HasuraJWTPayload | null;
  setAuthData: (authData: AuthData) => boolean;
  cleanTokens: () => void;
}

const defaultTokens = {
  accessToken: null,
  workosAccessToken: null,
  JWTpayload: null,
};

const AuthTokensStore = create<TokensState>()((set) => ({
  ...defaultTokens,
  setAuthData: (authData: AuthData) => {
    try {
      const { accessToken, workosAccessToken } = authData;
      if (!accessToken) {
        throw new Error("Missing access token");
      }

      const payload = jwtDecode<Payload>(accessToken);

      const JWTpayload = {
        ...payload,
        ...payload.hasura,
      };
      delete JWTpayload.hasura;

      set({
        accessToken,
        workosAccessToken: workosAccessToken || null,
        JWTpayload,
      } as TokensState);

      return true;
    } catch {
      set({ ...defaultTokens });
      return false;
    }
  },
  cleanTokens: () => set({ ...defaultTokens }),
}));

export default AuthTokensStore;
