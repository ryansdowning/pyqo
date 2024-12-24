import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { useLocalStorage } from "@mantine/hooks";

import { client } from "./backend";

export const useIsAuthenticated = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(
    router.pathname !== "/login"
  );
  const [token] = useLocalStorage({ key: "token" });

  useEffect(() => {
    client.GET("/token/validate/").then((result) => {
      const valid = result?.data?.valid;
      setIsAuthenticated(Boolean(valid));
    });
  }, [token]);

  return isAuthenticated;
};
