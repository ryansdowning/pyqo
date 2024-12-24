import { useRouter } from "next/router";

import { Loader } from "@mantine/core";

import ItemPage from "../../../components/ItemPage";
import { api } from "../../../utils/backend";
import { useIsAuthenticated } from "../../../utils/hooks";

export default function ViewItemPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { id } = router.query;
  const { data: item } = api.useQuery(
    "get",
    "/app/items/{id}/",
    {
      // @ts-expect-error - all_properties is not in the schema.
      params: { path: { id: id as string }, query: { all_properties: true } },
    },
    { enabled: Boolean(id) }
  );
  const { data: scansPage } = api.useQuery(
    "get",
    "/app/scans/",
    {
      // @ts-expect-error - drf-spectacular not generating filter params.
      params: { query: { item: id as string } },
    },
    { enabled: isAuthenticated }
  );
  const scans = isAuthenticated ? scansPage?.results ?? [] : [];

  return item ? <ItemPage item={item} scans={scans} /> : <Loader />;
}
