import { PropsWithChildren, useEffect } from "react";

import { useRouter } from "next/router";

import { useLocalStorage } from "@mantine/hooks";

import { useIsAuthenticated } from "../utils/hooks";

export default function AuthenticatedProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const [token] = useLocalStorage({ key: "token" });

  useEffect(() => {
    if (isAuthenticated && router.pathname === "/login") {
      router.push("/");
    } else if (
      !isAuthenticated &&
      router.pathname !== "/login" &&
      router.pathname !== "/codes/[id]/view"
    ) {
      router.push("/login");
    }
  }, [token, isAuthenticated]);

  return children;
}
