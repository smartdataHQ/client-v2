import AuthTokensStore from "@/stores/AuthTokensStore";

type TokenResponse = {
  accessToken: string;
  workosAccessToken?: string | null;
  userId: string;
  teamId?: string | null;
  role: string;
};

type ErrorResponse = {
  error: boolean;
  code: string;
  message: string;
};

export const fetchToken = async (): Promise<TokenResponse | null> => {
  const response = await fetch("/auth/token", {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
};

export default () => {
  const { setAuthData, cleanTokens } = AuthTokensStore();

  const signIn = (provider?: string, email?: string) => {
    const params = new URLSearchParams();
    if (provider) params.set("provider", provider);
    if (email) params.set("email", email);

    const returnTo = window.location.pathname;
    if (returnTo && returnTo !== "/signin" && returnTo !== "/signup") {
      params.set("return_to", returnTo);
    }

    window.location.href = `/auth/signin${
      params.toString() ? "?" + params.toString() : ""
    }`;
  };

  const signOut = async () => {
    try {
      await fetch("/auth/signout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Best effort
    }
    cleanTokens();
    window.location.href = "/signin";
  };

  const refreshAuth = async (): Promise<boolean> => {
    const result = await fetchToken();
    if (!result) return false;

    return setAuthData({
      accessToken: result.accessToken,
      workosAccessToken: result.workosAccessToken,
    });
  };

  return {
    signIn,
    signOut,
    fetchToken: refreshAuth,
  };
};
