import { PropsWithChildren, useEffect } from "react";

import { useRouter } from "next/router";

import { useLocalStorage } from "@mantine/hooks";

import { client } from "../utils/backend";

export default function AuthenticatedProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [token] = useLocalStorage({ key: "token" });

  useEffect(() => {
    client.GET("/token/validate/").then((result) => {
      const valid = result?.data?.valid;
      if (valid && router.pathname === "/login") {
        router.push("/");
      } else if (!valid && router.pathname !== "/login") {
        router.push("/login");
      }
    });
  }, [token]);

  return children;
}
