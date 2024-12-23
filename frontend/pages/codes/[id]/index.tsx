import { useRouter } from "next/router";

import { PyqoLayout } from "../../../components/PyqoLayout";
import { api } from "../../../utils/backend";

export default function ManageItemPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: itemData } = api.useQuery("get", "/app/items/{id}/", {
    params: { path: { id: id as string } },
    enabled: Boolean(id),
  });

  return (
    <PyqoLayout>
      <div>Managing item {id}</div>
    </PyqoLayout>
  );
}
