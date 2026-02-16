import type { FetchStatus } from "@/types/fetchStatus";
import { useState } from "react";
import { useAuth } from "react-oidc-context";

export const useAuthFetch = () => {
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const auth = useAuth();

  const authFetch = async (
    url: string,
    options?: RequestInit,
  ): Promise<Response | undefined> => {
    setFetchStatus("loading");
    const token = auth.user?.id_token;
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorBody = await res.json();
      setErrorMessage(errorBody.error?.message || "処理に失敗しました");
      setFetchStatus("error");
      return undefined;
    }
    setFetchStatus("success");
    return res;
  };

  return { authFetch, fetchStatus, setFetchStatus, errorMessage };
};
