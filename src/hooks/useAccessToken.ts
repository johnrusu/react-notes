import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";

export const useAccessToken = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getToken = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  }, [getAccessTokenSilently]);

  return { getToken };
};
