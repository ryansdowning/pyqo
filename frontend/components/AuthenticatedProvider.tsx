import { PropsWithChildren, useEffect } from "react";

import { useRouter } from "next/router";
import { useLocalStorage } from "usehooks-ts";

export default function AuthenticatedProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [token] = useLocalStorage("token", "");

  useEffect(() => {
    if (!token && router.pathname !== "/login") {
      router.push("/login");
    } else if (token && router.pathname === "/login") {
      router.push("/");
    }
  }, [token]);

  return <>{children}</>;
}
