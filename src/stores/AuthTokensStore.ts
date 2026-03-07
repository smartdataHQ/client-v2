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
};

interface TokensState {
  accessToken: string | null;
  JWTpayload: HasuraJWTPayload | null;
  setAuthData: (authData: AuthData) => void;
  cleanTokens: () => void;
}

const defaultTokens = {
  accessToken: null,
  JWTpayload: null,
};

const AuthTokensStore = create<TokensState>()((set) => ({
  ...defaultTokens,
  setAuthData: (authData: AuthData) => {
    const { accessToken } = authData;
    const payload = jwtDecode<Payload>(accessToken);

    const JWTpayload = {
      ...payload,
      ...payload.hasura,
    };
    delete JWTpayload.hasura;

    set({
      accessToken,
      JWTpayload,
    } as TokensState);
  },
  cleanTokens: () => set({ ...defaultTokens }),
}));

export default AuthTokensStore;
