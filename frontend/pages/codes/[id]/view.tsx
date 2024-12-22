import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { components } from "../../../schema";
import { BASE_URL, client } from "../../../utils/backend";

export default function ViewItemPage() {
  const router = useRouter();
  const { id } = router.query;
  // const foo = api.useQuery("get", "app/items/{id}/view", { query: { id } });
  const [fetching, setFetching] = useState(true);
  const [item, setItem] = useState<components["schemas"]["Item"] | null>(null);

  useEffect(() => {
    navigator.sendBeacon(`${BASE_URL}/app/items/${id}/view`);

    client
      .GET(`/app/items/`, { params: { query: { page: 1 } } })
      .then((result) => {});
  }, []);

  return <div>View item {id}</div>;
}
