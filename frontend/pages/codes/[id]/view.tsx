import { useEffect } from "react";

import { useRouter } from "next/router";

import { Loader } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import { api, BASE_URL } from "../../../utils/backend";

export default function ViewItemPage() {
  const router = useRouter();
  const [token] = useLocalStorage({ key: "token" });
  const { id } = router.query;
  const { data: item, isLoading } = api.useQuery("get", "/app/items/{id}/", {
    params: { path: { id: id as string } },
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (!id) return;
    fetch(`${BASE_URL}/app/items/${id}/view/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    // navigator.sendBeacon(`${BASE_URL}/app/items/${id}/view/`);
  }, [id]);

  return isLoading ? <Loader /> : <div>View item {id}</div>;
}
