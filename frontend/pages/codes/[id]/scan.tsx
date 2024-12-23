import { useEffect } from "react";

import { useRouter } from "next/router";

import { Loader } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import { BASE_URL } from "../../../utils/backend";

export default function ScanItemPage() {
  const router = useRouter();
  const [token] = useLocalStorage({ key: "token" });
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/app/items/${id}/scan/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
    }).then(() => router.push({ pathname: "/codes/[id]/view", query: { id } }));
  }, [id]);

  return <Loader />;
}
