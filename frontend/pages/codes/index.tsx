import { useState } from "react";

import ItemsTable from "../../components/ItemsTable";
import { PyqoLayout } from "../../components/PyqoLayout";
import { api, PAGE_SIZE } from "../../utils/backend";

export default function CodesPage() {
  const [page, setPage] = useState(1);
  const {
    data: itemsPage,
    error,
    isLoading,
  } = api.useQuery("get", "/app/items/", {
    query: { page },
  });
  const totalItems = itemsPage?.count ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <PyqoLayout>
      <ItemsTable items={itemsPage?.results ?? []} />
    </PyqoLayout>
  );
}
